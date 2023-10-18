(() => {
  'use strict';
  var e = {
    831: (e, t, s) => {
      Object.defineProperty(t, '__esModule', { value: true });
      t.transformFiles =
        t.reduceChunk =
        t.reduceAssets =
        t.generateManifest =
          void 0;
      const n = s(17);
      const generateManifest = (e, t, { generate: s, seed: n = {} }) => {
        let o;
        if (s) {
          const a = Array.from(e.entrypoints.entries());
          const i = a.reduce(
            (e, [t, s]) => Object.assign(e, { [t]: s.getFiles() }),
            {},
          );
          o = s(n, t, i);
        } else {
          o = t.reduce((e, t) => Object.assign(e, { [t.name]: t.path }), n);
        }
        return o;
      };
      t.generateManifest = generateManifest;
      const getFileType = (e, { transformExtensions: t }) => {
        const s = e.replace(/\?.*/, '');
        const n = s.split('.');
        const o = n.pop();
        return t.test(o) ? `${n.pop()}.${o}` : o;
      };
      const reduceAssets = (e, t, s) => {
        let o;
        if (s[t.name]) {
          o = s[t.name];
        } else if (t.info.sourceFilename) {
          o = n.join(n.dirname(t.name), n.basename(t.info.sourceFilename));
        }
        if (o) {
          return e.concat({
            isAsset: true,
            isChunk: false,
            isInitial: false,
            isModuleAsset: true,
            name: o,
            path: t.name,
          });
        }
        const a = t.chunks && t.chunks.length > 0;
        if (a) {
          return e;
        }
        return e.concat({
          isAsset: true,
          isChunk: false,
          isInitial: false,
          isModuleAsset: false,
          name: t.name,
          path: t.name,
        });
      };
      t.reduceAssets = reduceAssets;
      const reduceChunk = (e, t, s, o) => {
        Array.from(t.auxiliaryFiles || []).forEach((e) => {
          o[e] = {
            isAsset: true,
            isChunk: false,
            isInitial: false,
            isModuleAsset: true,
            name: n.basename(e),
            path: e,
          };
        });
        return Array.from(t.files).reduce((e, n) => {
          let o = t.name ? t.name : null;
          o = o
            ? s.useEntryKeys && !n.endsWith('.map')
              ? o
              : `${o}.${getFileType(n, s)}`
            : n;
          return e.concat({
            chunk: t,
            isAsset: false,
            isChunk: true,
            isInitial: t.isOnlyInitial(),
            isModuleAsset: false,
            name: o,
            path: n,
          });
        }, e);
      };
      t.reduceChunk = reduceChunk;
      const standardizeFilePaths = (e) => {
        const t = Object.assign({}, e);
        t.name = e.name.replace(/\\/g, '/');
        t.path = e.path.replace(/\\/g, '/');
        return t;
      };
      const transformFiles = (e, t) =>
        ['filter', 'map', 'sort']
          .filter((e) => !!t[e])
          .reduce((e, s) => e[s](t[s]), e)
          .map(standardizeFilePaths);
      t.transformFiles = transformFiles;
    },
    406: (e, t, s) => {
      Object.defineProperty(t, '__esModule', { value: true });
      t.normalModuleLoaderHook =
        t.getCompilerHooks =
        t.emitHook =
        t.beforeRunHook =
          void 0;
      const n = s(147);
      const o = s(17);
      const a = s(279);
      const i = s(908);
      const r = s(831);
      const l = new WeakMap();
      const getCompilerHooks = (e) => {
        let t = l.get(e);
        if (typeof t === 'undefined') {
          t = {
            afterEmit: new a.SyncWaterfallHook(['manifest']),
            beforeEmit: new a.SyncWaterfallHook(['manifest']),
          };
          l.set(e, t);
        }
        return t;
      };
      t.getCompilerHooks = getCompilerHooks;
      const beforeRunHook = (
        { emitCountMap: e, manifestFileName: t },
        s,
        n,
      ) => {
        const o = e.get(t) || 0;
        e.set(t, o + 1);
        if (n) {
          n();
        }
      };
      t.beforeRunHook = beforeRunHook;
      const u = function emit(
        {
          compiler: e,
          emitCountMap: t,
          manifestAssetId: s,
          manifestFileName: a,
          moduleAssets: l,
          options: u,
        },
        c,
      ) {
        const p = t.get(a) - 1;
        const m = c
          .getStats()
          .toJson({
            all: false,
            assets: true,
            cachedAssets: true,
            ids: true,
            publicPath: true,
          });
        const f = u.publicPath !== null ? u.publicPath : m.publicPath;
        const { basePath: d, removeKeyHash: h } = u;
        t.set(a, p);
        const k = {};
        let b = Array.from(c.chunks).reduce(
          (e, t) => r.reduceChunk(e, t, u, k),
          [],
        );
        b = m.assets.reduce((e, t) => r.reduceAssets(e, t, l), b);
        b = b.filter(({ name: s, path: n }) => {
          var a;
          return (
            !n.includes('hot-update') &&
            typeof t.get(
              o.join(
                ((a = e.options.output) === null || a === void 0
                  ? void 0
                  : a.path) || '<unknown>',
                s,
              ),
            ) === 'undefined'
          );
        });
        b.forEach((e) => {
          delete k[e.path];
        });
        Object.keys(k).forEach((e) => {
          b = b.concat(k[e]);
        });
        b = b.map((e) => {
          const normalizePath = (e) => {
            if (!e.endsWith('/')) {
              return `${e}/`;
            }
            return e;
          };
          const t = {
            name: d ? normalizePath(d) + e.name : e.name,
            path: f ? normalizePath(f) + e.path : e.path,
          };
          t.name = h ? t.name.replace(h, '') : t.name;
          return Object.assign(e, t);
        });
        b = r.transformFiles(b, u);
        let g = r.generateManifest(c, b, u);
        const _ = p === 0;
        g = getCompilerHooks(e).beforeEmit.call(g);
        if (_) {
          const e = u.serialize(g);
          c.emitAsset(s, new i.RawSource(e));
          if (u.writeToFileEmit) {
            n.mkdirSync(o.dirname(a), { recursive: true });
            n.writeFileSync(a, e);
          }
        }
        getCompilerHooks(e).afterEmit.call(g);
      };
      t.emitHook = u;
      const normalModuleLoaderHook = ({ moduleAssets: e }, t, s) => {
        const { emitFile: n } = t;
        t.emitFile = (t, a, i) => {
          if (s.userRequest && !e[t]) {
            Object.assign(e, {
              [t]: o.join(o.dirname(t), o.basename(s.userRequest)),
            });
          }
          return n.call(s, t, a, i);
        };
      };
      t.normalModuleLoaderHook = normalModuleLoaderHook;
    },
    227: function (e, t, s) {
      var n =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, '__esModule', { value: true });
      t.WebpackManifestPlugin = t.getCompilerHooks = void 0;
      const o = s(17);
      const a = n(s(530));
      const i = s(406);
      Object.defineProperty(t, 'getCompilerHooks', {
        enumerable: true,
        get: function () {
          return i.getCompilerHooks;
        },
      });
      const r = new Map();
      const l = {
        assetHookStage: Infinity,
        basePath: '',
        fileName: 'manifest.json',
        filter: null,
        generate: void 0,
        map: null,
        publicPath: null,
        removeKeyHash: /([a-f0-9]{16,32}\.?)/gi,
        seed: void 0,
        serialize(e) {
          return JSON.stringify(e, null, 2);
        },
        sort: null,
        transformExtensions: /^(gz|map)$/i,
        useEntryKeys: false,
        useLegacyEmit: false,
        writeToFileEmit: false,
      };
      class WebpackManifestPlugin {
        constructor(e) {
          this.options = Object.assign({}, l, e);
        }
        apply(e) {
          var t, s;
          const n = {};
          const l = o.resolve(
            ((t = e.options.output) === null || t === void 0
              ? void 0
              : t.path) || './',
            this.options.fileName,
          );
          const u = o.relative(
            ((s = e.options.output) === null || s === void 0
              ? void 0
              : s.path) || './',
            l,
          );
          const c = i.beforeRunHook.bind(this, {
            emitCountMap: r,
            manifestFileName: l,
          });
          const p = i.emitHook.bind(this, {
            compiler: e,
            emitCountMap: r,
            manifestAssetId: u,
            manifestFileName: l,
            moduleAssets: n,
            options: this.options,
          });
          const m = i.normalModuleLoaderHook.bind(this, { moduleAssets: n });
          const f = {
            name: 'WebpackManifestPlugin',
            stage: this.options.assetHookStage,
          };
          e.hooks.compilation.tap(f, (e) => {
            const t = !a.default.getCompilationHooks
              ? e.hooks.normalModuleLoader
              : a.default.getCompilationHooks(e).loader;
            t.tap(f, m);
          });
          if (this.options.useLegacyEmit === true) {
            e.hooks.emit.tap(f, p);
          } else {
            e.hooks.thisCompilation.tap(f, (e) => {
              e.hooks.processAssets.tap(f, () => p(e));
            });
          }
          e.hooks.run.tapAsync(f, c);
          e.hooks.watchRun.tapAsync(f, c);
        }
      }
      t.WebpackManifestPlugin = WebpackManifestPlugin;
    },
    279: (e) => {
      e.exports = require('../tapable');
    },
    908: (e) => {
      e.exports = require('../webpack-sources');
    },
    147: (e) => {
      e.exports = require('fs');
    },
    17: (e) => {
      e.exports = require('path');
    },
    530: (e) => {
      e.exports = require('webpack/lib/NormalModule');
    },
  };
  var t = {};
  function __nccwpck_require__(s) {
    var n = t[s];
    if (n !== undefined) {
      return n.exports;
    }
    var o = (t[s] = { exports: {} });
    var a = true;
    try {
      e[s].call(o.exports, o, o.exports, __nccwpck_require__);
      a = false;
    } finally {
      if (a) delete t[s];
    }
    return o.exports;
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/';
  var s = __nccwpck_require__(227);
  module.exports = s;
})();
