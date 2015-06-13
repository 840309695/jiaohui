define("lib/collections", function(e, t, n) {
        var i = {
            toMap: function(e, t) {
                for (var n = {}, i = "function" == typeof t, r = 0, o = e.length; o > r; r++) {
                    var a = e[r];
                    t ? i ? n[t.call(a, a)] = a : n[a[t]] = a : n[a] = a
                }
                return n
            },
            indexOf: function() {
                var e = [].indexOf || function(e) {
                    for (var t = 0, n = this.length; n > t; t++)
                        if (this[t] === e) return t;
                    return -1
                };
                return function(t, n) {
                    return e.call(t, n)
                }
            }(),
            contains: function(e, t) {
                return this.indexOf(e, t) > -1
            },
            first: function(e, t) {
                if (e)
                    if (e instanceof Array)
                        for (var n = 0, i = e.length; i > n; n++) {
                            var r = e[n];
                            if (t.call(r, r, n)) return r
                        } else if (e instanceof Object)
                            for (var o in e) {
                                var r = e[o];
                                if (t.call(r, r, o)) return r
                            }
                        return void 0
            },
            any: function(e, t) {
                return !!this.first(e, t)
            }
        };
        n.exports = i
    }), define("lib/dates", function(e, t, n) {
        var i = 864e5,
            r = {
                fromStr: function(e, t) {
                    if (!e) return null;
                    var n = this.fromISO(e);
                    return n && t && (n.setSeconds(59), n.setMinutes(59), n.setHours(23)), n
                },
                fromISO: function(e, t) {
                    var n = e.parse,
                        i = [1, 4, 5, 6, 7, 10, 11];
                    return function(r) {
                        var o, a, s = 0;
                        if (a = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(r)) {
                            for (var l, c = 0; l = i[c]; ++c) a[l] = +a[l] || 0;
                            a[2] = (+a[2] || 1) - 1, a[3] = +a[3] || 1, "Z" !== a[8] && a[9] !== t && (s = 60 * a[10] + a[11], "+" === a[9] && (s = 0 - s)), o = e.UTC(a[1], a[2], a[3], a[4], a[5] + s, a[6], a[7])
                        } else o = n ? n(r) : 0 / 0;
                        return new e(o)
                    }
                }(Date),
                diff: function(e, t) {
                    return (e.getTime() - t.getTime()) / i
                },
                format: function(e, t) {
                    var n = [e.getFullYear(), ("0" + (1 + e.getMonth())).slice(-2), ("0" + e.getDate()).slice(-2)].join("-");
                    return t === !1 && (n += " " + [("0" + e.getHours()).slice(-2), ("0" + e.getMinutes()).slice(-2), ("0" + e.getSeconds()).slice(-2)].join(":")), n
                }
            };
        n.exports = r
    }), define("lib/event", function(e, t) {
        var n = e("util"),
            i = e("lib/reporter"),
            r = function(e) {
                return e.getAttribute("data-event")
            },
            o = function(e) {
                return !!e.getAttribute("data-event")
            },
            a = function(e, t, n) {
                e.addEventListener ? e.addEventListener(t, n, !0) : e.attachEvent ? e.attachEvent("on" + t, n) : e[t] = n
            },
            s = function(e, t, n) {
                n = n || this.judgeFn || o;
                for (var i = e.srcElement || e.target; i;) {
                    if (n(i)) return i;
                    if (t == i) break;
                    i = i.parentNode
                }
                return null
            },
            l = function(e, t, o, l) {
                "click" == t && n.isMobile() && (t = "tap"), l = l || r;
                var c = function(e) {
                        return !!l(e)
                    },
                    u = function(n) {
                        var r = s(n, e, c),
                            a = !1;
                        if (r) {
                            var u, d = l(r);
                            if ("[object Function]" === Object.prototype.toString.call(o) ? (u = o.call(r, n, d), a = !0) : o[d] && (u = o[d].call(r, n), a = !0), a && (u || (n.preventDefault ? n.preventDefault() : n.returnValue = !1), /click|tap/.test(t))) {
                                var p = r.getAttribute("data-hot");
                                p && i.click(p)
                            }
                        }
                    };
                "tap" == t ? ! function() {
                    var t = !0;
                    a(e, "touchstart", function() {
                        t = !0
                    }), a(e, "touchmove", function() {
                        t = !1
                    }), a(e, "touchend", function(e) {
                        t && u(e)
                    })
                }() : a(e, t, u)
            },
            c = {},
            u = function(e, t) {
                var n = c[e];
                n || (n = c[e] = {});
                for (var i in t)
                    if (!n[i]) {
                        var r = {};
                        r[i] = t[i], "mouseenter" == e || "mouseleave" == e ? $("body").on(e, '[data-event="' + i + '"]', r[i]) : l(document.body, e, r), n[i] = 1
                    }
            },
            d = function(e, t, n, r, o) {
                e = $(e), n = n || "data-action", r = r || "onAction";
                var a = function(e) {
                    var a, s = $(e.target).closest("[" + n + "]");
                    if (!(s.length <= 0) && (e.preventDefault(), e.stopPropagation(), a = s.attr(n))) {
                        $.isFunction(o) && o(a, s);
                        var l = r + a.charAt(0).toUpperCase() + a.slice(1),
                            c = t[l];
                        $.isFunction(c) && c.call(t, s, e);
                        var u = s.attr("data-hot");
                        u && i.click(u)
                    }
                };
                return e.on("click", a), a
            };
        t.bindCommonEvent = l, t.addCommonEvent = u, t.dispatchActionEvent = d
    }), define("lib/functional", function(e, t) {
        function n(e, t) {
            var n, i = e,
                r = !0;
            return function() {
                var e = arguments,
                    o = this;
                return r ? (i.apply(o, e), r = !1) : n ? !1 : void(n = setTimeout(function() {
                    clearTimeout(n), n = null, i.apply(o, e)
                }, t))
            }
        }
        t.throttle = n
    }), define("lib/interval", function(e, t, n) {
        function i(e) {
            for (var t in d)
                if (!1 === e.call(d[t])) return
        }

        function r() {
            var e = +new Date;
            i(function() {
                var t = this;
                return !t.__time && (t.__time = e), t.__time + t._ftp <= e && 1 === t.status ? (t.__time = e, t._cb.call(), !1) : void 0
            })
        }

        function o() {
            var e = 0;
            i(function() {
                1 === this.status && (e += 1)
            }), (0 === e || 0 === p) && (clearInterval(u), u = null)
        }

        function a() {
            this.status = 1, !u && (u = setInterval(r, f))
        }

        function s() {
            this.status = 0, this.__time = +new Date, o()
        }

        function l() {
            delete d[this._id], p -= 1, o()
        }

        function c(e, t) {
            return p += 1, h += 1, d[h] = {
                _id: h,
                _cb: e,
                _ftp: t || f,
                start: a,
                pause: s,
                clear: l
            }
        }
        var u, d = {},
            p = 0,
            f = 50,
            h = 0;
        n.exports = c
    }), define("lib/jquery-1.10.2", function() {
        return function(e, t) {
            function n(e) {
                var t = e.length,
                    n = ut.type(e);
                return ut.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || "function" !== n && (0 === t || "number" == typeof t && t > 0 && t - 1 in e)
            }

            function i(e) {
                var t = Et[e] = {};
                return ut.each(e.match(pt) || [], function(e, n) {
                    t[n] = !0
                }), t
            }

            function r(e, n, i, r) {
                if (ut.acceptData(e)) {
                    var o, a, s = ut.expando,
                        l = e.nodeType,
                        c = l ? ut.cache : e,
                        u = l ? e[s] : e[s] && s;
                    if (u && c[u] && (r || c[u].data) || i !== t || "string" != typeof n) return u || (u = l ? e[s] = tt.pop() || ut.guid++ : s), c[u] || (c[u] = l ? {} : {
                        toJSON: ut.noop
                    }), ("object" == typeof n || "function" == typeof n) && (r ? c[u] = ut.extend(c[u], n) : c[u].data = ut.extend(c[u].data, n)), a = c[u], r || (a.data || (a.data = {}), a = a.data), i !== t && (a[ut.camelCase(n)] = i), "string" == typeof n ? (o = a[n], null == o && (o = a[ut.camelCase(n)])) : o = a, o
                }
            }

            function o(e, t, n) {
                if (ut.acceptData(e)) {
                    var i, r, o = e.nodeType,
                        a = o ? ut.cache : e,
                        l = o ? e[ut.expando] : ut.expando;
                    if (a[l]) {
                        if (t && (i = n ? a[l] : a[l].data)) {
                            ut.isArray(t) ? t = t.concat(ut.map(t, ut.camelCase)) : t in i ? t = [t] : (t = ut.camelCase(t), t = t in i ? [t] : t.split(" ")), r = t.length;
                            for (; r--;) delete i[t[r]];
                            if (n ? !s(i) : !ut.isEmptyObject(i)) return
                        }(n || (delete a[l].data, s(a[l]))) && (o ? ut.cleanData([e], !0) : ut.support.deleteExpando || a != a.window ? delete a[l] : a[l] = null)
                    }
                }
            }

            function a(e, n, i) {
                if (i === t && 1 === e.nodeType) {
                    var r = "data-" + n.replace(Nt, "-$1").toLowerCase();
                    if (i = e.getAttribute(r), "string" == typeof i) {
                        try {
                            i = "true" === i ? !0 : "false" === i ? !1 : "null" === i ? null : +i + "" === i ? +i : _t.test(i) ? ut.parseJSON(i) : i
                        } catch (o) {}
                        ut.data(e, n, i)
                    } else i = t
                }
                return i
            }

            function s(e) {
                var t;
                for (t in e)
                    if (("data" !== t || !ut.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
                return !0
            }

            function l() {
                return !0
            }

            function c() {
                return !1
            }

            function u() {
                try {
                    return Y.activeElement
                } catch (e) {}
            }

            function d(e, t) {
                do e = e[t]; while (e && 1 !== e.nodeType);
                return e
            }

            function p(e, t, n) {
                if (ut.isFunction(t)) return ut.grep(e, function(e, i) {
                    return !!t.call(e, i, e) !== n
                });
                if (t.nodeType) return ut.grep(e, function(e) {
                    return e === t !== n
                });
                if ("string" == typeof t) {
                    if (Bt.test(t)) return ut.filter(t, e, n);
                    t = ut.filter(t, e)
                }
                return ut.grep(e, function(e) {
                    return ut.inArray(e, t) >= 0 !== n
                })
            }

            function f(e) {
                var t = Xt.split("|"),
                    n = e.createDocumentFragment();
                if (n.createElement)
                    for (; t.length;) n.createElement(t.pop());
                return n
            }

            function h(e, t) {
                return ut.nodeName(e, "table") && ut.nodeName(1 === t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
            }

            function g(e) {
                return e.type = (null !== ut.find.attr(e, "type")) + "/" + e.type, e
            }

            function m(e) {
                var t = on.exec(e.type);
                return t ? e.type = t[1] : e.removeAttribute("type"), e
            }

            function v(e, t) {
                for (var n, i = 0; null != (n = e[i]); i++) ut._data(n, "globalEval", !t || ut._data(t[i], "globalEval"))
            }

            function y(e, t) {
                if (1 === t.nodeType && ut.hasData(e)) {
                    var n, i, r, o = ut._data(e),
                        a = ut._data(t, o),
                        s = o.events;
                    if (s) {
                        delete a.handle, a.events = {};
                        for (n in s)
                            for (i = 0, r = s[n].length; r > i; i++) ut.event.add(t, n, s[n][i])
                    }
                    a.data && (a.data = ut.extend({}, a.data))
                }
            }

            function b(e, t) {
                var n, i, r;
                if (1 === t.nodeType) {
                    if (n = t.nodeName.toLowerCase(), !ut.support.noCloneEvent && t[ut.expando]) {
                        r = ut._data(t);
                        for (i in r.events) ut.removeEvent(t, i, r.handle);
                        t.removeAttribute(ut.expando)
                    }
                    "script" === n && t.text !== e.text ? (g(t).text = e.text, m(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), ut.support.html5Clone && e.innerHTML && !ut.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && tn.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
                }
            }

            function x(e, n) {
                var i, r, o = 0,
                    a = typeof e.getElementsByTagName !== V ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== V ? e.querySelectorAll(n || "*") : t;
                if (!a)
                    for (a = [], i = e.childNodes || e; null != (r = i[o]); o++) !n || ut.nodeName(r, n) ? a.push(r) : ut.merge(a, x(r, n));
                return n === t || n && ut.nodeName(e, n) ? ut.merge([e], a) : a
            }

            function w(e) {
                tn.test(e.type) && (e.defaultChecked = e.checked)
            }

            function k(e, t) {
                if (t in e) return t;
                for (var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, r = En.length; r--;)
                    if (t = En[r] + n, t in e) return t;
                return i
            }

            function T(e, t) {
                return e = t || e, "none" === ut.css(e, "display") || !ut.contains(e.ownerDocument, e)
            }

            function C(e, t) {
                for (var n, i, r, o = [], a = 0, s = e.length; s > a; a++) i = e[a], i.style && (o[a] = ut._data(i, "olddisplay"), n = i.style.display, t ? (o[a] || "none" !== n || (i.style.display = ""), "" === i.style.display && T(i) && (o[a] = ut._data(i, "olddisplay", S(i.nodeName)))) : o[a] || (r = T(i), (n && "none" !== n || !r) && ut._data(i, "olddisplay", r ? n : ut.css(i, "display"))));
                for (a = 0; s > a; a++) i = e[a], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? o[a] || "" : "none"));
                return e
            }

            function E(e, t, n) {
                var i = yn.exec(t);
                return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
            }

            function _(e, t, n, i, r) {
                for (var o = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > o; o += 2) "margin" === n && (a += ut.css(e, n + Cn[o], !0, r)), i ? ("content" === n && (a -= ut.css(e, "padding" + Cn[o], !0, r)), "margin" !== n && (a -= ut.css(e, "border" + Cn[o] + "Width", !0, r))) : (a += ut.css(e, "padding" + Cn[o], !0, r), "padding" !== n && (a += ut.css(e, "border" + Cn[o] + "Width", !0, r)));
                return a
            }

            function N(e, t, n) {
                var i = !0,
                    r = "width" === t ? e.offsetWidth : e.offsetHeight,
                    o = dn(e),
                    a = ut.support.boxSizing && "border-box" === ut.css(e, "boxSizing", !1, o);
                if (0 >= r || null == r) {
                    if (r = pn(e, t, o), (0 > r || null == r) && (r = e.style[t]), bn.test(r)) return r;
                    i = a && (ut.support.boxSizingReliable || r === e.style[t]), r = parseFloat(r) || 0
                }
                return r + _(e, t, n || (a ? "border" : "content"), i, o) + "px"
            }

            function S(e) {
                var t = Y,
                    n = wn[e];
                return n || (n = j(e, t), "none" !== n && n || (un = (un || ut("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), t = (un[0].contentWindow || un[0].contentDocument).document, t.write("<!doctype html><html><body>"), t.close(), n = j(e, t), un.detach()), wn[e] = n), n
            }

            function j(e, t) {
                var n = ut(t.createElement(e)).appendTo(t.body),
                    i = ut.css(n[0], "display");
                return n.remove(), i
            }

            function A(e, t, n, i) {
                var r;
                if (ut.isArray(t)) ut.each(t, function(t, r) {
                    n || Nn.test(e) ? i(e, r) : A(e + "[" + ("object" == typeof r ? t : "") + "]", r, n, i)
                });
                else if (n || "object" !== ut.type(t)) i(e, t);
                else
                    for (r in t) A(e + "[" + r + "]", t[r], n, i)
            }

            function L(e) {
                return function(t, n) {
                    "string" != typeof t && (n = t, t = "*");
                    var i, r = 0,
                        o = t.toLowerCase().match(pt) || [];
                    if (ut.isFunction(n))
                        for (; i = o[r++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
                }
            }

            function D(e, t, n, i) {
                function r(s) {
                    var l;
                    return o[s] = !0, ut.each(e[s] || [], function(e, s) {
                        var c = s(t, n, i);
                        return "string" != typeof c || a || o[c] ? a ? !(l = c) : void 0 : (t.dataTypes.unshift(c), r(c), !1)
                    }), l
                }
                var o = {},
                    a = e === Wn;
                return r(t.dataTypes[0]) || !o["*"] && r("*")
            }

            function H(e, n) {
                var i, r, o = ut.ajaxSettings.flatOptions || {};
                for (r in n) n[r] !== t && ((o[r] ? e : i || (i = {}))[r] = n[r]);
                return i && ut.extend(!0, e, i), e
            }

            function F(e, n, i) {
                for (var r, o, a, s, l = e.contents, c = e.dataTypes;
                    "*" === c[0];) c.shift(), o === t && (o = e.mimeType || n.getResponseHeader("Content-Type"));
                if (o)
                    for (s in l)
                        if (l[s] && l[s].test(o)) {
                            c.unshift(s);
                            break
                        }
                if (c[0] in i) a = c[0];
                else {
                    for (s in i) {
                        if (!c[0] || e.converters[s + " " + c[0]]) {
                            a = s;
                            break
                        }
                        r || (r = s)
                    }
                    a = a || r
                }
                return a ? (a !== c[0] && c.unshift(a), i[a]) : void 0
            }

            function M(e, t, n, i) {
                var r, o, a, s, l, c = {},
                    u = e.dataTypes.slice();
                if (u[1])
                    for (a in e.converters) c[a.toLowerCase()] = e.converters[a];
                for (o = u.shift(); o;)
                    if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = u.shift())
                        if ("*" === o) o = l;
                        else if ("*" !== l && l !== o) {
                    if (a = c[l + " " + o] || c["* " + o], !a)
                        for (r in c)
                            if (s = r.split(" "), s[1] === o && (a = c[l + " " + s[0]] || c["* " + s[0]])) {
                                a === !0 ? a = c[r] : c[r] !== !0 && (o = s[0], u.unshift(s[1]));
                                break
                            }
                    if (a !== !0)
                        if (a && e["throws"]) t = a(t);
                        else try {
                            t = a(t)
                        } catch (d) {
                            return {
                                state: "parsererror",
                                error: a ? d : "No conversion from " + l + " to " + o
                            }
                        }
                }
                return {
                    state: "success",
                    data: t
                }
            }

            function q() {
                try {
                    return new e.XMLHttpRequest
                } catch (t) {}
            }

            function R() {
                try {
                    return new e.ActiveXObject("Microsoft.XMLHTTP")
                } catch (t) {}
            }

            function O() {
                return setTimeout(function() {
                    Zn = t
                }), Zn = ut.now()
            }

            function $(e, t, n) {
                for (var i, r = (oi[t] || []).concat(oi["*"]), o = 0, a = r.length; a > o; o++)
                    if (i = r[o].call(n, t, e)) return i
            }

            function P(e, t, n) {
                var i, r, o = 0,
                    a = ri.length,
                    s = ut.Deferred().always(function() {
                        delete l.elem
                    }),
                    l = function() {
                        if (r) return !1;
                        for (var t = Zn || O(), n = Math.max(0, c.startTime + c.duration - t), i = n / c.duration || 0, o = 1 - i, a = 0, l = c.tweens.length; l > a; a++) c.tweens[a].run(o);
                        return s.notifyWith(e, [c, o, n]), 1 > o && l ? n : (s.resolveWith(e, [c]), !1)
                    },
                    c = s.promise({
                        elem: e,
                        props: ut.extend({}, t),
                        opts: ut.extend(!0, {
                            specialEasing: {}
                        }, n),
                        originalProperties: t,
                        originalOptions: n,
                        startTime: Zn || O(),
                        duration: n.duration,
                        tweens: [],
                        createTween: function(t, n) {
                            var i = ut.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                            return c.tweens.push(i), i
                        },
                        stop: function(t) {
                            var n = 0,
                                i = t ? c.tweens.length : 0;
                            if (r) return this;
                            for (r = !0; i > n; n++) c.tweens[n].run(1);
                            return t ? s.resolveWith(e, [c, t]) : s.rejectWith(e, [c, t]), this
                        }
                    }),
                    u = c.props;
                for (z(u, c.opts.specialEasing); a > o; o++)
                    if (i = ri[o].call(c, e, u, c.opts)) return i;
                return ut.map(u, $, c), ut.isFunction(c.opts.start) && c.opts.start.call(e, c), ut.fx.timer(ut.extend(l, {
                    elem: e,
                    anim: c,
                    queue: c.opts.queue
                })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
            }

            function z(e, t) {
                var n, i, r, o, a;
                for (n in e)
                    if (i = ut.camelCase(n), r = t[i], o = e[n], ut.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== i && (e[i] = o, delete e[n]), a = ut.cssHooks[i], a && "expand" in a) {
                        o = a.expand(o), delete e[i];
                        for (n in o) n in e || (e[n] = o[n], t[n] = r)
                    } else t[i] = r
            }

            function B(e, t, n) {
                var i, r, o, a, s, l, c = this,
                    u = {},
                    d = e.style,
                    p = e.nodeType && T(e),
                    f = ut._data(e, "fxshow");
                n.queue || (s = ut._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function() {
                    s.unqueued || l()
                }), s.unqueued++, c.always(function() {
                    c.always(function() {
                        s.unqueued--, ut.queue(e, "fx").length || s.empty.fire()
                    })
                })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [d.overflow, d.overflowX, d.overflowY], "inline" === ut.css(e, "display") && "none" === ut.css(e, "float") && (ut.support.inlineBlockNeedsLayout && "inline" !== S(e.nodeName) ? d.zoom = 1 : d.display = "inline-block")), n.overflow && (d.overflow = "hidden", ut.support.shrinkWrapBlocks || c.always(function() {
                    d.overflow = n.overflow[0], d.overflowX = n.overflow[1], d.overflowY = n.overflow[2]
                }));
                for (i in t)
                    if (r = t[i], ti.exec(r)) {
                        if (delete t[i], o = o || "toggle" === r, r === (p ? "hide" : "show")) continue;
                        u[i] = f && f[i] || ut.style(e, i)
                    }
                if (!ut.isEmptyObject(u)) {
                    f ? "hidden" in f && (p = f.hidden) : f = ut._data(e, "fxshow", {}), o && (f.hidden = !p), p ? ut(e).show() : c.done(function() {
                        ut(e).hide()
                    }), c.done(function() {
                        var t;
                        ut._removeData(e, "fxshow");
                        for (t in u) ut.style(e, t, u[t])
                    });
                    for (i in u) a = $(p ? f[i] : 0, i, c), i in f || (f[i] = a.start, p && (a.end = a.start, a.start = "width" === i || "height" === i ? 1 : 0))
                }
            }

            function I(e, t, n, i, r) {
                return new I.prototype.init(e, t, n, i, r)
            }

            function W(e, t) {
                var n, i = {
                        height: e
                    },
                    r = 0;
                for (t = t ? 1 : 0; 4 > r; r += 2 - t) n = Cn[r], i["margin" + n] = i["padding" + n] = e;
                return t && (i.opacity = i.width = e), i
            }

            function U(e) {
                return ut.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
            }
            var X, J, V = typeof t,
                K = e.location,
                Y = e.document,
                G = Y.documentElement,
                Q = e.jQuery,
                Z = e.$,
                et = {},
                tt = [],
                nt = "1.10.2",
                it = tt.concat,
                rt = tt.push,
                ot = tt.slice,
                at = tt.indexOf,
                st = et.toString,
                lt = et.hasOwnProperty,
                ct = nt.trim,
                ut = function(e, t) {
                    return new ut.fn.init(e, t, J)
                },
                dt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
                pt = /\S+/g,
                ft = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
                ht = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
                gt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
                mt = /^[\],:{}\s]*$/,
                vt = /(?:^|:|,)(?:\s*\[)+/g,
                yt = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
                bt = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
                xt = /^-ms-/,
                wt = /-([\da-z])/gi,
                kt = function(e, t) {
                    return t.toUpperCase()
                },
                Tt = function(e) {
                    (Y.addEventListener || "load" === e.type || "complete" === Y.readyState) && (Ct(), ut.ready())
                },
                Ct = function() {
                    Y.addEventListener ? (Y.removeEventListener("DOMContentLoaded", Tt, !1), e.removeEventListener("load", Tt, !1)) : (Y.detachEvent("onreadystatechange", Tt), e.detachEvent("onload", Tt))
                };
            ut.fn = ut.prototype = {
                    jquery: nt,
                    constructor: ut,
                    init: function(e, n, i) {
                        var r, o;
                        if (!e) return this;
                        if ("string" == typeof e) {
                            if (r = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : ht.exec(e), !r || !r[1] && n) return !n || n.jquery ? (n || i).find(e) : this.constructor(n).find(e);
                            if (r[1]) {
                                if (n = n instanceof ut ? n[0] : n, ut.merge(this, ut.parseHTML(r[1], n && n.nodeType ? n.ownerDocument || n : Y, !0)), gt.test(r[1]) && ut.isPlainObject(n))
                                    for (r in n) ut.isFunction(this[r]) ? this[r](n[r]) : this.attr(r, n[r]);
                                return this
                            }
                            if (o = Y.getElementById(r[2]), o && o.parentNode) {
                                if (o.id !== r[2]) return i.find(e);
                                this.length = 1, this[0] = o
                            }
                            return this.context = Y, this.selector = e, this
                        }
                        return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : ut.isFunction(e) ? i.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), ut.makeArray(e, this))
                    },
                    selector: "",
                    length: 0,
                    toArray: function() {
                        return ot.call(this)
                    },
                    get: function(e) {
                        return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e]
                    },
                    pushStack: function(e) {
                        var t = ut.merge(this.constructor(), e);
                        return t.prevObject = this, t.context = this.context, t
                    },
                    each: function(e, t) {
                        return ut.each(this, e, t)
                    },
                    ready: function(e) {
                        return ut.ready.promise().done(e), this
                    },
                    slice: function() {
                        return this.pushStack(ot.apply(this, arguments))
                    },
                    first: function() {
                        return this.eq(0)
                    },
                    last: function() {
                        return this.eq(-1)
                    },
                    eq: function(e) {
                        var t = this.length,
                            n = +e + (0 > e ? t : 0);
                        return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
                    },
                    map: function(e) {
                        return this.pushStack(ut.map(this, function(t, n) {
                            return e.call(t, n, t)
                        }))
                    },
                    end: function() {
                        return this.prevObject || this.constructor(null)
                    },
                    push: rt,
                    sort: [].sort,
                    splice: [].splice
                }, ut.fn.init.prototype = ut.fn, ut.extend = ut.fn.extend = function() {
                    var e, n, i, r, o, a, s = arguments[0] || {},
                        l = 1,
                        c = arguments.length,
                        u = !1;
                    for ("boolean" == typeof s && (u = s, s = arguments[1] || {}, l = 2), "object" == typeof s || ut.isFunction(s) || (s = {}), c === l && (s = this, --l); c > l; l++)
                        if (null != (o = arguments[l]))
                            for (r in o) e = s[r], i = o[r], s !== i && (u && i && (ut.isPlainObject(i) || (n = ut.isArray(i))) ? (n ? (n = !1, a = e && ut.isArray(e) ? e : []) : a = e && ut.isPlainObject(e) ? e : {}, s[r] = ut.extend(u, a, i)) : i !== t && (s[r] = i));
                    return s
                }, ut.extend({
                    expando: "jQuery" + (nt + Math.random()).replace(/\D/g, ""),
                    noConflict: function(t) {
                        return e.$ === ut && (e.$ = Z), t && e.jQuery === ut && (e.jQuery = Q), ut
                    },
                    isReady: !1,
                    readyWait: 1,
                    holdReady: function(e) {
                        e ? ut.readyWait++ : ut.ready(!0)
                    },
                    ready: function(e) {
                        if (e === !0 ? !--ut.readyWait : !ut.isReady) {
                            if (!Y.body) return setTimeout(ut.ready);
                            ut.isReady = !0, e !== !0 && --ut.readyWait > 0 || (X.resolveWith(Y, [ut]), ut.fn.trigger && ut(Y).trigger("ready").off("ready"))
                        }
                    },
                    isFunction: function(e) {
                        return "function" === ut.type(e)
                    },
                    isArray: Array.isArray || function(e) {
                        return "array" === ut.type(e)
                    },
                    isWindow: function(e) {
                        return null != e && e == e.window
                    },
                    isNumeric: function(e) {
                        return !isNaN(parseFloat(e)) && isFinite(e)
                    },
                    type: function(e) {
                        return null == e ? String(e) : "object" == typeof e || "function" == typeof e ? et[st.call(e)] || "object" : typeof e
                    },
                    isPlainObject: function(e) {
                        var n;
                        if (!e || "object" !== ut.type(e) || e.nodeType || ut.isWindow(e)) return !1;
                        try {
                            if (e.constructor && !lt.call(e, "constructor") && !lt.call(e.constructor.prototype, "isPrototypeOf")) return !1
                        } catch (i) {
                            return !1
                        }
                        if (ut.support.ownLast)
                            for (n in e) return lt.call(e, n);
                        for (n in e);
                        return n === t || lt.call(e, n)
                    },
                    isEmptyObject: function(e) {
                        var t;
                        for (t in e) return !1;
                        return !0
                    },
                    error: function(e) {
                        throw new Error(e)
                    },
                    parseHTML: function(e, t, n) {
                        if (!e || "string" != typeof e) return null;
                        "boolean" == typeof t && (n = t, t = !1), t = t || Y;
                        var i = gt.exec(e),
                            r = !n && [];
                        return i ? [t.createElement(i[1])] : (i = ut.buildFragment([e], t, r), r && ut(r).remove(), ut.merge([], i.childNodes))
                    },
                    parseJSON: function(t) {
                        return e.JSON && e.JSON.parse ? e.JSON.parse(t) : null === t ? t : "string" == typeof t && (t = ut.trim(t), t && mt.test(t.replace(yt, "@").replace(bt, "]").replace(vt, ""))) ? new Function("return " + t)() : void ut.error("Invalid JSON: " + t)
                    },
                    parseXML: function(n) {
                        var i, r;
                        if (!n || "string" != typeof n) return null;
                        try {
                            e.DOMParser ? (r = new DOMParser, i = r.parseFromString(n, "text/xml")) : (i = new ActiveXObject("Microsoft.XMLDOM"), i.async = "false", i.loadXML(n))
                        } catch (o) {
                            i = t
                        }
                        return i && i.documentElement && !i.getElementsByTagName("parsererror").length || ut.error("Invalid XML: " + n), i
                    },
                    noop: function() {},
                    globalEval: function(t) {
                        t && ut.trim(t) && (e.execScript || function(t) {
                            e.eval.call(e, t)
                        })(t)
                    },
                    camelCase: function(e) {
                        return e.replace(xt, "ms-").replace(wt, kt)
                    },
                    nodeName: function(e, t) {
                        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
                    },
                    each: function(e, t, i) {
                        var r, o = 0,
                            a = e.length,
                            s = n(e);
                        if (i) {
                            if (s)
                                for (; a > o && (r = t.apply(e[o], i), r !== !1); o++);
                            else
                                for (o in e)
                                    if (r = t.apply(e[o], i), r === !1) break
                        } else if (s)
                            for (; a > o && (r = t.call(e[o], o, e[o]), r !== !1); o++);
                        else
                            for (o in e)
                                if (r = t.call(e[o], o, e[o]), r === !1) break; return e
                    },
                    trim: ct && !ct.call("﻿ ") ? function(e) {
                        return null == e ? "" : ct.call(e)
                    } : function(e) {
                        return null == e ? "" : (e + "").replace(ft, "")
                    },
                    makeArray: function(e, t) {
                        var i = t || [];
                        return null != e && (n(Object(e)) ? ut.merge(i, "string" == typeof e ? [e] : e) : rt.call(i, e)), i
                    },
                    inArray: function(e, t, n) {
                        var i;
                        if (t) {
                            if (at) return at.call(t, e, n);
                            for (i = t.length, n = n ? 0 > n ? Math.max(0, i + n) : n : 0; i > n; n++)
                                if (n in t && t[n] === e) return n
                        }
                        return -1
                    },
                    merge: function(e, n) {
                        var i = n.length,
                            r = e.length,
                            o = 0;
                        if ("number" == typeof i)
                            for (; i > o; o++) e[r++] = n[o];
                        else
                            for (; n[o] !== t;) e[r++] = n[o++];
                        return e.length = r, e
                    },
                    grep: function(e, t, n) {
                        var i, r = [],
                            o = 0,
                            a = e.length;
                        for (n = !!n; a > o; o++) i = !!t(e[o], o), n !== i && r.push(e[o]);
                        return r
                    },
                    map: function(e, t, i) {
                        var r, o = 0,
                            a = e.length,
                            s = n(e),
                            l = [];
                        if (s)
                            for (; a > o; o++) r = t(e[o], o, i), null != r && (l[l.length] = r);
                        else
                            for (o in e) r = t(e[o], o, i), null != r && (l[l.length] = r);
                        return it.apply([], l)
                    },
                    guid: 1,
                    proxy: function(e, n) {
                        var i, r, o;
                        return "string" == typeof n && (o = e[n], n = e, e = o), ut.isFunction(e) ? (i = ot.call(arguments, 2), r = function() {
                            return e.apply(n || this, i.concat(ot.call(arguments)))
                        }, r.guid = e.guid = e.guid || ut.guid++, r) : t
                    },
                    access: function(e, n, i, r, o, a, s) {
                        var l = 0,
                            c = e.length,
                            u = null == i;
                        if ("object" === ut.type(i)) {
                            o = !0;
                            for (l in i) ut.access(e, n, l, i[l], !0, a, s)
                        } else if (r !== t && (o = !0, ut.isFunction(r) || (s = !0), u && (s ? (n.call(e, r), n = null) : (u = n, n = function(e, t, n) {
                                return u.call(ut(e), n)
                            })), n))
                            for (; c > l; l++) n(e[l], i, s ? r : r.call(e[l], l, n(e[l], i)));
                        return o ? e : u ? n.call(e) : c ? n(e[0], i) : a
                    },
                    now: function() {
                        return (new Date).getTime()
                    },
                    swap: function(e, t, n, i) {
                        var r, o, a = {};
                        for (o in t) a[o] = e.style[o], e.style[o] = t[o];
                        r = n.apply(e, i || []);
                        for (o in t) e.style[o] = a[o];
                        return r
                    }
                }), ut.ready.promise = function(t) {
                    if (!X)
                        if (X = ut.Deferred(), "complete" === Y.readyState) setTimeout(ut.ready);
                        else if (Y.addEventListener) Y.addEventListener("DOMContentLoaded", Tt, !1), e.addEventListener("load", Tt, !1);
                    else {
                        Y.attachEvent("onreadystatechange", Tt), e.attachEvent("onload", Tt);
                        var n = !1;
                        try {
                            n = null == e.frameElement && Y.documentElement
                        } catch (i) {}
                        n && n.doScroll && ! function r() {
                            if (!ut.isReady) {
                                try {
                                    n.doScroll("left")
                                } catch (e) {
                                    return setTimeout(r, 50)
                                }
                                Ct(), ut.ready()
                            }
                        }()
                    }
                    return X.promise(t)
                }, ut.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
                    et["[object " + t + "]"] = t.toLowerCase()
                }), J = ut(Y),
                function(e, t) {
                    function n(e, t, n, i) {
                        var r, o, a, s, l, c, u, d, h, g;
                        if ((t ? t.ownerDocument || t : P) !== D && L(t), t = t || D, n = n || [], !e || "string" != typeof e) return n;
                        if (1 !== (s = t.nodeType) && 9 !== s) return [];
                        if (F && !i) {
                            if (r = bt.exec(e))
                                if (a = r[1]) {
                                    if (9 === s) {
                                        if (o = t.getElementById(a), !o || !o.parentNode) return n;
                                        if (o.id === a) return n.push(o), n
                                    } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(a)) && O(t, o) && o.id === a) return n.push(o), n
                                } else {
                                    if (r[2]) return et.apply(n, t.getElementsByTagName(e)), n;
                                    if ((a = r[3]) && T.getElementsByClassName && t.getElementsByClassName) return et.apply(n, t.getElementsByClassName(a)), n
                                }
                            if (T.qsa && (!M || !M.test(e))) {
                                if (d = u = $, h = t, g = 9 === s && e, 1 === s && "object" !== t.nodeName.toLowerCase()) {
                                    for (c = p(e), (u = t.getAttribute("id")) ? d = u.replace(kt, "\\$&") : t.setAttribute("id", d), d = "[id='" + d + "'] ", l = c.length; l--;) c[l] = d + f(c[l]);
                                    h = ft.test(e) && t.parentNode || t, g = c.join(",")
                                }
                                if (g) try {
                                    return et.apply(n, h.querySelectorAll(g)), n
                                } catch (m) {} finally {
                                    u || t.removeAttribute("id")
                                }
                            }
                        }
                        return w(e.replace(ct, "$1"), t, n, i)
                    }

                    function i() {
                        function e(n, i) {
                            return t.push(n += " ") > E.cacheLength && delete e[t.shift()], e[n] = i
                        }
                        var t = [];
                        return e
                    }

                    function r(e) {
                        return e[$] = !0, e
                    }

                    function o(e) {
                        var t = D.createElement("div");
                        try {
                            return !!e(t)
                        } catch (n) {
                            return !1
                        } finally {
                            t.parentNode && t.parentNode.removeChild(t), t = null
                        }
                    }

                    function a(e, t) {
                        for (var n = e.split("|"), i = e.length; i--;) E.attrHandle[n[i]] = t
                    }

                    function s(e, t) {
                        var n = t && e,
                            i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || K) - (~e.sourceIndex || K);
                        if (i) return i;
                        if (n)
                            for (; n = n.nextSibling;)
                                if (n === t) return -1;
                        return e ? 1 : -1
                    }

                    function l(e) {
                        return function(t) {
                            var n = t.nodeName.toLowerCase();
                            return "input" === n && t.type === e
                        }
                    }

                    function c(e) {
                        return function(t) {
                            var n = t.nodeName.toLowerCase();
                            return ("input" === n || "button" === n) && t.type === e
                        }
                    }

                    function u(e) {
                        return r(function(t) {
                            return t = +t, r(function(n, i) {
                                for (var r, o = e([], n.length, t), a = o.length; a--;) n[r = o[a]] && (n[r] = !(i[r] = n[r]))
                            })
                        })
                    }

                    function d() {}

                    function p(e, t) {
                        var i, r, o, a, s, l, c, u = W[e + " "];
                        if (u) return t ? 0 : u.slice(0);
                        for (s = e, l = [], c = E.preFilter; s;) {
                            (!i || (r = dt.exec(s))) && (r && (s = s.slice(r[0].length) || s), l.push(o = [])), i = !1, (r = pt.exec(s)) && (i = r.shift(), o.push({
                                value: i,
                                type: r[0].replace(ct, " ")
                            }), s = s.slice(i.length));
                            for (a in E.filter) !(r = vt[a].exec(s)) || c[a] && !(r = c[a](r)) || (i = r.shift(), o.push({
                                value: i,
                                type: a,
                                matches: r
                            }), s = s.slice(i.length));
                            if (!i) break
                        }
                        return t ? s.length : s ? n.error(e) : W(e, l).slice(0)
                    }

                    function f(e) {
                        for (var t = 0, n = e.length, i = ""; n > t; t++) i += e[t].value;
                        return i
                    }

                    function h(e, t, n) {
                        var i = t.dir,
                            r = n && "parentNode" === i,
                            o = B++;
                        return t.first ? function(t, n, o) {
                            for (; t = t[i];)
                                if (1 === t.nodeType || r) return e(t, n, o)
                        } : function(t, n, a) {
                            var s, l, c, u = z + " " + o;
                            if (a) {
                                for (; t = t[i];)
                                    if ((1 === t.nodeType || r) && e(t, n, a)) return !0
                            } else
                                for (; t = t[i];)
                                    if (1 === t.nodeType || r)
                                        if (c = t[$] || (t[$] = {}), (l = c[i]) && l[0] === u) {
                                            if ((s = l[1]) === !0 || s === C) return s === !0
                                        } else if (l = c[i] = [u], l[1] = e(t, n, a) || C, l[1] === !0) return !0
                        }
                    }

                    function g(e) {
                        return e.length > 1 ? function(t, n, i) {
                            for (var r = e.length; r--;)
                                if (!e[r](t, n, i)) return !1;
                            return !0
                        } : e[0]
                    }

                    function m(e, t, n, i, r) {
                        for (var o, a = [], s = 0, l = e.length, c = null != t; l > s; s++)(o = e[s]) && (!n || n(o, i, r)) && (a.push(o), c && t.push(s));
                        return a
                    }

                    function v(e, t, n, i, o, a) {
                        return i && !i[$] && (i = v(i)), o && !o[$] && (o = v(o, a)), r(function(r, a, s, l) {
                            var c, u, d, p = [],
                                f = [],
                                h = a.length,
                                g = r || x(t || "*", s.nodeType ? [s] : s, []),
                                v = !e || !r && t ? g : m(g, p, e, s, l),
                                y = n ? o || (r ? e : h || i) ? [] : a : v;
                            if (n && n(v, y, s, l), i)
                                for (c = m(y, f), i(c, [], s, l), u = c.length; u--;)(d = c[u]) && (y[f[u]] = !(v[f[u]] = d));
                            if (r) {
                                if (o || e) {
                                    if (o) {
                                        for (c = [], u = y.length; u--;)(d = y[u]) && c.push(v[u] = d);
                                        o(null, y = [], c, l)
                                    }
                                    for (u = y.length; u--;)(d = y[u]) && (c = o ? nt.call(r, d) : p[u]) > -1 && (r[c] = !(a[c] = d))
                                }
                            } else y = m(y === a ? y.splice(h, y.length) : y), o ? o(null, a, y, l) : et.apply(a, y)
                        })
                    }

                    function y(e) {
                        for (var t, n, i, r = e.length, o = E.relative[e[0].type], a = o || E.relative[" "], s = o ? 1 : 0, l = h(function(e) {
                                return e === t
                            }, a, !0), c = h(function(e) {
                                return nt.call(t, e) > -1
                            }, a, !0), u = [function(e, n, i) {
                                return !o && (i || n !== j) || ((t = n).nodeType ? l(e, n, i) : c(e, n, i))
                            }]; r > s; s++)
                            if (n = E.relative[e[s].type]) u = [h(g(u), n)];
                            else {
                                if (n = E.filter[e[s].type].apply(null, e[s].matches), n[$]) {
                                    for (i = ++s; r > i && !E.relative[e[i].type]; i++);
                                    return v(s > 1 && g(u), s > 1 && f(e.slice(0, s - 1).concat({
                                        value: " " === e[s - 2].type ? "*" : ""
                                    })).replace(ct, "$1"), n, i > s && y(e.slice(s, i)), r > i && y(e = e.slice(i)), r > i && f(e))
                                }
                                u.push(n)
                            }
                        return g(u)
                    }

                    function b(e, t) {
                        var i = 0,
                            o = t.length > 0,
                            a = e.length > 0,
                            s = function(r, s, l, c, u) {
                                var d, p, f, h = [],
                                    g = 0,
                                    v = "0",
                                    y = r && [],
                                    b = null != u,
                                    x = j,
                                    w = r || a && E.find.TAG("*", u && s.parentNode || s),
                                    k = z += null == x ? 1 : Math.random() || .1;
                                for (b && (j = s !== D && s, C = i); null != (d = w[v]); v++) {
                                    if (a && d) {
                                        for (p = 0; f = e[p++];)
                                            if (f(d, s, l)) {
                                                c.push(d);
                                                break
                                            }
                                        b && (z = k, C = ++i)
                                    }
                                    o && ((d = !f && d) && g--, r && y.push(d))
                                }
                                if (g += v, o && v !== g) {
                                    for (p = 0; f = t[p++];) f(y, h, s, l);
                                    if (r) {
                                        if (g > 0)
                                            for (; v--;) y[v] || h[v] || (h[v] = Q.call(c));
                                        h = m(h)
                                    }
                                    et.apply(c, h), b && !r && h.length > 0 && g + t.length > 1 && n.uniqueSort(c)
                                }
                                return b && (z = k, j = x), y
                            };
                        return o ? r(s) : s
                    }

                    function x(e, t, i) {
                        for (var r = 0, o = t.length; o > r; r++) n(e, t[r], i);
                        return i
                    }

                    function w(e, t, n, i) {
                        var r, o, a, s, l, c = p(e);
                        if (!i && 1 === c.length) {
                            if (o = c[0] = c[0].slice(0), o.length > 2 && "ID" === (a = o[0]).type && T.getById && 9 === t.nodeType && F && E.relative[o[1].type]) {
                                if (t = (E.find.ID(a.matches[0].replace(Tt, Ct), t) || [])[0], !t) return n;
                                e = e.slice(o.shift().value.length)
                            }
                            for (r = vt.needsContext.test(e) ? 0 : o.length; r-- && (a = o[r], !E.relative[s = a.type]);)
                                if ((l = E.find[s]) && (i = l(a.matches[0].replace(Tt, Ct), ft.test(o[0].type) && t.parentNode || t))) {
                                    if (o.splice(r, 1), e = i.length && f(o), !e) return et.apply(n, i), n;
                                    break
                                }
                        }
                        return S(e, c)(i, t, !F, n, ft.test(e)), n
                    }
                    var k, T, C, E, _, N, S, j, A, L, D, H, F, M, q, R, O, $ = "sizzle" + -new Date,
                        P = e.document,
                        z = 0,
                        B = 0,
                        I = i(),
                        W = i(),
                        U = i(),
                        X = !1,
                        J = function(e, t) {
                            return e === t ? (X = !0, 0) : 0
                        },
                        V = typeof t,
                        K = 1 << 31,
                        Y = {}.hasOwnProperty,
                        G = [],
                        Q = G.pop,
                        Z = G.push,
                        et = G.push,
                        tt = G.slice,
                        nt = G.indexOf || function(e) {
                            for (var t = 0, n = this.length; n > t; t++)
                                if (this[t] === e) return t;
                            return -1
                        },
                        it = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                        rt = "[\\x20\\t\\r\\n\\f]",
                        ot = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                        at = ot.replace("w", "w#"),
                        st = "\\[" + rt + "*(" + ot + ")" + rt + "*(?:([*^$|!~]?=)" + rt + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + at + ")|)|)" + rt + "*\\]",
                        lt = ":(" + ot + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + st.replace(3, 8) + ")*)|.*)\\)|)",
                        ct = new RegExp("^" + rt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + rt + "+$", "g"),
                        dt = new RegExp("^" + rt + "*," + rt + "*"),
                        pt = new RegExp("^" + rt + "*([>+~]|" + rt + ")" + rt + "*"),
                        ft = new RegExp(rt + "*[+~]"),
                        ht = new RegExp("=" + rt + "*([^\\]'\"]*)" + rt + "*\\]", "g"),
                        gt = new RegExp(lt),
                        mt = new RegExp("^" + at + "$"),
                        vt = {
                            ID: new RegExp("^#(" + ot + ")"),
                            CLASS: new RegExp("^\\.(" + ot + ")"),
                            TAG: new RegExp("^(" + ot.replace("w", "w*") + ")"),
                            ATTR: new RegExp("^" + st),
                            PSEUDO: new RegExp("^" + lt),
                            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + rt + "*(even|odd|(([+-]|)(\\d*)n|)" + rt + "*(?:([+-]|)" + rt + "*(\\d+)|))" + rt + "*\\)|)", "i"),
                            bool: new RegExp("^(?:" + it + ")$", "i"),
                            needsContext: new RegExp("^" + rt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + rt + "*((?:-\\d)?\\d*)" + rt + "*\\)|)(?=[^-]|$)", "i")
                        },
                        yt = /^[^{]+\{\s*\[native \w/,
                        bt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                        xt = /^(?:input|select|textarea|button)$/i,
                        wt = /^h\d$/i,
                        kt = /'|\\/g,
                        Tt = new RegExp("\\\\([\\da-f]{1,6}" + rt + "?|(" + rt + ")|.)", "ig"),
                        Ct = function(e, t, n) {
                            var i = "0x" + t - 65536;
                            return i !== i || n ? t : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
                        };
                    try {
                        et.apply(G = tt.call(P.childNodes), P.childNodes), G[P.childNodes.length].nodeType
                    } catch (Et) {
                        et = {
                            apply: G.length ? function(e, t) {
                                Z.apply(e, tt.call(t))
                            } : function(e, t) {
                                for (var n = e.length, i = 0; e[n++] = t[i++];);
                                e.length = n - 1
                            }
                        }
                    }
                    N = n.isXML = function(e) {
                        var t = e && (e.ownerDocument || e).documentElement;
                        return t ? "HTML" !== t.nodeName : !1
                    }, T = n.support = {}, L = n.setDocument = function(e) {
                        var t = e ? e.ownerDocument || e : P,
                            n = t.defaultView;
                        return t !== D && 9 === t.nodeType && t.documentElement ? (D = t, H = t.documentElement, F = !N(t), n && n.attachEvent && n !== n.top && n.attachEvent("onbeforeunload", function() {
                            L()
                        }), T.attributes = o(function(e) {
                            return e.className = "i", !e.getAttribute("className")
                        }), T.getElementsByTagName = o(function(e) {
                            return e.appendChild(t.createComment("")), !e.getElementsByTagName("*").length
                        }), T.getElementsByClassName = o(function(e) {
                            return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
                        }), T.getById = o(function(e) {
                            return H.appendChild(e).id = $, !t.getElementsByName || !t.getElementsByName($).length
                        }), T.getById ? (E.find.ID = function(e, t) {
                            if (typeof t.getElementById !== V && F) {
                                var n = t.getElementById(e);
                                return n && n.parentNode ? [n] : []
                            }
                        }, E.filter.ID = function(e) {
                            var t = e.replace(Tt, Ct);
                            return function(e) {
                                return e.getAttribute("id") === t
                            }
                        }) : (delete E.find.ID, E.filter.ID = function(e) {
                            var t = e.replace(Tt, Ct);
                            return function(e) {
                                var n = typeof e.getAttributeNode !== V && e.getAttributeNode("id");
                                return n && n.value === t
                            }
                        }), E.find.TAG = T.getElementsByTagName ? function(e, t) {
                            return typeof t.getElementsByTagName !== V ? t.getElementsByTagName(e) : void 0
                        } : function(e, t) {
                            var n, i = [],
                                r = 0,
                                o = t.getElementsByTagName(e);
                            if ("*" === e) {
                                for (; n = o[r++];) 1 === n.nodeType && i.push(n);
                                return i
                            }
                            return o
                        }, E.find.CLASS = T.getElementsByClassName && function(e, t) {
                            return typeof t.getElementsByClassName !== V && F ? t.getElementsByClassName(e) : void 0
                        }, q = [], M = [], (T.qsa = yt.test(t.querySelectorAll)) && (o(function(e) {
                            e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || M.push("\\[" + rt + "*(?:value|" + it + ")"), e.querySelectorAll(":checked").length || M.push(":checked")
                        }), o(function(e) {
                            var n = t.createElement("input");
                            n.setAttribute("type", "hidden"), e.appendChild(n).setAttribute("t", ""), e.querySelectorAll("[t^='']").length && M.push("[*^$]=" + rt + "*(?:''|\"\")"), e.querySelectorAll(":enabled").length || M.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), M.push(",.*:")
                        })), (T.matchesSelector = yt.test(R = H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && o(function(e) {
                            T.disconnectedMatch = R.call(e, "div"), R.call(e, "[s!='']:x"), q.push("!=", lt)
                        }), M = M.length && new RegExp(M.join("|")), q = q.length && new RegExp(q.join("|")), O = yt.test(H.contains) || H.compareDocumentPosition ? function(e, t) {
                            var n = 9 === e.nodeType ? e.documentElement : e,
                                i = t && t.parentNode;
                            return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                        } : function(e, t) {
                            if (t)
                                for (; t = t.parentNode;)
                                    if (t === e) return !0;
                            return !1
                        }, J = H.compareDocumentPosition ? function(e, n) {
                            if (e === n) return X = !0, 0;
                            var i = n.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(n);
                            return i ? 1 & i || !T.sortDetached && n.compareDocumentPosition(e) === i ? e === t || O(P, e) ? -1 : n === t || O(P, n) ? 1 : A ? nt.call(A, e) - nt.call(A, n) : 0 : 4 & i ? -1 : 1 : e.compareDocumentPosition ? -1 : 1
                        } : function(e, n) {
                            var i, r = 0,
                                o = e.parentNode,
                                a = n.parentNode,
                                l = [e],
                                c = [n];
                            if (e === n) return X = !0, 0;
                            if (!o || !a) return e === t ? -1 : n === t ? 1 : o ? -1 : a ? 1 : A ? nt.call(A, e) - nt.call(A, n) : 0;
                            if (o === a) return s(e, n);
                            for (i = e; i = i.parentNode;) l.unshift(i);
                            for (i = n; i = i.parentNode;) c.unshift(i);
                            for (; l[r] === c[r];) r++;
                            return r ? s(l[r], c[r]) : l[r] === P ? -1 : c[r] === P ? 1 : 0
                        }, t) : D
                    }, n.matches = function(e, t) {
                        return n(e, null, null, t)
                    }, n.matchesSelector = function(e, t) {
                        if ((e.ownerDocument || e) !== D && L(e), t = t.replace(ht, "='$1']"), !(!T.matchesSelector || !F || q && q.test(t) || M && M.test(t))) try {
                            var i = R.call(e, t);
                            if (i || T.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
                        } catch (r) {}
                        return n(t, D, null, [e]).length > 0
                    }, n.contains = function(e, t) {
                        return (e.ownerDocument || e) !== D && L(e), O(e, t)
                    }, n.attr = function(e, n) {
                        (e.ownerDocument || e) !== D && L(e);
                        var i = E.attrHandle[n.toLowerCase()],
                            r = i && Y.call(E.attrHandle, n.toLowerCase()) ? i(e, n, !F) : t;
                        return r === t ? T.attributes || !F ? e.getAttribute(n) : (r = e.getAttributeNode(n)) && r.specified ? r.value : null : r
                    }, n.error = function(e) {
                        throw new Error("Syntax error, unrecognized expression: " + e)
                    }, n.uniqueSort = function(e) {
                        var t, n = [],
                            i = 0,
                            r = 0;
                        if (X = !T.detectDuplicates, A = !T.sortStable && e.slice(0), e.sort(J), X) {
                            for (; t = e[r++];) t === e[r] && (i = n.push(r));
                            for (; i--;) e.splice(n[i], 1)
                        }
                        return e
                    }, _ = n.getText = function(e) {
                        var t, n = "",
                            i = 0,
                            r = e.nodeType;
                        if (r) {
                            if (1 === r || 9 === r || 11 === r) {
                                if ("string" == typeof e.textContent) return e.textContent;
                                for (e = e.firstChild; e; e = e.nextSibling) n += _(e)
                            } else if (3 === r || 4 === r) return e.nodeValue
                        } else
                            for (; t = e[i]; i++) n += _(t);
                        return n
                    }, E = n.selectors = {
                        cacheLength: 50,
                        createPseudo: r,
                        match: vt,
                        attrHandle: {},
                        find: {},
                        relative: {
                            ">": {
                                dir: "parentNode",
                                first: !0
                            },
                            " ": {
                                dir: "parentNode"
                            },
                            "+": {
                                dir: "previousSibling",
                                first: !0
                            },
                            "~": {
                                dir: "previousSibling"
                            }
                        },
                        preFilter: {
                            ATTR: function(e) {
                                return e[1] = e[1].replace(Tt, Ct), e[3] = (e[4] || e[5] || "").replace(Tt, Ct), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                            },
                            CHILD: function(e) {
                                return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || n.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && n.error(e[0]), e
                            },
                            PSEUDO: function(e) {
                                var n, i = !e[5] && e[2];
                                return vt.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : i && gt.test(i) && (n = p(i, !0)) && (n = i.indexOf(")", i.length - n) - i.length) && (e[0] = e[0].slice(0, n), e[2] = i.slice(0, n)), e.slice(0, 3))
                            }
                        },
                        filter: {
                            TAG: function(e) {
                                var t = e.replace(Tt, Ct).toLowerCase();
                                return "*" === e ? function() {
                                    return !0
                                } : function(e) {
                                    return e.nodeName && e.nodeName.toLowerCase() === t
                                }
                            },
                            CLASS: function(e) {
                                var t = I[e + " "];
                                return t || (t = new RegExp("(^|" + rt + ")" + e + "(" + rt + "|$)")) && I(e, function(e) {
                                    return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== V && e.getAttribute("class") || "")
                                })
                            },
                            ATTR: function(e, t, i) {
                                return function(r) {
                                    var o = n.attr(r, e);
                                    return null == o ? "!=" === t : t ? (o += "", "=" === t ? o === i : "!=" === t ? o !== i : "^=" === t ? i && 0 === o.indexOf(i) : "*=" === t ? i && o.indexOf(i) > -1 : "$=" === t ? i && o.slice(-i.length) === i : "~=" === t ? (" " + o + " ").indexOf(i) > -1 : "|=" === t ? o === i || o.slice(0, i.length + 1) === i + "-" : !1) : !0
                                }
                            },
                            CHILD: function(e, t, n, i, r) {
                                var o = "nth" !== e.slice(0, 3),
                                    a = "last" !== e.slice(-4),
                                    s = "of-type" === t;
                                return 1 === i && 0 === r ? function(e) {
                                    return !!e.parentNode
                                } : function(t, n, l) {
                                    var c, u, d, p, f, h, g = o !== a ? "nextSibling" : "previousSibling",
                                        m = t.parentNode,
                                        v = s && t.nodeName.toLowerCase(),
                                        y = !l && !s;
                                    if (m) {
                                        if (o) {
                                            for (; g;) {
                                                for (d = t; d = d[g];)
                                                    if (s ? d.nodeName.toLowerCase() === v : 1 === d.nodeType) return !1;
                                                h = g = "only" === e && !h && "nextSibling"
                                            }
                                            return !0
                                        }
                                        if (h = [a ? m.firstChild : m.lastChild], a && y) {
                                            for (u = m[$] || (m[$] = {}), c = u[e] || [], f = c[0] === z && c[1], p = c[0] === z && c[2], d = f && m.childNodes[f]; d = ++f && d && d[g] || (p = f = 0) || h.pop();)
                                                if (1 === d.nodeType && ++p && d === t) {
                                                    u[e] = [z, f, p];
                                                    break
                                                }
                                        } else if (y && (c = (t[$] || (t[$] = {}))[e]) && c[0] === z) p = c[1];
                                        else
                                            for (;
                                                (d = ++f && d && d[g] || (p = f = 0) || h.pop()) && ((s ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++p || (y && ((d[$] || (d[$] = {}))[e] = [z, p]), d !== t)););
                                        return p -= r, p === i || p % i === 0 && p / i >= 0
                                    }
                                }
                            },
                            PSEUDO: function(e, t) {
                                var i, o = E.pseudos[e] || E.setFilters[e.toLowerCase()] || n.error("unsupported pseudo: " + e);
                                return o[$] ? o(t) : o.length > 1 ? (i = [e, e, "", t], E.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, n) {
                                    for (var i, r = o(e, t), a = r.length; a--;) i = nt.call(e, r[a]), e[i] = !(n[i] = r[a])
                                }) : function(e) {
                                    return o(e, 0, i)
                                }) : o
                            }
                        },
                        pseudos: {
                            not: r(function(e) {
                                var t = [],
                                    n = [],
                                    i = S(e.replace(ct, "$1"));
                                return i[$] ? r(function(e, t, n, r) {
                                    for (var o, a = i(e, null, r, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                                }) : function(e, r, o) {
                                    return t[0] = e, i(t, null, o, n), !n.pop()
                                }
                            }),
                            has: r(function(e) {
                                return function(t) {
                                    return n(e, t).length > 0
                                }
                            }),
                            contains: r(function(e) {
                                return function(t) {
                                    return (t.textContent || t.innerText || _(t)).indexOf(e) > -1
                                }
                            }),
                            lang: r(function(e) {
                                return mt.test(e || "") || n.error("unsupported lang: " + e), e = e.replace(Tt, Ct).toLowerCase(),
                                    function(t) {
                                        var n;
                                        do
                                            if (n = F ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                                        while ((t = t.parentNode) && 1 === t.nodeType);
                                        return !1
                                    }
                            }),
                            target: function(t) {
                                var n = e.location && e.location.hash;
                                return n && n.slice(1) === t.id
                            },
                            root: function(e) {
                                return e === H
                            },
                            focus: function(e) {
                                return e === D.activeElement && (!D.hasFocus || D.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                            },
                            enabled: function(e) {
                                return e.disabled === !1
                            },
                            disabled: function(e) {
                                return e.disabled === !0
                            },
                            checked: function(e) {
                                var t = e.nodeName.toLowerCase();
                                return "input" === t && !!e.checked || "option" === t && !!e.selected
                            },
                            selected: function(e) {
                                return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                            },
                            empty: function(e) {
                                for (e = e.firstChild; e; e = e.nextSibling)
                                    if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType) return !1;
                                return !0
                            },
                            parent: function(e) {
                                return !E.pseudos.empty(e)
                            },
                            header: function(e) {
                                return wt.test(e.nodeName)
                            },
                            input: function(e) {
                                return xt.test(e.nodeName)
                            },
                            button: function(e) {
                                var t = e.nodeName.toLowerCase();
                                return "input" === t && "button" === e.type || "button" === t
                            },
                            text: function(e) {
                                var t;
                                return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type)
                            },
                            first: u(function() {
                                return [0]
                            }),
                            last: u(function(e, t) {
                                return [t - 1]
                            }),
                            eq: u(function(e, t, n) {
                                return [0 > n ? n + t : n]
                            }),
                            even: u(function(e, t) {
                                for (var n = 0; t > n; n += 2) e.push(n);
                                return e
                            }),
                            odd: u(function(e, t) {
                                for (var n = 1; t > n; n += 2) e.push(n);
                                return e
                            }),
                            lt: u(function(e, t, n) {
                                for (var i = 0 > n ? n + t : n; --i >= 0;) e.push(i);
                                return e
                            }),
                            gt: u(function(e, t, n) {
                                for (var i = 0 > n ? n + t : n; ++i < t;) e.push(i);
                                return e
                            })
                        }
                    }, E.pseudos.nth = E.pseudos.eq;
                    for (k in {
                            radio: !0,
                            checkbox: !0,
                            file: !0,
                            password: !0,
                            image: !0
                        }) E.pseudos[k] = l(k);
                    for (k in {
                            submit: !0,
                            reset: !0
                        }) E.pseudos[k] = c(k);
                    d.prototype = E.filters = E.pseudos, E.setFilters = new d, S = n.compile = function(e, t) {
                        var n, i = [],
                            r = [],
                            o = U[e + " "];
                        if (!o) {
                            for (t || (t = p(e)), n = t.length; n--;) o = y(t[n]), o[$] ? i.push(o) : r.push(o);
                            o = U(e, b(r, i))
                        }
                        return o
                    }, T.sortStable = $.split("").sort(J).join("") === $, T.detectDuplicates = X, L(), T.sortDetached = o(function(e) {
                        return 1 & e.compareDocumentPosition(D.createElement("div"))
                    }), o(function(e) {
                        return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
                    }) || a("type|href|height|width", function(e, t, n) {
                        return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
                    }), T.attributes && o(function(e) {
                        return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
                    }) || a("value", function(e, t, n) {
                        return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
                    }), o(function(e) {
                        return null == e.getAttribute("disabled")
                    }) || a(it, function(e, t, n) {
                        var i;
                        return n ? void 0 : (i = e.getAttributeNode(t)) && i.specified ? i.value : e[t] === !0 ? t.toLowerCase() : null
                    }), ut.find = n, ut.expr = n.selectors, ut.expr[":"] = ut.expr.pseudos, ut.unique = n.uniqueSort, ut.text = n.getText, ut.isXMLDoc = n.isXML, ut.contains = n.contains
                }(e);
            var Et = {};
            ut.Callbacks = function(e) {
                e = "string" == typeof e ? Et[e] || i(e) : ut.extend({}, e);
                var n, r, o, a, s, l, c = [],
                    u = !e.once && [],
                    d = function(t) {
                        for (r = e.memory && t, o = !0, s = l || 0, l = 0, a = c.length, n = !0; c && a > s; s++)
                            if (c[s].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
                                r = !1;
                                break
                            }
                        n = !1, c && (u ? u.length && d(u.shift()) : r ? c = [] : p.disable())
                    },
                    p = {
                        add: function() {
                            if (c) {
                                var t = c.length;
                                ! function i(t) {
                                    ut.each(t, function(t, n) {
                                        var r = ut.type(n);
                                        "function" === r ? e.unique && p.has(n) || c.push(n) : n && n.length && "string" !== r && i(n)
                                    })
                                }(arguments), n ? a = c.length : r && (l = t, d(r))
                            }
                            return this
                        },
                        remove: function() {
                            return c && ut.each(arguments, function(e, t) {
                                for (var i;
                                    (i = ut.inArray(t, c, i)) > -1;) c.splice(i, 1), n && (a >= i && a--, s >= i && s--)
                            }), this
                        },
                        has: function(e) {
                            return e ? ut.inArray(e, c) > -1 : !(!c || !c.length)
                        },
                        empty: function() {
                            return c = [], a = 0, this
                        },
                        disable: function() {
                            return c = u = r = t, this
                        },
                        disabled: function() {
                            return !c
                        },
                        lock: function() {
                            return u = t, r || p.disable(), this
                        },
                        locked: function() {
                            return !u
                        },
                        fireWith: function(e, t) {
                            return !c || o && !u || (t = t || [], t = [e, t.slice ? t.slice() : t], n ? u.push(t) : d(t)), this
                        },
                        fire: function() {
                            return p.fireWith(this, arguments), this
                        },
                        fired: function() {
                            return !!o
                        }
                    };
                return p
            }, ut.extend({
                Deferred: function(e) {
                    var t = [
                            ["resolve", "done", ut.Callbacks("once memory"), "resolved"],
                            ["reject", "fail", ut.Callbacks("once memory"), "rejected"],
                            ["notify", "progress", ut.Callbacks("memory")]
                        ],
                        n = "pending",
                        i = {
                            state: function() {
                                return n
                            },
                            always: function() {
                                return r.done(arguments).fail(arguments), this
                            },
                            then: function() {
                                var e = arguments;
                                return ut.Deferred(function(n) {
                                    ut.each(t, function(t, o) {
                                        var a = o[0],
                                            s = ut.isFunction(e[t]) && e[t];
                                        r[o[1]](function() {
                                            var e = s && s.apply(this, arguments);
                                            e && ut.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + "With"](this === i ? n.promise() : this, s ? [e] : arguments)
                                        })
                                    }), e = null
                                }).promise()
                            },
                            promise: function(e) {
                                return null != e ? ut.extend(e, i) : i
                            }
                        },
                        r = {};
                    return i.pipe = i.then, ut.each(t, function(e, o) {
                        var a = o[2],
                            s = o[3];
                        i[o[1]] = a.add, s && a.add(function() {
                            n = s
                        }, t[1 ^ e][2].disable, t[2][2].lock), r[o[0]] = function() {
                            return r[o[0] + "With"](this === r ? i : this, arguments), this
                        }, r[o[0] + "With"] = a.fireWith
                    }), i.promise(r), e && e.call(r, r), r
                },
                when: function(e) {
                    var t, n, i, r = 0,
                        o = ot.call(arguments),
                        a = o.length,
                        s = 1 !== a || e && ut.isFunction(e.promise) ? a : 0,
                        l = 1 === s ? e : ut.Deferred(),
                        c = function(e, n, i) {
                            return function(r) {
                                n[e] = this, i[e] = arguments.length > 1 ? ot.call(arguments) : r, i === t ? l.notifyWith(n, i) : --s || l.resolveWith(n, i)
                            }
                        };
                    if (a > 1)
                        for (t = new Array(a), n = new Array(a), i = new Array(a); a > r; r++) o[r] && ut.isFunction(o[r].promise) ? o[r].promise().done(c(r, i, o)).fail(l.reject).progress(c(r, n, t)) : --s;
                    return s || l.resolveWith(i, o), l.promise()
                }
            }), ut.support = function(t) {
                var n, i, r, o, a, s, l, c, u, d = Y.createElement("div");
                if (d.setAttribute("className", "t"), d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = d.getElementsByTagName("*") || [], i = d.getElementsByTagName("a")[0], !i || !i.style || !n.length) return t;
                o = Y.createElement("select"), s = o.appendChild(Y.createElement("option")), r = d.getElementsByTagName("input")[0], i.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = "t" !== d.className, t.leadingWhitespace = 3 === d.firstChild.nodeType, t.tbody = !d.getElementsByTagName("tbody").length, t.htmlSerialize = !!d.getElementsByTagName("link").length, t.style = /top/.test(i.getAttribute("style")), t.hrefNormalized = "/a" === i.getAttribute("href"), t.opacity = /^0.5/.test(i.style.opacity), t.cssFloat = !!i.style.cssFloat, t.checkOn = !!r.value, t.optSelected = s.selected, t.enctype = !!Y.createElement("form").enctype, t.html5Clone = "<:nav></:nav>" !== Y.createElement("nav").cloneNode(!0).outerHTML, t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, r.checked = !0, t.noCloneChecked = r.cloneNode(!0).checked, o.disabled = !0, t.optDisabled = !s.disabled;
                try {
                    delete d.test
                } catch (p) {
                    t.deleteExpando = !1
                }
                r = Y.createElement("input"), r.setAttribute("value", ""), t.input = "" === r.getAttribute("value"), r.value = "t", r.setAttribute("type", "radio"), t.radioValue = "t" === r.value, r.setAttribute("checked", "t"), r.setAttribute("name", "t"), a = Y.createDocumentFragment(), a.appendChild(r), t.appendChecked = r.checked, t.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, d.attachEvent && (d.attachEvent("onclick", function() {
                    t.noCloneEvent = !1
                }), d.cloneNode(!0).click());
                for (u in {
                        submit: !0,
                        change: !0,
                        focusin: !0
                    }) d.setAttribute(l = "on" + u, "t"), t[u + "Bubbles"] = l in e || d.attributes[l].expando === !1;
                d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = "content-box" === d.style.backgroundClip;
                for (u in ut(t)) break;
                return t.ownLast = "0" !== u, ut(function() {
                    var n, i, r, o = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
                        a = Y.getElementsByTagName("body")[0];
                    a && (n = Y.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", a.appendChild(n).appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", r = d.getElementsByTagName("td"), r[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = 0 === r[0].offsetHeight, r[0].style.display = "", r[1].style.display = "none", t.reliableHiddenOffsets = c && 0 === r[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", ut.swap(a, null != a.style.zoom ? {
                        zoom: 1
                    } : {}, function() {
                        t.boxSizing = 4 === d.offsetWidth
                    }), e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(d, null) || {}).top, t.boxSizingReliable = "4px" === (e.getComputedStyle(d, null) || {
                        width: "4px"
                    }).width, i = d.appendChild(Y.createElement("div")), i.style.cssText = d.style.cssText = o, i.style.marginRight = i.style.width = "0", d.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(i, null) || {}).marginRight)), typeof d.style.zoom !== V && (d.innerHTML = "", d.style.cssText = o + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", t.shrinkWrapBlocks = 3 !== d.offsetWidth, t.inlineBlockNeedsLayout && (a.style.zoom = 1)), a.removeChild(n), n = d = r = i = null)
                }), n = o = a = s = i = r = null, t
            }({});
            var _t = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
                Nt = /([A-Z])/g;
            ut.extend({
                cache: {},
                noData: {
                    applet: !0,
                    embed: !0,
                    object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                },
                hasData: function(e) {
                    return e = e.nodeType ? ut.cache[e[ut.expando]] : e[ut.expando], !!e && !s(e)
                },
                data: function(e, t, n) {
                    return r(e, t, n)
                },
                removeData: function(e, t) {
                    return o(e, t)
                },
                _data: function(e, t, n) {
                    return r(e, t, n, !0)
                },
                _removeData: function(e, t) {
                    return o(e, t, !0)
                },
                acceptData: function(e) {
                    if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType) return !1;
                    var t = e.nodeName && ut.noData[e.nodeName.toLowerCase()];
                    return !t || t !== !0 && e.getAttribute("classid") === t
                }
            }), ut.fn.extend({
                data: function(e, n) {
                    var i, r, o = null,
                        s = 0,
                        l = this[0];
                    if (e === t) {
                        if (this.length && (o = ut.data(l), 1 === l.nodeType && !ut._data(l, "parsedAttrs"))) {
                            for (i = l.attributes; s < i.length; s++) r = i[s].name, 0 === r.indexOf("data-") && (r = ut.camelCase(r.slice(5)), a(l, r, o[r]));
                            ut._data(l, "parsedAttrs", !0)
                        }
                        return o
                    }
                    return "object" == typeof e ? this.each(function() {
                        ut.data(this, e)
                    }) : arguments.length > 1 ? this.each(function() {
                        ut.data(this, e, n)
                    }) : l ? a(l, e, ut.data(l, e)) : null
                },
                removeData: function(e) {
                    return this.each(function() {
                        ut.removeData(this, e)
                    })
                }
            }), ut.extend({
                queue: function(e, t, n) {
                    var i;
                    return e ? (t = (t || "fx") + "queue", i = ut._data(e, t), n && (!i || ut.isArray(n) ? i = ut._data(e, t, ut.makeArray(n)) : i.push(n)), i || []) : void 0
                },
                dequeue: function(e, t) {
                    t = t || "fx";
                    var n = ut.queue(e, t),
                        i = n.length,
                        r = n.shift(),
                        o = ut._queueHooks(e, t),
                        a = function() {
                            ut.dequeue(e, t)
                        };
                    "inprogress" === r && (r = n.shift(), i--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, a, o)), !i && o && o.empty.fire()
                },
                _queueHooks: function(e, t) {
                    var n = t + "queueHooks";
                    return ut._data(e, n) || ut._data(e, n, {
                        empty: ut.Callbacks("once memory").add(function() {
                            ut._removeData(e, t + "queue"), ut._removeData(e, n)
                        })
                    })
                }
            }), ut.fn.extend({
                queue: function(e, n) {
                    var i = 2;
                    return "string" != typeof e && (n = e, e = "fx", i--), arguments.length < i ? ut.queue(this[0], e) : n === t ? this : this.each(function() {
                        var t = ut.queue(this, e, n);
                        ut._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && ut.dequeue(this, e)
                    })
                },
                dequeue: function(e) {
                    return this.each(function() {
                        ut.dequeue(this, e)
                    })
                },
                delay: function(e, t) {
                    return e = ut.fx ? ut.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                        var i = setTimeout(t, e);
                        n.stop = function() {
                            clearTimeout(i)
                        }
                    })
                },
                clearQueue: function(e) {
                    return this.queue(e || "fx", [])
                },
                promise: function(e, n) {
                    var i, r = 1,
                        o = ut.Deferred(),
                        a = this,
                        s = this.length,
                        l = function() {
                            --r || o.resolveWith(a, [a])
                        };
                    for ("string" != typeof e && (n = e, e = t), e = e || "fx"; s--;) i = ut._data(a[s], e + "queueHooks"), i && i.empty && (r++, i.empty.add(l));
                    return l(), o.promise(n)
                }
            });
            var St, jt, At = /[\t\r\n\f]/g,
                Lt = /\r/g,
                Dt = /^(?:input|select|textarea|button|object)$/i,
                Ht = /^(?:a|area)$/i,
                Ft = /^(?:checked|selected)$/i,
                Mt = ut.support.getSetAttribute,
                qt = ut.support.input;
            ut.fn.extend({
                attr: function(e, t) {
                    return ut.access(this, ut.attr, e, t, arguments.length > 1)
                },
                removeAttr: function(e) {
                    return this.each(function() {
                        ut.removeAttr(this, e)
                    })
                },
                prop: function(e, t) {
                    return ut.access(this, ut.prop, e, t, arguments.length > 1)
                },
                removeProp: function(e) {
                    return e = ut.propFix[e] || e, this.each(function() {
                        try {
                            this[e] = t, delete this[e]
                        } catch (n) {}
                    })
                },
                addClass: function(e) {
                    var t, n, i, r, o, a = 0,
                        s = this.length,
                        l = "string" == typeof e && e;
                    if (ut.isFunction(e)) return this.each(function(t) {
                        ut(this).addClass(e.call(this, t, this.className))
                    });
                    if (l)
                        for (t = (e || "").match(pt) || []; s > a; a++)
                            if (n = this[a], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(At, " ") : " ")) {
                                for (o = 0; r = t[o++];) i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                                n.className = ut.trim(i)
                            }
                    return this
                },
                removeClass: function(e) {
                    var t, n, i, r, o, a = 0,
                        s = this.length,
                        l = 0 === arguments.length || "string" == typeof e && e;
                    if (ut.isFunction(e)) return this.each(function(t) {
                        ut(this).removeClass(e.call(this, t, this.className))
                    });
                    if (l)
                        for (t = (e || "").match(pt) || []; s > a; a++)
                            if (n = this[a], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(At, " ") : "")) {
                                for (o = 0; r = t[o++];)
                                    for (; i.indexOf(" " + r + " ") >= 0;) i = i.replace(" " + r + " ", " ");
                                n.className = e ? ut.trim(i) : ""
                            }
                    return this
                },
                toggleClass: function(e, t) {
                    var n = typeof e;
                    return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(ut.isFunction(e) ? function(n) {
                        ut(this).toggleClass(e.call(this, n, this.className, t), t)
                    } : function() {
                        if ("string" === n)
                            for (var t, i = 0, r = ut(this), o = e.match(pt) || []; t = o[i++];) r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                        else(n === V || "boolean" === n) && (this.className && ut._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : ut._data(this, "__className__") || "")
                    })
                },
                hasClass: function(e) {
                    for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
                        if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(At, " ").indexOf(t) >= 0) return !0;
                    return !1
                },
                val: function(e) {
                    var n, i, r, o = this[0]; {
                        if (arguments.length) return r = ut.isFunction(e), this.each(function(n) {
                            var o;
                            1 === this.nodeType && (o = r ? e.call(this, n, ut(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : ut.isArray(o) && (o = ut.map(o, function(e) {
                                return null == e ? "" : e + ""
                            })), i = ut.valHooks[this.type] || ut.valHooks[this.nodeName.toLowerCase()], i && "set" in i && i.set(this, o, "value") !== t || (this.value = o))
                        });
                        if (o) return i = ut.valHooks[o.type] || ut.valHooks[o.nodeName.toLowerCase()], i && "get" in i && (n = i.get(o, "value")) !== t ? n : (n = o.value, "string" == typeof n ? n.replace(Lt, "") : null == n ? "" : n)
                    }
                }
            }), ut.extend({
                valHooks: {
                    option: {
                        get: function(e) {
                            var t = ut.find.attr(e, "value");
                            return null != t ? t : e.text
                        }
                    },
                    select: {
                        get: function(e) {
                            for (var t, n, i = e.options, r = e.selectedIndex, o = "select-one" === e.type || 0 > r, a = o ? null : [], s = o ? r + 1 : i.length, l = 0 > r ? s : o ? r : 0; s > l; l++)
                                if (n = i[l], !(!n.selected && l !== r || (ut.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && ut.nodeName(n.parentNode, "optgroup"))) {
                                    if (t = ut(n).val(), o) return t;
                                    a.push(t)
                                }
                            return a
                        },
                        set: function(e, t) {
                            for (var n, i, r = e.options, o = ut.makeArray(t), a = r.length; a--;) i = r[a], (i.selected = ut.inArray(ut(i).val(), o) >= 0) && (n = !0);
                            return n || (e.selectedIndex = -1), o
                        }
                    }
                },
                attr: function(e, n, i) {
                    var r, o, a = e.nodeType;
                    if (e && 3 !== a && 8 !== a && 2 !== a) return typeof e.getAttribute === V ? ut.prop(e, n, i) : (1 === a && ut.isXMLDoc(e) || (n = n.toLowerCase(), r = ut.attrHooks[n] || (ut.expr.match.bool.test(n) ? jt : St)), i === t ? r && "get" in r && null !== (o = r.get(e, n)) ? o : (o = ut.find.attr(e, n), null == o ? t : o) : null !== i ? r && "set" in r && (o = r.set(e, i, n)) !== t ? o : (e.setAttribute(n, i + ""), i) : void ut.removeAttr(e, n))
                },
                removeAttr: function(e, t) {
                    var n, i, r = 0,
                        o = t && t.match(pt);
                    if (o && 1 === e.nodeType)
                        for (; n = o[r++];) i = ut.propFix[n] || n, ut.expr.match.bool.test(n) ? qt && Mt || !Ft.test(n) ? e[i] = !1 : e[ut.camelCase("default-" + n)] = e[i] = !1 : ut.attr(e, n, ""), e.removeAttribute(Mt ? n : i)
                },
                attrHooks: {
                    type: {
                        set: function(e, t) {
                            if (!ut.support.radioValue && "radio" === t && ut.nodeName(e, "input")) {
                                var n = e.value;
                                return e.setAttribute("type", t), n && (e.value = n), t
                            }
                        }
                    }
                },
                propFix: {
                    "for": "htmlFor",
                    "class": "className"
                },
                prop: function(e, n, i) {
                    var r, o, a, s = e.nodeType;
                    if (e && 3 !== s && 8 !== s && 2 !== s) return a = 1 !== s || !ut.isXMLDoc(e), a && (n = ut.propFix[n] || n, o = ut.propHooks[n]), i !== t ? o && "set" in o && (r = o.set(e, i, n)) !== t ? r : e[n] = i : o && "get" in o && null !== (r = o.get(e, n)) ? r : e[n]
                },
                propHooks: {
                    tabIndex: {
                        get: function(e) {
                            var t = ut.find.attr(e, "tabindex");
                            return t ? parseInt(t, 10) : Dt.test(e.nodeName) || Ht.test(e.nodeName) && e.href ? 0 : -1
                        }
                    }
                }
            }), jt = {
                set: function(e, t, n) {
                    return t === !1 ? ut.removeAttr(e, n) : qt && Mt || !Ft.test(n) ? e.setAttribute(!Mt && ut.propFix[n] || n, n) : e[ut.camelCase("default-" + n)] = e[n] = !0, n
                }
            }, ut.each(ut.expr.match.bool.source.match(/\w+/g), function(e, n) {
                var i = ut.expr.attrHandle[n] || ut.find.attr;
                ut.expr.attrHandle[n] = qt && Mt || !Ft.test(n) ? function(e, n, r) {
                    var o = ut.expr.attrHandle[n],
                        a = r ? t : (ut.expr.attrHandle[n] = t) != i(e, n, r) ? n.toLowerCase() : null;
                    return ut.expr.attrHandle[n] = o, a
                } : function(e, n, i) {
                    return i ? t : e[ut.camelCase("default-" + n)] ? n.toLowerCase() : null
                }
            }), qt && Mt || (ut.attrHooks.value = {
                set: function(e, t, n) {
                    return ut.nodeName(e, "input") ? void(e.defaultValue = t) : St && St.set(e, t, n)
                }
            }), Mt || (St = {
                set: function(e, n, i) {
                    var r = e.getAttributeNode(i);
                    return r || e.setAttributeNode(r = e.ownerDocument.createAttribute(i)), r.value = n += "", "value" === i || n === e.getAttribute(i) ? n : t
                }
            }, ut.expr.attrHandle.id = ut.expr.attrHandle.name = ut.expr.attrHandle.coords = function(e, n, i) {
                var r;
                return i ? t : (r = e.getAttributeNode(n)) && "" !== r.value ? r.value : null
            }, ut.valHooks.button = {
                get: function(e, n) {
                    var i = e.getAttributeNode(n);
                    return i && i.specified ? i.value : t
                },
                set: St.set
            }, ut.attrHooks.contenteditable = {
                set: function(e, t, n) {
                    St.set(e, "" === t ? !1 : t, n)
                }
            }, ut.each(["width", "height"], function(e, t) {
                ut.attrHooks[t] = {
                    set: function(e, n) {
                        return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
                    }
                }
            })), ut.support.hrefNormalized || ut.each(["href", "src"], function(e, t) {
                ut.propHooks[t] = {
                    get: function(e) {
                        return e.getAttribute(t, 4)
                    }
                }
            }), ut.support.style || (ut.attrHooks.style = {
                get: function(e) {
                    return e.style.cssText || t
                },
                set: function(e, t) {
                    return e.style.cssText = t + ""
                }
            }), ut.support.optSelected || (ut.propHooks.selected = {
                get: function(e) {
                    var t = e.parentNode;
                    return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
                }
            }), ut.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                ut.propFix[this.toLowerCase()] = this
            }), ut.support.enctype || (ut.propFix.enctype = "encoding"), ut.each(["radio", "checkbox"], function() {
                ut.valHooks[this] = {
                    set: function(e, t) {
                        return ut.isArray(t) ? e.checked = ut.inArray(ut(e).val(), t) >= 0 : void 0
                    }
                }, ut.support.checkOn || (ut.valHooks[this].get = function(e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                })
            });
            var Rt = /^(?:input|select|textarea)$/i,
                Ot = /^key/,
                $t = /^(?:mouse|contextmenu)|click/,
                Pt = /^(?:focusinfocus|focusoutblur)$/,
                zt = /^([^.]*)(?:\.(.+)|)$/;
            ut.event = {
                global: {},
                add: function(e, n, i, r, o) {
                    var a, s, l, c, u, d, p, f, h, g, m, v = ut._data(e);
                    if (v) {
                        for (i.handler && (c = i, i = c.handler, o = c.selector), i.guid || (i.guid = ut.guid++), (s = v.events) || (s = v.events = {}), (d = v.handle) || (d = v.handle = function(e) {
                                return typeof ut === V || e && ut.event.triggered === e.type ? t : ut.event.dispatch.apply(d.elem, arguments)
                            }, d.elem = e), n = (n || "").match(pt) || [""], l = n.length; l--;) a = zt.exec(n[l]) || [], h = m = a[1], g = (a[2] || "").split(".").sort(), h && (u = ut.event.special[h] || {}, h = (o ? u.delegateType : u.bindType) || h, u = ut.event.special[h] || {}, p = ut.extend({
                            type: h,
                            origType: m,
                            data: r,
                            handler: i,
                            guid: i.guid,
                            selector: o,
                            needsContext: o && ut.expr.match.needsContext.test(o),
                            namespace: g.join(".")
                        }, c), (f = s[h]) || (f = s[h] = [], f.delegateCount = 0, u.setup && u.setup.call(e, r, g, d) !== !1 || (e.addEventListener ? e.addEventListener(h, d, !1) : e.attachEvent && e.attachEvent("on" + h, d))), u.add && (u.add.call(e, p), p.handler.guid || (p.handler.guid = i.guid)), o ? f.splice(f.delegateCount++, 0, p) : f.push(p), ut.event.global[h] = !0);
                        e = null
                    }
                },
                remove: function(e, t, n, i, r) {
                    var o, a, s, l, c, u, d, p, f, h, g, m = ut.hasData(e) && ut._data(e);
                    if (m && (u = m.events)) {
                        for (t = (t || "").match(pt) || [""], c = t.length; c--;)
                            if (s = zt.exec(t[c]) || [], f = g = s[1], h = (s[2] || "").split(".").sort(), f) {
                                for (d = ut.event.special[f] || {}, f = (i ? d.delegateType : d.bindType) || f, p = u[f] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = p.length; o--;) a = p[o], !r && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || i && i !== a.selector && ("**" !== i || !a.selector) || (p.splice(o, 1), a.selector && p.delegateCount--, d.remove && d.remove.call(e, a));
                                l && !p.length && (d.teardown && d.teardown.call(e, h, m.handle) !== !1 || ut.removeEvent(e, f, m.handle), delete u[f])
                            } else
                                for (f in u) ut.event.remove(e, f + t[c], n, i, !0);
                        ut.isEmptyObject(u) && (delete m.handle, ut._removeData(e, "events"))
                    }
                },
                trigger: function(n, i, r, o) {
                    var a, s, l, c, u, d, p, f = [r || Y],
                        h = lt.call(n, "type") ? n.type : n,
                        g = lt.call(n, "namespace") ? n.namespace.split(".") : [];
                    if (l = d = r = r || Y, 3 !== r.nodeType && 8 !== r.nodeType && !Pt.test(h + ut.event.triggered) && (h.indexOf(".") >= 0 && (g = h.split("."), h = g.shift(), g.sort()), s = h.indexOf(":") < 0 && "on" + h, n = n[ut.expando] ? n : new ut.Event(h, "object" == typeof n && n), n.isTrigger = o ? 2 : 3, n.namespace = g.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = r), i = null == i ? [n] : ut.makeArray(i, [n]), u = ut.event.special[h] || {}, o || !u.trigger || u.trigger.apply(r, i) !== !1)) {
                        if (!o && !u.noBubble && !ut.isWindow(r)) {
                            for (c = u.delegateType || h, Pt.test(c + h) || (l = l.parentNode); l; l = l.parentNode) f.push(l), d = l;
                            d === (r.ownerDocument || Y) && f.push(d.defaultView || d.parentWindow || e)
                        }
                        for (p = 0;
                            (l = f[p++]) && !n.isPropagationStopped();) n.type = p > 1 ? c : u.bindType || h, a = (ut._data(l, "events") || {})[n.type] && ut._data(l, "handle"), a && a.apply(l, i), a = s && l[s], a && ut.acceptData(l) && a.apply && a.apply(l, i) === !1 && n.preventDefault();
                        if (n.type = h, !o && !n.isDefaultPrevented() && (!u._default || u._default.apply(f.pop(), i) === !1) && ut.acceptData(r) && s && r[h] && !ut.isWindow(r)) {
                            d = r[s], d && (r[s] = null), ut.event.triggered = h;
                            try {
                                r[h]()
                            } catch (m) {}
                            ut.event.triggered = t, d && (r[s] = d)
                        }
                        return n.result
                    }
                },
                dispatch: function(e) {
                    e = ut.event.fix(e);
                    var n, i, r, o, a, s = [],
                        l = ot.call(arguments),
                        c = (ut._data(this, "events") || {})[e.type] || [],
                        u = ut.event.special[e.type] || {};
                    if (l[0] = e, e.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, e) !== !1) {
                        for (s = ut.event.handlers.call(this, e, c), n = 0;
                            (o = s[n++]) && !e.isPropagationStopped();)
                            for (e.currentTarget = o.elem, a = 0;
                                (r = o.handlers[a++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(r.namespace)) && (e.handleObj = r, e.data = r.data, i = ((ut.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, l), i !== t && (e.result = i) === !1 && (e.preventDefault(), e.stopPropagation()));
                        return u.postDispatch && u.postDispatch.call(this, e), e.result
                    }
                },
                handlers: function(e, n) {
                    var i, r, o, a, s = [],
                        l = n.delegateCount,
                        c = e.target;
                    if (l && c.nodeType && (!e.button || "click" !== e.type))
                        for (; c != this; c = c.parentNode || this)
                            if (1 === c.nodeType && (c.disabled !== !0 || "click" !== e.type)) {
                                for (o = [], a = 0; l > a; a++) r = n[a], i = r.selector + " ", o[i] === t && (o[i] = r.needsContext ? ut(i, this).index(c) >= 0 : ut.find(i, this, null, [c]).length), o[i] && o.push(r);
                                o.length && s.push({
                                    elem: c,
                                    handlers: o
                                })
                            }
                    return l < n.length && s.push({
                        elem: this,
                        handlers: n.slice(l)
                    }), s
                },
                fix: function(e) {
                    if (e[ut.expando]) return e;
                    var t, n, i, r = e.type,
                        o = e,
                        a = this.fixHooks[r];
                    for (a || (this.fixHooks[r] = a = $t.test(r) ? this.mouseHooks : Ot.test(r) ? this.keyHooks : {}), i = a.props ? this.props.concat(a.props) : this.props, e = new ut.Event(o), t = i.length; t--;) n = i[t], e[n] = o[n];
                    return e.target || (e.target = o.srcElement || Y), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, a.filter ? a.filter(e, o) : e
                },
                props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                fixHooks: {},
                keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function(e, t) {
                        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
                    }
                },
                mouseHooks: {
                    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                    filter: function(e, n) {
                        var i, r, o, a = n.button,
                            s = n.fromElement;
                        return null == e.pageX && null != n.clientX && (r = e.target.ownerDocument || Y, o = r.documentElement, i = r.body, e.pageX = n.clientX + (o && o.scrollLeft || i && i.scrollLeft || 0) - (o && o.clientLeft || i && i.clientLeft || 0), e.pageY = n.clientY + (o && o.scrollTop || i && i.scrollTop || 0) - (o && o.clientTop || i && i.clientTop || 0)), !e.relatedTarget && s && (e.relatedTarget = s === e.target ? n.toElement : s), e.which || a === t || (e.which = 1 & a ? 1 : 2 & a ? 3 : 4 & a ? 2 : 0), e
                    }
                },
                special: {
                    load: {
                        noBubble: !0
                    },
                    focus: {
                        trigger: function() {
                            if (this !== u() && this.focus) try {
                                return this.focus(), !1
                            } catch (e) {}
                        },
                        delegateType: "focusin"
                    },
                    blur: {
                        trigger: function() {
                            return this === u() && this.blur ? (this.blur(), !1) : void 0
                        },
                        delegateType: "focusout"
                    },
                    click: {
                        trigger: function() {
                            return ut.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                        },
                        _default: function(e) {
                            return ut.nodeName(e.target, "a")
                        }
                    },
                    beforeunload: {
                        postDispatch: function(e) {
                            e.result !== t && (e.originalEvent.returnValue = e.result)
                        }
                    }
                },
                simulate: function(e, t, n, i) {
                    var r = ut.extend(new ut.Event, n, {
                        type: e,
                        isSimulated: !0,
                        originalEvent: {}
                    });
                    i ? ut.event.trigger(r, null, t) : ut.event.dispatch.call(t, r), r.isDefaultPrevented() && n.preventDefault()
                }
            }, ut.removeEvent = Y.removeEventListener ? function(e, t, n) {
                e.removeEventListener && e.removeEventListener(t, n, !1)
            } : function(e, t, n) {
                var i = "on" + t;
                e.detachEvent && (typeof e[i] === V && (e[i] = null), e.detachEvent(i, n))
            }, ut.Event = function(e, t) {
                return this instanceof ut.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? l : c) : this.type = e, t && ut.extend(this, t), this.timeStamp = e && e.timeStamp || ut.now(), void(this[ut.expando] = !0)) : new ut.Event(e, t)
            }, ut.Event.prototype = {
                isDefaultPrevented: c,
                isPropagationStopped: c,
                isImmediatePropagationStopped: c,
                preventDefault: function() {
                    var e = this.originalEvent;
                    this.isDefaultPrevented = l, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
                },
                stopPropagation: function() {
                    var e = this.originalEvent;
                    this.isPropagationStopped = l, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
                },
                stopImmediatePropagation: function() {
                    this.isImmediatePropagationStopped = l, this.stopPropagation()
                }
            }, ut.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            }, function(e, t) {
                ut.event.special[e] = {
                    delegateType: t,
                    bindType: t,
                    handle: function(e) {
                        var n, i = this,
                            r = e.relatedTarget,
                            o = e.handleObj;
                        return (!r || r !== i && !ut.contains(i, r)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
                    }
                }
            }), ut.support.submitBubbles || (ut.event.special.submit = {
                setup: function() {
                    return ut.nodeName(this, "form") ? !1 : void ut.event.add(this, "click._submit keypress._submit", function(e) {
                        var n = e.target,
                            i = ut.nodeName(n, "input") || ut.nodeName(n, "button") ? n.form : t;
                        i && !ut._data(i, "submitBubbles") && (ut.event.add(i, "submit._submit", function(e) {
                            e._submit_bubble = !0
                        }), ut._data(i, "submitBubbles", !0))
                    })
                },
                postDispatch: function(e) {
                    e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && ut.event.simulate("submit", this.parentNode, e, !0))
                },
                teardown: function() {
                    return ut.nodeName(this, "form") ? !1 : void ut.event.remove(this, "._submit")
                }
            }), ut.support.changeBubbles || (ut.event.special.change = {
                setup: function() {
                    return Rt.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ut.event.add(this, "propertychange._change", function(e) {
                        "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
                    }), ut.event.add(this, "click._change", function(e) {
                        this._just_changed && !e.isTrigger && (this._just_changed = !1), ut.event.simulate("change", this, e, !0)
                    })), !1) : void ut.event.add(this, "beforeactivate._change", function(e) {
                        var t = e.target;
                        Rt.test(t.nodeName) && !ut._data(t, "changeBubbles") && (ut.event.add(t, "change._change", function(e) {
                            !this.parentNode || e.isSimulated || e.isTrigger || ut.event.simulate("change", this.parentNode, e, !0)
                        }), ut._data(t, "changeBubbles", !0))
                    })
                },
                handle: function(e) {
                    var t = e.target;
                    return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
                },
                teardown: function() {
                    return ut.event.remove(this, "._change"), !Rt.test(this.nodeName)
                }
            }), ut.support.focusinBubbles || ut.each({
                focus: "focusin",
                blur: "focusout"
            }, function(e, t) {
                var n = 0,
                    i = function(e) {
                        ut.event.simulate(t, e.target, ut.event.fix(e), !0)
                    };
                ut.event.special[t] = {
                    setup: function() {
                        0 === n++ && Y.addEventListener(e, i, !0)
                    },
                    teardown: function() {
                        0 === --n && Y.removeEventListener(e, i, !0)
                    }
                }
            }), ut.fn.extend({
                on: function(e, n, i, r, o) {
                    var a, s;
                    if ("object" == typeof e) {
                        "string" != typeof n && (i = i || n, n = t);
                        for (a in e) this.on(a, n, i, e[a], o);
                        return this
                    }
                    if (null == i && null == r ? (r = n, i = n = t) : null == r && ("string" == typeof n ? (r = i, i = t) : (r = i, i = n, n = t)), r === !1) r = c;
                    else if (!r) return this;
                    return 1 === o && (s = r, r = function(e) {
                        return ut().off(e), s.apply(this, arguments)
                    }, r.guid = s.guid || (s.guid = ut.guid++)), this.each(function() {
                        ut.event.add(this, e, r, i, n)
                    })
                },
                one: function(e, t, n, i) {
                    return this.on(e, t, n, i, 1)
                },
                off: function(e, n, i) {
                    var r, o;
                    if (e && e.preventDefault && e.handleObj) return r = e.handleObj, ut(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
                    if ("object" == typeof e) {
                        for (o in e) this.off(o, n, e[o]);
                        return this
                    }
                    return (n === !1 || "function" == typeof n) && (i = n, n = t), i === !1 && (i = c), this.each(function() {
                        ut.event.remove(this, e, i, n)
                    })
                },
                trigger: function(e, t) {
                    return this.each(function() {
                        ut.event.trigger(e, t, this)
                    })
                },
                triggerHandler: function(e, t) {
                    var n = this[0];
                    return n ? ut.event.trigger(e, t, n, !0) : void 0
                }
            });
            var Bt = /^.[^:#\[\.,]*$/,
                It = /^(?:parents|prev(?:Until|All))/,
                Wt = ut.expr.match.needsContext,
                Ut = {
                    children: !0,
                    contents: !0,
                    next: !0,
                    prev: !0
                };
            ut.fn.extend({
                find: function(e) {
                    var t, n = [],
                        i = this,
                        r = i.length;
                    if ("string" != typeof e) return this.pushStack(ut(e).filter(function() {
                        for (t = 0; r > t; t++)
                            if (ut.contains(i[t], this)) return !0
                    }));
                    for (t = 0; r > t; t++) ut.find(e, i[t], n);
                    return n = this.pushStack(r > 1 ? ut.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
                },
                has: function(e) {
                    var t, n = ut(e, this),
                        i = n.length;
                    return this.filter(function() {
                        for (t = 0; i > t; t++)
                            if (ut.contains(this, n[t])) return !0
                    })
                },
                not: function(e) {
                    return this.pushStack(p(this, e || [], !0))
                },
                filter: function(e) {
                    return this.pushStack(p(this, e || [], !1))
                },
                is: function(e) {
                    return !!p(this, "string" == typeof e && Wt.test(e) ? ut(e) : e || [], !1).length
                },
                closest: function(e, t) {
                    for (var n, i = 0, r = this.length, o = [], a = Wt.test(e) || "string" != typeof e ? ut(e, t || this.context) : 0; r > i; i++)
                        for (n = this[i]; n && n !== t; n = n.parentNode)
                            if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && ut.find.matchesSelector(n, e))) {
                                n = o.push(n);
                                break
                            }
                    return this.pushStack(o.length > 1 ? ut.unique(o) : o)
                },
                index: function(e) {
                    return e ? "string" == typeof e ? ut.inArray(this[0], ut(e)) : ut.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                },
                add: function(e, t) {
                    var n = "string" == typeof e ? ut(e, t) : ut.makeArray(e && e.nodeType ? [e] : e),
                        i = ut.merge(this.get(), n);
                    return this.pushStack(ut.unique(i))
                },
                addBack: function(e) {
                    return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
                }
            }), ut.each({
                parent: function(e) {
                    var t = e.parentNode;
                    return t && 11 !== t.nodeType ? t : null
                },
                parents: function(e) {
                    return ut.dir(e, "parentNode")
                },
                parentsUntil: function(e, t, n) {
                    return ut.dir(e, "parentNode", n)
                },
                next: function(e) {
                    return d(e, "nextSibling")
                },
                prev: function(e) {
                    return d(e, "previousSibling")
                },
                nextAll: function(e) {
                    return ut.dir(e, "nextSibling")
                },
                prevAll: function(e) {
                    return ut.dir(e, "previousSibling")
                },
                nextUntil: function(e, t, n) {
                    return ut.dir(e, "nextSibling", n)
                },
                prevUntil: function(e, t, n) {
                    return ut.dir(e, "previousSibling", n)
                },
                siblings: function(e) {
                    return ut.sibling((e.parentNode || {}).firstChild, e)
                },
                children: function(e) {
                    return ut.sibling(e.firstChild)
                },
                contents: function(e) {
                    return ut.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : ut.merge([], e.childNodes)
                }
            }, function(e, t) {
                ut.fn[e] = function(n, i) {
                    var r = ut.map(this, t, n);
                    return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (r = ut.filter(i, r)), this.length > 1 && (Ut[e] || (r = ut.unique(r)), It.test(e) && (r = r.reverse())), this.pushStack(r)
                }
            }), ut.extend({
                filter: function(e, t, n) {
                    var i = t[0];
                    return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? ut.find.matchesSelector(i, e) ? [i] : [] : ut.find.matches(e, ut.grep(t, function(e) {
                        return 1 === e.nodeType
                    }))
                },
                dir: function(e, n, i) {
                    for (var r = [], o = e[n]; o && 9 !== o.nodeType && (i === t || 1 !== o.nodeType || !ut(o).is(i));) 1 === o.nodeType && r.push(o), o = o[n];
                    return r
                },
                sibling: function(e, t) {
                    for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                    return n
                }
            });
            var Xt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
                Jt = / jQuery\d+="(?:null|\d+)"/g,
                Vt = new RegExp("<(?:" + Xt + ")[\\s/>]", "i"),
                Kt = /^\s+/,
                Yt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                Gt = /<([\w:]+)/,
                Qt = /<tbody/i,
                Zt = /<|&#?\w+;/,
                en = /<(?:script|style|link)/i,
                tn = /^(?:checkbox|radio)$/i,
                nn = /checked\s*(?:[^=]|=\s*.checked.)/i,
                rn = /^$|\/(?:java|ecma)script/i,
                on = /^true\/(.*)/,
                an = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
                sn = {
                    option: [1, "<select multiple='multiple'>", "</select>"],
                    legend: [1, "<fieldset>", "</fieldset>"],
                    area: [1, "<map>", "</map>"],
                    param: [1, "<object>", "</object>"],
                    thead: [1, "<table>", "</table>"],
                    tr: [2, "<table><tbody>", "</tbody></table>"],
                    col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                    _default: ut.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
                },
                ln = f(Y),
                cn = ln.appendChild(Y.createElement("div"));
            sn.optgroup = sn.option, sn.tbody = sn.tfoot = sn.colgroup = sn.caption = sn.thead, sn.th = sn.td, ut.fn.extend({
                text: function(e) {
                    return ut.access(this, function(e) {
                        return e === t ? ut.text(this) : this.empty().append((this[0] && this[0].ownerDocument || Y).createTextNode(e))
                    }, null, e, arguments.length)
                },
                append: function() {
                    return this.domManip(arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = h(this, e);
                            t.appendChild(e)
                        }
                    })
                },
                prepend: function() {
                    return this.domManip(arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = h(this, e);
                            t.insertBefore(e, t.firstChild)
                        }
                    })
                },
                before: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this)
                    })
                },
                after: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                    })
                },
                remove: function(e, t) {
                    for (var n, i = e ? ut.filter(e, this) : this, r = 0; null != (n = i[r]); r++) t || 1 !== n.nodeType || ut.cleanData(x(n)), n.parentNode && (t && ut.contains(n.ownerDocument, n) && v(x(n, "script")), n.parentNode.removeChild(n));
                    return this
                },
                empty: function() {
                    for (var e, t = 0; null != (e = this[t]); t++) {
                        for (1 === e.nodeType && ut.cleanData(x(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                        e.options && ut.nodeName(e, "select") && (e.options.length = 0)
                    }
                    return this
                },
                clone: function(e, t) {
                    return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                        return ut.clone(this, e, t)
                    })
                },
                html: function(e) {
                    return ut.access(this, function(e) {
                        var n = this[0] || {},
                            i = 0,
                            r = this.length;
                        if (e === t) return 1 === n.nodeType ? n.innerHTML.replace(Jt, "") : t;
                        if (!("string" != typeof e || en.test(e) || !ut.support.htmlSerialize && Vt.test(e) || !ut.support.leadingWhitespace && Kt.test(e) || sn[(Gt.exec(e) || ["", ""])[1].toLowerCase()])) {
                            e = e.replace(Yt, "<$1></$2>");
                            try {
                                for (; r > i; i++) n = this[i] || {}, 1 === n.nodeType && (ut.cleanData(x(n, !1)), n.innerHTML = e);
                                n = 0
                            } catch (o) {}
                        }
                        n && this.empty().append(e)
                    }, null, e, arguments.length)
                },
                replaceWith: function() {
                    var e = ut.map(this, function(e) {
                            return [e.nextSibling, e.parentNode]
                        }),
                        t = 0;
                    return this.domManip(arguments, function(n) {
                        var i = e[t++],
                            r = e[t++];
                        r && (i && i.parentNode !== r && (i = this.nextSibling), ut(this).remove(), r.insertBefore(n, i))
                    }, !0), t ? this : this.remove()
                },
                detach: function(e) {
                    return this.remove(e, !0)
                },
                domManip: function(e, t, n) {
                    e = it.apply([], e);
                    var i, r, o, a, s, l, c = 0,
                        u = this.length,
                        d = this,
                        p = u - 1,
                        f = e[0],
                        h = ut.isFunction(f);
                    if (h || !(1 >= u || "string" != typeof f || ut.support.checkClone) && nn.test(f)) return this.each(function(i) {
                        var r = d.eq(i);
                        h && (e[0] = f.call(this, i, r.html())), r.domManip(e, t, n)
                    });
                    if (u && (l = ut.buildFragment(e, this[0].ownerDocument, !1, !n && this), i = l.firstChild, 1 === l.childNodes.length && (l = i), i)) {
                        for (a = ut.map(x(l, "script"), g), o = a.length; u > c; c++) r = l, c !== p && (r = ut.clone(r, !0, !0), o && ut.merge(a, x(r, "script"))), t.call(this[c], r, c);
                        if (o)
                            for (s = a[a.length - 1].ownerDocument, ut.map(a, m), c = 0; o > c; c++) r = a[c], rn.test(r.type || "") && !ut._data(r, "globalEval") && ut.contains(s, r) && (r.src ? ut._evalUrl(r.src) : ut.globalEval((r.text || r.textContent || r.innerHTML || "").replace(an, "")));
                        l = i = null
                    }
                    return this
                }
            }), ut.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function(e, t) {
                ut.fn[e] = function(e) {
                    for (var n, i = 0, r = [], o = ut(e), a = o.length - 1; a >= i; i++) n = i === a ? this : this.clone(!0), ut(o[i])[t](n), rt.apply(r, n.get());
                    return this.pushStack(r)
                }
            }), ut.extend({
                clone: function(e, t, n) {
                    var i, r, o, a, s, l = ut.contains(e.ownerDocument, e);
                    if (ut.support.html5Clone || ut.isXMLDoc(e) || !Vt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (cn.innerHTML = e.outerHTML, cn.removeChild(o = cn.firstChild)), !(ut.support.noCloneEvent && ut.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ut.isXMLDoc(e)))
                        for (i = x(o), s = x(e), a = 0; null != (r = s[a]); ++a) i[a] && b(r, i[a]);
                    if (t)
                        if (n)
                            for (s = s || x(e), i = i || x(o), a = 0; null != (r = s[a]); a++) y(r, i[a]);
                        else y(e, o);
                    return i = x(o, "script"), i.length > 0 && v(i, !l && x(e, "script")), i = s = r = null, o
                },
                buildFragment: function(e, t, n, i) {
                    for (var r, o, a, s, l, c, u, d = e.length, p = f(t), h = [], g = 0; d > g; g++)
                        if (o = e[g], o || 0 === o)
                            if ("object" === ut.type(o)) ut.merge(h, o.nodeType ? [o] : o);
                            else if (Zt.test(o)) {
                        for (s = s || p.appendChild(t.createElement("div")), l = (Gt.exec(o) || ["", ""])[1].toLowerCase(), u = sn[l] || sn._default, s.innerHTML = u[1] + o.replace(Yt, "<$1></$2>") + u[2], r = u[0]; r--;) s = s.lastChild;
                        if (!ut.support.leadingWhitespace && Kt.test(o) && h.push(t.createTextNode(Kt.exec(o)[0])), !ut.support.tbody)
                            for (o = "table" !== l || Qt.test(o) ? "<table>" !== u[1] || Qt.test(o) ? 0 : s : s.firstChild, r = o && o.childNodes.length; r--;) ut.nodeName(c = o.childNodes[r], "tbody") && !c.childNodes.length && o.removeChild(c);
                        for (ut.merge(h, s.childNodes), s.textContent = ""; s.firstChild;) s.removeChild(s.firstChild);
                        s = p.lastChild
                    } else h.push(t.createTextNode(o));
                    for (s && p.removeChild(s), ut.support.appendChecked || ut.grep(x(h, "input"), w), g = 0; o = h[g++];)
                        if ((!i || -1 === ut.inArray(o, i)) && (a = ut.contains(o.ownerDocument, o), s = x(p.appendChild(o), "script"), a && v(s), n))
                            for (r = 0; o = s[r++];) rn.test(o.type || "") && n.push(o);
                    return s = null, p
                },
                cleanData: function(e, t) {
                    for (var n, i, r, o, a = 0, s = ut.expando, l = ut.cache, c = ut.support.deleteExpando, u = ut.event.special; null != (n = e[a]); a++)
                        if ((t || ut.acceptData(n)) && (r = n[s], o = r && l[r])) {
                            if (o.events)
                                for (i in o.events) u[i] ? ut.event.remove(n, i) : ut.removeEvent(n, i, o.handle);
                            l[r] && (delete l[r], c ? delete n[s] : typeof n.removeAttribute !== V ? n.removeAttribute(s) : n[s] = null, tt.push(r))
                        }
                },
                _evalUrl: function(e) {
                    return ut.ajax({
                        url: e,
                        type: "GET",
                        dataType: "script",
                        async: !1,
                        global: !1,
                        "throws": !0
                    })
                }
            }), ut.fn.extend({
                wrapAll: function(e) {
                    if (ut.isFunction(e)) return this.each(function(t) {
                        ut(this).wrapAll(e.call(this, t))
                    });
                    if (this[0]) {
                        var t = ut(e, this[0].ownerDocument).eq(0).clone(!0);
                        this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                            for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                            return e
                        }).append(this)
                    }
                    return this
                },
                wrapInner: function(e) {
                    return this.each(ut.isFunction(e) ? function(t) {
                        ut(this).wrapInner(e.call(this, t))
                    } : function() {
                        var t = ut(this),
                            n = t.contents();
                        n.length ? n.wrapAll(e) : t.append(e)
                    })
                },
                wrap: function(e) {
                    var t = ut.isFunction(e);
                    return this.each(function(n) {
                        ut(this).wrapAll(t ? e.call(this, n) : e)
                    })
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        ut.nodeName(this, "body") || ut(this).replaceWith(this.childNodes)
                    }).end()
                }
            });
            var un, dn, pn, fn = /alpha\([^)]*\)/i,
                hn = /opacity\s*=\s*([^)]*)/,
                gn = /^(top|right|bottom|left)$/,
                mn = /^(none|table(?!-c[ea]).+)/,
                vn = /^margin/,
                yn = new RegExp("^(" + dt + ")(.*)$", "i"),
                bn = new RegExp("^(" + dt + ")(?!px)[a-z%]+$", "i"),
                xn = new RegExp("^([+-])=(" + dt + ")", "i"),
                wn = {
                    BODY: "block"
                },
                kn = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block"
                },
                Tn = {
                    letterSpacing: 0,
                    fontWeight: 400
                },
                Cn = ["Top", "Right", "Bottom", "Left"],
                En = ["Webkit", "O", "Moz", "ms"];
            ut.fn.extend({
                css: function(e, n) {
                    return ut.access(this, function(e, n, i) {
                        var r, o, a = {},
                            s = 0;
                        if (ut.isArray(n)) {
                            for (o = dn(e), r = n.length; r > s; s++) a[n[s]] = ut.css(e, n[s], !1, o);
                            return a
                        }
                        return i !== t ? ut.style(e, n, i) : ut.css(e, n)
                    }, e, n, arguments.length > 1)
                },
                show: function() {
                    return C(this, !0)
                },
                hide: function() {
                    return C(this)
                },
                toggle: function(e) {
                    return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                        T(this) ? ut(this).show() : ut(this).hide()
                    })
                }
            }), ut.extend({
                cssHooks: {
                    opacity: {
                        get: function(e, t) {
                            if (t) {
                                var n = pn(e, "opacity");
                                return "" === n ? "1" : n
                            }
                        }
                    }
                },
                cssNumber: {
                    columnCount: !0,
                    fillOpacity: !0,
                    fontWeight: !0,
                    lineHeight: !0,
                    opacity: !0,
                    order: !0,
                    orphans: !0,
                    widows: !0,
                    zIndex: !0,
                    zoom: !0
                },
                cssProps: {
                    "float": ut.support.cssFloat ? "cssFloat" : "styleFloat"
                },
                style: function(e, n, i, r) {
                    if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                        var o, a, s, l = ut.camelCase(n),
                            c = e.style;
                        if (n = ut.cssProps[l] || (ut.cssProps[l] = k(c, l)), s = ut.cssHooks[n] || ut.cssHooks[l], i === t) return s && "get" in s && (o = s.get(e, !1, r)) !== t ? o : c[n];
                        if (a = typeof i, "string" === a && (o = xn.exec(i)) && (i = (o[1] + 1) * o[2] + parseFloat(ut.css(e, n)), a = "number"), !(null == i || "number" === a && isNaN(i) || ("number" !== a || ut.cssNumber[l] || (i += "px"), ut.support.clearCloneStyle || "" !== i || 0 !== n.indexOf("background") || (c[n] = "inherit"), s && "set" in s && (i = s.set(e, i, r)) === t))) try {
                            c[n] = i
                        } catch (u) {}
                    }
                },
                css: function(e, n, i, r) {
                    var o, a, s, l = ut.camelCase(n);
                    return n = ut.cssProps[l] || (ut.cssProps[l] = k(e.style, l)), s = ut.cssHooks[n] || ut.cssHooks[l], s && "get" in s && (a = s.get(e, !0, i)), a === t && (a = pn(e, n, r)), "normal" === a && n in Tn && (a = Tn[n]), "" === i || i ? (o = parseFloat(a), i === !0 || ut.isNumeric(o) ? o || 0 : a) : a
                }
            }), e.getComputedStyle ? (dn = function(t) {
                return e.getComputedStyle(t, null)
            }, pn = function(e, n, i) {
                var r, o, a, s = i || dn(e),
                    l = s ? s.getPropertyValue(n) || s[n] : t,
                    c = e.style;
                return s && ("" !== l || ut.contains(e.ownerDocument, e) || (l = ut.style(e, n)), bn.test(l) && vn.test(n) && (r = c.width, o = c.minWidth, a = c.maxWidth, c.minWidth = c.maxWidth = c.width = l, l = s.width, c.width = r, c.minWidth = o, c.maxWidth = a)), l
            }) : Y.documentElement.currentStyle && (dn = function(e) {
                return e.currentStyle
            }, pn = function(e, n, i) {
                var r, o, a, s = i || dn(e),
                    l = s ? s[n] : t,
                    c = e.style;
                return null == l && c && c[n] && (l = c[n]), bn.test(l) && !gn.test(n) && (r = c.left, o = e.runtimeStyle, a = o && o.left, a && (o.left = e.currentStyle.left), c.left = "fontSize" === n ? "1em" : l, l = c.pixelLeft + "px", c.left = r, a && (o.left = a)), "" === l ? "auto" : l
            }), ut.each(["height", "width"], function(e, t) {
                ut.cssHooks[t] = {
                    get: function(e, n, i) {
                        return n ? 0 === e.offsetWidth && mn.test(ut.css(e, "display")) ? ut.swap(e, kn, function() {
                            return N(e, t, i)
                        }) : N(e, t, i) : void 0
                    },
                    set: function(e, n, i) {
                        var r = i && dn(e);
                        return E(e, n, i ? _(e, t, i, ut.support.boxSizing && "border-box" === ut.css(e, "boxSizing", !1, r), r) : 0)
                    }
                }
            }), ut.support.opacity || (ut.cssHooks.opacity = {
                get: function(e, t) {
                    return hn.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
                },
                set: function(e, t) {
                    var n = e.style,
                        i = e.currentStyle,
                        r = ut.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                        o = i && i.filter || n.filter || "";
                    n.zoom = 1, (t >= 1 || "" === t) && "" === ut.trim(o.replace(fn, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || i && !i.filter) || (n.filter = fn.test(o) ? o.replace(fn, r) : o + " " + r)
                }
            }), ut(function() {
                ut.support.reliableMarginRight || (ut.cssHooks.marginRight = {
                    get: function(e, t) {
                        return t ? ut.swap(e, {
                            display: "inline-block"
                        }, pn, [e, "marginRight"]) : void 0
                    }
                }), !ut.support.pixelPosition && ut.fn.position && ut.each(["top", "left"], function(e, t) {
                    ut.cssHooks[t] = {
                        get: function(e, n) {
                            return n ? (n = pn(e, t), bn.test(n) ? ut(e).position()[t] + "px" : n) : void 0
                        }
                    }
                })
            }), ut.expr && ut.expr.filters && (ut.expr.filters.hidden = function(e) {
                return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !ut.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || ut.css(e, "display"))
            }, ut.expr.filters.visible = function(e) {
                return !ut.expr.filters.hidden(e)
            }), ut.each({
                margin: "",
                padding: "",
                border: "Width"
            }, function(e, t) {
                ut.cssHooks[e + t] = {
                    expand: function(n) {
                        for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++) r[e + Cn[i] + t] = o[i] || o[i - 2] || o[0];
                        return r
                    }
                }, vn.test(e) || (ut.cssHooks[e + t].set = E)
            });
            var _n = /%20/g,
                Nn = /\[\]$/,
                Sn = /\r?\n/g,
                jn = /^(?:submit|button|image|reset|file)$/i,
                An = /^(?:input|select|textarea|keygen)/i;
            ut.fn.extend({
                serialize: function() {
                    return ut.param(this.serializeArray())
                },
                serializeArray: function() {
                    return this.map(function() {
                        var e = ut.prop(this, "elements");
                        return e ? ut.makeArray(e) : this
                    }).filter(function() {
                        var e = this.type;
                        return this.name && !ut(this).is(":disabled") && An.test(this.nodeName) && !jn.test(e) && (this.checked || !tn.test(e))
                    }).map(function(e, t) {
                        var n = ut(this).val();
                        return null == n ? null : ut.isArray(n) ? ut.map(n, function(e) {
                            return {
                                name: t.name,
                                value: e.replace(Sn, "\r\n")
                            }
                        }) : {
                            name: t.name,
                            value: n.replace(Sn, "\r\n")
                        }
                    }).get()
                }
            }), ut.param = function(e, n) {
                var i, r = [],
                    o = function(e, t) {
                        t = ut.isFunction(t) ? t() : null == t ? "" : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                    };
                if (n === t && (n = ut.ajaxSettings && ut.ajaxSettings.traditional), ut.isArray(e) || e.jquery && !ut.isPlainObject(e)) ut.each(e, function() {
                    o(this.name, this.value)
                });
                else
                    for (i in e) A(i, e[i], n, o);
                return r.join("&").replace(_n, "+")
            }, ut.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
                ut.fn[t] = function(e, n) {
                    return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
                }
            }), ut.fn.extend({
                hover: function(e, t) {
                    return this.mouseenter(e).mouseleave(t || e)
                },
                bind: function(e, t, n) {
                    return this.on(e, null, t, n)
                },
                unbind: function(e, t) {
                    return this.off(e, null, t)
                },
                delegate: function(e, t, n, i) {
                    return this.on(t, e, n, i)
                },
                undelegate: function(e, t, n) {
                    return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
                }
            });
            var Ln, Dn, Hn = ut.now(),
                Fn = /\?/,
                Mn = /#.*$/,
                qn = /([?&])_=[^&]*/,
                Rn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
                On = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
                $n = /^(?:GET|HEAD)$/,
                Pn = /^\/\//,
                zn = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
                Bn = ut.fn.load,
                In = {},
                Wn = {},
                Un = "*/".concat("*");
            try {
                Dn = K.href
            } catch (Xn) {
                Dn = Y.createElement("a"), Dn.href = "", Dn = Dn.href
            }
            Ln = zn.exec(Dn.toLowerCase()) || [], ut.fn.load = function(e, n, i) {
                if ("string" != typeof e && Bn) return Bn.apply(this, arguments);
                var r, o, a, s = this,
                    l = e.indexOf(" ");
                return l >= 0 && (r = e.slice(l, e.length), e = e.slice(0, l)), ut.isFunction(n) ? (i = n, n = t) : n && "object" == typeof n && (a = "POST"), s.length > 0 && ut.ajax({
                    url: e,
                    type: a,
                    dataType: "html",
                    data: n
                }).done(function(e) {
                    o = arguments, s.html(r ? ut("<div>").append(ut.parseHTML(e)).find(r) : e)
                }).complete(i && function(e, t) {
                    s.each(i, o || [e.responseText, t, e])
                }), this
            }, ut.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
                ut.fn[t] = function(e) {
                    return this.on(t, e)
                }
            }), ut.extend({
                active: 0,
                lastModified: {},
                etag: {},
                ajaxSettings: {
                    url: Dn,
                    type: "GET",
                    isLocal: On.test(Ln[1]),
                    global: !0,
                    processData: !0,
                    async: !0,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    accepts: {
                        "*": Un,
                        text: "text/plain",
                        html: "text/html",
                        xml: "application/xml, text/xml",
                        json: "application/json, text/javascript"
                    },
                    contents: {
                        xml: /xml/,
                        html: /html/,
                        json: /json/
                    },
                    responseFields: {
                        xml: "responseXML",
                        text: "responseText",
                        json: "responseJSON"
                    },
                    converters: {
                        "* text": String,
                        "text html": !0,
                        "text json": ut.parseJSON,
                        "text xml": ut.parseXML
                    },
                    flatOptions: {
                        url: !0,
                        context: !0
                    }
                },
                ajaxSetup: function(e, t) {
                    return t ? H(H(e, ut.ajaxSettings), t) : H(ut.ajaxSettings, e)
                },
                ajaxPrefilter: L(In),
                ajaxTransport: L(Wn),
                ajax: function(e, n) {
                    function i(e, n, i, r) {
                        var o, d, y, b, w, T = n;
                        2 !== x && (x = 2, l && clearTimeout(l), u = t, s = r || "", k.readyState = e > 0 ? 4 : 0, o = e >= 200 && 300 > e || 304 === e, i && (b = F(p, k, i)), b = M(p, b, k, o), o ? (p.ifModified && (w = k.getResponseHeader("Last-Modified"), w && (ut.lastModified[a] = w), w = k.getResponseHeader("etag"), w && (ut.etag[a] = w)), 204 === e || "HEAD" === p.type ? T = "nocontent" : 304 === e ? T = "notmodified" : (T = b.state, d = b.data, y = b.error, o = !y)) : (y = T, (e || !T) && (T = "error", 0 > e && (e = 0))), k.status = e, k.statusText = (n || T) + "", o ? g.resolveWith(f, [d, T, k]) : g.rejectWith(f, [k, T, y]), k.statusCode(v), v = t, c && h.trigger(o ? "ajaxSuccess" : "ajaxError", [k, p, o ? d : y]), m.fireWith(f, [k, T]), c && (h.trigger("ajaxComplete", [k, p]), --ut.active || ut.event.trigger("ajaxStop")))
                    }
                    "object" == typeof e && (n = e, e = t), n = n || {};
                    var r, o, a, s, l, c, u, d, p = ut.ajaxSetup({}, n),
                        f = p.context || p,
                        h = p.context && (f.nodeType || f.jquery) ? ut(f) : ut.event,
                        g = ut.Deferred(),
                        m = ut.Callbacks("once memory"),
                        v = p.statusCode || {},
                        y = {},
                        b = {},
                        x = 0,
                        w = "canceled",
                        k = {
                            readyState: 0,
                            getResponseHeader: function(e) {
                                var t;
                                if (2 === x) {
                                    if (!d)
                                        for (d = {}; t = Rn.exec(s);) d[t[1].toLowerCase()] = t[2];
                                    t = d[e.toLowerCase()]
                                }
                                return null == t ? null : t
                            },
                            getAllResponseHeaders: function() {
                                return 2 === x ? s : null
                            },
                            setRequestHeader: function(e, t) {
                                var n = e.toLowerCase();
                                return x || (e = b[n] = b[n] || e, y[e] = t), this
                            },
                            overrideMimeType: function(e) {
                                return x || (p.mimeType = e), this
                            },
                            statusCode: function(e) {
                                var t;
                                if (e)
                                    if (2 > x)
                                        for (t in e) v[t] = [v[t], e[t]];
                                    else k.always(e[k.status]);
                                return this
                            },
                            abort: function(e) {
                                var t = e || w;
                                return u && u.abort(t), i(0, t), this
                            }
                        };
                    if (g.promise(k).complete = m.add, k.success = k.done, k.error = k.fail, p.url = ((e || p.url || Dn) + "").replace(Mn, "").replace(Pn, Ln[1] + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = ut.trim(p.dataType || "*").toLowerCase().match(pt) || [""], null == p.crossDomain && (r = zn.exec(p.url.toLowerCase()), p.crossDomain = !(!r || r[1] === Ln[1] && r[2] === Ln[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (Ln[3] || ("http:" === Ln[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = ut.param(p.data, p.traditional)), D(In, p, n, k), 2 === x) return k;
                    c = p.global, c && 0 === ut.active++ && ut.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !$n.test(p.type), a = p.url, p.hasContent || (p.data && (a = p.url += (Fn.test(a) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = qn.test(a) ? a.replace(qn, "$1_=" + Hn++) : a + (Fn.test(a) ? "&" : "?") + "_=" + Hn++)), p.ifModified && (ut.lastModified[a] && k.setRequestHeader("If-Modified-Since", ut.lastModified[a]), ut.etag[a] && k.setRequestHeader("If-None-Match", ut.etag[a])), (p.data && p.hasContent && p.contentType !== !1 || n.contentType) && k.setRequestHeader("Content-Type", p.contentType), k.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Un + "; q=0.01" : "") : p.accepts["*"]);
                    for (o in p.headers) k.setRequestHeader(o, p.headers[o]);
                    if (p.beforeSend && (p.beforeSend.call(f, k, p) === !1 || 2 === x)) return k.abort();
                    w = "abort";
                    for (o in {
                            success: 1,
                            error: 1,
                            complete: 1
                        }) k[o](p[o]);
                    if (u = D(Wn, p, n, k)) {
                        k.readyState = 1, c && h.trigger("ajaxSend", [k, p]), p.async && p.timeout > 0 && (l = setTimeout(function() {
                            k.abort("timeout")
                        }, p.timeout));
                        try {
                            x = 1, u.send(y, i)
                        } catch (T) {
                            if (!(2 > x)) throw T;
                            i(-1, T)
                        }
                    } else i(-1, "No Transport");
                    return k
                },
                getJSON: function(e, t, n) {
                    return ut.get(e, t, n, "json")
                },
                getScript: function(e, n) {
                    return ut.get(e, t, n, "script")
                }
            }), ut.each(["get", "post"], function(e, n) {
                ut[n] = function(e, i, r, o) {
                    return ut.isFunction(i) && (o = o || r, r = i, i = t), ut.ajax({
                        url: e,
                        type: n,
                        dataType: o,
                        data: i,
                        success: r
                    })
                }
            }), ut.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                },
                contents: {
                    script: /(?:java|ecma)script/
                },
                converters: {
                    "text script": function(e) {
                        return ut.globalEval(e), e
                    }
                }
            }), ut.ajaxPrefilter("script", function(e) {
                e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
            }), ut.ajaxTransport("script", function(e) {
                if (e.crossDomain) {
                    var n, i = Y.head || ut("head")[0] || Y.documentElement;
                    return {
                        send: function(t, r) {
                            n = Y.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function(e, t) {
                                (t || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, t || r(200, "success"))
                            }, i.insertBefore(n, i.firstChild)
                        },
                        abort: function() {
                            n && n.onload(t, !0)
                        }
                    }
                }
            });
            var Jn = [],
                Vn = /(=)\?(?=&|$)|\?\?/;
            ut.ajaxSetup({
                jsonp: "callback",
                jsonpCallback: function() {
                    var e = Jn.pop() || ut.expando + "_" + Hn++;
                    return this[e] = !0, e
                }
            }), ut.ajaxPrefilter("json jsonp", function(n, i, r) {
                var o, a, s, l = n.jsonp !== !1 && (Vn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Vn.test(n.data) && "data");
                return l || "jsonp" === n.dataTypes[0] ? (o = n.jsonpCallback = ut.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, l ? n[l] = n[l].replace(Vn, "$1" + o) : n.jsonp !== !1 && (n.url += (Fn.test(n.url) ? "&" : "?") + n.jsonp + "=" + o), n.converters["script json"] = function() {
                    return s || ut.error(o + " was not called"), s[0]
                }, n.dataTypes[0] = "json", a = e[o], e[o] = function() {
                    s = arguments
                }, r.always(function() {
                    e[o] = a, n[o] && (n.jsonpCallback = i.jsonpCallback, Jn.push(o)), s && ut.isFunction(a) && a(s[0]), s = a = t
                }), "script") : void 0
            });
            var Kn, Yn, Gn = 0,
                Qn = e.ActiveXObject && function() {
                    var e;
                    for (e in Kn) Kn[e](t, !0)
                };
            ut.ajaxSettings.xhr = e.ActiveXObject ? function() {
                return !this.isLocal && q() || R()
            } : q, Yn = ut.ajaxSettings.xhr(), ut.support.cors = !!Yn && "withCredentials" in Yn, Yn = ut.support.ajax = !!Yn, Yn && ut.ajaxTransport(function(n) {
                if (!n.crossDomain || ut.support.cors) {
                    var i;
                    return {
                        send: function(r, o) {
                            var a, s, l = n.xhr();
                            if (n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), n.xhrFields)
                                for (s in n.xhrFields) l[s] = n.xhrFields[s];
                            n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType), n.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest");
                            try {
                                for (s in r) l.setRequestHeader(s, r[s])
                            } catch (c) {}
                            l.send(n.hasContent && n.data || null), i = function(e, r) {
                                var s, c, u, d;
                                try {
                                    if (i && (r || 4 === l.readyState))
                                        if (i = t, a && (l.onreadystatechange = ut.noop, Qn && delete Kn[a]), r) 4 !== l.readyState && l.abort();
                                        else {
                                            d = {}, s = l.status, c = l.getAllResponseHeaders(), "string" == typeof l.responseText && (d.text = l.responseText);
                                            try {
                                                u = l.statusText
                                            } catch (p) {
                                                u = ""
                                            }
                                            s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = d.text ? 200 : 404
                                        }
                                } catch (f) {
                                    r || o(-1, f)
                                }
                                d && o(s, u, d, c)
                            }, n.async ? 4 === l.readyState ? setTimeout(i) : (a = ++Gn, Qn && (Kn || (Kn = {}, ut(e).unload(Qn)), Kn[a] = i), l.onreadystatechange = i) : i()
                        },
                        abort: function() {
                            i && i(t, !0)
                        }
                    }
                }
            });
            var Zn, ei, ti = /^(?:toggle|show|hide)$/,
                ni = new RegExp("^(?:([+-])=|)(" + dt + ")([a-z%]*)$", "i"),
                ii = /queueHooks$/,
                ri = [B],
                oi = {
                    "*": [function(e, t) {
                        var n = this.createTween(e, t),
                            i = n.cur(),
                            r = ni.exec(t),
                            o = r && r[3] || (ut.cssNumber[e] ? "" : "px"),
                            a = (ut.cssNumber[e] || "px" !== o && +i) && ni.exec(ut.css(n.elem, e)),
                            s = 1,
                            l = 20;
                        if (a && a[3] !== o) {
                            o = o || a[3], r = r || [], a = +i || 1;
                            do s = s || ".5", a /= s, ut.style(n.elem, e, a + o); while (s !== (s = n.cur() / i) && 1 !== s && --l)
                        }
                        return r && (a = n.start = +a || +i || 0, n.unit = o, n.end = r[1] ? a + (r[1] + 1) * r[2] : +r[2]), n
                    }]
                };
            ut.Animation = ut.extend(P, {
                tweener: function(e, t) {
                    ut.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                    for (var n, i = 0, r = e.length; r > i; i++) n = e[i], oi[n] = oi[n] || [], oi[n].unshift(t)
                },
                prefilter: function(e, t) {
                    t ? ri.unshift(e) : ri.push(e)
                }
            }), ut.Tween = I, I.prototype = {
                constructor: I,
                init: function(e, t, n, i, r, o) {
                    this.elem = e, this.prop = n, this.easing = r || "swing", this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = o || (ut.cssNumber[n] ? "" : "px")
                },
                cur: function() {
                    var e = I.propHooks[this.prop];
                    return e && e.get ? e.get(this) : I.propHooks._default.get(this)
                },
                run: function(e) {
                    var t, n = I.propHooks[this.prop];
                    return this.pos = t = this.options.duration ? ut.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : I.propHooks._default.set(this), this
                }
            }, I.prototype.init.prototype = I.prototype, I.propHooks = {
                _default: {
                    get: function(e) {
                        var t;
                        return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = ut.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
                    },
                    set: function(e) {
                        ut.fx.step[e.prop] ? ut.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[ut.cssProps[e.prop]] || ut.cssHooks[e.prop]) ? ut.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                    }
                }
            }, I.propHooks.scrollTop = I.propHooks.scrollLeft = {
                set: function(e) {
                    e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
                }
            }, ut.each(["toggle", "show", "hide"], function(e, t) {
                var n = ut.fn[t];
                ut.fn[t] = function(e, i, r) {
                    return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(W(t, !0), e, i, r)
                }
            }), ut.fn.extend({
                fadeTo: function(e, t, n, i) {
                    return this.filter(T).css("opacity", 0).show().end().animate({
                        opacity: t
                    }, e, n, i)
                },
                animate: function(e, t, n, i) {
                    var r = ut.isEmptyObject(e),
                        o = ut.speed(t, n, i),
                        a = function() {
                            var t = P(this, ut.extend({}, e), o);
                            (r || ut._data(this, "finish")) && t.stop(!0)
                        };
                    return a.finish = a, r || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
                },
                stop: function(e, n, i) {
                    var r = function(e) {
                        var t = e.stop;
                        delete e.stop, t(i)
                    };
                    return "string" != typeof e && (i = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                        var t = !0,
                            n = null != e && e + "queueHooks",
                            o = ut.timers,
                            a = ut._data(this);
                        if (n) a[n] && a[n].stop && r(a[n]);
                        else
                            for (n in a) a[n] && a[n].stop && ii.test(n) && r(a[n]);
                        for (n = o.length; n--;) o[n].elem !== this || null != e && o[n].queue !== e || (o[n].anim.stop(i), t = !1, o.splice(n, 1));
                        (t || !i) && ut.dequeue(this, e)
                    })
                },
                finish: function(e) {
                    return e !== !1 && (e = e || "fx"), this.each(function() {
                        var t, n = ut._data(this),
                            i = n[e + "queue"],
                            r = n[e + "queueHooks"],
                            o = ut.timers,
                            a = i ? i.length : 0;
                        for (n.finish = !0, ut.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                        for (t = 0; a > t; t++) i[t] && i[t].finish && i[t].finish.call(this);
                        delete n.finish
                    })
                }
            }), ut.each({
                slideDown: W("show"),
                slideUp: W("hide"),
                slideToggle: W("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(e, t) {
                ut.fn[e] = function(e, n, i) {
                    return this.animate(t, e, n, i)
                }
            }), ut.speed = function(e, t, n) {
                var i = e && "object" == typeof e ? ut.extend({}, e) : {
                    complete: n || !n && t || ut.isFunction(e) && e,
                    duration: e,
                    easing: n && t || t && !ut.isFunction(t) && t
                };
                return i.duration = ut.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in ut.fx.speeds ? ut.fx.speeds[i.duration] : ut.fx.speeds._default, (null == i.queue || i.queue === !0) && (i.queue = "fx"), i.old = i.complete, i.complete = function() {
                    ut.isFunction(i.old) && i.old.call(this), i.queue && ut.dequeue(this, i.queue)
                }, i
            }, ut.easing = {
                linear: function(e) {
                    return e
                },
                swing: function(e) {
                    return .5 - Math.cos(e * Math.PI) / 2
                }
            }, ut.timers = [], ut.fx = I.prototype.init, ut.fx.tick = function() {
                var e, n = ut.timers,
                    i = 0;
                for (Zn = ut.now(); i < n.length; i++) e = n[i], e() || n[i] !== e || n.splice(i--, 1);
                n.length || ut.fx.stop(), Zn = t
            }, ut.fx.timer = function(e) {
                e() && ut.timers.push(e) && ut.fx.start()
            }, ut.fx.interval = 13, ut.fx.start = function() {
                ei || (ei = setInterval(ut.fx.tick, ut.fx.interval))
            }, ut.fx.stop = function() {
                clearInterval(ei), ei = null
            }, ut.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, ut.fx.step = {}, ut.expr && ut.expr.filters && (ut.expr.filters.animated = function(e) {
                return ut.grep(ut.timers, function(t) {
                    return e === t.elem
                }).length
            }), ut.fn.offset = function(e) {
                if (arguments.length) return e === t ? this : this.each(function(t) {
                    ut.offset.setOffset(this, e, t)
                });
                var n, i, r = {
                        top: 0,
                        left: 0
                    },
                    o = this[0],
                    a = o && o.ownerDocument;
                if (a) return n = a.documentElement, ut.contains(n, o) ? (typeof o.getBoundingClientRect !== V && (r = o.getBoundingClientRect()), i = U(a), {
                    top: r.top + (i.pageYOffset || n.scrollTop) - (n.clientTop || 0),
                    left: r.left + (i.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
                }) : r
            }, ut.offset = {
                setOffset: function(e, t, n) {
                    var i = ut.css(e, "position");
                    "static" === i && (e.style.position = "relative");
                    var r, o, a = ut(e),
                        s = a.offset(),
                        l = ut.css(e, "top"),
                        c = ut.css(e, "left"),
                        u = ("absolute" === i || "fixed" === i) && ut.inArray("auto", [l, c]) > -1,
                        d = {},
                        p = {};
                    u ? (p = a.position(), r = p.top, o = p.left) : (r = parseFloat(l) || 0, o = parseFloat(c) || 0), ut.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (d.top = t.top - s.top + r), null != t.left && (d.left = t.left - s.left + o), "using" in t ? t.using.call(e, d) : a.css(d)
                }
            }, ut.fn.extend({
                position: function() {
                    if (this[0]) {
                        var e, t, n = {
                                top: 0,
                                left: 0
                            },
                            i = this[0];
                        return "fixed" === ut.css(i, "position") ? t = i.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), ut.nodeName(e[0], "html") || (n = e.offset()), n.top += ut.css(e[0], "borderTopWidth", !0), n.left += ut.css(e[0], "borderLeftWidth", !0)), {
                            top: t.top - n.top - ut.css(i, "marginTop", !0),
                            left: t.left - n.left - ut.css(i, "marginLeft", !0)
                        }
                    }
                },
                offsetParent: function() {
                    return this.map(function() {
                        for (var e = this.offsetParent || G; e && !ut.nodeName(e, "html") && "static" === ut.css(e, "position");) e = e.offsetParent;
                        return e || G
                    })
                }
            }), ut.each({
                scrollLeft: "pageXOffset",
                scrollTop: "pageYOffset"
            }, function(e, n) {
                var i = /Y/.test(n);
                ut.fn[e] = function(r) {
                    return ut.access(this, function(e, r, o) {
                        var a = U(e);
                        return o === t ? a ? n in a ? a[n] : a.document.documentElement[r] : e[r] : void(a ? a.scrollTo(i ? ut(a).scrollLeft() : o, i ? o : ut(a).scrollTop()) : e[r] = o)
                    }, e, r, arguments.length, null)
                }
            }), ut.each({
                Height: "height",
                Width: "width"
            }, function(e, n) {
                ut.each({
                    padding: "inner" + e,
                    content: n,
                    "": "outer" + e
                }, function(i, r) {
                    ut.fn[r] = function(r, o) {
                        var a = arguments.length && (i || "boolean" != typeof r),
                            s = i || (r === !0 || o === !0 ? "margin" : "border");
                        return ut.access(this, function(n, i, r) {
                            var o;
                            return ut.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (o = n.documentElement, Math.max(n.body["scroll" + e], o["scroll" + e], n.body["offset" + e], o["offset" + e], o["client" + e])) : r === t ? ut.css(n, i, s) : ut.style(n, i, r, s)
                        }, n, a ? r : t, a, null)
                    }
                })
            }), ut.fn.size = function() {
                return this.length
            }, ut.fn.andSelf = ut.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = ut : (e.jQuery = e.$ = ut, "function" == typeof define && define.amd && define("jquery", [], function() {
                return ut
            }))
        }(window), jQuery
    }), define("lib/jquery.md5", function(e) {
        var t = e("$");
        return function(e) {
            "use strict";

            function t(e, t) {
                var n = (65535 & e) + (65535 & t),
                    i = (e >> 16) + (t >> 16) + (n >> 16);
                return i << 16 | 65535 & n
            }

            function n(e, t) {
                return e << t | e >>> 32 - t
            }

            function i(e, i, r, o, a, s) {
                return t(n(t(t(i, e), t(o, s)), a), r)
            }

            function r(e, t, n, r, o, a, s) {
                return i(t & n | ~t & r, e, t, o, a, s)
            }

            function o(e, t, n, r, o, a, s) {
                return i(t & r | n & ~r, e, t, o, a, s)
            }

            function a(e, t, n, r, o, a, s) {
                return i(t ^ n ^ r, e, t, o, a, s)
            }

            function s(e, t, n, r, o, a, s) {
                return i(n ^ (t | ~r), e, t, o, a, s)
            }

            function l(e, n) {
                e[n >> 5] |= 128 << n % 32, e[(n + 64 >>> 9 << 4) + 14] = n;
                var i, l, c, u, d, p = 1732584193,
                    f = -271733879,
                    h = -1732584194,
                    g = 271733878;
                for (i = 0; i < e.length; i += 16) l = p, c = f, u = h, d = g, p = r(p, f, h, g, e[i], 7, -680876936), g = r(g, p, f, h, e[i + 1], 12, -389564586), h = r(h, g, p, f, e[i + 2], 17, 606105819), f = r(f, h, g, p, e[i + 3], 22, -1044525330), p = r(p, f, h, g, e[i + 4], 7, -176418897), g = r(g, p, f, h, e[i + 5], 12, 1200080426), h = r(h, g, p, f, e[i + 6], 17, -1473231341), f = r(f, h, g, p, e[i + 7], 22, -45705983), p = r(p, f, h, g, e[i + 8], 7, 1770035416), g = r(g, p, f, h, e[i + 9], 12, -1958414417), h = r(h, g, p, f, e[i + 10], 17, -42063), f = r(f, h, g, p, e[i + 11], 22, -1990404162), p = r(p, f, h, g, e[i + 12], 7, 1804603682), g = r(g, p, f, h, e[i + 13], 12, -40341101), h = r(h, g, p, f, e[i + 14], 17, -1502002290), f = r(f, h, g, p, e[i + 15], 22, 1236535329), p = o(p, f, h, g, e[i + 1], 5, -165796510), g = o(g, p, f, h, e[i + 6], 9, -1069501632), h = o(h, g, p, f, e[i + 11], 14, 643717713), f = o(f, h, g, p, e[i], 20, -373897302), p = o(p, f, h, g, e[i + 5], 5, -701558691), g = o(g, p, f, h, e[i + 10], 9, 38016083), h = o(h, g, p, f, e[i + 15], 14, -660478335), f = o(f, h, g, p, e[i + 4], 20, -405537848), p = o(p, f, h, g, e[i + 9], 5, 568446438), g = o(g, p, f, h, e[i + 14], 9, -1019803690), h = o(h, g, p, f, e[i + 3], 14, -187363961), f = o(f, h, g, p, e[i + 8], 20, 1163531501), p = o(p, f, h, g, e[i + 13], 5, -1444681467), g = o(g, p, f, h, e[i + 2], 9, -51403784), h = o(h, g, p, f, e[i + 7], 14, 1735328473), f = o(f, h, g, p, e[i + 12], 20, -1926607734), p = a(p, f, h, g, e[i + 5], 4, -378558), g = a(g, p, f, h, e[i + 8], 11, -2022574463), h = a(h, g, p, f, e[i + 11], 16, 1839030562), f = a(f, h, g, p, e[i + 14], 23, -35309556), p = a(p, f, h, g, e[i + 1], 4, -1530992060), g = a(g, p, f, h, e[i + 4], 11, 1272893353), h = a(h, g, p, f, e[i + 7], 16, -155497632), f = a(f, h, g, p, e[i + 10], 23, -1094730640), p = a(p, f, h, g, e[i + 13], 4, 681279174), g = a(g, p, f, h, e[i], 11, -358537222), h = a(h, g, p, f, e[i + 3], 16, -722521979), f = a(f, h, g, p, e[i + 6], 23, 76029189), p = a(p, f, h, g, e[i + 9], 4, -640364487), g = a(g, p, f, h, e[i + 12], 11, -421815835), h = a(h, g, p, f, e[i + 15], 16, 530742520), f = a(f, h, g, p, e[i + 2], 23, -995338651), p = s(p, f, h, g, e[i], 6, -198630844), g = s(g, p, f, h, e[i + 7], 10, 1126891415), h = s(h, g, p, f, e[i + 14], 15, -1416354905), f = s(f, h, g, p, e[i + 5], 21, -57434055), p = s(p, f, h, g, e[i + 12], 6, 1700485571), g = s(g, p, f, h, e[i + 3], 10, -1894986606), h = s(h, g, p, f, e[i + 10], 15, -1051523), f = s(f, h, g, p, e[i + 1], 21, -2054922799), p = s(p, f, h, g, e[i + 8], 6, 1873313359), g = s(g, p, f, h, e[i + 15], 10, -30611744), h = s(h, g, p, f, e[i + 6], 15, -1560198380), f = s(f, h, g, p, e[i + 13], 21, 1309151649), p = s(p, f, h, g, e[i + 4], 6, -145523070), g = s(g, p, f, h, e[i + 11], 10, -1120210379), h = s(h, g, p, f, e[i + 2], 15, 718787259), f = s(f, h, g, p, e[i + 9], 21, -343485551), p = t(p, l), f = t(f, c), h = t(h, u), g = t(g, d);
                return [p, f, h, g]
            }

            function c(e) {
                var t, n = "";
                for (t = 0; t < 32 * e.length; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
                return n
            }

            function u(e) {
                var t, n = [];
                for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1) n[t] = 0;
                for (t = 0; t < 8 * e.length; t += 8) n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
                return n
            }

            function d(e) {
                return c(l(u(e), 8 * e.length))
            }

            function p(e, t) {
                var n, i, r = u(e),
                    o = [],
                    a = [];
                for (o[15] = a[15] = void 0, r.length > 16 && (r = l(r, 8 * e.length)), n = 0; 16 > n; n += 1) o[n] = 909522486 ^ r[n], a[n] = 1549556828 ^ r[n];
                return i = l(o.concat(u(t)), 512 + 8 * t.length), c(l(a.concat(i), 640))
            }

            function f(e) {
                var t, n, i = "0123456789abcdef",
                    r = "";
                for (n = 0; n < e.length; n += 1) t = e.charCodeAt(n), r += i.charAt(t >>> 4 & 15) + i.charAt(15 & t);
                return r
            }

            function h(e) {
                return unescape(encodeURIComponent(e))
            }

            function g(e) {
                return d(h(e))
            }

            function m(e) {
                return f(g(e))
            }

            function v(e, t) {
                return p(h(e), h(t))
            }

            function y(e, t) {
                return f(v(e, t))
            }
            e.md5 = function(e, t, n) {
                return t ? n ? v(t, e) : y(t, e) : n ? g(e) : m(e)
            }
        }(t), t.md5
    }), define("lib/jquery.repaint", function(e) {
        var t = e("$"),
            n = function() {
                var e = t(this);
                return e.addClass("x-repaint"), e.height(), e.removeClass("x-repaint"), this
            };
        return t.fn.extend({
            repaint: n
        }), n
    }), "object" != typeof JSON && (JSON = {}),
    function() {
        "use strict";

        function f(e) {
            return 10 > e ? "0" + e : e
        }

        function quote(e) {
            return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
                var t = meta[e];
                return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + e + '"'
        }

        function str(e, t) {
            var n, i, r, o, a, s = gap,
                l = t[e];
            switch (l && "object" == typeof l && "function" == typeof l.toJSON && (l = l.toJSON(e)), "function" == typeof rep && (l = rep.call(t, e, l)), typeof l) {
                case "string":
                    return quote(l);
                case "number":
                    return isFinite(l) ? String(l) : "null";
                case "boolean":
                case "null":
                    return String(l);
                case "object":
                    if (!l) return "null";
                    if (gap += indent, a = [], "[object Array]" === Object.prototype.toString.apply(l)) {
                        for (o = l.length, n = 0; o > n; n += 1) a[n] = str(n, l) || "null";
                        return r = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + s + "]" : "[" + a.join(",") + "]", gap = s, r
                    }
                    if (rep && "object" == typeof rep)
                        for (o = rep.length, n = 0; o > n; n += 1) "string" == typeof rep[n] && (i = rep[n], r = str(i, l), r && a.push(quote(i) + (gap ? ": " : ":") + r));
                    else
                        for (i in l) Object.prototype.hasOwnProperty.call(l, i) && (r = str(i, l), r && a.push(quote(i) + (gap ? ": " : ":") + r));
                    return r = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + s + "}" : "{" + a.join(",") + "}", gap = s, r
            }
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        });
        var cx, escapable, gap, indent, meta, rep;
        "function" != typeof JSON.stringify && (escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, JSON.stringify = function(e, t, n) {
            var i;
            if (gap = "", indent = "", "number" == typeof n)
                for (i = 0; n > i; i += 1) indent += " ";
            else "string" == typeof n && (indent = n);
            if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
            return str("", {
                "": e
            })
        }), "function" != typeof JSON.parse && (cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, JSON.parse = function(text, reviver) {
            function walk(e, t) {
                var n, i, r = e[t];
                if (r && "object" == typeof r)
                    for (n in r) Object.prototype.hasOwnProperty.call(r, n) && (i = walk(r, n), void 0 !== i ? r[n] = i : delete r[n]);
                return reviver.call(e, t, r)
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
                    return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    }(), define("lib/json", function(e, t, n) {
        n.exports = JSON
    }), define("lib/net", function(require, exports, module) {
        var $ = require("$"),
            util = require("util"),
            reporter = require("lib/reporter"),
            console = window.console,
            net = {
                ajax: function(e) {
                    e = $.extend({}, e);
                    var t = new Date;
                    e.url = this._addParam(e.url, {
                        uin: util.getUin(),
                        csrfCode: util.getACSRFToken(),
                        t: t.getTime()
                    });
                    var n = $.Deferred();
                    return $.ajax($.extend({
                        dataType: "json"
                    }, e)).done(function(i) {
                        var r = i.code;
                        0 === r ? n.resolve(i) : (e.skipGlobalException || (7 == r || 9 == r || 15 == r || 21 == r) && require.async("widget/login/login", function(e) {
                            e.show()
                        }), i.uiMsg && (console && console.warn && console.warn("错误 code=" + r + ",msg=" + i.msg), i.msg = i.uiMsg + "[#" + r + "]", delete i.uiMsg), n.reject(i));
                        var o = new Date,
                            a = i.code,
                            s = /action=/.test(e.url) ? e.url : e.url + "&action=" + e.data.action;
                        reporter.retCode(s, a, o - t)
                    }).fail(function() {
                        n.reject()
                    }), n
                },
                send: function(cgiConfig, opt) {
                    var _self = this,
                        _cgiConfig = cgiConfig,
                        _data = opt.data || {},
                        _url = "",
                        _startTime = null,
                        _cb = null,
                        _global = opt.global;
                    return _cgiConfig || (_cgiConfig = {
                        url: opt.url,
                        method: opt.method
                    }), _cgiConfig ? (_startTime = new Date, _cb = function(ret) {
                        "string" == typeof ret && (ret = eval("(" + ret + ")"), ret && ret.uiMsg && (console && console.warn && 0 !== ret.code && console.warn("错误 code=" + ret.code + ",msg=" + ret.msg), ret.msg = ret.uiMsg + "[#" + ret.code + "]", delete ret.uiMsg));
                        var _endTime = new Date,
                            _code = ret.code;
                        reporter.retCode(_url, _code, _endTime - _startTime), opt.cb && opt.cb(ret)
                    }, _url = this._addParam(_cgiConfig.url, {
                        uin: util.getUin(),
                        csrfCode: util.getACSRFToken(),
                        t: (new Date).getTime()
                    }), _cgiConfig.method && "post" == _cgiConfig.method.toLowerCase() ? this.post(_url, _data, _cb, _global) : this.get(_url, _data, _cb, _global)) : void 0
                },
                get: function(e, t, n, i) {
                    return this._ajax(e, t, "GET", n, i)
                },
                post: function(e, t, n, i) {
                    return this._ajax(e, t, "POST", n, i)
                },
                _ajax: function(e, t, n, i, r) {
                    return void 0 == r && (r = !0), $.ajax({
                        type: n,
                        url: e,
                        data: t,
                        global: r,
                        success: function(e) {
                            i(e)
                        },
                        error: function(e) {
                            window.isOnload && i({
                                ret: e.status
                            })
                        }
                    })
                },
                _addParam: function(e, t) {
                    var n = /\?/.test(e) ? "&" : "?";
                    return e += n + util.objectToParams(t)
                }
            };
        module.exports = net
    }), define("lib/observable", function(e, t, n) {
        var i = function() {
                this.listeners && (this.on(this.listeners), delete this.listeners), this.events || (this.events = {})
            },
            r = i.prototype = {
                fireEvent: function() {
                    if (this.eventsSuspended !== !0) {
                        var e = this.events[arguments[0].toLowerCase()];
                        if ("object" == typeof e) return e.fire.apply(e, Array.prototype.slice.call(arguments, 1))
                    }
                    return !0
                },
                filterOptRe: /^(?:scope)$/,
                addListener: function(e, t, n, i) {
                    if ("object" != typeof e) {
                        i = i && "boolean" != typeof i ? i : {}, e = e.toLowerCase();
                        var r = this.events[e] || !0;
                        "boolean" == typeof r && (r = new o(this, e), this.events[e] = r), r.addListener(t, n, i)
                    } else {
                        i = e;
                        for (var a in i) this.filterOptRe.test(a) || ("function" == typeof i[a] ? this.addListener(a, i[a], i.scope, i) : this.addListener(a, i[a].fn, i[a].scope, i[a]))
                    }
                },
                removeListener: function(e, t, n) {
                    var i = this.events[e.toLowerCase()];
                    "object" == typeof i && i.removeListener(t, n)
                },
                purgeListeners: function() {
                    for (var e in this.events) "object" == typeof this.events[e] && this.events[e].clearListeners()
                },
                hasListener: function(e) {
                    var t = this.events[e];
                    return "object" == typeof t && t.listeners.length > 0
                }
            };
        r.trigger = r.fireEvent, r.on = r.addListener, r.un = r.removeListener, r.removeAllListeners = r.purgeListeners;
        var o = function(e, t) {
            this.name = t, this.obj = e, this.listeners = []
        };
        o.prototype = {
            addListener: function(e, t, n) {
                if (t = t || this.obj, !this.isListening(e, t)) {
                    var i = this.createListener(e, t, n);
                    this.firing ? (this.listeners = this.listeners.slice(0), this.listeners.push(i)) : this.listeners.push(i)
                }
            },
            createListener: function(e, t, n) {
                n = n || {}, t = t || this.obj;
                var i = {
                        fn: e,
                        scope: t,
                        options: n
                    },
                    r = e;
                return i.fireFn = r, i
            },
            findListener: function(e, t) {
                t = t || this.obj;
                for (var n = this.listeners, i = 0, r = n.length; r > i; i++) {
                    var o = n[i];
                    if (o.fn == e && o.scope == t) return i
                }
                return -1
            },
            isListening: function(e, t) {
                return -1 != this.findListener(e, t)
            },
            removeListener: function(e, t) {
                var n;
                return -1 != (n = this.findListener(e, t)) ? (this.firing ? (this.listeners = this.listeners.slice(0), this.listeners.splice(n, 1)) : this.listeners.splice(n, 1), !0) : !1
            },
            clearListeners: function() {
                this.listeners = []
            },
            fire: function() {
                var e = this.listeners,
                    t = e.length;
                if (t > 0) {
                    this.firing = !0;
                    for (var n = (Array.prototype.slice.call(arguments, 0), 0); t > n; n++) {
                        var i = e[n];
                        if (i.fireFn.apply(i.scope || this.obj || window, arguments) === !1) return this.firing = !1, !1
                    }
                    this.firing = !1
                }
                return !0
            }
        }, n.exports = i
    }), define("lib/reporter", function(e, t, n) {
        var i = e("util"),
            r = function() {
                var e = new Image,
                    t = function(t) {
                        e.onload = e.onerror = e.onabort = function() {
                            e.onload = e.onerror = e.onabort = null, e = null
                        }, e.src = t
                    };
                return t
            },
            o = {
                _domain: "app.qcloud.com",
                isSandboxOrDebug: function() {
                    return "sandbox.weixin.qcloud.com" == location.host || /\/debug/.test(location.href)
                },
                init: function(e) {
                    this._domain = e.domain
                },
                retCode: function(e, t, n) {
                    if (!this.isSandboxOrDebug()) {
                        var o = {
                                domain: "weixin.qcloud.com",
                                cgi: "",
                                type: "",
                                code: "",
                                time: "",
                                _: +new Date
                            },
                            a = /\/cgi\/(.*\?)/.exec(e),
                            s = /(action=.*)/.exec(e);
                        if (a && s) {
                            o.cgi = a[1] + s[1].split("&")[0], o.type = 0 == t ? 1 : 2, o.code = t, o.time = n, e = "http://c.isdspeed.qq.com/code.cgi?" + i.objectToParams(o);
                            var l = r();
                            l(e)
                        }
                    }
                },
                speed: function(e, t) {
                    if (!this.isSandboxOrDebug()) {
                        t = "[object Array]" == Object.prototype.toString.call(t) ? t : [t];
                        for (var n = {
                                flag1: 7721,
                                flag2: 161,
                                flag3: e
                            }, o = 1; o <= t.length; o++) n[o] = t[o - 1];
                        var a = "http://isdspeed.qq.com/cgi-bin/r.cgi?" + i.objectToParams(n),
                            s = r();
                        s(a)
                    }
                },
                click: function(e) {
                    var t = {
                            dm: this._domain + ".hot",
                            url: "/wxcloud/hottag/",
                            tt: "-",
                            hottag: e,
                            hotx: 9999,
                            hoty: 9999,
                            _: Math.random()
                        },
                        n = "http://pinghot.qq.com/pingd?" + i.objectToParams(t, !0),
                        o = r();
                    o(n)
                },
                basic: function(e) {
                    e = e || "", /^\//.test(e) || (e = "/" + e);
                    var t = {
                            dm: this._domain,
                            url: "/wxcloud" + e,
                            _: +new Date
                        },
                        n = "http://pingfore.qq.com/pingd?" + i.objectToParams(t, !0),
                        o = r();
                    o(n)
                }
            };
        n.exports = o
    }), define("lib/text", function(e, t, n) {
        n.exports = {
            escapeHTML: function() {
                var e = {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        "'": "&#39;",
                        '"': "&quot;",
                        "/": "&#x2F;"
                    },
                    t = /[&<>'"\/]/g;
                return function(n) {
                    return n ? n.replace(t, function(t) {
                        return e[t] || t
                    }) : ""
                }
            }(),
            strByteLen: function(e) {
                if (e) {
                    for (var t = 0, n = 0, i = e.length; i > n; n++) {
                        var r = e.charCodeAt(n);
                        if (255 > r) t++;
                        else {
                            var o = r >= 65377 && 65439 >= r || r >= 65512 && 65518 >= r;
                            t += o ? 1 : 2
                        }
                    }
                    return t
                }
                return 0
            },
            byteLenSub: function() {
                var e = /[^\x00-\xFF]/;
                return function(t, n, i) {
                    try {
                        var r = 0;
                        n *= 2, i = "string" == typeof i ? i : "..";
                        for (var o, a = this.strByteLen(i), s = n - a, l = 0, c = t.length; c > l; l++)
                            if (e.test(t.charAt(l)) ? r += 2 : r++, !o && r >= s && (o = l + 1), r > n) return t.substr(0, o) + i;
                        return t
                    } catch (u) {
                        return t
                    }
                }
            }()
        }
    }), define("lib/util", function(e, t, n) {
        var i = e("$"),
            r = "",
            o = "",
            a = "";
        window.console = window.console || {
            log: function() {}
        };
        var s = {
            proxy: function(e, t) {
                return function() {
                    e.apply(t, arguments)
                }
            },
            cookie: {
                get: function(e) {
                    var t = new RegExp("(?:^|;+|\\s+)" + e + "=([^;]*)"),
                        n = document.cookie.match(t);
                    return n ? n[1] : ""
                },
                set: function(e, t, n, i, r) {
                    if (r) {
                        var o = new Date;
                        o.setTime(o.getTime() + 36e5 * r)
                    }
                    return document.cookie = e + "=" + t + "; " + (r ? "expires=" + o.toGMTString() + "; " : "") + (i ? "path=" + i + "; " : "path=/; ") + (n ? "domain=" + n + ";" : "domain=" + document.domain + ";"), !0
                },
                del: function(e, t, n) {
                    document.cookie = e + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (n ? "path=" + n + "; " : "path=/; ") + (t ? "domain=" + t + ";" : "domain=" + document.domain + ";")
                }
            },
            tmpl: function() {
                function e(e, t) {
                    if (t)
                        for (var n in t) {
                            var i = new RegExp("<%#" + n + "%>", "g");
                            e = e.replace(i, t[n])
                        }
                    return e
                }
                var t = {};
                return function n(i, r, o) {
                    o = o || {};
                    var a = o.key,
                        s = o.mixinTmpl,
                        l = !/\W/.test(i);
                    a = a || (l ? i : null);
                    var c = a ? t[a] = t[a] || n(e(l ? document.getElementById(i).innerHTML : i, s)) : new Function("obj", "var _p_=[],print=function(){_p_.push.apply(_p_,arguments);};with(obj){_p_.push('" + i.replace(/[\r\t\n]/g, " ").split("\\'").join("\\\\'").split("'").join("\\'").split("<%").join("	").replace(/\t=(.*?)%>/g, "',$1,'").replace(/\t-(.*?)%>/g, "<escapehtml>',$1,'</escapehtml>").split("	").join("');").split("%>").join("_p_.push('") + "');}return _p_.join('').replace(new RegExp('<escapehtml>(.*?)</escapehtml>', 'g'), function($1,$2){return $2.replace(/&(?!w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;')})");
                    return r ? c(r) : c
                }
            }(),
            getACSRFToken: function() {
                if (!r) {
                    var e = this.cookie.get("skey"),
                        t = 5381;
                    if (!e) return "";
                    for (var n = 0, i = e.length; i > n; ++n) t += (t << 5) + e.charCodeAt(n);
                    r = 2147483647 & t
                }
                return r
            },
            setACSRFToken: function(e) {
                r = e
            },
            getProductId: function() {
                return o || this.cookie.get("productId")
            },
            setProductId: function(e) {
                o = e, "" === e ? this.cookie.del("productId") : this.cookie.set("productId", e)
            },
            getProductName: function() {
                return a
            },
            setProductName: function(e) {
                a = e
            },
            getUin: function() {
                return parseInt(this.cookie.get("uin").replace(/\D/g, ""), 10) || ""
            },
            paramsToObject: function(e) {
                var t, n, r, o, a, s = {};
                return "object" == typeof e ? e : (r = e || window.location.search, r = r.replace("?", ""), t = r.split("&"), i(t).each(function(e, t) {
                    n = t.split("="), o = n[0], a = n.slice(1).join("="), s[decodeURIComponent(o)] = decodeURIComponent(a)
                }), s)
            },
            objectToParams: function(e, t) {
                var n = i.param(e);
                return t && (n = decodeURIComponent(n)), n
            },
            isMobile: function() {
                return this.isAndroid() || this.isIOS()
            },
            isAndroid: function() {
                return /android/i.test(window.navigator.userAgent)
            },
            isIOS: function() {
                return /iPod|iPad|iPhone/i.test(window.navigator.userAgent)
            },
            isOldIe: function(e) {
                var t = /msie [\w.]+/.test(navigator.userAgent.toLowerCase());
                if (e) {
                    var n = document.documentMode;
                    t = t && (!n || 9 > n)
                }
                return t
            },
            getHref: function(e) {
                var t = e.getAttribute("href", 2);
                return t = t.replace("http://" + location.host, "")
            },
            getCurrentTime: function(e) {
                var t = new Date,
                    n = t.getFullYear(),
                    i = t.getMonth() + 1,
                    r = t.getDate(),
                    o = t.getHours(),
                    a = t.getMinutes(),
                    s = t.getSeconds(),
                    l = function(e) {
                        return e >= 10 ? e : "0" + e
                    },
                    c = n + "-" + l(i) + "-" + l(r);
                return e && (c += " " + l(o) + ":" + l(a) + ":" + l(s)), c
            },
            dateDiff: function(e, t) {
                try {
                    return e = new Date(e.replace(/\-/g, "/")), t = new Date(t.replace(/\-/g, "/")), Date.parse(t) - Date.parse(e)
                } catch (n) {
                    return 31536e6
                }
            },
            subStrTime: function(e) {
                var t = "";
                return e && (t = e.substring(0, 10)), t
            },
            getModifyTime: function(e) {
                var t = this.subStrTime(e);
                return t || (t = this.getCurrentTime()), t
            },
            formatTime: function(e, t) {
                var n = new Date(e),
                    i = {
                        "M+": n.getMonth() + 1,
                        "d+": n.getDate(),
                        "h+": n.getHours(),
                        "m+": n.getMinutes(),
                        "s+": n.getSeconds(),
                        "q+": Math.floor((n.getMonth() + 3) / 3),
                        S: n.getMilliseconds()
                    };
                /(y+)/.test(t) && (t = t.replace(RegExp.$1, (n.getFullYear() + "").substr(4 - RegExp.$1.length)));
                for (var r in i) new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[r] : ("00" + i[r]).substr(("" + i[r]).length)));
                return t
            },
            cloneObject: function(e) {
                var t = e.constructor === Array ? [] : {};
                for (var n in e) e.hasOwnProperty(n) && (t[n] = "object" == typeof e[n] ? this.cloneObject(e[n]) : e[n]);
                return t
            },
            insertStyle: function(e, t) {
                var n = function() {
                    var n = document,
                        i = n.createElement("style");
                    i.type = "text/css", t && (i.id = t), document.getElementsByTagName("head")[0].appendChild(i), e && ("object" == typeof e && (e = e.join("")), i.styleSheet ? i.styleSheet.cssText = e : i.appendChild(document.createTextNode(e)))
                };
                t ? !document.getElementById(t) && n() : n()
            },
            getQuery: function(e, t) {
                1 == arguments.length && (t = e, e = location.search.slice(1));
                for (var n = (e.split("?")[1] || "").split("&"), i = {}, r = 0; r < n.length; r++) {
                    var o = n[r].split("=");
                    i[o[0]] = o[1]
                }
                return i[t]
            },
            getCosImgPath: function(e, t) {
                var n = this.getQuery(e, "accessId"),
                    i = this.getQuery(e, "bucketId"),
                    r = this.getQuery(e, "cosFile"),
                    t = t || "pic",
                    o = ["http://cos.myqcloud.com", n, i, t, r].join("/");
                return o
            },
            getCosImgPathPrefix: function(e, t) {
                if (!/^http\:\/\/cos\.myqcloud\.com/.test(e)) return e;
                var n = e.split("/"),
                    i = n.pop();
                return n.push(/^(?:s|cover|b)*_/.test(i) ? i : [t || "s_", i].join("")), n.join("/")
            },
            listenInput: function(t, n, r) {
                e.async("event", function(e) {
                    var o = i('<input type="text">')[0],
                        a = {};
                    a[t] = n, "oninput" in o ? e.addCommonEvent("input", a) : e.addCommonEvent("keyup", a), r && i(document).off("editorExecCommand", r).on("editorExecCommand", r)
                })
            },
            contactCustomer: function(e, t) {
                var n = "",
                    i = e || t || "800033878",
                    r = function(e) {
                        return /^(400|800)/.test(e)
                    };
                n = r(i) ? "http://crm2.qq.com/page/portalpage/wpa.php?uin=" + i + "&f=1&ty=1&ap=000018{$SP|146|209$}&as=2&v=2&sp=" : "http://wpa.qq.com/msgrd?v=3&uin=" + i + "&site=qq&menu=yes", n && window.open(n)
            },
            linkJump: function(e) {
                var t = this.cookie.get("skey");
                t && (e = "http://ptlogin2.qq.com/jump?uin=" + this.getUin() + "&skey=" + t + "&u1=" + encodeURIComponent(e)), window.open(e)
            }
        };
        n.exports = s
    }), define("lib/xExtend", function(e, t) {
        function n() {
            {
                var e = arguments,
                    t = e[0],
                    n = e[1];
                e[2]
            }
            if ("function" == typeof t) {
                if (n = n || {}, /function|number|string|undefined/.test(typeof n)) return;
                var i, r;
                i = "function" != typeof n._constructor ? function() {
                    t.apply(this, arguments)
                } : function() {
                    r = arguments, t.apply(this, r), n._constructor.apply(this, r)
                };
                var o = function() {};
                o.prototype = t.prototype, i.prototype = new o, i.prototype.constructor = i, i.prototype.base = t;
                var a = /^name|_constructor|static|base$/;
                for (var s in n) a.test(s) || (i.prototype[s] = n[s]);
                for (var s in t.prototype) 0 == s.indexOf("$") && (i.prototype[s.slice(1)] = t.prototype[s]);
                if (n["static"])
                    for (var s in n["static"]) i[s] = n["static"][s];
                if ("undefined" != typeof n.name && /^[a-zA-Z]\w*$/.test(n.name)) {
                    var l = "object" == typeof n.scope && n.scope || window;
                    l[n.name] = i
                }
                return i
            }
        }
        t.define = n
    }), define("editor/ve", function(require, exports, module) {
        var ve = {};
        ve.util = ve.util || {}, ve.lib = ve.lib || {}, ve.$ = function(e) {
                return document.getElementById(e)
            },
            function(v) {
                function Create(e) {
                    var t = {
                        height: "300px",
                        width: "100%",
                        commands: ["bold", "italic", "underline", "|", "FontSize", "forecolor", "backcolor", "|", "justifyleft", "justifycenter", "justifyright", "|", "image", "createLink"],
                        container: document.createElement("div"),
                        fixedToolbar: 1,
                        floatToolbar: 1,
                        zoomEdit: 1
                    };
                    for (var n in e) t[n] = e[n];
                    this.config = t, this.id = ++uniqid;
                    var i = "ve_" + this.id,
                        r = "st_" + this.id,
                        o = "fl_" + this.id,
                        a = "toolbar_wrapper_" + this.id;
                    this.containerElement = t.container, this.containerElement.innerHTML = v.util.tmpl(editorTpl, {
                        eId: i,
                        sId: r,
                        fId: o,
                        tbwId: a,
                        config: t
                    }), this.editorElement = v.$(i), this.statusElement = v.$(r), this.floatElement = v.$(o), this.fixedToolbarWrapperEl = v.$(a), this.panelinView = [], this._init(), editors[editors] = this
                }
                var uniqid = 0,
                    editors = {},
                    initFn = [],
                    destroyFn = [],
                    readyFn = [],
                    iconUrl = "http://qzonestyle.gtimg.cn/open_proj/proj_qcloud_v2/ac/light/dashboard/toolbar.png",
                    editorTpl = '<div  style="width:<%=config.width%>;" class="ve-editor-wrap"><div class="ve-fixed-toolbar" id="<%=tbwId%>"></div><% if (config.fixedToolbar) { var extraCls = " has-fixed-toolbar"} %><div _event="ve-edit" style="height:<%=config.height%>;"  id="<%=eId%>" contenteditable="true" class="ve-editor<%=extraCls%>"></div><div class="ve-statusbar" id="<%=sId%>" style="display:none;"><span>加载中……</span><a _event="ve-close" class="close">关闭</a></div><div class="ve-float" id="<%=fId%>" style="display:none;"></div></div>';
                Create.prototype = {
                    _init: function() {
                        var e = this;
                        v.util.insertStyleSheet(v.util.tmpl(".ve-editor-wrap{          background:#fff;        position:relative;        padding:0px;        overflow-y:auto;        position:relative;    }    .ve-editor{        word-break:break-all;        padding:10px;        outline:none;        overflow-x:hidden;        min-height:100px;        line-height:normal;    }    .ve-editor strong{        font-weight:bold;    }    .ve-editor em{        font-style:italic;    }    .ve-statusbar{        position:absolute;        height:25px;        background:#D9DDE2;        top:0px;        transition: opacity .5s ease-in-out;        font-size:13px;        opacity:0;    }    .ve-float{        position:absolute;        z-index:999;    }    .ve-statusbar span{        float:left;        margin:5px 10px;        color:#7F7F7F;    }    .ve-statusbar .close{        float:left;        margin:5px 10px;        cursor:pointer;        color:#00c;    }    .ve-toolbar{        font-size: 0px;        padding: 3px;        height: 26px;        line-height: 26px;        background-color: #FFF;        -webkit-box-shadow: 0 3px rgba(0, 0, 0, 0.1);        -moz-box-shadow: 0 3px rgba(0,0,0,.1);        box-shadow: 0 3px rgba(0, 0, 0, 0.1);        border: solid 1px #CBCBCB;    }    .ve-fixed-toolbar .ve-toolbar{        -webkit-box-shadow: none;        -moz-box-shadow: none;        box-shadow: none;        width: auto;    }    .ve-toolbar a{        width: 25px;        height: 24px;        display: inline-block;        background-color: #FFF;        border: 1px solid #FFF;        border-radius: 2px;        text-align: center;        line-height: 24px;        position: relative;        font-size: 12px;    }    .ve-toolbar .active,.ve-toolbar a:hover{        border:1px solid #939598;        background-image: -webkit-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));        background-image: -moz-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));        background-image: -o-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));        background-image: -ms-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));        background-image: linear-gradient(to top, rgba(0,0,0,.05), rgba(255,255,255,.05))    }       .ve-toolbar a span{        display: inline-block;        width: 20px;        height: 20px;        pointer-events: none;        font-size: 0;        line-height: 0;        overflow: hidden;        zoom: 1;        vertical-align: middle;        background: url(<%=icon%>) no-repeat;    }    .ve-toolbar .bold{        background-position: -20px -20px;    }    .ve-toolbar .strikethrough{         background-position: -20px -160px;    }    .ve-toolbar .underline{         background-position: -20px -60px;    }    .ve-toolbar .forecolor{         background-position: -20px -80px;    }    .ve-toolbar .italic{         background-position: -20px -40px;    }    .ve-toolbar .backcolor{         background-position: 0px -180px;    }     .ve-toolbar .FontSize{         background-position: -20px -221px;    }     .ve-toolbar .createLink{         background-position: -20px -200px;    }    .ve-toolbar .justifyleft{         background-position: -20px -100px;    }    .ve-toolbar .justifycenter{         background-position: -20px -120px;    }    .ve-toolbar .justifyright{         background-position: -20px -140px;    }    .ve-toolbar .image{        background-position: -20px -243px;    }    .ve-panel-wrap{        transition: opacity .2s ease-in-out;        opacity:0;        z-index:999;    }    .ve-panel{        background-color:#fff;        border: 1px solid #ccc;        box-shadow: 0 2px 4px rgba(0,0,0,.15);        padding: 10px;    }    .ve-color{        width: 210px;        height: 115px;    }    .ve-color a{        cursor: pointer;        display: inline-block;        height: 15px;        width: 15px;        box-shadow: 0 1px 1px rgba(0, 0, 0, .05) inset ;        border:2px solid #fff;        font-size:0;        float: left;    }    .ve-color a:hover{        border:2px solid #548dd4;    }    .ve-fontsize{        width: 165px;        padding: 10px 0px;        overflow:auto;    }    .ve-fontsize a{        cursor: pointer;        display: block;        color: #000;        padding: 4px 10px;        text-decoration:none;    }    .ve-fontsize a:hover{        background-color:#eee;    }    .ve-createLink{        width:360px;    }    .ve-uploadimg{        width:365px;        padding:0 0 10px;    }    .ve-toolbar-separator{         color: #CCCCCC;        font-size: 12px;        margin: 0 5px;    }    .has-fixed-toolbar{        border: 1px solid #CBCBCB;        border-top: none;    }    .ve-editor img {        max-width:100%    }    .ve-toolbar a.zoom-link{        position:absolute;         right:10px;        width:56px    }    .ve-maximize .ve-editor-wrap{        position: fixed;        left: 100px;        top: 100px;        right: 100px;        bottom: 100px;        z-index: 1100    }    .ve-maximize .slide-panel, .ve-maximize .main{        overflow: inherit!important    }    .ve-maximize-mask{        position:fixed;        left:0;        top:0;        width:100%;        height:100%;        z-index:1000;        background:#000;    }    .ve-maximize .ve-fixed-toolbar .ve-toolbar{        border:none;        border-bottom:1px solid #cbcbcb    }    .ve-maximize .has-fixed-toolbar{        border:none    }    .ve-editor p {        margin: 1em 0;    }    .ve-editor b, .ve-editor strong {        font-weight: bold;    }    .ve-editor i, .ve-editor em {        font-style: italic;    }    .error .ve-toolbar{        border-top:none;        border-left:none;        border-right:none;    }    .error .has-fixed-toolbar{        border:none;    }", {
                            ua: v.ua,
                            icon: iconUrl
                        }), "editorStyle");
                        for (var t, n = 0; t = destroyFn[n]; n++) t.call(this);
                        initFn.sort(function(e, t) {
                            return e.index - t.index
                        });
                        for (var t, n = 0; t = initFn[n]; n++) t.call(this);
                        var i = setInterval(function() {
                            if (document.body) {
                                for (var t, n = 0; t = readyFn[n]; n++) t.call(e);
                                clearInterval(i), readyFn = []
                            }
                        }, 100)
                    },
                    getContent: function() {
                        return this.editorElement.innerHTML
                    },
                    getTitle: function() {
                        var e = document.createElement("div");
                        e.innerHTML = this.editorElement.innerHTML;
                        for (var t, n = e.getElementsByTagName("p"), i = 0; t = n[i]; i++) "size" == t.className && (t.innerHTML = "");
                        e.innerHTML = e.innerHTML.replace(/<\!\-\-no gettitle start\-\->[\s\S]*<\!\-\-no gettitle end\-\->/gi, "");
                        var r = e.innerText || e.textContent || "";
                        return r = r.replace(/(^\s+|\s+$)/g, "").substr(0, 40), r.split(/(\r\n|\r|\n)/)[0]
                    },
                    setContent: function(e, t, n) {
                        this.editorElement.innerHTML = n ? e : this.filterHtml(e), t && this.focus()
                    },
                    focus: function() {
                        this.setFocusAt(this.editorElement)
                    },
                    onReady: function(e) {
                        readyFn.push(e)
                    },
                    appendTo: function(e) {
                        e.appendChild(this.editorElement)
                    },
                    resize: function(e) {
                        for (var t in e) this.editorElement.style[t] = e[t]
                    },
                    filterHtml: function(e) {
                        return v.util.filterHtml(e)
                    },
                    uploadImage: function(imageBlob, url, options) {
                        var _self = this,
                            Upload = ve.lib.Upload,
                            loader = new Upload({
                                url: url,
                                name: "image",
                                onprogress: function(e, t, n) {
                                    if (!options.progress || options.progress(e, t, n)) {
                                        var i = parseInt(t / n * 100);
                                        i > 99 && (i = 99), _self.displayStatusBar("图片上传中：" + i + "%")
                                    }
                                },
                                oncomplete: function(data) {
                                    data = eval("(" + data + ")"), options.complete && options.complete(data)
                                }
                            });
                        loader.addFile(imageBlob), loader.send()
                    },
                    isEmpty: function() {
                        return "" == this.editorElement.innerHTML.replace(/<(?!img|embed).*?>/gi, "").replace(/&nbsp;/gi, "").replace(/\r\n|\n|\r/g, "")
                    },
                    zoomEdit: function(e) {
                        var t = require("$"),
                            n = t(this.containerElement).find(".ve-editor-wrap"),
                            i = this.config,
                            e = n.find(".zoom-link"),
                            r = t(this.editorElement),
                            o = t("body");
                        if (o.hasClass("ve-maximize")) o.removeClass("ve-maximize"), n.width(i.width), r.height(i.height), e.text("放大编辑"), t("#veMask").remove();
                        else {
                            var a = t("<div/>").attr({
                                id: "veMask",
                                _event: "ve-maximize-mask",
                                "class": "ve-maximize-mask"
                            });
                            a.css("opacity", "0.5"), a.insertBefore(n), o.addClass("ve-maximize");
                            var s = t(this.fixedToolbarWrapperEl).outerHeight() || 0;
                            n.width("auto"), r.height(n.height() - s - 21), e.text("缩小编辑")
                        }
                    }
                }, v.$extend = function(e, t) {
                    var t = t || 999;
                    for (var n in e) "$" == n.charAt(0) ? v[n] = e[n] : /^_init/.test(n) ? (e[n].index = t, initFn.push(e[n])) : /^_destroy/.test(n) ? destroyFn.push(e[n]) : Create.prototype[n] = e[n]
                }, v.Create = Create, (new Image).src = iconUrl
            }(ve),
            function(e) {
                var t = '<div  class="ve-toolbar" unselectable="on"><% for(var i=0,pl;pl = plugins[i];i++) { %><% if (pl == "|") { %><span class="ve-toolbar-separator">|</span><% } else { %><a href="javascript:;" title="<%=(pl.description+(pl.shortcut?"("+pl.shortcut.join("+")+")":""))%>" command="<%=pl.command%>" _event="ve-command" class="<%=prefix%>_tool_<%=pl.command%>"  hidefocus="true"><span class="<%=pl.className%>"></span></a><% } %><% } %><% if (zoomEdit) {%><a href="javascript:;" class="zoom-link" _event="ve-zoom">放大编辑</a><% } %></div>',
                    n = [],
                    i = !1;
                e.$extend({
                    _initToolbar: function() {
                        var i = this,
                            r = function(t) {
                                e.util.bindEvt(t, "click", {
                                    "ve-command": function() {
                                        var e = this.getAttribute("command");
                                        i.execCommand(e), i.updateToolStat()
                                    }
                                })
                            };
                        this.config.floatToolbar && (this.toolbarElement = this.createToolPanel(e.util.tmpl(t, {
                            plugins: this.plugins,
                            zoomEdit: "",
                            prefix: "float"
                        }), this.id), r(this.toolbarElement)), this.config.fixedToolbar && (this.fixedToolbarWrapperEl.innerHTML = e.util.tmpl(t, {
                            plugins: this.plugins,
                            zoomEdit: this.config.zoomEdit,
                            prefix: "fixed"
                        }), r(this.fixedToolbarWrapperEl)), this.onReady(function() {
                            for (var e, t = i.getPanelContainer(), r = 0; e = n[r]; r++) e && t.appendChild(e)
                        })
                    },
                    _destroyThis: function() {
                        n = []
                    },
                    getPanelContainer: function() {
                        var e = document.getElementById("vePanelContainer");
                        return e || (e = document.createElement("div"), e.id = "vePanelContainer", document.body.appendChild(e)), e
                    },
                    displayStatusBar: function(t) {
                        t ? (this.statusElement.firstChild.innerHTML = t, this.statusElement.style.display = "", this.statusElement.style.opacity = 1) : e.util.hide(this.statusElement, 200)
                    },
                    displayFloatDiv: function(t, n) {
                        if (t) {
                            var i = e.util.getPostion(n),
                                r = e.util.getPostion(this.editorElement),
                                o = this.floatElement;
                            o.innerHTML = t, o.style.top = i.top - r.top + "px", o.style.left = i.left - r.left + "px", o.style.display = "", this.setEventHdl("floatElement", "del-img", function() {
                                n.parentNode.removeChild(n)
                            })
                        } else o.style.display = "none"
                    },
                    displayPanel: function(t, n) {
                        var i = this;
                        n = n || {}, t && (t.tm && (e.util.clear(t.tm), t.tm = null), t.uniqid || (t.uniqid = "u_" + +new Date));
                        for (var r, o = 0; r = this.panelinView[o]; o++) t && r.uniqid == t.uniqid || (r.blur(), e.util.hide(r, 200), this.panelinView.splice(o, 1), this.clearCatchBodyClick());
                        if (!t) return i.forbid = !0, void e.util.hide(i.toolbarElement, n.delay, function() {
                            i.forbid = !1
                        });
                        t.style.display = "";
                        var a = e.util.getPostion(t),
                            s = e.util.getPostion(this.editorElement),
                            l = e.util.getPostion(),
                            c = Math.max(document.body.scrollTop, document.documentElement.scrollTop),
                            u = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
                            d = Math.max(document.documentElement.clientHeight || document.body.clientHeight),
                            p = 0,
                            f = 0;
                        if (i.catchBodyClick(t), n.panel)
                            if (this.panelinView.push(t), n.position)
                                if (n.position.auto) n.position.x = Math.max(parseInt((s.width - a.width) / 2), 0), n.position.y = Math.max(parseInt((s.height - a.height) / 2), 0), p += n.position.x + s.left, f += n.position.y + s.top, c > f && (f = 0);
                                else if (n.position.relative) {
                            var h = e.util.getPostion(n.position.relative),
                                g = n.position.deviation || {};
                            p += h.left + (g.x || 0), f += h.bottom + (g.y || 0)
                        } else p += n.position.x || 0, f += n.position.y || 0;
                        else p += l.left, f += l.top + 30;
                        else {
                            var m = this.range.getBoundingClientRect();
                            p += m.left, f += m.bottom + 5
                        }
                        p + a.width > s.left + s.width && (p -= a.width - (n.panel ? 27 : -5)), f + a.height > d && (f -= a.height + 33), p += u, f += c, t.style.opacity = 1, n.keep || (t.style.left = p + "px", t.style.top = f + "px", n.panel || this.updateToolStat())
                    },
                    clickHandler: function() {
                        this.displayPanel()
                    },
                    catchBodyClick: function() {
                        var e = this,
                            t = null;
                        if (!i) {
                            this.clickHandler = function(n) {
                                var i = n.target || n.srcElement,
                                    r = i.parentNode,
                                    o = r && /(ve-toolbar|float_tool)/.test(r.className);
                                return o ? !1 : void(t && new Date - t > 100 && e.displayPanel())
                            };
                            var t = +new Date;
                            document.body.addEventListener ? document.body.addEventListener("click", this.clickHandler) : document.body.attachEvent("onclick", this.clickHandler), i = !0
                        }
                        t = +new Date
                    },
                    clearCatchBodyClick: function() {
                        this.clickHandler && (document.body.removeEventListener ? document.body.removeEventListener("click", this.clickHandler) : document.body.detachEvent("onclick", this.clickHandler), i = !1)
                    },
                    createToolPanel: function(e, t) {
                        var n = this.getPanelContainer(),
                            i = document.createElement("div");
                        return i.innerHTML = e, i.className = "ve-panel-wrap ve-panel-tool", i.id = "vePaneTool" + t, i.style.display = "none", i.style.position = "absolute", n.appendChild(i), i
                    },
                    updateToolStat: function() {
                        if (e.currentIns = this, document.queryCommandState) {
                            var t = [],
                                n = [];
                            this.fixedToolbarWrapperEl && (t = this._makeArray(this.fixedToolbarWrapperEl.getElementsByTagName("a"))), this.toolbarElement && (n = this._makeArray(this.toolbarElement.getElementsByTagName("a")));
                            for (var i, r = t.concat(n), o = 0; i = r[o]; o++) i.className.indexOf("active") >= 0 && (i.className = i.className.replace("active", ""));
                            for (var a, s = !1, l = this.containerElement, c = document.getElementById("vePaneTool" + this.id), o = 0; a = this.plugins[o]; o++)
                                if ("|" != a) {
                                    try {
                                        s = document.queryCommandState(a.command)
                                    } catch (u) {}
                                    var d = e.util.getClass("float_tool_" + a.command, "a", c)[0],
                                        p = e.util.getClass("fixed_tool_" + a.command, "a", l)[0];
                                    s && (d && (d.className = d.className + " active"), p && (p.className = p.className + " active"))
                                }
                        }
                    },
                    _makeArray: function(e) {
                        try {
                            return [].slice.call(e)
                        } catch (t) {
                            for (var n, i = 0, r = []; n = e[i];) r[i++] = n;
                            return r
                        }
                    },
                    createPanel: function(t, i) {
                        i = i || {};
                        var r = e.util.getClass("ve-panel-" + i.cmd, "div");
                        if (r.length) r = r[0];
                        else {
                            var r = document.createElement("div");
                            r.innerHTML = t, r.className = "ve-panel-wrap ve-panel-" + i.cmd, r.style.display = "none", r.style.position = "absolute", n.push(r)
                        }
                        return r
                    }
                })
            }(ve),
            function(e) {
                var t, n = {},
                    i = 0,
                    r = null,
                    o = {
                        floatElement: {}
                    };
                e.$extend({
                    _initEvent: function() {
                        var n = this,
                            i = function(i) {
                                var r = i.x,
                                    o = i.y,
                                    a = i.type;
                                return e.util.lazy(function() {
                                    if (!n.forbid)
                                        if (n.hasRange()) {
                                            var e = {
                                                x: r + 5,
                                                y: o + 8,
                                                type: a
                                            };
                                            n.isNewRange() || (e.keep = !0), n.displayPanel(n.toolbarElement, e)
                                        } else n.displayPanel()
                                }, 60), t = +new Date, !n.fire(i)
                            },
                            a = function(e) {
                                return !n.fire(e)
                            };
                        e.util.bindEvt(this.containerElement, "mousedown", {
                            "ve-edit": a
                        }), e.util.bindEvt(this.containerElement, "mouseup", {
                            "ve-edit": i
                        }), e.util.bindEvt(this.containerElement, "click", {
                            "ve-img": function() {
                                n.selectNode(this)
                            },
                            "ve-link": function(e) {
                                var t = this.href;
                                e.ctrlKey && /^http/i.test(t) && window.open(t)
                            },
                            "ve-edit": function() {
                                n.updateToolStat()
                            },
                            "ve-zoom": function() {
                                n.zoomEdit()
                            },
                            "ve-maximize-mask": function() {
                                n.zoomEdit()
                            }
                        }), e.util.bindEvt(this.containerElement, "dblclick", {
                            "ve-img": function() {
                                n.selectNode(this);
                                var e = this.getAttribute("src");
                                e = e.replace(/\/\d+$/, "/0"), window.open(e)
                            }
                        }), e.util.bindEvt(this.floatElement, "mouseup", o.floatElement), e.util.bindEvt(this.containerElement, "keydown", {
                            "ve-edit": i
                        }), e.util.bindEvt(this.containerElement, "keyup", {
                            "ve-edit": i
                        }), e.util.bindEvt(this.containerElement, "paste", {
                            "ve-edit": function(e) {
                                return new Date - t < 600 && r && clearTimeout(r), s(e)
                            },
                            "ve-img": function(e) {
                                return new Date - t < 600 && r && clearTimeout(r), s(e)
                            }
                        });
                        var s = function(e) {
                            var t = e.clipboardData || window.clipboardData,
                                i = t.getData("text"),
                                a = !0;
                            if (o.beforepaste)
                                for (var s in o.beforepaste) o.beforepaste[s](e, i) || (a = !1);
                            return r = setTimeout(function() {
                                n.saveFocus();
                                var t = n.getContent();
                                if (t && (n.setContent(t), n.setFocusAt(), n.saveRange()), o.afterpaste)
                                    for (var r in o.afterpaste) o.afterpaste[r](e, i)
                            }, 300), a
                        };
                        e.util.bindEvt(this.statusElement, "mousedown", {
                            "ve-close": function() {
                                n.displayStatusBar()
                            }
                        }), t = +new Date, this.addEvtListener("keydown", function(e) {
                            var t = e.keyCode;
                            return (8 == t || 46 == t) && document.selection && /control/i.test(document.selection.type) ? (this.deleteContents(), !0) : void 0
                        })
                    },
                    addEvtListener: function(e, t) {
                        return !n[this.id] && (n[this.id] = {}), !n[this.id][e] && (n[this.id][e] = []), t.id = ++i, n[this.id][e].push(t), i
                    },
                    removeEvtListener: function(e) {
                        var t = n[this.id];
                        for (var i in t)
                            for (var r, o = 0; r = t[i][o]; o++)
                                if (r.id == e) return t.splice(o, 1), !0
                    },
                    fire: function(e) {
                        var t = e.type,
                            i = !1;
                        if (n[this.id] && n[this.id][t])
                            for (var r, o = 0; r = n[this.id][t][o]; o++) r.call(this, e) && (i = !0);
                        return i
                    },
                    getLastInputTime: function() {
                        return t
                    },
                    setEventHdl: function(e, t, n) {
                        o[e] || (o[e] = {}), o[e][t] = n
                    },
                    getEventHdl: function(e, t) {
                        return o[e] ? t ? o[e][t] : o[e] : void 0
                    }
                })
            }(ve),
            function(e) {
                var t = [],
                    n = {
                        ctrl: "ctrlKey",
                        shift: "shiftKey",
                        alt: "altKey"
                    },
                    i = {
                        18: "altKey",
                        17: "ctrlKey",
                        16: "shiftKey"
                    },
                    r = {
                        altKey: 18,
                        ctrlKey: 17,
                        shiftKey: 16
                    };
                e.$extend({
                    getFnKeys: function(e) {
                        var t = [];
                        for (var n in r) e[n] && t.push(n);
                        return t.sort()
                    },
                    addShortcut: function(e, r) {
                        var o = this,
                            a = [];
                        e = e.join(",").replace(/ctrl|shift|alt/gi, function(e) {
                            var t = n[e];
                            return a.push(t), t
                        }).split(","), a.sort(), t.push(e), this.addEvtListener("keydown", function(t) {
                            var n = t.keyCode,
                                s = this.getFnKeys(t);
                            return i[n] || s.join("-") != a.join("-") || e.slice(-1)[0].charCodeAt(0) - 32 !== t.keyCode ? void 0 : (r.call(o, t), !0)
                        })
                    }
                })
            }(ve),
            function(e) {
                var t = function(e) {
                    this.ieRange = e, this.collapsed = !0, this.commonAncestorContainer = e.parentElement ? e.parentElement() : null, this.endContainer = null, this.endOffset = 0, this.startContainer = null, this.startOffset = 0
                };
                t.prototype = {
                    cloneContents: function() {
                        return this.ieRange.duplicate().text
                    },
                    cloneRange: function() {},
                    collapse: function() {
                        this.ieRange.collapse()
                    },
                    compareBoundaryPoints: function() {},
                    compareNode: function() {},
                    comparePoint: function() {},
                    createContextualFragment: function() {},
                    deleteContents: function() {
                        this.ieRange.execCommand("delete")
                    },
                    detach: function() {},
                    expand: function() {},
                    extractContents: function() {},
                    getBoundingClientRect: function() {
                        var e = this.ieRange.getBoundingClientRect(),
                            t = {};
                        return e.width ? (t = e, e.width = e.right - e.left, e.height = e.bottom - e.top) : t = {
                            top: e.top,
                            right: e.right,
                            bottom: e.bottom,
                            left: e.left,
                            width: e.right - e.left,
                            height: e.bottom - e.top
                        }, t
                    },
                    getClientRects: function() {},
                    insertNode: function(e) {
                        var t = document.createElement("div");
                        t.appendChild(e);
                        var n = t.innerHTML;
                        /img/i.test(e.nodeName) && (n += "<span></span>"), this.ieRange.pasteHTML(n)
                    },
                    intersectsNode: function() {},
                    isPointInRange: function() {},
                    selectNode: function() {},
                    selectNodeContents: function() {},
                    setEnd: function() {},
                    setEndAfter: function() {},
                    setEndBefore: function() {},
                    setStart: function() {},
                    setStartAfter: function() {},
                    setStartBefore: function() {},
                    surroundContents: function() {},
                    toString: function() {
                        return this.ieRange.text
                    }
                };
                var n = [],
                    i = null;
                e.$extend({
                    range: null,
                    hasRange: function() {
                        this.saveRange();
                        var e = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
                        return e ? !0 : void 0
                    },
                    isNewRange: function() {
                        return n.length < 2 ? !0 : n[0].toString() !== n[1].toString()
                    },
                    getRange: function() {
                        var e, n;
                        return window.getSelection ? (e = window.getSelection(), n = e.rangeCount ? e.getRangeAt(0) : this.getLastRange() || {}) : n = new t(document.selection.createRange()), n
                    },
                    getLastRange: function() {
                        return n[0]
                    },
                    selectRange: function(e) {
                        if (e = e || n[0])
                            if (window.getSelection) {
                                var t = window.getSelection();
                                t.addRange(e)
                            } else n[0].ieRange.select()
                    },
                    selectNode: function(e) {
                        if (window.getSelection) {
                            var t = document.createRange();
                            t.selectNode(e);
                            var n = window.getSelection();
                            n.removeAllRanges(), n.addRange(t)
                        }
                    },
                    setFocusAt: function(t, n) {
                        var t = t;
                        if (t && t.parentNode || (t = e.$(i)), t) {
                            var r, o;
                            if (void 0 == n)
                                if (t.innerHTML) {
                                    var a = "" == t.innerHTML.replace(/<(?!img|embed).*?>/gi, "").replace(/&nbsp;/gi, " ").replace(/\r\n|\n|\r/, "");
                                    n = a ? !0 : !1
                                } else n = !1;
                            if (/img/i.test(t.tagName)) {
                                if (document.createRange) {
                                    var o = window.getSelection(),
                                        s = t.parentNode.lastChild;
                                    s && o.collapse(s, 0)
                                }
                            } else if (document.createRange) r = document.createRange(), r.selectNodeContents(t), r.collapse(n), o = window.getSelection(), o.removeAllRanges(), o.addRange(r), t.focus && t.focus();
                            else if (document.selection) {
                                try {
                                    r = document.body.createTextRange(), r.moveToElementText(t), r.collapse(n), r.select()
                                } catch (l) {}
                                t.focus()
                            }
                        }
                    },
                    saveFocus: function() {
                        i = "f_" + (new Date).valueOf();
                        var e = document.createElement("span");
                        e.setAttribute("name", "empt"), e.id = i;
                        var t = this.getRange();
                        t.insertNode(e), emptElem = e
                    },
                    saveRange: function() {
                        this.range = this.getRange(), n.unshift(this.range)
                    },
                    insertNode: function(t) {
                        if (n[0]) {
                            if (n[0].commonAncestorContainer && this.editorElement.contains && !e.ua.isie && navigator.userAgent.indexOf("Trident") < 0 && !this.editorElement.contains(n[0].commonAncestorContainer)) return void this.editorElement.appendChild(t);
                            n[0].insertNode(t)
                        } else this.editorElement.appendChild(t);
                        this.setFocusAt(t, !0)
                    },
                    deleteContents: function() {
                        this.getRange().deleteContents()
                    }
                })
            }(ve),
            function(e) {
                var t = {};
                if (require) var n = require("$");
                e.$extend({
                    _initPlugins: function() {
                        for (var e in t) t[e] = this._buildPlugin(t[e]);
                        this.plugins = [];
                        for (var n, i = 0; n = this.config.commands[i]; i++)
                            if ("|" == n) this.plugins.push("|");
                            else {
                                var r = t[n];
                                r && this.plugins.push(r)
                            }
                    },
                    _buildPlugin: function(t) {
                        var n = this;
                        if (t.panel) {
                            var i = this.createPanel(t.panel, {
                                cmd: t.command
                            });
                            t.dialog = function(e) {
                                this.displayPanel(i, {
                                    panel: !0,
                                    position: t.position || e
                                }), t.onAfterDialog && t.onAfterDialog.call(this, i, t.callback)
                            };
                            var r = {};
                            r["ve-" + t.command] = function(e, i) {
                                t.value = i.getAttribute("value"), n.execCommand(t.command, t.value, {
                                    from: "dialog"
                                })
                            }, e.util.bindEvt(i, "click", r)
                        }
                        return t.shortcut && this.addShortcut(t.shortcut, function() {
                            n.execCommand(t.command, t.value, {
                                from: "shortcut"
                            })
                        }), t.onInit && t.onInit.call(this), t
                    },
                    $addPlugin: function(e) {
                        t[e.command] = {
                            value: e.value,
                            panel: e.panel,
                            command: e.command,
                            className: e.className || e.command,
                            dialog: null,
                            execCommand: e.execCommand,
                            onAfterDialog: e.onAfterDialog,
                            shortcut: e.shortcut || "",
                            description: e.description || "",
                            position: e.position,
                            onInit: e.onInit
                        }
                    },
                    execCommand: function(i, r, o) {
                        var a, s = e.currentIns || this,
                            l = t[i],
                            c = o || {};
                        return !c.from && l.dialog ? (c.callback && (l.callback = function(e) {
                            c.callback.call(s, e), s.callback = null
                        }), void l.dialog.call(s, c.position)) : (s.editorElement.focus(), l.execCommand ? a = l.execCommand.call(s, r, c.callback) : (a = document.execCommand(i, !1, r || l.value), s.displayPanel(null, {
                            delay: 300
                        })), n && n(document).trigger("editorExecCommand", s), a)
                    }
                }, 1)
            }(ve),
            function(e) {
                for (var t, n = [
                        ["cut", "Cut"],
                        ["copy", "Copy"],
                        ["paste", "Paste"],
                        ["bold", "Bold", "加粗", ["ctrl", "b"]],
                        ["forecolor", "fgcolor"],
                        ["italic", "Italic", "斜体", ["ctrl", "i"]],
                        ["underline", "Underline", "下划线", ["ctrl", "u"]],
                        ["strikethrough", "<s>", "删除线", ["ctrl", "shift", "s"]],
                        ["createLink", "<a>"],
                        ["inserthorizontalrule", "<hr />"],
                        ["undo", "Undo"],
                        ["redo", "Redo"],
                        ["backcolor", "bgcolor"],
                        ["hilitecolor", "hilite"],
                        ["increasefontsize", "A+"],
                        ["decreasefontsize", "A-"],
                        ["fontname", "font-family"],
                        ["FontSize", "font-size"],
                        ["subscript", "<sub>"],
                        ["superscript", "<sup>"],
                        ["justifyleft", "left", "居左", ["ctrl", "alt", "l"]],
                        ["justifyright", "right", "居右", ["ctrl", "alt", "r"]],
                        ["justifycenter", "center", "居中", ["ctrl", "alt", "c"]],
                        ["justifyfull", "justify"],
                        ["insertorderedlist", "<ol>"],
                        ["insertunorderedlist", "<ul>"],
                        ["insertparagraph", "<p>"],
                        ["inserthtml", "html"],
                        ["formatblock", "formatblock"],
                        ["heading", "heading"],
                        ["indent", "indent"],
                        ["outdent", "outdent"],
                        ["contentreadonly", "readonly"],
                        ["delete", "del"],
                        ["unlink", "unlink"]
                    ], i = 0; t = n[i]; i++) e.$addPlugin({
                    command: t[0],
                    value: t[1],
                    description: t[2],
                    shortcut: t[3]
                })
            }(ve),
            function(e) {
                var t = {
                        keyup: [],
                        keydown: []
                    },
                    n = [],
                    i = function(n) {
                        var i = this,
                            r = i.getRange();
                        if (r.collapsed) {
                            var o = r.commonAncestorContainer;
                            if (o && 3 == o.nodeType)
                                for (var a, s = o.data, l = 0; a = t[n.type][l]; l++)
                                    for (var c, u = e.util.isArray(a.reg) ? a.reg : [a.reg], l = 0; c = u[l]; l++)
                                        if (s.match(c)) return void a.callback.call(i, {
                                            textNode: o,
                                            event: n,
                                            range: r
                                        })
                        }
                    };
                e.$extend({
                    _initMark: function() {
                        this.addEvtListener("keyup", i), this.addEvtListener("keydown", i);
                        for (var e, t = 0; e = n[t]; t++) e.call(this)
                    },
                    $addMark: function(e) {
                        var i = {
                            reg: e.reg,
                            callback: e.callback,
                            type: e.type || "keyup",
                            onInit: e.onInit
                        };
                        i.onInit && n.push(i.onInit), t[i.type].push(i)
                    }
                })
            }(ve),
            function(e) {
                var t = navigator.userAgent;
                e.ua = function() {
                    var e = /msie/i.test(t),
                        n = /msie\s+?6/i.test(t),
                        i = /firefox/i.test(t);
                    return {
                        isie: e,
                        isie6: n,
                        isFirefox: i
                    }
                }()
            }(ve),
            function(e) {
                var t, n, i, r, o, a, s = function() {},
                    l = [],
                    c = [],
                    u = function(e) {
                        var i = new FormData;
                        c.forEach(function(e) {
                            i.append(e.name, e.value)
                        }), i.append(n, e);
                        var o = new XMLHttpRequest;
                        o.upload.addEventListener("progress", function(t) {
                            r(e.name, t.loaded, t.total)
                        }, !1), o.onload = function() {
                            a(o.responseText)
                        }, o.open("post", t, !0), o.send(i)
                    },
                    d = function(e) {
                        t = e.url || "", n = e.name || "file", i = e.serial || !1, r = e.onprogress || s, o = e.onerror || s, a = e.oncomplete || s
                    };
                d.prototype = {
                    addFile: function(e) {
                        l.push(e)
                    },
                    addFiles: function(e) {
                        for (var t = 0; t < e.length; t++) this.addFile(e[t])
                    },
                    addParam: function(e, t) {
                        c.push({
                            name: e,
                            value: t
                        })
                    },
                    setSerial: function() {},
                    send: function() {
                        for (; l.length;) u(l.shift())
                    }
                }, e.Upload = d, window.veUpload = d
            }(ve.lib),
            function(e, t) {
                var n;
                e.isArray = function(e) {
                    return "[object Array]" === Object.prototype.toString.call(e)
                }, e.isObject = function(e) {
                    return "[object Object]" === Object.prototype.toString.call(e)
                }, e.isFunction = function(e) {
                    return "[object Function]" === Object.prototype.toString.call(e)
                }, e.tmpl = function() {
                    function e(e, t) {
                        if (t)
                            for (var n in t) {
                                var i = new RegExp("<%#" + n + "%>", "g");
                                e = e.replace(i, t[n])
                            }
                        return e
                    }
                    var t = {};
                    return function n(i, r, o) {
                        o = o || {};
                        var a = o.key,
                            s = o.mixinTmpl,
                            l = !/\W/.test(i);
                        a = a || (l ? i : null);
                        var c = a ? t[a] = t[a] || n(e(l ? document.getElementById(i).innerHTML : i, s)) : new Function("obj", "var _p_=[],print=function(){_p_.push.apply(_p_,arguments);};with(obj){_p_.push('" + i.replace(/[\r\t\n]/g, " ").split("\\'").join("\\\\'").split("'").join("\\'").split("<%").join("	").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("_p_.push('") + "');}return _p_.join('');");
                        return r ? c(r) : c
                    }
                }(), e.addEvt = function(e, t, n) {
                    e.addEventListener ? e.addEventListener(t, n) : e.attachEvent && e.attachEvent("on" + t, n)
                }, e.getElementByAttribute = function(e, t, n) {
                    for (n = n || document.body; e && 1 == e.nodeType;) {
                        var i = e.getAttribute(t);
                        if (null !== i) return e;
                        if (e == n) return;
                        e = e.parentNode
                    }
                }, e.bindEvt = function(t, i, r, o) {
                    e.addEvt(t, i, function(t) {
                        var i = t.target || t.srcElement;
                        n = i;
                        var a = e.getElementByAttribute(i, "_event", this);
                        if (!a) return !0;
                        var s = !0,
                            l = !1;
                        if (e.isFunction(r)) s = r.call(a, t, a, o), l = !0;
                        else {
                            var c = a.getAttribute("_event");
                            c && r[c] && (s = r[c].call(a, t, a, o), l = !0)
                        }
                        l && !s && (t.preventDefault ? t.preventDefault() : t.returnValue = !1)
                    })
                }, e.createDiv = function(e, t) {
                    var n = document.createElement("div");
                    return n.innerHTML = e, t.display && (n.style.display = t.display), t.position && (n.style.position = t.position), t.parent && t.parent.appendChild(n), n
                }, e.getPostion = function(e) {
                    try {
                        e = e || n || document.body;
                        var t = e.getBoundingClientRect(),
                            i = {};
                        return t.width ? (i = t, t.width = t.right - t.left, t.height = t.bottom - t.top) : i = {
                            top: t.top,
                            right: t.right,
                            bottom: t.bottom,
                            left: t.left,
                            width: t.right - t.left,
                            height: t.bottom - t.top
                        }, i
                    } catch (r) {
                        return {}
                    }
                }, e.insertStyleSheet = function(e, t) {
                    if (!document.getElementById(t)) {
                        var n = document.createElement("style");
                        return n.type = "text/css", n.id = t, document.getElementsByTagName("head")[0].appendChild(n), e && (n.styleSheet ? n.styleSheet.cssText = e : n.appendChild(document.createTextNode(e))), n.sheet || n
                    }
                }, e.lazy = function(e, t) {
                    return setTimeout(e, t)
                }, e.clear = function(e) {
                    clearTimeout(e)
                }, e.sptTransition = function() {
                    for (var e, t = document.documentElement.style, n = "t,webkitT,MozT,msT,OT".split(","), i = 0, r = n.length; r > i; i++)
                        if (e = n[i] + "ransform", e in t) return n[i].substr(0, n[i].length - 1);
                    return !1
                }, e.hide = function(e, t, n) {
                    e && (n = n || function() {}, this.sptTransition() && t ? (e.style.opacity = 0, e.tm = this.lazy(function() {
                        e.style.display = "none"
                    }, t)) : e.style.display = "none", t ? this.lazy(function() {
                        n()
                    }, t) : n())
                }, e.writeFrame = function(e, n, i, r, o) {
                    var a, s, l = t.ua,
                        c = t.$(e);
                    if (!c) {
                        var c = document.createElement("iframe");
                        c.setAttribute("frameBorder", "0"), c.setAttribute("scrolling", "no"), c.name = e, c.id = e, n.appendChild(c)
                    }
                    c.callback = r, o = o || {};
                    for (var u in o) c.style[u] = o[u];
                    l.isie || navigator.userAgent.indexOf("Trident") > 0 ? (c.src = 'javascript:(function(){document.open();document.domain="' + document.domain + '";document.close();})()', setTimeout(function() {
                        try {
                            s = window.frames[e] || t.$(e).contentWindow, a = s.contentDocument || s.document, a.open(), a.write(i), a.close()
                        } catch (n) {}
                    }, 100)) : setTimeout(function() {
                        c.src = "javascript:'" + encodeURIComponent(i) + "'"
                    }, 50)
                }, e.text2Html = function(e) {
                    return e ? e.replace(/\r\n|\r|\n/g, "<br />").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/, "&nbsp;") : ""
                }, e.clone = function(e) {
                    var t = {};
                    for (var n in e) t[n] = e[n];
                    return t
                }, e.filterHtml = function(e) {
                    e = e || "", e = e.replace(/<(script|iframe|head|style)[^>]*>[\s\S]*?<\/(script|iframe|head|style)>/gi, ""), e = e.replace(/(<\w+)([^>]*>)/gi, function(e, t, n) {
                        return n = n.replace(/(\W)(on\w+\s*=)/gi, "$1_$2").replace(/javascript\:/gi, "#"), n = n.replace(/(\W)((?:position|float)\s*\:)/gi, "$1_$2"), /img/i.test(t) ? (n = n.replace(/(height)\s*([:=])/gi, "_$1$2"), /_event/i.test(e) || (t += ' _event="ve-img"')) : /<a/i.test(t) && (/data-event/i.test(e) || (t += ' _event="ve-link"')), t + n
                    });
                    var n = t.util.addFindLink(e);
                    return n && (e = n), e
                }, e.addFindLink = function(e) {
                    var t = /(\W|^)(www(?:\.\w+){2,})(\W|$)/gi,
                        n = /https?:\/\/(?:[\w\-]+\.)+\w+(?:\/[^'"\s\b<>]*)?/gi,
                        i = e,
                        r = 0,
                        o = {},
                        a = function(e, i) {
                            return e.replace(n, function(e) {
                                return r++, o[r] = i ? e : '<a href="' + e + '"  _event="ve-link">' + e + "</a>", "<" + r + ">"
                            }).replace(t, function(e, t, n, a) {
                                return r++, o[r] = i ? e : t + '<a href="http://' + n + '" _event="ve-link">' + n + "</a>" + a, "<" + r + ">"
                            })
                        },
                        s = [],
                        l = 0;
                    return i = i.replace(/<\!\-\-no url start\-\->[\s\S]*<\!\-\-no url end\-\->/gi, function(e) {
                        return s.push(e), "%" + l++ +"%"
                    }), i = i.replace(/<a[\s\S]+?<\/a>/gi, function(e) {
                        return a(e, !0)
                    }), i = i.replace(/<\w+[^>]+>/gi, function(e) {
                        return a(e, !0)
                    }), n.test(i) || t.test(i) ? (i = a(i).replace(/<(\d+)>/g, function(e, t) {
                        return o[t]
                    }), s.length && (i = i.replace(/%(\d+)%/gi, function(e, t) {
                        return s[t]
                    })), i) : void 0
                };
                var i = {
                    escHTML: {
                        re_amp: /&/g,
                        re_lt: /</g,
                        re_gt: />/g,
                        re_apos: /\x27/g,
                        re_quot: /\x22/g
                    },
                    restXHTML: {
                        re_amp: /&amp;/g,
                        re_lt: /&lt;/g,
                        re_gt: /&gt;/g,
                        re_apos: /&(?:apos|#0?39);/g,
                        re_quot: /&quot;/g
                    }
                };
                e.restHTML = function(t) {
                    var n = i.restXHTML;
                    return e.listReplace(t + "", {
                        "<": n.re_lt,
                        ">": n.re_gt,
                        "'": n.re_apos,
                        '"': n.re_quot,
                        "&": n.re_amp
                    })
                }, e.escHTML = function(t) {
                    var n = i.escHTML;
                    return e.listReplace(t + "", {
                        "&amp;": n.re_amp,
                        "&lt;": n.re_lt,
                        "&gt;": n.re_gt,
                        "&#039;": n.re_apos,
                        "&quot;": n.re_quot
                    })
                }, e.commonReplace = function(e, t, n) {
                    return e.replace(t, n)
                }, e.listReplace = function(t, n) {
                    if (e.isObject(n)) {
                        for (var i in n) t = e.commonReplace(t, n[i], i);
                        return t
                    }
                    return t + ""
                }, e.getClass = function(e, t, n) {
                    n = n || document;
                    var i = [];
                    if (document.querySelectorAll) i = n.querySelectorAll("." + e);
                    else
                        for (var r, o = n.getElementsByTagName(t), a = 0; r = o[a]; a++)
                            for (var s = r.className.split(" "), l = 0; l < s.length; l++)
                                if (s[l] === e) {
                                    i.push(r);
                                    break
                                } return i
                }
            }(ve.util, ve),
            function(e) {
                e.$addPlugin({
                    command: "cancel",
                    execCommand: function() {
                        this.displayPanel()
                    }
                })
            }(ve),
            function(e) {
                var t = ["#ffffff", "#000000", "#eeece1", "#1f497d", "#4f81bd", "#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646", "#ffff00", "#f2f2f2", "#7f7f7f", "#ddd9c3", "#c6d9f0", "#dbe5f1", "#f2dcdb", "#ebf1dd", "#e5e0ec", "#dbeef3", "#fdeada", "#fff2ca", "#d8d8d8", "#595959", "#c4bd97", "#8db3e2", "#b8cce4", "#e5b9b7", "#d7e3bc", "#ccc1d9", "#b7dde8", "#fbd5b5", "#ffe694", "#bfbfbf", "#3f3f3f", "#938953", "#548dd4", "#95b3d7", "#d99694", "#c3d69b", "#b2a2c7", "#b7dde8", "#fac08f", "#f2c314", "#a5a5a5", "#262626", "#494429", "#17365d", "#366092", "#953734", "#76923c", "#5f497a", "#92cddc", "#e36c09", "#c09100", "#7f7f7f", "#0c0c0c", "#1d1b10", "#0f243e", "#244061", "#632423", "#4f6128", "#3f3151", "#31859b", "#974806", "#7f6000"],
                    n = '<div  class="ve-panel ve-color"  unselectable="on"><% for(var i=0,item;item = colors[i];i++) { %><a href="javascript:;" value="<%=item%>" _event="ve-<%=command%>" style="background-color:<%=item%>;"></a><% } %></div>';
                e.$addPlugin({
                    command: "forecolor",
                    panel: e.util.tmpl(n, {
                        colors: t,
                        command: "forecolor"
                    }),
                    description: "字体颜色",
                    shortcut: ["ctrl", "shift", "f"],
                    value: "#c0504d"
                }), e.$addPlugin({
                    command: "backcolor",
                    panel: e.util.tmpl(n, {
                        colors: t,
                        command: "backcolor"
                    }),
                    description: "背景颜色",
                    shortcut: ["ctrl", "shift", "b"],
                    value: "#ffff00"
                })
            }(ve),
            function(e) {
                var t = [{
                    value: 1,
                    size: "10px",
                    text: "1(10px)"
                }, {
                    value: 2,
                    size: "12px",
                    text: "2(12px)"
                }, {
                    value: 3,
                    size: "14px",
                    text: "3(14px)"
                }, {
                    value: 4,
                    size: "16px",
                    text: "4(16px)"
                }, {
                    value: 5,
                    size: "18px",
                    text: "5(18px)"
                }, {
                    value: 6,
                    size: "24px",
                    text: "6(24px)"
                }, {
                    value: 7,
                    size: "36px",
                    text: "7(36px)"
                }];
                e.$addPlugin({
                    command: "FontSize",
                    panel: e.util.tmpl('<div  class="ve-panel ve-fontsize" unselectable="on"><% for(var i=0,item;item = fontsizes[i];i++) { %><a href="javascript:;"  _event="ve-FontSize" value="<%=item.value%>" style="font-size:<%=item.size%>;"><%=item.text%></a><% } %></div>', {
                        fontsizes: t
                    }),
                    description: "字号",
                    shortcut: ["ctrl", "alt", "f"],
                    value: 4
                })
            }(ve),
            function(e) {
                {
                    var t = (require("manager"), require("widget/upfile/upfile"));
                    require("util")
                }
                e.$addPlugin({
                    command: "image",
                    panel: e.util.tmpl('    <div  class="ve-panel ve-uploadimg" style="background-color:#ffffff">            </div>', {}),
                    onAfterDialog: function(n, i) {
                        {
                            var r = this,
                                o = n.children[0];
                            e.util.writeFrame("v_img_upload", o, e.util.tmpl('    <html>        <head>            <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>            <style>                html{color:#000;background:none;font-size:12px;font-family:arial,宋体,Arial Unicode MS,Mingliu,Arial,Helvetica;}                body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td{margin:0;padding:0;}                table{border-collapse:collapse;border-spacing:0;}                fieldset,img{border:0;}                address,caption,cite,code,dfn,th,var{font-style:normal;font-weight:normal;}                li{list-style:none;}                caption,th{text-align:left;}                h1,h2,h3,h4,h5,h6{font-size:100%;}                abbr,acronym{border:0;font-variant:normal;}                sup{vertical-align:text-top;}                sub{vertical-align:text-bottom;}                input,textarea,select{font-family:inherit;font-size:inherit;font-weight:inherit;}                legend{color:#000;}                a{text-decoration:none;color:#6b6b6b;cursor:pointer;}                a *{cursor:pointer;}                a:hover{text-decoration:underline;}                input{outline:none }                .tab{padding:7px 20px 0;height:30px;border-bottom:1px solid #e2e2e2;background-color:#f9f9f9;}                .tab li{float:left;display:inline;height:28px;line-height:28px;width:83px;text-align:center;font-size:14px;position:relative;bottom:-1px;z-index:1;border:1px solid #F9F9F9;border-bottom:1px solid #e2e2e2;cursor:pointer;}                .tab .active{color:#3c4854;border:1px solid #e2e2e2;border-bottom:1px solid #fff;background-color:#fff;}                .wrap{width:365px;height:134px;}                .panel .pic_add{overflow:hidden;}                .panel{padding:20px;}                .panel_upload form{width:0;height:0;overflow:hidden;}                .panel_upload .pic_add label{width:80px;height:20px;line-height:20px;text-align:center;display:inline-block;cursor:pointer;}                .panel_upload .pic_add .file_name{margin-left:10px;display:inline-block;width:155px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}                .panel_upload .btns{padding-left:60px;margin-top:10px;}                .panel_upload .btns a{margin-right:10px;}                .panel_url input{width:238px;height:26px;line-height:26px;border:1px solid #dadada;}                .panel_url .btns{float:right;display:inline;margin-top:10px;}                .panel_url .btns a{margin-left:10px;}                .progress{position: relative;height: 25px;width: 200px;margin-left: 20px;}                .progress span{display: inline-block;height: 25px;width:2px;background: #ccc;}                .progress label{position: absolute;right: -40px;top:3px;}                .g_btn{display:inline-block;height:26px;line-height:26px;padding:0 10px;text-align:center;}                .g_btn:hover{text-decoration:none;}                .g_btn_3{color:#3d4958;border-radius:3px;                background-color: #fff;                border: solid 1px #cbcbcb;                background-image: -moz-linear-gradient(bottom, rgba(0,0,0,.02), rgba(255,255,255,.02) 46%);                <% if (!/firefox/i.test(navigator.userAgent)) { %>                     background-image: -webkit-linear-gradient(bottom, rgba(0,0,0,.02), rgba(255,255,255,.02) 46%);                    background-image: -o-linear-gradient(bottom, rgba(0,0,0,.02), rgba(255,255,255,.02) 46%);                    background-image: -ms-linear-gradient(bottom, rgba(0,0,0,.02), rgba(255,255,255,.02) 46%);                    background-image: linear-gradient(to top, rgba(0,0,0,.02), rgba(255,255,255,.02) 46%);                <% } %>                }                .g_btn_3:hover{                border: solid 1px #939598;                background-image: -moz-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));                <% if (!/firefox/i.test(navigator.userAgent)) { %>                    background-image: -webkit-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));                    background-image: -o-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));                    background-image: -ms-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));                    background-image: linear-gradient(to top, rgba(0,0,0,.05), rgba(255,255,255,.05));                <% } %>                }                .g_btn_3:active{                -webkit-box-shadow: inset 0 3px 5px rgba(0,0,0,.3);                box-shadow: inset 0 3px 5px rgba(0,0,0,.3);                border: solid 1px #939598;                background-image: -moz-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));                <% if (!/firefox/i.test(navigator.userAgent)) { %>                    background-image: -webkit-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));                    background-image: -o-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));                    background-image: -ms-linear-gradient(bottom, rgba(0,0,0,.05), rgba(255,255,255,.05));                    background-image: linear-gradient(to top, rgba(0,0,0,.05), rgba(255,255,255,.05));                <% } %>                }            </style>        </head>        <script type="text/javascript">            <% if(domain){ %>            document.domain = "<%=domain%>";            <% } %>            function $(id){                return document.getElementById(id)            }            function insert(){                var url = $("img_1").value.replace(/["<>]/g,"");                                if(!/^http/.test(url)){                    return;                }                frameElement.callback({ecode:0,"url":url,net:true});            }            function cancel(){                 frameElement.callback();            }            function change(i){                var j = 1-i;                $("opt_"+i).className = "active";                $("opt_"+j).className = "";                $("panel_"+i).style.display = "";                $("panel_"+j).style.display = "none";                if(i){                    $("img_"+i).focus();                }            }            window.onload = function () {                frameElement.callback({                    "cmd": "initUpload",                    "button": $("selfile")                });             }        </script>        <body>            <div class="wrap">                <ul class="tab">                    <li class="active" id="opt_0" onclick="change(0)">本地上传</li>                    <li id="opt_1" onclick="change(1)">网络图片</li>                </ul>                <div class="panel panel_upload" id="panel_0">                    <div id="fileForm">                         <p class="btns">                            <a href="javascript:;" id="selfile" cmd="selfile" class="g_btn g_btn_3">上传图片</a>                            <a href="javascript:;" class="g_btn g_btn_3" onclick="cancel()">取消</a>                        </p>                    </div>                </div>                <div class="panel panel_url" id="panel_1" style="display:none;">                    <p>插入网络照片：<input id="img_1" type="text" placeholder="http://"></p>                    <p class="btns"><a class="g_btn g_btn_3" onclick="insert()">确定</a><a class="g_btn g_btn_3"  onclick="cancel()">取消</a></p>                </div>            </div>         </body>    </html>', {
                                domain: document.domain,
                                name: "image",
                                action: ""
                            }), function(e) {
                                if (!e) return void r.displayPanel();
                                if (e.cmd && "initUpload" == e.cmd) {
                                    var n = arguments.callee;
                                    return void t.init({
                                        button: e.button,
                                        loading: function() {
                                            e.button.innerHTML = "正在上传..."
                                        },
                                        onLoad: function(e) {
                                            var t = e[0];
                                            n({
                                                url: t
                                            })
                                        }
                                    })
                                }
                                if (e.url) {
                                    var o = e.url;
                                    i ? i({
                                        src: o
                                    }) : r.execCommand("insertimage", o), r.displayStatusBar()
                                } else i ? i({
                                    msg: e.msg || "上传出错！"
                                }) : r.displayStatusBar(e.msg || "上传出错！");
                                r.displayPanel()
                            }, {
                                height: "134px",
                                width: "365px"
                            })
                        }
                    },
                    onInit: function() {}
                }), e.$addPlugin({
                    command: "insertimage",
                    execCommand: function(e) {
                        var t = document.createElement("img");
                        t.src = e, t.setAttribute("_event", "ve-img"), t.style.maxWidth = "100%", this.saveRange(), this.insertNode(t)
                    }
                })
            }(ve),
            function(e) {
                e.$addPlugin({
                    command: "createLink",
                    description: "添加链接",
                    panel: e.util.tmpl('<div  class="ve-panel ve-createLink"></div>', {}),
                    onAfterDialog: function(t) {
                        var n = this,
                            i = "http://";
                        n.saveRange();
                        e.util.writeFrame("v_add_link", t.firstChild, e.util.tmpl('    <html>        <head>            <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>            <style>                body{                    padding: 0px;                    margin: 0px;                    font-size: 14px;                }                input{                   width: 207px;                    height: 27px;                    outline: none;                    background-color: #F9F9F9;                    color: #999D9E;                    border: 1px solid #DADADA;                    font-family: inherit;                    font-size: inherit;                    font-weight: inherit;                    letter-spacing: normal;                    word-spacing: normal;                    text-transform: none;                    text-indent: 0px;                    text-shadow: none;                    display: inline-block;                    text-align: start;                }                input, .btn_add {                    margin-right: 10px;                }                .btn{                    display: inline-block;                    height: 26px;                    line-height: 26px;                    width: 51px;                    text-align: center;                }                .btn_1{                    color: #3D4958;                    border-radius: 3px;                    background-color: #FFF;                    border: solid 1px #CBCBCB;                    background-image: -moz-linear-gradient(bottom, rgba(0,0,0,.02), rgba(255,255,255,.02) 46%);                    <% if (!/firefox/i.test(navigator.userAgent)) { %>                     background-image: -webkit-linear-gradient(bottom, rgba(0, 0, 0, 0.02), rgba(255, 255, 255, 0.02) 46%);                    background-image: -o-linear-gradient(bottom, rgba(0,0,0,.02), rgba(255,255,255,.02) 46%);                    background-image: -ms-linear-gradient(bottom, rgba(0,0,0,.02), rgba(255,255,255,.02) 46%);                    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.02), rgba(255, 255, 255, 0.02) 46%);                    <% } %>                }                a{                    text-decoration: none;                    cursor: pointer;                }            </style>        </head>        <script type="text/javascript">            <% if(domain){ %>            document.domain = "<%=domain%>";            <% } %>            function addLink(){                frameElement.callback(document.getElementById("link").value);            }            function removeLink(){                frameElement.callback();            }        </script>        <body>            <input id="link" value="<%=href%>"/>            <a onclick="addLink()" class="btn btn_1 btn_add">添加</a>            <a onclick="removeLink()" class="btn btn_1">删除</a>        </body>    </html>', {
                            domain: document.domain,
                            href: i
                        }), function(e) {
                            var t = n.getRange();
                            if (n.selectRange(t), e) {
                                var i = t.toString && t.toString();
                                i ? n.execCommand("createLink", e, {
                                    from: "dialog"
                                }) : (n.editorElement.focus(), t = n.getRange(), t.insertNode($("<a>").attr("href", e).text(e)[0]), n.displayPanel(null, {
                                    delay: 300
                                }))
                            } else n.execCommand("unlink", "unlink", {
                                from: "dialog"
                            })
                        }, {
                            height: "30px",
                            width: "360px"
                        })
                    }
                })
            }(ve),
            function(e) {
                e.$addPlugin({
                    onInit: function() {
                        this.addEvtListener("keydown", function(e) {
                            if (9 == e.keyCode) {
                                var t = document.createElement("span");
                                return t.id = "content_tab", t.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;", t["class"] = "content_tab", this.insertNode(t), this.setFocusAt($("content_tab")), $("content_tab").removeAttribute("id"), !0
                            }
                            8 == e.keyCode
                        })
                    }
                })
            }(ve),
            function(e) {
                var t = /(\W|^)(www(?:\.\w+){2,})(\W|$)/g,
                    n = /https?:\/\/(?:[\w\-]+\.)+\w+(?:\/[^'"\s\b<>]*)?/g;
                e.$addMark({
                    reg: [n, t],
                    callback: function(t) {
                        var n = t.event.keyCode;
                        if (32 == n || 13 == n) {
                            this.saveFocus();
                            var i = e.util.addFindLink(this.getContent());
                            i && (this.setContent(i, !1, !0), this.setFocusAt())
                        }
                    },
                    type: "keydown",
                    onInit: function() {
                        e.util.bindEvt(this.editorElement, "click", function(e, t) {
                            if (/a/i.test(t.nodeName) && /^(https?|ftp)/i.test(t.href)) {
                                if (/#inner/i.test(t.href)) return;
                                window.open(t.href, "")
                            }
                        })
                    }
                })
            }(ve),
            function(e) {
                var t = /((?:password|密码)[\s:：])(.+?)(\s|&nbsp;)/;
                e.$addMark({
                    reg: t,
                    callback: function(e) {
                        var n = e.event.keyCode;
                        if (32 == n || 13 == n) {
                            this.saveFocus();
                            var i = e.textNode.parentNode,
                                r = i.innerHTML,
                                o = 0,
                                a = {};
                            if (r = r.replace(/<mm:password.+?<\/mm:password>/gi, function(e) {
                                    return o++, a[o] = e, "<" + o + ">"
                                }), !t.test(r)) return;
                            r = r.replace(t, function(e, t, n, i) {
                                return '<mm:password class="ve-password" title="' + n + '">' + t + new Array(n.length + 1).join("*") + "</mm:password>" + i
                            }).replace(/<(\d+)>/g, function(e, t) {
                                return a[t]
                            }), i.innerHTML = r, this.setFocusAt()
                        }
                    }
                })
            }(ve), module.exports = ve
    });