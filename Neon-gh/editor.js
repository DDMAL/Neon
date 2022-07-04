!(function (e) {
  var t = {};
  function n(i) {
    if (t[i]) return t[i].exports;
    var r = (t[i] = { i: i, l: !1, exports: {} });
    return e[i].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, i) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i });
    }),
    (n.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var i = Object.create(null);
      if (
        (n.r(i),
        Object.defineProperty(i, 'default', { enumerable: !0, value: e }),
        2 & t && 'string' != typeof e)
      )
        for (var r in e)
          n.d(
            i,
            r,
            function (t) {
              return e[t];
            }.bind(null, r)
          );
      return i;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, 'a', t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ''),
    n((n.s = 62));
})([
  function (e, t, n) {
    'use strict';
    var i,
      r = 'object' == typeof Reflect ? Reflect : null,
      o =
        r && 'function' == typeof r.apply
          ? r.apply
          : function (e, t, n) {
              return Function.prototype.apply.call(e, t, n);
            };
    i =
      r && 'function' == typeof r.ownKeys
        ? r.ownKeys
        : Object.getOwnPropertySymbols
        ? function (e) {
            return Object.getOwnPropertyNames(e).concat(
              Object.getOwnPropertySymbols(e)
            );
          }
        : function (e) {
            return Object.getOwnPropertyNames(e);
          };
    var s =
      Number.isNaN ||
      function (e) {
        return e != e;
      };
    function a() {
      a.init.call(this);
    }
    (e.exports = a),
      (e.exports.once = function (e, t) {
        return new Promise(function (n, i) {
          function r() {
            void 0 !== o && e.removeListener('error', o),
              n([].slice.call(arguments));
          }
          var o;
          'error' !== t &&
            ((o = function (n) {
              e.removeListener(t, r), i(n);
            }),
            e.once('error', o)),
            e.once(t, r);
        });
      }),
      (a.EventEmitter = a),
      (a.prototype._events = void 0),
      (a.prototype._eventsCount = 0),
      (a.prototype._maxListeners = void 0);
    var c = 10;
    function l(e) {
      if ('function' != typeof e)
        throw new TypeError(
          'The "listener" argument must be of type Function. Received type ' +
            typeof e
        );
    }
    function u(e) {
      return void 0 === e._maxListeners
        ? a.defaultMaxListeners
        : e._maxListeners;
    }
    function d(e, t, n, i) {
      var r, o, s, a;
      if (
        (l(n),
        void 0 === (o = e._events)
          ? ((o = e._events = Object.create(null)), (e._eventsCount = 0))
          : (void 0 !== o.newListener &&
              (e.emit('newListener', t, n.listener ? n.listener : n),
              (o = e._events)),
            (s = o[t])),
        void 0 === s)
      )
        (s = o[t] = n), ++e._eventsCount;
      else if (
        ('function' == typeof s
          ? (s = o[t] = i ? [n, s] : [s, n])
          : i
          ? s.unshift(n)
          : s.push(n),
        (r = u(e)) > 0 && s.length > r && !s.warned)
      ) {
        s.warned = !0;
        var c = new Error(
          'Possible EventEmitter memory leak detected. ' +
            s.length +
            ' ' +
            String(t) +
            ' listeners added. Use emitter.setMaxListeners() to increase limit'
        );
        (c.name = 'MaxListenersExceededWarning'),
          (c.emitter = e),
          (c.type = t),
          (c.count = s.length),
          (a = c),
          console && console.warn && console.warn(a);
      }
      return e;
    }
    function h() {
      if (!this.fired)
        return (
          this.target.removeListener(this.type, this.wrapFn),
          (this.fired = !0),
          0 === arguments.length
            ? this.listener.call(this.target)
            : this.listener.apply(this.target, arguments)
        );
    }
    function f(e, t, n) {
      var i = { fired: !1, wrapFn: void 0, target: e, type: t, listener: n },
        r = h.bind(i);
      return (r.listener = n), (i.wrapFn = r), r;
    }
    function p(e, t, n) {
      var i = e._events;
      if (void 0 === i) return [];
      var r = i[t];
      return void 0 === r
        ? []
        : 'function' == typeof r
        ? n
          ? [r.listener || r]
          : [r]
        : n
        ? (function (e) {
            for (var t = new Array(e.length), n = 0; n < t.length; ++n)
              t[n] = e[n].listener || e[n];
            return t;
          })(r)
        : v(r, r.length);
    }
    function g(e) {
      var t = this._events;
      if (void 0 !== t) {
        var n = t[e];
        if ('function' == typeof n) return 1;
        if (void 0 !== n) return n.length;
      }
      return 0;
    }
    function v(e, t) {
      for (var n = new Array(t), i = 0; i < t; ++i) n[i] = e[i];
      return n;
    }
    Object.defineProperty(a, 'defaultMaxListeners', {
      enumerable: !0,
      get: function () {
        return c;
      },
      set: function (e) {
        if ('number' != typeof e || e < 0 || s(e))
          throw new RangeError(
            'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
              e +
              '.'
          );
        c = e;
      },
    }),
      (a.init = function () {
        (void 0 !== this._events &&
          this._events !== Object.getPrototypeOf(this)._events) ||
          ((this._events = Object.create(null)), (this._eventsCount = 0)),
          (this._maxListeners = this._maxListeners || void 0);
      }),
      (a.prototype.setMaxListeners = function (e) {
        if ('number' != typeof e || e < 0 || s(e))
          throw new RangeError(
            'The value of "n" is out of range. It must be a non-negative number. Received ' +
              e +
              '.'
          );
        return (this._maxListeners = e), this;
      }),
      (a.prototype.getMaxListeners = function () {
        return u(this);
      }),
      (a.prototype.emit = function (e) {
        for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
        var i = 'error' === e,
          r = this._events;
        if (void 0 !== r) i = i && void 0 === r.error;
        else if (!i) return !1;
        if (i) {
          var s;
          if ((t.length > 0 && (s = t[0]), s instanceof Error)) throw s;
          var a = new Error(
            'Unhandled error.' + (s ? ' (' + s.message + ')' : '')
          );
          throw ((a.context = s), a);
        }
        var c = r[e];
        if (void 0 === c) return !1;
        if ('function' == typeof c) o(c, this, t);
        else {
          var l = c.length,
            u = v(c, l);
          for (n = 0; n < l; ++n) o(u[n], this, t);
        }
        return !0;
      }),
      (a.prototype.addListener = function (e, t) {
        return d(this, e, t, !1);
      }),
      (a.prototype.on = a.prototype.addListener),
      (a.prototype.prependListener = function (e, t) {
        return d(this, e, t, !0);
      }),
      (a.prototype.once = function (e, t) {
        return l(t), this.on(e, f(this, e, t)), this;
      }),
      (a.prototype.prependOnceListener = function (e, t) {
        return l(t), this.prependListener(e, f(this, e, t)), this;
      }),
      (a.prototype.removeListener = function (e, t) {
        var n, i, r, o, s;
        if ((l(t), void 0 === (i = this._events))) return this;
        if (void 0 === (n = i[e])) return this;
        if (n === t || n.listener === t)
          0 == --this._eventsCount
            ? (this._events = Object.create(null))
            : (delete i[e],
              i.removeListener &&
                this.emit('removeListener', e, n.listener || t));
        else if ('function' != typeof n) {
          for (r = -1, o = n.length - 1; o >= 0; o--)
            if (n[o] === t || n[o].listener === t) {
              (s = n[o].listener), (r = o);
              break;
            }
          if (r < 0) return this;
          0 === r
            ? n.shift()
            : (function (e, t) {
                for (; t + 1 < e.length; t++) e[t] = e[t + 1];
                e.pop();
              })(n, r),
            1 === n.length && (i[e] = n[0]),
            void 0 !== i.removeListener &&
              this.emit('removeListener', e, s || t);
        }
        return this;
      }),
      (a.prototype.off = a.prototype.removeListener),
      (a.prototype.removeAllListeners = function (e) {
        var t, n, i;
        if (void 0 === (n = this._events)) return this;
        if (void 0 === n.removeListener)
          return (
            0 === arguments.length
              ? ((this._events = Object.create(null)), (this._eventsCount = 0))
              : void 0 !== n[e] &&
                (0 == --this._eventsCount
                  ? (this._events = Object.create(null))
                  : delete n[e]),
            this
          );
        if (0 === arguments.length) {
          var r,
            o = Object.keys(n);
          for (i = 0; i < o.length; ++i)
            'removeListener' !== (r = o[i]) && this.removeAllListeners(r);
          return (
            this.removeAllListeners('removeListener'),
            (this._events = Object.create(null)),
            (this._eventsCount = 0),
            this
          );
        }
        if ('function' == typeof (t = n[e])) this.removeListener(e, t);
        else if (void 0 !== t)
          for (i = t.length - 1; i >= 0; i--) this.removeListener(e, t[i]);
        return this;
      }),
      (a.prototype.listeners = function (e) {
        return p(this, e, !0);
      }),
      (a.prototype.rawListeners = function (e) {
        return p(this, e, !1);
      }),
      (a.listenerCount = function (e, t) {
        return 'function' == typeof e.listenerCount
          ? e.listenerCount(t)
          : g.call(e, t);
      }),
      (a.prototype.listenerCount = g),
      (a.prototype.eventNames = function () {
        return this._eventsCount > 0 ? i(this._events) : [];
      });
  },
  function (e, t) {
    'function' == typeof Object.create
      ? (e.exports = function (e, t) {
          t &&
            ((e.super_ = t),
            (e.prototype = Object.create(t.prototype, {
              constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })));
        })
      : (e.exports = function (e, t) {
          if (t) {
            e.super_ = t;
            var n = function () {};
            (n.prototype = t.prototype),
              (e.prototype = new n()),
              (e.prototype.constructor = e);
          }
        });
  },
  function (e, t, n) {
    'use strict';
    var i,
      r,
      o,
      s = [n(23), n(24), n(25), n(26), n(27), n(28)],
      a = -1,
      c = [],
      l = !1;
    function u() {
      i &&
        r &&
        ((i = !1), r.length ? (c = r.concat(c)) : (a = -1), c.length && d());
    }
    function d() {
      if (!i) {
        (l = !1), (i = !0);
        for (var e = c.length, t = setTimeout(u); e; ) {
          for (r = c, c = []; r && ++a < e; ) r[a].run();
          (a = -1), (e = c.length);
        }
        (r = null), (a = -1), (i = !1), clearTimeout(t);
      }
    }
    for (var h = -1, f = s.length; ++h < f; )
      if (s[h] && s[h].test && s[h].test()) {
        o = s[h].install(d);
        break;
      }
    function p(e, t) {
      (this.fun = e), (this.array = t);
    }
    (p.prototype.run = function () {
      var e = this.fun,
        t = this.array;
      switch (t.length) {
        case 0:
          return e();
        case 1:
          return e(t[0]);
        case 2:
          return e(t[0], t[1]);
        case 3:
          return e(t[0], t[1], t[2]);
        default:
          return e.apply(null, t);
      }
    }),
      (e.exports = function (e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
        c.push(new p(e, t)), l || i || ((l = !0), o());
      });
  },
  function (e, t, n) {
    'use strict';
    e.exports = function (e) {
      return function () {
        var t = arguments.length;
        if (t) {
          for (var n = [], i = -1; ++i < t; ) n[i] = arguments[i];
          return e.call(this, n);
        }
        return e.call(this, []);
      };
    };
  },
  function (e, t) {
    var n;
    n = (function () {
      return this;
    })();
    try {
      n = n || new Function('return this')();
    } catch (e) {
      'object' == typeof window && (n = window);
    }
    e.exports = n;
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.selectAll =
        t.selectNn =
        t.selectBBox =
        t.getStaffBBox =
        t.sharedSecondLevelParent =
        t.isLigature =
        t.selectNcs =
        t.select =
        t.selectLayerElement =
        t.selectStaff =
        t.unselect =
        t.getSelectionType =
          void 0);
    const i = n(18),
      r = n(11),
      o = n(47),
      s = n(48),
      a = n(13),
      c = n(8);
    function l() {
      const e = document.getElementsByClassName('sel-by is-active');
      return 0 !== e.length ? e[0].id : null;
    }
    function u() {
      document.querySelectorAll('.selected').forEach((e) => {
        e.classList.remove('selected'),
          e.classList.contains('staff')
            ? (e.removeAttribute('style'), i.unhighlight(e))
            : (e.removeAttribute('style'), (e.style.fill = ''));
      }),
        Array.from(document.getElementsByClassName('divLine')).forEach((e) => {
          e.style.stroke = 'black';
        }),
        Array.from(document.getElementsByClassName('text-select')).forEach(
          (e) => {
            (e.style.color = ''),
              (e.style.fontWeight = ''),
              e.classList.remove('text-select');
          }
        ),
        Array.from(
          document.getElementsByClassName('sylTextRect-display')
        ).forEach((e) => {
          e.style.fill = 'blue';
        }),
        Array.from(
          document.getElementsByClassName('syllable-highlighted')
        ).forEach((e) => {
          (e.style.fill = ''),
            e.classList.add('syllable'),
            e.classList.remove('syllable-highlighted');
        }),
        c.selectAll('#resizeRect').remove(),
        c.selectAll('.resizePoint').remove(),
        c.selectAll('.rotatePoint').remove(),
        document.getElementById('selByStaff').classList.contains('is-active')
          ? a.endOptionsSelection()
          : o.endGroupingSelection(),
        (document.getElementById('extraEdit').innerHTML = ''),
        document
          .getElementById('extraEdit')
          .parentElement.classList.add('hidden'),
        r.updateHighlight();
    }
    function d(e, t) {
      e.classList.contains('selected') ||
        (e.classList.add('selected'),
        i.unhighlight(e),
        i.highlight(e, '#d00'),
        a.triggerSplitActions(),
        o.initGroupingListeners(),
        t.dragInit());
    }
    function h(e, t) {
      e.classList.contains('selected') ||
        (e.classList.add('selected'),
        i.unhighlight(e),
        i.highlight(e, '#d00'),
        t.dragInit());
    }
    function f(e, t) {
      if (e.classList.contains('staff')) return d(e, t);
      if (e.classList.contains('layer')) return h(e, t);
      if (
        !e.classList.contains('selected') &&
        !e.classList.contains('sylTextRect') &&
        !e.classList.contains('sylTextRect-display')
      ) {
        let t;
        if (
          (e.classList.add('selected'),
          (e.style.fill = '#d00'),
          (e.style.stroke = e.classList.contains('divLine') ? '#d00' : 'black'),
          e.querySelectorAll('.sylTextRect-display').length &&
            e.querySelectorAll('.sylTextRect-display').forEach((e) => {
              e.style.fill = '#d00';
            }),
          e.querySelectorAll('.divLine').length &&
            e.querySelectorAll('.divLine').forEach((e) => {
              e.style.stroke = '#d00';
            }),
          e.classList.contains('syllable')
            ? (t = e.id)
            : null !== e.closest('.syllable') &&
              (t = e.closest('.syllable').id),
          void 0 !== t)
        ) {
          document.querySelectorAll('span.' + t).forEach((e) => {
            (e.style.color = '#d00'),
              (e.style.fontWeight = 'bold'),
              e.classList.add('text-select');
          });
        }
      }
      r.updateHighlight();
    }
    async function p(e, t) {
      return (await t.getElementAttr(e.id, t.view.getCurrentPageURI())).ligated;
    }
    function g(e) {
      const t = Array.from(e),
        n = t.pop().parentElement.parentElement;
      for (const e of t) {
        if (e.parentElement.parentElement.id !== n.id) return !1;
      }
      return !0;
    }
    function v(e, t, n) {
      const i = e,
        r = i.closest('.syl');
      if (!r.classList.contains('selected')) {
        r.classList.add('selected'), (i.style.fill = '#d00');
        const o = e.closest('.syllable');
        (o.style.fill = '#d00'),
          o.classList.add('syllable-highlighted'),
          void 0 !== n && s.resize(r, n, t),
          void 0 !== t && t.dragInit();
        const a = e.closest('.syllable').id;
        if (void 0 !== a) {
          const e = document.querySelector('span.' + a);
          e &&
            ((e.style.color = '#d00'),
            (e.style.fontWeight = 'bold'),
            e.classList.add('text-select'));
        }
      }
    }
    (t.getSelectionType = l),
      (t.unselect = u),
      (t.selectStaff = d),
      (t.selectLayerElement = h),
      (t.select = f),
      (t.selectNcs = async function (e, t, n) {
        if (!e.parentElement.classList.contains('selected')) {
          const i = e.parentElement;
          if ((u(), f(i), await p(i, t))) {
            const e = i.previousSibling;
            if (await p(e, t)) f(e);
            else {
              const e = i.nextSibling;
              (await p(e, t))
                ? f(e)
                : console.warn('Error: Neither prev or next nc are ligatures');
            }
            o.triggerGrouping('ligature');
          } else
            i.classList.contains('nc')
              ? a.triggerNcActions(i)
              : console.warn('No action triggered!');
          n.dragInit();
        }
      }),
      (t.isLigature = p),
      (t.sharedSecondLevelParent = g),
      (t.getStaffBBox = function (e) {
        let t, n, i, r, o;
        return (
          e.querySelectorAll('path').forEach((e) => {
            const s = e
              .getAttribute('d')
              .match(/\d+/g)
              .map((e) => Number(e));
            void 0 === o && (o = Math.atan((s[3] - s[1]) / (s[2] - s[0]))),
              (void 0 === n || Math.min(s[1], s[3]) < n) &&
                (n = Math.min(s[1], s[3])),
              (void 0 === t || s[0] < t) && (t = s[0]),
              (void 0 === r || Math.max(s[1], s[3]) > r) &&
                (r = Math.max(s[1], s[3])),
              (void 0 === i || s[2] > i) && (i = s[2]);
          }),
          { id: e.id, ulx: t, uly: n, lrx: i, lry: r, rotate: o }
        );
      }),
      (t.selectBBox = v),
      (t.selectNn = function (e) {
        return (
          !(e.length > 0) ||
          (e.forEach((e) => {
            f(e);
          }),
          !1)
        );
      }),
      (t.selectAll = async function (e, t, n) {
        const i = l();
        if ((u(), 0 === e.length)) return;
        let r,
          c = !1,
          d = !1;
        switch (i) {
          case 'selBySyllable':
            r = '.syllable';
            break;
          case 'selByNeume':
            r = '.neume';
            break;
          case 'selByNc':
            r = '.nc';
            break;
          case 'selByStaff':
            r = '.staff';
            break;
          case 'selByBBox':
            r = '.sylTextRect-display';
            break;
          case 'selByLayerElement':
            r = '.clef, .custos, .accid, .divLine';
            break;
          default:
            return void console.error('Unknown selection type ' + i);
        }
        const h = new Set();
        for (const t of e) {
          let e = t.closest(r);
          if (null === e) {
            if (
              ((e = t.closest('.clef, .custos, .accid, .divLine')), null === e)
            ) {
              console.warn(
                'Element ' +
                  t.id +
                  ' is not part of specified group and is not a clef or custos or accid or divLine.'
              );
              continue;
            }
            c = c || !0;
          } else d = d || !0;
          h.add(e);
          const n = e.getAttribute('mei:follows');
          n && h.add(document.getElementById(n.slice(1)));
          const i = e.getAttribute('mei:precedes');
          i && h.add(document.getElementById(i.slice(1)));
        }
        h.forEach((e) => {
          f(e, n);
        });
        const p = Array.from(h.values());
        if (!c || d)
          switch (i) {
            case 'selByStaff':
              switch (p.length) {
                case 1:
                  a.triggerSplitActions(),
                    o.initGroupingListeners(),
                    s.resize(p[0], t, n);
                  break;
                default:
                  a.triggerStaffActions(), o.initGroupingListeners();
              }
              break;
            case 'selByLayerElement':
              1 === h.size && p[0].classList.contains('clef')
                ? a.triggerClefActions(p[0])
                : 1 === h.size && p[0].classList.contains('custos')
                ? a.triggerCustosActions()
                : 1 === h.size && p[0].classList.contains('accid')
                ? a.triggerAccidActions(p[0])
                : 1 === h.size && p[0].classList.contains('divLine')
                ? a.triggerLayerElementActions(p[0])
                : a.triggerDefaultActions();
              break;
            case 'selBySyllable':
              switch (p.length) {
                case 1:
                  a.triggerSyllableActions(), o.initGroupingListeners();
                  break;
                default:
                  if (
                    p[0].getAttribute('mei:follows') === '#' + p[1].id ||
                    p[0].getAttribute('mei:precedes') === '#' + p[1].id
                  )
                    o.triggerGrouping('splitSyllable');
                  else if (g(p))
                    o.triggerGrouping('syl'), a.addChangeStaffListener();
                  else {
                    const e = p[0].closest('.staff'),
                      t = p[1].closest('.staff'),
                      n = Array.from(e.parentElement.children);
                    if (1 === Math.abs(n.indexOf(e) - n.indexOf(t))) {
                      const i = n.indexOf(e) < n.indexOf(t) ? e : t,
                        r = i.id === e.id ? t : e,
                        s = i.querySelector('.layer'),
                        a = r.querySelector('.layer'),
                        c = Array.from(s.children).filter((e) =>
                          e.classList.contains('syllable')
                        ),
                        l = Array.from(a.children).filter((e) =>
                          e.classList.contains('syllable')
                        ),
                        u = c[c.length - 1],
                        d = l[0];
                      if (u.id === p[0].id && d.id === p[1].id) {
                        o.triggerGrouping('splitSyllable');
                        break;
                      }
                      if (u.id === p[1].id && d.id === p[0].id) {
                        o.triggerGrouping('splitSyllable');
                        break;
                      }
                    }
                    a.triggerDefaultSylActions(),
                      a.triggerSyllableActions(),
                      o.initGroupingListeners();
                  }
              }
              break;
            case 'selByNeume':
              switch (p.length) {
                case 1:
                  a.triggerNeumeActions(), o.initGroupingListeners();
                  break;
                default:
                  g(p) ? o.triggerGrouping('neume') : a.triggerDefaultActions();
              }
              break;
            case 'selByNc':
              switch (p.length) {
                case 1:
                  a.triggerNcActions(p[0]);
                  break;
                case 2:
                  if (g(p)) {
                    if (p[0].parentElement === p[1].parentElement) {
                      const e = Array.from(p[0].parentElement.children);
                      if (1 === Math.abs(e.indexOf(p[0]) - e.indexOf(p[1]))) {
                        let e = p[0].children[0],
                          t = p[1].children[0],
                          n = e.x.baseVal.value,
                          i = t.x.baseVal.value,
                          r = e.y.baseVal.value,
                          s = t.y.baseVal.value;
                        if (
                          ((n > i || (n === i && r < s)) &&
                            (([e, t] = [t, e]), ([n, r, i, s] = [i, s, n, r])),
                          n === i || r < s)
                        ) {
                          o.triggerGrouping('ligature');
                          break;
                        }
                      }
                    }
                    o.triggerGrouping('nc');
                  } else a.triggerDefaultActions();
                  break;
                default:
                  g(p) ? o.triggerGrouping('nc') : a.triggerDefaultActions();
              }
              break;
            case 'selByBBox':
              switch (p.length) {
                case 1:
                  v(p[0], n, t), a.triggerDefaultActions();
                  break;
                default:
                  p.forEach((e) => v(e, n, void 0));
              }
              break;
            default:
              console.error(
                'Unknown selection type. This should not have occurred.'
              );
          }
        else
          1 === h.size && p[0].classList.contains('clef')
            ? a.triggerClefActions(p[0])
            : 1 === h.size && p[0].classList.contains('custos')
            ? a.triggerCustosActions()
            : 1 === h.size && p[0].classList.contains('accid')
            ? a.triggerAccidActions(p[0])
            : 1 === h.size && p[0].classList.contains('divLine')
            ? a.triggerLayerElementActions(p[0])
            : 'selBySyllable' == i
            ? a.triggerDefaultSylActions()
            : a.triggerDefaultActions();
      });
  },
  function (e, t, n) {
    e.exports = (function (e) {
      'use strict';
      var t = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
      ];
      function n(e, t) {
        var n = e[0],
          i = e[1],
          r = e[2],
          o = e[3];
        (i =
          ((((i +=
            ((((r =
              ((((r +=
                ((((o =
                  ((((o +=
                    ((((n =
                      ((((n += (((i & r) | (~i & o)) + t[0] - 680876936) | 0) <<
                        7) |
                        (n >>> 25)) +
                        i) |
                      0) &
                      i) |
                      (~n & r)) +
                      t[1] -
                      389564586) |
                    0) <<
                    12) |
                    (o >>> 20)) +
                    n) |
                  0) &
                  n) |
                  (~o & i)) +
                  t[2] +
                  606105819) |
                0) <<
                17) |
                (r >>> 15)) +
                o) |
              0) &
              o) |
              (~r & n)) +
              t[3] -
              1044525330) |
            0) <<
            22) |
            (i >>> 10)) +
            r) |
          0),
          (i =
            ((((i +=
              ((((r =
                ((((r +=
                  ((((o =
                    ((((o +=
                      ((((n =
                        ((((n +=
                          (((i & r) | (~i & o)) + t[4] - 176418897) | 0) <<
                          7) |
                          (n >>> 25)) +
                          i) |
                        0) &
                        i) |
                        (~n & r)) +
                        t[5] +
                        1200080426) |
                      0) <<
                      12) |
                      (o >>> 20)) +
                      n) |
                    0) &
                    n) |
                    (~o & i)) +
                    t[6] -
                    1473231341) |
                  0) <<
                  17) |
                  (r >>> 15)) +
                  o) |
                0) &
                o) |
                (~r & n)) +
                t[7] -
                45705983) |
              0) <<
              22) |
              (i >>> 10)) +
              r) |
            0),
          (i =
            ((((i +=
              ((((r =
                ((((r +=
                  ((((o =
                    ((((o +=
                      ((((n =
                        ((((n +=
                          (((i & r) | (~i & o)) + t[8] + 1770035416) | 0) <<
                          7) |
                          (n >>> 25)) +
                          i) |
                        0) &
                        i) |
                        (~n & r)) +
                        t[9] -
                        1958414417) |
                      0) <<
                      12) |
                      (o >>> 20)) +
                      n) |
                    0) &
                    n) |
                    (~o & i)) +
                    t[10] -
                    42063) |
                  0) <<
                  17) |
                  (r >>> 15)) +
                  o) |
                0) &
                o) |
                (~r & n)) +
                t[11] -
                1990404162) |
              0) <<
              22) |
              (i >>> 10)) +
              r) |
            0),
          (i =
            ((((i +=
              ((((r =
                ((((r +=
                  ((((o =
                    ((((o +=
                      ((((n =
                        ((((n +=
                          (((i & r) | (~i & o)) + t[12] + 1804603682) | 0) <<
                          7) |
                          (n >>> 25)) +
                          i) |
                        0) &
                        i) |
                        (~n & r)) +
                        t[13] -
                        40341101) |
                      0) <<
                      12) |
                      (o >>> 20)) +
                      n) |
                    0) &
                    n) |
                    (~o & i)) +
                    t[14] -
                    1502002290) |
                  0) <<
                  17) |
                  (r >>> 15)) +
                  o) |
                0) &
                o) |
                (~r & n)) +
                t[15] +
                1236535329) |
              0) <<
              22) |
              (i >>> 10)) +
              r) |
            0),
          (i =
            ((((i +=
              ((((r =
                ((((r +=
                  ((((o =
                    ((((o +=
                      ((((n =
                        ((((n +=
                          (((i & o) | (r & ~o)) + t[1] - 165796510) | 0) <<
                          5) |
                          (n >>> 27)) +
                          i) |
                        0) &
                        r) |
                        (i & ~r)) +
                        t[6] -
                        1069501632) |
                      0) <<
                      9) |
                      (o >>> 23)) +
                      n) |
                    0) &
                    i) |
                    (n & ~i)) +
                    t[11] +
                    643717713) |
                  0) <<
                  14) |
                  (r >>> 18)) +
                  o) |
                0) &
                n) |
                (o & ~n)) +
                t[0] -
                373897302) |
              0) <<
              20) |
              (i >>> 12)) +
              r) |
            0),
          (i =
            ((((i +=
              ((((r =
                ((((r +=
                  ((((o =
                    ((((o +=
                      ((((n =
                        ((((n +=
                          (((i & o) | (r & ~o)) + t[5] - 701558691) | 0) <<
                          5) |
                          (n >>> 27)) +
                          i) |
                        0) &
                        r) |
                        (i & ~r)) +
                        t[10] +
                        38016083) |
                      0) <<
                      9) |
                      (o >>> 23)) +
                      n) |
                    0) &
                    i) |
                    (n & ~i)) +
                    t[15] -
                    660478335) |
                  0) <<
                  14) |
                  (r >>> 18)) +
                  o) |
                0) &
                n) |
                (o & ~n)) +
                t[4] -
                405537848) |
              0) <<
              20) |
              (i >>> 12)) +
              r) |
            0),
          (i =
            ((((i +=
              ((((r =
                ((((r +=
                  ((((o =
                    ((((o +=
                      ((((n =
                        ((((n +=
                          (((i & o) | (r & ~o)) + t[9] + 568446438) | 0) <<
                          5) |
                          (n >>> 27)) +
                          i) |
                        0) &
                        r) |
                        (i & ~r)) +
                        t[14] -
                        1019803690) |
                      0) <<
                      9) |
                      (o >>> 23)) +
                      n) |
                    0) &
                    i) |
                    (n & ~i)) +
                    t[3] -
                    187363961) |
                  0) <<
                  14) |
                  (r >>> 18)) +
                  o) |
                0) &
                n) |
                (o & ~n)) +
                t[8] +
                1163531501) |
              0) <<
              20) |
              (i >>> 12)) +
              r) |
            0),
          (i =
            ((((i +=
              ((((r =
                ((((r +=
                  ((((o =
                    ((((o +=
                      ((((n =
                        ((((n +=
                          (((i & o) | (r & ~o)) + t[13] - 1444681467) | 0) <<
                          5) |
                          (n >>> 27)) +
                          i) |
                        0) &
                        r) |
                        (i & ~r)) +
                        t[2] -
                        51403784) |
                      0) <<
                      9) |
                      (o >>> 23)) +
                      n) |
                    0) &
                    i) |
                    (n & ~i)) +
                    t[7] +
                    1735328473) |
                  0) <<
                  14) |
                  (r >>> 18)) +
                  o) |
                0) &
                n) |
                (o & ~n)) +
                t[12] -
                1926607734) |
              0) <<
              20) |
              (i >>> 12)) +
              r) |
            0),
          (i =
            ((((i +=
              (((r =
                ((((r +=
                  (((o =
                    ((((o +=
                      (((n =
                        ((((n += ((i ^ r ^ o) + t[5] - 378558) | 0) << 4) |
                          (n >>> 28)) +
                          i) |
                        0) ^
                        i ^
                        r) +
                        t[8] -
                        2022574463) |
                      0) <<
                      11) |
                      (o >>> 21)) +
                      n) |
                    0) ^
                    n ^
                    i) +
                    t[11] +
                    1839030562) |
                  0) <<
                  16) |
                  (r >>> 16)) +
                  o) |
                0) ^
                o ^
                n) +
                t[14] -
                35309556) |
              0) <<
              23) |
              (i >>> 9)) +
              r) |
            0),
          (i =
            ((((i +=
              (((r =
                ((((r +=
                  (((o =
                    ((((o +=
                      (((n =
                        ((((n += ((i ^ r ^ o) + t[1] - 1530992060) | 0) << 4) |
                          (n >>> 28)) +
                          i) |
                        0) ^
                        i ^
                        r) +
                        t[4] +
                        1272893353) |
                      0) <<
                      11) |
                      (o >>> 21)) +
                      n) |
                    0) ^
                    n ^
                    i) +
                    t[7] -
                    155497632) |
                  0) <<
                  16) |
                  (r >>> 16)) +
                  o) |
                0) ^
                o ^
                n) +
                t[10] -
                1094730640) |
              0) <<
              23) |
              (i >>> 9)) +
              r) |
            0),
          (i =
            ((((i +=
              (((r =
                ((((r +=
                  (((o =
                    ((((o +=
                      (((n =
                        ((((n += ((i ^ r ^ o) + t[13] + 681279174) | 0) << 4) |
                          (n >>> 28)) +
                          i) |
                        0) ^
                        i ^
                        r) +
                        t[0] -
                        358537222) |
                      0) <<
                      11) |
                      (o >>> 21)) +
                      n) |
                    0) ^
                    n ^
                    i) +
                    t[3] -
                    722521979) |
                  0) <<
                  16) |
                  (r >>> 16)) +
                  o) |
                0) ^
                o ^
                n) +
                t[6] +
                76029189) |
              0) <<
              23) |
              (i >>> 9)) +
              r) |
            0),
          (i =
            ((((i +=
              (((r =
                ((((r +=
                  (((o =
                    ((((o +=
                      (((n =
                        ((((n += ((i ^ r ^ o) + t[9] - 640364487) | 0) << 4) |
                          (n >>> 28)) +
                          i) |
                        0) ^
                        i ^
                        r) +
                        t[12] -
                        421815835) |
                      0) <<
                      11) |
                      (o >>> 21)) +
                      n) |
                    0) ^
                    n ^
                    i) +
                    t[15] +
                    530742520) |
                  0) <<
                  16) |
                  (r >>> 16)) +
                  o) |
                0) ^
                o ^
                n) +
                t[2] -
                995338651) |
              0) <<
              23) |
              (i >>> 9)) +
              r) |
            0),
          (i =
            ((((i +=
              (((o =
                ((((o +=
                  ((i ^
                    ((n =
                      ((((n += ((r ^ (i | ~o)) + t[0] - 198630844) | 0) << 6) |
                        (n >>> 26)) +
                        i) |
                      0) |
                      ~r)) +
                    t[7] +
                    1126891415) |
                  0) <<
                  10) |
                  (o >>> 22)) +
                  n) |
                0) ^
                ((r =
                  ((((r += ((n ^ (o | ~i)) + t[14] - 1416354905) | 0) << 15) |
                    (r >>> 17)) +
                    o) |
                  0) |
                  ~n)) +
                t[5] -
                57434055) |
              0) <<
              21) |
              (i >>> 11)) +
              r) |
            0),
          (i =
            ((((i +=
              (((o =
                ((((o +=
                  ((i ^
                    ((n =
                      ((((n += ((r ^ (i | ~o)) + t[12] + 1700485571) | 0) <<
                        6) |
                        (n >>> 26)) +
                        i) |
                      0) |
                      ~r)) +
                    t[3] -
                    1894986606) |
                  0) <<
                  10) |
                  (o >>> 22)) +
                  n) |
                0) ^
                ((r =
                  ((((r += ((n ^ (o | ~i)) + t[10] - 1051523) | 0) << 15) |
                    (r >>> 17)) +
                    o) |
                  0) |
                  ~n)) +
                t[1] -
                2054922799) |
              0) <<
              21) |
              (i >>> 11)) +
              r) |
            0),
          (i =
            ((((i +=
              (((o =
                ((((o +=
                  ((i ^
                    ((n =
                      ((((n += ((r ^ (i | ~o)) + t[8] + 1873313359) | 0) << 6) |
                        (n >>> 26)) +
                        i) |
                      0) |
                      ~r)) +
                    t[15] -
                    30611744) |
                  0) <<
                  10) |
                  (o >>> 22)) +
                  n) |
                0) ^
                ((r =
                  ((((r += ((n ^ (o | ~i)) + t[6] - 1560198380) | 0) << 15) |
                    (r >>> 17)) +
                    o) |
                  0) |
                  ~n)) +
                t[13] +
                1309151649) |
              0) <<
              21) |
              (i >>> 11)) +
              r) |
            0),
          (i =
            ((((i +=
              (((o =
                ((((o +=
                  ((i ^
                    ((n =
                      ((((n += ((r ^ (i | ~o)) + t[4] - 145523070) | 0) << 6) |
                        (n >>> 26)) +
                        i) |
                      0) |
                      ~r)) +
                    t[11] -
                    1120210379) |
                  0) <<
                  10) |
                  (o >>> 22)) +
                  n) |
                0) ^
                ((r =
                  ((((r += ((n ^ (o | ~i)) + t[2] + 718787259) | 0) << 15) |
                    (r >>> 17)) +
                    o) |
                  0) |
                  ~n)) +
                t[9] -
                343485551) |
              0) <<
              21) |
              (i >>> 11)) +
              r) |
            0),
          (e[0] = (n + e[0]) | 0),
          (e[1] = (i + e[1]) | 0),
          (e[2] = (r + e[2]) | 0),
          (e[3] = (o + e[3]) | 0);
      }
      function i(e) {
        var t,
          n = [];
        for (t = 0; t < 64; t += 4)
          n[t >> 2] =
            e.charCodeAt(t) +
            (e.charCodeAt(t + 1) << 8) +
            (e.charCodeAt(t + 2) << 16) +
            (e.charCodeAt(t + 3) << 24);
        return n;
      }
      function r(e) {
        var t,
          n = [];
        for (t = 0; t < 64; t += 4)
          n[t >> 2] =
            e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + (e[t + 3] << 24);
        return n;
      }
      function o(e) {
        var t,
          r,
          o,
          s,
          a,
          c,
          l = e.length,
          u = [1732584193, -271733879, -1732584194, 271733878];
        for (t = 64; t <= l; t += 64) n(u, i(e.substring(t - 64, t)));
        for (
          r = (e = e.substring(t - 64)).length,
            o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            t = 0;
          t < r;
          t += 1
        )
          o[t >> 2] |= e.charCodeAt(t) << (t % 4 << 3);
        if (((o[t >> 2] |= 128 << (t % 4 << 3)), t > 55))
          for (n(u, o), t = 0; t < 16; t += 1) o[t] = 0;
        return (
          (s = (s = 8 * l).toString(16).match(/(.*?)(.{0,8})$/)),
          (a = parseInt(s[2], 16)),
          (c = parseInt(s[1], 16) || 0),
          (o[14] = a),
          (o[15] = c),
          n(u, o),
          u
        );
      }
      function s(e) {
        var n,
          i = '';
        for (n = 0; n < 4; n += 1)
          i += t[(e >> (8 * n + 4)) & 15] + t[(e >> (8 * n)) & 15];
        return i;
      }
      function a(e) {
        var t;
        for (t = 0; t < e.length; t += 1) e[t] = s(e[t]);
        return e.join('');
      }
      function c(e) {
        return (
          /[\u0080-\uFFFF]/.test(e) && (e = unescape(encodeURIComponent(e))), e
        );
      }
      function l(e) {
        var t,
          n = [],
          i = e.length;
        for (t = 0; t < i - 1; t += 2) n.push(parseInt(e.substr(t, 2), 16));
        return String.fromCharCode.apply(String, n);
      }
      function u() {
        this.reset();
      }
      return (
        a(o('hello')),
        'undefined' == typeof ArrayBuffer ||
          ArrayBuffer.prototype.slice ||
          (function () {
            function t(e, t) {
              return (e = 0 | e || 0) < 0 ? Math.max(e + t, 0) : Math.min(e, t);
            }
            ArrayBuffer.prototype.slice = function (n, i) {
              var r,
                o,
                s,
                a,
                c = this.byteLength,
                l = t(n, c),
                u = c;
              return (
                i !== e && (u = t(i, c)),
                l > u
                  ? new ArrayBuffer(0)
                  : ((r = u - l),
                    (o = new ArrayBuffer(r)),
                    (s = new Uint8Array(o)),
                    (a = new Uint8Array(this, l, r)),
                    s.set(a),
                    o)
              );
            };
          })(),
        (u.prototype.append = function (e) {
          return this.appendBinary(c(e)), this;
        }),
        (u.prototype.appendBinary = function (e) {
          (this._buff += e), (this._length += e.length);
          var t,
            r = this._buff.length;
          for (t = 64; t <= r; t += 64)
            n(this._hash, i(this._buff.substring(t - 64, t)));
          return (this._buff = this._buff.substring(t - 64)), this;
        }),
        (u.prototype.end = function (e) {
          var t,
            n,
            i = this._buff,
            r = i.length,
            o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (t = 0; t < r; t += 1)
            o[t >> 2] |= i.charCodeAt(t) << (t % 4 << 3);
          return (
            this._finish(o, r),
            (n = a(this._hash)),
            e && (n = l(n)),
            this.reset(),
            n
          );
        }),
        (u.prototype.reset = function () {
          return (
            (this._buff = ''),
            (this._length = 0),
            (this._hash = [1732584193, -271733879, -1732584194, 271733878]),
            this
          );
        }),
        (u.prototype.getState = function () {
          return {
            buff: this._buff,
            length: this._length,
            hash: this._hash.slice(),
          };
        }),
        (u.prototype.setState = function (e) {
          return (
            (this._buff = e.buff),
            (this._length = e.length),
            (this._hash = e.hash),
            this
          );
        }),
        (u.prototype.destroy = function () {
          delete this._hash, delete this._buff, delete this._length;
        }),
        (u.prototype._finish = function (e, t) {
          var i,
            r,
            o,
            s = t;
          if (((e[s >> 2] |= 128 << (s % 4 << 3)), s > 55))
            for (n(this._hash, e), s = 0; s < 16; s += 1) e[s] = 0;
          (i = (i = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/)),
            (r = parseInt(i[2], 16)),
            (o = parseInt(i[1], 16) || 0),
            (e[14] = r),
            (e[15] = o),
            n(this._hash, e);
        }),
        (u.hash = function (e, t) {
          return u.hashBinary(c(e), t);
        }),
        (u.hashBinary = function (e, t) {
          var n = a(o(e));
          return t ? l(n) : n;
        }),
        (u.ArrayBuffer = function () {
          this.reset();
        }),
        (u.ArrayBuffer.prototype.append = function (e) {
          var t,
            i,
            o,
            s,
            a,
            c =
              ((i = this._buff.buffer),
              (o = e),
              (s = !0),
              (a = new Uint8Array(i.byteLength + o.byteLength)).set(
                new Uint8Array(i)
              ),
              a.set(new Uint8Array(o), i.byteLength),
              s ? a : a.buffer),
            l = c.length;
          for (this._length += e.byteLength, t = 64; t <= l; t += 64)
            n(this._hash, r(c.subarray(t - 64, t)));
          return (
            (this._buff =
              t - 64 < l
                ? new Uint8Array(c.buffer.slice(t - 64))
                : new Uint8Array(0)),
            this
          );
        }),
        (u.ArrayBuffer.prototype.end = function (e) {
          var t,
            n,
            i = this._buff,
            r = i.length,
            o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (t = 0; t < r; t += 1) o[t >> 2] |= i[t] << (t % 4 << 3);
          return (
            this._finish(o, r),
            (n = a(this._hash)),
            e && (n = l(n)),
            this.reset(),
            n
          );
        }),
        (u.ArrayBuffer.prototype.reset = function () {
          return (
            (this._buff = new Uint8Array(0)),
            (this._length = 0),
            (this._hash = [1732584193, -271733879, -1732584194, 271733878]),
            this
          );
        }),
        (u.ArrayBuffer.prototype.getState = function () {
          var e,
            t = u.prototype.getState.call(this);
          return (
            (t.buff =
              ((e = t.buff),
              String.fromCharCode.apply(null, new Uint8Array(e)))),
            t
          );
        }),
        (u.ArrayBuffer.prototype.setState = function (e) {
          return (
            (e.buff = (function (e, t) {
              var n,
                i = e.length,
                r = new ArrayBuffer(i),
                o = new Uint8Array(r);
              for (n = 0; n < i; n += 1) o[n] = e.charCodeAt(n);
              return t ? o : r;
            })(e.buff, !0)),
            u.prototype.setState.call(this, e)
          );
        }),
        (u.ArrayBuffer.prototype.destroy = u.prototype.destroy),
        (u.ArrayBuffer.prototype._finish = u.prototype._finish),
        (u.ArrayBuffer.hash = function (e, t) {
          var i = a(
            (function (e) {
              var t,
                i,
                o,
                s,
                a,
                c,
                l = e.length,
                u = [1732584193, -271733879, -1732584194, 271733878];
              for (t = 64; t <= l; t += 64) n(u, r(e.subarray(t - 64, t)));
              for (
                e = t - 64 < l ? e.subarray(t - 64) : new Uint8Array(0),
                  i = e.length,
                  o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  t = 0;
                t < i;
                t += 1
              )
                o[t >> 2] |= e[t] << (t % 4 << 3);
              if (((o[t >> 2] |= 128 << (t % 4 << 3)), t > 55))
                for (n(u, o), t = 0; t < 16; t += 1) o[t] = 0;
              return (
                (s = (s = 8 * l).toString(16).match(/(.*?)(.{0,8})$/)),
                (a = parseInt(s[2], 16)),
                (c = parseInt(s[1], 16) || 0),
                (o[14] = a),
                (o[15] = c),
                n(u, o),
                u
              );
            })(new Uint8Array(e))
          );
          return t ? l(i) : i;
        }),
        u
      );
    })();
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.queueNotification = void 0);
    const i = n(31),
      r = new Array(0);
    let o = null,
      s = !1;
    class a {
      constructor(e) {
        (this.message = e),
          (this.displayed = !1),
          (this.id = i.uuidv4()),
          (this.isModeMessage = -1 !== e.search('Mode')),
          (this.timeoutID = -1);
      }
      setTimeoutId(e) {
        this.timeoutID = Math.max(e, -1);
      }
      display() {
        this.displayed = !0;
      }
      getId() {
        return this.id;
      }
    }
    function c(e) {
      document.getElementById(e).remove(),
        null !== o && o.getId() === e && (o = null),
        r.length > 0
          ? l()
          : 0 === document.querySelectorAll('.neon-notification').length &&
            ((document.getElementById('notification-content').style.display =
              'none'),
            (s = !1));
    }
    function l() {
      if (r.length > 0) {
        s = !0;
        const e = r.pop();
        !(function (e) {
          if (e.isModeMessage) {
            if (null !== o)
              return (
                window.clearTimeout(o.timeoutID), r.push(e), void c(o.getId())
              );
            o = e;
          }
          const t = document.getElementById('notification-content'),
            n = document.createElement('div');
          n.classList.add('neon-notification'),
            (n.id = e.getId()),
            (n.innerHTML = e.message),
            t.append(n),
            (t.style.display = ''),
            e.display();
        })(e),
          e.setTimeoutId(window.setTimeout(c, 5e3, e.getId())),
          document.getElementById(e.getId()).addEventListener('click', () => {
            window.clearTimeout(e.timeoutID), c(e.getId());
          });
      }
    }
    t.queueNotification = function (e) {
      const t = new a(e);
      r.push(t),
        (!s ||
          document
            .getElementById('notification-content')
            .querySelectorAll('.neon-notification').length < 3) &&
          l();
    };
  },
  function (e, t) {
    e.exports = d3;
  },
  function (e, t, n) {
    'use strict';
    function i(e, t, n) {
      var i = n[n.length - 1];
      e === i.element && (n.pop(), (i = n[n.length - 1]));
      var r = i.element,
        o = i.index;
      if (Array.isArray(r)) r.push(e);
      else if (o === t.length - 2) {
        r[t.pop()] = e;
      } else t.push(e);
    }
    (t.stringify = function (e) {
      var t = [];
      t.push({ obj: e });
      for (var n, i, r, o, s, a, c, l, u, d, h = ''; (n = t.pop()); )
        if (((i = n.obj), (h += n.prefix || ''), (r = n.val || ''))) h += r;
        else if ('object' != typeof i)
          h += void 0 === i ? null : JSON.stringify(i);
        else if (null === i) h += 'null';
        else if (Array.isArray(i)) {
          for (t.push({ val: ']' }), o = i.length - 1; o >= 0; o--)
            (s = 0 === o ? '' : ','), t.push({ obj: i[o], prefix: s });
          t.push({ val: '[' });
        } else {
          for (c in ((a = []), i)) i.hasOwnProperty(c) && a.push(c);
          for (t.push({ val: '}' }), o = a.length - 1; o >= 0; o--)
            (u = i[(l = a[o])]),
              (d = o > 0 ? ',' : ''),
              (d += JSON.stringify(l) + ':'),
              t.push({ obj: u, prefix: d });
          t.push({ val: '{' });
        }
      return h;
    }),
      (t.parse = function (e) {
        for (var t, n, r, o, s, a, c, l, u, d = [], h = [], f = 0; ; )
          if ('}' !== (t = e[f++]) && ']' !== t && void 0 !== t)
            switch (t) {
              case ' ':
              case '\t':
              case '\n':
              case ':':
              case ',':
                break;
              case 'n':
                (f += 3), i(null, d, h);
                break;
              case 't':
                (f += 3), i(!0, d, h);
                break;
              case 'f':
                (f += 4), i(!1, d, h);
                break;
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
              case '-':
                for (n = '', f--; ; ) {
                  if (((r = e[f++]), !/[\d\.\-e\+]/.test(r))) {
                    f--;
                    break;
                  }
                  n += r;
                }
                i(parseFloat(n), d, h);
                break;
              case '"':
                for (
                  o = '', s = void 0, a = 0;
                  '"' !== (c = e[f++]) || ('\\' === s && a % 2 == 1);

                )
                  (o += c), '\\' === (s = c) ? a++ : (a = 0);
                i(JSON.parse('"' + o + '"'), d, h);
                break;
              case '[':
                (l = { element: [], index: d.length }),
                  d.push(l.element),
                  h.push(l);
                break;
              case '{':
                (u = { element: {}, index: d.length }),
                  d.push(u.element),
                  h.push(u);
                break;
              default:
                throw new Error('unexpectedly reached end of input: ' + t);
            }
          else {
            if (1 === d.length) return d.pop();
            i(d.pop(), d, h);
          }
      });
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.hotkeysModal =
        t.editTextModal =
        t.groupingMenu =
        t.clefActionContents =
        t.splitActionContents =
        t.accidActionContents =
        t.layerElementInActionContents =
        t.layerElementOutActionContents =
        t.custosActionContents =
        t.defaultSylActionContents =
        t.defaultActionContents =
        t.staffActionContents =
        t.neumeActionContents =
        t.defaultNeumeActionContents =
        t.ncActionContents =
        t.editControlsPanel =
        t.insertControlsPanel =
        t.insertTabHtml =
          void 0),
      (t.insertTabHtml = {
        primitiveTab:
          '<p class="insert-element-container">\n            <button id="punctum" class="side-panel-btn insertel smallel" aria-label="punctum" title="punctum"><img src="/Neon/Neon-gh/assets/img/punctum.png" class="image"/></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="virga" class="side-panel-btn insertel smallel" aria-label="virga" title="virga"><img src="/Neon/Neon-gh/assets/img/virga.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="virgaReversed" class="side-panel-btn insertel smallel" aria-label="Reversed Virga" title="Reversed Virga"><img src="/Neon/Neon-gh/assets/img/virga_reversed.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="diamond" class="side-panel-btn insertel smallel" aria-label="inclinatum" title="inclinatum"><img src="/Neon/Neon-gh/assets/img/diamond.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="custos" class="side-panel-btn insertel smallel" aria-label="custos" title="custos"><img src="/Neon/Neon-gh/assets/img/custos.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="cClef" class="side-panel-btn insertel smallel" aria-label="C Clef" title=" C Clef"><img src="/Neon/Neon-gh/assets/img/cClef.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="fClef" class="side-panel-btn insertel smallel" aria-label="F Clef" title="F Clef"><img src="/Neon/Neon-gh/assets/img/fClef.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="liquescentA" class="side-panel-btn insertel smallel" aria-label="Liquescent A" title="Liquescent A"><img src="/Neon/Neon-gh/assets/img/liquescentA.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="liquescentC" class="side-panel-btn insertel smallel" aria-label="Liquescent C" title="Liquescent C"><img src="/Neon/Neon-gh/assets/img/liquescentC.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="flat" class="side-panel-btn insertel smallel" aria-label="Flat" title="Flat"><img src="/Neon/Neon-gh/assets/img/accidFlat.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="natural" class="side-panel-btn insertel smallel" aria-label="Natural" title="Natural"><img src="/Neon/Neon-gh/assets/img/accidNatural.png" class="image"></button>\n        </p> \n        <p class="insert-element-container">\n            <button id="divLineMaxima" class="side-panel-btn insertel smallel" aria-label="DivLine Maxima" title="DivLine Maxima"><img src="/Neon/Neon-gh/assets/img/divisio.png" class="image"></button>\n        </p>',
        groupingTab:
          '<p class="insert-element-container">\n            <button id="pes" class="side-panel-btn insertel smallel" aria-label="pes" title="pes"><img src="/Neon/Neon-gh/assets/img/pes.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="clivis" class="side-panel-btn insertel smallel" aria-label="clivis" title="clivis"><img src="/Neon/Neon-gh/assets/img/clivis.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="scandicus" class="side-panel-btn insertel smallel" aria-label="scandicus" title="scandicus"><img src="/Neon/Neon-gh/assets/img/scandicus.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="climacus" class="side-panel-btn insertel smallel" aria-label="climacus" title="climacus"><img src="/Neon/Neon-gh/assets/img/climacus.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="torculus" class="side-panel-btn insertel smallel" aria-label="toculus" title="toculus"><img src="/Neon/Neon-gh/assets/img/torculus.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="porrectus" class="side-panel-btn insertel smallel" aria-label="porrectus" title="porrectus"><img src="/Neon/Neon-gh/assets/img/porrectus.png" class="image"></button>\n        </p>\n        <p class="insert-element-container">\n            <button id="pressus" class="side-panel-btn insertel smallel" aria-label="pressus" title="pressus"><img src="/Neon/Neon-gh/assets/img/pressus.png" class="image"></button>\n        </p>',
        systemTab:
          '<p class="insert-element-container">\n            <button id="staff" class="side-panel-btn insertel longel" aria-label="system" title="system"><img src="/Neon/Neon-gh/assets/img/staff.png" class="image"></button>\n        </p>\n        <p>Click upper left and lower right corners of new staff.</p>',
      }),
      (t.insertControlsPanel =
        '<div class="panel-heading" id="insertMenu">\n        <div class="panel-heading-title">INSERT</div>\n        <svg class="icon is-pulled-right">\n            <use id="toggleInsert" xlink:href="/Neon/Neon-gh/assets/img/icons.svg#dropdown-down"></use>\n        </svg>\n    </div>\n\t<div class="panel-content-subsection first-subsection">\n        <div id="insertContents" class="panel-contents" style="overflow-y: hidden;">\n            <p class="panel-tabs">\n                <a id="primitiveTab" class="insertTab">Primitive Elements</a>\n                <a id="groupingTab" class="insertTab">Grouping</a>\n                <a id="systemTab" class="insertTab">System</a>\n            </p>\n            <div id="insert_data"></div>\n        </div>\n    </div>'),
      (t.editControlsPanel =
        '<div class="panel-heading" id="editMenu">\n        <div class="panel-heading-title focused">EDIT</div>\n        <svg class="icon is-pulled-right">\n            <use id="toggleEdit" xlink:href="/Neon/Neon-gh/assets/img/icons.svg#dropdown-down"></use>\n        </svg>\n    </div>\n    <div id="editContents" class="panel-contents">\n        <div class="panel-content-subsection first-subsection">\n            <div id="selection-mode-container">\n                <div class="panel-sub-title">Selection Mode:</div>\n                <div id="selection-mode-btns-container"  class="right-side-panel-btns-container" style="overflow-x: auto;">\n                    \n                        <button class="side-panel-btn sel-by is-active" id="selBySyllable">Syllable</button>\n                        <button class="side-panel-btn sel-by" id="selByNeume">Neume</button>\n                        <button class="side-panel-btn sel-by" id="selByNc">Neume Component</button>\n                        <button class="side-panel-btn sel-by" id="selByStaff">Staff</button>\n                        <button class="side-panel-btn sel-by" id="selByLayerElement">Layer Element</button>\n                    \n                </div>\n            </div>\n        </div>\n\n        <div id="display-actions-container">\n                <div class="panel-content-subsection hidden">\n                    <div id="moreEdit"></div>\n                </div>\n                <div class="panel-content-subsection hidden">\n                    <div id="extraEdit"></div>\n                </div>\n                    \x3c!--\n                    * The extraEdit panel is added for edit options that have dropdown menus\n                    * Like the Neume and Clef menus\n                    * This is done because the moreEdit menu needs to have overflow for cases where it has lots of buttons\n                    * But overflow ruins dropdown menus\n                    --\x3e\n                <div class="panel-content-subsection hidden">\n                    <div id="neumeEdit"></div>\n                </div>\n                <div class="panel-content-subsection">\n                    <div id="undoRedo_controls"></div>\n                </div>\n        </div>\n    </div>'),
      (t.ncActionContents =
        '<label>Change Head Shape:</label>\n    <div id="drop_select" class="dropdown">\n        <div class="dropdown-trigger">\n            <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">\n                <span>Head Shapes</span>\n                <svg class="icon"><use xlink:href="/Neon/Neon-gh/assets/img/icons.svg#dropdown-down"></use></svg>\n            </button>\n        </div>\n        <div class="dropdown-menu" id="dropdown-menu" role="menu">\n            <div class="dropdown-content">\n                <a id="Punctum" class="dropdown-item">Punctum</a>\n                <a id="Virga" class="dropdown-item">Virga</a> \n                <a id="VirgaReversed" class="dropdown-item">Reversed Virga</a>\n                <a id="LiquescentClockwise" class="dropdown-item">Liquescent C</a>\n                <a id="LiquescentAnticlockwise" class="dropdown-item">Liquescent A</a>\n                <a id="Inclinatum" class="dropdown-item">Inclinatum</a>\n            </div>\n        </div>\n    </div>'),
      (t.defaultNeumeActionContents =
        '<div class="right-side-panel-btns-container">\n        <button class="side-panel-btn" id="delete">Delete</button>\n        <button class="side-panel-btn" id="split-neume">Split Neumes</button>\n    </div>'),
      (t.neumeActionContents =
        '<label>Grouping Options:</label>\n    <div class="right-side-panel-btns-container">\n        <div id="drop_select" class="dropdown">\n            <div class="dropdown-trigger">\n                <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">\n                    <span>Groupings</span>\n                    <svg class="icon">\n                        <use xlink:href="/Neon/Neon-gh/assets/img/icons.svg#dropdown-down"></use>\n                    </svg>\n                </button>\n            </div>\n            <div class="dropdown-menu" id="dropdown-menu" role="menu">\n            <div class="dropdown-content scrollable-dropdown">\n                <a id="Pes" class="dropdown-item grouping">Pes</a>\n                <a id="PesSubpunctis" class="dropdown-item grouping">Pes Subpunctis</a>\n                <a id="Clivis" class="dropdown-item grouping">Clivis</a>\n                <a id="Scandicus" class="dropdown-item grouping">Scandicus</a>\n                <a id="ScandicusFlexus" class="dropdown-item grouping">Scandicus Flexus</a>\n                <a id="ScandicusSubpunctis" class="dropdown-item grouping">Scandicus Subpunctis</a>\n                <a id="Climacus" class="dropdown-item grouping">Climacus</a>\n                <a id="ClimacusResupinus" class="dropdown-item grouping">Climacus Resupinus</a>\n                <a id="Torculus" class="dropdown-item grouping">Torculus</a>\n                <a id="TorculusResupinus" class="dropdown-item grouping">Torculus Resupinus</a>\n                <a id="Porrectus" class="dropdown-item grouping">Porrectus</a>\n                <a id="PorrectusFlexus" class="dropdown-item grouping">Porrectus Flexus</a>\n                <a id="PorrectusSubpunctis" class="dropdown-item grouping">Porrectus Subpunctis</a>\n                <a id="Pressus" class="dropdown-item grouping">Pressus</a>\n            </div>\n        </div>\n    </div>\n    <button class="side-panel-btn" id="ungroupNcs">Ungroup</button>'),
      (t.staffActionContents =
        '<label>Merge Systems:</label>\n    <button id="merge-systems" class="side-panel-btn">Merge</button>\n    <button class="side-panel-btn" id="delete">Delete</button>'),
      (t.defaultActionContents =
        '<div class="right-side-panel-btns-container">\n        <button class="side-panel-btn" id="delete">Delete</button>\n    </div>'),
      (t.defaultSylActionContents =
        '<button class="side-panel-btn" id="delete">Delete</button>\n    <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>'),
      (t.custosActionContents =
        '<div class="right-side-panel-btns-container">\n        <button class="side-panel-btn" id="delete">Delete</button>\n        <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>\n    </div>'),
      (t.layerElementOutActionContents =
        '<div class="right-side-panel-btns-container">\n        <button class="side-panel-btn" id="delete">Delete</button>\n        <button class="side-panel-btn" id="insertToSyllable">Insert to nearest syllable</button>\n        <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>\n    </div>'),
      (t.layerElementInActionContents =
        '<div class="right-side-panel-btns-container">\n        <button class="side-panel-btn" id="delete">Delete</button>\n        <button class="side-panel-btn" id="moveOuttaSyllable">Move out of syllable</button>\n        <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>\n    </div>'),
      (t.accidActionContents =
        '<label>Change Accidental:</label>\n    <div id="drop_select" class="dropdown">\n        <div class="dropdown-trigger"overflow="auto">\n            <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">\n                <span>Shapes</span>\n                <svg class="icon"><use xlink:href="/Neon/Neon-gh/assets/img/icons.svg#dropdown-down"></use></svg>\n            </button>\n        </div>\n        <div class="dropdown-menu" id="dropdown-menu" role="menu">\n            <div class="dropdown-content">\n                <a id="ChangeToFlat" class="dropdown-item">Flat</a>\n                <a id="ChangeToNatural" class="dropdown-item">Natural</a>\n            </div>\n        </div>\n    </div>'),
      (t.splitActionContents =
        '<div>Split System:</div>\n    <div id="split-system-btns-container" class="right-side-panel-btns-container">\n        <button id="split-system" class="side-panel-btn">Split</button>\n        <button id="reset-rotate" class="side-panel-btn">Reset Rotate</button>\n        <button class="side-panel-btn" id="delete">Delete</button>\n    </div>'),
      (t.clefActionContents =
        '<label>Change Clef Shape:&nbsp;</label>\n    <div id="drop_select" class="dropdown">\n        <div class="dropdown-trigger"overflow="auto">\n            <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">\n                <span>Clef Shapes</span>\n                <svg class="icon"><use xlink:href="/Neon/Neon-gh/assets/img/icons.svg#dropdown-down"></use></svg>\n            </button>\n        </div>\n        <div class="dropdown-menu" id="dropdown-menu" role="menu">\n            <div class="dropdown-content">\n                <a id="CClef" class="dropdown-item">C Clef</a>\n                <a id="FClef" class="dropdown-item">F Clef</a>\n            </div>\n        </div>\n    </div>'),
      (t.groupingMenu = {
        nc: '<div class="more-edit-btn panel-btn">\n            <div class="right-side-panel-btns-container">\n                <button class="side-panel-btn more-edit-btn" id="groupNcs">Group Neume Components</button>\n                <button class="side-panel-btn" id="delete">Delete</button>\n            </div>\n        </div>',
        neume:
          '<div class="more-edit-btn panel-btn">\n            <div class="right-side-panel-btns-container">\n                <button class="side-panel-btn" id="groupNeumes">Group Neumes</button>\n                <button class="side-panel-btn" id="delete">Delete</button>\n            </div>\n        </div>',
        syl: '<div class="more-edit-btn panel-btn">\n            <div class="right-side-panel-btns-container">\n                <button class="side-panel-btn" id="mergeSyls">Merge Syllables</button>\n                <button class="side-panel-btn" id="delete">Delete</button>\n                <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>\n            </div>\n\t\t</div>',
        ligatureNc:
          '<div class="more-edit-btn panel-btn">\n                    <div class="right-side-panel-btns-container">\n                        <button class="side-panel-btn" id="groupNcs">Group Neume Components</button>\n                        <button class="side-panel-btn" id="toggle-ligature">Toggle Ligature</button>\n                        <button class="side-panel-btn" id="delete">Delete</button>\n                    </div>\n                </div>',
        ligature:
          '<div class="more-edit-btn panel-btn">\n                <div class="right-side-panel-btns-container">\n                    <button class="side-panel-btn" id="toggle-ligature">Toggle Ligature</button>\n                    <button class="side-panel-btn" id="delete">Delete</button>\n                </div>\n            </div>',
        splitSyllable:
          '<div class="more-edit-btn panel-btn">\n                    <div class="right-side-panel-btns-container">\n                        <button class="side-panel-btn" id="toggle-link">Toggle Linked Syllables</button>\n                        <button class="side-panel-btn" id="delete">Delete</button>\n                    </div>\n                </div>',
      }),
      (t.editTextModal =
        '<div class="neon-modal-window-content" id="neon-modal-window-content-edit-text">\n        <label for="neon-modal-window-edit-text-input" id="neon-modal-window-edit-text-label">Enter Syllable Text:</label>\n        <input id="neon-modal-window-edit-text-input" type="text">\n        <div id="neon-modal-window-edit-text-btns">\n        <div class="neon-modal-window-btn" id="neon-modal-window-edit-text-cancel">Cancel</div>\n        <div class="neon-modal-window-btn" id="neon-modal-window-edit-text-save">Save</div>        \n        </div>\n    </div>'),
      (t.hotkeysModal =
        '<div class="neon-modal-window-content" id="neon-modal-window-content-hotkeys">\n\n        \x3c!-- "Display" hotkeys --\x3e\n        <div class="hotkey-subcategory-container">\n\n            <div class="hotkey-subcategory-title">Display</div>\n            <div class="hotkey-entry-container">\n                <div class="hotkey-container">\n                    <div class="hotkey-entry">Shift</div>\n                    <div>+</div>\n                    <div class="hotkey-entry">+</div>\n                </div>\n                <div class="hotkey-entry-description">Zoom In</div>        \n            </div>\n            <div class="hotkey-entry-container">\n            <div class="hotkey-container">\n                <div class="hotkey-entry">Shift</div>\n                <div>+</div>\n                <div class="hotkey-entry">-</div>\n            </div>\n            <div class="hotkey-entry-description">Zoom Out</div>\n            </div>\n            <div class="hotkey-entry-container">\n            <div class="hotkey-container">\n                <div class="hotkey-entry">0</div>\n            </div>\n            <div class="hotkey-entry-description">Zoom Reset</div>\n            </div>\n            <div class="hotkey-entry-container">\n            <div class="hotkey-container">\n                <div class="hotkey-entry">h</div>\n            </div>\n            <div class="hotkey-entry-description">Hide Glyph</div>        \n            </div>\n\n        </div>\n\n\n        \x3c!-- "Edit" hotkeys --\x3e\n        <div class="hotkey-subcategory-container">\n\n            <div class="hotkey-subcategory-title">Edit</div>\n            <div class="hotkey-entry-container">\n            <div class="hotkey-container">\n                <div class="hotkey-entry">Ctrl</div>\n                <div>+</div>\n                <div class="hotkey-entry">z</div>\n                <div>or</div>\n                <div class="hotkey-entry">⌘</div>\n                <div>+</div>\n                <div class="hotkey-entry">z</div>\n            </div>\n            <div class="hotkey-entry-description">Undo</div>\n            </div>\n            <div class="hotkey-entry-container">\n            <div class="hotkey-container">\n                <div class="hotkey-entry">Ctrl</div>\n                <div>+</div>\n                <div class="hotkey-entry">Shift</div>\n                <div>+</div>\n                <div class="hotkey-entry">z</div>\n                <div>or</div>\n                <div class="hotkey-entry">⌘</div>\n                <div>+</div> \n                <div class="hotkey-entry">Shift</div>\n                <div>+</div>\n                <div class="hotkey-entry">z</div>\n            </div>\n            <div class="hotkey-entry-description">Redo</div>\n            </div>\n            <div class="hotkey-entry-container">\n            <div class="hotkey-container">\n                <div class="hotkey-entry">1/2/3/4</div>\n            </div>\n            <div class="hotkey-entry-description">Select by Syllable/Neume/Neume Component/Staff</div>        \n            </div>\n            <div class="hotkey-entry-container">\n            <div class="hotkey-container">\n                <div class="hotkey-entry">Shift</div>\n                <div>+</div>\n                <div class="hotkey-entry">Number</div>\n            </div>\n            <div class="hotkey-entry-description">Begin Insert for the <i>nth</i> option in the selected tab</div>\n            </div>\n        </div>\n\n\n        \x3c!-- "Other" hotkeys --\x3e\n        <div class="hotkey-subcategory-container">\n\n            <div class="hotkey-subcategory-title">Other</div>\n\n            <div class="hotkey-entry-container">\n            <div class="hotkey-container">\n                <div class="hotkey-entry">s</div>\n            </div>\n            <div class="hotkey-entry-description">Save File</div>        \n            </div>\n            \n            <div class="hotkey-entry-container">\n            <div class="hotkey-container">\n                <div class="hotkey-entry">Esc</div>\n            </div>\n            <div class="hotkey-entry-description">Return to Edit Mode</div>        \n            </div>\n        </div>\n    </div>');
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.initDisplayControls =
        t.updateHighlight =
        t.setHighlightSelectionControls =
        t.setHighlightControls =
        t.setOpacityFromSlider =
        t.setZoomControls =
          void 0);
    const i = n(18);
    let r, o;
    function s(e) {
      const t = document.getElementById('opacityOutput');
      t.value = document.getElementById('opacitySlider').value;
      try {
        document.querySelectorAll('.' + e).forEach((e) => {
          e.style.opacity = (Number(t.value) / 100).toString();
        });
      } catch (e) {
        console.warn('Unable to properly set opacity to pages');
      }
    }
    function a(e, t, n) {
      const r = document.getElementById('highlight-' + e),
        o = document.getElementById('highlight-dropdown'),
        s = document.getElementById('highlight-type');
      if (
        (o.classList.remove('is-active'),
        document.querySelectorAll('.highlight-selected').forEach((e) => {
          e.classList.remove('highlight-selected');
        }),
        'none' === e)
      )
        return (s.textContent = ' - Off'), void i.unsetGroupingHighlight();
      r.classList.add('highlight-selected'),
        (s.textContent = ' - ' + n),
        i.setGroupingHighlight(t);
    }
    function c(e, t, n) {
      document
        .getElementById('highlight-' + e)
        .addEventListener('click', () => {
          a(e, t, n);
        });
    }
    function l() {
      document.body.removeEventListener('click', l),
        document
          .getElementById('highlight-dropdown')
          .classList.remove('is-active');
    }
    function u() {
      const e = document.getElementById('highlight-dropdown');
      document
        .getElementById('highlight-button')
        .addEventListener('click', (t) => {
          t.stopPropagation(),
            e.classList.toggle('is-active'),
            e.classList.contains('is-active')
              ? (document.body.addEventListener('click', l),
                c('staff', 'staff', 'Staff'),
                c('syllable', 'syllable', 'Syllable'),
                c('neume', 'neume', 'Neume'),
                c('layerElement', 'layer', 'LayerElement'),
                c('none', 'none', 'Off'))
              : document.body.removeEventListener('click', l);
        });
    }
    (t.setZoomControls = function (e) {
      if (void 0 === e) return;
      const t = document.getElementById('zoomSlider'),
        n = document.getElementById('zoomOutput');
      (t.value = '100'),
        document.getElementById('reset-zoom').addEventListener('click', () => {
          (n.value = '100'), (t.value = '100'), e.resetZoomAndPan();
        }),
        t.addEventListener('mouseup', function () {
          (n.value = t.value), e.zoomTo(Number(n.value) / 100);
        }),
        (t.disabled = !1),
        document.body.addEventListener('keydown', (i) => {
          const r = parseInt(n.value);
          if (
            'ArrowUp' === i.key ||
            'ArrowDown' === i.key ||
            'ArrowRight' === i.key ||
            'ArrowLeft' === i.key
          )
            i.preventDefault();
          else if ('+' === i.key) {
            const i = Math.min(r + 20, parseInt(t.getAttribute('max')));
            e.zoomTo(i / 100), (n.value = String(i)), (t.value = String(i));
          } else if ('_' === i.key) {
            const i = Math.max(r - 20, parseInt(t.getAttribute('min')));
            e.zoomTo(i / 100), (n.value = String(i)), (t.value = String(i));
          } else
            '0' === i.key &&
              ((n.value = '100'), (t.value = '100'), e.resetZoomAndPan());
        });
    }),
      (t.setOpacityFromSlider = s),
      (t.setHighlightControls = u),
      (t.setHighlightSelectionControls = function () {
        const e = document.getElementById('highlight-selection');
        e.addEventListener('click', () => {
          document
            .getElementById('highlight-dropdown')
            .classList.remove('is-active'),
            document.querySelectorAll('.highlight-selected').forEach((e) => {
              e.classList.remove('highlight-selected');
            }),
            e.classList.add('highlight-selected'),
            (document.getElementById('highlight-type').textContent =
              ' - Selection'),
            i.setGroupingHighlight('selection');
        });
      }),
      (t.updateHighlight = function () {
        let e;
        try {
          e = document.querySelector('.highlight-selected').id;
        } catch (t) {
          e = '';
        }
        switch (e) {
          case 'highlight-staff':
            i.setGroupingHighlight('staff');
            break;
          case 'highlight-syllable':
            i.setGroupingHighlight('syllable');
            break;
          case 'highlight-neume':
            i.setGroupingHighlight('neume');
            break;
          case 'highlight-layerElement':
            i.setGroupingHighlight('layer');
            break;
          case 'highlight-selection':
            i.setGroupingHighlight('selection');
            break;
          default:
            i.unsetGroupingHighlight();
        }
      }),
      (t.initDisplayControls = function (e, t) {
        !(function (e) {
          r = 100;
          const t = document.getElementById('opacitySlider'),
            n = document.getElementById('opacityOutput');
          function i() {
            (n.value = t.value), (r = Number(t.value)), s(e);
          }
          (t.value = '100'),
            document
              .getElementById('reset-opacity')
              .addEventListener('click', () => {
                const i = r < 95 ? r / 100 : 0,
                  o = '100' === t.value ? i : 1;
                document.querySelectorAll('.' + e).forEach((e) => {
                  e.style.opacity = o.toString();
                }),
                  (r = Number(t.value)),
                  (t.value = String(100 * o)),
                  (n.value = String(Math.round(100 * o)));
              }),
            t.addEventListener('input', i),
            t.addEventListener('change', i),
            (t.disabled = !1);
        })(e),
          (function (e) {
            o = 100;
            const t = document.getElementById('bgOpacitySlider'),
              n = document.getElementById('bgOpacityOutput');
            function i() {
              (n.value = t.value),
                (o = Number(t.value)),
                (document.getElementsByClassName(e)[0].style.opacity = (
                  Number(n.value) / 100
                ).toString());
            }
            (t.value = '100'),
              document
                .getElementById('reset-bg-opacity')
                .addEventListener('click', () => {
                  const i = o < 95 ? o / 100 : 0,
                    r = '100' === t.value ? i : 1;
                  (document.getElementsByClassName(e)[0].style.opacity =
                    r.toString()),
                    (o = Number(t.value)),
                    (t.value = String(100 * r)),
                    (n.value = String(Math.round(100 * r)));
                }),
              t.addEventListener('input', i),
              t.addEventListener('change', i),
              (t.disabled = !1);
          })(t),
          u(),
          document
            .getElementById('burgerMenu')
            .addEventListener('click', () => {
              document
                .getElementById('burgerMenu')
                .classList.toggle('is-active'),
                document
                  .getElementById('navMenu')
                  .classList.toggle('is-active');
            }),
          document.body.addEventListener('keydown', (e) => {
            switch (e.key) {
              case 'q':
                a('staff', 'staff', 'Staff');
                break;
              case 'w':
                a('syllable', 'syllable', 'Syllable');
                break;
              case 'e':
                a('neume', 'neume', 'Neume');
                break;
              case 'r':
                a('layerElement', 'layer', 'LayerElement');
                break;
              case 't':
                a('selection', 'selection', 'Selection');
                break;
              case 'y':
                a('none', 'none', 'highlight-none');
            }
          }),
          (function () {
            const e = document.querySelector('#display-all-btn');
            e.addEventListener('click', () => {
              if (e.classList.contains('selected')) {
                e.classList.remove('selected'), (e.innerHTML = 'Display All');
                const t = document.querySelectorAll(
                  '.checkbox-container > .checkbox'
                );
                Array.from(t).forEach((e) => {
                  e.checked && e.click();
                });
              } else {
                e.classList.add('selected'), (e.innerHTML = 'Hide All');
                const t = document.querySelectorAll(
                  '.checkbox-container > .checkbox'
                );
                Array.from(t).forEach((e) => {
                  e.checked || e.click();
                });
              }
            });
          })();
        const n = document.getElementById('displayContents'),
          i = document.getElementById('toggleDisplay');
        document
          .getElementById('displayHeader')
          .addEventListener('click', (e) => {
            e.stopPropagation(),
              n.classList.contains('closed')
                ? (n.classList.remove('closed'),
                  (n.style.padding = '0.5em 0.75em'),
                  setTimeout(() => {
                    n.style.overflow = 'visible';
                  }, 200),
                  i.setAttribute(
                    'xlink:href',
                    '/Neon/Neon-gh/assets/img/icons.svg#dropdown-down'
                  ))
                : (n.classList.add('closed'),
                  (n.style.overflow = 'hidden'),
                  setTimeout(() => {
                    n.style.padding = '0px';
                  }, 200),
                  i.setAttribute(
                    'xlink:href',
                    '/Neon/Neon-gh/assets/img/icons.svg#dropdown-side'
                  ));
          });
      });
  },
  function (e, t, n) {
    'use strict';
    var i = n(32),
      r = (t.ValidationError = function (e, t, n, i, r, o) {
        i && (this.property = i),
          e && (this.message = e),
          n && (n.id ? (this.schema = n.id) : (this.schema = n)),
          t && (this.instance = t),
          (this.name = r),
          (this.argument = o),
          (this.stack = this.toString());
      });
    r.prototype.toString = function () {
      return this.property + ' ' + this.message;
    };
    var o = (t.ValidatorResult = function (e, t, n, i) {
      (this.instance = e),
        (this.schema = t),
        (this.propertyPath = i.propertyPath),
        (this.errors = []),
        (this.throwError = n && n.throwError),
        (this.disableFormat = n && !0 === n.disableFormat);
    });
    function s(e, t) {
      return t + ': ' + e.toString() + '\n';
    }
    (o.prototype.addError = function (e) {
      var t;
      if ('string' == typeof e)
        t = new r(e, this.instance, this.schema, this.propertyPath);
      else {
        if (!e) throw new Error('Missing error detail');
        if (!e.message) throw new Error('Missing error message');
        if (!e.name) throw new Error('Missing validator type');
        t = new r(
          e.message,
          this.instance,
          this.schema,
          this.propertyPath,
          e.name,
          e.argument
        );
      }
      if (this.throwError) throw t;
      return this.errors.push(t), t;
    }),
      (o.prototype.importErrors = function (e) {
        'string' == typeof e || (e && e.validatorType)
          ? this.addError(e)
          : e && e.errors && Array.prototype.push.apply(this.errors, e.errors);
      }),
      (o.prototype.toString = function (e) {
        return this.errors.map(s).join('');
      }),
      Object.defineProperty(o.prototype, 'valid', {
        get: function () {
          return !this.errors.length;
        },
      });
    var a = (t.SchemaError = function e(t, n) {
      (this.message = t),
        (this.schema = n),
        Error.call(this, t),
        Error.captureStackTrace(this, e);
    });
    a.prototype = Object.create(Error.prototype, {
      constructor: { value: a, enumerable: !1 },
      name: { value: 'SchemaError', enumerable: !1 },
    });
    var c = (t.SchemaContext = function (e, t, n, i, r) {
      (this.schema = e),
        (this.options = t),
        (this.propertyPath = n),
        (this.base = i),
        (this.schemas = r);
    });
    (c.prototype.resolve = function (e) {
      return i.resolve(this.base, e);
    }),
      (c.prototype.makeChild = function (e, t) {
        var n = void 0 === t ? this.propertyPath : this.propertyPath + u(t),
          r = i.resolve(this.base, e.id || ''),
          o = new c(e, this.options, n, r, Object.create(this.schemas));
        return e.id && !o.schemas[r] && (o.schemas[r] = e), o;
      });
    var l = (t.FORMAT_REGEXPS = {
      'date-time':
        /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])[tT ](2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])(\.\d+)?([zZ]|[+-]([0-5][0-9]):(60|[0-5][0-9]))$/,
      date: /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])$/,
      time: /^(2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])$/,
      email:
        /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
      'ip-address':
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      ipv6: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
      uri: /^[a-zA-Z][a-zA-Z0-9+-.]*:[^\s]*$/,
      color:
        /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/,
      hostname:
        /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
      'host-name':
        /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
      alpha: /^[a-zA-Z]+$/,
      alphanumeric: /^[a-zA-Z0-9]+$/,
      'utc-millisec': function (e) {
        return (
          'string' == typeof e && parseFloat(e) === parseInt(e, 10) && !isNaN(e)
        );
      },
      regex: function (e) {
        var t = !0;
        try {
          new RegExp(e);
        } catch (e) {
          t = !1;
        }
        return t;
      },
      style: /\s*(.+?):\s*([^;]+);?/,
      phone: /^\+(?:[0-9] ?){6,14}[0-9]$/,
    });
    (l.regexp = l.regex),
      (l.pattern = l.regex),
      (l.ipv4 = l['ip-address']),
      (t.isFormat = function (e, t, n) {
        if ('string' == typeof e && void 0 !== l[t]) {
          if (l[t] instanceof RegExp) return l[t].test(e);
          if ('function' == typeof l[t]) return l[t](e);
        } else if (
          n &&
          n.customFormats &&
          'function' == typeof n.customFormats[t]
        )
          return n.customFormats[t](e);
        return !0;
      });
    var u = (t.makeSuffix = function (e) {
      return (e = e.toString()).match(/[.\s\[\]]/) || e.match(/^[\d]/)
        ? e.match(/^\d+$/)
          ? '[' + e + ']'
          : '[' + JSON.stringify(e) + ']'
        : '.' + e;
    });
    function d(e, t, n, i) {
      'object' == typeof n
        ? (t[i] = p(e[i], n))
        : -1 === e.indexOf(n) && t.push(n);
    }
    function h(e, t, n) {
      t[n] = e[n];
    }
    function f(e, t, n, i) {
      'object' == typeof t[i] && t[i] && e[i]
        ? (n[i] = p(e[i], t[i]))
        : (n[i] = t[i]);
    }
    function p(e, t) {
      var n = Array.isArray(t),
        i = (n && []) || {};
      return (
        n
          ? ((e = e || []), (i = i.concat(e)), t.forEach(d.bind(null, e, i)))
          : (e &&
              'object' == typeof e &&
              Object.keys(e).forEach(h.bind(null, e, i)),
            Object.keys(t).forEach(f.bind(null, e, t, i))),
        i
      );
    }
    function g(e) {
      return '/' + encodeURIComponent(e).replace(/~/g, '%7E');
    }
    (t.deepCompareStrict = function e(t, n) {
      if (typeof t != typeof n) return !1;
      if (Array.isArray(t))
        return (
          !!Array.isArray(n) &&
          t.length === n.length &&
          t.every(function (i, r) {
            return e(t[r], n[r]);
          })
        );
      if ('object' == typeof t) {
        if (!t || !n) return t === n;
        var i = Object.keys(t),
          r = Object.keys(n);
        return (
          i.length === r.length &&
          i.every(function (i) {
            return e(t[i], n[i]);
          })
        );
      }
      return t === n;
    }),
      (e.exports.deepMerge = p),
      (t.objectGetPath = function (e, t) {
        for (
          var n, i = t.split('/').slice(1);
          'string' == typeof (n = i.shift());

        ) {
          var r = decodeURIComponent(n.replace(/~0/, '~').replace(/~1/g, '/'));
          if (!(r in e)) return;
          e = e[r];
        }
        return e;
      }),
      (t.encodePath = function (e) {
        return e.map(g).join('');
      }),
      (t.getDecimalPlaces = function (e) {
        var t = 0;
        if (isNaN(e)) return t;
        'number' != typeof e && (e = Number(e));
        var n = e.toString().split('e');
        if (2 === n.length) {
          if ('-' !== n[1][0]) return t;
          t = Number(n[1].slice(1));
        }
        var i = n[0].split('.');
        return 2 === i.length && (t += i[1].length), t;
      });
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.triggerDefaultActions =
        t.triggerDefaultSylActions =
        t.triggerSplitActions =
        t.triggerStaffSplitMode =
        t.triggerStaffActions =
        t.triggerLayerElementActions =
        t.triggerAccidActions =
        t.triggerCustosActions =
        t.triggerClefActions =
        t.triggerSyllableActions =
        t.triggerNeumeActions =
        t.triggerNcActions =
        t.addChangeStaffListener =
        t.moveOuttaSyllableHandler =
        t.insertToSyllableHandler =
        t.changeStaffHandler =
        t.removeHandler =
        t.endOptionsSelection =
        t.deleteButtonHandler =
        t.unsetLiquescentAnticlockwiseAction =
        t.unsetLiquescentClockwiseAction =
        t.unsetVirgaReversedAction =
        t.unsetVirgaAction =
        t.unsetInclinatumAction =
        t.initNeonView =
          void 0);
    const i = n(10),
      r = n(47),
      o = n(7),
      s = n(66),
      a = n(67),
      c = n(5);
    let l;
    function u(e) {
      return {
        action: 'set',
        param: { elementId: e, attrType: 'tilt', attrValue: '' },
      };
    }
    function d(e) {
      return {
        action: 'set',
        param: { elementId: e, attrType: 'tilt', attrValue: '' },
      };
    }
    function h(e) {
      return {
        action: 'set',
        param: { elementId: e, attrType: 'tilt', attrValue: '' },
      };
    }
    function f(e) {
      return {
        action: 'set',
        param: { elementId: e, attrType: 'curve', attrValue: '' },
      };
    }
    function p(e) {
      return {
        action: 'set',
        param: { elementId: e, attrType: 'curve', attrValue: '' },
      };
    }
    function g(e) {
      ('d' !== e.key && 'Backspace' !== e.key) || (m(), e.preventDefault());
    }
    function v() {
      try {
        const e = document.getElementById('moreEdit');
        (e.innerHTML = ''), e.parentElement.classList.add('hidden');
      } catch (e) {}
      document.body.removeEventListener('keydown', g);
    }
    function m() {
      const e = [];
      Array.from(document.getElementsByClassName('selected')).forEach((t) => {
        t.classList.contains('syl') && (t = t.closest('.syllable')),
          t.classList.contains('accid') && (t = t.closest('.accid')),
          t.classList.contains('divLine') && (t = t.closest('.divLine')),
          e.push({ action: 'remove', param: { elementId: t.id } });
      });
      const t = { action: 'chain', param: e };
      v(),
        l.edit(t, l.view.getCurrentPageURI()).then(() => {
          l.updateForCurrentPage();
        });
    }
    function y() {
      const e = [];
      Array.from(document.getElementsByClassName('selected')).forEach((t) => {
        e.push({ action: 'changeStaff', param: { elementId: t.id } });
      });
      const t = { action: 'chain', param: e };
      v(),
        l.edit(t, l.view.getCurrentPageURI()).then(() => {
          l.updateForCurrentPage();
        });
    }
    function b() {
      const e = [];
      Array.from(document.getElementsByClassName('selected')).forEach((t) => {
        e.push({ action: 'insertToSyllable', param: { elementId: t.id } });
      });
      const t = { action: 'chain', param: e };
      l.edit(t, l.view.getCurrentPageURI()).then((e) => {
        e
          ? o.queueNotification('Insert Success')
          : o.queueNotification('Insert Failed XoX'),
          v(),
          l.updateForCurrentPage();
      });
    }
    function w() {
      const e = [];
      Array.from(document.getElementsByClassName('selected')).forEach((t) => {
        e.push({ action: 'moveOuttaSyllable', param: { elementId: t.id } });
      });
      const t = { action: 'chain', param: e };
      l.edit(t, l.view.getCurrentPageURI()).then((e) => {
        e
          ? o.queueNotification('Move Success')
          : o.queueNotification('Move Failed XoX'),
          v(),
          l.updateForCurrentPage();
      });
    }
    function _() {
      const e = document.getElementById('delete');
      e &&
        (e.removeEventListener('click', m),
        e.addEventListener('click', m),
        document.body.addEventListener('keydown', g));
    }
    function E() {
      const e = document.getElementById('changeStaff');
      null == e || e.removeEventListener('click', y),
        null == e || e.addEventListener('click', y);
    }
    function S(e, t, n = !0) {
      const i = document.getElementById(e);
      i &&
        (i.parentElement.classList.remove('hidden'),
        n ? (i.innerHTML = t) : (i.innerHTML += t));
    }
    function x() {
      const e = document.querySelector('.staff.selected');
      if (null !== e) {
        new s.SplitStaffHandler(l, e).startSplit(), v();
      } else console.error('No staff was selected!'), v();
    }
    function L() {
      document
        .getElementById('drop_select')
        .addEventListener('click', function () {
          this.classList.toggle('is-active');
        });
    }
    (t.initNeonView = function (e) {
      (l = e), r.initNeonView(e);
    }),
      (t.unsetInclinatumAction = u),
      (t.unsetVirgaAction = d),
      (t.unsetVirgaReversedAction = h),
      (t.unsetLiquescentClockwiseAction = f),
      (t.unsetLiquescentAnticlockwiseAction = p),
      (t.deleteButtonHandler = g),
      (t.endOptionsSelection = v),
      (t.removeHandler = m),
      (t.changeStaffHandler = y),
      (t.insertToSyllableHandler = b),
      (t.moveOuttaSyllableHandler = w),
      (t.addChangeStaffListener = E),
      (t.triggerNcActions = function (e) {
        v(),
          S('moreEdit', i.defaultActionContents),
          S('extraEdit', i.ncActionContents),
          _(),
          document
            .querySelector('#Punctum.dropdown-item')
            .addEventListener('click', () => {
              const t = u(e.id),
                n = d(e.id),
                i = h(e.id),
                r = f(e.id),
                s = p(e.id);
              l.edit(
                { action: 'chain', param: [t, n, i, r, s] },
                l.view.getCurrentPageURI()
              ).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          document
            .querySelector('#Inclinatum.dropdown-item')
            .addEventListener('click', () => {
              const t = d(e.id),
                n = h(e.id),
                i = f(e.id),
                r = p(e.id),
                s = {
                  action: 'set',
                  param: { elementId: e.id, attrType: 'tilt', attrValue: 'se' },
                };
              l.edit(
                { action: 'chain', param: [t, n, i, r, s] },
                l.view.getCurrentPageURI()
              ).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          document
            .querySelector('#Virga.dropdown-item')
            .addEventListener('click', () => {
              const t = h(e.id),
                n = u(e.id),
                i = f(e.id),
                r = p(e.id),
                s = {
                  action: 'set',
                  param: { elementId: e.id, attrType: 'tilt', attrValue: 's' },
                };
              l.edit(
                { action: 'chain', param: [t, n, i, r, s] },
                l.view.getCurrentPageURI()
              ).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          document
            .querySelector('#VirgaReversed.dropdown-item')
            .addEventListener('click', () => {
              const t = u(e.id),
                n = d(e.id),
                i = f(e.id),
                r = p(e.id),
                s = {
                  action: 'set',
                  param: { elementId: e.id, attrType: 'tilt', attrValue: 'n' },
                };
              l.edit(
                { action: 'chain', param: [t, n, i, r, s] },
                l.view.getCurrentPageURI()
              ).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          document
            .querySelector('#LiquescentClockwise.dropdown-item')
            .addEventListener('click', () => {
              const t = u(e.id),
                n = d(e.id),
                i = h(e.id),
                r = p(e.id),
                s = {
                  action: 'set',
                  param: { elementId: e.id, attrType: 'curve', attrValue: 'c' },
                };
              l.edit(
                { action: 'chain', param: [t, n, i, r, s] },
                l.view.getCurrentPageURI()
              ).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          document
            .querySelector('#LiquescentAnticlockwise.dropdown-item')
            .addEventListener('click', () => {
              const t = u(e.id),
                n = d(e.id),
                i = h(e.id),
                r = f(e.id),
                s = {
                  action: 'set',
                  param: { elementId: e.id, attrType: 'curve', attrValue: 'a' },
                };
              l.edit(
                { action: 'chain', param: [t, n, i, r, s] },
                l.view.getCurrentPageURI()
              ).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          L();
      }),
      (t.triggerNeumeActions = function () {
        v(),
          S('moreEdit', i.defaultNeumeActionContents),
          S('extraEdit', i.neumeActionContents),
          _();
        const e = document.querySelectorAll('.selected');
        function t(t) {
          const n = {
            action: 'changeGroup',
            param: { elementId: e[0].id, contour: t },
          };
          l.edit(n, l.view.getCurrentPageURI()).then((e) => {
            e
              ? o.queueNotification('Grouping Changed')
              : o.queueNotification('Grouping Failed'),
              v(),
              l.updateForCurrentPage();
          });
        }
        1 === e.length
          ? (document
              .getElementById('split-neume')
              .addEventListener('click', () => {
                const e = document.querySelector('.neume.selected');
                if (null !== e) {
                  new a.SplitNeumeHandler(l, e).startSplit(), v();
                } else console.error('No staff was selected!'), v();
              }),
            document
              .querySelector('#Pes.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#PesSubpunctis.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#Clivis.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#Scandicus.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#ScandicusFlexus.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#ScandicusSubpunctis.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#Climacus.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#ClimacusResupinus.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#Torculus.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#TorculusResupinus.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#Porrectus.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#PorrectusFlexus.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#PorrectusSubpunctis.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            document
              .querySelector('#Pressus.dropdown-item')
              .addEventListener('click', (e) => {
                t(l.info.getContourByValue(e.target.id));
              }),
            L())
          : console.warn(
              'More than one neume selected! Cannot trigger Neume ClickSelect actions.'
            );
      }),
      (t.triggerSyllableActions = function () {
        v(),
          S(
            'moreEdit',
            '\n    <div class="right-side-panel-btns-container">\n      <button class="side-panel-btn" id="mergeSyls">Merge Syllables</button>\n      <button class="side-panel-btn" id="ungroupNeumes">Ungroup</button>\n      <button class="side-panel-btn" id="delete">Delete</button>\n      <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>\n    </div>\n  '
          ),
          E(),
          _();
      }),
      (t.triggerClefActions = function (e) {
        v(),
          S('moreEdit', i.custosActionContents),
          S('extraEdit', i.clefActionContents),
          E(),
          _(),
          document
            .querySelector('#CClef.dropdown-item')
            .addEventListener('click', () => {
              const t = {
                action: 'setClef',
                param: { elementId: e.id, shape: 'C' },
              };
              l.edit(t, l.view.getCurrentPageURI()).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          document
            .querySelector('#FClef.dropdown-item')
            .addEventListener('click', () => {
              const t = {
                action: 'setClef',
                param: { elementId: e.id, shape: 'F' },
              };
              l.edit(t, l.view.getCurrentPageURI()).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          L();
      }),
      (t.triggerCustosActions = function () {
        v(), S('moreEdit', i.custosActionContents), E(), _();
      }),
      (t.triggerAccidActions = function (e) {
        var t, n;
        v(),
          S(
            'moreEdit',
            e.parentElement.classList.contains('syllable')
              ? i.layerElementInActionContents
              : i.layerElementOutActionContents,
            !1
          ),
          S('extraEdit', i.accidActionContents),
          _(),
          E(),
          null === (t = document.getElementById('insertToSyllable')) ||
            void 0 === t ||
            t.addEventListener('click', b),
          null === (n = document.getElementById('moveOuttaSyllable')) ||
            void 0 === n ||
            n.addEventListener('click', w),
          document
            .querySelector('#ChangeToFlat.dropdown-item')
            .addEventListener('click', () => {
              const t = {
                action: 'set',
                param: { elementId: e.id, attrType: 'accid', attrValue: 'f' },
              };
              l.edit(t, l.view.getCurrentPageURI()).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          document
            .querySelector('#ChangeToNatural.dropdown-item')
            .addEventListener('click', () => {
              const t = {
                action: 'set',
                param: { elementId: e.id, attrType: 'accid', attrValue: 'n' },
              };
              l.edit(t, l.view.getCurrentPageURI()).then((e) => {
                e
                  ? o.queueNotification('Shape Changed')
                  : o.queueNotification('Shape Change Failed'),
                  v(),
                  l.updateForCurrentPage();
              });
            }),
          L();
      }),
      (t.triggerLayerElementActions = function (e) {
        var t, n;
        v(),
          S(
            'moreEdit',
            e.parentElement.classList.contains('syllable')
              ? i.layerElementInActionContents
              : i.layerElementOutActionContents,
            !1
          ),
          _(),
          E(),
          null === (t = document.getElementById('insertToSyllable')) ||
            void 0 === t ||
            t.addEventListener('click', b),
          null === (n = document.getElementById('moveOuttaSyllable')) ||
            void 0 === n ||
            n.addEventListener('click', w);
      }),
      (t.triggerStaffActions = function () {
        v(),
          S('moreEdit', i.staffActionContents),
          _(),
          document
            .getElementById('merge-systems')
            .addEventListener('click', () => {
              r.mergeStaves();
            });
      }),
      (t.triggerStaffSplitMode = x),
      (t.triggerSplitActions = function () {
        v(),
          S('moreEdit', i.splitActionContents),
          _(),
          document
            .getElementById('split-system')
            .addEventListener('click', () => {
              x();
            }),
          document
            .getElementById('reset-rotate')
            .addEventListener('click', () => {
              const e = document.querySelector('.staff.selected'),
                t = c.getStaffBBox(e),
                n = Math.tan(t.rotate) * (t.lrx - t.ulx);
              if (null !== e) {
                const i = {
                  action: 'resizeRotate',
                  param: {
                    elementId: e.id,
                    ulx: t.ulx,
                    uly: t.rotate > 0 ? t.uly + n / 2 : t.uly - n / 2,
                    lrx: t.lrx,
                    lry: t.rotate > 0 ? t.lry - n / 2 : t.lry + n / 2,
                    rotate: 0,
                  },
                };
                l.edit(i, l.view.getCurrentPageURI()).then(async (e) => {
                  e && (await l.updateForCurrentPage());
                }),
                  v();
              } else console.error('No staff was selected'), v();
            });
      }),
      (t.triggerDefaultSylActions = function () {
        v(), S('moreEdit', i.defaultSylActionContents), _(), E();
      }),
      (t.triggerDefaultActions = function () {
        v(), S('moreEdit', i.defaultActionContents), _();
      });
  },
  function (e, t, n) {
    'use strict';
    n.r(t),
      function (e) {
        var i,
          r,
          o = n(2),
          s = n.n(o),
          a = n(15),
          c = n(6),
          l = n.n(c),
          u = n(9),
          d = n.n(u),
          h = n(3),
          f = n.n(h),
          p = n(1),
          g = n.n(p),
          v = n(0),
          m = n.n(v);
        function y(e) {
          return '$' + e;
        }
        function b(e) {
          return e.substring(1);
        }
        function w() {
          this._store = {};
        }
        function _(e) {
          if (((this._store = new w()), e && Array.isArray(e)))
            for (var t = 0, n = e.length; t < n; t++) this.add(e[t]);
        }
        function E(e) {
          if (e instanceof ArrayBuffer)
            return (function (e) {
              if ('function' == typeof e.slice) return e.slice(0);
              var t = new ArrayBuffer(e.byteLength),
                n = new Uint8Array(t),
                i = new Uint8Array(e);
              return n.set(i), t;
            })(e);
          var t = e.size,
            n = e.type;
          return 'function' == typeof e.slice
            ? e.slice(0, t, n)
            : e.webkitSlice(0, t, n);
        }
        (w.prototype.get = function (e) {
          var t = y(e);
          return this._store[t];
        }),
          (w.prototype.set = function (e, t) {
            var n = y(e);
            return (this._store[n] = t), !0;
          }),
          (w.prototype.has = function (e) {
            return y(e) in this._store;
          }),
          (w.prototype.delete = function (e) {
            var t = y(e),
              n = t in this._store;
            return delete this._store[t], n;
          }),
          (w.prototype.forEach = function (e) {
            for (
              var t = Object.keys(this._store), n = 0, i = t.length;
              n < i;
              n++
            ) {
              var r = t[n];
              e(this._store[r], (r = b(r)));
            }
          }),
          Object.defineProperty(w.prototype, 'size', {
            get: function () {
              return Object.keys(this._store).length;
            },
          }),
          (_.prototype.add = function (e) {
            return this._store.set(e, !0);
          }),
          (_.prototype.has = function (e) {
            return this._store.has(e);
          }),
          (_.prototype.forEach = function (e) {
            this._store.forEach(function (t, n) {
              e(n);
            });
          }),
          Object.defineProperty(_.prototype, 'size', {
            get: function () {
              return this._store.size;
            },
          }),
          !(function () {
            if (
              'undefined' == typeof Symbol ||
              'undefined' == typeof Map ||
              'undefined' == typeof Set
            )
              return !1;
            var e = Object.getOwnPropertyDescriptor(Map, Symbol.species);
            return e && 'get' in e && Map[Symbol.species] === Map;
          })()
            ? ((i = _), (r = w))
            : ((i = Set), (r = Map));
        var S = Function.prototype.toString,
          x = S.call(Object);
        function L(e) {
          var t, n, i;
          if (!e || 'object' != typeof e) return e;
          if (Array.isArray(e)) {
            for (t = [], n = 0, i = e.length; n < i; n++) t[n] = L(e[n]);
            return t;
          }
          if (e instanceof Date) return e.toISOString();
          if (
            (function (e) {
              return (
                ('undefined' != typeof ArrayBuffer &&
                  e instanceof ArrayBuffer) ||
                ('undefined' != typeof Blob && e instanceof Blob)
              );
            })(e)
          )
            return E(e);
          if (
            !(function (e) {
              var t = Object.getPrototypeOf(e);
              if (null === t) return !0;
              var n = t.constructor;
              return 'function' == typeof n && n instanceof n && S.call(n) == x;
            })(e)
          )
            return e;
          for (n in ((t = {}), e))
            if (Object.prototype.hasOwnProperty.call(e, n)) {
              var r = L(e[n]);
              void 0 !== r && (t[n] = r);
            }
          return t;
        }
        function k(e) {
          var t = !1;
          return f()(function (n) {
            if (t) throw new Error('once called more than once');
            (t = !0), e.apply(this, n);
          });
        }
        function C(e) {
          return f()(function (t) {
            t = L(t);
            var n = this,
              i = 'function' == typeof t[t.length - 1] && t.pop(),
              r = new Promise(function (i, r) {
                var o;
                try {
                  var s = k(function (e, t) {
                    e ? r(e) : i(t);
                  });
                  t.push(s),
                    (o = e.apply(n, t)) && 'function' == typeof o.then && i(o);
                } catch (e) {
                  r(e);
                }
              });
            return (
              i &&
                r.then(function (e) {
                  i(null, e);
                }, i),
              r
            );
          });
        }
        function I(e, t) {
          return C(
            f()(function (n) {
              if (this._closed)
                return Promise.reject(new Error('database is closed'));
              if (this._destroyed)
                return Promise.reject(new Error('database is destroyed'));
              var i = this;
              return (
                (function (e, t, n) {
                  if (e.constructor.listeners('debug').length) {
                    for (
                      var i = ['api', e.name, t], r = 0;
                      r < n.length - 1;
                      r++
                    )
                      i.push(n[r]);
                    e.constructor.emit('debug', i);
                    var o = n[n.length - 1];
                    n[n.length - 1] = function (n, i) {
                      var r = ['api', e.name, t];
                      (r = r.concat(n ? ['error', n] : ['success', i])),
                        e.constructor.emit('debug', r),
                        o(n, i);
                    };
                  }
                })(i, e, n),
                this.taskqueue.isReady
                  ? t.apply(this, n)
                  : new Promise(function (t, r) {
                      i.taskqueue.addTask(function (o) {
                        o ? r(o) : t(i[e].apply(i, n));
                      });
                    })
              );
            })
          );
        }
        function A(e, t) {
          for (var n = {}, i = 0, r = t.length; i < r; i++) {
            var o = t[i];
            o in e && (n[o] = e[o]);
          }
          return n;
        }
        var P;
        function O(e) {
          return e;
        }
        function B(e) {
          return [{ ok: e }];
        }
        function T(e, t, n) {
          var i = t.docs,
            o = new r();
          i.forEach(function (e) {
            o.has(e.id) ? o.get(e.id).push(e) : o.set(e.id, [e]);
          });
          var s = o.size,
            a = 0,
            c = new Array(s);
          function l() {
            var e;
            ++a === s &&
              ((e = []),
              c.forEach(function (t) {
                t.docs.forEach(function (n) {
                  e.push({ id: t.id, docs: [n] });
                });
              }),
              n(null, { results: e }));
          }
          var u = [];
          o.forEach(function (e, t) {
            u.push(t);
          });
          var d = 0;
          function h() {
            if (!(d >= u.length)) {
              var n = Math.min(d + 6, u.length),
                i = u.slice(d, n);
              !(function (n, i) {
                n.forEach(function (n, r) {
                  var s = i + r,
                    a = o.get(n),
                    u = A(a[0], ['atts_since', 'attachments']);
                  (u.open_revs = a.map(function (e) {
                    return e.rev;
                  })),
                    (u.open_revs = u.open_revs.filter(O));
                  var d = O;
                  0 === u.open_revs.length && (delete u.open_revs, (d = B)),
                    ['revs', 'attachments', 'binary', 'ajax', 'latest'].forEach(
                      function (e) {
                        e in t && (u[e] = t[e]);
                      }
                    ),
                    e.get(n, u, function (e, t) {
                      var i, r, o;
                      (i = e ? [{ error: e }] : d(t)),
                        (r = n),
                        (o = i),
                        (c[s] = { id: r, docs: o }),
                        l(),
                        h();
                    });
                });
              })(i, d),
                (d += i.length);
            }
          }
          h();
        }
        try {
          localStorage.setItem('_pouch_check_localstorage', 1),
            (P = !!localStorage.getItem('_pouch_check_localstorage'));
        } catch (e) {
          P = !1;
        }
        function N() {
          return P;
        }
        function M() {
          m.a.call(this),
            (this._listeners = {}),
            (function (e) {
              N() &&
                addEventListener('storage', function (t) {
                  e.emit(t.key);
                });
            })(this);
        }
        function j(e) {
          if (
            'undefined' != typeof console &&
            'function' == typeof console[e]
          ) {
            var t = Array.prototype.slice.call(arguments, 1);
            console[e].apply(console, t);
          }
        }
        function D(e) {
          var t = 0;
          return (
            e || (t = 2e3),
            (function (e, t) {
              return (
                (e = parseInt(e, 10) || 0),
                (t = parseInt(t, 10)) != t || t <= e
                  ? (t = (e || 1) << 1)
                  : (t += 1),
                t > 6e5 && ((e = 3e5), (t = 6e5)),
                ~~((t - e) * Math.random() + e)
              );
            })(e, t)
          );
        }
        function q(e, t) {
          j('info', 'The above ' + e + ' is totally normal. ' + t);
        }
        g()(M, m.a),
          (M.prototype.addListener = function (e, t, n, i) {
            if (!this._listeners[t]) {
              var r = this,
                o = !1;
              (this._listeners[t] = a), this.on(e, a);
            }
            function a() {
              if (r._listeners[t])
                if (o) o = 'waiting';
                else {
                  o = !0;
                  var e = A(i, [
                    'style',
                    'include_docs',
                    'attachments',
                    'conflicts',
                    'filter',
                    'doc_ids',
                    'view',
                    'since',
                    'query_params',
                    'binary',
                    'return_docs',
                  ]);
                  n.changes(e)
                    .on('change', function (e) {
                      e.seq > i.since &&
                        !i.cancelled &&
                        ((i.since = e.seq), i.onChange(e));
                    })
                    .on('complete', function () {
                      'waiting' === o && s()(a), (o = !1);
                    })
                    .on('error', function () {
                      o = !1;
                    });
                }
            }
          }),
          (M.prototype.removeListener = function (e, t) {
            t in this._listeners &&
              (m.a.prototype.removeListener.call(this, e, this._listeners[t]),
              delete this._listeners[t]);
          }),
          (M.prototype.notifyLocalWindows = function (e) {
            N() && (localStorage[e] = 'a' === localStorage[e] ? 'b' : 'a');
          }),
          (M.prototype.notify = function (e) {
            this.emit(e), this.notifyLocalWindows(e);
          });
        var R =
          'function' == typeof Object.assign
            ? Object.assign
            : function (e) {
                for (var t = Object(e), n = 1; n < arguments.length; n++) {
                  var i = arguments[n];
                  if (null != i)
                    for (var r in i)
                      Object.prototype.hasOwnProperty.call(i, r) &&
                        (t[r] = i[r]);
                }
                return t;
              };
        function V(e, t, n) {
          Error.call(this, n),
            (this.status = e),
            (this.name = t),
            (this.message = n),
            (this.error = !0);
        }
        g()(V, Error),
          (V.prototype.toString = function () {
            return JSON.stringify({
              status: this.status,
              name: this.name,
              message: this.message,
              reason: this.reason,
            });
          });
        new V(401, 'unauthorized', 'Name or password is incorrect.');
        var z = new V(400, 'bad_request', "Missing JSON list of 'docs'"),
          F = new V(404, 'not_found', 'missing'),
          H = new V(409, 'conflict', 'Document update conflict'),
          U = new V(400, 'bad_request', '_id field must contain a string'),
          G = new V(412, 'missing_id', '_id is required for puts'),
          W = new V(
            400,
            'bad_request',
            'Only reserved document ids may start with underscore.'
          ),
          $ =
            (new V(412, 'precondition_failed', 'Database not open'),
            new V(
              500,
              'unknown_error',
              'Database encountered an unknown error'
            )),
          Z = new V(500, 'badarg', 'Some query argument is invalid'),
          K =
            (new V(400, 'invalid_request', 'Request was invalid'),
            new V(400, 'query_parse_error', 'Some query parameter is invalid')),
          Y = new V(500, 'doc_validation', 'Bad special document member'),
          X = new V(400, 'bad_request', 'Something wrong with the request'),
          J = new V(400, 'bad_request', 'Document must be a JSON object'),
          Q =
            (new V(404, 'not_found', 'Database not found'),
            new V(500, 'indexed_db_went_bad', 'unknown')),
          ee =
            (new V(500, 'web_sql_went_bad', 'unknown'),
            new V(500, 'levelDB_went_went_bad', 'unknown'),
            new V(
              403,
              'forbidden',
              'Forbidden by design doc validate_doc_update function'
            ),
            new V(400, 'bad_request', 'Invalid rev format')),
          te =
            (new V(
              412,
              'file_exists',
              'The database could not be created, the file already exists.'
            ),
            new V(
              412,
              'missing_stub',
              "A pre-existing attachment stub wasn't found"
            ));
        new V(413, 'invalid_url', 'Provided URL is invalid');
        function ne(e, t) {
          function n(t) {
            for (
              var n = Object.getOwnPropertyNames(e), i = 0, r = n.length;
              i < r;
              i++
            )
              'function' != typeof e[n[i]] && (this[n[i]] = e[n[i]]);
            void 0 !== t && (this.reason = t);
          }
          return (n.prototype = V.prototype), new n(t);
        }
        function ie(e) {
          if ('object' != typeof e) {
            var t = e;
            (e = $).data = t;
          }
          return (
            'error' in e &&
              'conflict' === e.error &&
              ((e.name = 'conflict'), (e.status = 409)),
            'name' in e || (e.name = e.error || 'unknown'),
            'status' in e || (e.status = 500),
            'message' in e || (e.message = e.message || e.reason),
            e
          );
        }
        function re(e) {
          var t = {},
            n = e.filter && 'function' == typeof e.filter;
          return (
            (t.query = e.query_params),
            function (i) {
              i.doc || (i.doc = {});
              var r =
                n &&
                (function (e, t, n) {
                  try {
                    return !e(t, n);
                  } catch (e) {
                    var i = 'Filter function threw: ' + e.toString();
                    return ne(X, i);
                  }
                })(e.filter, i.doc, t);
              if ('object' == typeof r) return r;
              if (r) return !1;
              if (e.include_docs) {
                if (!e.attachments)
                  for (var o in i.doc._attachments)
                    i.doc._attachments.hasOwnProperty(o) &&
                      (i.doc._attachments[o].stub = !0);
              } else delete i.doc;
              return !0;
            }
          );
        }
        function oe(e) {
          for (var t = [], n = 0, i = e.length; n < i; n++) t = t.concat(e[n]);
          return t;
        }
        function se(e) {
          var t;
          if (
            (e
              ? 'string' != typeof e
                ? (t = ne(U))
                : /^_/.test(e) && !/^_(design|local)/.test(e) && (t = ne(W))
              : (t = ne(G)),
            t)
          )
            throw t;
        }
        function ae(e) {
          return 'boolean' == typeof e._remote
            ? e._remote
            : 'function' == typeof e.type &&
                (j(
                  'warn',
                  'db.type() is deprecated and will be removed in a future version of PouchDB'
                ),
                'http' === e.type());
        }
        function ce(e) {
          if (!e) return null;
          var t = e.split('/');
          return 2 === t.length ? t : 1 === t.length ? [e, e] : null;
        }
        function le(e) {
          var t = ce(e);
          return t ? t.join('/') : null;
        }
        var ue = [
            'source',
            'protocol',
            'authority',
            'userInfo',
            'user',
            'password',
            'host',
            'port',
            'relative',
            'path',
            'directory',
            'file',
            'query',
            'anchor',
          ],
          de = /(?:^|&)([^&=]*)=?([^&]*)/g,
          he =
            /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
        function fe(e) {
          for (var t = he.exec(e), n = {}, i = 14; i--; ) {
            var r = ue[i],
              o = t[i] || '',
              s = -1 !== ['user', 'password'].indexOf(r);
            n[r] = s ? decodeURIComponent(o) : o;
          }
          return (
            (n.queryKey = {}),
            n[ue[12]].replace(de, function (e, t, i) {
              t && (n.queryKey[t] = i);
            }),
            n
          );
        }
        function pe(e, t) {
          var n = [],
            i = [];
          for (var r in t) t.hasOwnProperty(r) && (n.push(r), i.push(t[r]));
          return n.push(e), Function.apply(null, n).apply(null, i);
        }
        function ge(e, t, n) {
          return new Promise(function (i, r) {
            e.get(t, function (o, s) {
              if (o) {
                if (404 !== o.status) return r(o);
                s = {};
              }
              var a = s._rev,
                c = n(s);
              if (!c) return i({ updated: !1, rev: a });
              (c._id = t),
                (c._rev = a),
                i(
                  (function (e, t, n) {
                    return e.put(t).then(
                      function (e) {
                        return { updated: !0, rev: e.rev };
                      },
                      function (i) {
                        if (409 !== i.status) throw i;
                        return ge(e, t._id, n);
                      }
                    );
                  })(e, c, n)
                );
            });
          });
        }
        var ve = function (e) {
            return atob(e);
          },
          me = function (e) {
            return btoa(e);
          };
        function ye(e, t) {
          (e = e || []), (t = t || {});
          try {
            return new Blob(e, t);
          } catch (r) {
            if ('TypeError' !== r.name) throw r;
            for (
              var n = new (
                  'undefined' != typeof BlobBuilder
                    ? BlobBuilder
                    : 'undefined' != typeof MSBlobBuilder
                    ? MSBlobBuilder
                    : 'undefined' != typeof MozBlobBuilder
                    ? MozBlobBuilder
                    : WebKitBlobBuilder
                )(),
                i = 0;
              i < e.length;
              i += 1
            )
              n.append(e[i]);
            return n.getBlob(t.type);
          }
        }
        function be(e) {
          for (
            var t = e.length,
              n = new ArrayBuffer(t),
              i = new Uint8Array(n),
              r = 0;
            r < t;
            r++
          )
            i[r] = e.charCodeAt(r);
          return n;
        }
        function we(e, t) {
          return ye([be(e)], { type: t });
        }
        function _e(e, t) {
          return we(ve(e), t);
        }
        function Ee(e, t) {
          var n = new FileReader(),
            i = 'function' == typeof n.readAsBinaryString;
          (n.onloadend = function (e) {
            var n = e.target.result || '';
            if (i) return t(n);
            t(
              (function (e) {
                for (
                  var t = '', n = new Uint8Array(e), i = n.byteLength, r = 0;
                  r < i;
                  r++
                )
                  t += String.fromCharCode(n[r]);
                return t;
              })(n)
            );
          }),
            i ? n.readAsBinaryString(e) : n.readAsArrayBuffer(e);
        }
        function Se(e, t) {
          Ee(e, function (e) {
            t(e);
          });
        }
        function xe(e, t) {
          Se(e, function (e) {
            t(me(e));
          });
        }
        var Le = self.setImmediate || self.setTimeout;
        function ke(e, t, n, i, r) {
          (n > 0 || i < t.size) &&
            (t = (function (e, t, n) {
              return e.webkitSlice ? e.webkitSlice(t, n) : e.slice(t, n);
            })(t, n, i)),
            (function (e, t) {
              var n = new FileReader();
              (n.onloadend = function (e) {
                var n = e.target.result || new ArrayBuffer(0);
                t(n);
              }),
                n.readAsArrayBuffer(e);
            })(t, function (t) {
              e.append(t), r();
            });
        }
        function Ce(e, t, n, i, r) {
          (n > 0 || i < t.length) && (t = t.substring(n, i)),
            e.appendBinary(t),
            r();
        }
        function Ie(e, t) {
          var n = 'string' == typeof e,
            i = n ? e.length : e.size,
            r = Math.min(32768, i),
            o = Math.ceil(i / r),
            s = 0,
            a = n ? new l.a() : new l.a.ArrayBuffer(),
            c = n ? Ce : ke;
          function u() {
            Le(h);
          }
          function d() {
            var e = (function (e) {
              return me(e);
            })(a.end(!0));
            t(e), a.destroy();
          }
          function h() {
            var t = s * r,
              n = t + r;
            s++, c(a, e, t, n, s < o ? u : d);
          }
          h();
        }
        function Ae(e) {
          return l.a.hash(e);
        }
        function Pe(e, t) {
          var n = L(e);
          return t
            ? (delete n._rev_tree, Ae(JSON.stringify(n)))
            : Object(a.a)().replace(/-/g, '').toLowerCase();
        }
        var Oe = a.a;
        function Be(e) {
          for (var t, n, i, r, o = e.rev_tree.slice(); (r = o.pop()); ) {
            var s = r.ids,
              a = s[2],
              c = r.pos;
            if (a.length)
              for (var l = 0, u = a.length; l < u; l++)
                o.push({ pos: c + 1, ids: a[l] });
            else {
              var d = !!s[1].deleted,
                h = s[0];
              (t && !(i !== d ? i : n !== c ? n < c : t < h)) ||
                ((t = h), (n = c), (i = d));
            }
          }
          return n + '-' + t;
        }
        function Te(e, t) {
          for (var n, i = e.slice(); (n = i.pop()); )
            for (
              var r = n.pos,
                o = n.ids,
                s = o[2],
                a = t(0 === s.length, r, o[0], n.ctx, o[1]),
                c = 0,
                l = s.length;
              c < l;
              c++
            )
              i.push({ pos: r + 1, ids: s[c], ctx: a });
        }
        function Ne(e, t) {
          return e.pos - t.pos;
        }
        function Me(e) {
          var t = [];
          Te(e, function (e, n, i, r, o) {
            e && t.push({ rev: n + '-' + i, pos: n, opts: o });
          }),
            t.sort(Ne).reverse();
          for (var n = 0, i = t.length; n < i; n++) delete t[n].pos;
          return t;
        }
        function je(e) {
          for (
            var t = Be(e), n = Me(e.rev_tree), i = [], r = 0, o = n.length;
            r < o;
            r++
          ) {
            var s = n[r];
            s.rev === t || s.opts.deleted || i.push(s.rev);
          }
          return i;
        }
        function De(e) {
          for (var t, n = [], i = e.slice(); (t = i.pop()); ) {
            var r = t.pos,
              o = t.ids,
              s = o[0],
              a = o[1],
              c = o[2],
              l = 0 === c.length,
              u = t.history ? t.history.slice() : [];
            u.push({ id: s, opts: a }),
              l && n.push({ pos: r + 1 - u.length, ids: u });
            for (var d = 0, h = c.length; d < h; d++)
              i.push({ pos: r + 1, ids: c[d], history: u });
          }
          return n.reverse();
        }
        function qe(e, t) {
          return e.pos - t.pos;
        }
        function Re(e, t, n) {
          var i = (function (e, t, n) {
            for (var i, r = 0, o = e.length; r < o; )
              n(e[(i = (r + o) >>> 1)], t) < 0 ? (r = i + 1) : (o = i);
            return r;
          })(e, t, n);
          e.splice(i, 0, t);
        }
        function Ve(e, t) {
          for (var n, i, r = t, o = e.length; r < o; r++) {
            var s = e[r],
              a = [s.id, s.opts, []];
            i ? (i[2].push(a), (i = a)) : (n = i = a);
          }
          return n;
        }
        function ze(e, t) {
          return e[0] < t[0] ? -1 : 1;
        }
        function Fe(e, t) {
          for (var n = [{ tree1: e, tree2: t }], i = !1; n.length > 0; ) {
            var r = n.pop(),
              o = r.tree1,
              s = r.tree2;
            (o[1].status || s[1].status) &&
              (o[1].status =
                'available' === o[1].status || 'available' === s[1].status
                  ? 'available'
                  : 'missing');
            for (var a = 0; a < s[2].length; a++)
              if (o[2][0]) {
                for (var c = !1, l = 0; l < o[2].length; l++)
                  o[2][l][0] === s[2][a][0] &&
                    (n.push({ tree1: o[2][l], tree2: s[2][a] }), (c = !0));
                c || ((i = 'new_branch'), Re(o[2], s[2][a], ze));
              } else (i = 'new_leaf'), (o[2][0] = s[2][a]);
          }
          return { conflicts: i, tree: e };
        }
        function He(e, t, n) {
          var i,
            r = [],
            o = !1,
            s = !1;
          if (!e.length) return { tree: [t], conflicts: 'new_leaf' };
          for (var a = 0, c = e.length; a < c; a++) {
            var l = e[a];
            if (l.pos === t.pos && l.ids[0] === t.ids[0])
              (i = Fe(l.ids, t.ids)),
                r.push({ pos: l.pos, ids: i.tree }),
                (o = o || i.conflicts),
                (s = !0);
            else if (!0 !== n) {
              var u = l.pos < t.pos ? l : t,
                d = l.pos < t.pos ? t : l,
                h = d.pos - u.pos,
                f = [],
                p = [];
              for (
                p.push({ ids: u.ids, diff: h, parent: null, parentIdx: null });
                p.length > 0;

              ) {
                var g = p.pop();
                if (0 !== g.diff)
                  for (var v = g.ids[2], m = 0, y = v.length; m < y; m++)
                    p.push({
                      ids: v[m],
                      diff: g.diff - 1,
                      parent: g.ids,
                      parentIdx: m,
                    });
                else g.ids[0] === d.ids[0] && f.push(g);
              }
              var b = f[0];
              b
                ? ((i = Fe(b.ids, d.ids)),
                  (b.parent[2][b.parentIdx] = i.tree),
                  r.push({ pos: u.pos, ids: u.ids }),
                  (o = o || i.conflicts),
                  (s = !0))
                : r.push(l);
            } else r.push(l);
          }
          return (
            s || r.push(t),
            r.sort(qe),
            { tree: r, conflicts: o || 'internal_node' }
          );
        }
        function Ue(e, t, n) {
          var i = He(e, t),
            r = (function (e, t) {
              for (var n, i, r = De(e), o = 0, s = r.length; o < s; o++) {
                var a,
                  c = r[o],
                  l = c.ids;
                if (l.length > t) {
                  n || (n = {});
                  var u = l.length - t;
                  a = { pos: c.pos + u, ids: Ve(l, u) };
                  for (var d = 0; d < u; d++) {
                    var h = c.pos + d + '-' + l[d].id;
                    n[h] = !0;
                  }
                } else a = { pos: c.pos, ids: Ve(l, 0) };
                i = i ? He(i, a, !0).tree : [a];
              }
              return (
                n &&
                  Te(i, function (e, t, i) {
                    delete n[t + '-' + i];
                  }),
                { tree: i, revs: n ? Object.keys(n) : [] }
              );
            })(i.tree, n);
          return { tree: r.tree, stemmedRevs: r.revs, conflicts: i.conflicts };
        }
        function Ge(e) {
          return e.ids;
        }
        function We(e, t) {
          t || (t = Be(e));
          for (
            var n, i = t.substring(t.indexOf('-') + 1), r = e.rev_tree.map(Ge);
            (n = r.pop());

          ) {
            if (n[0] === i) return !!n[1].deleted;
            r = r.concat(n[2]);
          }
        }
        function $e(e) {
          return /^_local/.test(e);
        }
        function Ze(e, t, n) {
          m.a.call(this);
          var i = this;
          this.db = e;
          var r = ((t = t ? L(t) : {}).complete = k(function (t, n) {
            var r, s;
            t
              ? ((s = 'error'),
                ('listenerCount' in (r = i)
                  ? r.listenerCount(s)
                  : m.a.listenerCount(r, s)) > 0 && i.emit('error', t))
              : i.emit('complete', n),
              i.removeAllListeners(),
              e.removeListener('destroyed', o);
          }));
          function o() {
            i.cancel();
          }
          n &&
            (i.on('complete', function (e) {
              n(null, e);
            }),
            i.on('error', n)),
            e.once('destroyed', o),
            (t.onChange = function (e, t, n) {
              i.isCancelled ||
                (function (e, t, n, i) {
                  try {
                    e.emit('change', t, n, i);
                  } catch (e) {
                    j('error', 'Error in .on("change", function):', e);
                  }
                })(i, e, t, n);
            });
          var s = new Promise(function (e, n) {
            t.complete = function (t, i) {
              t ? n(t) : e(i);
            };
          });
          i.once('cancel', function () {
            e.removeListener('destroyed', o),
              t.complete(null, { status: 'cancelled' });
          }),
            (this.then = s.then.bind(s)),
            (this.catch = s.catch.bind(s)),
            this.then(function (e) {
              r(null, e);
            }, r),
            e.taskqueue.isReady
              ? i.validateChanges(t)
              : e.taskqueue.addTask(function (e) {
                  e
                    ? t.complete(e)
                    : i.isCancelled
                    ? i.emit('cancel')
                    : i.validateChanges(t);
                });
        }
        function Ke(e, t, n) {
          var i = [{ rev: e._rev }];
          'all_docs' === n.style &&
            (i = Me(t.rev_tree).map(function (e) {
              return { rev: e.rev };
            }));
          var r = { id: t.id, changes: i, doc: e };
          return (
            We(t, e._rev) && (r.deleted = !0),
            n.conflicts &&
              ((r.doc._conflicts = je(t)),
              r.doc._conflicts.length || delete r.doc._conflicts),
            r
          );
        }
        function Ye(e, t) {
          return e < t ? -1 : e > t ? 1 : 0;
        }
        function Xe(e, t) {
          return function (n, i) {
            n || (i[0] && i[0].error)
              ? (((n = n || i[0]).docId = t), e(n))
              : e(null, i.length ? i[0] : i);
          };
        }
        function Je(e, t) {
          var n = Ye(e._id, t._id);
          return 0 !== n
            ? n
            : Ye(
                e._revisions ? e._revisions.start : 0,
                t._revisions ? t._revisions.start : 0
              );
        }
        function Qe() {
          for (var e in (m.a.call(this), Qe.prototype))
            'function' == typeof this[e] && (this[e] = this[e].bind(this));
        }
        function et() {
          (this.isReady = !1), (this.failed = !1), (this.queue = []);
        }
        function tt(e, t) {
          if (!(this instanceof tt)) return new tt(e, t);
          var n = this;
          if (
            ((t = t || {}),
            e && 'object' == typeof e && ((e = (t = e).name), delete t.name),
            void 0 === t.deterministic_revs && (t.deterministic_revs = !0),
            (this.__opts = t = L(t)),
            (n.auto_compaction = t.auto_compaction),
            (n.prefix = tt.prefix),
            'string' != typeof e)
          )
            throw new Error('Missing/invalid DB name');
          var i = (function (e, t) {
            var n = e.match(/([a-z-]*):\/\/(.*)/);
            if (n)
              return {
                name: /https?/.test(n[1]) ? n[1] + '://' + n[2] : n[2],
                adapter: n[1],
              };
            var i = tt.adapters,
              r = tt.preferredAdapters,
              o = tt.prefix,
              s = t.adapter;
            if (!s)
              for (
                var a = 0;
                a < r.length &&
                'idb' === (s = r[a]) &&
                'websql' in i &&
                N() &&
                localStorage['_pouch__websqldb_' + o + e];
                ++a
              )
                j(
                  'log',
                  'PouchDB is downgrading "' +
                    e +
                    '" to WebSQL to avoid data loss, because it was already opened with WebSQL.'
                );
            var c = i[s];
            return {
              name: !c || !('use_prefix' in c) || c.use_prefix ? o + e : e,
              adapter: s,
            };
          })((t.prefix || '') + e, t);
          if (
            ((t.name = i.name),
            (t.adapter = t.adapter || i.adapter),
            (n.name = e),
            (n._adapter = t.adapter),
            tt.emit('debug', ['adapter', 'Picked adapter: ', t.adapter]),
            !tt.adapters[t.adapter] || !tt.adapters[t.adapter].valid())
          )
            throw new Error('Invalid Adapter: ' + t.adapter);
          Qe.call(n),
            (n.taskqueue = new et()),
            (n.adapter = t.adapter),
            tt.adapters[t.adapter].call(n, t, function (e) {
              if (e) return n.taskqueue.fail(e);
              !(function (e) {
                function t(t) {
                  e.removeListener('closed', n),
                    t || e.constructor.emit('destroyed', e.name);
                }
                function n() {
                  e.removeListener('destroyed', t),
                    e.constructor.emit('unref', e);
                }
                e.once('destroyed', t),
                  e.once('closed', n),
                  e.constructor.emit('ref', e);
              })(n),
                n.emit('created', n),
                tt.emit('created', n.name),
                n.taskqueue.ready(n);
            });
        }
        g()(Ze, m.a),
          (Ze.prototype.cancel = function () {
            (this.isCancelled = !0),
              this.db.taskqueue.isReady && this.emit('cancel');
          }),
          (Ze.prototype.validateChanges = function (e) {
            var t = e.complete,
              n = this;
            tt._changesFilterPlugin
              ? tt._changesFilterPlugin.validate(e, function (i) {
                  if (i) return t(i);
                  n.doChanges(e);
                })
              : n.doChanges(e);
          }),
          (Ze.prototype.doChanges = function (e) {
            var t = this,
              n = e.complete;
            if (
              ('live' in (e = L(e)) &&
                !('continuous' in e) &&
                (e.continuous = e.live),
              (e.processChange = Ke),
              'latest' === e.since && (e.since = 'now'),
              e.since || (e.since = 0),
              'now' !== e.since)
            ) {
              if (tt._changesFilterPlugin) {
                if (
                  (tt._changesFilterPlugin.normalize(e),
                  tt._changesFilterPlugin.shouldFilter(this, e))
                )
                  return tt._changesFilterPlugin.filter(this, e);
              } else
                ['doc_ids', 'filter', 'selector', 'view'].forEach(function (t) {
                  t in e &&
                    j(
                      'warn',
                      'The "' +
                        t +
                        '" option was passed in to changes/replicate, but pouchdb-changes-filter plugin is not installed, so it was ignored. Please install the plugin to enable filtering.'
                    );
                });
              'descending' in e || (e.descending = !1),
                (e.limit = 0 === e.limit ? 1 : e.limit),
                (e.complete = n);
              var i = this.db._changes(e);
              if (i && 'function' == typeof i.cancel) {
                var r = t.cancel;
                t.cancel = f()(function (e) {
                  i.cancel(), r.apply(this, e);
                });
              }
            } else
              this.db.info().then(function (i) {
                t.isCancelled
                  ? n(null, { status: 'cancelled' })
                  : ((e.since = i.update_seq), t.doChanges(e));
              }, n);
          }),
          g()(Qe, m.a),
          (Qe.prototype.post = I('post', function (e, t, n) {
            if (
              ('function' == typeof t && ((n = t), (t = {})),
              'object' != typeof e || Array.isArray(e))
            )
              return n(ne(J));
            this.bulkDocs({ docs: [e] }, t, Xe(n, e._id));
          })),
          (Qe.prototype.put = I('put', function (e, t, n) {
            if (
              ('function' == typeof t && ((n = t), (t = {})),
              'object' != typeof e || Array.isArray(e))
            )
              return n(ne(J));
            if ((se(e._id), $e(e._id) && 'function' == typeof this._putLocal))
              return e._deleted
                ? this._removeLocal(e, n)
                : this._putLocal(e, n);
            var i,
              r,
              o,
              s,
              a = this;
            function c(n) {
              'function' == typeof a._put && !1 !== t.new_edits
                ? a._put(e, t, n)
                : a.bulkDocs({ docs: [e] }, t, Xe(n, e._id));
            }
            t.force && e._rev
              ? ((i = e._rev.split('-')),
                (r = i[1]),
                (o = parseInt(i[0], 10) + 1),
                (s = Pe()),
                (e._revisions = { start: o, ids: [s, r] }),
                (e._rev = o + '-' + s),
                (t.new_edits = !1),
                c(function (t) {
                  var i = t ? null : { ok: !0, id: e._id, rev: e._rev };
                  n(t, i);
                }))
              : c(n);
          })),
          (Qe.prototype.putAttachment = I(
            'putAttachment',
            function (e, t, n, i, r) {
              var o = this;
              function s(e) {
                var n = '_rev' in e ? parseInt(e._rev, 10) : 0;
                return (
                  (e._attachments = e._attachments || {}),
                  (e._attachments[t] = {
                    content_type: r,
                    data: i,
                    revpos: ++n,
                  }),
                  o.put(e)
                );
              }
              return (
                'function' == typeof r && ((r = i), (i = n), (n = null)),
                void 0 === r && ((r = i), (i = n), (n = null)),
                r ||
                  j(
                    'warn',
                    'Attachment',
                    t,
                    'on document',
                    e,
                    'is missing content_type'
                  ),
                o.get(e).then(
                  function (e) {
                    if (e._rev !== n) throw ne(H);
                    return s(e);
                  },
                  function (t) {
                    if (t.reason === F.message) return s({ _id: e });
                    throw t;
                  }
                )
              );
            }
          )),
          (Qe.prototype.removeAttachment = I(
            'removeAttachment',
            function (e, t, n, i) {
              var r = this;
              r.get(e, function (e, o) {
                if (e) i(e);
                else if (o._rev === n) {
                  if (!o._attachments) return i();
                  delete o._attachments[t],
                    0 === Object.keys(o._attachments).length &&
                      delete o._attachments,
                    r.put(o, i);
                } else i(ne(H));
              });
            }
          )),
          (Qe.prototype.remove = I('remove', function (e, t, n, i) {
            var r;
            'string' == typeof t
              ? ((r = { _id: e, _rev: t }),
                'function' == typeof n && ((i = n), (n = {})))
              : ((r = e),
                'function' == typeof t
                  ? ((i = t), (n = {}))
                  : ((i = n), (n = t))),
              ((n = n || {}).was_delete = !0);
            var o = { _id: r._id, _rev: r._rev || n.rev, _deleted: !0 };
            if ($e(o._id) && 'function' == typeof this._removeLocal)
              return this._removeLocal(r, i);
            this.bulkDocs({ docs: [o] }, n, Xe(i, o._id));
          })),
          (Qe.prototype.revsDiff = I('revsDiff', function (e, t, n) {
            'function' == typeof t && ((n = t), (t = {}));
            var i = Object.keys(e);
            if (!i.length) return n(null, {});
            var o = 0,
              s = new r();
            function a(e, t) {
              s.has(e) || s.set(e, { missing: [] }), s.get(e).missing.push(t);
            }
            i.map(function (t) {
              this._getRevisionTree(t, function (r, c) {
                if (r && 404 === r.status && 'missing' === r.message)
                  s.set(t, { missing: e[t] });
                else {
                  if (r) return n(r);
                  !(function (t, n) {
                    var i = e[t].slice(0);
                    Te(n, function (e, n, r, o, s) {
                      var c = n + '-' + r,
                        l = i.indexOf(c);
                      -1 !== l &&
                        (i.splice(l, 1), 'available' !== s.status && a(t, c));
                    }),
                      i.forEach(function (e) {
                        a(t, e);
                      });
                  })(t, c);
                }
                if (++o === i.length) {
                  var l = {};
                  return (
                    s.forEach(function (e, t) {
                      l[t] = e;
                    }),
                    n(null, l)
                  );
                }
              });
            }, this);
          })),
          (Qe.prototype.bulkGet = I('bulkGet', function (e, t) {
            T(this, e, t);
          })),
          (Qe.prototype.compactDocument = I(
            'compactDocument',
            function (e, t, n) {
              var i = this;
              this._getRevisionTree(e, function (r, o) {
                if (r) return n(r);
                var s = (function (e) {
                    var t = {},
                      n = [];
                    return (
                      Te(e, function (e, i, r, o) {
                        var s = i + '-' + r;
                        return (
                          e && (t[s] = 0),
                          void 0 !== o && n.push({ from: o, to: s }),
                          s
                        );
                      }),
                      n.reverse(),
                      n.forEach(function (e) {
                        void 0 === t[e.from]
                          ? (t[e.from] = 1 + t[e.to])
                          : (t[e.from] = Math.min(t[e.from], 1 + t[e.to]));
                      }),
                      t
                    );
                  })(o),
                  a = [],
                  c = [];
                Object.keys(s).forEach(function (e) {
                  s[e] > t && a.push(e);
                }),
                  Te(o, function (e, t, n, i, r) {
                    var o = t + '-' + n;
                    'available' === r.status &&
                      -1 !== a.indexOf(o) &&
                      c.push(o);
                  }),
                  i._doCompaction(e, c, n);
              });
            }
          )),
          (Qe.prototype.compact = I('compact', function (e, t) {
            'function' == typeof e && ((t = e), (e = {}));
            (e = e || {}),
              (this._compactionQueue = this._compactionQueue || []),
              this._compactionQueue.push({ opts: e, callback: t }),
              1 === this._compactionQueue.length &&
                (function e(t) {
                  var n = t._compactionQueue[0],
                    i = n.opts,
                    r = n.callback;
                  t.get('_local/compaction')
                    .catch(function () {
                      return !1;
                    })
                    .then(function (n) {
                      n && n.last_seq && (i.last_seq = n.last_seq),
                        t._compact(i, function (n, i) {
                          n ? r(n) : r(null, i),
                            s()(function () {
                              t._compactionQueue.shift(),
                                t._compactionQueue.length && e(t);
                            });
                        });
                    });
                })(this);
          })),
          (Qe.prototype._compact = function (e, t) {
            var n = this,
              i = { return_docs: !1, last_seq: e.last_seq || 0 },
              r = [];
            n.changes(i)
              .on('change', function (e) {
                r.push(n.compactDocument(e.id, 0));
              })
              .on('complete', function (e) {
                var i = e.last_seq;
                Promise.all(r)
                  .then(function () {
                    return ge(n, '_local/compaction', function (e) {
                      return (
                        (!e.last_seq || e.last_seq < i) && ((e.last_seq = i), e)
                      );
                    });
                  })
                  .then(function () {
                    t(null, { ok: !0 });
                  })
                  .catch(t);
              })
              .on('error', t);
          }),
          (Qe.prototype.get = I('get', function (e, t, n) {
            if (
              ('function' == typeof t && ((n = t), (t = {})),
              'string' != typeof e)
            )
              return n(ne(U));
            if ($e(e) && 'function' == typeof this._getLocal)
              return this._getLocal(e, n);
            var i = [],
              r = this;
            function o() {
              var o = [],
                s = i.length;
              if (!s) return n(null, o);
              i.forEach(function (i) {
                r.get(
                  e,
                  {
                    rev: i,
                    revs: t.revs,
                    latest: t.latest,
                    attachments: t.attachments,
                    binary: t.binary,
                  },
                  function (e, t) {
                    if (e) o.push({ missing: i });
                    else {
                      for (var r, a = 0, c = o.length; a < c; a++)
                        if (o[a].ok && o[a].ok._rev === t._rev) {
                          r = !0;
                          break;
                        }
                      r || o.push({ ok: t });
                    }
                    --s || n(null, o);
                  }
                );
              });
            }
            if (!t.open_revs)
              return this._get(e, t, function (i, o) {
                if (i) return (i.docId = e), n(i);
                var s = o.doc,
                  a = o.metadata,
                  c = o.ctx;
                if (t.conflicts) {
                  var l = je(a);
                  l.length && (s._conflicts = l);
                }
                if (
                  (We(a, s._rev) && (s._deleted = !0), t.revs || t.revs_info)
                ) {
                  for (
                    var u = s._rev.split('-'),
                      d = parseInt(u[0], 10),
                      h = u[1],
                      f = De(a.rev_tree),
                      p = null,
                      g = 0;
                    g < f.length;
                    g++
                  ) {
                    var v = f[g],
                      m = v.ids
                        .map(function (e) {
                          return e.id;
                        })
                        .indexOf(h);
                    (m === d - 1 || (!p && -1 !== m)) && (p = v);
                  }
                  if (!p)
                    return (
                      ((i = new Error('invalid rev tree')).docId = e), n(i)
                    );
                  var y =
                      p.ids
                        .map(function (e) {
                          return e.id;
                        })
                        .indexOf(s._rev.split('-')[1]) + 1,
                    b = p.ids.length - y;
                  if (
                    (p.ids.splice(y, b),
                    p.ids.reverse(),
                    t.revs &&
                      (s._revisions = {
                        start: p.pos + p.ids.length - 1,
                        ids: p.ids.map(function (e) {
                          return e.id;
                        }),
                      }),
                    t.revs_info)
                  ) {
                    var w = p.pos + p.ids.length;
                    s._revs_info = p.ids.map(function (e) {
                      return { rev: --w + '-' + e.id, status: e.opts.status };
                    });
                  }
                }
                if (t.attachments && s._attachments) {
                  var _ = s._attachments,
                    E = Object.keys(_).length;
                  if (0 === E) return n(null, s);
                  Object.keys(_).forEach(function (e) {
                    this._getAttachment(
                      s._id,
                      e,
                      _[e],
                      { rev: s._rev, binary: t.binary, ctx: c },
                      function (t, i) {
                        var r = s._attachments[e];
                        (r.data = i),
                          delete r.stub,
                          delete r.length,
                          --E || n(null, s);
                      }
                    );
                  }, r);
                } else {
                  if (s._attachments)
                    for (var S in s._attachments)
                      s._attachments.hasOwnProperty(S) &&
                        (s._attachments[S].stub = !0);
                  n(null, s);
                }
              });
            if ('all' === t.open_revs)
              this._getRevisionTree(e, function (e, t) {
                if (e) return n(e);
                (i = Me(t).map(function (e) {
                  return e.rev;
                })),
                  o();
              });
            else {
              if (!Array.isArray(t.open_revs))
                return n(ne($, 'function_clause'));
              i = t.open_revs;
              for (var s = 0; s < i.length; s++) {
                var a = i[s];
                if ('string' != typeof a || !/^\d+-/.test(a)) return n(ne(ee));
              }
              o();
            }
          })),
          (Qe.prototype.getAttachment = I(
            'getAttachment',
            function (e, t, n, i) {
              var r = this;
              n instanceof Function && ((i = n), (n = {})),
                this._get(e, n, function (o, s) {
                  return o
                    ? i(o)
                    : s.doc._attachments && s.doc._attachments[t]
                    ? ((n.ctx = s.ctx),
                      (n.binary = !0),
                      void r._getAttachment(e, t, s.doc._attachments[t], n, i))
                    : i(ne(F));
                });
            }
          )),
          (Qe.prototype.allDocs = I('allDocs', function (e, t) {
            if (
              ('function' == typeof e && ((t = e), (e = {})),
              (e.skip = void 0 !== e.skip ? e.skip : 0),
              e.start_key && (e.startkey = e.start_key),
              e.end_key && (e.endkey = e.end_key),
              'keys' in e)
            ) {
              if (!Array.isArray(e.keys))
                return t(new TypeError('options.keys must be an array'));
              var n = ['startkey', 'endkey', 'key'].filter(function (t) {
                return t in e;
              })[0];
              if (n)
                return void t(
                  ne(
                    K,
                    'Query parameter `' +
                      n +
                      '` is not compatible with multi-get'
                  )
                );
              if (
                !ae(this) &&
                ((function (e) {
                  var t =
                    'limit' in e
                      ? e.keys.slice(e.skip, e.limit + e.skip)
                      : e.skip > 0
                      ? e.keys.slice(e.skip)
                      : e.keys;
                  (e.keys = t),
                    (e.skip = 0),
                    delete e.limit,
                    e.descending && (t.reverse(), (e.descending = !1));
                })(e),
                0 === e.keys.length)
              )
                return this._allDocs({ limit: 0 }, t);
            }
            return this._allDocs(e, t);
          })),
          (Qe.prototype.changes = function (e, t) {
            return (
              'function' == typeof e && ((t = e), (e = {})),
              ((e = e || {}).return_docs =
                'return_docs' in e ? e.return_docs : !e.live),
              new Ze(this, e, t)
            );
          }),
          (Qe.prototype.close = I('close', function (e) {
            return (this._closed = !0), this.emit('closed'), this._close(e);
          })),
          (Qe.prototype.info = I('info', function (e) {
            var t = this;
            this._info(function (n, i) {
              if (n) return e(n);
              (i.db_name = i.db_name || t.name),
                (i.auto_compaction = !(!t.auto_compaction || ae(t))),
                (i.adapter = t.adapter),
                e(null, i);
            });
          })),
          (Qe.prototype.id = I('id', function (e) {
            return this._id(e);
          })),
          (Qe.prototype.type = function () {
            return 'function' == typeof this._type
              ? this._type()
              : this.adapter;
          }),
          (Qe.prototype.bulkDocs = I('bulkDocs', function (e, t, n) {
            if (
              ('function' == typeof t && ((n = t), (t = {})),
              (t = t || {}),
              Array.isArray(e) && (e = { docs: e }),
              !e || !e.docs || !Array.isArray(e.docs))
            )
              return n(ne(z));
            for (var i = 0; i < e.docs.length; ++i)
              if ('object' != typeof e.docs[i] || Array.isArray(e.docs[i]))
                return n(ne(J));
            var r;
            if (
              (e.docs.forEach(function (e) {
                e._attachments &&
                  Object.keys(e._attachments).forEach(function (t) {
                    (r =
                      r ||
                      (function (e) {
                        return (
                          '_' === e.charAt(0) &&
                          e +
                            " is not a valid attachment name, attachment names cannot start with '_'"
                        );
                      })(t)),
                      e._attachments[t].content_type ||
                        j(
                          'warn',
                          'Attachment',
                          t,
                          'on document',
                          e._id,
                          'is missing content_type'
                        );
                  });
              }),
              r)
            )
              return n(ne(X, r));
            'new_edits' in t ||
              (t.new_edits = !('new_edits' in e) || e.new_edits);
            var o = this;
            t.new_edits || ae(o) || e.docs.sort(Je),
              (function (e) {
                for (var t = 0; t < e.length; t++) {
                  var n = e[t];
                  if (n._deleted) delete n._attachments;
                  else if (n._attachments)
                    for (
                      var i = Object.keys(n._attachments), r = 0;
                      r < i.length;
                      r++
                    ) {
                      var o = i[r];
                      n._attachments[o] = A(n._attachments[o], [
                        'data',
                        'digest',
                        'content_type',
                        'length',
                        'revpos',
                        'stub',
                      ]);
                    }
                }
              })(e.docs);
            var s = e.docs.map(function (e) {
              return e._id;
            });
            return this._bulkDocs(e, t, function (e, i) {
              if (e) return n(e);
              if (
                (t.new_edits ||
                  (i = i.filter(function (e) {
                    return e.error;
                  })),
                !ae(o))
              )
                for (var r = 0, a = i.length; r < a; r++)
                  i[r].id = i[r].id || s[r];
              n(null, i);
            });
          })),
          (Qe.prototype.registerDependentDatabase = I(
            'registerDependentDatabase',
            function (e, t) {
              var n = new this.constructor(e, this.__opts);
              ge(this, '_local/_pouch_dependentDbs', function (t) {
                return (
                  (t.dependentDbs = t.dependentDbs || {}),
                  !t.dependentDbs[e] && ((t.dependentDbs[e] = !0), t)
                );
              })
                .then(function () {
                  t(null, { db: n });
                })
                .catch(t);
            }
          )),
          (Qe.prototype.destroy = I('destroy', function (e, t) {
            'function' == typeof e && ((t = e), (e = {}));
            var n = this,
              i = !('use_prefix' in n) || n.use_prefix;
            function r() {
              n._destroy(e, function (e, i) {
                if (e) return t(e);
                (n._destroyed = !0),
                  n.emit('destroyed'),
                  t(null, i || { ok: !0 });
              });
            }
            if (ae(n)) return r();
            n.get('_local/_pouch_dependentDbs', function (e, o) {
              if (e) return 404 !== e.status ? t(e) : r();
              var s = o.dependentDbs,
                a = n.constructor,
                c = Object.keys(s).map(function (e) {
                  var t = i ? e.replace(new RegExp('^' + a.prefix), '') : e;
                  return new a(t, n.__opts).destroy();
                });
              Promise.all(c).then(r, t);
            });
          })),
          (et.prototype.execute = function () {
            var e;
            if (this.failed) for (; (e = this.queue.shift()); ) e(this.failed);
            else for (; (e = this.queue.shift()); ) e();
          }),
          (et.prototype.fail = function (e) {
            (this.failed = e), this.execute();
          }),
          (et.prototype.ready = function (e) {
            (this.isReady = !0), (this.db = e), this.execute();
          }),
          (et.prototype.addTask = function (e) {
            this.queue.push(e), this.failed && this.execute();
          }),
          g()(tt, Qe);
        var nt =
            'undefined' != typeof AbortController
              ? AbortController
              : function () {
                  return { abort: function () {} };
                },
          it = fetch,
          rt = Headers;
        (tt.adapters = {}),
          (tt.preferredAdapters = []),
          (tt.prefix = '_pouch_');
        var ot = new m.a();
        !(function (e) {
          Object.keys(m.a.prototype).forEach(function (t) {
            'function' == typeof m.a.prototype[t] && (e[t] = ot[t].bind(ot));
          });
          var t = (e._destructionListeners = new r());
          e.on('ref', function (e) {
            t.has(e.name) || t.set(e.name, []), t.get(e.name).push(e);
          }),
            e.on('unref', function (e) {
              if (t.has(e.name)) {
                var n = t.get(e.name),
                  i = n.indexOf(e);
                i < 0 ||
                  (n.splice(i, 1),
                  n.length > 1 ? t.set(e.name, n) : t.delete(e.name));
              }
            }),
            e.on('destroyed', function (e) {
              if (t.has(e)) {
                var n = t.get(e);
                t.delete(e),
                  n.forEach(function (e) {
                    e.emit('destroyed', !0);
                  });
              }
            });
        })(tt),
          (tt.adapter = function (e, t, n) {
            t.valid() &&
              ((tt.adapters[e] = t), n && tt.preferredAdapters.push(e));
          }),
          (tt.plugin = function (e) {
            if ('function' == typeof e) e(tt);
            else {
              if ('object' != typeof e || 0 === Object.keys(e).length)
                throw new Error(
                  'Invalid plugin: got "' +
                    e +
                    '", expected an object or a function'
                );
              Object.keys(e).forEach(function (t) {
                tt.prototype[t] = e[t];
              });
            }
            return (
              this.__defaults && (tt.__defaults = R({}, this.__defaults)), tt
            );
          }),
          (tt.defaults = function (e) {
            function t(e, n) {
              if (!(this instanceof t)) return new t(e, n);
              (n = n || {}),
                e &&
                  'object' == typeof e &&
                  ((e = (n = e).name), delete n.name),
                (n = R({}, t.__defaults, n)),
                tt.call(this, e, n);
            }
            return (
              g()(t, tt),
              (t.preferredAdapters = tt.preferredAdapters.slice()),
              Object.keys(tt).forEach(function (e) {
                e in t || (t[e] = tt[e]);
              }),
              (t.__defaults = R({}, this.__defaults, e)),
              t
            );
          }),
          (tt.fetch = function (e, t) {
            return it(e, t);
          });
        function st(e, t) {
          for (var n = e, i = 0, r = t.length; i < r; i++) {
            if (!(n = n[t[i]])) break;
          }
          return n;
        }
        function at(e) {
          for (var t = [], n = '', i = 0, r = e.length; i < r; i++) {
            var o = e[i];
            '.' === o
              ? i > 0 && '\\' === e[i - 1]
                ? (n = n.substring(0, n.length - 1) + '.')
                : (t.push(n), (n = ''))
              : (n += o);
          }
          return t.push(n), t;
        }
        var ct = ['$or', '$nor', '$not'];
        function lt(e) {
          return ct.indexOf(e) > -1;
        }
        function ut(e) {
          return Object.keys(e)[0];
        }
        function dt(e) {
          var t = {};
          return (
            e.forEach(function (e) {
              Object.keys(e).forEach(function (n) {
                var i = e[n];
                if (('object' != typeof i && (i = { $eq: i }), lt(n)))
                  t[n] =
                    i instanceof Array
                      ? i.map(function (e) {
                          return dt([e]);
                        })
                      : dt([i]);
                else {
                  var r = (t[n] = t[n] || {});
                  Object.keys(i).forEach(function (e) {
                    var t = i[e];
                    return '$gt' === e || '$gte' === e
                      ? (function (e, t, n) {
                          if (void 0 !== n.$eq) return;
                          void 0 !== n.$gte
                            ? '$gte' === e
                              ? t > n.$gte && (n.$gte = t)
                              : t >= n.$gte && (delete n.$gte, (n.$gt = t))
                            : void 0 !== n.$gt
                            ? '$gte' === e
                              ? t > n.$gt && (delete n.$gt, (n.$gte = t))
                              : t > n.$gt && (n.$gt = t)
                            : (n[e] = t);
                        })(e, t, r)
                      : '$lt' === e || '$lte' === e
                      ? (function (e, t, n) {
                          if (void 0 !== n.$eq) return;
                          void 0 !== n.$lte
                            ? '$lte' === e
                              ? t < n.$lte && (n.$lte = t)
                              : t <= n.$lte && (delete n.$lte, (n.$lt = t))
                            : void 0 !== n.$lt
                            ? '$lte' === e
                              ? t < n.$lt && (delete n.$lt, (n.$lte = t))
                              : t < n.$lt && (n.$lt = t)
                            : (n[e] = t);
                        })(e, t, r)
                      : '$ne' === e
                      ? (function (e, t) {
                          '$ne' in t ? t.$ne.push(e) : (t.$ne = [e]);
                        })(t, r)
                      : '$eq' === e
                      ? (function (e, t) {
                          delete t.$gt,
                            delete t.$gte,
                            delete t.$lt,
                            delete t.$lte,
                            delete t.$ne,
                            (t.$eq = e);
                        })(t, r)
                      : void (r[e] = t);
                  });
                }
              });
            }),
            t
          );
        }
        function ht(e) {
          var t = L(e),
            n = !1;
          (function e(t, n) {
            for (var i in t) {
              '$and' === i && (n = !0);
              var r = t[i];
              'object' == typeof r && (n = e(r, n));
            }
            return n;
          })(t, !1) &&
            ('$and' in
              (t = (function e(t) {
                for (var n in t) {
                  if (Array.isArray(t))
                    for (var i in t) t[i].$and && (t[i] = dt(t[i].$and));
                  var r = t[n];
                  'object' == typeof r && e(r);
                }
                return t;
              })(t)) && (t = dt(t.$and)),
            (n = !0)),
            ['$or', '$nor'].forEach(function (e) {
              e in t &&
                t[e].forEach(function (e) {
                  for (var t = Object.keys(e), n = 0; n < t.length; n++) {
                    var i = t[n],
                      r = e[i];
                    ('object' == typeof r && null !== r) || (e[i] = { $eq: r });
                  }
                });
            }),
            '$not' in t && (t.$not = dt([t.$not]));
          for (var i = Object.keys(t), r = 0; r < i.length; r++) {
            var o = i[r],
              s = t[o];
            'object' != typeof s || null === s
              ? (s = { $eq: s })
              : '$ne' in s && !n && (s.$ne = [s.$ne]),
              (t[o] = s);
          }
          return t;
        }
        function ft(e, t) {
          if (e === t) return 0;
          (e = pt(e)), (t = pt(t));
          var n = bt(e),
            i = bt(t);
          if (n - i != 0) return n - i;
          switch (typeof e) {
            case 'number':
              return e - t;
            case 'boolean':
              return e < t ? -1 : 1;
            case 'string':
              return (function (e, t) {
                return e === t ? 0 : e > t ? 1 : -1;
              })(e, t);
          }
          return Array.isArray(e)
            ? (function (e, t) {
                for (var n = Math.min(e.length, t.length), i = 0; i < n; i++) {
                  var r = ft(e[i], t[i]);
                  if (0 !== r) return r;
                }
                return e.length === t.length ? 0 : e.length > t.length ? 1 : -1;
              })(e, t)
            : (function (e, t) {
                for (
                  var n = Object.keys(e),
                    i = Object.keys(t),
                    r = Math.min(n.length, i.length),
                    o = 0;
                  o < r;
                  o++
                ) {
                  var s = ft(n[o], i[o]);
                  if (0 !== s) return s;
                  if (0 !== (s = ft(e[n[o]], t[i[o]]))) return s;
                }
                return n.length === i.length ? 0 : n.length > i.length ? 1 : -1;
              })(e, t);
        }
        function pt(e) {
          switch (typeof e) {
            case 'undefined':
              return null;
            case 'number':
              return e === 1 / 0 || e === -1 / 0 || isNaN(e) ? null : e;
            case 'object':
              var t = e;
              if (Array.isArray(e)) {
                var n = e.length;
                e = new Array(n);
                for (var i = 0; i < n; i++) e[i] = pt(t[i]);
              } else {
                if (e instanceof Date) return e.toJSON();
                if (null !== e)
                  for (var r in ((e = {}), t))
                    if (t.hasOwnProperty(r)) {
                      var o = t[r];
                      void 0 !== o && (e[r] = pt(o));
                    }
              }
          }
          return e;
        }
        function gt(e) {
          if (null !== e)
            switch (typeof e) {
              case 'boolean':
                return e ? 1 : 0;
              case 'number':
                return (function (e) {
                  if (0 === e) return '1';
                  var t = e.toExponential().split(/e\+?/),
                    n = parseInt(t[1], 10),
                    i = e < 0,
                    r = i ? '0' : '2',
                    o =
                      ((s = ((i ? -n : n) - -324).toString()),
                      (a = '0'),
                      (c = 3),
                      (function (e, t, n) {
                        for (var i = '', r = n - e.length; i.length < r; )
                          i += t;
                        return i;
                      })(s, a, c) + s);
                  var s, a, c;
                  r += '' + o;
                  var l = Math.abs(parseFloat(t[0]));
                  i && (l = 10 - l);
                  var u = l.toFixed(20);
                  return (u = u.replace(/\.?0+$/, '')), (r += '' + u);
                })(e);
              case 'string':
                return e
                  .replace(/\u0002/g, '')
                  .replace(/\u0001/g, '')
                  .replace(/\u0000/g, '');
              case 'object':
                var t = Array.isArray(e),
                  n = t ? e : Object.keys(e),
                  i = -1,
                  r = n.length,
                  o = '';
                if (t) for (; ++i < r; ) o += vt(n[i]);
                else
                  for (; ++i < r; ) {
                    var s = n[i];
                    o += vt(s) + vt(e[s]);
                  }
                return o;
            }
          return '';
        }
        function vt(e) {
          return bt((e = pt(e))) + '' + gt(e) + '\0';
        }
        function mt(e, t) {
          var n,
            i = t;
          if ('1' === e[t]) (n = 0), t++;
          else {
            var r = '0' === e[t];
            t++;
            var o = '',
              s = e.substring(t, t + 3),
              a = parseInt(s, 10) + -324;
            for (r && (a = -a), t += 3; ; ) {
              var c = e[t];
              if ('\0' === c) break;
              (o += c), t++;
            }
            (n =
              1 === (o = o.split('.')).length
                ? parseInt(o, 10)
                : parseFloat(o[0] + '.' + o[1])),
              r && (n -= 10),
              0 !== a && (n = parseFloat(n + 'e' + a));
          }
          return { num: n, length: t - i };
        }
        function yt(e, t) {
          var n = e.pop();
          if (t.length) {
            var i = t[t.length - 1];
            n === i.element && (t.pop(), (i = t[t.length - 1]));
            var r = i.element,
              o = i.index;
            if (Array.isArray(r)) r.push(n);
            else if (o === e.length - 2) {
              r[e.pop()] = n;
            } else e.push(n);
          }
        }
        function bt(e) {
          var t = ['boolean', 'number', 'string', 'object'].indexOf(typeof e);
          return ~t
            ? null === e
              ? 1
              : Array.isArray(e)
              ? 5
              : t < 3
              ? t + 2
              : t + 3
            : Array.isArray(e)
            ? 5
            : void 0;
        }
        function wt(e, t, n) {
          if (
            ((e = e.filter(function (e) {
              return _t(e.doc, t.selector, n);
            })),
            t.sort)
          ) {
            var i = (function (e) {
              function t(t) {
                return e.map(function (e) {
                  var n = at(ut(e));
                  return st(t, n);
                });
              }
              return function (e, n) {
                var i,
                  r,
                  o = ft(t(e.doc), t(n.doc));
                return 0 !== o
                  ? o
                  : ((i = e.doc._id),
                    (r = n.doc._id),
                    i < r ? -1 : i > r ? 1 : 0);
              };
            })(t.sort);
            (e = e.sort(i)),
              'string' != typeof t.sort[0] &&
                'desc' === (r = t.sort[0])[ut(r)] &&
                (e = e.reverse());
          }
          var r;
          if ('limit' in t || 'skip' in t) {
            var o = t.skip || 0,
              s = ('limit' in t ? t.limit : e.length) + o;
            e = e.slice(o, s);
          }
          return e;
        }
        function _t(e, t, n) {
          return n.every(function (n) {
            var i = t[n],
              r = at(n),
              o = st(e, r);
            return lt(n)
              ? (function (e, t, n) {
                  if ('$or' === e)
                    return t.some(function (e) {
                      return _t(n, e, Object.keys(e));
                    });
                  if ('$not' === e) return !_t(n, t, Object.keys(t));
                  return !t.find(function (e) {
                    return _t(n, e, Object.keys(e));
                  });
                })(n, i, e)
              : Et(i, e, r, o);
          });
        }
        function Et(e, t, n, i) {
          return (
            !e ||
            ('object' == typeof e
              ? Object.keys(e).every(function (r) {
                  var o = e[r];
                  return (function (e, t, n, i, r) {
                    if (!kt[e])
                      throw new Error(
                        'unknown operator "' +
                          e +
                          '" - should be one of $eq, $lte, $lt, $gt, $gte, $exists, $ne, $in, $nin, $size, $mod, $regex, $elemMatch, $type, $allMatch or $all'
                      );
                    return kt[e](t, n, i, r);
                  })(r, t, o, n, i);
                })
              : e === i)
          );
        }
        function St(e) {
          return null != e;
        }
        function xt(e) {
          return void 0 !== e;
        }
        function Lt(e, t) {
          return t.some(function (t) {
            return e instanceof Array ? e.indexOf(t) > -1 : e === t;
          });
        }
        var kt = {
          $elemMatch: function (e, t, n, i) {
            return (
              !!Array.isArray(i) &&
              0 !== i.length &&
              ('object' == typeof i[0]
                ? i.some(function (e) {
                    return _t(e, t, Object.keys(t));
                  })
                : i.some(function (i) {
                    return Et(t, e, n, i);
                  }))
            );
          },
          $allMatch: function (e, t, n, i) {
            return (
              !!Array.isArray(i) &&
              0 !== i.length &&
              ('object' == typeof i[0]
                ? i.every(function (e) {
                    return _t(e, t, Object.keys(t));
                  })
                : i.every(function (i) {
                    return Et(t, e, n, i);
                  }))
            );
          },
          $eq: function (e, t, n, i) {
            return xt(i) && 0 === ft(i, t);
          },
          $gte: function (e, t, n, i) {
            return xt(i) && ft(i, t) >= 0;
          },
          $gt: function (e, t, n, i) {
            return xt(i) && ft(i, t) > 0;
          },
          $lte: function (e, t, n, i) {
            return xt(i) && ft(i, t) <= 0;
          },
          $lt: function (e, t, n, i) {
            return xt(i) && ft(i, t) < 0;
          },
          $exists: function (e, t, n, i) {
            return t ? xt(i) : !xt(i);
          },
          $mod: function (e, t, n, i) {
            return (
              St(i) &&
              (function (e, t) {
                var n = t[0],
                  i = t[1];
                if (0 === n)
                  throw new Error('Bad divisor, cannot divide by zero');
                if (parseInt(n, 10) !== n)
                  throw new Error('Divisor is not an integer');
                if (parseInt(i, 10) !== i)
                  throw new Error('Modulus is not an integer');
                return parseInt(e, 10) === e && e % n === i;
              })(i, t)
            );
          },
          $ne: function (e, t, n, i) {
            return t.every(function (e) {
              return 0 !== ft(i, e);
            });
          },
          $in: function (e, t, n, i) {
            return St(i) && Lt(i, t);
          },
          $nin: function (e, t, n, i) {
            return St(i) && !Lt(i, t);
          },
          $size: function (e, t, n, i) {
            return (
              St(i) &&
              (function (e, t) {
                return e.length === t;
              })(i, t)
            );
          },
          $all: function (e, t, n, i) {
            return (
              Array.isArray(i) &&
              (function (e, t) {
                return t.every(function (t) {
                  return e.indexOf(t) > -1;
                });
              })(i, t)
            );
          },
          $regex: function (e, t, n, i) {
            return (
              St(i) &&
              (function (e, t) {
                return new RegExp(t).test(e);
              })(i, t)
            );
          },
          $type: function (e, t, n, i) {
            return (function (e, t) {
              switch (t) {
                case 'null':
                  return null === e;
                case 'boolean':
                  return 'boolean' == typeof e;
                case 'number':
                  return 'number' == typeof e;
                case 'string':
                  return 'string' == typeof e;
                case 'array':
                  return e instanceof Array;
                case 'object':
                  return '[object Object]' === {}.toString.call(e);
              }
              throw new Error(
                t +
                  ' not supported as a type.Please use one of object, string, array, number, boolean or null.'
              );
            })(i, t);
          },
        };
        function Ct(e, t) {
          if (e.selector && e.filter && '_selector' !== e.filter) {
            var n = 'string' == typeof e.filter ? e.filter : 'function';
            return t(new Error('selector invalid for filter "' + n + '"'));
          }
          t();
        }
        function It(e) {
          e.view && !e.filter && (e.filter = '_view'),
            e.selector && !e.filter && (e.filter = '_selector'),
            e.filter &&
              'string' == typeof e.filter &&
              ('_view' === e.filter
                ? (e.view = le(e.view))
                : (e.filter = le(e.filter)));
        }
        function At(e, t) {
          return (
            t.filter && 'string' == typeof t.filter && !t.doc_ids && !ae(e.db)
          );
        }
        function Pt(e, t) {
          var n = t.complete;
          if ('_view' === t.filter) {
            if (!t.view || 'string' != typeof t.view) {
              var i = ne(X, '`view` filter parameter not found or invalid.');
              return n(i);
            }
            var r = ce(t.view);
            e.db.get('_design/' + r[0], function (i, o) {
              if (e.isCancelled) return n(null, { status: 'cancelled' });
              if (i) return n(ie(i));
              var s = o && o.views && o.views[r[1]] && o.views[r[1]].map;
              if (!s)
                return n(
                  ne(
                    F,
                    o.views
                      ? 'missing json key: ' + r[1]
                      : 'missing json key: views'
                  )
                );
              (t.filter = pe(
                [
                  'return function(doc) {',
                  '  "use strict";',
                  '  var emitted = false;',
                  '  var emit = function (a, b) {',
                  '    emitted = true;',
                  '  };',
                  '  var view = ' + s + ';',
                  '  view(doc);',
                  '  if (emitted) {',
                  '    return true;',
                  '  }',
                  '};',
                ].join('\n'),
                {}
              )),
                e.doChanges(t);
            });
          } else if (t.selector)
            (t.filter = function (e) {
              return (function (e, t) {
                if ('object' != typeof t)
                  throw new Error('Selector error: expected a JSON object');
                var n = wt(
                  [{ doc: e }],
                  { selector: (t = ht(t)) },
                  Object.keys(t)
                );
                return n && 1 === n.length;
              })(e, t.selector);
            }),
              e.doChanges(t);
          else {
            var o = ce(t.filter);
            e.db.get('_design/' + o[0], function (i, r) {
              if (e.isCancelled) return n(null, { status: 'cancelled' });
              if (i) return n(ie(i));
              var s = r && r.filters && r.filters[o[1]];
              if (!s)
                return n(
                  ne(
                    F,
                    r && r.filters
                      ? 'missing json key: ' + o[1]
                      : 'missing json key: filters'
                  )
                );
              (t.filter = pe('"use strict";\nreturn ' + s + ';', {})),
                e.doChanges(t);
            });
          }
        }
        function Ot(e) {
          return e.reduce(function (e, t) {
            return (e[t] = !0), e;
          }, {});
        }
        tt.plugin(function (e) {
          e._changesFilterPlugin = {
            validate: Ct,
            normalize: It,
            shouldFilter: At,
            filter: Pt,
          };
        }),
          (tt.version = '7.2.2');
        var Bt = Ot([
            '_id',
            '_rev',
            '_attachments',
            '_deleted',
            '_revisions',
            '_revs_info',
            '_conflicts',
            '_deleted_conflicts',
            '_local_seq',
            '_rev_tree',
            '_replication_id',
            '_replication_state',
            '_replication_state_time',
            '_replication_state_reason',
            '_replication_stats',
            '_removed',
          ]),
          Tt = Ot([
            '_attachments',
            '_replication_id',
            '_replication_state',
            '_replication_state_time',
            '_replication_state_reason',
            '_replication_stats',
          ]);
        function Nt(e) {
          if (!/^\d+-/.test(e)) return ne(ee);
          var t = e.indexOf('-'),
            n = e.substring(0, t),
            i = e.substring(t + 1);
          return { prefix: parseInt(n, 10), id: i };
        }
        function Mt(e, t, n) {
          var i, r, o;
          n || (n = { deterministic_revs: !0 });
          var s = { status: 'available' };
          if ((e._deleted && (s.deleted = !0), t))
            if (
              (e._id || (e._id = Oe()),
              (r = Pe(e, n.deterministic_revs)),
              e._rev)
            ) {
              if ((o = Nt(e._rev)).error) return o;
              (e._rev_tree = [
                {
                  pos: o.prefix,
                  ids: [o.id, { status: 'missing' }, [[r, s, []]]],
                },
              ]),
                (i = o.prefix + 1);
            } else (e._rev_tree = [{ pos: 1, ids: [r, s, []] }]), (i = 1);
          else if (
            (e._revisions &&
              ((e._rev_tree = (function (e, t) {
                for (
                  var n = e.start - e.ids.length + 1,
                    i = e.ids,
                    r = [i[0], t, []],
                    o = 1,
                    s = i.length;
                  o < s;
                  o++
                )
                  r = [i[o], { status: 'missing' }, [r]];
                return [{ pos: n, ids: r }];
              })(e._revisions, s)),
              (i = e._revisions.start),
              (r = e._revisions.ids[0])),
            !e._rev_tree)
          ) {
            if ((o = Nt(e._rev)).error) return o;
            (i = o.prefix),
              (r = o.id),
              (e._rev_tree = [{ pos: i, ids: [r, s, []] }]);
          }
          se(e._id), (e._rev = i + '-' + r);
          var a = { metadata: {}, data: {} };
          for (var c in e)
            if (Object.prototype.hasOwnProperty.call(e, c)) {
              var l = '_' === c[0];
              if (l && !Bt[c]) {
                var u = ne(Y, c);
                throw ((u.message = Y.message + ': ' + c), u);
              }
              l && !Tt[c]
                ? (a.metadata[c.slice(1)] = e[c])
                : (a.data[c] = e[c]);
            }
          return a;
        }
        function jt(e, t, n) {
          var i = (function (e) {
            try {
              return ve(e);
            } catch (e) {
              return {
                error: ne(Z, 'Attachment is not a valid base64 string'),
              };
            }
          })(e.data);
          if (i.error) return n(i.error);
          (e.length = i.length),
            (e.data =
              'blob' === t
                ? we(i, e.content_type)
                : 'base64' === t
                ? me(i)
                : i),
            Ie(i, function (t) {
              (e.digest = 'md5-' + t), n();
            });
        }
        function Dt(e, t, n) {
          if (e.stub) return n();
          'string' == typeof e.data
            ? jt(e, t, n)
            : (function (e, t, n) {
                Ie(e.data, function (i) {
                  (e.digest = 'md5-' + i),
                    (e.length = e.data.size || e.data.length || 0),
                    'binary' === t
                      ? Se(e.data, function (t) {
                          (e.data = t), n();
                        })
                      : 'base64' === t
                      ? xe(e.data, function (t) {
                          (e.data = t), n();
                        })
                      : n();
                });
              })(e, t, n);
        }
        function qt(e, t, n, i, r, o, s, a) {
          if (
            (function (e, t) {
              for (
                var n,
                  i = e.slice(),
                  r = t.split('-'),
                  o = parseInt(r[0], 10),
                  s = r[1];
                (n = i.pop());

              ) {
                if (n.pos === o && n.ids[0] === s) return !0;
                for (var a = n.ids[2], c = 0, l = a.length; c < l; c++)
                  i.push({ pos: n.pos + 1, ids: a[c] });
              }
              return !1;
            })(t.rev_tree, n.metadata.rev) &&
            !a
          )
            return (i[r] = n), o();
          var c = t.winningRev || Be(t),
            l = 'deleted' in t ? t.deleted : We(t, c),
            u = 'deleted' in n.metadata ? n.metadata.deleted : We(n.metadata),
            d = /^1-/.test(n.metadata.rev);
          if (l && !u && a && d) {
            var h = n.data;
            (h._rev = c), (h._id = n.metadata.id), (n = Mt(h, a));
          }
          var f = Ue(t.rev_tree, n.metadata.rev_tree[0], e);
          if (
            a &&
            ((l && u && 'new_leaf' !== f.conflicts) ||
              (!l && 'new_leaf' !== f.conflicts) ||
              (l && !u && 'new_branch' === f.conflicts))
          ) {
            var p = ne(H);
            return (i[r] = p), o();
          }
          var g = n.metadata.rev;
          (n.metadata.rev_tree = f.tree),
            (n.stemmedRevs = f.stemmedRevs || []),
            t.rev_map && (n.metadata.rev_map = t.rev_map);
          var v = Be(n.metadata),
            m = We(n.metadata, v),
            y = l === m ? 0 : l < m ? -1 : 1;
          s(n, v, m, g === v ? m : We(n.metadata, g), !0, y, r, o);
        }
        function Rt(e, t, n, i, o, s, a, c, l) {
          e = e || 1e3;
          var u = c.new_edits,
            d = new r(),
            h = 0,
            f = t.length;
          function p() {
            ++h === f && l && l();
          }
          t.forEach(function (e, t) {
            if (e._id && $e(e._id)) {
              var i = e._deleted ? '_removeLocal' : '_putLocal';
              n[i](e, { ctx: o }, function (e, n) {
                (s[t] = e || n), p();
              });
            } else {
              var r = e.metadata.id;
              d.has(r) ? (f--, d.get(r).push([e, t])) : d.set(r, [[e, t]]);
            }
          }),
            d.forEach(function (t, n) {
              var r = 0;
              function o() {
                ++r < t.length ? l() : p();
              }
              function l() {
                var l = t[r],
                  d = l[0],
                  h = l[1];
                if (i.has(n)) qt(e, i.get(n), d, s, h, o, a, u);
                else {
                  var f = Ue([], d.metadata.rev_tree[0], e);
                  (d.metadata.rev_tree = f.tree),
                    (d.stemmedRevs = f.stemmedRevs || []),
                    (function (e, t, n) {
                      var i = Be(e.metadata),
                        r = We(e.metadata, i);
                      if ('was_delete' in c && r)
                        return (s[t] = ne(F, 'deleted')), n();
                      if (
                        u &&
                        (function (e) {
                          return (
                            'missing' === e.metadata.rev_tree[0].ids[1].status
                          );
                        })(e)
                      ) {
                        var o = ne(H);
                        return (s[t] = o), n();
                      }
                      a(e, i, r, r, !1, r ? 0 : 1, t, n);
                    })(d, h, o);
                }
              }
              l();
            });
        }
        var Vt = 'document-store',
          zt = 'meta-store';
        function Ft(e) {
          try {
            return JSON.stringify(e);
          } catch (t) {
            return d.a.stringify(e);
          }
        }
        function Ht(e) {
          return function (t) {
            var n = 'unknown_error';
            t.target &&
              t.target.error &&
              (n = t.target.error.name || t.target.error.message),
              e(ne(Q, n, t.type));
          };
        }
        function Ut(e, t, n) {
          return {
            data: Ft(e),
            winningRev: t,
            deletedOrLocal: n ? '1' : '0',
            seq: e.seq,
            id: e.id,
          };
        }
        function Gt(e) {
          if (!e) return null;
          var t = (function (e) {
            try {
              return JSON.parse(e);
            } catch (t) {
              return d.a.parse(e);
            }
          })(e.data);
          return (
            (t.winningRev = e.winningRev),
            (t.deleted = '1' === e.deletedOrLocal),
            (t.seq = e.seq),
            t
          );
        }
        function Wt(e) {
          if (!e) return e;
          var t = e._doc_id_rev.lastIndexOf(':');
          return (
            (e._id = e._doc_id_rev.substring(0, t - 1)),
            (e._rev = e._doc_id_rev.substring(t + 1)),
            delete e._doc_id_rev,
            e
          );
        }
        function $t(e, t, n, i) {
          n
            ? i(
                e
                  ? 'string' != typeof e
                    ? e
                    : _e(e, t)
                  : ye([''], { type: t })
              )
            : e
            ? 'string' != typeof e
              ? Ee(e, function (e) {
                  i(me(e));
                })
              : i(e)
            : i('');
        }
        function Zt(e, t, n, i) {
          var r = Object.keys(e._attachments || {});
          if (!r.length) return i && i();
          var o = 0;
          function s() {
            ++o === r.length && i && i();
          }
          r.forEach(function (i) {
            t.attachments && t.include_docs
              ? (function (e, t) {
                  var i = e._attachments[t],
                    r = i.digest;
                  n.objectStore('attach-store').get(r).onsuccess = function (
                    e
                  ) {
                    (i.body = e.target.result.body), s();
                  };
                })(e, i)
              : ((e._attachments[i].stub = !0), s());
          });
        }
        function Kt(e, t) {
          return Promise.all(
            e.map(function (e) {
              if (e.doc && e.doc._attachments) {
                var n = Object.keys(e.doc._attachments);
                return Promise.all(
                  n.map(function (n) {
                    var i = e.doc._attachments[n];
                    if ('body' in i) {
                      var r = i.body,
                        o = i.content_type;
                      return new Promise(function (s) {
                        $t(r, o, t, function (t) {
                          (e.doc._attachments[n] = R(
                            A(i, ['digest', 'content_type']),
                            { data: t }
                          )),
                            s();
                        });
                      });
                    }
                  })
                );
              }
            })
          );
        }
        function Yt(e, t, n) {
          var i = [],
            r = n.objectStore('by-sequence'),
            o = n.objectStore('attach-store'),
            s = n.objectStore('attach-seq-store'),
            a = e.length;
          function c() {
            --a ||
              (function () {
                if (!i.length) return;
                i.forEach(function (e) {
                  s
                    .index('digestSeq')
                    .count(
                      IDBKeyRange.bound(e + '::', e + '::￿', !1, !1)
                    ).onsuccess = function (t) {
                    t.target.result || o.delete(e);
                  };
                });
              })();
          }
          e.forEach(function (e) {
            var n = r.index('_doc_id_rev'),
              o = t + '::' + e;
            n.getKey(o).onsuccess = function (e) {
              var t = e.target.result;
              if ('number' != typeof t) return c();
              r.delete(t),
                (s.index('seq').openCursor(IDBKeyRange.only(t)).onsuccess =
                  function (e) {
                    var t = e.target.result;
                    if (t) {
                      var n = t.value.digestSeq.split('::')[0];
                      i.push(n), s.delete(t.primaryKey), t.continue();
                    } else c();
                  });
            };
          });
        }
        function Xt(e, t, n) {
          try {
            return { txn: e.transaction(t, n) };
          } catch (e) {
            return { error: e };
          }
        }
        var Jt = new M();
        function Qt(e, t, n, i, o, s) {
          for (
            var a, c, l, u, d, h, f, p, g = t.docs, v = 0, m = g.length;
            v < m;
            v++
          ) {
            var y = g[v];
            (y._id && $e(y._id)) ||
              ((y = g[v] = Mt(y, n.new_edits, e)).error && !f && (f = y));
          }
          if (f) return s(f);
          var b = !1,
            w = 0,
            _ = new Array(g.length),
            E = new r(),
            S = !1,
            x = i._meta.blobSupport ? 'blob' : 'base64';
          function L() {
            (b = !0), k();
          }
          function k() {
            p && b && ((p.docCount += w), h.put(p));
          }
          function C() {
            S || (Jt.notify(i._meta.name), s(null, _));
          }
          function I(e, t, n, i, r, o, s, a) {
            (e.metadata.winningRev = t), (e.metadata.deleted = n);
            var c = e.data;
            if (
              ((c._id = e.metadata.id),
              (c._rev = e.metadata.rev),
              i && (c._deleted = !0),
              c._attachments && Object.keys(c._attachments).length)
            )
              return (function (e, t, n, i, r, o) {
                var s = e.data,
                  a = 0,
                  c = Object.keys(s._attachments);
                function l() {
                  a === c.length && A(e, t, n, i, r, o);
                }
                function d() {
                  a++, l();
                }
                c.forEach(function (n) {
                  var i = e.data._attachments[n];
                  if (i.stub) a++, l();
                  else {
                    var r = i.data;
                    delete i.data,
                      (i.revpos = parseInt(t, 10)),
                      (function (e, t, n) {
                        u.count(e).onsuccess = function (i) {
                          if (i.target.result) return n();
                          var r = { digest: e, body: t };
                          u.put(r).onsuccess = n;
                        };
                      })(i.digest, r, d);
                  }
                });
              })(e, t, n, r, s, a);
            (w += o), k(), A(e, t, n, r, s, a);
          }
          function A(e, t, n, r, o, s) {
            var u = e.data,
              h = e.metadata;
            function f(o) {
              var s = e.stemmedRevs || [];
              r &&
                i.auto_compaction &&
                (s = s.concat(
                  (function (e) {
                    var t = [];
                    return (
                      Te(e.rev_tree, function (e, n, i, r, o) {
                        'available' !== o.status ||
                          e ||
                          (t.push(n + '-' + i), (o.status = 'missing'));
                      }),
                      t
                    );
                  })(e.metadata)
                )),
                s && s.length && Yt(s, e.metadata.id, a),
                (h.seq = o.target.result);
              var l = Ut(h, t, n);
              c.put(l).onsuccess = p;
            }
            function p() {
              (_[o] = { ok: !0, id: h.id, rev: h.rev }),
                E.set(e.metadata.id, e.metadata),
                (function (e, t, n) {
                  var i = 0,
                    r = Object.keys(e.data._attachments || {});
                  if (!r.length) return n();
                  function o() {
                    ++i === r.length && n();
                  }
                  function s(n) {
                    var i = e.data._attachments[n].digest,
                      r = d.put({ seq: t, digestSeq: i + '::' + t });
                    (r.onsuccess = o),
                      (r.onerror = function (e) {
                        e.preventDefault(), e.stopPropagation(), o();
                      });
                  }
                  for (var a = 0; a < r.length; a++) s(r[a]);
                })(e, h.seq, s);
            }
            (u._doc_id_rev = h.id + '::' + h.rev), delete u._id, delete u._rev;
            var g = l.put(u);
            (g.onsuccess = f),
              (g.onerror = function (e) {
                e.preventDefault(),
                  e.stopPropagation(),
                  (l.index('_doc_id_rev').getKey(u._doc_id_rev).onsuccess =
                    function (e) {
                      l.put(u, e.target.result).onsuccess = f;
                    });
              });
          }
          !(function (e, t, n) {
            if (!e.length) return n();
            var i,
              r = 0;
            function o() {
              r++, e.length === r && (i ? n(i) : n());
            }
            e.forEach(function (e) {
              var n =
                  e.data && e.data._attachments
                    ? Object.keys(e.data._attachments)
                    : [],
                r = 0;
              if (!n.length) return o();
              function s(e) {
                (i = e), ++r === n.length && o();
              }
              for (var a in e.data._attachments)
                e.data._attachments.hasOwnProperty(a) &&
                  Dt(e.data._attachments[a], t, s);
            });
          })(g, x, function (t) {
            if (t) return s(t);
            !(function () {
              var t = Xt(
                o,
                [
                  Vt,
                  'by-sequence',
                  'attach-store',
                  'local-store',
                  'attach-seq-store',
                  zt,
                ],
                'readwrite'
              );
              if (t.error) return s(t.error);
              ((a = t.txn).onabort = Ht(s)),
                (a.ontimeout = Ht(s)),
                (a.oncomplete = C),
                (c = a.objectStore(Vt)),
                (l = a.objectStore('by-sequence')),
                (u = a.objectStore('attach-store')),
                (d = a.objectStore('attach-seq-store')),
                ((h = a.objectStore(zt)).get(zt).onsuccess = function (e) {
                  (p = e.target.result), k();
                }),
                (function (e) {
                  var t = [];
                  if (
                    (g.forEach(function (e) {
                      e.data &&
                        e.data._attachments &&
                        Object.keys(e.data._attachments).forEach(function (n) {
                          var i = e.data._attachments[n];
                          i.stub && t.push(i.digest);
                        });
                    }),
                    !t.length)
                  )
                    return e();
                  var n,
                    i = 0;
                  t.forEach(function (r) {
                    !(function (e, t) {
                      u.get(e).onsuccess = function (n) {
                        if (n.target.result) t();
                        else {
                          var i = ne(
                            te,
                            'unknown stub attachment with digest ' + e
                          );
                          (i.status = 412), t(i);
                        }
                      };
                    })(r, function (r) {
                      r && !n && (n = r), ++i === t.length && e(n);
                    });
                  });
                })(function (t) {
                  if (t) return (S = !0), s(t);
                  !(function () {
                    if (!g.length) return;
                    var t = 0;
                    function r() {
                      ++t === g.length &&
                        Rt(e.revs_limit, g, i, E, a, _, I, n, L);
                    }
                    function o(e) {
                      var t = Gt(e.target.result);
                      t && E.set(t.id, t), r();
                    }
                    for (var s = 0, l = g.length; s < l; s++) {
                      var u = g[s];
                      if (u._id && $e(u._id)) r();
                      else c.get(u.metadata.id).onsuccess = o;
                    }
                  })();
                });
            })();
          });
        }
        function en(e, t, n, i, r) {
          var o, s, a;
          function c(e) {
            (s = e.target.result), o && r(o, s, a);
          }
          function l(e) {
            (o = e.target.result), s && r(o, s, a);
          }
          function u(e) {
            var t = e.target.result;
            if (!t) return r();
            r([t.key], [t.value], t);
          }
          -1 === i && (i = 1e3),
            'function' == typeof e.getAll &&
            'function' == typeof e.getAllKeys &&
            i > 1 &&
            !n
              ? ((a = {
                  continue: function () {
                    if (!o.length) return r();
                    var n,
                      a = o[o.length - 1];
                    if (t && t.upper)
                      try {
                        n = IDBKeyRange.bound(a, t.upper, !0, t.upperOpen);
                      } catch (e) {
                        if ('DataError' === e.name && 0 === e.code) return r();
                      }
                    else n = IDBKeyRange.lowerBound(a, !0);
                    (t = n),
                      (o = null),
                      (s = null),
                      (e.getAll(t, i).onsuccess = c),
                      (e.getAllKeys(t, i).onsuccess = l);
                  },
                }),
                (e.getAll(t, i).onsuccess = c),
                (e.getAllKeys(t, i).onsuccess = l))
              : n
              ? (e.openCursor(t, 'prev').onsuccess = u)
              : (e.openCursor(t).onsuccess = u);
        }
        function tn(e, t, n) {
          var i,
            r,
            o = 'startkey' in e && e.startkey,
            s = 'endkey' in e && e.endkey,
            a = 'key' in e && e.key,
            c = 'keys' in e && e.keys,
            l = e.skip || 0,
            u = 'number' == typeof e.limit ? e.limit : -1,
            d = !1 !== e.inclusive_end;
          if (
            !c &&
            (r =
              (i = (function (e, t, n, i, r) {
                try {
                  if (e && t)
                    return r
                      ? IDBKeyRange.bound(t, e, !n, !1)
                      : IDBKeyRange.bound(e, t, !1, !n);
                  if (e)
                    return r
                      ? IDBKeyRange.upperBound(e)
                      : IDBKeyRange.lowerBound(e);
                  if (t)
                    return r
                      ? IDBKeyRange.lowerBound(t, !n)
                      : IDBKeyRange.upperBound(t, !n);
                  if (i) return IDBKeyRange.only(i);
                } catch (e) {
                  return { error: e };
                }
                return null;
              })(o, s, d, a, e.descending)) && i.error) &&
            ('DataError' !== r.name || 0 !== r.code)
          )
            return n(ne(Q, r.name, r.message));
          var h = [Vt, 'by-sequence', zt];
          e.attachments && h.push('attach-store');
          var f = Xt(t, h, 'readonly');
          if (f.error) return n(f.error);
          var p = f.txn;
          (p.oncomplete = function () {
            e.attachments ? Kt(E, e.binary).then(k) : k();
          }),
            (p.onabort = Ht(n));
          var g,
            v,
            m,
            y = p.objectStore(Vt),
            b = p.objectStore('by-sequence'),
            w = p.objectStore(zt),
            _ = b.index('_doc_id_rev'),
            E = [];
          function S(t, n) {
            var i = { id: n.id, key: n.id, value: { rev: t } };
            n.deleted
              ? c && (E.push(i), (i.value.deleted = !0), (i.doc = null))
              : l-- <= 0 &&
                (E.push(i),
                e.include_docs &&
                  (function (t, n, i) {
                    var r = t.id + '::' + i;
                    _.get(r).onsuccess = function (i) {
                      if (((n.doc = Wt(i.target.result) || {}), e.conflicts)) {
                        var r = je(t);
                        r.length && (n.doc._conflicts = r);
                      }
                      Zt(n.doc, e, p);
                    };
                  })(n, i, t));
          }
          function x(e) {
            for (var t = 0, n = e.length; t < n && E.length !== u; t++) {
              var i = e[t];
              if (i.error && c) E.push(i);
              else {
                var r = Gt(i);
                S(r.winningRev, r);
              }
            }
          }
          function L(e, t, n) {
            n && (x(t), E.length < u && n.continue());
          }
          function k() {
            var t = { total_rows: g, offset: e.skip, rows: E };
            e.update_seq && void 0 !== v && (t.update_seq = v), n(null, t);
          }
          return (
            (w.get(zt).onsuccess = function (e) {
              g = e.target.result.docCount;
            }),
            e.update_seq &&
              ((m = function (e) {
                e.target.result &&
                  e.target.result.length > 0 &&
                  (v = e.target.result[0]);
              }),
              (b.openCursor(null, 'prev').onsuccess = function (e) {
                var t = e.target.result,
                  n = void 0;
                return (
                  t && t.key && (n = t.key), m({ target: { result: [n] } })
                );
              })),
            r || 0 === u
              ? void 0
              : c
              ? (function (e, t, n) {
                  var i = new Array(e.length),
                    r = 0;
                  e.forEach(function (o, s) {
                    t.get(o).onsuccess = function (t) {
                      t.target.result
                        ? (i[s] = t.target.result)
                        : (i[s] = { key: o, error: 'not_found' }),
                        ++r === e.length && n(e, i, {});
                    };
                  });
                })(e.keys, y, L)
              : -1 === u
              ? (function (e, t, n) {
                  if ('function' != typeof e.getAll) {
                    var i = [];
                    e.openCursor(t).onsuccess = function (e) {
                      var t = e.target.result;
                      t
                        ? (i.push(t.value), t.continue())
                        : n({ target: { result: i } });
                    };
                  } else e.getAll(t).onsuccess = n;
                })(y, i, function (t) {
                  var n = t.target.result;
                  e.descending && (n = n.reverse()), x(n);
                })
              : void en(y, i, e.descending, u + l, L)
          );
        }
        var nn = !1,
          rn = [];
        function on() {
          !nn && rn.length && ((nn = !0), rn.shift()());
        }
        function sn(e, t, n, o) {
          if ((e = L(e)).continuous) {
            var s = n + ':' + Oe();
            return (
              Jt.addListener(n, s, t, e),
              Jt.notify(n),
              {
                cancel: function () {
                  Jt.removeListener(n, s);
                },
              }
            );
          }
          var a = e.doc_ids && new i(e.doc_ids);
          e.since = e.since || 0;
          var c = e.since,
            l = 'limit' in e ? e.limit : -1;
          0 === l && (l = 1);
          var u,
            d,
            h,
            f,
            p = [],
            g = 0,
            v = re(e),
            m = new r();
          function y(e, t, n, i) {
            if (n.seq !== t) return i();
            if (n.winningRev === e._rev) return i(n, e);
            var r = e._id + '::' + n.winningRev;
            f.get(r).onsuccess = function (e) {
              i(n, Wt(e.target.result));
            };
          }
          function b() {
            e.complete(null, { results: p, last_seq: c });
          }
          var w = [Vt, 'by-sequence'];
          e.attachments && w.push('attach-store');
          var _ = Xt(o, w, 'readonly');
          if (_.error) return e.complete(_.error);
          ((u = _.txn).onabort = Ht(e.complete)),
            (u.oncomplete = function () {
              !e.continuous && e.attachments ? Kt(p).then(b) : b();
            }),
            (d = u.objectStore('by-sequence')),
            (h = u.objectStore(Vt)),
            (f = d.index('_doc_id_rev')),
            en(
              d,
              e.since && !e.descending
                ? IDBKeyRange.lowerBound(e.since, !0)
                : null,
              e.descending,
              l,
              function (t, n, i) {
                if (i && t.length) {
                  var r = new Array(t.length),
                    o = new Array(t.length),
                    s = 0;
                  n.forEach(function (n, c) {
                    !(function (e, t, n) {
                      if (a && !a.has(e._id)) return n();
                      var i = m.get(e._id);
                      if (i) return y(e, t, i, n);
                      h.get(e._id).onsuccess = function (r) {
                        (i = Gt(r.target.result)),
                          m.set(e._id, i),
                          y(e, t, i, n);
                      };
                    })(Wt(n), t[c], function (n, a) {
                      (o[c] = n),
                        (r[c] = a),
                        ++s === t.length &&
                          (function () {
                            for (
                              var t = [], n = 0, s = r.length;
                              n < s && g !== l;
                              n++
                            ) {
                              var a = r[n];
                              if (a) {
                                var c = o[n];
                                t.push(d(c, a));
                              }
                            }
                            Promise.all(t)
                              .then(function (t) {
                                for (var n = 0, i = t.length; n < i; n++)
                                  t[n] && e.onChange(t[n]);
                              })
                              .catch(e.complete),
                              g !== l && i.continue();
                          })();
                    });
                  });
                }
                function d(t, n) {
                  var i = e.processChange(n, t, e);
                  c = i.seq = t.seq;
                  var r = v(i);
                  return 'object' == typeof r
                    ? Promise.reject(r)
                    : r
                    ? (g++,
                      e.return_docs && p.push(i),
                      e.attachments && e.include_docs
                        ? new Promise(function (t) {
                            Zt(n, e, u, function () {
                              Kt([i], e.binary).then(function () {
                                t(i);
                              });
                            });
                          })
                        : Promise.resolve(i))
                    : Promise.resolve();
                }
              }
            );
        }
        var an,
          cn = new r(),
          ln = new r();
        function un(e, t) {
          var n = this;
          !(function (e, t, n) {
            rn.push(function () {
              e(function (e, i) {
                !(function (e, t, n, i) {
                  try {
                    e(t, n);
                  } catch (t) {
                    i.emit('error', t);
                  }
                })(t, e, i, n),
                  (nn = !1),
                  s()(function () {
                    on();
                  });
              });
            }),
              on();
          })(
            function (t) {
              !(function (e, t, n) {
                var i = t.name,
                  r = null;
                function o(e, t) {
                  var n = e.objectStore(Vt);
                  n.createIndex('deletedOrLocal', 'deletedOrLocal', {
                    unique: !1,
                  }),
                    (n.openCursor().onsuccess = function (e) {
                      var i = e.target.result;
                      if (i) {
                        var r = i.value,
                          o = We(r);
                        (r.deletedOrLocal = o ? '1' : '0'),
                          n.put(r),
                          i.continue();
                      } else t();
                    });
                }
                function a(e, t) {
                  var n = e.objectStore('local-store'),
                    i = e.objectStore(Vt),
                    r = e.objectStore('by-sequence');
                  i.openCursor().onsuccess = function (e) {
                    var o = e.target.result;
                    if (o) {
                      var s = o.value,
                        a = s.id,
                        c = $e(a),
                        l = Be(s);
                      if (c) {
                        var u = a + '::' + l,
                          d = a + '::',
                          h = a + '::~',
                          f = r.index('_doc_id_rev'),
                          p = IDBKeyRange.bound(d, h, !1, !1),
                          g = f.openCursor(p);
                        g.onsuccess = function (e) {
                          if ((g = e.target.result)) {
                            var t = g.value;
                            t._doc_id_rev === u && n.put(t),
                              r.delete(g.primaryKey),
                              g.continue();
                          } else i.delete(o.primaryKey), o.continue();
                        };
                      } else o.continue();
                    } else t && t();
                  };
                }
                function c(e, t) {
                  var n = e.objectStore('by-sequence'),
                    i = e.objectStore('attach-store'),
                    r = e.objectStore('attach-seq-store');
                  i.count().onsuccess = function (e) {
                    if (!e.target.result) return t();
                    n.openCursor().onsuccess = function (e) {
                      var n = e.target.result;
                      if (!n) return t();
                      for (
                        var i = n.value,
                          o = n.primaryKey,
                          s = Object.keys(i._attachments || {}),
                          a = {},
                          c = 0;
                        c < s.length;
                        c++
                      ) {
                        a[i._attachments[s[c]].digest] = !0;
                      }
                      var l = Object.keys(a);
                      for (c = 0; c < l.length; c++) {
                        var u = l[c];
                        r.put({ seq: o, digestSeq: u + '::' + o });
                      }
                      n.continue();
                    };
                  };
                }
                function l(e) {
                  var t = e.objectStore('by-sequence'),
                    n = e.objectStore(Vt);
                  n.openCursor().onsuccess = function (e) {
                    var i = e.target.result;
                    if (i) {
                      var r,
                        o = (r = i.value).data
                          ? Gt(r)
                          : ((r.deleted = '1' === r.deletedOrLocal), r);
                      if (((o.winningRev = o.winningRev || Be(o)), o.seq))
                        return s();
                      !(function () {
                        var e = o.id + '::',
                          n = o.id + '::￿',
                          i = t
                            .index('_doc_id_rev')
                            .openCursor(IDBKeyRange.bound(e, n)),
                          r = 0;
                        i.onsuccess = function (e) {
                          var t = e.target.result;
                          if (!t) return (o.seq = r), s();
                          var n = t.primaryKey;
                          n > r && (r = n), t.continue();
                        };
                      })();
                    }
                    function s() {
                      var e = Ut(o, o.winningRev, o.deleted);
                      n.put(e).onsuccess = function () {
                        i.continue();
                      };
                    }
                  };
                }
                (e._meta = null),
                  (e._remote = !1),
                  (e.type = function () {
                    return 'idb';
                  }),
                  (e._id = C(function (t) {
                    t(null, e._meta.instanceId);
                  })),
                  (e._bulkDocs = function (n, i, o) {
                    Qt(t, n, i, e, r, o);
                  }),
                  (e._get = function (e, t, n) {
                    var i,
                      o,
                      s,
                      a = t.ctx;
                    if (!a) {
                      var c = Xt(
                        r,
                        [Vt, 'by-sequence', 'attach-store'],
                        'readonly'
                      );
                      if (c.error) return n(c.error);
                      a = c.txn;
                    }
                    function l() {
                      n(s, { doc: i, metadata: o, ctx: a });
                    }
                    a.objectStore(Vt).get(e).onsuccess = function (e) {
                      if (!(o = Gt(e.target.result)))
                        return (s = ne(F, 'missing')), l();
                      var n;
                      if (t.rev)
                        n = t.latest
                          ? (function (e, t) {
                              for (
                                var n, i = t.rev_tree.slice();
                                (n = i.pop());

                              ) {
                                var r = n.pos,
                                  o = n.ids,
                                  s = o[0],
                                  a = o[1],
                                  c = o[2],
                                  l = 0 === c.length,
                                  u = n.history ? n.history.slice() : [];
                                if ((u.push({ id: s, pos: r, opts: a }), l))
                                  for (var d = 0, h = u.length; d < h; d++) {
                                    var f = u[d];
                                    if (f.pos + '-' + f.id === e)
                                      return r + '-' + s;
                                  }
                                for (var p = 0, g = c.length; p < g; p++)
                                  i.push({ pos: r + 1, ids: c[p], history: u });
                              }
                              throw new Error(
                                'Unable to resolve latest revision for id ' +
                                  t.id +
                                  ', rev ' +
                                  e
                              );
                            })(t.rev, o)
                          : t.rev;
                      else if (((n = o.winningRev), We(o)))
                        return (s = ne(F, 'deleted')), l();
                      var r = a.objectStore('by-sequence'),
                        c = o.id + '::' + n;
                      r.index('_doc_id_rev').get(c).onsuccess = function (e) {
                        if (((i = e.target.result) && (i = Wt(i)), !i))
                          return (s = ne(F, 'missing')), l();
                        l();
                      };
                    };
                  }),
                  (e._getAttachment = function (e, t, n, i, o) {
                    var s;
                    if (i.ctx) s = i.ctx;
                    else {
                      var a = Xt(
                        r,
                        [Vt, 'by-sequence', 'attach-store'],
                        'readonly'
                      );
                      if (a.error) return o(a.error);
                      s = a.txn;
                    }
                    var c = n.digest,
                      l = n.content_type;
                    s.objectStore('attach-store').get(c).onsuccess = function (
                      e
                    ) {
                      $t(e.target.result.body, l, i.binary, function (e) {
                        o(null, e);
                      });
                    };
                  }),
                  (e._info = function (t) {
                    var n,
                      i,
                      o = Xt(r, [zt, 'by-sequence'], 'readonly');
                    if (o.error) return t(o.error);
                    var s = o.txn;
                    (s.objectStore(zt).get(zt).onsuccess = function (e) {
                      i = e.target.result.docCount;
                    }),
                      (s
                        .objectStore('by-sequence')
                        .openCursor(null, 'prev').onsuccess = function (e) {
                        var t = e.target.result;
                        n = t ? t.key : 0;
                      }),
                      (s.oncomplete = function () {
                        t(null, {
                          doc_count: i,
                          update_seq: n,
                          idb_attachment_format: e._meta.blobSupport
                            ? 'binary'
                            : 'base64',
                        });
                      });
                  }),
                  (e._allDocs = function (e, t) {
                    tn(e, r, t);
                  }),
                  (e._changes = function (t) {
                    return sn(t, e, i, r);
                  }),
                  (e._close = function (e) {
                    r.close(), cn.delete(i), e();
                  }),
                  (e._getRevisionTree = function (e, t) {
                    var n = Xt(r, [Vt], 'readonly');
                    if (n.error) return t(n.error);
                    n.txn.objectStore(Vt).get(e).onsuccess = function (e) {
                      var n = Gt(e.target.result);
                      n ? t(null, n.rev_tree) : t(ne(F));
                    };
                  }),
                  (e._doCompaction = function (e, t, n) {
                    var i = Xt(
                      r,
                      [Vt, 'by-sequence', 'attach-store', 'attach-seq-store'],
                      'readwrite'
                    );
                    if (i.error) return n(i.error);
                    var o = i.txn;
                    (o.objectStore(Vt).get(e).onsuccess = function (n) {
                      var i = Gt(n.target.result);
                      Te(i.rev_tree, function (e, n, i, r, o) {
                        var s = n + '-' + i;
                        -1 !== t.indexOf(s) && (o.status = 'missing');
                      }),
                        Yt(t, e, o);
                      var r = i.winningRev,
                        s = i.deleted;
                      o.objectStore(Vt).put(Ut(i, r, s));
                    }),
                      (o.onabort = Ht(n)),
                      (o.oncomplete = function () {
                        n();
                      });
                  }),
                  (e._getLocal = function (e, t) {
                    var n = Xt(r, ['local-store'], 'readonly');
                    if (n.error) return t(n.error);
                    var i = n.txn.objectStore('local-store').get(e);
                    (i.onerror = Ht(t)),
                      (i.onsuccess = function (e) {
                        var n = e.target.result;
                        n ? (delete n._doc_id_rev, t(null, n)) : t(ne(F));
                      });
                  }),
                  (e._putLocal = function (e, t, n) {
                    'function' == typeof t && ((n = t), (t = {})),
                      delete e._revisions;
                    var i = e._rev,
                      o = e._id;
                    e._rev = i
                      ? '0-' + (parseInt(i.split('-')[1], 10) + 1)
                      : '0-1';
                    var s,
                      a = t.ctx;
                    if (!a) {
                      var c = Xt(r, ['local-store'], 'readwrite');
                      if (c.error) return n(c.error);
                      ((a = c.txn).onerror = Ht(n)),
                        (a.oncomplete = function () {
                          s && n(null, s);
                        });
                    }
                    var l,
                      u = a.objectStore('local-store');
                    i
                      ? ((l = u.get(o)).onsuccess = function (r) {
                          var o = r.target.result;
                          o && o._rev === i
                            ? (u.put(e).onsuccess = function () {
                                (s = { ok: !0, id: e._id, rev: e._rev }),
                                  t.ctx && n(null, s);
                              })
                            : n(ne(H));
                        })
                      : (((l = u.add(e)).onerror = function (e) {
                          n(ne(H)), e.preventDefault(), e.stopPropagation();
                        }),
                        (l.onsuccess = function () {
                          (s = { ok: !0, id: e._id, rev: e._rev }),
                            t.ctx && n(null, s);
                        }));
                  }),
                  (e._removeLocal = function (e, t, n) {
                    'function' == typeof t && ((n = t), (t = {}));
                    var i,
                      o = t.ctx;
                    if (!o) {
                      var s = Xt(r, ['local-store'], 'readwrite');
                      if (s.error) return n(s.error);
                      (o = s.txn).oncomplete = function () {
                        i && n(null, i);
                      };
                    }
                    var a = e._id,
                      c = o.objectStore('local-store'),
                      l = c.get(a);
                    (l.onerror = Ht(n)),
                      (l.onsuccess = function (r) {
                        var o = r.target.result;
                        o && o._rev === e._rev
                          ? (c.delete(a),
                            (i = { ok: !0, id: a, rev: '0-0' }),
                            t.ctx && n(null, i))
                          : n(ne(F));
                      });
                  }),
                  (e._destroy = function (e, t) {
                    Jt.removeAllListeners(i);
                    var n = ln.get(i);
                    n && n.result && (n.result.close(), cn.delete(i));
                    var r = indexedDB.deleteDatabase(i);
                    (r.onsuccess = function () {
                      ln.delete(i),
                        N() && i in localStorage && delete localStorage[i],
                        t(null, { ok: !0 });
                    }),
                      (r.onerror = Ht(t));
                  });
                var u = cn.get(i);
                if (u)
                  return (
                    (r = u.idb),
                    (e._meta = u.global),
                    s()(function () {
                      n(null, e);
                    })
                  );
                var d = indexedDB.open(i, 5);
                ln.set(i, d),
                  (d.onupgradeneeded = function (e) {
                    var t = e.target.result;
                    if (e.oldVersion < 1)
                      return (function (e) {
                        var t = e.createObjectStore(Vt, { keyPath: 'id' });
                        e
                          .createObjectStore('by-sequence', {
                            autoIncrement: !0,
                          })
                          .createIndex('_doc_id_rev', '_doc_id_rev', {
                            unique: !0,
                          }),
                          e.createObjectStore('attach-store', {
                            keyPath: 'digest',
                          }),
                          e.createObjectStore(zt, {
                            keyPath: 'id',
                            autoIncrement: !1,
                          }),
                          e.createObjectStore('detect-blob-support'),
                          t.createIndex('deletedOrLocal', 'deletedOrLocal', {
                            unique: !1,
                          }),
                          e.createObjectStore('local-store', {
                            keyPath: '_id',
                          });
                        var n = e.createObjectStore('attach-seq-store', {
                          autoIncrement: !0,
                        });
                        n.createIndex('seq', 'seq'),
                          n.createIndex('digestSeq', 'digestSeq', {
                            unique: !0,
                          });
                      })(t);
                    var n = e.currentTarget.transaction;
                    e.oldVersion < 3 &&
                      (function (e) {
                        e.createObjectStore('local-store', {
                          keyPath: '_id',
                        }).createIndex('_doc_id_rev', '_doc_id_rev', {
                          unique: !0,
                        });
                      })(t),
                      e.oldVersion < 4 &&
                        (function (e) {
                          var t = e.createObjectStore('attach-seq-store', {
                            autoIncrement: !0,
                          });
                          t.createIndex('seq', 'seq'),
                            t.createIndex('digestSeq', 'digestSeq', {
                              unique: !0,
                            });
                        })(t);
                    var i = [o, a, c, l],
                      r = e.oldVersion;
                    !(function e() {
                      var t = i[r - 1];
                      r++, t && t(n, e);
                    })();
                  }),
                  (d.onsuccess = function (t) {
                    ((r = t.target.result).onversionchange = function () {
                      r.close(), cn.delete(i);
                    }),
                      (r.onabort = function (e) {
                        j(
                          'error',
                          'Database has a global failure',
                          e.target.error
                        ),
                          r.close(),
                          cn.delete(i);
                      });
                    var o,
                      s,
                      a,
                      c,
                      l = r.transaction(
                        [zt, 'detect-blob-support', Vt],
                        'readwrite'
                      ),
                      u = !1;
                    function d() {
                      void 0 !== a &&
                        u &&
                        ((e._meta = { name: i, instanceId: c, blobSupport: a }),
                        cn.set(i, { idb: r, global: e._meta }),
                        n(null, e));
                    }
                    function h() {
                      if (void 0 !== s && void 0 !== o) {
                        var e = i + '_id';
                        e in o ? (c = o[e]) : (o[e] = c = Oe()),
                          (o.docCount = s),
                          l.objectStore(zt).put(o);
                      }
                    }
                    (l.objectStore(zt).get(zt).onsuccess = function (e) {
                      (o = e.target.result || { id: zt }), h();
                    }),
                      (function (e, t) {
                        e
                          .objectStore(Vt)
                          .index('deletedOrLocal')
                          .count(IDBKeyRange.only('0')).onsuccess = function (
                          e
                        ) {
                          t(e.target.result);
                        };
                      })(l, function (e) {
                        (s = e), h();
                      }),
                      an ||
                        (an = (function (e) {
                          return new Promise(function (t) {
                            var n = ye(['']),
                              i = e
                                .objectStore('detect-blob-support')
                                .put(n, 'key');
                            (i.onsuccess = function () {
                              var e =
                                  navigator.userAgent.match(/Chrome\/(\d+)/),
                                n = navigator.userAgent.match(/Edge\//);
                              t(n || !e || parseInt(e[1], 10) >= 43);
                            }),
                              (i.onerror = e.onabort =
                                function (e) {
                                  e.preventDefault(),
                                    e.stopPropagation(),
                                    t(!1);
                                });
                          }).catch(function () {
                            return !1;
                          });
                        })(l)),
                      an.then(function (e) {
                        (a = e), d();
                      }),
                      (l.oncomplete = function () {
                        (u = !0), d();
                      }),
                      (l.onabort = Ht(n));
                  }),
                  (d.onerror = function (e) {
                    var t = e.target.error && e.target.error.message;
                    t
                      ? -1 !==
                          t.indexOf('stored database is a higher version') &&
                        (t = new Error(
                          'This DB was created with the newer "indexeddb" adapter, but you are trying to open it with the older "idb" adapter'
                        ))
                      : (t =
                          'Failed to open indexedDB, are you in private browsing mode?'),
                      j('error', t),
                      n(ne(Q, t));
                  });
              })(n, e, t);
            },
            t,
            n.constructor
          );
        }
        un.valid = function () {
          try {
            return (
              'undefined' != typeof indexedDB &&
              'undefined' != typeof IDBKeyRange
            );
          } catch (e) {
            return !1;
          }
        };
        var dn = {};
        function hn(e) {
          var t = e.doc || e.ok,
            n = t && t._attachments;
          n &&
            Object.keys(n).forEach(function (e) {
              var t = n[e];
              t.data = _e(t.data, t.content_type);
            });
        }
        function fn(e) {
          return /^_design/.test(e)
            ? '_design/' + encodeURIComponent(e.slice(8))
            : /^_local/.test(e)
            ? '_local/' + encodeURIComponent(e.slice(7))
            : encodeURIComponent(e);
        }
        function pn(e) {
          return e._attachments && Object.keys(e._attachments)
            ? Promise.all(
                Object.keys(e._attachments).map(function (t) {
                  var n = e._attachments[t];
                  if (n.data && 'string' != typeof n.data)
                    return new Promise(function (e) {
                      xe(n.data, e);
                    }).then(function (e) {
                      n.data = e;
                    });
                })
              )
            : Promise.resolve();
        }
        function gn(e, t) {
          if (
            (function (e) {
              if (!e.prefix) return !1;
              var t = fe(e.prefix).protocol;
              return 'http' === t || 'https' === t;
            })(t)
          ) {
            var n = t.name.substr(t.prefix.length);
            e = t.prefix.replace(/\/?$/, '/') + encodeURIComponent(n);
          }
          var i = fe(e);
          (i.user || i.password) &&
            (i.auth = { username: i.user, password: i.password });
          var r = i.path.replace(/(^\/|\/$)/g, '').split('/');
          return (
            (i.db = r.pop()),
            -1 === i.db.indexOf('%') && (i.db = encodeURIComponent(i.db)),
            (i.path = r.join('/')),
            i
          );
        }
        function vn(e, t) {
          return mn(e, e.db + '/' + t);
        }
        function mn(e, t) {
          var n = e.path ? '/' : '';
          return (
            e.protocol +
            '://' +
            e.host +
            (e.port ? ':' + e.port : '') +
            '/' +
            e.path +
            n +
            t
          );
        }
        function yn(e) {
          return (
            '?' +
            Object.keys(e)
              .map(function (t) {
                return t + '=' + encodeURIComponent(e[t]);
              })
              .join('&')
          );
        }
        function bn(t, n) {
          var i = this,
            r = gn(t.name, t),
            o = vn(r, '');
          t = L(t);
          var a,
            c = function (e, n) {
              if (
                (((n = n || {}).headers = n.headers || new rt()),
                (n.credentials = 'include'),
                t.auth || r.auth)
              ) {
                var i = t.auth || r.auth,
                  o = i.username + ':' + i.password,
                  s = me(unescape(encodeURIComponent(o)));
                n.headers.set('Authorization', 'Basic ' + s);
              }
              var a = t.headers || {};
              return (
                Object.keys(a).forEach(function (e) {
                  n.headers.append(e, a[e]);
                }),
                (function (e) {
                  var t =
                      'undefined' != typeof navigator && navigator.userAgent
                        ? navigator.userAgent.toLowerCase()
                        : '',
                    n = -1 !== t.indexOf('msie'),
                    i = -1 !== t.indexOf('trident'),
                    r = -1 !== t.indexOf('edge'),
                    o = !('method' in e) || 'GET' === e.method;
                  return (n || i || r) && o;
                })(n) &&
                  (e +=
                    (-1 === e.indexOf('?') ? '?' : '&') +
                    '_nonce=' +
                    Date.now()),
                (t.fetch || it)(e, n)
              );
            };
          function l(e, t) {
            return I(
              e,
              f()(function (e) {
                d()
                  .then(function () {
                    return t.apply(this, e);
                  })
                  .catch(function (t) {
                    e.pop()(t);
                  });
              })
            ).bind(i);
          }
          function u(e, t, n) {
            var i = {};
            return (
              ((t = t || {}).headers = t.headers || new rt()),
              t.headers.get('Content-Type') ||
                t.headers.set('Content-Type', 'application/json'),
              t.headers.get('Accept') ||
                t.headers.set('Accept', 'application/json'),
              c(e, t)
                .then(function (e) {
                  return (i.ok = e.ok), (i.status = e.status), e.json();
                })
                .then(function (e) {
                  if (((i.data = e), !i.ok)) {
                    i.data.status = i.status;
                    var t = ie(i.data);
                    if (n) return n(t);
                    throw t;
                  }
                  if (
                    (Array.isArray(i.data) &&
                      (i.data = i.data.map(function (e) {
                        return e.error || e.missing ? ie(e) : e;
                      })),
                    !n)
                  )
                    return i;
                  n(null, i.data);
                })
            );
          }
          function d() {
            return t.skip_setup
              ? Promise.resolve()
              : a ||
                  ((a = u(o)
                    .catch(function (e) {
                      return e && e.status && 404 === e.status
                        ? (q(
                            404,
                            'PouchDB is just detecting if the remote exists.'
                          ),
                          u(o, { method: 'PUT' }))
                        : Promise.reject(e);
                    })
                    .catch(function (e) {
                      return (
                        !(!e || !e.status || 412 !== e.status) ||
                        Promise.reject(e)
                      );
                    })).catch(function () {
                    a = null;
                  }),
                  a);
          }
          function h(e) {
            return e.split('/').map(encodeURIComponent).join('/');
          }
          s()(function () {
            n(null, i);
          }),
            (i._remote = !0),
            (i.type = function () {
              return 'http';
            }),
            (i.id = l('id', function (e) {
              c(mn(r, ''))
                .then(function (e) {
                  return e.json();
                })
                .catch(function () {
                  return {};
                })
                .then(function (t) {
                  var n = t && t.uuid ? t.uuid + r.db : vn(r, '');
                  e(null, n);
                });
            })),
            (i.compact = l('compact', function (e, t) {
              'function' == typeof e && ((t = e), (e = {})),
                (e = L(e)),
                u(vn(r, '_compact'), { method: 'POST' }).then(function () {
                  !(function n() {
                    i.info(function (i, r) {
                      r && !r.compact_running
                        ? t(null, { ok: !0 })
                        : setTimeout(n, e.interval || 200);
                    });
                  })();
                });
            })),
            (i.bulkGet = I('bulkGet', function (e, t) {
              var n = this;
              function i(t) {
                var n = {};
                e.revs && (n.revs = !0),
                  e.attachments && (n.attachments = !0),
                  e.latest && (n.latest = !0),
                  u(vn(r, '_bulk_get' + yn(n)), {
                    method: 'POST',
                    body: JSON.stringify({ docs: e.docs }),
                  })
                    .then(function (n) {
                      e.attachments &&
                        e.binary &&
                        n.data.results.forEach(function (e) {
                          e.docs.forEach(hn);
                        }),
                        t(null, n.data);
                    })
                    .catch(t);
              }
              function o() {
                var i = Math.ceil(e.docs.length / 50),
                  r = 0,
                  o = new Array(i);
                function s(e) {
                  return function (n, s) {
                    (o[e] = s.results),
                      ++r === i && t(null, { results: oe(o) });
                  };
                }
                for (var a = 0; a < i; a++) {
                  var c = A(e, ['revs', 'attachments', 'binary', 'latest']);
                  (c.docs = e.docs.slice(
                    50 * a,
                    Math.min(e.docs.length, 50 * (a + 1))
                  )),
                    T(n, c, s(a));
                }
              }
              var s = mn(r, ''),
                a = dn[s];
              'boolean' != typeof a
                ? i(function (e, n) {
                    e
                      ? ((dn[s] = !1),
                        q(
                          e.status,
                          'PouchDB is just detecting if the remote supports the _bulk_get API.'
                        ),
                        o())
                      : ((dn[s] = !0), t(null, n));
                  })
                : a
                ? i(t)
                : o();
            })),
            (i._info = function (e) {
              d()
                .then(function () {
                  return c(vn(r, ''));
                })
                .then(function (e) {
                  return e.json();
                })
                .then(function (t) {
                  (t.host = vn(r, '')), e(null, t);
                })
                .catch(e);
            }),
            (i.fetch = function (e, t) {
              return d().then(function () {
                var n =
                  '/' === e.substring(0, 1) ? mn(r, e.substring(1)) : vn(r, e);
                return c(n, t);
              });
            }),
            (i.get = l('get', function (e, t, n) {
              'function' == typeof t && ((n = t), (t = {}));
              var i = {};
              function o(e) {
                var n = e._attachments,
                  i = n && Object.keys(n);
                if (n && i.length)
                  return (function (e, t) {
                    return new Promise(function (n, i) {
                      var r,
                        o = 0,
                        s = 0,
                        a = 0,
                        c = e.length;
                      function l() {
                        ++a === c ? (r ? i(r) : n()) : h();
                      }
                      function u() {
                        o--, l();
                      }
                      function d(e) {
                        o--, (r = r || e), l();
                      }
                      function h() {
                        for (; o < t && s < c; ) o++, e[s++]().then(u, d);
                      }
                      h();
                    });
                  })(
                    i.map(function (i) {
                      return function () {
                        return (function (i) {
                          var o = n[i],
                            s = fn(e._id) + '/' + h(i) + '?rev=' + e._rev;
                          return c(vn(r, s))
                            .then(function (e) {
                              return 'buffer' in e ? e.buffer() : e.blob();
                            })
                            .then(function (e) {
                              if (t.binary) {
                                var n = Object.getOwnPropertyDescriptor(
                                  e.__proto__,
                                  'type'
                                );
                                return (
                                  (n && !n.set) || (e.type = o.content_type), e
                                );
                              }
                              return new Promise(function (t) {
                                xe(e, t);
                              });
                            })
                            .then(function (e) {
                              delete o.stub, delete o.length, (o.data = e);
                            });
                        })(i);
                      };
                    }),
                    5
                  );
              }
              (t = L(t)).revs && (i.revs = !0),
                t.revs_info && (i.revs_info = !0),
                t.latest && (i.latest = !0),
                t.open_revs &&
                  ('all' !== t.open_revs &&
                    (t.open_revs = JSON.stringify(t.open_revs)),
                  (i.open_revs = t.open_revs)),
                t.rev && (i.rev = t.rev),
                t.conflicts && (i.conflicts = t.conflicts),
                t.update_seq && (i.update_seq = t.update_seq),
                (e = fn(e)),
                u(vn(r, e + yn(i)))
                  .then(function (e) {
                    return Promise.resolve()
                      .then(function () {
                        if (t.attachments)
                          return (
                            (n = e.data),
                            Array.isArray(n)
                              ? Promise.all(
                                  n.map(function (e) {
                                    if (e.ok) return o(e.ok);
                                  })
                                )
                              : o(n)
                          );
                        var n;
                      })
                      .then(function () {
                        n(null, e.data);
                      });
                  })
                  .catch(function (t) {
                    (t.docId = e), n(t);
                  });
            })),
            (i.remove = l('remove', function (e, t, n, i) {
              var o;
              'string' == typeof t
                ? ((o = { _id: e, _rev: t }),
                  'function' == typeof n && ((i = n), (n = {})))
                : ((o = e),
                  'function' == typeof t
                    ? ((i = t), (n = {}))
                    : ((i = n), (n = t)));
              var s = o._rev || n.rev;
              u(vn(r, fn(o._id)) + '?rev=' + s, { method: 'DELETE' }, i).catch(
                i
              );
            })),
            (i.getAttachment = l('getAttachment', function (t, n, i, o) {
              'function' == typeof i && ((o = i), (i = {}));
              var s,
                a = i.rev ? '?rev=' + i.rev : '',
                l = vn(r, fn(t)) + '/' + h(n) + a;
              c(l, { method: 'GET' })
                .then(function (t) {
                  if (((s = t.headers.get('content-type')), t.ok))
                    return void 0 === e ||
                      e.browser ||
                      'function' != typeof t.buffer
                      ? t.blob()
                      : t.buffer();
                  throw t;
                })
                .then(function (t) {
                  void 0 === e || e.browser || (t.type = s), o(null, t);
                })
                .catch(function (e) {
                  o(e);
                });
            })),
            (i.removeAttachment = l('removeAttachment', function (e, t, n, i) {
              u(
                vn(r, fn(e) + '/' + h(t)) + '?rev=' + n,
                { method: 'DELETE' },
                i
              ).catch(i);
            })),
            (i.putAttachment = l('putAttachment', function (e, t, n, i, o, s) {
              'function' == typeof o && ((s = o), (o = i), (i = n), (n = null));
              var a = fn(e) + '/' + h(t),
                c = vn(r, a);
              if ((n && (c += '?rev=' + n), 'string' == typeof i)) {
                var l;
                try {
                  l = ve(i);
                } catch (e) {
                  return s(ne(Z, 'Attachment is not a valid base64 string'));
                }
                i = l ? we(l, o) : '';
              }
              u(
                c,
                {
                  headers: new rt({ 'Content-Type': o }),
                  method: 'PUT',
                  body: i,
                },
                s
              ).catch(s);
            })),
            (i._bulkDocs = function (e, t, n) {
              (e.new_edits = t.new_edits),
                d()
                  .then(function () {
                    return Promise.all(e.docs.map(pn));
                  })
                  .then(function () {
                    return u(
                      vn(r, '_bulk_docs'),
                      { method: 'POST', body: JSON.stringify(e) },
                      n
                    );
                  })
                  .catch(n);
            }),
            (i._put = function (e, t, n) {
              d()
                .then(function () {
                  return pn(e);
                })
                .then(function () {
                  return u(vn(r, fn(e._id)), {
                    method: 'PUT',
                    body: JSON.stringify(e),
                  });
                })
                .then(function (e) {
                  n(null, e.data);
                })
                .catch(function (t) {
                  (t.docId = e && e._id), n(t);
                });
            }),
            (i.allDocs = l('allDocs', function (e, t) {
              'function' == typeof e && ((t = e), (e = {}));
              var n,
                i = {},
                o = 'GET';
              (e = L(e)).conflicts && (i.conflicts = !0),
                e.update_seq && (i.update_seq = !0),
                e.descending && (i.descending = !0),
                e.include_docs && (i.include_docs = !0),
                e.attachments && (i.attachments = !0),
                e.key && (i.key = JSON.stringify(e.key)),
                e.start_key && (e.startkey = e.start_key),
                e.startkey && (i.startkey = JSON.stringify(e.startkey)),
                e.end_key && (e.endkey = e.end_key),
                e.endkey && (i.endkey = JSON.stringify(e.endkey)),
                void 0 !== e.inclusive_end &&
                  (i.inclusive_end = !!e.inclusive_end),
                void 0 !== e.limit && (i.limit = e.limit),
                void 0 !== e.skip && (i.skip = e.skip);
              var s = yn(i);
              void 0 !== e.keys && ((o = 'POST'), (n = { keys: e.keys })),
                u(vn(r, '_all_docs' + s), {
                  method: o,
                  body: JSON.stringify(n),
                })
                  .then(function (n) {
                    e.include_docs &&
                      e.attachments &&
                      e.binary &&
                      n.data.rows.forEach(hn),
                      t(null, n.data);
                  })
                  .catch(t);
            })),
            (i._changes = function (e) {
              var t = 'batch_size' in e ? e.batch_size : 25;
              (e = L(e)).continuous &&
                !('heartbeat' in e) &&
                (e.heartbeat = 1e4);
              var n = 'timeout' in e ? e.timeout : 3e4;
              'timeout' in e &&
                e.timeout &&
                n - e.timeout < 5e3 &&
                (n = e.timeout + 5e3),
                'heartbeat' in e &&
                  e.heartbeat &&
                  n - e.heartbeat < 5e3 &&
                  (n = e.heartbeat + 5e3);
              var i = {};
              'timeout' in e && e.timeout && (i.timeout = e.timeout);
              var o = void 0 !== e.limit && e.limit,
                a = o;
              if (
                (e.style && (i.style = e.style),
                (e.include_docs ||
                  (e.filter && 'function' == typeof e.filter)) &&
                  (i.include_docs = !0),
                e.attachments && (i.attachments = !0),
                e.continuous && (i.feed = 'longpoll'),
                e.seq_interval && (i.seq_interval = e.seq_interval),
                e.conflicts && (i.conflicts = !0),
                e.descending && (i.descending = !0),
                e.update_seq && (i.update_seq = !0),
                'heartbeat' in e && e.heartbeat && (i.heartbeat = e.heartbeat),
                e.filter &&
                  'string' == typeof e.filter &&
                  (i.filter = e.filter),
                e.view &&
                  'string' == typeof e.view &&
                  ((i.filter = '_view'), (i.view = e.view)),
                e.query_params && 'object' == typeof e.query_params)
              )
                for (var c in e.query_params)
                  e.query_params.hasOwnProperty(c) &&
                    (i[c] = e.query_params[c]);
              var l,
                h = 'GET';
              e.doc_ids
                ? ((i.filter = '_doc_ids'),
                  (h = 'POST'),
                  (l = { doc_ids: e.doc_ids }))
                : e.selector &&
                  ((i.filter = '_selector'),
                  (h = 'POST'),
                  (l = { selector: e.selector }));
              var f,
                p = new nt(),
                g = function (n, s) {
                  if (!e.aborted) {
                    (i.since = n),
                      'object' == typeof i.since &&
                        (i.since = JSON.stringify(i.since)),
                      e.descending
                        ? o && (i.limit = a)
                        : (i.limit = !o || a > t ? t : a);
                    var c = vn(r, '_changes' + yn(i)),
                      g = {
                        signal: p.signal,
                        method: h,
                        body: JSON.stringify(l),
                      };
                    (f = n),
                      e.aborted ||
                        d()
                          .then(function () {
                            return u(c, g, s);
                          })
                          .catch(s);
                  }
                },
                v = { results: [] },
                m = function (n, i) {
                  if (!e.aborted) {
                    var r = 0;
                    if (i && i.results) {
                      (r = i.results.length), (v.last_seq = i.last_seq);
                      var c = null,
                        l = null;
                      'number' == typeof i.pending && (c = i.pending),
                        ('string' != typeof v.last_seq &&
                          'number' != typeof v.last_seq) ||
                          (l = v.last_seq);
                      e.query_params,
                        (i.results = i.results.filter(function (t) {
                          a--;
                          var n = re(e)(t);
                          return (
                            n &&
                              (e.include_docs &&
                                e.attachments &&
                                e.binary &&
                                hn(t),
                              e.return_docs && v.results.push(t),
                              e.onChange(t, c, l)),
                            n
                          );
                        }));
                    } else if (n) return (e.aborted = !0), void e.complete(n);
                    i && i.last_seq && (f = i.last_seq);
                    var u = (o && a <= 0) || (i && r < t) || e.descending;
                    (!e.continuous || (o && a <= 0)) && u
                      ? e.complete(null, v)
                      : s()(function () {
                          g(f, m);
                        });
                  }
                };
              return (
                g(e.since || 0, m),
                {
                  cancel: function () {
                    (e.aborted = !0), p.abort();
                  },
                }
              );
            }),
            (i.revsDiff = l('revsDiff', function (e, t, n) {
              'function' == typeof t && ((n = t), (t = {})),
                u(
                  vn(r, '_revs_diff'),
                  { method: 'POST', body: JSON.stringify(e) },
                  n
                ).catch(n);
            })),
            (i._close = function (e) {
              e();
            }),
            (i._destroy = function (e, t) {
              u(vn(r, ''), { method: 'DELETE' })
                .then(function (e) {
                  t(null, e);
                })
                .catch(function (e) {
                  404 === e.status ? t(null, { ok: !0 }) : t(e);
                });
            });
        }
        function wn(e) {
          (this.status = 400),
            (this.name = 'query_parse_error'),
            (this.message = e),
            (this.error = !0);
          try {
            Error.captureStackTrace(this, wn);
          } catch (e) {}
        }
        function _n(e) {
          (this.status = 404),
            (this.name = 'not_found'),
            (this.message = e),
            (this.error = !0);
          try {
            Error.captureStackTrace(this, _n);
          } catch (e) {}
        }
        function En(e) {
          (this.status = 500),
            (this.name = 'invalid_value'),
            (this.message = e),
            (this.error = !0);
          try {
            Error.captureStackTrace(this, En);
          } catch (e) {}
        }
        function Sn(e, t) {
          return (
            t &&
              e.then(
                function (e) {
                  s()(function () {
                    t(null, e);
                  });
                },
                function (e) {
                  s()(function () {
                    t(e);
                  });
                }
              ),
            e
          );
        }
        function xn(e, t) {
          return function () {
            var n = arguments,
              i = this;
            return e.add(function () {
              return t.apply(i, n);
            });
          };
        }
        function Ln(e) {
          var t = new i(e),
            n = new Array(t.size),
            r = -1;
          return (
            t.forEach(function (e) {
              n[++r] = e;
            }),
            n
          );
        }
        function kn(e) {
          var t = new Array(e.size),
            n = -1;
          return (
            e.forEach(function (e, i) {
              t[++n] = i;
            }),
            t
          );
        }
        function Cn(e) {
          return new En(
            'builtin ' +
              e +
              ' function requires map values to be numbers or number arrays'
          );
        }
        function In(e) {
          for (var t = 0, n = 0, i = e.length; n < i; n++) {
            var r = e[n];
            if ('number' != typeof r) {
              if (!Array.isArray(r)) throw Cn('_sum');
              t = 'number' == typeof t ? [t] : t;
              for (var o = 0, s = r.length; o < s; o++) {
                var a = r[o];
                if ('number' != typeof a) throw Cn('_sum');
                void 0 === t[o] ? t.push(a) : (t[o] += a);
              }
            } else 'number' == typeof t ? (t += r) : (t[0] += r);
          }
          return t;
        }
        (bn.valid = function () {
          return !0;
        }),
          g()(wn, Error),
          g()(_n, Error),
          g()(En, Error);
        var An = j.bind(null, 'log'),
          Pn = Array.isArray,
          On = JSON.parse;
        function Bn(e, t) {
          return pe('return (' + e.replace(/;\s*$/, '') + ');', {
            emit: t,
            sum: In,
            log: An,
            isArray: Pn,
            toJSON: On,
          });
        }
        function Tn() {
          this.promise = new Promise(function (e) {
            e();
          });
        }
        function Nn(e) {
          if (!e) return 'undefined';
          switch (typeof e) {
            case 'function':
            case 'string':
              return e.toString();
            default:
              return JSON.stringify(e);
          }
        }
        function Mn(e, t, n, i, r, o) {
          var s,
            a = (function (e, t) {
              return Nn(e) + Nn(t) + 'undefined';
            })(n, i);
          if (!r && (s = e._cachedViews = e._cachedViews || {})[a]) return s[a];
          var c = e.info().then(function (c) {
            var l = c.db_name + '-mrview-' + (r ? 'temp' : Ae(a));
            return ge(e, '_local/' + o, function (e) {
              e.views = e.views || {};
              var n = t;
              -1 === n.indexOf('/') && (n = t + '/' + t);
              var i = (e.views[n] = e.views[n] || {});
              if (!i[l]) return (i[l] = !0), e;
            }).then(function () {
              return e.registerDependentDatabase(l).then(function (t) {
                var r = t.db;
                r.auto_compaction = !0;
                var o = {
                  name: l,
                  db: r,
                  sourceDB: e,
                  adapter: e.adapter,
                  mapFun: n,
                  reduceFun: i,
                };
                return o.db
                  .get('_local/lastSeq')
                  .catch(function (e) {
                    if (404 !== e.status) throw e;
                  })
                  .then(function (e) {
                    return (
                      (o.seq = e ? e.seq : 0),
                      s &&
                        o.db.once('destroyed', function () {
                          delete s[a];
                        }),
                      o
                    );
                  });
              });
            });
          });
          return s && (s[a] = c), c;
        }
        (Tn.prototype.add = function (e) {
          return (
            (this.promise = this.promise
              .catch(function () {})
              .then(function () {
                return e();
              })),
            this.promise
          );
        }),
          (Tn.prototype.finish = function () {
            return this.promise;
          });
        var jn = {},
          Dn = new Tn();
        function qn(e) {
          return -1 === e.indexOf('/') ? [e, e] : e.split('/');
        }
        function Rn(e, t) {
          try {
            e.emit('error', t);
          } catch (e) {
            j(
              'error',
              "The user's map/reduce function threw an uncaught error.\nYou can debug this error by doing:\nmyDatabase.on('error', function (err) { debugger; });\nPlease double-check your map/reduce function."
            ),
              j('error', t);
          }
        }
        var Vn = function (e, t) {
            return In(t);
          },
          zn = function (e, t) {
            return t.length;
          },
          Fn = function (e, t) {
            return {
              sum: In(t),
              min: Math.min.apply(null, t),
              max: Math.max.apply(null, t),
              count: t.length,
              sumsqr: (function (e) {
                for (var t = 0, n = 0, i = e.length; n < i; n++) {
                  var r = e[n];
                  t += r * r;
                }
                return t;
              })(t),
            };
          };
        var Hn = (function (e, t, n, o) {
          function a(e, t, n) {
            try {
              t(n);
            } catch (t) {
              Rn(e, t);
            }
          }
          function c(e, t, n, i, r) {
            try {
              return { output: t(n, i, r) };
            } catch (t) {
              return Rn(e, t), { error: t };
            }
          }
          function l(e, t) {
            var n = ft(e.key, t.key);
            return 0 !== n ? n : ft(e.value, t.value);
          }
          function u(e, t, n) {
            return (
              (n = n || 0),
              'number' == typeof t ? e.slice(n, t + n) : n > 0 ? e.slice(n) : e
            );
          }
          function d(e) {
            var t = e.value;
            return (t && 'object' == typeof t && t._id) || e.id;
          }
          function h(e) {
            return function (t) {
              return (
                e.include_docs &&
                  e.attachments &&
                  e.binary &&
                  (function (e) {
                    e.rows.forEach(function (e) {
                      var t = e.doc && e.doc._attachments;
                      t &&
                        Object.keys(t).forEach(function (e) {
                          var n = t[e];
                          t[e].data = _e(n.data, n.content_type);
                        });
                    });
                  })(t),
                t
              );
            };
          }
          function p(e, t, n, i) {
            var r = t[e];
            void 0 !== r &&
              (i && (r = encodeURIComponent(JSON.stringify(r))),
              n.push(e + '=' + r));
          }
          function g(e) {
            if (void 0 !== e) {
              var t = Number(e);
              return isNaN(t) || t !== parseInt(e, 10) ? e : t;
            }
          }
          function v(e, t) {
            var n = e.descending ? 'endkey' : 'startkey',
              i = e.descending ? 'startkey' : 'endkey';
            if (void 0 !== e[n] && void 0 !== e[i] && ft(e[n], e[i]) > 0)
              throw new wn(
                'No rows can match your key range, reverse your start_key and end_key or set {descending : true}'
              );
            if (t.reduce && !1 !== e.reduce) {
              if (e.include_docs)
                throw new wn('{include_docs:true} is invalid for reduce');
              if (e.keys && e.keys.length > 1 && !e.group && !e.group_level)
                throw new wn(
                  'Multi-key fetches for reduce views must use {group: true}'
                );
            }
            ['group_level', 'limit', 'skip'].forEach(function (t) {
              var n = (function (e) {
                if (e) {
                  if ('number' != typeof e)
                    return new wn('Invalid value for integer: "' + e + '"');
                  if (e < 0)
                    return new wn(
                      'Invalid value for positive integer: "' + e + '"'
                    );
                }
              })(e[t]);
              if (n) throw n;
            });
          }
          function m(e) {
            return function (t) {
              if (404 === t.status) return e;
              throw t;
            };
          }
          function y(e, t, n) {
            var r = '_local/doc_' + e,
              o = { _id: r, keys: [] },
              s = n.get(e),
              a = s[0];
            return (
              (function (e) {
                return 1 === e.length && /^1-/.test(e[0].rev);
              })(s[1])
                ? Promise.resolve(o)
                : t.db.get(r).catch(m(o))
            ).then(function (e) {
              return (function (e) {
                return e.keys.length
                  ? t.db.allDocs({ keys: e.keys, include_docs: !0 })
                  : Promise.resolve({ rows: [] });
              })(e).then(function (t) {
                return (function (e, t) {
                  for (
                    var n = [], r = new i(), o = 0, s = t.rows.length;
                    o < s;
                    o++
                  ) {
                    var c = t.rows[o].doc;
                    if (
                      c &&
                      (n.push(c),
                      r.add(c._id),
                      (c._deleted = !a.has(c._id)),
                      !c._deleted)
                    ) {
                      var l = a.get(c._id);
                      'value' in l && (c.value = l.value);
                    }
                  }
                  var u = kn(a);
                  return (
                    u.forEach(function (e) {
                      if (!r.has(e)) {
                        var t = { _id: e },
                          i = a.get(e);
                        'value' in i && (t.value = i.value), n.push(t);
                      }
                    }),
                    (e.keys = Ln(u.concat(e.keys))),
                    n.push(e),
                    n
                  );
                })(e, t);
              });
            });
          }
          function b(e) {
            var t = 'string' == typeof e ? e : e.name,
              n = jn[t];
            return n || (n = jn[t] = new Tn()), n;
          }
          function w(e) {
            return xn(b(e), function () {
              return (function (e) {
                var n, i;
                var o = t(e.mapFun, function (e, t) {
                    var r = { id: i._id, key: pt(e) };
                    null != t && (r.value = pt(t)), n.push(r);
                  }),
                  s = e.seq || 0;
                function c(t, n) {
                  return function () {
                    return (function (e, t, n) {
                      return e.db
                        .get('_local/lastSeq')
                        .catch(m({ _id: '_local/lastSeq', seq: 0 }))
                        .then(function (i) {
                          var r = kn(t);
                          return Promise.all(
                            r.map(function (n) {
                              return y(n, e, t);
                            })
                          ).then(function (t) {
                            var r = oe(t);
                            return (
                              (i.seq = n), r.push(i), e.db.bulkDocs({ docs: r })
                            );
                          });
                        });
                    })(e, t, n);
                  };
                }
                var u = new Tn();
                function d() {
                  return e.sourceDB
                    .changes({
                      return_docs: !0,
                      conflicts: !0,
                      include_docs: !0,
                      style: 'all_docs',
                      since: s,
                      limit: 50,
                    })
                    .then(h);
                }
                function h(t) {
                  var h = t.results;
                  if (h.length) {
                    var p = (function (t) {
                      for (var c = new r(), u = 0, d = t.length; u < d; u++) {
                        var h = t[u];
                        if ('_' !== h.doc._id[0]) {
                          (n = []),
                            (i = h.doc)._deleted || a(e.sourceDB, o, i),
                            n.sort(l);
                          var p = f(n);
                          c.set(h.doc._id, [p, h.changes]);
                        }
                        s = h.seq;
                      }
                      return c;
                    })(h);
                    if ((u.add(c(p, s)), !(h.length < 50))) return d();
                  }
                }
                function f(e) {
                  for (var t, n = new r(), i = 0, o = e.length; i < o; i++) {
                    var s = e[i],
                      a = [s.key, s.id];
                    i > 0 && 0 === ft(s.key, t) && a.push(i),
                      n.set(vt(a), s),
                      (t = s.key);
                  }
                  return n;
                }
                return d()
                  .then(function () {
                    return u.finish();
                  })
                  .then(function () {
                    e.seq = s;
                  });
              })(e);
            })();
          }
          function _(e, t) {
            return xn(b(e), function () {
              return (function (e, t) {
                var i,
                  o = e.reduceFun && !1 !== t.reduce,
                  s = t.skip || 0;
                void 0 === t.keys ||
                  t.keys.length ||
                  ((t.limit = 0), delete t.keys);
                function a(t) {
                  return (
                    (t.include_docs = !0),
                    e.db.allDocs(t).then(function (e) {
                      return (
                        (i = e.total_rows),
                        e.rows.map(function (e) {
                          if (
                            'value' in e.doc &&
                            'object' == typeof e.doc.value &&
                            null !== e.doc.value
                          ) {
                            var t = Object.keys(e.doc.value).sort(),
                              n = ['id', 'key', 'value'];
                            if (!(t < n || t > n)) return e.doc.value;
                          }
                          var i = (function (e) {
                            for (var t = [], n = [], i = 0; ; ) {
                              var r = e[i++];
                              if ('\0' !== r)
                                switch (r) {
                                  case '1':
                                    t.push(null);
                                    break;
                                  case '2':
                                    t.push('1' === e[i]), i++;
                                    break;
                                  case '3':
                                    var o = mt(e, i);
                                    t.push(o.num), (i += o.length);
                                    break;
                                  case '4':
                                    for (var s = ''; ; ) {
                                      var a = e[i];
                                      if ('\0' === a) break;
                                      (s += a), i++;
                                    }
                                    (s = s
                                      .replace(/\u0001\u0001/g, '\0')
                                      .replace(/\u0001\u0002/g, '')
                                      .replace(/\u0002\u0002/g, '')),
                                      t.push(s);
                                    break;
                                  case '5':
                                    var c = { element: [], index: t.length };
                                    t.push(c.element), n.push(c);
                                    break;
                                  case '6':
                                    var l = { element: {}, index: t.length };
                                    t.push(l.element), n.push(l);
                                    break;
                                  default:
                                    throw new Error(
                                      'bad collationIndex or unexpectedly reached end of input: ' +
                                        r
                                    );
                                }
                              else {
                                if (1 === t.length) return t.pop();
                                yt(t, n);
                              }
                            }
                          })(e.doc._id);
                          return {
                            key: i[0],
                            id: i[1],
                            value: 'value' in e.doc ? e.doc.value : null,
                          };
                        })
                      );
                    })
                  );
                }
                function l(a) {
                  var l;
                  if (
                    ((l = o
                      ? (function (e, t, i) {
                          0 === i.group_level && delete i.group_level;
                          var r = i.group || i.group_level,
                            o = n(e.reduceFun),
                            s = [],
                            a = isNaN(i.group_level)
                              ? Number.POSITIVE_INFINITY
                              : i.group_level;
                          t.forEach(function (e) {
                            var t = s[s.length - 1],
                              n = r ? e.key : null;
                            if (
                              (r && Array.isArray(n) && (n = n.slice(0, a)),
                              t && 0 === ft(t.groupKey, n))
                            )
                              return (
                                t.keys.push([e.key, e.id]),
                                void t.values.push(e.value)
                              );
                            s.push({
                              keys: [[e.key, e.id]],
                              values: [e.value],
                              groupKey: n,
                            });
                          }),
                            (t = []);
                          for (var l = 0, d = s.length; l < d; l++) {
                            var h = s[l],
                              f = c(e.sourceDB, o, h.keys, h.values, !1);
                            if (f.error && f.error instanceof En) throw f.error;
                            t.push({
                              value: f.error ? null : f.output,
                              key: h.groupKey,
                            });
                          }
                          return { rows: u(t, i.limit, i.skip) };
                        })(e, a, t)
                      : { total_rows: i, offset: s, rows: a }),
                    t.update_seq && (l.update_seq = e.seq),
                    t.include_docs)
                  ) {
                    var h = Ln(a.map(d));
                    return e.sourceDB
                      .allDocs({
                        keys: h,
                        include_docs: !0,
                        conflicts: t.conflicts,
                        attachments: t.attachments,
                        binary: t.binary,
                      })
                      .then(function (e) {
                        var t = new r();
                        return (
                          e.rows.forEach(function (e) {
                            t.set(e.id, e.doc);
                          }),
                          a.forEach(function (e) {
                            var n = d(e),
                              i = t.get(n);
                            i && (e.doc = i);
                          }),
                          l
                        );
                      });
                  }
                  return l;
                }
                if (void 0 !== t.keys) {
                  var h = t.keys.map(function (e) {
                    var n = { startkey: vt([e]), endkey: vt([e, {}]) };
                    return t.update_seq && (n.update_seq = !0), a(n);
                  });
                  return Promise.all(h).then(oe).then(l);
                }
                var f,
                  p,
                  g = { descending: t.descending };
                if (
                  (t.update_seq && (g.update_seq = !0),
                  'start_key' in t && (f = t.start_key),
                  'startkey' in t && (f = t.startkey),
                  'end_key' in t && (p = t.end_key),
                  'endkey' in t && (p = t.endkey),
                  void 0 !== f &&
                    (g.startkey = t.descending ? vt([f, {}]) : vt([f])),
                  void 0 !== p)
                ) {
                  var v = !1 !== t.inclusive_end;
                  t.descending && (v = !v), (g.endkey = vt(v ? [p, {}] : [p]));
                }
                if (void 0 !== t.key) {
                  var m = vt([t.key]),
                    y = vt([t.key, {}]);
                  g.descending
                    ? ((g.endkey = m), (g.startkey = y))
                    : ((g.startkey = m), (g.endkey = y));
                }
                return (
                  o ||
                    ('number' == typeof t.limit && (g.limit = t.limit),
                    (g.skip = s)),
                  a(g).then(l)
                );
              })(e, t);
            })();
          }
          function E(t, n, i) {
            if ('function' == typeof t._query)
              return (function (e, t, n) {
                return new Promise(function (i, r) {
                  e._query(t, n, function (e, t) {
                    if (e) return r(e);
                    i(t);
                  });
                });
              })(t, n, i);
            if (ae(t))
              return (function (e, t, n) {
                var i,
                  r,
                  o,
                  s = [],
                  a = 'GET';
                if (
                  (p('reduce', n, s),
                  p('include_docs', n, s),
                  p('attachments', n, s),
                  p('limit', n, s),
                  p('descending', n, s),
                  p('group', n, s),
                  p('group_level', n, s),
                  p('skip', n, s),
                  p('stale', n, s),
                  p('conflicts', n, s),
                  p('startkey', n, s, !0),
                  p('start_key', n, s, !0),
                  p('endkey', n, s, !0),
                  p('end_key', n, s, !0),
                  p('inclusive_end', n, s),
                  p('key', n, s, !0),
                  p('update_seq', n, s),
                  (s = '' === (s = s.join('&')) ? '' : '?' + s),
                  void 0 !== n.keys)
                ) {
                  var c = 'keys=' + encodeURIComponent(JSON.stringify(n.keys));
                  c.length + s.length + 1 <= 2e3
                    ? (s += ('?' === s[0] ? '&' : '?') + c)
                    : ((a = 'POST'),
                      'string' == typeof t
                        ? (i = { keys: n.keys })
                        : (t.keys = n.keys));
                }
                if ('string' == typeof t) {
                  var l = qn(t);
                  return e
                    .fetch('_design/' + l[0] + '/_view/' + l[1] + s, {
                      headers: new rt({ 'Content-Type': 'application/json' }),
                      method: a,
                      body: JSON.stringify(i),
                    })
                    .then(function (e) {
                      return (r = e.ok), (o = e.status), e.json();
                    })
                    .then(function (e) {
                      if (!r) throw ((e.status = o), ie(e));
                      return (
                        e.rows.forEach(function (e) {
                          if (
                            e.value &&
                            e.value.error &&
                            'builtin_reduce_error' === e.value.error
                          )
                            throw new Error(e.reason);
                        }),
                        e
                      );
                    })
                    .then(h(n));
                }
                return (
                  (i = i || {}),
                  Object.keys(t).forEach(function (e) {
                    Array.isArray(t[e])
                      ? (i[e] = t[e])
                      : (i[e] = t[e].toString());
                  }),
                  e
                    .fetch('_temp_view' + s, {
                      headers: new rt({ 'Content-Type': 'application/json' }),
                      method: 'POST',
                      body: JSON.stringify(i),
                    })
                    .then(function (e) {
                      return (r = e.ok), (o = e.status), e.json();
                    })
                    .then(function (e) {
                      if (!r) throw ((e.status = o), ie(e));
                      return e;
                    })
                    .then(h(n))
                );
              })(t, n, i);
            if ('string' != typeof n)
              return (
                v(i, n),
                Dn.add(function () {
                  return Mn(
                    t,
                    'temp_view/temp_view',
                    n.map,
                    n.reduce,
                    !0,
                    e
                  ).then(function (e) {
                    return (
                      (t = w(e).then(function () {
                        return _(e, i);
                      })),
                      (n = function () {
                        return e.db.destroy();
                      }),
                      t.then(
                        function (e) {
                          return n().then(function () {
                            return e;
                          });
                        },
                        function (e) {
                          return n().then(function () {
                            throw e;
                          });
                        }
                      )
                    );
                    var t, n;
                  });
                }),
                Dn.finish()
              );
            var r = n,
              a = qn(r),
              c = a[0],
              l = a[1];
            return t.get('_design/' + c).then(function (n) {
              var a = n.views && n.views[l];
              if (!a) throw new _n('ddoc ' + n._id + ' has no view named ' + l);
              return (
                o(n, l),
                v(i, a),
                Mn(t, r, a.map, a.reduce, !1, e).then(function (e) {
                  return 'ok' === i.stale || 'update_after' === i.stale
                    ? ('update_after' === i.stale &&
                        s()(function () {
                          w(e);
                        }),
                      _(e, i))
                    : w(e).then(function () {
                        return _(e, i);
                      });
                })
              );
            });
          }
          var S;
          return {
            query: function (e, t, n) {
              var i = this;
              'function' == typeof t && ((n = t), (t = {})),
                (t = t
                  ? (function (e) {
                      return (
                        (e.group_level = g(e.group_level)),
                        (e.limit = g(e.limit)),
                        (e.skip = g(e.skip)),
                        e
                      );
                    })(t)
                  : {}),
                'function' == typeof e && (e = { map: e });
              var r = Promise.resolve().then(function () {
                return E(i, e, t);
              });
              return Sn(r, n), r;
            },
            viewCleanup:
              ((S = function () {
                var t = this;
                return 'function' == typeof t._viewCleanup
                  ? (function (e) {
                      return new Promise(function (t, n) {
                        e._viewCleanup(function (e, i) {
                          if (e) return n(e);
                          t(i);
                        });
                      });
                    })(t)
                  : ae(t)
                  ? (function (e) {
                      return e
                        .fetch('_view_cleanup', {
                          headers: new rt({
                            'Content-Type': 'application/json',
                          }),
                          method: 'POST',
                        })
                        .then(function (e) {
                          return e.json();
                        });
                    })(t)
                  : (function (t) {
                      return t.get('_local/' + e).then(function (e) {
                        var n = new r();
                        Object.keys(e.views).forEach(function (e) {
                          var t = qn(e),
                            r = '_design/' + t[0],
                            o = t[1],
                            s = n.get(r);
                          s || ((s = new i()), n.set(r, s)), s.add(o);
                        });
                        var o = { keys: kn(n), include_docs: !0 };
                        return t.allDocs(o).then(function (i) {
                          var r = {};
                          i.rows.forEach(function (t) {
                            var i = t.key.substring(8);
                            n.get(t.key).forEach(function (n) {
                              var o = i + '/' + n;
                              e.views[o] || (o = n);
                              var s = Object.keys(e.views[o]),
                                a = t.doc && t.doc.views && t.doc.views[n];
                              s.forEach(function (e) {
                                r[e] = r[e] || a;
                              });
                            });
                          });
                          var o = Object.keys(r)
                            .filter(function (e) {
                              return !r[e];
                            })
                            .map(function (e) {
                              return xn(b(e), function () {
                                return new t.constructor(e, t.__opts).destroy();
                              })();
                            });
                          return Promise.all(o).then(function () {
                            return { ok: !0 };
                          });
                        });
                      }, m({ ok: !0 }));
                    })(t);
              }),
              f()(function (e) {
                var t = e.pop(),
                  n = S.apply(this, e);
                return 'function' == typeof t && Sn(n, t), n;
              })),
          };
        })(
          'mrviews',
          function (e, t) {
            if ('function' == typeof e && 2 === e.length) {
              var n = e;
              return function (e) {
                return n(e, t);
              };
            }
            return Bn(e.toString(), t);
          },
          function (e) {
            var t = e.toString(),
              n = (function (e) {
                if (/^_sum/.test(e)) return Vn;
                if (/^_count/.test(e)) return zn;
                if (/^_stats/.test(e)) return Fn;
                if (/^_/.test(e))
                  throw new Error(e + ' is not a supported reduce function.');
              })(t);
            return n || Bn(t);
          },
          function (e, t) {
            var n = e.views && e.views[t];
            if ('string' != typeof n.map)
              throw new _n(
                'ddoc ' +
                  e._id +
                  ' has no string view named ' +
                  t +
                  ', instead found object of type: ' +
                  typeof n.map
              );
          }
        );
        var Un = {
          query: function (e, t, n) {
            return Hn.query.call(this, e, t, n);
          },
          viewCleanup: function (e) {
            return Hn.viewCleanup.call(this, e);
          },
        };
        function Gn(e) {
          return /^1-/.test(e);
        }
        function Wn(e, t) {
          var n = Object.keys(t._attachments);
          return Promise.all(
            n.map(function (n) {
              return e.getAttachment(t._id, n, { rev: t._rev });
            })
          );
        }
        function $n(e, t, n, i) {
          n = L(n);
          var r = [],
            o = !0;
          function s(t) {
            return e
              .allDocs({ keys: t, include_docs: !0, conflicts: !0 })
              .then(function (e) {
                if (i.cancelled) throw new Error('cancelled');
                e.rows.forEach(function (e) {
                  var t;
                  e.deleted ||
                    !e.doc ||
                    !Gn(e.value.rev) ||
                    ((t = e.doc),
                    t._attachments && Object.keys(t._attachments).length > 0) ||
                    (function (e) {
                      return e._conflicts && e._conflicts.length > 0;
                    })(e.doc) ||
                    (e.doc._conflicts && delete e.doc._conflicts,
                    r.push(e.doc),
                    delete n[e.id]);
                });
              });
          }
          return Promise.resolve()
            .then(function () {
              var e = Object.keys(n).filter(function (e) {
                var t = n[e].missing;
                return 1 === t.length && Gn(t[0]);
              });
              if (e.length > 0) return s(e);
            })
            .then(function () {
              var s = (function (e) {
                var t = [];
                return (
                  Object.keys(e).forEach(function (n) {
                    e[n].missing.forEach(function (e) {
                      t.push({ id: n, rev: e });
                    });
                  }),
                  { docs: t, revs: !0, latest: !0 }
                );
              })(n);
              if (s.docs.length)
                return e.bulkGet(s).then(function (n) {
                  if (i.cancelled) throw new Error('cancelled');
                  return Promise.all(
                    n.results.map(function (n) {
                      return Promise.all(
                        n.docs.map(function (n) {
                          var i = n.ok;
                          return (
                            n.error && (o = !1),
                            i && i._attachments
                              ? (function (e, t, n) {
                                  var i = ae(t) && !ae(e),
                                    r = Object.keys(n._attachments);
                                  return i
                                    ? e
                                        .get(n._id)
                                        .then(function (i) {
                                          return Promise.all(
                                            r.map(function (r) {
                                              return (function (e, t, n) {
                                                return (
                                                  !e._attachments ||
                                                  !e._attachments[n] ||
                                                  e._attachments[n].digest !==
                                                    t._attachments[n].digest
                                                );
                                              })(i, n, r)
                                                ? t.getAttachment(n._id, r)
                                                : e.getAttachment(i._id, r);
                                            })
                                          );
                                        })
                                        .catch(function (e) {
                                          if (404 !== e.status) throw e;
                                          return Wn(t, n);
                                        })
                                    : Wn(t, n);
                                })(t, e, i).then(function (e) {
                                  var t = Object.keys(i._attachments);
                                  return (
                                    e.forEach(function (e, n) {
                                      var r = i._attachments[t[n]];
                                      delete r.stub,
                                        delete r.length,
                                        (r.data = e);
                                    }),
                                    i
                                  );
                                })
                              : i
                          );
                        })
                      );
                    })
                  ).then(function (e) {
                    r = r.concat(oe(e).filter(Boolean));
                  });
                });
            })
            .then(function () {
              return { ok: o, docs: r };
            });
        }
        function Zn(e, t, n, i, r) {
          return e
            .get(t)
            .catch(function (n) {
              if (404 === n.status)
                return (
                  ('http' !== e.adapter && 'https' !== e.adapter) ||
                    q(
                      404,
                      'PouchDB is just checking if a remote checkpoint exists.'
                    ),
                  {
                    session_id: i,
                    _id: t,
                    history: [],
                    replicator: 'pouchdb',
                    version: 1,
                  }
                );
              throw n;
            })
            .then(function (o) {
              if (!r.cancelled && o.last_seq !== n)
                return (
                  (o.history = (o.history || []).filter(function (e) {
                    return e.session_id !== i;
                  })),
                  o.history.unshift({ last_seq: n, session_id: i }),
                  (o.history = o.history.slice(0, 5)),
                  (o.version = 1),
                  (o.replicator = 'pouchdb'),
                  (o.session_id = i),
                  (o.last_seq = n),
                  e.put(o).catch(function (o) {
                    if (409 === o.status) return Zn(e, t, n, i, r);
                    throw o;
                  })
                );
            });
        }
        function Kn(e, t, n, i, r) {
          (this.src = e),
            (this.target = t),
            (this.id = n),
            (this.returnValue = i),
            (this.opts = r || {});
        }
        (Kn.prototype.writeCheckpoint = function (e, t) {
          var n = this;
          return this.updateTarget(e, t).then(function () {
            return n.updateSource(e, t);
          });
        }),
          (Kn.prototype.updateTarget = function (e, t) {
            return this.opts.writeTargetCheckpoint
              ? Zn(this.target, this.id, e, t, this.returnValue)
              : Promise.resolve(!0);
          }),
          (Kn.prototype.updateSource = function (e, t) {
            if (this.opts.writeSourceCheckpoint) {
              var n = this;
              return Zn(this.src, this.id, e, t, this.returnValue).catch(
                function (e) {
                  if (Jn(e)) return (n.opts.writeSourceCheckpoint = !1), !0;
                  throw e;
                }
              );
            }
            return Promise.resolve(!0);
          });
        var Yn = {
          undefined: function (e, t) {
            return 0 === ft(e.last_seq, t.last_seq) ? t.last_seq : 0;
          },
          1: function (e, t) {
            return (function (e, t) {
              if (e.session_id === t.session_id)
                return { last_seq: e.last_seq, history: e.history };
              return (function e(t, n) {
                var i = t[0],
                  r = t.slice(1),
                  o = n[0],
                  s = n.slice(1);
                if (!i || 0 === n.length) return { last_seq: 0, history: [] };
                if (Xn(i.session_id, n))
                  return { last_seq: i.last_seq, history: t };
                if (Xn(o.session_id, r))
                  return { last_seq: o.last_seq, history: s };
                return e(r, s);
              })(e.history, t.history);
            })(t, e).last_seq;
          },
        };
        function Xn(e, t) {
          var n = t[0],
            i = t.slice(1);
          return !(!e || 0 === t.length) && (e === n.session_id || Xn(e, i));
        }
        function Jn(e) {
          return (
            'number' == typeof e.status && 4 === Math.floor(e.status / 100)
          );
        }
        Kn.prototype.getCheckpoint = function () {
          var e = this;
          return e.opts &&
            e.opts.writeSourceCheckpoint &&
            !e.opts.writeTargetCheckpoint
            ? e.src
                .get(e.id)
                .then(function (e) {
                  return e.last_seq || 0;
                })
                .catch(function (e) {
                  if (404 !== e.status) throw e;
                  return 0;
                })
            : e.target
                .get(e.id)
                .then(function (t) {
                  return e.opts &&
                    e.opts.writeTargetCheckpoint &&
                    !e.opts.writeSourceCheckpoint
                    ? t.last_seq || 0
                    : e.src.get(e.id).then(
                        function (e) {
                          return t.version !== e.version
                            ? 0
                            : (n = t.version
                                ? t.version.toString()
                                : 'undefined') in Yn
                            ? Yn[n](t, e)
                            : 0;
                          var n;
                        },
                        function (n) {
                          if (404 === n.status && t.last_seq)
                            return e.src.put({ _id: e.id, last_seq: 0 }).then(
                              function () {
                                return 0;
                              },
                              function (n) {
                                return Jn(n)
                                  ? ((e.opts.writeSourceCheckpoint = !1),
                                    t.last_seq)
                                  : 0;
                              }
                            );
                          throw n;
                        }
                      );
                })
                .catch(function (e) {
                  if (404 !== e.status) throw e;
                  return 0;
                });
        };
        function Qn(e, t, n) {
          var i = n.doc_ids ? n.doc_ids.sort(ft) : '',
            r = n.filter ? n.filter.toString() : '',
            o = '',
            s = '',
            a = '';
          return (
            n.selector && (a = JSON.stringify(n.selector)),
            n.filter &&
              n.query_params &&
              (o = JSON.stringify(
                (function (e) {
                  return Object.keys(e)
                    .sort(ft)
                    .reduce(function (t, n) {
                      return (t[n] = e[n]), t;
                    }, {});
                })(n.query_params)
              )),
            n.filter && '_view' === n.filter && (s = n.view.toString()),
            Promise.all([e.id(), t.id()])
              .then(function (e) {
                var t = e[0] + e[1] + r + s + o + i + a;
                return new Promise(function (e) {
                  Ie(t, e);
                });
              })
              .then(function (e) {
                return (
                  '_local/' + (e = e.replace(/\//g, '.').replace(/\+/g, '_'))
                );
              })
          );
        }
        function ei(e, t, n, i, r) {
          var o,
            a,
            c,
            l = [],
            u = { seq: 0, changes: [], docs: [] },
            d = !1,
            h = !1,
            f = !1,
            p = 0,
            g = n.continuous || n.live || !1,
            v = n.batch_size || 100,
            m = n.batches_limit || 10,
            y = !1,
            b = n.doc_ids,
            w = n.selector,
            _ = [],
            E = Oe();
          r = r || {
            ok: !0,
            start_time: new Date().toISOString(),
            docs_read: 0,
            docs_written: 0,
            doc_write_failures: 0,
            errors: [],
          };
          var S = {};
          function x() {
            return c
              ? Promise.resolve()
              : Qn(e, t, n).then(function (r) {
                  a = r;
                  var o = {};
                  (o =
                    !1 === n.checkpoint
                      ? { writeSourceCheckpoint: !1, writeTargetCheckpoint: !1 }
                      : 'source' === n.checkpoint
                      ? { writeSourceCheckpoint: !0, writeTargetCheckpoint: !1 }
                      : 'target' === n.checkpoint
                      ? { writeSourceCheckpoint: !1, writeTargetCheckpoint: !0 }
                      : {
                          writeSourceCheckpoint: !0,
                          writeTargetCheckpoint: !0,
                        }),
                    (c = new Kn(e, t, a, i, o));
                });
          }
          function k() {
            if (((_ = []), 0 !== o.docs.length)) {
              var e = o.docs,
                s = { timeout: n.timeout };
              return t.bulkDocs({ docs: e, new_edits: !1 }, s).then(
                function (t) {
                  if (i.cancelled) throw (B(), new Error('cancelled'));
                  var n = Object.create(null);
                  t.forEach(function (e) {
                    e.error && (n[e.id] = e);
                  });
                  var o = Object.keys(n).length;
                  (r.doc_write_failures += o),
                    (r.docs_written += e.length - o),
                    e.forEach(function (e) {
                      var t = n[e._id];
                      if (t) {
                        r.errors.push(t);
                        var o = (t.name || '').toLowerCase();
                        if ('unauthorized' !== o && 'forbidden' !== o) throw t;
                        i.emit('denied', L(t));
                      } else _.push(e);
                    });
                },
                function (t) {
                  throw ((r.doc_write_failures += e.length), t);
                }
              );
            }
          }
          function C() {
            if (o.error) throw new Error('There was a problem getting docs.');
            r.last_seq = p = o.seq;
            var e = L(r);
            return (
              _.length &&
                ((e.docs = _),
                'number' == typeof o.pending &&
                  ((e.pending = o.pending), delete o.pending),
                i.emit('change', e)),
              (d = !0),
              c
                .writeCheckpoint(o.seq, E)
                .then(function () {
                  if (((d = !1), i.cancelled))
                    throw (B(), new Error('cancelled'));
                  (o = void 0), j();
                })
                .catch(function (e) {
                  throw (R(e), e);
                })
            );
          }
          function I() {
            return $n(e, t, o.diffs, i).then(function (e) {
              (o.error = !e.ok),
                e.docs.forEach(function (e) {
                  delete o.diffs[e._id], r.docs_read++, o.docs.push(e);
                });
            });
          }
          function A() {
            var e;
            i.cancelled ||
              o ||
              (0 !== l.length
                ? ((o = l.shift()),
                  ((e = {}),
                  o.changes.forEach(function (t) {
                    '_user/' !== t.id &&
                      (e[t.id] = t.changes.map(function (e) {
                        return e.rev;
                      }));
                  }),
                  t.revsDiff(e).then(function (e) {
                    if (i.cancelled) throw (B(), new Error('cancelled'));
                    o.diffs = e;
                  }))
                    .then(I)
                    .then(k)
                    .then(C)
                    .then(A)
                    .catch(function (e) {
                      O('batch processing terminated with error', e);
                    }))
                : P(!0));
          }
          function P(e) {
            0 !== u.changes.length
              ? (e || h || u.changes.length >= v) &&
                (l.push(u),
                (u = { seq: 0, changes: [], docs: [] }),
                ('pending' !== i.state && 'stopped' !== i.state) ||
                  ((i.state = 'active'), i.emit('active')),
                A())
              : 0 !== l.length ||
                o ||
                (((g && S.live) || h) &&
                  ((i.state = 'pending'), i.emit('paused')),
                h && B());
          }
          function O(e, t) {
            f ||
              (t.message || (t.message = e),
              (r.ok = !1),
              (r.status = 'aborting'),
              (l = []),
              (u = { seq: 0, changes: [], docs: [] }),
              B(t));
          }
          function B(o) {
            if (!(f || (i.cancelled && ((r.status = 'cancelled'), d))))
              if (
                ((r.status = r.status || 'complete'),
                (r.end_time = new Date().toISOString()),
                (r.last_seq = p),
                (f = !0),
                o)
              ) {
                (o = ne(o)).result = r;
                var s = (o.name || '').toLowerCase();
                'unauthorized' === s || 'forbidden' === s
                  ? (i.emit('error', o), i.removeAllListeners())
                  : (function (e, t, n, i) {
                      if (!1 === e.retry)
                        return t.emit('error', n), void t.removeAllListeners();
                      if (
                        ('function' != typeof e.back_off_function &&
                          (e.back_off_function = D),
                        t.emit('requestError', n),
                        'active' === t.state || 'pending' === t.state)
                      ) {
                        t.emit('paused', n), (t.state = 'stopped');
                        var r = function () {
                          e.current_back_off = 0;
                        };
                        t.once('paused', function () {
                          t.removeListener('active', r);
                        }),
                          t.once('active', r);
                      }
                      (e.current_back_off = e.current_back_off || 0),
                        (e.current_back_off = e.back_off_function(
                          e.current_back_off
                        )),
                        setTimeout(i, e.current_back_off);
                    })(n, i, o, function () {
                      ei(e, t, n, i);
                    });
              } else i.emit('complete', r), i.removeAllListeners();
          }
          function T(e, t, r) {
            if (i.cancelled) return B();
            'number' == typeof t && (u.pending = t),
              re(n)(e) &&
                ((u.seq = e.seq || r),
                u.changes.push(e),
                s()(function () {
                  P(0 === l.length && S.live);
                }));
          }
          function N(e) {
            if (((y = !1), i.cancelled)) return B();
            if (e.results.length > 0)
              (S.since = e.results[e.results.length - 1].seq), j(), P(!0);
            else {
              var t = function () {
                g ? ((S.live = !0), j()) : (h = !0), P(!0);
              };
              o || 0 !== e.results.length
                ? t()
                : ((d = !0),
                  c
                    .writeCheckpoint(e.last_seq, E)
                    .then(function () {
                      (d = !1), (r.last_seq = p = e.last_seq), t();
                    })
                    .catch(R));
            }
          }
          function M(e) {
            if (((y = !1), i.cancelled)) return B();
            O('changes rejected', e);
          }
          function j() {
            if (!y && !h && l.length < m) {
              (y = !0),
                i._changes &&
                  (i.removeListener('cancel', i._abortChanges),
                  i._changes.cancel()),
                i.once('cancel', r);
              var t = e.changes(S).on('change', T);
              t.then(o, o),
                t.then(N).catch(M),
                n.retry && ((i._changes = t), (i._abortChanges = r));
            }
            function r() {
              t.cancel();
            }
            function o() {
              i.removeListener('cancel', r);
            }
          }
          function q() {
            x()
              .then(function () {
                if (!i.cancelled)
                  return c.getCheckpoint().then(function (e) {
                    (S = {
                      since: (p = e),
                      limit: v,
                      batch_size: v,
                      style: 'all_docs',
                      doc_ids: b,
                      selector: w,
                      return_docs: !0,
                    }),
                      n.filter &&
                        ('string' != typeof n.filter
                          ? (S.include_docs = !0)
                          : (S.filter = n.filter)),
                      'heartbeat' in n && (S.heartbeat = n.heartbeat),
                      'timeout' in n && (S.timeout = n.timeout),
                      n.query_params && (S.query_params = n.query_params),
                      n.view && (S.view = n.view),
                      j();
                  });
                B();
              })
              .catch(function (e) {
                O('getCheckpoint rejected with ', e);
              });
          }
          function R(e) {
            (d = !1), O('writeCheckpoint completed with error', e);
          }
          i.ready(e, t),
            i.cancelled
              ? B()
              : (i._addedListeners ||
                  (i.once('cancel', B),
                  'function' == typeof n.complete &&
                    (i.once('error', n.complete),
                    i.once('complete', function (e) {
                      n.complete(null, e);
                    })),
                  (i._addedListeners = !0)),
                void 0 === n.since
                  ? q()
                  : x()
                      .then(function () {
                        return (d = !0), c.writeCheckpoint(n.since, E);
                      })
                      .then(function () {
                        (d = !1), i.cancelled ? B() : ((p = n.since), q());
                      })
                      .catch(R));
        }
        function ti() {
          m.a.call(this), (this.cancelled = !1), (this.state = 'pending');
          var e = this,
            t = new Promise(function (t, n) {
              e.once('complete', t), e.once('error', n);
            });
          (e.then = function (e, n) {
            return t.then(e, n);
          }),
            (e.catch = function (e) {
              return t.catch(e);
            }),
            e.catch(function () {});
        }
        function ni(e, t) {
          var n = t.PouchConstructor;
          return 'string' == typeof e ? new n(e, t) : e;
        }
        function ii(e, t, n, i) {
          if (
            ('function' == typeof n && ((i = n), (n = {})),
            void 0 === n && (n = {}),
            n.doc_ids && !Array.isArray(n.doc_ids))
          )
            throw ne(X, '`doc_ids` filter parameter is not a list.');
          (n.complete = i),
            ((n = L(n)).continuous = n.continuous || n.live),
            (n.retry = 'retry' in n && n.retry),
            (n.PouchConstructor = n.PouchConstructor || this);
          var r = new ti(n);
          return ei(ni(e, n), ni(t, n), n, r), r;
        }
        function ri(e, t, n, i) {
          return (
            'function' == typeof n && ((i = n), (n = {})),
            void 0 === n && (n = {}),
            ((n = L(n)).PouchConstructor = n.PouchConstructor || this),
            new oi((e = ni(e, n)), (t = ni(t, n)), n, i)
          );
        }
        function oi(e, t, n, i) {
          var r = this;
          this.canceled = !1;
          var o = n.push ? R({}, n, n.push) : n,
            s = n.pull ? R({}, n, n.pull) : n;
          function a(e) {
            r.emit('change', { direction: 'pull', change: e });
          }
          function c(e) {
            r.emit('change', { direction: 'push', change: e });
          }
          function l(e) {
            r.emit('denied', { direction: 'push', doc: e });
          }
          function u(e) {
            r.emit('denied', { direction: 'pull', doc: e });
          }
          function d() {
            (r.pushPaused = !0), r.pullPaused && r.emit('paused');
          }
          function h() {
            (r.pullPaused = !0), r.pushPaused && r.emit('paused');
          }
          function f() {
            (r.pushPaused = !1),
              r.pullPaused && r.emit('active', { direction: 'push' });
          }
          function p() {
            (r.pullPaused = !1),
              r.pushPaused && r.emit('active', { direction: 'pull' });
          }
          (this.push = ii(e, t, o)),
            (this.pull = ii(t, e, s)),
            (this.pushPaused = !0),
            (this.pullPaused = !0);
          var g = {};
          function v(e) {
            return function (t, n) {
              (('change' === t && (n === a || n === c)) ||
                ('denied' === t && (n === u || n === l)) ||
                ('paused' === t && (n === h || n === d)) ||
                ('active' === t && (n === p || n === f))) &&
                (t in g || (g[t] = {}),
                (g[t][e] = !0),
                2 === Object.keys(g[t]).length && r.removeAllListeners(t));
            };
          }
          function m(e, t, n) {
            -1 == e.listeners(t).indexOf(n) && e.on(t, n);
          }
          n.live &&
            (this.push.on('complete', r.pull.cancel.bind(r.pull)),
            this.pull.on('complete', r.push.cancel.bind(r.push))),
            this.on('newListener', function (e) {
              'change' === e
                ? (m(r.pull, 'change', a), m(r.push, 'change', c))
                : 'denied' === e
                ? (m(r.pull, 'denied', u), m(r.push, 'denied', l))
                : 'active' === e
                ? (m(r.pull, 'active', p), m(r.push, 'active', f))
                : 'paused' === e &&
                  (m(r.pull, 'paused', h), m(r.push, 'paused', d));
            }),
            this.on('removeListener', function (e) {
              'change' === e
                ? (r.pull.removeListener('change', a),
                  r.push.removeListener('change', c))
                : 'denied' === e
                ? (r.pull.removeListener('denied', u),
                  r.push.removeListener('denied', l))
                : 'active' === e
                ? (r.pull.removeListener('active', p),
                  r.push.removeListener('active', f))
                : 'paused' === e &&
                  (r.pull.removeListener('paused', h),
                  r.push.removeListener('paused', d));
            }),
            this.pull.on('removeListener', v('pull')),
            this.push.on('removeListener', v('push'));
          var y = Promise.all([this.push, this.pull]).then(
            function (e) {
              var t = { push: e[0], pull: e[1] };
              return (
                r.emit('complete', t),
                i && i(null, t),
                r.removeAllListeners(),
                t
              );
            },
            function (e) {
              if (
                (r.cancel(),
                i ? i(e) : r.emit('error', e),
                r.removeAllListeners(),
                i)
              )
                throw e;
            }
          );
          (this.then = function (e, t) {
            return y.then(e, t);
          }),
            (this.catch = function (e) {
              return y.catch(e);
            });
        }
        g()(ti, m.a),
          (ti.prototype.cancel = function () {
            (this.cancelled = !0),
              (this.state = 'cancelled'),
              this.emit('cancel');
          }),
          (ti.prototype.ready = function (e, t) {
            var n = this;
            function i() {
              n.cancel();
            }
            n._readyCalled ||
              ((n._readyCalled = !0),
              e.once('destroyed', i),
              t.once('destroyed', i),
              n.once('complete', function () {
                e.removeListener('destroyed', i),
                  t.removeListener('destroyed', i);
              }));
          }),
          g()(oi, m.a),
          (oi.prototype.cancel = function () {
            this.canceled ||
              ((this.canceled = !0), this.push.cancel(), this.pull.cancel());
          }),
          tt
            .plugin(function (e) {
              e.adapter('idb', un, !0);
            })
            .plugin(function (e) {
              e.adapter('http', bn, !1), e.adapter('https', bn, !1);
            })
            .plugin(Un)
            .plugin(function (e) {
              (e.replicate = ii),
                (e.sync = ri),
                Object.defineProperty(e.prototype, 'replicate', {
                  get: function () {
                    var e = this;
                    return (
                      void 0 === this.replicateMethods &&
                        (this.replicateMethods = {
                          from: function (t, n, i) {
                            return e.constructor.replicate(t, e, n, i);
                          },
                          to: function (t, n, i) {
                            return e.constructor.replicate(e, t, n, i);
                          },
                        }),
                      this.replicateMethods
                    );
                  },
                }),
                (e.prototype.sync = function (e, t, n) {
                  return this.constructor.sync(this, e, t, n);
                });
            }),
          (t.default = tt);
      }.call(this, n(16));
  },
  function (e, t, n) {
    'use strict';
    var i =
        ('undefined' != typeof crypto &&
          crypto.getRandomValues &&
          crypto.getRandomValues.bind(crypto)) ||
        ('undefined' != typeof msCrypto &&
          'function' == typeof msCrypto.getRandomValues &&
          msCrypto.getRandomValues.bind(msCrypto)),
      r = new Uint8Array(16);
    function o() {
      if (!i)
        throw new Error(
          'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'
        );
      return i(r);
    }
    for (var s = [], a = 0; a < 256; ++a)
      s.push((a + 256).toString(16).substr(1));
    var c = function (e, t) {
      var n = t || 0,
        i = s;
      return (
        i[e[n + 0]] +
        i[e[n + 1]] +
        i[e[n + 2]] +
        i[e[n + 3]] +
        '-' +
        i[e[n + 4]] +
        i[e[n + 5]] +
        '-' +
        i[e[n + 6]] +
        i[e[n + 7]] +
        '-' +
        i[e[n + 8]] +
        i[e[n + 9]] +
        '-' +
        i[e[n + 10]] +
        i[e[n + 11]] +
        i[e[n + 12]] +
        i[e[n + 13]] +
        i[e[n + 14]] +
        i[e[n + 15]]
      ).toLowerCase();
    };
    t.a = function (e, t, n) {
      'string' == typeof e &&
        ((t = 'binary' === e ? new Uint8Array(16) : null), (e = null));
      var i = (e = e || {}).random || (e.rng || o)();
      if (((i[6] = (15 & i[6]) | 64), (i[8] = (63 & i[8]) | 128), t)) {
        for (var r = n || 0, s = 0; s < 16; ++s) t[r + s] = i[s];
        return t;
      }
      return c(i);
    };
  },
  function (e, t) {
    var n,
      i,
      r = (e.exports = {});
    function o() {
      throw new Error('setTimeout has not been defined');
    }
    function s() {
      throw new Error('clearTimeout has not been defined');
    }
    function a(e) {
      if (n === setTimeout) return setTimeout(e, 0);
      if ((n === o || !n) && setTimeout)
        return (n = setTimeout), setTimeout(e, 0);
      try {
        return n(e, 0);
      } catch (t) {
        try {
          return n.call(null, e, 0);
        } catch (t) {
          return n.call(this, e, 0);
        }
      }
    }
    !(function () {
      try {
        n = 'function' == typeof setTimeout ? setTimeout : o;
      } catch (e) {
        n = o;
      }
      try {
        i = 'function' == typeof clearTimeout ? clearTimeout : s;
      } catch (e) {
        i = s;
      }
    })();
    var c,
      l = [],
      u = !1,
      d = -1;
    function h() {
      u &&
        c &&
        ((u = !1), c.length ? (l = c.concat(l)) : (d = -1), l.length && f());
    }
    function f() {
      if (!u) {
        var e = a(h);
        u = !0;
        for (var t = l.length; t; ) {
          for (c = l, l = []; ++d < t; ) c && c[d].run();
          (d = -1), (t = l.length);
        }
        (c = null),
          (u = !1),
          (function (e) {
            if (i === clearTimeout) return clearTimeout(e);
            if ((i === s || !i) && clearTimeout)
              return (i = clearTimeout), clearTimeout(e);
            try {
              i(e);
            } catch (t) {
              try {
                return i.call(null, e);
              } catch (t) {
                return i.call(this, e);
              }
            }
          })(e);
      }
    }
    function p(e, t) {
      (this.fun = e), (this.array = t);
    }
    function g() {}
    (r.nextTick = function (e) {
      var t = new Array(arguments.length - 1);
      if (arguments.length > 1)
        for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      l.push(new p(e, t)), 1 !== l.length || u || a(f);
    }),
      (p.prototype.run = function () {
        this.fun.apply(null, this.array);
      }),
      (r.title = 'browser'),
      (r.browser = !0),
      (r.env = {}),
      (r.argv = []),
      (r.version = ''),
      (r.versions = {}),
      (r.on = g),
      (r.addListener = g),
      (r.once = g),
      (r.off = g),
      (r.removeListener = g),
      (r.removeAllListeners = g),
      (r.emit = g),
      (r.prependListener = g),
      (r.prependOnceListener = g),
      (r.listeners = function (e) {
        return [];
      }),
      (r.binding = function (e) {
        throw new Error('process.binding is not supported');
      }),
      (r.cwd = function () {
        return '/';
      }),
      (r.chdir = function (e) {
        throw new Error('process.chdir is not supported');
      }),
      (r.umask = function () {
        return 0;
      });
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.ModalWindow = t.ModalWindowView = void 0);
    const i = n(10),
      r = n(5);
    var o, s;
    !(function (e) {
      (e[(e.EDIT_TEXT = 0)] = 'EDIT_TEXT'),
        (e[(e.HOTKEYS = 1)] = 'HOTKEYS'),
        (e[(e.VALIDATION_STATUS = 2)] = 'VALIDATION_STATUS');
    })((o = t.ModalWindowView || (t.ModalWindowView = {}))),
      (function (e) {
        (e[(e.OPEN = 0)] = 'OPEN'), (e[(e.CLOSED = 1)] = 'CLOSED');
      })(s || (s = {}));
    t.ModalWindow = class {
      constructor(e) {
        (this.openEditSylTextModalWindow = function () {
          Array.from(
            document.getElementsByClassName('neon-modal-window-content')
          ).forEach((e) => {
            e.classList.remove('visible');
          }),
            document
              .getElementById('neon-modal-window-content-edit-text')
              .classList.add('visible'),
            document
              .getElementById('neon-modal-window-edit-text-cancel')
              .removeEventListener('click', this.hideModalWindow),
            document
              .getElementById('neon-modal-window-edit-text-cancel')
              .addEventListener('click', this.hideModalWindow.bind(this)),
            document
              .getElementById('neon-modal-window-edit-text-save')
              .removeEventListener('click', this.updateSylText.bind(this)),
            document
              .getElementById('neon-modal-window-edit-text-save')
              .addEventListener('click', this.updateSylText.bind(this)),
            (document.getElementById(
              'neon-modal-window-container'
            ).style.display = 'flex'),
            this.focusModalWindow();
        }),
          (this.updateSelectedBBox = function (e) {
            r.unselect();
            const t = Array.from(e.classList).find(
              (e) => 'text-select' !== e && 'selected-to-edit' !== e
            );
            if (
              document.getElementById('displayBBox').checked &&
              document.getElementById(t)
            ) {
              const e = document
                .getElementById(t)
                .querySelector('.sylTextRect-display');
              r.selectBBox(e, this.dragHandler, this.neonView);
            }
          }),
          (this.updateSylText = function () {
            const e = document
                .getElementById('syl_text')
                .querySelectorAll('span.selected-to-edit')[0],
              t = e.textContent.replace(/\u{25CA}/u, '').trim(),
              n = document.getElementById(
                'neon-modal-window-edit-text-input'
              ).value;
            if (null !== n && n !== t) {
              const t = {
                action: 'setText',
                param: {
                  elementId: [...e.classList.entries()].filter(
                    (e) => 'text-select' !== e[1] && 'selected-to-edit' !== e[1]
                  )[0][1],
                  text: n,
                },
              };
              this.neonView
                .edit(t, this.neonView.view.getCurrentPageURI())
                .then((t) => {
                  t &&
                    this.neonView.updateForCurrentPage().then(() => {
                      this.updateSelectedBBox(e);
                    });
                });
            }
            this.hideModalWindow();
          }),
          (this.keydownListener = function (e) {
            switch ((e.stopImmediatePropagation(), this.modalWindowView)) {
              case o.EDIT_TEXT:
                'Enter' === e.key && this.updateSylText();
              default:
                'Escape' === e.key && this.hideModalWindow();
            }
          }),
          (this.focusModalWindow = function () {
            switch (this.modalWindowView) {
              case o.EDIT_TEXT:
                document
                  .getElementById('neon-modal-window-edit-text-input')
                  .select();
                break;
              default:
                document.getElementById('neon-modal-window').focus();
            }
          }),
          (this.neonView = e),
          (this.modalWindowState = s.CLOSED),
          document
            .getElementById('neon-modal-window-header-close')
            .addEventListener('click', this.hideModalWindow.bind(this)),
          document
            .getElementById('neon-modal-window')
            .addEventListener('keydown', this.keydownListener.bind(this)),
          document
            .getElementById('neon-modal-window-container')
            .addEventListener('click', this.focusModalWindow.bind(this));
      }
      setModalWindowView(e, t) {
        (this.modalWindowView = e), this.setModalWindowContent(t);
      }
      getModalWindowView() {
        return this.modalWindowView.toString();
      }
      openModalWindow() {
        switch (
          (Array.from(
            document.getElementsByClassName('neon-modal-window-content')
          ).forEach((e) => {
            e.classList.remove('visible');
          }),
          this.modalWindowView)
        ) {
          case o.EDIT_TEXT:
            this.openEditSylTextModalWindow();
            break;
          case o.HOTKEYS:
            document
              .getElementById('neon-modal-window-content-hotkeys')
              .classList.add('visible');
          default:
            (document.getElementById(
              'neon-modal-window-container'
            ).style.display = 'flex'),
              this.focusModalWindow();
        }
        this.modalWindowState = s.OPEN;
      }
      hideModalWindow() {
        switch (this.modalWindowView) {
          case o.EDIT_TEXT:
            document
              .getElementById('syl_text')
              .querySelectorAll('span.selected-to-edit')[0]
              .classList.remove('selected-to-edit');
          default:
            (document.getElementById(
              'neon-modal-window-container'
            ).style.display = 'none'),
              document.getElementById('container').focus();
        }
        this.modalWindowState = s.CLOSED;
      }
      setModalWindowContent(e) {
        switch (this.modalWindowView) {
          case o.EDIT_TEXT:
            (document.getElementById(
              'neon-modal-window-content-container'
            ).innerHTML = i.editTextModal),
              (document.getElementById(
                'neon-modal-window-header-title'
              ).innerText = 'EDIT SYLLABLE TEXT');
            const t = /\u{25CA}/u,
              n = document
                .getElementById('syl_text')
                .querySelectorAll('span.selected-to-edit')[0]
                .textContent.replace(t, '')
                .trim();
            document.getElementById('neon-modal-window-edit-text-input').value =
              n;
            break;
          case o.HOTKEYS:
            (document.getElementById(
              'neon-modal-window-content-container'
            ).innerHTML = i.hotkeysModal),
              (document.getElementById(
                'neon-modal-window-header-title'
              ).innerText = 'HOTKEYS');
            break;
          case o.VALIDATION_STATUS:
            (document.getElementById(
              'neon-modal-window-content-container'
            ).innerHTML = `<div style="margin-bottom: 30px;white-space: pre-line;">${e}</div>\n          <div class="neon-modal-window-btn">\n            <a href="data:text/plain;charset=utf-8,${encodeURIComponent(
              e
            )}" download="validation.log">\n              Export\n            </a>\n            </div>`),
              (document.getElementById(
                'neon-modal-window-header-title'
              ).innerText = 'ERROR LOG');
            break;
          default:
            console.error(
              'Unknown selection type. This should not have occurred.'
            );
        }
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.setGroupingHighlight =
        t.setStaffHighlight =
        t.highlight =
        t.unsetGroupingHighlight =
        t.unsetStaffHighlight =
        t.unhighlight =
          void 0);
    const i = [
      'rgb(230, 159, 0)',
      'rgb(86, 180, 233)',
      'rgb(0, 158, 115)',
      'rgb(240, 228, 66)',
      'rgb(0, 114, 178)',
      'rgb(213, 94, 0)',
      'rgb(204, 121, 167)',
    ];
    function r(e) {
      let t;
      (t = e
        ? e.querySelectorAll(':not(.selected) .highlighted')
        : document.querySelectorAll(':not(.selected) .highlighted')),
        t.forEach((e) => {
          if (
            'path' !== e.tagName ||
            e.closest('.staff').classList.contains('selected')
          ) {
            e.removeAttribute('fill');
            let t = e.querySelectorAll('.sylTextRect-display');
            if (!t.length)
              try {
                t = e
                  .closest('.syllable')
                  .querySelectorAll('.sylTextRect-display');
              } catch (e) {
                t = [];
              }
            t.forEach(function (e) {
              e.closest('.syllable').classList.contains('selected') ||
              e.closest('.staff').classList.contains('selected') ||
              e.closest('.syl').classList.contains('selected')
                ? (e.style.fill = '#d00')
                : (e.style.fill = 'blue'),
                e.classList.remove('highlighted');
            });
          } else e.setAttribute('stroke', '#000000');
          e.classList.remove('highlighted');
        });
    }
    function o() {
      r();
    }
    function s() {
      o();
      Array.from(document.getElementsByClassName('highlighted'))
        .filter((e) => !e.parentElement.classList.contains('selected'))
        .forEach((e) => {
          e.setAttribute('#d00', null);
          let t = e.querySelectorAll('.sylTextRect-display');
          t.length ||
            (null !== e.closest('.syllable') &&
              (t = e
                .closest('.syllable')
                .querySelectorAll('sylTextRect-display'))),
            t.forEach(function (e) {
              e.closest('.syllable').classList.contains('selected') ||
              e.closest('.syl').classList.contains('selected')
                ? (e.style.fill = '#d00')
                : (e.style.fill = 'blue'),
                e.classList.remove('highlighted');
            }),
            e.classList.remove('highlighted'),
            e.querySelectorAll('sylTextRect-display').forEach((e) => {
              e.classList.remove('highlighted');
            });
        }),
        Array.from(document.getElementsByClassName('selected')).forEach((e) => {
          e.setAttribute('fill', '');
        });
    }
    function a(e, t) {
      const n = Array.from(e.children);
      for (let e = 0; e < n.length; e++) {
        const i = n[e];
        if ('path' === i.tagName) i.setAttribute('stroke', t);
        else {
          if (
            i.classList.contains('resizePoint') ||
            'resizeRect' === i.id ||
            i.classList.contains('rotatePoint')
          )
            return;
          if (i.classList.contains('layer'))
            Array.from(i.children).forEach((e) => {
              n.push(e);
            });
          else if (
            document.getElementsByClassName('highlight-selected').length &&
            'highlight-neume' ===
              document.getElementsByClassName('highlight-selected')[0].id &&
            i.classList.contains('syllable')
          )
            Array.from(i.children)
              .filter((e) => e.classList.contains('neume'))
              .forEach((e) => {
                n.push(e);
              });
          else {
            i.setAttribute('fill', t);
            let e = i.querySelectorAll('.sylTextRect-display');
            if (!e.length)
              try {
                e = i
                  .closest('.syllable')
                  .querySelectorAll('.sylTextRect-display');
              } catch (t) {
                e = [];
              }
            e.forEach(function (e) {
              e.closest('.syllable').classList.contains('selected') ||
                e.closest('.syl').classList.contains('selected') ||
                e.closest('.staff').classList.contains('selected') ||
                ((e.style.fill = t), e.classList.add('highlighted'));
            });
          }
        }
        i.classList.add('highlighted');
      }
      let i;
      (i = '30px'),
        e
          .querySelectorAll('.nc, .custos, .clef, .accid, .divLine')
          .forEach((e) => {
            e.setAttribute('stroke', 'black'),
              e.setAttribute('stroke-width', i);
          });
    }
    function c() {
      const e = Array.from(document.getElementsByClassName('staff'));
      for (let t = 0; t < e.length; t++) {
        const n = i[t % i.length];
        a(e[t], n);
      }
    }
    (t.unhighlight = r),
      (t.unsetStaffHighlight = o),
      (t.unsetGroupingHighlight = s),
      (t.highlight = a),
      (t.setStaffHighlight = c),
      (t.setGroupingHighlight = function e(t) {
        if ((s(), 'staff' === t)) return void c();
        if ('selection' === t) {
          switch (document.querySelector('.sel-by.is-active').id) {
            case 'selBySyllable':
            case 'selByBBox':
              t = 'syllable';
              break;
            case 'selByStaff':
              t = 'staff';
              break;
            case 'selByLayerElement':
              t = 'layer';
              break;
            case 'selByNeume':
            default:
              t = 'neume';
          }
          return void e(t);
        }
        let n;
        n =
          'layer' == t
            ? document.querySelectorAll('.accid, .clef, .custos, .divLine')
            : document.getElementsByClassName(t);
        for (let e = 0; e < n.length; e++) {
          const t = i[e % i.length];
          if (
            null !== n[e].closest('.selected') ||
            n[e].classList.contains('selected')
          )
            n[e].classList.contains('selected')
              ? n[e].setAttribute('fill', '#d00')
              : n[e].setAttribute('fill', null),
              n[e].classList.remove('highlighted');
          else {
            n[e].setAttribute('fill', t);
            n[e].querySelectorAll('.sylTextRect-display').forEach(function (e) {
              e.closest('.syl').classList.contains('selected') ||
                e.closest('.syllable').classList.contains('selected') ||
                e.closest('.staff').classList.contains('selected') ||
                (e.style.fill = t);
            }),
              n[e].classList.add('highlighted'),
              n[e].querySelectorAll('.sylTextRect-display').forEach((e) => {
                e.classList.add('highlighted');
              });
          }
        }
        document
          .querySelectorAll('.nc, .custos, .clef, .accid, .divLine')
          .forEach((e) => {
            e.setAttribute('stroke', 'black'),
              e.setAttribute('stroke-width', '30px');
          });
      });
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(8),
      r = n(20);
    t.default = class {
      constructor(e, t) {
        (this.dragStartCoords = [-1, -1]),
          (this.neonView = e),
          (this.selector = t);
      }
      dragInit() {
        const e = i
          .drag()
          .on(
            'start',
            function () {
              (this.dragStartCoords = [i.event.x, i.event.y]),
                (this.dx = 0),
                (this.dy = 0),
                i.event.sourceEvent.target.classList.contains('staff') &&
                  i.select(this.selector).call(e);
            }.bind(this)
          )
          .on('drag', this.dragging.bind(this))
          .on('end', this.dragEnded.bind(this));
        i.selectAll('.selected').call(e);
        const t = Array.from(document.getElementsByClassName('selected'));
        this.selection = t.concat(
          Array.from(document.getElementsByClassName('resizePoint'))
        );
      }
      dragging() {
        (this.dx = i.event.x - this.dragStartCoords[0]),
          (this.dy = i.event.y - this.dragStartCoords[1]),
          this.selection.forEach((e) => {
            i.select(e).attr(
              'transform',
              () => 'translate(' + [this.dx, this.dy] + ')'
            );
          });
        0 ===
          this.selection.filter((e) => e.classList.contains('syl')).length &&
          i
            .selectAll('.syllable.selected')
            .selectAll('.sylTextRect-display')
            .attr(
              'transform',
              () => 'translate(' + [-1 * this.dx, -1 * this.dy] + ')'
            );
      }
      dragEnded() {
        const e = [];
        this.selection
          .filter((e) => !e.classList.contains('resizePoint'))
          .forEach((t) => {
            const n = 'rect' === t.tagName ? t.closest('.syl').id : t.id,
              o = {
                action: 'drag',
                param: { elementId: n, x: this.dx, y: -this.dy },
              };
            if (
              (e.push(o),
              t.classList.contains('divLine') ||
                t.classList.contains('accid') ||
                t.classList.contains('custos'))
            ) {
              const { clientX: o, clientY: s } = i.event.sourceEvent,
                a = r.getStaffIdByCoords(o, s),
                c = {
                  action: 'changeStaffTo',
                  param: { elementId: n, staffId: a || t.closest('.staff').id },
                };
              e.push(c);
            }
          });
        const t = { action: 'chain', param: e },
          n = Math.abs(this.dx),
          o = Math.abs(this.dy);
        n > 5 || o > 5
          ? this.neonView
              .edit(t, this.neonView.view.getCurrentPageURI())
              .then(() => {
                this.neonView.updateForCurrentPage(),
                  this.endOptionsSelection(),
                  this.reset(),
                  this.dragInit();
              })
          : (this.reset(), this.dragInit());
      }
      resetTo(e) {
        this.resetToAction = e;
      }
      reset() {
        void 0 !== this.resetToAction &&
          i.select(this.selector).call(this.resetToAction);
      }
      endOptionsSelection() {
        const e = document.getElementById('moreEdit');
        e && ((e.innerHTML = ''), e.parentElement.classList.add('hidden'));
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.getStaffByCoords = t.getStaffIdByCoords = t.getSVGRelCoords = void 0);
    const i = n(5);
    function r(e, t) {
      const n = new DOMPoint(e, t),
        i = document
          .querySelector('.active-page > .definition-scale')
          .querySelector('.system'),
        { x: r, y: o } = n.matrixTransform(i.getScreenCTM().inverse());
      return { x: r, y: o };
    }
    function o(e, t) {
      const n = Array.from(document.querySelectorAll('.staff')).map((e) =>
          i.getStaffBBox(e)
        ),
        { x: o, y: s } = r(e, t),
        a = n.find((e) => o <= e.lrx && o >= e.ulx && s <= e.lry && s >= e.uly);
      return a ? a.id : null;
    }
    (t.getSVGRelCoords = r),
      (t.getStaffIdByCoords = o),
      (t.getStaffByCoords = function (e, t) {
        const n = o(e, t);
        return document.querySelector('#' + n);
      });
  },
  function (e, t, n) {
    (function (e, i) {
      var r;
      /**
       * @license
       * Lodash <https://lodash.com/>
       * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
       * Released under MIT license <https://lodash.com/license>
       * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
       * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
       */ (function () {
        var o = 'Expected a function',
          s = '__lodash_placeholder__',
          a = [
            ['ary', 128],
            ['bind', 1],
            ['bindKey', 2],
            ['curry', 8],
            ['curryRight', 16],
            ['flip', 512],
            ['partial', 32],
            ['partialRight', 64],
            ['rearg', 256],
          ],
          c = '[object Arguments]',
          l = '[object Array]',
          u = '[object Boolean]',
          d = '[object Date]',
          h = '[object Error]',
          f = '[object Function]',
          p = '[object GeneratorFunction]',
          g = '[object Map]',
          v = '[object Number]',
          m = '[object Object]',
          y = '[object RegExp]',
          b = '[object Set]',
          w = '[object String]',
          _ = '[object Symbol]',
          E = '[object WeakMap]',
          S = '[object ArrayBuffer]',
          x = '[object DataView]',
          L = '[object Float32Array]',
          k = '[object Float64Array]',
          C = '[object Int8Array]',
          I = '[object Int16Array]',
          A = '[object Int32Array]',
          P = '[object Uint8Array]',
          O = '[object Uint16Array]',
          B = '[object Uint32Array]',
          T = /\b__p \+= '';/g,
          N = /\b(__p \+=) '' \+/g,
          M = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
          j = /&(?:amp|lt|gt|quot|#39);/g,
          D = /[&<>"']/g,
          q = RegExp(j.source),
          R = RegExp(D.source),
          V = /<%-([\s\S]+?)%>/g,
          z = /<%([\s\S]+?)%>/g,
          F = /<%=([\s\S]+?)%>/g,
          H = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          U = /^\w*$/,
          G =
            /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
          W = /[\\^$.*+?()[\]{}|]/g,
          $ = RegExp(W.source),
          Z = /^\s+|\s+$/g,
          K = /^\s+/,
          Y = /\s+$/,
          X = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
          J = /\{\n\/\* \[wrapped with (.+)\] \*/,
          Q = /,? & /,
          ee = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
          te = /\\(\\)?/g,
          ne = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
          ie = /\w*$/,
          re = /^[-+]0x[0-9a-f]+$/i,
          oe = /^0b[01]+$/i,
          se = /^\[object .+?Constructor\]$/,
          ae = /^0o[0-7]+$/i,
          ce = /^(?:0|[1-9]\d*)$/,
          le = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
          ue = /($^)/,
          de = /['\n\r\u2028\u2029\\]/g,
          he = '\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff',
          fe =
            '\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
          pe = '[\\ud800-\\udfff]',
          ge = '[' + fe + ']',
          ve = '[' + he + ']',
          me = '\\d+',
          ye = '[\\u2700-\\u27bf]',
          be = '[a-z\\xdf-\\xf6\\xf8-\\xff]',
          we =
            '[^\\ud800-\\udfff' +
            fe +
            me +
            '\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]',
          _e = '\\ud83c[\\udffb-\\udfff]',
          Ee = '[^\\ud800-\\udfff]',
          Se = '(?:\\ud83c[\\udde6-\\uddff]){2}',
          xe = '[\\ud800-\\udbff][\\udc00-\\udfff]',
          Le = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
          ke = '(?:' + be + '|' + we + ')',
          Ce = '(?:' + Le + '|' + we + ')',
          Ie = '(?:' + ve + '|' + _e + ')' + '?',
          Ae =
            '[\\ufe0e\\ufe0f]?' +
            Ie +
            ('(?:\\u200d(?:' +
              [Ee, Se, xe].join('|') +
              ')[\\ufe0e\\ufe0f]?' +
              Ie +
              ')*'),
          Pe = '(?:' + [ye, Se, xe].join('|') + ')' + Ae,
          Oe = '(?:' + [Ee + ve + '?', ve, Se, xe, pe].join('|') + ')',
          Be = RegExp("['’]", 'g'),
          Te = RegExp(ve, 'g'),
          Ne = RegExp(_e + '(?=' + _e + ')|' + Oe + Ae, 'g'),
          Me = RegExp(
            [
              Le +
                '?' +
                be +
                "+(?:['’](?:d|ll|m|re|s|t|ve))?(?=" +
                [ge, Le, '$'].join('|') +
                ')',
              Ce +
                "+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=" +
                [ge, Le + ke, '$'].join('|') +
                ')',
              Le + '?' + ke + "+(?:['’](?:d|ll|m|re|s|t|ve))?",
              Le + "+(?:['’](?:D|LL|M|RE|S|T|VE))?",
              '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
              '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
              me,
              Pe,
            ].join('|'),
            'g'
          ),
          je = RegExp('[\\u200d\\ud800-\\udfff' + he + '\\ufe0e\\ufe0f]'),
          De =
            /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
          qe = [
            'Array',
            'Buffer',
            'DataView',
            'Date',
            'Error',
            'Float32Array',
            'Float64Array',
            'Function',
            'Int8Array',
            'Int16Array',
            'Int32Array',
            'Map',
            'Math',
            'Object',
            'Promise',
            'RegExp',
            'Set',
            'String',
            'Symbol',
            'TypeError',
            'Uint8Array',
            'Uint8ClampedArray',
            'Uint16Array',
            'Uint32Array',
            'WeakMap',
            '_',
            'clearTimeout',
            'isFinite',
            'parseInt',
            'setTimeout',
          ],
          Re = -1,
          Ve = {};
        (Ve[L] =
          Ve[k] =
          Ve[C] =
          Ve[I] =
          Ve[A] =
          Ve[P] =
          Ve['[object Uint8ClampedArray]'] =
          Ve[O] =
          Ve[B] =
            !0),
          (Ve[c] =
            Ve[l] =
            Ve[S] =
            Ve[u] =
            Ve[x] =
            Ve[d] =
            Ve[h] =
            Ve[f] =
            Ve[g] =
            Ve[v] =
            Ve[m] =
            Ve[y] =
            Ve[b] =
            Ve[w] =
            Ve[E] =
              !1);
        var ze = {};
        (ze[c] =
          ze[l] =
          ze[S] =
          ze[x] =
          ze[u] =
          ze[d] =
          ze[L] =
          ze[k] =
          ze[C] =
          ze[I] =
          ze[A] =
          ze[g] =
          ze[v] =
          ze[m] =
          ze[y] =
          ze[b] =
          ze[w] =
          ze[_] =
          ze[P] =
          ze['[object Uint8ClampedArray]'] =
          ze[O] =
          ze[B] =
            !0),
          (ze[h] = ze[f] = ze[E] = !1);
        var Fe = {
            '\\': '\\',
            "'": "'",
            '\n': 'n',
            '\r': 'r',
            '\u2028': 'u2028',
            '\u2029': 'u2029',
          },
          He = parseFloat,
          Ue = parseInt,
          Ge = 'object' == typeof e && e && e.Object === Object && e,
          We =
            'object' == typeof self && self && self.Object === Object && self,
          $e = Ge || We || Function('return this')(),
          Ze = t && !t.nodeType && t,
          Ke = Ze && 'object' == typeof i && i && !i.nodeType && i,
          Ye = Ke && Ke.exports === Ze,
          Xe = Ye && Ge.process,
          Je = (function () {
            try {
              var e = Ke && Ke.require && Ke.require('util').types;
              return e || (Xe && Xe.binding && Xe.binding('util'));
            } catch (e) {}
          })(),
          Qe = Je && Je.isArrayBuffer,
          et = Je && Je.isDate,
          tt = Je && Je.isMap,
          nt = Je && Je.isRegExp,
          it = Je && Je.isSet,
          rt = Je && Je.isTypedArray;
        function ot(e, t, n) {
          switch (n.length) {
            case 0:
              return e.call(t);
            case 1:
              return e.call(t, n[0]);
            case 2:
              return e.call(t, n[0], n[1]);
            case 3:
              return e.call(t, n[0], n[1], n[2]);
          }
          return e.apply(t, n);
        }
        function st(e, t, n, i) {
          for (var r = -1, o = null == e ? 0 : e.length; ++r < o; ) {
            var s = e[r];
            t(i, s, n(s), e);
          }
          return i;
        }
        function at(e, t) {
          for (
            var n = -1, i = null == e ? 0 : e.length;
            ++n < i && !1 !== t(e[n], n, e);

          );
          return e;
        }
        function ct(e, t) {
          for (var n = null == e ? 0 : e.length; n-- && !1 !== t(e[n], n, e); );
          return e;
        }
        function lt(e, t) {
          for (var n = -1, i = null == e ? 0 : e.length; ++n < i; )
            if (!t(e[n], n, e)) return !1;
          return !0;
        }
        function ut(e, t) {
          for (
            var n = -1, i = null == e ? 0 : e.length, r = 0, o = [];
            ++n < i;

          ) {
            var s = e[n];
            t(s, n, e) && (o[r++] = s);
          }
          return o;
        }
        function dt(e, t) {
          return !!(null == e ? 0 : e.length) && _t(e, t, 0) > -1;
        }
        function ht(e, t, n) {
          for (var i = -1, r = null == e ? 0 : e.length; ++i < r; )
            if (n(t, e[i])) return !0;
          return !1;
        }
        function ft(e, t) {
          for (
            var n = -1, i = null == e ? 0 : e.length, r = Array(i);
            ++n < i;

          )
            r[n] = t(e[n], n, e);
          return r;
        }
        function pt(e, t) {
          for (var n = -1, i = t.length, r = e.length; ++n < i; )
            e[r + n] = t[n];
          return e;
        }
        function gt(e, t, n, i) {
          var r = -1,
            o = null == e ? 0 : e.length;
          for (i && o && (n = e[++r]); ++r < o; ) n = t(n, e[r], r, e);
          return n;
        }
        function vt(e, t, n, i) {
          var r = null == e ? 0 : e.length;
          for (i && r && (n = e[--r]); r--; ) n = t(n, e[r], r, e);
          return n;
        }
        function mt(e, t) {
          for (var n = -1, i = null == e ? 0 : e.length; ++n < i; )
            if (t(e[n], n, e)) return !0;
          return !1;
        }
        var yt = Lt('length');
        function bt(e, t, n) {
          var i;
          return (
            n(e, function (e, n, r) {
              if (t(e, n, r)) return (i = n), !1;
            }),
            i
          );
        }
        function wt(e, t, n, i) {
          for (var r = e.length, o = n + (i ? 1 : -1); i ? o-- : ++o < r; )
            if (t(e[o], o, e)) return o;
          return -1;
        }
        function _t(e, t, n) {
          return t == t
            ? (function (e, t, n) {
                var i = n - 1,
                  r = e.length;
                for (; ++i < r; ) if (e[i] === t) return i;
                return -1;
              })(e, t, n)
            : wt(e, St, n);
        }
        function Et(e, t, n, i) {
          for (var r = n - 1, o = e.length; ++r < o; ) if (i(e[r], t)) return r;
          return -1;
        }
        function St(e) {
          return e != e;
        }
        function xt(e, t) {
          var n = null == e ? 0 : e.length;
          return n ? It(e, t) / n : NaN;
        }
        function Lt(e) {
          return function (t) {
            return null == t ? void 0 : t[e];
          };
        }
        function kt(e) {
          return function (t) {
            return null == e ? void 0 : e[t];
          };
        }
        function Ct(e, t, n, i, r) {
          return (
            r(e, function (e, r, o) {
              n = i ? ((i = !1), e) : t(n, e, r, o);
            }),
            n
          );
        }
        function It(e, t) {
          for (var n, i = -1, r = e.length; ++i < r; ) {
            var o = t(e[i]);
            void 0 !== o && (n = void 0 === n ? o : n + o);
          }
          return n;
        }
        function At(e, t) {
          for (var n = -1, i = Array(e); ++n < e; ) i[n] = t(n);
          return i;
        }
        function Pt(e) {
          return function (t) {
            return e(t);
          };
        }
        function Ot(e, t) {
          return ft(t, function (t) {
            return e[t];
          });
        }
        function Bt(e, t) {
          return e.has(t);
        }
        function Tt(e, t) {
          for (var n = -1, i = e.length; ++n < i && _t(t, e[n], 0) > -1; );
          return n;
        }
        function Nt(e, t) {
          for (var n = e.length; n-- && _t(t, e[n], 0) > -1; );
          return n;
        }
        function Mt(e, t) {
          for (var n = e.length, i = 0; n--; ) e[n] === t && ++i;
          return i;
        }
        var jt = kt({
            À: 'A',
            Á: 'A',
            Â: 'A',
            Ã: 'A',
            Ä: 'A',
            Å: 'A',
            à: 'a',
            á: 'a',
            â: 'a',
            ã: 'a',
            ä: 'a',
            å: 'a',
            Ç: 'C',
            ç: 'c',
            Ð: 'D',
            ð: 'd',
            È: 'E',
            É: 'E',
            Ê: 'E',
            Ë: 'E',
            è: 'e',
            é: 'e',
            ê: 'e',
            ë: 'e',
            Ì: 'I',
            Í: 'I',
            Î: 'I',
            Ï: 'I',
            ì: 'i',
            í: 'i',
            î: 'i',
            ï: 'i',
            Ñ: 'N',
            ñ: 'n',
            Ò: 'O',
            Ó: 'O',
            Ô: 'O',
            Õ: 'O',
            Ö: 'O',
            Ø: 'O',
            ò: 'o',
            ó: 'o',
            ô: 'o',
            õ: 'o',
            ö: 'o',
            ø: 'o',
            Ù: 'U',
            Ú: 'U',
            Û: 'U',
            Ü: 'U',
            ù: 'u',
            ú: 'u',
            û: 'u',
            ü: 'u',
            Ý: 'Y',
            ý: 'y',
            ÿ: 'y',
            Æ: 'Ae',
            æ: 'ae',
            Þ: 'Th',
            þ: 'th',
            ß: 'ss',
            Ā: 'A',
            Ă: 'A',
            Ą: 'A',
            ā: 'a',
            ă: 'a',
            ą: 'a',
            Ć: 'C',
            Ĉ: 'C',
            Ċ: 'C',
            Č: 'C',
            ć: 'c',
            ĉ: 'c',
            ċ: 'c',
            č: 'c',
            Ď: 'D',
            Đ: 'D',
            ď: 'd',
            đ: 'd',
            Ē: 'E',
            Ĕ: 'E',
            Ė: 'E',
            Ę: 'E',
            Ě: 'E',
            ē: 'e',
            ĕ: 'e',
            ė: 'e',
            ę: 'e',
            ě: 'e',
            Ĝ: 'G',
            Ğ: 'G',
            Ġ: 'G',
            Ģ: 'G',
            ĝ: 'g',
            ğ: 'g',
            ġ: 'g',
            ģ: 'g',
            Ĥ: 'H',
            Ħ: 'H',
            ĥ: 'h',
            ħ: 'h',
            Ĩ: 'I',
            Ī: 'I',
            Ĭ: 'I',
            Į: 'I',
            İ: 'I',
            ĩ: 'i',
            ī: 'i',
            ĭ: 'i',
            į: 'i',
            ı: 'i',
            Ĵ: 'J',
            ĵ: 'j',
            Ķ: 'K',
            ķ: 'k',
            ĸ: 'k',
            Ĺ: 'L',
            Ļ: 'L',
            Ľ: 'L',
            Ŀ: 'L',
            Ł: 'L',
            ĺ: 'l',
            ļ: 'l',
            ľ: 'l',
            ŀ: 'l',
            ł: 'l',
            Ń: 'N',
            Ņ: 'N',
            Ň: 'N',
            Ŋ: 'N',
            ń: 'n',
            ņ: 'n',
            ň: 'n',
            ŋ: 'n',
            Ō: 'O',
            Ŏ: 'O',
            Ő: 'O',
            ō: 'o',
            ŏ: 'o',
            ő: 'o',
            Ŕ: 'R',
            Ŗ: 'R',
            Ř: 'R',
            ŕ: 'r',
            ŗ: 'r',
            ř: 'r',
            Ś: 'S',
            Ŝ: 'S',
            Ş: 'S',
            Š: 'S',
            ś: 's',
            ŝ: 's',
            ş: 's',
            š: 's',
            Ţ: 'T',
            Ť: 'T',
            Ŧ: 'T',
            ţ: 't',
            ť: 't',
            ŧ: 't',
            Ũ: 'U',
            Ū: 'U',
            Ŭ: 'U',
            Ů: 'U',
            Ű: 'U',
            Ų: 'U',
            ũ: 'u',
            ū: 'u',
            ŭ: 'u',
            ů: 'u',
            ű: 'u',
            ų: 'u',
            Ŵ: 'W',
            ŵ: 'w',
            Ŷ: 'Y',
            ŷ: 'y',
            Ÿ: 'Y',
            Ź: 'Z',
            Ż: 'Z',
            Ž: 'Z',
            ź: 'z',
            ż: 'z',
            ž: 'z',
            Ĳ: 'IJ',
            ĳ: 'ij',
            Œ: 'Oe',
            œ: 'oe',
            ŉ: "'n",
            ſ: 's',
          }),
          Dt = kt({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          });
        function qt(e) {
          return '\\' + Fe[e];
        }
        function Rt(e) {
          return je.test(e);
        }
        function Vt(e) {
          var t = -1,
            n = Array(e.size);
          return (
            e.forEach(function (e, i) {
              n[++t] = [i, e];
            }),
            n
          );
        }
        function zt(e, t) {
          return function (n) {
            return e(t(n));
          };
        }
        function Ft(e, t) {
          for (var n = -1, i = e.length, r = 0, o = []; ++n < i; ) {
            var a = e[n];
            (a !== t && a !== s) || ((e[n] = s), (o[r++] = n));
          }
          return o;
        }
        function Ht(e) {
          var t = -1,
            n = Array(e.size);
          return (
            e.forEach(function (e) {
              n[++t] = e;
            }),
            n
          );
        }
        function Ut(e) {
          var t = -1,
            n = Array(e.size);
          return (
            e.forEach(function (e) {
              n[++t] = [e, e];
            }),
            n
          );
        }
        function Gt(e) {
          return Rt(e)
            ? (function (e) {
                var t = (Ne.lastIndex = 0);
                for (; Ne.test(e); ) ++t;
                return t;
              })(e)
            : yt(e);
        }
        function Wt(e) {
          return Rt(e)
            ? (function (e) {
                return e.match(Ne) || [];
              })(e)
            : (function (e) {
                return e.split('');
              })(e);
        }
        var $t = kt({
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#39;': "'",
        });
        var Zt = (function e(t) {
          var n,
            i = (t =
              null == t ? $e : Zt.defaults($e.Object(), t, Zt.pick($e, qe)))
              .Array,
            r = t.Date,
            he = t.Error,
            fe = t.Function,
            pe = t.Math,
            ge = t.Object,
            ve = t.RegExp,
            me = t.String,
            ye = t.TypeError,
            be = i.prototype,
            we = fe.prototype,
            _e = ge.prototype,
            Ee = t['__core-js_shared__'],
            Se = we.toString,
            xe = _e.hasOwnProperty,
            Le = 0,
            ke = (n = /[^.]+$/.exec((Ee && Ee.keys && Ee.keys.IE_PROTO) || ''))
              ? 'Symbol(src)_1.' + n
              : '',
            Ce = _e.toString,
            Ie = Se.call(ge),
            Ae = $e._,
            Pe = ve(
              '^' +
                Se.call(xe)
                  .replace(W, '\\$&')
                  .replace(
                    /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                    '$1.*?'
                  ) +
                '$'
            ),
            Oe = Ye ? t.Buffer : void 0,
            Ne = t.Symbol,
            je = t.Uint8Array,
            Fe = Oe ? Oe.allocUnsafe : void 0,
            Ge = zt(ge.getPrototypeOf, ge),
            We = ge.create,
            Ze = _e.propertyIsEnumerable,
            Ke = be.splice,
            Xe = Ne ? Ne.isConcatSpreadable : void 0,
            Je = Ne ? Ne.iterator : void 0,
            yt = Ne ? Ne.toStringTag : void 0,
            kt = (function () {
              try {
                var e = Qr(ge, 'defineProperty');
                return e({}, '', {}), e;
              } catch (e) {}
            })(),
            Kt = t.clearTimeout !== $e.clearTimeout && t.clearTimeout,
            Yt = r && r.now !== $e.Date.now && r.now,
            Xt = t.setTimeout !== $e.setTimeout && t.setTimeout,
            Jt = pe.ceil,
            Qt = pe.floor,
            en = ge.getOwnPropertySymbols,
            tn = Oe ? Oe.isBuffer : void 0,
            nn = t.isFinite,
            rn = be.join,
            on = zt(ge.keys, ge),
            sn = pe.max,
            an = pe.min,
            cn = r.now,
            ln = t.parseInt,
            un = pe.random,
            dn = be.reverse,
            hn = Qr(t, 'DataView'),
            fn = Qr(t, 'Map'),
            pn = Qr(t, 'Promise'),
            gn = Qr(t, 'Set'),
            vn = Qr(t, 'WeakMap'),
            mn = Qr(ge, 'create'),
            yn = vn && new vn(),
            bn = {},
            wn = Co(hn),
            _n = Co(fn),
            En = Co(pn),
            Sn = Co(gn),
            xn = Co(vn),
            Ln = Ne ? Ne.prototype : void 0,
            kn = Ln ? Ln.valueOf : void 0,
            Cn = Ln ? Ln.toString : void 0;
          function In(e) {
            if (Us(e) && !Ts(e) && !(e instanceof Bn)) {
              if (e instanceof On) return e;
              if (xe.call(e, '__wrapped__')) return Io(e);
            }
            return new On(e);
          }
          var An = (function () {
            function e() {}
            return function (t) {
              if (!Hs(t)) return {};
              if (We) return We(t);
              e.prototype = t;
              var n = new e();
              return (e.prototype = void 0), n;
            };
          })();
          function Pn() {}
          function On(e, t) {
            (this.__wrapped__ = e),
              (this.__actions__ = []),
              (this.__chain__ = !!t),
              (this.__index__ = 0),
              (this.__values__ = void 0);
          }
          function Bn(e) {
            (this.__wrapped__ = e),
              (this.__actions__ = []),
              (this.__dir__ = 1),
              (this.__filtered__ = !1),
              (this.__iteratees__ = []),
              (this.__takeCount__ = 4294967295),
              (this.__views__ = []);
          }
          function Tn(e) {
            var t = -1,
              n = null == e ? 0 : e.length;
            for (this.clear(); ++t < n; ) {
              var i = e[t];
              this.set(i[0], i[1]);
            }
          }
          function Nn(e) {
            var t = -1,
              n = null == e ? 0 : e.length;
            for (this.clear(); ++t < n; ) {
              var i = e[t];
              this.set(i[0], i[1]);
            }
          }
          function Mn(e) {
            var t = -1,
              n = null == e ? 0 : e.length;
            for (this.clear(); ++t < n; ) {
              var i = e[t];
              this.set(i[0], i[1]);
            }
          }
          function jn(e) {
            var t = -1,
              n = null == e ? 0 : e.length;
            for (this.__data__ = new Mn(); ++t < n; ) this.add(e[t]);
          }
          function Dn(e) {
            var t = (this.__data__ = new Nn(e));
            this.size = t.size;
          }
          function qn(e, t) {
            var n = Ts(e),
              i = !n && Bs(e),
              r = !n && !i && Ds(e),
              o = !n && !i && !r && Js(e),
              s = n || i || r || o,
              a = s ? At(e.length, me) : [],
              c = a.length;
            for (var l in e)
              (!t && !xe.call(e, l)) ||
                (s &&
                  ('length' == l ||
                    (r && ('offset' == l || 'parent' == l)) ||
                    (o &&
                      ('buffer' == l ||
                        'byteLength' == l ||
                        'byteOffset' == l)) ||
                    so(l, c))) ||
                a.push(l);
            return a;
          }
          function Rn(e) {
            var t = e.length;
            return t ? e[ji(0, t - 1)] : void 0;
          }
          function Vn(e, t) {
            return xo(mr(e), Kn(t, 0, e.length));
          }
          function zn(e) {
            return xo(mr(e));
          }
          function Fn(e, t, n) {
            ((void 0 !== n && !As(e[t], n)) || (void 0 === n && !(t in e))) &&
              $n(e, t, n);
          }
          function Hn(e, t, n) {
            var i = e[t];
            (xe.call(e, t) && As(i, n) && (void 0 !== n || t in e)) ||
              $n(e, t, n);
          }
          function Un(e, t) {
            for (var n = e.length; n--; ) if (As(e[n][0], t)) return n;
            return -1;
          }
          function Gn(e, t, n, i) {
            return (
              ei(e, function (e, r, o) {
                t(i, e, n(e), o);
              }),
              i
            );
          }
          function Wn(e, t) {
            return e && yr(t, wa(t), e);
          }
          function $n(e, t, n) {
            '__proto__' == t && kt
              ? kt(e, t, {
                  configurable: !0,
                  enumerable: !0,
                  value: n,
                  writable: !0,
                })
              : (e[t] = n);
          }
          function Zn(e, t) {
            for (var n = -1, r = t.length, o = i(r), s = null == e; ++n < r; )
              o[n] = s ? void 0 : ga(e, t[n]);
            return o;
          }
          function Kn(e, t, n) {
            return (
              e == e &&
                (void 0 !== n && (e = e <= n ? e : n),
                void 0 !== t && (e = e >= t ? e : t)),
              e
            );
          }
          function Yn(e, t, n, i, r, o) {
            var s,
              a = 1 & t,
              l = 2 & t,
              h = 4 & t;
            if ((n && (s = r ? n(e, i, r, o) : n(e)), void 0 !== s)) return s;
            if (!Hs(e)) return e;
            var E = Ts(e);
            if (E) {
              if (
                ((s = (function (e) {
                  var t = e.length,
                    n = new e.constructor(t);
                  t &&
                    'string' == typeof e[0] &&
                    xe.call(e, 'index') &&
                    ((n.index = e.index), (n.input = e.input));
                  return n;
                })(e)),
                !a)
              )
                return mr(e, s);
            } else {
              var T = no(e),
                N = T == f || T == p;
              if (Ds(e)) return dr(e, a);
              if (T == m || T == c || (N && !r)) {
                if (((s = l || N ? {} : ro(e)), !a))
                  return l
                    ? (function (e, t) {
                        return yr(e, to(e), t);
                      })(
                        e,
                        (function (e, t) {
                          return e && yr(t, _a(t), e);
                        })(s, e)
                      )
                    : (function (e, t) {
                        return yr(e, eo(e), t);
                      })(e, Wn(s, e));
              } else {
                if (!ze[T]) return r ? e : {};
                s = (function (e, t, n) {
                  var i = e.constructor;
                  switch (t) {
                    case S:
                      return hr(e);
                    case u:
                    case d:
                      return new i(+e);
                    case x:
                      return (function (e, t) {
                        var n = t ? hr(e.buffer) : e.buffer;
                        return new e.constructor(n, e.byteOffset, e.byteLength);
                      })(e, n);
                    case L:
                    case k:
                    case C:
                    case I:
                    case A:
                    case P:
                    case '[object Uint8ClampedArray]':
                    case O:
                    case B:
                      return fr(e, n);
                    case g:
                      return new i();
                    case v:
                    case w:
                      return new i(e);
                    case y:
                      return (function (e) {
                        var t = new e.constructor(e.source, ie.exec(e));
                        return (t.lastIndex = e.lastIndex), t;
                      })(e);
                    case b:
                      return new i();
                    case _:
                      return (r = e), kn ? ge(kn.call(r)) : {};
                  }
                  var r;
                })(e, T, a);
              }
            }
            o || (o = new Dn());
            var M = o.get(e);
            if (M) return M;
            o.set(e, s),
              Ks(e)
                ? e.forEach(function (i) {
                    s.add(Yn(i, t, n, i, e, o));
                  })
                : Gs(e) &&
                  e.forEach(function (i, r) {
                    s.set(r, Yn(i, t, n, r, e, o));
                  });
            var j = E ? void 0 : (h ? (l ? Wr : Gr) : l ? _a : wa)(e);
            return (
              at(j || e, function (i, r) {
                j && (i = e[(r = i)]), Hn(s, r, Yn(i, t, n, r, e, o));
              }),
              s
            );
          }
          function Xn(e, t, n) {
            var i = n.length;
            if (null == e) return !i;
            for (e = ge(e); i--; ) {
              var r = n[i],
                o = t[r],
                s = e[r];
              if ((void 0 === s && !(r in e)) || !o(s)) return !1;
            }
            return !0;
          }
          function Jn(e, t, n) {
            if ('function' != typeof e) throw new ye(o);
            return wo(function () {
              e.apply(void 0, n);
            }, t);
          }
          function Qn(e, t, n, i) {
            var r = -1,
              o = dt,
              s = !0,
              a = e.length,
              c = [],
              l = t.length;
            if (!a) return c;
            n && (t = ft(t, Pt(n))),
              i
                ? ((o = ht), (s = !1))
                : t.length >= 200 && ((o = Bt), (s = !1), (t = new jn(t)));
            e: for (; ++r < a; ) {
              var u = e[r],
                d = null == n ? u : n(u);
              if (((u = i || 0 !== u ? u : 0), s && d == d)) {
                for (var h = l; h--; ) if (t[h] === d) continue e;
                c.push(u);
              } else o(t, d, i) || c.push(u);
            }
            return c;
          }
          (In.templateSettings = {
            escape: V,
            evaluate: z,
            interpolate: F,
            variable: '',
            imports: { _: In },
          }),
            (In.prototype = Pn.prototype),
            (In.prototype.constructor = In),
            (On.prototype = An(Pn.prototype)),
            (On.prototype.constructor = On),
            (Bn.prototype = An(Pn.prototype)),
            (Bn.prototype.constructor = Bn),
            (Tn.prototype.clear = function () {
              (this.__data__ = mn ? mn(null) : {}), (this.size = 0);
            }),
            (Tn.prototype.delete = function (e) {
              var t = this.has(e) && delete this.__data__[e];
              return (this.size -= t ? 1 : 0), t;
            }),
            (Tn.prototype.get = function (e) {
              var t = this.__data__;
              if (mn) {
                var n = t[e];
                return '__lodash_hash_undefined__' === n ? void 0 : n;
              }
              return xe.call(t, e) ? t[e] : void 0;
            }),
            (Tn.prototype.has = function (e) {
              var t = this.__data__;
              return mn ? void 0 !== t[e] : xe.call(t, e);
            }),
            (Tn.prototype.set = function (e, t) {
              var n = this.__data__;
              return (
                (this.size += this.has(e) ? 0 : 1),
                (n[e] = mn && void 0 === t ? '__lodash_hash_undefined__' : t),
                this
              );
            }),
            (Nn.prototype.clear = function () {
              (this.__data__ = []), (this.size = 0);
            }),
            (Nn.prototype.delete = function (e) {
              var t = this.__data__,
                n = Un(t, e);
              return (
                !(n < 0) &&
                (n == t.length - 1 ? t.pop() : Ke.call(t, n, 1),
                --this.size,
                !0)
              );
            }),
            (Nn.prototype.get = function (e) {
              var t = this.__data__,
                n = Un(t, e);
              return n < 0 ? void 0 : t[n][1];
            }),
            (Nn.prototype.has = function (e) {
              return Un(this.__data__, e) > -1;
            }),
            (Nn.prototype.set = function (e, t) {
              var n = this.__data__,
                i = Un(n, e);
              return (
                i < 0 ? (++this.size, n.push([e, t])) : (n[i][1] = t), this
              );
            }),
            (Mn.prototype.clear = function () {
              (this.size = 0),
                (this.__data__ = {
                  hash: new Tn(),
                  map: new (fn || Nn)(),
                  string: new Tn(),
                });
            }),
            (Mn.prototype.delete = function (e) {
              var t = Xr(this, e).delete(e);
              return (this.size -= t ? 1 : 0), t;
            }),
            (Mn.prototype.get = function (e) {
              return Xr(this, e).get(e);
            }),
            (Mn.prototype.has = function (e) {
              return Xr(this, e).has(e);
            }),
            (Mn.prototype.set = function (e, t) {
              var n = Xr(this, e),
                i = n.size;
              return n.set(e, t), (this.size += n.size == i ? 0 : 1), this;
            }),
            (jn.prototype.add = jn.prototype.push =
              function (e) {
                return this.__data__.set(e, '__lodash_hash_undefined__'), this;
              }),
            (jn.prototype.has = function (e) {
              return this.__data__.has(e);
            }),
            (Dn.prototype.clear = function () {
              (this.__data__ = new Nn()), (this.size = 0);
            }),
            (Dn.prototype.delete = function (e) {
              var t = this.__data__,
                n = t.delete(e);
              return (this.size = t.size), n;
            }),
            (Dn.prototype.get = function (e) {
              return this.__data__.get(e);
            }),
            (Dn.prototype.has = function (e) {
              return this.__data__.has(e);
            }),
            (Dn.prototype.set = function (e, t) {
              var n = this.__data__;
              if (n instanceof Nn) {
                var i = n.__data__;
                if (!fn || i.length < 199)
                  return i.push([e, t]), (this.size = ++n.size), this;
                n = this.__data__ = new Mn(i);
              }
              return n.set(e, t), (this.size = n.size), this;
            });
          var ei = _r(ci),
            ti = _r(li, !0);
          function ni(e, t) {
            var n = !0;
            return (
              ei(e, function (e, i, r) {
                return (n = !!t(e, i, r));
              }),
              n
            );
          }
          function ii(e, t, n) {
            for (var i = -1, r = e.length; ++i < r; ) {
              var o = e[i],
                s = t(o);
              if (null != s && (void 0 === a ? s == s && !Xs(s) : n(s, a)))
                var a = s,
                  c = o;
            }
            return c;
          }
          function ri(e, t) {
            var n = [];
            return (
              ei(e, function (e, i, r) {
                t(e, i, r) && n.push(e);
              }),
              n
            );
          }
          function oi(e, t, n, i, r) {
            var o = -1,
              s = e.length;
            for (n || (n = oo), r || (r = []); ++o < s; ) {
              var a = e[o];
              t > 0 && n(a)
                ? t > 1
                  ? oi(a, t - 1, n, i, r)
                  : pt(r, a)
                : i || (r[r.length] = a);
            }
            return r;
          }
          var si = Er(),
            ai = Er(!0);
          function ci(e, t) {
            return e && si(e, t, wa);
          }
          function li(e, t) {
            return e && ai(e, t, wa);
          }
          function ui(e, t) {
            return ut(t, function (t) {
              return Vs(e[t]);
            });
          }
          function di(e, t) {
            for (var n = 0, i = (t = ar(t, e)).length; null != e && n < i; )
              e = e[ko(t[n++])];
            return n && n == i ? e : void 0;
          }
          function hi(e, t, n) {
            var i = t(e);
            return Ts(e) ? i : pt(i, n(e));
          }
          function fi(e) {
            return null == e
              ? void 0 === e
                ? '[object Undefined]'
                : '[object Null]'
              : yt && yt in ge(e)
              ? (function (e) {
                  var t = xe.call(e, yt),
                    n = e[yt];
                  try {
                    e[yt] = void 0;
                    var i = !0;
                  } catch (e) {}
                  var r = Ce.call(e);
                  i && (t ? (e[yt] = n) : delete e[yt]);
                  return r;
                })(e)
              : (function (e) {
                  return Ce.call(e);
                })(e);
          }
          function pi(e, t) {
            return e > t;
          }
          function gi(e, t) {
            return null != e && xe.call(e, t);
          }
          function vi(e, t) {
            return null != e && t in ge(e);
          }
          function mi(e, t, n) {
            for (
              var r = n ? ht : dt,
                o = e[0].length,
                s = e.length,
                a = s,
                c = i(s),
                l = 1 / 0,
                u = [];
              a--;

            ) {
              var d = e[a];
              a && t && (d = ft(d, Pt(t))),
                (l = an(d.length, l)),
                (c[a] =
                  !n && (t || (o >= 120 && d.length >= 120))
                    ? new jn(a && d)
                    : void 0);
            }
            d = e[0];
            var h = -1,
              f = c[0];
            e: for (; ++h < o && u.length < l; ) {
              var p = d[h],
                g = t ? t(p) : p;
              if (((p = n || 0 !== p ? p : 0), !(f ? Bt(f, g) : r(u, g, n)))) {
                for (a = s; --a; ) {
                  var v = c[a];
                  if (!(v ? Bt(v, g) : r(e[a], g, n))) continue e;
                }
                f && f.push(g), u.push(p);
              }
            }
            return u;
          }
          function yi(e, t, n) {
            var i = null == (e = vo(e, (t = ar(t, e)))) ? e : e[ko(Ro(t))];
            return null == i ? void 0 : ot(i, e, n);
          }
          function bi(e) {
            return Us(e) && fi(e) == c;
          }
          function wi(e, t, n, i, r) {
            return (
              e === t ||
              (null == e || null == t || (!Us(e) && !Us(t))
                ? e != e && t != t
                : (function (e, t, n, i, r, o) {
                    var s = Ts(e),
                      a = Ts(t),
                      f = s ? l : no(e),
                      p = a ? l : no(t),
                      E = (f = f == c ? m : f) == m,
                      L = (p = p == c ? m : p) == m,
                      k = f == p;
                    if (k && Ds(e)) {
                      if (!Ds(t)) return !1;
                      (s = !0), (E = !1);
                    }
                    if (k && !E)
                      return (
                        o || (o = new Dn()),
                        s || Js(e)
                          ? Hr(e, t, n, i, r, o)
                          : (function (e, t, n, i, r, o, s) {
                              switch (n) {
                                case x:
                                  if (
                                    e.byteLength != t.byteLength ||
                                    e.byteOffset != t.byteOffset
                                  )
                                    return !1;
                                  (e = e.buffer), (t = t.buffer);
                                case S:
                                  return !(
                                    e.byteLength != t.byteLength ||
                                    !o(new je(e), new je(t))
                                  );
                                case u:
                                case d:
                                case v:
                                  return As(+e, +t);
                                case h:
                                  return (
                                    e.name == t.name && e.message == t.message
                                  );
                                case y:
                                case w:
                                  return e == t + '';
                                case g:
                                  var a = Vt;
                                case b:
                                  var c = 1 & i;
                                  if ((a || (a = Ht), e.size != t.size && !c))
                                    return !1;
                                  var l = s.get(e);
                                  if (l) return l == t;
                                  (i |= 2), s.set(e, t);
                                  var f = Hr(a(e), a(t), i, r, o, s);
                                  return s.delete(e), f;
                                case _:
                                  if (kn) return kn.call(e) == kn.call(t);
                              }
                              return !1;
                            })(e, t, f, n, i, r, o)
                      );
                    if (!(1 & n)) {
                      var C = E && xe.call(e, '__wrapped__'),
                        I = L && xe.call(t, '__wrapped__');
                      if (C || I) {
                        var A = C ? e.value() : e,
                          P = I ? t.value() : t;
                        return o || (o = new Dn()), r(A, P, n, i, o);
                      }
                    }
                    if (!k) return !1;
                    return (
                      o || (o = new Dn()),
                      (function (e, t, n, i, r, o) {
                        var s = 1 & n,
                          a = Gr(e),
                          c = a.length,
                          l = Gr(t).length;
                        if (c != l && !s) return !1;
                        var u = c;
                        for (; u--; ) {
                          var d = a[u];
                          if (!(s ? d in t : xe.call(t, d))) return !1;
                        }
                        var h = o.get(e),
                          f = o.get(t);
                        if (h && f) return h == t && f == e;
                        var p = !0;
                        o.set(e, t), o.set(t, e);
                        var g = s;
                        for (; ++u < c; ) {
                          d = a[u];
                          var v = e[d],
                            m = t[d];
                          if (i)
                            var y = s
                              ? i(m, v, d, t, e, o)
                              : i(v, m, d, e, t, o);
                          if (
                            !(void 0 === y ? v === m || r(v, m, n, i, o) : y)
                          ) {
                            p = !1;
                            break;
                          }
                          g || (g = 'constructor' == d);
                        }
                        if (p && !g) {
                          var b = e.constructor,
                            w = t.constructor;
                          b == w ||
                            !('constructor' in e) ||
                            !('constructor' in t) ||
                            ('function' == typeof b &&
                              b instanceof b &&
                              'function' == typeof w &&
                              w instanceof w) ||
                            (p = !1);
                        }
                        return o.delete(e), o.delete(t), p;
                      })(e, t, n, i, r, o)
                    );
                  })(e, t, n, i, wi, r))
            );
          }
          function _i(e, t, n, i) {
            var r = n.length,
              o = r,
              s = !i;
            if (null == e) return !o;
            for (e = ge(e); r--; ) {
              var a = n[r];
              if (s && a[2] ? a[1] !== e[a[0]] : !(a[0] in e)) return !1;
            }
            for (; ++r < o; ) {
              var c = (a = n[r])[0],
                l = e[c],
                u = a[1];
              if (s && a[2]) {
                if (void 0 === l && !(c in e)) return !1;
              } else {
                var d = new Dn();
                if (i) var h = i(l, u, c, e, t, d);
                if (!(void 0 === h ? wi(u, l, 3, i, d) : h)) return !1;
              }
            }
            return !0;
          }
          function Ei(e) {
            return (
              !(!Hs(e) || ((t = e), ke && ke in t)) &&
              (Vs(e) ? Pe : se).test(Co(e))
            );
            var t;
          }
          function Si(e) {
            return 'function' == typeof e
              ? e
              : null == e
              ? Wa
              : 'object' == typeof e
              ? Ts(e)
                ? Ai(e[0], e[1])
                : Ii(e)
              : tc(e);
          }
          function xi(e) {
            if (!ho(e)) return on(e);
            var t = [];
            for (var n in ge(e))
              xe.call(e, n) && 'constructor' != n && t.push(n);
            return t;
          }
          function Li(e) {
            if (!Hs(e))
              return (function (e) {
                var t = [];
                if (null != e) for (var n in ge(e)) t.push(n);
                return t;
              })(e);
            var t = ho(e),
              n = [];
            for (var i in e)
              ('constructor' != i || (!t && xe.call(e, i))) && n.push(i);
            return n;
          }
          function ki(e, t) {
            return e < t;
          }
          function Ci(e, t) {
            var n = -1,
              r = Ms(e) ? i(e.length) : [];
            return (
              ei(e, function (e, i, o) {
                r[++n] = t(e, i, o);
              }),
              r
            );
          }
          function Ii(e) {
            var t = Jr(e);
            return 1 == t.length && t[0][2]
              ? po(t[0][0], t[0][1])
              : function (n) {
                  return n === e || _i(n, e, t);
                };
          }
          function Ai(e, t) {
            return co(e) && fo(t)
              ? po(ko(e), t)
              : function (n) {
                  var i = ga(n, e);
                  return void 0 === i && i === t ? va(n, e) : wi(t, i, 3);
                };
          }
          function Pi(e, t, n, i, r) {
            e !== t &&
              si(
                t,
                function (o, s) {
                  if ((r || (r = new Dn()), Hs(o)))
                    !(function (e, t, n, i, r, o, s) {
                      var a = yo(e, n),
                        c = yo(t, n),
                        l = s.get(c);
                      if (l) return void Fn(e, n, l);
                      var u = o ? o(a, c, n + '', e, t, s) : void 0,
                        d = void 0 === u;
                      if (d) {
                        var h = Ts(c),
                          f = !h && Ds(c),
                          p = !h && !f && Js(c);
                        (u = c),
                          h || f || p
                            ? Ts(a)
                              ? (u = a)
                              : js(a)
                              ? (u = mr(a))
                              : f
                              ? ((d = !1), (u = dr(c, !0)))
                              : p
                              ? ((d = !1), (u = fr(c, !0)))
                              : (u = [])
                            : $s(c) || Bs(c)
                            ? ((u = a),
                              Bs(a)
                                ? (u = sa(a))
                                : (Hs(a) && !Vs(a)) || (u = ro(c)))
                            : (d = !1);
                      }
                      d && (s.set(c, u), r(u, c, i, o, s), s.delete(c));
                      Fn(e, n, u);
                    })(e, t, s, n, Pi, i, r);
                  else {
                    var a = i ? i(yo(e, s), o, s + '', e, t, r) : void 0;
                    void 0 === a && (a = o), Fn(e, s, a);
                  }
                },
                _a
              );
          }
          function Oi(e, t) {
            var n = e.length;
            if (n) return so((t += t < 0 ? n : 0), n) ? e[t] : void 0;
          }
          function Bi(e, t, n) {
            t = t.length
              ? ft(t, function (e) {
                  return Ts(e)
                    ? function (t) {
                        return di(t, 1 === e.length ? e[0] : e);
                      }
                    : e;
                })
              : [Wa];
            var i = -1;
            return (
              (t = ft(t, Pt(Yr()))),
              (function (e, t) {
                var n = e.length;
                for (e.sort(t); n--; ) e[n] = e[n].value;
                return e;
              })(
                Ci(e, function (e, n, r) {
                  return {
                    criteria: ft(t, function (t) {
                      return t(e);
                    }),
                    index: ++i,
                    value: e,
                  };
                }),
                function (e, t) {
                  return (function (e, t, n) {
                    var i = -1,
                      r = e.criteria,
                      o = t.criteria,
                      s = r.length,
                      a = n.length;
                    for (; ++i < s; ) {
                      var c = pr(r[i], o[i]);
                      if (c) {
                        if (i >= a) return c;
                        var l = n[i];
                        return c * ('desc' == l ? -1 : 1);
                      }
                    }
                    return e.index - t.index;
                  })(e, t, n);
                }
              )
            );
          }
          function Ti(e, t, n) {
            for (var i = -1, r = t.length, o = {}; ++i < r; ) {
              var s = t[i],
                a = di(e, s);
              n(a, s) && zi(o, ar(s, e), a);
            }
            return o;
          }
          function Ni(e, t, n, i) {
            var r = i ? Et : _t,
              o = -1,
              s = t.length,
              a = e;
            for (e === t && (t = mr(t)), n && (a = ft(e, Pt(n))); ++o < s; )
              for (
                var c = 0, l = t[o], u = n ? n(l) : l;
                (c = r(a, u, c, i)) > -1;

              )
                a !== e && Ke.call(a, c, 1), Ke.call(e, c, 1);
            return e;
          }
          function Mi(e, t) {
            for (var n = e ? t.length : 0, i = n - 1; n--; ) {
              var r = t[n];
              if (n == i || r !== o) {
                var o = r;
                so(r) ? Ke.call(e, r, 1) : Qi(e, r);
              }
            }
            return e;
          }
          function ji(e, t) {
            return e + Qt(un() * (t - e + 1));
          }
          function Di(e, t) {
            var n = '';
            if (!e || t < 1 || t > 9007199254740991) return n;
            do {
              t % 2 && (n += e), (t = Qt(t / 2)) && (e += e);
            } while (t);
            return n;
          }
          function qi(e, t) {
            return _o(go(e, t, Wa), e + '');
          }
          function Ri(e) {
            return Rn(Aa(e));
          }
          function Vi(e, t) {
            var n = Aa(e);
            return xo(n, Kn(t, 0, n.length));
          }
          function zi(e, t, n, i) {
            if (!Hs(e)) return e;
            for (
              var r = -1, o = (t = ar(t, e)).length, s = o - 1, a = e;
              null != a && ++r < o;

            ) {
              var c = ko(t[r]),
                l = n;
              if ('__proto__' === c || 'constructor' === c || 'prototype' === c)
                return e;
              if (r != s) {
                var u = a[c];
                void 0 === (l = i ? i(u, c, a) : void 0) &&
                  (l = Hs(u) ? u : so(t[r + 1]) ? [] : {});
              }
              Hn(a, c, l), (a = a[c]);
            }
            return e;
          }
          var Fi = yn
              ? function (e, t) {
                  return yn.set(e, t), e;
                }
              : Wa,
            Hi = kt
              ? function (e, t) {
                  return kt(e, 'toString', {
                    configurable: !0,
                    enumerable: !1,
                    value: Ha(t),
                    writable: !0,
                  });
                }
              : Wa;
          function Ui(e) {
            return xo(Aa(e));
          }
          function Gi(e, t, n) {
            var r = -1,
              o = e.length;
            t < 0 && (t = -t > o ? 0 : o + t),
              (n = n > o ? o : n) < 0 && (n += o),
              (o = t > n ? 0 : (n - t) >>> 0),
              (t >>>= 0);
            for (var s = i(o); ++r < o; ) s[r] = e[r + t];
            return s;
          }
          function Wi(e, t) {
            var n;
            return (
              ei(e, function (e, i, r) {
                return !(n = t(e, i, r));
              }),
              !!n
            );
          }
          function $i(e, t, n) {
            var i = 0,
              r = null == e ? i : e.length;
            if ('number' == typeof t && t == t && r <= 2147483647) {
              for (; i < r; ) {
                var o = (i + r) >>> 1,
                  s = e[o];
                null !== s && !Xs(s) && (n ? s <= t : s < t)
                  ? (i = o + 1)
                  : (r = o);
              }
              return r;
            }
            return Zi(e, t, Wa, n);
          }
          function Zi(e, t, n, i) {
            var r = 0,
              o = null == e ? 0 : e.length;
            if (0 === o) return 0;
            for (
              var s = (t = n(t)) != t,
                a = null === t,
                c = Xs(t),
                l = void 0 === t;
              r < o;

            ) {
              var u = Qt((r + o) / 2),
                d = n(e[u]),
                h = void 0 !== d,
                f = null === d,
                p = d == d,
                g = Xs(d);
              if (s) var v = i || p;
              else
                v = l
                  ? p && (i || h)
                  : a
                  ? p && h && (i || !f)
                  : c
                  ? p && h && !f && (i || !g)
                  : !f && !g && (i ? d <= t : d < t);
              v ? (r = u + 1) : (o = u);
            }
            return an(o, 4294967294);
          }
          function Ki(e, t) {
            for (var n = -1, i = e.length, r = 0, o = []; ++n < i; ) {
              var s = e[n],
                a = t ? t(s) : s;
              if (!n || !As(a, c)) {
                var c = a;
                o[r++] = 0 === s ? 0 : s;
              }
            }
            return o;
          }
          function Yi(e) {
            return 'number' == typeof e ? e : Xs(e) ? NaN : +e;
          }
          function Xi(e) {
            if ('string' == typeof e) return e;
            if (Ts(e)) return ft(e, Xi) + '';
            if (Xs(e)) return Cn ? Cn.call(e) : '';
            var t = e + '';
            return '0' == t && 1 / e == -1 / 0 ? '-0' : t;
          }
          function Ji(e, t, n) {
            var i = -1,
              r = dt,
              o = e.length,
              s = !0,
              a = [],
              c = a;
            if (n) (s = !1), (r = ht);
            else if (o >= 200) {
              var l = t ? null : Dr(e);
              if (l) return Ht(l);
              (s = !1), (r = Bt), (c = new jn());
            } else c = t ? [] : a;
            e: for (; ++i < o; ) {
              var u = e[i],
                d = t ? t(u) : u;
              if (((u = n || 0 !== u ? u : 0), s && d == d)) {
                for (var h = c.length; h--; ) if (c[h] === d) continue e;
                t && c.push(d), a.push(u);
              } else r(c, d, n) || (c !== a && c.push(d), a.push(u));
            }
            return a;
          }
          function Qi(e, t) {
            return null == (e = vo(e, (t = ar(t, e)))) || delete e[ko(Ro(t))];
          }
          function er(e, t, n, i) {
            return zi(e, t, n(di(e, t)), i);
          }
          function tr(e, t, n, i) {
            for (
              var r = e.length, o = i ? r : -1;
              (i ? o-- : ++o < r) && t(e[o], o, e);

            );
            return n
              ? Gi(e, i ? 0 : o, i ? o + 1 : r)
              : Gi(e, i ? o + 1 : 0, i ? r : o);
          }
          function nr(e, t) {
            var n = e;
            return (
              n instanceof Bn && (n = n.value()),
              gt(
                t,
                function (e, t) {
                  return t.func.apply(t.thisArg, pt([e], t.args));
                },
                n
              )
            );
          }
          function ir(e, t, n) {
            var r = e.length;
            if (r < 2) return r ? Ji(e[0]) : [];
            for (var o = -1, s = i(r); ++o < r; )
              for (var a = e[o], c = -1; ++c < r; )
                c != o && (s[o] = Qn(s[o] || a, e[c], t, n));
            return Ji(oi(s, 1), t, n);
          }
          function rr(e, t, n) {
            for (var i = -1, r = e.length, o = t.length, s = {}; ++i < r; ) {
              var a = i < o ? t[i] : void 0;
              n(s, e[i], a);
            }
            return s;
          }
          function or(e) {
            return js(e) ? e : [];
          }
          function sr(e) {
            return 'function' == typeof e ? e : Wa;
          }
          function ar(e, t) {
            return Ts(e) ? e : co(e, t) ? [e] : Lo(aa(e));
          }
          var cr = qi;
          function lr(e, t, n) {
            var i = e.length;
            return (n = void 0 === n ? i : n), !t && n >= i ? e : Gi(e, t, n);
          }
          var ur =
            Kt ||
            function (e) {
              return $e.clearTimeout(e);
            };
          function dr(e, t) {
            if (t) return e.slice();
            var n = e.length,
              i = Fe ? Fe(n) : new e.constructor(n);
            return e.copy(i), i;
          }
          function hr(e) {
            var t = new e.constructor(e.byteLength);
            return new je(t).set(new je(e)), t;
          }
          function fr(e, t) {
            var n = t ? hr(e.buffer) : e.buffer;
            return new e.constructor(n, e.byteOffset, e.length);
          }
          function pr(e, t) {
            if (e !== t) {
              var n = void 0 !== e,
                i = null === e,
                r = e == e,
                o = Xs(e),
                s = void 0 !== t,
                a = null === t,
                c = t == t,
                l = Xs(t);
              if (
                (!a && !l && !o && e > t) ||
                (o && s && c && !a && !l) ||
                (i && s && c) ||
                (!n && c) ||
                !r
              )
                return 1;
              if (
                (!i && !o && !l && e < t) ||
                (l && n && r && !i && !o) ||
                (a && n && r) ||
                (!s && r) ||
                !c
              )
                return -1;
            }
            return 0;
          }
          function gr(e, t, n, r) {
            for (
              var o = -1,
                s = e.length,
                a = n.length,
                c = -1,
                l = t.length,
                u = sn(s - a, 0),
                d = i(l + u),
                h = !r;
              ++c < l;

            )
              d[c] = t[c];
            for (; ++o < a; ) (h || o < s) && (d[n[o]] = e[o]);
            for (; u--; ) d[c++] = e[o++];
            return d;
          }
          function vr(e, t, n, r) {
            for (
              var o = -1,
                s = e.length,
                a = -1,
                c = n.length,
                l = -1,
                u = t.length,
                d = sn(s - c, 0),
                h = i(d + u),
                f = !r;
              ++o < d;

            )
              h[o] = e[o];
            for (var p = o; ++l < u; ) h[p + l] = t[l];
            for (; ++a < c; ) (f || o < s) && (h[p + n[a]] = e[o++]);
            return h;
          }
          function mr(e, t) {
            var n = -1,
              r = e.length;
            for (t || (t = i(r)); ++n < r; ) t[n] = e[n];
            return t;
          }
          function yr(e, t, n, i) {
            var r = !n;
            n || (n = {});
            for (var o = -1, s = t.length; ++o < s; ) {
              var a = t[o],
                c = i ? i(n[a], e[a], a, n, e) : void 0;
              void 0 === c && (c = e[a]), r ? $n(n, a, c) : Hn(n, a, c);
            }
            return n;
          }
          function br(e, t) {
            return function (n, i) {
              var r = Ts(n) ? st : Gn,
                o = t ? t() : {};
              return r(n, e, Yr(i, 2), o);
            };
          }
          function wr(e) {
            return qi(function (t, n) {
              var i = -1,
                r = n.length,
                o = r > 1 ? n[r - 1] : void 0,
                s = r > 2 ? n[2] : void 0;
              for (
                o = e.length > 3 && 'function' == typeof o ? (r--, o) : void 0,
                  s && ao(n[0], n[1], s) && ((o = r < 3 ? void 0 : o), (r = 1)),
                  t = ge(t);
                ++i < r;

              ) {
                var a = n[i];
                a && e(t, a, i, o);
              }
              return t;
            });
          }
          function _r(e, t) {
            return function (n, i) {
              if (null == n) return n;
              if (!Ms(n)) return e(n, i);
              for (
                var r = n.length, o = t ? r : -1, s = ge(n);
                (t ? o-- : ++o < r) && !1 !== i(s[o], o, s);

              );
              return n;
            };
          }
          function Er(e) {
            return function (t, n, i) {
              for (var r = -1, o = ge(t), s = i(t), a = s.length; a--; ) {
                var c = s[e ? a : ++r];
                if (!1 === n(o[c], c, o)) break;
              }
              return t;
            };
          }
          function Sr(e) {
            return function (t) {
              var n = Rt((t = aa(t))) ? Wt(t) : void 0,
                i = n ? n[0] : t.charAt(0),
                r = n ? lr(n, 1).join('') : t.slice(1);
              return i[e]() + r;
            };
          }
          function xr(e) {
            return function (t) {
              return gt(Va(Ba(t).replace(Be, '')), e, '');
            };
          }
          function Lr(e) {
            return function () {
              var t = arguments;
              switch (t.length) {
                case 0:
                  return new e();
                case 1:
                  return new e(t[0]);
                case 2:
                  return new e(t[0], t[1]);
                case 3:
                  return new e(t[0], t[1], t[2]);
                case 4:
                  return new e(t[0], t[1], t[2], t[3]);
                case 5:
                  return new e(t[0], t[1], t[2], t[3], t[4]);
                case 6:
                  return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
                case 7:
                  return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
              }
              var n = An(e.prototype),
                i = e.apply(n, t);
              return Hs(i) ? i : n;
            };
          }
          function kr(e) {
            return function (t, n, i) {
              var r = ge(t);
              if (!Ms(t)) {
                var o = Yr(n, 3);
                (t = wa(t)),
                  (n = function (e) {
                    return o(r[e], e, r);
                  });
              }
              var s = e(t, n, i);
              return s > -1 ? r[o ? t[s] : s] : void 0;
            };
          }
          function Cr(e) {
            return Ur(function (t) {
              var n = t.length,
                i = n,
                r = On.prototype.thru;
              for (e && t.reverse(); i--; ) {
                var s = t[i];
                if ('function' != typeof s) throw new ye(o);
                if (r && !a && 'wrapper' == Zr(s)) var a = new On([], !0);
              }
              for (i = a ? i : n; ++i < n; ) {
                var c = Zr((s = t[i])),
                  l = 'wrapper' == c ? $r(s) : void 0;
                a =
                  l && lo(l[0]) && 424 == l[1] && !l[4].length && 1 == l[9]
                    ? a[Zr(l[0])].apply(a, l[3])
                    : 1 == s.length && lo(s)
                    ? a[c]()
                    : a.thru(s);
              }
              return function () {
                var e = arguments,
                  i = e[0];
                if (a && 1 == e.length && Ts(i)) return a.plant(i).value();
                for (var r = 0, o = n ? t[r].apply(this, e) : i; ++r < n; )
                  o = t[r].call(this, o);
                return o;
              };
            });
          }
          function Ir(e, t, n, r, o, s, a, c, l, u) {
            var d = 128 & t,
              h = 1 & t,
              f = 2 & t,
              p = 24 & t,
              g = 512 & t,
              v = f ? void 0 : Lr(e);
            return function m() {
              for (var y = arguments.length, b = i(y), w = y; w--; )
                b[w] = arguments[w];
              if (p)
                var _ = Kr(m),
                  E = Mt(b, _);
              if (
                (r && (b = gr(b, r, o, p)),
                s && (b = vr(b, s, a, p)),
                (y -= E),
                p && y < u)
              ) {
                var S = Ft(b, _);
                return Mr(e, t, Ir, m.placeholder, n, b, S, c, l, u - y);
              }
              var x = h ? n : this,
                L = f ? x[e] : e;
              return (
                (y = b.length),
                c ? (b = mo(b, c)) : g && y > 1 && b.reverse(),
                d && l < y && (b.length = l),
                this && this !== $e && this instanceof m && (L = v || Lr(L)),
                L.apply(x, b)
              );
            };
          }
          function Ar(e, t) {
            return function (n, i) {
              return (function (e, t, n, i) {
                return (
                  ci(e, function (e, r, o) {
                    t(i, n(e), r, o);
                  }),
                  i
                );
              })(n, e, t(i), {});
            };
          }
          function Pr(e, t) {
            return function (n, i) {
              var r;
              if (void 0 === n && void 0 === i) return t;
              if ((void 0 !== n && (r = n), void 0 !== i)) {
                if (void 0 === r) return i;
                'string' == typeof n || 'string' == typeof i
                  ? ((n = Xi(n)), (i = Xi(i)))
                  : ((n = Yi(n)), (i = Yi(i))),
                  (r = e(n, i));
              }
              return r;
            };
          }
          function Or(e) {
            return Ur(function (t) {
              return (
                (t = ft(t, Pt(Yr()))),
                qi(function (n) {
                  var i = this;
                  return e(t, function (e) {
                    return ot(e, i, n);
                  });
                })
              );
            });
          }
          function Br(e, t) {
            var n = (t = void 0 === t ? ' ' : Xi(t)).length;
            if (n < 2) return n ? Di(t, e) : t;
            var i = Di(t, Jt(e / Gt(t)));
            return Rt(t) ? lr(Wt(i), 0, e).join('') : i.slice(0, e);
          }
          function Tr(e) {
            return function (t, n, r) {
              return (
                r && 'number' != typeof r && ao(t, n, r) && (n = r = void 0),
                (t = na(t)),
                void 0 === n ? ((n = t), (t = 0)) : (n = na(n)),
                (function (e, t, n, r) {
                  for (
                    var o = -1, s = sn(Jt((t - e) / (n || 1)), 0), a = i(s);
                    s--;

                  )
                    (a[r ? s : ++o] = e), (e += n);
                  return a;
                })(t, n, (r = void 0 === r ? (t < n ? 1 : -1) : na(r)), e)
              );
            };
          }
          function Nr(e) {
            return function (t, n) {
              return (
                ('string' == typeof t && 'string' == typeof n) ||
                  ((t = oa(t)), (n = oa(n))),
                e(t, n)
              );
            };
          }
          function Mr(e, t, n, i, r, o, s, a, c, l) {
            var u = 8 & t;
            (t |= u ? 32 : 64), 4 & (t &= ~(u ? 64 : 32)) || (t &= -4);
            var d = [
                e,
                t,
                r,
                u ? o : void 0,
                u ? s : void 0,
                u ? void 0 : o,
                u ? void 0 : s,
                a,
                c,
                l,
              ],
              h = n.apply(void 0, d);
            return lo(e) && bo(h, d), (h.placeholder = i), Eo(h, e, t);
          }
          function jr(e) {
            var t = pe[e];
            return function (e, n) {
              if (
                ((e = oa(e)), (n = null == n ? 0 : an(ia(n), 292)) && nn(e))
              ) {
                var i = (aa(e) + 'e').split('e');
                return +(
                  (i = (aa(t(i[0] + 'e' + (+i[1] + n))) + 'e').split('e'))[0] +
                  'e' +
                  (+i[1] - n)
                );
              }
              return t(e);
            };
          }
          var Dr =
            gn && 1 / Ht(new gn([, -0]))[1] == 1 / 0
              ? function (e) {
                  return new gn(e);
                }
              : Xa;
          function qr(e) {
            return function (t) {
              var n = no(t);
              return n == g
                ? Vt(t)
                : n == b
                ? Ut(t)
                : (function (e, t) {
                    return ft(t, function (t) {
                      return [t, e[t]];
                    });
                  })(t, e(t));
            };
          }
          function Rr(e, t, n, r, a, c, l, u) {
            var d = 2 & t;
            if (!d && 'function' != typeof e) throw new ye(o);
            var h = r ? r.length : 0;
            if (
              (h || ((t &= -97), (r = a = void 0)),
              (l = void 0 === l ? l : sn(ia(l), 0)),
              (u = void 0 === u ? u : ia(u)),
              (h -= a ? a.length : 0),
              64 & t)
            ) {
              var f = r,
                p = a;
              r = a = void 0;
            }
            var g = d ? void 0 : $r(e),
              v = [e, t, n, r, a, f, p, c, l, u];
            if (
              (g &&
                (function (e, t) {
                  var n = e[1],
                    i = t[1],
                    r = n | i,
                    o = r < 131,
                    a =
                      (128 == i && 8 == n) ||
                      (128 == i && 256 == n && e[7].length <= t[8]) ||
                      (384 == i && t[7].length <= t[8] && 8 == n);
                  if (!o && !a) return e;
                  1 & i && ((e[2] = t[2]), (r |= 1 & n ? 0 : 4));
                  var c = t[3];
                  if (c) {
                    var l = e[3];
                    (e[3] = l ? gr(l, c, t[4]) : c),
                      (e[4] = l ? Ft(e[3], s) : t[4]);
                  }
                  (c = t[5]) &&
                    ((l = e[5]),
                    (e[5] = l ? vr(l, c, t[6]) : c),
                    (e[6] = l ? Ft(e[5], s) : t[6]));
                  (c = t[7]) && (e[7] = c);
                  128 & i && (e[8] = null == e[8] ? t[8] : an(e[8], t[8]));
                  null == e[9] && (e[9] = t[9]);
                  (e[0] = t[0]), (e[1] = r);
                })(v, g),
              (e = v[0]),
              (t = v[1]),
              (n = v[2]),
              (r = v[3]),
              (a = v[4]),
              !(u = v[9] =
                void 0 === v[9] ? (d ? 0 : e.length) : sn(v[9] - h, 0)) &&
                24 & t &&
                (t &= -25),
              t && 1 != t)
            )
              m =
                8 == t || 16 == t
                  ? (function (e, t, n) {
                      var r = Lr(e);
                      return function o() {
                        for (
                          var s = arguments.length, a = i(s), c = s, l = Kr(o);
                          c--;

                        )
                          a[c] = arguments[c];
                        var u =
                          s < 3 && a[0] !== l && a[s - 1] !== l ? [] : Ft(a, l);
                        if ((s -= u.length) < n)
                          return Mr(
                            e,
                            t,
                            Ir,
                            o.placeholder,
                            void 0,
                            a,
                            u,
                            void 0,
                            void 0,
                            n - s
                          );
                        var d =
                          this && this !== $e && this instanceof o ? r : e;
                        return ot(d, this, a);
                      };
                    })(e, t, u)
                  : (32 != t && 33 != t) || a.length
                  ? Ir.apply(void 0, v)
                  : (function (e, t, n, r) {
                      var o = 1 & t,
                        s = Lr(e);
                      return function t() {
                        for (
                          var a = -1,
                            c = arguments.length,
                            l = -1,
                            u = r.length,
                            d = i(u + c),
                            h =
                              this && this !== $e && this instanceof t ? s : e;
                          ++l < u;

                        )
                          d[l] = r[l];
                        for (; c--; ) d[l++] = arguments[++a];
                        return ot(h, o ? n : this, d);
                      };
                    })(e, t, n, r);
            else
              var m = (function (e, t, n) {
                var i = 1 & t,
                  r = Lr(e);
                return function t() {
                  var o = this && this !== $e && this instanceof t ? r : e;
                  return o.apply(i ? n : this, arguments);
                };
              })(e, t, n);
            return Eo((g ? Fi : bo)(m, v), e, t);
          }
          function Vr(e, t, n, i) {
            return void 0 === e || (As(e, _e[n]) && !xe.call(i, n)) ? t : e;
          }
          function zr(e, t, n, i, r, o) {
            return (
              Hs(e) &&
                Hs(t) &&
                (o.set(t, e), Pi(e, t, void 0, zr, o), o.delete(t)),
              e
            );
          }
          function Fr(e) {
            return $s(e) ? void 0 : e;
          }
          function Hr(e, t, n, i, r, o) {
            var s = 1 & n,
              a = e.length,
              c = t.length;
            if (a != c && !(s && c > a)) return !1;
            var l = o.get(e),
              u = o.get(t);
            if (l && u) return l == t && u == e;
            var d = -1,
              h = !0,
              f = 2 & n ? new jn() : void 0;
            for (o.set(e, t), o.set(t, e); ++d < a; ) {
              var p = e[d],
                g = t[d];
              if (i) var v = s ? i(g, p, d, t, e, o) : i(p, g, d, e, t, o);
              if (void 0 !== v) {
                if (v) continue;
                h = !1;
                break;
              }
              if (f) {
                if (
                  !mt(t, function (e, t) {
                    if (!Bt(f, t) && (p === e || r(p, e, n, i, o)))
                      return f.push(t);
                  })
                ) {
                  h = !1;
                  break;
                }
              } else if (p !== g && !r(p, g, n, i, o)) {
                h = !1;
                break;
              }
            }
            return o.delete(e), o.delete(t), h;
          }
          function Ur(e) {
            return _o(go(e, void 0, No), e + '');
          }
          function Gr(e) {
            return hi(e, wa, eo);
          }
          function Wr(e) {
            return hi(e, _a, to);
          }
          var $r = yn
            ? function (e) {
                return yn.get(e);
              }
            : Xa;
          function Zr(e) {
            for (
              var t = e.name + '', n = bn[t], i = xe.call(bn, t) ? n.length : 0;
              i--;

            ) {
              var r = n[i],
                o = r.func;
              if (null == o || o == e) return r.name;
            }
            return t;
          }
          function Kr(e) {
            return (xe.call(In, 'placeholder') ? In : e).placeholder;
          }
          function Yr() {
            var e = In.iteratee || $a;
            return (
              (e = e === $a ? Si : e),
              arguments.length ? e(arguments[0], arguments[1]) : e
            );
          }
          function Xr(e, t) {
            var n,
              i,
              r = e.__data__;
            return (
              'string' == (i = typeof (n = t)) ||
              'number' == i ||
              'symbol' == i ||
              'boolean' == i
                ? '__proto__' !== n
                : null === n
            )
              ? r['string' == typeof t ? 'string' : 'hash']
              : r.map;
          }
          function Jr(e) {
            for (var t = wa(e), n = t.length; n--; ) {
              var i = t[n],
                r = e[i];
              t[n] = [i, r, fo(r)];
            }
            return t;
          }
          function Qr(e, t) {
            var n = (function (e, t) {
              return null == e ? void 0 : e[t];
            })(e, t);
            return Ei(n) ? n : void 0;
          }
          var eo = en
              ? function (e) {
                  return null == e
                    ? []
                    : ((e = ge(e)),
                      ut(en(e), function (t) {
                        return Ze.call(e, t);
                      }));
                }
              : rc,
            to = en
              ? function (e) {
                  for (var t = []; e; ) pt(t, eo(e)), (e = Ge(e));
                  return t;
                }
              : rc,
            no = fi;
          function io(e, t, n) {
            for (var i = -1, r = (t = ar(t, e)).length, o = !1; ++i < r; ) {
              var s = ko(t[i]);
              if (!(o = null != e && n(e, s))) break;
              e = e[s];
            }
            return o || ++i != r
              ? o
              : !!(r = null == e ? 0 : e.length) &&
                  Fs(r) &&
                  so(s, r) &&
                  (Ts(e) || Bs(e));
          }
          function ro(e) {
            return 'function' != typeof e.constructor || ho(e) ? {} : An(Ge(e));
          }
          function oo(e) {
            return Ts(e) || Bs(e) || !!(Xe && e && e[Xe]);
          }
          function so(e, t) {
            var n = typeof e;
            return (
              !!(t = null == t ? 9007199254740991 : t) &&
              ('number' == n || ('symbol' != n && ce.test(e))) &&
              e > -1 &&
              e % 1 == 0 &&
              e < t
            );
          }
          function ao(e, t, n) {
            if (!Hs(n)) return !1;
            var i = typeof t;
            return (
              !!('number' == i
                ? Ms(n) && so(t, n.length)
                : 'string' == i && t in n) && As(n[t], e)
            );
          }
          function co(e, t) {
            if (Ts(e)) return !1;
            var n = typeof e;
            return (
              !(
                'number' != n &&
                'symbol' != n &&
                'boolean' != n &&
                null != e &&
                !Xs(e)
              ) ||
              U.test(e) ||
              !H.test(e) ||
              (null != t && e in ge(t))
            );
          }
          function lo(e) {
            var t = Zr(e),
              n = In[t];
            if ('function' != typeof n || !(t in Bn.prototype)) return !1;
            if (e === n) return !0;
            var i = $r(n);
            return !!i && e === i[0];
          }
          ((hn && no(new hn(new ArrayBuffer(1))) != x) ||
            (fn && no(new fn()) != g) ||
            (pn && '[object Promise]' != no(pn.resolve())) ||
            (gn && no(new gn()) != b) ||
            (vn && no(new vn()) != E)) &&
            (no = function (e) {
              var t = fi(e),
                n = t == m ? e.constructor : void 0,
                i = n ? Co(n) : '';
              if (i)
                switch (i) {
                  case wn:
                    return x;
                  case _n:
                    return g;
                  case En:
                    return '[object Promise]';
                  case Sn:
                    return b;
                  case xn:
                    return E;
                }
              return t;
            });
          var uo = Ee ? Vs : oc;
          function ho(e) {
            var t = e && e.constructor;
            return e === (('function' == typeof t && t.prototype) || _e);
          }
          function fo(e) {
            return e == e && !Hs(e);
          }
          function po(e, t) {
            return function (n) {
              return null != n && n[e] === t && (void 0 !== t || e in ge(n));
            };
          }
          function go(e, t, n) {
            return (
              (t = sn(void 0 === t ? e.length - 1 : t, 0)),
              function () {
                for (
                  var r = arguments, o = -1, s = sn(r.length - t, 0), a = i(s);
                  ++o < s;

                )
                  a[o] = r[t + o];
                o = -1;
                for (var c = i(t + 1); ++o < t; ) c[o] = r[o];
                return (c[t] = n(a)), ot(e, this, c);
              }
            );
          }
          function vo(e, t) {
            return t.length < 2 ? e : di(e, Gi(t, 0, -1));
          }
          function mo(e, t) {
            for (var n = e.length, i = an(t.length, n), r = mr(e); i--; ) {
              var o = t[i];
              e[i] = so(o, n) ? r[o] : void 0;
            }
            return e;
          }
          function yo(e, t) {
            if (
              ('constructor' !== t || 'function' != typeof e[t]) &&
              '__proto__' != t
            )
              return e[t];
          }
          var bo = So(Fi),
            wo =
              Xt ||
              function (e, t) {
                return $e.setTimeout(e, t);
              },
            _o = So(Hi);
          function Eo(e, t, n) {
            var i = t + '';
            return _o(
              e,
              (function (e, t) {
                var n = t.length;
                if (!n) return e;
                var i = n - 1;
                return (
                  (t[i] = (n > 1 ? '& ' : '') + t[i]),
                  (t = t.join(n > 2 ? ', ' : ' ')),
                  e.replace(X, '{\n/* [wrapped with ' + t + '] */\n')
                );
              })(
                i,
                (function (e, t) {
                  return (
                    at(a, function (n) {
                      var i = '_.' + n[0];
                      t & n[1] && !dt(e, i) && e.push(i);
                    }),
                    e.sort()
                  );
                })(
                  (function (e) {
                    var t = e.match(J);
                    return t ? t[1].split(Q) : [];
                  })(i),
                  n
                )
              )
            );
          }
          function So(e) {
            var t = 0,
              n = 0;
            return function () {
              var i = cn(),
                r = 16 - (i - n);
              if (((n = i), r > 0)) {
                if (++t >= 800) return arguments[0];
              } else t = 0;
              return e.apply(void 0, arguments);
            };
          }
          function xo(e, t) {
            var n = -1,
              i = e.length,
              r = i - 1;
            for (t = void 0 === t ? i : t; ++n < t; ) {
              var o = ji(n, r),
                s = e[o];
              (e[o] = e[n]), (e[n] = s);
            }
            return (e.length = t), e;
          }
          var Lo = (function (e) {
            var t = Ss(e, function (e) {
                return 500 === n.size && n.clear(), e;
              }),
              n = t.cache;
            return t;
          })(function (e) {
            var t = [];
            return (
              46 === e.charCodeAt(0) && t.push(''),
              e.replace(G, function (e, n, i, r) {
                t.push(i ? r.replace(te, '$1') : n || e);
              }),
              t
            );
          });
          function ko(e) {
            if ('string' == typeof e || Xs(e)) return e;
            var t = e + '';
            return '0' == t && 1 / e == -1 / 0 ? '-0' : t;
          }
          function Co(e) {
            if (null != e) {
              try {
                return Se.call(e);
              } catch (e) {}
              try {
                return e + '';
              } catch (e) {}
            }
            return '';
          }
          function Io(e) {
            if (e instanceof Bn) return e.clone();
            var t = new On(e.__wrapped__, e.__chain__);
            return (
              (t.__actions__ = mr(e.__actions__)),
              (t.__index__ = e.__index__),
              (t.__values__ = e.__values__),
              t
            );
          }
          var Ao = qi(function (e, t) {
              return js(e) ? Qn(e, oi(t, 1, js, !0)) : [];
            }),
            Po = qi(function (e, t) {
              var n = Ro(t);
              return (
                js(n) && (n = void 0),
                js(e) ? Qn(e, oi(t, 1, js, !0), Yr(n, 2)) : []
              );
            }),
            Oo = qi(function (e, t) {
              var n = Ro(t);
              return (
                js(n) && (n = void 0),
                js(e) ? Qn(e, oi(t, 1, js, !0), void 0, n) : []
              );
            });
          function Bo(e, t, n) {
            var i = null == e ? 0 : e.length;
            if (!i) return -1;
            var r = null == n ? 0 : ia(n);
            return r < 0 && (r = sn(i + r, 0)), wt(e, Yr(t, 3), r);
          }
          function To(e, t, n) {
            var i = null == e ? 0 : e.length;
            if (!i) return -1;
            var r = i - 1;
            return (
              void 0 !== n &&
                ((r = ia(n)), (r = n < 0 ? sn(i + r, 0) : an(r, i - 1))),
              wt(e, Yr(t, 3), r, !0)
            );
          }
          function No(e) {
            return (null == e ? 0 : e.length) ? oi(e, 1) : [];
          }
          function Mo(e) {
            return e && e.length ? e[0] : void 0;
          }
          var jo = qi(function (e) {
              var t = ft(e, or);
              return t.length && t[0] === e[0] ? mi(t) : [];
            }),
            Do = qi(function (e) {
              var t = Ro(e),
                n = ft(e, or);
              return (
                t === Ro(n) ? (t = void 0) : n.pop(),
                n.length && n[0] === e[0] ? mi(n, Yr(t, 2)) : []
              );
            }),
            qo = qi(function (e) {
              var t = Ro(e),
                n = ft(e, or);
              return (
                (t = 'function' == typeof t ? t : void 0) && n.pop(),
                n.length && n[0] === e[0] ? mi(n, void 0, t) : []
              );
            });
          function Ro(e) {
            var t = null == e ? 0 : e.length;
            return t ? e[t - 1] : void 0;
          }
          var Vo = qi(zo);
          function zo(e, t) {
            return e && e.length && t && t.length ? Ni(e, t) : e;
          }
          var Fo = Ur(function (e, t) {
            var n = null == e ? 0 : e.length,
              i = Zn(e, t);
            return (
              Mi(
                e,
                ft(t, function (e) {
                  return so(e, n) ? +e : e;
                }).sort(pr)
              ),
              i
            );
          });
          function Ho(e) {
            return null == e ? e : dn.call(e);
          }
          var Uo = qi(function (e) {
              return Ji(oi(e, 1, js, !0));
            }),
            Go = qi(function (e) {
              var t = Ro(e);
              return js(t) && (t = void 0), Ji(oi(e, 1, js, !0), Yr(t, 2));
            }),
            Wo = qi(function (e) {
              var t = Ro(e);
              return (
                (t = 'function' == typeof t ? t : void 0),
                Ji(oi(e, 1, js, !0), void 0, t)
              );
            });
          function $o(e) {
            if (!e || !e.length) return [];
            var t = 0;
            return (
              (e = ut(e, function (e) {
                if (js(e)) return (t = sn(e.length, t)), !0;
              })),
              At(t, function (t) {
                return ft(e, Lt(t));
              })
            );
          }
          function Zo(e, t) {
            if (!e || !e.length) return [];
            var n = $o(e);
            return null == t
              ? n
              : ft(n, function (e) {
                  return ot(t, void 0, e);
                });
          }
          var Ko = qi(function (e, t) {
              return js(e) ? Qn(e, t) : [];
            }),
            Yo = qi(function (e) {
              return ir(ut(e, js));
            }),
            Xo = qi(function (e) {
              var t = Ro(e);
              return js(t) && (t = void 0), ir(ut(e, js), Yr(t, 2));
            }),
            Jo = qi(function (e) {
              var t = Ro(e);
              return (
                (t = 'function' == typeof t ? t : void 0),
                ir(ut(e, js), void 0, t)
              );
            }),
            Qo = qi($o);
          var es = qi(function (e) {
            var t = e.length,
              n = t > 1 ? e[t - 1] : void 0;
            return (
              (n = 'function' == typeof n ? (e.pop(), n) : void 0), Zo(e, n)
            );
          });
          function ts(e) {
            var t = In(e);
            return (t.__chain__ = !0), t;
          }
          function ns(e, t) {
            return t(e);
          }
          var is = Ur(function (e) {
            var t = e.length,
              n = t ? e[0] : 0,
              i = this.__wrapped__,
              r = function (t) {
                return Zn(t, e);
              };
            return !(t > 1 || this.__actions__.length) &&
              i instanceof Bn &&
              so(n)
              ? ((i = i.slice(n, +n + (t ? 1 : 0))).__actions__.push({
                  func: ns,
                  args: [r],
                  thisArg: void 0,
                }),
                new On(i, this.__chain__).thru(function (e) {
                  return t && !e.length && e.push(void 0), e;
                }))
              : this.thru(r);
          });
          var rs = br(function (e, t, n) {
            xe.call(e, n) ? ++e[n] : $n(e, n, 1);
          });
          var os = kr(Bo),
            ss = kr(To);
          function as(e, t) {
            return (Ts(e) ? at : ei)(e, Yr(t, 3));
          }
          function cs(e, t) {
            return (Ts(e) ? ct : ti)(e, Yr(t, 3));
          }
          var ls = br(function (e, t, n) {
            xe.call(e, n) ? e[n].push(t) : $n(e, n, [t]);
          });
          var us = qi(function (e, t, n) {
              var r = -1,
                o = 'function' == typeof t,
                s = Ms(e) ? i(e.length) : [];
              return (
                ei(e, function (e) {
                  s[++r] = o ? ot(t, e, n) : yi(e, t, n);
                }),
                s
              );
            }),
            ds = br(function (e, t, n) {
              $n(e, n, t);
            });
          function hs(e, t) {
            return (Ts(e) ? ft : Ci)(e, Yr(t, 3));
          }
          var fs = br(
            function (e, t, n) {
              e[n ? 0 : 1].push(t);
            },
            function () {
              return [[], []];
            }
          );
          var ps = qi(function (e, t) {
              if (null == e) return [];
              var n = t.length;
              return (
                n > 1 && ao(e, t[0], t[1])
                  ? (t = [])
                  : n > 2 && ao(t[0], t[1], t[2]) && (t = [t[0]]),
                Bi(e, oi(t, 1), [])
              );
            }),
            gs =
              Yt ||
              function () {
                return $e.Date.now();
              };
          function vs(e, t, n) {
            return (
              (t = n ? void 0 : t),
              Rr(
                e,
                128,
                void 0,
                void 0,
                void 0,
                void 0,
                (t = e && null == t ? e.length : t)
              )
            );
          }
          function ms(e, t) {
            var n;
            if ('function' != typeof t) throw new ye(o);
            return (
              (e = ia(e)),
              function () {
                return (
                  --e > 0 && (n = t.apply(this, arguments)),
                  e <= 1 && (t = void 0),
                  n
                );
              }
            );
          }
          var ys = qi(function (e, t, n) {
              var i = 1;
              if (n.length) {
                var r = Ft(n, Kr(ys));
                i |= 32;
              }
              return Rr(e, i, t, n, r);
            }),
            bs = qi(function (e, t, n) {
              var i = 3;
              if (n.length) {
                var r = Ft(n, Kr(bs));
                i |= 32;
              }
              return Rr(t, i, e, n, r);
            });
          function ws(e, t, n) {
            var i,
              r,
              s,
              a,
              c,
              l,
              u = 0,
              d = !1,
              h = !1,
              f = !0;
            if ('function' != typeof e) throw new ye(o);
            function p(t) {
              var n = i,
                o = r;
              return (i = r = void 0), (u = t), (a = e.apply(o, n));
            }
            function g(e) {
              return (u = e), (c = wo(m, t)), d ? p(e) : a;
            }
            function v(e) {
              var n = e - l;
              return void 0 === l || n >= t || n < 0 || (h && e - u >= s);
            }
            function m() {
              var e = gs();
              if (v(e)) return y(e);
              c = wo(
                m,
                (function (e) {
                  var n = t - (e - l);
                  return h ? an(n, s - (e - u)) : n;
                })(e)
              );
            }
            function y(e) {
              return (c = void 0), f && i ? p(e) : ((i = r = void 0), a);
            }
            function b() {
              var e = gs(),
                n = v(e);
              if (((i = arguments), (r = this), (l = e), n)) {
                if (void 0 === c) return g(l);
                if (h) return ur(c), (c = wo(m, t)), p(l);
              }
              return void 0 === c && (c = wo(m, t)), a;
            }
            return (
              (t = oa(t) || 0),
              Hs(n) &&
                ((d = !!n.leading),
                (s = (h = 'maxWait' in n) ? sn(oa(n.maxWait) || 0, t) : s),
                (f = 'trailing' in n ? !!n.trailing : f)),
              (b.cancel = function () {
                void 0 !== c && ur(c), (u = 0), (i = l = r = c = void 0);
              }),
              (b.flush = function () {
                return void 0 === c ? a : y(gs());
              }),
              b
            );
          }
          var _s = qi(function (e, t) {
              return Jn(e, 1, t);
            }),
            Es = qi(function (e, t, n) {
              return Jn(e, oa(t) || 0, n);
            });
          function Ss(e, t) {
            if ('function' != typeof e || (null != t && 'function' != typeof t))
              throw new ye(o);
            var n = function () {
              var i = arguments,
                r = t ? t.apply(this, i) : i[0],
                o = n.cache;
              if (o.has(r)) return o.get(r);
              var s = e.apply(this, i);
              return (n.cache = o.set(r, s) || o), s;
            };
            return (n.cache = new (Ss.Cache || Mn)()), n;
          }
          function xs(e) {
            if ('function' != typeof e) throw new ye(o);
            return function () {
              var t = arguments;
              switch (t.length) {
                case 0:
                  return !e.call(this);
                case 1:
                  return !e.call(this, t[0]);
                case 2:
                  return !e.call(this, t[0], t[1]);
                case 3:
                  return !e.call(this, t[0], t[1], t[2]);
              }
              return !e.apply(this, t);
            };
          }
          Ss.Cache = Mn;
          var Ls = cr(function (e, t) {
              var n = (t =
                1 == t.length && Ts(t[0])
                  ? ft(t[0], Pt(Yr()))
                  : ft(oi(t, 1), Pt(Yr()))).length;
              return qi(function (i) {
                for (var r = -1, o = an(i.length, n); ++r < o; )
                  i[r] = t[r].call(this, i[r]);
                return ot(e, this, i);
              });
            }),
            ks = qi(function (e, t) {
              return Rr(e, 32, void 0, t, Ft(t, Kr(ks)));
            }),
            Cs = qi(function (e, t) {
              return Rr(e, 64, void 0, t, Ft(t, Kr(Cs)));
            }),
            Is = Ur(function (e, t) {
              return Rr(e, 256, void 0, void 0, void 0, t);
            });
          function As(e, t) {
            return e === t || (e != e && t != t);
          }
          var Ps = Nr(pi),
            Os = Nr(function (e, t) {
              return e >= t;
            }),
            Bs = bi(
              (function () {
                return arguments;
              })()
            )
              ? bi
              : function (e) {
                  return Us(e) && xe.call(e, 'callee') && !Ze.call(e, 'callee');
                },
            Ts = i.isArray,
            Ns = Qe
              ? Pt(Qe)
              : function (e) {
                  return Us(e) && fi(e) == S;
                };
          function Ms(e) {
            return null != e && Fs(e.length) && !Vs(e);
          }
          function js(e) {
            return Us(e) && Ms(e);
          }
          var Ds = tn || oc,
            qs = et
              ? Pt(et)
              : function (e) {
                  return Us(e) && fi(e) == d;
                };
          function Rs(e) {
            if (!Us(e)) return !1;
            var t = fi(e);
            return (
              t == h ||
              '[object DOMException]' == t ||
              ('string' == typeof e.message &&
                'string' == typeof e.name &&
                !$s(e))
            );
          }
          function Vs(e) {
            if (!Hs(e)) return !1;
            var t = fi(e);
            return (
              t == f ||
              t == p ||
              '[object AsyncFunction]' == t ||
              '[object Proxy]' == t
            );
          }
          function zs(e) {
            return 'number' == typeof e && e == ia(e);
          }
          function Fs(e) {
            return (
              'number' == typeof e &&
              e > -1 &&
              e % 1 == 0 &&
              e <= 9007199254740991
            );
          }
          function Hs(e) {
            var t = typeof e;
            return null != e && ('object' == t || 'function' == t);
          }
          function Us(e) {
            return null != e && 'object' == typeof e;
          }
          var Gs = tt
            ? Pt(tt)
            : function (e) {
                return Us(e) && no(e) == g;
              };
          function Ws(e) {
            return 'number' == typeof e || (Us(e) && fi(e) == v);
          }
          function $s(e) {
            if (!Us(e) || fi(e) != m) return !1;
            var t = Ge(e);
            if (null === t) return !0;
            var n = xe.call(t, 'constructor') && t.constructor;
            return 'function' == typeof n && n instanceof n && Se.call(n) == Ie;
          }
          var Zs = nt
            ? Pt(nt)
            : function (e) {
                return Us(e) && fi(e) == y;
              };
          var Ks = it
            ? Pt(it)
            : function (e) {
                return Us(e) && no(e) == b;
              };
          function Ys(e) {
            return 'string' == typeof e || (!Ts(e) && Us(e) && fi(e) == w);
          }
          function Xs(e) {
            return 'symbol' == typeof e || (Us(e) && fi(e) == _);
          }
          var Js = rt
            ? Pt(rt)
            : function (e) {
                return Us(e) && Fs(e.length) && !!Ve[fi(e)];
              };
          var Qs = Nr(ki),
            ea = Nr(function (e, t) {
              return e <= t;
            });
          function ta(e) {
            if (!e) return [];
            if (Ms(e)) return Ys(e) ? Wt(e) : mr(e);
            if (Je && e[Je])
              return (function (e) {
                for (var t, n = []; !(t = e.next()).done; ) n.push(t.value);
                return n;
              })(e[Je]());
            var t = no(e);
            return (t == g ? Vt : t == b ? Ht : Aa)(e);
          }
          function na(e) {
            return e
              ? (e = oa(e)) === 1 / 0 || e === -1 / 0
                ? 17976931348623157e292 * (e < 0 ? -1 : 1)
                : e == e
                ? e
                : 0
              : 0 === e
              ? e
              : 0;
          }
          function ia(e) {
            var t = na(e),
              n = t % 1;
            return t == t ? (n ? t - n : t) : 0;
          }
          function ra(e) {
            return e ? Kn(ia(e), 0, 4294967295) : 0;
          }
          function oa(e) {
            if ('number' == typeof e) return e;
            if (Xs(e)) return NaN;
            if (Hs(e)) {
              var t = 'function' == typeof e.valueOf ? e.valueOf() : e;
              e = Hs(t) ? t + '' : t;
            }
            if ('string' != typeof e) return 0 === e ? e : +e;
            e = e.replace(Z, '');
            var n = oe.test(e);
            return n || ae.test(e)
              ? Ue(e.slice(2), n ? 2 : 8)
              : re.test(e)
              ? NaN
              : +e;
          }
          function sa(e) {
            return yr(e, _a(e));
          }
          function aa(e) {
            return null == e ? '' : Xi(e);
          }
          var ca = wr(function (e, t) {
              if (ho(t) || Ms(t)) yr(t, wa(t), e);
              else for (var n in t) xe.call(t, n) && Hn(e, n, t[n]);
            }),
            la = wr(function (e, t) {
              yr(t, _a(t), e);
            }),
            ua = wr(function (e, t, n, i) {
              yr(t, _a(t), e, i);
            }),
            da = wr(function (e, t, n, i) {
              yr(t, wa(t), e, i);
            }),
            ha = Ur(Zn);
          var fa = qi(function (e, t) {
              e = ge(e);
              var n = -1,
                i = t.length,
                r = i > 2 ? t[2] : void 0;
              for (r && ao(t[0], t[1], r) && (i = 1); ++n < i; )
                for (var o = t[n], s = _a(o), a = -1, c = s.length; ++a < c; ) {
                  var l = s[a],
                    u = e[l];
                  (void 0 === u || (As(u, _e[l]) && !xe.call(e, l))) &&
                    (e[l] = o[l]);
                }
              return e;
            }),
            pa = qi(function (e) {
              return e.push(void 0, zr), ot(Sa, void 0, e);
            });
          function ga(e, t, n) {
            var i = null == e ? void 0 : di(e, t);
            return void 0 === i ? n : i;
          }
          function va(e, t) {
            return null != e && io(e, t, vi);
          }
          var ma = Ar(function (e, t, n) {
              null != t && 'function' != typeof t.toString && (t = Ce.call(t)),
                (e[t] = n);
            }, Ha(Wa)),
            ya = Ar(function (e, t, n) {
              null != t && 'function' != typeof t.toString && (t = Ce.call(t)),
                xe.call(e, t) ? e[t].push(n) : (e[t] = [n]);
            }, Yr),
            ba = qi(yi);
          function wa(e) {
            return Ms(e) ? qn(e) : xi(e);
          }
          function _a(e) {
            return Ms(e) ? qn(e, !0) : Li(e);
          }
          var Ea = wr(function (e, t, n) {
              Pi(e, t, n);
            }),
            Sa = wr(function (e, t, n, i) {
              Pi(e, t, n, i);
            }),
            xa = Ur(function (e, t) {
              var n = {};
              if (null == e) return n;
              var i = !1;
              (t = ft(t, function (t) {
                return (t = ar(t, e)), i || (i = t.length > 1), t;
              })),
                yr(e, Wr(e), n),
                i && (n = Yn(n, 7, Fr));
              for (var r = t.length; r--; ) Qi(n, t[r]);
              return n;
            });
          var La = Ur(function (e, t) {
            return null == e
              ? {}
              : (function (e, t) {
                  return Ti(e, t, function (t, n) {
                    return va(e, n);
                  });
                })(e, t);
          });
          function ka(e, t) {
            if (null == e) return {};
            var n = ft(Wr(e), function (e) {
              return [e];
            });
            return (
              (t = Yr(t)),
              Ti(e, n, function (e, n) {
                return t(e, n[0]);
              })
            );
          }
          var Ca = qr(wa),
            Ia = qr(_a);
          function Aa(e) {
            return null == e ? [] : Ot(e, wa(e));
          }
          var Pa = xr(function (e, t, n) {
            return (t = t.toLowerCase()), e + (n ? Oa(t) : t);
          });
          function Oa(e) {
            return Ra(aa(e).toLowerCase());
          }
          function Ba(e) {
            return (e = aa(e)) && e.replace(le, jt).replace(Te, '');
          }
          var Ta = xr(function (e, t, n) {
              return e + (n ? '-' : '') + t.toLowerCase();
            }),
            Na = xr(function (e, t, n) {
              return e + (n ? ' ' : '') + t.toLowerCase();
            }),
            Ma = Sr('toLowerCase');
          var ja = xr(function (e, t, n) {
            return e + (n ? '_' : '') + t.toLowerCase();
          });
          var Da = xr(function (e, t, n) {
            return e + (n ? ' ' : '') + Ra(t);
          });
          var qa = xr(function (e, t, n) {
              return e + (n ? ' ' : '') + t.toUpperCase();
            }),
            Ra = Sr('toUpperCase');
          function Va(e, t, n) {
            return (
              (e = aa(e)),
              void 0 === (t = n ? void 0 : t)
                ? (function (e) {
                    return De.test(e);
                  })(e)
                  ? (function (e) {
                      return e.match(Me) || [];
                    })(e)
                  : (function (e) {
                      return e.match(ee) || [];
                    })(e)
                : e.match(t) || []
            );
          }
          var za = qi(function (e, t) {
              try {
                return ot(e, void 0, t);
              } catch (e) {
                return Rs(e) ? e : new he(e);
              }
            }),
            Fa = Ur(function (e, t) {
              return (
                at(t, function (t) {
                  (t = ko(t)), $n(e, t, ys(e[t], e));
                }),
                e
              );
            });
          function Ha(e) {
            return function () {
              return e;
            };
          }
          var Ua = Cr(),
            Ga = Cr(!0);
          function Wa(e) {
            return e;
          }
          function $a(e) {
            return Si('function' == typeof e ? e : Yn(e, 1));
          }
          var Za = qi(function (e, t) {
              return function (n) {
                return yi(n, e, t);
              };
            }),
            Ka = qi(function (e, t) {
              return function (n) {
                return yi(e, n, t);
              };
            });
          function Ya(e, t, n) {
            var i = wa(t),
              r = ui(t, i);
            null != n ||
              (Hs(t) && (r.length || !i.length)) ||
              ((n = t), (t = e), (e = this), (r = ui(t, wa(t))));
            var o = !(Hs(n) && 'chain' in n && !n.chain),
              s = Vs(e);
            return (
              at(r, function (n) {
                var i = t[n];
                (e[n] = i),
                  s &&
                    (e.prototype[n] = function () {
                      var t = this.__chain__;
                      if (o || t) {
                        var n = e(this.__wrapped__),
                          r = (n.__actions__ = mr(this.__actions__));
                        return (
                          r.push({ func: i, args: arguments, thisArg: e }),
                          (n.__chain__ = t),
                          n
                        );
                      }
                      return i.apply(e, pt([this.value()], arguments));
                    });
              }),
              e
            );
          }
          function Xa() {}
          var Ja = Or(ft),
            Qa = Or(lt),
            ec = Or(mt);
          function tc(e) {
            return co(e)
              ? Lt(ko(e))
              : (function (e) {
                  return function (t) {
                    return di(t, e);
                  };
                })(e);
          }
          var nc = Tr(),
            ic = Tr(!0);
          function rc() {
            return [];
          }
          function oc() {
            return !1;
          }
          var sc = Pr(function (e, t) {
              return e + t;
            }, 0),
            ac = jr('ceil'),
            cc = Pr(function (e, t) {
              return e / t;
            }, 1),
            lc = jr('floor');
          var uc,
            dc = Pr(function (e, t) {
              return e * t;
            }, 1),
            hc = jr('round'),
            fc = Pr(function (e, t) {
              return e - t;
            }, 0);
          return (
            (In.after = function (e, t) {
              if ('function' != typeof t) throw new ye(o);
              return (
                (e = ia(e)),
                function () {
                  if (--e < 1) return t.apply(this, arguments);
                }
              );
            }),
            (In.ary = vs),
            (In.assign = ca),
            (In.assignIn = la),
            (In.assignInWith = ua),
            (In.assignWith = da),
            (In.at = ha),
            (In.before = ms),
            (In.bind = ys),
            (In.bindAll = Fa),
            (In.bindKey = bs),
            (In.castArray = function () {
              if (!arguments.length) return [];
              var e = arguments[0];
              return Ts(e) ? e : [e];
            }),
            (In.chain = ts),
            (In.chunk = function (e, t, n) {
              t = (n ? ao(e, t, n) : void 0 === t) ? 1 : sn(ia(t), 0);
              var r = null == e ? 0 : e.length;
              if (!r || t < 1) return [];
              for (var o = 0, s = 0, a = i(Jt(r / t)); o < r; )
                a[s++] = Gi(e, o, (o += t));
              return a;
            }),
            (In.compact = function (e) {
              for (
                var t = -1, n = null == e ? 0 : e.length, i = 0, r = [];
                ++t < n;

              ) {
                var o = e[t];
                o && (r[i++] = o);
              }
              return r;
            }),
            (In.concat = function () {
              var e = arguments.length;
              if (!e) return [];
              for (var t = i(e - 1), n = arguments[0], r = e; r--; )
                t[r - 1] = arguments[r];
              return pt(Ts(n) ? mr(n) : [n], oi(t, 1));
            }),
            (In.cond = function (e) {
              var t = null == e ? 0 : e.length,
                n = Yr();
              return (
                (e = t
                  ? ft(e, function (e) {
                      if ('function' != typeof e[1]) throw new ye(o);
                      return [n(e[0]), e[1]];
                    })
                  : []),
                qi(function (n) {
                  for (var i = -1; ++i < t; ) {
                    var r = e[i];
                    if (ot(r[0], this, n)) return ot(r[1], this, n);
                  }
                })
              );
            }),
            (In.conforms = function (e) {
              return (function (e) {
                var t = wa(e);
                return function (n) {
                  return Xn(n, e, t);
                };
              })(Yn(e, 1));
            }),
            (In.constant = Ha),
            (In.countBy = rs),
            (In.create = function (e, t) {
              var n = An(e);
              return null == t ? n : Wn(n, t);
            }),
            (In.curry = function e(t, n, i) {
              var r = Rr(
                t,
                8,
                void 0,
                void 0,
                void 0,
                void 0,
                void 0,
                (n = i ? void 0 : n)
              );
              return (r.placeholder = e.placeholder), r;
            }),
            (In.curryRight = function e(t, n, i) {
              var r = Rr(
                t,
                16,
                void 0,
                void 0,
                void 0,
                void 0,
                void 0,
                (n = i ? void 0 : n)
              );
              return (r.placeholder = e.placeholder), r;
            }),
            (In.debounce = ws),
            (In.defaults = fa),
            (In.defaultsDeep = pa),
            (In.defer = _s),
            (In.delay = Es),
            (In.difference = Ao),
            (In.differenceBy = Po),
            (In.differenceWith = Oo),
            (In.drop = function (e, t, n) {
              var i = null == e ? 0 : e.length;
              return i
                ? Gi(e, (t = n || void 0 === t ? 1 : ia(t)) < 0 ? 0 : t, i)
                : [];
            }),
            (In.dropRight = function (e, t, n) {
              var i = null == e ? 0 : e.length;
              return i
                ? Gi(
                    e,
                    0,
                    (t = i - (t = n || void 0 === t ? 1 : ia(t))) < 0 ? 0 : t
                  )
                : [];
            }),
            (In.dropRightWhile = function (e, t) {
              return e && e.length ? tr(e, Yr(t, 3), !0, !0) : [];
            }),
            (In.dropWhile = function (e, t) {
              return e && e.length ? tr(e, Yr(t, 3), !0) : [];
            }),
            (In.fill = function (e, t, n, i) {
              var r = null == e ? 0 : e.length;
              return r
                ? (n &&
                    'number' != typeof n &&
                    ao(e, t, n) &&
                    ((n = 0), (i = r)),
                  (function (e, t, n, i) {
                    var r = e.length;
                    for (
                      (n = ia(n)) < 0 && (n = -n > r ? 0 : r + n),
                        (i = void 0 === i || i > r ? r : ia(i)) < 0 && (i += r),
                        i = n > i ? 0 : ra(i);
                      n < i;

                    )
                      e[n++] = t;
                    return e;
                  })(e, t, n, i))
                : [];
            }),
            (In.filter = function (e, t) {
              return (Ts(e) ? ut : ri)(e, Yr(t, 3));
            }),
            (In.flatMap = function (e, t) {
              return oi(hs(e, t), 1);
            }),
            (In.flatMapDeep = function (e, t) {
              return oi(hs(e, t), 1 / 0);
            }),
            (In.flatMapDepth = function (e, t, n) {
              return (n = void 0 === n ? 1 : ia(n)), oi(hs(e, t), n);
            }),
            (In.flatten = No),
            (In.flattenDeep = function (e) {
              return (null == e ? 0 : e.length) ? oi(e, 1 / 0) : [];
            }),
            (In.flattenDepth = function (e, t) {
              return (null == e ? 0 : e.length)
                ? oi(e, (t = void 0 === t ? 1 : ia(t)))
                : [];
            }),
            (In.flip = function (e) {
              return Rr(e, 512);
            }),
            (In.flow = Ua),
            (In.flowRight = Ga),
            (In.fromPairs = function (e) {
              for (
                var t = -1, n = null == e ? 0 : e.length, i = {};
                ++t < n;

              ) {
                var r = e[t];
                i[r[0]] = r[1];
              }
              return i;
            }),
            (In.functions = function (e) {
              return null == e ? [] : ui(e, wa(e));
            }),
            (In.functionsIn = function (e) {
              return null == e ? [] : ui(e, _a(e));
            }),
            (In.groupBy = ls),
            (In.initial = function (e) {
              return (null == e ? 0 : e.length) ? Gi(e, 0, -1) : [];
            }),
            (In.intersection = jo),
            (In.intersectionBy = Do),
            (In.intersectionWith = qo),
            (In.invert = ma),
            (In.invertBy = ya),
            (In.invokeMap = us),
            (In.iteratee = $a),
            (In.keyBy = ds),
            (In.keys = wa),
            (In.keysIn = _a),
            (In.map = hs),
            (In.mapKeys = function (e, t) {
              var n = {};
              return (
                (t = Yr(t, 3)),
                ci(e, function (e, i, r) {
                  $n(n, t(e, i, r), e);
                }),
                n
              );
            }),
            (In.mapValues = function (e, t) {
              var n = {};
              return (
                (t = Yr(t, 3)),
                ci(e, function (e, i, r) {
                  $n(n, i, t(e, i, r));
                }),
                n
              );
            }),
            (In.matches = function (e) {
              return Ii(Yn(e, 1));
            }),
            (In.matchesProperty = function (e, t) {
              return Ai(e, Yn(t, 1));
            }),
            (In.memoize = Ss),
            (In.merge = Ea),
            (In.mergeWith = Sa),
            (In.method = Za),
            (In.methodOf = Ka),
            (In.mixin = Ya),
            (In.negate = xs),
            (In.nthArg = function (e) {
              return (
                (e = ia(e)),
                qi(function (t) {
                  return Oi(t, e);
                })
              );
            }),
            (In.omit = xa),
            (In.omitBy = function (e, t) {
              return ka(e, xs(Yr(t)));
            }),
            (In.once = function (e) {
              return ms(2, e);
            }),
            (In.orderBy = function (e, t, n, i) {
              return null == e
                ? []
                : (Ts(t) || (t = null == t ? [] : [t]),
                  Ts((n = i ? void 0 : n)) || (n = null == n ? [] : [n]),
                  Bi(e, t, n));
            }),
            (In.over = Ja),
            (In.overArgs = Ls),
            (In.overEvery = Qa),
            (In.overSome = ec),
            (In.partial = ks),
            (In.partialRight = Cs),
            (In.partition = fs),
            (In.pick = La),
            (In.pickBy = ka),
            (In.property = tc),
            (In.propertyOf = function (e) {
              return function (t) {
                return null == e ? void 0 : di(e, t);
              };
            }),
            (In.pull = Vo),
            (In.pullAll = zo),
            (In.pullAllBy = function (e, t, n) {
              return e && e.length && t && t.length ? Ni(e, t, Yr(n, 2)) : e;
            }),
            (In.pullAllWith = function (e, t, n) {
              return e && e.length && t && t.length ? Ni(e, t, void 0, n) : e;
            }),
            (In.pullAt = Fo),
            (In.range = nc),
            (In.rangeRight = ic),
            (In.rearg = Is),
            (In.reject = function (e, t) {
              return (Ts(e) ? ut : ri)(e, xs(Yr(t, 3)));
            }),
            (In.remove = function (e, t) {
              var n = [];
              if (!e || !e.length) return n;
              var i = -1,
                r = [],
                o = e.length;
              for (t = Yr(t, 3); ++i < o; ) {
                var s = e[i];
                t(s, i, e) && (n.push(s), r.push(i));
              }
              return Mi(e, r), n;
            }),
            (In.rest = function (e, t) {
              if ('function' != typeof e) throw new ye(o);
              return qi(e, (t = void 0 === t ? t : ia(t)));
            }),
            (In.reverse = Ho),
            (In.sampleSize = function (e, t, n) {
              return (
                (t = (n ? ao(e, t, n) : void 0 === t) ? 1 : ia(t)),
                (Ts(e) ? Vn : Vi)(e, t)
              );
            }),
            (In.set = function (e, t, n) {
              return null == e ? e : zi(e, t, n);
            }),
            (In.setWith = function (e, t, n, i) {
              return (
                (i = 'function' == typeof i ? i : void 0),
                null == e ? e : zi(e, t, n, i)
              );
            }),
            (In.shuffle = function (e) {
              return (Ts(e) ? zn : Ui)(e);
            }),
            (In.slice = function (e, t, n) {
              var i = null == e ? 0 : e.length;
              return i
                ? (n && 'number' != typeof n && ao(e, t, n)
                    ? ((t = 0), (n = i))
                    : ((t = null == t ? 0 : ia(t)),
                      (n = void 0 === n ? i : ia(n))),
                  Gi(e, t, n))
                : [];
            }),
            (In.sortBy = ps),
            (In.sortedUniq = function (e) {
              return e && e.length ? Ki(e) : [];
            }),
            (In.sortedUniqBy = function (e, t) {
              return e && e.length ? Ki(e, Yr(t, 2)) : [];
            }),
            (In.split = function (e, t, n) {
              return (
                n && 'number' != typeof n && ao(e, t, n) && (t = n = void 0),
                (n = void 0 === n ? 4294967295 : n >>> 0)
                  ? (e = aa(e)) &&
                    ('string' == typeof t || (null != t && !Zs(t))) &&
                    !(t = Xi(t)) &&
                    Rt(e)
                    ? lr(Wt(e), 0, n)
                    : e.split(t, n)
                  : []
              );
            }),
            (In.spread = function (e, t) {
              if ('function' != typeof e) throw new ye(o);
              return (
                (t = null == t ? 0 : sn(ia(t), 0)),
                qi(function (n) {
                  var i = n[t],
                    r = lr(n, 0, t);
                  return i && pt(r, i), ot(e, this, r);
                })
              );
            }),
            (In.tail = function (e) {
              var t = null == e ? 0 : e.length;
              return t ? Gi(e, 1, t) : [];
            }),
            (In.take = function (e, t, n) {
              return e && e.length
                ? Gi(e, 0, (t = n || void 0 === t ? 1 : ia(t)) < 0 ? 0 : t)
                : [];
            }),
            (In.takeRight = function (e, t, n) {
              var i = null == e ? 0 : e.length;
              return i
                ? Gi(
                    e,
                    (t = i - (t = n || void 0 === t ? 1 : ia(t))) < 0 ? 0 : t,
                    i
                  )
                : [];
            }),
            (In.takeRightWhile = function (e, t) {
              return e && e.length ? tr(e, Yr(t, 3), !1, !0) : [];
            }),
            (In.takeWhile = function (e, t) {
              return e && e.length ? tr(e, Yr(t, 3)) : [];
            }),
            (In.tap = function (e, t) {
              return t(e), e;
            }),
            (In.throttle = function (e, t, n) {
              var i = !0,
                r = !0;
              if ('function' != typeof e) throw new ye(o);
              return (
                Hs(n) &&
                  ((i = 'leading' in n ? !!n.leading : i),
                  (r = 'trailing' in n ? !!n.trailing : r)),
                ws(e, t, { leading: i, maxWait: t, trailing: r })
              );
            }),
            (In.thru = ns),
            (In.toArray = ta),
            (In.toPairs = Ca),
            (In.toPairsIn = Ia),
            (In.toPath = function (e) {
              return Ts(e) ? ft(e, ko) : Xs(e) ? [e] : mr(Lo(aa(e)));
            }),
            (In.toPlainObject = sa),
            (In.transform = function (e, t, n) {
              var i = Ts(e),
                r = i || Ds(e) || Js(e);
              if (((t = Yr(t, 4)), null == n)) {
                var o = e && e.constructor;
                n = r ? (i ? new o() : []) : Hs(e) && Vs(o) ? An(Ge(e)) : {};
              }
              return (
                (r ? at : ci)(e, function (e, i, r) {
                  return t(n, e, i, r);
                }),
                n
              );
            }),
            (In.unary = function (e) {
              return vs(e, 1);
            }),
            (In.union = Uo),
            (In.unionBy = Go),
            (In.unionWith = Wo),
            (In.uniq = function (e) {
              return e && e.length ? Ji(e) : [];
            }),
            (In.uniqBy = function (e, t) {
              return e && e.length ? Ji(e, Yr(t, 2)) : [];
            }),
            (In.uniqWith = function (e, t) {
              return (
                (t = 'function' == typeof t ? t : void 0),
                e && e.length ? Ji(e, void 0, t) : []
              );
            }),
            (In.unset = function (e, t) {
              return null == e || Qi(e, t);
            }),
            (In.unzip = $o),
            (In.unzipWith = Zo),
            (In.update = function (e, t, n) {
              return null == e ? e : er(e, t, sr(n));
            }),
            (In.updateWith = function (e, t, n, i) {
              return (
                (i = 'function' == typeof i ? i : void 0),
                null == e ? e : er(e, t, sr(n), i)
              );
            }),
            (In.values = Aa),
            (In.valuesIn = function (e) {
              return null == e ? [] : Ot(e, _a(e));
            }),
            (In.without = Ko),
            (In.words = Va),
            (In.wrap = function (e, t) {
              return ks(sr(t), e);
            }),
            (In.xor = Yo),
            (In.xorBy = Xo),
            (In.xorWith = Jo),
            (In.zip = Qo),
            (In.zipObject = function (e, t) {
              return rr(e || [], t || [], Hn);
            }),
            (In.zipObjectDeep = function (e, t) {
              return rr(e || [], t || [], zi);
            }),
            (In.zipWith = es),
            (In.entries = Ca),
            (In.entriesIn = Ia),
            (In.extend = la),
            (In.extendWith = ua),
            Ya(In, In),
            (In.add = sc),
            (In.attempt = za),
            (In.camelCase = Pa),
            (In.capitalize = Oa),
            (In.ceil = ac),
            (In.clamp = function (e, t, n) {
              return (
                void 0 === n && ((n = t), (t = void 0)),
                void 0 !== n && (n = (n = oa(n)) == n ? n : 0),
                void 0 !== t && (t = (t = oa(t)) == t ? t : 0),
                Kn(oa(e), t, n)
              );
            }),
            (In.clone = function (e) {
              return Yn(e, 4);
            }),
            (In.cloneDeep = function (e) {
              return Yn(e, 5);
            }),
            (In.cloneDeepWith = function (e, t) {
              return Yn(e, 5, (t = 'function' == typeof t ? t : void 0));
            }),
            (In.cloneWith = function (e, t) {
              return Yn(e, 4, (t = 'function' == typeof t ? t : void 0));
            }),
            (In.conformsTo = function (e, t) {
              return null == t || Xn(e, t, wa(t));
            }),
            (In.deburr = Ba),
            (In.defaultTo = function (e, t) {
              return null == e || e != e ? t : e;
            }),
            (In.divide = cc),
            (In.endsWith = function (e, t, n) {
              (e = aa(e)), (t = Xi(t));
              var i = e.length,
                r = (n = void 0 === n ? i : Kn(ia(n), 0, i));
              return (n -= t.length) >= 0 && e.slice(n, r) == t;
            }),
            (In.eq = As),
            (In.escape = function (e) {
              return (e = aa(e)) && R.test(e) ? e.replace(D, Dt) : e;
            }),
            (In.escapeRegExp = function (e) {
              return (e = aa(e)) && $.test(e) ? e.replace(W, '\\$&') : e;
            }),
            (In.every = function (e, t, n) {
              var i = Ts(e) ? lt : ni;
              return n && ao(e, t, n) && (t = void 0), i(e, Yr(t, 3));
            }),
            (In.find = os),
            (In.findIndex = Bo),
            (In.findKey = function (e, t) {
              return bt(e, Yr(t, 3), ci);
            }),
            (In.findLast = ss),
            (In.findLastIndex = To),
            (In.findLastKey = function (e, t) {
              return bt(e, Yr(t, 3), li);
            }),
            (In.floor = lc),
            (In.forEach = as),
            (In.forEachRight = cs),
            (In.forIn = function (e, t) {
              return null == e ? e : si(e, Yr(t, 3), _a);
            }),
            (In.forInRight = function (e, t) {
              return null == e ? e : ai(e, Yr(t, 3), _a);
            }),
            (In.forOwn = function (e, t) {
              return e && ci(e, Yr(t, 3));
            }),
            (In.forOwnRight = function (e, t) {
              return e && li(e, Yr(t, 3));
            }),
            (In.get = ga),
            (In.gt = Ps),
            (In.gte = Os),
            (In.has = function (e, t) {
              return null != e && io(e, t, gi);
            }),
            (In.hasIn = va),
            (In.head = Mo),
            (In.identity = Wa),
            (In.includes = function (e, t, n, i) {
              (e = Ms(e) ? e : Aa(e)), (n = n && !i ? ia(n) : 0);
              var r = e.length;
              return (
                n < 0 && (n = sn(r + n, 0)),
                Ys(e) ? n <= r && e.indexOf(t, n) > -1 : !!r && _t(e, t, n) > -1
              );
            }),
            (In.indexOf = function (e, t, n) {
              var i = null == e ? 0 : e.length;
              if (!i) return -1;
              var r = null == n ? 0 : ia(n);
              return r < 0 && (r = sn(i + r, 0)), _t(e, t, r);
            }),
            (In.inRange = function (e, t, n) {
              return (
                (t = na(t)),
                void 0 === n ? ((n = t), (t = 0)) : (n = na(n)),
                (function (e, t, n) {
                  return e >= an(t, n) && e < sn(t, n);
                })((e = oa(e)), t, n)
              );
            }),
            (In.invoke = ba),
            (In.isArguments = Bs),
            (In.isArray = Ts),
            (In.isArrayBuffer = Ns),
            (In.isArrayLike = Ms),
            (In.isArrayLikeObject = js),
            (In.isBoolean = function (e) {
              return !0 === e || !1 === e || (Us(e) && fi(e) == u);
            }),
            (In.isBuffer = Ds),
            (In.isDate = qs),
            (In.isElement = function (e) {
              return Us(e) && 1 === e.nodeType && !$s(e);
            }),
            (In.isEmpty = function (e) {
              if (null == e) return !0;
              if (
                Ms(e) &&
                (Ts(e) ||
                  'string' == typeof e ||
                  'function' == typeof e.splice ||
                  Ds(e) ||
                  Js(e) ||
                  Bs(e))
              )
                return !e.length;
              var t = no(e);
              if (t == g || t == b) return !e.size;
              if (ho(e)) return !xi(e).length;
              for (var n in e) if (xe.call(e, n)) return !1;
              return !0;
            }),
            (In.isEqual = function (e, t) {
              return wi(e, t);
            }),
            (In.isEqualWith = function (e, t, n) {
              var i = (n = 'function' == typeof n ? n : void 0)
                ? n(e, t)
                : void 0;
              return void 0 === i ? wi(e, t, void 0, n) : !!i;
            }),
            (In.isError = Rs),
            (In.isFinite = function (e) {
              return 'number' == typeof e && nn(e);
            }),
            (In.isFunction = Vs),
            (In.isInteger = zs),
            (In.isLength = Fs),
            (In.isMap = Gs),
            (In.isMatch = function (e, t) {
              return e === t || _i(e, t, Jr(t));
            }),
            (In.isMatchWith = function (e, t, n) {
              return (
                (n = 'function' == typeof n ? n : void 0), _i(e, t, Jr(t), n)
              );
            }),
            (In.isNaN = function (e) {
              return Ws(e) && e != +e;
            }),
            (In.isNative = function (e) {
              if (uo(e))
                throw new he(
                  'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.'
                );
              return Ei(e);
            }),
            (In.isNil = function (e) {
              return null == e;
            }),
            (In.isNull = function (e) {
              return null === e;
            }),
            (In.isNumber = Ws),
            (In.isObject = Hs),
            (In.isObjectLike = Us),
            (In.isPlainObject = $s),
            (In.isRegExp = Zs),
            (In.isSafeInteger = function (e) {
              return zs(e) && e >= -9007199254740991 && e <= 9007199254740991;
            }),
            (In.isSet = Ks),
            (In.isString = Ys),
            (In.isSymbol = Xs),
            (In.isTypedArray = Js),
            (In.isUndefined = function (e) {
              return void 0 === e;
            }),
            (In.isWeakMap = function (e) {
              return Us(e) && no(e) == E;
            }),
            (In.isWeakSet = function (e) {
              return Us(e) && '[object WeakSet]' == fi(e);
            }),
            (In.join = function (e, t) {
              return null == e ? '' : rn.call(e, t);
            }),
            (In.kebabCase = Ta),
            (In.last = Ro),
            (In.lastIndexOf = function (e, t, n) {
              var i = null == e ? 0 : e.length;
              if (!i) return -1;
              var r = i;
              return (
                void 0 !== n &&
                  (r = (r = ia(n)) < 0 ? sn(i + r, 0) : an(r, i - 1)),
                t == t
                  ? (function (e, t, n) {
                      for (var i = n + 1; i--; ) if (e[i] === t) return i;
                      return i;
                    })(e, t, r)
                  : wt(e, St, r, !0)
              );
            }),
            (In.lowerCase = Na),
            (In.lowerFirst = Ma),
            (In.lt = Qs),
            (In.lte = ea),
            (In.max = function (e) {
              return e && e.length ? ii(e, Wa, pi) : void 0;
            }),
            (In.maxBy = function (e, t) {
              return e && e.length ? ii(e, Yr(t, 2), pi) : void 0;
            }),
            (In.mean = function (e) {
              return xt(e, Wa);
            }),
            (In.meanBy = function (e, t) {
              return xt(e, Yr(t, 2));
            }),
            (In.min = function (e) {
              return e && e.length ? ii(e, Wa, ki) : void 0;
            }),
            (In.minBy = function (e, t) {
              return e && e.length ? ii(e, Yr(t, 2), ki) : void 0;
            }),
            (In.stubArray = rc),
            (In.stubFalse = oc),
            (In.stubObject = function () {
              return {};
            }),
            (In.stubString = function () {
              return '';
            }),
            (In.stubTrue = function () {
              return !0;
            }),
            (In.multiply = dc),
            (In.nth = function (e, t) {
              return e && e.length ? Oi(e, ia(t)) : void 0;
            }),
            (In.noConflict = function () {
              return $e._ === this && ($e._ = Ae), this;
            }),
            (In.noop = Xa),
            (In.now = gs),
            (In.pad = function (e, t, n) {
              e = aa(e);
              var i = (t = ia(t)) ? Gt(e) : 0;
              if (!t || i >= t) return e;
              var r = (t - i) / 2;
              return Br(Qt(r), n) + e + Br(Jt(r), n);
            }),
            (In.padEnd = function (e, t, n) {
              e = aa(e);
              var i = (t = ia(t)) ? Gt(e) : 0;
              return t && i < t ? e + Br(t - i, n) : e;
            }),
            (In.padStart = function (e, t, n) {
              e = aa(e);
              var i = (t = ia(t)) ? Gt(e) : 0;
              return t && i < t ? Br(t - i, n) + e : e;
            }),
            (In.parseInt = function (e, t, n) {
              return (
                n || null == t ? (t = 0) : t && (t = +t),
                ln(aa(e).replace(K, ''), t || 0)
              );
            }),
            (In.random = function (e, t, n) {
              if (
                (n && 'boolean' != typeof n && ao(e, t, n) && (t = n = void 0),
                void 0 === n &&
                  ('boolean' == typeof t
                    ? ((n = t), (t = void 0))
                    : 'boolean' == typeof e && ((n = e), (e = void 0))),
                void 0 === e && void 0 === t
                  ? ((e = 0), (t = 1))
                  : ((e = na(e)),
                    void 0 === t ? ((t = e), (e = 0)) : (t = na(t))),
                e > t)
              ) {
                var i = e;
                (e = t), (t = i);
              }
              if (n || e % 1 || t % 1) {
                var r = un();
                return an(
                  e + r * (t - e + He('1e-' + ((r + '').length - 1))),
                  t
                );
              }
              return ji(e, t);
            }),
            (In.reduce = function (e, t, n) {
              var i = Ts(e) ? gt : Ct,
                r = arguments.length < 3;
              return i(e, Yr(t, 4), n, r, ei);
            }),
            (In.reduceRight = function (e, t, n) {
              var i = Ts(e) ? vt : Ct,
                r = arguments.length < 3;
              return i(e, Yr(t, 4), n, r, ti);
            }),
            (In.repeat = function (e, t, n) {
              return (
                (t = (n ? ao(e, t, n) : void 0 === t) ? 1 : ia(t)), Di(aa(e), t)
              );
            }),
            (In.replace = function () {
              var e = arguments,
                t = aa(e[0]);
              return e.length < 3 ? t : t.replace(e[1], e[2]);
            }),
            (In.result = function (e, t, n) {
              var i = -1,
                r = (t = ar(t, e)).length;
              for (r || ((r = 1), (e = void 0)); ++i < r; ) {
                var o = null == e ? void 0 : e[ko(t[i])];
                void 0 === o && ((i = r), (o = n)), (e = Vs(o) ? o.call(e) : o);
              }
              return e;
            }),
            (In.round = hc),
            (In.runInContext = e),
            (In.sample = function (e) {
              return (Ts(e) ? Rn : Ri)(e);
            }),
            (In.size = function (e) {
              if (null == e) return 0;
              if (Ms(e)) return Ys(e) ? Gt(e) : e.length;
              var t = no(e);
              return t == g || t == b ? e.size : xi(e).length;
            }),
            (In.snakeCase = ja),
            (In.some = function (e, t, n) {
              var i = Ts(e) ? mt : Wi;
              return n && ao(e, t, n) && (t = void 0), i(e, Yr(t, 3));
            }),
            (In.sortedIndex = function (e, t) {
              return $i(e, t);
            }),
            (In.sortedIndexBy = function (e, t, n) {
              return Zi(e, t, Yr(n, 2));
            }),
            (In.sortedIndexOf = function (e, t) {
              var n = null == e ? 0 : e.length;
              if (n) {
                var i = $i(e, t);
                if (i < n && As(e[i], t)) return i;
              }
              return -1;
            }),
            (In.sortedLastIndex = function (e, t) {
              return $i(e, t, !0);
            }),
            (In.sortedLastIndexBy = function (e, t, n) {
              return Zi(e, t, Yr(n, 2), !0);
            }),
            (In.sortedLastIndexOf = function (e, t) {
              if (null == e ? 0 : e.length) {
                var n = $i(e, t, !0) - 1;
                if (As(e[n], t)) return n;
              }
              return -1;
            }),
            (In.startCase = Da),
            (In.startsWith = function (e, t, n) {
              return (
                (e = aa(e)),
                (n = null == n ? 0 : Kn(ia(n), 0, e.length)),
                (t = Xi(t)),
                e.slice(n, n + t.length) == t
              );
            }),
            (In.subtract = fc),
            (In.sum = function (e) {
              return e && e.length ? It(e, Wa) : 0;
            }),
            (In.sumBy = function (e, t) {
              return e && e.length ? It(e, Yr(t, 2)) : 0;
            }),
            (In.template = function (e, t, n) {
              var i = In.templateSettings;
              n && ao(e, t, n) && (t = void 0),
                (e = aa(e)),
                (t = ua({}, t, i, Vr));
              var r,
                o,
                s = ua({}, t.imports, i.imports, Vr),
                a = wa(s),
                c = Ot(s, a),
                l = 0,
                u = t.interpolate || ue,
                d = "__p += '",
                h = ve(
                  (t.escape || ue).source +
                    '|' +
                    u.source +
                    '|' +
                    (u === F ? ne : ue).source +
                    '|' +
                    (t.evaluate || ue).source +
                    '|$',
                  'g'
                ),
                f =
                  '//# sourceURL=' +
                  (xe.call(t, 'sourceURL')
                    ? (t.sourceURL + '').replace(/\s/g, ' ')
                    : 'lodash.templateSources[' + ++Re + ']') +
                  '\n';
              e.replace(h, function (t, n, i, s, a, c) {
                return (
                  i || (i = s),
                  (d += e.slice(l, c).replace(de, qt)),
                  n && ((r = !0), (d += "' +\n__e(" + n + ") +\n'")),
                  a && ((o = !0), (d += "';\n" + a + ";\n__p += '")),
                  i &&
                    (d += "' +\n((__t = (" + i + ")) == null ? '' : __t) +\n'"),
                  (l = c + t.length),
                  t
                );
              }),
                (d += "';\n");
              var p = xe.call(t, 'variable') && t.variable;
              p || (d = 'with (obj) {\n' + d + '\n}\n'),
                (d = (o ? d.replace(T, '') : d)
                  .replace(N, '$1')
                  .replace(M, '$1;')),
                (d =
                  'function(' +
                  (p || 'obj') +
                  ') {\n' +
                  (p ? '' : 'obj || (obj = {});\n') +
                  "var __t, __p = ''" +
                  (r ? ', __e = _.escape' : '') +
                  (o
                    ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n"
                    : ';\n') +
                  d +
                  'return __p\n}');
              var g = za(function () {
                return fe(a, f + 'return ' + d).apply(void 0, c);
              });
              if (((g.source = d), Rs(g))) throw g;
              return g;
            }),
            (In.times = function (e, t) {
              if ((e = ia(e)) < 1 || e > 9007199254740991) return [];
              var n = 4294967295,
                i = an(e, 4294967295);
              e -= 4294967295;
              for (var r = At(i, (t = Yr(t))); ++n < e; ) t(n);
              return r;
            }),
            (In.toFinite = na),
            (In.toInteger = ia),
            (In.toLength = ra),
            (In.toLower = function (e) {
              return aa(e).toLowerCase();
            }),
            (In.toNumber = oa),
            (In.toSafeInteger = function (e) {
              return e
                ? Kn(ia(e), -9007199254740991, 9007199254740991)
                : 0 === e
                ? e
                : 0;
            }),
            (In.toString = aa),
            (In.toUpper = function (e) {
              return aa(e).toUpperCase();
            }),
            (In.trim = function (e, t, n) {
              if ((e = aa(e)) && (n || void 0 === t)) return e.replace(Z, '');
              if (!e || !(t = Xi(t))) return e;
              var i = Wt(e),
                r = Wt(t);
              return lr(i, Tt(i, r), Nt(i, r) + 1).join('');
            }),
            (In.trimEnd = function (e, t, n) {
              if ((e = aa(e)) && (n || void 0 === t)) return e.replace(Y, '');
              if (!e || !(t = Xi(t))) return e;
              var i = Wt(e);
              return lr(i, 0, Nt(i, Wt(t)) + 1).join('');
            }),
            (In.trimStart = function (e, t, n) {
              if ((e = aa(e)) && (n || void 0 === t)) return e.replace(K, '');
              if (!e || !(t = Xi(t))) return e;
              var i = Wt(e);
              return lr(i, Tt(i, Wt(t))).join('');
            }),
            (In.truncate = function (e, t) {
              var n = 30,
                i = '...';
              if (Hs(t)) {
                var r = 'separator' in t ? t.separator : r;
                (n = 'length' in t ? ia(t.length) : n),
                  (i = 'omission' in t ? Xi(t.omission) : i);
              }
              var o = (e = aa(e)).length;
              if (Rt(e)) {
                var s = Wt(e);
                o = s.length;
              }
              if (n >= o) return e;
              var a = n - Gt(i);
              if (a < 1) return i;
              var c = s ? lr(s, 0, a).join('') : e.slice(0, a);
              if (void 0 === r) return c + i;
              if ((s && (a += c.length - a), Zs(r))) {
                if (e.slice(a).search(r)) {
                  var l,
                    u = c;
                  for (
                    r.global || (r = ve(r.source, aa(ie.exec(r)) + 'g')),
                      r.lastIndex = 0;
                    (l = r.exec(u));

                  )
                    var d = l.index;
                  c = c.slice(0, void 0 === d ? a : d);
                }
              } else if (e.indexOf(Xi(r), a) != a) {
                var h = c.lastIndexOf(r);
                h > -1 && (c = c.slice(0, h));
              }
              return c + i;
            }),
            (In.unescape = function (e) {
              return (e = aa(e)) && q.test(e) ? e.replace(j, $t) : e;
            }),
            (In.uniqueId = function (e) {
              var t = ++Le;
              return aa(e) + t;
            }),
            (In.upperCase = qa),
            (In.upperFirst = Ra),
            (In.each = as),
            (In.eachRight = cs),
            (In.first = Mo),
            Ya(
              In,
              ((uc = {}),
              ci(In, function (e, t) {
                xe.call(In.prototype, t) || (uc[t] = e);
              }),
              uc),
              { chain: !1 }
            ),
            (In.VERSION = '4.17.20'),
            at(
              [
                'bind',
                'bindKey',
                'curry',
                'curryRight',
                'partial',
                'partialRight',
              ],
              function (e) {
                In[e].placeholder = In;
              }
            ),
            at(['drop', 'take'], function (e, t) {
              (Bn.prototype[e] = function (n) {
                n = void 0 === n ? 1 : sn(ia(n), 0);
                var i = this.__filtered__ && !t ? new Bn(this) : this.clone();
                return (
                  i.__filtered__
                    ? (i.__takeCount__ = an(n, i.__takeCount__))
                    : i.__views__.push({
                        size: an(n, 4294967295),
                        type: e + (i.__dir__ < 0 ? 'Right' : ''),
                      }),
                  i
                );
              }),
                (Bn.prototype[e + 'Right'] = function (t) {
                  return this.reverse()[e](t).reverse();
                });
            }),
            at(['filter', 'map', 'takeWhile'], function (e, t) {
              var n = t + 1,
                i = 1 == n || 3 == n;
              Bn.prototype[e] = function (e) {
                var t = this.clone();
                return (
                  t.__iteratees__.push({ iteratee: Yr(e, 3), type: n }),
                  (t.__filtered__ = t.__filtered__ || i),
                  t
                );
              };
            }),
            at(['head', 'last'], function (e, t) {
              var n = 'take' + (t ? 'Right' : '');
              Bn.prototype[e] = function () {
                return this[n](1).value()[0];
              };
            }),
            at(['initial', 'tail'], function (e, t) {
              var n = 'drop' + (t ? '' : 'Right');
              Bn.prototype[e] = function () {
                return this.__filtered__ ? new Bn(this) : this[n](1);
              };
            }),
            (Bn.prototype.compact = function () {
              return this.filter(Wa);
            }),
            (Bn.prototype.find = function (e) {
              return this.filter(e).head();
            }),
            (Bn.prototype.findLast = function (e) {
              return this.reverse().find(e);
            }),
            (Bn.prototype.invokeMap = qi(function (e, t) {
              return 'function' == typeof e
                ? new Bn(this)
                : this.map(function (n) {
                    return yi(n, e, t);
                  });
            })),
            (Bn.prototype.reject = function (e) {
              return this.filter(xs(Yr(e)));
            }),
            (Bn.prototype.slice = function (e, t) {
              e = ia(e);
              var n = this;
              return n.__filtered__ && (e > 0 || t < 0)
                ? new Bn(n)
                : (e < 0 ? (n = n.takeRight(-e)) : e && (n = n.drop(e)),
                  void 0 !== t &&
                    (n = (t = ia(t)) < 0 ? n.dropRight(-t) : n.take(t - e)),
                  n);
            }),
            (Bn.prototype.takeRightWhile = function (e) {
              return this.reverse().takeWhile(e).reverse();
            }),
            (Bn.prototype.toArray = function () {
              return this.take(4294967295);
            }),
            ci(Bn.prototype, function (e, t) {
              var n = /^(?:filter|find|map|reject)|While$/.test(t),
                i = /^(?:head|last)$/.test(t),
                r = In[i ? 'take' + ('last' == t ? 'Right' : '') : t],
                o = i || /^find/.test(t);
              r &&
                (In.prototype[t] = function () {
                  var t = this.__wrapped__,
                    s = i ? [1] : arguments,
                    a = t instanceof Bn,
                    c = s[0],
                    l = a || Ts(t),
                    u = function (e) {
                      var t = r.apply(In, pt([e], s));
                      return i && d ? t[0] : t;
                    };
                  l &&
                    n &&
                    'function' == typeof c &&
                    1 != c.length &&
                    (a = l = !1);
                  var d = this.__chain__,
                    h = !!this.__actions__.length,
                    f = o && !d,
                    p = a && !h;
                  if (!o && l) {
                    t = p ? t : new Bn(this);
                    var g = e.apply(t, s);
                    return (
                      g.__actions__.push({
                        func: ns,
                        args: [u],
                        thisArg: void 0,
                      }),
                      new On(g, d)
                    );
                  }
                  return f && p
                    ? e.apply(this, s)
                    : ((g = this.thru(u)),
                      f ? (i ? g.value()[0] : g.value()) : g);
                });
            }),
            at(
              ['pop', 'push', 'shift', 'sort', 'splice', 'unshift'],
              function (e) {
                var t = be[e],
                  n = /^(?:push|sort|unshift)$/.test(e) ? 'tap' : 'thru',
                  i = /^(?:pop|shift)$/.test(e);
                In.prototype[e] = function () {
                  var e = arguments;
                  if (i && !this.__chain__) {
                    var r = this.value();
                    return t.apply(Ts(r) ? r : [], e);
                  }
                  return this[n](function (n) {
                    return t.apply(Ts(n) ? n : [], e);
                  });
                };
              }
            ),
            ci(Bn.prototype, function (e, t) {
              var n = In[t];
              if (n) {
                var i = n.name + '';
                xe.call(bn, i) || (bn[i] = []),
                  bn[i].push({ name: t, func: n });
              }
            }),
            (bn[Ir(void 0, 2).name] = [{ name: 'wrapper', func: void 0 }]),
            (Bn.prototype.clone = function () {
              var e = new Bn(this.__wrapped__);
              return (
                (e.__actions__ = mr(this.__actions__)),
                (e.__dir__ = this.__dir__),
                (e.__filtered__ = this.__filtered__),
                (e.__iteratees__ = mr(this.__iteratees__)),
                (e.__takeCount__ = this.__takeCount__),
                (e.__views__ = mr(this.__views__)),
                e
              );
            }),
            (Bn.prototype.reverse = function () {
              if (this.__filtered__) {
                var e = new Bn(this);
                (e.__dir__ = -1), (e.__filtered__ = !0);
              } else (e = this.clone()).__dir__ *= -1;
              return e;
            }),
            (Bn.prototype.value = function () {
              var e = this.__wrapped__.value(),
                t = this.__dir__,
                n = Ts(e),
                i = t < 0,
                r = n ? e.length : 0,
                o = (function (e, t, n) {
                  var i = -1,
                    r = n.length;
                  for (; ++i < r; ) {
                    var o = n[i],
                      s = o.size;
                    switch (o.type) {
                      case 'drop':
                        e += s;
                        break;
                      case 'dropRight':
                        t -= s;
                        break;
                      case 'take':
                        t = an(t, e + s);
                        break;
                      case 'takeRight':
                        e = sn(e, t - s);
                    }
                  }
                  return { start: e, end: t };
                })(0, r, this.__views__),
                s = o.start,
                a = o.end,
                c = a - s,
                l = i ? a : s - 1,
                u = this.__iteratees__,
                d = u.length,
                h = 0,
                f = an(c, this.__takeCount__);
              if (!n || (!i && r == c && f == c))
                return nr(e, this.__actions__);
              var p = [];
              e: for (; c-- && h < f; ) {
                for (var g = -1, v = e[(l += t)]; ++g < d; ) {
                  var m = u[g],
                    y = m.iteratee,
                    b = m.type,
                    w = y(v);
                  if (2 == b) v = w;
                  else if (!w) {
                    if (1 == b) continue e;
                    break e;
                  }
                }
                p[h++] = v;
              }
              return p;
            }),
            (In.prototype.at = is),
            (In.prototype.chain = function () {
              return ts(this);
            }),
            (In.prototype.commit = function () {
              return new On(this.value(), this.__chain__);
            }),
            (In.prototype.next = function () {
              void 0 === this.__values__ &&
                (this.__values__ = ta(this.value()));
              var e = this.__index__ >= this.__values__.length;
              return {
                done: e,
                value: e ? void 0 : this.__values__[this.__index__++],
              };
            }),
            (In.prototype.plant = function (e) {
              for (var t, n = this; n instanceof Pn; ) {
                var i = Io(n);
                (i.__index__ = 0),
                  (i.__values__ = void 0),
                  t ? (r.__wrapped__ = i) : (t = i);
                var r = i;
                n = n.__wrapped__;
              }
              return (r.__wrapped__ = e), t;
            }),
            (In.prototype.reverse = function () {
              var e = this.__wrapped__;
              if (e instanceof Bn) {
                var t = e;
                return (
                  this.__actions__.length && (t = new Bn(this)),
                  (t = t.reverse()).__actions__.push({
                    func: ns,
                    args: [Ho],
                    thisArg: void 0,
                  }),
                  new On(t, this.__chain__)
                );
              }
              return this.thru(Ho);
            }),
            (In.prototype.toJSON =
              In.prototype.valueOf =
              In.prototype.value =
                function () {
                  return nr(this.__wrapped__, this.__actions__);
                }),
            (In.prototype.first = In.prototype.head),
            Je &&
              (In.prototype[Je] = function () {
                return this;
              }),
            In
          );
        })();
        ($e._ = Zt),
          void 0 ===
            (r = function () {
              return Zt;
            }.call(t, n, t, i)) || (i.exports = r);
      }.call(this));
    }.call(this, n(4), n(49)(e)));
  },
  ,
  function (e, t) {},
  function (e, t, n) {
    'use strict';
    (function (e) {
      (t.test = function () {
        return 'function' == typeof e.queueMicrotask;
      }),
        (t.install = function (t) {
          return function () {
            e.queueMicrotask(t);
          };
        });
    }.call(this, n(4)));
  },
  function (e, t, n) {
    'use strict';
    (function (e) {
      var n = e.MutationObserver || e.WebKitMutationObserver;
      (t.test = function () {
        return n;
      }),
        (t.install = function (t) {
          var i = 0,
            r = new n(t),
            o = e.document.createTextNode('');
          return (
            r.observe(o, { characterData: !0 }),
            function () {
              o.data = i = ++i % 2;
            }
          );
        });
    }.call(this, n(4)));
  },
  function (e, t, n) {
    'use strict';
    (function (e) {
      (t.test = function () {
        return !e.setImmediate && void 0 !== e.MessageChannel;
      }),
        (t.install = function (t) {
          var n = new e.MessageChannel();
          return (
            (n.port1.onmessage = t),
            function () {
              n.port2.postMessage(0);
            }
          );
        });
    }.call(this, n(4)));
  },
  function (e, t, n) {
    'use strict';
    (function (e) {
      (t.test = function () {
        return (
          'document' in e &&
          'onreadystatechange' in e.document.createElement('script')
        );
      }),
        (t.install = function (t) {
          return function () {
            var n = e.document.createElement('script');
            return (
              (n.onreadystatechange = function () {
                t(),
                  (n.onreadystatechange = null),
                  n.parentNode.removeChild(n),
                  (n = null);
              }),
              e.document.documentElement.appendChild(n),
              t
            );
          };
        });
    }.call(this, n(4)));
  },
  function (e, t, n) {
    'use strict';
    (t.test = function () {
      return !0;
    }),
      (t.install = function (e) {
        return function () {
          setTimeout(e, 0);
        };
      });
  },
  ,
  ,
  function (e, t, n) {
    'use strict';
    function i(e) {
      if (16 !== e.length) return '';
      function t(e, t) {
        return e + t.toString(16).padStart(2, '0');
      }
      return (
        e.slice(0, 4).reduce(t, '') +
        '-' +
        e.slice(4, 6).reduce(t, '') +
        '-' +
        e.slice(6, 8).reduce(t, '') +
        '-' +
        e.slice(8, 10).reduce(t, '') +
        '-' +
        e.slice(10).reduce(t, '')
      );
    }
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.uuidv4 = void 0),
      (t.uuidv4 = function () {
        if (void 0 === window.crypto) return i(new Uint8Array(16));
        const e = new Uint8Array(16),
          t = Uint8Array.from([
            parseInt('01000000', 2),
            parseInt('10000000', 2),
            parseInt('00001111', 2),
            parseInt('00111111', 2),
          ]);
        return (
          window.crypto.getRandomValues(e),
          (e[6] = (e[6] & t[2]) | t[0]),
          (e[8] = (e[8] & t[3]) | t[1]),
          i(e)
        );
      });
  },
  function (e, t, n) {
    'use strict';
    var i = n(74),
      r = n(75);
    function o() {
      (this.protocol = null),
        (this.slashes = null),
        (this.auth = null),
        (this.host = null),
        (this.port = null),
        (this.hostname = null),
        (this.hash = null),
        (this.search = null),
        (this.query = null),
        (this.pathname = null),
        (this.path = null),
        (this.href = null);
    }
    (t.parse = b),
      (t.resolve = function (e, t) {
        return b(e, !1, !0).resolve(t);
      }),
      (t.resolveObject = function (e, t) {
        return e ? b(e, !1, !0).resolveObject(t) : t;
      }),
      (t.format = function (e) {
        r.isString(e) && (e = b(e));
        return e instanceof o ? e.format() : o.prototype.format.call(e);
      }),
      (t.Url = o);
    var s = /^([a-z0-9.+-]+:)/i,
      a = /:[0-9]*$/,
      c = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
      l = ['{', '}', '|', '\\', '^', '`'].concat([
        '<',
        '>',
        '"',
        '`',
        ' ',
        '\r',
        '\n',
        '\t',
      ]),
      u = ["'"].concat(l),
      d = ['%', '/', '?', ';', '#'].concat(u),
      h = ['/', '?', '#'],
      f = /^[+a-z0-9A-Z_-]{0,63}$/,
      p = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
      g = { javascript: !0, 'javascript:': !0 },
      v = { javascript: !0, 'javascript:': !0 },
      m = {
        http: !0,
        https: !0,
        ftp: !0,
        gopher: !0,
        file: !0,
        'http:': !0,
        'https:': !0,
        'ftp:': !0,
        'gopher:': !0,
        'file:': !0,
      },
      y = n(76);
    function b(e, t, n) {
      if (e && r.isObject(e) && e instanceof o) return e;
      var i = new o();
      return i.parse(e, t, n), i;
    }
    (o.prototype.parse = function (e, t, n) {
      if (!r.isString(e))
        throw new TypeError(
          "Parameter 'url' must be a string, not " + typeof e
        );
      var o = e.indexOf('?'),
        a = -1 !== o && o < e.indexOf('#') ? '?' : '#',
        l = e.split(a);
      l[0] = l[0].replace(/\\/g, '/');
      var b = (e = l.join(a));
      if (((b = b.trim()), !n && 1 === e.split('#').length)) {
        var w = c.exec(b);
        if (w)
          return (
            (this.path = b),
            (this.href = b),
            (this.pathname = w[1]),
            w[2]
              ? ((this.search = w[2]),
                (this.query = t
                  ? y.parse(this.search.substr(1))
                  : this.search.substr(1)))
              : t && ((this.search = ''), (this.query = {})),
            this
          );
      }
      var _ = s.exec(b);
      if (_) {
        var E = (_ = _[0]).toLowerCase();
        (this.protocol = E), (b = b.substr(_.length));
      }
      if (n || _ || b.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var S = '//' === b.substr(0, 2);
        !S || (_ && v[_]) || ((b = b.substr(2)), (this.slashes = !0));
      }
      if (!v[_] && (S || (_ && !m[_]))) {
        for (var x, L, k = -1, C = 0; C < h.length; C++) {
          -1 !== (I = b.indexOf(h[C])) && (-1 === k || I < k) && (k = I);
        }
        -1 !== (L = -1 === k ? b.lastIndexOf('@') : b.lastIndexOf('@', k)) &&
          ((x = b.slice(0, L)),
          (b = b.slice(L + 1)),
          (this.auth = decodeURIComponent(x))),
          (k = -1);
        for (C = 0; C < d.length; C++) {
          var I;
          -1 !== (I = b.indexOf(d[C])) && (-1 === k || I < k) && (k = I);
        }
        -1 === k && (k = b.length),
          (this.host = b.slice(0, k)),
          (b = b.slice(k)),
          this.parseHost(),
          (this.hostname = this.hostname || '');
        var A =
          '[' === this.hostname[0] &&
          ']' === this.hostname[this.hostname.length - 1];
        if (!A)
          for (
            var P = this.hostname.split(/\./), O = ((C = 0), P.length);
            C < O;
            C++
          ) {
            var B = P[C];
            if (B && !B.match(f)) {
              for (var T = '', N = 0, M = B.length; N < M; N++)
                B.charCodeAt(N) > 127 ? (T += 'x') : (T += B[N]);
              if (!T.match(f)) {
                var j = P.slice(0, C),
                  D = P.slice(C + 1),
                  q = B.match(p);
                q && (j.push(q[1]), D.unshift(q[2])),
                  D.length && (b = '/' + D.join('.') + b),
                  (this.hostname = j.join('.'));
                break;
              }
            }
          }
        this.hostname.length > 255
          ? (this.hostname = '')
          : (this.hostname = this.hostname.toLowerCase()),
          A || (this.hostname = i.toASCII(this.hostname));
        var R = this.port ? ':' + this.port : '',
          V = this.hostname || '';
        (this.host = V + R),
          (this.href += this.host),
          A &&
            ((this.hostname = this.hostname.substr(
              1,
              this.hostname.length - 2
            )),
            '/' !== b[0] && (b = '/' + b));
      }
      if (!g[E])
        for (C = 0, O = u.length; C < O; C++) {
          var z = u[C];
          if (-1 !== b.indexOf(z)) {
            var F = encodeURIComponent(z);
            F === z && (F = escape(z)), (b = b.split(z).join(F));
          }
        }
      var H = b.indexOf('#');
      -1 !== H && ((this.hash = b.substr(H)), (b = b.slice(0, H)));
      var U = b.indexOf('?');
      if (
        (-1 !== U
          ? ((this.search = b.substr(U)),
            (this.query = b.substr(U + 1)),
            t && (this.query = y.parse(this.query)),
            (b = b.slice(0, U)))
          : t && ((this.search = ''), (this.query = {})),
        b && (this.pathname = b),
        m[E] && this.hostname && !this.pathname && (this.pathname = '/'),
        this.pathname || this.search)
      ) {
        R = this.pathname || '';
        var G = this.search || '';
        this.path = R + G;
      }
      return (this.href = this.format()), this;
    }),
      (o.prototype.format = function () {
        var e = this.auth || '';
        e &&
          ((e = (e = encodeURIComponent(e)).replace(/%3A/i, ':')), (e += '@'));
        var t = this.protocol || '',
          n = this.pathname || '',
          i = this.hash || '',
          o = !1,
          s = '';
        this.host
          ? (o = e + this.host)
          : this.hostname &&
            ((o =
              e +
              (-1 === this.hostname.indexOf(':')
                ? this.hostname
                : '[' + this.hostname + ']')),
            this.port && (o += ':' + this.port)),
          this.query &&
            r.isObject(this.query) &&
            Object.keys(this.query).length &&
            (s = y.stringify(this.query));
        var a = this.search || (s && '?' + s) || '';
        return (
          t && ':' !== t.substr(-1) && (t += ':'),
          this.slashes || ((!t || m[t]) && !1 !== o)
            ? ((o = '//' + (o || '')),
              n && '/' !== n.charAt(0) && (n = '/' + n))
            : o || (o = ''),
          i && '#' !== i.charAt(0) && (i = '#' + i),
          a && '?' !== a.charAt(0) && (a = '?' + a),
          t +
            o +
            (n = n.replace(/[?#]/g, function (e) {
              return encodeURIComponent(e);
            })) +
            (a = a.replace('#', '%23')) +
            i
        );
      }),
      (o.prototype.resolve = function (e) {
        return this.resolveObject(b(e, !1, !0)).format();
      }),
      (o.prototype.resolveObject = function (e) {
        if (r.isString(e)) {
          var t = new o();
          t.parse(e, !1, !0), (e = t);
        }
        for (var n = new o(), i = Object.keys(this), s = 0; s < i.length; s++) {
          var a = i[s];
          n[a] = this[a];
        }
        if (((n.hash = e.hash), '' === e.href)) return (n.href = n.format()), n;
        if (e.slashes && !e.protocol) {
          for (var c = Object.keys(e), l = 0; l < c.length; l++) {
            var u = c[l];
            'protocol' !== u && (n[u] = e[u]);
          }
          return (
            m[n.protocol] &&
              n.hostname &&
              !n.pathname &&
              (n.path = n.pathname = '/'),
            (n.href = n.format()),
            n
          );
        }
        if (e.protocol && e.protocol !== n.protocol) {
          if (!m[e.protocol]) {
            for (var d = Object.keys(e), h = 0; h < d.length; h++) {
              var f = d[h];
              n[f] = e[f];
            }
            return (n.href = n.format()), n;
          }
          if (((n.protocol = e.protocol), e.host || v[e.protocol]))
            n.pathname = e.pathname;
          else {
            for (
              var p = (e.pathname || '').split('/');
              p.length && !(e.host = p.shift());

            );
            e.host || (e.host = ''),
              e.hostname || (e.hostname = ''),
              '' !== p[0] && p.unshift(''),
              p.length < 2 && p.unshift(''),
              (n.pathname = p.join('/'));
          }
          if (
            ((n.search = e.search),
            (n.query = e.query),
            (n.host = e.host || ''),
            (n.auth = e.auth),
            (n.hostname = e.hostname || e.host),
            (n.port = e.port),
            n.pathname || n.search)
          ) {
            var g = n.pathname || '',
              y = n.search || '';
            n.path = g + y;
          }
          return (n.slashes = n.slashes || e.slashes), (n.href = n.format()), n;
        }
        var b = n.pathname && '/' === n.pathname.charAt(0),
          w = e.host || (e.pathname && '/' === e.pathname.charAt(0)),
          _ = w || b || (n.host && e.pathname),
          E = _,
          S = (n.pathname && n.pathname.split('/')) || [],
          x =
            ((p = (e.pathname && e.pathname.split('/')) || []),
            n.protocol && !m[n.protocol]);
        if (
          (x &&
            ((n.hostname = ''),
            (n.port = null),
            n.host && ('' === S[0] ? (S[0] = n.host) : S.unshift(n.host)),
            (n.host = ''),
            e.protocol &&
              ((e.hostname = null),
              (e.port = null),
              e.host && ('' === p[0] ? (p[0] = e.host) : p.unshift(e.host)),
              (e.host = null)),
            (_ = _ && ('' === p[0] || '' === S[0]))),
          w)
        )
          (n.host = e.host || '' === e.host ? e.host : n.host),
            (n.hostname =
              e.hostname || '' === e.hostname ? e.hostname : n.hostname),
            (n.search = e.search),
            (n.query = e.query),
            (S = p);
        else if (p.length)
          S || (S = []),
            S.pop(),
            (S = S.concat(p)),
            (n.search = e.search),
            (n.query = e.query);
        else if (!r.isNullOrUndefined(e.search)) {
          if (x)
            (n.hostname = n.host = S.shift()),
              (A =
                !!(n.host && n.host.indexOf('@') > 0) && n.host.split('@')) &&
                ((n.auth = A.shift()), (n.host = n.hostname = A.shift()));
          return (
            (n.search = e.search),
            (n.query = e.query),
            (r.isNull(n.pathname) && r.isNull(n.search)) ||
              (n.path =
                (n.pathname ? n.pathname : '') + (n.search ? n.search : '')),
            (n.href = n.format()),
            n
          );
        }
        if (!S.length)
          return (
            (n.pathname = null),
            n.search ? (n.path = '/' + n.search) : (n.path = null),
            (n.href = n.format()),
            n
          );
        for (
          var L = S.slice(-1)[0],
            k =
              ((n.host || e.host || S.length > 1) &&
                ('.' === L || '..' === L)) ||
              '' === L,
            C = 0,
            I = S.length;
          I >= 0;
          I--
        )
          '.' === (L = S[I])
            ? S.splice(I, 1)
            : '..' === L
            ? (S.splice(I, 1), C++)
            : C && (S.splice(I, 1), C--);
        if (!_ && !E) for (; C--; C) S.unshift('..');
        !_ || '' === S[0] || (S[0] && '/' === S[0].charAt(0)) || S.unshift(''),
          k && '/' !== S.join('/').substr(-1) && S.push('');
        var A,
          P = '' === S[0] || (S[0] && '/' === S[0].charAt(0));
        x &&
          ((n.hostname = n.host = P ? '' : S.length ? S.shift() : ''),
          (A = !!(n.host && n.host.indexOf('@') > 0) && n.host.split('@')) &&
            ((n.auth = A.shift()), (n.host = n.hostname = A.shift())));
        return (
          (_ = _ || (n.host && S.length)) && !P && S.unshift(''),
          S.length
            ? (n.pathname = S.join('/'))
            : ((n.pathname = null), (n.path = null)),
          (r.isNull(n.pathname) && r.isNull(n.search)) ||
            (n.path =
              (n.pathname ? n.pathname : '') + (n.search ? n.search : '')),
          (n.auth = e.auth || n.auth),
          (n.slashes = n.slashes || e.slashes),
          (n.href = n.format()),
          n
        );
      }),
      (o.prototype.parseHost = function () {
        var e = this.host,
          t = a.exec(e);
        t &&
          (':' !== (t = t[0]) && (this.port = t.substr(1)),
          (e = e.substr(0, e.length - t.length))),
          e && (this.hostname = e);
      });
  },
  function (e, t, n) {
    var i = n(32),
      r = n(12);
    function o(e, t) {
      (this.id = e), (this.ref = t);
    }
    (e.exports.SchemaScanResult = o),
      (e.exports.scan = function (e, t) {
        function n(e, t) {
          if (t && 'object' == typeof t)
            if (t.$ref) {
              var o = i.resolve(e, t.$ref);
              l[o] = l[o] ? l[o] + 1 : 0;
            } else {
              var u = t.id ? i.resolve(e, t.id) : e;
              if (u) {
                if ((u.indexOf('#') < 0 && (u += '#'), c[u])) {
                  if (!r.deepCompareStrict(c[u], t))
                    throw new Error(
                      'Schema <' +
                        t +
                        '> already exists with different definition'
                    );
                  return c[u];
                }
                (c[u] = t),
                  '#' == u[u.length - 1] &&
                    (c[u.substring(0, u.length - 1)] = t);
              }
              s(u + '/items', Array.isArray(t.items) ? t.items : [t.items]),
                s(
                  u + '/extends',
                  Array.isArray(t.extends) ? t.extends : [t.extends]
                ),
                n(u + '/additionalItems', t.additionalItems),
                a(u + '/properties', t.properties),
                n(u + '/additionalProperties', t.additionalProperties),
                a(u + '/definitions', t.definitions),
                a(u + '/patternProperties', t.patternProperties),
                a(u + '/dependencies', t.dependencies),
                s(u + '/disallow', t.disallow),
                s(u + '/allOf', t.allOf),
                s(u + '/anyOf', t.anyOf),
                s(u + '/oneOf', t.oneOf),
                n(u + '/not', t.not);
            }
        }
        function s(e, t) {
          if (Array.isArray(t))
            for (var i = 0; i < t.length; i++) n(e + '/' + i, t[i]);
        }
        function a(e, t) {
          if (t && 'object' == typeof t) for (var i in t) n(e + '/' + i, t[i]);
        }
        var c = {},
          l = {};
        return n(e, t), new o(c, l);
      });
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.dragSelect =
        t.clickSelect =
        t.setSelectHelperObjects =
        t.setSelectStrokeWidth =
          void 0);
    const i = n(5),
      r = n(48),
      o = n(8),
      s = n(20);
    let a,
      c,
      l,
      u,
      d = 7;
    function h(e) {
      'Escape' === e.key &&
        (document.getElementsByClassName('selected').length > 0 &&
          l.infoListeners(),
        i.unselect());
    }
    function f(e) {
      if (
        'selByBBox' !== i.getSelectionType() ||
        !document.getElementById('displayText').checked ||
        'Enter' !== e.key
      )
        return;
      const t = document.querySelector('.syllable-highlighted');
      if (t) {
        document.querySelector('span.' + t.id).click();
      }
    }
    function p(e) {
      if (
        'selByBBox' !== i.getSelectionType() ||
        ('ArrowLeft' !== e.key && 'ArrowRight' !== e.key)
      )
        return;
      const t = document.querySelector('.syllable-highlighted'),
        n = Array.from(document.querySelectorAll('.syllable')).filter(
          (e) => null !== e.querySelector('.sylTextRect-display')
        ),
        r = n.indexOf(t);
      if ('ArrowLeft' === e.key && r > 0) {
        i.unselect();
        const e = n[r - 1].querySelector('.sylTextRect-display');
        i.selectAll([e], c, a);
      } else if ('ArrowRight' === e.key && r < n.length - 1) {
        i.unselect();
        const e = n[r + 1].querySelector('.sylTextRect-display');
        i.selectAll([e], c, a);
      }
    }
    function g() {
      const e = document.getElementById('selByBBox');
      return !!e && e.classList.contains('is-active');
    }
    function v(e) {
      e.stopPropagation();
    }
    function m(e) {
      if (c && 'insert' !== c.getUserMode() && !e.shiftKey)
        if ('use' === this.tagName && 'selByBBox' !== i.getSelectionType()) {
          if (null === this.closest('.selected')) {
            let e = [this];
            const n = /E9B[45678]/,
              r = /E9B[9ABC]/;
            if (this.getAttribute('xlink:href').match(r)) {
              const t = this.closest('.nc'),
                i = this.closest('.neume'),
                r = Array.from(i.children).indexOf(t),
                o = i.children[r - 1].children[0];
              console.assert(
                o.getAttribute('xlink:href').match(n),
                'First glyph of ligature unexpected!'
              ),
                null === o.closest('.selected') && e.unshift(o);
            } else if (this.getAttribute('xlink:href').match(n)) {
              const t = this.closest('.nc'),
                n = this.closest('.neume'),
                i = Array.from(n.children).indexOf(t),
                o = n.children[i + 1].children[0];
              console.assert(
                o.getAttribute('xlink:href').match(r),
                'Second glyph of ligature unexpected!'
              ),
                null === o.closest('.selected') && e.push(o);
            }
            t() &&
              (e = e.concat(
                Array.from(document.querySelectorAll('.selected'))
              )),
              i.selectAll(e, c, a),
              a && a.dragInit();
          } else if (t()) {
            const e =
                {
                  selByStaff: '.staff',
                  selByNeume: '.neume',
                  selByNc: '.nc',
                  selByLayerElement: '.accid',
                }[document.querySelector('.sel-by .is-active').id] ||
                '.syllable',
              t = [this.closest(e)];
            let n = [];
            (n = Array.from(document.getElementsByClassName('selected'))),
              (n = n.filter((e) => !t.includes(e))),
              i.selectAll(n, c, a),
              a && a.dragInit();
          }
        } else if (
          'rect' === e.target.tagName &&
          'selByBBox' === i.getSelectionType()
        )
          if (null === this.closest('.selected')) {
            let n = [e.target];
            t() &&
              ((n = n.concat(
                Array.from(document.getElementsByClassName('selected'))
              )),
              (n = n.map((e) =>
                'rect' == e.tagName
                  ? e
                  : e.querySelector('.sylTextRect-Display')
              ))),
              i.selectAll(n, c, a),
              a && a.dragInit();
          } else {
            let e = [];
            if (t()) {
              const t = [this];
              (e = Array.from(document.getElementsByClassName('selected'))),
                (e = e.map((e) =>
                  'rect' == e.tagName
                    ? e
                    : e.querySelector('.sylTextRect-Display')
                )),
                (e = e.filter((e) => !t.includes(e))),
                i.selectAll(e, c, a),
                a && a.dragInit();
            }
          }
        else {
          if ('selByStaff' !== i.getSelectionType())
            return void l.infoListeners();
          t() || i.unselect();
          const n = s.getStaffByCoords(e.clientX, e.clientY);
          if (!n) return;
          n.classList.contains('selected') ||
            (i.selectStaff(n, a), r.resize(n, c, a), a && a.dragInit()),
            n.dispatchEvent(
              new MouseEvent('mousedown', {
                screenX: e.screenX,
                screenY: e.screenY,
                clientX: e.clientX,
                clientY: e.clientY,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
                view: e.view,
              })
            );
        }
      function t() {
        return window.navigator.userAgent.match(/Mac/) ? e.metaKey : e.ctrlKey;
      }
    }
    (t.setSelectStrokeWidth = function (e) {
      d = e;
    }),
      (t.setSelectHelperObjects = function (e, t) {
        (a = t), (c = e), (l = c.info), (u = c.view.zoomHandler);
      }),
      (t.clickSelect = function (e) {
        document.querySelectorAll(e).forEach((e) => {
          e.removeEventListener('mousedown', m),
            e.addEventListener('mousedown', m);
        }),
          document.body.removeEventListener('keydown', h),
          document.body.addEventListener('keydown', h),
          document.body.removeEventListener('keydown', f),
          document.body.addEventListener('keydown', f),
          document.body.removeEventListener('keydown', p),
          document.body.addEventListener('keydown', p),
          document
            .getElementById('container')
            .addEventListener('contextmenu', (e) => {
              e.preventDefault();
            }),
          document.querySelectorAll('use,rect,#moreEdit').forEach((e) => {
            e.removeEventListener('click', v), e.addEventListener('click', v);
          });
      }),
      (t.dragSelect = function (e) {
        let t = 0,
          n = 0,
          r = !1,
          s = !1;
        const l = o.select(e);
        o.selectAll(e.replace('.active-page', '').trim()).on('.drag', null);
        const h = o
          .drag()
          .on('start', function () {
            if (!c) return;
            const e = c.getUserMode();
            if (
              'use' !== o.event.sourceEvent.target.nodeName &&
              'insert' !== e &&
              'rect' !== o.event.sourceEvent.target.nodeName
            ) {
              if (o.event.sourceEvent.shiftKey)
                (r = !0), void 0 !== u && u.startDrag();
              else if (
                !document
                  .getElementById('selByStaff')
                  .classList.contains('is-active') ||
                ((f = o.mouse(this)),
                0 ===
                  Array.from(document.getElementsByClassName('staff')).filter(
                    (e) => {
                      const t = i.getStaffBBox(e),
                        n = t.ulx,
                        r = t.uly,
                        o = t.lrx,
                        s = t.lry,
                        a = t.rotate;
                      return (
                        f[0] > n &&
                        f[0] < o &&
                        f[1] > r + (f[0] - n) * Math.tan(a) &&
                        f[1] < s - (o - f[0]) * Math.tan(a)
                      );
                    }
                  ).length)
              ) {
                i.unselect(), (s = !0);
                const e = o.mouse(this);
                (t = e[0]),
                  (n = e[1]),
                  (a = t),
                  (h = n),
                  l
                    .append('rect')
                    .attr('x', a)
                    .attr('y', h)
                    .attr('width', 0)
                    .attr('height', 0)
                    .attr('id', 'selectRect')
                    .attr('stroke', 'black')
                    .attr('stroke-width', d)
                    .attr('fill', 'none');
              }
            } else o.event.sourceEvent.shiftKey && ((r = !0), void 0 !== u && u.startDrag());
            var a, h, f;
          })
          .on('drag', function () {
            if (!r && s) {
              const e = o.mouse(this),
                i = e[0],
                r = e[1];
              !(function (e, t, n, i) {
                o.select('#selectRect')
                  .attr('x', e)
                  .attr('y', t)
                  .attr('width', n)
                  .attr('height', i);
              })(
                i < t ? i : t,
                r < n ? r : n,
                i < t ? t - i : i - t,
                r < n ? n - r : r - n
              );
            } else r && void 0 !== u && u.dragging();
          })
          .on('end', function () {
            if (!r && s) {
              const t = document.getElementById('selectRect'),
                n = parseInt(t.getAttribute('x')),
                r = parseInt(t.getAttribute('y')),
                u = n + parseInt(t.getAttribute('width')),
                d = r + parseInt(t.getAttribute('height')),
                h = l.node();
              let f = h.createSVGPoint();
              (f.x = n), (f.y = r);
              let p = h.createSVGPoint();
              (p.x = u), (p.y = d);
              const v = h
                .getScreenCTM()
                .inverse()
                .multiply(l.select('.system').node().getScreenCTM())
                .inverse();
              let m;
              (f = f.matrixTransform(v)),
                (p = p.matrixTransform(v)),
                (m = document
                  .getElementById('selByStaff')
                  .classList.contains('is-active')
                  ? document.querySelectorAll(e + ' use, ' + e + ' .staff')
                  : g()
                  ? document.querySelectorAll(e + ' .sylTextRect-display')
                  : document.querySelectorAll(e + ' use'));
              const y = Array.from(m).filter(function (e) {
                let t, n, r, o;
                if (g())
                  return (
                    (t = Number(e.getAttribute('x'))),
                    (n = Number(e.getAttribute('y'))),
                    (r = +t + +e.getAttribute('width').slice(0, -2)),
                    (o = +n + +e.getAttribute('height').slice(0, -2)),
                    !(
                      (f.x < t && p.x < t) ||
                      (f.x > r && p.x > r) ||
                      (f.y < n && p.y < n) ||
                      (f.y > o && p.y > o)
                    )
                  );
                if ('use' === e.tagName) {
                  const i = e.parentNode.getBBox();
                  return (
                    (t = i.x),
                    (n = i.y),
                    (r = i.x + i.width),
                    (o = i.y + i.height),
                    !(
                      (f.x < t && p.x < t) ||
                      (f.x > r && p.x > r) ||
                      (f.y < n && p.y < n) ||
                      (f.y > o && p.y > o)
                    )
                  );
                }
                {
                  const t = i.getStaffBBox(e);
                  return !(
                    (f.x < t.ulx && p.x < t.ulx) ||
                    (f.x > t.lrx && p.x > t.lrx) ||
                    (f.y < t.uly + Math.abs(t.ulx - f.x) * Math.tan(t.rotate) &&
                      p.y <
                        t.uly + Math.abs(t.ulx - f.x) * Math.tan(t.rotate)) ||
                    (f.y > t.lry + Math.abs(t.lry - p.y) * Math.tan(t.rotate) &&
                      p.y > t.lry + Math.abs(t.lry - p.y) * Math.tan(t.rotate))
                  );
                }
              });
              y.forEach((e) => {
                if (
                  'use' === e.tagName &&
                  e.getAttribute('xlink:href').match(/E9B[456789ABC]/)
                ) {
                  const t = e.closest('.neume'),
                    n = Array.from(t.children).indexOf(e.closest('.nc'));
                  if (e.getAttribute('xlink:href').match(/E9B[45678]/)) {
                    const e = t.children[n + 1].querySelector('use');
                    y.indexOf(e) < 0 && y.push(e);
                  } else {
                    const e = t.children[n - 1].querySelector('use');
                    y.indexOf(e) < 0 && y.push(e);
                  }
                }
              }),
                i.selectAll(y, c, a),
                a && a.dragInit(),
                o.selectAll('#selectRect').remove(),
                (s = !1);
            }
            r = !1;
          });
        l.call(h), a && a.resetTo(h);
      });
  },
  ,
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(63),
      r = n(46),
      o = n(69),
      s = n(80),
      a = n(17);
    t.default = class {
      constructor(e) {
        o.parseManifest(e.manifest) ||
          console.error('Unable to parse the manifest'),
          (this.params = e),
          (this.manifest = e.manifest);
      }
      setupEdit(e) {
        void 0 !== e.NeumeEdit && (this.NeumeEdit = new e.NeumeEdit(this)),
          void 0 !== e.TextView &&
            ((this.textView = new e.TextView(this)),
            void 0 !== e.TextEdit && (this.TextEdit = new e.TextEdit(this)));
      }
      start() {
        s.default(this)
          .then(
            () => (
              (this.view = new this.params.View(
                this,
                this.params.Display,
                this.manifest.image
              )),
              (this.name = this.manifest.title),
              (this.core = new i.default(this.manifest)),
              (this.info = new this.params.Info(this)),
              (this.modal = new a.ModalWindow(this)),
              r.init(this),
              this.setupEdit(this.params),
              this.core.initDb()
            )
          )
          .then(() => {
            this.updateForCurrentPage(!0);
          });
      }
      updateForCurrentPage(e = !1) {
        const t = this.view.getCurrentPage();
        return this.view.changePage(t, e);
      }
      redo() {
        return this.core.redo(this.view.getCurrentPageURI());
      }
      undo() {
        return this.core.undo(this.view.getCurrentPageURI());
      }
      getUserMode() {
        return void 0 !== this.NeumeEdit
          ? this.NeumeEdit.getUserMode()
          : void 0 !== this.TextEdit
          ? 'edit'
          : 'viewer';
      }
      edit(e, t) {
        return this.core.edit(e, t);
      }
      getElementAttr(e, t) {
        return this.core.getElementAttr(e, t);
      }
      export() {
        return new Promise((e, t) => {
          this.core
            .updateDatabase()
            .then(() => {
              (this.manifest.mei_annotations = this.core.getAnnotations()),
                (this.manifest.timestamp = new Date().toISOString());
              const t = new window.Blob(
                  [JSON.stringify(this.manifest, null, 2)],
                  { type: 'application/ld+json' }
                ),
                n = new FileReader();
              n.addEventListener('load', () => {
                e(n.result);
              }),
                n.readAsDataURL(t);
            })
            .catch((e) => {
              t(e);
            });
        });
      }
      save() {
        return this.core.updateDatabase();
      }
      deleteDb() {
        return this.core.deleteDb();
      }
      getPageURI(e) {
        return (
          void 0 === e && (e = this.view.getCurrentPageURI()),
          new Promise((t) => {
            this.core.getMEI(e).then((e) => {
              t(
                'data:application/mei+xml;charset=utf-8,' +
                  encodeURIComponent(e)
              );
            });
          })
        );
      }
      getPageMEI(e) {
        return this.core.getMEI(e);
      }
      getPageSVG(e) {
        return this.core.getSVG(e);
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(11);
    t.default = class {
      constructor(e, t, n, i) {
        (this.view = e),
          (this.meiClass = t),
          (this.background = n),
          (this.zoomHandler = i);
        (document.getElementById('display_controls').innerHTML = (function (e) {
          let t =
            '\n    <div class="panel-heading" id="displayHeader">\n      <div class="panel-heading-title">DISPLAY</div>\n      <svg class="icon is-pulled-right">\n        <use id="toggleDisplay" class="panel-dropdown-icon" xlink:href="/Neon/Neon-gh/assets/img/icons.svg#dropdown-down"></use>\n      </svg>\n    </div>\n    <div id="displayContents" class="panel-contents">\n      <div class="panel-content-subsection first-subsection">\n  ';
          return (
            void 0 !== e &&
              (t +=
                '\n        <div class="slider-container display-panel" style="cursor: default">\n          <button class="side-panel-btn slider-btn" id="reset-zoom">Zoom</button>\n          <input type="range"\n            step="5" min="25" max="400" value="100"\n            aria-labelledby="reset-zoom"\n            class="slider is-fullwidth is-large"\n            id="zoomSlider"\n            style="padding-left: 1rem; padding-right: 1rem;"\n            disabled="disabled"\n          />\n          <output id="zoomOutput" for="zoomSlider">100</output>\n        </div>'),
            (t +=
              '\n        <div class="slider-container display-panel" style="cursor: default">\n          <button class="side-panel-btn slider-btn" id="reset-opacity">Glyph Opacity</button>\n          <input type="range"\n            step="5" min="0" max="100" value="100"\n            aria-labelledby="reset-opacity"\n            class="slider is-fullwidth is-large"\n            id="opacitySlider"\n            style="padding-left: 1rem; padding-right: 1rem;"\n            disabled="disabled"\n          />\n          <output id="opacityOutput" for="opacitySlider">100</output>\n        </div>\n        \n        <div class="slider-container display-panel" style="cursor: default">\n          <button class="side-panel-btn slider-btn" id="reset-bg-opacity">Image Opacity</button>\n          <input type="range"\n            step="5" min="0" max="100" value="100"\n            aria-labelledby="reset-bg-opacity"\n            class="slider is-fullwidth is-large"\n            id="bgOpacitySlider"\n            style="padding-left: 1rem; padding-right: 1rem;"\n            disabled="disabled"\n          />\n          <output id="bgOpacityOutput" for="bgOpacitySlider">100</output>\n        </div>\n      </div>\n      \n      <div class="panel-content-subsection">\n\n        <div id="highlight-options-title" class="panel-sub-title">Highlight Options:</div>\n        <div class="dropdown" id="highlight-dropdown">\n          <div class="dropdown-trigger">\n            <button class="side-panel-btn" id="highlight-button" aria-haspopup="true" aria-controls="highlight-menu" style="width: auto">\n              <span>Highlight</span>\n              <span id="highlight-type">&nbsp;- Off</span>\n              <svg class="icon">\n                <use id="toggleDisplay" xlink:href="/Neon/Neon-gh/assets/img/icons.svg#dropdown-down"></use>\n              </svg>\n            </button>\n          </div>\n          <div class="dropdown-menu" id="highlight-menu" role="menu">\n            <div class="dropdown-content">\n              <a aria-role="menuitem" class="dropdown-item" id="highlight-staff">Staff</a>\n              <a aria-role="menuitem" class="dropdown-item" id="highlight-syllable">Syllable</a>\n              <a aria-role="menuitem" class="dropdown-item" id="highlight-neume">Neume</a>\n              <a aria-role="menuitem" class="dropdown-item" id="highlight-layerElement">LayerElement</a>\n              <hr class="dropdown-divider"/>\n              <a aria-role="menuitem" class="dropdown-item" id="highlight-none">None</a>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class="panel-content-subsection">\n        <div id="display-options-container">\n          <div id="display-options-title" class="panel-sub-title">Display Options:</div>\n\n          <div id="display-options-items">\n\n            <div id="checkbox-display-options">\n\n              <div id="display-all-container">\n                <div id="display-options-separator">\n                <div class="side-panel-btn" id="display-all-btn">Display All</div>\n              </div>\n              <div id="display-single-container"></div>\n\n              \n            </div>\n\n          </div>\n\n        </div>\n      </div>\n      \n    </div>'),
            t
          );
        })(this.zoomHandler)),
          this.view.addUpdateCallback(this.updateVisualization.bind(this));
      }
      setDisplayListeners() {
        this.zoomHandler && i.setZoomControls(this.zoomHandler),
          i.initDisplayControls(this.meiClass, this.background);
      }
      updateVisualization() {
        i.setOpacityFromSlider(this.meiClass), i.updateHighlight();
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(86);
    t.default = class {
      constructor(e, t, n) {
        (this.neonView = e),
          (this.updateCallbacks = []),
          (this.divaReady = !1),
          (this.diva = new i.default('container', { objectData: n })),
          (document.getElementById('container').style.minHeight = '100%'),
          (this.indexMap = new Map()),
          this.diva.disableDragScrollable(),
          (this.displayPanel = new t(
            this,
            'neon-container',
            'diva-viewer-canvas'
          )),
          (this.loadDelay = 500),
          this.initDivaEvents(),
          this.setViewEventHandlers(),
          (window.onresize = () => {
            const e = window.innerHeight,
              t = window.innerWidth;
            window.setTimeout(() => {
              e === window.innerHeight &&
                t === window.innerWidth &&
                this.changePage(this.getCurrentPage(), !1);
            }, this.loadDelay);
          });
      }
      initDivaEvents() {
        i.default.Events.subscribe(
          'ManifestDidLoad',
          this.parseManifest.bind(this),
          this.diva.settings.ID
        ),
          i.default.Events.subscribe(
            'ObjectDidLoad',
            this.didLoad.bind(this),
            this.diva.settings.ID
          ),
          i.default.Events.subscribe(
            'ActivePageDidChange',
            this.changePage.bind(this),
            this.diva.settings.ID
          ),
          i.default.Events.subscribe(
            'ZoomLevelDidChange',
            this.adjustZoom.bind(this),
            this.diva.settings.ID
          );
      }
      async changePage(e, t = !0) {
        function n(e) {
          if (e === this.getCurrentPage()) {
            const t = this.indexMap.get(e);
            this.neonView
              .getPageSVG(t)
              .then((t) => {
                this.updateSVG(t, e);
                const n = 'neon-container-' + e,
                  i = document.getElementById(n);
                null !== i && i.classList.add('active-page'),
                  this.updateCallbacks.forEach((e) => e());
              })
              .catch((e) => {
                'not_found' !== e.name &&
                  'missing_mei' !== e.name &&
                  console.error(e);
              });
          }
        }
        const i = [e];
        Array.from(document.getElementsByClassName('active-page')).forEach(
          (e) => {
            e.classList.remove('active-page');
          }
        );
        for (const e of i)
          t
            ? window.setTimeout(n.bind(this), this.loadDelay, e)
            : n.bind(this)(e);
      }
      getCurrentPage() {
        return this.diva.getActivePageIndex();
      }
      getCurrentPageURI() {
        return this.indexMap.get(this.getCurrentPage());
      }
      adjustZoom() {
        new Promise((e) => {
          Array.from(document.getElementsByClassName('neon-container')).forEach(
            (e) => {
              e.style.display = 'none';
            }
          ),
            setTimeout(e, this.diva.settings.zoomDuration + 100);
        }).then(() => {
          this.changePage(this.diva.getActivePageIndex(), !0),
            Array.from(
              document.getElementsByClassName('neon-container')
            ).forEach((e) => {
              const t = e.firstChild,
                n = parseInt(e.id.match(/\d+/)[0]);
              this.updateSVG(t, n), (e.style.display = '');
            });
        });
      }
      updateSVG(e, t) {
        const n = document.getElementById('diva-1-inner'),
          i = this.diva.getPageDimensionsAtCurrentZoomLevel(t),
          r = this.diva.settings.viewHandler._viewerCore.getPageRegion(t, {
            includePadding: !0,
            incorporateViewport: !0,
          }),
          o = window.getComputedStyle(n, null).getPropertyValue('margin-left'),
          s = 'neon-container-' + t.toString();
        let a = document.getElementById(s);
        for (
          null === a &&
          ((a = document.createElement('div')),
          (a.id = s),
          a.classList.add('neon-container'),
          n.appendChild(a));
          a.firstChild;

        )
          a.removeChild(a.firstChild);
        e.setAttribute('width', i.width.toString()),
          e.setAttribute('height', i.height.toString()),
          (a.style.position = 'absolute'),
          (a.style.top = r.top + 'px'),
          (a.style.left = r.left - parseInt(o) + 'px'),
          a.appendChild(e);
      }
      didLoad() {
        (this.divaReady = !0),
          this.displayPanel.setDisplayListeners(),
          (document.getElementById('loading').style.display = 'none'),
          console.log(this.diva);
      }
      addUpdateCallback(e) {
        this.updateCallbacks.push(e);
      }
      removeUpdateCallback(e) {
        const t = this.updateCallbacks.findIndex((t) => t === e);
        -1 !== t && this.updateCallbacks.splice(t, 1);
      }
      setViewEventHandlers() {
        document.body.addEventListener('keydown', (e) => {
          switch (e.key) {
            case 'h':
              for (const e of document.getElementsByClassName('neon-container'))
                e.style.visibility = 'hidden';
          }
        }),
          document.body.addEventListener('keyup', (e) => {
            switch (e.key) {
              case 'h':
                for (const e of document.getElementsByClassName(
                  'neon-container'
                ))
                  e.style.visibility = '';
            }
          });
      }
      parseManifest(e) {
        this.indexMap.clear();
        for (const t of e.sequences)
          for (const e of t.canvases)
            this.indexMap.set(t.canvases.indexOf(e), e['@id']);
      }
      getPageName() {
        return (
          this.diva.settings.manifest.itemTitle +
          ' — ' +
          this.diva.settings.manifest.pages[this.getCurrentPage()].l
        );
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(11),
      r = n(85),
      o = n(8);
    t.default = class {
      constructor(e, t, n) {
        (this.neonView = e),
          (this.container = document.getElementById('container')),
          (this.updateCallbacks = new Array(0)),
          (this.group = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
          )),
          (this.group.id = 'svg_group'),
          this.group.setAttribute('height', window.innerHeight.toString()),
          this.group.setAttribute('width', '100%'),
          (this.bg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'image'
          )),
          (this.bg.id = 'bgimg'),
          this.bg.classList.add('background'),
          this.bg.setAttribute('x', '0'),
          this.bg.setAttribute('y', '0');
        const i = new FileReader();
        fetch(n)
          .then((e) => {
            if (e.ok)
              return (
                i.addEventListener('load', () => {
                  this.bg.setAttributeNS(
                    'http://www.w3.org/1999/xlink',
                    'href',
                    i.result.toString()
                  );
                  const e = this.bg.getBBox();
                  this.group.hasAttribute('viewBox') ||
                    this.group.setAttribute(
                      'viewBox',
                      '0 0 ' + e.width.toString() + ' ' + e.height.toString()
                    );
                }),
                e.blob()
              );
          })
          .then((e) => {
            i.readAsDataURL(e);
          }),
          (this.svg = document.createElementNS('http://www.w3.org/svg', 'svg')),
          (this.svg.id = 'mei_output'),
          this.svg.classList.add('neon-container', 'active-page'),
          this.group.appendChild(this.bg),
          this.group.appendChild(this.svg),
          this.container.appendChild(this.group),
          (this.zoomHandler = new r.default()),
          (this.displayPanel = new t(
            this,
            'neon-container',
            'background',
            this.zoomHandler
          )),
          this.setViewEventHandlers(),
          this.displayPanel.setDisplayListeners(),
          (this.pageURI = n),
          (document.getElementById('loading').style.display = 'none');
      }
      updateSVG(e) {
        this.group.replaceChild(e, this.svg),
          (this.svg = e),
          (this.svg.id = 'mei_output'),
          this.svg.classList.add('neon-container', 'active-page');
        const t = parseInt(this.svg.getAttribute('height')),
          n = parseInt(this.svg.getAttribute('width'));
        this.bg.setAttribute('height', t.toString()),
          this.bg.setAttribute('width', n.toString()),
          this.group.setAttribute('viewBox', '0 0 ' + n + ' ' + t),
          i.updateHighlight(),
          this.resetTransformations(),
          this.updateCallbacks.forEach((e) => e());
      }
      async changePage(e, t) {
        const n = await this.neonView.getPageSVG(this.getCurrentPageURI());
        this.updateSVG(n);
      }
      addUpdateCallback(e) {
        this.updateCallbacks.push(e);
      }
      removeUpdateCallback(e) {
        const t = this.updateCallbacks.findIndex((t) => t === e);
        -1 !== t && this.updateCallbacks.splice(t, 1);
      }
      resetTransformations() {
        this.displayPanel.zoomHandler.restoreTransformation(),
          i.setOpacityFromSlider();
      }
      getCurrentPage() {
        return 0;
      }
      getCurrentPageURI() {
        return this.pageURI;
      }
      setViewEventHandlers() {
        document.body.addEventListener('keydown', (e) => {
          switch (e.key) {
            case 'Shift':
              o.select('#svg_group').on('.drag', null),
                o
                  .select('#svg_group')
                  .call(
                    o
                      .drag()
                      .on(
                        'start',
                        this.displayPanel.zoomHandler.startDrag.bind(
                          this.displayPanel.zoomHandler
                        )
                      )
                      .on(
                        'drag',
                        this.displayPanel.zoomHandler.dragging.bind(
                          this.displayPanel.zoomHandler
                        )
                      )
                  );
              break;
            case 'h':
              document
                .getElementById('mei_output')
                .setAttribute('visibility', 'hidden');
          }
        }),
          document.body.addEventListener('keyup', (e) => {
            switch (e.key) {
              case 'Shift':
                o.select('#svg_group').on('.drag', null),
                  'viewer' !== this.neonView.getUserMode() &&
                    this.neonView.NeumeEdit.setSelectListeners();
                break;
              case 'h':
                document
                  .getElementById('mei_output')
                  .setAttribute('visibility', 'visible');
            }
          }),
          o.select('#container').on('touchstart', () => {
            2 === o.event.touches.length &&
              (this.displayPanel.zoomHandler.startDrag(),
              o
                .select('#container')
                .on(
                  'touchmove',
                  this.displayPanel.zoomHandler.dragging.bind(
                    this.displayPanel.zoomHandler
                  )
                ),
              o.select('#container').on('touchend', () => {
                o.select('#container').on('touchmove', null);
              }));
          }),
          o
            .select('#container')
            .on(
              'wheel',
              this.displayPanel.zoomHandler.scrollZoom.bind(
                this.displayPanel.zoomHandler
              ),
              !1
            ),
          (window.onresize = () => {
            const e = window.innerHeight,
              t = document.getElementById('container');
            e > Number(t.getAttribute('height')) &&
              t.setAttribute('height', e.toString());
          });
      }
      getPageName() {
        return this.neonView.name;
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(51),
      r = n(34),
      o = n(52),
      s = n(13),
      a = n(11),
      c = n(19),
      l = n(10),
      u = n(53);
    t.default = class {
      constructor(e) {
        (this.neonView = e), this.initEditMode();
      }
      initEditMode() {
        (document.getElementById('insert_controls').innerHTML +=
          l.insertControlsPanel),
          (document.getElementById('edit_controls').innerHTML +=
            l.editControlsPanel),
          (document.getElementById('undoRedo_controls').innerHTML =
            u.undoRedoPanel),
          (this.dragHandler = new c.default(
            this.neonView,
            '.active-page > svg'
          )),
          (this.insertHandler = new o.default(
            this.neonView,
            '.active-page > svg'
          )),
          i.bindInsertTabs(this.insertHandler),
          document.getElementById('primitiveTab').click(),
          r.setSelectHelperObjects(this.neonView, this.dragHandler),
          this.setSelectListeners(),
          s.initNeonView(this.neonView),
          i.initInsertEditControls(),
          r.setSelectStrokeWidth(1),
          i.initSelectionButtons(),
          a.setHighlightSelectionControls(),
          this.neonView.view.addUpdateCallback(
            this.setSelectListeners.bind(this)
          ),
          document.getElementById('edit_controls').click();
      }
      getUserMode() {
        return void 0 !== this.insertHandler
          ? this.insertHandler.isInsertMode()
            ? 'insert'
            : 'edit'
          : 'viewer';
      }
      setSelectListeners() {
        r.clickSelect(
          '.active-page > svg > svg, .active-page > svg > svg use, .active-page > svg > svg rect'
        ),
          r.dragSelect('.active-page svg');
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(51),
      r = n(11),
      o = n(54),
      s = n(34),
      a = n(52),
      c = n(13),
      l = n(19),
      u = n(10),
      d = n(53),
      h = n(54);
    t.default = class {
      constructor(e) {
        (this.neonView = e), this.initEditMode();
      }
      initEditMode() {
        h.initNavbar(this.neonView);
        const e = document.createElement('a'),
          t = document.createElement('hr');
        t.classList.add('dropdown-divider'),
          e.classList.add('dropdown-item'),
          (e.id = 'highlight-selection'),
          (e.textContent = 'By Selection Mode'),
          document.getElementsByClassName('dropdown-content')[0].prepend(t),
          document.getElementsByClassName('dropdown-content')[0].prepend(e),
          (document.getElementById('insert_controls').innerHTML +=
            u.insertControlsPanel),
          (document.getElementById('edit_controls').innerHTML +=
            u.editControlsPanel),
          (document.getElementById('undoRedo_controls').innerHTML =
            d.undoRedoPanel),
          (this.dragHandler = new l.default(this.neonView, '#svg_group')),
          (this.insertHandler = new a.default(this.neonView, '#svg_group')),
          i.bindInsertTabs(this.insertHandler),
          document.getElementById('primitiveTab').click(),
          s.setSelectHelperObjects(this.neonView, this.dragHandler),
          this.setSelectListeners(),
          c.initNeonView(this.neonView),
          i.initInsertEditControls(),
          i.initSelectionButtons(),
          o.initUndoRedoPanel(this.neonView),
          r.setHighlightSelectionControls(),
          this.neonView.view.addUpdateCallback(
            this.setSelectListeners.bind(this)
          ),
          document.getElementById('selBySyllable').click();
      }
      getUserMode() {
        return void 0 !== this.insertHandler
          ? this.insertHandler.isInsertMode()
            ? 'insert'
            : 'edit'
          : 'viewer';
      }
      setSelectListeners() {
        s.clickSelect('#svg_group, #svg_group use, #svg_group rect'),
          s.dragSelect('#svg_group');
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = new Map([
      ['', 'Punctum'],
      ['u', 'Pes'],
      ['d', 'Clivis'],
      ['uu', 'Scandicus'],
      ['ud', 'Torculus'],
      ['du', 'Porrectus'],
      ['s', 'Distropha'],
      ['ss', 'Tristopha'],
      ['sd', 'Pressus'],
      ['dd', 'Climacus'],
      ['ddu', 'ClimacusResupinus'],
      ['udu', 'TorculusResupinus'],
      ['dud', 'PorrectusFlexus'],
      ['udd', 'PesSubpunctis'],
      ['uud', 'ScandicusFlexus'],
      ['uudd', 'ScandicusSubpunctis'],
      ['dudd', 'PorrectusSubpunctis'],
    ]);
    function r() {
      const e = document.getElementById('neume_info'),
        t = document.getElementById('display-all-btn'),
        n = document.getElementById('displayInfo'),
        i = document.getElementById('displayBBox'),
        r = document.getElementById('displayText');
      document.getElementById('displayInfo').checked
        ? (e.setAttribute('style', ''),
          n.checked &&
            i.checked &&
            r.checked &&
            (t.classList.add('selected'), (t.innerHTML = 'Hide All')))
        : (e.setAttribute('style', 'display: none'),
          t.classList.contains('selected') &&
            (t.classList.remove('selected'), (t.innerHTML = 'Display All')));
    }
    function o() {
      (document.getElementById('neume_info').innerHTML =
        '<div class="info-bubble-container">\n      <div class="info-bubble-header">Element Info</div>\n      <div class="info-bubble-body"><i>Hover over any element to see its metadata</i></div>\n    </div>'),
        document
          .getElementById('neume_info')
          .setAttribute('style', 'display: none'),
        r(),
        document.getElementById('displayInfo').addEventListener('click', r);
    }
    t.default = class {
      constructor(e) {
        this.neonView = e;
        const t = document.getElementById('display-single-container'),
          n = document.createElement('label');
        n.classList.add('checkbox-container', 'side-panel-btn'),
          (n.textContent = 'Info');
        const i = document.createElement('input');
        (i.id = 'displayInfo'),
          i.classList.add('checkbox'),
          (i.type = 'checkbox'),
          (i.checked = !1),
          n.appendChild(i),
          t.prepend(n),
          this.neonView.view.addUpdateCallback(
            this.resetInfoListeners.bind(this)
          ),
          o(),
          this.resetInfoListeners();
      }
      infoListeners() {
        try {
          document
            .getElementsByClassName('active-page')[0]
            .querySelectorAll('.neume,.custos,.clef,.accid,.divLine')
            .forEach((e) => {
              e.addEventListener('mouseover', this.updateInfo.bind(this));
            });
        } catch (e) {}
      }
      stopListeners() {
        document
          .querySelectorAll('.neume,.custos,.clef,.accid,.divLine')
          .forEach((e) => {
            e.removeEventListener('mouseover', this.updateInfo.bind(this));
          });
      }
      resetInfoListeners() {
        this.stopListeners(), this.infoListeners();
      }
      async updateInfo(e) {
        const t = e.currentTarget.id;
        if ('' === t)
          return (
            Array.from(document.getElementById('neume_info').children).forEach(
              (e) => {
                e.remove();
              }
            ),
            void console.log('No id!')
          );
        const n = document.getElementById(t),
          i = n
            .getAttribute('class')
            .match(/neume|nc|clef|custos|staff|liquescent|accid|divLine/)[0];
        let r,
          o = '';
        switch (i) {
          case 'neume':
            const e = n.querySelectorAll('.nc');
            if (1 === e.length) {
              const t = await this.neonView.getElementAttr(
                e[0].id,
                this.neonView.view.getCurrentPageURI()
              );
              if ('a' === t.curve || 'c' === t.curve) {
                let t = await this.getPitches(e);
                (t = t.trim().toUpperCase()),
                  (o = 'Shape: Liquescent\r\nPitch(es): ' + t);
                break;
              }
            }
            let i = await this.getContour(e);
            if (1 === e.length) {
              const t = await this.neonView.getElementAttr(
                e[0].id,
                this.neonView.view.getCurrentPageURI()
              );
              if ('s' === t.tilt) {
                let t = await this.getPitches(e);
                (t = t.trim().toUpperCase()),
                  (o = 'Shape: Virga \r\nPitch(es): ' + t);
                break;
              }
              if ('n' === t.tilt) {
                let t = await this.getPitches(e);
                (t = t.trim().toUpperCase()),
                  (o = 'Shape: Reversed Virga \r\nPitch(es): ' + t);
                break;
              }
            }
            if ('Clivis' === i) {
              (
                await this.neonView.getElementAttr(
                  e[0].id,
                  this.neonView.view.getCurrentPageURI()
                )
              ).ligated && (i = 'Ligature');
            }
            let s = await this.getPitches(e);
            (s = s.trim().toUpperCase()),
              (o =
                'Shape: ' +
                (void 0 === i ? 'Compound' : i) +
                '\r\nPitch(es): ' +
                s);
            break;
          case 'custos':
            (r = await this.neonView.getElementAttr(
              t,
              this.neonView.view.getCurrentPageURI()
            )),
              (o += 'Pitch: ' + r.pname.toUpperCase() + r.oct);
            break;
          case 'accid':
            r = await this.neonView.getElementAttr(
              t,
              this.neonView.view.getCurrentPageURI()
            );
            let a = '';
            'F' == r.accid.toUpperCase()
              ? (a = 'Flat')
              : 'N' == r.accid.toUpperCase() && (a = 'Natural'),
              (o += 'Accid Type: ' + a);
            break;
          case 'clef':
            (r = await this.neonView.getElementAttr(
              t,
              this.neonView.view.getCurrentPageURI()
            )),
              (o += 'Shape: ' + r.shape + '\r\nLine: ' + r.line);
            break;
          case 'divLine':
            (r = await this.neonView.getElementAttr(
              t,
              this.neonView.view.getCurrentPageURI()
            )),
              (o += 'DivLine Type: ' + r.form);
            break;
          default:
            o += 'nothing';
        }
        (o = `Type: ${i}\n${o}`), this.updateInfoModule(o);
      }
      async getPitches(e) {
        let t = '';
        for (const n of e) {
          const e = await this.neonView.getElementAttr(
            n.id,
            this.neonView.view.getCurrentPageURI()
          );
          t += e.pname + e.oct + ' ';
        }
        return t;
      }
      async getContour(e) {
        let t = '',
          n = null;
        for (const i of e) {
          const e = await this.neonView.getElementAttr(
            i.id,
            this.neonView.view.getCurrentPageURI()
          );
          null !== n &&
            (n.oct > e.oct
              ? (t += 'd')
              : n.oct < e.oct ||
                this.pitchNameToNum(n.pname) < this.pitchNameToNum(e.pname)
              ? (t += 'u')
              : this.pitchNameToNum(n.pname) > this.pitchNameToNum(e.pname)
              ? (t += 'd')
              : (t += 's')),
            (n = e);
        }
        return (
          void 0 === i.get(t) && console.warn('Unknown contour: ' + t), i.get(t)
        );
      }
      updateInfoModule(e) {
        (document.getElementsByClassName('info-bubble-body')[0].innerText = e),
          document.getElementById('displayInfo').checked &&
            (document.getElementsByClassName(
              'info-bubble-container'
            )[0].style.display = '');
      }
      pitchNameToNum(e) {
        switch (e) {
          case 'c':
            return 1;
          case 'd':
            return 2;
          case 'e':
            return 3;
          case 'f':
            return 4;
          case 'g':
            return 5;
          case 'a':
            return 6;
          case 'b':
            return 7;
          default:
            console.log('Unknown pitch name');
        }
      }
      getContourByValue(e) {
        for (const [t, n] of i.entries()) if (n === e) return t;
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(7),
      r = n(5),
      o = n(11);
    t.default = class {
      constructor(e) {
        (this.neonView = e), (this.notificationSent = !1);
        const t = document.getElementById('display-single-container'),
          n = document.createElement('label'),
          i = document.createElement('label'),
          r = document.createElement('input'),
          o = document.createElement('input');
        r.classList.add('checkbox'),
          o.classList.add('checkbox'),
          n.classList.add('checkbox-container', 'side-panel-btn'),
          i.classList.add('checkbox-container', 'side-panel-btn'),
          (n.textContent = 'Text'),
          (i.textContent = 'BBoxes'),
          (r.id = 'displayText'),
          (r.type = 'checkbox'),
          (o.id = 'displayBBox'),
          (o.type = 'checkbox'),
          (r.checked = !1),
          (o.checked = !1),
          n.appendChild(r),
          i.appendChild(o),
          t.prepend(i),
          t.prepend(n),
          this.setTextViewControls(),
          this.neonView.view.addUpdateCallback(
            this.updateTextViewVisibility.bind(this)
          ),
          this.neonView.view.addUpdateCallback(
            this.updateBBoxViewVisibility.bind(this)
          );
      }
      setTextViewControls() {
        this.updateTextViewVisibility(),
          this.updateBBoxViewVisibility(),
          document.getElementById('displayText').addEventListener(
            'click',
            function () {
              this.updateTextViewVisibility();
            }.bind(this)
          ),
          document.getElementById('displayBBox').addEventListener(
            'click',
            function () {
              this.updateBBoxViewVisibility();
            }.bind(this)
          );
      }
      updateBBoxViewVisibility() {
        var e;
        const t = document.getElementById('display-all-btn'),
          n = document.getElementById('displayInfo'),
          i = document.getElementById('displayBBox'),
          s = document.getElementById('displayText');
        if (document.getElementById('displayBBox').checked)
          document.querySelectorAll('.sylTextRect').forEach((e) => {
            e.classList.add('sylTextRect-display'),
              e.classList.remove('sylTextRect');
          }),
            document
              .querySelectorAll('.syl.selected .sylTextRect-display')
              .forEach((e) => {
                e.style.fill = 'red';
              }),
            'viewer' !== this.neonView.getUserMode() &&
              void 0 !== this.neonView.TextEdit &&
              this.neonView.TextEdit.initSelectByBBoxButton(),
            n.checked &&
              i.checked &&
              s.checked &&
              (t.classList.add('selected'), (t.innerHTML = 'Hide All'));
        else {
          (null === (e = document.getElementById('selByBBox')) || void 0 === e
            ? void 0
            : e.classList.contains('is-active')) &&
            (r.unselect(),
            document.getElementById('selByBBox').classList.remove('is-active'),
            document
              .getElementById('selBySyllable')
              .classList.add('is-active')),
            document.querySelectorAll('.sylTextRect-display').forEach((e) => {
              e.classList.add('sylTextRect'),
                e.classList.remove('sylTextRect-display');
            }),
            document
              .querySelectorAll('.syl.selected .sylTextRect')
              .forEach((e) => {
                e.style.fill = 'none';
              });
          try {
            document.getElementById('selByBBox').style.display = 'none';
          } catch (e) {}
          t.classList.contains('selected') &&
            (t.classList.remove('selected'), (t.innerHTML = 'Display All'));
        }
        o.updateHighlight();
      }
      updateTextViewVisibility() {
        const e = document.getElementById('display-all-btn'),
          t = document.getElementById('displayInfo'),
          n = document.getElementById('displayBBox'),
          i = document.getElementById('displayText');
        if (document.getElementById('displayText').checked) {
          const r = document.getElementById('syl_text');
          (r.style.display = ''),
            (r.innerHTML = `<div class="info-bubble-container">\n          <div class="info-bubble-header">Syllables on this page</div>\n          <div class="info-bubble-body">${this.getSylText()}</div>\n        </div>`);
          r.querySelectorAll('span').forEach((e) => {
            const t = document.getElementById(e.classList[0]),
              n = t.querySelector('.syl'),
              i = n.querySelector('text'),
              r = n.querySelector('rect');
            0 === i.classList.length && i.classList.add('text'),
              e.addEventListener('mouseover', () => {
                t.classList.add('selected'),
                  t.querySelectorAll('.neume').forEach((e) => {
                    e.classList.add('selected');
                  }),
                  null !== r && (r.style.fill = '#d00');
              }),
              e.addEventListener('mouseleave', () => {
                t.classList.remove('selected'),
                  t.querySelectorAll('.neume').forEach((e) => {
                    e.classList.remove('selected');
                  }),
                  null !== r &&
                    ('rgb(0, 0, 0)' !== t.style.fill
                      ? (r.style.fill = t.getAttribute('fill'))
                      : (r.style.fill = 'blue'));
              });
          }),
            'viewer' !== this.neonView.getUserMode() &&
              void 0 !== this.neonView.TextEdit &&
              this.neonView.TextEdit.initTextEdit(),
            t.checked &&
              n.checked &&
              i.checked &&
              (e.classList.add('selected'), (e.innerHTML = 'Hide All'));
        } else
          (document.getElementById('syl_text').style.display = 'none'),
            e.classList.contains('selected') &&
              (e.classList.remove('selected'), (e.innerHTML = 'Display All'));
      }
      getSylText() {
        let e = '';
        return (
          document.querySelectorAll('.active-page .syllable').forEach((t) => {
            if (null !== t.querySelector('.syl')) {
              const n = t.querySelector('.syl');
              (e += `<span class="${t.id} syl-text-side-panel">`),
                '' === n.textContent.trim()
                  ? (e += '&#x25CA; ')
                  : Array.from(n.children[0].children[0].children).forEach(
                      (t) => {
                        e += '' !== t.textContent ? t.textContent : '&#x25CA; ';
                      }
                    ),
                (e += ' </span>');
            }
          }),
          this.notificationSent ||
            (i.queueNotification(
              'Blank syllables are represented by &#x25CA;!'
            ),
            (this.notificationSent = !0)),
          e.replace(/\ue551/g, '-')
        );
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 });
    const i = n(5),
      r = n(19),
      o = n(34),
      s = n(18),
      a = n(17);
    function c() {
      if (
        !document.getElementById('selByBBox').classList.contains('is-active')
      ) {
        i.unselect();
        try {
          (document.getElementById('moreEdit').innerHTML = ''),
            (document.getElementById('extraEdit').innerHTML = ''),
            document
              .getElementById('moreEdit')
              .parentElement.classList.add('hidden'),
            document
              .getElementById('extraEdit')
              .parentElement.classList.add('hidden');
        } catch (e) {}
        document.getElementById('selByBBox').classList.add('is-active');
        try {
          document.getElementById('selByNc').classList.remove('is-active'),
            document.getElementById('selByNeume').classList.remove('is-active'),
            document.getElementById('selByStaff').classList.remove('is-active'),
            document
              .getElementById('selBySyllable')
              .classList.remove('is-active'),
            document
              .getElementById('selByLayerElement')
              .classList.remove('is-active');
        } catch (e) {}
        try {
          'highlight-selection' ===
            document.querySelector('.highlight-selected').id &&
            s.setGroupingHighlight('syllable');
        } catch (e) {}
      }
      this.addBBoxListeners();
    }
    t.default = class {
      constructor(e) {
        (this.neonView = e), this.initTextEdit();
      }
      initTextEdit() {
        const e = document.getElementById('syl_text').querySelectorAll('span'),
          t = this.neonView.modal;
        e.forEach((e) => {
          function n() {
            e.classList.add('selected-to-edit'),
              t.setModalWindowView(a.ModalWindowView.EDIT_TEXT),
              t.openModalWindow(),
              t.updateSelectedBBox(e);
          }
          e.removeEventListener('click', n), e.addEventListener('click', n);
        });
      }
      initSelectByBBoxButton() {
        if (void 0 !== this.neonView.NeumeEdit) {
          const e = document.getElementById('selByBBox');
          if (e) return void (e.style.display = '');
          const t = document.getElementById('selection-mode-btns-container'),
            n = document.createElement('button');
          n.classList.add('side-panel-btn', 'sel-by'),
            (n.id = 'selByBBox'),
            (n.textContent = 'BBox'),
            t.appendChild(n),
            n.addEventListener('click', c.bind(this)),
            document.body.addEventListener('keydown', (e) => {
              '6' === e.key &&
                '' === document.getElementById('selByBBox').style.display &&
                c.bind(this)();
            }),
            this.neonView.view.addUpdateCallback(
              this.addBBoxListeners.bind(this)
            );
        } else {
          const e = document.getElementById('undo').closest('.control'),
            t = document.createElement('p');
          t.classList.add('control');
          const n = document.createElement('button');
          n.classList.add('side-panel-btn', 'sel-by'),
            (n.id = 'selByBBox'),
            (n.textContent = 'BBox'),
            t.appendChild(n),
            e.appendChild(t),
            n.classList.add('is-active'),
            (n.style.display = 'none'),
            this.addBBoxListeners(),
            this.neonView.view.addUpdateCallback(
              this.addBBoxListeners.bind(this)
            );
        }
      }
      addBBoxListeners() {
        document.getElementById('selByBBox').classList.contains('is-active') &&
          (i.unselect(),
          void 0 === this.neonView.NeumeEdit &&
            ((this.dragHandler = new r.default(
              this.neonView,
              '.sylTextRect-display'
            )),
            o.setSelectHelperObjects(this.neonView, this.dragHandler),
            'SingleView' === this.neonView.view.constructor.name
              ? (o.clickSelect('#mei_output, #mei_output rect'),
                o.dragSelect('#svg_group'))
              : (o.clickSelect(
                  '.active-page > svg > svg, .active-page > svg > svg rect'
                ),
                o.dragSelect('.active-page svg'))));
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.convertSbToStaff =
        t.getSyllableText =
        t.convertStaffToSb =
        t.zip =
          void 0);
    const i = n(31),
      r = n(64),
      o = n(7);
    function s(e, t) {
      for (const n of e.attributes) t.setAttribute(n.name, n.value);
    }
    function a(e) {
      const t = e.getElementsByTagName('syl')[0].childNodes[0];
      let n;
      return (n = t ? t.nodeValue : 'null'), n;
    }
    (t.zip = function (e, t) {
      const n = [];
      for (let i = 0; i < (e.length > t.length ? t.length : e.length); i++)
        n.push([e[i], t[i]]);
      return n;
    }),
      (t.convertStaffToSb = function (e) {
        const t = new DOMParser(),
          n = new XMLSerializer(),
          i = t.parseFromString(e, 'text/xml'),
          o = i.documentElement;
        for (const e of o.getElementsByTagName('section')) {
          const t = i.createElementNS(
              'http://www.music-encoding.org/ns/mei',
              'staff'
            ),
            n = i.createElementNS(
              'http://www.music-encoding.org/ns/mei',
              'layer'
            );
          t.setAttribute('n', '1'), n.setAttribute('n', '1'), t.appendChild(n);
          const r = Array.from(e.getElementsByTagName('staff'));
          for (const e of r) {
            const t = e.getElementsByTagName('layer')[0],
              r = i.createElementNS(
                'http://www.music-encoding.org/ns/mei',
                'sb'
              );
            r.setAttribute('n', e.getAttribute('n')),
              r.setAttribute('facs', e.getAttribute('facs')),
              r.setAttribute('xml:id', e.getAttribute('xml:id'));
            let o = void 0;
            for (
              null !== n.lastElementChild &&
                'custos' === n.lastElementChild.tagName &&
                (o = n.removeChild(n.lastElementChild)),
                void 0 !== o && n.appendChild(o),
                n.appendChild(r);
              null !== t.firstElementChild;

            )
              n.appendChild(t.firstElementChild);
            e.remove();
          }
          e.appendChild(t);
        }
        return r.xml(n.serializeToString(i));
      }),
      (t.getSyllableText = a),
      (t.convertSbToStaff = function (e) {
        const t = new DOMParser().parseFromString(e, 'text/xml'),
          n = t.documentElement,
          c = Array.from(n.getElementsByTagName('neume'));
        for (const e of c)
          0 === e.getElementsByTagName('nc').length &&
            o.queueNotification(
              'This file contains a neume without neume component!'
            );
        const l = Array.from(n.getElementsByTagName('syllable'));
        for (const e of l)
          0 === e.getElementsByTagName('neume').length &&
            o.queueNotification('This file contains a syllable without neume!');
        for (const e of n.getElementsByTagName('section')) {
          const n = Array.from(e.getElementsByTagName('staff'));
          for (const r of n) {
            const n = r.getElementsByTagName('layer')[0],
              o = Array.from(n.getElementsByTagName('sb'));
            for (const e of o)
              if ('layer' !== e.parentElement.tagName) {
                const n = e.parentElement;
                let r = !1,
                  o = !1;
                const s = Array.from(n.children),
                  a = s.indexOf(e);
                for (const e of n.getElementsByTagName('neume')) {
                  const t = s.indexOf(e);
                  t < a ? (r = !0) : t > a && (o = !0);
                }
                if (!r && o) n.insertAdjacentElement('beforebegin', e);
                else if (r && !o) n.insertAdjacentElement('afterend', e);
                else if (r && o) {
                  const r = t.createElementNS(
                    'http://www.music-encoding.org/ns/mei',
                    'syllable'
                  );
                  r.setAttribute('xml:id', 'm-' + i.uuidv4()),
                    r.setAttribute('follows', '#' + n.getAttribute('xml:id')),
                    n.setAttribute('precedes', '#' + r.getAttribute('xml:id'));
                  const o = s.indexOf(e);
                  for (const e of s) {
                    s.indexOf(e) > o && r.appendChild(e);
                  }
                  n.insertAdjacentElement('afterend', e),
                    e.insertAdjacentElement('afterend', r);
                  for (const e of n.getElementsByTagName('custos'))
                    n.insertAdjacentElement('afterend', e);
                  for (const e of r.getElementsByTagName('clef'))
                    r.insertAdjacentElement('beforebegin', e);
                } else console.warn('NONE BEHIND NONE AHEAD'), console.debug(n);
              }
            const a = Array.from(n.getElementsByTagName('sb'));
            for (let o = 0; o < a.length; o++) {
              const c = a[o],
                l = a.length > o + 1 ? a[o + 1] : void 0,
                u = t.createElementNS(
                  'http://www.music-encoding.org/ns/mei',
                  'staff'
                );
              s(c, u);
              const d = t.createElementNS(
                'http://www.music-encoding.org/ns/mei',
                'layer'
              );
              d.setAttribute('n', '1'),
                d.setAttribute('xml:id', 'm-' + i.uuidv4()),
                u.appendChild(d);
              const h = Array.from(n.children),
                f = h.slice(h.indexOf(c) + 1, h.indexOf(l));
              for (const e of f) d.appendChild(e);
              e.insertBefore(u, r);
            }
            r.remove();
          }
        }
        for (const e of n.querySelectorAll('syllable')) {
          for (const t of e.querySelectorAll('clef'))
            e.insertAdjacentElement('beforebegin', t);
          for (const t of e.querySelectorAll('custos'))
            e.insertAdjacentElement('afterend', t);
          let t = Array.from(n.getElementsByTagName('syllable'));
          if (e.hasAttribute('precedes')) {
            const n = t.indexOf(e);
            if (n >= 0) {
              const i = t[n + 1];
              if (i)
                if (i.hasAttribute('follows')) {
                  if (
                    i.getAttribute('follows') !=
                    '#' + e.getAttribute('xml:id')
                  ) {
                    const t = a(e);
                    o.queueNotification(
                      'Wrong @follows value for toggle-linked syllable: ' + t
                    );
                  }
                } else {
                  const t = a(e);
                  o.queueNotification(
                    'No @follows value found for toggle-linked syllable: ' + t
                  );
                }
              else o.queueNotification('No syllables found after @precedes');
            }
          } else if (e.hasAttribute('follows')) {
            const n = t.indexOf(e);
            if (n > 0) {
              const i = t[n - 1];
              if (i)
                if (i.hasAttribute('precedes')) {
                  if (
                    i.getAttribute('precedes') !=
                    '#' + e.getAttribute('xml:id')
                  ) {
                    const e = a(i);
                    o.queueNotification(
                      'Wrong @precedes value for toggle-linked syllable: ' + e
                    );
                  }
                } else {
                  const e = a(i);
                  o.queueNotification(
                    'No @precedes value found for toggle-linked syllable: ' + e
                  );
                }
            }
          }
        }
        const u = new XMLSerializer();
        return r.xml(u.serializeToString(t));
      });
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.blankPage = t.sendForValidation = t.init = void 0);
    const i = n(17),
      r = fetch('/Neon/Neon-gh/assets/mei-all.rng');
    let o, s, a;
    function c(e) {
      const t = e.data;
      if (null === t) {
        (a.textContent = 'VALID'), (a.style.color = '#4bc14b');
        for (const e of a.children) e.remove();
      } else {
        let e = '';
        t.forEach((t) => {
          e += t + '\n';
        }),
          (a.textContent = ''),
          (a.style.color = 'red');
        const n = document.createElement('div');
        (n.textContent = 'INVALID'),
          (n.style.cursor = 'pointer'),
          a.appendChild(n),
          n.addEventListener('click', l.bind(this, e));
      }
    }
    function l(e) {
      this.modal.setModalWindowView(i.ModalWindowView.VALIDATION_STATUS, e),
        this.modal.openModalWindow();
    }
    (t.init = async function (e) {
      const t = document.getElementById('file-status');
      if (null !== t) {
        const n = document.createElement('div');
        (n.textContent = 'MEI Status:'), (n.id = 'validation_status_title');
        const i = document.createElement('span');
        (i.id = 'validation_status'),
          (i.textContent = 'unknown'),
          t.appendChild(n),
          t.appendChild(i),
          (a = document.getElementById('validation_status')),
          (o = new Worker('/Neon/Neon-gh/workers/Worker.js')),
          (o.onmessage = c.bind(e));
      }
    }),
      (t.sendForValidation = async function (e) {
        if (void 0 !== a) {
          if (void 0 === s) {
            const e = await r;
            s = await e.text();
          }
          (a.textContent = 'checking...'),
            (a.style.color = 'gray'),
            o.postMessage({ mei: e, schema: s });
        }
      }),
      (t.blankPage = function () {
        for (const e of a.children) e.remove();
        (a.textContent = 'No MEI'), (a.style.color = 'color:gray');
      });
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.initGroupingListeners =
        t.endGroupingSelection =
        t.triggerGrouping =
        t.mergeStaves =
        t.isGroupable =
        t.initNeonView =
          void 0);
    const i = n(10),
      r = n(65),
      o = n(7),
      s = n(5),
      a = n(13),
      c = n(13);
    let l;
    function u(e, t) {
      const n = Array.from(t.values());
      switch (n.length) {
        case 1:
          return !1;
        default:
          return !(!s.sharedSecondLevelParent(n) && 'selByStaff' !== e);
      }
    }
    function d() {
      const e = document.querySelectorAll('.staff.selected'),
        t = [];
      e.forEach((e) => {
        t.push(e.id);
      });
      const n = { action: 'merge', param: { elementIds: t } };
      l.edit(n, l.view.getCurrentPageURI()).then((e) => {
        e
          ? (o.queueNotification('Staff Merged'),
            a.endOptionsSelection(),
            l.updateForCurrentPage())
          : o.queueNotification('Merge Failed');
      });
    }
    function h() {
      const e = document.getElementById('moreEdit');
      (e.innerHTML = ''),
        e.parentElement.classList.add('hidden'),
        document.body.removeEventListener('keydown', c.deleteButtonHandler),
        document.body.removeEventListener('keydown', p);
    }
    function f() {
      const e = document.getElementById('delete');
      e.removeEventListener('click', c.removeHandler),
        e.addEventListener('click', c.removeHandler),
        document.body.addEventListener('keydown', c.deleteButtonHandler),
        document.body.addEventListener('keydown', p);
      try {
        document.getElementById('mergeSyls').addEventListener('click', () => {
          g(
            'group',
            'neume',
            m().filter((e) =>
              document.getElementById(e).classList.contains('neume')
            )
          );
        });
      } catch (e) {}
      try {
        document.getElementById('groupNeumes').addEventListener('click', () => {
          g('group', 'neume', v());
        });
      } catch (e) {}
      try {
        document.getElementById('groupNcs').addEventListener('click', () => {
          g('group', 'nc', v());
        });
      } catch (e) {}
      try {
        document
          .getElementById('ungroupNeumes')
          .addEventListener('click', () => {
            g('ungroup', 'neume', m());
          });
      } catch (e) {}
      try {
        document.getElementById('ungroupNcs').addEventListener('click', () => {
          g('ungroup', 'nc', m());
        });
      } catch (e) {}
      try {
        document
          .getElementById('toggle-ligature')
          .addEventListener('click', async () => {
            const e = { action: 'toggleLigature', param: { elementIds: v() } };
            l.edit(e, l.view.getCurrentPageURI()).then((e) => {
              e
                ? o.queueNotification('Ligature Toggled')
                : o.queueNotification('Ligature Toggle Failed'),
                h(),
                l.updateForCurrentPage();
            });
          });
      } catch (e) {}
      try {
        document.getElementById('toggle-link').addEventListener('click', () => {
          const e = v(),
            t = { action: 'chain', param: [] },
            n = new Array();
          if (document.getElementById(e[0]).getAttribute('mei:precedes'))
            n.push({
              action: 'set',
              param: { elementId: e[0], attrType: 'precedes', attrValue: '' },
            }),
              n.push({
                action: 'set',
                param: { elementId: e[1], attrType: 'follows', attrValue: '' },
              }),
              n.push({
                action: 'setText',
                param: { elementId: e[1], text: '' },
              });
          else if (document.getElementById(e[0]).getAttribute('mei:follows'))
            n.push({
              action: 'set',
              param: { elementId: e[0], attrType: 'follows', attrValue: '' },
            }),
              n.push({
                action: 'set',
                param: { elementId: e[1], attrType: 'precedes', attrValue: '' },
              }),
              n.push({
                action: 'setText',
                param: { elementId: e[0], text: '' },
              });
          else {
            const t = document.getElementById(e[0]),
              i = document.getElementById(e[1]),
              r = t.closest('.staff'),
              o = i.closest('.staff'),
              s = Array.from(r.parentElement.children).filter((e) =>
                e.classList.contains('staff')
              );
            let a, c;
            s.indexOf(r) < s.indexOf(o)
              ? ((a = t), (c = i))
              : ((a = i), (c = t)),
              n.push({
                action: 'set',
                param: {
                  elementId: a.id,
                  attrType: 'precedes',
                  attrValue: '#' + c.id,
                },
              }),
              n.push({
                action: 'set',
                param: {
                  elementId: c.id,
                  attrType: 'follows',
                  attrValue: '#' + a.id,
                },
              });
            const l = c.querySelector('.syl');
            null !== l &&
              n.push({ action: 'remove', param: { elementId: l.id } });
          }
          (t.param = n),
            l.edit(t, l.view.getCurrentPageURI()).then((e) => {
              e
                ? o.queueNotification('Toggled Syllable Link')
                : o.queueNotification('Failed to Toggle Syllable Link'),
                h(),
                l.updateForCurrentPage();
            });
        });
      } catch (e) {}
    }
    (t.initNeonView = function (e) {
      l = e;
    }),
      (t.isGroupable = u),
      (t.mergeStaves = d),
      (t.triggerGrouping = function (e) {
        const t = document.getElementById('moreEdit');
        t.parentElement.classList.remove('hidden'),
          (t.innerHTML += i.groupingMenu[e]),
          f();
      }),
      (t.endGroupingSelection = h),
      (t.initGroupingListeners = f);
    const p = function (e) {
      if ('g' === e.key) {
        const e = Array.from(document.querySelectorAll('.selected'));
        if (0 == e.length) return;
        const t = s.getSelectionType();
        switch (t) {
          case 'selBySyllable':
            if (u(t, e)) {
              g(
                'group',
                'neume',
                m().filter((e) =>
                  document.getElementById(e).classList.contains('neume')
                )
              );
            } else {
              g('ungroup', 'neume', m());
            }
            break;
          case 'selByNeume':
            if (u(t, e)) {
              g('group', 'neume', v());
            } else {
              g('ungroup', 'nc', m());
            }
            break;
          case 'selByNc':
            if (u(t, e)) {
              g('group', 'nc', v());
            } else {
              g('ungroup', 'nc', m());
            }
            break;
          case 'selByStaff':
            u(t, e) ? d() : a.triggerStaffSplitMode();
            break;
          default:
            return void console.error(
              `Can't perform grouping/ungrouping action on selection type ${t}.`
            );
        }
      }
    };
    function g(e, t, n) {
      const i = { action: e, param: { groupType: t, elementIds: n } };
      l.edit(i, l.view.getCurrentPageURI()).then((i) => {
        if (
          (i
            ? 'group' === e
              ? o.queueNotification('Grouping Success')
              : o.queueNotification('Ungrouping Success')
            : 'group' === e
            ? o.queueNotification('Grouping Failed')
            : o.queueNotification('Ungrouping Failed'),
          l.updateForCurrentPage(),
          'nc' === t)
        ) {
          const e = document.getElementById(n[0]).parentElement,
            t = Array.from(e.children);
          void 0 === l.info.getContour(t) && r.groupingNotRecognized();
        }
        h();
      });
    }
    function v() {
      const e = [];
      return (
        Array.from(document.getElementsByClassName('selected')).forEach((t) => {
          e.push(t.id);
        }),
        e
      );
    }
    function m() {
      const e = [];
      return (
        Array.from(document.getElementsByClassName('selected')).forEach((t) => {
          if (t.classList.contains('divLine') || t.classList.contains('accid'))
            return;
          Array.from(t.children).forEach((t) => {
            e.push(t.id);
          });
        }),
        e
      );
    }
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.resize = void 0);
    const i = n(5),
      r = n(8),
      o = {
        TopLeft: 0,
        Top: 1,
        TopRight: 2,
        Right: 3,
        BottomRight: 4,
        Bottom: 5,
        BottomLeft: 6,
        Left: 7,
      };
    function s(e, t, n, i, r) {
      let s;
      if (r >= 0)
        s = [
          { x: e, y: t, name: o.TopLeft },
          { x: (e + n) / 2, y: t + ((n - e) / 2) * Math.sin(r), name: o.Top },
          { x: n, y: t + (n - e) * Math.sin(r), name: o.TopRight },
          { x: n, y: (t + i + (n - e) * Math.sin(r)) / 2, name: o.Right },
          { x: n, y: i, name: o.BottomRight },
          {
            x: (e + n) / 2,
            y: i - ((n - e) / 2) * Math.sin(r),
            name: o.Bottom,
          },
          { x: e, y: i - (n - e) * Math.sin(r), name: o.BottomLeft },
          { x: e, y: (t + i - (n - e) * Math.sin(r)) / 2, name: o.Left },
        ];
      else {
        const a = (n - e) * Math.tan(Math.abs(r)),
          c = i - t - a;
        s = [
          { x: e, y: t + a, name: o.TopLeft },
          { x: (e + n) / 2, y: t + a / 2, name: o.Top },
          { x: n, y: t, name: o.TopRight },
          { x: n, y: t + c / 2, name: o.Right },
          { x: n, y: t + c, name: o.BottomRight },
          { x: (e + n) / 2, y: i - a / 2, name: o.Bottom },
          { x: e, y: i, name: o.BottomLeft },
          { x: e, y: i - c / 2, name: o.Left },
        ];
      }
      return s;
    }
    t.resize = function (e, t, n) {
      let a, c, l, u, d, h, f, p, g, v, m, y, b;
      function w() {
        const e = s(a, c, l, u, d),
          t = e
            .filter((e, t) => t % 2 == 0)
            .map((e) => e.x + ',' + e.y)
            .join(' ');
        r.select('#resizeRect').attr('points', t);
        for (const t in o) {
          const n = e[o[t]];
          r.select('#p-' + t)
            .filter('.resizePoint')
            .attr('cx', n.x)
            .attr('cy', n.y);
        }
        let n = e[3].x,
          i = e[3].y;
        const h =
          n +
          100 +
          ',' +
          (i + 85) +
          ' ' +
          (n + 70) +
          ',' +
          (i + 50) +
          ' ' +
          (n + 100) +
          ',' +
          (i + 15) +
          ' ' +
          (n + 130) +
          ',' +
          (i + 50);
        (n = e[7].x), (i = e[7].y);
        const f =
          n -
          100 +
          ',' +
          (i - 15) +
          ' ' +
          (n - 130) +
          ',' +
          (i - 50) +
          ' ' +
          (n - 100) +
          ',' +
          (i - 85) +
          ' ' +
          (n - 70) +
          ',' +
          (i - 50);
        r.select('#rotateLeft').attr('points', f),
          r.select('#rotateRight').attr('points', h);
      }
      !(function _() {
        if (null === e) return;
        if (e.classList.contains('syl')) {
          const t = e.querySelector('.sylTextRect-display');
          if (null === t)
            return void console.warn(
              "Tried to draw resize rect for a sylTextRect that doesn't exist (or isn't displaying)"
            );
          (a = Number(t.getAttribute('x'))),
            (c = Number(t.getAttribute('y'))),
            (l = +a + +t.getAttribute('width')),
            (u = +c + +t.getAttribute('height')),
            (d = 0);
        }
        if (e.classList.contains('staff')) {
          const t = i.getStaffBBox(e);
          (a = t.ulx), (c = t.uly), (l = t.lrx), (u = t.lry);
          const n = e
            .querySelector('path')
            .getAttribute('d')
            .match(/\d+/g)
            .map((e) => Number(e));
          d = Math.atan((n[3] - n[1]) / (n[2] - n[0]));
        }
        let E;
        const S = s(a, c, l, u, d);
        m = S[2].x - S[0].x;
        const x = S.filter((e, t) => t % 2 == 0)
          .map((e) => e.x + ',' + e.y)
          .join(' ');
        r.select('#' + e.id)
          .append('polygon')
          .attr('points', x)
          .attr('id', 'resizeRect')
          .attr('stroke', 'black')
          .attr('stroke-width', 10)
          .attr('fill', 'none')
          .style('cursor', 'move')
          .style('stroke-dasharray', '20 10');
        for (const t in o) {
          const n = S[o[t]];
          r.select(e.viewportElement)
            .append('circle')
            .attr('cx', n.x)
            .attr('cy', n.y)
            .attr('r', 25)
            .attr('stroke', 'black')
            .attr('stroke-width', 4)
            .attr('fill', '#0099ff')
            .attr('class', 'resizePoint')
            .attr('id', 'p-' + t);
        }
        function L(e) {
          E = e;
          const t = S.find((t) => t.name === o[e]);
          (h = [t.x, t.y]), (f = c), (p = u);
        }
        function k() {
          const e = r.mouse(this);
          switch (o[E]) {
            case o.TopLeft:
              (a = e[0]), (c = e[1]);
              break;
            case o.Top:
              c = e[1] - ((l - a) * Math.tan(d)) / 2;
              break;
            case o.TopRight:
              (l = e[0]), (c = e[1] - (l - a) * Math.tan(d));
              break;
            case o.Right:
              (l = e[0]), (u = p + (e[0] - h[0]) * Math.tan(d));
              break;
            case o.BottomRight:
              (l = e[0]), (u = e[1]);
              break;
            case o.Bottom:
              u = e[1] + ((l - a) * Math.tan(d)) / 2;
              break;
            case o.BottomLeft:
              (a = e[0]), (u = e[1] + (l - a) * Math.tan(d));
              break;
            case o.Left:
              (a = e[0]), (c = f + (e[0] - h[0]) * Math.tan(d));
              break;
            default:
              console.error(
                "Something that wasn't a side of the rectangle was dragged. This shouldn't happen."
              );
          }
          w();
        }
        function C() {
          const o = {
            action: 'resize',
            param: { elementId: e.id, ulx: a, uly: c, lrx: l, lry: u },
          };
          t.edit(o, t.view.getCurrentPageURI()).then(async (o) => {
            if (
              (o && (await t.updateForCurrentPage()),
              (e = document.getElementById(e.id)),
              (a = void 0),
              (c = void 0),
              (l = void 0),
              (u = void 0),
              r.selectAll('.resizePoint').remove(),
              r.selectAll('#resizeRect').remove(),
              r.selectAll('.rotatePoint').remove(),
              _(),
              e.classList.contains('syl'))
            )
              i.selectBBox(e.querySelector('.sylTextRect-display'), n, this);
            else
              try {
                (document.getElementById('moreEdit').innerHTML = ''),
                  document
                    .getElementById('moreEdit')
                    .parentElement.classList.add('hidden');
              } catch (e) {}
          });
        }
        for (const e in o)
          r.select('#p-' + e)
            .filter('.resizePoint')
            .call(
              r
                .drag()
                .on('start', () => {
                  L(e);
                })
                .on('drag', k)
                .on('end', C.bind(this))
            );
        function I() {
          const e = r.event.sourceEvent.target.id;
          (g = r.mouse(this)[1]),
            (p = u),
            (f = c),
            (v = 'rotateRight' === e ? u : c),
            (b = d);
        }
        function A() {
          void 0 === y && (y = 0);
          const r = {
            action: 'resizeRotate',
            param: {
              elementId: e.id,
              ulx: a,
              uly: c,
              lrx: l,
              lry: u,
              rotate: (180 * d) / Math.PI,
            },
          };
          t.edit(r, t.view.getCurrentPageURI()).then(async (r) => {
            r && (await t.updateForCurrentPage()),
              (e = document.getElementById(e.id)),
              (a = void 0),
              (c = void 0),
              (l = void 0),
              (u = void 0),
              (y = void 0),
              _(),
              e.classList.contains('syl')
                ? i.selectBBox(e.querySelector('.sylTextRect-display'), n, this)
                : i.selectStaff(e, n);
          });
        }
        if (e.classList.contains('staff')) {
          let t = S[3].x,
            n = S[3].y;
          const i =
            t +
            100 +
            ',' +
            (n + 85) +
            ' ' +
            (t + 70) +
            ',' +
            (n + 50) +
            ' ' +
            (t + 100) +
            ',' +
            (n + 15) +
            ' ' +
            (t + 130) +
            ',' +
            (n + 50);
          (t = S[7].x), (n = S[7].y);
          const s =
            t -
            100 +
            ',' +
            (n - 15) +
            ' ' +
            (t - 130) +
            ',' +
            (n - 50) +
            ' ' +
            (t - 100) +
            ',' +
            (n - 85) +
            ' ' +
            (t - 70) +
            ',' +
            (n - 50);
          r
            .select('#' + e.id)
            .append('polygon')
            .attr('points', i)
            .attr('id', 'rotateRight')
            .attr('stroke', 'black')
            .attr('stroke-width', 7)
            .attr('fill', '#0099ff')
            .attr('class', 'rotatePoint'),
            r
              .select('#' + e.id)
              .append('polygon')
              .attr('points', s)
              .attr('id', 'rotateLeft')
              .attr('stroke', 'black')
              .attr('stroke-width', 7)
              .attr('fill', '#0099ff')
              .attr('class', 'rotatePoint'),
            r.select('#rotateLeft').call(
              r
                .drag()
                .on('start', I)
                .on('drag', function () {
                  const e = r.mouse(this)[1] - g,
                    t = b - Math.atan(e / m);
                  t > -0.2 &&
                    t < 0.2 &&
                    ((y = e),
                    (c = v + y),
                    (d = t),
                    d >= 0
                      ? ((c = y + S.filter((e) => e.name === o.TopLeft)[0].y),
                        (u = S.filter((e) => e.name === o.BottomRight)[0].y))
                      : ((c = S.filter((e) => e.name === o.TopRight)[0].y),
                        (u =
                          y + S.filter((e) => e.name === o.BottomLeft)[0].y))),
                    w();
                })
                .on('end', A)
            ),
            r.select('#rotateRight').call(
              r
                .drag()
                .on('start', I)
                .on('drag', function () {
                  const e = r.mouse(this)[1] - g,
                    t = b + Math.atan(e / m);
                  t > -0.2 &&
                    t < 0.2 &&
                    ((y = e),
                    (d = t),
                    d >= 0
                      ? ((u =
                          y + S.filter((e) => e.name === o.BottomRight)[0].y),
                        (c = S.filter((e) => e.name === o.TopLeft)[0].y))
                      : ((c = y + S.filter((e) => e.name === o.TopRight)[0].y),
                        (u = S.filter((e) => e.name === o.BottomLeft)[0].y))),
                    w();
                })
                .on('end', A)
            );
        }
      })();
    };
  },
  function (e, t) {
    e.exports = function (e) {
      return (
        e.webpackPolyfill ||
          ((e.deprecate = function () {}),
          (e.paths = []),
          e.children || (e.children = []),
          Object.defineProperty(e, 'loaded', {
            enumerable: !0,
            get: function () {
              return e.l;
            },
          }),
          Object.defineProperty(e, 'id', {
            enumerable: !0,
            get: function () {
              return e.i;
            },
          }),
          (e.webpackPolyfill = 1)),
        e
      );
    };
  },
  function (e, t, n) {
    (function (i) {
      function r() {
        var e;
        try {
          e = t.storage.debug;
        } catch (e) {}
        return !e && void 0 !== i && 'env' in i && (e = i.env.DEBUG), e;
      }
      ((t = e.exports = n(83)).log = function () {
        return (
          'object' == typeof console &&
          console.log &&
          Function.prototype.apply.call(console.log, console, arguments)
        );
      }),
        (t.formatArgs = function (e) {
          var n = this.useColors;
          if (
            ((e[0] =
              (n ? '%c' : '') +
              this.namespace +
              (n ? ' %c' : ' ') +
              e[0] +
              (n ? '%c ' : ' ') +
              '+' +
              t.humanize(this.diff)),
            !n)
          )
            return;
          var i = 'color: ' + this.color;
          e.splice(1, 0, i, 'color: inherit');
          var r = 0,
            o = 0;
          e[0].replace(/%[a-zA-Z%]/g, function (e) {
            '%%' !== e && (r++, '%c' === e && (o = r));
          }),
            e.splice(o, 0, i);
        }),
        (t.save = function (e) {
          try {
            null == e ? t.storage.removeItem('debug') : (t.storage.debug = e);
          } catch (e) {}
        }),
        (t.load = r),
        (t.useColors = function () {
          if (
            'undefined' != typeof window &&
            window.process &&
            'renderer' === window.process.type
          )
            return !0;
          return (
            ('undefined' != typeof document &&
              document.documentElement &&
              document.documentElement.style &&
              document.documentElement.style.WebkitAppearance) ||
            ('undefined' != typeof window &&
              window.console &&
              (window.console.firebug ||
                (window.console.exception && window.console.table))) ||
            ('undefined' != typeof navigator &&
              navigator.userAgent &&
              navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
              parseInt(RegExp.$1, 10) >= 31) ||
            ('undefined' != typeof navigator &&
              navigator.userAgent &&
              navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
          );
        }),
        (t.storage =
          'undefined' != typeof chrome && void 0 !== chrome.storage
            ? chrome.storage.local
            : (function () {
                try {
                  return window.localStorage;
                } catch (e) {}
              })()),
        (t.colors = [
          'lightseagreen',
          'forestgreen',
          'goldenrod',
          'dodgerblue',
          'darkorchid',
          'crimson',
        ]),
        (t.formatters.j = function (e) {
          try {
            return JSON.stringify(e);
          } catch (e) {
            return '[UnexpectedJSONParseError]: ' + e.message;
          }
        }),
        t.enable(r());
    }.call(this, n(16)));
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.initSelectionButtons =
        t.initInsertEditControls =
        t.bindInsertTabs =
          void 0);
    const i = n(10),
      r = n(18),
      o = n(5);
    function s(e, t) {
      document.getElementById(e).classList.add('is-active'),
        document.getElementById(e).classList.contains('insertel') &&
          t.insertActive(e);
    }
    function a(e) {
      document.querySelectorAll(e).forEach((e) => {
        e.classList.remove('is-active'), e.classList.remove('unfocused');
      });
    }
    (t.bindInsertTabs = function (e) {
      const t = Array.from(document.getElementsByClassName('insertTab')).map(
        (e) => e.id
      );
      document.body.addEventListener('keydown', (e) => {
        if (e.code.match(/^Digit\d$/) && e.shiftKey)
          try {
            const t = Number(e.code[e.code.length - 1]) - 1,
              n = document.getElementsByClassName('insertel');
            n[t].click();
          } catch (e) {
            console.debug(e);
          }
      }),
        t.forEach((t) => {
          document.getElementById(t).addEventListener('click', () => {
            a('.insertTab'),
              s(t, e),
              (document.getElementById('insert_data').innerHTML =
                i.insertTabHtml[t]),
              (function (e) {
                const t = Array.from(
                  document.getElementsByClassName('insertel')
                );
                t.map((e) => e.id).forEach((t) => {
                  document.getElementById(t).addEventListener('click', () => {
                    a('.insertel'), s(t, e);
                  });
                });
              })(e),
              a('.insertel');
            s(document.getElementsByClassName('insertel')[0].id, e);
          });
        });
    }),
      (t.initInsertEditControls = function () {
        const e = document.getElementById('insert_controls'),
          t = document.getElementById('insertMenu'),
          n = t.querySelector('.panel-heading-title'),
          i = document.getElementById('insertContents'),
          r = t.querySelector('svg > use'),
          o = document.getElementById('edit_controls'),
          s = document.getElementById('editMenu'),
          a = s.querySelector('.panel-heading-title'),
          c = document.getElementById('editContents'),
          l = s.querySelector('svg > use');
        e.addEventListener('click', () => {
          a.classList.remove('focused'),
            n.classList.add('focused'),
            document.querySelector('.insertel.is-active').click(),
            o
              .querySelector('.side-panel-btn.sel-by.is-active')
              .classList.add('unfocused'),
            e
              .querySelector('.side-panel-btn.insertel.is-active')
              .classList.remove('unfocused');
        }),
          o.addEventListener('click', () => {
            n.classList.remove('focused'),
              a.classList.add('focused'),
              e
                .querySelector('.side-panel-btn.insertel.is-active')
                .classList.add('unfocused'),
              o
                .querySelector('.side-panel-btn.sel-by.is-active')
                .classList.remove('unfocused');
          }),
          t.addEventListener('click', (e) => {
            e.stopPropagation(),
              i.classList.contains('closed')
                ? (i.classList.remove('closed'),
                  (i.style.padding = '0.5em 0.75em'),
                  setTimeout(() => {
                    i.style.overflow = 'visible';
                  }, 200),
                  r.setAttribute(
                    'xlink:href',
                    '/Neon/Neon-gh/assets/img/icons.svg#dropdown-down'
                  ))
                : (i.classList.add('closed'),
                  (i.style.overflow = 'hidden'),
                  setTimeout(() => {
                    i.style.padding = '0px';
                  }, 200),
                  r.setAttribute(
                    'xlink:href',
                    '/Neon/Neon-gh/assets/img/icons.svg#dropdown-side'
                  ));
          }),
          s.addEventListener('click', (e) => {
            e.stopPropagation(),
              c.classList.contains('closed')
                ? (c.classList.remove('closed'),
                  (c.style.padding = '0.5em 0.75em'),
                  setTimeout(() => {
                    c.style.overflow = 'visible';
                  }, 200),
                  l.setAttribute(
                    'xlink:href',
                    '/Neon/Neon-gh/assets/img/icons.svg#dropdown-down'
                  ))
                : (c.classList.add('closed'),
                  (c.style.overflow = 'hidden'),
                  setTimeout(() => {
                    c.style.padding = '0px';
                  }, 200),
                  l.setAttribute(
                    'xlink:href',
                    '/Neon/Neon-gh/assets/img/icons.svg#dropdown-side'
                  ));
          });
      }),
      (t.initSelectionButtons = function () {
        const e = document.getElementById('selBySyllable'),
          t = document.getElementById('selByNeume'),
          n = document.getElementById('selByNc'),
          i = document.getElementById('selByStaff'),
          s = document.getElementById('selByLayerElement');
        e.addEventListener('click', function () {
          if (!e.classList.contains('is-active')) {
            o.unselect(),
              (document.getElementById('moreEdit').innerHTML = ''),
              (document.getElementById('extraEdit').innerHTML = ''),
              document
                .getElementById('moreEdit')
                .parentElement.classList.add('hidden'),
              document
                .getElementById('extraEdit')
                .parentElement.classList.add('hidden'),
              e.classList.add('is-active'),
              t.classList.remove('is-active'),
              n.classList.remove('is-active'),
              i.classList.remove('is-active'),
              s.classList.remove('is-active');
            try {
              document
                .getElementById('selByBBox')
                .classList.remove('is-active');
            } catch (e) {}
            try {
              'highlight-selection' ===
                document.querySelector('.highlight-selected').id &&
                r.setGroupingHighlight('syllable');
            } catch (e) {}
          }
        }),
          t.addEventListener('click', function () {
            if (!t.classList.contains('is-active')) {
              o.unselect(),
                (document.getElementById('moreEdit').innerHTML = ''),
                (document.getElementById('extraEdit').innerHTML = ''),
                document
                  .getElementById('moreEdit')
                  .parentElement.classList.add('hidden'),
                document
                  .getElementById('extraEdit')
                  .parentElement.classList.add('hidden'),
                t.classList.add('is-active'),
                n.classList.remove('is-active'),
                e.classList.remove('is-active'),
                i.classList.remove('is-active'),
                s.classList.remove('is-active');
              try {
                document
                  .getElementById('selByBBox')
                  .classList.remove('is-active');
              } catch (e) {}
              try {
                'highlight-selection' ===
                  document.querySelector('.highlight-selected').id &&
                  r.setGroupingHighlight('neume');
              } catch (e) {}
            }
          }),
          n.addEventListener('click', function () {
            if (!n.classList.contains('is-active')) {
              o.unselect(),
                (document.getElementById('moreEdit').innerHTML = ''),
                (document.getElementById('extraEdit').innerHTML = ''),
                document
                  .getElementById('moreEdit')
                  .parentElement.classList.add('hidden'),
                document
                  .getElementById('extraEdit')
                  .parentElement.classList.add('hidden'),
                n.classList.add('is-active'),
                t.classList.remove('is-active'),
                e.classList.remove('is-active'),
                i.classList.remove('is-active'),
                s.classList.remove('is-active');
              try {
                document
                  .getElementById('selByBBox')
                  .classList.remove('is-active');
              } catch (e) {}
              try {
                'highlight-selection' ===
                  document.querySelector('.highlight-selected').id &&
                  r.setGroupingHighlight('neume');
              } catch (e) {}
            }
          }),
          i.addEventListener('click', function () {
            if (!i.classList.contains('is-active')) {
              o.unselect(),
                (document.getElementById('moreEdit').innerHTML = ''),
                (document.getElementById('extraEdit').innerHTML = ''),
                document
                  .getElementById('moreEdit')
                  .parentElement.classList.add('hidden'),
                document
                  .getElementById('extraEdit')
                  .parentElement.classList.add('hidden'),
                i.classList.add('is-active'),
                t.classList.remove('is-active'),
                n.classList.remove('is-active'),
                e.classList.remove('is-active'),
                s.classList.remove('is-active');
              try {
                document
                  .getElementById('selByBBox')
                  .classList.remove('is-active');
              } catch (e) {}
              try {
                'highlight-selection' ===
                  document.querySelector('.highlight-selected').id &&
                  r.setGroupingHighlight('staff');
              } catch (e) {}
            }
          }),
          s.addEventListener('click', function () {
            if (!s.classList.contains('is-active')) {
              o.unselect(),
                (document.getElementById('moreEdit').innerHTML = ''),
                (document.getElementById('extraEdit').innerHTML = ''),
                document
                  .getElementById('moreEdit')
                  .parentElement.classList.add('hidden'),
                document
                  .getElementById('extraEdit')
                  .parentElement.classList.add('hidden'),
                s.classList.add('is-active'),
                t.classList.remove('is-active'),
                n.classList.remove('is-active'),
                i.classList.remove('is-active'),
                e.classList.remove('is-active');
              try {
                document
                  .getElementById('selByBBox')
                  .classList.remove('is-active');
              } catch (e) {}
              try {
                'highlight-selection' ===
                  document.querySelector('.highlight-selected').id &&
                  r.setGroupingHighlight('layer');
              } catch (e) {}
            }
          }),
          document.body.addEventListener('keydown', (r) => {
            '1' === r.key && e.click(),
              '2' === r.key && t.click(),
              '3' === r.key && n.click(),
              '4' === r.key && i.click(),
              '5' === r.key && s.click();
          });
      });
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(8),
      r = n(20);
    t.default = class {
      constructor(e, t) {
        (this.firstClick = !0),
          (this.insertDisabled = function () {
            (this.type = ''),
              this.removeInsertClickHandlers(),
              document.body.removeEventListener(
                'keydown',
                this.keydownListener
              ),
              document.body.removeEventListener(
                'keyup',
                this.resetInsertHandler
              ),
              document.body.removeEventListener('click', this.clickawayHandler),
              (this.firstClick = !0);
            try {
              document.getElementById('returnToEditMode').remove();
            } catch (e) {}
            const e = document.getElementById('insert_controls'),
              t = document
                .getElementById('insertMenu')
                .querySelector('.panel-heading-title'),
              n = document.getElementById('edit_controls'),
              i = document
                .getElementById('editMenu')
                .querySelector('.panel-heading-title');
            t.classList.remove('focused'),
              i.classList.add('focused'),
              e
                .querySelector('.side-panel-btn.insertel.is-active')
                .classList.add('unfocused'),
              n
                .querySelector('.side-panel-btn.sel-by.is-active')
                .classList.remove('unfocused');
          }.bind(this)),
          (this.clickawayHandler = function (e) {
            const t = e.target;
            null === t.closest('.active-page') &&
              null === t.closest('#insert_controls') &&
              null === t.closest('#svg_group') &&
              (this.insertDisabled(),
              document.body.removeEventListener('keydown', this.staffHandler),
              document.body.removeEventListener('keydown', this.handler));
          }.bind(this)),
          (this.resetInsertHandler = function (e) {
            'Shift' === e.key &&
              document
                .querySelector(this.selector)
                .addEventListener(
                  'click',
                  'staff' === this.type ? this.staffHandler : this.handler
                );
          }.bind(this)),
          (this.keydownListener = function (e) {
            'Escape' === e.key
              ? (this.insertDisabled(),
                document.body.removeEventListener('keydown', this.staffHandler),
                document.body.removeEventListener('keydown', this.handler))
              : 'Shift' === e.key && this.removeInsertClickHandlers();
          }.bind(this)),
          (this.handler = function (e) {
            e.stopPropagation();
            const t = r.getSVGRelCoords(e.clientX, e.clientY),
              n = {
                action: 'insert',
                param: {
                  elementType: this.type,
                  staffId: 'auto',
                  ulx: t.x,
                  uly: t.y,
                },
              };
            null !== this.attributes &&
              ((n.param.attributes = this.attributes),
              'F' === this.attributes.shape && (n.param.ulx -= 50)),
              this.neonView
                .edit(n, this.neonView.view.getCurrentPageURI())
                .then(() => this.neonView.updateForCurrentPage())
                .then(() => {
                  document
                    .querySelector(this.selector)
                    .addEventListener('click', this.handler);
                });
          }.bind(this)),
          (this.staffHandler = function (e) {
            const t = document.querySelector(
                '.active-page > .definition-scale'
              ),
              n = r.getSVGRelCoords(e.clientX, e.clientY);
            if (this.firstClick)
              (this.coord = n),
                i
                  .select(t)
                  .append('circle')
                  .attr('cx', n.x)
                  .attr('cy', n.y)
                  .attr('r', 10)
                  .attr('id', 'staff-circle')
                  .attr('fill', 'green'),
                (this.firstClick = !1);
            else {
              let e, t;
              n.x < this.coord.x || n.y < this.coord.y
                ? ((e = n), (t = this.coord))
                : ((e = this.coord), (t = n)),
                document.getElementById('staff-circle').remove();
              const i = {
                action: 'insert',
                param: {
                  elementType: 'staff',
                  staffId: 'auto',
                  ulx: e.x,
                  uly: e.y,
                  lrx: t.x,
                  lry: t.y,
                },
              };
              this.neonView
                .edit(i, this.neonView.view.getCurrentPageURI())
                .then(() => {
                  this.neonView.updateForCurrentPage(), (this.firstClick = !0);
                });
            }
          }.bind(this)),
          (this.removeInsertClickHandlers = function () {
            try {
              document
                .querySelector(this.selector)
                .removeEventListener('click', this.staffHandler),
                document
                  .querySelector(this.selector)
                  .removeEventListener('click', this.handler);
            } catch (e) {}
          }.bind(this)),
          (this.neonView = e),
          (this.selector = t);
      }
      insertActive(e) {
        const t = this.isInsertMode();
        switch (e) {
          case 'punctum':
            (this.type = 'nc'), (this.attributes = null);
            break;
          case 'diamond':
            (this.type = 'nc'), (this.attributes = { tilt: 'se' });
            break;
          case 'virga':
            (this.type = 'nc'), (this.attributes = { tilt: 's' });
            break;
          case 'liquescentA':
            (this.type = 'nc'), (this.attributes = { curve: 'a' });
            break;
          case 'liquescentC':
            (this.type = 'nc'), (this.attributes = { curve: 'c' });
            break;
          case 'virgaReversed':
            (this.type = 'nc'), (this.attributes = { tilt: 'n' });
            break;
          case 'pes':
          case 'clivis':
          case 'scandicus':
          case 'climacus':
          case 'torculus':
          case 'porrectus':
          case 'pressus':
            const t = this.neonView.info.getContourByValue(
              e.charAt(0).toUpperCase() + e.slice(1)
            );
            (this.type = 'grouping'), (this.attributes = { contour: t });
            break;
          case 'cClef':
          case 'fClef':
            (this.type = 'clef'),
              (this.attributes = { shape: e.charAt(0).toUpperCase() });
            break;
          case 'custos':
            (this.type = 'custos'), (this.attributes = null);
            break;
          case 'divLineMaxima':
            (this.type = 'divLine'), (this.attributes = { form: 'maxima' });
            break;
          case 'staff':
            (this.type = 'staff'), (this.attributes = null);
            break;
          case 'flat':
            (this.type = 'accid'), (this.attributes = { accid: 'f' });
            break;
          case 'natural':
            (this.type = 'accid'), (this.attributes = { accid: 'n' });
            break;
          default:
            return (
              (this.type = ''),
              (this.attributes = null),
              void console.error('Invalid button for insertion: ' + e + '.')
            );
        }
        this.removeInsertClickHandlers();
        try {
          'staff' === this.type
            ? document
                .querySelector(this.selector)
                .addEventListener('click', this.staffHandler)
            : document
                .querySelector(this.selector)
                .addEventListener('click', this.handler);
        } catch (e) {}
        if (
          (document.body.addEventListener('keydown', this.keydownListener),
          document.body.addEventListener('keyup', this.resetInsertHandler),
          !t)
        ) {
          const e = document.createElement('button');
          (e.id = 'returnToEditMode'),
            e.classList.add('side-panel-btn'),
            (e.innerHTML = 'Return to Edit Mode'),
            document.getElementById('redo').parentNode.appendChild(e),
            e.addEventListener('click', this.insertDisabled);
        }
        document
          .getElementById('editContents')
          .addEventListener('click', this.clickawayHandler);
      }
      isInsertMode() {
        return '' !== this.type;
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.undoRedoPanel =
        t.navbarFinalize =
        t.navbarDropdownMEIActionsMenu =
        t.navbarDropdownFileMenu =
          void 0),
      (t.navbarDropdownFileMenu = document.createElement('div')),
      t.navbarDropdownFileMenu.classList.add(
        'navbar-item',
        'has-dropdown',
        'is-hoverable'
      );
    const i = document.createElement('div');
    i.classList.add('navbar-btn'),
      (i.innerHTML =
        '<div>File</div>\n  <img class="navbar-dropdown-icon" src="/Neon/assets/img/dropdown_icon_white.svg">');
    const r = document.createElement('div');
    r.classList.add('navbar-dropdown'), (r.id = 'navbar-dropdown-options');
    [
      ['save', 'Save'],
      ['export', 'Save and Export to File'],
      ['getmei', 'Download MEI'],
    ].forEach((e) => {
      const t = document.createElement('div');
      (t.id = e[0]),
        t.classList.add('navbar-dropdown-item'),
        (t.textContent = e[1]),
        r.appendChild(t);
    }),
      t.navbarDropdownFileMenu.appendChild(i),
      t.navbarDropdownFileMenu.appendChild(r),
      (t.navbarDropdownMEIActionsMenu = document.createElement('div')),
      t.navbarDropdownMEIActionsMenu.classList.add(
        'navbar-item',
        'has-dropdown',
        'is-hoverable'
      );
    const o = document.createElement('div');
    o.classList.add('navbar-btn'),
      (o.innerHTML =
        '<div>MEI Actions</div>\n  <img class="navbar-dropdown-icon" src="/Neon/assets/img/dropdown_icon_white.svg">');
    const s = document.createElement('div');
    s.classList.add('navbar-dropdown'), (s.id = 'navbar-dropdown-options');
    [
      ['remove-empty-syls', 'Remove Empty Syllables'],
      ['remove-empty-neumes', 'Remove Empty Neumes'],
      ['revert', 'Revert'],
    ].forEach((e) => {
      const t = document.createElement('div');
      (t.id = e[0]),
        t.classList.add('navbar-dropdown-item'),
        (t.textContent = e[1]),
        s.appendChild(t);
    }),
      t.navbarDropdownMEIActionsMenu.appendChild(o),
      t.navbarDropdownMEIActionsMenu.appendChild(s),
      (t.navbarFinalize =
        '<a id="finalize" class="navbar-item"> Finalize MEI </a>'),
      (t.undoRedoPanel =
        '<button class="side-panel-btn" id="undo">Undo</button>\n  <button class="side-panel-btn" id="redo">Redo</button>');
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.initUndoRedoPanel = t.initNavbar = void 0);
    const i = n(7),
      r = n(45);
    (t.initNavbar = function (e) {
      const t = document.querySelectorAll(
        '.navbar-item.has-dropdown.is-hoverable'
      );
      Array.from(t).forEach((e) => {
        e.addEventListener('mouseover', () => {});
      }),
        document.getElementById('save').addEventListener('click', () => {
          e.save().then(() => {
            i.queueNotification('Saved');
          });
        }),
        document.body.addEventListener('keydown', (t) => {
          's' === t.key &&
            e.save().then(() => {
              i.queueNotification('Saved');
            });
        }),
        document.getElementById('export').addEventListener('click', () => {
          e.export().then((t) => {
            const n = document.createElement('a');
            (n.href = t),
              (n.download = e.name + '.jsonld'),
              document.body.appendChild(n),
              n.click(),
              n.remove(),
              i.queueNotification('Saved');
          });
        }),
        document.getElementById('getmei').addEventListener('click', () => {
          const t = e.view.getCurrentPageURI();
          e.getPageMEI(t).then((t) => {
            const n =
              'data:application/mei+xml;base64,' +
              window.btoa(r.convertStaffToSb(t));
            document.getElementById('getmei').setAttribute('href', n),
              document
                .getElementById('getmei')
                .setAttribute('download', e.view.getPageName() + '.mei');
          });
        }),
        document
          .getElementById('remove-empty-syls')
          .addEventListener('click', function () {
            const t = e.view.getCurrentPageURI();
            e.getPageMEI(t).then((n) => {
              const r = new DOMParser().parseFromString(
                  n,
                  'text/xml'
                ).documentElement,
                o = Array.from(r.getElementsByTagName('syllable'));
              let s = !1;
              const a = [];
              for (const e of o)
                if (0 === e.getElementsByTagName('neume').length) {
                  const t = {
                    action: 'remove',
                    param: { elementId: e.getAttribute('xml:id') },
                  };
                  a.push(t), (s = !0);
                }
              if (s) {
                const n = { action: 'chain', param: a };
                e.edit(n, t).then((t) => {
                  t
                    ? (e.updateForCurrentPage(),
                      i.queueNotification('Removed empty Syllables'))
                    : i.queueNotification('Failed to remove empty Syllables');
                });
              } else i.queueNotification('No empty syllables found');
            });
          }),
        document
          .getElementById('remove-empty-neumes')
          .addEventListener('click', function () {
            const t = e.view.getCurrentPageURI();
            e.getPageMEI(t).then((n) => {
              const r = new DOMParser().parseFromString(
                  n,
                  'text/xml'
                ).documentElement,
                o = Array.from(r.getElementsByTagName('neume'));
              let s = !1;
              const a = [];
              for (const e of o)
                if (0 === e.getElementsByTagName('nc').length) {
                  const t = {
                    action: 'remove',
                    param: { elementId: e.getAttribute('xml:id') },
                  };
                  a.push(t), (s = !0);
                }
              if (s) {
                const n = { action: 'chain', param: a };
                e.edit(n, t).then((t) => {
                  t
                    ? (e.updateForCurrentPage(),
                      i.queueNotification('Removed empty Neumes'))
                    : i.queueNotification('Failed to remove empty Neumes');
                });
              } else i.queueNotification('No empty Neumes found');
            });
          }),
        document
          .getElementById('revert')
          .addEventListener('click', function () {
            window.confirm(
              'Reverting will cause all changes to be lost. Press OK to continue.'
            ) &&
              e.deleteDb().then(() => {
                window.location.reload();
              });
          });
    }),
      (t.initUndoRedoPanel = function (e) {
        function t() {
          e.undo().then((t) => {
            t
              ? e.updateForCurrentPage()
              : console.error('Failed to undo action');
          });
        }
        function n() {
          e.redo().then((t) => {
            t
              ? e.updateForCurrentPage()
              : console.error('Failed to redo action');
          });
        }
        document.getElementById('undo').addEventListener('click', t),
          document.body.addEventListener('keydown', (e) => {
            'z' === e.key && (e.ctrlKey || e.metaKey) && t();
          }),
          document.getElementById('redo').addEventListener('click', n),
          document.body.addEventListener('keydown', (e) => {
            ('Z' === e.key || ('z' === e.key && e.shiftKey)) &&
              (e.ctrlKey || e.metaKey) &&
              n();
          });
      });
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function (e, t, n) {
    'use strict';
    n.r(t);
    var i = n(36),
      r = n.n(i),
      o = n(37),
      s = n.n(o),
      a = n(38),
      c = n.n(a),
      l = n(39),
      u = n.n(l),
      d = n(40),
      h = n.n(d),
      f = n(41),
      p = n.n(f),
      g = n(42),
      v = n.n(g),
      m = n(43),
      y = n.n(m),
      b = n(44),
      w = n.n(b),
      _ = n(14);
    let E = L('manifest'),
      S = 'manifests/' + E + '.jsonld',
      x = L('storage');
    if (E)
      window
        .fetch(S)
        .then((e) => {
          if (e.ok) return e.text();
          throw new Error(e.statusText);
        })
        .then(async (e) => {
          let t;
          try {
            t = JSON.parse(e);
          } catch (t) {
            return console.error(t), void console.debug(e);
          }
          let n = {
            manifest: t,
            Display: s.a,
            Info: v.a,
            TextView: y.a,
            TextEdit: w.a,
          };
          (
            await new Promise((e, n) => {
              window
                .fetch(t.image)
                .then((t) => {
                  e(t.headers.get('Content-Type'));
                })
                .catch((e) => {
                  n(e);
                });
            })
          ).match(/image\/*/)
            ? ((n.View = u.a), (n.NeumeEdit = p.a))
            : ((n.View = c.a), (n.NeumeEdit = h.a)),
            new r.a(n).start();
        });
    else {
      new _.default('Neon-User-Storage')
        .getAttachment(x, 'manifest')
        .then((e) => new window.Response(e).json())
        .then(async (e) => {
          console.log(e);
          let t = {
            manifest: e,
            Display: s.a,
            Info: v.a,
            TextView: y.a,
            TextEdit: w.a,
          };
          (
            await new Promise((t, n) => {
              window
                .fetch(e.image)
                .then((e) => {
                  t(e.headers.get('Content-Type'));
                })
                .catch((e) => {
                  n(e);
                });
            })
          ).match(/image\/*/)
            ? ((t.View = u.a), (t.NeumeEdit = p.a))
            : ((t.View = c.a), (t.NeumeEdit = h.a)),
            new r.a(t).start();
        });
    }
    function L(e) {
      let t = null,
        n = [];
      return (
        window.location.search
          .substr(1)
          .split('&')
          .forEach((i) => {
            (n = i.split('=')), n[0] === e && (t = decodeURIComponent(n[1]));
          }),
        t
      );
    }
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(45),
      r = n(46),
      o = n(68),
      s = n(31),
      a = n(14);
    t.default = class {
      constructor(e) {
        (this.verovioWrapper = new o.default()),
          (this.undoStacks = new Map()),
          (this.redoStacks = new Map()),
          (this.neonCache = new Map()),
          (this.parser = new DOMParser()),
          (this.db = new a.default('Neon')),
          (this.blankPages = []),
          (this.manifest = e),
          (this.annotations = e.mei_annotations),
          (this.lastPageLoaded = '');
      }
      getAnnotations() {
        return this.annotations;
      }
      async initDb(e = !1) {
        return await new Promise((t, n) => {
          this.db
            .get(this.manifest['@id'])
            .catch((e) => {
              if ('not_found' === e.name) {
                const e = {
                  _id: this.manifest['@id'],
                  timestamp: this.manifest.timestamp,
                  image: this.manifest.image,
                  title: this.manifest.title,
                  annotations: [],
                };
                return (
                  this.annotations.forEach((t) => {
                    e.annotations.push(t.id);
                  }),
                  e
                );
              }
              return console.error(e), n(e);
            })
            .then(async (i) => {
              const r = /(.+[-+\u2212]\d\d)(\d\d)$/;
              if (
                new Date(i.timestamp).getTime() >
                  (r.test(this.manifest.timestamp)
                    ? new Date(
                        this.manifest.timestamp.replace(r, '$1:$2')
                      ).getTime()
                    : new Date(this.manifest.timestamp).getTime()) &&
                !e
              ) {
                this.annotations = [];
                const e = i.annotations.map(
                  (e) =>
                    new Promise((t) => {
                      this.db
                        .get(e)
                        .then((e) => {
                          this.annotations.push({
                            id: e._id,
                            type: 'Annotation',
                            body: e.body,
                            target: e.target,
                          }),
                            t('');
                        })
                        .catch((e) => {
                          console.error(e), t('');
                        });
                    })
                );
                return await Promise.all(e), t(!1);
              }
              for (const e of this.annotations)
                await this.db
                  .get(e.id)
                  .catch((t) =>
                    'not_found' === t.name
                      ? { _id: e.id }
                      : (console.error(t), n(t))
                  )
                  .then(
                    (t) => (
                      (t.body = e.body), (t.target = e.target), this.db.put(t)
                    )
                  )
                  .catch((e) => {
                    n(e), console.error(e);
                  });
              return this.db.put(i);
            })
            .then(() => t(!0))
            .catch((e) => {
              n(e), console.error(e);
            });
        });
      }
      loadPage(e) {
        return new Promise((t, n) => {
          if (this.lastPageLoaded === e && this.neonCache.has(e))
            t(this.neonCache.get(e));
          else if (this.neonCache.has(e))
            this.loadData(e, this.neonCache.get(e).mei).then(() => {
              t(this.neonCache.get(e));
            });
          else if (this.blankPages.includes(e)) {
            r.blankPage();
            const t = new Error('No MEI file for page ' + e);
            (t.name = 'missing_mei'), n(t);
          } else {
            const o = this.annotations.find((t) => t.target === e);
            o
              ? window
                  .fetch(o.body)
                  .then((e) => {
                    if (e.ok) return e.text();
                    throw new Error(e.statusText);
                  })
                  .then((n) => {
                    n.match(/<sb .+>/) && (n = i.convertSbToStaff(n)),
                      this.loadData(e, n).then(() => {
                        t(this.neonCache.get(e));
                      });
                  })
                  .catch((e) => {
                    n(e);
                  })
              : (r.blankPage(), this.blankPages.push(e));
          }
        });
      }
      loadData(e, t, n = !1) {
        return (
          r.sendForValidation(t),
          (this.lastPageLoaded = e),
          new Promise((i) => {
            const r = { id: s.uuidv4(), action: 'renderData', mei: t };
            this.verovioWrapper.addEventListener(
              'message',
              function o(s) {
                if (s.data.id === r.id) {
                  const r = this.parser.parseFromString(
                    s.data.svg,
                    'image/svg+xml'
                  ).documentElement;
                  this.neonCache.set(e, { svg: r, mei: t, dirty: n }),
                    s.target.removeEventListener('message', o),
                    i();
                }
              }.bind(this)
            ),
              this.verovioWrapper.postMessage(r);
          })
        );
      }
      getSVG(e) {
        return new Promise((t, n) => {
          this.loadPage(e)
            .then((e) => {
              t(e.svg);
            })
            .catch((e) => {
              n(e);
            });
        });
      }
      getMEI(e) {
        return new Promise((t, n) => {
          this.loadPage(e)
            .then((e) => {
              t(e.mei);
            })
            .catch((e) => {
              n(e);
            });
        });
      }
      getElementAttr(e, t) {
        return new Promise((n) => {
          this.loadPage(t).then(() => {
            const t = {
              id: s.uuidv4(),
              action: 'getElementAttr',
              elementId: e,
            };
            this.verovioWrapper.addEventListener('message', function e(i) {
              i.data.id === t.id &&
                (i.target.removeEventListener('message', e),
                n(i.data.attributes));
            }),
              this.verovioWrapper.postMessage(t);
          });
        });
      }
      edit(e, t) {
        let n;
        return (
          (n =
            this.lastPageLoaded === t
              ? Promise.resolve(this.neonCache.get(t))
              : this.loadPage(t)),
          new Promise((i) => {
            n.then((n) => {
              n.svg = null;
              const r = n.mei,
                o = { id: s.uuidv4(), action: 'edit', editorAction: e };
              this.verovioWrapper.addEventListener(
                'message',
                function e(n) {
                  n.data.id === o.id &&
                    (n.data.result &&
                      (this.undoStacks.has(t) || this.undoStacks.set(t, []),
                      this.undoStacks.get(t).push(r),
                      this.redoStacks.set(t, [])),
                    n.target.removeEventListener('message', e),
                    this.updateCache(t, !0).then(() => {
                      i(n.data.result);
                    }));
                }.bind(this)
              ),
                this.verovioWrapper.postMessage(o);
            });
          })
        );
      }
      updateCache(e, t) {
        return new Promise((n) => {
          let i, o;
          const a = new Promise((e) => {
              const t = { id: s.uuidv4(), action: 'getMEI' };
              this.verovioWrapper.addEventListener('message', function n(o) {
                o.data.id === t.id &&
                  ((i = o.data.mei),
                  o.target.removeEventListener('message', n),
                  r.sendForValidation(i),
                  e(''));
              }),
                this.verovioWrapper.postMessage(t);
            }),
            c = new Promise((e) => {
              const t = { id: s.uuidv4(), action: 'renderToSVG' };
              this.verovioWrapper.addEventListener('message', function n(i) {
                i.data.id === t.id &&
                  ((o = i.data.svg),
                  i.target.removeEventListener('message', n),
                  e(''));
              }),
                this.verovioWrapper.postMessage(t);
            });
          a.then(() => c).then(() => {
            const r = this.parser.parseFromString(
              o,
              'image/svg+xml'
            ).documentElement;
            this.neonCache.set(e, { mei: i, svg: r, dirty: t }), n();
          });
        });
      }
      info(e) {
        let t;
        return (
          (t =
            this.lastPageLoaded === e ? Promise.resolve() : this.loadPage(e)),
          new Promise((e) => {
            t.then(() => {
              const t = { id: s.uuidv4(), action: 'editInfo' };
              this.verovioWrapper.addEventListener('message', function n(i) {
                i.data.id === t.id &&
                  (i.target.removeEventListener('message', n), e(i.data.info));
              }),
                this.verovioWrapper.postMessage(t);
            });
          })
        );
      }
      undo(e) {
        return new Promise((t) => {
          if (this.undoStacks.has(e)) {
            const n = this.undoStacks.get(e).pop();
            if (void 0 !== n)
              return void this.getMEI(e)
                .then(
                  (t) => (
                    this.redoStacks.get(e).push(t), this.loadData(e, n, !0)
                  )
                )
                .then(() => {
                  t(!0);
                });
          }
          t(!1);
        });
      }
      redo(e) {
        return new Promise((t) => {
          if (this.redoStacks.has(e)) {
            const n = this.redoStacks.get(e).pop();
            if (void 0 !== n)
              return void this.getMEI(e)
                .then(
                  (t) => (
                    this.undoStacks.get(e).push(t), this.loadData(e, n, !0)
                  )
                )
                .then(() => {
                  t(!0);
                });
          }
          t(!1);
        });
      }
      async updateDatabase() {
        let e = !1;
        for (const t of this.neonCache) {
          const n = t[0],
            i = t[1];
          if (i.dirty) {
            e = !0;
            const t = this.annotations.findIndex((e) => e.target === n);
            let r;
            this.annotations[t].body.match(/^data:/)
              ? (r = 'data:application/mei+xml;base64,' + window.btoa(i.mei))
              : await window
                  .fetch(this.annotations[t].body, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/mei+xml' },
                    body: i.mei,
                  })
                  .then((e) => {
                    r = e.ok
                      ? this.annotations[t].body
                      : 'data:application/mei+xml;base64,' + window.btoa(i.mei);
                  })
                  .catch((e) => {
                    console.error(e),
                      console.warn('Falling back to data URI'),
                      (r =
                        'data:application/mei+xml;base64,' +
                        window.btoa(i.mei));
                  }),
              (this.annotations[t].body = r),
              await this.db
                .get(this.annotations[t].id)
                .then((e) => ((e.body = r), this.db.put(e)))
                .then(() => {
                  i.dirty = !1;
                })
                .catch((e) => {
                  console.error(e);
                });
          }
        }
        e &&
          (await this.db
            .get(this.manifest['@id'])
            .then(
              (e) => ((e.timestamp = new Date().toISOString()), this.db.put(e))
            )
            .catch((e) => {
              console.error(e);
            }));
      }
      async deleteDb() {
        const e = await this.db
          .get(this.manifest['@id'])
          .then((e) => e.annotations);
        e.push(this.manifest['@id']);
        const t = e.map(
          (e) =>
            new Promise((t) => {
              this.db
                .get(e)
                .then((e) => this.db.remove(e))
                .then(() => t());
            })
        );
        return Promise.all(t);
      }
    };
  },
  function (e, t) {
    /**
     * vkBeautify - javascript plugin to pretty-print or minify text in XML, JSON, CSS and SQL formats.
     *
     * Copyright (c) 2012 Vadim Kiryukhin
     * vkiryukhin @ gmail.com
     * http://www.eslinstructor.net/vkbeautify/
     *
     * Dual licensed under the MIT and GPL licenses:
     *   http://www.opensource.org/licenses/mit-license.php
     *   http://www.gnu.org/licenses/gpl.html
     *
     *   Pretty print
     *
     *        vkbeautify.xml(text [,indent_pattern]);
     *        vkbeautify.json(text [,indent_pattern]);
     *        vkbeautify.css(text [,indent_pattern]);
     *        vkbeautify.sql(text [,indent_pattern]);
     *
     *        @text - String; text to beatufy;
     *        @indent_pattern - Integer | String;
     *                Integer:  number of white spaces;
     *                String:   character string to visualize indentation ( can also be a set of white spaces )
     *   Minify
     *
     *        vkbeautify.xmlmin(text [,preserve_comments]);
     *        vkbeautify.jsonmin(text);
     *        vkbeautify.cssmin(text [,preserve_comments]);
     *        vkbeautify.sqlmin(text);
     *
     *        @text - String; text to minify;
     *        @preserve_comments - Bool; [optional];
     *                Set this flag to true to prevent removing comments from @text ( minxml and mincss functions only. )
     *
     *   Examples:
     *        vkbeautify.xml(text); // pretty print XML
     *        vkbeautify.json(text, 4 ); // pretty print JSON
     *        vkbeautify.css(text, '. . . .'); // pretty print CSS
     *        vkbeautify.sql(text, '----'); // pretty print SQL
     *
     *        vkbeautify.xmlmin(text, true);// minify XML, preserve comments
     *        vkbeautify.jsonmin(text);// minify JSON
     *        vkbeautify.cssmin(text);// minify CSS, remove comments ( default )
     *        vkbeautify.sqlmin(text);// minify SQL
     *
     */
    function n(e) {
      var t = '    ';
      if (isNaN(parseInt(e))) t = e;
      else
        switch (e) {
          case 1:
            t = ' ';
            break;
          case 2:
            t = '  ';
            break;
          case 3:
            t = '   ';
            break;
          case 4:
            t = '    ';
            break;
          case 5:
            t = '     ';
            break;
          case 6:
            t = '      ';
            break;
          case 7:
            t = '       ';
            break;
          case 8:
            t = '        ';
            break;
          case 9:
            t = '         ';
            break;
          case 10:
            t = '          ';
            break;
          case 11:
            t = '           ';
            break;
          case 12:
            t = '            ';
        }
      for (var n = ['\n'], i = 0; i < 100; i++) n.push(n[i] + t);
      return n;
    }
    function i() {
      (this.step = '    '), (this.shift = n(this.step));
    }
    function r(e, t) {
      return t - (e.replace(/\(/g, '').length - e.replace(/\)/g, '').length);
    }
    function o(e, t) {
      return e
        .replace(/\s{1,}/g, ' ')
        .replace(/ AND /gi, '~::~' + t + t + 'AND ')
        .replace(/ BETWEEN /gi, '~::~' + t + 'BETWEEN ')
        .replace(/ CASE /gi, '~::~' + t + 'CASE ')
        .replace(/ ELSE /gi, '~::~' + t + 'ELSE ')
        .replace(/ END /gi, '~::~' + t + 'END ')
        .replace(/ FROM /gi, '~::~FROM ')
        .replace(/ GROUP\s{1,}BY/gi, '~::~GROUP BY ')
        .replace(/ HAVING /gi, '~::~HAVING ')
        .replace(/ IN /gi, ' IN ')
        .replace(/ JOIN /gi, '~::~JOIN ')
        .replace(/ CROSS~::~{1,}JOIN /gi, '~::~CROSS JOIN ')
        .replace(/ INNER~::~{1,}JOIN /gi, '~::~INNER JOIN ')
        .replace(/ LEFT~::~{1,}JOIN /gi, '~::~LEFT JOIN ')
        .replace(/ RIGHT~::~{1,}JOIN /gi, '~::~RIGHT JOIN ')
        .replace(/ ON /gi, '~::~' + t + 'ON ')
        .replace(/ OR /gi, '~::~' + t + t + 'OR ')
        .replace(/ ORDER\s{1,}BY/gi, '~::~ORDER BY ')
        .replace(/ OVER /gi, '~::~' + t + 'OVER ')
        .replace(/\(\s{0,}SELECT /gi, '~::~(SELECT ')
        .replace(/\)\s{0,}SELECT /gi, ')~::~SELECT ')
        .replace(/ THEN /gi, ' THEN~::~' + t)
        .replace(/ UNION /gi, '~::~UNION~::~')
        .replace(/ USING /gi, '~::~USING ')
        .replace(/ WHEN /gi, '~::~' + t + 'WHEN ')
        .replace(/ WHERE /gi, '~::~WHERE ')
        .replace(/ WITH /gi, '~::~WITH ')
        .replace(/ ALL /gi, ' ALL ')
        .replace(/ AS /gi, ' AS ')
        .replace(/ ASC /gi, ' ASC ')
        .replace(/ DESC /gi, ' DESC ')
        .replace(/ DISTINCT /gi, ' DISTINCT ')
        .replace(/ EXISTS /gi, ' EXISTS ')
        .replace(/ NOT /gi, ' NOT ')
        .replace(/ NULL /gi, ' NULL ')
        .replace(/ LIKE /gi, ' LIKE ')
        .replace(/\s{0,}SELECT /gi, 'SELECT ')
        .replace(/\s{0,}UPDATE /gi, 'UPDATE ')
        .replace(/ SET /gi, ' SET ')
        .replace(/~::~{1,}/g, '~::~')
        .split('~::~');
    }
    (i.prototype.xml = function (e, t) {
      var i = e
          .replace(/>\s{0,}</g, '><')
          .replace(/</g, '~::~<')
          .replace(/\s*xmlns\:/g, '~::~xmlns:')
          .replace(/\s*xmlns\=/g, '~::~xmlns=')
          .split('~::~'),
        r = i.length,
        o = !1,
        s = 0,
        a = '',
        c = 0,
        l = t ? n(t) : this.shift;
      for (c = 0; c < r; c++)
        i[c].search(/<!/) > -1
          ? ((a += l[s] + i[c]),
            (o = !0),
            (i[c].search(/-->/) > -1 ||
              i[c].search(/\]>/) > -1 ||
              i[c].search(/!DOCTYPE/) > -1) &&
              (o = !1))
          : i[c].search(/-->/) > -1 || i[c].search(/\]>/) > -1
          ? ((a += i[c]), (o = !1))
          : /^<\w/.exec(i[c - 1]) &&
            /^<\/\w/.exec(i[c]) &&
            /^<[\w:\-\.\,]+/.exec(i[c - 1]) ==
              /^<\/[\w:\-\.\,]+/.exec(i[c])[0].replace('/', '')
          ? ((a += i[c]), o || s--)
          : i[c].search(/<\w/) > -1 &&
            -1 == i[c].search(/<\//) &&
            -1 == i[c].search(/\/>/)
          ? (a = a += o ? i[c] : l[s++] + i[c])
          : i[c].search(/<\w/) > -1 && i[c].search(/<\//) > -1
          ? (a = a += o ? i[c] : l[s] + i[c])
          : i[c].search(/<\//) > -1
          ? (a = a += o ? i[c] : l[--s] + i[c])
          : i[c].search(/\/>/) > -1
          ? (a = a += o ? i[c] : l[s] + i[c])
          : i[c].search(/<\?/) > -1 ||
            i[c].search(/xmlns\:/) > -1 ||
            i[c].search(/xmlns\=/) > -1
          ? (a += l[s] + i[c])
          : (a += i[c]);
      return '\n' == a[0] ? a.slice(1) : a;
    }),
      (i.prototype.json = function (e, t) {
        t = t || this.step;
        return 'undefined' == typeof JSON
          ? e
          : 'string' == typeof e
          ? JSON.stringify(JSON.parse(e), null, t)
          : 'object' == typeof e
          ? JSON.stringify(e, null, t)
          : e;
      }),
      (i.prototype.css = function (e, t) {
        var i = e
            .replace(/\s{1,}/g, ' ')
            .replace(/\{/g, '{~::~')
            .replace(/\}/g, '~::~}~::~')
            .replace(/\;/g, ';~::~')
            .replace(/\/\*/g, '~::~/*')
            .replace(/\*\//g, '*/~::~')
            .replace(/~::~\s{0,}~::~/g, '~::~')
            .split('~::~'),
          r = i.length,
          o = 0,
          s = '',
          a = 0,
          c = t ? n(t) : this.shift;
        for (a = 0; a < r; a++)
          /\{/.exec(i[a])
            ? (s += c[o++] + i[a])
            : /\}/.exec(i[a])
            ? (s += c[--o] + i[a])
            : (/\*\\/.exec(i[a]), (s += c[o] + i[a]));
        return s.replace(/^\n{1,}/, '');
      }),
      (i.prototype.sql = function (e, t) {
        var i = e
            .replace(/\s{1,}/g, ' ')
            .replace(/\'/gi, "~::~'")
            .split('~::~'),
          s = i.length,
          a = [],
          c = 0,
          l = this.step,
          u = 0,
          d = '',
          h = 0,
          f = t ? n(t) : this.shift;
        for (h = 0; h < s; h++)
          a = h % 2 ? a.concat(i[h]) : a.concat(o(i[h], l));
        for (s = a.length, h = 0; h < s; h++) {
          (u = r(a[h], u)),
            /\s{0,}\s{0,}SELECT\s{0,}/.exec(a[h]) &&
              (a[h] = a[h].replace(/\,/g, ',\n' + l + l)),
            /\s{0,}\s{0,}SET\s{0,}/.exec(a[h]) &&
              (a[h] = a[h].replace(/\,/g, ',\n' + l + l)),
            /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(a[h])
              ? (d += f[++c] + a[h])
              : /\'/.exec(a[h])
              ? (u < 1 && c && c--, (d += a[h]))
              : ((d += f[c] + a[h]), u < 1 && c && c--);
        }
        return (d = d.replace(/^\n{1,}/, '').replace(/\n{1,}/g, '\n'));
      }),
      (i.prototype.xmlmin = function (e, t) {
        return (
          t
            ? e
            : e
                .replace(
                  /\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,
                  ''
                )
                .replace(/[ \r\n\t]{1,}xmlns/g, ' xmlns')
        ).replace(/>\s{0,}</g, '><');
      }),
      (i.prototype.jsonmin = function (e) {
        return 'undefined' == typeof JSON
          ? e
          : JSON.stringify(JSON.parse(e), null, 0);
      }),
      (i.prototype.cssmin = function (e, t) {
        return (
          t ? e : e.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, '')
        )
          .replace(/\s{1,}/g, ' ')
          .replace(/\{\s{1,}/g, '{')
          .replace(/\}\s{1,}/g, '}')
          .replace(/\;\s{1,}/g, ';')
          .replace(/\/\*\s{1,}/g, '/*')
          .replace(/\*\/\s{1,}/g, '*/');
      }),
      (i.prototype.sqlmin = function (e) {
        return e
          .replace(/\s{1,}/g, ' ')
          .replace(/\s{1,}\(/, '(')
          .replace(/\s{1,}\)/, ')');
      }),
      (e.exports = new i());
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.groupingNotRecognized = void 0),
      (t.groupingNotRecognized = function () {
        window.confirm(
          'Neon does not recognize this neume grouping. Would you like to create a compound neume?'
        ) || document.getElementById('undo').click();
      });
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.SplitStaffHandler = void 0);
    const i = n(7),
      r = n(5),
      o = n(19),
      s = n(20);
    t.SplitStaffHandler = class {
      constructor(e, t) {
        (this.handler = ((e) => {
          const t = this.staff.id,
            n = s.getSVGRelCoords(e.clientX, e.clientY),
            a = { action: 'split', param: { elementId: t, x: n.x } };
          this.neonView
            .edit(a, this.neonView.view.getCurrentPageURI())
            .then(async (e) => {
              e &&
                (await this.neonView.updateForCurrentPage(),
                i.queueNotification('Split action successful'));
              const n = new o.default(this.neonView, '.staff');
              this.splitDisable(),
                r.selectAll(
                  [document.querySelector('#' + t)],
                  this.neonView,
                  n
                );
              const s = document.getElementById('moreEdit');
              s &&
                ((s.innerHTML = ''), s.parentElement.classList.add('hidden'));
            });
        }).bind(this)),
          (this.keydownListener = ((e) => {
            'Escape' === e.key
              ? this.splitDisable()
              : 'Shift' === e.key &&
                document.body.removeEventListener('click', this.handler, {
                  capture: !0,
                });
          }).bind(this)),
          (this.clickawayHandler = ((e) => {
            null === e.target.closest('.active-page') &&
              (this.splitDisable(),
              document.body.removeEventListener('click', this.handler, {
                capture: !0,
              }));
          }).bind(this)),
          (this.resetHandler = ((e) => {
            'Shift' === e.key &&
              document.body.addEventListener('click', this.handler, {
                capture: !0,
              });
          }).bind(this)),
          (this.neonView = e),
          (this.staff = t);
      }
      startSplit() {
        this.splitDisable(),
          document.body.addEventListener('click', this.handler, {
            capture: !0,
          }),
          document.body.addEventListener('keydown', this.keydownListener),
          document.body.addEventListener('keyup', this.resetHandler),
          document.body.addEventListener('click', this.clickawayHandler),
          i.queueNotification('Click Where to Split');
      }
      splitDisable() {
        document.body.removeEventListener('keydown', this.keydownListener),
          document.body.removeEventListener('keyup', this.resetHandler),
          document.body.removeEventListener('click', this.clickawayHandler),
          document.body.removeEventListener('click', this.handler, {
            capture: !0,
          });
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.SplitNeumeHandler = void 0);
    const i = n(7);
    t.SplitNeumeHandler = class {
      constructor(e, t) {
        (this.handler = ((e) => {
          const t = {
            action: 'splitNeume',
            param: {
              elementId: this.neume.id,
              ncId: e.target.parentElement.id,
            },
          };
          this.neonView
            .edit(t, this.neonView.view.getCurrentPageURI())
            .then(async (e) => {
              e
                ? (await this.neonView.updateForCurrentPage(),
                  i.queueNotification('Split action successful'))
                : (await this.neonView.updateForCurrentPage(),
                  i.queueNotification('Split action failed')),
                this.splitDisable();
            });
        }).bind(this)),
          (this.keydownListener = ((e) => {
            'Escape' === e.key
              ? this.splitDisable()
              : 'Shift' === e.key &&
                document.body.removeEventListener('click', this.handler, {
                  capture: !0,
                });
          }).bind(this)),
          (this.clickawayHandler = ((e) => {
            null === e.target.closest('.active-page') &&
              (this.splitDisable(),
              document.body.removeEventListener('click', this.handler, {
                capture: !0,
              }));
          }).bind(this)),
          (this.resetHandler = ((e) => {
            'Shift' === e.key &&
              document.body.addEventListener('click', this.handler, {
                capture: !0,
              });
          }).bind(this)),
          (this.neonView = e),
          (this.neume = t);
      }
      startSplit() {
        this.splitDisable(),
          document.body.addEventListener('click', this.handler, {
            capture: !0,
          }),
          document.body.addEventListener('keydown', this.keydownListener),
          document.body.addEventListener('keyup', this.resetHandler),
          document.body.addEventListener('click', this.clickawayHandler),
          i.queueNotification('Click The Beginning of The Second Neume');
      }
      splitDisable() {
        document.body.removeEventListener('keydown', this.keydownListener),
          document.body.removeEventListener('keyup', this.resetHandler),
          document.body.removeEventListener('click', this.clickawayHandler),
          document.body.removeEventListener('click', this.handler, {
            capture: !0,
          });
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 });
    t.default = class {
      constructor() {
        this.verovioWorker = new Worker(
          '/Neon/Neon-gh/workers/VerovioWorker.js'
        );
      }
      addEventListener(e, t) {
        return this.verovioWorker.addEventListener(e, t);
      }
      postMessage(e) {
        return this.verovioWorker.postMessage(e);
      }
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.parseManifest = void 0);
    const i = n(70),
      r = n(71),
      o = n(72);
    t.parseManifest = function (e) {
      const t = o.validate(e, i),
        n = t.instance;
      if (t.errors.length > 0) return console.error(t.errors), !1;
      const s = n['@context'];
      return (
        'https://ddmal.music.mcgill.ca/Neon/contexts/1/manifest.jsonld' === s ||
        (s[0] === r[0] &&
          s[1].schema === r[1].schema &&
          s[1].title === r[1].title &&
          s[1].timestamp === r[1].timestamp &&
          s[1].image['@id'] === r[1].image['@id'] &&
          s[1].image['@type'] === r[1].image['@type'] &&
          s[1].mei_annotations['@id'] === r[1].mei_annotations['@id'] &&
          s[1].mei_annotations['@type'] === r[1].mei_annotations['@type'] &&
          s[1].mei_annotations['@container'] ===
            r[1].mei_annotations['@container']) ||
        (console.error('Context mismatch'),
        console.error(s),
        console.error(r),
        !1)
      );
    };
  },
  function (e) {
    e.exports = JSON.parse(
      '{"type":"object","required":["@context","title","timestamp","image","mei_annotations"],"properties":{"@context":{"type":["array","string"]},"title":{"type":"string"},"timestamp":{"type":"string"},"image":{"type":"string"},"mei_annotations":{"type":"array","items":{"type":"object","required":["id","type","body","target"],"properties":{"id":{"type":"string"},"type":{"type":"string"},"body":{"type":"string"},"target":{"type":"string"}}}}}}'
    );
  },
  function (e) {
    e.exports = JSON.parse(
      '["http://www.w3.org/ns/anno.jsonld",{"schema":"http://schema.org/","title":"schema:name","timestamp":"schema:dateModified","image":{"@id":"schema:image","@type":"@id"},"mei_annotations":{"@id":"Annotation","@type":"@id","@container":"@list"}}]'
    );
  },
  function (e, t, n) {
    'use strict';
    var i = (e.exports.Validator = n(73));
    (e.exports.ValidatorResult = n(12).ValidatorResult),
      (e.exports.ValidationError = n(12).ValidationError),
      (e.exports.SchemaError = n(12).SchemaError),
      (e.exports.SchemaScanResult = n(33).SchemaScanResult),
      (e.exports.scan = n(33).scan),
      (e.exports.validate = function (e, t, n) {
        return new i().validate(e, t, n);
      });
  },
  function (e, t, n) {
    'use strict';
    var i = n(32),
      r = n(79),
      o = n(12),
      s = n(33).scan,
      a = o.ValidatorResult,
      c = o.SchemaError,
      l = o.SchemaContext,
      u = function e() {
        (this.customFormats = Object.create(e.prototype.customFormats)),
          (this.schemas = {}),
          (this.unresolvedRefs = []),
          (this.types = Object.create(h)),
          (this.attributes = Object.create(r.validators));
      };
    function d(e) {
      var t = 'string' == typeof e ? e : e.$ref;
      return 'string' == typeof t && t;
    }
    (u.prototype.customFormats = {}),
      (u.prototype.schemas = null),
      (u.prototype.types = null),
      (u.prototype.attributes = null),
      (u.prototype.unresolvedRefs = null),
      (u.prototype.addSchema = function (e, t) {
        var n = this;
        if (!e) return null;
        var i = s(t || '/', e),
          r = t || e.id;
        for (var o in i.id) this.schemas[o] = i.id[o];
        for (var o in i.ref) this.unresolvedRefs.push(o);
        return (
          (this.unresolvedRefs = this.unresolvedRefs.filter(function (e) {
            return void 0 === n.schemas[e];
          })),
          this.schemas[r]
        );
      }),
      (u.prototype.addSubSchemaArray = function (e, t) {
        if (Array.isArray(t))
          for (var n = 0; n < t.length; n++) this.addSubSchema(e, t[n]);
      }),
      (u.prototype.addSubSchemaObject = function (e, t) {
        if (t && 'object' == typeof t)
          for (var n in t) this.addSubSchema(e, t[n]);
      }),
      (u.prototype.setSchemas = function (e) {
        this.schemas = e;
      }),
      (u.prototype.getSchema = function (e) {
        return this.schemas[e];
      }),
      (u.prototype.validate = function (e, t, n, r) {
        n || (n = {});
        var o = n.propertyName || 'instance',
          a = i.resolve(n.base || '/', t.id || '');
        if (!r) {
          (r = new l(t, n, o, a, Object.create(this.schemas))).schemas[a] ||
            (r.schemas[a] = t);
          var u = s(a, t);
          for (var d in u.id) {
            var h = u.id[d];
            r.schemas[d] = h;
          }
        }
        if (t) {
          var f = this.validateSchema(e, t, n, r);
          if (!f) throw new Error('Result undefined');
          return f;
        }
        throw new c('no schema specified', t);
      }),
      (u.prototype.validateSchema = function (e, t, n, i) {
        var s,
          u = new a(e, t, n, i);
        if ('boolean' == typeof t)
          !0 === t ? (t = {}) : !1 === t && (t = { type: [] });
        else if (!t) throw new Error('schema is undefined');
        if (t.extends)
          if (Array.isArray(t.extends)) {
            var h = { schema: t, ctx: i };
            t.extends.forEach(this.schemaTraverser.bind(this, h)),
              (t = h.schema),
              (h.schema = null),
              (h.ctx = null),
              (h = null);
          } else t = o.deepMerge(t, this.superResolve(t.extends, i));
        if ((s = d(t))) {
          var f = this.resolve(t, s, i),
            p = new l(
              f.subschema,
              n,
              i.propertyPath,
              f.switchSchema,
              i.schemas
            );
          return this.validateSchema(e, f.subschema, n, p);
        }
        var g = (n && n.skipAttributes) || [];
        for (var v in t)
          if (!r.ignoreProperties[v] && g.indexOf(v) < 0) {
            var m = null,
              y = this.attributes[v];
            if (y) m = y.call(this, e, t, n, i);
            else if (!1 === n.allowUnknownAttributes)
              throw new c('Unsupported attribute: ' + v, t);
            m && u.importErrors(m);
          }
        if ('function' == typeof n.rewrite) {
          var b = n.rewrite.call(this, e, t, n, i);
          u.instance = b;
        }
        return u;
      }),
      (u.prototype.schemaTraverser = function (e, t) {
        e.schema = o.deepMerge(e.schema, this.superResolve(t, e.ctx));
      }),
      (u.prototype.superResolve = function (e, t) {
        var n;
        return (n = d(e)) ? this.resolve(e, n, t).subschema : e;
      }),
      (u.prototype.resolve = function (e, t, n) {
        if (((t = n.resolve(t)), n.schemas[t]))
          return { subschema: n.schemas[t], switchSchema: t };
        var r = i.parse(t),
          s = r && r.hash,
          a = s && s.length && t.substr(0, t.length - s.length);
        if (!a || !n.schemas[a]) throw new c('no such schema <' + t + '>', e);
        var l = o.objectGetPath(n.schemas[a], s.substr(1));
        if (void 0 === l)
          throw new c('no such schema ' + s + ' located in <' + a + '>', e);
        return { subschema: l, switchSchema: t };
      }),
      (u.prototype.testType = function (e, t, n, i, r) {
        if ('function' == typeof this.types[r])
          return this.types[r].call(this, e);
        if (r && 'object' == typeof r) {
          var o = this.validateSchema(e, r, n, i);
          return void 0 === o || !(o && o.errors.length);
        }
        return !0;
      });
    var h = (u.prototype.types = {});
    (h.string = function (e) {
      return 'string' == typeof e;
    }),
      (h.number = function (e) {
        return 'number' == typeof e && isFinite(e);
      }),
      (h.integer = function (e) {
        return 'number' == typeof e && e % 1 == 0;
      }),
      (h.boolean = function (e) {
        return 'boolean' == typeof e;
      }),
      (h.array = function (e) {
        return Array.isArray(e);
      }),
      (h.null = function (e) {
        return null === e;
      }),
      (h.date = function (e) {
        return e instanceof Date;
      }),
      (h.any = function (e) {
        return !0;
      }),
      (h.object = function (e) {
        return (
          e && 'object' == typeof e && !Array.isArray(e) && !(e instanceof Date)
        );
      }),
      (e.exports = u);
  },
  function (e, t, n) {
    (function (e, i) {
      var r;
      /*! https://mths.be/punycode v1.4.1 by @mathias */ !(function (o) {
        t && t.nodeType, e && e.nodeType;
        var s = 'object' == typeof i && i;
        s.global !== s && s.window !== s && s.self;
        var a,
          c = 2147483647,
          l = /^xn--/,
          u = /[^\x20-\x7E]/,
          d = /[\x2E\u3002\uFF0E\uFF61]/g,
          h = {
            overflow: 'Overflow: input needs wider integers to process',
            'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
            'invalid-input': 'Invalid input',
          },
          f = Math.floor,
          p = String.fromCharCode;
        function g(e) {
          throw new RangeError(h[e]);
        }
        function v(e, t) {
          for (var n = e.length, i = []; n--; ) i[n] = t(e[n]);
          return i;
        }
        function m(e, t) {
          var n = e.split('@'),
            i = '';
          return (
            n.length > 1 && ((i = n[0] + '@'), (e = n[1])),
            i + v((e = e.replace(d, '.')).split('.'), t).join('.')
          );
        }
        function y(e) {
          for (var t, n, i = [], r = 0, o = e.length; r < o; )
            (t = e.charCodeAt(r++)) >= 55296 && t <= 56319 && r < o
              ? 56320 == (64512 & (n = e.charCodeAt(r++)))
                ? i.push(((1023 & t) << 10) + (1023 & n) + 65536)
                : (i.push(t), r--)
              : i.push(t);
          return i;
        }
        function b(e) {
          return v(e, function (e) {
            var t = '';
            return (
              e > 65535 &&
                ((t += p((((e -= 65536) >>> 10) & 1023) | 55296)),
                (e = 56320 | (1023 & e))),
              (t += p(e))
            );
          }).join('');
        }
        function w(e, t) {
          return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
        }
        function _(e, t, n) {
          var i = 0;
          for (e = n ? f(e / 700) : e >> 1, e += f(e / t); e > 455; i += 36)
            e = f(e / 35);
          return f(i + (36 * e) / (e + 38));
        }
        function E(e) {
          var t,
            n,
            i,
            r,
            o,
            s,
            a,
            l,
            u,
            d,
            h,
            p = [],
            v = e.length,
            m = 0,
            y = 128,
            w = 72;
          for ((n = e.lastIndexOf('-')) < 0 && (n = 0), i = 0; i < n; ++i)
            e.charCodeAt(i) >= 128 && g('not-basic'), p.push(e.charCodeAt(i));
          for (r = n > 0 ? n + 1 : 0; r < v; ) {
            for (
              o = m, s = 1, a = 36;
              r >= v && g('invalid-input'),
                ((l =
                  (h = e.charCodeAt(r++)) - 48 < 10
                    ? h - 22
                    : h - 65 < 26
                    ? h - 65
                    : h - 97 < 26
                    ? h - 97
                    : 36) >= 36 ||
                  l > f((c - m) / s)) &&
                  g('overflow'),
                (m += l * s),
                !(l < (u = a <= w ? 1 : a >= w + 26 ? 26 : a - w));
              a += 36
            )
              s > f(c / (d = 36 - u)) && g('overflow'), (s *= d);
            (w = _(m - o, (t = p.length + 1), 0 == o)),
              f(m / t) > c - y && g('overflow'),
              (y += f(m / t)),
              (m %= t),
              p.splice(m++, 0, y);
          }
          return b(p);
        }
        function S(e) {
          var t,
            n,
            i,
            r,
            o,
            s,
            a,
            l,
            u,
            d,
            h,
            v,
            m,
            b,
            E,
            S = [];
          for (v = (e = y(e)).length, t = 128, n = 0, o = 72, s = 0; s < v; ++s)
            (h = e[s]) < 128 && S.push(p(h));
          for (i = r = S.length, r && S.push('-'); i < v; ) {
            for (a = c, s = 0; s < v; ++s) (h = e[s]) >= t && h < a && (a = h);
            for (
              a - t > f((c - n) / (m = i + 1)) && g('overflow'),
                n += (a - t) * m,
                t = a,
                s = 0;
              s < v;
              ++s
            )
              if (((h = e[s]) < t && ++n > c && g('overflow'), h == t)) {
                for (
                  l = n, u = 36;
                  !(l < (d = u <= o ? 1 : u >= o + 26 ? 26 : u - o));
                  u += 36
                )
                  (E = l - d),
                    (b = 36 - d),
                    S.push(p(w(d + (E % b), 0))),
                    (l = f(E / b));
                S.push(p(w(l, 0))), (o = _(n, m, i == r)), (n = 0), ++i;
              }
            ++n, ++t;
          }
          return S.join('');
        }
        (a = {
          version: '1.4.1',
          ucs2: { decode: y, encode: b },
          decode: E,
          encode: S,
          toASCII: function (e) {
            return m(e, function (e) {
              return u.test(e) ? 'xn--' + S(e) : e;
            });
          },
          toUnicode: function (e) {
            return m(e, function (e) {
              return l.test(e) ? E(e.slice(4).toLowerCase()) : e;
            });
          },
        }),
          void 0 ===
            (r = function () {
              return a;
            }.call(t, n, t, e)) || (e.exports = r);
      })();
    }.call(this, n(49)(e), n(4)));
  },
  function (e, t, n) {
    'use strict';
    e.exports = {
      isString: function (e) {
        return 'string' == typeof e;
      },
      isObject: function (e) {
        return 'object' == typeof e && null !== e;
      },
      isNull: function (e) {
        return null === e;
      },
      isNullOrUndefined: function (e) {
        return null == e;
      },
    };
  },
  function (e, t, n) {
    'use strict';
    (t.decode = t.parse = n(77)), (t.encode = t.stringify = n(78));
  },
  function (e, t, n) {
    'use strict';
    function i(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }
    e.exports = function (e, t, n, o) {
      (t = t || '&'), (n = n || '=');
      var s = {};
      if ('string' != typeof e || 0 === e.length) return s;
      var a = /\+/g;
      e = e.split(t);
      var c = 1e3;
      o && 'number' == typeof o.maxKeys && (c = o.maxKeys);
      var l = e.length;
      c > 0 && l > c && (l = c);
      for (var u = 0; u < l; ++u) {
        var d,
          h,
          f,
          p,
          g = e[u].replace(a, '%20'),
          v = g.indexOf(n);
        v >= 0
          ? ((d = g.substr(0, v)), (h = g.substr(v + 1)))
          : ((d = g), (h = '')),
          (f = decodeURIComponent(d)),
          (p = decodeURIComponent(h)),
          i(s, f) ? (r(s[f]) ? s[f].push(p) : (s[f] = [s[f], p])) : (s[f] = p);
      }
      return s;
    };
    var r =
      Array.isArray ||
      function (e) {
        return '[object Array]' === Object.prototype.toString.call(e);
      };
  },
  function (e, t, n) {
    'use strict';
    var i = function (e) {
      switch (typeof e) {
        case 'string':
          return e;
        case 'boolean':
          return e ? 'true' : 'false';
        case 'number':
          return isFinite(e) ? e : '';
        default:
          return '';
      }
    };
    e.exports = function (e, t, n, a) {
      return (
        (t = t || '&'),
        (n = n || '='),
        null === e && (e = void 0),
        'object' == typeof e
          ? o(s(e), function (s) {
              var a = encodeURIComponent(i(s)) + n;
              return r(e[s])
                ? o(e[s], function (e) {
                    return a + encodeURIComponent(i(e));
                  }).join(t)
                : a + encodeURIComponent(i(e[s]));
            }).join(t)
          : a
          ? encodeURIComponent(i(a)) + n + encodeURIComponent(i(e))
          : ''
      );
    };
    var r =
      Array.isArray ||
      function (e) {
        return '[object Array]' === Object.prototype.toString.call(e);
      };
    function o(e, t) {
      if (e.map) return e.map(t);
      for (var n = [], i = 0; i < e.length; i++) n.push(t(e[i], i));
      return n;
    }
    var s =
      Object.keys ||
      function (e) {
        var t = [];
        for (var n in e)
          Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
        return t;
      };
  },
  function (e, t, n) {
    'use strict';
    var i = n(12),
      r = i.ValidatorResult,
      o = i.SchemaError,
      s = {
        ignoreProperties: {
          id: !0,
          default: !0,
          description: !0,
          title: !0,
          exclusiveMinimum: !0,
          exclusiveMaximum: !0,
          additionalItems: !0,
          $schema: !0,
          $ref: !0,
          extends: !0,
        },
      },
      a = (s.validators = {});
    function c(e, t, n, i, r) {
      var o = t.throwError;
      t.throwError = !1;
      var s = this.validateSchema(e, r, t, n);
      return (
        (t.throwError = o), !s.valid && i instanceof Function && i(s), s.valid
      );
    }
    function l(e, t, n, i, r, o) {
      if (this.types.object(e) && (!t.properties || void 0 === t.properties[r]))
        if (!1 === t.additionalProperties)
          o.addError({
            name: 'additionalProperties',
            argument: r,
            message:
              'additionalProperty ' +
              JSON.stringify(r) +
              ' exists in instance when not allowed',
          });
        else {
          var s = t.additionalProperties || {};
          'function' == typeof n.preValidateProperty &&
            n.preValidateProperty(e, r, s, n, i);
          var a = this.validateSchema(e[r], s, n, i.makeChild(s, r));
          a.instance !== o.instance[r] && (o.instance[r] = a.instance),
            o.importErrors(a);
        }
    }
    (a.type = function (e, t, n, i) {
      if (void 0 === e) return null;
      var o = new r(e, t, n, i),
        s = Array.isArray(t.type) ? t.type : [t.type];
      if (!s.some(this.testType.bind(this, e, t, n, i))) {
        var a = s.map(function (e) {
          return (e.id && '<' + e.id + '>') || e + '';
        });
        o.addError({
          name: 'type',
          argument: a,
          message: 'is not of a type(s) ' + a,
        });
      }
      return o;
    }),
      (a.anyOf = function (e, t, n, i) {
        if (void 0 === e) return null;
        var s = new r(e, t, n, i),
          a = new r(e, t, n, i);
        if (!Array.isArray(t.anyOf)) throw new o('anyOf must be an array');
        if (
          !t.anyOf.some(
            c.bind(this, e, n, i, function (e) {
              a.importErrors(e);
            })
          )
        ) {
          var l = t.anyOf.map(function (e, t) {
            return (
              (e.id && '<' + e.id + '>') ||
              (e.title && JSON.stringify(e.title)) ||
              (e.$ref && '<' + e.$ref + '>') ||
              '[subschema ' + t + ']'
            );
          });
          n.nestedErrors && s.importErrors(a),
            s.addError({
              name: 'anyOf',
              argument: l,
              message: 'is not any of ' + l.join(','),
            });
        }
        return s;
      }),
      (a.allOf = function (e, t, n, i) {
        if (void 0 === e) return null;
        if (!Array.isArray(t.allOf)) throw new o('allOf must be an array');
        var s = new r(e, t, n, i),
          a = this;
        return (
          t.allOf.forEach(function (t, r) {
            var o = a.validateSchema(e, t, n, i);
            if (!o.valid) {
              var c =
                (t.id && '<' + t.id + '>') ||
                (t.title && JSON.stringify(t.title)) ||
                (t.$ref && '<' + t.$ref + '>') ||
                '[subschema ' + r + ']';
              s.addError({
                name: 'allOf',
                argument: { id: c, length: o.errors.length, valid: o },
                message:
                  'does not match allOf schema ' +
                  c +
                  ' with ' +
                  o.errors.length +
                  ' error[s]:',
              }),
                s.importErrors(o);
            }
          }),
          s
        );
      }),
      (a.oneOf = function (e, t, n, i) {
        if (void 0 === e) return null;
        if (!Array.isArray(t.oneOf)) throw new o('oneOf must be an array');
        var s = new r(e, t, n, i),
          a = new r(e, t, n, i),
          l = t.oneOf.filter(
            c.bind(this, e, n, i, function (e) {
              a.importErrors(e);
            })
          ).length,
          u = t.oneOf.map(function (e, t) {
            return (
              (e.id && '<' + e.id + '>') ||
              (e.title && JSON.stringify(e.title)) ||
              (e.$ref && '<' + e.$ref + '>') ||
              '[subschema ' + t + ']'
            );
          });
        return (
          1 !== l &&
            (n.nestedErrors && s.importErrors(a),
            s.addError({
              name: 'oneOf',
              argument: u,
              message: 'is not exactly one from ' + u.join(','),
            })),
          s
        );
      }),
      (a.properties = function (e, t, n, i) {
        if (this.types.object(e)) {
          var o = new r(e, t, n, i),
            s = t.properties || {};
          for (var a in s) {
            'function' == typeof n.preValidateProperty &&
              n.preValidateProperty(e, a, s[a], n, i);
            var c = Object.hasOwnProperty.call(e, a) ? e[a] : void 0,
              l = this.validateSchema(c, s[a], n, i.makeChild(s[a], a));
            l.instance !== o.instance[a] && (o.instance[a] = l.instance),
              o.importErrors(l);
          }
          return o;
        }
      }),
      (a.patternProperties = function (e, t, n, i) {
        if (this.types.object(e)) {
          var o = new r(e, t, n, i),
            s = t.patternProperties || {};
          for (var a in e) {
            var c = !0;
            for (var u in s) {
              if (new RegExp(u).test(a)) {
                (c = !1),
                  'function' == typeof n.preValidateProperty &&
                    n.preValidateProperty(e, a, s[u], n, i);
                var d = this.validateSchema(
                  e[a],
                  s[u],
                  n,
                  i.makeChild(s[u], a)
                );
                d.instance !== o.instance[a] && (o.instance[a] = d.instance),
                  o.importErrors(d);
              }
            }
            c && l.call(this, e, t, n, i, a, o);
          }
          return o;
        }
      }),
      (a.additionalProperties = function (e, t, n, i) {
        if (this.types.object(e)) {
          if (t.patternProperties) return null;
          var o = new r(e, t, n, i);
          for (var s in e) l.call(this, e, t, n, i, s, o);
          return o;
        }
      }),
      (a.minProperties = function (e, t, n, i) {
        if (this.types.object(e)) {
          var o = new r(e, t, n, i);
          return (
            Object.keys(e).length >= t.minProperties ||
              o.addError({
                name: 'minProperties',
                argument: t.minProperties,
                message:
                  'does not meet minimum property length of ' + t.minProperties,
              }),
            o
          );
        }
      }),
      (a.maxProperties = function (e, t, n, i) {
        if (this.types.object(e)) {
          var o = new r(e, t, n, i);
          return (
            Object.keys(e).length <= t.maxProperties ||
              o.addError({
                name: 'maxProperties',
                argument: t.maxProperties,
                message:
                  'does not meet maximum property length of ' + t.maxProperties,
              }),
            o
          );
        }
      }),
      (a.items = function (e, t, n, i) {
        var o = this;
        if (this.types.array(e) && t.items) {
          var s = new r(e, t, n, i);
          return (
            e.every(function (e, r) {
              var a = Array.isArray(t.items)
                ? t.items[r] || t.additionalItems
                : t.items;
              if (void 0 === a) return !0;
              if (!1 === a)
                return (
                  s.addError({
                    name: 'items',
                    message: 'additionalItems not permitted',
                  }),
                  !1
                );
              var c = o.validateSchema(e, a, n, i.makeChild(a, r));
              return (
                c.instance !== s.instance[r] && (s.instance[r] = c.instance),
                s.importErrors(c),
                !0
              );
            }),
            s
          );
        }
      }),
      (a.minimum = function (e, t, n, i) {
        if (this.types.number(e)) {
          var o = new r(e, t, n, i);
          return (
            (t.exclusiveMinimum && !0 === t.exclusiveMinimum
              ? e > t.minimum
              : e >= t.minimum) ||
              o.addError({
                name: 'minimum',
                argument: t.minimum,
                message: 'must have a minimum value of ' + t.minimum,
              }),
            o
          );
        }
      }),
      (a.maximum = function (e, t, n, i) {
        if (this.types.number(e)) {
          var o = new r(e, t, n, i);
          return (
            (t.exclusiveMaximum && !0 === t.exclusiveMaximum
              ? e < t.maximum
              : e <= t.maximum) ||
              o.addError({
                name: 'maximum',
                argument: t.maximum,
                message: 'must have a maximum value of ' + t.maximum,
              }),
            o
          );
        }
      });
    var u = function (e, t, n, s, a, c) {
      if (this.types.number(e)) {
        var l = t[a];
        if (0 == l) throw new o(a + ' cannot be zero');
        var u = new r(e, t, n, s),
          d = i.getDecimalPlaces(e),
          h = i.getDecimalPlaces(l),
          f = Math.max(d, h),
          p = Math.pow(10, f);
        return (
          Math.round(e * p) % Math.round(l * p) != 0 &&
            u.addError({
              name: a,
              argument: l,
              message: c + JSON.stringify(l),
            }),
          u
        );
      }
    };
    function d(e, t, n) {
      var r,
        o = n.length;
      for (r = t + 1; r < o; r++) if (i.deepCompareStrict(e, n[r])) return !1;
      return !0;
    }
    (a.multipleOf = function (e, t, n, i) {
      return u.call(
        this,
        e,
        t,
        n,
        i,
        'multipleOf',
        'is not a multiple of (divisible by) '
      );
    }),
      (a.divisibleBy = function (e, t, n, i) {
        return u.call(
          this,
          e,
          t,
          n,
          i,
          'divisibleBy',
          'is not divisible by (multiple of) '
        );
      }),
      (a.required = function (e, t, n, i) {
        var o = new r(e, t, n, i);
        return (
          void 0 === e && !0 === t.required
            ? o.addError({ name: 'required', message: 'is required' })
            : this.types.object(e) &&
              Array.isArray(t.required) &&
              t.required.forEach(function (t) {
                void 0 === e[t] &&
                  o.addError({
                    name: 'required',
                    argument: t,
                    message: 'requires property ' + JSON.stringify(t),
                  });
              }),
          o
        );
      }),
      (a.pattern = function (e, t, n, i) {
        if (this.types.string(e)) {
          var o = new r(e, t, n, i);
          return (
            e.match(t.pattern) ||
              o.addError({
                name: 'pattern',
                argument: t.pattern,
                message:
                  'does not match pattern ' +
                  JSON.stringify(t.pattern.toString()),
              }),
            o
          );
        }
      }),
      (a.format = function (e, t, n, o) {
        if (void 0 !== e) {
          var s = new r(e, t, n, o);
          return (
            s.disableFormat ||
              i.isFormat(e, t.format, this) ||
              s.addError({
                name: 'format',
                argument: t.format,
                message:
                  'does not conform to the ' +
                  JSON.stringify(t.format) +
                  ' format',
              }),
            s
          );
        }
      }),
      (a.minLength = function (e, t, n, i) {
        if (this.types.string(e)) {
          var o = new r(e, t, n, i),
            s = e.match(/[\uDC00-\uDFFF]/g);
          return (
            e.length - (s ? s.length : 0) >= t.minLength ||
              o.addError({
                name: 'minLength',
                argument: t.minLength,
                message: 'does not meet minimum length of ' + t.minLength,
              }),
            o
          );
        }
      }),
      (a.maxLength = function (e, t, n, i) {
        if (this.types.string(e)) {
          var o = new r(e, t, n, i),
            s = e.match(/[\uDC00-\uDFFF]/g);
          return (
            e.length - (s ? s.length : 0) <= t.maxLength ||
              o.addError({
                name: 'maxLength',
                argument: t.maxLength,
                message: 'does not meet maximum length of ' + t.maxLength,
              }),
            o
          );
        }
      }),
      (a.minItems = function (e, t, n, i) {
        if (this.types.array(e)) {
          var o = new r(e, t, n, i);
          return (
            e.length >= t.minItems ||
              o.addError({
                name: 'minItems',
                argument: t.minItems,
                message: 'does not meet minimum length of ' + t.minItems,
              }),
            o
          );
        }
      }),
      (a.maxItems = function (e, t, n, i) {
        if (this.types.array(e)) {
          var o = new r(e, t, n, i);
          return (
            e.length <= t.maxItems ||
              o.addError({
                name: 'maxItems',
                argument: t.maxItems,
                message: 'does not meet maximum length of ' + t.maxItems,
              }),
            o
          );
        }
      }),
      (a.uniqueItems = function (e, t, n, o) {
        if (this.types.array(e)) {
          var s = new r(e, t, n, o);
          return (
            e.every(function (e, t, n) {
              for (var r = t + 1; r < n.length; r++)
                if (i.deepCompareStrict(e, n[r])) return !1;
              return !0;
            }) ||
              s.addError({
                name: 'uniqueItems',
                message: 'contains duplicate item',
              }),
            s
          );
        }
      }),
      (a.uniqueItems = function (e, t, n, i) {
        if (this.types.array(e)) {
          var o = new r(e, t, n, i);
          return (
            e.every(d) ||
              o.addError({
                name: 'uniqueItems',
                message: 'contains duplicate item',
              }),
            o
          );
        }
      }),
      (a.dependencies = function (e, t, n, i) {
        if (this.types.object(e)) {
          var o = new r(e, t, n, i);
          for (var s in t.dependencies)
            if (void 0 !== e[s]) {
              var a = t.dependencies[s],
                c = i.makeChild(a, s);
              if (('string' == typeof a && (a = [a]), Array.isArray(a)))
                a.forEach(function (t) {
                  void 0 === e[t] &&
                    o.addError({
                      name: 'dependencies',
                      argument: c.propertyPath,
                      message:
                        'property ' +
                        t +
                        ' not found, required by ' +
                        c.propertyPath,
                    });
                });
              else {
                var l = this.validateSchema(e, a, n, c);
                o.instance !== l.instance && (o.instance = l.instance),
                  l &&
                    l.errors.length &&
                    (o.addError({
                      name: 'dependencies',
                      argument: c.propertyPath,
                      message:
                        'does not meet dependency required by ' +
                        c.propertyPath,
                    }),
                    o.importErrors(l));
              }
            }
          return o;
        }
      }),
      (a.enum = function (e, t, n, s) {
        if (void 0 === e) return null;
        if (!Array.isArray(t.enum)) throw new o('enum expects an array', t);
        var a = new r(e, t, n, s);
        return (
          t.enum.some(i.deepCompareStrict.bind(null, e)) ||
            a.addError({
              name: 'enum',
              argument: t.enum,
              message:
                'is not one of enum values: ' + t.enum.map(String).join(','),
            }),
          a
        );
      }),
      (a.const = function (e, t, n, o) {
        if (void 0 === e) return null;
        var s = new r(e, t, n, o);
        return (
          i.deepCompareStrict(t.const, e) ||
            s.addError({
              name: 'const',
              argument: t.const,
              message: 'does not exactly match expected constant: ' + t.const,
            }),
          s
        );
      }),
      (a.not = a.disallow =
        function (e, t, n, i) {
          var o = this;
          if (void 0 === e) return null;
          var s = new r(e, t, n, i),
            a = t.not || t.disallow;
          return a
            ? (Array.isArray(a) || (a = [a]),
              a.forEach(function (r) {
                if (o.testType(e, t, n, i, r)) {
                  var a = (r && r.id && '<' + r.id + '>') || r;
                  s.addError({
                    name: 'not',
                    argument: a,
                    message: 'is of prohibited type ' + a,
                  });
                }
              }),
              s)
            : null;
        }),
      (e.exports = s);
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
    const i = n(17);
    t.default = async function (e) {
      const t = await fetch('/Neon/Neon-gh/assets/template.html');
      (document.body.innerHTML = await t.text()),
        (document.getElementById('home-link').href =
          'https://ddmal.music.mcgill.ca/Neon'),
        (document.getElementById('neon-version').textContent = '02e3563b\n'),
        (document.getElementById('neon-main-icon').src =
          '/Neon/Neon-gh//assets/img/Neon_Icon_3.svg'),
        Array.from(
          document.getElementsByClassName('external-link-icon')
        ).forEach((e) => {
          e.src = '/Neon/Neon-gh//assets/img/external-link.svg';
        }),
        (document.getElementById('filename').innerText = '' + e.manifest.title),
        document
          .getElementById('navbar-item-hotkeys')
          .addEventListener('click', function () {
            e.modal.setModalWindowView(i.ModalWindowView.HOTKEYS),
              e.modal.openModalWindow();
          });
    };
  },
  function (e, t) {
    var n, i, r, o;
    (n = window.requestAnimationFrame),
      (i = 'ontouchend' in document),
      (r = function () {
        for (var e = 1; e < arguments.length; e++)
          for (var t in arguments[e])
            arguments[e].hasOwnProperty(t) &&
              (arguments[0][t] = arguments[e][t]);
        return arguments[0];
      }),
      ((o = function (e, t) {
        return (
          (this.settings = r({}, o.DEFAULTS, t)),
          (this.el = e),
          (this.ACTIVE_CLASS = 'kinetic-active'),
          this._initElements(),
          (this.el._VanillaKinetic = this),
          this
        );
      }).DEFAULTS = {
        cursor: 'move',
        decelerate: !0,
        triggerHardware: !1,
        threshold: 0,
        y: !0,
        x: !0,
        slowdown: 0.9,
        maxvelocity: 40,
        throttleFPS: 60,
        invert: !1,
        movingClass: {
          up: 'kinetic-moving-up',
          down: 'kinetic-moving-down',
          left: 'kinetic-moving-left',
          right: 'kinetic-moving-right',
        },
        deceleratingClass: {
          up: 'kinetic-decelerating-up',
          down: 'kinetic-decelerating-down',
          left: 'kinetic-decelerating-left',
          right: 'kinetic-decelerating-right',
        },
      }),
      (o.prototype.start = function (e) {
        (this.settings = r(this.settings, e)),
          (this.velocity = e.velocity || this.velocity),
          (this.velocityY = e.velocityY || this.velocityY),
          (this.settings.decelerate = !1),
          this._move();
      }),
      (o.prototype.end = function () {
        this.settings.decelerate = !0;
      }),
      (o.prototype.stop = function () {
        (this.velocity = 0),
          (this.velocityY = 0),
          (this.settings.decelerate = !0),
          'function' == typeof this.settings.stopped &&
            this.settings.stopped.call(this);
      }),
      (o.prototype.detach = function () {
        this._detachListeners(),
          this.el.classList.remove(this.ACTIVE_CLASS),
          (this.el.style.cursor = '');
      }),
      (o.prototype.attach = function () {
        this.el.classList.contains(this.ACTIVE_CLASS) ||
          (this._attachListeners(),
          this.el.classList.add(this.ACTIVE_CLASS),
          (this.el.style.cursor = this.settings.cursor));
      }),
      (o.prototype._initElements = function () {
        this.el.classList.add(this.ACTIVE_CLASS),
          r(this, {
            xpos: null,
            prevXPos: !1,
            ypos: null,
            prevYPos: !1,
            mouseDown: !1,
            throttleTimeout: 1e3 / this.settings.throttleFPS,
            lastMove: null,
            elementFocused: null,
          }),
          (this.velocity = 0),
          (this.velocityY = 0);
        var e = this;
        this.documentResetHandler = function () {
          e._resetMouse.apply(e);
        };
        var t = document.documentElement;
        if (
          (t.addEventListener('mouseup', this.documentResetHandler, !1),
          t.addEventListener('click', this.documentResetHandler, !1),
          this._initEvents(),
          (this.el.style.cursor = this.settings.cursor),
          this.settings.triggerHardware)
        )
          for (
            var n = ['', '-ms-', '-webkit-', '-moz-'],
              i = {
                transform: 'translate3d(0,0,0)',
                perspective: '1000',
                'backface-visibility': 'hidden',
              },
              o = 0;
            o < n.length;
            o++
          ) {
            var s = n[o];
            for (var a in i)
              i.hasOwnProperty(a) && (this.el.style[s + a] = i[a]);
          }
      }),
      (o.prototype._initEvents = function () {
        var e = this;
        (this.settings.events = {
          touchStart: function (t) {
            var n;
            e._useTarget(t.target, t) &&
              ((n = t.originalEvent.touches[0]),
              (e.threshold = e._threshold(t.target, t)),
              e._start(n.clientX, n.clientY),
              t.stopPropagation());
          },
          touchMove: function (t) {
            var n;
            e.mouseDown &&
              ((n = t.originalEvent.touches[0]),
              e._inputmove(n.clientX, n.clientY),
              t.preventDefault && t.preventDefault());
          },
          inputDown: function (t) {
            e._useTarget(t.target, t) &&
              ((e.threshold = e._threshold(t.target, t)),
              e._start(t.clientX, t.clientY),
              (e.elementFocused = t.target),
              'IMG' === t.target.nodeName && t.preventDefault(),
              t.stopPropagation());
          },
          inputEnd: function (t) {
            e._useTarget(t.target, t) &&
              (e._end(),
              (e.elementFocused = null),
              t.preventDefault && t.preventDefault());
          },
          inputMove: function (t) {
            e.mouseDown &&
              (e._inputmove(t.clientX, t.clientY),
              t.preventDefault && t.preventDefault());
          },
          scroll: function (t) {
            'function' == typeof e.settings.moved &&
              e.settings.moved.call(e, e.settings),
              t.preventDefault && t.preventDefault();
          },
          inputClick: function (t) {
            if (Math.abs(e.velocity) > 0 || Math.abs(e.velocityY) > 0)
              return (
                t.preventDefault(), t.stopPropagation && t.stopPropagation(), !1
              );
          },
          dragStart: function (t) {
            if (e._useTarget(t.target, t) && e.elementFocused)
              return (
                t.preventDefault && t.preventDefault(),
                t.stopPropagation && t.stopPropagation(),
                !1
              );
          },
          selectStart: function (t) {
            return 'function' == typeof e.settings.selectStart
              ? e.settings.selectStart.apply(e, arguments)
              : e._useTarget(t.target, t)
              ? (t.preventDefault && t.preventDefault(),
                t.stopPropagation && t.stopPropagation(),
                !1)
              : void 0;
          },
        }),
          this._attachListeners();
      }),
      (o.prototype._inputmove = function (e, t) {
        if (
          (!this.lastMove ||
            new Date() >
              new Date(this.lastMove.getTime() + this.throttleTimeout)) &&
          ((this.lastMove = new Date()),
          this.mouseDown && (this.xpos || this.ypos))
        ) {
          var n = e - this.xpos,
            i = t - this.ypos;
          if (
            (this.settings.invert && ((n *= -1), (i *= -1)), this.threshold > 0)
          ) {
            var r = Math.sqrt(n * n + i * i);
            if (this.threshold > r) return;
            this.threshold = 0;
          }
          this.elementFocused &&
            (this.elementFocused.blur(),
            (this.elementFocused = null),
            this.el.focus()),
            (this.settings.decelerate = !1),
            (this.velocity = this.velocityY = 0);
          var o = this.scrollLeft(),
            s = this.scrollTop();
          this.scrollLeft(this.settings.x ? o - n : o),
            this.scrollTop(this.settings.y ? s - i : s),
            (this.prevXPos = this.xpos),
            (this.prevYPos = this.ypos),
            (this.xpos = e),
            (this.ypos = t),
            this._calculateVelocities(),
            this._setMoveClasses(this.settings.movingClass),
            'function' == typeof this.settings.moved &&
              this.settings.moved.call(this, this.settings);
        }
      }),
      (o.prototype._calculateVelocities = function () {
        (this.velocity = this._capVelocity(
          this.prevXPos - this.xpos,
          this.settings.maxvelocity
        )),
          (this.velocityY = this._capVelocity(
            this.prevYPos - this.ypos,
            this.settings.maxvelocity
          )),
          this.settings.invert &&
            ((this.velocity *= -1), (this.velocityY *= -1));
      }),
      (o.prototype._end = function () {
        this.xpos &&
          this.prevXPos &&
          !1 === this.settings.decelerate &&
          ((this.settings.decelerate = !0),
          this._calculateVelocities(),
          (this.xpos = this.prevXPos = this.mouseDown = !1),
          this._move());
      }),
      (o.prototype._useTarget = function (e, t) {
        return (
          'function' != typeof this.settings.filterTarget ||
          !1 !== this.settings.filterTarget.call(this, e, t)
        );
      }),
      (o.prototype._threshold = function (e, t) {
        return 'function' == typeof this.settings.threshold
          ? this.settings.threshold.call(this, e, t)
          : this.settings.threshold;
      }),
      (o.prototype._start = function (e, t) {
        (this.mouseDown = !0),
          (this.velocity = this.prevXPos = 0),
          (this.velocityY = this.prevYPos = 0),
          (this.xpos = e),
          (this.ypos = t);
      }),
      (o.prototype._resetMouse = function () {
        (this.xpos = !1), (this.ypos = !1), (this.mouseDown = !1);
      }),
      (o.prototype._decelerateVelocity = function (e, t) {
        return 0 === Math.floor(Math.abs(e)) ? 0 : e * t;
      }),
      (o.prototype._capVelocity = function (e, t) {
        var n = e;
        return e > 0 ? e > t && (n = t) : e < 0 - t && (n = 0 - t), n;
      }),
      (o.prototype._setMoveClasses = function (e) {
        var t = this.settings,
          n = this.el;
        n.classList.remove(t.movingClass.up),
          n.classList.remove(t.movingClass.down),
          n.classList.remove(t.movingClass.left),
          n.classList.remove(t.movingClass.right),
          n.classList.remove(t.deceleratingClass.up),
          n.classList.remove(t.deceleratingClass.down),
          n.classList.remove(t.deceleratingClass.left),
          n.classList.remove(t.deceleratingClass.right),
          this.velocity > 0 && n.classList.add(e.right),
          this.velocity < 0 && n.classList.add(e.left),
          this.velocityY > 0 && n.classList.add(e.down),
          this.velocityY < 0 && n.classList.add(e.up);
      }),
      (o.prototype._move = function () {
        var e = this._getScroller(),
          t = this,
          i = this.settings;
        i.x && e.scrollWidth > 0
          ? (this.scrollLeft(this.scrollLeft() + this.velocity),
            Math.abs(this.velocity) > 0 &&
              (this.velocity = i.decelerate
                ? t._decelerateVelocity(this.velocity, i.slowdown)
                : this.velocity))
          : (this.velocity = 0),
          i.y && e.scrollHeight > 0
            ? (this.scrollTop(this.scrollTop() + this.velocityY),
              Math.abs(this.velocityY) > 0 &&
                (this.velocityY = i.decelerate
                  ? t._decelerateVelocity(this.velocityY, i.slowdown)
                  : this.velocityY))
            : (this.velocityY = 0),
          t._setMoveClasses(i.deceleratingClass),
          'function' == typeof i.moved && i.moved.call(this, i),
          Math.abs(this.velocity) > 0 || Math.abs(this.velocityY) > 0
            ? this.moving ||
              ((this.moving = !0),
              n(function () {
                (t.moving = !1), t._move();
              }))
            : t.stop();
      }),
      (o.prototype._getScroller = function () {
        return this.el;
      }),
      (o.prototype.scrollLeft = function (e) {
        var t = this._getScroller();
        if ('number' != typeof e) return t.scrollLeft;
        (t.scrollLeft = e), (this.settings.scrollLeft = e);
      }),
      (o.prototype.scrollTop = function (e) {
        var t = this._getScroller();
        if ('number' != typeof e) return t.scrollTop;
        (t.scrollTop = e), (this.settings.scrollTop = e);
      }),
      (o.prototype._attachListeners = function () {
        var e = this.el,
          t = this.settings;
        i &&
          (e.addEventListener('touchstart', t.events.touchStart, !1),
          e.addEventListener('touchend', t.events.inputEnd, !1),
          e.addEventListener('touchmove', t.events.touchMove, !1)),
          e.addEventListener('mousedown', t.events.inputDown, !1),
          e.addEventListener('mouseup', t.events.inputEnd, !1),
          e.addEventListener('mousemove', t.events.inputMove, !1),
          e.addEventListener('click', t.events.inputClick, !1),
          e.addEventListener('scroll', t.events.scroll, !1),
          e.addEventListener('selectstart', t.events.selectStart, !1),
          e.addEventListener('dragstart', t.events.dragStart, !1);
      }),
      (o.prototype._detachListeners = function () {
        var e = this.el,
          t = this.settings;
        i &&
          (e.removeEventListener('touchstart', t.events.touchStart, !1),
          e.removeEventListener('touchend', t.events.inputEnd, !1),
          e.removeEventListener('touchmove', t.events.touchMove, !1)),
          e.removeEventListener('mousedown', t.events.inputDown, !1),
          e.removeEventListener('mouseup', t.events.inputEnd, !1),
          e.removeEventListener('mousemove', t.events.inputMove, !1),
          e.removeEventListener('click', t.events.inputClick, !1),
          e.removeEventListener('scroll', t.events.scroll, !1),
          e.removeEventListener('selectstart', t.events.selectStart, !1),
          e.removeEventListener('dragstart', t.events.dragStart, !1);
      }),
      (window.VanillaKinetic = o);
  },
  function (e, t, n) {
    var i, r, o;
    /**
     * @fileoverview dragscroll - scroll area by dragging
     * @version 0.0.8
     *
     * @license MIT, see http://github.com/asvd/dragscroll
     * @copyright 2015 asvd <heliosframework@gmail.com>
     */ (r = [t]),
      void 0 ===
        (o =
          'function' ==
          typeof (i = function (e) {
            var t,
              n,
              i = window,
              r = document,
              o = [],
              s = function (e, s) {
                for (e = 0; e < o.length; )
                  (s = (s = o[e++]).container || s).removeEventListener(
                    'mousedown',
                    s.md,
                    0
                  ),
                    i.removeEventListener('mouseup', s.mu, 0),
                    i.removeEventListener('mousemove', s.mm, 0);
                for (
                  o = [].slice.call(r.getElementsByClassName('dragscroll')),
                    e = 0;
                  e < o.length;

                )
                  !(function (e, o, s, a, c, l) {
                    (l = e.container || e).addEventListener(
                      'mousedown',
                      (l.md = function (t) {
                        (e.hasAttribute('nochilddrag') &&
                          r.elementFromPoint(t.pageX, t.pageY) !== l) ||
                          ((a = 1),
                          (o = t.clientX),
                          (s = t.clientY),
                          t.preventDefault());
                      }),
                      0
                    ),
                      i.addEventListener(
                        'mouseup',
                        (l.mu = function () {
                          a = 0;
                        }),
                        0
                      ),
                      i.addEventListener(
                        'mousemove',
                        (l.mm = function (i) {
                          a &&
                            (((c = e.scroller || e).scrollLeft -= t =
                              -o + (o = i.clientX)),
                            (c.scrollTop -= n = -s + (s = i.clientY)),
                            e === r.body &&
                              (((c = r.documentElement).scrollLeft -= t),
                              (c.scrollTop -= n)));
                        }),
                        0
                      );
                  })(o[e++]);
              };
            'complete' === r.readyState
              ? s()
              : i.addEventListener('load', s, 0),
              (e.reset = s),
              (window.resetDragscroll = s);
          })
            ? i.apply(t, r)
            : i) || (e.exports = o);
  },
  function (e, t, n) {
    var i;
    function r(e) {
      function n() {
        if (n.enabled) {
          var e = n,
            r = +new Date(),
            o = r - (i || r);
          (e.diff = o), (e.prev = i), (e.curr = r), (i = r);
          for (var s = new Array(arguments.length), a = 0; a < s.length; a++)
            s[a] = arguments[a];
          (s[0] = t.coerce(s[0])), 'string' != typeof s[0] && s.unshift('%O');
          var c = 0;
          (s[0] = s[0].replace(/%([a-zA-Z%])/g, function (n, i) {
            if ('%%' === n) return n;
            c++;
            var r = t.formatters[i];
            if ('function' == typeof r) {
              var o = s[c];
              (n = r.call(e, o)), s.splice(c, 1), c--;
            }
            return n;
          })),
            t.formatArgs.call(e, s);
          var l = n.log || t.log || console.log.bind(console);
          l.apply(e, s);
        }
      }
      return (
        (n.namespace = e),
        (n.enabled = t.enabled(e)),
        (n.useColors = t.useColors()),
        (n.color = (function (e) {
          var n,
            i = 0;
          for (n in e) (i = (i << 5) - i + e.charCodeAt(n)), (i |= 0);
          return t.colors[Math.abs(i) % t.colors.length];
        })(e)),
        'function' == typeof t.init && t.init(n),
        n
      );
    }
    ((t = e.exports = r.debug = r.default = r).coerce = function (e) {
      return e instanceof Error ? e.stack || e.message : e;
    }),
      (t.disable = function () {
        t.enable('');
      }),
      (t.enable = function (e) {
        t.save(e), (t.names = []), (t.skips = []);
        for (
          var n = ('string' == typeof e ? e : '').split(/[\s,]+/),
            i = n.length,
            r = 0;
          r < i;
          r++
        )
          n[r] &&
            ('-' === (e = n[r].replace(/\*/g, '.*?'))[0]
              ? t.skips.push(new RegExp('^' + e.substr(1) + '$'))
              : t.names.push(new RegExp('^' + e + '$')));
      }),
      (t.enabled = function (e) {
        var n, i;
        for (n = 0, i = t.skips.length; n < i; n++)
          if (t.skips[n].test(e)) return !1;
        for (n = 0, i = t.names.length; n < i; n++)
          if (t.names[n].test(e)) return !0;
        return !1;
      }),
      (t.humanize = n(84)),
      (t.names = []),
      (t.skips = []),
      (t.formatters = {});
  },
  function (e, t) {
    var n = 1e3,
      i = 6e4,
      r = 60 * i,
      o = 24 * r;
    function s(e, t, n) {
      if (!(e < t))
        return e < 1.5 * t
          ? Math.floor(e / t) + ' ' + n
          : Math.ceil(e / t) + ' ' + n + 's';
    }
    e.exports = function (e, t) {
      t = t || {};
      var a,
        c = typeof e;
      if ('string' === c && e.length > 0)
        return (function (e) {
          if ((e = String(e)).length > 100) return;
          var t =
            /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
              e
            );
          if (!t) return;
          var s = parseFloat(t[1]);
          switch ((t[2] || 'ms').toLowerCase()) {
            case 'years':
            case 'year':
            case 'yrs':
            case 'yr':
            case 'y':
              return 315576e5 * s;
            case 'days':
            case 'day':
            case 'd':
              return s * o;
            case 'hours':
            case 'hour':
            case 'hrs':
            case 'hr':
            case 'h':
              return s * r;
            case 'minutes':
            case 'minute':
            case 'mins':
            case 'min':
            case 'm':
              return s * i;
            case 'seconds':
            case 'second':
            case 'secs':
            case 'sec':
            case 's':
              return s * n;
            case 'milliseconds':
            case 'millisecond':
            case 'msecs':
            case 'msec':
            case 'ms':
              return s;
            default:
              return;
          }
        })(e);
      if ('number' === c && !1 === isNaN(e))
        return t.long
          ? s((a = e), o, 'day') ||
              s(a, r, 'hour') ||
              s(a, i, 'minute') ||
              s(a, n, 'second') ||
              a + ' ms'
          : (function (e) {
              if (e >= o) return Math.round(e / o) + 'd';
              if (e >= r) return Math.round(e / r) + 'h';
              if (e >= i) return Math.round(e / i) + 'm';
              if (e >= n) return Math.round(e / n) + 's';
              return e + 'ms';
            })(e);
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(e)
      );
    };
  },
  function (e, t, n) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.default = t.ZoomHandler = t.ViewBox = void 0);
    const i = n(8);
    class r {
      constructor(e, t) {
        (this.minX = 0),
          (this.minY = 0),
          (this.width = e),
          (this.height = t),
          (this.imageWidth = e),
          (this.imageHeight = t);
      }
      set(e, t, n, i) {
        (this.minX = e), (this.minY = t), (this.width = n), (this.height = i);
      }
      get() {
        return (
          this.minX.toString() +
          ' ' +
          this.minY.toString() +
          ' ' +
          this.width +
          ' ' +
          this.height
        );
      }
      zoomTo(e) {
        const t = this.imageHeight / e,
          n = this.imageWidth / e;
        (this.width = n), (this.height = t);
      }
      getZoom() {
        return this.imageWidth / this.width;
      }
      translate(e, t) {
        (this.minX += e), (this.minY += t);
      }
    }
    t.ViewBox = r;
    class o {
      resetZoomAndPan() {
        const e = document.getElementById('bgimg');
        (this.viewBox = new r(
          parseInt(e.getAttribute('width')),
          parseInt(e.getAttribute('height'))
        )),
          this.updateSVGViewBox();
      }
      zoomTo(e) {
        this.setViewBox(), this.viewBox.zoomTo(e), this.updateSVGViewBox();
      }
      translate(e, t) {
        this.setViewBox(),
          this.viewBox.translate(e, t),
          this.updateSVGViewBox();
      }
      restoreTransformation() {
        void 0 === this.viewBox
          ? this.resetZoomAndPan()
          : this.updateSVGViewBox();
      }
      setViewBox() {
        if (void 0 === this.viewBox) {
          const e = document.getElementById('bgimg');
          this.viewBox = new r(
            parseInt(e.getAttribute('width')),
            parseInt(e.getAttribute('height'))
          );
        }
        const e = document
          .getElementById('svg_group')
          .getAttribute('viewBox')
          .split(' ');
        this.viewBox.set(
          parseInt(e[0]),
          parseInt(e[1]),
          parseInt(e[2]),
          parseInt(e[3])
        );
      }
      updateSVGViewBox() {
        document
          .getElementById('svg_group')
          .setAttribute('viewBox', this.viewBox.get());
      }
      startDrag() {
        const e = document.getElementById('svg_group');
        (this.dragCoordinates = e.createSVGPoint()),
          'touchstart' === i.event.type
            ? ((this.dragCoordinates.x = i.event.touches[0].screenX),
              (this.dragCoordinates.y = i.event.touches[0].screenY))
            : ((this.dragCoordinates.x = i.event.x),
              (this.dragCoordinates.y = i.event.y)),
          (this.matrix = e.getScreenCTM().inverse());
      }
      dragging() {
        const e = document.getElementById('svg_group'),
          t = e.createSVGPoint();
        'touchmove' === i.event.type
          ? ((t.x = i.event.touches[0].screenX),
            (t.y = i.event.touches[0].screenY))
          : 'wheel' === i.event.type && !1 === i.event.shiftKey
          ? (void 0 === this.matrix &&
              (this.matrix = e.getScreenCTM().inverse()),
            void 0 === this.dragCoordinates &&
              (this.dragCoordinates = e.createSVGPoint()),
            (this.dragCoordinates.x = i.event.x),
            (this.dragCoordinates.y = i.event.y),
            (t.x = this.dragCoordinates.x - i.event.deltaX),
            (t.y = this.dragCoordinates.y - i.event.deltaY),
            i.event.preventDefault())
          : ((t.x = i.event.x), (t.y = i.event.y));
        const n = t.matrixTransform(this.matrix),
          r = this.dragCoordinates.matrixTransform(this.matrix);
        this.translate(-n.x + r.x, -n.y + r.y), (this.dragCoordinates = t);
      }
      scrollZoom() {
        if ('wheel' !== i.event.type) return;
        if (!i.event.shiftKey) return void this.dragging();
        const e = document.getElementById('zoomSlider');
        this.setViewBox();
        let t = this.viewBox.getZoom() - i.event.deltaX / 100;
        t < parseInt(e.getAttribute('min')) / 100 && (t = 0.25),
          t > parseInt(e.getAttribute('max')) / 100 && (t = 4),
          this.zoomTo(t),
          (e.value = (100 * t).toString()),
          (document.getElementById('zoomOutput').value = String(
            Math.round(100 * t)
          ));
      }
    }
    (t.ZoomHandler = o), (t.default = o);
  },
  function (e, t, n) {
    'use strict';
    n.r(t);
    n(81), n(82);
    function i(e) {
      const t = document.createElement(e),
        n = Array.prototype.slice.call(arguments, 1);
      for (; n.length; ) {
        r(t, n.shift());
      }
      return t;
    }
    function r(e, t) {
      if (null != t)
        if ('object' != typeof t && 'function' != typeof t)
          e.appendChild(document.createTextNode(t));
        else if (t instanceof window.Node) e.appendChild(t);
        else if (t instanceof Array) {
          const n = t.length;
          for (let i = 0; i < n; i++) r(e, t[i]);
        } else o(e, t);
    }
    function o(e, t) {
      for (const n in t)
        t.hasOwnProperty(n) &&
          ('style' === n ? s(e, t.style) : e.setAttribute(n, t[n]));
    }
    function s(e, t) {
      if (t)
        if ('object' == typeof t)
          for (const n in t) t.hasOwnProperty(n) && (e.style[n] = t[n]);
        else e.style.cssText = t;
    }
    function a(e) {
      (this.name = 'DivaParentElementNotFoundException'),
        (this.message = e),
        (this.stack = new Error().stack);
    }
    function c(e) {
      (this.name = 'NotAnIIIFManifestException'),
        (this.message = e),
        (this.stack = new Error().stack);
    }
    function l(e) {
      (this.name = 'ObjectDataNotSuppliedException'),
        (this.message = e),
        (this.stack = new Error().stack);
    }
    (a.prototype = new Error()),
      (c.prototype = new Error()),
      (l.prototype = new Error());
    var u = {
      Events: new (class {
        constructor() {
          this._cache = {};
        }
        publish(e, t, n) {
          if (this._cache[e]) {
            const i = this._cache[e];
            if (void 0 !== i.global) {
              const e = i.global,
                r = e.length;
              for (let i = 0; i < r; i++) e[i].apply(n || null, t || []);
            }
            if (n && void 0 !== n.getInstanceId) {
              const i = n.getInstanceId();
              if (this._cache[e][i]) {
                const r = this._cache[e][i],
                  o = r.length;
                for (let e = 0; e < o; e++) r[e].apply(n, t || []);
              }
            }
          }
        }
        subscribe(e, t, n) {
          return (
            this._cache[e] || (this._cache[e] = {}),
            'string' == typeof n
              ? (this._cache[e][n] || (this._cache[e][n] = []),
                this._cache[e][n].push(t))
              : (this._cache[e].global || (this._cache[e].global = []),
                this._cache[e].global.push(t)),
            n ? [e, t, n] : [e, t]
          );
        }
        unsubscribe(e, t) {
          const n = e[0];
          if (this._cache[n]) {
            let i;
            const r = 3 === e.length ? e[2] : 'global';
            if (((i = this._cache[n][r]), !i)) return !1;
            if (t) return delete this._cache[n][r], i.length > 0;
            let o = i.length;
            for (; o--; )
              if (i[o] === e[1]) return this._cache[n][r].splice(o, 1), !0;
          }
          return !1;
        }
        unsubscribeAll(e) {
          if (e) {
            const t = Object.keys(this._cache);
            let n,
              i = t.length;
            for (; i--; )
              (n = t[i]),
                void 0 !== this._cache[n][e] && delete this._cache[n][e];
          } else this._cache = {};
        }
      })(),
    };
    var d = {
      onDoubleClick: function (e, t) {
        e.addEventListener('dblclick', function (e) {
          e.ctrlKey || t(e, p(e.currentTarget, e));
        });
        const n = f(500);
        e.addEventListener('contextmenu', function (e) {
          e.preventDefault(),
            e.ctrlKey &&
              (n.isTriggered()
                ? (n.reset(), t(e, p(e.currentTarget, e)))
                : n.trigger());
        });
      },
      onPinch: function (e, t) {
        let n = 0;
        e.addEventListener('touchstart', function (e) {
          e.preventDefault(),
            2 === e.originalEvent.touches.length &&
              (n = h(
                e.originalEvent.touches[0].clientX,
                e.originalEvent.touches[0].clientY,
                e.originalEvent.touches[1].clientX,
                e.originalEvent.touches[1].clientY
              ));
        }),
          e.addEventListener('touchmove', function (e) {
            if ((e.preventDefault(), 2 === e.originalEvent.touches.length)) {
              const i = e.originalEvent.touches,
                r = h(i[0].clientX, i[0].clientY, i[1].clientX, i[1].clientY),
                o = r - n;
              if (Math.abs(o) > 0) {
                const o = {
                  pageX: (i[0].clientX + i[1].clientX) / 2,
                  pageY: (i[0].clientY + i[1].clientY) / 2,
                };
                t(e, p(e.currentTarget, o), n, r);
              }
            }
          });
      },
      onDoubleTap: function (e, t) {
        const n = f(250);
        let i = null;
        e.addEventListener('touchend', (e) => {
          if ((e.preventDefault(), n.isTriggered())) {
            n.reset();
            const r = {
              pageX: e.originalEvent.changedTouches[0].clientX,
              pageY: e.originalEvent.changedTouches[0].clientY,
            };
            h(i.pageX, i.pageY, r.pageX, r.pageY) < 50 &&
              t(e, p(e.currentTarget, r)),
              (i = null);
          } else
            (i = {
              pageX: e.originalEvent.changedTouches[0].clientX,
              pageY: e.originalEvent.changedTouches[0].clientY,
            }),
              n.trigger();
        });
      },
    };
    function h(e, t, n, i) {
      return Math.sqrt((n - e) * (n - e) + (i - t) * (i - t));
    }
    function f(e) {
      let t = !1,
        n = null;
      return {
        trigger() {
          (t = !0),
            i(),
            (n = setTimeout(function () {
              (t = !1), (n = null);
            }, e));
        },
        isTriggered: () => t,
        reset() {
          (t = !1), i();
        },
      };
      function i() {
        null !== n && (clearTimeout(n), (n = null));
      }
    }
    function p(e, t) {
      const n = e.getBoundingClientRect();
      return { left: t.pageX - n.left, top: t.pageY - n.top };
    }
    var g = n(21);
    class v {
      constructor(e, t) {
        (this.page = e),
          (this._viewerCore = t),
          (this._innerElement = this._viewerCore.getSettings().innerElement),
          (this._pageToolsElem = null),
          (this.labelWidth = 0);
      }
      mount() {
        null === this._pageToolsElem &&
          ((this._buttons = this._initializePageToolButtons()),
          (this._pageToolsElem = i(
            'div',
            { class: 'diva-page-tools-wrapper' },
            i('div', { class: 'diva-page-tools' }, this._buttons)
          )),
          (this._pageLabelsElem = i(
            'div',
            { class: 'diva-page-labels-wrapper' },
            i(
              'div',
              { class: 'diva-page-labels' },
              this._viewerCore.settings.manifest.pages[this.page].l
            )
          ))),
          this.refresh(),
          this._innerElement.appendChild(this._pageToolsElem),
          this._innerElement.appendChild(this._pageLabelsElem);
      }
      _initializePageToolButtons() {
        const e = this._viewerCore.getSettings(),
          t = this._viewerCore.getPublicInstance(),
          n = this.page;
        return this._viewerCore.getPageTools().map((i) => {
          const r = i.pageToolsIcon.cloneNode(!0);
          return (
            r.addEventListener(
              'click',
              (r) => {
                i.handleClick.call(i, r, e, t, n);
              },
              !1
            ),
            r.addEventListener(
              'touchend',
              (r) => {
                r.preventDefault(), i.handleClick.call(i, r, e, t, n);
              },
              !1
            ),
            r
          );
        });
      }
      unmount() {
        this._innerElement.removeChild(this._pageToolsElem),
          this._innerElement.removeChild(this._pageLabelsElem);
      }
      refresh() {
        const e = this._viewerCore.getPageRegion(this.page, {
          includePadding: !0,
          incorporateViewport: !0,
        });
        let t = window
          .getComputedStyle(this._innerElement, null)
          .getPropertyValue('margin-left');
        (this._pageToolsElem.style.top = e.top + 'px'),
          (this._pageToolsElem.style.left = e.left - parseInt(t) + 'px'),
          (this._pageLabelsElem.style.top = e.top + 'px'),
          (this._pageLabelsElem.style.left =
            e.right - parseInt(t) - this.labelWidth - 5 + 'px');
      }
    }
    class m {
      constructor(e) {
        if (
          ((this._viewerCore = e),
          (this._viewerState = e.getInternalState()),
          (this._overlays = []),
          this._viewerCore.getPageTools().length)
        ) {
          const t = e.getSettings().numPages;
          for (let n = 0; n < t; n++) {
            const t = new v(n, e);
            this._overlays.push(t), this._viewerCore.addPageOverlay(t);
            let i = document.createElement('span');
            (i.innerHTML = e.settings.manifest.pages[n].l),
              i.classList.add('diva-page-labels'),
              i.setAttribute('style', 'display: inline-block;'),
              document.body.appendChild(i);
            let r = i.clientWidth;
            document.body.removeChild(i), (t.labelWidth = r);
          }
        }
      }
      onDoubleClick(e, t) {
        const n = this._viewerCore.getSettings(),
          i = e.ctrlKey ? n.zoomLevel - 1 : n.zoomLevel + 1,
          r = this._viewerCore.getPagePositionAtViewportOffset(t);
        this._viewerCore.zoom(i, r);
      }
      onPinch(e, t, n, i) {
        const r = this._viewerCore.getInternalState(),
          o = this._viewerCore.getSettings();
        let s =
          Math.log((Math.pow(2, o.zoomLevel) * i) / (n * Math.log(2))) /
          Math.log(2);
        if (
          ((s = Math.max(o.minZoomLevel, s)),
          (s = Math.min(o.maxZoomLevel, s)),
          s === o.zoomLevel)
        )
          return;
        const a = this._viewerCore.getPagePositionAtViewportOffset(t),
          c = this._viewerCore
            .getCurrentLayout()
            .getPageToViewportCenterOffset(a.anchorPage, r.viewport),
          l = 1 / Math.pow(2, o.zoomLevel - s);
        this._viewerCore.reload({
          zoomLevel: s,
          goDirectlyTo: a.anchorPage,
          horizontalOffset: c.x - a.offset.left + a.offset.left * l,
          verticalOffset: c.y - a.offset.top + a.offset.top * l,
        });
      }
      onViewWillLoad() {
        this._viewerCore.publish(
          'DocumentWillLoad',
          this._viewerCore.getSettings()
        );
      }
      onViewDidLoad() {
        this._handleZoomLevelChange();
        const e = this._viewerCore.getSettings().activePageIndex,
          t = this._viewerCore.getPageName(e);
        this._viewerCore.publish('DocumentDidLoad', e, t);
      }
      onViewDidUpdate(e, t) {
        const n =
          null !== t
            ? t
            : (function (e, t, n) {
                const i = n.top + n.height / 2,
                  r = n.left + n.width / 2,
                  o = Object(g.maxBy)(e, (e) => {
                    const n = t.getPageDimensions(e),
                      o = t.getPageOffset(e, { includePadding: !0 }),
                      s = o.left + n.width / 2,
                      a = o.top + n.height / 2,
                      c = Math.max(Math.abs(r - s) - n.width / 2, 0),
                      l = Math.max(Math.abs(i - a) - n.height / 2, 0);
                    return -(c * c + l * l);
                  });
                return null != o ? o : null;
              })(
                e,
                this._viewerCore.getCurrentLayout(),
                this._viewerCore.getViewport()
              );
        let i = this._viewerState.viewport.intersectionTolerance;
        this._viewerState.viewport.intersectionTolerance = 0;
        let r = e.filter((e) => this._viewerState.renderer.isPageVisible(e));
        (this._viewerState.viewport.intersectionTolerance = i),
          null !== n && this._viewerCore.setCurrentPages(n, r),
          null !== t && this._viewerCore.publish('ViewerDidJump', t),
          this._handleZoomLevelChange();
      }
      _handleZoomLevelChange() {
        const e = this._viewerState,
          t = e.options.zoomLevel;
        e.oldZoomLevel !== t &&
          e.oldZoomLevel >= 0 &&
          (e.oldZoomLevel < t
            ? this._viewerCore.publish('ViewerDidZoomIn', t)
            : this._viewerCore.publish('ViewerDidZoomOut', t),
          this._viewerCore.publish('ViewerDidZoom', t)),
          (e.oldZoomLevel = t);
      }
      destroy() {
        this._overlays.forEach((e) => {
          this._viewerCore.removePageOverlay(e);
        }, this);
      }
    }
    class y {
      constructor(e) {
        this._viewerCore = e;
      }
      onDoubleClick(e, t) {
        const n = this._viewerCore.getPagePositionAtViewportOffset(t),
          i = this._viewerCore.getCurrentLayout(),
          r = this._viewerCore.getViewport(),
          o = i.getPageToViewportCenterOffset(n.anchorPage, r);
        this._viewerCore.reload({
          inGrid: !1,
          goDirectlyTo: n.anchorPage,
          horizontalOffset: o.x + n.offset.left,
          verticalOffset: o.y + n.offset.top,
        });
      }
      onPinch() {
        this._viewerCore.reload({ inGrid: !1 });
      }
      onViewWillLoad() {}
      onViewDidLoad() {}
      onViewDidUpdate(e, t) {
        if (0 === e.length) return;
        let n = this._viewerCore.viewerState.viewport.intersectionTolerance;
        this._viewerCore.viewerState.viewport.intersectionTolerance = 0;
        let i = e.filter((e) =>
          this._viewerCore.viewerState.renderer.isPageVisible(e)
        );
        if (
          ((this._viewerCore.viewerState.viewport.intersectionTolerance = n),
          null !== t)
        )
          return void this._viewerCore.setCurrentPages(t, i);
        const r = this._viewerCore.getCurrentLayout(),
          o = [];
        e.forEach((e) => {
          const t = r.getPageInfo(e).group;
          (0 !== o.length && t === o[o.length - 1]) || o.push(t);
        });
        const s = this._viewerCore.getViewport();
        let a;
        a =
          1 === o.length || o[0].region.top >= s.top
            ? o[0]
            : o[1].region.bottom <= s.bottom
            ? o[1]
            : (function (e, t) {
                const n = t.top + t.height / 2;
                return Object(g.maxBy)(e, (e) => {
                  const t = e.region.top + e.dimensions.height / 2;
                  return -Math.abs(n - t);
                });
              })(o, s);
        const c = this._viewerCore.getSettings().activePageIndex;
        a.pages.some((e) => e.index === c) ||
          this._viewerCore.setCurrentPages(a.pages[0].index, i);
      }
      destroy() {}
    }
    class b {
      constructor() {
        (this._pages = {}),
          (this._renderedPages = []),
          (this._renderedPageMap = {});
      }
      addOverlay(e) {
        (this._pages[e.page] || (this._pages[e.page] = [])).push(e),
          this._renderedPageMap[e.page] && e.mount();
      }
      removeOverlay(e) {
        const t = e.page,
          n = this._pages[t];
        if (!n) return;
        const i = n.indexOf(e);
        -1 !== i &&
          (this._renderedPageMap[t] && n[i].unmount(),
          n.splice(i, 1),
          0 === n.length && delete this._pages[t]);
      }
      updateOverlays(e) {
        const t = this._renderedPages,
          n = {};
        e.map((e) => {
          (n[e] = !0),
            this._renderedPageMap[e] ||
              ((this._renderedPageMap[e] = !0),
              this._invokeOnOverlays(e, (e) => {
                e.mount();
              }));
        }),
          t.map((e) => {
            n[e]
              ? this._invokeOnOverlays(e, (e) => {
                  e.refresh();
                })
              : (delete this._renderedPageMap[e],
                this._invokeOnOverlays(e, (e) => {
                  e.unmount();
                }));
          }),
          (this._renderedPages = e);
      }
      _invokeOnOverlays(e, t) {
        const n = this._pages[e];
        n && n.map((e) => t(e));
      }
    }
    class w {
      constructor(e, t) {
        (this._rows = e),
          (this._cols = t),
          (this._map = new Array(e)
            .fill(null)
            .map(() => new Array(t).fill(!1)));
      }
      isLoaded(e, t) {
        return e >= this._rows || t >= this._cols || this._map[e][t];
      }
      set(e, t, n) {
        this._map[e][t] = n;
      }
    }
    class _ {
      constructor(e) {
        this._levels = e;
        const t = (this._urlsToTiles = {});
        e.forEach((e) => {
          e.tiles.forEach((n) => {
            t[n.url] = { zoomLevel: e.zoomLevel, row: n.row, col: n.col };
          });
        }),
          this.clear();
      }
      clear() {
        const e = (this._loadedByLevel = {});
        this._levels.forEach((t) => {
          e[t.zoomLevel] = new w(t.rows, t.cols);
        });
      }
      getTiles(e) {
        const t = [],
          n = this._levels[0].zoomLevel,
          i = new w(this._levels[0].rows, this._levels[0].cols);
        let r;
        if (null === e) r = 0;
        else {
          const t = Math.ceil(e);
          r = (function (e, t) {
            const n = e.length;
            for (let i = 0; i < n; i++) if (t(e[i], i)) return i;
            return -1;
          })(this._levels, (e) => e.zoomLevel <= t);
        }
        this._levels
          .slice(0, r + 1)
          .reverse()
          .concat(this._levels.slice(r + 1))
          .forEach((e) => {
            const r = this._loadedByLevel[e.zoomLevel];
            let o = e.tiles.filter((e) => r.isLoaded(e.row, e.col));
            const s = Math.pow(2, n - e.zoomLevel);
            (o = o.filter((e) => {
              let t = !1;
              const n = e.row * s,
                r = e.col * s;
              for (let e = 0; e < s; e++)
                for (let o = 0; o < s; o++)
                  i.isLoaded(n + e, r + o) ||
                    ((t = !0), i.set(n + e, r + o, !0));
              return t;
            })),
              t.push(o);
          }, this),
          t.reverse();
        const o = [];
        return (
          t.forEach((e) => {
            o.push.apply(o, e);
          }),
          o
        );
      }
      updateFromCache(e) {
        this.clear(),
          this._levels.forEach((t) => {
            const n = this._loadedByLevel[t.zoomLevel];
            t.tiles.forEach((t) => {
              e.has(t.url) && n.set(t.row, t.col, !0);
            });
          }, this);
      }
      updateWithLoadedUrls(e) {
        e.forEach((e) => {
          const t = this._urlsToTiles[e];
          this._loadedByLevel[t.zoomLevel].set(t.row, t.col, !0);
        }, this);
      }
    }
    class E {
      constructor(e, t) {
        const n = (function (e, t) {
          const n =
              null === t
                ? e.pageLayouts
                : (function (e, t) {
                    const n = Math.pow(2, t - e.maxZoomLevel);
                    return e.pageLayouts.map((e) => ({
                      dimensions: x(e.dimensions, n),
                      pages: e.pages.map((e) => ({
                        index: e.index,
                        groupOffset: {
                          top: Math.floor(e.groupOffset.top * n),
                          left: Math.floor(e.groupOffset.left * n),
                        },
                        dimensions: x(e.dimensions, n),
                      })),
                    }));
                  })(e, t),
            i = (function (e, t) {
              let n, i;
              const r = e.padding.document;
              e.verticallyOriented
                ? ((n = 'width'), (i = r.left + r.right))
                : ((n = 'height'), (i = r.top + r.bottom));
              return i + t.reduce((e, t) => Math.max(t.dimensions[n], e), 0);
            })(e, n);
          let r = e.verticallyOriented
            ? e.padding.document.top
            : e.padding.document.left;
          const o = [],
            s = { top: e.padding.page.top, left: e.padding.page.left };
          let a, c;
          n.forEach((t, n) => {
            let a, c;
            e.verticallyOriented
              ? ((a = r), (c = (i - t.dimensions.width) / 2))
              : ((a = (i - t.dimensions.height) / 2), (c = r));
            const l = {
              top: a,
              bottom: a + s.top + t.dimensions.height,
              left: c,
              right: c + s.left + t.dimensions.width,
            };
            o.push({
              index: n,
              dimensions: t.dimensions,
              pages: t.pages,
              region: l,
              padding: s,
            }),
              (r = e.verticallyOriented ? l.bottom : l.right);
          }),
            e.verticallyOriented
              ? ((a = r + s.top), (c = i))
              : ((a = i), (c = r + s.left));
          return { dimensions: { height: a, width: c }, pageGroups: o };
        })(e, t);
        (this.dimensions = n.dimensions),
          (this.pageGroups = n.pageGroups),
          (this._pageLookup = (function (e) {
            const t = {};
            return (
              e.forEach((e) => {
                e.pages.forEach((n) => {
                  t[n.index] = {
                    index: n.index,
                    group: e,
                    dimensions: n.dimensions,
                    groupOffset: n.groupOffset,
                  };
                });
              }),
              t
            );
          })(n.pageGroups));
      }
      getPageInfo(e) {
        return this._pageLookup[e] || null;
      }
      getPageDimensions(e) {
        if (!this._pageLookup || !this._pageLookup[e]) return null;
        const t = S(this._pageLookup[e]);
        return { height: t.bottom - t.top, width: t.right - t.left };
      }
      getPageOffset(e, t) {
        const n = this.getPageRegion(e, t);
        return n ? { top: n.top, left: n.left } : null;
      }
      getPageRegion(e, t) {
        const n = this._pageLookup[e];
        if (!n) return null;
        const i = S(n),
          r = n.group.padding;
        return t && t.includePadding
          ? {
              top: i.top + r.top,
              left: i.left + r.left,
              bottom: i.bottom,
              right: i.right,
            }
          : {
              top: i.top,
              left: i.left,
              bottom: i.bottom + r.top,
              right: i.right,
            };
      }
      getPageToViewportCenterOffset(e, t) {
        const n = t.left,
          i = t.right - t.left,
          r = this.getPageOffset(e),
          o = n - r.left + parseInt(i / 2, 10),
          s = t.top,
          a = t.bottom - t.top;
        return { x: o, y: s - r.top + parseInt(a / 2, 10) };
      }
    }
    function S(e) {
      const t = e.groupOffset.top + e.group.region.top,
        n = t + e.dimensions.height,
        i = e.groupOffset.left + e.group.region.left;
      return { top: t, bottom: n, left: i, right: i + e.dimensions.width };
    }
    function x(e, t) {
      return {
        height: Math.floor(e.height * t),
        width: Math.floor(e.width * t),
      };
    }
    const L = n(50)('diva:ImageCache');
    class k {
      constructor(e) {
        (e = e || { maxKeys: 100 }),
          (this.maxKeys = e.maxKeys || 100),
          (this._held = {}),
          (this._urls = {}),
          (this._lru = []);
      }
      get(e) {
        const t = this._urls[e];
        return t ? t.img : null;
      }
      has(e) {
        return !!this._urls[e];
      }
      put(e, t) {
        let n = this._urls[e];
        n
          ? ((n.img = t), this._promote(n))
          : ((n = { img: t, url: e }),
            (this._urls[e] = n),
            this._tryEvict(1),
            this._lru.unshift(n));
      }
      _promote(e) {
        const t = this._lru.indexOf(e);
        this._lru.splice(t, 1), this._lru.unshift(e);
      }
      _tryEvict(e) {
        const t = this.maxKeys - e;
        if (this._lru.length <= t) return;
        let n = this._lru.length - 1;
        for (;;) {
          const e = this._lru[n];
          if (
            !this._held[e.url] &&
            (L('Evicting image %s', e.url),
            this._lru.splice(n, 1),
            delete this._urls[e.url],
            this._lru.length <= t)
          )
            break;
          if (0 === n) {
            L.enabled &&
              L(
                'Cache overfull by %s (all entries are being held)',
                this._lru.length - t
              );
            break;
          }
          n--;
        }
      }
      acquire(e) {
        (this._held[e] = (this._held[e] || 0) + 1),
          this._promote(this._urls[e]);
      }
      release(e) {
        this._held[e] > 1 ? this._held[e]-- : delete this._held[e],
          this._tryEvict(0);
      }
    }
    class C {
      constructor(e) {
        (this._url = e.url),
          (this._callback = e.load),
          (this._errorCallback = e.error),
          (this.timeoutTime = e.timeoutTime || 0),
          (this._aborted = this._complete = !1),
          (this._crossOrigin = e.settings.imageCrossOrigin),
          (this.timeout = setTimeout(() => {
            (this._image = new Image()),
              (this._image.crossOrigin = this._crossOrigin),
              (this._image.onload = this._handleLoad.bind(this)),
              (this._image.onerror = this._handleError.bind(this)),
              (this._image.src = e.url);
          }, this.timeoutTime));
      }
      abort() {
        clearTimeout(this.timeout),
          this._image &&
            ((this._image.onload = this._image.onerror = null),
            (this._image.src = '')),
          (this._aborted = !0);
      }
      _handleLoad() {
        this._aborted
          ? console.error(
              'ImageRequestHandler invoked on cancelled request for ' +
                this._url
            )
          : this._complete
          ? console.error(
              'ImageRequestHandler invoked on completed request for ' +
                this._url
            )
          : ((this._complete = !0), this._callback(this._image));
      }
      _handleError() {
        this._errorCallback(this._image);
      }
    }
    var I = {
      animate: function (e) {
        const t = e.duration,
          n = e.parameters,
          i = e.onUpdate,
          r = e.onEnd,
          o = A(),
          s = o + t,
          a = {},
          c = {},
          l = Object.keys(n);
        l.forEach((e) => {
          const t = n[e];
          a[e] = (function (e, t, n) {
            return (i) => e + (t - e) * n(i);
          })(t.from, t.to, t.easing || P);
        });
        let u = requestAnimationFrame(function e() {
          const n = A();
          (function (e) {
            l.forEach((t) => {
              c[t] = a[t](e);
            });
          })(Math.min((n - o) / t, 1)),
            i(c),
            n < s ? (u = requestAnimationFrame(e)) : d({ interrupted: !1 });
        });
        return {
          cancel() {
            null !== u && (cancelAnimationFrame(u), d({ interrupted: !0 }));
          },
        };
        function d(e) {
          (u = null), r && r(e);
        }
      },
      easing: {
        linear: function (e) {
          return e;
        },
        cubic: P,
      },
    };
    let A;
    function P(e) {
      return e < 0.5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1;
    }
    A =
      'undefined' != typeof performance && performance.now
        ? () => performance.now()
        : () => Date.now();
    class O {
      constructor(e, t) {
        (this._viewport = e.viewport),
          (this._outerElement = e.outerElement),
          (this._documentElement = e.innerElement),
          (this._settings = e.settings),
          (this._hooks = t || {}),
          (this._canvas = i('canvas', { class: 'diva-viewer-canvas' })),
          (this._ctx = this._canvas.getContext('2d')),
          (this.layout = null),
          (this._sourceResolver = null),
          (this._renderedPages = null),
          (this._config = null),
          (this._zoomLevel = null),
          (this._compositeImages = null),
          (this._renderedTiles = null),
          (this._animation = null),
          (this._cache = new k()),
          (this._pendingRequests = {});
      }
      static getCompatibilityErrors() {
        return 'undefined' != typeof HTMLCanvasElement
          ? null
          : [
              'Your browser lacks support for the ',
              i('pre', 'canvas'),
              ' element. Please upgrade your browser.',
            ];
      }
      load(e, t, n) {
        if (
          (this._clearAnimation(),
          this._hooks.onViewWillLoad && this._hooks.onViewWillLoad(),
          (this._sourceResolver = n),
          (this._config = e),
          (this._compositeImages = {}),
          this._setLayoutToZoomLevel(t.zoomLevel),
          !this.layout.getPageInfo(t.anchorPage))
        )
          throw new Error('invalid page: ' + t.anchorPage);
        (this._canvas.width === this._viewport.width &&
          this._canvas.height === this._viewport.height) ||
          ((this._canvas.width = this._viewport.width),
          (this._canvas.height = this._viewport.height)),
          this.goto(t.anchorPage, t.verticalOffset, t.horizontalOffset),
          this._canvas.parentNode !== this._outerElement &&
            this._outerElement.insertBefore(
              this._canvas,
              this._outerElement.firstChild
            ),
          this._hooks.onViewDidLoad && this._hooks.onViewDidLoad();
      }
      _setViewportPosition(e) {
        if (e.zoomLevel !== this._zoomLevel) {
          if (null === this._zoomLevel)
            throw new TypeError('The current view is not zoomable');
          if (null === e.zoomLevel)
            throw new TypeError('The current view requires a zoom level');
          this._setLayoutToZoomLevel(e.zoomLevel);
        }
        this._goto(e.anchorPage, e.verticalOffset, e.horizontalOffset);
      }
      _setLayoutToZoomLevel(e) {
        (this.layout = new E(this._config, e)),
          (this._zoomLevel = e),
          o(this._documentElement, {
            style: {
              height: this.layout.dimensions.height + 'px',
              width: this.layout.dimensions.width + 'px',
            },
          }),
          this._viewport.setInnerDimensions(this.layout.dimensions);
      }
      adjust() {
        this._clearAnimation(),
          this._render(),
          this._hooks.onViewDidUpdate &&
            this._hooks.onViewDidUpdate(this._renderedPages.slice(), null);
      }
      _render() {
        const e = [];
        this.layout.pageGroups.forEach((t) => {
          if (!this._viewport.intersectsRegion(t.region)) return;
          const n = t.pages
            .filter(function (e) {
              return this.isPageVisible(e.index);
            }, this)
            .map((e) => e.index);
          e.push.apply(e, n);
        }, this),
          this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height),
          this._paintOutline(e),
          e.forEach((e) => {
            if (!this._compositeImages[e]) {
              const t = this.layout.getPageInfo(e),
                n = this._sourceResolver.getAllZoomLevelsForPage(t),
                i = new _(n);
              i.updateFromCache(this._cache), (this._compositeImages[e] = i);
            }
          }, this),
          this._initiateTileRequests(e);
        const t = T(this._renderedPages || [], e);
        t.removed.forEach((e) => {
          delete this._compositeImages[e];
        }, this),
          (this._renderedPages = e),
          this._paint(),
          this._hooks.onPageWillLoad &&
            t.added.forEach((e) => {
              this._hooks.onPageWillLoad(e);
            }, this);
      }
      _paint() {
        const e = [];
        this._renderedPages.forEach((t) => {
          this._compositeImages[t].getTiles(this._zoomLevel).forEach((n) => {
            const i = B(n, this._zoomLevel);
            this._isTileVisible(t, i) &&
              (e.push(n.url), this._drawTile(t, i, this._cache.get(n.url)));
          });
        });
        const t = this._cache,
          n = T(this._renderedTiles || [], e);
        n.added.forEach((e) => {
          t.acquire(e);
        }),
          n.removed.forEach((e) => {
            t.release(e);
          }),
          n.removed &&
            this._renderedPages.forEach((e) => {
              this._compositeImages[e].updateFromCache(this._cache);
            }, this),
          (this._renderedTiles = e);
      }
      _paintOutline(e) {
        e.forEach((e) => {
          let t = this.layout.getPageInfo(e),
            n = this._getImageOffset(e),
            i = Math.max(
              0,
              (this._viewport.width - this.layout.dimensions.width) / 2
            ),
            r = Math.max(
              0,
              (this._viewport.height - this.layout.dimensions.height) / 2
            ),
            o = n.left - this._viewport.left + i,
            s = n.top - this._viewport.top + r,
            a = o < 0 ? -o : 0,
            c = s < 0 ? -s : 0,
            l = Math.max(0, o),
            u = Math.max(0, s),
            d = t.dimensions.width - a,
            h = t.dimensions.height - c;
          (this._ctx.strokeStyle = '#AAA'),
            this._ctx.strokeRect(l + 0.5, u + 0.5, d, h);
        });
      }
      _initiateTileRequests(e) {
        const t = {},
          n = (e, n) => {
            const i = this._compositeImages[n];
            t[e.url] = new C({
              url: e.url,
              timeoutTime: 250,
              settings: this._settings,
              load: (t) => {
                delete this._pendingRequests[e.url],
                  this._cache.put(e.url, t),
                  i === this._compositeImages[n]
                    ? (i.updateWithLoadedUrls([e.url]),
                      this._isTileForSourceVisible(n, e) && this._paint())
                    : this._isTileForSourceVisible(n, e) && this._paint();
              },
              error: () => {
                delete this._pendingRequests[e.url];
              },
            });
          };
        for (let i = 0; i < e.length; i++) {
          const r = e[i],
            o = this._sourceResolver.getBestZoomLevelForPage(
              this.layout.getPageInfo(r)
            ).tiles;
          for (let e = 0; e < o.length; e++) {
            const i = o[e];
            !this._cache.has(i.url) &&
              this._isTileForSourceVisible(r, i) &&
              (this._pendingRequests[i.url]
                ? ((t[i.url] = this._pendingRequests[i.url]),
                  delete this._pendingRequests[i.url])
                : n(i, r));
          }
        }
        for (const e in this._pendingRequests) this._pendingRequests[e].abort();
        this._pendingRequests = t;
      }
      _drawTile(e, t, n) {
        let i = this._getTileToDocumentOffset(e, t),
          r = Math.max(
            0,
            (this._viewport.width - this.layout.dimensions.width) / 2
          ),
          o = Math.max(
            0,
            (this._viewport.height - this.layout.dimensions.height) / 2
          ),
          s = i.left - this._viewport.left + r,
          a = i.top - this._viewport.top + o,
          c = s < 0 ? -s : 0,
          l = a < 0 ? -a : 0,
          u = Math.max(0, s),
          d = Math.max(0, a),
          h = c / t.scaleRatio,
          f = l / t.scaleRatio,
          p = Math.min(t.dimensions.width, n.width * t.scaleRatio) - c,
          g = Math.min(t.dimensions.height, n.height * t.scaleRatio) - l,
          v = Math.max(1, Math.round(p)),
          m = Math.max(1, Math.round(g)),
          y = v / t.scaleRatio,
          b = m / t.scaleRatio;
        this._ctx.drawImage(n, h, f, y, b, u, d, v, m);
      }
      _isTileForSourceVisible(e, t) {
        return this._isTileVisible(e, B(t, this._zoomLevel));
      }
      _isTileVisible(e, t) {
        const n = this._getTileToDocumentOffset(e, t);
        return this._viewport.intersectsRegion({
          top: n.top,
          bottom: n.top + t.dimensions.height,
          left: n.left,
          right: n.left + t.dimensions.width,
        });
      }
      _getTileToDocumentOffset(e, t) {
        const n = this._getImageOffset(e);
        return { top: n.top + t.offset.top, left: n.left + t.offset.left };
      }
      _getImageOffset(e) {
        return this.layout.getPageOffset(e, { includePadding: !0 });
      }
      goto(e, t, n) {
        this._clearAnimation(),
          this._goto(e, t, n),
          this._hooks.onViewDidUpdate &&
            this._hooks.onViewDidUpdate(this._renderedPages.slice(), e);
      }
      _goto(e, t, n) {
        const i = this.layout.getPageOffset(e),
          r = i.top + t - Math.round(this._viewport.height / 2),
          o = i.left + n - Math.round(this._viewport.width / 2);
        (this._viewport.top = r), (this._viewport.left = o), this._render();
      }
      transitionViewportPosition(e) {
        this._clearAnimation();
        const t = e.getPosition,
          n = this._hooks.onViewDidTransition;
        this._animation = I.animate({
          duration: e.duration,
          parameters: e.parameters,
          onUpdate: (e) => {
            this._setViewportPosition(t(e)),
              this._hooks.onZoomLevelWillChange(e.zoomLevel),
              n && n();
          },
          onEnd: (t) => {
            e.onEnd && e.onEnd(t),
              this._hooks.onViewDidUpdate &&
                !t.interrupted &&
                this._hooks.onViewDidUpdate(this._renderedPages.slice(), null);
          },
        });
      }
      _clearAnimation() {
        this._animation && (this._animation.cancel(), (this._animation = null));
      }
      isPageVisible(e) {
        if (!this.layout) return !1;
        return (
          !!this.layout.getPageInfo(e) &&
          this._viewport.intersectsRegion(this.layout.getPageRegion(e))
        );
      }
      getRenderedPages() {
        return this._renderedPages.slice();
      }
      destroy() {
        this._clearAnimation(),
          Object.keys(this._pendingRequests).forEach((e) => {
            const t = this._pendingRequests[e];
            delete this._pendingRequests[e], t.abort();
          }, this),
          this._canvas.parentNode.removeChild(this._canvas);
      }
    }
    function B(e, t) {
      let n;
      return (
        (n = null === t ? 1 : Math.pow(2, t - e.zoomLevel)),
        {
          sourceZoomLevel: e.zoomLevel,
          scaleRatio: n,
          row: e.row,
          col: e.col,
          dimensions: {
            width: e.dimensions.width * n,
            height: e.dimensions.height * n,
          },
          offset: { left: e.offset.left * n, top: e.offset.top * n },
          url: e.url,
        }
      );
    }
    function T(e, t) {
      if (e === t) return { added: [], removed: [] };
      const n = e.filter((e) => -1 === t.indexOf(e));
      return { added: t.filter((t) => -1 === e.indexOf(t)), removed: n };
    }
    function N(e, t) {
      const n = t.getMaxPageDimensions(e);
      return { width: Math.floor(n.width), height: Math.floor(n.height) };
    }
    function M(e) {
      return (function (e) {
        const t = e.manifest,
          n = [];
        let i = null,
          r = [];
        const o = () => {
          for (let e = 0, t = r.length; e < t; e++) n.push([r[e]]);
          r = [];
        };
        t.pages.forEach((s, a) => {
          const c = {
            index: a,
            dimensions: N(a, t),
            paged: !t.paged || s.paged,
          };
          (e.showNonPagedPages || c.paged) &&
            (c.paged
              ? 0 === a || s.facingPages
                ? (n.push([c]), o())
                : null === i
                ? (i = c)
                : (n.push([i, c]), (i = null), o())
              : r.push(c));
        }),
          null !== i && (n.push([i]), o());
        return n;
      })(e).map((t) =>
        (function (e, t) {
          const n = e.verticallyOriented;
          if (2 === t.length)
            return (function (e, t, n) {
              const i = e.dimensions,
                r = t.dimensions,
                o = Math.max(i.height, r.height);
              let s, a, c;
              if (n) {
                const e = Math.max(i.width, r.width);
                (s = 2 * e), (a = e - i.width), (c = e);
              } else (s = i.width + r.width), (a = 0), (c = i.width);
              return {
                dimensions: { height: o, width: s },
                pages: [
                  {
                    index: e.index,
                    dimensions: i,
                    groupOffset: { top: 0, left: a },
                  },
                  {
                    index: t.index,
                    dimensions: r,
                    groupOffset: { top: 0, left: c },
                  },
                ],
              };
            })(t[0], t[1], n);
          const i = t[0],
            r = i.dimensions;
          let o;
          o = i.paged
            ? 0 === i.index && n
              ? r.width
              : 0
            : n
            ? r.width / 2
            : 0;
          const s = n && !e.manifest.pages[i.index].facingPages;
          return {
            dimensions: { height: r.height, width: s ? 2 * r.width : r.width },
            pages: [
              {
                index: i.index,
                groupOffset: { top: 0, left: o },
                dimensions: r,
              },
            ],
          };
        })(e, t)
      );
    }
    function j(e) {
      const t = e.viewport.width,
        n = e.manifest,
        i = e.pagesPerRow,
        r = e.fixedHeightGrid,
        o = e.fixedPadding,
        s = e.showNonPagedPages,
        a = (t - o * (i + 1)) / i,
        c = a,
        l = r ? o + n.minRatio * a : o + n.maxRatio * a,
        u = [];
      let d = [];
      const h = { height: l, width: t };
      return (
        n.pages.forEach((e, t) => {
          if (!s && n.paged && !e.paged) return;
          const a = ((e) => {
            const t = e.d[e.d.length - 1],
              n = t.h / t.w;
            let i, s;
            return (
              r ? ((i = (l - o) / n), (s = l - o)) : ((i = c), (s = i * n)),
              { width: Math.round(i), height: Math.round(s) }
            );
          })(e);
          let f = Math.floor(d.length * (o + c) + o);
          r && (f += (c - a.width) / 2),
            d.push({
              index: t,
              dimensions: a,
              groupOffset: { top: 0, left: f },
            }),
            d.length === i && (u.push({ dimensions: h, pages: d }), (d = []));
        }),
        d.length > 0 && u.push({ dimensions: h, pages: d }),
        u
      );
    }
    function D(e) {
      if (e.inGrid)
        return j(
          q(e, [
            'manifest',
            'viewport',
            'pagesPerRow',
            'fixedHeightGrid',
            'fixedPadding',
            'showNonPagedPages',
          ])
        );
      {
        const t = q(e, ['manifest', 'verticallyOriented', 'showNonPagedPages']);
        return e.inBookLayout
          ? M(t)
          : (function (e) {
              const t = e.manifest,
                n = [];
              return (
                t.pages.forEach((i, r) => {
                  if (!e.showNonPagedPages && t.paged && !i.paged) return;
                  const o = N(r, t);
                  n.push({
                    dimensions: o,
                    pages: [
                      {
                        index: r,
                        groupOffset: { top: 0, left: 0 },
                        dimensions: o,
                      },
                    ],
                  });
                }),
                n
              );
            })(t);
      }
    }
    function q(e, t) {
      const n = {};
      return (
        t.forEach(function (t) {
          n[t] = e[t];
        }),
        n
      );
    }
    function R(e) {
      const t = {};
      return (
        e.forEach((e) => {
          !(function (e, t) {
            Object.keys(t).forEach((n) => {
              Object.defineProperty(e, n, {
                get: () => t[n],
                set: () => {
                  throw new TypeError('Cannot set settings.' + n);
                },
              });
            });
          })(t, e);
        }),
        t
      );
    }
    class V {
      constructor(e) {
        (this.whitelistedKeys = e.whitelistedKeys || []),
          (this.additionalProperties = e.additionalProperties || []),
          (this.validations = e.validations);
      }
      isValid(e, t, n) {
        let i = null;
        if (
          (this.validations.some((t, n) => t.key === e && ((i = n), !0)),
          null === i)
        )
          return !0;
        const r = {};
        r[e] = t;
        const o = z(n, r, this);
        return !this._runValidation(i, t, o);
      }
      validate(e) {
        this._validateOptions({}, e);
      }
      getValidatedOptions(e, t) {
        const n = Object.assign({}, t);
        return this._validateOptions(e, n), n;
      }
      _validateOptions(e, t) {
        const n = z(e, t, this);
        this._applyValidations(t, n);
      }
      _applyValidations(e, t) {
        this.validations.forEach((n, i) => {
          if (!e.hasOwnProperty(n.key)) return;
          const r = e[n.key],
            o = this._runValidation(i, r, t);
          o &&
            (o.warningSuppressed ||
              (function (e, t, n) {
                console.warn(
                  'Invalid value for ' +
                    e +
                    ': ' +
                    t +
                    '. Using ' +
                    n +
                    ' instead.'
                );
              })(n.key, r, o.value),
            (e[n.key] = o.value));
        }, this);
      }
      _runValidation(e, t, n) {
        const i = this.validations[e];
        n.index = e;
        let r = !1;
        const o = {
            suppressWarning: () => {
              r = !0;
            },
          },
          s = i.validate(t, n.proxy, o);
        return void 0 === s || s === t
          ? null
          : { value: s, warningSuppressed: r };
      }
    }
    function z(e, t, n) {
      const i = { proxy: {}, index: null },
        r = F.bind(null, e, t),
        o = {};
      return (
        n.whitelistedKeys.forEach((e) => {
          o[e] = { get: r.bind(null, e) };
        }),
        n.additionalProperties.forEach((e) => {
          o[e.key] = { get: e.get };
        }),
        n.validations.forEach((e, t) => {
          o[e.key] = {
            get: () => {
              if (t < i.index) return r(e.key);
              const o = n.validations[i.index].key;
              throw new TypeError(
                'Cannot access setting ' + e.key + ' while validating ' + o
              );
            },
          };
        }),
        Object.defineProperties(i.proxy, o),
        i
      );
    }
    function F(e, t, n) {
      return n in t ? t[n] : e[n];
    }
    class H {
      constructor(e, t) {
        (t = t || {}),
          (this.intersectionTolerance = t.intersectionTolerance || 0),
          (this.outer = e),
          (this._top =
            this._left =
            this._width =
            this._height =
            this._innerDimensions =
              null),
          this.invalidate();
      }
      intersectsRegion(e) {
        return this.hasHorizontalOverlap(e) && this.hasVerticalOverlap(e);
      }
      hasVerticalOverlap(e) {
        const t = this.top - this.intersectionTolerance,
          n = this.bottom + this.intersectionTolerance;
        return (
          W(e.top, t, n) || W(e.bottom, t, n) || (e.top <= t && e.bottom >= n)
        );
      }
      hasHorizontalOverlap(e) {
        const t = this.left - this.intersectionTolerance,
          n = this.right + this.intersectionTolerance;
        return (
          W(e.left, t, n) || W(e.right, t, n) || (e.left <= t && e.right >= n)
        );
      }
      invalidate() {
        (this._width = this.outer.clientWidth),
          (this._height = this.outer.clientHeight),
          (this._top = this.outer.scrollTop),
          (this._left = this.outer.scrollLeft);
      }
      setInnerDimensions(e) {
        (this._innerDimensions = e),
          e &&
            ((this._top = $(this._top, 0, e.height - this._height)),
            (this._left = $(this._left, 0, e.width - this._width)));
      }
    }
    function U(e, t) {
      const n = '_' + e,
        i = 'scroll' + e.charAt(0).toUpperCase() + e.slice(1);
      return {
        get: function () {
          return this[n];
        },
        set: function (e) {
          let r;
          if (this._innerDimensions) {
            r = $(e, 0, this._innerDimensions[t] - this[t]);
          } else r = Z(e, 0);
          this[n] = this.outer[i] = r;
        },
      };
    }
    function G(e) {
      return {
        get: function () {
          return this['_' + e];
        },
      };
    }
    function W(e, t, n) {
      return e >= t && e <= n;
    }
    function $(e, t, n) {
      return Z(
        (function (e, t) {
          return Math.min(e, t);
        })(e, n),
        t
      );
    }
    function Z(e, t) {
      return Math.max(e, t);
    }
    Object.defineProperties(H.prototype, {
      top: U('top', 'height'),
      left: U('left', 'width'),
      width: G('width'),
      height: G('height'),
      bottom: {
        get: function () {
          return this._top + this._height;
        },
      },
      right: {
        get: function () {
          return this._left + this._width;
        },
      },
    });
    const K = n(50)('diva:ViewerCore');
    function Y() {
      return Y.counter++;
    }
    Y.counter = 1;
    const X = [
      {
        key: 'goDirectlyTo',
        validate: (e, t) => {
          if (e < 0 || e >= t.manifest.pages.length) return 0;
        },
      },
      { key: 'minPagesPerRow', validate: (e) => Math.max(2, e) },
      {
        key: 'maxPagesPerRow',
        validate: (e, t) => Math.max(e, t.minPagesPerRow),
      },
      {
        key: 'pagesPerRow',
        validate: (e, t) => {
          if (e < t.minPagesPerRow || e > t.maxPagesPerRow)
            return t.maxPagesPerRow;
        },
      },
      {
        key: 'maxZoomLevel',
        validate: (e, t, n) => {
          if ((n.suppressWarning(), e < 0 || e > t.manifest.maxZoom))
            return t.manifest.maxZoom;
        },
      },
      {
        key: 'minZoomLevel',
        validate: (e, t, n) =>
          e > t.manifest.maxZoom
            ? (n.suppressWarning(), 0)
            : e < 0 || e > t.maxZoomLevel
            ? 0
            : void 0,
      },
      {
        key: 'zoomLevel',
        validate: (e, t, n) =>
          e > t.manifest.maxZoom
            ? (n.suppressWarning(), 0)
            : e < t.minZoomLevel || e > t.maxZoomLevel
            ? t.minZoomLevel
            : void 0,
      },
    ];
    class J {
      constructor(e, t, n) {
        (this.parentObject = e),
          (this.publicInstance = n),
          (this.viewerState = {
            currentPageIndices: [0],
            activePageIndex: 0,
            horizontalOffset: 0,
            horizontalPadding: 0,
            ID: null,
            initialKeyScroll: !1,
            initialSpaceScroll: !1,
            innerElement: null,
            innerObject: {},
            isActiveDiva: !0,
            isScrollable: !0,
            isZooming: !1,
            loaded: !1,
            manifest: null,
            mobileWebkit: !1,
            numPages: 0,
            oldZoomLevel: -1,
            options: t,
            outerElement: null,
            outerObject: {},
            pageOverlays: new b(),
            pageTools: [],
            parentObject: this.parentObject,
            pendingManifestRequest: null,
            pluginInstances: [],
            renderer: null,
            resizeTimer: -1,
            scrollbarWidth: 0,
            selector: '',
            throbberTimeoutID: -1,
            toolbar: null,
            verticalOffset: 0,
            verticalPadding: 0,
            viewHandler: null,
            viewport: null,
            viewportElement: null,
            viewportObject: null,
            zoomDuration: 400,
          }),
          (this.settings = R([t, this.viewerState]));
        const r = Y();
        (this.viewerState.ID = 'diva-' + r + '-'),
          (this.viewerState.selector = this.settings.ID),
          Object.defineProperties(this.settings, {
            panelHeight: { get: () => this.viewerState.viewport.height },
            panelWidth: { get: () => this.viewerState.viewport.width },
          }),
          (this.optionsValidator = new V({
            additionalProperties: [
              { key: 'manifest', get: () => this.viewerState.manifest },
            ],
            validations: X,
          })),
          (this.viewerState.scrollbarWidth = (function () {
            let e = document.createElement('p');
            (e.style.width = '100%'), (e.style.height = '200px');
            let t = document.createElement('div');
            (t.style.position = 'absolute'),
              (t.style.top = '0px'),
              (t.style.left = '0px'),
              (t.style.visibility = 'hidden'),
              (t.style.width = '200px'),
              (t.style.height = '150px'),
              (t.style.overflow = 'hidden'),
              t.appendChild(e),
              document.body.appendChild(t);
            let n = e.offsetWidth;
            t.style.overflow = 'scroll';
            let i = e.offsetWidth;
            return (
              n === i && (i = t.clientWidth),
              document.body.removeChild(t),
              n - i
            );
          })()),
          (this.viewerState.mobileWebkit = void 0 !== window.orientation),
          null === t.hashParamSuffix &&
            (t.hashParamSuffix = 1 === r ? '' : r + '');
        const o = i('div', this.elemAttrs('inner', { class: 'diva-inner' })),
          s = i('div', this.elemAttrs('viewport'), o),
          a = i(
            'div',
            this.elemAttrs('outer'),
            s,
            i('div', this.elemAttrs('throbber'), [
              i('div', { class: 'cube cube1' }),
              i('div', { class: 'cube cube2' }),
              i('div', { class: 'cube cube3' }),
              i('div', { class: 'cube cube4' }),
              i('div', { class: 'cube cube5' }),
              i('div', { class: 'cube cube6' }),
              i('div', { class: 'cube cube7' }),
              i('div', { class: 'cube cube8' }),
              i('div', { class: 'cube cube9' }),
            ])
          );
        (this.viewerState.innerElement = o),
          (this.viewerState.viewportElement = s),
          (this.viewerState.outerElement = a),
          (this.viewerState.innerObject = o),
          (this.viewerState.viewportObject = s),
          (this.viewerState.outerObject = a),
          this.settings.parentObject.append(a),
          (this.viewerState.viewport = new H(this.viewerState.viewportElement, {
            intersectionTolerance: this.settings.viewportMargin,
          })),
          (this.boundScrollFunction = this.scrollFunction.bind(this)),
          (this.boundEscapeListener = this.escapeListener.bind(this)),
          this.initPlugins(),
          this.handleEvents(),
          this.showThrobber();
      }
      isValidOption(e, t) {
        return this.optionsValidator.isValid(e, t, this.viewerState.options);
      }
      elemAttrs(e, t) {
        const n = { id: this.settings.ID + e, class: 'diva-' + e };
        return t ? Object.assign(n, t) : n;
      }
      getPageData(e, t) {
        return this.settings.manifest.pages[e].d[this.settings.zoomLevel][t];
      }
      clearViewer() {
        (this.viewerState.viewport.top = 0),
          clearTimeout(this.viewerState.resizeTimer);
      }
      hasChangedOption(e, t) {
        return t in e && e[t] !== this.settings[t];
      }
      escapeListener(e) {
        27 === e.keyCode && this.publicInstance.leaveFullscreenMode();
      }
      reloadViewer(e) {
        const t = [];
        if (
          ((e = this.optionsValidator.getValidatedOptions(this.settings, e)),
          this.hasChangedOption(e, 'zoomLevel') &&
            ((this.viewerState.oldZoomLevel = this.settings.zoomLevel),
            (this.viewerState.options.zoomLevel = e.zoomLevel),
            t.push(['ZoomLevelDidChange', e.zoomLevel])),
          this.hasChangedOption(e, 'pagesPerRow') &&
            ((this.viewerState.options.pagesPerRow = e.pagesPerRow),
            t.push(['GridRowNumberDidChange', e.pagesPerRow])),
          this.hasChangedOption(e, 'verticallyOriented') &&
            (this.viewerState.options.verticallyOriented =
              e.verticallyOriented),
          this.hasChangedOption(e, 'showNonPagedPages') &&
            (this.viewerState.options.showNonPagedPages = e.showNonPagedPages),
          'goDirectlyTo' in e
            ? ((this.viewerState.options.goDirectlyTo = e.goDirectlyTo),
              'verticalOffset' in e &&
                (this.viewerState.verticalOffset = e.verticalOffset),
              'horizontalOffset' in e &&
                (this.viewerState.horizontalOffset = e.horizontalOffset))
            : (this.viewerState.options.goDirectlyTo =
                this.settings.activePageIndex),
          (this.hasChangedOption(e, 'inGrid') ||
            this.hasChangedOption(e, 'inBookLayout')) &&
            ('inGrid' in e && (this.viewerState.options.inGrid = e.inGrid),
            'inBookLayout' in e &&
              (this.viewerState.options.inBookLayout = e.inBookLayout),
            t.push(['ViewDidSwitch', this.settings.inGrid])),
          this.hasChangedOption(e, 'inFullscreen') &&
            ((this.viewerState.options.inFullscreen = e.inFullscreen),
            this.prepareModeChange(e),
            t.push(['ModeDidSwitch', this.settings.inFullscreen])),
          this.clearViewer(),
          this.updateViewHandlerAndRendering(),
          this.viewerState.renderer)
        ) {
          const e = {
              pageLayouts: D(this.settings),
              padding: this.getPadding(),
              maxZoomLevel: this.settings.inGrid
                ? null
                : this.viewerState.manifest.maxZoom,
              verticallyOriented:
                this.settings.verticallyOriented || this.settings.inGrid,
            },
            t = {
              zoomLevel: this.settings.inGrid ? null : this.settings.zoomLevel,
              anchorPage: this.settings.goDirectlyTo,
              verticalOffset: this.viewerState.verticalOffset,
              horizontalOffset: this.viewerState.horizontalOffset,
            },
            n = this.getCurrentSourceProvider();
          if (K.enabled) {
            const t = Object.keys(e)
              .filter(function (e) {
                return 'pageLayouts' !== e && 'padding' !== e;
              })
              .map(function (t) {
                const n = e[t];
                return t + ': ' + JSON.stringify(n);
              })
              .join(', ');
            K('reload with %s', t);
          }
          this.viewerState.renderer.load(e, t, n);
        }
        return (
          t.forEach((e) => {
            this.publish.apply(this, e);
          }),
          !0
        );
      }
      prepareModeChange(e) {
        const t = e.inFullscreen ? 'add' : 'remove';
        this.viewerState.outerObject.classList[t]('diva-fullscreen'),
          document.body.classList[t]('diva-hide-scrollbar'),
          this.settings.parentObject.classList[t]('diva-full-width');
        const n = this.settings.panelHeight,
          i = this.settings.panelWidth;
        if (
          (this.viewerState.viewport.invalidate(),
          !this.viewerState.loaded &&
            !this.settings.inGrid &&
            !('verticalOffset' in e))
        ) {
          const e = this.settings.panelHeight,
            t = this.settings.panelWidth;
          (this.viewerState.verticalOffset += (n - e) / 2),
            (this.viewerState.horizontalOffset += (i - t) / 2);
        }
        e.inFullscreen
          ? document.addEventListener('keyup', this.boundEscapeListener)
          : document.removeEventListener('keyup', this.boundEscapeListener);
      }
      updateViewHandlerAndRendering() {
        const e = this.settings.inGrid ? y : m;
        !this.viewerState.viewHandler ||
          this.viewerState.viewHandler instanceof e ||
          (this.viewerState.viewHandler.destroy(),
          (this.viewerState.viewHandler = null)),
          this.viewerState.viewHandler ||
            (this.viewerState.viewHandler = new e(this)),
          this.viewerState.renderer || this.initializeRenderer();
      }
      initializeRenderer() {
        const e = O.getCompatibilityErrors();
        if (e) this.showError(e);
        else {
          const e = {
              viewport: this.viewerState.viewport,
              outerElement: this.viewerState.outerElement,
              innerElement: this.viewerState.innerElement,
              settings: this.settings,
            },
            t = {
              onViewWillLoad: () => {
                this.viewerState.viewHandler.onViewWillLoad();
              },
              onViewDidLoad: () => {
                this.updatePageOverlays(),
                  this.viewerState.viewHandler.onViewDidLoad();
              },
              onViewDidUpdate: (e, t) => {
                this.updatePageOverlays(),
                  this.viewerState.viewHandler.onViewDidUpdate(e, t);
              },
              onViewDidTransition: () => {
                this.updatePageOverlays();
              },
              onPageWillLoad: (e) => {
                this.publish('PageWillLoad', e);
              },
              onZoomLevelWillChange: (e) => {
                this.publish('ZoomLevelWillChange', e);
              },
            };
          this.viewerState.renderer = new O(e, t);
        }
      }
      getCurrentSourceProvider() {
        if (this.settings.inGrid) {
          const e = {
            getAllZoomLevelsForPage: (t) => [e.getBestZoomLevelForPage(t)],
            getBestZoomLevelForPage: (e) => ({
              zoomLevel: 1,
              rows: 1,
              cols: 1,
              tiles: [
                {
                  url: this.settings.manifest.getPageImageURL(e.index, {
                    width: e.dimensions.width,
                  }),
                  zoomLevel: 1,
                  row: 0,
                  col: 0,
                  dimensions: e.dimensions,
                  offset: { top: 0, left: 0 },
                },
              ],
            }),
          };
          return e;
        }
        const e = {
          width: this.settings.tileWidth,
          height: this.settings.tileHeight,
        };
        return {
          getBestZoomLevelForPage: (t) =>
            this.settings.manifest.getPageImageTiles(
              t.index,
              Math.ceil(this.settings.zoomLevel),
              e
            ),
          getAllZoomLevelsForPage: (t) => {
            const n = [],
              i = this.viewerState.manifest.maxZoom;
            for (let r = 0; r <= i; r++)
              n.push(this.settings.manifest.getPageImageTiles(t.index, r, e));
            return n.reverse(), n;
          },
        };
      }
      getPadding() {
        let e, t, n, i;
        return (
          this.settings.inGrid
            ? ((n = this.settings.fixedPadding), (e = t = i = 0))
            : ((e = this.settings.verticallyOriented
                ? this.viewerState.verticalPadding
                : 0),
              (t = this.settings.verticallyOriented
                ? 0
                : this.viewerState.horizontalPadding),
              (n = this.settings.verticallyOriented
                ? 0
                : this.viewerState.verticalPadding),
              (i = this.settings.verticallyOriented
                ? this.viewerState.horizontalPadding
                : 0)),
          {
            document: { top: n, bottom: n, left: i, right: i },
            page: { top: e, bottom: 0, left: t, right: 0 },
          }
        );
      }
      updatePageOverlays() {
        this.viewerState.pageOverlays.updateOverlays(
          this.viewerState.renderer.getRenderedPages()
        );
      }
      handleZoom(e, t) {
        if (!this.isValidOption('zoomLevel', e)) return !1;
        if (
          (this.viewerState.viewportObject.removeEventListener(
            'scroll',
            this.boundScrollFunction
          ),
          !t)
        ) {
          const e = this.viewerState.viewport,
            n = this.viewerState.renderer.layout.getPageRegion(
              this.settings.activePageIndex
            );
          t = {
            anchorPage: this.settings.activePageIndex,
            offset: {
              left: e.width / 2 - (n.left - e.left),
              top: e.height / 2 - (n.top - e.top),
            },
          };
        }
        const n = this.viewerState.renderer.layout.getPageRegion(t.anchorPage),
          i =
            n.left +
            t.offset.left -
            (this.settings.viewport.left + this.settings.viewport.width / 2),
          r =
            n.top +
            t.offset.top -
            (this.settings.viewport.top + this.settings.viewport.height / 2),
          o = (e, n) => {
            const o = Math.pow(2, e - n),
              s = t.offset.left * o - i,
              a = t.offset.top * o - r;
            return {
              zoomLevel: e,
              anchorPage: t.anchorPage,
              verticalOffset: a,
              horizontalOffset: s,
            };
          };
        this.viewerState.options.zoomLevel = e;
        let s = this.viewerState.oldZoomLevel;
        this.viewerState.oldZoomLevel = this.settings.zoomLevel;
        const a = o(e, s);
        (this.viewerState.options.goDirectlyTo = a.anchorPage),
          (this.viewerState.verticalOffset = a.verticalOffset),
          (this.viewerState.horizontalOffset = a.horizontalOffset),
          this.viewerState.renderer.transitionViewportPosition({
            duration: this.settings.zoomDuration,
            parameters: { zoomLevel: { from: s, to: e } },
            getPosition: (e) => o(e.zoomLevel, s),
            onEnd: (t) => {
              this.viewerState.viewportObject.addEventListener(
                'scroll',
                this.boundScrollFunction
              ),
                t.interrupted && (this.viewerState.oldZoomLevel = e);
            },
          });
        let c = document.getElementById(
            this.settings.selector + 'zoom-in-button'
          ),
          l = document.getElementById(
            this.settings.selector + 'zoom-out-button'
          );
        return (
          (c.disabled = !0),
          (l.disabled = !0),
          setTimeout(() => {
            (c.disabled = !1), (l.disabled = !1);
          }, this.settings.zoomDuration),
          this.publish('ZoomLevelDidChange', e),
          !0
        );
      }
      getYOffset(e, t) {
        let n = void 0 === e ? this.settings.activePageIndex : e;
        return 'center' === t || 'centre' === t
          ? parseInt(this.getPageData(n, 'h') / 2, 10)
          : 'bottom' === t
          ? parseInt(
              this.getPageData(n, 'h') - this.settings.panelHeight / 2,
              10
            )
          : parseInt(this.settings.panelHeight / 2, 10);
      }
      getXOffset(e, t) {
        let n = void 0 === e ? this.settings.activePageIndex : e;
        return 'left' === t
          ? parseInt(this.settings.panelWidth / 2, 10)
          : 'right' === t
          ? parseInt(
              this.getPageData(n, 'w') - this.settings.panelWidth / 2,
              10
            )
          : parseInt(this.getPageData(n, 'w') / 2, 10);
      }
      updatePanelSize() {
        return (
          this.viewerState.viewport.invalidate(),
          this.viewerState.renderer &&
            (this.updateOffsets(),
            this.viewerState.renderer.goto(
              this.settings.activePageIndex,
              this.viewerState.verticalOffset,
              this.viewerState.horizontalOffset
            )),
          !0
        );
      }
      updateOffsets() {
        const e =
          this.viewerState.renderer.layout.getPageToViewportCenterOffset(
            this.settings.activePageIndex,
            this.viewerState.viewport
          );
        e &&
          ((this.viewerState.horizontalOffset = e.x),
          (this.viewerState.verticalOffset = e.y));
      }
      bindMouseEvents() {
        this.viewerState.viewportObject.classList.add('dragscroll'),
          d.onDoubleClick(this.viewerState.viewportObject, (e, t) => {
            K('Double click at %s, %s', t.left, t.top),
              this.viewerState.viewHandler.onDoubleClick(e, t);
          });
      }
      onResize() {
        this.updatePanelSize(),
          clearTimeout(this.viewerState.resizeTimer),
          (this.viewerState.resizeTimer = setTimeout(() => {
            const e =
              this.viewerState.renderer.layout.getPageToViewportCenterOffset(
                this.settings.activePageIndex,
                this.viewerState.viewport
              );
            e
              ? this.reloadViewer({
                  goDirectlyTo: this.settings.activePageIndex,
                  verticalOffset: e.y,
                  horizontalOffset: e.x,
                })
              : this.reloadViewer({
                  goDirectlyTo: this.settings.activePageIndex,
                });
          }, 200));
      }
      bindTouchEvents() {
        this.settings.blockMobileMove &&
          document.body.addEventListener(
            'touchmove',
            (e) => (e.originalEvent.preventDefault(), !1)
          ),
          d.onPinch(this.viewerState.viewportObject, function (e, t, n, i) {
            K('Pinch %s at %s, %s', i - n, t.left, t.top),
              this.viewerState.viewHandler.onPinch(e, t, n, i);
          }),
          d.onDoubleTap(this.viewerState.viewportObject, function (e, t) {
            K('Double tap at %s, %s', t.left, t.top),
              this.viewerState.viewHandler.onDoubleClick(e, t);
          });
      }
      scrollFunction() {
        const e = this.viewerState.viewport.top,
          t = this.viewerState.viewport.left;
        let n;
        this.viewerState.viewport.invalidate();
        const i = this.viewerState.viewport.top,
          r = this.viewerState.viewport.left;
        (n =
          this.settings.verticallyOriented || this.settings.inGrid
            ? i - e
            : r - t),
          this.viewerState.renderer.adjust();
        const o =
          this.settings.verticallyOriented || this.settings.inGrid ? i : r;
        this.publish('ViewerDidScroll', o),
          n > 0
            ? this.publish('ViewerDidScrollDown', o)
            : n < 0 && this.publish('ViewerDidScrollUp', o),
          this.updateOffsets();
      }
      handleEvents() {
        this.viewerState.innerObject.addEventListener('mousedown', () => {
          this.viewerState.innerObject.classList.add('diva-grabbing');
        }),
          this.viewerState.innerObject.addEventListener('mouseup', () => {
            this.viewerState.innerObject.classList.remove('diva-grabbing');
          }),
          this.bindMouseEvents(),
          this.viewerState.viewportObject.addEventListener(
            'scroll',
            this.boundScrollFunction
          );
        document.addEventListener('keydown.diva', (e) => {
          if (!this.viewerState.isActiveDiva) return !0;
          if (
            (this.settings.enableSpaceScroll &&
              !e.shiftKey &&
              32 === e.keyCode) ||
            (this.settings.enableKeyScroll && 34 === e.keyCode)
          )
            return (
              (this.viewerState.viewport.top += this.settings.panelHeight), !1
            );
          if (
            (this.settings.enableSpaceScroll ||
              32 !== e.keyCode ||
              e.preventDefault(),
            this.settings.enableKeyScroll)
          ) {
            if (e.shiftKey || e.ctrlKey || e.metaKey) return !0;
            switch (e.keyCode) {
              case 33:
                return (
                  (this.viewerState.viewport.top -= this.settings.panelHeight),
                  !1
                );
              case 38:
                return (
                  (this.viewerState.viewport.top -=
                    this.settings.arrowScrollAmount),
                  !1
                );
              case 40:
                return (
                  (this.viewerState.viewport.top +=
                    this.settings.arrowScrollAmount),
                  !1
                );
              case 37:
                return (
                  (this.viewerState.viewport.left -=
                    this.settings.arrowScrollAmount),
                  !1
                );
              case 39:
                return (
                  (this.viewerState.viewport.left +=
                    this.settings.arrowScrollAmount),
                  !1
                );
              case 36:
                return (this.viewerState.viewport.top = 0), !1;
              case 35:
                return (
                  this.settings.verticallyOriented
                    ? (this.viewerState.viewport.top = 1 / 0)
                    : (this.viewerState.viewport.left = 1 / 0),
                  !1
                );
              default:
                return !0;
            }
          }
          return !0;
        }),
          u.Events.subscribe(
            'ViewerDidTerminate',
            function () {
              document.removeEventListener('keydown.diva');
            },
            this.settings.ID
          ),
          window.addEventListener('resize', this.onResize.bind(this), !1),
          u.Events.subscribe(
            'ViewerDidTerminate',
            function () {
              window.removeEventListener('resize', this.onResize, !1);
            },
            this.settings.ID
          ),
          'onorientationchange' in window &&
            (window.addEventListener('orientationchange', this.onResize, !1),
            u.Events.subscribe(
              'ViewerDidTerminate',
              function () {
                window.removeEventListener(
                  'orientationchange',
                  this.onResize,
                  !1
                );
              },
              this.settings.ID
            )),
          u.Events.subscribe(
            'PanelSizeDidChange',
            this.updatePanelSize,
            this.settings.ID
          ),
          u.Events.subscribe(
            'ViewerDidTerminate',
            () => {
              this.viewerState.renderer && this.viewerState.renderer.destroy(),
                clearTimeout(this.viewerState.resizeTimer);
            },
            this.settings.ID
          );
      }
      initPlugins() {
        if (!this.settings.hasOwnProperty('plugins')) return null;
        this.viewerState.pluginInstances = this.settings.plugins.map((e) => {
          const t = new e(this);
          return t.isPageTool && this.viewerState.pageTools.push(t), t;
        });
      }
      showThrobber() {
        this.hideThrobber(),
          (this.viewerState.throbberTimeoutID = setTimeout(() => {
            let e = document.getElementById(
              this.settings.selector + 'throbber'
            );
            e && (e.style.display = 'block');
          }, this.settings.throbberTimeout));
      }
      hideThrobber() {
        clearTimeout(this.viewerState.throbberTimeoutID);
        let e = document.getElementById(this.settings.selector + 'throbber');
        e && (e.style.display = 'none');
      }
      showError(e) {
        const t = i('div', this.elemAttrs('error'), [
          i(
            'button',
            this.elemAttrs('error-close', { 'aria-label': 'Close dialog' })
          ),
          i('p', i('strong', 'Error')),
          i('div', e),
        ]);
        this.viewerState.outerObject.appendChild(t),
          document
            .getElementById(this.settings.selector + 'error-close')
            .addEventListener('click', () => {
              t.parentNode.removeChild(t);
            });
      }
      setManifest(e, t) {
        if (
          ((this.viewerState.manifest = e),
          this.hideThrobber(),
          (this.viewerState.numPages = this.settings.manifest.pages.length),
          this.optionsValidator.validate(this.viewerState.options),
          this.publish('NumberOfPagesDidChange', this.settings.numPages),
          this.settings.adaptivePadding > 0)
        ) {
          const e = Math.floor(
            (this.settings.minZoomLevel + this.settings.maxZoomLevel) / 2
          );
          (this.viewerState.horizontalPadding = parseInt(
            this.settings.manifest.getAverageWidth(e) *
              this.settings.adaptivePadding,
            10
          )),
            (this.viewerState.verticalPadding = parseInt(
              this.settings.manifest.getAverageHeight(e) *
                this.settings.adaptivePadding,
              10
            ));
        } else
          (this.viewerState.horizontalPadding = this.settings.fixedPadding),
            (this.viewerState.verticalPadding = this.settings.fixedPadding);
        let n, r;
        this.viewerState.pageTools.length &&
          (this.viewerState.verticalPadding = Math.max(
            40,
            this.viewerState.verticalPadding
          )),
          this.settings.manifest.paged &&
            (this.viewerState.options.inBookLayout = !0),
          this.publish('ObjectDidLoad', this.settings),
          this.updatePanelSize();
        let o = !1,
          s = !1;
        if (
          (null == t.goDirectlyTo
            ? ((t.goDirectlyTo = this.settings.goDirectlyTo), (n = r = !0))
            : ((n = null == t.horizontalOffset || isNaN(t.horizontalOffset)),
              (r = null == t.verticalOffset || isNaN(t.verticalOffset))),
          n &&
            (0 === t.goDirectlyTo &&
            this.settings.inBookLayout &&
            this.settings.verticallyOriented
              ? (t.horizontalOffset = this.viewerState.horizontalPadding)
              : ((s = !0),
                (t.horizontalOffset = this.getXOffset(
                  t.goDirectlyTo,
                  'center'
                )))),
          r &&
            ((o = !0),
            (t.verticalOffset = this.getYOffset(t.goDirectlyTo, 'top'))),
          this.reloadViewer(t),
          this.updatePanelSize(),
          this.settings.enableAutoTitle)
        ) {
          let e = document.getElementById(this.settings.selector + 'title');
          e
            ? (e.innerHTML = this.settings.manifest.itemTitle)
            : this.settings.parentObject.insertBefore(
                i('div', this.elemAttrs('title'), [
                  this.settings.manifest.itemTitle,
                ]),
                this.settings.parentObject.firstChild
              );
        }
        this.settings.verticallyOriented
          ? (this.viewerState.innerElement.style.minWidth =
              this.settings.panelWidth + 'px')
          : (this.viewerState.innerElement.style.minHeight =
              this.settings.panelHeight + 'px'),
          (o || s) &&
            (o &&
              (this.viewerState.verticalOffset = this.getYOffset(
                this.settings.activePageIndex,
                'top'
              )),
            s &&
              (this.viewerState.horizontalOffset = this.getXOffset(
                this.settings.activePageIndex,
                'center'
              )),
            this.viewerState.renderer.goto(
              this.settings.activePageIndex,
              this.viewerState.verticalOffset,
              this.viewerState.horizontalOffset
            )),
          (this.viewerState.loaded = !0),
          this.publish('ViewerDidLoad', this.settings);
      }
      publish(e) {
        const t = Array.prototype.slice.call(arguments, 1);
        u.Events.publish(e, t, this.publicInstance);
      }
      getSettings() {
        return this.settings;
      }
      getInternalState() {
        return this.viewerState;
      }
      getPublicInstance() {
        return this.publicInstance;
      }
      getPageTools() {
        return this.viewerState.pageTools;
      }
      getCurrentLayout() {
        return this.viewerState.renderer
          ? this.viewerState.renderer.layout
          : null;
      }
      getViewport() {
        const e = this.viewerState.viewport;
        return {
          top: e.top,
          left: e.left,
          bottom: e.bottom,
          right: e.right,
          width: e.width,
          height: e.height,
        };
      }
      addPageOverlay(e) {
        this.viewerState.pageOverlays.addOverlay(e);
      }
      removePageOverlay(e) {
        this.viewerState.pageOverlays.removeOverlay(e);
      }
      getPageRegion(e, t) {
        const n = this.viewerState.renderer.layout,
          i = n.getPageRegion(e, t);
        if (t && t.incorporateViewport) {
          const e = this.settings.verticallyOriented ? 'width' : 'height';
          if (this.viewerState.viewport[e] > n.dimensions[e]) {
            const t = (this.viewerState.viewport[e] - n.dimensions[e]) / 2;
            return this.settings.verticallyOriented
              ? {
                  top: i.top,
                  bottom: i.bottom,
                  left: i.left + t,
                  right: i.right + t,
                }
              : {
                  top: i.top + t,
                  bottom: i.bottom + t,
                  left: i.left,
                  right: i.right,
                };
          }
        }
        return i;
      }
      getPagePositionAtViewportOffset(e) {
        const t = e.left + this.viewerState.viewport.left,
          n = e.top + this.viewerState.viewport.top,
          i = this.viewerState.renderer.getRenderedPages(),
          r = i.length;
        for (let e = 0; e < r; e++) {
          const r = i[e],
            o = this.viewerState.renderer.layout.getPageRegion(r);
          if (o.left <= t && o.right >= t && o.top <= n && o.bottom >= n)
            return {
              anchorPage: r,
              offset: { left: t - o.left, top: n - o.top },
            };
        }
        const o = this.viewerState.renderer.layout.getPageRegion(
          this.settings.activePageIndex
        );
        return {
          anchorPage: this.settings.activePageIndex,
          offset: { left: t - o.left, top: n - o.top },
        };
      }
      setCurrentPages(e, t) {
        !(function (e, t) {
          if (e.length !== t.length) return !1;
          for (let n = 0, i = e.length; n < i; n++)
            if (e[n] !== t[n]) return !1;
          return !0;
        })(this.viewerState.currentPageIndices, t)
          ? ((this.viewerState.currentPageIndices = t),
            this.viewerState.activePageIndex !== e &&
              ((this.viewerState.activePageIndex = e),
              this.publish('ActivePageDidChange', e)),
            this.publish('VisiblePageDidChange', t),
            this.viewerState.manifest.pages[e].otherImages.length > 0 &&
              this.publish('VisiblePageHasAlternateViews', e))
          : this.viewerState.activePageIndex !== e &&
            ((this.viewerState.activePageIndex = e),
            this.publish('ActivePageDidChange', e));
      }
      getPageName(e) {
        return this.viewerState.manifest.pages[e].f;
      }
      reload(e) {
        this.reloadViewer(e);
      }
      zoom(e, t) {
        return this.handleZoom(e, t);
      }
      enableScrollable() {
        this.viewerState.isScrollable ||
          (this.bindMouseEvents(),
          this.enableDragScrollable(),
          (this.viewerState.options.enableKeyScroll =
            this.viewerState.initialKeyScroll),
          (this.viewerState.options.enableSpaceScroll =
            this.viewerState.initialSpaceScroll),
          (this.viewerState.viewportElement.style.overflow = 'auto'),
          (this.viewerState.isScrollable = !0));
      }
      enableDragScrollable() {
        this.viewerState.viewportObject.hasAttribute('nochilddrag') &&
          this.viewerState.viewportObject.removeAttribute('nochilddrag');
      }
      disableScrollable() {
        this.viewerState.isScrollable &&
          (this.disableDragScrollable(),
          (this.viewerState.outerObject.dblclick = null),
          (this.viewerState.outerObject.contextmenu = null),
          (this.viewerState.viewportElement.style.overflow = 'hidden'),
          (this.viewerState.initialKeyScroll = this.settings.enableKeyScroll),
          (this.viewerState.initialSpaceScroll =
            this.settings.enableSpaceScroll),
          (this.viewerState.options.enableKeyScroll = !1),
          (this.viewerState.options.enableSpaceScroll = !1),
          (this.viewerState.isScrollable = !1));
      }
      disableDragScrollable() {
        this.viewerState.viewportObject.hasAttribute('nochilddrag') ||
          this.viewerState.viewportObject.setAttribute('nochilddrag', '');
      }
      clear() {
        this.clearViewer();
      }
      setPendingManifestRequest(e) {
        this.viewerState.pendingManifestRequest = e;
      }
      destroy() {
        this.publish('ViewerWillTerminate', this.settings),
          this.settings.pendingManifestRequest &&
            this.settings.pendingManifestRequest.abort(),
          document.body.removeClass('diva-hide-scrollbar'),
          this.settings.parentObject.parent().empty().removeData('diva'),
          this.settings.parentObject
            .parent()
            .removeAttr('style')
            .removeAttr('class'),
          this.publish('ViewerDidTerminate', this.settings),
          u.Events.unsubscribeAll(this.settings.ID);
      }
    }
    function Q(e) {
      let t,
        n = e.label,
        i = 'object' == typeof n ? n[Object.keys(n)[0]][0] : n,
        r = e.value;
      return (
        (t = Array.isArray(r)
          ? r.map((e) => e[Object.keys(e)[0]])
          : 'object' == typeof r
          ? r[Object.keys(r)[0]]
          : r),
        Array.isArray(t) && (t = t.join(', ')),
        { label: i, value: t }
      );
    }
    const ee = (e, t) => {
        const n = Math.max(e, t);
        return n < 128 ? 0 : Math.ceil(Math.log((n + 1) / 257) / Math.log(2));
      },
      te = (e, t) => e / Math.pow(2, t),
      ne = (e, t) =>
        e.map((e) => {
          const n = e.width,
            i = e.height,
            r = re(e),
            o = '/' !== r.url.slice(-1) ? r.url + '/' : r.url,
            s = new Array(t + 1);
          for (let e = 0; e < t + 1; e++)
            s[e] = { h: Math.floor(te(i, t - e)), w: Math.floor(te(n, t - e)) };
          return { f: r.url, url: o, il: e.label || '', d: s };
        });
    function ie(e) {
      let t = e['@context'];
      if (!t)
        return console.error('Invalid IIIF Manifest; No @context found.'), null;
      const n = ((e) =>
          'http://iiif.io/api/presentation/2/context.json' === e ||
          (Array.isArray(e) &&
            e.includes('http://iiif.io/api/presentation/2/context.json'))
            ? 2
            : Array.isArray(e) &&
              e.includes('http://iiif.io/api/presentation/3/context.json')
            ? 3
            : 2)(t),
        i = e.sequences ? e.sequences[0] : null,
        r = i ? i.canvases : e.items,
        o = r.length,
        s = new Array(r.length);
      let a,
        c,
        l,
        u,
        d,
        h,
        f,
        p,
        g,
        v,
        m,
        y,
        b,
        w,
        _,
        E,
        S,
        x = [],
        L = 100,
        k = 0,
        C = 100;
      for (let e = 0; e < o; e++) {
        const t = r[e],
          n = t.width,
          i = t.height,
          o = ee(n, i),
          s = i / n;
        (k = Math.max(s, k)), (C = Math.min(s, C)), (L = Math.min(L, o));
      }
      const I = new Array(L + 1).fill(0),
        A = new Array(L + 1).fill(0),
        P = new Array(L + 1).fill(0),
        O = new Array(L + 1).fill(0);
      for (let e = 0; e < o; e++) {
        if (
          ((a = r[e]),
          (y = a['@id'] || a.id),
          (b = a.label),
          (c = a.images ? a.images[0].resource : a.items[0].items[0].body),
          (x = []),
          'oa:Choice' === c['@type'] || 'Choice' === c.type
            ? ((l = c.default || c.items[0]),
              (u = c.item || c.items.slice(1)),
              (x = ne(u, L)))
            : (l = c),
          (g = a.width || l.width),
          (v = a.height || l.height),
          g <= 0 || v <= 0)
        ) {
          console.warn(
            'Invalid width or height for canvas ' + b + '. Skipping'
          );
          continue;
        }
        (m = ee(g, v)),
          (w = l.label || null),
          (f = re(l)),
          (h = '/' !== f.url.slice(-1) ? f.url + '/' : f.url),
          (d = l.service['@context'] || l.service.type),
          (p =
            'http://iiif.io/api/image/2/context.json' === d ||
            'ImageService2' === d
              ? 2
              : 'http://library.stanford.edu/iiif/image-api/1.1/context.json' ===
                d
              ? 1.1
              : 1),
          (_ = new Array(L + 1));
        for (let e = 0; e < L + 1; e++)
          (E = Math.floor(te(g, L - e))),
            (S = Math.floor(te(v, L - e))),
            (_[e] = { h: S, w: E }),
            (I[e] += E),
            (A[e] += S),
            (P[e] = Math.max(E, P[e])),
            (O[e] = Math.max(S, O[e]));
        let t =
            'non-paged' !== a.viewingHint ||
            (!!a.behavior && 'non-paged' !== a.behavior[0]),
          n =
            'facing-pages' === a.viewingHint ||
            (!!a.behavior && 'facing-pages' === a.behavior[0]);
        s[e] = {
          d: _,
          m: m,
          l: b,
          il: w,
          f: f.url,
          url: h,
          api: p,
          paged: t,
          facingPages: n,
          canvas: y,
          otherImages: x,
          xoffset: f.x || null,
          yoffset: f.y || null,
        };
      }
      const B = new Array(L + 1),
        T = new Array(L + 1);
      for (let e = 0; e < L + 1; e++) (B[e] = I[e] / o), (T[e] = A[e] / o);
      const N = {
        a_wid: B,
        a_hei: T,
        max_w: P,
        max_h: O,
        max_ratio: k,
        min_ratio: C,
        t_hei: A,
        t_wid: I,
      };
      return {
        version: n,
        item_title: Q(e).label,
        metadata: e.metadata || null,
        dims: N,
        max_zoom: L,
        pgs: s,
        paged:
          'paged' === e.viewingHint ||
          (!!e.behaviour && 'paged' === e.behaviour[0]) ||
          (!!i && 'paged' === i.viewingHint),
      };
    }
    function re(e) {
      let t = e['@id'] || e.id;
      const n = /#xywh=([0-9]+,[0-9]+,[0-9]+,[0-9]+)/;
      let i = '',
        r = !0;
      if (/\/([0-9]+,[0-9]+,[0-9]+,[0-9]+)\//.test(t)) {
        const e = t.split('/');
        i = e[e.length - 4];
      } else if (n.test(t)) {
        i = n.exec(t)[1];
      } else
        e.service &&
          (e.service['@id'] || e.service.id) &&
          ((t = e.service['@id'] || e.service.id), (r = !1));
      r && (t = t.split('/').slice(0, -4).join('/'));
      const o = { url: t };
      if (i.length) {
        const e = i.split(',');
        (o.x = parseInt(e[0], 10)),
          (o.y = parseInt(e[1], 10)),
          (o.w = parseInt(e[2], 10)),
          (o.h = parseInt(e[3], 10));
      }
      return o;
    }
    class oe {
      getPageImageURL(e, t, n) {
        let i;
        i =
          !n || (null == n.width && null == n.height)
            ? 'full'
            : (null == n.width ? '' : n.width) +
              ',' +
              (null == n.height ? '' : n.height);
        const r = e.pages[t],
          o = r.api > 1.1 ? 'default' : 'native';
        return encodeURI(r.url + 'full/' + i + '/0/' + o + '.jpg');
      }
      getTileImageURL(e, t, n) {
        const i = e.pages[t];
        let r, o;
        (r =
          n.row === n.rowCount - 1
            ? i.d[n.zoomLevel].h - (n.rowCount - 1) * n.tileDimensions.height
            : n.tileDimensions.height),
          (o =
            n.col === n.colCount - 1
              ? i.d[n.zoomLevel].w - (n.colCount - 1) * n.tileDimensions.width
              : n.tileDimensions.width);
        const s = Math.pow(2, e.maxZoom - n.zoomLevel);
        let a = n.col * n.tileDimensions.width * s,
          c = n.row * n.tileDimensions.height * s;
        i.hasOwnProperty('xoffset') && ((a += i.xoffset), (c += i.yoffset));
        const l = [a, c, o * s, r * s].join(','),
          u = i.api > 1.1 ? 'default' : 'native';
        return encodeURI(i.url + l + '/' + o + ',' + r + '/0/' + u + '.jpg');
      }
    }
    class se {
      constructor(e, t) {
        (this.pages = e.pgs),
          (this.maxZoom = e.max_zoom),
          (this.maxRatio = e.dims.max_ratio),
          (this.minRatio = e.dims.min_ratio),
          (this.itemTitle = e.item_title),
          (this.metadata = e.metadata),
          (this.paged = !!e.paged),
          (this._maxWidths = e.dims.max_w),
          (this._maxHeights = e.dims.max_h),
          (this._averageWidths = e.dims.a_wid),
          (this._averageHeights = e.dims.a_hei),
          (this._totalHeights = e.dims.t_hei),
          (this._totalWidths = e.dims.t_wid),
          (this._urlAdapter = t);
      }
      static fromIIIF(e) {
        const t = ie(e);
        return new se(t, new oe());
      }
      isPageValid(e, t) {
        return (
          !(!t && this.paged && !this.pages[e].paged) &&
          e >= 0 &&
          e < this.pages.length
        );
      }
      getMaxPageDimensions(e) {
        const t = this.pages[e].d[this.maxZoom];
        return { height: t.h, width: t.w };
      }
      getPageDimensionsAtZoomLevel(e, t) {
        const n = this.pages[e].d[this.maxZoom],
          i = ((r = this.maxZoom), (o = t), 1 / Math.pow(2, r - o));
        var r, o;
        return { height: n.h * i, width: n.w * i };
      }
      getPageImageURL(e, t) {
        return this._urlAdapter.getPageImageURL(this, e, t);
      }
      getPageImageTiles(e, t, n) {
        const i = this.pages[e];
        if (!isFinite(t) || t % 1 != 0)
          throw new TypeError('Zoom level must be an integer: ' + t);
        const r = Math.ceil(i.d[t].h / n.height),
          o = Math.ceil(i.d[t].w / n.width),
          s = [];
        let a, c, l;
        for (a = 0; a < r; a++)
          for (c = 0; c < o; c++)
            (l = this._urlAdapter.getTileImageURL(this, e, {
              row: a,
              col: c,
              rowCount: r,
              colCount: o,
              zoomLevel: t,
              tileDimensions: n,
            })),
              s.push({
                row: a,
                col: c,
                zoomLevel: t,
                dimensions: { height: n.height, width: n.width },
                offset: { top: a * n.height, left: c * n.width },
                url: l,
              });
        return { zoomLevel: t, rows: r, cols: o, tiles: s };
      }
    }
    function ae(e) {
      return function (t) {
        return this[e][t];
      };
    }
    (se.prototype.getMaxWidth = ae('_maxWidths')),
      (se.prototype.getMaxHeight = ae('_maxHeights')),
      (se.prototype.getAverageWidth = ae('_averageWidths')),
      (se.prototype.getAverageHeight = ae('_averageHeights')),
      (se.prototype.getTotalWidth = ae('_totalWidths')),
      (se.prototype.getTotalHeight = ae('_totalHeights'));
    class ce {
      constructor(e) {
        (this.viewer = e), (this.settings = e.settings);
      }
      _elemAttrs(e, t) {
        const n = { id: this.settings.ID + e, class: 'diva-' + e };
        return t ? Object.assign(n, t) : n;
      }
      _subscribe(e, t) {
        u.Events.subscribe(e, t, this.settings.ID);
      }
      createButton(e, t, n, r) {
        const o = i('button', {
          type: 'button',
          id: this.settings.ID + e,
          class: 'diva-' + e + ' diva-button',
          title: t,
          'aria-label': t,
        });
        return r && o.appendChild(r), n && o.addEventListener('click', n), o;
      }
      createLabel(e, t, n, r, o) {
        return i(
          'div',
          { id: this.settings.ID + t, class: e + ' diva-label' },
          [n, i('span', { id: this.settings.ID + r }, o)]
        );
      }
      createZoomButtons() {
        let e = this._createZoomOutIcon(),
          t = this._createZoomInIcon(),
          n = [
            this.createButton(
              'zoom-out-button',
              'Zoom Out',
              () => {
                this.viewer.setZoomLevel(this.settings.zoomLevel - 1);
              },
              e
            ),
            this.createButton(
              'zoom-in-button',
              'Zoom In',
              () => {
                this.viewer.setZoomLevel(this.settings.zoomLevel + 1);
              },
              t
            ),
            this.createLabel(
              'diva-zoom-label',
              'zoom-label',
              'Zoom level: ',
              'zoom-level',
              this.settings.zoomLevel + 1
            ),
          ],
          r = function () {
            document.getElementById(
              this.settings.ID + 'zoom-level'
            ).textContent = this.settings.zoomLevel + 1;
          };
        return (
          this._subscribe('ZoomLevelDidChange', r),
          this._subscribe('ViewerDidLoad', r),
          i(
            'div',
            { id: this.settings.ID + 'zoom-controls', style: 'display: none' },
            n
          )
        );
      }
      createGridControls() {
        let e = this._createGridMoreIcon(),
          t = this._createGridFewerIcon(),
          n = [
            this.createButton(
              'grid-out-button',
              'Fewer',
              () => {
                this.viewer.setGridPagesPerRow(this.settings.pagesPerRow - 1);
              },
              t
            ),
            this.createButton(
              'grid-in-button',
              'More',
              () => {
                this.viewer.setGridPagesPerRow(this.settings.pagesPerRow + 1);
              },
              e
            ),
            this.createLabel(
              'diva-grid-label',
              'grid-label',
              'Pages per row: ',
              'pages-per-row',
              this.settings.pagesPerRow
            ),
          ];
        return (
          this._subscribe('GridRowNumberDidChange', function () {
            document.getElementById(
              this.settings.ID + 'pages-per-row'
            ).textContent = this.settings.pagesPerRow;
          }),
          i(
            'div',
            { id: this.settings.ID + 'grid-controls', style: 'display:none' },
            n
          )
        );
      }
      createPageLabel() {
        const e = i('span', { id: this.settings.ID + 'current-page' }),
          t = () => {
            let t = this.viewer.getCurrentPageIndices(),
              n = t[0],
              i = t[t.length - 1],
              r = this.settings.manifest.pages[n].l,
              o = this.settings.manifest.pages[i].l;
            n !== i
              ? this.settings.enableIndexAsLabel
                ? (e.textContent = n + ' - ' + i)
                : (e.textContent = r + ' - ' + o)
              : this.settings.enableIndexAsLabel
              ? (e.textContent = n)
              : (e.textContent = r);
          };
        return (
          this._subscribe('VisiblePageDidChange', t),
          this._subscribe('ViewerDidLoad', t),
          this._subscribe('ViewDidSwitch', t),
          i('span', { class: 'diva-page-label diva-label' }, e)
        );
      }
      createGotoPageForm() {
        const e = i('input', {
            id: this.settings.ID + 'goto-page-input',
            class: 'diva-input diva-goto-page-input',
            autocomplete: 'off',
            type: 'text',
            'aria-label': 'Page Input',
          }),
          t = i('input', {
            id: this.settings.ID + 'goto-page-submit',
            class: 'diva-button diva-button-text',
            type: 'submit',
            value: 'Go',
          }),
          n = i('div', {
            id: this.settings.ID + 'input-suggestions',
            class: 'diva-input-suggestions',
          }),
          r = i(
            'form',
            { id: this.settings.ID + 'goto-page', class: 'diva-goto-form' },
            e,
            t,
            n
          );
        var o, s, a;
        return (
          r.addEventListener('submit', (t) => {
            t.preventDefault();
            const i = e.value;
            if (
              this.settings.onGotoSubmit &&
              'function' == typeof this.settings.onGotoSubmit
            ) {
              const e = this.settings.onGotoSubmit(i);
              this.viewer.gotoPageByIndex(e) ||
                window.alert(
                  'No page could be found with that label or page number'
                );
            } else
              this.viewer.gotoPageByLabel(i) ||
                window.alert(
                  'No page could be found with that label or page number'
                );
            return (n.style.display = 'none'), !1;
          }),
          ['input', 'focus'].forEach((t) => {
            e.addEventListener(t, () => {
              n.innerHTML = '';
              const t = e.value;
              let r = 0;
              if (this.settings.enableGotoSuggestions && t) {
                const e = this.settings.manifest.pages;
                for (let o = 0, s = e.length; o < s && r < 10; o++)
                  if (e[o].l.toLowerCase().indexOf(t.toLowerCase()) > -1) {
                    const t = i(
                      'div',
                      { class: 'diva-input-suggestion' },
                      e[o].l
                    );
                    n.appendChild(t), r++;
                  }
                r > 0 && (n.style.display = 'block');
              } else n.style.display = 'none';
            });
          }),
          e.addEventListener('keydown', (t) => {
            let n;
            if (13 === t.keyCode) {
              const t = document.getElementsByClassName('active')[0];
              void 0 !== t && (e.value = t.innerText);
            }
            if (38 === t.keyCode) {
              n = document.getElementsByClassName('active')[0];
              const e = n ? n.previousSibling : void 0;
              if (void 0 !== e)
                n.classList.remove('active'),
                  null !== e && e.classList.add('active');
              else {
                let e =
                  document.getElementsByClassName('diva-input-suggestion')
                    .length - 1;
                document
                  .getElementsByClassName('diva-input-suggestion')
                  [e].classList.add('active');
              }
            } else if (40 === t.keyCode) {
              n = document.getElementsByClassName('active')[0];
              const e = n ? n.nextSibling : void 0;
              void 0 !== e
                ? (n.classList.remove('active'),
                  null !== e && e.classList.add('active'))
                : document
                    .getElementsByClassName('diva-input-suggestion')[0]
                    .classList.add('active');
            }
          }),
          (o = 'mousedown'),
          (s = '.diva-input-suggestion'),
          (a = function () {
            (e.value = this.textContent), (n.style.display = 'none');
            let t = new Event('submit', { cancelable: !0 });
            r.dispatchEvent(t);
          }),
          n.addEventListener(o, function (e) {
            for (var t = e.target; t && t !== this; )
              t.matches(s) && a.call(t, e), (t = t.parentNode);
          }),
          e.addEventListener('blur', () => {
            n.style.display = 'none';
          }),
          r
        );
      }
      createViewMenu() {
        const e = i('div', this._elemAttrs('view-options')),
          t = this._createGridViewIcon(),
          n = this._createBookViewIcon(),
          r = this._createPageViewIcon(),
          o = this.createButton('view-icon', 'Change view', () => {
            e.style.display = 'none' === e.style.display ? 'block' : 'none';
          }),
          s = (t) => {
            this.viewer.changeView(t), (e.style.display = 'none');
          },
          a = () => {
            this.settings.inGrid
              ? (o.appendChild(t),
                (o.className = 'diva-grid-icon diva-view-icon diva-button'))
              : this.settings.inBookLayout
              ? (o.appendChild(n),
                (o.className = 'diva-book-icon diva-view-icon diva-button'))
              : (o.appendChild(r),
                (o.className =
                  'diva-document-icon diva-view-icon diva-button'));
            const i = document.createDocumentFragment();
            for (
              (this.settings.inGrid || this.settings.inBookLayout) &&
                i.appendChild(
                  this.createButton(
                    'document-icon',
                    'Document View',
                    s.bind(null, 'document'),
                    r
                  )
                ),
                (!this.settings.inGrid && this.settings.inBookLayout) ||
                  i.appendChild(
                    this.createButton(
                      'book-icon',
                      'Book View',
                      s.bind(null, 'book'),
                      n
                    )
                  ),
                this.settings.inGrid ||
                  i.appendChild(
                    this.createButton(
                      'grid-icon',
                      'Grid View',
                      s.bind(null, 'grid'),
                      t
                    )
                  );
              e.firstChild;

            )
              e.removeChild(e.firstChild);
            e.appendChild(i);
          };
        return (
          document.addEventListener('mouseup', (t) => {
            e !== t.target && (e.style.display = 'none');
          }),
          this._subscribe('ViewDidSwitch', a),
          this._subscribe('ObjectDidLoad', a),
          i('div', this._elemAttrs('view-menu'), o, e)
        );
      }
      createFullscreenButton() {
        let e = this._createFullscreenIcon();
        return this.createButton(
          'fullscreen-icon',
          'Toggle fullscreen mode',
          () => {
            this.viewer.toggleFullscreenMode();
          },
          e
        );
      }
      toggleZoomGridControls() {
        this.settings.inGrid
          ? ((document.getElementById(
              this.settings.ID + 'zoom-controls'
            ).style.display = 'none'),
            (document.getElementById(
              this.settings.ID + 'grid-controls'
            ).style.display = 'block'))
          : ((document.getElementById(
              this.settings.ID + 'zoom-controls'
            ).style.display = 'block'),
            (document.getElementById(
              this.settings.ID + 'grid-controls'
            ).style.display = 'none'));
      }
      render() {
        this._subscribe('ViewDidSwitch', this.toggleZoomGridControls),
          this._subscribe('ObjectDidLoad', this.toggleZoomGridControls);
        let e = [this.createZoomButtons(), this.createGridControls()],
          t = [this.createPageLabel(), this.createViewMenu()];
        this.settings.enableFullscreen && t.push(this.createFullscreenButton()),
          this.settings.enableGotoPage &&
            t.splice(1, 0, this.createGotoPageForm());
        let n = this.viewer.viewerState.pluginInstances;
        for (let i = 0, o = n.length; i < o; i++) {
          let o = n[i];
          o.toolbarSide &&
            ((o.toolbarIcon = o.createIcon()),
            o.toolbarIcon &&
              ('right' === o.toolbarSide
                ? t.splice(2, 0, o.toolbarIcon)
                : 'left' === o.toolbarSide && e.splice(2, 0, o.toolbarIcon),
              o.toolbarIcon.addEventListener('click', r.bind(this, o))));
        }
        function r(e) {
          e.handleClick(this.viewer);
        }
        const o = i(
          'div',
          this._elemAttrs('tools'),
          i('div', this._elemAttrs('tools-left'), e),
          i('div', this._elemAttrs('tools-right'), t)
        );
        this.settings.toolbarParentObject.insertBefore(
          o,
          this.settings.toolbarParentObject.firstChild
        );
      }
      _createToolbarIcon(e) {
        let t = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        t.setAttributeNS(null, 'viewBox', '0 0 25 25'),
          t.setAttributeNS(null, 'x', '0px'),
          t.setAttributeNS(null, 'y', '0px'),
          t.setAttributeNS(null, 'style', 'enable-background:new 0 0 48 48;');
        let n = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        return (
          n.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, 1, -12, -12)'),
          e.forEach((e) => {
            let t = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'path'
            );
            t.setAttributeNS(null, 'd', e), n.appendChild(t);
          }),
          t.appendChild(n),
          t
        );
      }
      _createZoomOutIcon() {
        return this._createToolbarIcon([
          'M19.5,23c-0.275,0-0.5-0.225-0.5-0.5v-1c0-0.275,0.225-0.5,0.5-0.5h7c0.275,0,0.5,0.225,0.5,0.5v1c0,0.275-0.225,0.5-0.5,0.5H19.5z',
          'M37.219,34.257l-2.213,2.212c-0.202,0.202-0.534,0.202-0.736,0l-6.098-6.099c-1.537,0.993-3.362,1.577-5.323,1.577c-5.431,0-9.849-4.418-9.849-9.849c0-5.431,4.418-9.849,9.849-9.849c5.431,0,9.849,4.418,9.849,9.849c0,1.961-0.584,3.786-1.576,5.323l6.098,6.098C37.422,33.722,37.422,34.054,37.219,34.257z M29.568,22.099c0-3.706-3.014-6.72-6.72-6.72c-3.706,0-6.72,3.014-6.72,6.72c0,3.706,3.014,6.72,6.72,6.72C26.555,28.818,29.568,25.805,29.568,22.099z',
        ]);
      }
      _createZoomInIcon() {
        return this._createToolbarIcon([
          'M37.469,34.257l-2.213,2.212c-0.202,0.202-0.534,0.202-0.736,0l-6.098-6.099c-1.537,0.993-3.362,1.577-5.323,1.577c-5.431,0-9.849-4.418-9.849-9.849c0-5.431,4.418-9.849,9.849-9.849c5.431,0,9.849,4.418,9.849,9.849c0,1.961-0.584,3.786-1.576,5.323l6.098,6.098C37.672,33.722,37.672,34.054,37.469,34.257z M29.818,22.099c0-3.706-3.014-6.72-6.72-6.72c-3.706,0-6.72,3.014-6.72,6.72c0,3.706,3.014,6.72,6.72,6.72C26.805,28.818,29.818,25.805,29.818,22.099z M26.5,21H24v-2.5c0-0.275-0.225-0.5-0.5-0.5h-1c-0.275,0-0.5,0.225-0.5,0.5V21h-2.5c-0.275,0-0.5,0.225-0.5,0.5v1c0,0.275,0.225,0.5,0.5,0.5H22v2.5c0,0.275,0.225,0.5,0.5,0.5h1c0.275,0,0.5-0.225,0.5-0.5V23h2.5c0.275,0,0.5-0.225,0.5-0.5v-1C27,21.225,26.775,21,26.5,21z',
        ]);
      }
      _createGridMoreIcon() {
        return this._createToolbarIcon([
          'M29.5,35c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H29.5z M21.5,35c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H21.5z M13.5,35c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H13.5z M29.5,27c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H29.5z M21.5,27c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H21.5z M13.5,27c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H13.5z M29.5,19c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H29.5z M21.5,19c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H21.5z M13.5,19c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H13.5z',
        ]);
      }
      _createGridFewerIcon() {
        return this._createToolbarIcon([
          'M25.5,35c-0.275,0-0.5-0.225-0.5-0.5v-9c0-0.275,0.225-0.5,0.5-0.5h9c0.275,0,0.5,0.225,0.5,0.5v9c0,0.275-0.225,0.5-0.5,0.5H25.5z M22.5,35c0.275,0,0.5-0.225,0.5-0.5v-9c0-0.275-0.225-0.5-0.5-0.5h-9c-0.275,0-0.5,0.225-0.5,0.5v9c0,0.275,0.225,0.5,0.5,0.5H22.5z M34.5,23c0.275,0,0.5-0.225,0.5-0.5v-9c0-0.275-0.225-0.5-0.5-0.5h-9c-0.275,0-0.5,0.225-0.5,0.5v9c0,0.275,0.225,0.5,0.5,0.5H34.5z M22.5,23c0.275,0,0.5-0.225,0.5-0.5v-9c0-0.275-0.225-0.5-0.5-0.5h-9c-0.275,0-0.5,0.225-0.5,0.5v9c0,0.275,0.225,0.5,0.5,0.5H22.5z',
        ]);
      }
      _createGridViewIcon() {
        return this._createToolbarIcon([
          'M29.5,35c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H29.5z M21.5,35c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H21.5z M13.5,35c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H13.5z M29.5,27c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H29.5z M21.5,27c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H21.5z M13.5,27c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H13.5z M29.5,19c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H29.5z M21.5,19c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H21.5z M13.5,19c-0.275,0-0.5-0.225-0.5-0.5v-5c0-0.275,0.225-0.5,0.5-0.5h5c0.275,0,0.5,0.225,0.5,0.5v5c0,0.275-0.225,0.5-0.5,0.5H13.5z',
        ]);
      }
      _createBookViewIcon() {
        return this._createToolbarIcon([
          'M35,16.8v-1.323c0,0-2.292-1.328-5.74-1.328c-3.448,0-5.26,1.25-5.26,1.25s-1.813-1.25-5.26-1.25c-3.448,0-5.74,1.328-5.74,1.328V16.8l-1,0.531v0.021v15.687c0,0,4.531-1.578,6.999-1.578c2.468,0,5.001,0.885,5.001,0.885s2.532-0.885,5-0.885c0.306,0,0.643,0.024,1,0.066v4.325l1.531-2.016L33,35.852v-3.72c2,0.43,3,0.906,3,0.906V17.352v-0.021L35,16.8z M23,29.03c-1-0.292-2.584-0.679-3.981-0.679c-2.246,0-3.019,0.404-4.019,0.699V16.634c0,0,1.125-0.699,4.019-0.699c1.694,0,2.981,0.417,3.981,1.126V29.03z M33,29.051c-1-0.295-1.773-0.699-4.02-0.699c-1.396,0-2.981,0.387-3.98,0.679V17.06c1-0.709,2.286-1.126,3.98-1.126c2.895,0,4.02,0.699,4.02,0.699V29.051z',
        ]);
      }
      _createPageViewIcon() {
        return this._createToolbarIcon([
          'M29.425,29h4.47L29,33.934v-4.47C29,29.19,29.151,29,29.425,29z M34,14.563V28h-5.569C28.157,28,28,28.196,28,28.47V34H14.497C14.223,34,14,33.71,14,33.437V14.563C14,14.29,14.223,14,14.497,14h18.9C33.672,14,34,14.29,34,14.563z M25.497,26.497C25.497,26.223,25.275,26,25,26h-7c-0.275,0-0.497,0.223-0.497,0.497v1.006C17.503,27.777,17.725,28,18,28h7c0.275,0,0.497-0.223,0.497-0.497V26.497z M30.497,22.497C30.497,22.223,30.275,22,30,22H18c-0.275,0-0.497,0.223-0.497,0.497v1.006C17.503,23.777,17.725,24,18,24h12c0.275,0,0.497-0.223,0.497-0.497V22.497z M30.497,18.497C30.497,18.223,30.275,18,30,18H18c-0.275,0-0.497,0.223-0.497,0.497v1.006C17.503,19.777,17.725,20,18,20h12c0.275,0,0.497-0.223,0.497-0.497V18.497z',
        ]);
      }
      _createFullscreenIcon() {
        return this._createToolbarIcon([
          'M35,12H13c-0.55,0-1,0.45-1,1v22c0,0.55,0.45,1,1,1h22c0.55,0,1-0.45,1-1V13C36,12.45,35.55,12,35,12z M34,34H14V14h20V34z',
          'M17,21.75v-4.5c0-0.138,0.112-0.25,0.25-0.25h4.5c0.138,0,0.17,0.08,0.073,0.177l-1.616,1.616l1.823,1.823c0.097,0.097,0.097,0.256,0,0.354l-1.061,1.06c-0.097,0.097-0.256,0.097-0.354,0l-1.823-1.823l-1.616,1.616C17.08,21.92,17,21.888,17,21.75z M20.97,25.97c-0.097-0.097-0.256-0.097-0.354,0l-1.823,1.823l-1.616-1.616C17.08,26.08,17,26.112,17,26.25v4.5c0,0.138,0.112,0.25,0.25,0.25h4.5c0.138,0,0.17-0.08,0.073-0.177l-1.616-1.616l1.823-1.823c0.097-0.097,0.097-0.256,0-0.354L20.97,25.97z M30.75,17h-4.5c-0.138,0-0.17,0.08-0.073,0.177l1.616,1.616l-1.823,1.823c-0.097,0.097-0.097,0.256,0,0.354l1.061,1.06c0.097,0.097,0.256,0.097,0.354,0l1.823-1.823l1.616,1.616C30.92,21.92,31,21.888,31,21.75v-4.5C31,17.112,30.888,17,30.75,17z M30.823,26.177l-1.616,1.616l-1.823-1.823c-0.097-0.097-0.256-0.097-0.354,0l-1.061,1.06c-0.097,0.097-0.097,0.256,0,0.354l1.823,1.823l-1.616,1.616C26.08,30.92,26.112,31,26.25,31h4.5c0.138,0,0.25-0.112,0.25-0.25v-4.5C31,26.112,30.92,26.08,30.823,26.177z M26,22.5c0-0.275-0.225-0.5-0.5-0.5h-3c-0.275,0-0.5,0.225-0.5,0.5v3c0,0.275,0.225,0.5,0.5,0.5h3c0.275,0,0.5-0.225,0.5-0.5V22.5z',
        ]);
      }
    }
    var le = {
      get: ue,
      update: function (e, t) {
        const n = ue(e),
          i = window.location.hash;
        if (n !== t)
          if ('string' == typeof n) {
            const r =
                i.indexOf('&' + e + '=') > 0
                  ? i.indexOf('&' + e + '=')
                  : i.indexOf('#' + e + '='),
              o = r + e.length + 2 + n.length,
              s = 0 === r ? '#' : '&';
            window.location.replace(
              i.substring(0, r) + s + e + '=' + t + i.substring(o)
            );
          } else
            0 === i.length
              ? window.location.replace('#' + e + '=' + t)
              : window.location.replace(i + '&' + e + '=' + t);
      },
    };
    function ue(e) {
      const t = window.location.hash;
      if ('' !== t) {
        let n =
          t.indexOf('&' + e + '=') > 0
            ? t.indexOf('&' + e + '=')
            : t.indexOf('#' + e + '=');
        if (n >= 0) {
          n += e.length + 2;
          const i = t.indexOf('&', n);
          return i > n
            ? decodeURIComponent(t.substring(n, i))
            : i < 0
            ? decodeURIComponent(t.substring(n))
            : '';
        }
        return !1;
      }
      return !1;
    }
    class de {
      constructor(e, t) {
        if (
          !(e instanceof HTMLElement) &&
          ((this.element = document.getElementById(e)), null === this.element)
        )
          throw new a();
        if (!t.objectData)
          throw new l(
            'You must supply either a URL or a literal object to the `objectData` key.'
          );
        this.options = Object.assign(
          {
            adaptivePadding: 0.05,
            arrowScrollAmount: 40,
            blockMobileMove: !1,
            objectData: '',
            enableAutoTitle: !0,
            enableFilename: !0,
            enableFullscreen: !0,
            enableGotoPage: !0,
            enableGotoSuggestions: !0,
            enableGridIcon: !0,
            enableGridControls: 'buttons',
            enableImageTitles: !0,
            enableIndexAsLabel: !1,
            enableKeyScroll: !0,
            enableLinkIcon: !0,
            enableNonPagedVisibilityIcon: !0,
            enableSpaceScroll: !1,
            enableToolbar: !0,
            enableZoomControls: 'buttons',
            fillParentHeight: !0,
            fixedPadding: 10,
            fixedHeightGrid: !0,
            goDirectlyTo: 0,
            hashParamSuffix: null,
            imageCrossOrigin: 'anonymous',
            inFullscreen: !1,
            inBookLayout: !1,
            inGrid: !1,
            maxPagesPerRow: 8,
            maxZoomLevel: -1,
            minPagesPerRow: 2,
            minZoomLevel: 0,
            onGotoSubmit: null,
            pageAliases: {},
            pageAliasFunction: function () {
              return !1;
            },
            pageLoadTimeout: 200,
            pagesPerRow: 5,
            requestHeaders: { Accept: 'application/json' },
            showNonPagedPages: !1,
            throbberTimeout: 100,
            tileHeight: 256,
            tileWidth: 256,
            toolbarParentObject: null,
            verticallyOriented: !0,
            viewportMargin: 200,
            zoomLevel: 2,
          },
          t
        );
        const n = i('div', {
          class:
            'diva-wrapper' +
            (this.options.fillParentHeight ? ' diva-wrapper-flexbox' : ''),
        });
        this.element.appendChild(n),
          (this.options.toolbarParentObject =
            this.options.toolbarParentObject || n);
        const r = new J(n, this.options, this);
        (this.viewerState = r.getInternalState()),
          (this.settings = r.getSettings()),
          (this.toolbar = this.settings.enableToolbar ? new ce(this) : null),
          (n.id = this.settings.ID + 'wrapper'),
          (this.divaState = { viewerCore: r, toolbar: this.toolbar });
        let o = u.Events.subscribe('ObjectDidLoad', () => {
          null !== this.toolbar && this.toolbar.render(),
            u.Events.unsubscribe(o);
        });
        (this.hashState = this._getHashParamState()),
          this._loadOrFetchObjectData();
      }
      _loadOrFetchObjectData() {
        if ('object' == typeof this.settings.objectData)
          setTimeout(() => {
            this._loadObjectData(this.settings.objectData, this.hashState);
          }, 0);
        else {
          const e = fetch(this.settings.objectData, {
            headers: this.settings.requestHeaders,
          })
            .then((e) => {
              if (!e.ok) {
                u.Events.publish('ManifestFetchError', [e], this),
                  this._ajaxError(e);
                let t = new Error(e.statusText);
                throw ((t.response = e), t);
              }
              return e.json();
            })
            .then((e) => {
              this._loadObjectData(e, this.hashState);
            });
          this.divaState.viewerCore.setPendingManifestRequest(e);
        }
      }
      _showError(e) {
        this.divaState.viewerCore.showError(e);
      }
      _ajaxError(e) {
        const t = [
          'Invalid objectData setting. Error code: ' +
            e.status +
            ' ' +
            e.statusText,
        ];
        if (0 === this.settings.objectData.lastIndexOf('http', 0)) {
          const e = this.settings.objectData
            .replace(/https?:\/\//i, '')
            .split(/[/?#]/)[0];
          window.location.hostname !== e &&
            t.push(
              i('p', 'Attempted to access cross-origin data without CORS.'),
              i(
                'p',
                'You may need to update your server configuration to support CORS. For help, see the ',
                i(
                  'a',
                  {
                    href: 'https://github.com/DDMAL/diva.js/wiki/Installation#a-note-about-cross-site-requests',
                    target: '_blank',
                  },
                  'cross-site request documentation.'
                )
              )
            );
        }
        this._showError(t);
      }
      _loadObjectData(e, t) {
        let n;
        if (
          !e.hasOwnProperty('@context') &&
          (-1 === e['@context'].indexOf('iiif') ||
            -1 === e['@context'].indexOf('shared-canvas'))
        )
          throw new c('This does not appear to be a IIIF Manifest.');
        u.Events.publish('ManifestDidLoad', [e], this), (n = se.fromIIIF(e));
        const i = t ? this._getLoadOptionsForState(t, n) : {};
        this.divaState.viewerCore.setManifest(n, i);
      }
      _getHashParamState() {
        const e = {};
        return (
          ['f', 'v', 'z', 'n', 'i', 'p', 'y', 'x'].forEach((t) => {
            const n = le.get(t + this.settings.hashParamSuffix);
            !1 !== n && (e[t] = n);
          }),
          'true' === e.f ? (e.f = !0) : 'false' === e.f && (e.f = !1),
          ['z', 'n', 'p', 'x', 'y'].forEach((t) => {
            t in e && (e[t] = parseInt(e[t], 10));
          }),
          e
        );
      }
      _getLoadOptionsForState(e, t) {
        t = t || this.settings.manifest;
        const n = 'v' in e ? this._getViewState(e.v) : {};
        'f' in e && (n.inFullscreen = e.f),
          'z' in e && (n.zoomLevel = e.z),
          'n' in e && (n.pagesPerRow = e.n);
        let i = this._getPageIndexForManifest(t, e.i);
        if (
          ((i >= 0 && i < t.pages.length) ||
            ((i = e.p - 1), (i >= 0 && i < t.pages.length) || (i = null)),
          null !== i)
        ) {
          const t = parseInt(e.x, 10),
            r = parseInt(e.y, 10);
          (n.goDirectlyTo = i),
            (n.horizontalOffset = t),
            (n.verticalOffset = r);
        }
        return n;
      }
      _getViewState(e) {
        switch (e) {
          case 'd':
            return { inGrid: !1, inBookLayout: !1 };
          case 'b':
            return { inGrid: !1, inBookLayout: !0 };
          case 'g':
            return { inGrid: !0, inBookLayout: !1 };
          default:
            return {};
        }
      }
      _getPageIndexForManifest(e, t) {
        let n;
        const i = e.pages.length;
        for (n = 0; n < i; n++) if (e.pages[n].f === t) return n;
        return -1;
      }
      _getState() {
        let e;
        e = this.settings.inGrid ? 'g' : this.settings.inBookLayout ? 'b' : 'd';
        const t = this.divaState.viewerCore
          .getCurrentLayout()
          .getPageToViewportCenterOffset(
            this.settings.activePageIndex,
            this.viewerState.viewport
          );
        return {
          f: this.settings.inFullscreen,
          v: e,
          z: this.settings.zoomLevel,
          n: this.settings.pagesPerRow,
          i:
            !!this.settings.enableFilename &&
            this.settings.manifest.pages[this.settings.activePageIndex].f,
          p: !this.settings.enableFilename && this.settings.activePageIndex + 1,
          y: !!t && t.y,
          x: !!t && t.x,
        };
      }
      _getURLHash() {
        const e = this._getState(),
          t = [];
        let n;
        for (n in e)
          !1 !== e[n] &&
            t.push(
              n + this.settings.hashParamSuffix + '=' + encodeURIComponent(e[n])
            );
        return t.join('&');
      }
      _getPageIndex(e) {
        return this._getPageIndexForManifest(this.settings.manifest, e);
      }
      _checkLoaded() {
        return (
          !!this.viewerState.loaded ||
          (console.warn(
            'The viewer is not completely initialized. This is likely because it is still downloading data. To fix this, only call this function if the isReady() method returns true.'
          ),
          !1)
        );
      }
      _toggleFullscreen() {
        let e;
        this._reloadViewer({ inFullscreen: !this.settings.inFullscreen });
        let t = !1,
          n = document.getElementById(this.settings.selector + 'tools');
        function i() {
          (n.style.opacity = 1),
            clearTimeout(e),
            !t &&
              this.settings.inFullscreen &&
              (e = setTimeout(function () {
                n.style.opacity = 0;
              }, 2e3));
        }
        this.settings.inFullscreen
          ? (n.classList.add('diva-fullscreen-tools'),
            document.addEventListener('mousemove', i.bind(this)),
            document
              .getElementsByClassName('diva-viewport')[0]
              .addEventListener('scroll', i.bind(this)),
            n.addEventListener('mouseenter', function () {
              t = !0;
            }),
            n.addEventListener('mouseleave', function () {
              t = !1;
            }))
          : n.classList.remove('diva-fullscreen-tools');
      }
      _togglePageLayoutOrientation() {
        const e = !this.settings.verticallyOriented;
        return (
          this._reloadViewer({
            inGrid: !1,
            verticallyOriented: e,
            goDirectlyTo: this.settings.activePageIndex,
            verticalOffset: this.divaState.viewerCore.getYOffset(),
            horizontalOffset: this.divaState.viewerCore.getXOffset(),
          }),
          e
        );
      }
      _changeView(e) {
        switch (e) {
          case 'document':
            return this._reloadViewer({ inGrid: !1, inBookLayout: !1 });
          case 'book':
            return this._reloadViewer({ inGrid: !1, inBookLayout: !0 });
          case 'grid':
            return this._reloadViewer({ inGrid: !0 });
          default:
            return !1;
        }
      }
      _gotoPageByIndex(e, t, n) {
        let i = parseInt(e, 10);
        if (this._isPageIndexValid(i)) {
          const e = this.divaState.viewerCore.getXOffset(i, t),
            r = this.divaState.viewerCore.getYOffset(i, n);
          return this.viewerState.renderer.goto(i, r, e), !0;
        }
        return !1;
      }
      _isPageIndexValid(e) {
        return this.settings.manifest.isPageValid(
          e,
          this.settings.showNonPagedPages
        );
      }
      _getPageIndexForPageXYValues(e, t) {
        const n = this.viewerState.outerElement.getBoundingClientRect(),
          i = n.top,
          r = n.left,
          o = n.bottom,
          s = n.right;
        if (e < r || e > s) return -1;
        if (t < i || t > o) return -1;
        const a = document.getElementsByClassName('diva-page');
        let c = a.length;
        for (; c--; ) {
          const n = a[c],
            i = n.getBoundingClientRect();
          if (!(e < i.left || e > i.right) && !(t < i.top || t > i.bottom))
            return n.getAttribute('data-index');
        }
        return -1;
      }
      _reloadViewer(e) {
        return this.divaState.viewerCore.reload(e);
      }
      _getCurrentURL() {
        return (
          location.protocol +
          '//' +
          location.host +
          location.pathname +
          location.search +
          '#' +
          this._getURLHash()
        );
      }
      activate() {
        this.viewerState.isActiveDiva = !0;
      }
      changeObject(e) {
        (this.viewerState.loaded = !1),
          this.divaState.viewerCore.clear(),
          this.viewerState.renderer && this.viewerState.renderer.destroy(),
          (this.viewerState.options.objectData = e),
          this._loadOrFetchObjectData();
      }
      changeView(e) {
        this._changeView(e);
      }
      deactivate() {
        this.viewerState.isActiveDiva = !1;
      }
      destroy() {
        this.divaState.viewerCore.destroy();
      }
      disableScrollable() {
        this.divaState.viewerCore.disableScrollable();
      }
      enableScrollable() {
        this.divaState.viewerCore.enableScrollable();
      }
      disableDragScrollable() {
        this.divaState.viewerCore.disableDragScrollable();
      }
      enableDragScrollable() {
        this.divaState.viewerCore.enableDragScrollable();
      }
      enterFullscreenMode() {
        return !this.settings.inFullscreen && (this._toggleFullscreen(), !0);
      }
      enterGridView() {
        return !this.settings.inGrid && (this._changeView('grid'), !0);
      }
      getAllPageURIs() {
        return this.settings.manifest.pages.map((e) => e.f);
      }
      getCurrentCanvas() {
        return this.settings.manifest.pages[this.settings.activePageIndex]
          .canvas;
      }
      getCurrentPageDimensionsAtCurrentZoomLevel() {
        return this.getPageDimensionsAtCurrentZoomLevel(
          this.settings.activePageIndex
        );
      }
      getCurrentPageFilename() {
        return (
          console.warn(
            'This method will be deprecated in the next version of Diva. Please use getCurrentPageURI instead.'
          ),
          this.settings.manifest.pages[this.settings.activePageIndex].f
        );
      }
      getCurrentPageIndices() {
        return this.settings.currentPageIndices;
      }
      getActivePageIndex() {
        return this.settings.activePageIndex;
      }
      getCurrentPageOffset() {
        return this.getPageOffset(this.settings.activePageIndex);
      }
      getCurrentPageURI() {
        return this.settings.manifest.pages[this.settings.activePageIndex].f;
      }
      getCurrentURL() {
        return this._getCurrentURL();
      }
      getFilenames() {
        return (
          console.warn(
            'This will be removed in the next version of Diva. Use getAllPageURIs instead.'
          ),
          this.settings.manifest.pages.map((e) => e.f)
        );
      }
      getGridPagesPerRow() {
        return this.settings.pagesPerRow;
      }
      getInstanceId() {
        return this.settings.ID;
      }
      getInstanceSelector() {
        return this.divaState.viewerCore.selector;
      }
      getItemTitle() {
        return this.settings.manifest.itemTitle;
      }
      getMaxZoomLevel() {
        return this.settings.maxZoomLevel;
      }
      getMaxZoomLevelForPage(e) {
        return !!this._checkLoaded() && this.settings.manifest.pages[e].m;
      }
      getMinZoomLevel() {
        return this.settings.minZoomLevel;
      }
      getNumberOfPages() {
        return !!this._checkLoaded() && this.settings.numPages;
      }
      getOtherImages(e) {
        return this.settings.manifest.pages[e].otherImages;
      }
      getPageDimensions(e) {
        return this._checkLoaded()
          ? this.divaState.viewerCore.getCurrentLayout().getPageDimensions(e)
          : null;
      }
      getPageDimensionsAtCurrentZoomLevel(e) {
        let t = parseInt(e, 10);
        if (!this._isPageIndexValid(t)) throw new Error('Invalid Page Index');
        return this.divaState.viewerCore
          .getCurrentLayout()
          .getPageDimensions(t);
      }
      getPageDimensionsAtZoomLevel(e, t) {
        if (!this._checkLoaded()) return !1;
        t > this.settings.maxZoomLevel && (t = this.settings.maxZoomLevel);
        const n =
          this.settings.manifest.pages[parseInt(e, 10)].d[parseInt(t, 10)];
        return { width: n.w, height: n.h };
      }
      getPageImageURL(e, t) {
        return this.settings.manifest.getPageImageURL(e, t);
      }
      getPageIndexForPageXYValues(e, t) {
        return this._getPageIndexForPageXYValues(e, t);
      }
      getPageOffset(e, t) {
        const n = this.divaState.viewerCore.getPageRegion(e, t);
        return { top: n.top, left: n.left };
      }
      getSettings() {
        return this.settings;
      }
      getState() {
        return this._getState();
      }
      getZoomLevel() {
        return this.settings.zoomLevel;
      }
      gotoPageByIndex(e, t, n) {
        return this._gotoPageByIndex(e, t, n);
      }
      gotoPageByLabel(e, t, n) {
        const i = this.settings.manifest.pages;
        let r = e.toLowerCase();
        for (let e = 0, o = i.length; e < o; e++)
          if (i[e].l.toLowerCase().indexOf(r) > -1)
            return this._gotoPageByIndex(e, t, n);
        const o = parseInt(e, 10) - 1;
        return this._gotoPageByIndex(o, t, n);
      }
      gotoPageByName(e, t, n) {
        console.warn(
          'This method will be removed in the next version of Diva.js. Use gotoPageByURI instead.'
        );
        const i = this._getPageIndex(e);
        return this._gotoPageByIndex(i, t, n);
      }
      gotoPageByURI(e, t, n) {
        const i = this._getPageIndex(e);
        return this._gotoPageByIndex(i, t, n);
      }
      hasOtherImages(e) {
        return !0 === this.settings.manifest.pages[e].otherImages;
      }
      hideNonPagedPages() {
        this._reloadViewer({ showNonPagedPages: !1 });
      }
      isInFullscreen() {
        return this.settings.inFullscreen;
      }
      isPageIndexValid(e) {
        return this._isPageIndexValid(e);
      }
      isPageInViewport(e) {
        return this.viewerState.renderer.isPageVisible(e);
      }
      isReady() {
        return this.viewerState.loaded;
      }
      isRegionInViewport(e, t, n, i, r) {
        const o = this.divaState.viewerCore.getCurrentLayout();
        if (!o) return !1;
        const s = o.getPageOffset(e),
          a = s.top + n,
          c = s.left + t;
        return this.viewerState.viewport.intersectsRegion({
          top: a,
          bottom: a + r,
          left: c,
          right: c + i,
        });
      }
      isVerticallyOriented() {
        return this.settings.verticallyOriented;
      }
      leaveFullscreenMode() {
        return !!this.settings.inFullscreen && (this._toggleFullscreen(), !0);
      }
      leaveGridView() {
        return (
          !!this.settings.inGrid && (this._reloadViewer({ inGrid: !1 }), !0)
        );
      }
      setGridPagesPerRow(e) {
        return (
          !!this.divaState.viewerCore.isValidOption('pagesPerRow', e) &&
          this._reloadViewer({ inGrid: !0, pagesPerRow: e })
        );
      }
      setState(e) {
        this._reloadViewer(this._getLoadOptionsForState(e));
      }
      setZoomLevel(e) {
        return (
          this.settings.inGrid && this._reloadViewer({ inGrid: !1 }),
          this.divaState.viewerCore.zoom(e)
        );
      }
      showNonPagedPages() {
        this._reloadViewer({ showNonPagedPages: !0 });
      }
      toggleFullscreenMode() {
        this._toggleFullscreen();
      }
      toggleNonPagedPagesVisibility() {
        this._reloadViewer({
          showNonPagedPages: !this.settings.showNonPagedPages,
        });
      }
      toggleOrientation() {
        return this._togglePageLayoutOrientation();
      }
      translateFromMaxZoomLevel(e) {
        const t = this.settings.maxZoomLevel - this.settings.zoomLevel;
        return e / Math.pow(2, t);
      }
      translateToMaxZoomLevel(e) {
        const t = this.settings.maxZoomLevel - this.settings.zoomLevel;
        return 0 === t ? e : e * Math.pow(2, t);
      }
      zoomIn() {
        return this.setZoomLevel(this.settings.zoomLevel + 1);
      }
      zoomOut() {
        return this.setZoomLevel(this.settings.zoomLevel - 1);
      }
    }
    de.Events = u.Events;
    var he;
    t.default = de;
    'undefined' != typeof window && ((he = window).Diva = he.Diva || de);
  },
]);
//# sourceMappingURL=editor.js.map
