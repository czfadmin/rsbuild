(() => {
  'use strict';
  var e = {
    130: (e, r, o) => {
      const t = o(781);
      const s = [
        'assert',
        'count',
        'countReset',
        'debug',
        'dir',
        'dirxml',
        'error',
        'group',
        'groupCollapsed',
        'groupEnd',
        'info',
        'log',
        'table',
        'time',
        'timeEnd',
        'timeLog',
        'trace',
        'warn',
      ];
      let n = {};
      const patchConsole = (e) => {
        const r = new t.PassThrough();
        const o = new t.PassThrough();
        r.write = (r) => e('stdout', r);
        o.write = (r) => e('stderr', r);
        const _ = new console.Console(r, o);
        for (const e of s) {
          n[e] = console[e];
          console[e] = _[e];
        }
        return () => {
          for (const e of s) {
            console[e] = n[e];
          }
          n = {};
        };
      };
      e.exports = patchConsole;
    },
    781: (e) => {
      e.exports = require('stream');
    },
  };
  var r = {};
  function __nccwpck_require__(o) {
    var t = r[o];
    if (t !== undefined) {
      return t.exports;
    }
    var s = (r[o] = { exports: {} });
    var n = true;
    try {
      e[o](s, s.exports, __nccwpck_require__);
      n = false;
    } finally {
      if (n) delete r[o];
    }
    return s.exports;
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/';
  var o = __nccwpck_require__(130);
  module.exports = o;
})();
