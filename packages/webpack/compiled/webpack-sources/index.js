(() => {
  var e = {
    209: (e, t, s) => {
      'use strict';
      const n = s(799);
      const r = s(692);
      const i = s(951);
      const u = s(757);
      const mapToBufferedMap = (e) => {
        if (typeof e !== 'object' || !e) return e;
        const t = Object.assign({}, e);
        if (e.mappings) {
          t.mappings = Buffer.from(e.mappings, 'utf-8');
        }
        if (e.sourcesContent) {
          t.sourcesContent = e.sourcesContent.map(
            (e) => e && Buffer.from(e, 'utf-8'),
          );
        }
        return t;
      };
      const bufferedMapToMap = (e) => {
        if (typeof e !== 'object' || !e) return e;
        const t = Object.assign({}, e);
        if (e.mappings) {
          t.mappings = e.mappings.toString('utf-8');
        }
        if (e.sourcesContent) {
          t.sourcesContent = e.sourcesContent.map(
            (e) => e && e.toString('utf-8'),
          );
        }
        return t;
      };
      class CachedSource extends n {
        constructor(e, t) {
          super();
          this._source = e;
          this._cachedSourceType = t ? t.source : undefined;
          this._cachedSource = undefined;
          this._cachedBuffer = t ? t.buffer : undefined;
          this._cachedSize = t ? t.size : undefined;
          this._cachedMaps = t ? t.maps : new Map();
          this._cachedHashUpdate = t ? t.hash : undefined;
        }
        getCachedData() {
          const e = new Map();
          for (const t of this._cachedMaps) {
            let s = t[1];
            if (s.bufferedMap === undefined) {
              s.bufferedMap = mapToBufferedMap(this._getMapFromCacheEntry(s));
            }
            e.set(t[0], { map: undefined, bufferedMap: s.bufferedMap });
          }
          if (this._cachedSource) {
            this.buffer();
          }
          return {
            buffer: this._cachedBuffer,
            source:
              this._cachedSourceType !== undefined
                ? this._cachedSourceType
                : typeof this._cachedSource === 'string'
                ? true
                : Buffer.isBuffer(this._cachedSource)
                ? false
                : undefined,
            size: this._cachedSize,
            maps: e,
            hash: this._cachedHashUpdate,
          };
        }
        originalLazy() {
          return this._source;
        }
        original() {
          if (typeof this._source === 'function') this._source = this._source();
          return this._source;
        }
        source() {
          const e = this._getCachedSource();
          if (e !== undefined) return e;
          return (this._cachedSource = this.original().source());
        }
        _getMapFromCacheEntry(e) {
          if (e.map !== undefined) {
            return e.map;
          } else if (e.bufferedMap !== undefined) {
            return (e.map = bufferedMapToMap(e.bufferedMap));
          }
        }
        _getCachedSource() {
          if (this._cachedSource !== undefined) return this._cachedSource;
          if (this._cachedBuffer && this._cachedSourceType !== undefined) {
            return (this._cachedSource = this._cachedSourceType
              ? this._cachedBuffer.toString('utf-8')
              : this._cachedBuffer);
          }
        }
        buffer() {
          if (this._cachedBuffer !== undefined) return this._cachedBuffer;
          if (this._cachedSource !== undefined) {
            if (Buffer.isBuffer(this._cachedSource)) {
              return (this._cachedBuffer = this._cachedSource);
            }
            return (this._cachedBuffer = Buffer.from(
              this._cachedSource,
              'utf-8',
            ));
          }
          if (typeof this.original().buffer === 'function') {
            return (this._cachedBuffer = this.original().buffer());
          }
          const e = this.source();
          if (Buffer.isBuffer(e)) {
            return (this._cachedBuffer = e);
          }
          return (this._cachedBuffer = Buffer.from(e, 'utf-8'));
        }
        size() {
          if (this._cachedSize !== undefined) return this._cachedSize;
          if (this._cachedBuffer !== undefined) {
            return (this._cachedSize = this._cachedBuffer.length);
          }
          const e = this._getCachedSource();
          if (e !== undefined) {
            return (this._cachedSize = Buffer.byteLength(e));
          }
          return (this._cachedSize = this.original().size());
        }
        sourceAndMap(e) {
          const t = e ? JSON.stringify(e) : '{}';
          const s = this._cachedMaps.get(t);
          if (s !== undefined) {
            const e = this._getMapFromCacheEntry(s);
            return { source: this.source(), map: e };
          }
          let n = this._getCachedSource();
          let r;
          if (n !== undefined) {
            r = this.original().map(e);
          } else {
            const t = this.original().sourceAndMap(e);
            n = t.source;
            r = t.map;
            this._cachedSource = n;
          }
          this._cachedMaps.set(t, { map: r, bufferedMap: undefined });
          return { source: n, map: r };
        }
        streamChunks(e, t, s, n) {
          const o = e ? JSON.stringify(e) : '{}';
          if (
            this._cachedMaps.has(o) &&
            (this._cachedBuffer !== undefined ||
              this._cachedSource !== undefined)
          ) {
            const { source: u, map: o } = this.sourceAndMap(e);
            if (o) {
              return r(u, o, t, s, n, !!(e && e.finalSource), true);
            } else {
              return i(u, t, s, n, !!(e && e.finalSource));
            }
          }
          const {
            result: f,
            source: c,
            map: a,
          } = u(this.original(), e, t, s, n);
          this._cachedSource = c;
          this._cachedMaps.set(o, { map: a, bufferedMap: undefined });
          return f;
        }
        map(e) {
          const t = e ? JSON.stringify(e) : '{}';
          const s = this._cachedMaps.get(t);
          if (s !== undefined) {
            return this._getMapFromCacheEntry(s);
          }
          const n = this.original().map(e);
          this._cachedMaps.set(t, { map: n, bufferedMap: undefined });
          return n;
        }
        updateHash(e) {
          if (this._cachedHashUpdate !== undefined) {
            for (const t of this._cachedHashUpdate) e.update(t);
            return;
          }
          const t = [];
          let s = undefined;
          const n = {
            update: (e) => {
              if (typeof e === 'string' && e.length < 10240) {
                if (s === undefined) {
                  s = e;
                } else {
                  s += e;
                  if (s.length > 102400) {
                    t.push(Buffer.from(s));
                    s = undefined;
                  }
                }
              } else {
                if (s !== undefined) {
                  t.push(Buffer.from(s));
                  s = undefined;
                }
                t.push(e);
              }
            },
          };
          this.original().updateHash(n);
          if (s !== undefined) {
            t.push(Buffer.from(s));
          }
          for (const s of t) e.update(s);
          this._cachedHashUpdate = t;
        }
      }
      e.exports = CachedSource;
    },
    147: (e, t, s) => {
      'use strict';
      const n = s(799);
      class CompatSource extends n {
        static from(e) {
          return e instanceof n ? e : new CompatSource(e);
        }
        constructor(e) {
          super();
          this._sourceLike = e;
        }
        source() {
          return this._sourceLike.source();
        }
        buffer() {
          if (typeof this._sourceLike.buffer === 'function') {
            return this._sourceLike.buffer();
          }
          return super.buffer();
        }
        size() {
          if (typeof this._sourceLike.size === 'function') {
            return this._sourceLike.size();
          }
          return super.size();
        }
        map(e) {
          if (typeof this._sourceLike.map === 'function') {
            return this._sourceLike.map(e);
          }
          return super.map(e);
        }
        sourceAndMap(e) {
          if (typeof this._sourceLike.sourceAndMap === 'function') {
            return this._sourceLike.sourceAndMap(e);
          }
          return super.sourceAndMap(e);
        }
        updateHash(e) {
          if (typeof this._sourceLike.updateHash === 'function') {
            return this._sourceLike.updateHash(e);
          }
          if (typeof this._sourceLike.map === 'function') {
            throw new Error(
              "A Source-like object with a 'map' method must also provide an 'updateHash' method",
            );
          }
          e.update(this.buffer());
        }
      }
      e.exports = CompatSource;
    },
    172: (e, t, s) => {
      'use strict';
      const n = s(799);
      const r = s(851);
      const i = s(641);
      const { getMap: u, getSourceAndMap: o } = s(771);
      const f = new WeakSet();
      class ConcatSource extends n {
        constructor() {
          super();
          this._children = [];
          for (let e = 0; e < arguments.length; e++) {
            const t = arguments[e];
            if (t instanceof ConcatSource) {
              for (const e of t._children) {
                this._children.push(e);
              }
            } else {
              this._children.push(t);
            }
          }
          this._isOptimized = arguments.length === 0;
        }
        getChildren() {
          if (!this._isOptimized) this._optimize();
          return this._children;
        }
        add(e) {
          if (e instanceof ConcatSource) {
            for (const t of e._children) {
              this._children.push(t);
            }
          } else {
            this._children.push(e);
          }
          this._isOptimized = false;
        }
        addAllSkipOptimizing(e) {
          for (const t of e) {
            this._children.push(t);
          }
        }
        buffer() {
          if (!this._isOptimized) this._optimize();
          const e = [];
          for (const t of this._children) {
            if (typeof t.buffer === 'function') {
              e.push(t.buffer());
            } else {
              const s = t.source();
              if (Buffer.isBuffer(s)) {
                e.push(s);
              } else {
                e.push(Buffer.from(s, 'utf-8'));
              }
            }
          }
          return Buffer.concat(e);
        }
        source() {
          if (!this._isOptimized) this._optimize();
          let e = '';
          for (const t of this._children) {
            e += t.source();
          }
          return e;
        }
        size() {
          if (!this._isOptimized) this._optimize();
          let e = 0;
          for (const t of this._children) {
            e += t.size();
          }
          return e;
        }
        map(e) {
          return u(this, e);
        }
        sourceAndMap(e) {
          return o(this, e);
        }
        streamChunks(e, t, s, n) {
          if (!this._isOptimized) this._optimize();
          if (this._children.length === 1)
            return this._children[0].streamChunks(e, t, s, n);
          let r = 0;
          let u = 0;
          let o = new Map();
          let f = new Map();
          const c = !!(e && e.finalSource);
          let a = '';
          let h = false;
          for (const l of this._children) {
            const d = [];
            const p = [];
            let _ = 0;
            const {
              generatedLine: g,
              generatedColumn: S,
              source: m,
            } = i(
              l,
              e,
              (e, s, n, i, o, f, l) => {
                const g = s + r;
                const S = s === 1 ? n + u : n;
                if (h) {
                  if (s !== 1 || n !== 0) {
                    t(undefined, r + 1, u, -1, -1, -1, -1);
                  }
                  h = false;
                }
                const m = i < 0 || i >= d.length ? -1 : d[i];
                const A = l < 0 || l >= p.length ? -1 : p[l];
                _ = m < 0 ? 0 : s;
                if (c) {
                  if (e !== undefined) a += e;
                  if (m >= 0) {
                    t(undefined, g, S, m, o, f, A);
                  }
                } else {
                  if (m < 0) {
                    t(e, g, S, -1, -1, -1, -1);
                  } else {
                    t(e, g, S, m, o, f, A);
                  }
                }
              },
              (e, t, n) => {
                let r = o.get(t);
                if (r === undefined) {
                  o.set(t, (r = o.size));
                  s(r, t, n);
                }
                d[e] = r;
              },
              (e, t) => {
                let s = f.get(t);
                if (s === undefined) {
                  f.set(t, (s = f.size));
                  n(s, t);
                }
                p[e] = s;
              },
            );
            if (m !== undefined) a += m;
            if (h) {
              if (g !== 1 || S !== 0) {
                t(undefined, r + 1, u, -1, -1, -1, -1);
                h = false;
              }
            }
            if (g > 1) {
              u = S;
            } else {
              u += S;
            }
            h = h || (c && _ === g);
            r += g - 1;
          }
          return {
            generatedLine: r + 1,
            generatedColumn: u,
            source: c ? a : undefined,
          };
        }
        updateHash(e) {
          if (!this._isOptimized) this._optimize();
          e.update('ConcatSource');
          for (const t of this._children) {
            t.updateHash(e);
          }
        }
        _optimize() {
          const e = [];
          let t = undefined;
          let s = undefined;
          const addStringToRawSources = (e) => {
            if (s === undefined) {
              s = e;
            } else if (Array.isArray(s)) {
              s.push(e);
            } else {
              s = [typeof s === 'string' ? s : s.source(), e];
            }
          };
          const addSourceToRawSources = (e) => {
            if (s === undefined) {
              s = e;
            } else if (Array.isArray(s)) {
              s.push(e.source());
            } else {
              s = [typeof s === 'string' ? s : s.source(), e.source()];
            }
          };
          const mergeRawSources = () => {
            if (Array.isArray(s)) {
              const t = new r(s.join(''));
              f.add(t);
              e.push(t);
            } else if (typeof s === 'string') {
              const t = new r(s);
              f.add(t);
              e.push(t);
            } else {
              e.push(s);
            }
          };
          for (const n of this._children) {
            if (typeof n === 'string') {
              if (t === undefined) {
                t = n;
              } else {
                t += n;
              }
            } else {
              if (t !== undefined) {
                addStringToRawSources(t);
                t = undefined;
              }
              if (f.has(n)) {
                addSourceToRawSources(n);
              } else {
                if (s !== undefined) {
                  mergeRawSources();
                  s = undefined;
                }
                e.push(n);
              }
            }
          }
          if (t !== undefined) {
            addStringToRawSources(t);
          }
          if (s !== undefined) {
            mergeRawSources();
          }
          this._children = e;
          this._isOptimized = true;
        }
      }
      e.exports = ConcatSource;
    },
    297: (e, t, s) => {
      'use strict';
      const { getMap: n, getSourceAndMap: r } = s(771);
      const i = s(901);
      const u = s(151);
      const o = s(799);
      const f = s(820);
      class OriginalSource extends o {
        constructor(e, t) {
          super();
          const s = Buffer.isBuffer(e);
          this._value = s ? undefined : e;
          this._valueAsBuffer = s ? e : undefined;
          this._name = t;
        }
        getName() {
          return this._name;
        }
        source() {
          if (this._value === undefined) {
            this._value = this._valueAsBuffer.toString('utf-8');
          }
          return this._value;
        }
        buffer() {
          if (this._valueAsBuffer === undefined) {
            this._valueAsBuffer = Buffer.from(this._value, 'utf-8');
          }
          return this._valueAsBuffer;
        }
        map(e) {
          return n(this, e);
        }
        sourceAndMap(e) {
          return r(this, e);
        }
        streamChunks(e, t, s, n) {
          if (this._value === undefined) {
            this._value = this._valueAsBuffer.toString('utf-8');
          }
          s(0, this._name, this._value);
          const r = !!(e && e.finalSource);
          if (!e || e.columns !== false) {
            const e = f(this._value);
            let s = 1;
            let n = 0;
            if (e !== null) {
              for (const i of e) {
                const e = i.endsWith('\n');
                if (e && i.length === 1) {
                  if (!r) t(i, s, n, -1, -1, -1, -1);
                } else {
                  const e = r ? undefined : i;
                  t(e, s, n, 0, s, n, -1);
                }
                if (e) {
                  s++;
                  n = 0;
                } else {
                  n += i.length;
                }
              }
            }
            return {
              generatedLine: s,
              generatedColumn: n,
              source: r ? this._value : undefined,
            };
          } else if (r) {
            const e = u(this._value);
            const { generatedLine: s, generatedColumn: n } = e;
            if (n === 0) {
              for (let e = 1; e < s; e++) t(undefined, e, 0, 0, e, 0, -1);
            } else {
              for (let e = 1; e <= s; e++) t(undefined, e, 0, 0, e, 0, -1);
            }
            return e;
          } else {
            let e = 1;
            const s = i(this._value);
            let n;
            for (n of s) {
              t(r ? undefined : n, e, 0, 0, e, 0, -1);
              e++;
            }
            return s.length === 0 || n.endsWith('\n')
              ? {
                  generatedLine: s.length + 1,
                  generatedColumn: 0,
                  source: r ? this._value : undefined,
                }
              : {
                  generatedLine: s.length,
                  generatedColumn: n.length,
                  source: r ? this._value : undefined,
                };
          }
        }
        updateHash(e) {
          if (this._valueAsBuffer === undefined) {
            this._valueAsBuffer = Buffer.from(this._value, 'utf-8');
          }
          e.update('OriginalSource');
          e.update(this._valueAsBuffer);
          e.update(this._name || '');
        }
      }
      e.exports = OriginalSource;
    },
    516: (e, t, s) => {
      'use strict';
      const n = s(799);
      const r = s(851);
      const i = s(641);
      const { getMap: u, getSourceAndMap: o } = s(771);
      const f = /\n(?=.|\s)/g;
      class PrefixSource extends n {
        constructor(e, t) {
          super();
          this._source =
            typeof t === 'string' || Buffer.isBuffer(t) ? new r(t, true) : t;
          this._prefix = e;
        }
        getPrefix() {
          return this._prefix;
        }
        original() {
          return this._source;
        }
        source() {
          const e = this._source.source();
          const t = this._prefix;
          return t + e.replace(f, '\n' + t);
        }
        map(e) {
          return u(this, e);
        }
        sourceAndMap(e) {
          return o(this, e);
        }
        streamChunks(e, t, s, n) {
          const r = this._prefix;
          const u = r.length;
          const o = !!(e && e.columns === false);
          const {
            generatedLine: c,
            generatedColumn: a,
            source: h,
          } = i(
            this._source,
            e,
            (e, s, n, i, f, c, a) => {
              if (n !== 0) {
                n += u;
              } else if (e !== undefined) {
                if (o || i < 0) {
                  e = r + e;
                } else if (u > 0) {
                  t(r, s, n, -1, -1, -1, -1);
                  n += u;
                }
              } else if (!o) {
                n += u;
              }
              t(e, s, n, i, f, c, a);
            },
            s,
            n,
          );
          return {
            generatedLine: c,
            generatedColumn: a === 0 ? 0 : u + a,
            source: h !== undefined ? r + h.replace(f, '\n' + r) : undefined,
          };
        }
        updateHash(e) {
          e.update('PrefixSource');
          this._source.updateHash(e);
          e.update(this._prefix);
        }
      }
      e.exports = PrefixSource;
    },
    851: (e, t, s) => {
      'use strict';
      const n = s(951);
      const r = s(799);
      class RawSource extends r {
        constructor(e, t = false) {
          super();
          const s = Buffer.isBuffer(e);
          if (!s && typeof e !== 'string') {
            throw new TypeError(
              "argument 'value' must be either string of Buffer",
            );
          }
          this._valueIsBuffer = !t && s;
          this._value = t && s ? undefined : e;
          this._valueAsBuffer = s ? e : undefined;
          this._valueAsString = s ? undefined : e;
        }
        isBuffer() {
          return this._valueIsBuffer;
        }
        source() {
          if (this._value === undefined) {
            this._value = this._valueAsBuffer.toString('utf-8');
          }
          return this._value;
        }
        buffer() {
          if (this._valueAsBuffer === undefined) {
            this._valueAsBuffer = Buffer.from(this._value, 'utf-8');
          }
          return this._valueAsBuffer;
        }
        map(e) {
          return null;
        }
        streamChunks(e, t, s, r) {
          if (this._value === undefined) {
            this._value = Buffer.from(this._valueAsBuffer, 'utf-8');
          }
          if (this._valueAsString === undefined) {
            this._valueAsString =
              typeof this._value === 'string'
                ? this._value
                : this._value.toString('utf-8');
          }
          return n(this._valueAsString, t, s, r, !!(e && e.finalSource));
        }
        updateHash(e) {
          if (this._valueAsBuffer === undefined) {
            this._valueAsBuffer = Buffer.from(this._value, 'utf-8');
          }
          e.update('RawSource');
          e.update(this._valueAsBuffer);
        }
      }
      e.exports = RawSource;
    },
    653: (e, t, s) => {
      'use strict';
      const { getMap: n, getSourceAndMap: r } = s(771);
      const i = s(641);
      const u = s(799);
      const o = s(901);
      const f =
        typeof process === 'object' &&
        process.versions &&
        typeof process.versions.v8 === 'string' &&
        !/^[0-6]\./.test(process.versions.v8);
      const c = 536870912;
      class Replacement {
        constructor(e, t, s, n) {
          this.start = e;
          this.end = t;
          this.content = s;
          this.name = n;
          if (!f) {
            this.index = -1;
          }
        }
      }
      class ReplaceSource extends u {
        constructor(e, t) {
          super();
          this._source = e;
          this._name = t;
          this._replacements = [];
          this._isSorted = true;
        }
        getName() {
          return this._name;
        }
        getReplacements() {
          this._sortReplacements();
          return this._replacements;
        }
        replace(e, t, s, n) {
          if (typeof s !== 'string')
            throw new Error('insertion must be a string, but is a ' + typeof s);
          this._replacements.push(new Replacement(e, t, s, n));
          this._isSorted = false;
        }
        insert(e, t, s) {
          if (typeof t !== 'string')
            throw new Error(
              'insertion must be a string, but is a ' + typeof t + ': ' + t,
            );
          this._replacements.push(new Replacement(e, e - 1, t, s));
          this._isSorted = false;
        }
        source() {
          if (this._replacements.length === 0) {
            return this._source.source();
          }
          let e = this._source.source();
          let t = 0;
          const s = [];
          this._sortReplacements();
          for (const n of this._replacements) {
            const r = Math.floor(n.start);
            const i = Math.floor(n.end + 1);
            if (t < r) {
              const n = r - t;
              s.push(e.slice(0, n));
              e = e.slice(n);
              t = r;
            }
            s.push(n.content);
            if (t < i) {
              const s = i - t;
              e = e.slice(s);
              t = i;
            }
          }
          s.push(e);
          return s.join('');
        }
        map(e) {
          if (this._replacements.length === 0) {
            return this._source.map(e);
          }
          return n(this, e);
        }
        sourceAndMap(e) {
          if (this._replacements.length === 0) {
            return this._source.sourceAndMap(e);
          }
          return r(this, e);
        }
        original() {
          return this._source;
        }
        _sortReplacements() {
          if (this._isSorted) return;
          if (f) {
            this._replacements.sort(function (e, t) {
              const s = e.start - t.start;
              if (s !== 0) return s;
              const n = e.end - t.end;
              if (n !== 0) return n;
              return 0;
            });
          } else {
            this._replacements.forEach((e, t) => (e.index = t));
            this._replacements.sort(function (e, t) {
              const s = e.start - t.start;
              if (s !== 0) return s;
              const n = e.end - t.end;
              if (n !== 0) return n;
              return e.index - t.index;
            });
          }
          this._isSorted = true;
        }
        streamChunks(e, t, s, n) {
          this._sortReplacements();
          const r = this._replacements;
          let u = 0;
          let f = 0;
          let a = -1;
          let h = f < r.length ? Math.floor(r[f].start) : c;
          let l = 0;
          let d = 0;
          let p = 0;
          const _ = [];
          const g = new Map();
          const S = [];
          const checkOriginalContent = (e, t, s, n) => {
            let r = e < _.length ? _[e] : undefined;
            if (r === undefined) return false;
            if (typeof r === 'string') {
              r = o(r);
              _[e] = r;
            }
            const i = t <= r.length ? r[t - 1] : null;
            if (i === null) return false;
            return i.slice(s, s + n.length) === n;
          };
          let { generatedLine: m, generatedColumn: A } = i(
            this._source,
            Object.assign({}, e, { finalSource: false }),
            (e, s, i, _, m, A, M) => {
              let B = 0;
              let v = u + e.length;
              if (a > u) {
                if (a >= v) {
                  const t = s + l;
                  if (e.endsWith('\n')) {
                    l--;
                    if (p === t) {
                      d += i;
                    }
                  } else if (p === t) {
                    d -= e.length;
                  } else {
                    d = -e.length;
                    p = t;
                  }
                  u = v;
                  return;
                }
                B = a - u;
                if (checkOriginalContent(_, m, A, e.slice(0, B))) {
                  A += B;
                }
                u += B;
                const t = s + l;
                if (p === t) {
                  d -= B;
                } else {
                  d = -B;
                  p = t;
                }
                i += B;
              }
              if (h < v) {
                do {
                  let C = s + l;
                  if (h > u) {
                    const s = h - u;
                    const n = e.slice(B, B + s);
                    t(
                      n,
                      C,
                      i + (C === p ? d : 0),
                      _,
                      m,
                      A,
                      M < 0 || M >= S.length ? -1 : S[M],
                    );
                    i += s;
                    B += s;
                    u = h;
                    if (checkOriginalContent(_, m, A, n)) {
                      A += n.length;
                    }
                  }
                  const { content: b, name: O } = r[f];
                  let y = o(b);
                  let w = M;
                  if (_ >= 0 && O) {
                    let e = g.get(O);
                    if (e === undefined) {
                      e = g.size;
                      g.set(O, e);
                      n(e, O);
                    }
                    w = e;
                  }
                  for (let e = 0; e < y.length; e++) {
                    const s = y[e];
                    t(s, C, i + (C === p ? d : 0), _, m, A, w);
                    w = -1;
                    if (e === y.length - 1 && !s.endsWith('\n')) {
                      if (p === C) {
                        d += s.length;
                      } else {
                        d = s.length;
                        p = C;
                      }
                    } else {
                      l++;
                      C++;
                      d = -i;
                      p = C;
                    }
                  }
                  a = Math.max(a, Math.floor(r[f].end + 1));
                  f++;
                  h = f < r.length ? Math.floor(r[f].start) : c;
                  const x = e.length - v + a - B;
                  if (x > 0) {
                    if (a >= v) {
                      let t = s + l;
                      if (e.endsWith('\n')) {
                        l--;
                        if (p === t) {
                          d += i;
                        }
                      } else if (p === t) {
                        d -= e.length - B;
                      } else {
                        d = B - e.length;
                        p = t;
                      }
                      u = v;
                      return;
                    }
                    const t = s + l;
                    if (checkOriginalContent(_, m, A, e.slice(B, B + x))) {
                      A += x;
                    }
                    B += x;
                    u += x;
                    if (p === t) {
                      d -= x;
                    } else {
                      d = -x;
                      p = t;
                    }
                    i += x;
                  }
                } while (h < v);
              }
              if (B < e.length) {
                const n = B === 0 ? e : e.slice(B);
                const r = s + l;
                t(n, r, i + (r === p ? d : 0), _, m, A, M < 0 ? -1 : S[M]);
              }
              u = v;
            },
            (e, t, n) => {
              while (_.length < e) _.push(undefined);
              _[e] = n;
              s(e, t, n);
            },
            (e, t) => {
              let s = g.get(t);
              if (s === undefined) {
                s = g.size;
                g.set(t, s);
                n(s, t);
              }
              S[e] = s;
            },
          );
          let M = '';
          for (; f < r.length; f++) {
            M += r[f].content;
          }
          let B = m + l;
          let v = o(M);
          for (let e = 0; e < v.length; e++) {
            const s = v[e];
            t(s, B, A + (B === p ? d : 0), -1, -1, -1, -1);
            if (e === v.length - 1 && !s.endsWith('\n')) {
              if (p === B) {
                d += s.length;
              } else {
                d = s.length;
                p = B;
              }
            } else {
              l++;
              B++;
              d = -A;
              p = B;
            }
          }
          return { generatedLine: B, generatedColumn: A + (B === p ? d : 0) };
        }
        updateHash(e) {
          this._sortReplacements();
          e.update('ReplaceSource');
          this._source.updateHash(e);
          e.update(this._name || '');
          for (const t of this._replacements) {
            e.update(`${t.start}${t.end}${t.content}${t.name}`);
          }
        }
      }
      e.exports = ReplaceSource;
    },
    107: (e, t, s) => {
      'use strict';
      const n = s(799);
      class SizeOnlySource extends n {
        constructor(e) {
          super();
          this._size = e;
        }
        _error() {
          return new Error(
            'Content and Map of this Source is not available (only size() is supported)',
          );
        }
        size() {
          return this._size;
        }
        source() {
          throw this._error();
        }
        buffer() {
          throw this._error();
        }
        map(e) {
          throw this._error();
        }
        updateHash() {
          throw this._error();
        }
      }
      e.exports = SizeOnlySource;
    },
    799: (e) => {
      'use strict';
      class Source {
        source() {
          throw new Error('Abstract');
        }
        buffer() {
          const e = this.source();
          if (Buffer.isBuffer(e)) return e;
          return Buffer.from(e, 'utf-8');
        }
        size() {
          return this.buffer().length;
        }
        map(e) {
          return null;
        }
        sourceAndMap(e) {
          return { source: this.source(), map: this.map(e) };
        }
        updateHash(e) {
          throw new Error('Abstract');
        }
      }
      e.exports = Source;
    },
    890: (e, t, s) => {
      'use strict';
      const n = s(799);
      const r = s(692);
      const i = s(153);
      const { getMap: u, getSourceAndMap: o } = s(771);
      class SourceMapSource extends n {
        constructor(e, t, s, n, r, i) {
          super();
          const u = Buffer.isBuffer(e);
          this._valueAsString = u ? undefined : e;
          this._valueAsBuffer = u ? e : undefined;
          this._name = t;
          this._hasSourceMap = !!s;
          const o = Buffer.isBuffer(s);
          const f = typeof s === 'string';
          this._sourceMapAsObject = o || f ? undefined : s;
          this._sourceMapAsString = f ? s : undefined;
          this._sourceMapAsBuffer = o ? s : undefined;
          this._hasOriginalSource = !!n;
          const c = Buffer.isBuffer(n);
          this._originalSourceAsString = c ? undefined : n;
          this._originalSourceAsBuffer = c ? n : undefined;
          this._hasInnerSourceMap = !!r;
          const a = Buffer.isBuffer(r);
          const h = typeof r === 'string';
          this._innerSourceMapAsObject = a || h ? undefined : r;
          this._innerSourceMapAsString = h ? r : undefined;
          this._innerSourceMapAsBuffer = a ? r : undefined;
          this._removeOriginalSource = i;
        }
        _ensureValueBuffer() {
          if (this._valueAsBuffer === undefined) {
            this._valueAsBuffer = Buffer.from(this._valueAsString, 'utf-8');
          }
        }
        _ensureValueString() {
          if (this._valueAsString === undefined) {
            this._valueAsString = this._valueAsBuffer.toString('utf-8');
          }
        }
        _ensureOriginalSourceBuffer() {
          if (
            this._originalSourceAsBuffer === undefined &&
            this._hasOriginalSource
          ) {
            this._originalSourceAsBuffer = Buffer.from(
              this._originalSourceAsString,
              'utf-8',
            );
          }
        }
        _ensureOriginalSourceString() {
          if (
            this._originalSourceAsString === undefined &&
            this._hasOriginalSource
          ) {
            this._originalSourceAsString =
              this._originalSourceAsBuffer.toString('utf-8');
          }
        }
        _ensureInnerSourceMapObject() {
          if (
            this._innerSourceMapAsObject === undefined &&
            this._hasInnerSourceMap
          ) {
            this._ensureInnerSourceMapString();
            this._innerSourceMapAsObject = JSON.parse(
              this._innerSourceMapAsString,
            );
          }
        }
        _ensureInnerSourceMapBuffer() {
          if (
            this._innerSourceMapAsBuffer === undefined &&
            this._hasInnerSourceMap
          ) {
            this._ensureInnerSourceMapString();
            this._innerSourceMapAsBuffer = Buffer.from(
              this._innerSourceMapAsString,
              'utf-8',
            );
          }
        }
        _ensureInnerSourceMapString() {
          if (
            this._innerSourceMapAsString === undefined &&
            this._hasInnerSourceMap
          ) {
            if (this._innerSourceMapAsBuffer !== undefined) {
              this._innerSourceMapAsString =
                this._innerSourceMapAsBuffer.toString('utf-8');
            } else {
              this._innerSourceMapAsString = JSON.stringify(
                this._innerSourceMapAsObject,
              );
            }
          }
        }
        _ensureSourceMapObject() {
          if (this._sourceMapAsObject === undefined) {
            this._ensureSourceMapString();
            this._sourceMapAsObject = JSON.parse(this._sourceMapAsString);
          }
        }
        _ensureSourceMapBuffer() {
          if (this._sourceMapAsBuffer === undefined) {
            this._ensureSourceMapString();
            this._sourceMapAsBuffer = Buffer.from(
              this._sourceMapAsString,
              'utf-8',
            );
          }
        }
        _ensureSourceMapString() {
          if (this._sourceMapAsString === undefined) {
            if (this._sourceMapAsBuffer !== undefined) {
              this._sourceMapAsString =
                this._sourceMapAsBuffer.toString('utf-8');
            } else {
              this._sourceMapAsString = JSON.stringify(this._sourceMapAsObject);
            }
          }
        }
        getArgsAsBuffers() {
          this._ensureValueBuffer();
          this._ensureSourceMapBuffer();
          this._ensureOriginalSourceBuffer();
          this._ensureInnerSourceMapBuffer();
          return [
            this._valueAsBuffer,
            this._name,
            this._sourceMapAsBuffer,
            this._originalSourceAsBuffer,
            this._innerSourceMapAsBuffer,
            this._removeOriginalSource,
          ];
        }
        buffer() {
          this._ensureValueBuffer();
          return this._valueAsBuffer;
        }
        source() {
          this._ensureValueString();
          return this._valueAsString;
        }
        map(e) {
          if (!this._hasInnerSourceMap) {
            this._ensureSourceMapObject();
            return this._sourceMapAsObject;
          }
          return u(this, e);
        }
        sourceAndMap(e) {
          if (!this._hasInnerSourceMap) {
            this._ensureValueString();
            this._ensureSourceMapObject();
            return {
              source: this._valueAsString,
              map: this._sourceMapAsObject,
            };
          }
          return o(this, e);
        }
        streamChunks(e, t, s, n) {
          this._ensureValueString();
          this._ensureSourceMapObject();
          this._ensureOriginalSourceString();
          if (this._hasInnerSourceMap) {
            this._ensureInnerSourceMapObject();
            return i(
              this._valueAsString,
              this._sourceMapAsObject,
              this._name,
              this._originalSourceAsString,
              this._innerSourceMapAsObject,
              this._removeOriginalSource,
              t,
              s,
              n,
              !!(e && e.finalSource),
              !!(e && e.columns !== false),
            );
          } else {
            return r(
              this._valueAsString,
              this._sourceMapAsObject,
              t,
              s,
              n,
              !!(e && e.finalSource),
              !!(e && e.columns !== false),
            );
          }
        }
        updateHash(e) {
          this._ensureValueBuffer();
          this._ensureSourceMapBuffer();
          this._ensureOriginalSourceBuffer();
          this._ensureInnerSourceMapBuffer();
          e.update('SourceMapSource');
          e.update(this._valueAsBuffer);
          e.update(this._sourceMapAsBuffer);
          if (this._hasOriginalSource) {
            e.update(this._originalSourceAsBuffer);
          }
          if (this._hasInnerSourceMap) {
            e.update(this._innerSourceMapAsBuffer);
          }
          e.update(this._removeOriginalSource ? 'true' : 'false');
        }
      }
      e.exports = SourceMapSource;
    },
    158: (e) => {
      'use strict';
      const t =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split(
          '',
        );
      const s = 32;
      const createMappingsSerializer = (e) => {
        const t = e && e.columns === false;
        return t
          ? createLinesOnlyMappingsSerializer()
          : createFullMappingsSerializer();
      };
      const createFullMappingsSerializer = () => {
        let e = 1;
        let n = 0;
        let r = 0;
        let i = 1;
        let u = 0;
        let o = 0;
        let f = false;
        let c = false;
        let a = true;
        return (h, l, d, p, _, g) => {
          if (f && e === h) {
            if (d === r && p === i && _ === u && !c && g < 0) {
              return '';
            }
          } else {
            if (d < 0) {
              return '';
            }
          }
          let S;
          if (e < h) {
            S = ';'.repeat(h - e);
            e = h;
            n = 0;
            a = false;
          } else if (a) {
            S = '';
            a = false;
          } else {
            S = ',';
          }
          const writeValue = (e) => {
            const n = (e >>> 31) & 1;
            const r = e >> 31;
            const i = (e + r) ^ r;
            let u = (i << 1) | n;
            for (;;) {
              const e = u & 31;
              u >>= 5;
              if (u === 0) {
                S += t[e];
                break;
              } else {
                S += t[e | s];
              }
            }
          };
          writeValue(l - n);
          n = l;
          if (d >= 0) {
            f = true;
            if (d === r) {
              S += 'A';
            } else {
              writeValue(d - r);
              r = d;
            }
            writeValue(p - i);
            i = p;
            if (_ === u) {
              S += 'A';
            } else {
              writeValue(_ - u);
              u = _;
            }
            if (g >= 0) {
              writeValue(g - o);
              o = g;
              c = true;
            } else {
              c = false;
            }
          } else {
            f = false;
          }
          return S;
        };
      };
      const createLinesOnlyMappingsSerializer = () => {
        let e = 0;
        let n = 1;
        let r = 0;
        let i = 1;
        return (u, o, f, c, a, h) => {
          if (f < 0) {
            return '';
          }
          if (e === u) {
            return '';
          }
          let l;
          const writeValue = (e) => {
            const n = (e >>> 31) & 1;
            const r = e >> 31;
            const i = (e + r) ^ r;
            let u = (i << 1) | n;
            for (;;) {
              const e = u & 31;
              u >>= 5;
              if (u === 0) {
                l += t[e];
                break;
              } else {
                l += t[e | s];
              }
            }
          };
          e = u;
          if (u === n + 1) {
            n = u;
            if (f === r) {
              r = f;
              if (c === i + 1) {
                i = c;
                return ';AACA';
              } else {
                l = ';AA';
                writeValue(c - i);
                i = c;
                return l + 'A';
              }
            } else {
              l = ';A';
              writeValue(f - r);
              r = f;
              writeValue(c - i);
              i = c;
              return l + 'A';
            }
          } else {
            l = ';'.repeat(u - n);
            n = u;
            if (f === r) {
              r = f;
              if (c === i + 1) {
                i = c;
                return l + 'AACA';
              } else {
                l += 'AA';
                writeValue(c - i);
                i = c;
                return l + 'A';
              }
            } else {
              l += 'A';
              writeValue(f - r);
              r = f;
              writeValue(c - i);
              i = c;
              return l + 'A';
            }
          }
        };
      };
      e.exports = createMappingsSerializer;
    },
    771: (e, t, s) => {
      'use strict';
      const n = s(158);
      t.getSourceAndMap = (e, t) => {
        let s = '';
        let r = '';
        let i = [];
        let u = [];
        let o = [];
        const f = n(t);
        const { source: c } = e.streamChunks(
          Object.assign({}, t, { finalSource: true }),
          (e, t, n, i, u, o, c) => {
            if (e !== undefined) s += e;
            r += f(t, n, i, u, o, c);
          },
          (e, t, s) => {
            while (i.length < e) {
              i.push(null);
            }
            i[e] = t;
            if (s !== undefined) {
              while (u.length < e) {
                u.push(null);
              }
              u[e] = s;
            }
          },
          (e, t) => {
            while (o.length < e) {
              o.push(null);
            }
            o[e] = t;
          },
        );
        return {
          source: c !== undefined ? c : s,
          map:
            r.length > 0
              ? {
                  version: 3,
                  file: 'x',
                  mappings: r,
                  sources: i,
                  sourcesContent: u.length > 0 ? u : undefined,
                  names: o,
                }
              : null,
        };
      };
      t.getMap = (e, t) => {
        let s = '';
        let r = [];
        let i = [];
        let u = [];
        const o = n(t);
        e.streamChunks(
          Object.assign({}, t, { source: false, finalSource: true }),
          (e, t, n, r, i, u, f) => {
            s += o(t, n, r, i, u, f);
          },
          (e, t, s) => {
            while (r.length < e) {
              r.push(null);
            }
            r[e] = t;
            if (s !== undefined) {
              while (i.length < e) {
                i.push(null);
              }
              i[e] = s;
            }
          },
          (e, t) => {
            while (u.length < e) {
              u.push(null);
            }
            u[e] = t;
          },
        );
        return s.length > 0
          ? {
              version: 3,
              file: 'x',
              mappings: s,
              sources: r,
              sourcesContent: i.length > 0 ? i : undefined,
              names: u,
            }
          : null;
      };
    },
    151: (e) => {
      'use strict';
      const t = '\n'.charCodeAt(0);
      const getGeneratedSourceInfo = (e) => {
        if (e === undefined) {
          return {};
        }
        const s = e.lastIndexOf('\n');
        if (s === -1) {
          return { generatedLine: 1, generatedColumn: e.length, source: e };
        }
        let n = 2;
        for (let r = 0; r < s; r++) {
          if (e.charCodeAt(r) === t) n++;
        }
        return {
          generatedLine: n,
          generatedColumn: e.length - s - 1,
          source: e,
        };
      };
      e.exports = getGeneratedSourceInfo;
    },
    634: (e) => {
      'use strict';
      const getSource = (e, t) => {
        if (t < 0) return null;
        const { sourceRoot: s, sources: n } = e;
        const r = n[t];
        if (!s) return r;
        if (s.endsWith('/')) return s + r;
        return s + '/' + r;
      };
      e.exports = getSource;
    },
    320: (e) => {
      'use strict';
      const t =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      const s = 32;
      const n = 64;
      const r = n | 1;
      const i = n | 2;
      const u = 31;
      const o = new Uint8Array('z'.charCodeAt(0) + 1);
      {
        o.fill(i);
        for (let e = 0; e < t.length; e++) {
          o[t.charCodeAt(e)] = e;
        }
        o[','.charCodeAt(0)] = n;
        o[';'.charCodeAt(0)] = r;
      }
      const f = o.length - 1;
      const readMappings = (e, t) => {
        const i = new Uint32Array([0, 0, 1, 0, 0]);
        let c = 0;
        let a = 0;
        let h = 0;
        let l = 1;
        let d = -1;
        for (let p = 0; p < e.length; p++) {
          const _ = e.charCodeAt(p);
          if (_ > f) continue;
          const g = o[_];
          if ((g & n) !== 0) {
            if (i[0] > d) {
              if (c === 1) {
                t(l, i[0], -1, -1, -1, -1);
              } else if (c === 4) {
                t(l, i[0], i[1], i[2], i[3], -1);
              } else if (c === 5) {
                t(l, i[0], i[1], i[2], i[3], i[4]);
              }
              d = i[0];
            }
            c = 0;
            if (g === r) {
              l++;
              i[0] = 0;
              d = -1;
            }
          } else if ((g & s) === 0) {
            a |= g << h;
            const e = a & 1 ? -(a >> 1) : a >> 1;
            i[c++] += e;
            h = 0;
            a = 0;
          } else {
            a |= (g & u) << h;
            h += 5;
          }
        }
        if (c === 1) {
          t(l, i[0], -1, -1, -1, -1);
        } else if (c === 4) {
          t(l, i[0], i[1], i[2], i[3], -1);
        } else if (c === 5) {
          t(l, i[0], i[1], i[2], i[3], i[4]);
        }
      };
      e.exports = readMappings;
    },
    901: (e) => {
      const splitIntoLines = (e) => {
        const t = [];
        const s = e.length;
        let n = 0;
        for (; n < s; ) {
          const r = e.charCodeAt(n);
          if (r === 10) {
            t.push('\n');
            n++;
          } else {
            let r = n + 1;
            while (r < s && e.charCodeAt(r) !== 10) r++;
            t.push(e.slice(n, r + 1));
            n = r + 1;
          }
        }
        return t;
      };
      e.exports = splitIntoLines;
    },
    820: (e) => {
      const splitIntoPotentialTokens = (e) => {
        const t = e.length;
        if (t === 0) return null;
        const s = [];
        let n = 0;
        for (; n < t; ) {
          const r = n;
          e: {
            let s = e.charCodeAt(n);
            while (s !== 10 && s !== 59 && s !== 123 && s !== 125) {
              if (++n >= t) break e;
              s = e.charCodeAt(n);
            }
            while (
              s === 59 ||
              s === 32 ||
              s === 123 ||
              s === 125 ||
              s === 13 ||
              s === 9
            ) {
              if (++n >= t) break e;
              s = e.charCodeAt(n);
            }
            if (s === 10) {
              n++;
            }
          }
          s.push(e.slice(r, n));
        }
        return s;
      };
      e.exports = splitIntoPotentialTokens;
    },
    757: (e, t, s) => {
      'use strict';
      const n = s(158);
      const r = s(641);
      const streamAndGetSourceAndMap = (e, t, s, i, u) => {
        let o = '';
        let f = '';
        let c = [];
        let a = [];
        let h = [];
        const l = n(Object.assign({}, t, { columns: true }));
        const d = !!(t && t.finalSource);
        const {
          generatedLine: p,
          generatedColumn: _,
          source: g,
        } = r(
          e,
          t,
          (e, t, n, r, i, u, c) => {
            if (e !== undefined) o += e;
            f += l(t, n, r, i, u, c);
            return s(d ? undefined : e, t, n, r, i, u, c);
          },
          (e, t, s) => {
            while (c.length < e) {
              c.push(null);
            }
            c[e] = t;
            if (s !== undefined) {
              while (a.length < e) {
                a.push(null);
              }
              a[e] = s;
            }
            return i(e, t, s);
          },
          (e, t) => {
            while (h.length < e) {
              h.push(null);
            }
            h[e] = t;
            return u(e, t);
          },
        );
        const S = g !== undefined ? g : o;
        return {
          result: {
            generatedLine: p,
            generatedColumn: _,
            source: d ? S : undefined,
          },
          source: S,
          map:
            f.length > 0
              ? {
                  version: 3,
                  file: 'x',
                  mappings: f,
                  sources: c,
                  sourcesContent: a.length > 0 ? a : undefined,
                  names: h,
                }
              : null,
        };
      };
      e.exports = streamAndGetSourceAndMap;
    },
    641: (e, t, s) => {
      'use strict';
      const n = s(951);
      const r = s(692);
      e.exports = (e, t, s, i, u) => {
        if (typeof e.streamChunks === 'function') {
          return e.streamChunks(t, s, i, u);
        } else {
          const o = e.sourceAndMap(t);
          if (o.map) {
            return r(
              o.source,
              o.map,
              s,
              i,
              u,
              !!(t && t.finalSource),
              !!(t && t.columns !== false),
            );
          } else {
            return n(o.source, s, i, u, !!(t && t.finalSource));
          }
        }
      };
    },
    153: (e, t, s) => {
      'use strict';
      const n = s(692);
      const r = s(901);
      const streamChunksOfCombinedSourceMap = (
        e,
        t,
        s,
        i,
        u,
        o,
        f,
        c,
        a,
        h,
        l,
      ) => {
        let d = new Map();
        let p = new Map();
        const _ = [];
        const g = [];
        const S = [];
        let m = -2;
        const A = [];
        const M = [];
        const B = [];
        const v = [];
        const C = [];
        const b = [];
        const O = [];
        const findInnerMapping = (e, t) => {
          if (e > O.length) return -1;
          const { mappingsData: s } = O[e - 1];
          let n = 0;
          let r = s.length / 5;
          while (n < r) {
            let e = (n + r) >> 1;
            if (s[e * 5] <= t) {
              n = e + 1;
            } else {
              r = e;
            }
          }
          if (n === 0) return -1;
          return n - 1;
        };
        return n(
          e,
          t,
          (t, n, u, h, l, y, w) => {
            if (h === m) {
              const m = findInnerMapping(l, y);
              if (m !== -1) {
                const { chunks: e, mappingsData: s } = O[l - 1];
                const i = m * 5;
                const o = s[i + 1];
                const h = s[i + 2];
                let _ = s[i + 3];
                let x = s[i + 4];
                if (o >= 0) {
                  const l = e[m];
                  const O = s[i];
                  const z = y - O;
                  if (z > 0) {
                    let e = o < v.length ? v[o] : null;
                    if (e === undefined) {
                      const t = B[o];
                      e = t ? r(t) : null;
                      v[o] = e;
                    }
                    if (e !== null) {
                      const t = h <= e.length ? e[h - 1].slice(_, _ + z) : '';
                      if (l.slice(0, z) === t) {
                        _ += z;
                        x = -1;
                      }
                    }
                  }
                  let k = o < A.length ? A[o] : -2;
                  if (k === -2) {
                    const [e, t] = o < M.length ? M[o] : [null, undefined];
                    let s = d.get(e);
                    if (s === undefined) {
                      d.set(e, (s = d.size));
                      c(s, e, t);
                    }
                    k = s;
                    A[o] = k;
                  }
                  let L = -1;
                  if (x >= 0) {
                    L = x < C.length ? C[x] : -2;
                    if (L === -2) {
                      const e = x < b.length ? b[x] : undefined;
                      if (e) {
                        let t = p.get(e);
                        if (t === undefined) {
                          p.set(e, (t = p.size));
                          a(t, e);
                        }
                        L = t;
                      } else {
                        L = -1;
                      }
                      C[x] = L;
                    }
                  } else if (w >= 0) {
                    let e = v[o];
                    if (e === undefined) {
                      const t = B[o];
                      e = t ? r(t) : null;
                      v[o] = e;
                    }
                    if (e !== null) {
                      const t = S[w];
                      const s =
                        h <= e.length ? e[h - 1].slice(_, _ + t.length) : '';
                      if (t === s) {
                        L = w < g.length ? g[w] : -2;
                        if (L === -2) {
                          const e = S[w];
                          if (e) {
                            let t = p.get(e);
                            if (t === undefined) {
                              p.set(e, (t = p.size));
                              a(t, e);
                            }
                            L = t;
                          } else {
                            L = -1;
                          }
                          g[w] = L;
                        }
                      }
                    }
                  }
                  f(t, n, u, k, h, _, L);
                  return;
                }
              }
              if (o) {
                f(t, n, u, -1, -1, -1, -1);
                return;
              } else {
                if (_[h] === -2) {
                  let t = d.get(s);
                  if (t === undefined) {
                    d.set(e, (t = d.size));
                    c(t, s, i);
                  }
                  _[h] = t;
                }
              }
            }
            const x = h < 0 || h >= _.length ? -1 : _[h];
            if (x < 0) {
              f(t, n, u, -1, -1, -1, -1);
            } else {
              let e = -1;
              if (w >= 0 && w < g.length) {
                e = g[w];
                if (e === -2) {
                  const t = S[w];
                  let s = p.get(t);
                  if (s === undefined) {
                    p.set(t, (s = p.size));
                    a(s, t);
                  }
                  e = s;
                  g[w] = e;
                }
              }
              f(t, n, u, x, l, y, e);
            }
          },
          (e, t, r) => {
            if (t === s) {
              m = e;
              if (i !== undefined) r = i;
              else i = r;
              _[e] = -2;
              n(
                r,
                u,
                (e, t, s, n, r, i, u) => {
                  while (O.length < t) {
                    O.push({ mappingsData: [], chunks: [] });
                  }
                  const o = O[t - 1];
                  o.mappingsData.push(s, n, r, i, u);
                  o.chunks.push(e);
                },
                (e, t, s) => {
                  B[e] = s;
                  v[e] = undefined;
                  A[e] = -2;
                  M[e] = [t, s];
                },
                (e, t) => {
                  C[e] = -2;
                  b[e] = t;
                },
                false,
                l,
              );
            } else {
              let s = d.get(t);
              if (s === undefined) {
                d.set(t, (s = d.size));
                c(s, t, r);
              }
              _[e] = s;
            }
          },
          (e, t) => {
            g[e] = -2;
            S[e] = t;
          },
          h,
          l,
        );
      };
      e.exports = streamChunksOfCombinedSourceMap;
    },
    951: (e, t, s) => {
      'use strict';
      const n = s(151);
      const r = s(901);
      const streamChunksOfRawSource = (e, t, s, n) => {
        let i = 1;
        const u = r(e);
        let o;
        for (o of u) {
          t(o, i, 0, -1, -1, -1, -1);
          i++;
        }
        return u.length === 0 || o.endsWith('\n')
          ? { generatedLine: u.length + 1, generatedColumn: 0 }
          : { generatedLine: u.length, generatedColumn: o.length };
      };
      e.exports = (e, t, s, r, i) =>
        i ? n(e) : streamChunksOfRawSource(e, t, s, r);
    },
    692: (e, t, s) => {
      'use strict';
      const n = s(151);
      const r = s(634);
      const i = s(320);
      const u = s(901);
      const streamChunksOfSourceMapFull = (e, t, s, n, o) => {
        const f = u(e);
        if (f.length === 0) {
          return { generatedLine: 1, generatedColumn: 0 };
        }
        const { sources: c, sourcesContent: a, names: h, mappings: l } = t;
        for (let e = 0; e < c.length; e++) {
          n(e, r(t, e), (a && a[e]) || undefined);
        }
        if (h) {
          for (let e = 0; e < h.length; e++) {
            o(e, h[e]);
          }
        }
        const d = f[f.length - 1];
        const p = d.endsWith('\n');
        const _ = p ? f.length + 1 : f.length;
        const g = p ? 0 : d.length;
        let S = 1;
        let m = 0;
        let A = false;
        let M = -1;
        let B = -1;
        let v = -1;
        let C = -1;
        const onMapping = (e, t, n, r, i, u) => {
          if (A && S <= f.length) {
            let n;
            const r = S;
            const i = m;
            const u = f[S - 1];
            if (e !== S) {
              n = u.slice(m);
              S++;
              m = 0;
            } else {
              n = u.slice(m, t);
              m = t;
            }
            if (n) {
              s(n, r, i, M, B, v, C);
            }
            A = false;
          }
          if (e > S && m > 0) {
            if (S <= f.length) {
              const e = f[S - 1].slice(m);
              s(e, S, m, -1, -1, -1, -1);
            }
            S++;
            m = 0;
          }
          while (e > S) {
            if (S <= f.length) {
              s(f[S - 1], S, 0, -1, -1, -1, -1);
            }
            S++;
          }
          if (t > m) {
            if (S <= f.length) {
              const e = f[S - 1].slice(m, t);
              s(e, S, m, -1, -1, -1, -1);
            }
            m = t;
          }
          if (n >= 0 && (e < _ || (e === _ && t < g))) {
            A = true;
            M = n;
            B = r;
            v = i;
            C = u;
          }
        };
        i(l, onMapping);
        onMapping(_, g, -1, -1, -1, -1);
        return { generatedLine: _, generatedColumn: g };
      };
      const streamChunksOfSourceMapLinesFull = (e, t, s, n, o) => {
        const f = u(e);
        if (f.length === 0) {
          return { generatedLine: 1, generatedColumn: 0 };
        }
        const { sources: c, sourcesContent: a, mappings: h } = t;
        for (let e = 0; e < c.length; e++) {
          n(e, r(t, e), (a && a[e]) || undefined);
        }
        let l = 1;
        const onMapping = (e, t, n, r, i, u) => {
          if (n < 0 || e < l || e > f.length) {
            return;
          }
          while (e > l) {
            if (l <= f.length) {
              s(f[l - 1], l, 0, -1, -1, -1, -1);
            }
            l++;
          }
          if (e <= f.length) {
            s(f[e - 1], e, 0, n, r, i, -1);
            l++;
          }
        };
        i(h, onMapping);
        for (; l <= f.length; l++) {
          s(f[l - 1], l, 0, -1, -1, -1, -1);
        }
        const d = f[f.length - 1];
        const p = d.endsWith('\n');
        const _ = p ? f.length + 1 : f.length;
        const g = p ? 0 : d.length;
        return { generatedLine: _, generatedColumn: g };
      };
      const streamChunksOfSourceMapFinal = (e, t, s, u, o) => {
        const f = n(e);
        const { generatedLine: c, generatedColumn: a } = f;
        if (c === 1 && a === 0) return f;
        const { sources: h, sourcesContent: l, names: d, mappings: p } = t;
        for (let e = 0; e < h.length; e++) {
          u(e, r(t, e), (l && l[e]) || undefined);
        }
        if (d) {
          for (let e = 0; e < d.length; e++) {
            o(e, d[e]);
          }
        }
        let _ = 0;
        const onMapping = (e, t, n, r, i, u) => {
          if (e >= c && (t >= a || e > c)) {
            return;
          }
          if (n >= 0) {
            s(undefined, e, t, n, r, i, u);
            _ = e;
          } else if (_ === e) {
            s(undefined, e, t, -1, -1, -1, -1);
            _ = 0;
          }
        };
        i(p, onMapping);
        return f;
      };
      const streamChunksOfSourceMapLinesFinal = (e, t, s, u, o) => {
        const f = n(e);
        const { generatedLine: c, generatedColumn: a } = f;
        if (c === 1 && a === 0) {
          return { generatedLine: 1, generatedColumn: 0 };
        }
        const { sources: h, sourcesContent: l, mappings: d } = t;
        for (let e = 0; e < h.length; e++) {
          u(e, r(t, e), (l && l[e]) || undefined);
        }
        const p = a === 0 ? c - 1 : c;
        let _ = 1;
        const onMapping = (e, t, n, r, i, u) => {
          if (n >= 0 && _ <= e && e <= p) {
            s(undefined, e, 0, n, r, i, -1);
            _ = e + 1;
          }
        };
        i(d, onMapping);
        return f;
      };
      e.exports = (e, t, s, n, r, i, u) => {
        if (u) {
          return i
            ? streamChunksOfSourceMapFinal(e, t, s, n, r)
            : streamChunksOfSourceMapFull(e, t, s, n, r);
        } else {
          return i
            ? streamChunksOfSourceMapLinesFinal(e, t, s, n, r)
            : streamChunksOfSourceMapLinesFull(e, t, s, n, r);
        }
      };
    },
    794: (e, t, s) => {
      const defineExport = (e, s) => {
        let n;
        Object.defineProperty(t, e, {
          get: () => {
            if (s !== undefined) {
              n = s();
              s = undefined;
            }
            return n;
          },
          configurable: true,
        });
      };
      defineExport('Source', () => s(799));
      defineExport('RawSource', () => s(851));
      defineExport('OriginalSource', () => s(297));
      defineExport('SourceMapSource', () => s(890));
      defineExport('CachedSource', () => s(209));
      defineExport('ConcatSource', () => s(172));
      defineExport('ReplaceSource', () => s(653));
      defineExport('PrefixSource', () => s(516));
      defineExport('SizeOnlySource', () => s(107));
      defineExport('CompatSource', () => s(147));
    },
  };
  var t = {};
  function __nccwpck_require__(s) {
    var n = t[s];
    if (n !== undefined) {
      return n.exports;
    }
    var r = (t[s] = { exports: {} });
    var i = true;
    try {
      e[s](r, r.exports, __nccwpck_require__);
      i = false;
    } finally {
      if (i) delete t[s];
    }
    return r.exports;
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/';
  var s = __nccwpck_require__(794);
  module.exports = s;
})();
