define("main/layout/default", function(t, e, n) {
    var i = t("$"),
        a = t("login"),
        r = t("util"),
        o = {
            _tmpl: {
                inStyle: ".ui-dropdown .current a{font-weight:bold}.layout-header .user > ul > li.noborder-link:after{border-right:none}.layout-page{min-width: 1230px}.layout-header .user{right:50px}"
            },
            render: function() {
                a.init(i("#usrInfo")[0]), this._tmpl.inStyle && r.insertStyle(this._tmpl.inStyle)
            }
        };
    n.exports = o
}), define("main/pagemanage", function(t, e, n) {
    var i = t("$"),
        a = t("router"),
        r = t("login"),
        o = (t("util"), t("lib/reporter")),
        s = t("widget/formchange/formchange"),
        c = "home",
        l = {
            "default": t("main/layout/default")
        },
        d = {},
        u = {
            loadRoot: function() {
                this._loadView(c)
            },
            loadView: function() {
                var t = this,
                    e = [].slice.call(arguments),
                    n = null,
                    i = null,
                    o = [],
                    s = /(manage|personal)/i.test(e[0]);
                if (s && !r.isLogin()) return t.fragment || a.redirect("/"), void r.show({
                    callback: function() {
                        a.redirect(/(personal)/i.test(e[0]) ? e.join("/") : "/manage")
                    }
                });
                if (location.search) {
                    for (var l, d = location.search.substring(1).split("&"), u = {}, p = 0; l = d[p]; p++) {
                        var h = l.split("=");
                        u[h[0]] = h[1]
                    }
                    o.push(u)
                }
                n = /^\?/.test(e[0]) ? c : e[0].split("?")[0], e.length > 1 && (/^\?/.test(e[1]) ? i = "" : (i = e[1].split("?")[0], !o.length && (o = e.slice(2)))), this._currentViewMeta = {
                    controller: n,
                    action: i,
                    params: o
                }, t._loadView(n, i, o)
            },
            getCurrentViewMeta: function() {
                return this._currentViewMeta || {}
            },
            _loadView: function(e, n, i) {
                var r = this;
                if (r.currentViewObj) {
                    r.globalDestroy();
                    var c = r.currentViewObj.destroy;
                    try {
                        if (c && c.call(r.currentViewObj), r.currentCtrlObj) {
                            var l = r.currentCtrlObj.destroy;
                            l && l.call(r.currentCtrlObj)
                        }
                    } catch (d) {
                        window.console && console.error("View destroy failed ", d)
                    }
                    r.currentCtrlObj = null, r.currentViewObj = null
                }
                r.renderLayout(e, n, i), i = i || [];
                var u = "manage" == e ? "" : "module/",
                    p = u + e + "/" + e,
                    h = u + e + "/" + n + "/" + n,
                    f = n || e,
                    g = [];
                if (seajs.hasDefined[p] ? g.push(p) : p = "", n) {
                    if (!seajs.hasDefined[h]) return void r.render404();
                    g.push(h)
                } else {
                    var m = u + e + "/index/index";
                    if (seajs.hasDefined[m]) g.push(m), n = "index";
                    else if (!p) return void r.render404()
                }
                var v = r.addCssReq(e, n);
                v.length && t.async(v), t.async(g, function(t, o) {
                    p || (o = t), p && (!r.fragment || r.fragment.indexOf("/" + e) < 0 || !n) && r.renderView(t, i), r.fragment = a.fragment, n ? (r.renderView(o, i), r.currentViewObj = o, p && (r.currentCtrlObj = t)) : r.currentViewObj = t, r.changeNavStatus(f), r.setTitle(t, o)
                }), s.set(0), o.basic(decodeURIComponent(a.fragment))
            },
            addCssReq: function(t, e) {
                var n = d[t],
                    i = d[e],
                    a = [],
                    r = function(t) {
                        for (var e = 0; e < t.length; e++) t[e] && (a = a.concat("csspath/" + t[e]))
                    };
                return n && r(n.cssFile), i && r(i.cssFile), a
            },
            renderLayout: function() {
                var t = this,
                    e = function(e) {
                        t.layout != e && (l[e].render(), t.layout = e)
                    };
                e("default")
            },
            renderView: function(t, e) {
                if (t) {
                    var n = i("#container").parent(),
                        a = "layout-page";
                    t.pageClass ? (n.attr("class", a), n.addClass(t.pageClass)) : n.attr("class") != a && n.attr("class", a)
                }
                t && t.render ? t.render.apply(t, e) : this.render404()
            },
            render404: function() {
                var t = '<h2 id="tt404" style="text-align:center;padding-top:100px;font-size:20px;line-height:1.5;color:#999"> <p>404</p> 您访问的页面没有找到! </h2>',
                    e = document.getElementById("manageMain") || document.getElementById("container");
                e && (e.innerHTML = t)
            },
            setTitle: function(t, e) {
                var n = window.platformName + " | 腾讯云";
                e && e.title ? document.title = e.title : t && t.title ? document.title = t.title : document.title != n && (document.title = n)
            },
            changeNavStatus: function(t) {
                var e = this,
                    n = document.getElementById("nav"),
                    a = document.getElementById("sidebar"),
                    r = this.fragment,
                    o = function(n) {
                        i(n).parent().removeClass("active");
                        for (var a, o = 0; a = n[o]; o++) {
                            var s = e.getHref(a);
                            if ("/" == s && t == c || "/" != s && 0 == r.indexOf(s)) {
                                var l = i(a).parent();
                                l.addClass("active");
                                break
                            }
                        }
                    };
                if (n) {
                    var s = n.getElementsByTagName("a");
                    o(s)
                }
                if (a) {
                    var l = a.getElementsByTagName("a");
                    o(l)
                }
            },
            getHref: function(t) {
                var e = t.getAttribute("href", 2);
                return e = e.replace("http://" + location.host, "")
            },
            globalDestroy: function() {
                i(document).off("editorExecCommand");
                var t = i("#vePanelContainer");
                t && t.remove()
            },
            resetFragment: function() {
                this.fragment = ""
            },
            getScrollEl: function() {
                return i("#manageMain")
            },
            getHeaderHeight: function() {
                return i("#pagewrap").find(".layout-header").outerHeight()
            }
        };
    n.exports = u
}), define("main/router", function(t, e, n) {
    var i = document.documentMode,
        a = /msie [\w.]+/.test(navigator.userAgent.toLowerCase()) && (!i || 7 >= i),
        r = window.history.pushState,
        o = {
            init: function(t) {
                this.option = {
                    html5Mode: !0,
                    pageManager: {},
                    routes: {},
                    interval: 50,
                    domain: ""
                }, t = t || {};
                for (var e in t) this.option[e] = t[e];
                this.option.html5Mode = r && this.option.html5Mode, this.debug = !1;
                var n = window.location.href;
                /\/debug_online/.test(n) ? this.debug = "/debug_online" : /\/debug/.test(n) && (this.debug = "/debug");
                var i = this,
                    o = this.option.html5Mode ? "popstate" : "hashchange",
                    s = function() {
                        var t = i.getFragment() ? i.getFragment() : "/";
                        return "/index.html" === t && (t = "/"), i.option.html5Mode || /#(.*)$/.test(n) || "/" === t ? void i.navigate(t, !1, !0) : void location.replace("/#" + t)
                    };
                if (a) {
                    var c = document.createElement("iframe");
                    c.tabindex = "-1", c.src = this.option.domain ? 'javascript:void(function(){document.open();document.domain = "' + this.option.domain + '";document.close();}());' : "javascript:0", c.style.display = "none";
                    var l = function() {
                        c.onload = null, c.detachEvent("onload", l), s(), i.checkUrlInterval = setInterval(function() {
                            i.checkUrl()
                        }, i.option.interval)
                    };
                    c.attachEvent ? c.attachEvent("onload", l) : c.onload = l, document.body.appendChild(c), this.iframe = c.contentWindow
                } else this.addEvent(window, o, function() {
                    i.checkUrl()
                });
                this.iframe || s()
            },
            addEvent: function(t, e, n) {
                t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent ? t.attachEvent("on" + e, n) : t[e] = n
            },
            getHash: function(t) {
                var e = (t || window).location.href.match(/#(.*)$/);
                return e ? e[1] : ""
            },
            getFragment: function() {
                var t, e = window.location.pathname + window.location.search;
                return this.option.html5Mode ? (t = e, "/" === t && this.getHash() && (t = this.getHash())) : (t = this.getHash(), "" === t && "/" !== e && "/index.html" !== e && (t = e)), t
            },
            checkUrl: function() {
                var t = this.getFragment();
                this.debug && (t = t.replace(this.debug, "")), this.iframe && (t = this.getHash(this.iframe)), t !== this.fragment && this.navigate(t, !1, !0)
            },
            stripHash: function(t) {
                return t.replace(/^\#+|\#+$/g, "")
            },
            stripSlash: function(t) {
                return t.replace(/^\/+|\/+$/g, "")
            },
            navigate: function(t, e, n) {
                var i = this;
                if ("/" !== t && (t = i.stripHash(t), t = i.stripSlash(t), t = "/" + t), t !== i.fragment && !e)
                    if (i.debug && (t = t.replace(i.debug, ""), t = i.debug + t), i.option.html5Mode) {
                        var a = n ? "replaceState" : "pushState";
                        history[a]({}, document.title, t)
                    } else("/" !== t || i.getFragment()) && (location.hash = t, i.iframe && i.historySet(t, i.getHash(i.iframe)));
                i.debug && (t = t.replace(i.debug, ""), !t && (t = "/")), i.fragment = t, i.loadUrl(t)
            },
            historySet: function(t, e) {
                var n = this.iframe.document;
                t !== e && (n.open(), this.option.domain && n.write('<script>document.domain="' + this.option.domain + '"</script>'), n.close(), this.iframe.location.hash = t)
            },
            redirect: function(t, e, n) {
                this.navigate(t, e, n)
            },
            matchRoute: function(t, e) {
                var n = /\((.*?)\)/g,
                    i = /(\(\?)?:\w+/g,
                    a = /\*\w+/g,
                    r = function(t) {
                        return t = t.replace(n, "(?:$1)?").replace(i, "([^/]+)").replace(a, "(.*?)"), new RegExp("^" + t + "$")
                    },
                    o = r(t),
                    s = o.exec(e),
                    c = null;
                if (s) {
                    var l = s.slice(1);
                    c = [];
                    for (var d, u = 0; d = l[u]; u++) c.push(d ? decodeURIComponent(d) : "")
                }
                return c
            },
            loadUrl: function(t) {
                var e = this,
                    n = e.option.routes,
                    i = e.option.pageManager,
                    a = null,
                    r = null;
                for (var o in n)
                    if (r = e.matchRoute(o, t)) {
                        a = n[o], i[a] && i[a].apply(i, r);
                        break
                    }
            }
        };
    n.exports = o
}), define("main/startup", function(t, e) {
    var n = t("$"),
        i = t("event"),
        a = t("util"),
        r = t("router"),
        o = t("pagemanage"),
        s = t("login"),
        c = t("dialog"),
        l = t("lib/reporter"),
        d = t("widget/formchange/formchange"),
        u = t("manager"),
        p = function() {
            if (window.platformName = "微信服务市场", r.init({
                    html5Mode: !0,
                    pageManager: o,
                    domain: "qcloud.com",
                    routes: {
                        "/": "loadRoot",
                        "/:main(/*controller)(/*action)(/*p1)(/*p2)(/*p3)": "loadView"
                    }
                }), i.addCommonEvent("click", {
                    nav: function() {
                        var t = this;
                        d.validate(function() {
                            r.navigate(a.getHref(t))
                        })
                    },
                    login: function() {
                        s.show()
                    },
                    logout: function() {
                        d.validate(function() {
                            s.logout()
                        })
                    },
                    platform_customer: function() {
                        window.open("http://crm2.qq.com/page/portalpage/wpa.php?uin=800033878&f=1&ty=1&ap=000018{$SP|146|209$}&as=2&v=2&sp=")
                    },
                    platform_feedback: function() {
                        a.linkJump("http://support.qq.com/discuss/1046_1.shtml")
                    },
                    find_custom: function() {
                        a.linkJump("http://bbs.qcloud.com/forum.php?mod=viewthread&tid=481&fromuid=4404")
                    },
                    custom_research: function() {
                        a.linkJump("http://exp.qq.com/ur/?urid=13176")
                    }
                }), c.initLoadTip(), l.basic("main_frame"), window._speedMark && window.startLoadJs) {
                var t = [startLoadJs - _speedMark];
                if (t.push(new Date - startLoadJs), window.performance && performance.timing) {
                    var e = performance.timing;
                    t.push(e.connectEnd - e.navigationStart), t.push(e.domLoading - e.connectEnd)
                }
                l.speed("1", t)
            }
            u.markVisitor(), n(window).load(function() {
                window.isOnload = !0
            })
        };
    e.startup = p
}), define("config/dao_config", function(t, e, n) {
    var i = {
            check_login: {
                url: "/login?action=checkLogin",
                method: "get"
            },
            quit_login: {
                url: "/login?action=quitLogin",
                method: "get"
            },
            mark_visitor: {
                url: "/login?action=markVisitor",
                method: "get"
            },
            bind_wechat_by_manual: {
                url: "/wechat?action=bindWechatByManual",
                method: "post"
            },
            get_bind_progress: {
                url: "/wechat?action=getBindProgress",
                method: "get"
            },
            get_activity_by_packageids: {
                url: "/package?action=querySaleActivitysByPackageIds",
                method: "get"
            },
            get_activity_by_packageid: {
                url: "/package?action=querySaleActivitysByPackageId",
                method: "get"
            },
            get_package_by_id: {
                url: "/package?action=queryPackageByPackageId",
                method: "get"
            },
            get_total_order_num: {
                url: "/package?action=queryTotalOrderNumForPackages",
                method: "get"
            }
        },
        a = "/cgi";
    if (a)
        for (var r in i) {
            var o = i[r];
            o && o.url && (o.url = a + o.url)
        }
    var s = {};
    s.get = function(t) {
        return i[t]
    }, n.exports = s
}), define("config/manager", function(t, e, n) {
    var i = t("net"),
        a = t("daoConfig"),
        r = t("dialog"),
        o = t("login"),
        s = t("wxManager"),
        c = {
            _errorHandler: function(t) {
                var e = t.code;
                7 == e || 9 == e || 15 == e || 21 == e ? (o.logout(!0), o.show()) : r.miniTip(t.msg || "连接服务器异常，请稍后再试")
            },
            _commonCb: function(t, e, n) {
                var i = this,
                    a = t.code;
                0 == a ? e && e(t) : (i._errorHandler(t), n && n(t))
            },
            checkLogin: function(t, e) {
                var n = this,
                    r = function(i) {
                        n._commonCb(i, t, e)
                    };
                i.send(a.get("check_login"), {
                    cb: r,
                    global: !1
                })
            },
            quitLogin: function(t, e) {
                var n = this,
                    r = function(i) {
                        n._commonCb(i, t, e)
                    };
                i.send(a.get("quit_login"), {
                    cb: r
                })
            },
            markVisitor: function() {
                i.send(a.get("mark_visitor"), {
                    global: !1
                })
            },
            bindWechatByManual: function(t, e, n) {
                var r = this,
                    o = function(t) {
                        r._commonCb(t, e, n), s.clearBindInfo()
                    };
                i.send(a.get("bind_wechat_by_manual"), {
                    data: t,
                    cb: o
                })
            },
            getBindProgress: function(t, e, n) {
                var r = this,
                    o = function(t) {
                        r._commonCb(t, e, n)
                    };
                i.send(a.get("get_bind_progress"), {
                    data: t,
                    cb: o
                })
            },
            getActivityConfig: function(t) {
                var e = this;
                this.activityConfig ? t(this.activityConfig) : $.ajax({
                    type: "GET",
                    url: "/activity.json",
                    success: function(n) {
                        try {
                            "object" != typeof n && (n = $.parseJSON(n)), e.activityConfig = n, t(n)
                        } catch (i) {
                            t({})
                        }
                    },
                    error: function() {
                        t({})
                    }
                })
            },
            getActivityByPackageid: function(t, e, n) {
                var r = this,
                    o = function(t) {
                        r._commonCb(t, function(t) {
                            e && e(t.data)
                        }, n)
                    };
                i.send(a.get("get_activity_by_packageid"), {
                    data: t,
                    global: !1,
                    cb: o
                })
            },
            getActivityByPackageids: function(t, e, n) {
                var r = this,
                    o = function(t) {
                        r._commonCb(t, function(t) {
                            e && e(t.data)
                        }, n)
                    };
                i.send(a.get("get_activity_by_packageids"), {
                    data: t,
                    global: !1,
                    cb: o
                })
            },
            getActivityStatus: function(t, e) {
                var n = {},
                    i = e.sale_activityid_and_count_map,
                    a = e.now;
                if (t.numberlimit > 0 && t.number >= t.numberlimit) n.code = "SOLDOUT", n.text = "已售完,明天再来";
                else {
                    var r = this.getActivityTime(t.begintime, !0),
                        o = this.getActivityTime(t.endtime, !0);
                    r && r > a ? (n.code = "NOTSTARTED", n.text = "抢购未开始") : o && a > o ? (n.code = "CLOSED", n.text = "抢购已结束") : t.limitcount > 0 ? i && i[t.saleactivityid] && i[t.saleactivityid] >= t.limitcount ? (n.code = "EXCEEDLIMIT", n.text = "您已买过该套餐") : (n.code = "NORMAL", n.text = "立即抢购") : (n.code = "NORMAL", n.text = "立即抢购")
                }
                return n
            },
            getActivityTime: function(t, e) {
                try {
                    var n = new Date(t.replace(/-/g, "/"));
                    return e && (n = n.getTime()), n
                } catch (i) {
                    return null
                }
            },
            getPriceUi: function(t, e) {
                return e = 1 == e ? "年" : "月", t / 100 + "元/" + e
            },
            getPackageById: function(t, e, n) {
                var r = this,
                    o = function(t) {
                        r._commonCb(t, function(t) {
                            e && e(t.data)
                        }, n)
                    };
                i.send(a.get("get_package_by_id"), {
                    data: t,
                    cb: o
                })
            },
            getTotalOrderNum: function(t, e) {
                var n = this,
                    r = function(i) {
                        n._commonCb(i, function(e) {
                            t && t(e.data)
                        }, e)
                    };
                i.send(a.get("get_total_order_num"), {
                    cb: r,
                    global: !1
                })
            }
        };
    n.exports = c
}), define("module/activity/activity/tpl", function(t, e, n) {
    n.exports = {
        main: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="event-wrap">\r\n					<div class="event-page">\r\n						<div class="hd">\r\n				            <h1>全场1元，微信建站套餐限量抢购</h1>\r\n				            <p class="date">活动时间：'), n(t.startMonth), n("月"), n(t.startDate), n("日-"), n(t.endMonth), n("月"), n(t.endDate), n('日</p>\r\n				        </div>\r\n				        <div class="main" data-type="package-list"></div>\r\n					</div>\r\n					<div class="set-sale">\r\n					    <div class="inner">\r\n					        <h2>活动须知</h2>\r\n					        <ul>\r\n					            <li>1. 活动时间：自'), n(t.startYear), n("年"), n(t.startMonth), n("月"), n(t.startDate), n("日至"), n(t.endYear), n("年"), n(t.endMonth), n("月"), n(t.endDate), n("日，限时优惠，售完即止</li>\r\n					            <li>2. 活动套餐均为特价，不支持退货，您购买之前可通过试用、咨询客服，充分了解套餐是否适合您的需求</li>\r\n					            <li>3. 活动结束且套餐期限届满后，用户需要进行续费方可继续使用相关服务，建站服务价格将按照续费当时的原价计算</li>\r\n					            <li>4. 特价套餐数量有限，售完即止</li>\r\n					            <li>5. 本活动最终解释权归腾讯云微信服务市场所有</li>\r\n					            <li>6. 您需要在抢购后1个小时内完成支付，否则抢购订单将自动取消，请您尽快支付</li>\r\n					        </ul>\r\n					    </div>\r\n				    </div>\r\n				</div>"), e.join("")
        },
        list: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<ul class="container">'), n(this.packages(t)), n("	</ul>"), e.join("")
        },
        packages: function(t) {
            var e, n, i = [],
                a = function(t) {
                    i.push(t)
                },
                r = t.packages,
                o = t.imgMap,
                s = t.baseImgPath;
            for (e = 0; e < r.length; e++) r[e].coverUrl = s + o[r[e].packageid], n = r[e], a("	"), e % 2 == 0 && a('			<div class="section"> '), a("		"), a(this.package(n)), a("		"), e % 2 == 1 && (a("			</div> "), e + 1 < r.length && a("			<hr>"), a("		")), a("	");
            return a(""), i.join("")
        },
        "package": function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="item" data-type="package" data-id="'), n(t.packageid), n('">\r\n					<div class="col-left" data-index="0" data-type="picture" data-event="package_view_picture" data-hot="activity.xiangqing.'), n(t.packageid), n('">\r\n						<img src="'), n(t.coverUrl), n('">\r\n						<a href="javascript:;">查看更多>></a>\r\n					</div>\r\n					<div class="col-right">\r\n						<h2 style="height:31px; overflow:hidden">'), n(this.__escapeHtml(t.packagename)), n('</h2>\r\n						<ul class="desc">\r\n							<li>\r\n								<a href="javascript:void(0);" data-event="package_view_provider" data-type="provider" data-id="'), n(t.providerid), n('" data-hot="activity.fuwushang.'), n(t.providerid), n('">'), n(this.__escapeHtml(t.providername)), n('					</a> | \r\n								<a href="javascript:void(0);" data-event="package_contact_customer" data-hot="activity.qq.'), n(t.providerqq || t.contactqq || 800033878), n('" title="点此可以直接和服务商交流功能、服务、售后等问题">咨询客服</a>\r\n							</li>\r\n							<p style="height:38px; overflow:hidden">'), n(this.__escapeHtml(t.packagedesc)), n('</p>\r\n						</ul>\r\n			\r\n						<ul class="price">\r\n							<li>\r\n								<span class="price-sale">\r\n									<strong><i>¥</i><q data-field="payprice"></q></strong>/<q data-field="payunit"></q>\r\n								</span>\r\n								<del>¥'), n(t.price4month / 100), n('/月</del>\r\n							</li>\r\n							<li>已售出<em data-field="number"></em>个（限量<q data-field="numberlimit"></q>个）</li>\r\n							<li>'), n(this.selectBtn(t)), n("</li>\r\n						</ul>\r\n					</div>\r\n				</div>"), e.join("")
        },
        selectBtn: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = {
                    evt: "activity_select_package",
                    hot: "activity.qianggou." + t.packageid,
                    btnName: "立即抢购",
                    btnExtraCls: ""
                };
            return t.activityStatus && ("NORMAL" !== t.activityStatus.code && (i.evt = "", i.hot = "", i.btnExtraCls = "disabled"), i.btnName = t.activityStatus.text), n('	<a href="javascript:void(0);" data-id="'), n(t.packageid), n('" class="btn '), n(i.btnExtraCls), n('" '), i.evt && (n(' data-event="'), n(i.evt), n('" ')), n(" "), i.hot && (n(' data-hot="'), n(i.hot), n('" ')), n(">"), n(i.btnName), n("	</a>"), e.join("")
        },
        noData: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<p style="width:960px; border:1px solid #e6e6e6;padding:14px;margin:50px auto">没有可以显示的信息</p>'), t.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/home/home", function(t, e, n) {
    var i, a = t("$"),
        r = t("router"),
        o = t("util"),
        s = t("manager"),
        c = t("lib/reporter"),
        l = t("lib/json"),
        d = t("net"),
        u = t("lib/interval"),
        p = {
            pageClass: "",
            get$Container: function() {
                return a("#container")
            },
            get$output: function() {
                return a("#g_output_home")
            },
            getOutputContent: function(t) {
                d.ajax({
                    url: "/cgi/template",
                    data: {
                        action: "home"
                    }
                }).done(function(e) {
                    e.data && e.data.html && t.call(null, e.data.html)
                })
            },
            _render: function(t, e) {
                var n = !!t.get$output().get(0),
                    r = !!e.find(".index-banner").get(0);
                if (n ? r || e.html(t.get$output().val()) : (a("body").append('<textarea style="display:none" id="g_output_home"></textarea>'), t.get$output().val(e.html())), !i) {
                    var o = e.find('[data-id="store-for-example"]');
                    i = l.parse(o.html()), e.find(".intbar").remove()
                }
                t.bindEvent(), this.getTotalOrderNum()
            },
            render: function() {
                var t = this,
                    e = t.get$Container(),
                    n = !!e.find(".index-banner").get(0),
                    i = !!t.get$output().get(0);
                t._working = !0, n || i ? t._render(t, e) : (e.html('<div class="intbar">加载...</div>'), t.getOutputContent(function(n) {
                    t._working && (e.html(n), t._render(t, e))
                })), arguments[0] && arguments[0].from && t.report("from." + arguments[0].from)
            },
            report: function(t) {
                t && c.click(t)
            },
            navigate: function(t) {
                t && (0 == t.indexOf("http") ? window.open(t) : r.navigate(t))
            },
            bindEvent: function() {
                var t = this,
                    e = t.get$Container();
                e.find('[data-id="mod-example"]').on("mouseenter", '[data-event="switch"]', this.switchExample), e.find('[hot-space="true"]').on("click", "a", function() {
                    var e = a(this);
                    t.report(e.attr("data-hot")), t.navigate(e.attr("nav-url"))
                }), t.provider(), t.banner()
            },
            switchExample: function() {
                var t = a(this),
                    e = 0 | t.attr("data-index"),
                    n = p.get$Container().find('[data-id="mod-example"]'),
                    r = i[e];
                p.report(t.attr("data-hot")), n.find('[data-id="company"]').text(r.company), n.find('[data-id="code"]').attr("src", r.code), n.find('[data-id="desc"]').text(r.desc), n.find('[data-id="logos"]').find("a").each(function() {
                    var t = a(this);
                    t.parent()[t.attr("data-index") == e ? "addClass" : "removeClass"]("on")
                });
                var o = !1,
                    s = n.find('[data-id="thumbs"]');
                s.find("[data-belong]").each(function() {
                    var t = a(this);
                    (0 | t.attr("data-belong")) === e ? (o = !0, t.show()) : t.hide()
                }), o || s.append(function() {
                    for (var t = [], n = 0, i = r.thumbs.length; i > n; n++) t.push('<li data-belong="' + e + '"><img src="' + r.thumbs[n] + '"></li>');
                    return t.join("")
                }()), n.find('[data-id="code"]').attr("src", r.code)
            },
            provider: function() {
                var t = this,
                    e = t.get$Container().find('[data-id="provider"]'),
                    n = e.find("li").length;
                if (n > 6) {
                    n % 2 == 1 && (e.find("li:eq(" + Math.floor(n / 2) + ")").after(e.find("li:eq(0)").clone()), n += 1);
                    var i = 0 - e.height() / Math.ceil(n / 2);
                    (t.providerTask = u(function() {
                        e.animate({
                            top: i
                        }, 480, "swing", function() {
                            setTimeout(function() {
                                e.find("li:last").after(e.find("li:lt(2)")), e.css("top", 0)
                            }, 0)
                        })
                    }, 4e3)).start()
                }
            },
            banner: function() {
                var t = this,
                    e = t.get$Container().find('[data-id="mod-banner"]'),
                    n = 0,
                    i = e.find("li.banner").length,
                    r = function(n, i) {
                        i && t.bannerTask.pause(), e.find("[data-banner-img]").each(function() {
                            var t = a(this),
                                e = t.attr("data-banner-img");
                            t[e == n ? "addClass" : "removeClass"]("active")
                        }), e.find("[data-banner-btn]").each(function() {
                            var t = a(this),
                                e = t.attr("data-banner-btn");
                            t[e == n ? "addClass" : "removeClass"]("active")
                        }), t.bannerTask.start()
                    };
                e.on("click", "[data-banner-btn]", function() {
                    n = 0 | a(this).attr("data-banner-btn"), r(n, !0)
                }), (t.bannerTask = u(function() {
                    n += 1, n === i && (n = 0), r(n)
                }, 3500)).start()
            },
            getTotalOrderNum: function() {
                var t = this.get$Container(),
                    e = '<div class="realtime"><strong><%=number%></strong>人正在使用微信云</div>',
                    n = t.find(".index-banner").find(".ctrl");
                s.getTotalOrderNum(function(t) {
                    var i = t.ordernumweight + t.ordernum;
                    n.append(o.tmpl(e, {
                        number: i
                    }))
                })
            },
            destroy: function() {
                var t = this;
                t._working = !1, t.providerTask && t.providerTask.clear(), t.bannerTask && t.bannerTask.clear(), t.get$Container().html("")
            }
        };
    n.exports = p
}), define("module/manual_bind/manual_bind", function(t, e, n) {
    var i, a, r, o, s = t("$"),
        c = t("util"),
        l = t("event"),
        d = t("manager"),
        u = t("dialog"),
        p = t("widget/validator/validator"),
        h = 500,
        f = 3e3,
        g = {
            pageClass: "layout-single",
            _tmpl: {
                main: '<style>.manual-bind{margin-top:60px;position: relative;}.bind-tip-box{background-color: #FBF7E3;    border: 1px solid #D8D2B5;    left: 490px;    padding: 10px;    position: absolute;    top: 58px;    width: 250px;}.bind-tip-box h3, .bind-tip-box li{margin-bottom: 10px;}.pt4{padding-top: 4px;}</style><div class="manual-bind" id="manualBindWrap" ><h1 style="font-size:18px; padding-bottom:10px; margin-bottom:20px; border-bottom:1px solid #e1e1e1">手动绑定</h1><div id="manualBindStep1"><form class="ui-form ui-form-vertical">    <div class="ui-form-group">      <label class="ui-form-label">公众号名称<sup>*</sup></label>      <div class="ui-form-ctrls">        <input type="text" data-field="nickname">        <span class="ui-help-block"></span>      </div>    </div>    <div class="ui-form-group">      <label class="ui-form-label">公众号原始ID<sup>*</sup></label>      <div class="ui-form-ctrls">        <input type="text" data-field="originalId"> <a href="javascript:void(0);" data-style="width:570px;height:510px" data-event="manual_bind_show_example" data-index="1">示例</a>        <span class="ui-help-block"></span>      </div>    </div>    <div class="ui-form-group">      <label class="ui-form-label">AppId</label>      <div class="ui-form-ctrls">        <input type="text" data-field="appId"> <a href="javascript:void(0);" data-style="width:712px;height:518px"  data-event="manual_bind_show_example" data-index="2">示例</a>        <span class="ui-help-block"></span>      </div>    </div>    <div class="ui-form-group">      <label class="ui-form-label">AppSecret</label>      <div class="ui-form-ctrls">        <input type="text" data-field="appSecret">         <span class="ui-help-block"></span>      </div>    </div>    <div class="ui-form-group">      <label class="ui-form-label"></label>      <div class="ui-form-ctrls">        <button class="ui-btn ui-btn-primary" type="button" data-event="manual_bind_next_step">下一步</button>      </div>    </div>    </form>    <div class="bind-tip-box">    <h3>说明:</h3>    <ul>    <li>1.已认证订阅号或服务号需提交待绑定公众号的AppId和AppSecret，否则自定义菜单功能无法正常使用</li>    <li>2.手工绑定后请务必保证公众号开启开发模式，如果绑定后公众号功能无法使用，请尝试重新绑定</li>    <li style="color:#f00">3.在微信公众平台绑定时，消息加密方式一定要选择明文模式</li>    </ul>    </div></div><div id="manualBindStep2" style="display:none"><form class="ui-form ui-form-vertical">    <div class="ui-form-group">      <label class="ui-form-label">URL: </label>      <div class="ui-form-ctrls pt4">        <span data-field="url"></span> <!--<a href="javascript:;" data-event="manual_bind_copy" style="margin-left:15px">复制</a>-->      </div>    </div>    <div class="ui-form-group">      <label class="ui-form-label">Token: </label>      <div class="ui-form-ctrls pt4">        <span data-field="token"></span> <!--<a href="javascript:;" data-event="manual_bind_copy" style="margin-left:15px">复制</a>-->      </div>    </div>    <div class="ui-form-group">    <div class="ui-form-ctrls">      请复制以上URL和Token, 按照<a href="javascript:void(0);" data-event="manual_bind_show_example" data-style="width:799px;height:489px" data-index="3">示例</a>, 前往<a href="javascript:;" data-event="manual_bind_go_mp">微信管理平台</a>完成手工绑定      <div style="margin-top:20px">        <button id="goBindBtn" class="ui-btn ui-btn-primary" type="button" data-event="manual_bind_go_mp">去绑定</button>      </div>        </div>    </div>    </form></div><div id="successView" style="text-align:center;display:none">            <span class="ui-alert-icon success"></span>            <div class="ui-alert-title">                <h2>绑定成功</h2>            </div>   <div class="ft-opt" style="border:none">   <a class="ui-btn ui-btn-primary" href="/manage" data-event="nav">进入管理中心</a>   </div>        </div></div>',
                example: '<img style="<%= style %>" src="http://qzonestyle.gtimg.cn/qcloud/app/resource/ac/example/manual_bind_<%= index %>.png" />'
            },
            render: function() {
                s("#container").html(this._tmpl.main), i = s("#manualBindWrap"), a = s("#manualBindStep1"), r = s("#manualBindStep2"), o = s("#successView"), this.bindEvent()
            },
            bindEvent: function() {
                var t = this;
                l.addCommonEvent("click", {
                    manual_bind_next_step: function() {
                        t.next()
                    },
                    manual_bind_go_mp: function() {
                        window.open("https://mp.weixin.qq.com"), s("#goBindBtn").attr({
                            "class": "ui-btn disabled",
                            "data-event": ""
                        }).text("绑定中..."), t.checkBindStatus()
                    },
                    manual_bind_show_example: function() {
                        var e = s(this).attr("data-index"),
                            n = s(this).attr("data-style");
                        u.create(c.tmpl(t._tmpl.example, {
                            index: e,
                            style: n
                        }), "", "", {
                            title: "示例"
                        })
                    },
                    manual_bind_copy: function() {
                        var t = s(this).parent().find("[data-field]").text();
                        window.prompt("复制到剪贴板: Ctrl+C, Enter", t)
                    }
                })
            },
            next: function() {
                var t = i.find('[data-field="nickname"]'),
                    e = i.find('[data-field="originalId"]'),
                    n = i.find('[data-field="appId"]'),
                    o = i.find('[data-field="appSecret"]'),
                    s = t.val(),
                    l = e.val(),
                    u = n.val(),
                    h = o.val(),
                    f = function(t, e) {
                        var n = {
                            tip: t,
                            needFocus: 1
                        };
                        return p.showErr(e, n)
                    };
                return "" == s ? f("公众号名称不能为空", t) : "" == l ? f("公众号原始ID不能为空", e) : "" == u && h ? f("appId与appSecret必须成对出现", n) : "" == h && u ? f("appId与appSecret必须成对出现", o) : void d.bindWechatByManual({
                    productId: c.getProductId(),
                    nickname: t.val(),
                    originalId: e.val(),
                    appId: n.val(),
                    appSecret: o.val()
                }, function(t) {
                    var e = t.data;
                    a.hide(), r.show();
                    var n = i.find('[data-field="url"]'),
                        o = i.find('[data-field="token"]');
                    n.text(e.callbackUrl), o.text(e.callbackToken)
                })
            },
            checkBindStatus: function() {
                if (!(h-- <= 0)) {
                    var t = this;
                    d.getBindProgress({
                        productId: c.getProductId()
                    }, function(e) {
                        var n = e.data;
                        1 == n ? (o.show(), a.hide(), r.hide()) : t.t = setTimeout(function() {
                            t.checkBindStatus()
                        }, f)
                    })
                }
            },
            destroy: function() {
                clearTimeout(this.t)
            }
        };
    n.exports = g
}), define("module/market/catagory/catagory", function(t, e, n) {
    var i = t("$"),
        a = t("event"),
        r = t("net"),
        o = t("./catagory/tpl"),
        s = {
            title: window.platformName + "-选择行业",
            pageClass: "layout-single",
            page: 0,
            pageSize: 8,
            pageWidth: 1e3,
            render: function() {
                i("#container").html("");
                var t = this;
                r.ajax({
                    url: "/cgi/package",
                    data: {
                        action: "queryTypes",
                        offset: 0,
                        count: 100
                    },
                    dataType: "json"
                }).done(function(e) {
                    t.setData(e.data.types)
                })
            },
            updateNavigate: function() {
                var t, e = this.$el,
                    n = this.page,
                    i = this.data.length;
                e && (t = e.find(".mod-indu-wrap"), e.find(".mod-indu-btn.pre").toggleClass("disabled", 1 > n), e.find(".mod-indu-btn.next").toggleClass("disabled", n >= i - 1))
            },
            onActionNext: function() {
                var t = this.$el,
                    e = t.find(".mod-indu-wrap"),
                    n = ++this.page;
                e.animate({
                    scrollLeft: this.pageWidth * n
                }, 200), this.updateNavigate()
            },
            onActionPrev: function() {
                var t = this.$el,
                    e = t.find(".mod-indu-wrap"),
                    n = --this.page;
                e.animate({
                    scrollLeft: this.pageWidth * n
                }, 200), this.updateNavigate()
            },
            setData: function(t) {
                t = t.slice(0);
                for (var e, n = this.pageSize, r = []; t.length;) r.push(t.splice(0, n));
                if (r.length <= 1)
                    for (e = r[0]; e.length < n;) e.push({
                        typecls: "comming",
                        typeid: 0,
                        typename: "即将推出",
                        typedesc: "即将推出"
                    });
                this.data = r, this.page = 0;
                var s = this.$el = i(o.list(r));
                s.appendTo(i("#container")), a.dispatchActionEvent(s, this), this.updateNavigate()
            },
            destroy: function() {
                this.$el && this.$el.remove()
            }
        };
    n.exports = s
}), define("module/market/catagory/catagory/tpl", function(t, e, n) {
    n.exports = {
        list: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            n('<div class="industry-select">'), t.length > 1 && n('	<span data-action="prev" class="mod-indu-btn pre"></span>\r\n				<span data-action="next" class="mod-indu-btn next"></span>'), n('	<h2>选择行业</h2>\r\n				<div class="mod-indu-wrap">\r\n					<div class="mod-indu-scroll" data-id="mod-indu-scroll" style="width: 9999px;">');
            var i, a, r, o;
            for (i = 0; i < t.length; i++) {
                for (a = t[i], n('			<ul class="clearfix mod-indu-icons">'), r = 0; r < a.length; r++) o = a[r], n('				<li class="'), n(o.typecls), n('">'), o.typeid > 0 ? (n('						<a href="/market/index/'), n(o.typeid), n('" data-event="nav" data-hot="fwsc.hangye.'), n(o.typeid), n('">')) : n('						<a href="#" data-action="void">'), n('						<i class="ico"></i>\r\n									<h3 class="tit">'), n(this.__escapeHtml(o.typename)), n('</h3>\r\n									<p class="info" style="display:none;">'), n(this.__escapeHtml(o.typedesc)), n("</p>\r\n								</a>\r\n							</li>");
                n("			</ul>")
            }
            return n("		</div>\r\n				</div>\r\n			</div>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/market/index/index", function(t, e, n) {
    var i = t("$"),
        a = t("util"),
        r = t("net"),
        o = t("router"),
        s = (t("event"), t("widget/package/list")),
        c = t("widget/login/tipLogin"),
        l = t("widget/SimpleTip"),
        d = t("lib/xExtend"),
        u = t("lib/reporter"),
        p = t("dialog"),
        h = t("widget/package/common"),
        f = t("./index/tpl"),
        g = d.define(l, {
            tpl: i.proxy(f.tip, f)
        }),
        m = null,
        v = {
            title: window.platformName + "-服务市场",
            pageClass: "layout-single",
            render: function(t) {
                this.type = t, this.$pageWrap = i("#pagewrap"), this.renderList(t), this.renderNav(t), h.init();
                var e = this;
                h.addScrollEvent(function(t, n) {
                    h.ifShowNavTop(), e.ifLoadMore(t, n)
                }), arguments[0] && arguments[0].from && u.click("from." + arguments[0].from)
            },
            _handleFeedback: function() {
                var t = this;
                new l({
                    tpl: i.proxy(f.feedbackTip, f),
                    mask: !0,
                    onShow: function() {
                        var t = this.$el.children();
                        t.css({
                            marginLeft: -t.width() / 2 + "px",
                            marginTop: -t.height() / 2 + "px"
                        });
                        var e = this,
                            n = this.$input = this.$el.find("textarea");
                        n.on("focus", function() {
                            e._markError(null)
                        }), n.on("blur", function() {
                            e._markError(e._verifyContent())
                        })
                    },
                    _getContent: function() {
                        return i.trim(this.$input.val())
                    },
                    _verifyContent: function() {
                        var t = this._getContent();
                        return t ? t.length > 500 ? "超出500字" : void 0 : "请输入您的反馈建议"
                    },
                    _markError: function(t) {
                        var e = this.$el.find(".ui-modal-body");
                        e.toggleClass("error", !!t);
                        var n = e.find("span");
                        t ? n.text(t) : n.html("&nbsp;")
                    },
                    onActionSubmit: function() {
                        var e = this._verifyContent();
                        if (e) return void this._markError(e);
                        var n = this;
                        r.ajax({
                            url: "/cgi/suggestion?action=commitSuggestion",
                            method: "post",
                            global: !1,
                            data: {
                                type: t.type || 0,
                                content: this.$el.find("textarea").val()
                            }
                        }).done(function() {
                            n.hide(), new g({
                                hideOnVoid: !0,
                                autoDissmiss: 3e3,
                                data: {
                                    type: "",
                                    title: "提交成功，感谢您的反馈！",
                                    content: ""
                                }
                            }).show()
                        }).fail(function(t) {
                            var e = t && t.code,
                                n = t && t.msg;
                            new g({
                                data: {
                                    type: "error",
                                    title: "提交失败！",
                                    content: (n || "") + (e ? "[" + e + "]" : "")
                                },
                                hideOnVoid: !0,
                                autoDissmiss: 3e3,
                                onShow: function() {
                                    g.prototype.onShow.apply(this, arguments), this.$el.css("z-index", 111)
                                }
                            }).show()
                        }).always(function() {})
                    }
                }).show()
            },
            renderList: function(t) {
                var e = i("#container"),
                    n = this.$el = i(f.main());
                n.appendTo(e.html(""));
                var r = '[data-type="package-list"]',
                    o = n.is(r) ? n : n.find('[data-type="package-list"]'),
                    c = this.list = new s({
                        $el: o
                    }),
                    l = {
                        productId: a.getProductId(),
                        limit: 20,
                        showActivity: !0
                    };
                t && !isNaN(parseInt(t)) && (l.type = t);
                c.load(l), c.on("selectpackage", this._handleSelectPackage, this), c.on("buypackage", this._handleBuyPackage, this), c.on("feedback", this._handleFeedback, this)
            },
            _commonTips: function(t, e, n) {
                var i = {};
                i[e] = function() {
                    n && n(), p.hide()
                }, p.create(f.trialTips({
                    tips: t
                }), "", "", {
                    title: "提示",
                    button: i
                })
            },
            _handleBuyPackage: function(t) {
                var e = this;
                this._commonTips("您已经试用过此套餐，继续使用请先购买", "立即购买", function() {
                    o.navigate(e.$el.find(".package-list").filter("[data-id=" + t + "]").find(".activity-mark").length ? "/personal/packages/activity/" + t : "/personal/packages/buy/" + t)
                })
            },
            _handleSelectedPackage: function() {
                this._commonTips("您已经选用过此套餐，请前往套餐管理页面查看", "立即查看", function() {
                    o.navigate("/personal/packages/list")
                })
            },
            _handleHasOrder: function(t) {
                this._commonTips("您已创建过试用订单，请先去支付", "立即支付", function() {
                    o.navigate("/personal/packages/pay/" + t)
                })
            },
            _handleSelectPackage: function(t, e, n) {
                var i = this;
                this._assureLogin(n.$target).done(function() {
                    i._trialPackage(t).done(function() {
                        o.redirect("/personal/packages/trial/" + t)
                    })
                })
            },
            _trialPackage: function(t) {
                var e = this,
                    n = i.Deferred(),
                    a = new g({
                        data: {
                            type: "",
                            title: "套餐添加中，请稍候...",
                            content: ""
                        }
                    });
                return a.show(), r.ajax({
                    url: "/cgi/order?action=trialPackage",
                    method: "post",
                    global: !1,
                    data: {
                        packageId: t
                    }
                }).done(function() {
                    n.resolve()
                }).fail(function(i) {
                    {
                        var a = i && i.code;
                        i && i.msg
                    }
                    switch (a) {
                        case 231:
                            p.create(f.beyondLimit(), "", "", {
                                title: "提示",
                                defaultCancelBtn: !1,
                                button: {
                                    "我知道了": function() {
                                        p.hide()
                                    }
                                }
                            });
                            break;
                        case 219:
                            var r = i.data;
                            if (r && r.order) {
                                var o = 0 == r.order.status && r.order.orderid;
                                o ? e._handleHasOrder(o) : e._handleSelectedPackage(t)
                            } else e._handleBuyPackage(t);
                            break;
                        case 220:
                            e._handleSelectedPackage(t);
                            break;
                        default:
                            new g({
                                data: {
                                    type: "error",
                                    title: "套餐添加失败，请稍候重试",
                                    content: ""
                                },
                                hideOnVoid: !0,
                                autoDissmiss: 5e3
                            }).show()
                    }
                    n.reject()
                }).always(function() {
                    a.hide()
                }), n
            },
            _assureLogin: function(t) {
                var e = i.Deferred();
                return c.isLogin() ? e.resolve() : c.show(t).done(function() {
                    e.resolve()
                }), e
            },
            ifLoadMore: function(t, e) {
                var n = this.list,
                    i = t;
                !n.isComplete() && i.scrollTop() + i.height() > (e ? e : i[0].scrollHeight) - 200 && n.loadmore()
            },
            renderNav: function(t) {
                var e = this;
                isNaN(parseInt(t)) && (t = ""), m ? e._doRenderNav(m, t) : r.ajax({
                    url: "/cgi/package",
                    data: {
                        action: "queryTypes",
                        offset: 0,
                        count: 100
                    },
                    dataType: "json"
                }).done(function(n) {
                    m = n.data.types, /\/market/.test(location.href) && e._doRenderNav(m, t)
                })
            },
            _doRenderNav: function(t, e) {
                var n = this.$navCt = i("#subnav"),
                    a = this.$nav = i(f.nav({
                        type: e,
                        types: t
                    }));
                a.appendTo(n.html("")), n.show()
            },
            destroy: function() {
                h.destroy && h.destroy(), this.list && this.list.destroy(), this.$el && this.$el.remove(), this.$nav && this.$nav.remove(), this.$navCt && this.$navCt.hide()
            }
        };
    n.exports = v
}), define("module/market/index/index/tpl", function(t, e, n) {
    n.exports = {
        main: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div data-type="package-list" class="package"></div>'), t.join("")
        },
        nav: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            n('<ul class="nav">\r\n					<li class="'), n(t.type ? "" : "on"), n('"><a href="/market/index" data-event="nav">全部</a></li>');
            var i, a, r = t.types;
            for (i = 0; i < r.length; i++) a = r[i], n('			<li class="'), n(t.type == a.typeid ? "on" : ""), n('">\r\n							<a href="/market/index/'), n(a.typeid), n('" data-event="nav" data-hot="fwsc.hangye.'), n(a.typeid), n('">'), n(this.__escapeHtml(a.typename)), n("</a>\r\n						</li>");
            return n("	</ul>"), e.join("")
        },
        beyondLimit: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<span class="ui-alert-icon error"></span>\r\n				<div class="ui-alert-title" style="text-align: left;">\r\n					<h3 style="font-size:18px">暂不支持单个帐号购买超过20个套餐</h3>\r\n				</div>'), t.join("")
        },
        trialTips: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div style="padding:20px;">\r\n					<span style="font-size:18px;">'), n(t.tips), n("</span>\r\n				</div>"), e.join("")
        },
        feedbackTip: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div style="position: absolute; z-index: 110;">\r\n					<div class="ui-modal">\r\n						<button type="button" class="ui-btn ui-btn-link" data-action="hide">×</button>\r\n						<div class="ui-modal-header">\r\n							<h3>请描述您需要的套餐类型</h3>\r\n						</div>\r\n						<div class="ui-modal-body">\r\n							<textarea style="width: 380px; height: 120px" placeholder="请输入500字以内套餐描述"></textarea>\r\n							<span class="ui-help-block">&nbsp;</span>\r\n						</div>\r\n						<div class="ui-modal-footer">\r\n							<a href="javascript:;" data-action="submit" class="ui-btn ui-btn-primary ui-btn-wid">提交</a>\r\n							<a href="javascript:;" data-action="hide" class="ui-btn ui-btn-wid">关闭</a>\r\n						</div>\r\n					</div>\r\n				</div>'), t.join("")
        },
        tip: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="ui-alert '), n(t.type), n('" style="position:fixed; left:50%; top:50%;">\r\n					<span class="icon"></span>\r\n					<div class="title">\r\n						<h2>'), n(this.__escapeHtml(t.title)), n(t.titleHtml || ""), n("</h2>"), (t.content || t.html) && (n("				<p>"), n(this.__escapeHtml(t.content)), n(t.html), n("</p>")), n("		</div>\r\n				</div>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/expense/ConditionBar", function() {}), define("module/personal/expense/expense", function(t, e, n) {
    var i = (t("lib/observable"), t("lib/xExtend")),
        a = t("event"),
        r = t("net"),
        o = t("$"),
        s = t("./List"),
        c = t("module/personal/packages/Constants"),
        l = t("widget/register/Form"),
        i = t("lib/xExtend"),
        d = t("widget/SimpleTip"),
        u = t("manage/widget/tenpay_recharge/TenpayRecharge"),
        p = t("./expense/tpl"),
        h = 2e7,
        f = "2千万",
        g = i.define(l, {
            errorTipStyle: "down",
            bind: function(t) {
                this.$el = t, this.$balanceInput = this.$el.find("input").focus(), this._doHookInput(this.$balanceInput, this._doVerifyBalance, this)
            },
            tryRecharge: function() {
                if (this._doVerifyBalance()) {
                    var t = 100 * parseFloat(this.$balanceInput.val());
                    this.doRecharge(t)
                }
            },
            doRecharge: o.noop,
            _doVerifyBalance: function() {
                var t, e = this.$balanceInput,
                    n = o.trim(e.val()) || "",
                    i = n.replace(/,/g, ""),
                    a = parseFloat(n);
                return n ? !/^\d+(\.\d+)?$/.test(i) || isNaN(a) || 0 >= a ? t = "无效的金额" : /^\d+(\.\d{1,2})?$/.test(a + "") ? a > h && (t = "目前支持" + f + "元以内的金额") : t = "金额的小数位应在2位以内" : t = "请输入金额", this._markField(e, t), !t
            },
            destroy: function() {
                this.$el.remove()
            }
        });
    n.exports = {
        title: window.platformName + "-费用中心",
        pageSize: 20,
        pageCount: 1,
        page: 0,
        render: function() {
            this.$pageWrap = o("#pagewrap").addClass("layout-single");
            var t = this.list = new s,
                e = o("#container").html(p.main());
            t.render(e.find('[data-name="list"]')), this.$balance = e.find('[data-name="balance"]'), this.$extraBalanceBlock = e.find('[data-name="extraBalanceBlock"]'), this.$extraBalance = e.find('[data-name="extraBalance"]'), this._doUpdateBalance(), this.conditionBar = {
                getConfig: function() {
                    return {}
                }
            }, this.$pager = e.find('[data-name="pager"]'), this._handler = a.dispatchActionEvent(e, this), this._doLoad()
        },
        onActionPage: function(t) {
            t.parent().is(".disabled,.active") || (this.page = parseInt(t.attr("data-page"), 10) || 0, this._doLoad())
        },
        onActionRecharge: function() {
            if (!this.rechargeTip) {
                var t = this,
                    e = this.rechargeTip = new d({
                        html: p.recharge(),
                        onShow: function() {
                            d.prototype.onShow.apply(this, arguments);
                            var e = this,
                                n = this.form = new g({
                                    doRecharge: function(n) {
                                        t.doRecharge(n), e.hide()
                                    }
                                });
                            n.bind(this.$el)
                        },
                        onActionRecharge: function() {
                            this.form.tryRecharge()
                        },
                        onHide: function() {
                            d.prototype.onHide.apply(this, arguments), t.rechargeTip = null
                        }
                    });
                e.show()
            }
        },
        doRecharge: function(t) {
            var e = this,
                n = new d({
                    html: p.waitRecharge(),
                    mask: !0,
                    onActionFail: function() {
                        window.open(c.RECHARGE_FAILED_WIKI), e._doUpdateBalance(), e._doLoad(), this.hide()
                    },
                    onActionSuccess: function() {
                        e._doUpdateBalance(), e._doLoad(), this.hide()
                    },
                    onHide: function() {
                        d.prototype.onHide.apply(this, arguments), e._tenpayWin && e._tenpayWin.destroy()
                    }
                });
            n.show(), e._tenpayWin && e._tenpayWin.destroy(), e._tenpayWin = new u({
                amount: t,
                callback: function(t) {
                    t && n.onActionSuccess(), e._tenpayWin = null
                }
            }), e._tenpayWin.open()
        },
        _doUpdateBalance: function() {
            var t = this;
            r.ajax({
                url: "/cgi/recharge?action=queryBalance"
            }).done(function(e) {
                var n = parseInt(e.data.balance, 10),
                    i = parseInt(e.data.extrabalance, 10);
                t.$balance.html(((n + i) / 100).toFixed(2)), t.$extraBalanceBlock.toggle(i > 0), t.$extraBalance.html((i / 100).toFixed(2))
            })
        },
        _doLoad: function() {
            var t = this,
                e = this.conditionBar.getConfig(),
                n = this.pageSize,
                i = this.page,
                a = i * n,
                s = n;
            r.ajax({
                url: "/cgi/recharge?action=queryCost",
                data: o.extend(e, {
                    offset: a,
                    count: s
                })
            }).done(function(e) {
                var a = e.data.costs;
                t.list.setData(a);
                var r = e.data.totalnum,
                    o = t.pageCount = Math.max(1, Math.ceil(r / n));
                t.$pager.html(o > 1 ? p.pager({
                    pageSize: n,
                    pageCount: o,
                    page: i
                }) : "")
            })
        },
        destroy: function() {
            o("#container").off("click", this._handler), this.$pageWrap && this.$pageWrap.removeClass("layout-single"), this.rechargeTip && this.rechargeTip.destroy()
        }
    }
}), define("module/personal/expense/expense/tpl", function(t, e, n) {
    n.exports = {
        main: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div class="set-meal">\r\n					<h1>费用中心</h1>\r\n					<h3 style="font-size: 16px;margin-bottom: 20px;">\r\n						可用金额：<em data-name="balance" style=\'color: #f38101;font-style: italic;font-family: "helvetica";font-weight: bold;font-size: 20px;margin-right:8px;\'>-</em><span>元</span>\r\n						<span data-name="extraBalanceBlock" style="display:none;">\r\n							（含赠送金额：<em data-name="extraBalance" style=\'color: #f38101;font-style: italic;font-family: "helvetica";font-weight: bold;font-size: 20px;margin-right:8px;\'>-</em>元）\r\n						</span>\r\n						<button type="button" class="ui-btn ui-btn-small ui-btn-primary" data-action="recharge" style="margin-left: 10px;display:none;">充值</button>\r\n					</h3>\r\n					<div data-name="condition"></div>\r\n					<div data-name="list"></div>\r\n					<div data-name="pager" class="ui-pagination"></div>\r\n					<div class="ui-pagination"></div>\r\n				</div>'), t.join("")
        },
        pager: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            n("<ul>");
            var i = t.page,
                a = t.pageCount;
            n('		<li class="'), n(0 >= i ? "disabled" : ""), n('"><a href="#" data-action="page" data-page="0">&#171;</a></li>');
            var r;
            for (r = 0; a > r; r++) n('			<li class="'), n(r === i ? "active" : ""), n('"><a href="#" data-action="page" data-page="'), n(r), n('">'), n(r + 1), n("</a></li>");
            return n('		<li class="'), n(i >= a - 1 ? "disabled" : ""), n('"><a href="#" data-action="page" data-page="'), n(a - 1), n('">&#187;</a></li>\r\n				</ul>'), e.join("")
        },
        recharge: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div class="ui-modal" style="position: fixed; left: 50%; top: 50%;">\r\n					<button type="button" class="ui-btn ui-btn-link" data-action="hide">×</button>\r\n					<div class="ui-modal-header">\r\n						<h3>充值</h3>\r\n					</div>\r\n					<div class="ui-modal-body ui-form ui-form-vertical" style="width: 335px;height: 80px;padding-bottom:0px;">\r\n						<div class="ui-form-group">\r\n							<label class="ui-form-label">充值金额（元）</label>\r\n							<div class="ui-form-ctrls">\r\n								<input type="text" class="ui-input-small" maxlength="8" />'), e('				</div>\r\n						</div>\r\n					</div>\r\n					<div class="ui-modal-footer">\r\n						<a href="javascript:;" data-action="recharge" class="ui-btn ui-btn-primary ui-btn-wid">确定</a>\r\n						<a href="javascript:;" data-action="hide" class="ui-btn ui-btn-wid">取消</a>\r\n					</div>\r\n				</div>'), t.join("")
        },
        waitRecharge: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div class="ui-modal" style="position: fixed; left: 50%; top: 50%;">\r\n					<!--<button type="button" class="ui-btn ui-btn-link" data-action="hide">×</button>-->\r\n					<div class="ui-modal-header">\r\n						<h3>充值确认</h3>\r\n					</div>\r\n					<div class="ui-modal-body">\r\n						<div class="payment-popup">\r\n							<div class="ui-alert-title">\r\n								<p style="padding:40px 0 40px 116px;">请在新开的财付通充值页面完成充值</p>\r\n							</div>\r\n						</div>\r\n					</div>\r\n					<div class="ui-modal-footer">\r\n						<a href="javascript:;" data-action="success" class="ui-btn ui-btn-wid ui-btn-primary">已完成充值</a>\r\n						<a href="javascript:;" data-action="fail" class="ui-btn ui-btn-wid">充值遇到问题</a>\r\n					</div>\r\n				</div>'), t.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/expense/List", function(t, e, n) {
    var i = t("lib/observable"),
        a = t("lib/xExtend"),
        r = (t("event"), t("net"), t("$")),
        o = t("./List/tpl"),
        s = a.define(i, {
            page: 20,
            render: function(t) {
                var e = this.$el = r(o.list()).appendTo(t);
                this.$body = e.find("tbody")
            },
            setData: function(t) {
                var e;
                t && t.length ? (r.each(t, function(t, e) {
                    e.time = e.inserttime && e.inserttime.slice(0, 10)
                }), e = o.expenses(t)) : e = o.empty(), this.$body.html(e)
            },
            destroy: function() {
                this.$el && this.$el.remove()
            }
        });
    n.exports = s
}), define("module/personal/expense/List/tpl", function(t, e, n) {
    n.exports = {
        list: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<table class="ui-table ui-table-striped ui-table-bordered">\r\n					<thead>\r\n						<tr>\r\n							<th>时间</th>\r\n							<th>操作</th>\r\n							<th>存入（元）</th>\r\n							<th>支出（元）</th>\r\n							<th>余额（元）</th>\r\n						</tr>\r\n					</thead>\r\n					<tbody>'), n(t ? t.length ? this.expenses(t) : this.empty() : ""), n("</tbody>\r\n				</table>"), e.join("")
        },
        expenses: function(t) {
            var e, n, i = [],
                a = function(t) {
                    i.push(t)
                };
            for (e = 0; e < t.length; e++) n = t[e], a("		<tr>\r\n						<td>"), a(n.time), a("</td>\r\n						<td>"), a(n.operation), a("</td>\r\n						<td>"), a(n.type ? n.amount / 100 : "-"), a("</td>\r\n						<td>"), a(n.type ? "-" : n.amount / 100), a("</td>\r\n						<td>"), a(((n.balance + n.extrabalance) / 100).toFixed(2)), a(n.extrabalance > 0 ? "（含赠送金额：" + (n.extrabalance / 100).toFixed(2) + "）" : ""), a("</td>\r\n					</tr>");
            return a(""), i.join("")
        },
        empty: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<tr>\r\n					<td colspan="5">未查询到消费记录</td>\r\n				</tr>'), t.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/order/order", function(t, e, n) {
    var i = t("$"),
        a = t("wxManager"),
        r = t("router"),
        o = (t("util"), t("lib/dates")),
        s = t("./order/tpl"),
        c = t("manage/widget/statushelper/StatusHelper"),
        l = {},
        d = {
            formatTime: function(t) {
                try {
                    return o.format(o.fromISO(t), !1)
                } catch (e) {
                    return "--"
                }
            },
            getStatus: function(t) {
                return c.orderStatus(t)
            },
            getPerPrice: function(t, e, n) {
                return n = n || 1, d.toYuan(Math.ceil(e / n)) + "元/" + (0 == t ? "月" : "年")
            },
            getPeriod: function(t, e, n) {
                var i = 0 != e ? e + (0 == t ? "月" : "年") : "";
                return i += n ? n + "天" : "", i ? i : "--"
            },
            toYuan: function(t) {
                return t ? Math.round(100 * t) / 1e4 : 0
            }
        },
        u = {
            pageClass: "layout-single",
            title: window.platformName + "-订单管理",
            render: function() {
                var t = this;
                (t.$body = i("#container").html(s.body()).find('[data-id="body"]')).on("click", '[data-action="redelivery"]', function(t) {
                    t.preventDefault();
                    var e = i(this).closest("[data-order-id]").attr("data-order-id"),
                        n = i(this).closest('[data-name="status"]'),
                        a = n.html();
                    n.text("处理中..."), c.deliveryOrder(e).done(function(t) {
                        n.replaceWith(s.status({
                            status: t
                        }))
                    }).fail(function() {
                        n.html(a)
                    })
                }).on("click", "[data-page]", function(e) {
                    var n = i(this).attr("data-page");
                    t.getData("first" == n ? l.minPage : "last" == n ? l.maxPage : n - 1), e.stopImmediatePropagation()
                }).on("click", '[data-action="payorder"]', function() {
                    var t = i(this).closest("[data-order-id]").attr("data-order-id");
                    r.redirect("/personal/packages/pay/" + t)
                }), t.getData()
            },
            getData: function(t) {
                var e = this,
                    n = 6,
                    i = t || 0,
                    r = function(t) {
                        if (0 == t.code) {
                            var a = t.data.totalnum;
                            if (a > 0) {
                                l = {
                                    minPage: 0,
                                    current: i
                                }, l.pageNum = Math.ceil(a / n), l.maxPage = l.pageNum - 1;
                                var r = l.maxPage > 0 ? s.pagination(l) : "";
                                e.$body.html([r, s.list({
                                    orders: t.data.orders,
                                    tool: d
                                }), r].join(""))
                            } else e.$body.html(s.empty())
                        }
                    };
                a.getUsrOrderList({
                    offset: i * n,
                    count: n
                }, r)
            },
            showMask: function() {
                var t = this;
                (t.$mask = i(s.mask()).appendTo(t.$body)).show()
            },
            hideMask: function() {
                this.$mask && this.$mask.hide()
            },
            destroy: function() {
                this.$body.parent().remove(), delete this.$mask
            }
        };
    n.exports = u
}), define("module/personal/order/order/tpl", function(t, e, n) {
    n.exports = {
        body: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div class="set-meal">\r\n			        <h1>订单管理</h1>\r\n			        <div data-id="body" style="position:relative;">正在加载...</div>\r\n			    </div>'), t.join("")
        },
        pagination: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            n('<div style="text-align: center;" data-id="section">\r\n			        <span class="ui-pagination">\r\n			            <ul>');
            var i = [];
            t.current !== t.minPage && i.push('<li><a href="javascript:;" data-page="first">«</a></li>');
            for (var a = 0, r = t.pageNum; r > a; a++) i.push(a === t.current ? '<li class="active"><a href="javascript:;">' + (a + 1) + "</a></li>" : '<li><a href="javascript:;" data-page="' + (a + 1) + '">' + (a + 1) + "</a></li>");
            return t.current !== t.maxPage && i.push('<li><a href="javascript:;" data-page="last">»</a></li>'), n("            "), n(i.join("")), n("            </ul>\r\n			        </span>\r\n			    </div>"), e.join("")
        },
        mask: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div style="opacity: 0.5;position: absolute;top: 0;left: 0;width: 100%;height: 100%;background-color: #000;">\r\n			        <div style="position: absolute;top: 50%;left: 50%;width: 17px;height: 21px;\r\n			            background: url(http://qzonestyle.gtimg.cn/qcloud/app/resource/ac/public/loading-primary.gif) no-repeat center center;"></div>\r\n			    </div>'), t.join("")
        },
        empty: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<table class="ui-table ui-table-bordered" style="margin-bottom:20px;">\r\n			        <tr><td colspan="6">\r\n			        <div class="detail-bar">您尚无订单记录</div></td></tr>\r\n			    </table>'), t.join("")
        },
        list: function(t) {
            for (var e = [], n = function(t) {
                    e.push(t)
                }, i = 0, a = t.orders.length; a > i; i++) {
                var r = t.orders[i],
                    o = r.subOrders[0],
                    s = t.tool.getStatus(r);
                n('            <table data-order-id="'), n(r.orderid), n('" class="ui-table ui-table-bordered" style="margin-bottom:20px;">\r\n			              <colgroup>\r\n			                <col style="width: 20%">\r\n			                <col style="width: 20%">\r\n			                <col style="width: 15%">\r\n			                <col style="width: 13%">\r\n			                <col style="width: 12%">\r\n			                <col style="width: 20%">\r\n			              </colgroup>\r\n			              <thead>\r\n			                <tr><td colspan="6">\r\n			                    <div class="detail-bar">\r\n			                        <span>订单号：'), n(r.orderid), n("</span>\r\n			                        <span>提单人："), n(r.owneruin), n("</span>\r\n			                        <span>提单时间："), n(this.__escapeHtml(t.tool.formatTime(r.inserttime))), n("</span>\r\n			                     </div></td></tr>\r\n			                <tr>\r\n			                  <th>套餐名称</th><th>服务商</th><th>单价</th><th>时长</th>\r\n			                  <th>应付款</th>\r\n			                  <th>状态</th>\r\n			                </tr>\r\n			              </thead>\r\n			              <tbody>\r\n			                <tr>\r\n			                  <td>"), n(this.__escapeHtml(o.packagename)), n("</td>\r\n			                  <td>"), n(this.__escapeHtml(o.providername)), n("</td>\r\n			                  <td>"), n(t.tool.getPerPrice(o.payunit, 0 == r.ordertype ? r.payprice : r.price, o.paynum)), n("</td>\r\n			                  <td>"), n(t.tool.getPeriod(o.payunit, o.paynum, o.freedays)), n("</td>\r\n			                  <td>"), n(t.tool.toYuan(r.payprice)), n("元</td>\r\n			                  <td>"), n(this.status({
                    status: s
                })), n("</td>\r\n			                </tr>\r\n			              </tbody>\r\n			            </table>")
            }
            return n(""), e.join("")
        },
        status: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.status;
            return n('    <span data-name="status" class="ui-status '), n(i.cssClass), n('">'), n(i.text), n("</span>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/packages/BaseBuyView", function(t, e, n) {
    var i = t("$"),
        a = t("wxManager"),
        r = t("util"),
        o = t("lib/dates"),
        s = t("lib/reporter"),
        c = t("main/router"),
        l = t("./config/manager"),
        d = t("manager"),
        u = (t("./Service"), t("./RechargeDialog")),
        p = t("./FailedDialog"),
        h = t("./Constants"),
        f = t("./BaseBuyView/tpl"),
        g = t("manage/widget/tenpay_recharge/TenpayRecharge"),
        m = t("widget/Loading"),
        v = function(t) {
            this.title = t.title || "", this.packageId = t.packageId, this.productId = t.productId || r.getProductId(), this.orderId = t.orderId, this.mode = t.mode, this.packageList = [], this.opName = t.opName, this.afterPayText = t.afterPayText
        };
    v.prototype = {
        balance: null,
        packageList: null,
        _failedDialog: null,
        getPackage: function() {
            throw new Error("请覆盖BaseBuyView.getPackage()方法")
        },
        render: function(t) {
            var e = this,
                n = function() {
                    e.$container = t.empty(), e._init(), e._rendered = !0, e._load()
                };
            "pay" == this.mode ? a.getUsrOrderList({
                orderId: e.orderId,
                count: 1
            }, function(i) {
                var a = i.data.orders;
                if (a.length && a[0].subOrders.length) {
                    var r = a[0];
                    3 == r.status ? t.html(f.pageError({
                        title: e.title,
                        text: "订单已失效"
                    })) : (e.order = r, e.packageId = r.packageid, n())
                } else t.html(f.pageError({
                    title: e.title,
                    text: "订单不存在"
                }))
            }) : "activity" == this.mode ? d.getActivityByPackageid({
                packageId: e.packageId,
                offset: 0,
                count: 1
            }, function(i) {
                var a = i.saleactivitys;
                if (a.length) {
                    var r = d.getActivityStatus(a[0], i);
                    if ("NORMAL" == r.code) {
                        var o = a[0];
                        e.activity = o, n()
                    } else t.html(f.pageError({
                        title: e.title,
                        text: r.text
                    }))
                } else t.html(f.pageError({
                    title: e.title,
                    text: "活动不存在"
                }))
            }) : n()
        },
        destroy: function() {
            this.$el && (this.$el.remove(), this.$el = null), this.$container = null, this._initData(), this._failedDialog && this._failedDialog.destroy(), this._tenpayWin && this._tenpayWin.destroy(), this._rendered = !1
        },
        _init: function() {
            var t = this;
            t.$el = i(f.main({
                title: t.title
            })), t.$el.appendTo(this.$container), t._events()
        },
        _load: function() {
            var t, e, n, i = this,
                a = 0,
                r = function() {
                    i._rendered && 2 === a && (i._initData(e, t), i._renderDOM(n))
                };
            i._initData(), i.getPackage(i.packageId).done(function(e, n) {
                "string" != typeof e && (n = e), t = n ? n instanceof Array ? n : [n] : []
            }).always(function(t) {
                n = t, ++a, r()
            }), l.getTenpayBalance().done(function(t) {
                e = t
            }).always(function() {
                ++a, r()
            })
        },
        _initData: function(t, e) {
            var n = this;
            n.packageList = e || [], n.balance = t, i.each(n.packageList, function(t, e) {
                if ("pay" == n.mode) {
                    e.orderMode = !0, e.orderType = n.order.ordertype;
                    var a = n.order.subOrders[0];
                    e.count = a.paynum, e.unit = 1 == a.payunit ? "YEAR" : "MONTH", e.freedays = a.freedays, e.payprice = n.order.payprice
                } else if ("trial" == n.mode) e.trialMode = !0;
                else if ("activity" == n.mode) {
                    e.activityMode = !0;
                    var r = n.activity;
                    e.activity = r, e.limitpaynum = r.paynum, e.unit = 1 == r.payunit ? "YEAR" : "MONTH", e.payprice = r.payprice
                }
                e.onChange = i.noop
            })
        },
        _reloadBalance: function() {
            var t = this;
            l.getTenpayBalance().done(function(e) {
                t._rendered && "undefined" != typeof e && (t.balance = e, t._updateButton())
            })
        },
        _updateButton: function() {
            var t = this,
                e = t.$el.find('[data-action="pay"]'),
                n = t.$el.find('[data-action="recharge"]'),
                a = i("#paymentTr"),
                r = t.isEnoughBalance();
            e.toggle(r), n.toggle(!r), a.toggle(!r)
        },
        getAmount: function() {
            var t = 0;
            return i.each(this.packageList, function(e, n) {
                t = (Math.round(100 * t) + Math.round(100 * n.getAmount())) / 100
            }), t
        },
        getBalanceUI: function(t) {
            if ("number" != typeof this.balance) return "未知";
            var e = Math.round(100 * this.balance) / 1e4;
            return t ? t.replace(/\{0\}/, e) : e
        },
        isEnoughBalance: function() {
            return this.balance >= this.getAmount()
        },
        getBalanceStatus: function() {
            return this.isEnoughBalance() ? "success" : "danger"
        },
        formatTime: function(t) {
            try {
                return o.format(o.fromISO(t), !1)
            } catch (e) {
                return "--"
            }
        },
        _renderDOM: function(t) {
            if (this.$el) {
                var e = this,
                    n = {
                        view: this,
                        readonly: h.RECHARGE_AMOUNT_READONLY,
                        action: t,
                        order: "pay" == e.mode ? {
                            orderid: e.order.orderid,
                            owneruin: e.order.owneruin,
                            inserttime: e.formatTime(e.order.inserttime)
                        } : null,
                        activity: "activity" == e.mode ? {
                            remark: e.activity.remark
                        } : null
                    };
                if ("activity" == e.mode) {
                    var a = d.getActivityTime(e.activity.begintime),
                        r = d.getActivityTime(e.activity.endtime);
                    n.activityDate = a && r ? {
                        startYear: a.getFullYear(),
                        startMonth: a.getMonth() + 1,
                        startDate: a.getDate(),
                        endYear: r.getFullYear(),
                        endMonth: r.getMonth() + 1,
                        endDate: r.getDate()
                    } : {}
                }
                var o = i(f.packagePay(n)).appendTo(e.$el.children('[data-id="container"]').empty()),
                    s = i('tbody[data-id="packages"]', o);
                e.packageList.length && i.each(e.packageList, function(t, n) {
                    n.render(s), n.onChange = function(t) {
                        "count" == t && e._updateButton()
                    }
                })
            }
        },
        _events: function() {
            var t = this;
            t.$el.on("click", '[data-action="recharge"]', function() {
                var e;
                0 == t.balance && (e = window.open()), t._createOrder(t.packageList[0]).done(function(n) {
                    t._showRecharge(t.getAmount(), n, e)
                }).fail(function() {
                    e && e.close()
                }), s.click("taocangl.pay")
            }), t.$el.on("click", '[data-action="pay"]', function() {
                t._createOrder(t.packageList[0]).done(function(e) {
                    t._buy(e)
                }), s.click("taocangl.pay")
            })
        },
        _createOrder: function(t) {
            if (t) {
                var e = this,
                    n = i.Deferred();
                if (e.orderId) return n.resolve(e.orderId), n;
                var a = "createOrder",
                    r = {
                        packageId: t.id,
                        unit: t.unit,
                        count: t.count
                    };
                return "trial" == e.mode ? (a = "createTrialOrder", r = {
                    packageId: t.id
                }) : "activity" == e.mode && (a = "createActivityOrder", r.saleActivityId = e.activity.saleactivityid), l[a](r).done(function(t) {
                    n.resolve(t)
                }).fail(function(t, i) {
                    var a = t.data,
                        r = a && a.order && 0 == a.order.status && a.order.orderid;
                    219 == t.code && r ? n.resolve(r) : (e._buyFailedMsg(i, t.code), n.reject())
                }).always(function() {
                    e._hideTip()
                }).progress(function(t) {
                    e._showTip("", "处理中，请稍候", t)
                }), n
            }
        },
        _buy: function(t) {
            if (t) {
                var e = this,
                    n = i.Deferred();
                return l.pay(t).done(function() {
                    e._showOrderSuccess(t), n.resolve(t)
                }).fail(function(i, a) {
                    return a === h.ERR_DELIVERY_FAILED ? (e._showOrderSuccess(t), void n.resolve(t)) : (a === h.ERR_PAY_FAILED && e._reloadBalance(), e._buyFailedMsg(a, i.code), void n.reject())
                }).always(function() {
                    e._hideTip()
                }).progress(function(t) {
                    e._showTip("", "处理中，请稍候", t)
                }), n
            }
        },
        _showOrderSuccess: function(t) {
            c.redirect("/personal/packages/success/" + t)
        },
        _showRecharge: function(t, e, n) {
            var i = this,
                a = i.balance,
                r = !0,
                o = new u(r);
            o.destroy(), o.render(), o.setBalance(this.balance), o.setAmount(t);
            var s = o.getDeferred();
            if (0 === a) {
                var c = Math.max(Math.round(100 * (t - a)) / 100, 0);
                i._tenpayWin && i._tenpayWin.destroy(), i._tenpayWin = new g({
                    amount: c,
                    win: n,
                    callback: function(t, n) {
                        t ? i._buy(e) : i._reloadBalance(), !n && o.destroy()
                    }
                }), s.done(function() {
                    i._buy(e)
                }), s.always(function() {
                    i._tenpayWin && i._tenpayWin.destroy(), i._reloadBalance()
                }), o.showWait("充值")
            } else o.showRecharge(), r ? s.done(function() {
                i._buy(e), o.destroy()
            }).fail(function(t) {
                i._reloadBalance(), !t && o.destroy()
            }) : s.always(function() {
                i._reloadBalance(), o.destroy()
            })
        },
        _buyFailedMsg: function(t, e) {
            var n = this._failedDialog || (this._failedDialog = new p);
            n.show(t, e)
        },
        _showTip: function(t, e, n) {
            m.show("BaseBuyView", t, e, n, !0)
        },
        _hideTip: function() {
            m.hide("BaseBuyView")
        }
    }, n.exports = v
}), define("module/personal/packages/BaseBuyView/tpl", function(t, e, n) {
    n.exports = {
        main: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="set-meal">\r\n			        <h1>'), n(t.title), n('</h1>\r\n			        <div data-id="container">\r\n			            <table class="ui-table ui-table-bordered" style="margin-bottom:20px">\r\n			                <tr><td colspan="6"><div class="detail-bar">正在加载...</div></td></tr>\r\n			            </table>\r\n			        </div>\r\n			    </div>'), e.join("")
        },
        pageError: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="set-meal">\r\n			        <h1>'), n(t.title), n('</h1>\r\n			        <p style="padding:14px; border:1px solid #e6e6e6">'), n(t.text), n("</p>\r\n			    </div>"), e.join("")
        },
        packagePay: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.view,
                a = t.readonly,
                r = t.action,
                o = i.opName,
                s = i.afterPayText,
                c = i.mode,
                l = t.order,
                d = t.activity,
                u = t.activityDate;
            return i.packageList.length ? (n('  \r\n			        <!-- 套餐表格 -->\r\n			        <table class="ui-table ui-table-bordered">\r\n			            <colgroup>\r\n			                <col>\r\n			                <col style="width: 20%">\r\n			                <col style="width: 13%">\r\n			                <col style="width: 13%">\r\n			                <col style="width: 13%">\r\n			                <col style="width: 13%">\r\n			            </colgroup>\r\n			            <thead>'), "pay" == c && (n('            <tr><td colspan="6">\r\n			                <div class="detail-bar">\r\n			                    <span>订单号：'), n(l.orderid), n("</span>\r\n			                    <span>提单人："), n(l.owneruin), n("</span>\r\n			                    <span>提单时间："), n(l.inserttime), n("</span>\r\n			                 </div></td></tr>\r\n			            <tr>")), n(" \r\n			            <tr>\r\n			                <th>套餐名称</th>\r\n			                <th>服务商</th>\r\n			                <th>单价</th>\r\n			                <th>"), n(o), n("时长</th>\r\n			                <th>"), n(s), n('</th>\r\n			                <th class="align-right">总计(元)</th>\r\n			            </tr>\r\n			            </thead>\r\n			            <tbody data-id="packages">'), n('            </tbody>\r\n			        </table>\r\n			\r\n			        <div class="set-meal-payment">\r\n			            <table class="payment-info">\r\n			                <tr id="paymentTr" style="'), n(i.isEnoughBalance() ? "display:none" : ""), n('">\r\n			                    <th>支付方式：</th>\r\n			                    <td><span class="tenpay-logo"></span></td>\r\n			                </tr>'), n('            </table>\r\n			            <div class="payment-submit">\r\n			                <button style="'), n(i.isEnoughBalance() ? "" : "display:none"), n('" data-action="pay" class="ui-btn ui-btn-wid ui-btn-primary">'), n(a ? "余额支付" : "确认支付"), n('</button>\r\n			                <button style="'), n(i.isEnoughBalance() ? "display:none" : ""), n('" data-action="recharge" class="ui-btn ui-btn-wid ui-btn-primary">'), n(a ? "充值" : "充值"), n('</button>\r\n			            </div>\r\n			        </div>\r\n			\r\n			        <div class="clearfix"></div>\r\n			\r\n			        <ul style="color:#999; margin-top:20px">\r\n			            <li>说明：</li>\r\n			            <li>1. 支付行为优先消耗用户的微信云账户余额（可前往<a data-event="nav" href="/personal/expense">费用中心</a>查询余额）;</li>\r\n			            <li>2. 使用“财付通”方式充值并支付时，请务必按照页面提示操作，请勿中断或关闭原始页面。</li>\r\n			        </ul>'), d && (n('            <div class="set-sale">\r\n			              <h2>活动说明</h2>\r\n			                <p>'), n(this.__escapeHtml(d.remark || "无")), n("</p>\r\n			              <hr>\r\n			              <h2>活动须知</h2>\r\n			              <ul>\r\n			                <li>1. 活动时间："), n(u.startYear), n("年"), n(u.startMonth), n("月"), n(u.startDate), n("日至"), n(u.endYear), n("年"), n(u.endMonth), n("月"), n(u.endDate), n("日，限时优惠，售完即止</li>\r\n			                <li>2. 活动套餐均为特价，不支持退货，您购买之前可通过试用、咨询客服，充分了解套餐是否适合您的需求</li>\r\n			                <li>3. 活动结束且套餐期限届满后，用户需要进行续费方可继续使用相关服务，建站服务价格将按照续费当时的原价计算</li>\r\n			                <li>4. 特价套餐数量有限，售完即止</li>\r\n			                <li>5. 本活动最终解释权归腾讯云微信服务市场所有</li>\r\n			                <li>6. 您需要在抢购后1个小时内完成支付，否则抢购订单将自动取消，请您尽快支付</li>\r\n			              </ul>\r\n			            </div>"))) : "conflict" === r || n('        <table class="ui-table ui-table-bordered" style="margin-bottom:20px;">\r\n			            <tr><td colspan="6"><div class="detail-bar">没有可以显示的信息</div></td></tr>\r\n			        </table>'), n(""), e.join("")
        },
        balance: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.view;
            return n('    <strong data-id="balance" class="ui-status '), n(i.getBalanceStatus()), n('">'), n(i.getBalanceUI("{0}<small>元</small>")), n("</strong>"), e.join("")
        },
        tip: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.type,
                a = t.title,
                r = t.msg;
            return n('    <div class="ui-alert '), n(i), n('" style="position: fixed; top: 50%; left: 50%;">\r\n			        <span class="icon"></span>\r\n			        <div class="title">'), a && (n("                <h3>"), n(a), n("</h3>")), n("            "), r && (n("                <p>"), n(r), n("</p>")), n("        </div>\r\n			    </div>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/packages/BuyView", function(t, e, n) {
    var i = t("$"),
        a = (t("wxManager"), t("manager"), t("util"), t("./config/manager")),
        r = t("./BaseBuyView"),
        o = t("main/router"),
        s = function(t) {
            "pay" == t.mode ? (t.opName = "", t.title = "订单支付") : "trial" == t.mode ? (t.opName = "", t.title = "1分钱试用") : "activity" == t.mode ? (t.opName = "", t.title = "套餐促销") : (t.opName = "购买", t.title = "套餐购买"), t.afterPayText = "到期时间", r.call(this, t)
        };
    i.extend(s.prototype, r.prototype, {
        getPackage: function(t) {
            var e = i.Deferred(),
                n = this;
            return i.when(a.getPackage(t), a.queryProduct()).done(function(r, s) {
                if (s.length && s[0].packages.length) {
                    var c, l;
                    i.each(s, function(e, n) {
                        var i = n.packages[0],
                            r = i ? i.packageid : "";
                        return r == t ? (c = n, void(l = a.packageDataToInstance(i, !1))) : void 0
                    }), l ? "buy" == n.mode ? (o.redirect("/personal/packages/renewal/" + c.productid + "/" + l.id, !1, !0), e.reject("redirect")) : e.resolve("continue", l) : e.resolve("continue", r)
                } else e.resolve("continue", r)
            }).fail(function(t) {
                e.reject("fail", t)
            }), e
        }
    }), n.exports = s
}), define("module/personal/packages/config/cgi_config", function(t, e, n) {
    var i = {
            get_usr_package: {
                url: "/package?action=queryPackageForOwnerProduct",
                method: "get"
            },
            query_tenpay_balance: {
                url: "/recharge?action=queryBalance",
                method: "get"
            },
            create_order: {
                url: "/order?action=createOrderByPackageId",
                method: "post"
            },
            pay_for_order: {
                url: "/order?action=payOrder",
                method: "post"
            },
            trial_package: {
                url: "/order?action=trialPackage",
                method: "post"
            },
            recharge_balance: {
                url: "/recharge?action=rechargeBalance",
                method: "post"
            },
            query_product: {
                url: "/product?action=queryProduct",
                method: "get"
            },
            active_product: {
                url: "/product?action=activeProduct",
                method: "post"
            },
            create_activity_order: {
                url: "/order?action=createOrderInSaleActivity",
                method: "post"
            }
        },
        a = "/cgi";
    if (a)
        for (var r in i) {
            var o = i[r];
            o && o.url && (o.url = a + o.url)
        }
    var s = {};
    s.get = function(t) {
        return i[t]
    }, n.exports = s
}), define("module/personal/packages/config/manager", function(t, e, n) {
    var i = t("$"),
        a = t("net"),
        r = t("util"),
        o = t("lib/dates"),
        s = t("./cgi_config"),
        c = t("../Constants"),
        l = t("../Package"),
        d = (t("../Service"), t("dialog")),
        u = t("manage/config/manager"),
        p = t("manage/widget/statushelper/StatusHelper"),
        h = {
            MONTH: 0,
            YEAR: 1
        },
        f = {
            errorHandler: function(e, n) {
                this.isInvalidSession(e) ? t.async("login", function(t) {
                    t.show()
                }) : n !== !1 && d.miniTip(e.msg || "连接服务器异常，请稍后再试")
            },
            callbackInterceptor: function(t, e, n, i) {
                var a = this,
                    r = t.code;
                0 == r ? e && e(t) : (a.errorHandler(t, i), n && n(t))
            },
            isInvalidSession: function(t) {
                var e = t && t.code;
                return 7 == e || 9 == e || 21 == e
            },
            _send: function(t, e, n, r) {
                var o = this,
                    c = i.Deferred();
                return a.send(s.get(t), {
                    data: e,
                    global: r,
                    cb: function(t) {
                        o.callbackInterceptor(t, function(t) {
                            c.resolve(t)
                        }, function(t) {
                            c.reject(t)
                        }, n)
                    }
                }), c
            },
            getUserPackage: function(t, e) {
                var n = this,
                    a = i.Deferred(),
                    o = {
                        productId: t || r.getProductId()
                    };
                return e && (o.packageId = e), this._send("get_usr_package", o).done(function(t) {
                    var r = i.map(t.data || [], function(t) {
                        return e && e != t.packageid ? void 0 : n.packageDataToInstance(t, !1)
                    });
                    a.resolve(r)
                }).fail(function(t) {
                    a.reject(n.isInvalidSession(t))
                }), a
            },
            queryProduct: function() {
                var t = this,
                    e = i.Deferred();
                return this._send("query_product", {}).done(function(t) {
                    var n = t.data.products;
                    e.resolve(n)
                }).fail(function(n) {
                    e.reject(t.isInvalidSession(n))
                }), e
            },
            activeProduct: function(t) {
                var e = i.Deferred();
                return this._send("active_product", {
                    productId: t
                }).done(function() {
                    r.setProductId(t), e.resolve()
                }).fail(function(t) {
                    e.reject(t)
                }), e
            },
            getPackage: function(t) {
                var e = this,
                    n = i.Deferred();
                return u.getPackage(t).done(function(t) {
                    var i = e.packageDataToInstance(t, !0);
                    n.resolve([i])
                }).fail(function(t) {
                    n.reject(t)
                }), n
            },
            packageDataToInstance: function(t, e) {
                if (t) {
                    var n = t.services || [],
                        i = n[0],
                        a = t.serverTime;
                    a = a ? "number" == typeof a ? new Date(a) : o.fromStr(a) : null;
                    var r = i ? i.servicedate : "";
                    return new l({
                        id: t.packageid,
                        name: t.packagename,
                        desc: t.packagedesc,
                        priceYear: t.price4year,
                        priceMonth: t.price4month,
                        freedays: t.freedays,
                        providerName: t.providername || (i ? i.providername : ""),
                        off: !(t.status in {
                            2: "",
                            5: ""
                        }),
                        expires: e ? a : o.fromStr(r, !0),
                        status: p && p.packageStatus(a, n)
                    })
                }
            },
            getTenpayBalance: function() {
                var t = i.Deferred();
                return this._send("query_tenpay_balance", {}, !1).done(function(e) {
                    var n = 0,
                        i = 0;
                    e && e.data && (n = e.data.balance || 0, i = e.data.extrabalance || 0), t.resolve(n + i)
                }).fail(function(e) {
                    t.reject(e)
                }), t
            },
            getRechargeBalance: function(t) {
                var e = i.Deferred();
                return this._send("recharge_balance", t, !1).done(function(t) {
                    t && t.data ? e.resolve(t.data) : e.reject(t)
                }).fail(function(t) {
                    e.reject(t)
                }), e
            },
            pay: function(t) {
                var e = this,
                    n = i.Deferred();
                return n.always(function(t, e, n) {
                    0 !== t.code && n !== c.ERR_DELIVERY_FAILED && t.code !== c.ERR_RET_PACKAGE_STATUS_INVALID.code || d.hideMiniTip()
                }), n.notify("正在支付..."), e.payForOrder(t).done(function() {
                    n.notify("正在发货..."), e.deliveryOrder(t).done(function(t) {
                        n.resolve(t)
                    }).fail(function(t) {
                        n.reject(t, c.ERR_DELIVERY_FAILED)
                    })
                }).fail(function(t) {
                    n.reject(t, c.ERR_PAY_FAILED)
                }), n
            },
            _createOrder: function(t, e) {
                var n = this,
                    a = i.Deferred();
                a.notify("正在创建订单...");
                var r = "";
                return 1 == e ? r = "create_order" : 2 == e ? r = "trial_package" : 3 == e && (r = "create_activity_order"), n._send(r, t, !1, !1).done(function(t) {
                    var e = t.data && t.data.orderid;
                    e ? a.resolve(e) : a.reject(t, c.ERR_ORDER_FAILED)
                }).fail(function(t) {
                    a.reject(t, c.ERR_ORDER_FAILED)
                }).always(function() {}), a
            },
            createOrder: function(t) {
                var t = {
                    packageId: t.packageId,
                    payUnit: h[t.unit],
                    payNum: t.count
                };
                return this._createOrder(t, 1)
            },
            createTrialOrder: function(t) {
                var t = {
                    packageId: t.packageId,
                    createIndeed: 1
                };
                return this._createOrder(t, 2)
            },
            createActivityOrder: function(t) {
                var t = {
                    packageId: t.packageId,
                    saleActivityId: t.saleActivityId,
                    payUnit: h[t.unit],
                    payNum: t.count
                };
                return this._createOrder(t, 3)
            },
            payForOrder: function(t) {
                var e = this,
                    n = i.Deferred();
                return e._send("pay_for_order", {
                    orderId: t
                }, !1, !1).done(function(t) {
                    n.resolve(t)
                }).fail(function(t) {
                    n.reject(t, c.ERR_PAY_FAILED)
                }).always(function() {}), n
            },
            deliveryOrder: function(t) {
                return u.deliveryOrder(t)
            },
            getOrder: function(t) {
                return u.getOrder(t)
            },
            getPackageExpires: function(t, e) {
                return u.getPackageExpires(t, e)
            }
        };
    n.exports = f
}), define("module/personal/packages/Constants", function(t, e, n) {
    var i = {};
    i.USABLE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], i.USABLE_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], i.DEFAULT_COUNT = 1, i.DEFAULT_UNIT = "MONTH", i.SHOW_UNIT_SELECTOR = !1, i.DATE_CALC_BY_DAY = !0, i.DATE_1_MONTH_EQ_DAYS = 31, i.DATE_1_YEAR_EQ_DAYS = 12 * i.DATE_1_MONTH_EQ_DAYS, i.ERR_ORDER_FAILED = 1, i.ERR_PAY_FAILED = 2, i.ERR_DELIVERY_FAILED = 3, i.DELIVERY_RETRY_TIMES = 2, i.DELIVERY_RETRY_INTERVAL = 1e3, i.RECHARGE_AMOUNT_READONLY = !0, i.RECHARGE_FAILED_WIKI = "http://wiki.qcloud.com/wiki/%E8%B4%AD%E4%B9%B0%E7%BB%93%E7%AE%97%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98#.E5.85.85.E5.80.BC.E7.9B.B8.E5.85.B3.E9.97.AE.E9.A2.98", i.ERR_RET_PACKAGE_STATUS_INVALID = {
        code: 204,
        msg: "该套餐已下架，不可续费"
    }, i.ERR_RET_BALANCE_NOT_ENOUGH = {
        code: 214,
        msg: "您的账户余额不足以完成本次支付"
    }, i.ERR_RET_EXCEED_LIMIT = {
        code: 231,
        msg: "暂不支持单个帐号购买超过20个套餐"
    }, i.AMOUNT_MAX = 2e7, i.AMOUNT_MAX_WORD = "2千万", n.exports = i
}), define("module/personal/packages/FailedDialog", function(t) {
    var e = t("$"),
        n = t("widget/dialog"),
        i = (t("./Service"), t("./Package"), t("./Constants")),
        a = t("./FailedDialog/tpl"),
        r = function() {};
    return r.prototype = {
        render: function() {},
        destroy: function() {},
        show: function(t, r) {
            var o, s, c = e.Deferred();
            o = t === i.ERR_ORDER_FAILED ? "很抱歉，订单创建失败" : "很抱歉，订单支付失败", r === i.ERR_RET_PACKAGE_STATUS_INVALID.code ? s = i.ERR_RET_PACKAGE_STATUS_INVALID.msg : r === i.ERR_RET_BALANCE_NOT_ENOUGH.code ? s = i.ERR_RET_BALANCE_NOT_ENOUGH.msg : r === i.ERR_RET_EXCEED_LIMIT.code && (s = i.ERR_RET_EXCEED_LIMIT.msg), n.create(a.failed({
                title: o,
                msg: s,
                wikiURL: i.RECHARGE_FAILED_WIKI
            }), 485, 230, {
                title: "支付",
                closeIcon: 1,
                defaultCancelBtn: 0,
                button: {
                    "我知道了": function() {
                        c.resolve(), n.hide()
                    }
                }
            }), n.setHeight("auto"), n.el.find("button").addClass("ui-btn-wid"), n.contentEl.children().on("click", "a", function() {
                0 === this.href.indexOf("http") && (c.resolve(), n.hide())
            });
            var l = "dialogHide." + (new Date).getTime();
            return e(document).one(l, function() {
                c.reject()
            }), c
        },
        setBalance: function(t) {
            this.balance = t
        },
        setAmount: function(t) {
            this.amount = t
        },
        getBalance: function() {
            return this.balance
        },
        getAmount: function() {
            return this.amount
        },
        getRecharge: function() {
            return Math.max(this.amount - this.balance, 0)
        },
        _isNeedRecharge: function() {
            return this.getRecharge() > 0
        }
    }, r
}), define("module/personal/packages/FailedDialog/tpl", function(t, e, n) {
    n.exports = {
        failed: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="payment-popup">\r\n			        <span class="ui-alert-icon error"></span>\r\n			        <div class="ui-alert-title">\r\n			            <h2>'), n(t.title), n("</h2>\r\n			            <p>"), t.msg ? (n("                    "), n(t.msg), n("                ")) : (n('                    请再试一次或<a href="'), n(t.wikiURL), n('" target="_blank">查看失败原因</a>')), n("            </p>\r\n			        </div>\r\n			    </div>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/packages/ListView", function(t, e, n) {
    var i = t("$"),
        a = (t("lib/reporter"), t("main/router")),
        r = t("./config/manager"),
        o = t("manager"),
        s = t("./ListView/tpl"),
        c = t("event"),
        l = t("dialog"),
        d = function() {
            this.productList = []
        };
    d.prototype = {
        productList: null,
        render: function(t) {
            var e = this;
            e.$container = t.empty(), e._init(), e._load(), e._events()
        },
        destroy: function() {
            this.$el && (this.$el.remove(), this.$el = null), this.$container = null, this.productList = []
        },
        _init: function() {
            var t = this;
            t.$el = i(s.main()), t.$el.appendTo(this.$container)
        },
        _load: function() {
            var t = this;
            t.productList = [], r.queryProduct().done(function(e) {
                t.productList = e, t._renderDOM(t.productList)
            }).fail(function(e) {
                t._renderDOM(null, e)
            })
        },
        _events: function() {
            c.addCommonEvent("click", {
                enable_package: function() {
                    var t = i(this).attr("data-productid"),
                        e = i(this).attr("data-name");
                    l.confirm(s.enableConfirm({
                        packageName: e
                    }), function() {
                        r.activeProduct(t).done(function() {
                            l.success("切换成功"), a.redirect("/personal/packages/list")
                        })
                    }, null, "切换套餐", "确认切换")
                }
            })
        },
        _renderDOM: function(t, e) {
            var n = this,
                a = [],
                o = null;
            n.packageIds = [], i.each(t, function(t, e) {
                if (e.packages.length) {
                    var i = e.packages[0];
                    n.packageIds.push(i.packageid);
                    var s = r.packageDataToInstance(i, !1);
                    s.productId = e.productid, (1 == e.bindstatus || 2 == e.bindstatus || e.wechataccount) && (s.wechatNickname = e.wechatnickname), e.active ? o = s : a.push(s)
                }
            }), this.$el && i(s.list({
                inactivePackage: a,
                activePackage: o,
                isInvalidSess: e
            })).appendTo(this.$el.children('[data-id="container"]').empty()), this._showActivity()
        },
        _showActivity: function() {
            var t = this;
            t.packageIds.length && o.getActivityByPackageids({
                packageIds: t.packageIds.join(",")
            }, function(e) {
                if (e.saleactivitys.length)
                    for (var n, i = 0; n = e.saleactivitys[i]; i++)
                        if ("NORMAL" == o.getActivityStatus(n, e).code) {
                            var a = t.$el.find('[data-packageid="' + n.packageid + '"]');
                            if (a.length) {
                                var r = a.find('[data-field="renewal"]'),
                                    c = a.find('[data-field="price"]');
                                r.replaceWith(s.favorableRenewal({
                                    packageId: n.packageid,
                                    btnMode: r.hasClass("ui-btn") ? 1 : 0
                                })), c.html(o.getPriceUi(n.payprice, n.payunit) + " " + s.favorableIco())
                            }
                        }
            })
        }
    }, n.exports = d
}), define("module/personal/packages/ListView/tpl", function(t, e, n) {
    n.exports = {
        main: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div class="set-meal">\r\n			        <div data-id="container">\r\n			           \r\n			        </div>\r\n			    </div>'), t.join("")
        },
        list: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.inactivePackage,
                a = t.activePackage,
                r = t.isInvalidSess;
            if (r) n('\r\n			        <table class="ui-table ui-table-bordered" style="margin-bottom:20px;">\r\n			            <tr><td colspan="6"><div class="detail-bar">没有可以显示的信息</div></td></tr>\r\n			        </table>');
            else if (a) {
                var o = a.getStatus();
                n(' \r\n			             \r\n			                <style>\r\n			                .dashboard-status table td {vertical-align: top;}\r\n			                .dashboard-status {padding-left: 30px; max-width:935px; margin-bottom:25px}\r\n			                .ui-table-bordered td, .ui-table-bordered th{white-space: nowrap!important;}\r\n			                </style>\r\n			                <h1>正在配置的套餐 <span style="color:#EAA000; font-size:14px; margin-left:10px">单个微信公众帐号只能同时配置一个套餐</span></h1>\r\n			                <div class="dashboard-status">   \r\n			                    <table>\r\n			                    <tbody> \r\n			                        <tr data-packageid="'), n(a.id), n('">\r\n			                            <td>\r\n			                                <h2>'), n(this.__escapeHtml(a.name)), n('</h2>                        \r\n			                                <p class="desc" style="margin-bottom:0">服务商：'), n(this.__escapeHtml(a.providerName || "未知")), n('</p> \r\n			                                <p class="desc">公众号名称：'), n(this.__escapeHtml(a.wechatNickname || "未绑定")), n('</p>                            \r\n			                            </td>\r\n			                            <td>\r\n			                                <div class="mid">\r\n			                                    <p><span class="icon-clock"></span>到期时间</p>\r\n			                                    <p class="status-txt">'), n(a.getExpiresStr() || "未生效"), n('</p>\r\n			                                </div>\r\n			                            </td>\r\n			                            <td>\r\n			                                <div class="mid">\r\n			                                    <p><span class="icon-yen"></span>单价</p>\r\n			                                    <p class="status-txt" data-field="price">'), n(a.getPriceUI()), n("/"), n(a.getUnitName(!0)), n("</p>\r\n			                                </div>\r\n			                            </td>\r\n			                            <td> ");
                var s, c, l = o.code;
                if ("NORMAL" == l ? (s = "icon-circle-empty", c = "success") : "EXPIRED" == l ? (s = "icon-attention-circled", c = "error") : ("UNKNOWN" == l || "WILL_EXPIRED" == l) && (s = "icon-attention-circled", c = "warning"), n('                                <div class="mid '), n(c), n('">\r\n			                                    <p><span class="'), n(s), n('"></span>状态</p>\r\n			                                    <p class="status-txt"><span class="ui-status '), n(o.cssClass), n('">'), n(o.text), n('</span></p>\r\n			                                </div>\r\n			\r\n			                            </td>\r\n			                            <td>\r\n			                                <div class="mid">\r\n			                                    <a data-event="nav" data-field="renewal" data-hot="taocangl.xufei" href="/personal/packages/renewal/'), n(a.id), n('" \r\n			                                    class="ui-btn ui-btn-primary ui-btn-wid">续费</a>\r\n			                                </div>\r\n			                            </td>\r\n			                        </tr> \r\n			                    </tbody>\r\n			                    </table>\r\n			                </div>'), i.length) {
                    n('\r\n			                    <h1>您还有这些套餐</h1>\r\n			                    <!-- 套餐表格 -->\r\n			                    <table class="ui-table ui-table-bordered">\r\n			                        <thead>\r\n			                        <tr>\r\n			                            <th>套餐名称</th>\r\n			                            <th>服务商</th>\r\n			                            <th>公众号名称</th>\r\n			                            <th>单价</th>\r\n			                            <th>到期时间</th>\r\n			                            <th>状态</th>\r\n			                            <th width="80px">操作</th>\r\n			                        </tr>\r\n			                        </thead>\r\n			                        <tbody>');
                    for (var d = 0, u = i.length; u > d; d++) {
                        var p = i[d],
                            o = p.getStatus();
                        n('                                <tr data-packageid="'), n(p.id), n('">\r\n			                                    <td title="'), n(this.__escapeHtml(p.desc)), n('">'), n(this.__escapeHtml(p.name)), n("</td>\r\n			                                    <td>"), n(this.__escapeHtml(p.providerName || "未知")), n("</td>\r\n			                                    <td>"), n(this.__escapeHtml(p.wechatNickname || "未绑定")), n('</td>\r\n			                                    <td data-field="price">'), n(p.getPriceUI()), n("/"), n(p.getUnitName(!0)), n("</td>\r\n			                                    <td>"), n(p.getExpiresStr() || "未生效"), n('</td>\r\n			                                    <td><span class="ui-status '), n(o.cssClass), n('">'), n(o.text), n("</span></td>\r\n			                                    <td>"), p.isOff() ? n("                                            套餐已下架，不可续费") : (n('                                            <a data-event="nav" data-field="renewal" data-hot="taocangl.xufei" href="/personal/packages/renewal/'), n(p.productId), n("/"), n(p.id), n('">续费</a>\r\n			                                            <a style="margin-left:10px" data-productid="'), n(this.__escapeHtml(p.productId)), n('" data-name="'), n(this.__escapeHtml(p.name)), n('" data-event="enable_package" data-hot="taocangl.enable" href="javascript:;">切换</a>')), n("                                    </td>\r\n			                                </tr>")
                    }
                    n('                        </tbody>\r\n			                    </table>\r\n			\r\n			                    <div style="color:#999; margin:30px 0">说明：<br>已绑定套餐的公众号无法同时绑定其他套餐，如遇到此问题，请先解绑原套餐与公众号，切换套餐后再次绑定该公众号。\r\n			                    </div>')
                } else n('                    <div><a href="/market" data-event="nav">购买其他套餐</a></div>');
                n('\r\n			                <div class="clearfix"></div>')
            } else n('                <h1>套餐管理</h1>\r\n			                <table class="ui-table ui-table-bordered" style="margin-bottom:20px;">\r\n			                    <tr><td colspan="6"><div class="detail-bar">您尚未购买套餐</div></td></tr>\r\n			                </table>');
            return n(""), e.join("")
        },
        enableConfirm: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div style="padding-left:0;" class="ui-alert-title">\r\n			        <h2 class="ui-status warning" style="font-size:22px">是否确认切换套餐'), n(this.__escapeHtml(t.packageName)), n("？</h2>\r\n			        <p>套餐切换后，需在管理中心绑定公众号并发布才能生效</p>\r\n			    </div>"), e.join("")
        },
        favorableRenewal: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<a data-event="nav" data-hot="taocangl.yhxufei" href="/personal/packages/activity/'), n(t.packageId), n('" '), 1 == t.btnMode && n('class="ui-btn ui-btn-primary ui-btn-wid"'), n(">续费</a>"), e.join("")
        },
        favorableIco: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<span class="icon-sale"></span>'), t.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/packages/OrderSuccessView", function(t, e, n) {
    function i(t, e) {
        var n = Math.pow(10, e);
        return Math.round(t * n) / n
    }
    var a = t("$"),
        r = (t("lib/util"), t("lib/dates")),
        o = (t("lib/reporter"), t("main/router"), t("lib/collections"), t("main/pagemanage")),
        s = t("./config/manager"),
        c = t("./Package"),
        l = (t("./Constants"), t("./OrderSuccessView/tpl")),
        d = t("manage/widget/statushelper/StatusHelper"),
        u = function(t) {
            this.orderId = t.orderId, this.orderTime = null, this.pack = null
        };
    u.prototype = {
        render: function() {
            var t = this;
            a("#container").empty(), this._rendered = !0, this._initData(function() {
                t._rendered && t._renderDOM()
            })
        },
        destroy: function() {
            this.$el && this.$el.remove(), this._rendered = !1
        },
        _initData: function(t) {
            var e = this,
                n = 2,
                a = function() {
                    --n || t()
                };
            s.getOrder(this.orderId).done(function(t, n) {
                function o(o) {
                    var s = t.subOrders[0],
                        l = s.paynum,
                        d = t.price,
                        p = 0 == s.payunit ? "MONTH" : "YEAR",
                        h = new c({
                            id: t.packageid,
                            name: s.packagename,
                            desc: s.packagedesc,
                            providerName: s.providername,
                            priceMonth: "MONTH" === p ? d : 0,
                            priceYear: "YEAR" === p ? d : 0,
                            count: l,
                            unit: p,
                            amount: i(100 * d * l / 100, 2),
                            serverTime: new Date(n),
                            expires: o,
                            status: u
                        });
                    h.payprice = t.payprice, h.freedays = s.freedays, h.orderType = t.ordertype, h.orderMode = !0, e.ownerUin = t.owneruin, e.orderTime = r.fromISO(t.inserttime), e.pack = h, a()
                }
                if (e._rendered && t) {
                    var l = t.packageid,
                        u = (t.subOrders || [], d.orderStatus(t));
                    "DONE" === u.code ? s.getPackageExpires(l, t.productid).always(o) : o(null)
                } else a()
            }).fail(function() {
                a()
            }), s.queryProduct().done(function(t) {
                e.productList = t, a()
            }).fail(function() {
                a()
            })
        },
        _renderDOM: function() {
            if (this.pack) {
                var t = {
                    pack: this.pack,
                    orderId: this.orderId,
                    ownerUin: this.ownerUin,
                    orderTime: r.format(this.orderTime, !1),
                    productList: this.productList
                };
                this.$el = a(l.main(t)).appendTo(a("#container").empty()), this._events()
            } else o.render404()
        },
        _events: function() {
            var t = this;
            this.$el.on("click", '[data-action="redelivery"]', function(e) {
                e.preventDefault();
                var n = a(this).closest('[data-name="status"]'),
                    i = n.html();
                n.text("处理中..."), d.deliveryOrder(t.orderId).done(function(t) {
                    n.replaceWith(l.status({
                        status: t
                    }))
                }).fail(function() {
                    n.html(i)
                })
            })
        },
        _filterDeliStatus: function(t) {
            var e = t.length,
                n = {
                    NOT_YET: 0,
                    DONE: 0,
                    FAILED: 0
                };
            return a.each(t, function(t, e) {
                var i = e.status;
                0 === i ? n.NOT_YET++ : 1 === i ? n.DONE++ : 2 === i && n.FAILED++
            }), n.FAILED ? n.FAILED < e ? "PART_FAILED" : "FAILED" : n.NOT_YET ? "NOT_YET" : n.DONE && n.DONE === e ? "DONE" : void 0
        }
    }, n.exports = u
}), define("module/personal/packages/OrderSuccessView/tpl", function(t, e, n) {
    n.exports = {
        main: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.pack,
                a = t.ownerUin,
                r = t.orderId,
                o = t.orderTime,
                s = i.getExpiresStr(),
                c = i.getStatus(),
                l = t.productList;
            return n('    <div class="set-meal">\r\n			        <div class="payment-result">\r\n			            <span class="ui-alert-icon success"></span>\r\n			            <div class="ui-alert-title">\r\n			                <h2>支付成功</h2>\r\n			            </div>'), l.length > 1 && n('                <div style="padding-top:20px; font-size:16px">您可以进入套餐管理页面，启用您购买的套餐</div>'), n(l.length > 1 ? '                <div class="ft-opt"><a data-event="nav" data-hot="taocangl.backtotcgl" href="/personal/packages/list" class="ui-btn ui-btn-primary">进入套餐管理</a></div>' : '                <div class="ft-opt"><a data-event="nav" data-hot="taocangl.backtoglzx" href="/manage" class="ui-btn ui-btn-primary">进入管理中心</a></div>'), n('            \r\n			        </div>\r\n			        <h1>订单详情</h1>\r\n			\r\n			        <!-- 套餐表格 -->\r\n			        <table class="ui-table ui-table-bordered">\r\n			            <thead>\r\n			            <tr>\r\n			                <td colspan="6">\r\n			                    <div class="detail-bar"><span>提单人：'), n(a), n("</span><span>订单号："), n(r), n("</span><span>提单时间："), n(o), n("</span></div>\r\n			                </td>\r\n			            </tr>\r\n			            <tr>\r\n			                <th>套餐名称</th>\r\n			                <th>服务商</th>\r\n			                <th>单价</th>\r\n			                <th>时长</th>"), s && n("                    <th>到期时间</th>"), n("                <th>总计</th>"), s || n("                    <th>状态</th>"), n("            </tr>\r\n			            </thead>\r\n			            <tbody>\r\n			            <tr>\r\n			                <td>"), n(this.__escapeHtml(i.name)), n("</td>\r\n			                <td>"), n(this.__escapeHtml(i.providerName)), n("</td>\r\n			                <td>"), n(i.getPriceUI()), n("/"), n(i.getUnitName(!0)), n("</td>\r\n			                <td>"), n(i.getPeriod()), n("                </td>"), s && (n("                    <td>"), n(s), n("</td>")), n("                <td>"), n(i.getAmountUI()), n("</td>"), s || (n("                    <td>"), n(this.status({
                status: c
            })), n("</td>")), n("            </tr>\r\n			            </tbody>\r\n			        </table>\r\n			    </div>"), e.join("")
        },
        status: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.status;
            return n('    <span data-name="status" class="ui-status '), n(i.cssClass), n('">'), n(i.text), n("</span>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/packages/Package", function(t, e, n) {
    var i = t("lib/dates"),
        a = t("./Constants"),
        r = t("./Package/tpl"),
        o = function(t) {
            this.id = t.id, this.name = t.name, this.desc = t.desc, this.priceYear = t.priceYear, this.priceMonth = t.priceMonth, this.freedays = t.freedays, this.providerName = t.providerName, this.off = t.off, this.status = t.status, this.expires = t.expires, this.onChange = t.onChange || $.noop, this.unit = t.unit || a.DEFAULT_UNIT, this.count = t.count || a.DEFAULT_COUNT, this.$el = null
        };
    o.prototype = {
        render: function(t) {
            this.$el ? this._rebuildDOM() : this.$el = this._createDOM().appendTo(t)
        },
        destroy: function() {
            this.$el.remove(), this.$el = null
        },
        onChange: $.noop,
        getExpiresStr: function() {
            return this.expires ? i.format(this.expires) : ""
        },
        getExpiresAddStr: function(t, e) {
            if (!this.expires) return "";
            var n = new Date(this.expires.getTime());
            if (n < new Date && (n = new Date), a.DATE_CALC_BY_DAY) {
                var r = 0;
                "MONTH" === t ? r = a.DATE_1_MONTH_EQ_DAYS * e : "YEAR" === t && (r = a.DATE_1_YEAR_EQ_DAYS * e), n.setDate(n.getDate() + r)
            } else t = t[0].toUpperCase() + t.substr(1).toLowerCase(), n["set" + t](n["get" + t]() + e);
            return i.format(n)
        },
        getUsableCounts: function() {
            if (this.activityMode && this.limitpaynum) {
                for (var t = [], e = 1; e < this.limitpaynum + 1; e++) t.push(e);
                return t
            }
            return {
                MONTH: a.USABLE_MONTHS,
                YEAR: a.USABLE_YEARS
            }[this.unit]
        },
        setUnit: function(t, e) {
            t !== this.unit && (this.unit = (t || a.DEFAULT_UNIT).toUpperCase(), this.count = a.DEFAULT_COUNT, this._rebuildDOM(e), this.onChange("unit", this.unit))
        },
        setCount: function(t, e) {
            t !== this.count && (this.count = t || a.DEFAULT_COUNT, this._rebuildDOM(e), this.onChange("count", this.count))
        },
        getPrice: function() {
            return this.activityMode ? this.payprice : this.orderMode && 0 == this.orderType ? this.payprice / this.count : {
                MONTH: this.priceMonth,
                YEAR: this.priceYear
            }[this.unit]
        },
        getPriceUI: function() {
            return Math.round(100 * this.getPrice()) / 1e4 + "元"
        },
        getAmount: function() {
            return this.orderMode ? this.payprice : this.trialMode ? 1 : this.count * this.getPrice()
        },
        getAmountUI: function(t) {
            return Math.round(100 * this.getAmount()) / 1e4 + (!1 !== t ? "元" : "")
        },
        getStatus: function() {
            return this.status
        },
        getUnitName: function(t) {
            return {
                MONTH: t ? "月" : "个月",
                YEAR: "年"
            }[this.unit]
        },
        isUseUnitSelector: function() {
            return a.SHOW_UNIT_SELECTOR
        },
        isOff: function() {
            return !!this.off
        },
        getPeriod: function() {
            return this.orderMode && 0 == this.orderType ? this.count + this.getUnitName(!1) : this.freedays + "天"
        },
        getExpiresFromNow: function(t) {
            var e = this.expires || new Date;
            return e.setDate(e.getDate() + t), i.format(e)
        },
        _rebuildDOM: function(t) {
            var e = this._createDOM();
            this.$el.replaceWith(e), this.$el = e, t && this.$el.find('[data-field="' + t + '"]').focus()
        },
        _createDOM: function() {
            var t = $(r.package({
                pack: this
            }));
            return this._events(t), t
        },
        _events: function(t) {
            var e = this;
            t.on("change", '[data-field="unit"]', function() {
                e.setUnit(this.value, "unit")
            }), t.on("change", '[data-field="count"]', function() {
                e.setCount(parseInt(this.value), "count")
            })
        }
    }, n.exports = o
}), define("module/personal/packages/Package/tpl", function(t, e, n) {
    n.exports = {
        "package": function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.pack;
            return n("    <tr>\r\n			        <td>"), n(this.__escapeHtml(i.name)), n("</td>\r\n			        <td>"), n(this.__escapeHtml(i.providerName || "未知")), n("</td>\r\n			        <td>"), n(i.getPriceUI()), n("/"), n(i.getUnitName(!0)), n("</td>\r\n			        <td>"), i.orderMode || i.trialMode ? (n(" "), n(i.getPeriod()), n("            ")) : (n("                "), n(i.isUseUnitSelector() ? this.unitSel({
                pack: i
            }) : ""), n("                "), n(this.countSel({
                pack: i
            })), n("            ")), n("        </td>\r\n			        <td>"), i.trialMode || i.orderMode && 1 == i.orderType ? (n("                "), n(i.getExpiresFromNow(i.freedays)), n("            ")) : (n("                "), n(i.getExpiresAddStr(i.unit, i.count) || "未知"), n("            ")), n('        </td>\r\n			        <td class="txt-green align-right">\r\n			            <strong class="ui-status success">'), n(i.getAmountUI(!1)), n(" \r\n			            </strong>\r\n			        </td>\r\n			    </tr>"), e.join("")
        },
        unitSel: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.pack.unit;
            return n('    <select data-field="unit">\r\n			        <option value="MONTH" '), n("MONTH" === i ? 'selected="selected"' : ""), n('>按月</option>\r\n			        <option value="YEAR" '), n("YEAR" === i ? 'selected="selected"' : ""), n(">按年</option>\r\n			    </select>"), e.join("")
        },
        countSel: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.pack,
                a = i.count,
                r = (i.unit, i.getUsableCounts()),
                o = i.getUnitName(!1);
            n('    <select data-field="count">');
            for (var s = 0, c = r.length; c > s; s++) {
                var l = r[s];
                n('        <option value="'), n(l), n('" '), n(l === a ? 'selected="selected"' : ""), n(">"), n(l), n(o), n("</option>")
            }
            return n("    </select>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/packages/packages", function(t, e, n) {
    var i = t("main/pagemanage"),
        a = {
            title: window.platformName + "-套餐管理",
            _view: null,
            render: function(e) {
                if (!e) return void i.render404();
                e = e.replace(/^(\w+).*/, "$1");
                var n = this,
                    a = $("#container"),
                    r = Array.prototype.slice.call(arguments, 1);
                switch (n.destroy(), n._setLayoutSingle(!0), e) {
                    case "renewal":
                        var o, s;
                        if (r[1] ? (o = r[0], s = r[1]) : (o = null, s = r[0]), r[0]) return t.async("./RenewalView", function(t) {
                            var e = n._view = new t({
                                packageId: s,
                                productId: o,
                                mode: "buy"
                            });
                            e.render(a)
                        });
                        break;
                    case "buy":
                        var s = r[0];
                        if (s) return t.async("./BuyView", function(t) {
                            var e = n._view = new t({
                                packageId: s,
                                mode: "buy"
                            });
                            e.render(a)
                        });
                        break;
                    case "pay":
                        var c = r[0];
                        if (c) return t.async("./BuyView", function(t) {
                            var e = n._view = new t({
                                orderId: c,
                                mode: "pay"
                            });
                            e.render(a)
                        });
                        break;
                    case "trial":
                        var s = r[0];
                        if (s) return t.async("./BuyView", function(t) {
                            var e = n._view = new t({
                                packageId: s,
                                mode: "trial"
                            });
                            e.render(a)
                        });
                        break;
                    case "activity":
                        var s = r[0];
                        if (s) return t.async("./BuyView", function(t) {
                            var e = n._view = new t({
                                packageId: s,
                                mode: "activity"
                            });
                            e.render(a)
                        });
                        break;
                    case "list":
                        return t.async("./ListView", function(t) {
                            var e = n._view = new t({});
                            e.render(a)
                        });
                    case "success":
                        var c = r[0];
                        if (c) return t.async("./OrderSuccessView", function(t) {
                            var e = n._view = new t({
                                orderId: c
                            });
                            e.render(a)
                        })
                }
                i.render404()
            },
            destroy: function() {
                this._view && this._view.destroy(), this._view = null
            },
            _setLayoutSingle: function(t) {
                $("#container").parent().toggleClass("layout-single", t)
            }
        };
    n.exports = a
}), define("module/personal/packages/RechargeDialog", function(t) {
    function e(t, e) {
        return "number" != typeof t ? "未知" : (t = Math.round(100 * t) / 1e4, e === !0 ? t + "元" : "string" == typeof e ? e.replace(/\{0\}/, t) : t)
    }
    var n = t("$"),
        i = (t("lib/util"), t("lib/reporter")),
        a = t("widget/dialog"),
        r = (t("./Service"), t("./Package"), t("./Constants")),
        o = t("./config/manager"),
        s = t("./RechargeDialog/tpl"),
        c = t("manage/widget/tenpay_recharge/TenpayRecharge"),
        l = function() {
            var t = this;
            t._tenpayWin = null, t.balance = null, t.amount = null, t.def = n.Deferred(), t.def.always(function() {
                t._tenpayWin && t._tenpayWin.destroy(), t._tenpayWin = null
            })
        };
    return l.prototype = {
        render: function() {},
        destroy: function() {
            this.def && "pending" !== this.def.state() && (this.def.reject(), this.def = null), this._tenpayWin && this._tenpayWin.destroy(), a.hide()
        },
        _dialog: function(t) {
            var e = n.Deferred(),
                i = {};
            n.each(t.buttons, function(n, a) {
                i[a] = function() {
                    t.buttons[a](), e.resolve()
                }
            }), a.el && a.el.is(":visible") && a.hide(), a.create(t.html, 485, 315, {
                title: t.title,
                closeIcon: 1,
                button: t.buttons,
                defaultCancelBtn: !1 === t.showCancel ? 0 : 1,
                defaultCancelBtnCb: t.onCancel
            }), a.setHeight("auto"), a.el.find("button").addClass("ui-btn-wid");
            var r = "dialogHide." + (new Date).getTime();
            return n(document).one(r, function() {
                e.reject(), t.onHide && t.onHide()
            }), e
        },
        showRecharge: function() {
            function t() {
                if (l) c.toTenpayRecharge(c.getRecharge());
                else {
                    var t = n.trim(e.val());
                    if (t) {
                        var a = c._recharge(t);
                        e.toggleClass("error", !!a), o.toggle(!!a).text(a), a && e.focus()
                    }
                }
                i.click("taocangl.chongzhi")
            }
            var e, o, c = this,
                l = r.RECHARGE_AMOUNT_READONLY,
                d = n.Deferred(),
                u = {};
            u[l ? "充值并支付" : "充值"] = function() {
                t()
            }, c._dialog({
                html: s.recharge({
                    view: c,
                    readonly: r.RECHARGE_AMOUNT_READONLY
                }),
                title: l ? "微信云套餐费用充值" : "充值到余额",
                showCancel: !0,
                buttons: u,
                onCancel: function() {
                    i.click("taocangl.cancelchongzhi")
                }
            }), a.contentEl.find("form").on("submit", function(e) {
                e.preventDefault(), t()
            }), e = a.contentEl.find("input"), l || (o = e.nextAll('[data-id="error"]'), a.contentEl.children().on("keyup", ".error", function() {
                n(this).removeClass("error"), p()
            }), e.focus().select(), c.getRecharge() > 0 && e.val(c.getRechargeUI()));
            var p = l ? n.noop : function() {
                var t = c.getRecharge();
                o.html(t ? '完成本次支付还需充值<span class="ui-status success">' + c.getRechargeUI(!1) + "</span>元" : ""), o.toggle(!!t)
            };
            return !l && p(), c._loadBalance().done(function(t) {
                if ("undefined" != typeof t) {
                    var n = a.contentEl.find('[data-id="balance"]');
                    c.setBalance(t), n.html(c.getBalanceUI(!0)), l ? e.html(c.getRechargeUI()) : p()
                }
            }), d
        },
        _recharge: function(t) {
            if (!t) return "请输入金额";
            "string" == typeof t && t.indexOf(",") > -1 && (t = t.replace(/,/g, ""));
            var e = parseFloat(t);
            return !/^\d+(\.\d+)?$/.test(t) || isNaN(e) || 0 >= e ? "无效的金额" : /^\d+(\.\d{1,2})?$/.test(e + "") ? e > r.AMOUNT_MAX ? "目前支持" + r.AMOUNT_MAX_WORD + "元以内的金额" : (e *= 100, void this.toTenpayRecharge(e)) : "金额的小数位应在2位以内"
        },
        toTenpayRecharge: function(t) {
            var e = this;
            e._tenpayWin && e._tenpayWin.destroy();
            var n = window.open();
            e._tenpayWin = new c({
                amount: t,
                win: n,
                callback: function(t, n) {
                    t ? (e.def.resolve(), a.hide()) : e.def.reject(n)
                }
            }), this.showWait("充值")
        },
        showWait: function(t) {
            var e = this,
                n = ["已完成" + t + ", 马上支付", "取消"],
                i = {};
            i[n[0]] = function() {
                e.def.resolve(), a.hide()
            }, i[n[1]] = function() {
                e.def.reject(), a.hide()
            }, e._dialog({
                html: s.wait(),
                title: "微信云套餐费用充值",
                showCancel: !1,
                buttons: i,
                onHide: function() {
                    e.def && "pending" === e.def.state() && e.def.reject()
                }
            }), a.el.find('button:contains("' + n[1] + '")').removeClass("ui-btn-primary")
        },
        setBalance: function(t) {
            this.balance = t
        },
        setAmount: function(t) {
            this.amount = t
        },
        getBalance: function() {
            return this.balance
        },
        getBalanceUI: function(t) {
            return e(this.getBalance(), t)
        },
        getAmount: function() {
            return this.amount
        },
        getAmountUI: function(t) {
            return e(this.getAmount(), t)
        },
        getRecharge: function() {
            return Math.max(this.getAmount() - this.getBalance(), 0)
        },
        getRechargeUI: function(t) {
            return e(this.getRecharge(), t)
        },
        _isNeedRecharge: function() {
            return this.getRecharge() > 0
        },
        _loadBalance: function() {
            return o.getTenpayBalance()
        },
        getDeferred: function() {
            return this.def
        }
    }, l
}), define("module/personal/packages/RechargeDialog/tpl", function(t, e, n) {
    n.exports = {
        dialog: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e("<div></div>"), t.join("")
        },
        recharge: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                },
                i = t.view,
                a = t.readonly;
            return n('    <div class="payment-popup">\r\n			        <form class="ui-form ui-form-vertical">\r\n			            <div class="ui-form-group">\r\n			                <span class="ui-form-label">当前账户余额：</span>\r\n			                <div class="ui-form-ctrls">\r\n			                    <span data-id="balance" class="ui-static">'), n(i.getBalanceUI(!0)), n('</span>\r\n			                </div>\r\n			            </div>\r\n			\r\n			            <div class="ui-form-group">\r\n			                <span class="ui-form-label">需要支付金额：</span>\r\n			                <div class="ui-form-ctrls">\r\n			                    <span class="ui-static">'), n(i.getAmountUI(!0)), n('</span>\r\n			                </div>\r\n			            </div>\r\n			\r\n			            <div class="ui-form-group">\r\n			                <span class="ui-form-label">本次充值金额：</span>\r\n			                <div class="ui-form-ctrls">'), a ? (n('                        <span data-id="recharge" class="ui-static ui-status success">'), n(i.getRechargeUI(!0)), n("</span>")) : n('                        <input data-id="recharge" type="text" class="ui-input-small money" maxlength="8"> 元'), n('                    <span data-id="error" style="display:none" class="ui-help-block"></span>\r\n			                </div>\r\n			            </div>\r\n			        </form>\r\n			    </div>'), e.join("")
        },
        wait: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div class="payment-popup">\r\n			        <div class="ui-alert-title">\r\n			            <p style="padding:40px 0 40px 85px; font-size:16px">请在新开的财付通充值页面完成充值</p>\r\n			        </div>\r\n			    </div>'), t.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("module/personal/packages/RenewalView", function(t, e, n) {
    var i = t("$"),
        a = t("./config/manager"),
        r = t("./BaseBuyView"),
        o = function(t) {
            t.opName = "续费", t.afterPayText = "续费后到期时间", t.title = "套餐续费", r.call(this, t)
        };
    i.extend(o.prototype, r.prototype, {
        getPackage: function(t) {
            return a.getUserPackage(this.productId, t)
        }
    }), n.exports = o
}), define("module/personal/packages/Service", function(t, e, n) {
    var i = function(t) {
        this.id = t.id, this.name = t.name, this.expires = t.expires
    };
    n.exports = i
}), define("module/register/index/index", function(t, e, n) {
    var i = t("$"),
        a = t("util"),
        r = t("net"),
        o = t("daoConfig"),
        s = t("router"),
        c = t("widget/login/login"),
        l = t("widget/register/Progress"),
        d = t("widget/register/InfoBar"),
        u = t("widget/register/LoginForm"),
        p = t("widget/register/RegisterForm"),
        h = t("widget/register/Result"),
        f = (t("lib/xExtend"), t("./index/tpl")),
        g = {
            None: "none",
            Clean: "clean",
            Qcloud: "qcloud",
            QcloudCooperator: "qcloud_cooperator",
            Open: "open",
            OpenCooperator: "open_cooperator"
        },
        m = {
            title: window.platformName + "-注册",
            render: function(t, e) {
                this.from = t ? decodeURIComponent(t) : null, this.scrollTop = e, this.$pageWrap = i("#pagewrap").addClass("layout-single signup-wrap");
                var n = i("#container");
                n.html(f.wrap());
                var a = this.$ct = n.find(".content");
                this.progress = new l({
                    steps: ["验证QQ号码", "填写注册资料", "注册成功"],
                    index: 0
                }), this.progress.render(a), this.infoBar = new d, this.infoBar.render(a), this.prepareRegisterUI()
            },
            prepareRegisterUI: function() {
                var t = this;
                this.getAccountInfo().done(function(e, n) {
                    switch (e) {
                        case g.None:
                            t.showStep1();
                            break;
                        case g.Clean:
                            t.showStep2({
                                name: n.name,
                                tel: n.tel,
                                mail: n.mail
                            }, !1);
                            break;
                        case g.Qcloud:
                            c.checkLogin(!0, function() {
                                s.navigate("/")
                            });
                            break;
                        case g.QcloudCooperator:
                            c.logout(!0), t._showDisallowWarning("腾讯云协作者");
                            break;
                        case g.Open:
                            t.showStep2({
                                name: n.name,
                                tel: n.tel,
                                mail: n.mail
                            }, !0);
                            break;
                        case g.OpenCooperator:
                            c.logout(!0), t._showDisallowWarning("腾讯开放平台协作者")
                    }
                })
            },
            _showDisallowWarning: function(t) {
                var e = this;
                e.progress.stepTo(0), e.infoBar.clear(), e.clearContents(), e.pushContent(new h({
                    type: "error",
                    title: "",
                    text: "QQ号码已经注册成为" + t + "，暂时无法使用微信服务市场",
                    html: '<p>请<a href="#" data-action="reset" data-hot="zhuce.cxzc">更换QQ号</a>重新注册</p><a href="#" class="ui-btn ui-btn-primary ui-btn-wid" data-action="return">返回首页</a>',
                    onActionReset: function() {
                        e.showStep1()
                    },
                    onActionReturn: function() {
                        s.navigate("/")
                    }
                }))
            },
            showStep1: function() {
                var t = this;
                t.progress.stepTo(0), t.infoBar.update({
                    html: '欢迎来到微信服务市场！请尽可能<a href="http://zc.qq.com/chs/index.html" target="_blank">申请新的QQ号码</a>注册，否则可能会导致<a href="http://wiki.qcloud.com/wiki/%E5%BC%80%E5%8F%91%E8%80%85%E7%AE%A1%E7%90%86%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98#7._.E7.A7.81.E4.BA.BAQQ.E6.B3.A8.E5.86.8C.E4.BC.9A.E9.80.A0.E6.88.90.E5.93.AA.E4.BA.9B.E9.A3.8E.E9.99.A9.EF.BC.9" target="_blank">归属权风险</a>',
                    isTip: !1
                }), t.clearContents();
                var e = new u;
                e.done(function() {
                    t.prepareRegisterUI()
                }), t.pushContent(e)
            },
            showStep2: function(t, e) {
                var n = this;
                t = t || {}, e = !!e, a.setACSRFToken(null);
                var r = i.extend({
                    uin: a.getUin(),
                    skey: a.cookie.get("skey"),
                    csrf: a.getACSRFToken(),
                    type: 0,
                    onActionReset: function() {
                        c.logout(!0), n.showStep1()
                    }
                }, t, {
                    isActivate: e
                });
                n.progress.stepTo(1), e ? n.infoBar.update({
                    text: "QQ号码已经在腾讯开放平台注册，请补充以下内容"
                }) : n.infoBar.clear(), n.clearContents();
                var o = new p(r);
                o.on("show", n.infoBar.show, n.infoBar), o.on("hide", n.infoBar.hide, n.infoBar), o.on("destroy", n.infoBar.show, n.infoBar), o.done(function() {
                    {
                        var t = n.from;
                        n.scrollTop
                    }
                    n.from = null, n.scrollTop = null, n.progress.stepTo(3), n.infoBar.clear(), n.clearContents(), n.pushContent(new h({
                        type: "success",
                        title: "注册成功",
                        text: "感谢您注册微信服务市场帐号，您现在可以完整的使用微信服务市场服务",
                        html: '<a href="#" class="ui-btn ui-btn-primary ui-btn-wid" data-action="confirm">开始使用</a>',
                        onActionConfirm: function() {
                            s.navigate(t || "/market")
                        }
                    })), c.checkLogin(!0, i.noop)
                }), n.pushContent(o)
            },
            pushContent: function(t) {
                t.render(this.$ct), this.contents.push(t)
            },
            clearContents: function() {
                var t = this.contents;
                t && i.each(t, function(t, e) {
                    e.destroy()
                }), this.contents = []
            },
            getAccountInfo: function() {
                var t = i.Deferred(),
                    e = g.None;
                return r.ajax(i.extend({
                    skipGlobalException: !0
                }, o.get("check_login"))).done(function(n) {
                    e = g.Qcloud, t.resolve(e, n.data)
                }).fail(function(n) {
                    var i = n && n.code,
                        a = n && n.data;
                    12 === i ? e = a && !a.user_type && a.uin && !a.isOpenCooperator ? g.Open : g.Clean : 25 === i ? e = g.QcloudCooperator : 26 === i && (e = g.OpenCooperator), t.resolve(e, a)
                }), t
            },
            destroy: function() {
                this.progress.destroy(), this.infoBar.destroy(), this.clearContents(), this.$pageWrap.removeClass("layout-single signup-wrap")
            }
        };
    n.exports = m
}), define("module/register/index/index/tpl", function(t, e, n) {
    n.exports = {
        wrap: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div class="signup">\r\n					<h1>微信服务市场用户注册</h1>\r\n					<div class="content">\r\n					</div>\r\n				</div>'), t.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/bind_weixin/bind_weixin", function(t, e, n) {
    var i = t("util"),
        a = (t("event"), t("dialog")),
        r = (t("router"), t("wxManager")),
        o = t("lib/jquery.md5"),
        s = t("widget/validator/validator"),
        c = t("widget/placeholder/placeholder"),
        l = t("lib/reporter"),
        d = '<div id="bind_weixin_form" class="login-line">        <h4>请输入微信公众账号和密码<br>成功后，您配置的内容将生效发布</h4>        <ul class="form">            <li class="ui-help-block error" style="line-height:1.5;min-height:30px;height:auto"><span></span></li>    <li class="ui-form-group">                <label>微信公众号</label>                <input type="text" placeholder="邮箱/微信号/QQ号" value="<%=username%>"/>             </li>            <li class="ui-form-group">                <label>公众号密码</label>                <input type="password" placeholder="密码" value="<%=password%>"/>             </li>            <li class="ui-form-group" id="wxVerifyCodeForm" style="display:none">                <div style="margin-left:73px">                    <input type="text" id="wxVerifyCodeInput" placeholder="验证码" style="width:80px; vertical-align:top"/>                 </div>            </li>            <li class="info">                还没有微信公众号？ <a href="javascript:void(0);" data-event="manage_register_wx" data-hot="glzx.common.registerWx">马上注册&gt;</a>            </li>        </ul></div>',
        u = '<div class="login-loading">    <div class="submit-gif"><span class="icon"></span>正在发布...</div></div>',
        p = "keydown.bind_weixin",
        h = function(t) {
            this.options = t, this.init()
        };
    window.refreshVerifyCode = function(t) {
        var e = t.src,
            n = e.substring(0, e.indexOf("&r="));
        t.src = n + "&r=" + (new Date).getTime()
    }, h.prototype = {
        init: function() {
            this.createPanel()
        },
        createPanel: function() {
            var t = this,
                e = {
                    "class": "ui-modal weixin-bind login",
                    title: t.options.title,
                    button: {},
                    defaultCancelBtnCb: function() {
                        $(document).off(p), l.click("glzx.common.cancelfabugzh")
                    }
                };
            e.button[t.options.buttonName] = function(e) {
                t.btnClick(e)
            };
            var n = {
                    username: "",
                    password: ""
                },
                r = t.options.accountInfo;
            r && (n = r), a.create(i.tmpl(d, n), "", "", e), t.el = $("#bind_weixin_form");
            var o = a.el.find(".ui-modal-footer").find(".ui-btn:eq(0)");
            $(document).off(p).on(p, function(e) {
                13 === e.which && (e.preventDefault(), t.btnClick(o))
            }), c.init(t.el), r && t.btnClick(o)
        },
        showVerifyCode: function(t) {
            $("#wxVerifyCodeForm").show(), $("#wxVerifyCodeImg").remove();
            var e = "/cgi/wechat?action=verifyImage",
                n = i.getUin(),
                a = t,
                r = i.getACSRFToken();
            e += "&uin=" + n + "&username=" + a + "&csrfCode=" + r + "&r=" + (new Date).getTime(), $("#wxVerifyCodeInput").after('<img id="wxVerifyCodeImg" onclick="refreshVerifyCode(this)" style="width:113px;height:43px" src="' + decodeURIComponent(e) + '"/>')
        },
        sendRequest: function() {
            var t = "发布" == this.options.title;
            t && this.toggleLoading();
            var e = this,
                n = o(e.passwordVal.substr(0, 16)),
                s = {
                    productId: i.getProductId(),
                    username: e.usernameVal,
                    password: n
                };
            e.options.verifyCode && (s.verifycode = e.verifyCodeVal), r.bindWeixin(s, function(n) {
                a.hide(), $(document).off(p), t && e.toggleLoading(), e.options.callback && e.options.callback(n.data || {})
            }, function(n) {
                var i = e.el.find(".ui-help-block"),
                    r = e.el.find("input");
                1094 == n.code ? i.css({
                    "text-align": "left"
                }).html(n.msg + ' <a href="https://mp.weixin.qq.com/" target="_blank">前往设置</a>') : i.css({
                    "text-align": "right"
                }).html(n.msg);
                var o = function() {
                        r.off("keydown", s).off("oninput", s)
                    },
                    s = function() {
                        o(), i.text("")
                    };
                o(), r.on("keydown", s).on("oninput", s), (1103 == n.code || e.options.verifyCode) && (e.showVerifyCode(e.usernameVal), e.options.verifyCode = !0), a.el.find(".disabled").removeClass("disabled"), t && e.toggleLoading()
            }, !1)
        },
        toggleLoading: function() {
            var t = a.el.find(".ui-modal-footer"),
                e = t.find(".ui-btn");
            a.el.hasClass("login-loading") ? (a.setLoadTip(1), a.el.removeClass("login-loading"), e.show(), a.el.find(".login-loading").remove()) : (a.setLoadTip(0), a.el.addClass("login-loading"), e.hide(), t.append(u))
        },
        btnClick: function(t) {
            if (t = $(t), !t.hasClass("disabled")) {
                var e = this,
                    n = e.el.find("input"),
                    i = n[0],
                    a = n[1],
                    r = n[2],
                    o = i.value,
                    c = a.value,
                    d = r.value,
                    u = e.el.find(".ui-help-block span");
                if ("" == o) return s.showErr(i, {
                    tip: "请输入微信公众帐号",
                    tipEl: u
                });
                if ("" == c) return s.showErr(a, {
                    tip: "请输入密码",
                    tipEl: u
                });
                if (e.options.verifyCode && "" == d) return s.showErr(r, {
                    tip: "请输入验证码",
                    tipEl: u
                });
                t.addClass("disabled"), e.usernameVal = o, e.passwordVal = c, e.verifyCodeVal = d, e.sendRequest(), l.click("glzx.common.fabugongzhongh")
            }
        }
    }, n.exports = h
}), define("widget/dialog", function(t, e, n) {
    var i = t("$"),
        a = "keydown.widget_dialog",
        r = {
            resize: function() {},
            render_if: function() {
                o.mask || (o.mask = i('<div class="ui-mask"/>').css({
                    transition: "opacity 0.2s ease",
                    opacity: "0",
                    "background-color": "#000",
                    visibility: "hidden"
                }).appendTo(i("body"))), this.resize()
            },
            show: function() {
                var t = this;
                t.resize(), o.mask.show(), setTimeout(function() {
                    o.mask.css({
                        visibility: "visible",
                        opacity: "0.5"
                    })
                }, 0)
            },
            hide: function() {
                o.mask.css({
                    visibility: "hidden",
                    opacity: "0"
                }), setTimeout(function() {
                    o.el.is(":visible") || o.mask.hide()
                }, 300)
            }
        },
        o = {
            el: null,
            contentEl: null,
            mask: null,
            mTipTime: null,
            alertTipTime: null,
            enableLoadTip: 1,
            isLoading: 0,
            create: function(t, e, n, o) {
                o = o || {};
                var s = this,
                    c = {
                        button: null,
                        title: "",
                        closeIcon: !1,
                        mask: !0,
                        "class": "ui-modal",
                        isMaskClickHide: 1,
                        defaultCancelBtn: 1,
                        defaultCancelBtnCb: null,
                        isFromConfirm: 0,
                        buttonHighlight: [],
                        focusOn: "button:visible:first"
                    },
                    l = i("body");
                if (o = i.extend({}, c, o), !this.el) {
                    var d = i("<div/>").css({
                            position: "fixed",
                            display: "none",
                            zIndex: "999",
                            marginLeft: "0"
                        }),
                        u = i("<div/>");
                    d.append(u), l.append(d), this.el = d, this.contentEl = u
                }
                this.el.attr("class", o["class"]);
                var p = i(window),
                    h = p.width(),
                    f = p.height();
                if (this.el.find("> .ui-modal-header").remove(), this.el.find("> .modal-close").remove(), this.contentEl.height(""), o.title || o.closeIcon) {
                    if (o.title) {
                        var g = i("<div/>").addClass("ui-modal-header");
                        this.el.prepend(g), o.closeIcon = 1, g.html("<h3>" + o.title + "</h3>")
                    }
                    if (o.closeIcon) {
                        var m = i("<a/>").addClass("ui-btn ui-btn-link modal-close").attr({
                            title: "关闭",
                            href: "javascript:;"
                        }).text("×");
                        this.el.prepend(m)
                    }
                    m.on("click", function() {
                        s.hide(), o.defaultCancelBtnCb && o.defaultCancelBtnCb()
                    }), this.contentEl.addClass("ui-modal-body")
                } else this.contentEl.removeClass("ui-modal-body");
                this.contentEl.html(t);
                var v = this.el.find("iframe")[0];
                if (v && (v.callback = o.callback || function() {}), this.el.find("> .ui-modal-footer").remove(), o.button) {
                    var _ = i("<div/>").addClass("ui-modal-footer"),
                        b = 0;
                    for (var y in o.button) {
                        var x = "ui-btn";
                        o.isFromConfirm && (x += " ui-btn-wid"), (o.buttonHighlight[b] || void 0 == o.buttonHighlight[b]) && (x += " ui-btn-primary");
                        var w = i('<button type="button"/>').addClass(x).text(y),
                            k = o.button[y];
                        ! function(t, e) {
                            t.on("click", function() {
                                "function" == typeof e && e(t, s.el)
                            })
                        }(w, k), _.append(w).append(" "), b++
                    }
                    if (o.defaultCancelBtn) {
                        var C = i('<button type="button"/>').addClass("ui-btn").text("取消");
                        o.isFromConfirm && C.addClass("ui-btn-wid"), _.append(C), C.on("click", function() {
                            s.hide(), o.defaultCancelBtnCb && o.defaultCancelBtnCb()
                        })
                    }
                    this.el.append(_)
                }
                i(document).off(a).on(a, function(t) {
                    27 === t.which && (t.preventDefault(), s.hide(), o.defaultCancelBtnCb && o.defaultCancelBtnCb())
                });
                var T = i("#pagewrap");
                this.el.css({
                    width: e,
                    height: n
                }).show();
                var E = (o.top || parseInt((f - (n || this.el.height())) / 2)) + T.scrollTop(),
                    $ = (o.left || parseInt((h - (e || this.el.width())) / 2)) + T.scrollLeft();
                this.el.css({
                    left: $,
                    top: E
                });
                try {
                    this.el.find(o.focusOn).focus()
                } catch (A) {}
                return o.mask && (this.mask || r.render_if(), r.show(), 1 == o.isMaskClickHide ? this.mask.off("click").on("click", function() {
                    s.hide(), o.defaultCancelBtnCb && o.defaultCancelBtnCb()
                }) : this.mask.unbind("click")), o.time && setTimeout(function() {
                    s.hide()
                }, o.time), o.onload && o.onload.call(this, this.el), this.owner = o.owner ? o.owner : null, this.el
            },
            show: function() {
                this.el && this.el.show()
            },
            hide: function() {
                this.el && this.el.hide(), this.mask && r.hide(), this.owner = null, this.el && (i(document).off(a).trigger("dialogHide"), this.el.find(".error").removeClass("error").data("origTip", null))
            },
            miniTip: function(t, e) {
                if (t) {
                    var n = this;
                    !e && (e = 4e3), n.showMiniTip(t);
                    var i = setTimeout(function() {
                        n.hideMiniTip(1)
                    }, e);
                    n.mTipTime = i
                }
            },
            showMiniTip: function(t) {
                clearTimeout(this.mTipTime), this.mTipTime = null;
                var e = i("#flashMsg");
                if (!e.length) {
                    var n = i("<div/>").addClass("msgbox").attr("id", "msgbox");
                    e = i("<div/>").addClass("ui-global-msg").attr("id", "flashMsg"), n.append(e), n.appendTo("body")
                }
                e.html(t).fadeIn(500)
            },
            hideMiniTip: function(t) {
                var e = this,
                    n = function() {
                        i("#flashMsg").fadeOut(function() {
                            !e.mTipTime && i(this).html("")
                        }), e.mTipTime = null
                    };
                t ? n() : !e.mTipTime && n()
            },
            hideMiniTipNow: function() {
                i("#flashMsg").hide().html("")
            },
            confirm: function(t, e, n, i, a) {
                var r = '<span class="ui-alert-icon error" style="margin-right:10px"></span>';
                t = '<div class="ui-confirm">' + r + t + "</div>";
                var s = {
                    title: i || "提示",
                    isMaskClickHide: 0,
                    isFromConfirm: 1,
                    button: {},
                    defaultCancelBtnCb: function() {
                        n && n()
                    }
                };
                a = a || "确认", s.button[a] = function() {
                    o.hide(), e && e()
                }, o.create(t, "", "", s)
            },
            setHeight: function(t, e) {
                e ? this.el.animate({
                    height: t
                }, "fast") : this.el.height(t)
            },
            initLoadTip: function() {
                var t, e = this,
                    n = 300,
                    a = i(document);
                a.ajaxStart(function() {
                    e.enableLoadTip && (clearTimeout(t), e.isLoading = 1, t = setTimeout(function() {
                        var t = i("#flashMsg");
                        t.length && t.html() || e.isLoading && e.showMiniTip("正在加载...")
                    }, n))
                }), a.ajaxStop(function() {
                    e.enableLoadTip && e.stopLoadTip()
                })
            },
            stopLoadTip: function() {
                this.isLoading = 0, this.hideMiniTip()
            },
            setLoadTip: function(t) {
                this.enableLoadTip = t
            },
            success: function(t, e) {
                this.showAlertTip(t, 1, e)
            },
            fail: function(t, e) {
                this.showAlertTip(t, 0, e)
            },
            showAlertTip: function(t, e, n) {
                if (t) {
                    var a = this;
                    !n && (n = 4e3), clearTimeout(this.alertTipTime), this.stopLoadTip();
                    var r = i("#alertMsg");
                    if (!r.length) {
                        var o = '<div class="ui-alert" id="alertMsg" style="min-width:140px;z-index:1000;visibility:hidden"><span class="icon"></span><div class="title"><h3></h3></div></div>';
                        i("body").append(o).on("click", function() {
                            a.hideAlertTip()
                        }), r = i("#alertMsg")
                    }
                    r.find("h3").html(t);
                    var s = "ui-alert " + (1 == e ? "success" : "error"),
                        c = i(window),
                        l = c.width(),
                        d = c.height();
                    r.attr("class", s).css({
                        visibility: "visible",
                        opacity: 0
                    }).stop(), r.css({
                        left: (l - r.outerWidth()) / 2,
                        top: (d - r.outerHeight()) / 2 + 100
                    }).animate({
                        top: (d - r.outerHeight()) / 2,
                        opacity: 1
                    }), a.alertTipTime = setTimeout(function() {
                        a.hideAlertTip()
                    }, n)
                }
            },
            hideAlertTip: function() {
                clearTimeout(this.alertTipTime), this.alertTipTime = null;
                var t = this,
                    e = i("#alertMsg");
                e.length && e.animate({
                    opacity: 0
                }, 300, function() {
                    !t.alertTipTime && e.css({
                        visibility: "hidden"
                    })
                })
            }
        };
    n.exports = o
}), define("widget/formchange/formchange", function(t, e, n) {
    var i = (t("$"), t("dialog")),
        a = '    <div class="ui-alert-title" style="padding-left:0">        <p>内容已被修改，是否放弃更新？</p>        <p>放弃后，您修改的内容不会保存</p>    </div>',
        r = 0,
        o = {
            show: function(t) {
                i.confirm(a, function() {
                    r = 0, t && t()
                }, null, "提示", "放弃更新")
            },
            validate: function(t) {
                r ? this.show(t) : t && t()
            },
            set: function(t) {
                r = t
            }
        };
    n.exports = o
}), define("widget/image_preview/imgReady", function(t) {
    var e = t("$"),
        n = {
            list: [],
            _intId: null,
            tick: function() {
                for (var t = n.list, e = 0; e < t.length; e++) t[e].end ? t.splice(e--, 1) : t[e]();
                t.length || n.stop()
            },
            start: function() {
                this._intId || (this._intId = setInterval(this.tick, 40))
            },
            stop: function() {
                this.list = [], this._intId && (clearInterval(this._intId), this._intId = null)
            }
        },
        i = function(t, e, i, a, r) {
            var o, s, c, l, d, u = new Image;
            return u.file_id = e, u.src = t, u.complete ? (i.call(u), void(a && a.call(u))) : (s = u.width, c = u.height, u.onerror = function() {
                r && r.call(u), o.end = !0, u = u.onload = u.onerror = null
            }, o = function() {
                l = u.width, d = u.height, (l !== s || d !== c || l * d > 1024) && (i.call(u), o.end = !0)
            }, o(), u.onload = function() {
                !o.end && o(), a && a.call(u), u = u.onload = u.onerror = null
            }, void(o.end || (n.list.push(o), n.start())))
        },
        a = function(t) {
            this.reset(t)
        };
    return e.extend(a.prototype, {
        reset: function(t) {
            this.opt = e.extend({
                erCb: e.noop,
                okCb: e.noop,
                imgCache: {
                    length: 0,
                    allow_num: 5,
                    running_num: 0,
                    pipe_cache: [],
                    start_pos: 0
                },
                id_url_map: {}
            }, t)
        },
        destroy: function() {
            this.reset(), n.stop()
        },
        start_load: function() {
            this._run_thumb()
        },
        add_thumb: function(t, e) {
            var n = this.opt;
            n.imgCache.pipe_cache.push(e), n.imgCache.length += 1, n.id_url_map[e] = t
        },
        priority_sort: function(t) {
            for (var e = this.opt, n = e.imgCache, i = n.length; i;)
                if (i -= 1, n.pipe_cache[i] === t) return void(n.start_pos = i)
        },
        _process_result: function(t, e, n, i, a) {
            var r = this.opt;
            t && t.src && (n ? r.okCb.call(null, t, e, i, a) : r.erCb.call(null, t, e), r.imgCache.running_num -= 1), this._run_thumb()
        },
        _run_thumb: function() {
            var t = this,
                n = t.opt,
                a = n.imgCache.allow_num - n.imgCache.running_num;
            if (a > 0 && n.imgCache.length > 0)
                for (var r, o = t._batch_load(a); r = o.shift();) n.imgCache.running_num += 1, i(r.url, r.id, function() {
                    t._process_result(e.clone(this), this.file_id, !0, this.width, this.height)
                }, null, function() {
                    t._process_result(e.clone(this), this.file_id, !1)
                })
        },
        _batch_load: function(t) {
            var e = this.opt,
                n = e.imgCache,
                i = t,
                a = [];
            for (n.length < i && (i = t = n.length); i--; i > 0) {
                n.pipe_cache[n.start_pos] || (n.start_pos = 0);
                var r = n.pipe_cache.splice(n.start_pos, 1)[0],
                    o = e.id_url_map[r];
                a.push({
                    url: o,
                    id: r
                }), delete e.id_url_map[r]
            }
            return n.length -= t, a
        }
    }), {
        get_instance: function(t) {
            return new a(t)
        }
    }
}), define("widget/image_preview/mode", function(t) {
    var e = t("$"),
        n = function() {
            var t = {};
            return {
                listenTo: function(e) {
                    t.hasOwnProperty(e) || (t[e] = []), t[e].push(this)
                },
                trigger: function(e) {
                    var n = this.ns,
                        i = Array.prototype.shift.call(e),
                        a = t[n],
                        r = n + "_watch";
                    if (a)
                        for (var o = a.length; o;) {
                            o -= 1;
                            var s = a[o];
                            s[r][i] && s[r][i].apply(s, e)
                        }
                }
            }
        }(),
        i = function(t) {
            var i = this;
            if (e.extend(i, t), i.watch_ns)
                for (var a = i.watch_ns.length; a;) a -= 1, n.listenTo.call(i, i.watch_ns[a])
        };
    return e.extend(i.prototype, {
        get_ctx: function() {
            return this
        },
        invoke: function(t, e) {
            t = t.split(".");
            var n = this.get_ctx()[t[0]];
            n && (e = e || [], "function" == typeof n ? n.apply(this, e) : t[1] && "function" == typeof n[t[1]] && n[t[1]].apply(this, e))
        },
        happen: function() {
            n.trigger.call(this, arguments)
        }
    }), i
}), define("widget/image_preview/preview", function(t) {
    var e, n, i = t("./imgReady"),
        a = t("./mode"),
        r = t("./view"),
        o = t("./store"),
        s = new a({
            watch_ns: ["view", "store"],
            render: function(t) {
                n = {
                    total: t.data.length,
                    complete: !0,
                    data: t.data,
                    index: t.index || 0,
                    get_url: function(t) {
                        var e = n.data[t] || {};
                        return e.src || ""
                    },
                    get_thumb_url: function(t) {
                        var e = n.data[t] || {};
                        return e.thumb || e.src || ""
                    }
                }, e = i.get_instance({
                    erCb: this.loader.on_er,
                    okCb: this.loader.on_ok
                }), o.invoke("init", [n.total, n.index || 0, r.get_visible_size(n.total), !n.hasOwnProperty("complete") || n.complete === !0])
            },
            isThumbUid: function(t) {
                return (t + "").indexOf("-thumb") > 0
            },
            getThumbUid: function(t) {
                return 0 | (t + "").replace("-thumb", "")
            },
            loader: {
                on_ok: function(t, e, n, i) {
                    s.isThumbUid(e) ? r.invoke("thumb_state.done", [t, s.getThumbUid(e)]) : r.invoke("image_state.done", [e, t, n, i])
                },
                on_er: function(t, e) {
                    s.isThumbUid(e) || r.invoke("image_state.error")
                },
                image: function(t) {
                    var i = this,
                        a = n.get_url.call(i, t, n),
                        o = t + "";
                    r.invoke("image_state.start", [t]), a ? (e.add_thumb(a, o), e.priority_sort(o), e.start_load()) : i.on_er(null, o)
                },
                thumb: function(t) {
                    var i = n.get_thumb_url.call(this, t, n, 64);
                    i && (e.add_thumb(i, t + "-thumb"), e.start_load())
                }
            },
            store_watch: {
                selected: function(t) {
                    t.desc = n.data[t.index].desc || "", r.invoke("selected", [t])
                },
                touch_border: function() {
                    var t = this;
                    t._request_border || (t._request_border = !0, n.load_more(function(e) {
                        t._request_border = !1, e.fail || o.invoke("adjust_entry", [e.complete, e.total])
                    }))
                },
                load_image: function(t) {
                    this.loader.image(t)
                },
                load_thumb: function(t) {
                    for (var n = t.min; n < t.max + 1; n++) this.loader.thumb(n);
                    e.start_load()
                },
                load_start: function() {
                    e.start_load()
                }
            },
            view_watch: {
                destroy: function() {
                    e.destroy(), o.invoke("destroy"), n.close && n.close.call()
                },
                pick: function(t) {
                    o.invoke("pick", [t])
                },
                prev: function() {
                    o.invoke("prev")
                },
                next: function() {
                    o.invoke("next")
                },
                prev_group: function() {
                    o.invoke("prev_group")
                },
                next_group: function() {
                    o.invoke("next_group")
                },
                window_resize: function() {
                    o.invoke("adjust_area", [r.get_visible_size(n.total), !0])
                }
            }
        });
    return s
}), define("widget/image_preview/store", function(t) {
    var e = t("./mode"),
        n = {
            update: function(t) {
                this.from = t.min, this.to = t.max
            },
            get_from: function() {
                return this.from
            },
            get_to: function() {
                return this.to
            },
            changed: function(t) {
                return this.from !== t.min || this.to !== t.max
            }
        },
        i = {
            destroy: function() {
                var t = this;
                t.entry = {}, t.area = {}, t.happen("destroy")
            },
            init: function(t, e, i, a) {
                var r = this,
                    o = r.entry = {
                        max: t - 1,
                        cur: e,
                        min: 0,
                        complete: a
                    },
                    s = Math.min(o.max, i - 1),
                    c = r.area = {
                        min: o.min,
                        max: o.min + Math.max(s, 0),
                        size: s
                    };
                e > s && (c.min = e, c.max = Math.min(e + Math.max(s, 0) - (o.complete ? 0 : 1), o.max), c.max - c.min < s && (c.min = Math.max(c.max - s, o.min))), n.update(c), r.happen("init", c), r.change({
                    thumb: !0,
                    image: !0
                })
            },
            adjust_entry: function(t, e) {
                this.entry.complete = t, this.entry.max = e - 1, this.fresh_ok = !0
            },
            adjust_area: function(t) {
                var e = this,
                    i = e.entry,
                    a = i.max,
                    r = i.min,
                    o = Math.min(a, t - 1),
                    s = o - e.area.size;
                if (a !== r && 0 !== s) {
                    var c = n.get_from(),
                        l = n.get_to(),
                        d = (i.cur - c) / (l - c);
                    c -= d * s, l += (1 - d) * s, r > c && (l += r - c, c = r), l > a && (s = a - l, l = a, s > c ? c = r : c -= s), e.area = {
                        max: parseInt(l),
                        min: parseInt(c),
                        size: o
                    }, n.update(e.area), e.change({
                        thumb: !0
                    })
                }
            },
            _sync: function() {
                var t = this,
                    e = t.area;
                n.changed(e) && (e.max = n.get_to(), e.min = n.get_from(), t.change({
                    thumb: !0
                }))
            },
            prev: function() {
                var t = this,
                    e = t.entry;
                i._sync.call(t), e.cur === n.get_from() && i.prev_group.call(t), e.cur -= 1, t.change({
                    image: !0
                }), n.update(t.area)
            },
            next: function() {
                var t = this,
                    e = t.entry;
                (e.cur !== e.max || e.complete || t.fresh_ok) && (i._sync.call(t), e.cur === n.get_to() && i.next_group.call(t), e.cur += 1, t.change({
                    image: !0
                }), n.update(t.area))
            },
            pick: function(t) {
                var e = this,
                    a = e.entry,
                    r = e.area;
                t === a.cur ? e.change({
                    image: !0
                }) : (t > r.max ? i.next_group.call(e) : t === r.min && r.min > 0 && i.prev_group.call(e), a.cur = t, e.change({
                    image: !0,
                    thumb: !0
                })), n.update(r)
            },
            prev_group: function() {
                var t = this,
                    e = t.entry,
                    n = t.area;
                n.min = Math.max(n.min - n.size - 1, e.min), n.max = Math.min(n.min + n.size, e.max), t.change({
                    thumb: !0
                })
            },
            next_group: function() {
                var t = this,
                    e = t.entry,
                    n = t.area,
                    i = n.size;
                (n.max !== e.max || e.complete || t.fresh_ok) && (n.max = Math.min(n.max + i + 1, e.max), n.min = Math.max(n.max - i, e.min), n.max !== e.max || e.complete || (n.min = Math.max(n.max - i - 1, e.min), n.max = e.max - 1, t.fresh_ok = !1, t.happen("touch_border")), t.change({
                    thumb: !0
                }))
            }
        };
    return new e({
        ns: "store",
        get_ctx: function() {
            return i
        },
        change: function(t) {
            var e = this,
                n = e.entry,
                i = n.cur,
                a = e.area;
            t.image && e.happen("load_image", e.entry.cur), t.thumb && (e.happen("load_html", e.get_area()), e.happen("load_start"), e.happen("load_thumb", e.get_area())), e.happen("selected", {
                index: i,
                max: n.max,
                has_prev: i !== n.min,
                has_next: i !== n.max || !n.complete,
                has_prev_group: a.min > n.min,
                has_next_group: a.max < n.max || !n.complete,
                complete: n.complete
            })
        },
        get_area: function() {
            var t = this.area,
                e = this.entry;
            return {
                min: t.min,
                max: t.max >= e.max ? t.max : t.max + 1
            }
        },
        get_index: function() {
            return this.entry.cur
        }
    })
}), define("widget/image_preview/view", function(t) {
    var e = t("$"),
        n = t("lib/functional"),
        i = t("./view/tpl"),
        a = t("./mode"),
        r = e(window),
        o = e(document),
        s = (function() {
            var t = window.navigator.userAgent.toLowerCase(),
                e = /msie/.test(t) && !/opera/.test(t),
                n = /(webkit)/.test(t);
            return e || n ? "mousewheel" : "DOMMouseScroll"
        }(), 1),
        c = 1,
        l = 70,
        d = new a({
            ns: "view",
            watch_ns: ["store"],
            get_visible_size: function(t) {
                var e = t || 1,
                    n = r.width(),
                    i = e * l,
                    a = Math.min(960, n - 76);
                return s = i > a ? Math.floor(a / l) : e, c = i > a ? (n - a) / 2 | 0 : (n - i) / 2 | 0, s
            },
            show_mask: function() {
                this.$mask || (this.$mask = e('<div style="display: block;top: 0px;left: 0px;position: fixed;width: 100%;height: 100%;background-color: #000;opacity: 0.9;"></div>').appendTo(e("body"))), this.$mask.show()
            },
            hide_mask: function() {
                this.$mask && this.$mask.hide()
            },
            _render: {
                activate: function() {
                    var t = this;
                    t._run_once || (t._run_once = !0, t._render.once.call(t)), r.on("resize.image_preview_view", n.throttle(function() {
                        t.happen("window_resize"), t.children.$list.css("margin", "0px " + c + "px"), t.image_state.location.call(t)
                    }, 100)), o.on("keyup.image_preview_view", function(e) {
                        switch (e.preventDefault(), e.which) {
                            case 37:
                                t.children.$prev.hasClass("disable-prev") || t.happen("prev");
                                break;
                            case 39:
                                t.children.$next.hasClass("disable-next") || t.happen("next");
                                break;
                            case 27:
                                t.happen("destroy")
                        }
                    })
                },
                deactivate: function() {
                    r.off("resize.image_preview_view"), o.off("keyup.image_preview_view")
                },
                once: function() {
                    var t = this,
                        n = t.$view = e(i.image_preview_box()).appendTo(e("body"));
                    t.children = {
                        $big_img: n.find('[data-id="big_img"]'),
                        $list: n.find('[data-id="img-thumbnail-list"]'),
                        $content: n.find('[data-id="img-thumbnail-content"]'),
                        $prev_group: n.find('[data-id="prev_group"]'),
                        $next_group: n.find('[data-id="next_group"]'),
                        $prev: n.find('[data-id="prev"]'),
                        $next: n.find('[data-id="next"]'),
                        $loading: n.find('[data-id="loading"]'),
                        $desc: n.find('[data-id="description"]'),
                        $thumbList: n.find('[data-id="img-thumbnail-container"]')
                    }, n.on("click", function(e) {
                        return "td" === (e.target.tagName || "").toLowerCase() ? (t.happen("destroy"), e.stopImmediatePropagation(), !1) : void 0
                    }), n.on("click", "[data-id]", function(n) {
                        var i = e(this),
                            a = i.attr("data-id"),
                            r = !0;
                        return "destroy" === a ? t.happen(a, n) : t._render._ev_limit[a] ? i.hasClass("disable-next") || i.hasClass("disable-prev") || t.happen(a) : "pick" === a ? t.happen(a, i.attr("data-index") - 0) : r = !1, r ? (n.stopPropagation(), !1) : void 0
                    })
                },
                _ev_limit: {
                    prev_group: 1,
                    next_group: 1,
                    prev: 1,
                    next: 1
                }
            },
            setPreview: function(t) {
                var e = this.children.$big_img;
                e.find("img").remove(), e.find("i").remove(), e.append(t)
            },
            image_state: {
                start: function() {
                    var t = this;
                    t.children.$loading.show(), t.children.$desc.css("visibility", "hidden"), t.setPreview("")
                },
                location: function(t, n, i, a) {
                    var o = this,
                        s = t || e(o.children.$big_img.find("img")[0]);
                    if (s.get(0)) {
                        var c = i || 0 | s.attr("src_h"),
                            l = n || 0 | s.attr("src_w"),
                            u = d.children.$desc.height(),
                            p = r.height() - 97 - u - 10 - 12 - 30,
                            h = c / l,
                            f = {
                                height: c,
                                width: l,
                                margin: "-" + (u + 10 + 12 + 30) + "px 0px 12px 0px"
                            },
                            g = {
                                src_h: c,
                                src_w: l
                            };
                        c > p && (f.height = p, f.width = f.height / h), a ? s.attr(g).css(f) : s.attr(g).animate(f, "fast")
                    }
                },
                done: function(t, n, i, a) {
                    var r = this;
                    r.children.$loading.hide(), r.children.$desc.css("visibility", "visible");
                    var o = e(n);
                    r.setPreview(o), r.image_state.location.call(r, o, i, a, !0)
                },
                error: function() {
                    var t = this;
                    t.children.$loading.hide(), t.children.$desc.css("visibility", "visible"), t.setPreview(i.error())
                }
            },
            thumb_state: {
                done: function(t, e) {
                    this.children.$content.find('li[data-index="' + e + '"]').find("i").replaceWith(t)
                }
            },
            selected: function(t) {
                var e = this.children;
                e.$prev_group[t.has_prev_group ? "removeClass" : "addClass"]("disable-prev"), e.$next_group[t.has_next_group ? "removeClass" : "addClass"]("disable-next"), e.$prev[t.has_prev ? "removeClass" : "addClass"]("disable-prev").attr("title", t.has_prev ? "上一张" : "已是第一张"), e.$next[t.has_next ? "removeClass" : "addClass"]("disable-next").attr("title", t.has_next ? "下一张" : "已是最后一张"), e.$content.find(".current").removeClass("current"), e.$content.find('li[data-index="' + t.index + '"]').find("a").addClass("current"), e.$desc.text(t.desc || "")
            },
            _thumb: {
                _html: function(t, e) {
                    for (var n = [], a = t; e + 1 > a; a++) n.push(i.thumb_instance(a));
                    return n.join("")
                },
                _update: function(t) {
                    var n = this.children.$content.find('li[data-index="' + t + '"]')[0];
                    for (t -= 1; n;) n.tagName && "li" === n.tagName.toLowerCase() && (e(n).attr("data-index", t + ""), t += 1), n = n.nextSibling
                },
                add: function(t, n) {
                    var i = this,
                        a = i.children.$content;
                    i.hasOwnProperty("from") ? (n > i.to && e(i._thumb._html(i.to + 1, n)).insertAfter(a.find('li[data-index="' + i.to + '"]')), t < i.from && e(i._thumb._html(t, i.from - 1)).insertBefore(a.find('li[data-index="' + i.from + '"]')), i.from = Math.min(t, i.from), i.to = Math.max(n, i.to), a.animate({
                        marginLeft: -(t - i.from) * l
                    }, "fast")) : (i.from = t, i.to = n, a.append(e(i._thumb._html(t, n))), a.css({
                        marginLeft: 0
                    }))
                },
                destroy: function() {
                    delete this.from, this.children.$content.empty()
                }
            },
            store_watch: {
                init: function() {
                    var t = this;
                    t._render.activate.call(t), t.$view.show(), t.show_mask(), t.children.$list.css("margin", "0px " + c + "px").show()
                },
                destroy: function() {
                    var t = this;
                    t._render.deactivate.call(t), t.$view.hide(), t.hide_mask(), t._thumb.destroy.call(t)
                },
                load_html: function(t) {
                    this._thumb.add.call(this, t.min, t.max)
                }
            }
        });
    return d
}), define("widget/image_preview/view/tpl", function(t, e, n) {
    n.exports = {
        image_preview_box: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div data-no-selection class="viewer" style="z-index: 999;">\r\n			        <div class="preview-back"><a data-id="back" class="pvb-btn" href="#"></a></div>\r\n			\r\n			        <div class="viewer-header">\r\n			            <!-- 关闭按钮 -->\r\n			            <a data-id="destroy" class="viewer-close" hidefocus="true" href="#">×</a>\r\n			        </div>\r\n			\r\n			        <table class="img-viewer">\r\n			            <tbody><tr>\r\n			                <td class="viewer-inner">\r\n			                    <div class="viewerfix" data-id="big_img">\r\n			                        <!--翻页不可用时，加上 disable-next disable-prev-->\r\n			                        <a data-id="prev" class="viewer-prev disable-prev" title="上一张" href="#"></a>\r\n			                        <a data-id="next" class="viewer-next" title="下一张" href="#"></a>\r\n			                    </div>\r\n			                    <div class="desc" data-id="description"></div>\r\n			\r\n			                    <div style="margin-bottom: 0px;" class="viewer-info ui-pos">\r\n			                        <div class="img-thumbnail-list" data-id="img-thumbnail-list" style="display:none;">\r\n			                            <div class="img-thumbnail-inner">\r\n			                            <!--翻页不可用时加：disable-prev-->\r\n			                            <a data-id="prev_group" href="#" class="list-prev disable-prev"></a>\r\n			                            <div class="img-thumbnail-content" data-id="img-thumbnail-container">\r\n			                                <ul data-id="img-thumbnail-content"></ul>\r\n			                            </div>\r\n			                            <!--翻页不可用时加：disable-next-->\r\n			                            <a data-id="next_group" href="#" class="list-next"></a>\r\n			                            </div>\r\n			                        </div>\r\n			                    </div>\r\n			                </td>\r\n			            </tr>\r\n			            </tbody></table>\r\n			\r\n			        <div data-id="loading" class="viewer-loading" style="display: none;"></div>\r\n			    </div>'), t.join("")
        },
        thumb_instance: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<li  data-index="'), n(t), n('" data-id="pick"><a href="#" class="img-error"><i></i></a></li>'), e.join("")
        },
        error: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<i class="loading-img-error"></i>'), t.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/Loading", function(t, e, n) {
    var i = t("$"),
        a = t("./SimpleTip"),
        r = {},
        o = {},
        s = {
            show: function(t, e, n, i, s) {
                if (!t) throw new Error("必须指定namespace参数");
                if (n || i) {
                    var c = new a({
                        html: ['<div class="ui-alert ' + e + '" style="position: fixed; top: 50%; left: 50%;">', '<span class="icon"></span>', '<div class="title">', n ? "<h3>" + n + "</h3>" : "", i ? "<p>" + i + "</p>" : "", "</div>", "</div>"].join(""),
                        mask: !1
                    });
                    r[t] && this.hide(t), c.show(), s && this._mask(), r[t] = c, o[t] = !!s
                }
            },
            hide: function(t) {
                if (!t) throw new Error("必须指定namespace参数");
                var e = r[t];
                e && e.destroy(), delete r[t], delete o[t];
                var n = 0;
                for (var t in o) o[t] && n++;
                !n && this.$mask && (this.$mask.remove(), this.$mask = null)
            },
            _mask: function() {
                return this.$mask || (this.$mask = i('<div class="ui-mask"></div>').appendTo("#pagewrap"))
            }
        };
    n.exports = s
}), define("widget/login/login", function(t, e, n) {
    var i = t("$"),
        a = t("util"),
        r = t("event"),
        o = t("dialog"),
        s = (t("widget/SimpleTip"), t("router")),
        c = t("./login/tpl"),
        l = {
            _uin: "",
            _nick: "",
            init: function(t) {
                this.echoObj = t, this._uin = this.getRealUin(), this.echo();
                var e = s.fragment;
                this._uin && "/" != e && "/market" != e && this.checkLogin(), this.bindEvent()
            },
            echo: function() {
                this.echoObj.innerHTML = this.isLogin() ? c.login({
                    name: this.getNick()
                }) : c.unLogin()
            },
            update: function(t) {
                this._uin = t.uin || this._uin, this._nick = t._nick || this._nick
            },
            getRealUin: function() {
                return parseInt(a.cookie.get("uin").replace(/\D/g, ""), 10)
            },
            getUin: function() {
                return this._uin || this.getRealUin()
            },
            setUin: function(t) {
                this._uin = t
            },
            getNick: function() {
                return this._nick || a.cookie.get("nick")
            },
            setNick: function(t) {
                this._nick = t
            },
            isLogin: function() {
                return !!this.getUin() && !!a.getProductId()
            },
            getPtloginUrl: function(t) {
                var e = "http://" + location.host + "/";
                return t = i.extend({
                    appid: 558032501,
                    s_url: e + "callback.html",
                    style: 12,
                    enable_qlogin: 0,
                    target: "self",
                    link_target: "blank",
                    hide_close_icon: 0,
                    hide_title_bar: 1
                }, t), "http://ui.ptlogin2.qcloud.com/cgi-bin/login?" + a.objectToParams(t)
            },
            show: function(t) {
                if ("login" != o.owner) {
                    this.clearSession(), t = t || {};
                    var e = this,
                        n = this.getPtloginUrl();
                    o.create('<iframe  allowtransparency="yes" frameborder="no" scrolling="no" src="' + n + '" width="100%" height="100%">', t.width || 422, t.height || 305, {
                        callback: function() {
                            o.hide(), e.checkLogin(!0, t.callback)
                        },
                        "class": t.cls || "ui-modal login-modal",
                        owner: "login"
                    }), window.ptlogin2_onResize = function(t, e) {
                        o.el.height(e), o.el.find("> div").height(e)
                    }
                }
            },
            clearSession: function() {
                a.cookie.del("skey"), a.cookie.del("nodesess", "weixin.qcloud.com")
            },
            updateAvatar: function() {
                t.async("wxManager", function(t) {
                    t.updateAvatar()
                })
            },
            checkLogin: function(e, n) {
                var i = this;
                t.async("config/manager", function(t) {
                    a.setACSRFToken(""), t.checkLogin(function(t) {
                        var r = t.data;
                        if (r) {
                            var c = r.userInfo,
                                l = c.nick,
                                d = c.activeProduct,
                                u = d.productid,
                                p = d.productname;
                            if (!u) return i.logout(), void o.miniTip("产品ID错误, 请重新登录");
                            i.setNick(l), a.setProductId(u), a.setProductName(p), a.cookie.set("nick", l)
                        }
                        i.echo(), n && n(), e && i.updateAvatar(), e && !n && (s.option.pageManager.fragment = "", s.navigate(s.fragment))
                    }, function(t) {
                        i.checkLoginFail(t, e)
                    })
                })
            },
            checkLoginFail: function(t, e) {
                var n, a;
                if (12 == t.code || 25 == t.code || 26 == t.code)
                    if (o.hideMiniTipNow(), 12 == t.code) / ^ \/register\b/.test(s.fragment) ? e && s.navigate(s.fragment) : (n = s.fragment, a = i(window).scrollTop(), s.navigate("/register/index/" + encodeURIComponent(n) + "/" + a));
                    else {
                        this.logout();
                        var r = 25 == t.code ? "腾讯云协作者" : "腾讯开放平台协作者";
                        o.create(c.failLogin({
                            identity: r
                        }), "", "", {
                            title: "登录错误",
                            button: {
                                "我知道了": function() {
                                    o.hide()
                                }
                            },
                            defaultCancelBtn: 0
                        })
                    } else this.logout()
            },
            logout: function(e) {
                var n = this;
                t.async("config/manager", function() {
                    a.cookie.del("uin"), a.cookie.del("luin"), a.cookie.del("skey"), a.cookie.del("nick"), a.cookie.del("nodesess", "weixin.qcloud.com"), a.setACSRFToken(""), a.setProductId(""), n.setUin(""), n.setNick(""), t.async("wxManager", function(t) {
                        t.clearCache()
                    }), n.echo(), e || s.navigate("/")
                })
            },
            bindEvent: function() {
                this._initHoverMenu(), r.addCommonEvent("click", {
                    login_grzl: function() {
                        window.open("http://manage.qcloud.com/developerCenter/information.php")
                    },
                    login_fyzx: function() {
                        window.open("http://manage.qcloud.com/account/account.php#act=record")
                    }
                })
            },
            _initHoverMenu: function() {
                var t;
                r.addCommonEvent("mouseenter", {
                    login_usr_menu: function() {
                        i(this).addClass("expand"), clearTimeout(t)
                    }
                }), r.addCommonEvent("mouseleave", {
                    login_usr_menu: function() {
                        var e = i(this);
                        clearTimeout(t), t = setTimeout(function() {
                            e.removeClass("expand")
                        }, 200)
                    }
                })
            }
        };
    n.exports = l
}), define("widget/login/login/tpl", function(t, e, n) {
    n.exports = {
        login: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<ul>\r\n			        <li data-event="login_usr_menu" class="dropdown"><a href="javascript:void(0)">'), n(this.__escapeHtml(t.name)), n('<span class="arrow"></span></a>\r\n			            <ul>\r\n			                <!--<li><a href="javascript:void(0);" data-event="login_grzl" data-hot="nav.grzl"><span class="nav-icon-user"></span>个人资料</a></li>-->\r\n			                <li><a href="/personal/packages/list" data-event="nav" data-hot="nav.tcgl"><span class="nav-icon-package"></span>套餐管理</a></li>\r\n			                <li><a href="/personal/order/list" data-event="nav" data-hot="nav.dingdangl"><span class="nav-icon-deal"></span>订单管理</a></li>\r\n			                <li><a href="/personal/expense" data-event="nav" data-hot="nav.cost"><span class="nav-icon-cost"></span>费用中心</a></li>\r\n			                <li class="split"><a href="javascript:void(0);" data-event="logout" data-hot="nav.signout"><span class="nav-icon-logout"></span> 退出</a></li>\r\n			            </ul>\r\n			        </li>\r\n			        <!--<li><a href="http://manage.qcloud.com/noticeCenter.php" target="_blank">消息</a></li>-->\r\n			        <li><a href="javascript:void(0);" data-event="platform_customer" data-hot="nav.kefu"><span class="nav-icon-qq"></span>联系客服</a></li>\r\n			        <li class="last"><a href="javascript:void(0);" data-event="platform_feedback" data-hot="nav.fankui">反馈建议</a></li>\r\n			    </ul>'), e.join("")
        },
        unLogin: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<ul>\r\n			        <li><a href="javascript:void(0);" data-event="login" data-hot="nav.signin">登录</a></li>\r\n			        <li><a href="/register" data-event="nav" data-hot="nav.register">注册</a></li>\r\n			        <li><a href="javascript:void(0);" data-event="platform_customer" data-hot="nav.kefu"><span class="nav-icon-qq"></span>联系客服</a></li>\r\n			        <li class="last"><a href="javascript:void(0);" data-event="platform_feedback" data-hot="nav.fankui">反馈建议</a></li>\r\n			    </ul>'), t.join("")
        },
        failLogin: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<span class="ui-alert-icon error"></span>\r\n			    <div class="ui-alert-title">\r\n			        <p class="ui-status warning">您是'), n(t.identity), n("，暂不支持使用"), n(window.platformName), n("</p>\r\n			        <p>协作者功能我们将马上推出，敬请期待</p>\r\n			    </div>"), e.join("")
        },
        notRegister: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<span class="ui-alert-icon error"></span>\r\n			    <div class="ui-alert-title">\r\n			        <p class="ui-status warning">您还没有注册，是否现在注册？</p>\r\n			    </div>'), t.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/login/tipLogin", function(t, e, n) {
    var i = t("$"),
        a = (t("util"), t("widget/login/login")),
        r = t("widget/SimpleTip"),
        o = (t("router"), t("./tipLogin/tpl")),
        s = function() {};
    s.prototype = a;
    var c = new s;
    c.show = function(t) {
        var e = this,
            n = i.Deferred();
        e.tipInstance && e.tipInstance.hide();
        var a = e.tipInstance = new r({
            hideOnVoid: !0,
            tpl: i.proxy(o.loginTip, o),
            data: {
                ptloginUrl: this.getPtloginUrl({
                    style: 11,
                    hide_close_icon: 1
                })
            },
            onShow: function() {
                t && this.alignTo(i(t)), this.$el.find("iframe")[0].callback = function() {
                    a.hide(), e.checkLogin(!0, function() {
                        n.resolve.apply(n, arguments)
                    })
                }
            },
            alignTo: function(t) {
                var e = this,
                    n = i(window);
                this.clearAlignTo();
                var a = this._alignHandler = function() {
                    e.doAlignTo(t)
                };
                n.on("resize", a), a()
            },
            clearAlignTo: function() {
                var t = i(window);
                this._alignHandler && t.off("resize", this._alignHandler)
            },
            doAlignTo: function(t) {
                var t, e, n, i, a = this.$el,
                    r = this._get$ct();
                e = a.find(".arrow"), e.css("right", (t.outerWidth() - e.outerWidth()) / 2 + "px"), n = e.position(), i = t.offset(), a.css({
                    top: i.top + t.outerHeight() - n.top + r.scrollTop() + "px",
                    left: i.left + t.outerWidth() / 2 - (n.left + e.outerWidth() / 2) + r.scrollLeft() + "px"
                })
            },
            onHide: function() {
                this.clearAlignTo(), this.$el.find("iframe")[0].callback = null, e.tipInstance = null
            }
        });
        return a.show(), n
    }, n.exports = c
}), define("widget/login/tipLogin/tpl", function(t, e, n) {
    n.exports = {
        loginTip: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="ui-popover bottom qq-login">\r\n					<div class="arrow"></div>\r\n					<div class="ui-popover-content">\r\n						<iframe style="width: 620px;height: 368px;" scrolling="auto" frameborder="0" src="'), n(t.ptloginUrl), n('"></iframe>\r\n					</div>\r\n				</div>'), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/package/common", function(t, e, n) {
    var i = t("$"),
        a = t("util"),
        r = t("event"),
        o = t("./common/tpl"),
        s = t("dialog"),
        c = t("widget/score/score"),
        l = {
            map: {},
            init: function() {
                var t = this;
                this.renderNavTop(), r.addCommonEvent("click", {
                    package_back_to_top: function() {
                        t.$scroller.scrollTop(0)
                    },
                    package_contact_customer: function() {
                        var e, n, i = t.getMetaByDom(this),
                            r = i["package"];
                        r && (e = r.providerqq, n = r.contactqq, a.contactCustomer(e, n))
                    },
                    package_view_provider: function() {
                        var e = t.getMetaByDom(this),
                            n = e["package"];
                        s.create(o.provider(n), "", "", {
                            closeIcon: !0
                        })
                    },
                    package_view_picture: function() {
                        var e = t.getMetaByDom(this);
                        t.handleViewPicture(e.pictureIndex, e["package"])
                    }
                })
            },
            addScrollEvent: function(t) {
                var e = function() {
                        var t = document;
                        return Math.max(t.body.scrollHeight, t.documentElement.scrollHeight, t.body.offsetHeight, t.documentElement.offsetHeight, t.body.clientHeight, t.documentElement.clientHeight)
                    },
                    n = this,
                    i = this._scrollHandler = function() {
                        t && t(n.$scroller, e())
                    };
                this.$scroller.on("scroll", i)
            },
            ifShowNavTop: function() {
                this.$navTop.toggle(this.$scroller.scrollTop() > 100)
            },
            renderNavTop: function() {
                var t = i("#container");
                this.$scroller = i(window), this.$navTop = i(o.navTop()).appendTo(t), this.ifShowNavTop()
            },
            _parsePictureListString: function(t, e) {
                var n = {
                        medium: [160, 230],
                        small: [64, 92],
                        big: [400, 574]
                    },
                    a = t ? t.split(/,|;/) : [];
                return a = i.grep(a, function(t) {
                    return !!i.trim(t)
                }), i.map(a, function(t) {
                    var i, a = t ? t.match(/^(.*\/)([^\/]+)$/) : null,
                        r = {
                            desc: e
                        };
                    for (i in n) n.hasOwnProperty(i) && (r[i] = a ? a[1] + n[i].join("_") + a[2] : t);
                    return r
                })
            },
            processPackages: function(t, e) {
                var n = this,
                    a = this.map;
                return void 0 == e && (e = 0), i.each(t, function(t, r) {
                    r.listIndex = e + t, a[r.packageid] = r;
                    var o = n._parsePictureListString(r.packagepics, r.packagedesc);
                    r.services && i.each(r.services, function(t, e) {
                        o = o.concat(n._parsePictureListString(e.servicepics, e.servicedesc || r.packagedesc))
                    }), r.pictures = o, r.scorehtml = r.score && r.scorenum ? new c({
                        editable: !1,
                        score: (r.score + r.scoreweight) / r.scorenum
                    }).getHtml() : '<span style="color:#b3b3b3; font-size:12px">暂无评分</span>'
                }), t
            },
            getMetaByDom: function(t) {
                var e = {};
                t = i(t), e.$target = t;
                var n = t.closest('[data-type="package"]');
                if (!n.length) return e;
                e.$package = n;
                var a = e.packageId = n.attr("data-id"),
                    r = (e["package"] = this.map[a], t.closest('[data-type="picture"]'));
                if (!r.length) return e;
                e.$picture = r;
                var o = parseInt(r.attr("data-index"), 10);
                return e.pictureIndex = o, e
            },
            handleViewPicture: function(e, n) {
                t("widget/image_preview/preview").render({
                    data: i.map(n.pictures, function(t) {
                        return {
                            desc: t.desc,
                            src: t.big,
                            thumb: t.small
                        }
                    }),
                    index: e
                })
            },
            destroy: function() {
                this.$scroller && this.$scroller.off("scroll", this._scrollHandler), this.$navTop && this.$navTop.remove()
            }
        };
    n.exports = l
}), define("widget/package/common/tpl", function(t, e, n) {
    n.exports = {
        navTop: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<a href="javascript:void(0);" title="返回顶部" class="backtop icon-angle-up" data-event="package_back_to_top"></a>'), t.join("")
        },
        provider: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="services-show-box">\r\n					<div class="services-img-box"><img src="'), n(t.providericon), n('"></div>\r\n					<div class="services-con">\r\n						<table>\r\n							<tbody><tr>\r\n								<th colspan="2" class="s-bt">'), n(this.__escapeHtml(t.providername)), n('</th>\r\n							</tr>\r\n							<tr class="s-tr">\r\n								<td class="s-tit">公司介绍：</td>\r\n								<td><div class="s-content">'), n(this.__escapeHtml(t.providerintr)), n('</div></td>\r\n							</tr>\r\n							<tr class="s-tr">\r\n								<td class="s-tit">公司地址：</td>\r\n								<td>'), n(this.__escapeHtml(t.provideraddr)), n('</td>\r\n							</tr>\r\n							<tr class="s-tr">\r\n								<td class="s-tit">客服电话：</td>\r\n								<td>'), n(this.__escapeHtml(t.providerphone)), n('</td>\r\n							</tr>\r\n							<tr class="s-tr">\r\n								<td class="s-tit">客服邮箱：</td>\r\n								<td>'), n(this.__escapeHtml(t.provideremail)), n("</td>\r\n							</tr>\r\n						</tbody></table>\r\n					</div>\r\n				</div>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/package/list", function(t, e, n) {
    var i = t("$"),
        a = (t("util"), t("net")),
        r = t("event"),
        o = (t("dialog"), t("./list/tpl")),
        s = (t("widget/SimpleTip"), t("manager")),
        c = t("widget/package/common"),
        l = t("lib/observable"),
        d = t("lib/xExtend"),
        u = d.define(l, {
            loading: null,
            listSelector: ".container",
            packageSelector: ".package-list",
            pictureListCtSelector: ".img-list-box",
            pictureListSelector: ".img-list",
            pictureSelector: "li",
            prevButtonSelector: ".package-preview-play-left",
            nextButtonSelector: ".package-preview-play-right",
            hoverClass: "package-hover",
            picWidth: 169,
            _constructor: function(t) {
                i.extend(this, t);
                var e = this;
                this._clickHandler = r.dispatchActionEvent(this.$el, this);
                var n = this._hoverHandler = function() {
                        i(this).addClass(e.hoverClass)
                    },
                    a = this._unhoverHandler = function() {
                        i(this).removeClass(e.hoverClass)
                    };
                this.$el.on("mouseenter", this.packageSelector, n), this.$el.on("mouseleave", this.packageSelector, a), this.on("busying", function(t, n) {
                    e.$loading && (e.$loading.remove(), e.$loading = null), e.$feedback && (e.$feedback.remove(), e.$feedback = null), t ? n && (e.$loading = i(o.loading()).appendTo(e.$el.find(e.listSelector)).show()) : e.isComplete() && (e.$feedback = i(o.feedback()).appendTo(e.$el.find(e.listSelector)).show())
                })
            },
            _updateNavigations: function() {
                var t = this,
                    e = this.$el.find(this.packageSelector);
                e.each(function(e, n) {
                    t._updateNavigation(n)
                })
            },
            _updateNavigation: function(t) {
                t = i(t);
                var e = t.find(this.pictureListCtSelector),
                    n = t.find(this.pictureListSelector),
                    a = e.width(),
                    r = e[0],
                    o = e.find(this.pictureSelector + ":last"),
                    s = o.length ? o.position().left - n.position().left - parseInt(e.css("marginLeft"), 10) + o.outerWidth() : 0,
                    c = r.scrollLeft,
                    l = t.find(this.prevButtonSelector),
                    d = t.find(this.nextButtonSelector);
                l.toggleClass("show", c > 0), d.toggleClass("show", s > c + a);
                var u = this.picWidth,
                    p = e.find(this.pictureSelector),
                    h = Math.max(0, Math.round(c / u) - 1),
                    f = Math.min(p.length, Math.round((c + a) / u) + 1);
                p.slice(h, f).each(function(t, e) {
                    var n = i(e).find("img"),
                        a = "data-src",
                        r = n.attr(a);
                    r && n.attr("src", r).removeAttr(a)
                })
            },
            onActionPrevpicture: function(t) {
                var e, n;
                t.is(".show") && (e = c.getMetaByDom(t), n = e.$package.find(this.pictureListCtSelector), n.scrollLeft(n.scrollLeft() - this.picWidth), this._updateNavigation(e.$package))
            },
            onActionNextpicture: function(t) {
                var e, n;
                t.is(".show") && (e = c.getMetaByDom(t), n = e.$package.find(this.pictureListCtSelector), n.scrollLeft(n.scrollLeft() + this.picWidth), this._updateNavigation(e.$package))
            },
            onActionSelectpackage: function(t) {
                var e = c.getMetaByDom(t);
                e["package"] && this.trigger("selectpackage", e["package"].packageid, e["package"], e)
            },
            onActionBuypackage: function(t) {
                var e = c.getMetaByDom(t);
                e["package"] && this.trigger("buypackage", e["package"].packageid, e["package"], e)
            },
            onActionFeedback: function(t) {
                this.trigger("feedback", t)
            },
            load: function(t) {
                var e = this;
                if (this.loading) return this.loading;
                var n = i.extend({}, t, {
                        action: "listPackage",
                        status: 2,
                        providerdetail: !0,
                        owned: !0
                    }),
                    r = n.offset && n.offset > 0,
                    o = this.loading = i.Deferred();
                return this.trigger("busying", !0, r), a.ajax({
                    url: "/cgi/service",
                    data: n,
                    dataType: "json"
                }).done(function(t) {
                    var i = t.data.data,
                        a = t.data.total;
                    e.lastParams = n, r ? e.appendData(i) : e.setData(i, a), o.resolve(i, a), n.showActivity && e.showActivity()
                }).fail(function() {
                    o.reject()
                }).always(function() {
                    e.loading = null, e.trigger("busying", !1, r)
                }), o
            },
            isComplete: function() {
                return this.data && this.data.length >= this.total ? !0 : !1
            },
            loadmore: function() {
                if (this.total && !this.isComplete()) {
                    var t = i.extend({}, this.lastParams, {
                        offset: this.data.length
                    });
                    return this.load(t)
                }
            },
            showActivity: function() {
                for (var t, e = this, n = this.data, i = [], a = 0; t = n[a]; a++) i.push(t.packageid);
                s.getActivityByPackageids({
                    packageIds: i.join(",")
                }, function(t) {
                    if (t.saleactivitys.length)
                        for (var n, i = 0; n = t.saleactivitys[i]; i++) {
                            var a = e.$el.find('li[data-id="' + n.packageid + '"]');
                            if (a.length) {
                                var r = a.find(".activity-mark");
                                "NORMAL" == s.getActivityStatus(n, t).code ? r.length || a.find('[data-field="price"]').append(o.activityMark({
                                    packageid: n.packageid
                                })) : r.length && r.remove()
                            }
                        }
                })
            },
            setData: function(t, e) {
                this.data = t, this.total = e, this.map = {}, t = c.processPackages(t, 0), this.$el.html(o.list(t)), this._updateNavigations()
            },
            appendData: function(t) {
                var e = this.data.length;
                this.data = this.data.concat(t), t = c.processPackages(t, e);
                var n = this.$el.find(this.listSelector);
                n.append(o.packages(t)), this._updateNavigations()
            },
            destroy: function() {
                this.$el.off("click", this._clickHandler), this.$el.off("mouseenter", this.packageSelector, this._hoverHandler), this.$el.off("mouseleave", this.packageSelector, this._unhoverHandler)
            }
        });
    n.exports = u
}), define("widget/package/list/tpl", function(t, e, n) {
    n.exports = {
        list: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<a href="http://bbs.qcloud.com/forum.php?mod=viewthread&amp;tid=482&amp;fromuid=4404" target="_blank" style="position: relative;margin: -21px 0 25px 39px;display: block;">\r\n					<img src="http://qzonestyle.gtimg.cn/qcloud/app/resource/ac/package/quick_gl_a.jpg" width="988" height="42">\r\n				</a>\r\n				<ul class="container">'), n(this.packages(t)), n("	</ul>"), e.join("")
        },
        packages: function(t) {
            var e, n, i = [],
                a = function(t) {
                    i.push(t)
                };
            for (e = 0; e < t.length; e++) n = t[e], a("		"), a(this.package(n)), a("	");
            return a(""), i.join("")
        },
        "package": function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            n('<li class="package-list clearfix" data-type="package" data-id="'), n(t.packageid), n('">\r\n					<div class="package-preview">\r\n						<div class="img-list-box">\r\n							<ul class="img-list clearfix" style="width: 9999px;">');
            var i, a;
            for (i = 0; i < t.pictures.length; i++) a = t.pictures[i], n('						<li data-index="'), n(i), n('" data-type="picture" data-event="package_view_picture" data-hot="fwsc.xiangqing.'), n(t.packageid), n('">\r\n										<a href="#"><img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-src="'), n(a.medium), n('" /><span class="border"></span></a>\r\n									</li>');
            return n('				</ul>\r\n						</div>\r\n						<a class="package-preview-play-left show" href="#" data-action="prevpicture" data-hot="fwsc.prev.'), n(t.packageid), n('"><span>&lt;</span></a>\r\n						<a class="package-preview-play-right show" href="#" data-action="nextpicture" data-hot="fwsc.next.'), n(t.packageid), n('"><span>&gt;</span></a>\r\n					</div>\r\n					<div class="package-info">\r\n						<h3>'), n(this.__escapeHtml(t.packagename)), n('</h3>\r\n						<div class="company" data-field="company">\r\n							<a href="javascript:void(0);" data-event="package_view_provider" data-type="provider" data-id="'), n(t.providerid), n('" data-hot="fwsc.fuwushang.'), n(t.providerid), n('">'), n(this.__escapeHtml(t.providername)), n('</a>\r\n							<a href="javascript:void(0);" data-event="package_contact_customer" data-hot="fwsc.qq.'), n(t.providerqq || t.contactqq || 800033878), n('"  class="icon-service mod-qqlink" title="点此可以直接和服务商交流功能、服务、售后等问题"></a>\r\n						</div>\r\n						<div class="price" data-field="price"><strong>'), n(t.price4month / 100), n('</strong><span>元/月</span><span class="remark">'), n(t.freedays), n('天免费试用</span></div>\r\n						<p class="infor">'), n(this.__escapeHtml(t.packagedesc)), n('</p>\r\n						<div class="score">'), n(t.scorehtml), n('			</div>\r\n						<div class="btn">'), n(this.selectBtn(t)), n("</div>\r\n					</div>\r\n				</li>"), e.join("")
        },
        selectBtn: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            n('<button type="button" class="ui-btn ui-btn-wid ui-btn-primary" title=""\r\n						data-action="selectpackage" \r\n						data-hot="fwsc.xuanyong.'), n(t.packageid), n('">\r\n						选用');
            var i = t.ordernumweight + t.ordernum;
            return i > 15 && (n("				<span>("), n(i), n("人已使用)</span>")), n("	</button>"), e.join("")
        },
        service_link: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<a class="service" data-type="service" data-id="'), n(t.serviceid), n('">'), n(t.servicename), n("</a>"), e.join("")
        },
        service: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="service" data-type="service" data-id="'), n(t.serviceid), n('" data-action="viewservice">'), n(t.servicename), n("	</div>"), e.join("")
        },
        loading: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<li class="loading"><i class="ui-loading"></i></li>'), t.join("")
        },
        feedback: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<li class="feedback">没有找到心仪套餐？<a href="#" data-action="feedback">点击这里反馈</a></li>'), t.join("")
        },
        activityMark: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<a class="activity-mark" href="/personal/packages/activity/'), n(t.packageid), n('" data-event="nav" data-hot="fwsc.activity.'), n(t.packageid), n('" style="color:#f30; margin-left:6px;">\r\n					<span class="icon-sale"></span>\r\n				</a>'), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/placeholder/placeholder", function(t, e, n) {
    var i = t("$"),
        a = {
            init: function(t, e) {
                var n = "placeholder" in document.createElement("input");
                if (!n) {
                    var a = {
                        inputWrapper: '<span style="position:relative"></span>',
                        placeholderCSS: {
                            "font-size": "14px",
                            color: "#bababa",
                            position: "absolute",
                            left: "16px",
                            top: "0",
                            overflow: "hidden"
                        }
                    };
                    e = i.extend({}, a, e), t = i(t), t.attr("placeholder-init") || (t.find("[placeholder]").each(function() {
                        var t = i(this),
                            n = i.trim(t.val()),
                            a = t.width(),
                            r = t.height(),
                            o = this.id ? this.id : "placeholder" + +new Date,
                            s = t.attr("placeholder"),
                            c = i("<label for=" + o + ">" + s + "</label>");
                        e.placeholderCSS.width = a, e.placeholderCSS.height = r, c.css(e.placeholderCSS), t.wrap(e.inputWrapper), t.attr("id", o).after(c), n && c.hide(), t.focus(function() {
                            i.trim(t.val()) || c.hide()
                        }), t.blur(function() {
                            i.trim(t.val()) || c.show()
                        })
                    }), t.attr("placeholder-init", 1))
                }
            }
        };
    n.exports = a
}), define("widget/register/Form", function(t, e, n) {
    var i = t("$"),
        a = t("lib/observable"),
        r = t("./Form/tpl"),
        o = t("lib/xExtend"),
        s = o.define(a, {
            errorTipStyle: "right",
            _constructor: function(t) {
                i.extend(this, t)
            },
            _markField: function(t, e) {
                var n = t.closest(".ui-form-group"),
                    a = t.siblings(".ui-help-inline,.ui-help-block");
                n.toggleClass("error", !!e), a.remove(), e && (a = i(r.error({
                    text: e,
                    style: this.errorTipStyle
                })).appendTo(t.parent()))
            },
            _doHookInput: function(t, e, n) {
                var i = this;
                t.on("focus", function() {
                    i._markField(t, null)
                }), t.on("blur", function() {
                    e.call(n)
                })
            }
        });
    n.exports = s
}), define("widget/register/Form/tpl", function(t, e, n) {
    n.exports = {
        error: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<span class="'), n("down" === t.style ? "ui-help-block" : "ui-help-inline"), n('">\r\n					<span class="icon-warning-1"></span>'), n(this.__escapeHtml(t.text)), n("</span>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/register/InfoBar", function(t, e, n) {
    var i = t("$"),
        a = t("./InfoBar/tpl"),
        r = function(t) {
            i.extend(this, t)
        };
    r.prototype = {
        render: function(t) {
            this.$el = i(a.infoWrap()).appendTo(t)
        },
        show: function() {
            this.$el.css("visibility", "visible")
        },
        hide: function() {
            this.$el.css("visibility", "hidden")
        },
        update: function(t) {
            this.$el.html(a.msg(t))
        },
        clear: function() {
            this.$el.html("")
        },
        destroy: function() {
            this.$el.remove()
        }
    }, n.exports = r
}), define("widget/register/InfoBar/tpl", function(t, e, n) {
    n.exports = {
        infoWrap: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div class="msg"></div>'), t.join("")
        },
        msg: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<p class="'), n(t.isTip !== !1 ? "ui-tips" : ""), n('">'), n(t.html), n(this.__escapeHtml(t.text)), n("</p>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/register/LoginForm", function(t, e, n) {
    var i = t("$"),
        a = t("event"),
        r = (t("./Result"), t("widget/SimpleTip")),
        o = t("widget/login/login"),
        s = t("./LoginForm/tpl"),
        c = t("./Form"),
        l = t("lib/xExtend"),
        d = l.define(c, {
            errorTipStyle: "down",
            _constructor: function() {
                this._callbacks = []
            },
            render: function(t) {
                this.$el = i(s.form()).appendTo(t), this.$qqInput = this.$el.find("input").focus(), this._doHookInput(this.$qqInput, this._doVerifyQQ, this), a.dispatchActionEvent(this.$el, this)
            },
            onActionVerify: function() {
                this._doVerifyQQ() && this.showLoginLayer(i.trim(this.$qqInput.val()))
            },
            _doVerifyQQ: function() {
                var t, e = this.$qqInput,
                    n = i.trim(e.val());
                return n ? /^\d{5,}$/.test(n) || (t = "请正确输入您的QQ号码") : t = "请输入您的QQ号码", this._markField(e, t), !t
            },
            showLoginLayer: function(t) {
                var e = this,
                    n = new r({
                        mask: !0,
                        hideOnVoid: !0,
                        tpl: i.proxy(s.loginLayer, s),
                        data: {
                            ptloginUrl: o.getPtloginUrl({
                                style: 12,
                                uin: t,
                                hide_close_icon: 1,
                                no_verifyimg: 1,
                                hideWelcome: 1,
                                enable_qlogin: 0
                            })
                        },
                        onShow: function() {
                            var t = this.$el;
                            t.css("margin-left", -t.width() / 2), t.css("margin-top", -t.height() / 2), t.find("iframe")[0].callback = function() {
                                n.hide(), i.each(e._callbacks, function(t, e) {
                                    e()
                                })
                            }, window.ptlogin2_onResize = function(e, n) {
                                t.height(n), t.find("> div").height(n)
                            }
                        },
                        onHide: function() {
                            this.$el.find("iframe")[0].callback = null
                        }
                    });
                n.show()
            },
            done: function(t) {
                this._callbacks.push(t)
            },
            destroy: function() {
                this.$el.remove()
            }
        });
    n.exports = d
}), define("widget/register/LoginForm/tpl", function(t, e, n) {
    n.exports = {
        form: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<form class="ui-form ui-form-vertical form_padding">\r\n					<div class="ui-form-group form_qq">\r\n						<label class="ui-form-label">QQ号码</label>\r\n						<div class="ui-form-ctrls">\r\n							<input type="text" placeholder="请输入QQ号码" />\r\n							<button type="submit" class="ui-btn ui-btn-primary ui-btn-wid" data-action="verify" data-hot="zhuce.yzqq">验证</button>\r\n						</div>\r\n					</div>\r\n				</form>'), t.join("")
        },
        error: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<span class="ui-help-inline"><span class="icon-warning-1"></span>'), n(this.__escapeHtml(t)), n("</span>"), e.join("")
        },
        loginLayer: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div style="position: absolute; z-index: 999;left:50%;top:50%; width:422px; height:305px" class="ui-modal login-modal">\r\n					<div style="height:305px">\r\n						<iframe allowtransparency="yes" frameborder="no" scrolling="no" src="'), n(t.ptloginUrl), n('" width="100%" height="100%"></iframe>\r\n					</div>\r\n				</div>'), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/register/Progress", function(t, e, n) {
    var i = t("$"),
        a = t("./Progress/tpl"),
        r = function(t) {
            i.extend(this, t)
        };
    r.prototype = {
        index: 0,
        render: function(t) {
            this.$el = i(a.progress(this._getData())).appendTo(t)
        },
        stepTo: function(t) {
            this.index = t, this._update()
        },
        _update: function() {
            var t = i(a.progress(this._getData()));
            this.$el.replaceWith(t), this.$el = t
        },
        _getData: function() {
            return {
                index: this.index,
                steps: this.steps
            }
        },
        destroy: function() {
            this.$el.remove()
        }
    }, n.exports = r
}), define("widget/register/Progress/tpl", function(t, e, n) {
    n.exports = {
        progress: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            n('<div class="step">\r\n					<ul class="ui-step">');
            var i, a = t.index,
                r = t.steps;
            for (i = 0; i < r.length; i++) n('				<li class="'), n(a > i ? "success" : i == a ? "active" : ""), n('">\r\n								<span class="sequence">'), n(i + 1), n('</span>\r\n								<span class="title">'), n(this.__escapeHtml(r[i])), n("</span>\r\n							</li>");
            return n("		</ul>\r\n				</div>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/register/RegisterForm", function(t, e, n) {
    var i = t("$"),
        a = t("net"),
        r = t("event"),
        o = t("util"),
        s = (t("lib/jquery.repaint"), t("./Result")),
        c = t("./RegisterForm/tpl"),
        l = t("./Form"),
        d = t("widget/SimpleTip"),
        u = t("lib/xExtend"),
        p = u.define(l, {
            isActivate: !1,
            _constructor: function() {
                this._callbacks = []
            },
            render: function(t) {
                this.$ct = t;
                var e = this.$el = i(c.form(this)).appendTo(t);
                this.$nameInput = e.find('input[name="name"]').focus(), this.$phoneInput = e.find('input[name="tel"]'), this.$phoneVerifyInput = e.find('input[name="verify"]'), this.$emailInput = e.find('input[name="email"]'), this._doHookInput(this.$nameInput, this._doVerifyName, this), this._doHookInput(this.$phoneInput, this._doVerifyPhone, this), this._doHookInput(this.$phoneVerifyInput, this._doVerifyCode, this), this._doHookInput(this.$emailInput, this._doVerifyEmail, this), r.dispatchActionEvent(e, this)
            },
            onActionSendVerify: function(t) {
                var e = this;
                if (!t.attr("disabled") && this._doVerifyPhone()) {
                    var n = i.trim(this.$phoneInput.val());
                    t.prop("disabled", !0), a.ajax({
                        url: "/cgi/login?action=sendTelCode",
                        data: {
                            skey: o.cookie.get("skey"),
                            tel: n
                        }
                    }).done(function() {
                        e._doCountDown(60).progress(function(e) {
                            t.text("重新获取(" + e + "秒)"), t.parent().repaint()
                        }).done(function() {
                            t.text("重新获取"), t.parent().repaint(), t.prop("disabled", !1)
                        })
                    }).fail(function() {
                        t.prop("disabled", !1)
                    }), e.$phoneVerifyInput.focus().empty()
                }
            },
            _doCountDown: function(t) {
                {
                    var e = i.Deferred(),
                        n = new Date;
                    setInterval(function() {
                        var i = (new Date - n) / 1e3,
                            a = Math.round(t - i);
                        e.notify(a)
                    }, 1e3), setTimeout(function() {
                        e.resolve()
                    }, 1e3 * t)
                }
                return e
            },
            onActionRegister: function() {
                var t = this;
                this._doVerify() && this._submit().done(function() {
                    i.each(t._callbacks, function(t, e) {
                        e()
                    })
                }).fail(function(e) {
                    var n = e && e.code;
                    switch (n) {
                        case 29:
                            t._markField(t.$phoneVerifyInput, "手机验证码过期");
                            break;
                        case 28:
                            t._markField(t.$phoneVerifyInput, "验证码有误");
                            break;
                        case 27:
                            t._markField(t.$phoneInput, "手机号码有误");
                            break;
                        default:
                            t.hide(), new s({
                                type: "error",
                                title: "注册失败",
                                content: "非常抱歉！注册失败请重新注册",
                                html: '<a href="#" class="ui-btn ui-btn-primary ui-btn-wid" data-action="return">重新注册</a>',
                                onActionReturn: function() {
                                    this.destroy(), t.show()
                                }
                            }).render(t.$ct)
                    }
                })
            },
            onActionLicense: function() {
                new d({
                    html: c.license(),
                    hideOnEsc: !0
                }).show()
            },
            _doVerify: function() {
                var t = !1;
                return t = !this._doVerifyName() || t, t = !this._doVerifyPhone() || t, t = !this._doVerifyCode() || t, t = !this._doVerifyEmail() || t, !t
            },
            _doVerifyName: function() {
                return !0
            },
            _doVerifyPhone: function() {
                var t, e = this.$phoneInput,
                    n = i.trim(e.val());
                return e.is(":disabled") ? !0 : (n ? /^1[3458]\d{9}$/.test(n) || (t = "请输入正确的手机号码") : t = "请输入手机号码", this._markField(e, t), !t)
            },
            _doVerifyCode: function() {
                var t, e = this.$phoneVerifyInput,
                    n = i.trim(e.val());
                return e.is(":disabled") ? !0 : (n ? /^[0-9]{6}$/.test(n) || (t = "请输入6位数字验证码") : t = "请输入验证码", this._markField(e, t), !t)
            },
            _doVerifyEmail: function() {
                var t, e = this.$emailInput,
                    n = i.trim(e.val());
                return e.is(":disabled") ? !0 : (n ? /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(n) || (t = "请输入正确的邮箱") : t = "请输入邮箱", this._markField(e, t), !t)
            },
            _submit: function() {
                var t = this.isActivate,
                    e = {
                        uin: o.getUin(),
                        skey: o.cookie.get("skey"),
                        csrfCode: o.getACSRFToken(),
                        tel: i.trim(this.$phoneInput.val()),
                        telCode: i.trim(this.$phoneVerifyInput.val())
                    };
                return t || (e.name = i.trim(this.$nameInput.val()), e.email = i.trim(this.$emailInput.val())), a.ajax({
                    url: "/cgi/login?action=" + (t ? "activeOpenOwner" : "registerQcloudOwner"),
                    data: e,
                    method: "post"
                })
            },
            done: function(t) {
                this._callbacks.push(t)
            },
            show: function() {
                this.trigger("show"), this.$el.show()
            },
            hide: function() {
                this.trigger("hide"), this.$el.hide()
            },
            destroy: function() {
                this.trigger("destroy"), this.$el.remove()
            }
        });
    n.exports = p
}), define("widget/register/RegisterForm/tpl", function(t, e, n) {
    n.exports = {
        form: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<form class="ui-form ui-form-vertical form_padding">\r\n					<div class="ui-form-group" >\r\n						<label class="ui-form-label">QQ号码<sup>*</sup></label>\r\n						<div class="ui-form-ctrls">\r\n							<input type="text" name="uin" disabled="true" value="'), n(t.uin), n('" />&nbsp;&nbsp;<a href="#" data-action="reset">更换QQ号</a>\r\n						</div>\r\n					</div>\r\n					<div class="ui-form-group" style="display:none;">\r\n						<label class="ui-form-label">公司名称<sup>*</sup></label>\r\n						<div class="ui-form-ctrls">\r\n							<input type="text" name="name" placeholder="请输入公司名称" '), n(t.isActivate ? "disabled='true'" : ""), n(' value="'), n(this.__escapeHtml(t.name || "" + t.uin)), n('" />\r\n						</div>\r\n					</div>\r\n					<div class="ui-form-group">\r\n						<label class="ui-form-label">手机号码<sup>*</sup></label>\r\n						<div class="ui-form-ctrls">\r\n							<input type="text" name="tel" class="" placeholder="请输入手机号码" value="'), n(this.__escapeHtml(t.tel)), n('" />\r\n						</div>\r\n					</div>\r\n					<div class="ui-form-group">\r\n						<div class="ui-form-ctrls">\r\n							<button type="button" class="ui-btn" data-action="sendVerify">获取验证码</button><span class="ui-help-inline">验证码5分钟内有效</span>\r\n						</div>\r\n					</div>\r\n					<div class="ui-form-group">\r\n						<label class="ui-form-label">验证码<sup>*</sup></label>\r\n						<div class="ui-form-ctrls">\r\n							<input type="text" name="verify" placeholder="请输入验证码">\r\n						</div>\r\n					</div>\r\n					<div class="ui-form-group">\r\n						<label class="ui-form-label">联系邮箱<sup>*</sup></label>\r\n						<div class="ui-form-ctrls">\r\n							<input type="text" name="email" placeholder="请输入邮箱地址" value="'), n(this.__escapeHtml(t.mail)), n('" '), n(t.isActivate ? "disabled='true'" : ""), n(' />\r\n						</div>\r\n						<div class="ui-form-ctrls">\r\n							<a href="#" data-action="license">《微信服务市场用户协议》</a>\r\n						</div>\r\n					</div>\r\n					<div class="ui-form-group">\r\n						<div class="ui-form-ctrls">\r\n							<button type="submit" class="ui-btn ui-btn-primary" data-action="register" data-hot="'), n(t.isActivate ? "zhuce.jihuo" : "zhuce.agreezc"), n('">同意并注册</button>\r\n						</div>\r\n					</div>\r\n				</form>'), e.join("")
        },
        license: function() {
            var t = [],
                e = function(e) {
                    t.push(e)
                };
            return e('<div class="ui-modal tip-license" style="width: 800px; height: 600px; overflow-y: auto;position:fixed; left:50%; top:50%;">\r\n					<button class="ui-btn ui-btn-link" data-action="hide">&times;</button>\r\n						<h1>微信服务市场用户协议</h1>\r\n				\r\n						<h2>【首部及导言】</h2>\r\n						<p class="bold">欢迎您使用微信服务市场及相关服务（以下简称“本服务”）！</p>\r\n						<p class="bold">为使用本服务，您应当阅读并遵守《微信服务市场用户协议》（以下简称:本协议）等相关协议、规则。请您务必审慎阅读、充分理解各条款内容，特别是限制或免除责任的条款，以及开通或使用某项服务的单独协议、规则。限制或免责条款可能以加粗形式提示您注意。</p>\r\n						<p class="bold">除非您已阅读并接受本协议及相关协议、规则等的所有条款，否则,您无权使用本服务，您使用本服务的任何行为，即视为您已阅读并同意上述协议、规则等的约束。</p>\r\n						<p class="bold">您有违反本协议的任何行为时，康盛有权依照您违反情况随时单方采取限制、中止或终止向您提供服务等措施，并有权追究您相关责任。</p> \r\n						\r\n						<h2>一、【定义】</h2>\r\n						<span class="bold">如无特别说明，下列术语在本协议中的含义为：</span>\r\n						    <p><span class="bold">1.1 微信服务市场建站服务平台：</span>指由康盛在微信服务市场中搭建的中立的服务平台，简称“服务平台”。服务商可通过服务平台向用户推广、销售服务商自己的建站服务，用户可通过服务平台根据自身需求购买、使用建站服务。</p>\r\n						    <p><span class="bold">1.2 建站服务：</span>指微信服务市场服务商独立开发或者依法获得相关权利人授权，通过微信服务市场向用户提供的各种产品和服务，包括但不限于建站软件、管理支持等产品和服务。</p>\r\n						    <p><span class="bold">1.3 微信服务市场服务商：</span>指接入微信服务市场，向用户提供建站服务的个人、法人或其他组织，在本协议中简称为“服务商”。</p>\r\n						    <p><span class="bold">1.4 微信服务市场用户：</span>指通过微信服务市场购买、使用服务商提供的建站服务的个人、法人或其他组织，在本协议简称为“用户”或“您”。</p>\r\n						\r\n						<h2>二、【协议的范围】</h2>\r\n						    <p>2.1 本协议是您与腾讯旗下公司--北京康盛新创科技有限责任公司（本协议中称为“康盛”）之间关于您使用本服务所订立的协议。</p>\r\n						    <p class="bold">2.2 本协议内容同时包括康盛可能不断发布的关于本服务的相关协议、业务规则等内容。上述内容一经正式发布，即为本协议不可分割的组成部分，您同样应当遵守。</p>\r\n							<p class="bold">2.3 康盛和您均同意和理解：</p>\r\n							<p class="level2 bold">(1) 康盛是一个中立的平台服务提供者，仅向服务商提供各类云系统服务、信息存储空间、网络交易平台等网络服务及相关的中立技术支持服务等，您可通过服务平台购买、使用服务商提供的建站服务。</p>      \r\n							<p class="level2 bold">(2) 建站服务由服务商自行开发、运营且自行承担全部责任。康盛不参与服务商的建站服务的开发、运营等，也不会对建站服务的代码和数据等任何内容进行修改、编辑或整理等。</p>\r\n							<p class="level2 bold">(3) 因服务商的建站服务等任何产品、服务及相关内容等产生的任何纠纷、责任等，或因服务商违反相关法律法规或本协议约定引发的任何后果，均由服务商独立承担责任、赔偿损失，与康盛无关。如侵害到康盛或他人权益的，由服务商自行承担全部责任和赔偿一切损失。</p>\r\n						\r\n						<h2>三、【用户权利与义务】</h2>\r\n							<p>3.1 您应当按照本服务注册流程进行注册登录。您有义务妥善保管本服务帐号及密码，并正确、安全地使用帐号及密码，并对帐号产生的全部行为依法享有权利和承担责任。</p>\r\n							<p>3.2 您应遵守<a href="http://www.qq.com/contract.shtml" target="_blank">《腾讯服务协议》</a>、<a href="http://zc.qq.com/chs/agreement1_chs.html" target="_blank">《QQ号码规则》</a>及<a href="http://weixin.qq.com/cgi-bin/readtemplate?uin=&stype=&promote=&fr=&lang=zh_CN&ADTAG=&check=false&nav=faq&t=weixin_agreement&s=default" target="_blank">《腾讯微信软件许可及服务协议》</a>，保证所提供的信息（包括但不限于身份资料信息）真实、完整、有效，并依法使用本服务及建站服务。</p>\r\n							<p>3.3 您可以根据需要自行决定购买、使用服务平台中任意服务商提供的建站服务。您在购买、使用具体建站服务之前，请审慎了解具体建站服务的功能、要求及收费等详细内容，如果您对具体建站服务有异议的，则请勿以任何方式购买或使用。<span class="bold">因购买、使用建站服务等产生的任何纠纷，您应当与服务商协商解决。</span></p>\r\n							<p>3.4 您购买的建站服务仅供支付成功时选择的帐号来使用。您如需更换帐号来使用建站服务时，需另行购买并支付相应的费用。</p>\r\n							<p>3.5您向服务商购买建站服务后，如需发票等支付凭证或者服务单据的，应当向服务商提出，并由服务商依法承担开具并邮寄相应的发票等支付凭证或者服务单据的责任。</p>\r\n							<p>3.6 您使用本服务时，请勿随意透露自己的各类财产账户、银行卡、信用卡、QQ 号码及对应密码等重要资料，否则由此带来的任何损失由您自行承担。</p>\r\n							<p>3.7 您应规范、合法地使用本服务及建站服务，不得实施任何违法行为，包括但不限于发布违法、违背社会公德以及其他违反相关法律法规或本协议的信息或实施相关行为。</p>\r\n							<p class="bold">3.8 服务商可能因各种原因（包括但不限于服务商自身运营规划调整、服务商违反本服务规则被追究责任、建站服务侵犯他人知识产权被禁止等），导致其所提供的全部或部分建站服务在服务平台中下架或被禁止使用，这可能对您造成一定影响。您理解并同意，前述情况并非由于康盛过错导致，您应直接向服务商主张权利。</p>\r\n							<p>3.9 建站服务由服务商独立开发或依法获得相关权利人授权，通过服务平台向用户进行宣传、推广和销售，受中华人民共和国著作权法及国际版权条约和其他知识产权法及条约的保护。您应尊重服务商的知识产权，未经授权不得实施下列任何行为：</p>\r\n							<p class="level2">(1) 删除建站服务及其他副本上所有关于商标、著作权等权利信息及内容。</p>\r\n							<p class="level2">(2) 对建站服务进行反向工程、反向汇编、反向编译等。</p>\r\n							<p class="level2">(3) 复制、修改、链接、转载、汇编、传播，建立镜像站点、擅自借助建站服务发展与之有关的衍生产品、作品等。</p>\r\n							<p class="level2">(4) 利用建站服务或本服务发表、传送、传播、储存危害国家安全、祖国统一、社会稳定的内容，或侮辱诽谤、色情、暴力、引起他人不安及任何违反国家法律法规政策的内容。</p>\r\n							<p class="level2">(5) 利用建站服务或本服务发表、传播、储存侵害他人知识产权、商业机密权、肖像权、隐私等合法权利的内容。</p>\r\n							<p>3.10您不应进行任何危害计算机网络安全的行为，包括但不限于未经许可：</p>\r\n							<p class="level2">(1) 使用任何数据或进入服务器/帐户；</p>\r\n							<p class="level2">(2) 进入公众计算机网络或者他人计算机系统并删除、修改、增加存储信息；</p>\r\n							<p class="level2">(3) 企图探查、扫描、测试服务平台或网络的弱点或其它实施破坏网络安全的行为；</p>\r\n							<p class="level2">(4) 企图干涉、破坏服务平台或网站的正常运行，传播恶意程序或病毒以及其他破坏干扰正常网络信息服务；</p>\r\n							<p class="level2">(5) 利用BUG（又叫“漏洞”或者“缺陷”）来获得不正当的利益，或者利用互联网或其他方式将BUG公之于众；</p>\r\n						\r\n						<h2>四、【康盛权利与义务】</h2>\r\n							<p>4.1 康盛仅负责与服务平台本身有关的运营和维护，并承担因服务平台产生的用户咨询。与建站服务相关的全部事务（包括但不限于用户咨询和投诉解答、纠纷处理等）由服务商自行负责。</p>\r\n							<p>4.2 为向您提供更加完善的服务，康盛有权随时自主决定对本服务的界面、使用规则等进行优化和调整，并且康盛有权变更、调整建站服务的具体类型和范围。</p>\r\n							<p class="bold">4.3 康盛有权在必要时单方决定修改本协议条款，且毋须另行通知。修改后的协议一旦在网页上公布即有效代替原来的内容，您可以在相关服务页面查阅最新版本的协议条款。如果您不接受修改后的协议，应当停止使用本服务。否则，您对相关服务的登陆、查看等任何使用行为将被视为您对相关修改的理解和接受。</p>\r\n							<p>4.4 保护用户数据是康盛的一项基本原则，除法律或有法律赋予权限的政府部门要求或用户同意等合理原因外，未经您的同意，康盛不会向任何他方公开、透露您的信息，以下情形除外：</p>\r\n							<p class="level2">(1) 依据本协议或其他相关协议、规则等规定可以提供的；</p>\r\n							<p class="level2">(2) 依据法律法规的规定可以提供的；</p>\r\n							<p class="level2">(3) 行政、司法等政府部门要求提供的；</p>\r\n							<p class="level2">(4) 您同意康盛向第三方提供的；</p>\r\n							<p class="level2">(5) 为解决用户投诉、举报事件、提起诉讼而需要提供的；</p>\r\n							<p class="level2">(6) 为防止严重违法行为或涉嫌犯罪行为发生而采取必要合理行动所必须提供的；</p>\r\n							<p class="bold">4.5 您理解并同意，若因您违反相关法律法规、本协议，导致权利人投诉，或者根据主管机关要求，康盛有权向权利人、主管机关提供您的信息（包括但不限于联系方式、主体信息等）。</p>\r\n						\r\n						<h2>五、【风险与免责】</h2>\r\n							<p>5.1 您理解并同意，使用本服务涉及到互联网服务，可能会受到各个环节不稳定因素的影响。因此本服务存在因不可抗力、计算机病毒或黑客攻击、系统不稳定、用户所在位置、用户操作不当、用户通过非康盛授权方式使用服务平台、用户电脑软硬件出现故障等以及其他任何技术、互联网络、通信线路原因等造成的服务中断或不能满足用户要求的风险。</p>\r\n							<p class="bold">5.2 您理解并同意，建站服务由服务商提供，康盛对建站服务不作任何类型的担保，不论是明确的或隐含的，包括其真实性、适用性、非侵权性等。并且，康盛并不会参与建站服务的开发、运营等，康盛仅提供中立的平台及相关技术服务。因建站服务发生的任何纠纷，由服务商与您协商解决，相关责任和赔偿由服务商单独承担。</p>\r\n							<p class="bold">5.3 尽管康盛对您的信息保护做了极大的努力，但是仍然不能保证在现有的安全技术措施下，您的信息绝对安全。您的信息可能会因为不可抗力或非康盛过错造成泄漏、被窃取等，由此给您造成损失的，您同意康盛可以免责。</p>\r\n							<p class="bold">5.4 您理解并同意：在使用本服务的过程中，可能会遇到不可抗力等风险因素，使服务发生中断。出现上述情况时，康盛将努力在第一时间与相关单位配合，及时进行修复，但是由此给您造成的损失康盛将予以免责。</p>\r\n						\r\n						<h2>六、【服务的中止与终止】</h2>\r\n							<p>6.1 康盛有权提前60个自然日，以线上公告、站内信等任何方式，通知终止运营本服务。</p>\r\n							<p>6.2 若康盛自行发现或根据相关部门的信息、权利人的投诉等，发现您违反相关法律法规或本协议的，康盛有权根据自己的独立判断并随时单方采取以下措施中的一种或多种：</p>\r\n							<p class="level2">(1) 要求您立即更换、修改内容；</p>\r\n							<p class="level2">(2) 直接删除、屏蔽相关内容或断开链接等；</p>\r\n							<p class="level2">(3) 限制、中止您使用本服务的部分或全部功能；</p>\r\n							<p class="level2">(4) 终止您使用本服务，解除协议关系；</p>\r\n							<p class="level2">(5) 追究您的法律责任；</p>\r\n							<p class="level2">(6) 其他康盛认为适合的处理措施；</p>\r\n							<p>6.3 由于您违反本协议约定，康盛依约终止向您提供服务后，如您后续再直接或间接，或以他人名义注册使用本服务的，康盛有权直接单方面暂停或终止提供服务。</p>\r\n							<p class="bold">6.4 您因违反本协议约定所引起的纠纷、责任等一概由您自行负责，康盛也无需向您退还任何费用，而由此给您带来的损失（包括但不限于通信中断、相关数据清空等），由您自行承担。若因此造成康盛或他人损失的，您也应予以赔偿。</p>\r\n						\r\n						<h2>七、【附则】</h2>\r\n							<p>7.1 本协议签订地为中华人民共和国深圳市南山区。</p>\r\n							<p>7.2 本协议的解释，效力及纠纷的解决，适用中华人民共和国大陆地区法律（不包括冲突法）。</p>\r\n							<p>7.3 若因本协议发生任何纠纷或争议，各方应当友好协商解决，协商不成的，均应提交本协议签订地有管辖权的人民法院解决。</p>\r\n							<p>7.4 本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。（完）</p>\r\n						\r\n						<p class="right">康盛公司</p>\r\n						<div style="text-align: center;">\r\n							<button type="button" class="ui-btn ui-btn-primary" data-action="hide">确定</button>\r\n						</div>\r\n				</div>'), t.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/register/Result", function(t, e, n) {
    var i = t("$"),
        a = t("event"),
        r = t("./Result/tpl"),
        o = function(t) {
            i.extend(this, t)
        };
    o.prototype = {
        type: "success",
        title: "",
        text: "",
        html: "",
        actionProperty: "data-action",
        render: function(t) {
            var e = this.$el = i(r.result(this)).appendTo(t);
            a.dispatchActionEvent(e, this)
        },
        destroy: function() {
            this.$el.remove()
        }
    }, n.exports = o
}), define("widget/register/Result/tpl", function(t, e, n) {
    n.exports = {
        result: function(t) {
            var e = [],
                n = function(t) {
                    e.push(t)
                };
            return n('<div class="result '), n(t.title ? "" : "return"), n('">\r\n					<span class="ui-alert-icon '), n(t.type), n('"></span>'), t.title && (n("			<h3>"), n(this.__escapeHtml(t.title)), n("</h3>")), n("		<p>"), n(this.__escapeHtml(t.text)), n("</p>"), n(t.html), n("	</div>"), e.join("")
        },
        __escapeHtml: function() {
            var t = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                e = /[&<>'"\/]/g;
            return function(n) {
                return "string" != typeof n ? n : n ? n.replace(e, function(e) {
                    return t[e] || e
                }) : ""
            }
        }()
    }
}), define("widget/score/score", function(t, e, n) {
    var i = t("$"),
        a = (t("event"), t("util")),
        r = {
            main: '<span class="ui-score <%=cls%> <% if(editable) { %> ui-score-edit <% } %> "><span class="count"></span><% if(editable) { %><a href="javascript:void(0);" class="s1" data-score="2"></a><a href="javascript:void(0);" class="s2" data-score="4"></a><a href="javascript:void(0);" class="s3" data-score="6"></a><a href="javascript:void(0);" class="s4" data-score="8"></a><a href="javascript:void(0);" class="s5" data-score="10"></a><% } %></span><span class="score-num" style="color:#D89400; margin-left:2px; <% if(!number) { %> display:none <% } %>"><%=number%></span>'
        },
        o = function(t) {
            var e = {
                editable: !0,
                showNumber: !1,
                score: 0,
                container: null,
                cb: null
            };
            return this.options = i.extend({}, e, t), this.score = this.options.score, this.container = i(this.options.container), this.init(), this
        };
    o.prototype = {
        init: function() {
            var t = this,
                e = t.options;
            e.editable && (this.render(), this.bindEvent())
        },
        render: function() {
            this.container.html(this.getHtml())
        },
        bindEvent: function() {
            var t = this,
                e = t.options,
                n = this.container,
                a = "ui-score ui-score-edit ";
            n.on("mouseenter", "a", function() {
                clearTimeout(t.t);
                var r = n.find(".ui-score"),
                    o = n.find(".score-num");
                r.attr("class", a), e.showNumber && o.text(parseFloat(i(this).attr("data-score")).toFixed(1)).show()
            }), n.on("mouseleave", "a", function() {
                clearTimeout(t.t), t.t = setTimeout(function() {
                    t.render()
                }, 50)
            }), n.on("click", "a", function() {
                var n = i(this),
                    a = n.attr("data-score");
                t.score = parseInt(a), e.cb && e.cb(a)
            })
        },
        getHtml: function() {
            var t = this.options,
                e = {
                    cls: this.getStarCls(),
                    editable: t.editable
                };
            e.number = t.showNumber ? 0 == this.score ? 0 : parseFloat(this.score).toFixed(1) : 0;
            var n = a.tmpl(r.main, e);
            return n
        },
        getScore: function() {
            return this.score
        },
        getStarCls: function() {
            for (var t = this, e = (t.options, []), n = [], i = 0, a = 0, r = 0, o = 11; o > r; r++) e.push(i), n.push("ui-score-" + a), i += 1, a += 10;
            var s = function(t, e) {
                if (e = parseFloat(e), e = e.toFixed(0), e < Math.min.apply(null, t)) return 0;
                if (e > Math.max.apply(null, t)) return t.length - 1;
                for (var n = 0, i = 0, a = t.length; a > i; i++)
                    if (t[i] >= e) {
                        n = i;
                        break
                    }
                return n
            };
            return n[s(e, this.score)]
        }
    }, n.exports = o
}), define("widget/selector/selector", function(t, e, n) {
    function i(t) {
        o(t.target).parent().hasClass("not-hidden") || (o(".ui-dropdown.open").removeClass("open up"), a())
    }

    function a() {
        o("body").off("click", i)
    }

    function r() {
        o("body").on("click", i)
    }
    var o = t("$"),
        s = (t("util"), t("main/pagemanage")),
        c = function(t, e) {
            var n = {
                title: "请选择"
            };
            if (this.options = o.extend({}, n, e), t) {
                var t = o(t);
                this.menu = t, this.button = t.find(".ui-btn"), this.changeFn = [], this.bindEvent();
                var i = t.find(".current");
                return i = i.length ? i.eq(0) : t.find("li").eq(0), this.val(i.attr("data-id")), this
            }
        };
    c.prototype = {
        val: function(t) {
            return void 0 == t ? this.menu.attr("data-value") : void this._select(t)
        },
        change: function(t) {
            this.changeFn.push(t)
        },
        bindEvent: function() {
            var t = this,
                e = this.menu,
                n = this.button;
            n.on("click", function(t) {
                var n = o(this),
                    a = e.hasClass("open");
                if (i(t), !a) {
                    e.addClass("open");
                    var c = s.getScrollEl(),
                        l = c.offset().top,
                        d = c.height() + l,
                        u = n.next(".ui-dropdown-menu"),
                        p = u.outerHeight(),
                        h = u.offset().top,
                        f = h + p;
                    f > d && e.addClass("up"), r()
                }
                return !1
            });
            var a = e.find("li");
            a.on("click", function() {
                t.val(o(this).attr("data-id"));
                for (var e = 0, n = t.changeFn.length; n > e; e++) {
                    var i = t.changeFn[e];
                    i && i.call(t)
                }
            })
        },
        _select: function(t) {
            var e = this.menu,
                n = this.button,
                i = this.options.title,
                a = e.find("li");
            a.removeClass("current"), a.each(function() {
                var e = o(this);
                return e.attr("data-id") == t ? (e.addClass("current"), i = e.text(), !1) : void 0
            }), e.attr("data-value", t), n.html(i + ' <span class="ui-caret"></span>')
        }
    }, n.exports = c
}), define("widget/SimpleTip", function(t, e, n) {
    var i = t("$"),
        a = t("util"),
        r = t("event"),
        o = t("lib/observable"),
        s = t("lib/xExtend"),
        c = s.define(o, {
            $ct: null,
            html: "",
            tpl: i.noop,
            data: null,
            mask: !1,
            hideOnVoid: !1,
            autoDissmiss: 0,
            hideOnEsc: null,
            actionProperty: "data-action",
            _constructor: function(t) {
                i.extend(this, t), null === this.hideOnEsc && (this.hideOnEsc = this.hideOnVoid || this.autoDissmiss > 0)
            },
            _get$ct: function() {
                return this.$ct || (this.$ct = i("#pagewrap"))
            },
            show: function() {
                var t = this,
                    e = this.$el;
                e || (e = this.$el = i(this.html || this.tpl(this.data)).appendTo(this._get$ct()), this._bindEvent(e)), e.show(), this.mask && this.get$Mask().show(), this.autoDissmiss && (this.dissmissTimer = setTimeout(function() {
                    t.hide()
                }, this.autoDissmiss)), this.onShow(), this.trigger("show")
            },
            onShow: function() {
                var t = this.$el;
                t.css("margin-left", -t.outerWidth() / 2), t.css("margin-top", -t.outerHeight() / 2)
            },
            hide: function() {
                this.onHide(), this.trigger("hide");
                var t = this.$el;
                t && (this._unbindEvent(t), t.remove(), this.$el = null);
                var e = this.$mask;
                e && (e.remove(), this.$mask = null)
            },
            onHide: i.noop,
            _bindEvent: function(t) {
                var e = this;
                this._clickHandler = r.dispatchActionEvent(t, this, this.actionProperty, "onAction", function(t, n) {
                    e.trigger("action", t, n)
                });
                var n = this._clickVoidHandler = a.proxy(this._handleClickVoid, this);
                this.hideOnVoid && (this.voidTimer = setTimeout(function() {
                    e.voidTimer = null, i(document).on("click", n)
                }, 1)), this.hideOnEsc && (this._escHandler = a.proxy(this._handleEsc, this), i(document).on("keydown", this._escHandler))
            },
            _unbindEvent: function(t) {
                t.off("click", this._clickHandler), this.hideOnVoid && (i(document).off("click", this._clickVoidHandler), this.voidTimer && (clearTimeout(this.voidTimer), this.voidTimer = null)), this.dissmissTimer && (clearTimeout(this.dissmissTimer), this.dissmissTimer = null), this._escHandler && i(document).off("keydown", this._escHandler)
            },
            _handleClickVoid: function(t) {
                var e = i(t.target).closest(this.$el);
                e.length || this.hide()
            },
            _handleEsc: function(t) {
                27 === t.keyCode && this.hide()
            },
            onActionHide: function() {
                this.hide()
            },
            onActionClose: function() {
                this.hide()
            },
            get$Mask: function() {
                return this.$mask || (this.$mask = i('<div class="ui-mask"></div>').appendTo(this.$ct))
            },
            destroy: function() {
                this.hide(), this.removeAllListeners()
            }
        });
    n.exports = c
}), define("widget/simple_editor/editor", function(t, e, n) {
    function i(t, e) {
        for (var n, i = t.childNodes, a = 0, r = i.length; r > a; a++) {
            var o = i[a];
            if (o) {
                var s = o.nodeName.toUpperCase();
                switch (o.nodeType) {
                    case 1:
                        n = c.getEmotion(o), n ? t.replaceChild(n, o) : "BR" !== s && (o.__fromEnter__ || (e ? o.__fromEnter__ = !0 : (t.insertBefore(document.createTextNode(o.textContent || o.innerText || o.nodeValue || ""), o), t.removeChild(o))));
                        break;
                    case 3:
                        break;
                    default:
                        t.removeChild(o)
                }
            }
        }
    }

    function a(t) {
        var e = s.trim(t.outerHTML || "").toLowerCase();
        return "<p></p>" === e || "<p>&nbsp;</p>" === e || "<div><br></div>" === e || "<div>&nbsp;</div>" === e
    }

    function r(t) {
        for (var e = t.childNodes, n = [], i = 0, o = e.length; o > i; i++) {
            var s = e[i],
                c = s.textContent || s.innerText || s.nodeValue || "",
                l = (s.tagName || "").toUpperCase();
            "BR" !== l && (s.__fromEnter__ ? (0 !== i && n.push("\n"), a(s) || n.push(r(s))) : "IMG" !== l ? c && n.push(c) : n.push(s.outerHTML))
        }
        return n.join("")
    }

    function o(t) {
        for (var e = /\n/g, n = [], i = "", a = 0; i = e.exec(t);) n.push(t.substr(a, i.index - a)), a = i.index + 1;
        a < t.length && n.push(t.substr(a, t.length - a));
        for (var r = /msie/.test(navigator.userAgent.toLowerCase()), o = r ? "<p>" : "<div>", s = r ? "</p>" : "</div>", c = [], l = 0, d = n.length; d > l; l++) c.push(o), c.push(n[l] || "&nbsp;"), c.push(s);
        return c.join("")
    }
    var s = t("$"),
        c = t("widget/simple_editor/emotion"),
        l = t("widget/formchange/formchange"),
        d = function() {},
        u = function() {
            var t = window.navigator.userAgent.toLowerCase();
            return !/msie/.test(t) && /(webkit)/.test(t)
        }();
    d.getSelection = function() {
        return document.selection ? document.selection : window.getSelection()
    }, d.getRange = function(t) {
        var e = d.getSelection();
        if (!e) return null;
        var n = e.getRangeAt ? e.rangeCount ? e.getRangeAt(0) : null : e.createRange();
        return n ? t ? d.containsRange(t, n) ? n : null : n : null
    }, d.contains = function(t, e, n) {
        if (!n && t === e) return !1;
        if (t.compareDocumentPosition) {
            var i = t.compareDocumentPosition(e);
            if (20 == i || 0 == i) return !0
        } else if (t.contains(e)) return !0;
        return !1
    }, d.containsRange = function(t, e) {
        var n = e.commonAncestorContainer || e.parentElement && e.parentElement() || null;
        return n ? d.contains(t, n, !0) : !1
    };
    var p = (/msie/.test(navigator.userAgent.toLowerCase()) ? "<p></p>" : "<div><br></div>", function(t) {
        var e = this,
            n = function() {
                e.saveRange();
                var n = e.$area.html(),
                    i = c.toWechatString(n);
                e._text !== i && (e._text = i, t.changeCb && t.changeCb.call(null))
            },
            r = function() {
                e.tid && clearTimeout(e.tid), e.tid = setTimeout(function() {
                    i(e.$area.get(0)), n()
                }, 10)
            };
        (e.$area = s(t.editArea)).on({
            keyup: function(t) {
                switch (t.which) {
                    case 13:
                        i(e.$area.get(0), !0);
                        break;
                    case 8:
                        var r = e.$area.get(0).childNodes;
                        1 === r.length && a(r[0]) && e.$area.html("")
                }
                n(), l.set(1)
            },
            mouseup: n,
            drop: r,
            paste: r
        })
    });
    s.extend(p.prototype, {
        setServerString: function(t) {
            this.$area.html(o(t)), i(this.$area.get(0), !0)
        },
        getServerString: function() {
            return c.toWechatString(r(this.$area.get(0)))
        },
        getLength: function() {
            return c.toWechatString(this.$area.html()).replace(/(<div>|<br>|<\/div>|<p>|<\/p>)/g, "").replace(/&nbsp;/g, " ").length
        },
        insertNode: function(t) {
            var e = this;
            e.focusDiv();
            var n = d.getRange();
            if (n.createContextualFragment) {
                t += '<img data-id="insert" style="width:1px;height:1px;">';
                var i = n.createContextualFragment(t),
                    a = i.lastChild;
                n.deleteContents(), n.insertNode(i), n.setEndAfter(a), n.setStartAfter(a);
                var r = d.getSelection();
                r.removeAllRanges(), r.addRange(n), u && document.execCommand("Delete", !1, null)
            } else n.pasteHTML(t), n.collapse(!1), n.select();
            e.$area.find('[data-id="insert"]').remove(), e.saveRange()
        },
        saveRange: function() {
            this.lastRange = d.getRange()
        },
        focusDiv: function() {
            var t = this;
            if (t.$area.focus(), t.lastRange) {
                var e = d.getSelection();
                if (e.addRange) e.removeAllRanges(), e.addRange(t.lastRange);
                else {
                    var n = d.getRange();
                    n.setEndPoint("EndToStart", t.lastRange), n.collapse(!1), n.setEndPoint("EndToEnd", t.lastRange), n.select()
                }
            }
        }
    }), n.exports = p
}), define("widget/simple_editor/emotion", function(t, e, n) {
    function i(t) {
        var e = o[t];
        return t && e >= 0 ? l.replace("{address}", s.replace("{index}", r[e].index)) : ""
    }
    var a = t("$"),
        r = [{
            name: "微笑",
            position: "0px 0;",
            index: "0"
        }, {
            name: "撇嘴",
            position: "-24px 0;",
            index: "1"
        }, {
            name: "色",
            position: "-48px 0;",
            index: "2"
        }, {
            name: "发呆",
            position: "-72px 0;",
            index: "3"
        }, {
            name: "得意",
            position: "-96px 0;",
            index: "4"
        }, {
            name: "流泪",
            position: "-120px 0;",
            index: "5"
        }, {
            name: "害羞",
            position: "-144px 0;",
            index: "6"
        }, {
            name: "闭嘴",
            position: "-168px 0;",
            index: "7"
        }, {
            name: "睡",
            position: "-192px 0;",
            index: "8"
        }, {
            name: "大哭",
            position: "-216px 0;",
            index: "9"
        }, {
            name: "尴尬",
            position: "-240px 0;",
            index: "10"
        }, {
            name: "发怒",
            position: "-264px 0;",
            index: "11"
        }, {
            name: "调皮",
            position: "-288px 0;",
            index: "12"
        }, {
            name: "呲牙",
            position: "-312px 0;",
            index: "13"
        }, {
            name: "惊讶",
            position: "-336px 0;",
            index: "14"
        }, {
            name: "难过",
            position: "-360px 0;",
            index: "15"
        }, {
            name: "酷",
            position: "-384px 0;",
            index: "16"
        }, {
            name: "冷汗",
            position: "-408px 0;",
            index: "17"
        }, {
            name: "抓狂",
            position: "-432px 0;",
            index: "18"
        }, {
            name: "吐",
            position: "-456px 0;",
            index: "19"
        }, {
            name: "偷笑",
            position: "-480px 0;",
            index: "20"
        }, {
            name: "可爱",
            position: "-504px 0;",
            index: "21"
        }, {
            name: "白眼",
            position: "-528px 0;",
            index: "22"
        }, {
            name: "傲慢",
            position: "-552px 0;",
            index: "23"
        }, {
            name: "饥饿",
            position: "-576px 0;",
            index: "24"
        }, {
            name: "困",
            position: "-600px 0;",
            index: "25"
        }, {
            name: "惊恐",
            position: "-624px 0;",
            index: "26"
        }, {
            name: "流汗",
            position: "-648px 0;",
            index: "27"
        }, {
            name: "憨笑",
            position: "-672px 0;",
            index: "28"
        }, {
            name: "大兵",
            position: "-696px 0;",
            index: "29"
        }, {
            name: "奋斗",
            position: "-720px 0;",
            index: "30"
        }, {
            name: "咒骂",
            position: "-744px 0;",
            index: "31"
        }, {
            name: "疑问",
            position: "-768px 0;",
            index: "32"
        }, {
            name: "嘘",
            position: "-792px 0;",
            index: "33"
        }, {
            name: "晕",
            position: "-816px 0;",
            index: "34"
        }, {
            name: "折磨",
            position: "-840px 0;",
            index: "35"
        }, {
            name: "衰",
            position: "-864px 0;",
            index: "36"
        }, {
            name: "骷髅",
            position: "-888px 0;",
            index: "37"
        }, {
            name: "敲打",
            position: "-912px 0;",
            index: "38"
        }, {
            name: "再见",
            position: "-936px 0;",
            index: "39"
        }, {
            name: "擦汗",
            position: "-960px 0;",
            index: "40"
        }, {
            name: "抠鼻",
            position: "-984px 0;",
            index: "41"
        }, {
            name: "鼓掌",
            position: "-1008px 0;",
            index: "42"
        }, {
            name: "糗大了",
            position: "-1032px 0;",
            index: "43"
        }, {
            name: "坏笑",
            position: "-1056px 0;",
            index: "44"
        }, {
            name: "左哼哼",
            position: "-1080px 0;",
            index: "45"
        }, {
            name: "右哼哼",
            position: "-1104px 0;",
            index: "46"
        }, {
            name: "哈欠",
            position: "-1128px 0;",
            index: "47"
        }, {
            name: "鄙视",
            position: "-1152px 0;",
            index: "48"
        }, {
            name: "委屈",
            position: "-1176px 0;",
            index: "49"
        }, {
            name: "快哭了",
            position: "-1200px 0;",
            index: "50"
        }, {
            name: "阴险",
            position: "-1224px 0;",
            index: "51"
        }, {
            name: "亲亲",
            position: "-1248px 0;",
            index: "52"
        }, {
            name: "吓",
            position: "-1272px 0;",
            index: "53"
        }, {
            name: "可怜",
            position: "-1296px 0;",
            index: "54"
        }, {
            name: "菜刀",
            position: "-1320px 0;",
            index: "55"
        }, {
            name: "西瓜",
            position: "-1344px 0;",
            index: "56"
        }, {
            name: "啤酒",
            position: "-1368px 0;",
            index: "57"
        }, {
            name: "篮球",
            position: "-1392px 0;",
            index: "58"
        }, {
            name: "乒乓",
            position: "-1416px 0;",
            index: "59"
        }, {
            name: "咖啡",
            position: "-1440px 0;",
            index: "60"
        }, {
            name: "饭",
            position: "-1464px 0;",
            index: "61"
        }, {
            name: "猪头",
            position: "-1488px 0;",
            index: "62"
        }, {
            name: "玫瑰",
            position: "-1512px 0;",
            index: "63"
        }, {
            name: "凋谢",
            position: "-1536px 0;",
            index: "64"
        }, {
            name: "示爱",
            position: "-1560px 0;",
            index: "65"
        }, {
            name: "爱心",
            position: "-1584px 0;",
            index: "66"
        }, {
            name: "心碎",
            position: "-1608px 0;",
            index: "67"
        }, {
            name: "蛋糕",
            position: "-1632px 0;",
            index: "68"
        }, {
            name: "闪电",
            position: "-1656px 0;",
            index: "69"
        }, {
            name: "炸弹",
            position: "-1680px 0;",
            index: "70"
        }, {
            name: "刀",
            position: "-1704px 0;",
            index: "71"
        }, {
            name: "足球",
            position: "-1728px 0;",
            index: "72"
        }, {
            name: "瓢虫",
            position: "-1752px 0;",
            index: "73"
        }, {
            name: "便便",
            position: "-1776px 0;",
            index: "74"
        }, {
            name: "月亮",
            position: "-1800px 0;",
            index: "75"
        }, {
            name: "太阳",
            position: "-1824px 0;",
            index: "76"
        }, {
            name: "礼物",
            position: "-1848px 0;",
            index: "77"
        }, {
            name: "拥抱",
            position: "-1872px 0;",
            index: "78"
        }, {
            name: "强",
            position: "-1896px 0;",
            index: "79"
        }, {
            name: "弱",
            position: "-1920px 0;",
            index: "80"
        }, {
            name: "握手",
            position: "-1944px 0;",
            index: "81"
        }, {
            name: "胜利",
            position: "-1968px 0;",
            index: "82"
        }, {
            name: "抱拳",
            position: "-1992px 0;",
            index: "83"
        }, {
            name: "勾引",
            position: "-2016px 0;",
            index: "84"
        }, {
            name: "拳头",
            position: "-2040px 0;",
            index: "85"
        }, {
            name: "差劲",
            position: "-2064px 0;",
            index: "86"
        }, {
            name: "爱你",
            position: "-2088px 0;",
            index: "87"
        }, {
            name: "NO",
            position: "-2112px 0;",
            index: "88"
        }, {
            name: "OK",
            position: "-2136px 0;",
            index: "89"
        }, {
            name: "爱情",
            position: "-2160px 0;",
            index: "90"
        }, {
            name: "飞吻",
            position: "-2184px 0;",
            index: "91"
        }, {
            name: "跳跳",
            position: "-2208px 0;",
            index: "92"
        }, {
            name: "发抖",
            position: "-2232px 0;",
            index: "93"
        }, {
            name: "怄火",
            position: "-2256px 0;",
            index: "94"
        }, {
            name: "转圈",
            position: "-2280px 0;",
            index: "95"
        }, {
            name: "磕头",
            position: "-2304px 0;",
            index: "96"
        }, {
            name: "回头",
            position: "-2328px 0;",
            index: "97"
        }, {
            name: "跳绳",
            position: "-2352px 0;",
            index: "98"
        }, {
            name: "挥手",
            position: "-2376px 0;",
            index: "99"
        }, {
            name: "激动",
            position: "-2400px 0;",
            index: "100"
        }, {
            name: "街舞",
            position: "-2424px 0;",
            index: "101"
        }, {
            name: "献吻",
            position: "-2448px 0;",
            index: "102"
        }, {
            name: "左太极",
            position: "-2472px 0;",
            index: "103"
        }, {
            name: "右太极",
            position: "-2496px 0;",
            index: "104"
        }],
        o = function() {
            for (var t, e = r.length, n = {}; e;) e -= 1, t = r[e], n[t.name] = t.index;
            return n
        }(),
        s = "http://qzonestyle.gtimg.cn/qcloud/app/resource/images/emotions/{index}.gif?max_age=2592000",
        c = '<li isEmtTag=1 class="item"><i isEmtTag=1 data-title="{name}" style="background-position:{position}"></i></li>',
        l = '<img src="{address}"/>',
        d = {
            img: /<img [\s\S]*?src="http:\/\/qzonestyle.gtimg.cn\/qcloud\/app\/resource\/images\/emotions\/\d{1,3}.gif\?max_age=2592000"[\s\S]*?>/gi,
            imgSrc: /http:\/\/qzonestyle.gtimg.cn\/qcloud\/app\/resource\/images\/emotions\/\d{1,3}.gif\?max_age=2592000/i,
            src: /(\d{1,3})/,
            names: function() {
                for (var t, e = r.length, n = [], i = []; e;) e -= 1, t = r[e], n.push("(\\[" + t.name + "\\])"), i.push("(/" + t.name + ")");
                return {
                    oldReg: new RegExp(n.join("|"), "g"),
                    newReg: new RegExp(i.join("|"), "g")
                }
            }()
        },
        u = function() {
            for (var t, e = [], n = 0; t = r[n++];) e.push(c.replace("{name}", t.name).replace("{position}", t.position));
            return e.join("")
        }(),
        p = function(t) {
            var e = this;
            e.cb = t.onSelected || a.noop, a(t.renderTo).html(u).on("click", "i", function(t) {
                t.stopPropagation();
                var n = s.replace("{index}", o[a(this).attr("data-title")]);
                e.cb.call(null, l.replace("{address}", n))
            })
        },
        h = {
            toWechatString: function(t) {
                return t.replace(d.img, function(t) {
                    return "/" + r[t.match(d.src)[0]].name
                })
            },
            toWechatHtml: function(t) {
                return t = t.replace(d.names.oldReg, function(t) {
                    return t = t || "", t = t.substr(1, t.length - 2), t ? "/" + t : t
                }), t.replace(d.names.newReg, function(t) {
                    return i((t || "").substr(1))
                })
            },
            getInstance: function(t) {
                return new p(t)
            },
            getEmotion: function(t) {
                if ("IMG" === t.nodeName.toUpperCase() && d.imgSrc.test(t.src)) {
                    var e = new Image;
                    return e.src = t.src, e
                }
                return !1
            }
        };
    n.exports = h
}), define("widget/simple_editor/simple_editor", function(t, e, n) {
    var i = t("$"),
        a = t("util"),
        r = t("widget/simple_editor/editor"),
        o = t("widget/simple_editor/emotion"),
        s = t("wxManager"),
        c = t("widget/validator/validator"),
        l = t("widget/formchange/formchange"),
        d = (t("dialog"), {
            main: '    <style>.error .mod-rich-editor{border:1px solid #FF3F00;}</style>    <div class="message-content clearfix">        <div class="mod-msg">            <div class="mod-msg-txt">                <div class="user" data-id="logo"></div>                <div class="content">                    <span class="arrow"></span>                    <div class="msg" data-id="show-text"></div>                </div>            </div>        </div>        <div class="mod-msg-editor">            <div data-id="emotion_panel" isEmtTag=1 class="wechat-emotion"></div>            <div data-id="text-tip" style="display:none;position: absolute;top: 85px;left: 30px;width: 161px;height: 22px;color: #ABABAB;z-index:1"></div>            <div class="mod-msg-arrow" style="top: 50px;"></div>            <h2 style="display: inline;">回复内容</h2><span data-id="limit-place" style="float:right;"></span>            <form class="ui-form">                <div class="ui-form-group" style="margin-bottom:0px;">                    <div class="ui-form-ctrls">                        <div class="mod-rich-editor">                            <div class="toolbar"><a href="javascript:;" class="btn-emotions" data-id="emotion_btn" isEmtTag=1></a></div>                            <div class="content" contenteditable="true" data-id="edit_area"></div>                        </div>                    </div>                </div>            </form>        </div>    </div>',
            head: '<% if(data.wechatavatar) { %><span class="mod-default-avatar"><img style="width:45px;height:45px" src="<%=data.wechatavatar%>"></span><% } else { %>        <span class="mod-default-avatar"></span><% } %>'
        }),
        u = 600,
        p = i("body"),
        h = function(t) {
            return t = t || "", t = t.replace(/<(script|iframe|head|style)[^>]*>[\s\S]*?<\/(script|iframe|head|style)>/gi, ""), t = t.replace(/(<\w+)([^>]*>)/gi, function(t, e, n) {
                return n = n.replace(/(\W)(on\w+\s*=)/gi, "$1_$2").replace(/javascript\:/gi, "#"), n = n.replace(/(\W)((?:position|float)\s*\:)/gi, "$1_$2"), /img/i.test(e) && (n = n.replace(/(height)\s*([:=])/gi, "_$1$2")), e + n
            })
        },
        f = function(t) {
            return t
        },
        g = function(t) {
            var e = this;
            e.opt = i.extend({
                renderTo: null
            }, t);
            var n = i(e.opt.renderTo).html(a.tmpl(d.main));
            e.$editArea = n.find('[data-id="edit_area"]'), e.$emotionPanel = n.find('[data-id="emotion_panel"]'), e.$textTip = n.find('[data-id="text-tip"]'), e.$showPlace = n.find('[ data-id="show-text"]'), e.$limit = n.find('[data-id="limit-place"]'), e.$logo = n.find('[data-id="logo"]').text("限" + u + "个字"), e._editor = new r({
                editArea: e.$editArea.get(0),
                changeCb: function() {
                    e.dataChangeCb()
                }
            }), e._emotion = o.getInstance({
                renderTo: e.$emotionPanel.get(0),
                onSelected: function(t) {
                    l.set(1), e._editor.insertNode(t), e.dataChangeCb()
                }
            }), n.find('[data-id="emotion_btn"]').on("click", function() {
                e.$emotionPanel.show(), p.on("click.simple_editor_emotion", function(t) {
                    var n = i(t.target).attr("isEmtTag");
                    n || (e.$emotionPanel.hide(), p.off("click.simple_editor_emotion"))
                })
            }), e.showWxInfo(), e.onBlurEditArea(), e.$textTip.on("click", i.proxy(e.onFocusEditArea, {
                ctx: e,
                focus: !0
            })), e.$editArea.on({
                focus: i.proxy(e.onFocusEditArea, {
                    ctx: e
                }),
                blur: i.proxy(e.onBlurEditArea, e)
            })
        };
    i.extend(g.prototype, {
        onFocusEditArea: function() {
            var t = this.ctx;
            t.$textTip.hide(), this.focus && t._editor.focusDiv()
        },
        onBlurEditArea: function() {
            var t = this;
            0 === t._editor.getLength() && (t.$textTip.text("请输入回复文字内容").show(), t.$showPlace.text("回复内容").addClass("empty"))
        },
        showWxInfo: function() {
            var t = this;
            s.getBindInfo(function(e) {
                t.$logo.html(a.tmpl(d.head, {
                    data: e
                }))
            }, null)
        },
        dataChangeCb: function(t) {
            var e = this,
                n = e._editor.getLength(),
                i = u - n,
                a = "";
            a = i >= 0 ? i === u ? "仅限" + u + "个字" : "还可以输入" + i + "字" : '已超出<span style="color:#B11516">' + Math.abs(i) + "</span>字", e.$limit.html(a), e.$showPlace.html(e.$editArea.html() || "回复内容").toggleClass("empty", !n), t && (n > 0 ? e.onFocusEditArea.call({
                ctx: e
            }) : e.onBlurEditArea())
        }
    }), i.extend(g.prototype, {
        getText: function() {
            return f(h(this._editor.getServerString()))
        },
        setText: function(t) {
            var e = this;
            e._editor.setServerString(o.toWechatHtml(t)), e.dataChangeCb(!0)
        },
        save: function(t) {
            var e = this,
                n = function(t) {
                    var n = {
                        tip: t,
                        focusObj: e.$editArea,
                        evtTriggerObj: e.$editArea
                    };
                    return c.showErr(i(".mod-rich-editor"), n)
                };
            if (e._editor.getLength() > u) return n("字数超过" + u + "限制,请重新编辑");
            var a = e.getText();
            if (!i.trim(a)) return n("请输入文字");
            var r = t.btn,
                o = i(r);
            if (r) {
                if (o.hasClass("disabled")) return;
                o.addClass("disabled")
            }
            var d = function() {
                r && o.removeClass("disabled")
            };
            s.updateMsg({
                msgid: t.msgid,
                msgtype: "1",
                content: a
            }, function(e) {
                l.set(0), d();
                var n = e.msgid ? e.msgid : "",
                    i = t.callback;
                i && i(n)
            }, function() {
                d()
            })
        }
    }), n.exports = g
}), define("widget/simulator/simulator", function(t, e, n) {
    var i = t("$"),
        a = t("event"),
        r = {},
        o = {};
    r.main = '<div class="mod_preview"><div class="mod_preview_container"></div></div>', o.View = function(t) {
        t = t || {}, this.model = t.model || "main", this.url = t.url, this.data = t.data, this.clickInterface = {}, this.container = t.container || document.createElement("div"), this.simulator = document.createElement("div"), this.webview = null, a.bindCommonEvent(this.container, "click", this.clickInterface), this.paintModel(this.model)
    }, o.View.prototype.paintModel = function() {
        this.simulator.innerHTML = r[this.model];
        var t = i(this.simulator);
        "main" == this.model ? this.webview = t.find(".mod_preview_container")[0] : "empty" == this.model && (this.webview = t[0]), this.url ? this.loadUrl(this.url) : this.data && this.loadData(this.data), this.container.appendChild(this.simulator)
    }, o.View.prototype.loadUrl = function(t) {
        this.url = t, this.webview.innerHTML = '<iframe width="100%" height="100%" src="' + t + '"></iframe>'
    }, o.View.prototype.loadData = function(t) {
        this.data = t, this.webview.innerHTML = t
    }, o.View.prototype.addInterface = function(t) {
        var e = {};
        arguments.length > 1 ? e[arguments[0]] = arguments[1] : "[object Object]" == Object.prototype.toString.call(t) && (e = t);
        for (var n in e) this.clickInterface[n] = e[n]
    }, n.exports = o
}), define("widget/upfile/upfile", function(require, exports, module) {
    function uploadFileForm(t) {
        function e() {
            function e() {
                a.detachEvent ? a.detachEvent("onload", e) : a.removeEventListener("load", e, !1), i.remove()
            }
            var n = "formIfr" + (new Date).getTime(),
                i = $('<iframe id="' + n + '" name="' + n + '" />'),
                a = i[0];
            /msie [\w.]+/.test(navigator.userAgent.toLowerCase()) && (a.src = 'javascript:false;document.write("");'), i.css({
                position: "absolute",
                top: "-1000px",
                left: "-1000px"
            }), setTimeout(function() {
                c.attr("target", n), i.appendTo("body"), a.callback = function(e) {
                    e && 0 == e.code ? t.onLoad(e.data) : t.onError(e.data)
                }, a.attachEvent ? a.attachEvent("onload", e) : a.addEventListener("load", e, !1), c.submit(), t.loading && t.loading()
            }, 10)
        }
        var n = net._addParam(t.post_url, {
                uin: util.getUin(),
                csrfCode: util.getACSRFToken(),
                action: "uploadFiles",
                format: "iframe",
                t: (new Date).getTime()
            }),
            i = {
                cursor: "pointer",
                height: "32px",
                width: "82px",
                opacity: "0",
                overflow: "hidden",
                position: "absolute",
                left: "0",
                top: "-1px"
            },
            a = {
                cursor: "pointer",
                "font-size": "30px",
                top: "0",
                right: "0",
                position: "absolute"
            },
            r = document.documentMode;
        /msie [\w.]+/.test(navigator.userAgent.toLowerCase()) && (!r || 8 >= r) && (i.filter = "alpha(opacity=0)", a.filter = "alpha(opacity=0)");
        var o = ['<form class="uploadForm" action="' + n + '" enctype="multipart/form-data" cmd="frm" method="post">', '<input class="uploadFile" type="file" cmd="file" name="upfile" />', '<input type="hidden" name="dirname" value="pic" />', t.size ? '<input type="hidden" name="picsize" value="' + t.size + '" />' : "", '<input type="hidden" name="filenames" value="pic" /></form>'].join(""),
            s = $(t.button);
        s.append(o).css("position", "relative");
        var c = s.find("form"),
            l = s.find('input[type="file"]');
        c.css(i), s.is(":visible") && c.css({
            width: s.outerWidth(),
            height: s.outerHeight()
        }), l.css(a), l.change(function() {
            var n = this.value.split(/\\|\//).pop(),
                i = new RegExp("\\.(" + t.fileFilter + ")$", "i");
            if (!i.test(n)) return t.formatSizeError ? t.formatSizeError(1) : dialog.miniTip("文件格式错误"), !1;
            if (window.File && window.FileList) {
                var a = this.files[0].size / 1024;
                if (a > 2048) return t.formatSizeError ? t.formatSizeError(2) : dialog.miniTip("文件大小超出2M限制"), !1
            }
            s.find('input[name="filenames"]').val((new Date).getTime() + "_" + n), e()
        })
    }

    function adjustDialog() {
        var t = $("#" + prefix + "_wrap"),
            e = t.parent(),
            n = parseInt(e.css("paddingLeft")),
            i = parseInt(e.css("paddingRight")),
            a = parseInt(e.css("paddingTop")),
            r = parseInt(e.css("paddingBottom")),
            o = {
                width: dialogwidth - n - i,
                height: dialogheight - r - a - dialog.getTitleHeight() - dialog.getBottomHeight()
            };
        return t.css(o), o
    }

    function injectCssClass() {
        var t = ".upfile_wrap .btn_wrap {    float: left;    line-height: normal;}.upfile_file_el {    display: none;}.upfile_wrap .up_progress {    float: left;    font-size: 14px;    line-height: normal;    width: 300px;}.upfile_wrap .progress_width {    background-color: #0065B0;    display: block;    float: left;    height: 5px;    margin-top: 7px;    overflow: hidden;}.upfile_wrap .progressnum {    padding: 0 10px;}.imgclip_con {    height: 495px;    margin: 0 auto;    width: 680px;}.imgclip_con .pic_main {    float: left;    height: 100%;    overflow: hidden;    position: relative;    width: 100%;}.pic_main .pic_mask {    background: none repeat scroll 0 0 #000000;    height: 100%;    left: 0;    opacity: 0.5;    pointer-events: none;    position: absolute;    top: 0;    width: 100%;}.pic_main img {    left: 0;    position: absolute;    top: 0;}.imgclip_con .clip_prev {    border-left: 2px solid #CCCCCC;    display: none;    height: 100%;    padding: 0 10px;}.imgclip_btn {    clear: both;    margin: 5px;    text-align: right;}.imgclip_con .clipbox {    border: 1px dashed #fff;    height: 0;    position: absolute;    border-image:url(data:image/gif;base64,R0lGODlhCAAIAJEAAP////8A/wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgABACwAAAAACAAIAAACDwwuGckJzR4UaEp423InFAAh+QQFCgABACwAAAAACAAIAAACD4wEGcuMvR6cC4hpaU0nFAAh+QQJCgABACwAAAAACAAIAAACEAwiYhvd56KKaErqYDwnrQIAOw==) 1 repeat;    width: 0;}.upfile_handle {    background: none repeat scroll 0 0 #008FFF;    border: 0 solid #007D65;    height: 6px;    overflow: hidden;    position: absolute;    width: 6px;}.upfile_handle_n {    cursor: n-resize;    left: 50%;    margin-left: -3px;    top: -3px;}.upfile_handle_s {    bottom: -3px;    cursor: s-resize;    left: 50%;    margin-left: -3px;}.upfile_handle_w {    cursor: w-resize;    left: -3px;    margin-top: -3px;    top: 50%;}.upfile_handle_e {    cursor: e-resize;    margin-top: -3px;    right: -3px;    top: 50%;}.upfile_handle_wn {    cursor: nw-resize;    left: -3px;    top: -3px;}.upfile_handle_en {    cursor: ne-resize;    right: -3px;    top: -3px;}.upfile_handle_ws {    bottom: -3px;    cursor: sw-resize;    left: -3px;}.upfile_handle_es {    bottom: -3px;    cursor: se-resize;    right: -3px;}";
        util.insertStyle(t, "upfileStyle")
    }

    function initClipRect(t, e) {
        function n() {
            o.css("background", "url(" + t.src + ") " + (-1 + -1 * o[0].offsetLeft + parseInt($(t).css("marginLeft"))) + "px " + (-1 + -1 * o[0].offsetTop + parseInt($(t).css("marginTop"))) + "px no-repeat"), o.css("backgroundSize", t.width + "px " + t.height + "px")
        }

        function i() {
            function n(e, n) {
                var i = e[0].getContext("2d");
                e.attr("width", o.width() * n).attr("height", o.height() * n), i.clearRect(0, 0, 1e3, 1e3), i.drawImage(t, (o[0].offsetLeft - parseInt($(t).css("marginLeft"))) * l, (o[0].offsetTop - parseInt($(t).css("marginTop"))) * l, o.width() * l, o.height() * l, 0, 0, o.width() * n, o.height() * n)
            }
            if (is_support && (n($("#imgprevcanvas"), l), e.outPics))
                for (var i = 0; e.outPics.length && i < e.outPics.length; i++) n($("#imgprevcanvas" + i), l * e.outPics[i])
        }

        function a() {
            o.append(['<div cmd="move" style="width:100%;height:100%;cursor:move ;"></div>'].concat(e.lockScale === !1 ? ['<div class="upfile_handle upfile_handle_n"></div>', '<div class="upfile_handle upfile_handle_s"></div>', '<div class="upfile_handle upfile_handle_w"></div>', '<div class="upfile_handle upfile_handle_e"></div>'] : []).concat(['<div class="upfile_handle upfile_handle_wn"></div>', '<div class="upfile_handle upfile_handle_en"></div>', '<div class="upfile_handle upfile_handle_ws"></div>', '<div class="upfile_handle upfile_handle_es"></div>']).join(""))
        }

        function r() {
            o.mousedown(function(a) {
                var r = $(a.target),
                    s = a.pageX,
                    c = a.pageY,
                    d = o[0].offsetLeft,
                    u = o[0].offsetTop,
                    p = o.width(),
                    h = o.height();
                return $(document).mousemove(function(i) {
                    var a = i.pageX,
                        f = i.pageY;
                    if ("move" == r.attr("cmd")) {
                        var g = Math.min(Math.max(parseInt($(t).css("marginLeft")), d + a - s), t.width - p + parseInt($(t).css("marginLeft"))) + "px",
                            m = Math.min(Math.max(parseInt($(t).css("marginTop")), u + f - c), t.height - h + parseInt($(t).css("marginTop"))) + "px";
                        o.css({
                            left: g,
                            top: m
                        })
                    } else {
                        var v, _, b, y, x = parseInt($(t).css("marginLeft")),
                            w = parseInt($(t).css("marginTop"));
                        switch (r.attr("class").split("_")[3]) {
                            case "n":
                                _ = h + c - f, y = u + f - c;
                                break;
                            case "s":
                                _ = h + f - c;
                                break;
                            case "w":
                                v = p + s - a, b = d + a - s;
                                break;
                            case "e":
                                v = p + a - s;
                                break;
                            case "wn":
                                v = p + s - a, _ = h + c - f, y = u + f - c, b = d + a - s;
                                break;
                            case "en":
                                v = p + a - s, _ = h + c - f, y = u + f - c;
                                break;
                            case "ws":
                                v = p + s - a, _ = h + f - c, b = d + a - s;
                                break;
                            case "es":
                                v = p + a - s, _ = h + f - c
                        }
                        var k = {};
                        b != x && v && v > 1 / l * e.destImgSize[0][0] && v < 1 / l * e.destImgSize[1][0] && (k.width = v), y != w && _ && _ > 1 / l * e.destImgSize[0][1] && _ < 1 / l * e.destImgSize[1][1] && (k.height = _), e.lockScale && (k.width && (k.height = p / h * k.width), k.height && (k.width = h / p * k.height)), k.width && k.width - p != 0 && b && (k.left = Math.max(b, x) + "px"), k.height && k.height - h != 0 && y && (k.top = Math.max(y, w) + "px"), o.css(k)
                    }
                    return n(), !1
                }).mouseup(function() {
                    return $(document).unbind("mouseup"), $(document).unbind("mousemove"), i(), !1
                }), !1
            })
        }
        var o = $("#imgClipBox"),
            s = (t.width, t.height, $(t).parent().width()),
            c = $(t).parent().height(),
            l = $(t).attr("ow") / t.width;
        o.css({
            width: Math.min(t.width, e.destImgSize[0][0] / l) + "px",
            height: Math.min(t.height, e.destImgSize[0][1] / l) + "px"
        }), o.css({
            left: (s - o.width()) / 2 + "px",
            top: (c - o.height()) / 2 + "px"
        }), a(), r(), n(), i()
    }

    function canvas2Base64(t, e) {
        var n = t.toDataURL(e);
        return n
    }

    function canvas2Blob(t, e) {
        for (var n = t.toDataURL(e), i = n.replace(/^[\s\S]*,/, ""), a = atob(i), r = new ArrayBuffer(a.length), o = new Uint8Array(r), s = 0; s < a.length; s++) o[s] = a.charCodeAt(s);
        var c = new Blob([r], {
            type: e
        });
        return c
    }

    function addEvent(t) {
        uploadFileForm(t)
    }

    function classHolder(t) {
        this.opt = t
    }

    function init(t) {
        if (t.button) {
            prefix = "pre" + Math.round(1 * new Date * Math.random());
            var e = new classHolder(t);
            return e.injectCssClass(e.opt), e.container = $(e.opt.button), e.addEvent(e.opt), e
        }
    }

    function newDefOpt() {
        var t = function() {};
        return t.prototype = defOpt, new t
    }

    function makeOpt(t) {
        var e = newDefOpt();
        for (var n in e) t[n] = "undefined" == typeof t[n] ? "undefined" != typeof e[n] ? e[n] : t[n] : t[n];
        return is_support || (t.isEdit = 0), t
    }
    var $ = require("$"),
        util = require("util"),
        dialog = require("dialog"),
        net = require("net"),
        prefix = "pre" + 1 * new Date,
        container, clipBlob, clipBase64, defOpt = {
            needButton: 1,
            post_url: "/cgi/cos",
            autoUpload: !0,
            buttonText: "选择文件",
            isMultiple: 0,
            outPics: !1,
            showProgress: 1,
            canEdit: 0,
            lockScale: !1,
            dragdrop: 0,
            size: "",
            destImgSize: [
                [200, 100],
                [500, 300]
            ],
            progressBarColor: "#0065B0",
            fileFilter: "jpg|jpeg|png|bmp",
            loading: null,
            formatSizeError: null,
            getUploadURL: function() {},
            onRender: function() {},
            onFileExtNameError: function() {},
            onFileSelected: function() {},
            onProgress: function() {},
            onClip: function() {},
            onLoad: function() {},
            onError: function() {},
            onBeforePost: function() {},
            setPostURL: function(t) {
                posturl = t
            }
        },
        is_support = !0;
    ("undefined" == typeof FileReader || !1 in new FileReader) && (is_support = !1);
    var dialogwidth = 680,
        dialogheight = 610;
    classHolder.prototype.injectCssClass = injectCssClass, classHolder.prototype.addEvent = addEvent, classHolder.prototype.upload = function(posturl, callback, data) {
        function onSucess(evt) {
            var ret = eval("(" + evt.target.responseText + ")");
            o.uploadUrl = posturl, (callback || function() {})(ret)
        }

        function onProgress(e) {
            var n = e.loaded / e.total;
            t.container.find(".progress_width").width(200 * n), t.container.find(".progressnum").html(100 * new Number(n).toFixed(3) + "%" + (1 == n ? "" : ""))
        }

        function onError() {}
        var t = this,
            o = makeOpt("function" == typeof callback ? {
                onSuccess: callback
            } : callback || {}),
            xhr = new XMLHttpRequest;
        xhr.addEventListener("load", onSucess), xhr.addEventListener("error", onError), xhr.upload.addEventListener("progress", onProgress), xhr.open("POST", posturl), xhr.send(data || clipBlob)
    }, classHolder.prototype.formUpload = function(t) {
        uploadFileForm(t)
    };
    var tmpo;
    module.exports = {
        init: function(t) {
            new init(makeOpt(t))
        }
    }
}), define("widget/validator/validator", function(t, e, n) {
    var i = t("$"),
        a = {
            showErr: function(t, e) {
                return t = i(t), e = i.extend({
                    needFocus: 1
                }, e), t.each(function() {
                    var t = i(this),
                        n = t.parent(),
                        a = e.tipEl;
                    a || (a = n.find(".ui-help-inline"), a.length || (a = n.find(".ui-help-block"))), a = i(a);
                    var r = a.length,
                        o = "";
                    r && (o = void 0 != n.data("origTip") ? n.data("origTip") : a.html(), n.data("tipEl", a), n.data("origTip", o)), n.addClass("error"), r && e.tip && a.html(e.tip);
                    var s = e.focusObj || t;
                    s = i(s);
                    var c = e.evtTriggerObj || t;
                    c = i(c);
                    var l = e.evtType || "default";
                    if (e.needFocus && s.focus(), "default" == l) {
                        var d = function() {
                                c.off("keydown", u).off("oninput", u)
                            },
                            u = function() {
                                d(), n.removeClass("error"), r && a.html(o)
                            };
                        d(), c.on("keydown", u), c.on("oninput", u)
                    } else {
                        var p = function() {
                                c.off(l, h)
                            },
                            h = function() {
                                p(), n.removeClass("error"), r && a.html(o)
                            };
                        p(), c.on(l, h)
                    }
                    e.callback && e.callback()
                }), !1
            },
            hideAllErr: function(t) {
                i(t).find(".error").each(function() {
                    var t = i(this);
                    t.removeClass("error");
                    var e = t.data("tipEl");
                    e && e.html(t.data("origTip"))
                })
            }
        };
    n.exports = a
});