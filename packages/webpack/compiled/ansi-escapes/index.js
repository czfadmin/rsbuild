(() => {
  'use strict';
  var e = {
    933: (e) => {
      const r = e.exports;
      e.exports['default'] = r;
      const n = '[';
      const t = ']';
      const o = '';
      const i = ';';
      const s = process.env.TERM_PROGRAM === 'Apple_Terminal';
      r.cursorTo = (e, r) => {
        if (typeof e !== 'number') {
          throw new TypeError('The `x` argument is required');
        }
        if (typeof r !== 'number') {
          return n + (e + 1) + 'G';
        }
        return n + (r + 1) + ';' + (e + 1) + 'H';
      };
      r.cursorMove = (e, r) => {
        if (typeof e !== 'number') {
          throw new TypeError('The `x` argument is required');
        }
        let t = '';
        if (e < 0) {
          t += n + -e + 'D';
        } else if (e > 0) {
          t += n + e + 'C';
        }
        if (r < 0) {
          t += n + -r + 'A';
        } else if (r > 0) {
          t += n + r + 'B';
        }
        return t;
      };
      r.cursorUp = (e = 1) => n + e + 'A';
      r.cursorDown = (e = 1) => n + e + 'B';
      r.cursorForward = (e = 1) => n + e + 'C';
      r.cursorBackward = (e = 1) => n + e + 'D';
      r.cursorLeft = n + 'G';
      r.cursorSavePosition = s ? '7' : n + 's';
      r.cursorRestorePosition = s ? '8' : n + 'u';
      r.cursorGetPosition = n + '6n';
      r.cursorNextLine = n + 'E';
      r.cursorPrevLine = n + 'F';
      r.cursorHide = n + '?25l';
      r.cursorShow = n + '?25h';
      r.eraseLines = (e) => {
        let n = '';
        for (let t = 0; t < e; t++) {
          n += r.eraseLine + (t < e - 1 ? r.cursorUp() : '');
        }
        if (e) {
          n += r.cursorLeft;
        }
        return n;
      };
      r.eraseEndLine = n + 'K';
      r.eraseStartLine = n + '1K';
      r.eraseLine = n + '2K';
      r.eraseDown = n + 'J';
      r.eraseUp = n + '1J';
      r.eraseScreen = n + '2J';
      r.scrollUp = n + 'S';
      r.scrollDown = n + 'T';
      r.clearScreen = 'c';
      r.clearTerminal =
        process.platform === 'win32'
          ? `${r.eraseScreen}${n}0f`
          : `${r.eraseScreen}${n}3J${n}H`;
      r.beep = o;
      r.link = (e, r) => [t, '8', i, i, r, o, e, t, '8', i, i, o].join('');
      r.image = (e, r = {}) => {
        let n = `${t}1337;File=inline=1`;
        if (r.width) {
          n += `;width=${r.width}`;
        }
        if (r.height) {
          n += `;height=${r.height}`;
        }
        if (r.preserveAspectRatio === false) {
          n += ';preserveAspectRatio=0';
        }
        return n + ':' + e.toString('base64') + o;
      };
      r.iTerm = {
        setCwd: (e = process.cwd()) => `${t}50;CurrentDir=${e}${o}`,
        annotation: (e, r = {}) => {
          let n = `${t}1337;`;
          const i = typeof r.x !== 'undefined';
          const s = typeof r.y !== 'undefined';
          if ((i || s) && !(i && s && typeof r.length !== 'undefined')) {
            throw new Error(
              '`x`, `y` and `length` must be defined when `x` or `y` is defined',
            );
          }
          e = e.replace(/\|/g, '');
          n += r.isHidden ? 'AddHiddenAnnotation=' : 'AddAnnotation=';
          if (r.length > 0) {
            n += (i ? [e, r.length, r.x, r.y] : [r.length, e]).join('|');
          } else {
            n += e;
          }
          return n + o;
        },
      };
    },
  };
  var r = {};
  function __nccwpck_require__(n) {
    var t = r[n];
    if (t !== undefined) {
      return t.exports;
    }
    var o = (r[n] = { exports: {} });
    var i = true;
    try {
      e[n](o, o.exports, __nccwpck_require__);
      i = false;
    } finally {
      if (i) delete r[n];
    }
    return o.exports;
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/';
  var n = __nccwpck_require__(933);
  module.exports = n;
})();
