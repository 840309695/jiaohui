define("manage/auto_reply/auto_reply", function(e, t, i) {
    var n = e("manage/widget/reply_box/reply_box"),
        a = {
            _tmpl: {
                main: ""
            },
            render: function() {
                n.render(0)
            },
            destroy: function() {}
        };
    i.exports = a
}), define("manage/cms/cms", function(e, t, i) {
    var n, a, r, s = e("$"),
        o = e("util"),
        d = e("event"),
        c = e("wxManager"),
        l = e("manage/keyword_reply/keyword_reply"),
        u = e("widget/login/login"),
        p = e("lib/json"),
        f = e("lib/reporter"),
        m = e("widget/score/score"),
        g = e("dialog"),
        v = 0,
        h = 0,
        b = {
            _tmpl: {
                main: '<div class="layout-sub-title iframe">    <h1>设置“<%=data.name%>”中的内容：</h1>    <ul class="exp">    <li><strong>服务商</strong>：<%=data.providername%></li>    <li><a href="javascript:void(0);" data-event="cms_customer" data-hot="cms.kefu">联系客服<span class="icon-service"></span></a></li>    <% if (data.helpurl) { %>    <li><a href="javascript:void(0);" data-event="cms_help" data-href="<%=data.helpurl%>" data-hot="cms.help">帮助文档<span class="icon-help-circled"></span></a></li>    <% } %>    <li><label>我的评分：</label> <span id="scoreWrapper"></span></li>    </ul></div><% if (data.url) { %>    <div class="layout-iframe-wrap" id="appIFrameWrap"></div>    <% } else {%>    <div style="padding:50px;text-align:center;font-size:16px;color:#999">url错误</div>    <% } %>',
                appFrame: '<iframe src="<%=fullUrl%>" id="appIFrame" class="layout-iframe" frameborder="0"></iframe>',
                loading: '<p id="iframeLoading" style="top:50%; width:100%; margin-top:-20px; color:#999; position:absolute; text-align:center">正在加载<%=name%>, 请稍等...</p>',
                tips: '<p style="padding:50px;text-align:center;font-size:16px;color:#999">套餐<%=status%>, <a href="<%=linkHref%>" data-event="nav"><%=linkTxt%></a></p>'
            },
            render: function(e, t) {
                this.id = e, this.modName = t, this.setIframeUrl(), this.bindEvent()
            },
            setIframeUrl: function(e) {
                window.GetUrlFromPos = function() {};
                var t = this,
                    i = this.id,
                    d = this.modName,
                    l = s("#manageMain");
                c.getServiceInfoById(i, function(u) {
                    t.data = u, t.servicename = u.serviceInfo.servicename, t.apiReportStr = u.packageInfo.providerid + "." + u.packageInfo.packageid + "." + i;
                    var p, f = u.serviceInfo.servicedate;
                    if (p = f ? o.dateDiff(o.getCurrentTime(), f) / 864e5 : -9999, 0 > p) {
                        var m, g, v;
                        return -9999 == p ? (m = "未生效", g = "/personal/order/list", v = "点击查看") : (m = "已过期", g = "/personal/packages/list", v = "点击续费"), l.html(o.tmpl(t._tmpl.tips, {
                            status: m,
                            linkHref: g,
                            linkTxt: v
                        })), !1
                    }
                    c.getOpenInfo({
                        providerId: u.serviceInfo.providerid,
                        productId: o.getProductId()
                    }, function(e) {
                        var i = u.serviceInfo.serviceadmin,
                            p = u.serviceInfo.servicename,
                            f = c.getServiceAdminJSON(i),
                            m = "";
                        if (f && d) {
                            for (var g, v = 0; g = f[v]; v++)
                                if (g.name == d) {
                                    m = g.url, p = p + "-" + d;
                                    break
                                }
                        } else m = i;
                        var h = t.addUrlOpenInfo(m, e.openid, e.openkey);
                        l.html(o.tmpl(t._tmpl.main, {
                            data: {
                                url: h,
                                name: p,
                                providername: u.serviceInfo.providername,
                                helpurl: u.serviceInfo.helpurl || u.packageInfo.helpurl
                            }
                        })), r = s("#scoreWrapper"), h ? (n = s("#appIFrameWrap"), a = s(o.tmpl(t._tmpl.appFrame, {
                            fullUrl: h
                        })), a.bind("load", function() {
                            s("#iframeLoading").remove(), a.unbind("load")
                        }), n.append(a), n.append(o.tmpl(t._tmpl.loading, {
                            name: p
                        })), t.initScore()) : r.hide()
                    }, null, e)
                })
            },
            addUrlOpenInfo: function(e, t, i) {
                if (!/(http|https):\/\//.test(e)) return "";
                var n = /\?/.test(e) ? "&" : "?";
                return e += n + "openId=" + t + "&openKey=" + i
            },
            initScore: function() {
                var e = this;
                c.queryScore({
                    packageId: e.data.packageInfo.packageid
                }, function(t) {
                    var i = new m({
                        score: t,
                        container: r,
                        cb: function() {
                            c.commitScore({
                                packageId: e.data.packageInfo.packageid,
                                score: i.score
                            }, function() {
                                g.success("评分成功")
                            })
                        }
                    })
                })
            },
            bindEvent: function() {
                var e = this;
                v || (navigator.onMessage = function(e) {
                    b.parseMessage(e)
                }, s(window).bind("message", function(e) {
                    var t = e.originalEvent.data;
                    b.parseMessage(t)
                }), v = 1), d.addCommonEvent("click", {
                    cms_customer: function() {
                        var t = e.data.packageInfo.providerqq,
                            i = e.data.packageInfo.contactqq;
                        o.contactCustomer(t, i)
                    },
                    cms_help: function() {
                        window.open(s(this).attr("data-href"))
                    }
                })
            },
            parseMessage: function(e) {
                if (e) {
                    var t = e.split("::"),
                        i = t[0],
                        n = t[1];
                    try {
                        b[i](n)
                    } catch (a) {}
                }
            },
            communicateInner: function(e) {
                if (window.postMessage) try {
                    document.getElementById("appIFrame").contentWindow.postMessage(e, "*")
                } catch (t) {} else navigator.onInnerMessage && navigator.onInnerMessage(e)
            },
            reLogin: function() {
                3 > h ? (this.setIframeUrl(!0), h++) : u.show(), f.click("jsApi.reLogin." + this.apiReportStr)
            },
            setKeywords: function(e) {
                try {
                    e = s.parseJSON(e);
                    var t = this,
                        i = e.cover ? 1 : 2,
                        n = e.cover ? "setKeywords" : "addKeywords";
                    l.dealAppKeywords(i, t.id, t.servicename, e.keywords, function(i) {
                        var a = "[]";
                        i && (a = p.stringify(e.keywords)), t.communicateInner(e.cbName + '::{"code": 0, "keywords":' + a + "}"), f.click("jsApi." + n + "." + t.apiReportStr)
                    })
                } catch (a) {}
            },
            getKeywords: function(e) {
                try {
                    e = s.parseJSON(e);
                    var t = this;
                    l.dealAppKeywords(0, t.id, t.servicename, [], function(i) {
                        var n = "[]";
                        i && (n = p.stringify(i)), t.communicateInner(e.cbName + '::{"code": 0, "keywords":' + n + "}"), f.click("jsApi.getKeywords." + t.apiReportStr)
                    })
                } catch (i) {}
            },
            deleteKeywords: function(e) {
                try {
                    e = s.parseJSON(e);
                    var t = this;
                    l.dealAppKeywords(3, t.id, t.servicename, e.keywords, function(i) {
                        var n = "[]";
                        i && (n = p.stringify(i)), t.communicateInner(e.cbName + '::{"code": 0, "keywords":' + n + "}"), f.click("jsApi.deleteKeywords." + t.apiReportStr)
                    })
                } catch (i) {}
            },
            destroy: function() {
                h = 0, a && a[0] && (a[0] = null, a = null, n = null)
            }
        };
    i.exports = b
}), define("manage/config/dao_config", function(e, t, i) {
    var n = {
            get_msg_list: {
                url: "/wechatmsg?action=getList",
                method: "get"
            },
            update_msg: {
                url: "/wechatmsg?action=setInfo",
                method: "post"
            },
            get_msg_info: {
                url: "/wechatmsg?action=getInfo",
                method: "get"
            },
            batch_get_msg_info: {
                url: "/wechatmsg?action=batchGetInfo",
                method: "get"
            },
            delete_msg: {
                url: "/wechatmsg?action=delete",
                method: "post"
            },
            update_reply: {
                url: "/wechatresponse?action=setInfo",
                method: "post"
            },
            get_reply: {
                url: "/wechatresponse?action=getList",
                method: "get"
            },
            del_reply: {
                url: "/wechatresponse?action=delete",
                method: "post"
            },
            get_usr_package: {
                url: "/package?action=queryPackageForOwnerProduct",
                method: "get"
            },
            get_package_by_id: {
                url: "/package?action=queryPackageByPackageId",
                method: "get"
            },
            get_open_info: {
                url: "/login?action=getOpenLoginInfo",
                method: "get"
            },
            bind_weixin: {
                url: "/wechat?action=bindAccount",
                method: "post"
            },
            unbind_account: {
                url: "/wechat?action=unbindAccount",
                method: "post"
            },
            unbind_weixin: {
                url: "/product?action=unableProduct",
                method: "post"
            },
            get_bind_info: {
                url: "/wechat?action=getProductBindInfo",
                method: "get"
            },
            update_avatar: {
                url: "/wechat?action=updateAvatar",
                method: "get"
            },
            delete_keywords: {
                url: "/keywords?action=deleteUserKeywords",
                method: "post"
            },
            enable_service_keywords: {
                url: "/keywords?action=enableServiceKeywords",
                method: "post"
            },
            query_keywords: {
                url: "/keywords?action=queryKeywords",
                method: "get"
            },
            update_keywords: {
                url: "/keywords?action=updateUserKeywords",
                method: "post"
            },
            get_usr_menu: {
                url: "/usermenu?action=getMenu",
                method: "get"
            },
            set_usr_menu: {
                url: "/usermenu?action=setMenu",
                method: "post"
            },
            clear_usr_menu: {
                url: "/usermenu?action=clearMenu",
                method: "post"
            },
            publish_menu: {
                url: "/wechatmenu?action=create"
            },
            get_user_order_list: {
                url: "/order?action=queryOrder"
            },
            query_product: {
                url: "/product?action=queryProduct",
                method: "get"
            },
            update_product_setting: {
                url: "/product?action=updateProductSettingInfo",
                method: "post"
            },
            get_user_fans_num: {
                url: "/wechat?action=getUserFansNum",
                method: "get"
            },
            get_account_status: {
                url: "/wechat?action=syncUserWechatInfo",
                method: "get"
            },
            repair_account: {
                url: "/wechat?action=repairAccount",
                method: "get"
            },
            delivery_order: {
                url: "/order?action=delivery",
                method: "post"
            },
            get_order: {
                url: "/order?action=queryOrder",
                method: "get"
            },
            get_package_expires: {
                url: "/package?action=queryServiceDateByPackageId",
                method: "get"
            },
            queryRecharge: {
                url: "/recharge?action=queryRecharge",
                method: "get"
            },
            commit_score: {
                url: "/score?action=commitScore",
                method: "post"
            },
            query_score: {
                url: "/score?action=queryScore",
                method: "get"
            }
        },
        a = "/cgi";
    if (a)
        for (var r in n) {
            var s = n[r];
            s && s.url && (s.url = a + s.url)
        }
    var o = {};
    o.get = function(e) {
        return n[e]
    }, i.exports = o
}), define("manage/config/manager", function(e, t, i) {
    var n = e("net"),
        a = e("util"),
        r = e("manage/config/dao_config"),
        s = e("$"),
        o = e("dialog"),
        d = e("login"),
        c = e("lib/json"),
        l = {},
        u = {},
        p = {},
        f = {},
        m = {},
        g = [],
        v = void 0,
        h = {},
        b = {},
        _ = [],
        y = {},
        w = {},
        I = {},
        k = {},
        x = [],
        L = {},
        T = [],
        C = {},
        M = {},
        E = {
            _errorHandler: function(e, t) {
                var i = e.code;
                7 == i || 9 == i || 15 == i || 21 == i ? (d.logout(!0), d.show()) : t !== !1 && o.miniTip(e.msg || "连接服务器异常，请稍后再试")
            },
            _commonCb: function(e, t, i, n) {
                var a = this,
                    r = e.code;
                0 == r ? t && t(e) : (a._errorHandler(e, n), i && i(e))
            },
            _mergeArray: function(e, t) {
                for (var i = 0; i < e.length; i++)
                    for (var n = 0; n < t.length; n++) e[i] && e[i].msgid == t[n].msgid && e.splice(i, 1);
                return e = e.concat(t)
            },
            clearCache: function() {
                l = {}, u = {}, p = {}, f = {}, m = {}, g = [], h = {}, b = {}, _ = [], y = {}, w = {}, k = {}, x = [], L = {}, T = [], C = {}, M = {}
            },
            updateUsrPackage: function() {
                m = {}, g = [], w = {}, v = void 0;
                var e = d.getUin();
                k[e] && k[e].length <= 1 && (k = {}, x = [])
            },
            clearBindInfo: function() {
                b = {}, _ = []
            },
            getMsgList: function(e, t, i) {
                var a = this,
                    s = function(e) {
                        var n = e.code;
                        0 == n ? (l[c] = l[c] ? a._mergeArray(l[c], e.data) : e.data || [], t && t(e.data)) : (a._errorHandler(e), i && i(e))
                    },
                    o = e.offset + e.count,
                    c = d.getUin();
                if (!l[c] || !p[c] || p[c] < o && l[c].length == e.offset) n.send(r.get("get_msg_list"), {
                    data: e,
                    cb: s
                });
                else {
                    var u = l[c].slice(e.offset, o);
                    t && t(u)
                }
                p[c] ? p[c] < o && (p[c] = o) : p[c] = o
            },
            getMsgById: function(e, t, i) {
                var a, s = function(t) {
                        for (var i, n = null, a = 0; i = t[a]; a++)
                            if (i.msgid == e.msgId) {
                                n = i;
                                break
                            }
                        return n
                    },
                    o = d.getUin();
                if (l[o] && (a = s(l[o])) || u[o] && (a = s(u[o]))) t(a);
                else {
                    var c = this;
                    n.send(r.get("get_msg_info"), {
                        data: e,
                        cb: function(e) {
                            var n = e.code;
                            if (0 == n) {
                                var a = "2" == e.data.msgtype ? l : u;
                                if (a[o]) {
                                    var r = [];
                                    r.push(e.data), a[o] = c._mergeArray(a[o], r)
                                } else a[o] = [], a[o].push(e.data);
                                t && t(e.data)
                            } else c._errorHandler(e), i && i(e)
                        }
                    })
                }
            },
            getMsgByIds: function(e, t, i) {
                var a = this,
                    s = d.getUin(),
                    o = function(n) {
                        var r = n.code;
                        if (0 == r) {
                            I[e.msgIds] = n.data;
                            for (var o, d = 0; o = n.data[d]; d++) {
                                var c = "2" == o.msgtype ? l : u;
                                if (c[s]) {
                                    var p = [];
                                    p.push(o), c[s] = a._mergeArray(c[s], p)
                                } else c[s] = [], c[s].push(o)
                            }
                            t && t(n.data)
                        } else a._errorHandler(n), i && i(n)
                    };
                I[e.msgIds] ? t && t(I[e.msgIds]) : n.send(r.get("batch_get_msg_info"), {
                    data: e,
                    global: !1,
                    cb: o
                })
            },
            deleteMsg: function(e, t, i) {
                var a = this,
                    s = function(n) {
                        var r = n.code;
                        if (0 == r) {
                            for (var s, o = d.getUin(), c = 0; s = l[o][c]; c++)
                                if (s.msgid == e.msgId) {
                                    l[o].splice(c, 1);
                                    break
                                }
                            t && t(n)
                        } else a._errorHandler(n), i && i(n)
                    };
                n.send(r.get("delete_msg"), {
                    data: e,
                    cb: s
                })
            },
            updateMsg: function(e, t, i) {
                var a = this,
                    s = function(n) {
                        var r = n.code;
                        if (0 == r) {
                            var s = d.getUin();
                            f[s] = null, I = {};
                            var o = "2" == e.msgtype ? l : u;
                            if (o[s])
                                if (e.msgid) {
                                    for (var c, p = 0; c = o[s][p]; p++)
                                        if (c.msgid == e.msgid) {
                                            o[s].splice(p, 1), o[s].unshift(e);
                                            break
                                        }
                                } else {
                                    var m = e;
                                    m.msgid = n.data.msgid, o[s].unshift(m)
                                }
                            t && t(n.data)
                        } else a._errorHandler(n), i && i(n)
                    };
                n.send(r.get("update_msg"), {
                    data: e,
                    cb: s
                })
            },
            getReply: function(e, t, i) {
                var s = this,
                    o = a.getProductId(),
                    d = function(e) {
                        var n = e.code;
                        0 == n ? (f[o] = e.data, t && t(e.data)) : (s._errorHandler(e), i && i(e))
                    };
                f[o] ? t && t(f[o]) : n.send(r.get("get_reply"), {
                    data: e,
                    cb: d
                })
            },
            updateReply: function(e, t, i) {
                var s = this,
                    o = a.getProductId(),
                    d = function(e) {
                        var n = e.code;
                        0 == n ? (f[o] = null, t && t(e.data)) : (s._errorHandler(e), i && i(e))
                    };
                n.send(r.get("update_reply"), {
                    data: e,
                    cb: d
                })
            },
            delReply: function(e, t, i) {
                var s = this,
                    o = a.getProductId(),
                    d = function(e) {
                        var n = e.code;
                        0 == n ? (f[o] = null, t && t(e.data)) : (s._errorHandler(e), i && i(e))
                    };
                n.send(r.get("del_reply"), {
                    data: e,
                    cb: d
                })
            },
            getUsrPackage: function(e, t) {
                var i = this,
                    s = a.getProductId(),
                    o = function(e) {
                        var n = e.code;
                        if (0 == n) {
                            m[s] = e.data;
                            for (var a = 0; a < g.length; a++) g[a](e.data)
                        } else i._errorHandler(e), t && t(e);
                        g = []
                    };
                m[s] ? e && e(m[s]) : (g.length || n.send(r.get("get_usr_package"), {
                    data: {
                        productId: s
                    },
                    cb: o
                }), g.push(e))
            },
            getServiceAdminJSON: function(e) {
                var t = "object" == typeof e;
                if (t) return e;
                var i = null;
                if (e && 0 == e.indexOf("[") && "[{}]" != e) try {
                    i = s.parseJSON(e)
                } catch (n) {}
                return i
            },
            getServiceListHasPageConfig: function(e) {
                this.getUsrPackage(function(t) {
                    var i = [];
                    if (t && t.length)
                        for (var n, a = 0; n = t[a]; a++)
                            for (var r, o = 0; r = n.services[o]; o++) {
                                var d = 0;
                                try {
                                    if (r.pageconfig) {
                                        "object" != typeof r.pageconfig && (r.pageconfig = s.parseJSON(r.pageconfig));
                                        for (var c in r.pageconfig)
                                            for (var l in r.pageconfig[c])
                                                if (r.pageconfig[c][l]) {
                                                    d = 1;
                                                    break
                                                }
                                    }
                                } catch (u) {}
                                d && i.push(r)
                            }
                    e && e(i)
                })
            },
            getOpenInfo: function(e, t, i, s) {
                var o = this,
                    d = a.getProductId(),
                    c = function(e) {
                        var n = e.code;
                        0 == n ? (h[d] = e.data, t && t(e.data)) : (o._errorHandler(e), i && i(e))
                    };
                !h[d] || s ? n.send(r.get("get_open_info"), {
                    data: e,
                    cb: c
                }) : t && t(h[d])
            },
            getUsrMenuConfig: function(e, t, i, s) {
                var o = this,
                    d = a.getProductId(),
                    c = function(e) {
                        var n = e.code;
                        0 == n ? (s && (y[d] = e.data), t && t(e.data)) : (o._errorHandler(e), i && i(e))
                    };
                s && y[d] ? t && t(y[d]) : n.send(r.get("get_usr_menu"), {
                    data: e,
                    cb: c
                })
            },
            setUserMenuConfig: function(e, t, i, s) {
                var o = this,
                    d = function(e) {
                        var n = e.code,
                            a = e.data && e.data.status;
                        0 == n ? t && t(a, e) : (o._errorHandler(e, s), i && i(a, e))
                    };
                n.send(r.get(e.length ? "set_usr_menu" : "clear_usr_menu"), {
                    data: {
                        productId: a.getProductId(),
                        menu: c.stringify(e)
                    },
                    cb: d
                })
            },
            getServiceInfoById: function(e, t) {
                this.getUsrPackage(function(i) {
                    for (var n, a = 0; n = i[a]; a++)
                        for (var r, s = 0; r = n.services[s]; s++)
                            if (e == r.serviceid) return void t({
                                packageInfo: n,
                                serviceInfo: r
                            })
                })
            },
            bindWeixin: function(e, t, i, a) {
                var s = this,
                    o = function(e) {
                        s._commonCb(e, t, i, a), C = {}
                    };
                n.send(r.get("bind_weixin"), {
                    data: e,
                    cb: o
                })
            },
            unbindWeixin: function(e, t) {
                var i = this,
                    s = function(n) {
                        i._commonCb(n, e, t)
                    };
                n.send(r.get("unbind_weixin"), {
                    data: {
                        productId: a.getProductId()
                    },
                    cb: s
                })
            },
            unbindAccount: function(e, t, i) {
                var a = this,
                    s = function(e) {
                        a._commonCb(e, t, i)
                    };
                n.send(r.get("unbind_account"), {
                    data: {
                        productId: e
                    },
                    cb: s
                })
            },
            updateAvatar: function(e, t) {
                var i = this,
                    s = function(n) {
                        i._commonCb(n, e, t)
                    };
                n.send(r.get("update_avatar"), {
                    data: {
                        productId: a.getProductId()
                    },
                    cb: s
                })
            },
            getBindInfo: function(e, t, i) {
                var s = this,
                    o = a.getProductId(),
                    d = function(e) {
                        var i = e.code;
                        if (0 == i) {
                            var n = e.data;
                            1 != n.bindstatus && 2 != n.bindstatus || n.wechataccount || (n.wechataccount = !0), b[o] = n;
                            for (var a = 0; a < _.length; a++) _[a](n)
                        } else s._errorHandler(e), t && t(e);
                        _ = []
                    };
                !b[o] || i ? (_.length || n.send(r.get("get_bind_info"), {
                    data: {
                        productId: o
                    },
                    cb: d
                }), _.push(e)) : e && e(b[o])
            },
            queryKeywords: function(e, t, i) {
                var s = this,
                    o = a.getProductId(),
                    d = function(i) {
                        var n = i.code;
                        0 == n ? (w[o] = i.data, e && e(i.data)) : (s._errorHandler(i), t && t(i))
                    };
                !w[o] || i ? n.send(r.get("query_keywords"), {
                    data: {
                        productId: o
                    },
                    cb: d
                }) : e && e(w[o])
            },
            updateKeywords: function(e, t, i) {
                var s = this,
                    o = a.getProductId(),
                    d = function(e) {
                        var n = e.code;
                        0 == n ? (w[o] = e.data, t && t(e.data)) : (s._errorHandler(e), i && i(e))
                    };
                n.send(r.get("update_keywords"), {
                    data: e,
                    cb: d
                })
            },
            enableServiceKeywords: function(e, t, i) {
                var s = this,
                    o = a.getProductId(),
                    d = function(e) {
                        var n = e.code;
                        0 == n ? (w[o] = e.data, t && t(e.data)) : (s._errorHandler(e), i && i(e))
                    };
                n.send(r.get("enable_service_keywords"), {
                    data: e,
                    cb: d
                })
            },
            deleteKeywords: function(e, t, i) {
                var s = this,
                    o = a.getProductId(),
                    d = function(e) {
                        var n = e.code;
                        0 == n ? (w[o] = e.data, t && t(e.data)) : (s._errorHandler(e), i && i(e))
                    };
                n.send(r.get("delete_keywords"), {
                    data: e,
                    cb: d
                })
            },
            getUsrOrderList: function(e, t, i) {
                var a = this,
                    s = function(e) {
                        a._commonCb(e, t, i)
                    };
                n.send(r.get("get_user_order_list"), {
                    data: e,
                    cb: s
                })
            },
            getUsrPaidStatus: function(e, t) {
                var i = this,
                    a = function(n) {
                        var a = n.code;
                        0 == a ? (v = n.data.totalnum, e(v)) : (i._errorHandler(n), t && t(n))
                    };
                void 0 === v ? n.send(r.get("get_user_order_list"), {
                    data: {
                        orderType: 0,
                        status: 1,
                        offset: 0,
                        count: 1
                    },
                    cb: a
                }) : e(v)
            },
            queryProduct: function(e, t) {
                var i = this,
                    a = d.getUin(),
                    s = function(e) {
                        var n = e.code;
                        if (0 == n) {
                            var r = e.data.products;
                            k[a] = r;
                            for (var s = 0; s < x.length; s++) x[s](r)
                        } else i._errorHandler(e), t && t(e);
                        x = []
                    };
                k[a] ? e && e(k[a]) : (x.length || n.send(r.get("query_product"), {
                    cb: s
                }), x.push(e))
            },
            queryProductSetting: function(e, t) {
                var i = this,
                    o = a.getProductId(),
                    d = function(e) {
                        var n = e.code;
                        if (0 == n) {
                            var a = e.data.products[0].settinginfo;
                            a && (a = s.parseJSON(a)), L[o] = a || {};
                            for (var r = 0; r < T.length; r++) T[r](L[o])
                        } else i._errorHandler(e), t && t(e);
                        T = []
                    };
                L[o] ? e && e(L[o]) : (T.length || n.send(r.get("query_product"), {
                    data: {
                        productId: o
                    },
                    cb: d
                }), T.push(e))
            },
            setPageFlag: function(t, i, s) {
                var o = this;
                this.getBindInfo(function(d) {
                    d.wechataccount || o.queryProductSetting(function(d) {
                        if (!d || !d[t]) {
                            d[t] = 1;
                            var l = function(t) {
                                o._commonCb(t, i, s), e.async("manage/manage", function(e) {
                                    e.showPageFlag()
                                })
                            };
                            n.send(r.get("update_product_setting"), {
                                data: {
                                    productId: a.getProductId(),
                                    settingInfo: c.stringify(d)
                                },
                                cb: l
                            })
                        }
                    })
                })
            },
            getUserFansNum: function(e, t) {
                var i = this,
                    s = a.getProductId(),
                    o = function(n) {
                        var a = n.code;
                        0 == a ? (C[s] = n.data, e && e(n.data)) : (i._errorHandler(n), t && t(n))
                    };
                !C[s] || C[s].addedFansNum < 0 || C[s].totalFansNum < 0 ? n.send(r.get("get_user_fans_num"), {
                    data: {
                        productId: s
                    },
                    cb: o
                }) : e && e(C[s])
            },
            getQrcodeUrl: function(e) {
                return "boolean" == typeof e ? "" : "/cgi/wechat?action=getQrcode&uin=" + a.getUin() + "&csrfCode=" + a.getACSRFToken() + "&username=" + e
            },
            ifPackageExpired: function(e, t) {
                this.getUsrPackage(function(i) {
                    for (var n, r = !1, s = 0; n = i[s]; s++) {
                        var o = n.services[0].servicedate;
                        try {
                            var d = a.dateDiff(a.getCurrentTime(), o) / 864e5;
                            if (0 > d) {
                                r = 1;
                                break
                            }
                        } catch (c) {}
                    }
                    r ? e && e() : t && t()
                })
            },
            getAccountStatus: function(e, t) {
                var i = this,
                    s = function(n) {
                        i._commonCb(n, e, t)
                    };
                n.send(r.get("get_account_status"), {
                    data: {
                        productId: a.getProductId()
                    },
                    global: !1,
                    cb: s
                })
            },
            repairAccount: function(e, t) {
                var i = this,
                    s = function(n) {
                        i._commonCb(n, e, t)
                    };
                n.send(r.get("repair_account"), {
                    data: {
                        productId: a.getProductId()
                    },
                    cb: s
                })
            },
            deliveryOrder: function(e, t) {
                var i = this,
                    a = s.Deferred();
                return n.send(r.get("delivery_order"), {
                    data: {
                        orderId: e
                    },
                    global: !1,
                    cb: function(n) {
                        0 == n.code ? a.resolve(n) : t-- > 0 ? setTimeout(function() {
                            i.deliveryOrder(e, t).done(function(e) {
                                a.resolve(e)
                            }).fail(function() {
                                a.reject.apply(a, arguments)
                            })
                        }, 1e3) : (i._errorHandler(n, !1), a.reject(n))
                    }
                }), a
            },
            getOrder: function(e) {
                var t = this,
                    i = s.Deferred(),
                    a = {
                        orderId: e || "",
                        count: 1
                    };
                return n.send(r.get("get_order"), {
                    data: a,
                    cb: function(n) {
                        t._commonCb(n, function() {
                            var t = n.data && n.data.orders,
                                a = n.data && n.data.nowTime;
                            i.resolve(e ? t[0] : t || [], a)
                        }, function() {
                            i.reject(n)
                        })
                    }
                }), i
            },
            getPackage: function(e) {
                var t = this,
                    i = s.Deferred();
                return n.send(r.get("get_package_by_id"), {
                    data: {
                        packageId: e
                    },
                    cb: function(e) {
                        t._commonCb(e, function() {
                            var t = e.data,
                                n = t && t[0];
                            n ? i.resolve(n) : i.reject()
                        }, function() {
                            i.reject()
                        })
                    }
                }), i
            },
            getPackageExpires: function(e, t) {
                var i = this,
                    o = s.Deferred(),
                    d = {
                        packageId: e,
                        productId: t || a.getProductId()
                    };
                return n.send(r.get("get_package_expires"), {
                    data: d,
                    cb: function(e) {
                        i._commonCb(e, function() {
                            var t = e.data && e.data[0] && e.data[0].servicedate;
                            o.resolve(t ? new Date(t) : null)
                        }, function() {
                            o.resolve(null)
                        })
                    }
                }), o
            },
            queryRechargeByHandle: function(e) {
                var t = this,
                    i = s.Deferred();
                return n.send(r.get("queryRecharge"), {
                    data: {
                        queryRechargeFlagStr: e,
                        status: 1,
                        offset: 0,
                        count: 0
                    },
                    global: !1,
                    cb: function(e) {
                        t._commonCb(e, function() {
                            var t = e.data && e.data.recharges && e.data.recharges[0];
                            t && 1 == t.status ? i.resolve() : i.reject(e)
                        }, function() {
                            i.reject(e)
                        }, !1)
                    }
                }), i
            },
            commitScore: function(e, t, i) {
                var a = this,
                    s = function(n) {
                        var r = n.code;
                        if (0 == r) {
                            var s = d.getUin();
                            M[s] || (M[s] = {}), M[s][e.packageId] = e.score, t && t(n)
                        } else a._errorHandler(n), i && i(n)
                    };
                n.send(r.get("commit_score"), {
                    data: e,
                    cb: s
                })
            },
            queryScore: function(e, t, i) {
                var a = this,
                    s = d.getUin(),
                    o = function(n) {
                        a._commonCb(n, function(i) {
                            var n = i.data.length ? i.data[0].score : 0;
                            M[s][e.packageId] = n, t && t(n)
                        }, i)
                    };
                M[s] || (M[s] = {}), void 0 != M[s][e.packageId] ? t && t(M[s][e.packageId]) : n.send(r.get("query_score"), {
                    data: e,
                    cb: o
                })
            }
        };
    i.exports = E
}), define("manage/greeting/greeting", function(e, t, i) {
    var n = e("manage/widget/reply_box/reply_box"),
        a = {
            _tmpl: {
                main: ""
            },
            render: function() {
                n.render(7)
            },
            destroy: function() {}
        };
    i.exports = a
}), define("manage/index/index", function(e, t, i) {
    var n, a, r, s, o, d = e("$"),
        c = e("util"),
        l = e("event"),
        u = e("wxManager"),
        p = e("manager"),
        f = (e("dialog"), e("router"), e("manage/manage")),
        m = e("manage/widget/statushelper/StatusHelper"),
        g = e("./index/tpl"),
        v = {
            render: function() {
                d("#manageMain").html(g.main()), n = d("#dashboardBindInfo"), a = d("#dashboardPackageInfo"), r = d("#dashboardLog"), this.paintContent(), this.bindEvt(), setTimeout(function() {
                    d("#sidebarTitle").addClass("active")
                }, 0)
            },
            bindEvt: function() {
                l.addCommonEvent("click", {
                    manage_index_publish: function() {
                        f.publishWeixin()
                    },
                    manage_index_gomp: function() {
                        window.open("https://mp.weixin.qq.com/")
                    }
                })
            },
            paintContent: function() {
                var e = this;
                u.getBindInfo(function(t) {
                    if (t.wechataccount) {
                        if (n.show(), n.html(g.bindInfo(d.extend({
                                qrcodeurl: e.getQrcodeUrl(t.wechataccount)
                            }, t))), 1 == t.bindstatus) return;
                        u.getUserFansNum(function(e) {
                            s = d("#fansRow"), o = s.find(".chart-num"), e.addedFansNum >= 0 && e.totalFansNum >= 0 ? (o.eq(0).text(e.addedFansNum), o.eq(1).text(e.totalFansNum)) : s.html('<td style="color:#999">粉丝数量拉取失败</td>')
                        })
                    } else f.getUnconfigInfo(function(e) {
                        n.show(), n.html(g.bindInfo(d.extend({
                            unConfigPage: e
                        }, t)))
                    });
                    r.show()
                }), u.getUsrPackage(function(e) {
                    a.show();
                    for (var t, i = 0; t = e[i]; i++) t.packageStatus = m.packageStatus(new Date, t.services);
                    if (a.html(g.packageInfo({
                            packages: e
                        })), u.queryProduct(function(e) {
                            e.length > 1 && d("#togglePackageLink").show()
                        }), e.length) {
                        var n = e[0].packageid;
                        p.getActivityByPackageid({
                            productId: c.getProductId(),
                            packageId: n,
                            offset: 0,
                            count: 1
                        }, function(e) {
                            if (e.saleactivitys.length) {
                                var t = e.saleactivitys[0],
                                    i = p.getActivityStatus(t, e);
                                if ("NORMAL" == i.code) {
                                    var r = a.find('[data-field="renewal"]'),
                                        s = a.find('[data-field="price"]');
                                    r.replaceWith(g.favorableRenewal({
                                        packageId: n
                                    })), s.html(p.getPriceUi(t.payprice, t.payunit) + " " + g.favorableIco())
                                }
                            }
                        })
                    }
                    r.show()
                })
            },
            getQrcodeUrl: function(e) {
                return u.getQrcodeUrl(e)
            },
            destroy: function() {}
        };
    i.exports = v
}), define("manage/index/index/tpl", function(e, t, i) {
    i.exports = {
        main: function() {
            var e = [],
                t = function(t) {
                    e.push(t)
                };
            return t('<div class="layout-sub-content" id="dashboardWrapper">\r\n					<div class="dashboard" id="dashboardBindInfo" style="display:none"></div>\r\n					<div class="dashboard-status" id="dashboardPackageInfo" style="display:none"></div>\r\n					<div style="padding-top:15px;display:none" id="dashboardLog">\r\n						<!--<a href="http://bbs.qcloud.com/forum.php?mod=viewthread&tid=620" style="color:#f30" target="_blank">【微信服务市场】更新记录(6月18日) >></a>-->\r\n					</div>\r\n				</div>'), e.join("")
        },
        bindInfo: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                },
                n = e.unConfigPage,
                a = e.wechataccount,
                r = e.qrcodeurl;
            if (i("    "), a || i('	    <a href="http://bbs.qcloud.com/forum.php?mod=viewthread&amp;tid=482&amp;fromuid=4404" target="_blank" style="position: absolute;right: 30px;top: 24px;display:block">\r\n				    	<img src="http://qzonestyle.gtimg.cn/qcloud/app/resource/ac/package/quick_gl_b.jpg">\r\n				    </a>'), i('	<div class="total" '), 1 == e.bindstatus && i(' style="border:none" '), i(">"), a) i('			<!-- 老用户 -->\r\n						<div class="normal">\r\n							<div class="qrcode">'), r && (i('						<img src="'), i(this.__escapeHtml(r)), i('" style="width:128px;height:128px">')), i("				</div>\r\n							<h1>"), i(this.__escapeHtml(e.productname || e.wechatnickname)), i('</h1>\r\n							<p><a data-event="manage_index_gomp" data-hot="glzx.dash.weixingongzhong" href="javascript:void(0);">进入微信公众平台<span class="icon-angle-right"></span></a></p>\r\n						</div>\r\n						<div class="status success">正常运行中</div>');
            else {
                if (i('			<!-- 尚未发布 -->\r\n						<div class="guide">\r\n							<h1>请完成以下设置后再发布公众号</h1>  \r\n							<button class="ui-btn ui-btn-primary ui-btn-wid" data-hot="glzx.dash.fabu" data-event="manage_index_publish">绑定并发布</button>'), n.length) {
                    i('					<div class="guide-list">\r\n									<!--<p>您有以下功能尚未更新内容：</p>-->\r\n									<ul>');
                    for (var s, o = 0; s = n[o]; o++) {
                        i("					        	");
                        for (var d in s) i("					         		<li>"), i(this.__escapeHtml(s[d])), i('<a data-event="nav" class="icon-pencil" href="/manage/'), i(this.__escapeHtml(d)), i('"></a></li>');
                        i("						    ")
                    }
                    i("						</ul>\r\n								</div>")
                }
                i('			</div>\r\n						<!--<div class="status warning">尚未发布</div>-->')
            }
            if (i("	</div>"), 1 !== e.bindstatus) {
                i('		<div class="chart"> ');
                var c = a ? "active" : "",
                    l = a ? "-" : "0";
                i('			<table class="'), i(c), i('">\r\n							<tbody>\r\n								<tr id="fansRow">\r\n								<td>\r\n									<div class="chart-data increase">\r\n										<h2><span class="icon-user"></span>新增粉丝</h2>\r\n										<span class="chart-num">'), i(l), i('</span>\r\n									</div>\r\n								</td>\r\n								<td>\r\n									<div class="chart-data">\r\n										<h2><span class="icon-user"></span>总粉丝</h2>\r\n										<span class="chart-num">'), i(l), i("</span>\r\n									</div>\r\n								</td>\r\n								</tr>\r\n							</tbody>\r\n						</table>\r\n					</div>")
            }
            return i(""), t.join("")
        },
        packageInfo: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                },
                n = e.packages;
            if (n.length) {
                i("	<table>\r\n					<tbody>");
                for (var a, r = 0; a = n[r]; r++) {
                    i("				<tr>\r\n								<td>\r\n									<h2>"), i(this.__escapeHtml(a.packagename)), i("</h2>");
                    var s = a.providername;
                    s || (s = "未知"), i('						<p class="desc">服务商：'), i(s), i("</p>"), 2 == a.status || 5 == a.status ? (i('						    <a class="ui-btn ui-btn-primary ui-btn-wid" data-field="renewal" href="/personal/packages/renewal/'), i(a.packageid), i('" data-hot="glzx.dash.xufei" data-event="nav">续费</a> ')) : i('                            <button disabled="disabled" type="button" title="该套餐已下架，不可续费" class="ui-btn ui-btn-primary ui-btn-wid">续费</button>'), i('                        <a href="/personal/packages/list" data-event="nav" id="togglePackageLink" style="display:none">切换套餐</a>\r\n								</td>\r\n								<td>\r\n									<div class="mid">\r\n										<p><span class="icon-clock"></span>到期时间</p>');
                    var o = a.services[0].servicedate;
                    o || (o = "未生效"), i('							<p class="status-txt">'), i(o), i('</p>\r\n									</div>\r\n								</td>\r\n								<td>\r\n									<div class="mid">\r\n										<p><span class="icon-yen"></span>单价</p>\r\n										<p class="status-txt" data-field="price">'), i(a.price4month / 100), i("元/月</p>\r\n									</div>\r\n								</td>\r\n								<td>");
                    var d, c, l = a.packageStatus.code;
                    "NORMAL" == l ? (d = "icon-circle-empty", c = "success") : "EXPIRED" == l ? (d = "icon-attention-circled", c = "error") : ("UNKNOWN" == l || "WILL_EXPIRED" == l) && (d = "icon-attention-circled", c = "warning"), i('                        <div class="mid '), i(c), i('">\r\n			                            <p><span class="'), i(d), i('"></span>状态</p>\r\n			                            <p class="status-txt"><strong>'), i(a.packageStatus.text), i("</strong></p>\r\n			                        </div>\r\n								</td>\r\n							</tr>")
                }
                i(" \r\n					</tbody>\r\n				</table>")
            } else i('		<div style="font-size:14px; color:#999">您尚未购买套餐，请<a href="/market" data-event="nav"> 点击这里 </a>购买</div>');
            return i(""), t.join("")
        },
        favorableRenewal: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                };
            return i('<a class="ui-btn ui-btn-primary ui-btn-wid" href="/personal/packages/activity/'), i(e.packageId), i('" data-hot="glzx.dash.yhxufei" data-event="nav">续费</a>'), t.join("")
        },
        favorableIco: function() {
            var e = [],
                t = function(t) {
                    e.push(t)
                };
            return t('<span class="icon-sale"></span>'), e.join("")
        },
        __escapeHtml: function() {
            var e = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                t = /[&<>'"\/]/g;
            return function(i) {
                return "string" != typeof i ? i : i ? i.replace(t, function(t) {
                    return e[t] || t
                }) : ""
            }
        }()
    }
}), define("manage/keyword_reply/keyword_reply", function(e, t, i) {
    var n, a = e("$"),
        r = e("util"),
        s = e("event"),
        o = e("wxManager"),
        d = e("dialog"),
        c = (e("router"), e("manage/widget/msg_sum_view/msg_sum_view")),
        l = e("widget/simple_editor/emotion"),
        u = e("widget/validator/validator"),
        p = e("main/pagemanage"),
        f = e("lib/reporter"),
        m = {
            _tmpl: {
                main: '<style>.message-content .mod-msg p {background-color: transparent;border: none;padding: 0;}</style><div class="layout-sub-title">    <h1><%=words.title%></h1>    <p><%=words.tip%></p>    </div><div class="layout-sub-content">    <div class="keywords">        <div class="main">            <div class="sub-title">                <div class="opt"><button class="ui-btn ui-btn-primary" data-event="keyword_reply_add" data-hot="glzx.keyword.buildrule"  type="button"><span class="icon-plus"></span>新建规则</button></div>            </div>            <div id="keywordsContent"></div>        </div>    </div></div>',
                list: '<% for(var i = 0, item; item = keywordRule[i]; i++) { %><% if (!item.kws.length) {continue;} %><div class="keyword-box rule-list" data-id="<%=item.groupid%>" data-mod="<%=item.mode%>" data-modid="<%=item.modeid%>"><div class="keyword-view-wrap"><div class="rule-list-hd"><div class="new-rule">规则: <%-item.groupname%></div><div class="opt"><% if(item.groupid == "0") { %><% if(item.enableservicekws == "0") { %><a href="javascript:;" class="" style="margin-top:5px; display:inline-block" data-event="keyword_reply_service_enable">启用</a><% } else { %><a href="javascript:;" class="" style="margin-top:5px; display:inline-block" data-event="keyword_reply_service_disable">禁用</a><% } %><% } else { %><a href="javascript:;" class="item" data-event="keyword_reply_edit" data-hot="glzx.keyword.editrule" ><i class="icon-pencil"></i>编辑</a><a href="javascript:;" class="item" data-event="keyword_reply_del" data-hot="glzx.keyword.deleterule" ><i class="icon-trash"></i>删除</a><% } %></div></div><div class="rule-list-bd"><form class="ui-form"><div class="ui-form-group"><label class="ui-form-label">关键词：</label><div class="ui-form-ctrls"><div class="keywords-tags"><% for(var j = 0, jItem; jItem = item.kws[j]; j++) { var disabledKey = (!jItem.active && jItem.active != undefined); %><% if (jItem.kw) { %><span class="ui-tag<% if(disabledKey) { %> disabled<% } %>" <% if(disabledKey) { %>title="此关键词被其他规则覆盖"<% } %>><%-jItem.kw%></span> <% } %><% } %></div></div></div><div class="ui-form-group"><label class="ui-form-label">回复内容: </label><div class="ui-form-ctrls keyword-reply-con"></div></div></form></div></div><div class="keyword-edit-wrap"></div></div> <% } %>',
                form: '<div class="rule-list-hd">        <div class="new-rule">        <% if(data.groupname) { %>规则: <%=data.groupname%><% } else { %>新规则<% } %></div>    </div><div class="rule-list-bd"><form class="ui-form">        <div class="ui-form-group">            <label class="ui-form-label">规则名称<sup>*</sup></label>            <div class="ui-form-ctrls">                <input type="text" class="keyword-gname-ipt" value="<%=data.groupname%>"/>                <span class="ui-help-inline">60字以内</span>            </div>        </div>        <div class="ui-form-group">            <label class="ui-form-label">关键词（最多10条关键词）<sup>*</sup></label>            <div class="ui-form-ctrls"><div class="keywords-tags keywords-edit-tags"><%=data.kwcontent%><span class="ui-tag add keyword-list-add" data-hot="glzx.keyword.addkey" data-event="keyword_reply_key_add" <% if(data.kws && data.kws.length >= 10) { %>style="display:none"<% } %>><a href="javascript:;" class="icon-plus"></a></span></div><span class="ui-help-block"></span>            </div>        </div>    </form><div class="msg-sumview-wrap"></div></div>',
                addKey: '<textarea style="width: 375px; height: 95px;" class="keyword-input"></textarea><span class="ui-help-block">输入回车可添加多个关键字，每个关键字少于30个字</span>',
                key: '<% for(var i = 0, item; item = data[i]; i++) { var disabledKey = (!item.active && item.active != undefined); %><span class="ui-tag edit-status-key<% if(disabledKey) { %> disabled<% } %>"><label <% if(disabledKey) { %>title="此关键词被其他规则覆盖"<% } %>><%-item.kw%></label> <a href="javascript:;" class="icon-cancel-squared" data-event="keyword_reply_key_del" data-hot="glzx.keyword.deletekey"></a></span><% } %>',
                conflictKey: "关键词：<%=conflictKey%> 与之前规则重复, 是否覆盖?",
                replyContent: '<div class="message-content">   <%=content%></div>'
            },
            render: function() {
                this.words = {
                    title: "关键词回复",
                    tip: '您的公众号粉丝发送消息如包含您设置的关键字，即可收到您设置的对应回复内容。<a href="http://kf.qq.com/faq/140410VnIvYV140415EvYBji.html#" target="_blank">如何设置关键词回复</a>'
                }, a("#manageMain").html(r.tmpl(this._tmpl.main, {
                    words: this.words
                })), n = a("#keywordsContent"), this.getList(), this.bindEvent()
            },
            getList: function(e) {
                var t = this;
                o.queryKeywords(function(i) {
                    i && i.length && (n.html(r.tmpl(t._tmpl.list, {
                        keywordRule: i
                    })), t.data = i, t.getDetail(e))
                })
            },
            getDataById: function(e) {
                for (var t, i = null, n = 0; t = this.data[n]; n++) e == t.groupid && (i = t);
                return i
            },
            bindEvent: function() {
                var e = this;
                s.addCommonEvent("click", {
                    keyword_reply_add: function() {
                        e.clearMsgSumView(), e.add()
                    },
                    keyword_reply_edit: function() {
                        e.clearMsgSumView(), e.edit(this)
                    },
                    keyword_reply_del: function() {
                        e.del(this)
                    },
                    keyword_reply_key_add: function() {
                        e.addKey(this)
                    },
                    keyword_reply_key_del: function() {
                        e.delKey(this)
                    },
                    keyword_reply_service_enable: function() {
                        e.enableServiceKeywords(this, 1)
                    },
                    keyword_reply_service_disable: function() {
                        e.enableServiceKeywords(this, 0)
                    }
                })
            },
            getDetail: function(e) {
                function t(e, t) {
                    o.getServiceInfoById(e, function(i) {
                        var a = u[e];
                        t && (a = u[e + "_" + t]), a.find(".keyword-reply-con").html(r.tmpl(n._tmpl.replyContent, {
                            content: "<p>" + i.serviceInfo.servicename + " 响应内容</p>"
                        }))
                    })
                }

                function i() {
                    void 0 != e && n.adjustScroll(e)
                }
                var n = this,
                    s = a(".keyword-box"),
                    d = {},
                    c = [],
                    u = {};
                s.each(function(e, t) {
                    var i = a(t),
                        n = i.attr("data-mod"),
                        r = i.attr("data-modid");
                    if ("0" == n) c.push(r), d[r] = i;
                    else if ("1" == n)
                        if (u[r]) {
                            var s = r + "_" + (new Date).getTime();
                            u[s] = i, i.attr("data-modid-ts", s)
                        } else u[r] = i
                });
                for (var p in u)
                    if (p.indexOf("_") > 0) {
                        var f = p.split("_");
                        t(f[0], f[1])
                    } else t(p);
                c.length ? o.getMsgByIds({
                    msgIds: c.join(","),
                    productId: r.getProductId()
                }, function(e) {
                    for (var t, a = 0; t = e[a]; a++) {
                        var s = d[t.msgid],
                            o = s.find(".keyword-reply-con");
                        if ("1" == t.msgtype) {
                            var c = l.toWechatHtml(t.content);
                            o.html(r.tmpl(n._tmpl.replyContent, {
                                content: "<p>" + c + "</p>"
                            }))
                        } else "2" == t.msgtype && o.html(r.tmpl(n._tmpl.replyContent, {
                            content: '<div style="width:154px; height:90px; overflow:hidden"><img style="width:100%" src="' + t.content[0].picurl + '" /></div>'
                        }))
                    }
                    i()
                }) : i()
            },
            adjustScroll: function(e) {
                var t = a("#manageMain");
                if (!e) return void t.scrollTop(0);
                var i = a(".keyword-box");
                i.each(function(i, n) {
                    var r = a(n),
                        s = r.attr("data-id");
                    if (s == e) {
                        var o = r.offset().top + t.scrollTop() - p.getHeaderHeight() - 30;
                        return void t.scrollTop(o)
                    }
                })
            },
            enableServiceKeywords: function(e, t) {
                var i = this;
                o.enableServiceKeywords({
                    productId: r.getProductId(),
                    serviceId: a(e).closest(".keyword-box").attr("data-modid"),
                    enable: t
                }, function() {
                    d.success("更新成功"), i.getList()
                })
            },
            renderMsgSumView: function(e, t, i) {
                var n = this;
                o.getBindInfo(function(r) {
                    var s = r.wechataccount ? "更新至公众号" : "确认设置",
                        o = {
                            renderTo: e,
                            resTypeLabel: "回复内容",
                            msgItem: t,
                            serviceInfo: i,
                            saveBtn: {
                                text: s,
                                beforeCallback: function() {
                                    var e = n.keybox,
                                        t = e.find(".keyword-gname-ipt"),
                                        i = a.trim(t.val()),
                                        r = e.find(".edit-status-key"),
                                        s = function(e, t, i) {
                                            var n = {
                                                tip: e,
                                                callback: function() {
                                                    var e = a("#manageMain");
                                                    e.scrollTop(t.offset().top + e.scrollTop() - p.getHeaderHeight() - 30)
                                                }
                                            };
                                            return "keyword" == i && (n.evtType = "click"), u.showErr(t, n)
                                        };
                                    return "" == i ? s("请输入规则名称", t) : i.length > 60 ? s("超出字数限制", t) : r.length ? void 0 : s("请添加关键字", e.find(".keywords-edit-tags"), "keyword")
                                },
                                callback: function(e) {
                                    n.save(e), f.click("glzx.keyword.saverule")
                                }
                            },
                            cancelBtn: {
                                text: "取消",
                                callback: function() {
                                    n.clearMsgSumView(), f.click("glzx.keyword.cancelsave")
                                }
                            }
                        };
                    c.render(o)
                })
            },
            clearMsgSumView: function() {
                if (this.keybox) {
                    var e = this.keybox,
                        t = e.find(".keyword-view-wrap"),
                        i = e.find(".keyword-edit-wrap");
                    t.length ? (i.html("").hide(), t.show()) : e.remove()
                }
            },
            add: function() {
                var e = a("<div/>").addClass("keyword-box rule-list");
                e.html(r.tmpl(this._tmpl.form, {
                    data: {}
                })).show(), n.prepend(e), this.keybox = e, this.renderMsgSumView(e.find(".msg-sumview-wrap"))
            },
            edit: function(e) {
                e = a(e);
                var t = this,
                    i = e.closest(".keyword-box"),
                    n = i.find(".keyword-view-wrap"),
                    s = i.find(".keyword-edit-wrap"),
                    d = this.getDataById(i.attr("data-id"));
                if (d) {
                    d.kwcontent = d.kws ? r.tmpl(this._tmpl.key, {
                        data: d.kws
                    }) : "", n.hide(), s.html(r.tmpl(this._tmpl.form, {
                        data: d
                    })).show();
                    var c, l = s.find(".msg-sumview-wrap");
                    "1" == d.mode ? (c = {
                        serviceid: d.modeid
                    }, t.renderMsgSumView(l, null, c)) : o.getMsgById({
                        msgId: d.modeid
                    }, function(e) {
                        t.renderMsgSumView(l, e, null)
                    }), this.keybox = i
                }
            },
            del: function(e) {
                var t = this;
                d.confirm("确认要删除这条规则吗?", function() {
                    var i = a(e).closest(".keyword-box"),
                        n = i.attr("data-id"),
                        s = t.getDataById(n);
                    o.deleteKeywords({
                        productId: r.getProductId(),
                        groupId: n,
                        mode: s.mode,
                        modeId: s.modeid
                    }, function() {
                        d.success("删除成功"), i.slideUp(function() {
                            i.remove()
                        })
                    })
                })
            },
            setAppKeywords: function(e, t, i, n) {
                var a = {
                    productId: r.getProductId(),
                    groupId: "0",
                    groupName: t,
                    mode: "1",
                    modeId: e,
                    sourceMode: "1",
                    sourceModeId: e,
                    keywords: i
                };
                o.updateKeywords(a, function() {
                    n && n(1), o.setPageFlag("keyword_reply")
                }, function() {
                    n && n(0)
                })
            },
            dealAppKeywords: function(e, t, i, n, a) {
                var s = this,
                    d = "",
                    c = [],
                    l = function() {
                        for (var e = 0, t = c.length; t > e; e++)
                            for (var i = 0, a = n.length; a > i; i++) c[e] && c[e] == n[i] && c.splice(e, 1)
                    };
                o.queryKeywords(function(o) {
                    if (o && o.length)
                        for (var u, p = 0; u = o[p]; p++)
                            if (u.modeid == t) {
                                d = d || i + "设置关键字", c = r.cloneObject(u.kws);
                                for (var f = 0, m = c.length; m > f; f++) c[f] = c[f].kw;
                                break
                            }
                    if (0 == e) a && a(c);
                    else if (3 == e) l(), s.setAppKeywords(t, d, c.join(","), function(e) {
                        e ? a && a(c) : a && a(0)
                    });
                    else {
                        var g = function() {
                            return l(), c.concat(n)
                        };
                        s.preventRepeatKeywords(n, {
                            mode: 0,
                            id: t
                        }, function() {
                            var i = 2 == e ? g().join(",") : n.join(",");
                            s.setAppKeywords(t, d, i, a)
                        }, function() {
                            a && a(0)
                        })
                    }
                })
            },
            preventRepeatKeywords: function(e, t, i, n) {
                var s = this,
                    c = [],
                    l = [];
                o.queryKeywords(function(o) {
                    if (o && o.length)
                        for (var u, p = 0; u = o[p]; p++)
                            if (!(0 == t.mode && t.id == u.modeid || 1 == t.mode && t.id === u.groupid))
                                for (var f, m = 0; f = u.kws[m]; m++) f.active && c.push(f.kw);
                    for (var g, p = 0; g = e[p]; p++) a.inArray(g, c) >= 0 && l.push(g);
                    if (l.length) {
                        var v = r.tmpl(s._tmpl.conflictKey, {
                            conflictKey: "[" + l.join(",") + "]"
                        });
                        d.confirm(v, function() {
                            i && i()
                        }, function() {
                            n && n()
                        })
                    } else i && i()
                })
            },
            save: function(e) {
                function t() {
                    o.updateKeywords(h, function() {
                        var e = n.find(".layout-sub-footer").find("a:eq(0)"),
                            t = "确认设置" == e.text() ? "已确认" : "更新成功";
                        d.success(t), i.getList(c), o.setPageFlag("keyword_reply")
                    })
                }
                var i = this,
                    n = this.keybox,
                    s = n.attr("data-id"),
                    c = s ? s : "",
                    l = n.attr("data-mod"),
                    u = n.attr("data-modid"),
                    p = "3" == e.resType ? "1" : "0",
                    f = e.resContent,
                    m = n.find(".edit-status-key"),
                    g = n.find(".keyword-gname-ipt").val(),
                    v = [];
                m.each(function(e, t) {
                    v.push(a(t).find("label").text())
                });
                var h = {
                    productId: r.getProductId(),
                    groupId: c,
                    mode: p,
                    modeId: f,
                    sourceMode: l,
                    sourceModeId: u,
                    groupName: g,
                    keywords: v.join(",")
                };
                i.preventRepeatKeywords(v, {
                    mode: 1,
                    id: c
                }, function() {
                    t()
                })
            },
            delKey: function(e) {
                a(e).parent().remove();
                var t = this.keybox.find(".keyword-list-add");
                t.is(":visible") || t.show()
            },
            addKey: function(e) {
                var t = this,
                    i = a(e).parent().find(".edit-status-key"),
                    n = i.length,
                    s = i.find("label"),
                    o = [];
                s.each(function(e, t) {
                    o.push(a(t).text())
                }), d.create(this._tmpl.addKey, "", "", {
                    title: "添加关键字",
                    button: {
                        "确认": function() {
                            var i = d.el.find(".keyword-input"),
                                s = a.trim(i.val());
                            if ("" == s) return u.showErr(i, {
                                tip: "请输入关键字"
                            });
                            var c = s.split("\n");
                            if (1 == c.length && c[0].length > 30) return u.showErr(i, {
                                tip: "关键字超出30个字"
                            });
                            for (var l = a(e), p = [], f = [], m = 0, g = c.length; g > m && p.length != 10 - n; m++) {
                                var v = c[m],
                                    h = a.trim(v).length;
                                h > 0 && 30 >= h && a.inArray(v, f) < 0 && a.inArray(v, o) < 0 && (p.push({
                                    kw: v
                                }), f.push(v))
                            }
                            l.before(r.tmpl(t._tmpl.key, {
                                data: p
                            })), d.hide(), l.parent().find(".edit-status-key").length >= 10 && l.hide()
                        }
                    }
                }), d.el.find(".keyword-input").focus()
            },
            destroy: function() {
                this.keybox = null
            }
        };
    i.exports = m
}), define("manage/manage", function(e, t, i) {
    var n, a = e("router"),
        r = e("util"),
        s = e("event"),
        o = e("wxManager"),
        d = e("bdWexin"),
        c = (e("widget/upfile/upfile"), e("dialog")),
        l = e("lib/reporter"),
        u = e("main/pagemanage"),
        p = "http://kf.qq.com/faq/140410VnIvYV1404152qINrq.html#",
        f = "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=wxverify/faq_tmpl&lang=zh_CN&token=1684146237",
        m = "http://kf.qq.com/menu/5143_1.html",
        g = {
            title: window.platformName + "-管理中心",
            _tmpl: {
                main: '<div class="layout-side" id="sidebar"><div class="side-footer" id="sidebarFoot"></div><div class="side-nav">    <h2 id="sidebarTitle" class="side-acc-name"></h2>    <a class="unbind-btn" id="manageUnbindBtn" href="javascript:void(0);" style="display:none" data-event="manage_toggle_title_menu"><span></span></a>    <a class="unbind-expand" id="manageUnbindExpand" href="javascript:void(0);" data-hot="glzx.common.unbind" data-event="manage_unbind">解绑公众号</a>    <h3><span class="icon-management"></span>我的公众号管理</h3>    <ul class="main">        <li>        <a href="/manage/greeting" data-event="nav" data-hot="glzx.shoucigz.shoucigz" title="首次关注回复">    首次关注回复    </a>    </li>        <li>        <a href="/manage/auto_reply" data-event="nav" data-hot="glzx.zdhf.zdhf" title="自动回复">        自动回复       </a>    </li>    <li>        <a href="/manage/keyword_reply" data-event="nav" data-hot="glzx.keyword.keyword" title="关键词回复">        关键词回复       </a>    </li>    <li>        <a href="/manage/menu" data-event="nav" data-hot="glzx.menu.menu" title="自定义菜单">        自定义菜单       </a>    </li>        <!--<li>        <a href="/manage/msg_list" data-event="nav" title="素材管理">        素材管理        </a>    </li>    <li>        <a href="/manage/mass_send" data-event="nav" title="群发消息">        群发消息        </a>    </li>-->    </ul></div></div><div class="layout-main" id="manageMain">    </div>',
                head: '<a href="/manage/index" data-event="nav" data-hot="glzx.dash"><% if(data.wechatavatar) { %><span class="mod-default-avatar"><img src="<%=data.wechatavatar%>" style="width:45px;height:45px"></span><% } else { %><span class="mod-default-avatar"></span><% } %><% if(data.wechataccount) { %><%-data.productname || data.wechatnickname%><% } else { %> 工作台<% } %></a>',
                foot: '<% if(!data.wechataccount) { %><a href="javascript:;" class="ui-btn ui-btn-primary ui-btn-wid" data-event="manage_publish_weixin" data-hot="glzx.common.navigafabu">绑定并发布</a><% } %>',
                service: '<% for(var i = 0, item; item = data[i]; i++) { %><h3><span class="icon-product"></span><%-item.packageName%></h3><ul class="sub"><% for(var j = 0, jitem; jitem = item.services[j]; j++) { %><% if (jitem.submenu) { %><% if (jitem.submenu.length) { %>    <li>    <span class="arrow" data-event="manage_toggle_submenu"></span>    <a href="javascript:void(0);" data-event="manage_toggle_submenu"><%=jitem.servicename%></a>    <ul>    <% for(var k = 0, kitem; kitem = jitem.submenu[k]; k++) { %>    <% if (kitem.name) { %>    <li>    <a href="/manage/cms/<%=jitem.serviceid%>/<%=kitem.name%>" data-event="nav">    <%-kitem.name%>    </a>    </li>    <% } %>    <% } %></ul></li><% } %>    <% } else {%>    <li>    <a href="/manage/cms/<%=jitem.serviceid%>" data-event="nav">    <%-jitem.servicename%>    </a>    </li>    <% } %>    <% } %></ul><% } %>',
                unconfig: '<span class="ui-alert-icon error"></span>    <div class="bind-info">        <!--<h4>以下功能您尚未配置更新内容，依然使用<%=tipName%>默认设置，是否确认继续发布操作？</h4>-->        <h4>您有内容未配置更新，确认发布？</h4>        <p>成功后，所有配置内容将被发布</p>        <% for(var i = 0, item; item = data[i]; i++) { %>        <% for(var key in item) { %>         <p>- <%=item[key]%></p>         <% } %>    <% } %>    </div>',
                publishTip: '<span class="ui-alert-icon success"></span>    <div class="bind-info" style="min-width:325px">        <h4>公众号已发布</h4>        <% if (packageTip) { %>        <p>您的套餐将在<%=packageTip%>天后到期，请在<%=packageTip%>天内续费</p>        <% } %>        <% if (elseTip) { %>        <p><%=elseTip%></p>        <% } %>    </div>',
                outdate: ' <span class="ui-alert-icon error"></span>    <div class="ui-alert-title">        <h2 class="ui-status warning">您的套餐已过期</h2>        <p>请续费后再发布您的公众号</p>    </div>',
                accountErr: ' <span class="ui-alert-icon error"></span>    <div class="ui-alert-title">        <h2 class="ui-status warning">您的帐号出现异常</h2>        <p>请<%=tipTxt%>后继续使用</p>    </div>',
                phoneProtect: ' <span class="ui-alert-icon error"></span>    <div class="ui-alert-title">    <% if (mode == 1) { %>        <h2 class="ui-status warning">您的公众号发布失败</h2>        <p>因微信策略调整，请手动绑定</p>        <% } else { %>        <h2 class="ui-status warning">您的公众号修复失败</h2>        <p>因微信策略调整，请手动绑定</p>        <% } %>    </div>',
                auditAccount: ' <span class="ui-alert-icon error"></span>    <div class="ui-alert-title">    <h2 class="ui-status warning">您的公众号尚未通过审核，暂无法发布</h2>        <p>请等待审核通过再进行发布操作，<a href="<%=registerHelpLink%>" target="_blank">查看微信审核引导</a></p>    </div>',
                accountErrPhone: ' <span class="ui-alert-icon error"></span>    <div class="ui-alert-title">        <h2 class="ui-status warning">您的帐号出现异常</h2>        <p>您的更新操作可能不生效，请手动绑定修复</p>    </div>',
                unbind: '<div style="padding-left:0;" class="ui-alert-title"><p style="font-size:18px">是否确认<%=text%>？</p></div>',
                needUnbind: ' <span class="ui-alert-icon error"></span>    <div class="ui-alert-title">    <h2 class="ui-status warning">您的公众号发布失败</h2>        <p>该微信公众号已绑定其他套餐，如需更改请先解绑</p>    </div>'
            },
            render: function() {
                o.updateUsrPackage(), $("#container").html(this._tmpl.main), n = $("#sidebar"), c.hideMiniTip(), this.titleMenuConfig = {}, this.showWxInfo(), this.showSideNav(), this.bindEvent()
            },
            bindEvent: function() {
                var e = this;
                s.addCommonEvent("click", {
                    manage_publish_weixin: function() {
                        e.publishWeixin()
                    },
                    manage_toggle_submenu: function() {
                        $(this).parent().toggleClass("expand")
                    },
                    manage_register_wx: function() {
                        window.open("https://mp.weixin.qq.com/")
                    },
                    manage_unbind: function() {
                        e.unbind(this)
                    },
                    manage_toggle_title_menu: function() {
                        var e = $(this),
                            t = $("body"),
                            i = e.closest(".side-nav"),
                            n = i.hasClass("expand"),
                            a = function() {
                                i.removeClass("expand"), s()
                            },
                            r = function() {
                                t.on("click", a)
                            },
                            s = function() {
                                t.off("click", a)
                            };
                        a(), n || (i.addClass("expand"), setTimeout(function() {
                            r()
                        }, 100))
                    }
                })
            },
            setTitleMenu: function() {
                var e = this.titleMenuConfig,
                    t = $("#manageUnbindBtn");
                e.binded ? t.show() : t.hide()
            },
            unbind: function(e) {
                var t = this,
                    i = $(e).text();
                c.confirm(r.tmpl(this._tmpl.unbind, {
                    text: i
                }), function() {
                    t.unbindAccount()
                }, null, "解绑提示", "确认解绑")
            },
            unbindAccount: function(e, t) {
                !e && (e = r.getProductId()), o.unbindAccount(e, function() {
                    o.clearBindInfo(), t ? t() : (c.success("解绑成功"), a.option.pageManager.resetFragment(), a.redirect("/manage"))
                })
            },
            showSideNav: function() {
                var e = this;
                o.getUsrPackage(function(t) {
                    if (e.packages = t, t && t.length) {
                        for (var i, a = [], s = 0; i = t[s]; s++) {
                            var d = {};
                            d.packageName = i.packagename, d.services = [];
                            for (var c, l = 0; c = i.services[l]; l++) {
                                var u = {};
                                u.serviceid = c.serviceid, u.servicename = c.servicename;
                                var p = o.getServiceAdminJSON(c.serviceadmin);
                                p && (u.submenu = p), d.services.push(u)
                            }
                            a.push(d)
                        }
                        var f = r.tmpl(e._tmpl.service, {
                            data: a
                        });
                        n.find(".side-nav").append(f), e.setActiveIfCms()
                    }
                })
            },
            setActiveIfCms: function() {
                var e = decodeURIComponent(u.fragment);
                /\/cms\//.test(e) && n.find("a").each(function() {
                    var t = $(this);
                    if (t.attr("href").indexOf(e) >= 0) {
                        var i = t.closest("li"),
                            n = t.closest("ul").closest("li");
                        return n.addClass("expand"), i.addClass("active"), !1
                    }
                })
            },
            showWxInfo: function(e) {
                var t = this;
                o.getBindInfo(function(e) {
                    $("#sidebarTitle").html(r.tmpl(t._tmpl.head, {
                        data: e
                    }));
                    var i = $("#sidebarFoot"),
                        a = n;
                    e.wechataccount ? (a.addClass("binded"), t.getAccountStatus(), t.titleMenuConfig.binded = 1) : (t.showPageFlag(), i.html(r.tmpl(t._tmpl.foot, {
                        data: e
                    })), t.titleMenuConfig.binded = 0), t.setTitleMenu()
                }, null, e)
            },
            showPageFlag: function() {
                o.queryProductSetting(function(e) {
                    if (e) {
                        var t = n.find(".main").find("a");
                        for (var i in e) {
                            var a = new RegExp("/" + i + "$");
                            t.each(function(e, t) {
                                var i = $(t);
                                a.test(i.attr("href")) && i.parent().addClass("checked")
                            })
                        }
                    }
                })
            },
            getUnconfigInfo: function(e) {
                var t = {
                        greeting: "首次关注回复",
                        auto_reply: "自动回复",
                        keyword_reply: "关键词回复"
                    },
                    i = [];
                o.getUsrPackage(function(n) {
                    for (var a, r = 0; a = n[r]; r++)
                        if (a.menuconfig && a.menuconfig.button && a.menuconfig.button.length) {
                            t.menu = "自定义菜单";
                            break
                        }
                    o.queryProductSetting(function(n) {
                        for (var a in t) {
                            var r = !0;
                            for (var s in n)
                                if (s == a) {
                                    r = !1;
                                    break
                                }
                            if (r) {
                                var o = {};
                                o[a] = t[a], i.push(o)
                            }
                        }
                        e && e(i)
                    })
                })
            },
            publishWeixin: function(e) {
                var t = this,
                    i = function() {
                        t.bindWX({
                            title: "发布",
                            buttonName: "发布",
                            accountInfo: e,
                            callback: function(e) {
                                var i = '<a href="' + f + '" target="_blank">查看帮助</a>';
                                t.checkStatus(e, {
                                    auditAccount: function() {
                                        t.auditAccount()
                                    },
                                    phoneProtect: function() {
                                        t.phoneProtect(1)
                                    },
                                    failMenu: function() {
                                        t.publishSuccess("推送菜单失败，暂无法使用自定义菜单")
                                    },
                                    auth: function() {
                                        t.publishSuccess("您的公众号尚未经过认证，暂无法使用自定义菜单，" + i)
                                    },
                                    tipUnbind: function() {
                                        t.tipUnbind(e.productid)
                                    },
                                    success: function() {
                                        t.publishSuccess()
                                    }
                                })
                            }
                        })
                    };
                return e ? void i() : void o.ifPackageExpired(function() {
                    c.create(t._tmpl.outdate, "430", "", {
                        title: "套餐已过期",
                        defaultCancelBtn: !1,
                        button: {
                            "续费": function() {
                                c.hide(), a.redirect("/personal/packages/list")
                            }
                        }
                    })
                }, function() {
                    t.getUnconfigInfo(function(e) {
                        if (e.length) {
                            var n = t.packages && t.packages.length ? "套餐" : "系统";
                            c.create(r.tmpl(t._tmpl.unconfig, {
                                data: e,
                                tipName: n
                            }), "", "", {
                                "class": "ui-modal weixin-bind submit-info",
                                title: "发布",
                                defaultCancelBtnCb: function() {
                                    t.reportClick("cancelfabu")
                                },
                                button: {
                                    "继续发布": function() {
                                        i(), t.reportClick("jxfabu")
                                    }
                                }
                            })
                        } else i()
                    })
                })
            },
            bindWX: function(e) {
                this.bdWxIns = new d(e)
            },
            publishSuccess: function(e) {
                var t = this,
                    i = n.find(".main").find("li");
                i.removeClass("checked"), this.showWxInfo(1);
                var s = 7;
                if (this.packages && this.packages.length)
                    for (var o, d = 0; o = this.packages[d]; d++) {
                        var l = o.services[0].servicedate;
                        try {
                            var u = r.dateDiff(r.getCurrentTime(), l) / 864e5;
                            if (s = u, u > 7) {
                                s = 0;
                                break
                            }
                        } catch (p) {}
                    } else s = 0;
                c.create(r.tmpl(this._tmpl.publishTip, {
                    packageTip: s,
                    elseTip: e
                }), "", "", {
                    title: "发布成功",
                    "class": "ui-modal weixin-bind success",
                    defaultCancelBtn: 0,
                    button: {
                        "完成": function() {
                            c.hide(), a.redirect("/manage"), t.reportClick("done")
                        }
                    }
                })
            },
            phoneProtect: function(e) {
                var t = this;
                c.create(r.tmpl(this._tmpl.phoneProtect, {
                    failedSolution: p,
                    mode: e
                }), "", "", {
                    title: 1 == e ? "发布失败" : "修复失败",
                    defaultCancelBtn: 0,
                    button: {
                        "手动绑定": function() {
                            c.hide(), a.redirect("/manual_bind"), t.reportClick("manualBind")
                        }
                    }
                }), this.reportClick("phoneProtectTip")
            },
            auditAccount: function() {
                c.create(r.tmpl(this._tmpl.auditAccount, {
                    registerHelpLink: m
                }), "", "", {
                    title: "发布失败",
                    defaultCancelBtn: 0,
                    button: {
                        "我知道了": function() {
                            c.hide()
                        }
                    }
                }), this.reportClick("auditAccountTip")
            },
            getAccountStatus: function() {
                var e = this;
                o.getAccountStatus(function(t) {
                    var i = t.data,
                        n = i.wechatstatus;
                    if (void 0 != n && 0 != n) {
                        var a = {
                            title: "系统提示",
                            defaultCancelBtn: 0
                        };
                        if (-99999 == n || -99997 == n) return;
                        var s = "";
                        if (n > 0 ? (s = "修复", a.button = {
                                "一键修复": function() {
                                    e.repairAccount(), e.reportClick("repair")
                                }
                            }) : 0 > n && (s = "重新绑定", a.button = {
                                "重新绑定": function() {
                                    e.rebindWX(), e.reportClick("rebind")
                                }
                            }), !s) return;
                        c.create(r.tmpl(e._tmpl.accountErr, {
                            tipTxt: s
                        }), "420", "", a)
                    }
                })
            },
            rebindWX: function() {
                var e = this;
                this.bindWX({
                    title: "重新绑定",
                    buttonName: "确定",
                    callback: function(t) {
                        var i = function() {
                            c.success("绑定成功, 修复完成")
                        };
                        e.checkStatus(t, {
                            phoneProtect: function() {
                                e.phoneProtect(2)
                            },
                            tipUnbind: function() {
                                e.tipUnbind(t.productid)
                            },
                            failMenu: i,
                            auth: i,
                            success: i
                        })
                    }
                })
            },
            repairAccount: function() {
                o.repairAccount(function(e) {
                    0 == e.data ? (c.hide(), c.success("修复成功")) : (c.miniTip("修复失败, 请重新绑定一次"), _self.rebindWX())
                })
            },
            tipUnbind: function(e) {
                var t = this;
                c.create(this._tmpl.needUnbind, "", "", {
                    title: "发布失败",
                    button: {
                        "确认解绑": function() {
                            c.hide(), t.unbindAccount(e, function() {
                                var e = t.bdWxIns;
                                t.publishWeixin({
                                    username: e.usernameVal,
                                    password: e.passwordVal
                                })
                            })
                        }
                    }
                })
            },
            checkStatus: function(e, t) {
                -2 == e.status ? t.auditAccount && t.auditAccount() : -1 == e.status || -7 == e.status ? t.phoneProtect && t.phoneProtect() : 0 == e.status ? t.failMenu && t.failMenu() : 2 == e.status ? t.auth && t.auth() : 100 == e.status ? t.tipUnbind && t.tipUnbind() : t.success && t.success()
            },
            reportClick: function(e) {
                l.click("glzx.common." + e)
            },
            destroy: function() {
                /^\/manage/.test(a.fragment) || $("#container").html("")
            }
        };
    i.exports = g
}), define("manage/mass_send/mass_send", function(e, t, i) {
    var n = {
        _tmpl: {
            main: '<h1 style="padding:50px; font-size:16px; color:#999; text-align:center">暂不支持群发消息，请前往<a href="https://mp.weixin.qq.com/" target="_blank">微信公众平台</a>配置</h1>'
        },
        render: function() {
            document.getElementById("manageMain").innerHTML = this._tmpl.main
        },
        destroy: function() {}
    };
    i.exports = n
}), define("manage/menu/menu", function(e, t, i) {
    var n = e("$"),
        a = e("lib/util"),
        r = e("lib/reporter"),
        s = e("widget/dialog"),
        o = e("../widget/menu_config/MenuConfig"),
        d = e("../widget/menu_config/Package"),
        c = e("../widget/menu_config/Button"),
        l = e("../widget/menu_config/MenuItem"),
        u = e("../widget/menu_config/Constants"),
        p = e("manage/config/manager"),
        f = e("wxManager"),
        m = e("widget/formchange/formchange"),
        g = e("./menu/tpl"),
        v = {
            render: function() {
                var e = this,
                    t = n("#manageMain");
                e.$el = n(g.main()).appendTo(t.empty()), e.$container = n('[data-id="menuConfigContainer"]', e.$el), e.$publishConfig = n('[data-id="publishConfig"]', e.$el), e._events();
                var i = e.menuConfig = new o;
                i.render(e.$container), e._rendered = !0, e._getData(function(t, n, a, r) {
                    e._rendered && (i.init(t, n, a, r), e._toggleButton(i.isConfigurable(), a))
                })
            },
            destroy: function() {
                this.$el.remove(), this.$el = this.$container = this.$publishConfig = this.menuConfig = null, this._rendered = !1
            },
            _events: function() {
                var e = this;
                e.$publishConfig.on("click", function() {
                    var t = n(this);
                    t.prop("disabled", !0), e._publishConfig().done(function(t, i) {
                        0 == t || 1 == t ? (s.success(i.msg || (1 == t ? "已确认" : "已更新到微信公众帐号"), 4e3), p.setPageFlag("menu")) : e.menuConfig.showFailed("SAVE", t)
                    }).fail(function(t, i) {
                        t ? e.menuConfig.showFailed("SAVE", t) : i && s.miniTip(i.msg, 4e3)
                    }).always(function() {
                        t.prop("disabled", !1)
                    }), r.click("glzx.menul.gengxin")
                })
            },
            _getData: function(e) {
                var t, i, n, a, r = this,
                    s = function(s) {
                        if (!s && null != t && null != i && null != n) {
                            var o = r._buildPackList(t),
                                d = r._buildItemList(i, o);
                            e(o, d, n, a)
                        }
                    };
                r._getUserPackInfo(function(e, i) {
                    t = i instanceof Array ? i : [i], s(e)
                }), r._getUserSavedConfig(function(e, t) {
                    i = t, s(e)
                }), r._getUserWechatAccount(function(e, t, i) {
                    n = t, a = i, s(e)
                })
            },
            _getUserPackInfo: function(e) {
                f.getUsrPackage(function(t) {
                    e(null, t)
                }, function(t) {
                    e(t.msg)
                })
            },
            _getUserWechatAccount: function(e) {
                f.getBindInfo(function(t) {
                    var i = t.wechataccount,
                        n = 1 == t.isauth;
                    e(null, i, n)
                }, function(t) {
                    e(t.msg, null)
                })
            },
            _buildPackList: function(e) {
                return n.map(e, function(e) {
                    var t = e.menuconfig,
                        i = e.providerid,
                        a = (t instanceof Array ? t : t.button) || [];
                    return [new d({
                        id: e.packageid,
                        name: e.packagename,
                        buttonList: n.map(a, function(e) {
                            var t = e.sub_button || [];
                            return new c({
                                id: e.menuid,
                                name: e.name,
                                type: e.type,
                                providerId: i,
                                key: e.key,
                                serviceId: e.id,
                                url: e.url,
                                resType: e.restype,
                                content: e.content,
                                imgURL: e.imgurl,
                                subButtonList: n.map(t, function(e) {
                                    return new c({
                                        id: e.menuid,
                                        name: e.name,
                                        type: e.type,
                                        providerId: i,
                                        key: e.key,
                                        serviceId: e.id,
                                        url: e.url,
                                        resType: e.restype,
                                        content: e.content,
                                        imgURL: e.imgurl
                                    })
                                })
                            })
                        })
                    })]
                })
            },
            _getUserSavedConfig: function(e) {
                var t = a.getProductId();
                p.getUsrMenuConfig({
                    productId: t
                }, function(t) {
                    e(null, t)
                }, function(t) {
                    e(t.msg)
                })
            },
            _buildItemList: function(e, t) {
                var i;
                if (e && e.length) {
                    var a = {};
                    n.each(t, function(e, t) {
                        var i = t.id;
                        n.each(t.buttonList, function(e, t) {
                            var r = t.id;
                            a[r] = {
                                button: t,
                                packageId: i
                            }, n.each(t.subButtonList, function(e, t) {
                                var n = t.id;
                                a[n] = {
                                    button: t,
                                    packageId: i,
                                    btnLv1Id: r
                                }
                            })
                        })
                    });
                    var r = function(e) {
                        var i = e.menuid,
                            n = a[i],
                            r = e.url && !e.providerid,
                            s = r ? null : n && n.button,
                            o = r ? t[0].id : n && n.packageId,
                            d = (n && n.btnLv1Id, r ? "URL" : "PACKAGE"),
                            c = r ? e.url : null;
                        return {
                            text: e.name,
                            curType: d,
                            curURL: c,
                            curPackage: o,
                            curButton: s
                        }
                    };
                    i = n.map(e, function(e) {
                        var t = r(e);
                        return e.sub_button && e.sub_button.length && (t.subItemList = n.map(e.sub_button, function(e) {
                            return new l(r(e))
                        })), new l(t)
                    })
                } else i = n.map(t, function(e) {
                    return n.map(e.buttonList.slice(0, u.LV1_ITEM_LIMIT), function(t) {
                        var i = !!t.subButtonList.length;
                        return new l({
                            text: t.name,
                            curType: "PACKAGE",
                            curPackage: e.id,
                            curButton: i ? null : t,
                            subItemList: n.map(t.subButtonList.slice(0, u.LV2_ITEM_LIMIT), function(t) {
                                return new l({
                                    text: t.name,
                                    curType: "PACKAGE",
                                    curPackage: e.id,
                                    curButton: t
                                })
                            })
                        })
                    })
                });
                return i
            },
            _publishConfig: function() {
                var e = n.Deferred(),
                    t = this.menuConfig.validate();
                if (t.length) e.reject();
                else {
                    var i = this.menuConfig.serialize();
                    p.setUserMenuConfig(i, function(t, i) {
                        e.resolve(t, i), m.set(0)
                    }, function(t, i) {
                        e.reject(t, i)
                    }, !1)
                }
                return e
            },
            _toggleButton: function(e, t) {
                this.$publishConfig.html(t ? "更新到公众账号" : "确认设置"), this.$el.find('[data-id="btns"]').toggle(e)
            }
        };
    i.exports = v
}), define("manage/menu/menu/tpl", function(e, t, i) {
    i.exports = {
        main: function() {
            var e = [],
                t = function(t) {
                    e.push(t)
                };
            return t('<div>\r\n			        <style>\r\n			        .app-menu .app-menu-edit .bind .ui-dropdown .ui-btn{min-width: 96px}\r\n			        .ie9 .app-menu .ui-dropdown .ui-btn,.ie8 .app-menu .ui-dropdown .ui-btn{min-width: 64px!important}\r\n			        </style>\r\n			        <div class="layout-sub-title">\r\n			            <h1>自定义菜单</h1>\r\n			            <p>设置您的自定义菜单，更新后24小时内生效。尚未微信认证的订阅号暂无法获得自定义菜单。<a href="http://kf.qq.com/faq/140410VnIvYV140415UnEZBn.html#" target="_blank">如何设置自定义菜单？</a></p>\r\n			        </div>\r\n			\r\n			        <div data-id="menuConfigContainer" class="layout-sub-content">\r\n			\r\n			        </div>\r\n			\r\n			        <div data-id="btns" class="layout-sub-footer">\r\n			            <button data-id="publishConfig" type="button" class="ui-btn ui-btn-primary">更新至公众帐号</button>\r\n			        </div>\r\n			    </div>'), e.join("")
        },
        __escapeHtml: function() {
            var e = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                t = /[&<>'"\/]/g;
            return function(i) {
                return "string" != typeof i ? i : i ? i.replace(t, function(t) {
                    return e[t] || t
                }) : ""
            }
        }()
    }
}), define("manage/widget/edit_msg/edit_msg", function(e, t, i) {
    var n, a, r, s, o, d, c, l, u, p, f, m, g, v, h, b, _, y, w, I, k, x = e("$"),
        L = e("event"),
        T = e("wxManager"),
        C = (e("manager"), e("util")),
        M = e("editor"),
        E = e("simulator"),
        P = e("router"),
        S = e("dialog"),
        A = e("widget/upfile/upfile"),
        B = e("lib/text"),
        U = e("widget/validator/validator"),
        j = e("main/pagemanage"),
        q = e("widget/formchange/formchange"),
        F = e("lib/reporter"),
        $ = /https?:\/\/(?:[\w\-]+\.)+\w+(?:\/[^'"\s\b<>]*)?/gi,
        D = {
            _tmpl: {
                main: '<style>.error .msg-editor{border:1px solid #FF3F00;}.multi-first .msg-ico-trash{display:none!important;}</style><div id="msgEditSimulator" style="float:left"></div><div class="mod-msg-editor" id="msgEditForm" data-event="msg_edit_form" style="width:407px"><div style="top:90px;" class="mod-msg-arrow" id="modMsgArrow"></div><%=data.content%> </div> ',
                form: '  <form class="ui-form"><fieldset>   <div class="ui-form-group">   <label class="ui-form-label">标题<sub>*</sub></label><div class="ui-form-ctrls">          <input type="text" value="<%-title%>" name="title" placeholder="请输入图文回复的标题">          <span class="ui-help-inline">限64个字</span>    </div></div><div class="ui-form-group">   <label class="ui-form-label">作者</label><div class="ui-form-ctrls">          <input type="text" value="<%-author%>" name="author" placeholder="请输入图文回复的作者">          <span class="ui-help-inline">限8个字</span>    </div></div><div class="ui-form-group msg-description" <% if(mutimod || description) { %>style="display:none"<% } %>> <a href="javascript:void(0);" data-event="edit_msg_add_desc">添加摘要</a></div>    <div class="ui-form-group msg-description" <% if(mutimod || !description) { %> style="display:none" <% } %> >    <label class="ui-form-label">摘要</label><div class="ui-form-ctrls">        <textarea value="<%-description%>" name="description" placeholder="请输入图文回复的摘要"><%-description%></textarea>        <span class="ui-help-block">限120个字</span>    </div></div><div class="ui-form-group clearfix"><label class="ui-form-label">封面<sub>*</sub></label><div class="ui-form-ctrls"><div class="pic-wrapper" style="float:left"><%=piccontent%>                </div>                <a href="javascript:;" cmd="selfile" class="ui-btn upload-btn">上传图片</a>                <span class="ui-help-block">限大小2MB以内的JPG,PNG,BMP文件</span>                <input type="hidden" class="msg-picurl-hidden" value="<%=picurl%>" name="picurl">            </div></div></fieldset><fieldset><div class="ui-form-group" <% if(!serviceList.length) { %>style="display:none"<% } %>>   <label class="ui-form-label">图文点击后效果<sub>*</sub></label><div class="ui-form-ctrls">          <select name="type" class="msg-content-type">          <option value="1" <% if(type == "1" || type == "") { %> selected <% } %>>纯文本</option>          <% if(serviceList.length) { %>          <option value="2" <% if(type == "2") { %> selected <% } %>>套餐功能</option>          <% } %>          </select>    </div></div>            <div class="ui-form-group msg-text-mod" <% if(type == "2" && serviceList.length) { %> style="display:none" <% } %>>    <% if(!serviceList.length) { %>    <label class="ui-form-label">图文点击后效果<sub>*</sub></label>    <% } %>            <div class="ui-form-ctrls">   <div class="msg-editor"></div>   <span class="ui-help-block">限20000个字</span>   <textarea style="display:none" class="msg-editor-hidden" name="content"><%=content%></textarea>            </div>        </div>        <div class="ui-form-group msg-orig-link-mod" <% if((type == "2" && serviceList.length) || url) { %>style="display:none"<% } %>>     <a href="javascript:void(0);" data-event="edit_msg_add_orig_link">添加原文链接</a>     </div>        <div class="ui-form-group msg-orig-link-mod" <% if((type == "2" && serviceList.length) || !url) { %> style="display:none" <% } %>>   <label class="ui-form-label">原文链接</label><div class="ui-form-ctrls">          <input type="text" value="<%=url%>" class="msg-orig-link">          <span class="ui-help-inline"></span>          <input class="msg-orig-link-hidden" type="hidden" value="<%=url%>" name="url">    </div></div><% if(serviceList.length) { %>        <div class="ui-form-group msg-app-mod" <% if(type == "1" || type == "") { %> style="display:none" <% } %>>   <label class="ui-form-label">功能模块</label><div class="ui-form-ctrls">          <select class="msg-service-id">          <% for(var i = 0, item; item = serviceList[i]; i++) { %>          <option value="<%=item.serviceid%>" <% if(type == "2" && serviceid == item.serviceid) { %> selected <% } %>><%-item.servicename%></option>          <% } %>           </select>          <input class="msg-serviceid-hidden" type="hidden" value="<%=serviceid%>" name="serviceid">    </div></div><% } %><% if(serviceList.length) { %>        <div class="ui-form-group msg-app-mod" <% if(type == "1" || type == "") { %> style="display:none" <% } %>>   <label class="ui-form-label">子功能模块</label><div class="ui-form-ctrls">          <select class="msg-pageurl-id">          <% if(!serviceid) { %>          <% for(var key in serviceList[0].pageconfig) { %>          <% if(serviceList[0].pageconfig[key].name) { %>          <option value="<%=key%>">          <%-serviceList[0].pageconfig[key].name%>          </option>          <% } %>           <% } %>           <% } else { %>           <% for(var i = 0, item; item = serviceList[i]; i++) { %>          <% if(serviceid == item.serviceid) { %>          <% for(var key in item.pageconfig) { %>          <% if(item.pageconfig[key].name) { %>          <option value="<%=key%>" <% if(type == "2" && urlid == key) { %> selected <% } %>>          <%-item.pageconfig[key].name%></option>          <% } %>          <% } %>           <% } %>          <% } %>          <% } %>            </select>          <input class="msg-urlid-hidden" type="hidden" value="<%=urlid%>" name="urlid">    </div></div><% } %>        <div class="ui-form-group"><% if(savebtn) { %>            <a href="javascript:;" class="ui-btn ui-btn-primary" data-event="msg_edit_save" ><%=savebtn%></a>             <% } %><% if(cancelbtn) { %><a href="javascript:;" class="ui-btn" data-event="msg_edit_cancel" ><%=cancelbtn%></a> <% } %></div></fieldset>  </form>',
                mutiItem: '<div class="mod-msg multi" data-id="<%=item.msgid%>"><% for(var i = 0, aItem; aItem = item["content"][i]; i++) { %>        <% if (i == 0) { %>        <div class="multi-first mod-msg-cover<% if(currentIndex == "0"){ %> active<% } %>" data-event="msg_webview_list_item" data-index="0">        <div style="width:272px; height:155px; overflow:hidden">            <% if (aItem.picurl) { %>                <img src="<%=aItem.picurl%>" style="width:100%">            <% } else {%>                <div style="background:#ececec; color:#c0c0c0; font-size:20px; text-align:center; line-height:155px">封面图片</div>            <% } %>        </div><h2> <% if (aItem.title) { %>            <%-aItem.title%>            <% } else { %>                标题                <% } %>            </h2>                <%=cover_content%>            </div>        <% } else { %>        <div class="mod-msg-item<% if(currentIndex == i){ %> active<% } %>" data-event="msg_webview_list_item" data-index="<%=i%>">        <% if (aItem.picurl) { %>                 <img src="<%=aItem.picurl%>" style="width:70px;height:70px">                <% } else {%>                <div style="float:right; width:70px; background:#ececec; color:#c0c0c0; font-size:14px; text-align:center; line-height:70px">缩略图</div>                <% } %>                <h2><%-aItem.title%></h2>        <%=cover_content%>            </div>        <% } %>        <% } %>        <a href="javascript:void(0);" class="add" id="addMsgItem" data-event="edit_msg_add_one"><span class="plus">+</span></a></div>',
                singleItem: '<div class="mod-msg" data-id="<%=item.msgid%>" ><div class="mod-msg-cover active" data-event="msg_webview_list_item" data-index="0" style="cursor: default;"><h2><% if (item.content[0].title) { %>    <%-item.content[0].title%>    <% } else {%>            标题            <% } %>    </h2>        <p class="date"><%=item.modifydate%></p>        <div style="width:272px; height:155px; overflow:hidden">    <% if (item.content[0].picurl) { %>        <img src="<%=item.content[0].picurl%>" style="width:100%">            <% } else {%>            <div style="background:#ececec; color:#c0c0c0; font-size:22px; text-align:center;line-height:155px">封面图片</div>            <% } %>        </div>        <% if (item.content[0].description) { %>                <p class="desc">                    <%-item.content[0].description%>                </p>            <% } %></div><a href="javascript:void(0);" class="add" id="addMsgItem" data-event="edit_msg_add_one"><span class="plus">+</span></a></div>',
                webview: "<%=list%>",
                picContent: '<% if (picurl) { %>        <div class="uploader" style="overflow:hidden">        <img src="<%=picurl%>" style="width:100%;">    </div>    <% } %>',
                picLoading: '    <div class="uploader" style="overflow:hidden">    <div style="margin-top:40px" class="pic-loading">        <img src="http://qzonestyle.gtimg.cn/qcloud/app/resource/ac/public/loading.gif">        </div>    </div>',
                cover: '<div class="mod-msg-options edit-msg-cover">    <a href="javascript:;" data-event="edit_msg_edit_item"><span class="icon-pencil"></span>编辑</a>    <a class="msg-ico-trash" href="javascript:;" data-event="edit_msg_del_item"><span class="icon-trash"></span>删除</a></div>',
                picErr: '    <div class="uploader" style="overflow:hidden">    <div style="color:#ff3300;margin-top:40px">文件上传失败</div>    <div style="color:#999"><%=errtip%></div>    </div>'
            },
            render: function(e) {
                I = 1, clearTimeout(k);
                var t = this,
                    i = {
                        renderTo: null,
                        mode: 0,
                        msgId: "",
                        msgItem: "",
                        saveBtn: {
                            text: "",
                            callback: null
                        },
                        cancelBtn: {
                            text: "",
                            callback: null
                        }
                    },
                    e = this.options = x.extend({}, i, e);
                if (0 == e.mode) y = {
                    content: [{}]
                }, w = 0, this.setMainContent();
                else if (1 == e.mode && (e.msgId || e.msgItem)) {
                    var n = function(e) {
                        y = C.cloneObject(e), w = 0, t.setMainContent()
                    };
                    e.msgItem ? n(e.msgItem) : T.getMsgById({
                        msgId: e.msgId
                    }, function(e) {
                        e && n(e)
                    })
                }
            },
            setMainContent: function() {
                var e = this,
                    t = this.options.renderTo;
                if (t) {
                    var i = y.content[w];
                    T.getServiceListHasPageConfig(function(a) {
                        e.serviceList = a, t.html(C.tmpl(e._tmpl.main, {
                            data: {
                                content: e.generateForm(i)
                            }
                        })), n = x("#msgEditForm"), h = x("#modMsgArrow"), b = x("#msgEditSimulator"), o = n.find(".pic-wrapper"), d = n.find(".msg-picurl-hidden"), s = n.find(".upload-btn"), r = n.find(".msg-content-type"), c = n.find(".msg-editor"), l = n.find(".msg-editor-hidden"), u = n.find(".msg-orig-link"), p = n.find(".msg-orig-link-hidden"), f = n.find(".msg-service-id"), m = n.find(".msg-serviceid-hidden"), g = n.find(".msg-pageurl-id"), v = n.find(".msg-urlid-hidden"), e.initFormWidget(), e.initSimulator(), e.addEvent(), k = setTimeout(function() {
                            I = 0
                        }, 500)
                    })
                }
            },
            getField: function(e, t) {
                return t && t[e] ? t[e] : ""
            },
            generateForm: function(e) {
                var t = this.options,
                    i = t.saveBtn && t.saveBtn.text ? t.saveBtn.text : "",
                    n = t.cancelBtn && t.cancelBtn.text ? t.cancelBtn.text : "",
                    a = C.tmpl(this._tmpl.form, {
                        title: this.getField("title", e),
                        description: this.getField("description", e),
                        content: this.getField("content", e),
                        type: this.getField("type", e),
                        url: this.getField("url", e),
                        author: this.getField("author", e),
                        picurl: this.getField("picurl", e),
                        piccontent: this.paintImageContent(this.getField("picurl", e)),
                        mutimod: y.content.length > 1,
                        serviceList: this.serviceList,
                        serviceid: this.getField("serviceid", e),
                        urlid: this.getField("urlid", e),
                        savebtn: i,
                        cancelbtn: n
                    });
                return a
            },
            getData: function() {
                return y
            },
            initFormWidget: function() {
                var e = this;
                if ("" == x.trim(c.html())) {
                    var t = navigator.userAgent.indexOf("Trident") > 0 ? "auto" : "407px",
                        i = new M.Create({
                            container: c[0],
                            floatToolbar: 0,
                            height: "180px",
                            width: t
                        }),
                        n = l.val();
                    n && i.setContent(n), c.data("editor", i)
                }
                s.find("form").length || e.initUploader()
            },
            initUploader: function() {
                var e = this;
                A.init({
                    button: s,
                    loading: function() {
                        o.html(e._tmpl.picLoading), e.reportClick("uploadfm")
                    },
                    formatSizeError: function(t) {
                        var i = 1 == t ? "文件格式错误" : "文件大小超出限制";
                        o.html(C.tmpl(e._tmpl.picErr, {
                            errtip: i
                        }))
                    },
                    onError: function(t) {
                        var i = t.uiMsg || "后台返回失败, 请重试";
                        o.html(C.tmpl(e._tmpl.picErr, {
                            errtip: i
                        }))
                    },
                    onLoad: function(t) {
                        var i = t[0];
                        e.setImageContent(i), e.updateFormInputData(), e.setWebview()
                    }
                })
            },
            setImageContent: function(e) {
                o.html(this.paintImageContent(e))
            },
            paintImageContent: function(e) {
                return C.tmpl(this._tmpl.picContent, {
                    picurl: e
                })
            },
            setImageVal: function() {
                var e = o.find("img"),
                    t = e.length ? e.attr("src") : "";
                o.find(".pic-loading").length && (t = ""), d.val(t)
            },
            reportClick: function(e) {
                var t = P.fragment,
                    i = "";
                /\/greeting/.test(t) ? i = "shoucigz" : /\/auto_reply/.test(t) ? i = "zdhf" : /\/keyword_reply/.test(t) && (i = "keyword"), i && F.click("glzx." + i + "." + e)
            },
            initSimulator: function() {
                var e = this;
                a = new E.View({
                    container: b[0],
                    data: e.paintWebview(),
                    model: "empty"
                }), a.addInterface({
                    edit_msg_edit_item: function() {
                        w = parseInt(x(this).closest("[data-index]").attr("data-index")), e.setFormContent()
                    },
                    edit_msg_del_item: function() {
                        var t = parseInt(x(this).closest("[data-index]").attr("data-index")),
                            i = y.content[t],
                            n = function() {
                                10 == y.content.length && _.show(), y.content.splice(t, 1), w = y.content[t] ? t : t - 1, e.setWebview(), e.toggleDes(), e.setFormContent()
                            };
                        i.title || i.picurl || i.content ? S.confirm("确认要删除这条图文消息吗?", function() {
                            n()
                        }) : n()
                    },
                    edit_msg_add_one: function() {
                        y.content.push({}), w = y.content.length - 1, e.setWebview(), e.toggleDes(), e.setFormContent(), 10 == y.content.length && _.hide()
                    }
                }), this.setWebview()
            },
            toggleDes: function() {
                var e = n.find(".msg-description");
                y.content.length > 1 ? e.hide() : this.showFoldInput(1)
            },
            toggleMsgType: function(e) {
                var t = n.find(".msg-orig-link-mod"),
                    i = n.find(".msg-text-mod"),
                    a = n.find(".msg-app-mod");
                "2" == e && this.serviceList.length ? (a.show(), i.hide(), t.hide()) : (i.show(), a.hide(), this.showFoldInput(2)), this.setFormOffset()
            },
            showFoldInput: function(e) {
                var t = y.content[w],
                    i = 1,
                    n = 1 == e ? "description" : "url";
                t[n] && (i = 0), this.toggleFoldInput(e, i)
            },
            toggleFoldInput: function(e, t, i) {
                var a = n.find(1 == e ? ".msg-description" : ".msg-orig-link-mod"),
                    r = a.eq(1 == t ? 0 : 1),
                    s = a.eq(1 == t ? 1 : 0);
                if (s.hide(), r.show(), i) {
                    var o = r.find('input[type="text"]');
                    o.length || (o = r.find("textarea")), o.focus()
                }
            },
            setFormContent: function() {
                var e = this,
                    t = y.content[w];
                e.toggleMsgType(t.type), U.hideAllErr(n), n.find("[name]").each(function(i, n) {
                    var a = n.getAttribute("name"),
                        r = t[a] || "";
                    switch (a) {
                        case "title":
                        case "description":
                        case "author":
                            n.value = r;
                            break;
                        case "picurl":
                            e.setImageContent(r);
                            break;
                        case "type":
                            r || (r = "1"), n.value = r;
                            break;
                        case "content":
                            c.data("editor").setContent(r);
                            break;
                        case "url":
                            u.val(r);
                            break;
                        case "serviceid":
                            e.echoServiceMod(t.serviceid, t.urlid)
                    }
                }), this.setFormOffset()
            },
            setFormOffset: function() {
                var e = n.outerHeight(),
                    t = 98 * w + 190,
                    i = -72,
                    a = 0 == w ? 90 : t + i;
                if (a + 40 > e) {
                    var r = t - e;
                    n.css("top", r), a = t - r + i
                } else n.css("top", 0);
                h.css("top", a), b.find(".active").removeClass("active"), b.find(".mod-msg > div").eq(w).addClass("active")
            },
            setWebview: function() {
                var e = y.content.length > 1 ? "paintMuti" : "paintSingle",
                    t = this[e]();
                a.loadData(this.paintWebview(t)), _ = x("#addMsgItem")
            },
            paintWebview: function(e) {
                return e = e || "", C.tmpl(this._tmpl.webview, {
                    list: e
                })
            },
            paintSingle: function() {
                var e = C.getModifyTime(y.modifytime);
                return e = e.split("-"), y.modifydate = e[1] + "月" + e[2] + "日", C.tmpl(this._tmpl.singleItem, {
                    item: y,
                    currentIndex: w
                })
            },
            paintMuti: function() {
                return C.tmpl(this._tmpl.mutiItem, {
                    item: y,
                    cover_content: this.paintCover(),
                    currentIndex: w
                })
            },
            paintCover: function() {
                return this._tmpl.cover
            },
            addEvent: function() {
                var e = this;
                L.addCommonEvent("click", {
                    msg_edit_cancel: function() {
                        var t = e.options.cancelBtn.callback;
                        t && t()
                    },
                    msg_edit_save: function() {
                        e.saveMsg(this)
                    },
                    edit_msg_add_orig_link: function() {
                        e.toggleFoldInput(2, 0, 1)
                    },
                    edit_msg_add_desc: function() {
                        e.toggleFoldInput(1, 0, 1)
                    }
                }), C.listenInput("msg_edit_form", function(t) {
                    {
                        var i = 200;
                        t.target || t.srcElement
                    }
                    e.keyupTime && clearTimeout(e.keyupTime), e.keyupTime = setTimeout(function() {
                        e.updateFormInputData(), e.setWebview()
                    }, i)
                }, function() {
                    x("#msgEditForm").length && e.updateFormInputData()
                }), r.change(function() {
                    e.toggleMsgType(this.value), e.updateFormInputData()
                }), f.change(function() {
                    e.childModChange(), e.updateFormInputData()
                }), g.change(function() {
                    e.updateFormInputData()
                })
            },
            childModChange: function(e) {
                for (var t, i = f.val(), n = "", a = 0; t = this.serviceList[a]; a++)
                    if (i == t.serviceid)
                        for (var r in t.pageconfig) {
                            var s = "";
                            e && r == e && (s = " selected"), t.pageconfig[r].name && (n += '<option value="' + r + '"' + s + ">" + B.escapeHTML(t.pageconfig[r].name) + "</option>")
                        }
                    g.html(n)
            },
            echoServiceMod: function(e, t) {
                f.val(e ? e : f.find("option").eq(0).val()), this.childModChange(t)
            },
            saveMsg: function(e, t) {
                var i = this,
                    a = x(e);
                if (!e || !a.hasClass("disabled")) {
                    i.updateFormInputData(1);
                    for (var r, s = i.options, o = function(e) {
                            w = e, i.setFormContent()
                        }, d = function() {
                            e && a.removeClass("disabled")
                        }, l = n.find('input[name="title"]'), p = n.find('textarea[name="description"]'), f = n.find('input[name="author"]'), m = n.find(".upload-btn"), g = 0; r = y.content[g]; g++) {
                        var v = x.trim(r.title),
                            h = x.trim(r.description),
                            b = x.trim(r.author),
                            _ = function(e, t, i) {
                                o(g);
                                var n = {
                                    tip: e,
                                    needFocus: 1,
                                    callback: function() {
                                        var e = x("#manageMain");
                                        e.scrollTop(t.offset().top + e.scrollTop() - j.getHeaderHeight() - 40)
                                    }
                                };
                                if ("img" == i && (n.evtType = "click"), "editor" == i) {
                                    var a = t.find(".ve-editor");
                                    n.evtTriggerObj = a, n.focusObj = a
                                }
                                return U.showErr(t, n)
                            };
                        if ("" == v) return _("请输入标题", l);
                        if (v.length > 64) return _("标题不能超过64个字", l);
                        if ("" != b && b.length > 8) return _("作者不能超过8个字", f);
                        if ("" != h && h.length > 120) return _("摘要不能超过120个字", p);
                        if ("" == r.picurl) return _("请插入图片", m, "img");
                        if ("1" == r.type) {
                            if ("" == r.content) return _("请输入内容", c, "editor");
                            if (r.content.replace(/<\/?[a-zA-Z]+[^><]*>/g, "").length > 2e4) return _("输入超过20000个字数限制", c, "editor")
                        }
                        if ("1" == r.type && "" != r.url && !$.test(r.url)) return _("请输入正确url,http://开头", u);
                        $.lastIndex = 0
                    }
                    e && a.addClass("disabled");
                    var I = s.msgItem ? s.msgItem.msgid : s.msgId;
                    T.updateMsg({
                        msgid: I,
                        msgtype: "2",
                        content: y.content
                    }, function(e) {
                        q.set(0), d();
                        var i = e.msgid ? e.msgid : "",
                            n = t || s.saveBtn.callback;
                        n && n(i)
                    }, function() {
                        d()
                    })
                }
            },
            updateFormInputData: function(e) {
                !e && !I && q.set(1);
                var t = this;
                y.content || (y.content = []);
                var i = y.content[w];
                i || (y.content[w] = {}), t.setImageVal();
                var a = r.val();
                if ("1" == a) {
                    var s = c.data("editor"),
                        o = s.isEmpty() ? "" : s.getContent();
                    l.val(o), p.val(u.val()), m.val(""), v.val("")
                } else "2" == a && (l.val(""), p.val(""), f.val() || f.val(f.find("option").eq(0).val()), g.val() || g.val(g.find("option").eq(0).val()), m.val(f.val()), v.val(g.val()));
                var d = t.getFormData(n.find("form"));
                "1" == a && (d.pageid = i.pageid), "2" == a && (d.productid = C.getProductId()), y.content[w] = d
            },
            getFormData: function(e) {
                var t = {};
                return e.find("[name]").each(function() {
                    var e = x(this);
                    e.closest(".uploadForm").length || (t[e.attr("name")] = e.val())
                }), t
            }
        };
    i.exports = D
}), define("manage/widget/menu_config/Button", function(e, t, i) {
    var n = e("$"),
        a = function(e) {
            this.subButtonList = [], n.extend(this, e)
        };
    i.exports = a
}), define("manage/widget/menu_config/ConfigDialog", function(e, t, i) {
    var n = e("$"),
        a = e("widget/dialog"),
        r = e("./ConfigDialog/tpl"),
        s = "",
        o = "",
        d = {
            confirm: function(e, t) {
                var i = n.Deferred(),
                    a = r.confirm({
                        msgs: t || []
                    });
                return this._showBox(e, a, {
                    ok: function() {
                        i.resolve()
                    },
                    cancel: function() {
                        i.reject()
                    }
                }), i
            },
            _showBox: function(e, t, i) {
                var r = !1;
                a.create(t, s, o, {
                    title: e,
                    button: {
                        "确定": function() {
                            i.ok && !1 === i.ok.call(i.context, a.contentEl) || (r = !0, a.hide())
                        }
                    }
                }), a.el.find("button").addClass("ui-btn-wid");
                var d = (new Date).getTime(),
                    c = n(document).on("dialogHide." + d, function() {
                        c.off("dialogHide." + d), r || i.cancel && i.cancel.call(i.context)
                    });
                return a.el.find("button.ui-btn-primary").focus(), a.contentEl
            }
        };
    i.exports = d
}), define("manage/widget/menu_config/ConfigDialog/tpl", function(e, t, i) {
    i.exports = {
        confirm: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                };
            return i('<span class="ui-alert-icon error"></span>\r\n			    <div class="ui-alert-title align-left">\r\n			        <p>'), i(e.msgs[0]), i("            "), e.msgs[1] && (i("                <br>"), i(e.msgs[1]), i("            ")), i("        </p>\r\n			    </div>"), t.join("")
        },
        __escapeHtml: function() {
            var e = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                t = /[&<>'"\/]/g;
            return function(i) {
                return "string" != typeof i ? i : i ? i.replace(t, function(t) {
                    return e[t] || t
                }) : ""
            }
        }()
    }
}), define("manage/widget/menu_config/Constants", function(e, t, i) {
    var n = {};
    n.LV1_ITEM_LIMIT = 3, n.LV1_ITEM_LIMIT_MSG = "您最多可以创建" + n.LV1_ITEM_LIMIT + "个一级菜单", n.LV2_ITEM_LIMIT = 5, n.LV2_ITEM_LIMIT_MSG = "您最多可以创建" + n.LV2_ITEM_LIMIT + "个二级菜单", n.LV1_ITEM_TEXT_LIMIT = 4, n.LV1_ITEM_TEXT_LIMIT_MSG = "不超过" + n.LV1_ITEM_TEXT_LIMIT + "个汉字或" + 2 * n.LV1_ITEM_TEXT_LIMIT + "个字母", n.LV2_ITEM_TEXT_LIMIT = 7, n.LV2_ITEM_TEXT_LIMIT_MSG = "不超过" + n.LV2_ITEM_TEXT_LIMIT + "个汉字或" + 2 * n.LV2_ITEM_TEXT_LIMIT + "个字母", n.WECHAT_AUTH_WIKI_URL = "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=wxverify/faq_tmpl&lang=zh_CN&token=1684146237", n.STATUS_WECHAT_NOT_BIND = 1, n.STATUS_WECHAT_NO_APPID = 2, n.STATUS_WECHAT_NO_APPID_MSG = "您的公众号无法正常使用自定义菜单功能，可能由以下原因导致：<br>1. 公众号不是服务号或通过认证的订阅号；<br>2. 手工绑定公众号时没有填写正确的AppID和AppSecret。", i.exports = n
}), define("manage/widget/menu_config/FailedDialog", function(e) {
    var t = (e("$"), e("widget/dialog")),
        i = e("./FailedDialog/tpl"),
        n = e("./Constants"),
        a = function() {};
    return a.prototype = {
        _hidden: !1,
        show: function(e, a) {
            if ("INIT" !== e) {
                var r, s, o = this;
                a === n.STATUS_WECHAT_NO_APPID ? "INIT" === e ? (r = "公众账号未认证", s = n.STATUS_WECHAT_NO_APPID_MSG) : (r = "更新失败", s = n.STATUS_WECHAT_NO_APPID_MSG) : (r = "更新失败", s = "更新失败，请稍后重试"), t.create(i.failed({
                    title: r,
                    msg: s
                }), "", "", {
                    title: r,
                    closeIcon: 1,
                    defaultCancelBtn: 0,
                    button: {
                        "我知道了": function() {
                            t.hide()
                        }
                    }
                }), t.el.find("button").addClass("ui-btn-wid"), t.contentEl.children().on("click", "a", function() {
                    0 === this.href.indexOf("http") && o.hide()
                }), this._hidden = !1
            }
        },
        hide: function() {
            this._hidden || (t.hide(), this._hidden = !0)
        }
    }, a
}), define("manage/widget/menu_config/FailedDialog/tpl", function(e, t, i) {
    i.exports = {
        failed: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                };
            return i('<div>\r\n			        <span class="ui-alert-icon error"></span>\r\n			        <div class="ui-alert-title">\r\n			            <h3>'), i(e.title), i("</h3>\r\n			            <p>"), i(e.msg), i("</p>\r\n			        </div>\r\n			    </div>"), t.join("")
        },
        __escapeHtml: function() {
            var e = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                t = /[&<>'"\/]/g;
            return function(i) {
                return "string" != typeof i ? i : i ? i.replace(t, function(t) {
                    return e[t] || t
                }) : ""
            }
        }()
    }
}), define("manage/widget/menu_config/MenuConfig", function(e, t, i) {
    var n = e("$"),
        a = e("lib/util"),
        r = e("lib/reporter"),
        s = (e("widget/dialog"), e("widget/simulator/simulator")),
        o = e("./MenuConfig/tpl"),
        d = e("./MenuItem"),
        c = e("./Package"),
        l = e("./Constants"),
        u = e("./FailedDialog"),
        p = e("main/pagemanage"),
        f = e("widget/formchange/formchange"),
        m = {
            PACKAGE: {
                id: "PACKAGE",
                name: "使用套餐"
            },
            URL: {
                id: "URL",
                name: "使用URL"
            }
        },
        g = ([m.PACKAGE], function() {
            this.itemList = [], this.packageList = [], this._seq = (new Date).getTime()
        });
    g.prototype = {
        render: function(e) {
            this.$content = n(o.main()).appendTo(e.empty()), this.previewImageCache = {}
        },
        init: function(e, t, i, a) {
            this.packageList = n.map(e, function(e) {
                return e instanceof c ? e : new c(e)
            }), this._initDom(i, a), this.isConfigurable() && this.addItemList(t)
        },
        _initDom: function(e, t) {
            if (this.isConfigurable()) {
                var i = {};
                this.$editView = n(o.editView()).appendTo(this.$content.empty()), this.$editView.find("[data-id]").each(function(e, t) {
                    var n = t.getAttribute("data-id");
                    i[n] ? i[n].push(t) : i[n] = [t]
                }), this.$addItemLv1 = n(i.addItemLv1), this.$menuList = n(i.menuList), this.$simulatorView = n(i.simulatorView), this.$simulatorInner = n(i.simulatorInner), this._events(), e && !t && this.showFailed("INIT", l.STATUS_WECHAT_NO_APPID)
            } else {
                var a = this.hasPackages(),
                    r = a ? "您所购买的套餐不支持自定义菜单" : "您尚未购买套餐";
                this.$content.html(o.cannotEdit({
                    msg: r
                }))
            }
        },
        addItemList: function(e, t, i) {
            var a = this,
                r = t ? 2 : 1;
            if (e = this._convertItems(e, t), 2 === r ? t.subItemList = t.subItemList.concat(e) : this.itemList = this.itemList.concat(e), 1 === a.packageList.length) {
                var s = a.packageList[0].id;
                n.each(e, function(e, t) {
                    t.curType && "PACKAGE" !== t.curType || t.curPackage || (t.curType = "PACKAGE", t.curPackage = s, t.subItemList.length && n.each(t.subItemList, function(e, t) {
                        t.curType && "PACKAGE" !== t.curType || t.curPackage || (t.curType = "PACKAGE", t.curPackage = s)
                    }))
                })
            }
            2 === r && t.rebuildItem(t), this._updateItemsDOM(e, t, i), this.rebuildPreview(), this._updateAddButton(t)
        },
        removeItems: function(e, t, i) {
            for (var n = t ? 2 : 1, a = e.slice(), r = t ? t.subItemList : this.itemList, s = e.length - 1; s >= 0; s--)
                for (var o = r.length - 1; o >= 0; o--) r[o] === e[s] && (r.splice(o, 1), e.splice(s, 1));
            this._removeItemsDOM(a, t), 1 === n ? this._updateAddButton() : t.rebuildItem(), !1 !== i && this.rebuildPreview()
        },
        getPackageList: function() {
            return this.packageList
        },
        serialize: function(e) {
            var t = this,
                i = e ? e.subItemList : this.itemList;
            return n.map(i, function(e) {
                var i;
                return e.subItemList.length ? (i = t._serializeButton(e), i.sub_button = n.map(e.subItemList, function(e) {
                    return t._serializeButton(e)
                })) : i = t._serializeButton(e), i
            })
        },
        validate: function() {
            var e, t, i = [];
            return n.each(this.itemList, function(a, r) {
                e = r.validate(), e && r.rebuildItem(), t = [], r.subItemList.length && n.each(r.subItemList, function(e, i) {
                    var n = i.validate();
                    n && (i.rebuildItem(), t[e] = n)
                }), (e || t.length) && (!e && (e = {}), t.length && (e.subErrs = t), i[a] = e)
            }), i
        },
        _serializeButton: function(e) {
            var t = e.curButton,
                i = {
                    name: e.text
                };
            return "URL" == e.curType ? (i.url = e.curURL, i.type = "view", i.menuid = t ? t.id : this.uniqueId()) : t && (i.menuid = t.id, e.subItemList.length || (t.key ? (i.key = t.key, i.serviceid = t.serviceId, i.type = "click") : t.url ? (i.url = t.url, i.type = "view", i.providerid = t.providerId) : t.content ? (i.msgid = t.content, i.type = "click") : i.type = t.type)), i
        },
        uniqueId: function(e) {
            e = e || 32;
            for (var t = [], i = "0123456789abcdef", n = 0; e > n; n++) t[n] = i.substr(Math.floor(16 * Math.random()), 1);
            return t.join("")
        },
        _removeItemsDOM: function(e, t) {
            var i = t ? 2 : 1,
                a = n();
            n.each(e, function(e, t) {
                1 === i && t.subItemList.length && n.each(t.subItemList, function(e, t) {
                    a = a.add(t.getEl())
                }), a = a.add(t.getEl())
            }), a.remove()
        },
        _updateItemsDOM: function(e, t, i) {
            var a = this,
                r = [],
                s = n(),
                o = t ? 2 : 1;
            if (e && (n.each(e, function(e, t) {
                    t.setMenuConfig(a);
                    var i = !!t.getEl();
                    t.rebuildItem(), i || (r.push(t), s = s.add(t.getEl()))
                }), r.length)) {
                if (1 === o) s.length && a.$menuList.append(s), r.length && n.each(r, function(e, t) {
                    t.subItemList.length && a._updateItemsDOM(t.subItemList, t)
                });
                else if (2 === o) {
                    var d = t.getEl().nextUntil('[data-lv="1"]').last();
                    d[0] ? d.after(s) : t.getEl().after(s), t.curButton && (t.set("curButton", null), t.rebuildItem())
                }
                i && s.first().find("input").focus()
            }
        },
        _events: function() {
            var e = this;
            e.$addItemLv1.on("click", function() {
                var t = n(this);
                return r.click("glzx.menu.build"), e.itemList.length >= l.LV1_ITEM_LIMIT && !a.isMobile() ? (t.attr("data-tooltip", l.LV1_ITEM_LIMIT_MSG), void e.tooltip(t, l.LV1_ITEM_LIMIT_MSG)) : void(t.is(".disabled") || e.addItemList([{}], null, !1))
            }), e.$simulatorInner.on("mousedown", function(t) {
                var i = n(t.target);
                0 === i.closest('[data-id="previewPops"]').length && e.$simulatorInner.find('[data-id="previewPops"]').children().hide()
            }), e.$simulatorView.on("click", '[data-action="showItemLv2"]', function(t) {
                t.preventDefault();
                var i = n(this),
                    a = parseInt(i.attr("data-index")),
                    s = e.itemList[a];
                e.preview(s), e._isToPreviewItem(s) && r.click("glzx.menu.preview")
            }), e.$simulatorView.on("click", '[data-action="preview"]', function(t) {
                t.preventDefault();
                var i = n(this),
                    a = parseInt(i.attr("data-lv1-index")),
                    s = parseInt(i.attr("data-lv2-index")),
                    o = e.itemList[a].subItemList[s];
                e.preview(o), e._isToPreviewItem(o) && r.click("glzx.menu.preview")
            }), e.$simulatorView.on("click", '[data-id="previewBack"]', function(t) {
                t.preventDefault(), e._clearSimulatorPreview()
            });
            var t = e.$simulatorView.offset(),
                i = t.top,
                s = t.left,
                o = p.getScrollEl().offset().top,
                d = i - o;
            p.getScrollEl().on("scroll." + e._seq, function() {
                var t = n(this),
                    i = t.scrollTop() > d;
                e.$simulatorView.css({
                    position: i ? "fixed" : "",
                    top: i ? o : "",
                    left: i ? s : "",
                    right: i ? "auto" : ""
                })
            }), e.$editView.on("mouseenter", "[data-tooltip]", function() {
                e.tooltip(n(this), this.getAttribute("data-tooltip"))
            }).on("mouseleave", "[data-tooltip]", function() {
                e.tooltip(n(this), null)
            })
        },
        hasPackages: function() {
            return this.packageList.length > 0
        },
        hasDefaultButtons: function() {
            for (var e = this.packageList, t = 0, i = e.length; i > t; t++)
                for (var n = e[t].buttonList, a = 0, r = n.length; r > a; a++) {
                    var s = n[a];
                    if (s.subButtonList.length) return !0
                }
            return !1
        },
        isConfigurable: function() {
            return this.hasPackages()
        },
        rebuildPreview: function(e) {
            this._getSimulator().loadData(o.simulatorInner({
                menuConfig: this,
                productName: a.getProductName()
            })), this._initPreview ? !e && f.set(1) : this._initPreview = !0
        },
        preview: function(e) {
            var t = this,
                i = 1 === e.lv ? t.itemList : e.getParentItem().subItemList,
                a = e.curButton,
                r = t.$simulatorInner,
                s = r.find('[data-id="previewPops"]').children(),
                o = function(i) {
                    s.hide();
                    var n = i && i.name;
                    "URL" == e.curType ? (t._showLinkTxt(e.curURL || "", r.find('[data-id="previewContent"]')), r.css("background", "none"), n = e.text) : (t._loadImage(i && i.imgURL, r.find('[data-id="previewContent"]')), r.css("background", i && i.imgURL ? "none" : "")), r.find('span[data-id="previewTitle"]').text(n || "[未命名]"), r.find('a[data-id="previewBack"]').show()
                };
            if (1 === e.lv)
                if (e.subItemList.length) {
                    var d = r.width(),
                        c = i.length,
                        l = d / c;
                    s.each(function(t, a) {
                        var r = n(a);
                        if (i[t] === e) {
                            var s, o, u, p, f = r.css({
                                    visibility: "hidden",
                                    display: "block"
                                }).outerWidth(),
                                m = 1 === c ? "middle" : 0 === t ? "left" : t === c - 1 ? "right" : "middle";
                            switch (m) {
                                case "left":
                                    s = Math.max(5, (l - f) / 2), o = "auto", u = Math.min(l, f) / 2;
                                    break;
                                case "middle":
                                    s = (d - f) / 2, o = "auto", u = f / 2;
                                    break;
                                case "right":
                                    s = "auto", o = Math.max(5, (l - f) / 2), p = Math.min(l, f) / 2
                            }
                            r.css({
                                left: s,
                                right: o,
                                visibility: ""
                            }), r.find(".arrow").css({
                                left: u ? u - 5 : "auto",
                                right: p ? p - 5 : "auto"
                            })
                        } else r.hide()
                    })
                } else o(a);
            else o(a)
        },
        showFailed: function(e, t) {
            this._failedDialog || (this._failedDialog = new u({})), this._failedDialog.show(e, t)
        },
        _convertItems: function(e, t) {
            return t ? n.map(e, function(e) {
                return e = d.fromObject(e), e.lv = 2, e
            }) : n.map(e, function(e) {
                return e.subItemList && (e.subItemList = n.map(e.subItemList, function(e) {
                    return d.fromObject(e)
                })), e = d.fromObject(e)
            })
        },
        _clearSimulatorPreview: function() {
            this.$simulatorInner.css("background", ""), this.rebuildPreview(!0)
        },
        tooltip: function(e, t) {
            if (t) {
                this.$tipEl && this.$tipEl.remove();
                var i = this.$tipEl = n('<div class="ui-tip"/>').appendTo(e.offsetParent()),
                    a = e.position();
                i.text(t).css({
                    display: "block",
                    top: a.top + e.outerHeight() + 5 + "px",
                    left: a.left - 15 + "px"
                })
            } else this.$tipEl && this.$tipEl.remove()
        },
        _updateAddButton: function(e) {
            var t = e ? 2 : 1;
            if (1 === t) {
                var i = this.itemList.length >= l.LV1_ITEM_LIMIT;
                this.$addItemLv1.toggleClass("disabled", i), i ? this.$addItemLv1.attr("data-tooltip", l.LV1_ITEM_LIMIT_MSG) : this.$addItemLv1.removeAttr("data-tooltip")
            } else e.updateAddButton()
        },
        _loadImage: function(e, t) {
            if (e) {
                var i = this.previewImageCache,
                    a = i[e];
                a || (a = new Image, a.src = e, a.style.width = "100%", i[e] = a);
                var r = n(i[e]).clone();
                t.empty().append(r)
            } else t.empty()
        },
        _showLinkTxt: function(e, t) {
            t.empty().append(o.linkText({
                url: e
            }))
        },
        _getSimulator: function() {
            return this.simulatorInst || (this.simulatorInst = new s.View({
                container: this.$simulatorInner[0],
                data: ""
            })), this.simulatorInst
        },
        _isToPreviewItem: function(e) {
            return 0 === e.subItemList.length
        }
    }, i.exports = g
}), define("manage/widget/menu_config/MenuConfig/tpl", function(e, t, i) {
    i.exports = {
        main: function() {
            var e = [],
                t = function(t) {
                    e.push(t)
                };
            return t("<div>\r\n			    </div>"), e.join("")
        },
        editView: function() {
            var e = [],
                t = function(t) {
                    e.push(t)
                };
            return t('<div class="app-menu">\r\n			\r\n			        <!-- 菜单列表 -->\r\n			        <table data-id="table" class="ui-table ui-table-bordered app-menu-edit">\r\n			            <colgroup>\r\n			                <col style="width: 216px">\r\n			                <col>\r\n			                <col>\r\n			                <col>\r\n			            </colgroup>\r\n			            <thead>\r\n			            <tr>\r\n			                <th class="create"><span class="title">菜单列表</span>\r\n			                    <button data-id="addItemLv1" type="button" class="ui-btn">新建</button>\r\n			                </th>\r\n			                <th>绑定菜单功能</th>\r\n			            </tr>\r\n			            </thead>\r\n			            <tbody data-id="menuList">'), t('            </tbody>\r\n			        </table>\r\n			\r\n			        <!-- 手机预览 -->\r\n			        <div data-id="simulatorView" class="app-menu-preview">\r\n			            <h3>预览<span>（此处仅显示预览示意图）</span></h3>\r\n			            <div data-id="simulatorInner" class="mod-mobile">\r\n			            </div>\r\n			        </div>\r\n			    </div>'), e.join("")
        },
        cannotEdit: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                };
            return i('<div class="app-menu">\r\n			        <div class="app-menu-disabled">'), i(e.msg), i("</div>\r\n			    </div>"), t.join("")
        },
        simulatorInner: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                },
                n = e.menuConfig,
                a = n.itemList,
                r = e.productName,
                s = ["sub-menu-left", "sub-menu-middle", "sub-menu-right"],
                o = s[s.length - 1];
            if (i('        <div>\r\n			            <div class="mod-mobile-con">\r\n			                <!-- 预览中间区域 -->\r\n			                <div data-id="previewContent" class="wx-top wx-bottom">\r\n			                </div>\r\n			            </div>\r\n			            <!-- 标题 -->\r\n			            <div class="mod-mobile-wxheader">\r\n			                <a data-id="previewBack" style="display:none" class="mod-mobile-return" href="#">返回</a>\r\n			                <span data-id="previewTitle">'), i(this.__escapeHtml(r)), i("</span>\r\n			            </div>"), a.length) {
                i('                <!-- 底部 -->\r\n			                <div class="mod-mobile-wxfooter">\r\n			                    <!-- 二级菜单 -->\r\n			                    <div data-id="previewPops" class="sub-menu">');
                for (var d = 0, c = a.length; c > d; d++) {
                    var l = a[d].subItemList;
                    i('                            <div class="ui-popover top '), i(s[d] || o), i('">\r\n			                                <div class="arrow"></div>\r\n			                                <div class="ui-popover-content">');
                    for (var u = 0, p = l.length; p > u; u++) i('                                        <a data-action="preview" data-lv1-index="'), i(d), i('" data-lv2-index="'), i(u), i('" href="#">'), i(this.__escapeHtml(l[u].getTextWithTail() || "[未命名]")), i("</a>");
                    i("                                </div>\r\n			                            </div>")
                }
                i('                    </div>\r\n			                    <!-- 一级菜单 -->\r\n			                    <ul class="top-menu has-menu-'), i(a.length), i('">');
                for (var d = 0, c = a.length; c > d; d++) i('                            <li><a data-action="showItemLv2" data-index="'), i(d), i('" href="#">'), i(this.__escapeHtml(a[d].getTextWithTail() || "[未命名]")), i("</a></li>");
                i("                    </ul>\r\n			                </div>")
            }
            return i("        </div>"), t.join("")
        },
        linkText: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                };
            return i('<div style="text-align:center;height: 140px;padding: 120px 10px 0;word-wrap: break-word;overflow: hidden;">\r\n			        <h3 style="font-size:16px;color:#999">网页链接</h3>\r\n			        <a href="'), i(e.url), i('" target="_blank">'), i(e.url), i("</a>\r\n			    </div>"), t.join("")
        },
        __escapeHtml: function() {
            var e = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                t = /[&<>'"\/]/g;
            return function(i) {
                return "string" != typeof i ? i : i ? i.replace(t, function(t) {
                    return e[t] || t
                }) : ""
            }
        }()
    }
}), define("manage/widget/menu_config/MenuItem", function(e, t, i) {
    var n = e("$"),
        a = (e("lib/util"), e("lib/reporter")),
        r = e("lib/text"),
        s = e("lib/collections"),
        o = (e("lib/event"), e("widget/dialog"), e("./ConfigDialog")),
        d = e("./Constants"),
        c = e("./MenuItem/tpl"),
        l = e("main/pagemanage"),
        u = e("widget/selector/selector"),
        p = {
            text: null,
            curType: null,
            curPackage: null,
            curButton: null,
            curURL: null,
            curMsg: null,
            subItemList: []
        },
        f = 1,
        m = function(e) {
            this.subItemList = [], n.extend(this, p, e), this.menuConfig = null, this.error = null, this.lv = 1, this.subItemList.length && n.each(this.subItemList, function(e, t) {
                t.menuConfig = null, t.lv = 2, t.subItemList = []
            })
        };
    m.prototype = {
        setMenuConfig: function(e) {
            this.menuConfig = e, n.each(this.subItemList, function(t, i) {
                i.menuConfig = e
            })
        },
        getEl: function() {
            return this.$el && this.$el.filter("*:eq(0)")
        },
        set: function(e, t, i, n) {
            this[e] = t, this.$el && ("text" === e || i && this.rebuildItem(this, n))
        },
        setText: function(e) {
            this.set("text", e, !1, !1), this.menuConfig.rebuildPreview()
        },
        setUrl: function(e) {
            this.set("curURL", e, !1, !1)
        },
        getTextWithTail: function() {
            return r.byteLenSub(this.text, 1 + (1 === this.lv ? d.LV1_ITEM_TEXT_LIMIT : d.LV2_ITEM_TEXT_LIMIT))
        },
        remove: function() {
            var e = this.getParentItem();
            this.menuConfig.removeItems([this], e, !1), e && !e.subItemList.length && e.rebuildItem(), this.menuConfig.rebuildPreview()
        },
        validate: function() {
            var e = this.curType,
                t = {};
            if (this.text) {
                var i = r.strByteLen(this.text);
                1 === this.lv ? i > 2 * d.LV1_ITEM_TEXT_LIMIT && (t.text = d.LV1_ITEM_TEXT_LIMIT_MSG) : 2 === this.lv && i > 2 * d.LV2_ITEM_TEXT_LIMIT && (t.text = d.LV2_ITEM_TEXT_LIMIT_MSG)
            } else t.text = "请输入菜单名称";
            switch (e) {
                case "PACKAGE":
                    this.subItemList.length || this.curButton || (t.curButton = "请选择功能模块");
                    break;
                case "URL":
                    this.curURL ? (/^https?:\/\//.test(this.curURL) || (this.curURL = "http://" + this.curURL), /https?:\/\/(?:[\w\-]+\.)+\w+(?:\/[^'"\s\b<>]*)?/gi.test(this.curURL) || (t.curURL = "URL格式不正确"), this.curURL.length > 240 && (t.curURL = "URL不能超过240个字符")) : t.curURL = "请输入URL"
            }
            return this.error = !n.isEmptyObject(t) && t, this.error
        },
        rebuildItem: function(e, t) {
            var i, a = this;
            i = e && e !== this ? n.extend({}, this, e) : this;
            var r = this._getBtnLv1List(i.curPackage),
                s = n(c.item({
                    item: i,
                    btnLv1List: r,
                    LV1_ITEM_TEXT_LIMIT: d.LV1_ITEM_TEXT_LIMIT,
                    LV2_ITEM_TEXT_LIMIT: d.LV2_ITEM_TEXT_LIMIT_MSG,
                    LV2_ITEM_LIMIT: d.LV2_ITEM_LIMIT
                }));
            a.$el && a.$el.replaceWith(s), a.$el = s, a.$curButton = a.$el.find('[data-field="curButton"]'), a.$selector = a.$curButton.nextAll("ul"), a.$curType = a.$el.find('[data-field="curType"]'), a.$curUrl = a.$el.find('[data-field="curURL"]'), a._initEvents();
            try {
                t && a.$el.find('[data-field="' + t + '"]').focus()
            } catch (o) {}
        },
        updateAddButton: function() {
            var e = this.subItemList.length >= d.LV2_ITEM_LIMIT,
                t = this.getEl().find('[data-action="addItemLv2"]'),
                i = t.find("i");
            i.toggleClass("disabled", e), e ? t.attr("data-tooltip", d.LV2_ITEM_LIMIT_MSG) : t.removeAttr("data-tooltip")
        },
        _initEvents: function() {
            var e = this,
                t = e.getEl(),
                i = e.$curButton;
            e.$curType.length && (e.typeSelector = new u(e.$curType), e.typeSelector.change(function() {
                "0" == this.val() ? (e.$curButton.parent().show(), e.$curUrl.hide(), e.curType = "PACKAGE") : "1" == this.val() && (e.$curButton.parent().hide(), e.$curUrl.show(), e.curType = "URL"), e.menuConfig.rebuildPreview(), e.menuConfig.preview(e)
            })), t.on("change", '[data-field="text"]', function() {
                e.setText(n.trim(this.value))
            }), t.on("focusin", "[data-field]", function() {
                e._clearError(this.getAttribute("data-field"));
                var t = n(this);
                t.data("val", t.val())
            }), t.on("focusout", '[data-field="text"],[data-field="curURL"]', function() {
                var t = this.getAttribute("data-field");
                if (e.validate(t), e.error) e._markError(t);
                else {
                    var i = n(this);
                    "curURL" == i.attr("data-field") && i.val() != i.data("val") && (e.menuConfig.rebuildPreview(), e.menuConfig.preview(e))
                }
            }), t.on("change", '[data-field="curURL"]', function() {
                e.setUrl(n.trim(this.value))
            }), t.on("click", '[data-action="remove"]', function(t) {
                t.preventDefault(), o.confirm("确认删除", ["确定要删除此菜单？", e.subItemList.length ? "该菜单下的二级菜单也将一并被删除" : ""]).done(function() {
                    e.remove()
                }), a.click("glzx.menu.delete")
            }), t.on("click", '[data-action="addItemLv2"]', function(t) {
                t.preventDefault();
                var i = n(this);
                if (a.click("glzx.menu.build"), e.subItemList.length >= d.LV2_ITEM_LIMIT) return i.attr("data-tooltip", d.LV2_ITEM_LIMIT_MSG), void e.menuConfig.tooltip(i, d.LV2_ITEM_LIMIT_MSG);
                if (!i.is(".disabled")) {
                    var r = function() {
                        e.menuConfig.addItemList([{}], e, !1)
                    };
                    e.curButton || e.curURL ? o.confirm("确认新增", ["当前一级菜单已设置内容，<br>新增二级菜单后，已设置的内容将被清除"]).done(r) : r()
                }
            }), i.on("click", function() {
                e._toggleSelector(!0)
            }), t.on("click", '[data-action="choiceButton"]', function(t) {
                t.preventDefault();
                var i = n(this),
                    a = i.attr("data-lv1-index"),
                    r = i.attr("data-lv2-index"),
                    s = e._getBtnLv1List(e.curPackage),
                    o = s[a],
                    d = o && o.subButtonList || [],
                    c = d[r],
                    l = c || o;
                l && (e._toggleSelector(!1), e.set("curButton", l), e.rebuildItem(null, "curButton"), e.menuConfig.rebuildPreview(), e.menuConfig.preview(e))
            }), t.on("keydown", '[data-field="curButton"],[data-action="choiceButton"]', function(t) {
                var i = t.which;
                if (38 === i || 40 === i) {
                    var a = n(this),
                        r = a.is('[data-action="choiceButton"]'),
                        s = r ? a.closest('ul[data-name="buttonSelector"]') : a.nextAll("ul");
                    e._switchSelectorFocus(r, s, i)
                }
            })
        },
        _getBtnLv1List: function(e) {
            var t = s.first(this.menuConfig.getPackageList(), function(t) {
                return t.id = e
            });
            return t ? t.buttonList : []
        },
        _getBtnLv2List: function(e, t) {
            if (t)
                for (var i = this._getBtnLv1List(e), n = 0, a = i.length; a > n; n++) {
                    var r = i[n];
                    if (r.id == t) return r.subButtonList || []
                }
            return []
        },
        getParentItem: function() {
            if (2 === this.lv)
                for (var e = this.menuConfig.itemList, t = 0, i = e.length; i > t; t++)
                    for (var n = e[t], a = 0, r = n.subItemList.length; r > a; a++) {
                        var s = n.subItemList[a];
                        if (s === this) return n
                    }
        },
        _toggleSelector: function(e) {
            var t = this,
                i = t.$selector,
                a = i.parent(),
                r = t.eventId || (t.eventId = "click.hideMenuItemSelector" + f++),
                s = n(document.body).off(r),
                e = "boolean" == typeof e ? e : !t.visible;
            if (t.visible = e, e) {
                var o = l.getScrollEl(),
                    d = o.offset().top,
                    c = o.height() + d;
                n(".ui-dropdown-type.open").removeClass("open up"), a.addClass("open");
                var u = i.outerHeight(),
                    p = i.offset().top,
                    m = p + u,
                    g = d > p - 35 - u,
                    v = m > c,
                    h = "down";
                g ? h = "down" : v && (h = "up"), a.addClass("up" === h ? "up" : ""), setTimeout(function() {
                    s.on(r, function(e) {
                        var a = n(e.target),
                            s = a.closest(i.parent()).length > 0;
                        s || (t._toggleSelector(!1), n(document.body).off(r))
                    })
                }, 0)
            } else a.removeClass("open up")
        },
        _switchSelectorFocus: function(e, t, i) {
            if (38 === i || 40 === i) {
                var a = this,
                    r = t.find("ul > li");
                if (!r.length) return;
                if (e || a._toggleSelector(!0), 1 === r.length) return void r.children("a").focus();
                for (var s, o = void 0, d = 0, c = r.length; c > d; d++)
                    if (r.eq(d).is("[data-current]")) {
                        o = d;
                        break
                    }
                38 === i ? s = o > 0 && r[o - 1] ? n(r[o - 1]) : r.last() : 40 === i && (s = o < r.length - 1 && r[o + 1] ? n(r[o + 1]) : r.first()), r.removeAttr("data-current"), s.attr("data-current", 1).children("a").focus()
            }
        },
        _clearError: function(e) {
            if (this.error) {
                delete this.error[e], n.isEmptyObject(this.error) && (this.error = null);
                var t = this.getEl().find('[data-field="' + e + '"]');
                t.siblings("[data-err-tip]").hide(), t.removeClass("err-check error"), t.parent().removeClass("error")
            }
        },
        _markError: function(e) {
            if (this.error) {
                var t = this.getEl().find(e ? '[data-field="' + e + '"]' : "[data-field]");
                for (var i in this.error)
                    if (!e || e === i) {
                        var n = this.error[i],
                            a = t.filter('[data-field="' + i + '"]');
                        a.siblings("[data-err-tip]").html(n).css("display", ""), a.addClass("curButton" === i ? "err-check" : "error"), a.parent().addClass("error")
                    }
            }
        }
    }, m.fromObject = function(e) {
        return e instanceof m || (e = new m(e)), e
    }, i.exports = m
}), define("manage/widget/menu_config/MenuItem/tpl", function(e, t, i) {
    i.exports = {
        item: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                };
            return i(1 === e.item.lv ? this.itemLv1(e) : this.itemLv2(e)), i(""), t.join("")
        },
        itemLv1: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                },
                n = e.item,
                a = (n.error, n.error && n.error.text || ""),
                r = 2 * e.LV1_ITEM_TEXT_LIMIT,
                s = n.subItemList.length >= e.LV2_ITEM_LIMIT;
            return i('    <tr data-lv="1" class="top-menu">\r\n			        <td class="menu '), i(a && "error"), i('">\r\n			            <input data-field="text" class="ui-input-small '), i(a && "err-check"), i('" type="text"\r\n			                   value="'), i(this.__escapeHtml(n.text)), i('" maxlength="'), i(r), i('" placeholder="请输入菜单名称"\r\n			            ><a data-action="addItemLv2" class="link-icon" href="#"><i class="icon-plus '), i(s ? "disabled" : ""), i('"></i></a\r\n			            ><span data-err-tip class="ui-help-float" style="'), i(a ? "" : "display:none"), i('">'), i(a), i('</span>\r\n			        </td>\r\n			        <td class="bind">'), i(this.selector(e)), i("            "), i(this.opts()), i("        </td>\r\n			    </tr>"), t.join("")
        },
        itemLv2: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                },
                n = e.item,
                a = (n.error, n.error && n.error.text),
                r = 2 * e.LV2_ITEM_TEXT_LIMIT;
            return i('    <tr data-lv="2" class="sub-menu">\r\n			        <td class="menu '), i(a && "error"), i('">\r\n			            <input data-field="text" class="ui-input-small '), i(a && "err-check"), i('" type="text"\r\n			                   value="'), i(this.__escapeHtml(n.text)), i('" maxlength="'), i(r), i('" placeholder="请输入菜单名称"\r\n			            ><span data-err-tip class="ui-help-float" style="'), i(a ? "" : "display:none"), i('">'), i(a), i('</span>\r\n			        </td>\r\n			        <td class="bind">'), i(this.selector(e)), i("            "), i(this.opts()), i("        </td>\r\n			    </tr>"), t.join("")
        },
        selector: function(e) {
            var t = [],
                i = function(e) {
                    t.push(e)
                },
                n = e.item,
                a = e.btnLv1List,
                r = n.error && n.error.curButton,
                s = n.curButton,
                o = n.curType,
                d = n.curURL,
                c = n.error && n.error.curURL || "";
            if (!n.subItemList.length) {
                if (i('\r\n			    <div class="ui-dropdown ui-dropdown-type" data-field="curType" style="margin-right:10px">\r\n			        <button class="ui-btn">套餐页面 <span class="ui-caret"></span></button>    \r\n			        <ul class="ui-dropdown-menu">        \r\n			            <li '), "PACKAGE" == o && i(' class="current" '), i(' data-id="0"><a href="javascript:void(0);">套餐页面</a></li>\r\n			            <li '), "URL" == o && i(' class="current" '), i(' data-id="1"><a href="javascript:void(0);">网页链接</a></li>    \r\n			        </ul>\r\n			    </div>\r\n			\r\n			    <!-- 功能模块选择 -->\r\n			    <div class="ui-dropdown not-hidden '), i(r && "error"), i('" '), "PACKAGE" !== o && i('style="display:none"'), i(" >"), a.length) {
                    i('            <button data-field="curButton" type="button" class="ui-btn">'), i(this.__escapeHtml(s ? s.name : "下拉菜单")), i(' <span class="ui-caret"></span></button>\r\n			            <span data-err-tip class="ui-help-float" style="min-width: 98px; left: 186px; '), i(r ? "" : "display:none"), i('">'), i(r), i('</span>\r\n			            <ul data-name="buttonSelector" class="ui-dropdown-menu">');
                    for (var l = 0, u = a.length; u > l; l++) {
                        var p = a[l],
                            f = p.subButtonList;
                        if (f.length) {
                            i('                        <li class="level"><span>'), i(this.__escapeHtml(p.name)), i("</span>\r\n			                            <ul>");
                            for (var m = 0, g = f.length; g > m; m++) {
                                var v = f[m];
                                i('                                    <li><a data-action="choiceButton" data-lv1-index="'), i(l), i('" data-lv2-index="'), i(m), i('" href="#">'), i(this.__escapeHtml(v.name)), i("</a></li>")
                            }
                            i("                            </ul>\r\n			                        </li>")
                        } else i('                        <li class="level"><a data-action="choiceButton" data-lv1-index="'), i(l), i('" href="#">'), i(this.__escapeHtml(p.name)), i("</a></li>");
                        i("                ")
                    }
                    i("            </ul>")
                } else i('<button class="ui-btn" type="button">没有可用的服务</button>');
                i('    </div>\r\n			\r\n			    <input type="text" class="'), i(c && "error"), i('" placeholder="请输入url" data-field="curURL" value="'), i(d), i('" style="float:left; width:180px; '), "URL" !== o && i(" display:none "), i(' "/>\r\n			    <span data-err-tip class="ui-help-float" style="left:auto;top:auto;min-width:0;margin-left:-8px;'), i(c && "URL" == o ? "" : "display:none"), i('">'), i(c), i("</span>")
            }
            return i(""), t.join("")
        },
        opts: function() {
            var e = [],
                t = function(t) {
                    e.push(t)
                };
            return t('<a data-action="remove" href="#"><i class="icon-trash"></i></a>'), e.join("")
        },
        __escapeHtml: function() {
            var e = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "/": "&#x2F;"
                },
                t = /[&<>'"\/]/g;
            return function(i) {
                return "string" != typeof i ? i : i ? i.replace(t, function(t) {
                    return e[t] || t
                }) : ""
            }
        }()
    }
}), define("manage/widget/menu_config/Package", function(e, t, i) {
    var n = e("$"),
        a = {
            id: null,
            name: null,
            buttonList: []
        },
        r = function(e) {
            n.extend(this, a, e)
        };
    r.fromObject = function(e) {
        return e instanceof r ? e : new r(e)
    }, i.exports = r
}), define("manage/widget/msg_sum_view/msg_sum_view", function(e, t, i) {
    var n, a, r, s, o, d = e("$"),
        c = e("event"),
        l = e("wxManager"),
        u = e("util"),
        p = e("router"),
        f = e("dialog"),
        m = e("manage/widget/edit_msg/edit_msg"),
        g = e("widget/simple_editor/simple_editor"),
        v = e("widget/selector/selector"),
        h = {
            _tmpl: {
                main: '<div class="layout-sub-content"><div class="message"><div class="message-title"><h2><%=resTypeLabel%><% if (isMutiCustomer) { %>：多客服模式<% } %></h2><% if (!isMutiCustomer) { %><div class="ui-dropdown" id="resTypeSelect">    <button class="ui-btn">文本 <span class="ui-caret"></span></button>    <ul class="ui-dropdown-menu">        <li data-id="1" <% if (resType == "1" || !resType) { %> class="current" <% } %>><a href="javascript:void(0);">文本</a></li><li data-id="2" <% if (resType == "2") { %> class="current" <% } %>><a href="javascript:void(0);">图文</a></li><% if (useService) { %><li data-id="3" <% if (resType == "3") { %> class="current" <% } %>><a href="javascript:void(0);">套餐</a></li><% } %>    </ul></div><% } %><% if (setMutiCustomer) { %><% if (isMutiCustomer) { %><a href="javascript:;" data-hot="glzx.zdhf.close_dkf" data-event="msg_sum_view_disable_customer" style="float: right; margin-top: 5px; margin-right: 80px;">关闭多客服模式</a><% } else { %><a href="javascript:;" data-hot="glzx.zdhf.open_dkf" data-event="msg_sum_view_enable_customer" style="float: right; margin-top: 5px; margin-right: 80px;">开启多客服模式</a><% } %><% } %></div><% if (!isMutiCustomer) { %><div id="resContent"><div id="resContentText" class="res-content-wrap message-content clearfix" <% if (resType == "1" || !resType) { %> style="display:block" <% } else {%> style="display:none" <%}%>></div><div id="resContentMsg" class="res-content-wrap message-content clearfix" <% if (resType == "2") { %> style="display:block" <% } else {%> style="display:none" <%}%>></div><div id="resContentApp" class="res-content-wrap message-content clearfix" <% if (resType == "3") { %> style="display:block" <% } else {%> style="display:none" <%}%>></div></div><% } else { %><%=customerGuide%><% } %></div></div><% if (!isMutiCustomer) { %><div class="layout-sub-footer"><% if(saveBtn) { %>    <a href="javascript:;" class="ui-btn ui-btn-primary" data-event="msg_sum_view_save" ><%=saveBtn%></a>     <% } %><% if(cancelBtn) { %><a href="javascript:;" class="ui-btn" data-event="msg_sum_view_cancel" ><%=cancelBtn%></a> <% } %></div><% } %>',
                service: '<div style="padding:20px"><select id="msgSumService"><% for(var i = 0, item; item = serviceList[i]; i++) { %><option value="<%=item.serviceid%>" <% if(serviceid == item.serviceid) { %> selected <% } %>><%=item.servicename%></option><% } %> </select></div>',
                outdate: ' <span class="ui-alert-icon error"></span>    <div class="ui-alert-title">        <h2 class="ui-status warning">您的套餐已过期</h2>        <p>请续费后再更新您的公众号</p>    </div>',
                enableCustomer: ' <span class="ui-alert-icon error"></span>    <div class="ui-alert-title">        <h2 class="ui-status warning">是否确认开启多客服模式</h2>        <p>开启后设置的自动回复将不生效!</p>    </div>',
                customerGuide: ' <p style="padding:50px;font-size:16px"> 您已经开启多客服模式，请在微信公众平台后台 <a href="https://mp.weixin.qq.com" target="_blank">https://mp.weixin.qq.com</a> 设置多客服 </p>'
            },
            render: function(e) {
                var t = this,
                    i = {
                        renderTo: null,
                        resTypeLabel: "回复类型",
                        msgItem: null,
                        useService: !1,
                        serviceInfo: null,
                        setMutiCustomer: !1,
                        isMutiCustomer: !1,
                        saveBtn: {
                            text: "",
                            beforeCallback: null,
                            callback: null
                        },
                        cancelBtn: {
                            text: "",
                            callback: null
                        }
                    },
                    e = this.options = d.extend({}, i, e),
                    c = e.saveBtn && e.saveBtn.text ? e.saveBtn.text : "",
                    l = e.cancelBtn && e.cancelBtn.text ? e.cancelBtn.text : "";
                if (e.renderTo) {
                    var p = "";
                    e.msgItem && (p = e.msgItem.msgtype), e.useService && e.serviceInfo && (p = 3), e.renderTo.html(u.tmpl(this._tmpl.main, {
                        useService: e.useService,
                        resTypeLabel: e.resTypeLabel,
                        resType: p,
                        setMutiCustomer: e.setMutiCustomer,
                        isMutiCustomer: e.isMutiCustomer,
                        customerGuide: t._tmpl.customerGuide,
                        saveBtn: c,
                        cancelBtn: l
                    })), e.isMutiCustomer || (n = new v("#resTypeSelect"), a = d("#resContent"), r = d("#resContentText"), s = d("#resContentMsg"), o = d("#resContentApp"), t.renderMsg(e.msgItem), t.renderText(e.msgItem), t.renderApp(e.serviceInfo)), this.bindEvent()
                }
            },
            bindEvent: function() {
                var e = this;
                c.addCommonEvent("click", {
                    msg_sum_view_save: function() {
                        var t = this;
                        l.ifPackageExpired(function() {
                            f.create(e._tmpl.outdate, "430", "", {
                                title: "套餐已过期",
                                defaultCancelBtn: !1,
                                button: {
                                    "续费": function() {
                                        f.hide(), p.redirect("/personal/packages/list")
                                    }
                                }
                            })
                        }, function() {
                            e.save(t)
                        })
                    },
                    msg_sum_view_cancel: function() {
                        e.cancel()
                    },
                    msg_sum_view_enable_customer: function() {
                        f.create(e._tmpl.enableCustomer, "", "", {
                            title: "提示",
                            button: {
                                "确认": function() {
                                    f.hide(), e.toggleMutiCustomer(1)
                                }
                            }
                        })
                    },
                    msg_sum_view_disable_customer: function() {
                        f.confirm("是否确认关闭多客服模式", function() {
                            f.hide(), e.toggleMutiCustomer(0)
                        })
                    }
                }), e.options.isMutiCustomer || n && n.change(function() {
                    e.changeResType()
                })
            },
            changeResType: function() {
                a.find(".res-content-wrap").hide(), "1" == n.val() ? r.show() : "2" == n.val() ? s.show() : o.show()
            },
            save: function(e) {
                var t = this,
                    i = d(e),
                    a = t.options,
                    r = n.val(),
                    s = {
                        resType: r
                    },
                    o = a.saveBtn.beforeCallback,
                    c = !0;
                if (o && (c = o()), c || void 0 === c)
                    if ("1" == r) {
                        var l = a.msgItem,
                            u = l && "1" == l.msgtype ? l.msgid : "";
                        t.simpleEditor.save({
                            btn: e,
                            msgid: u,
                            callback: function(e) {
                                s.resContent = e, a.saveBtn.callback && a.saveBtn.callback(s)
                            }
                        })
                    } else if ("2" == r) m.saveMsg(e, function(e) {
                    s.resContent = e, a.saveBtn.callback && a.saveBtn.callback(s)
                });
                else {
                    if (i.hasClass("disabled")) return;
                    i.addClass("disabled"), s.resContent = d("#msgSumService").val(), a.saveBtn.callback && a.saveBtn.callback(s)
                }
            },
            cancel: function() {
                var e = this.options.cancelBtn.callback;
                e && e()
            },
            renderMsg: function(e) {
                var t = {
                    renderTo: s
                };
                e && "2" == e.msgtype && (t.mode = 1, t.msgItem = e), m.render(t)
            },
            renderText: function(e) {
                var t = e && "1" == e.msgtype ? e.content : "";
                this.simpleEditor = new g({
                    renderTo: r,
                    simulatorAble: 1
                }), this.simpleEditor.setText(t)
            },
            renderApp: function(e) {
                var t = this,
                    i = e && e.serviceid ? e.serviceid : "";
                l.getUsrPackage(function(e) {
                    for (var n, a = [], r = 0; n = e[r]; r++) a = a.concat(n.services);
                    o.html(u.tmpl(t._tmpl.service, {
                        serviceList: a,
                        serviceid: i
                    }))
                })
            },
            toggleMutiCustomer: function(e) {
                l.updateReply({
                    productId: u.getProductId(),
                    msgType: 0,
                    resType: 4,
                    resContent: e
                }, function() {
                    var t = e ? "开启成功" : "关闭成功";
                    f.success(t), p.redirect("/manage/auto_reply")
                })
            }
        };
    i.exports = h
}), define("manage/widget/reply_box/reply_box", function(e, t, i) {
    var n, a = e("$"),
        r = e("util"),
        s = (e("event"), e("wxManager")),
        o = e("dialog"),
        d = e("router"),
        c = e("manage/widget/msg_sum_view/msg_sum_view"),
        l = e("lib/reporter"),
        u = {
            _tmpl: {
                main: '<div class="layout-sub-title">    <h1><%=words.title%></h1>    <p><%=words.tip%></p></div><div id="replyContent"></div>'
            },
            render: function(e) {
                var t = this;
                t.type = e, s.getReply({
                    productId: r.getProductId(),
                    msgTypeList: "[0,7]"
                }, function(i) {
                    i && (0 == e ? t.words = {
                        title: "自动回复",
                        tip: '粉丝在回复您微信消息时，系统自动回复您设置的内容给粉丝。<a href="http://kf.qq.com/faq/140410VnIvYV140415AvAVfY.html#" target="_blank">如何设置自动回复</a>'
                    } : 7 == e && (t.words = {
                        title: "首次关注回复",
                        tip: '粉丝在关注您的公众号时，系统会自动发送您设置回复内容给粉丝。<a href="http://kf.qq.com/faq/140410VnIvYV140415NjyUrA.html#" target="_blank">如何设置首次关注回复</a>'
                    }), t.data = i, t.paintContent())
                })
            },
            paintContent: function() {
                var e = this;
                a("#manageMain").html(r.tmpl(this._tmpl.main, {
                    words: e.words
                })), n = a("#replyContent");
                var t = e.data[e.type],
                    i = t ? t.msgInfo : null,
                    o = t ? t.serviceInfo : null;
                o && (o.serviceid = t.relatedid);
                var d = 0 == e.type ? !0 : !1,
                    l = t && 2 == t.restype ? !0 : !1;
                s.getBindInfo(function(t) {
                    var a = t.wechataccount ? "更新至公众号" : "确认设置",
                        r = {
                            renderTo: n,
                            resTypeLabel: "回复类型",
                            msgItem: i,
                            serviceInfo: o,
                            setMutiCustomer: d,
                            isMutiCustomer: l,
                            saveBtn: {
                                text: a,
                                callback: function(t) {
                                    e.save(t)
                                }
                            }
                        };
                    c.render(r)
                })
            },
            save: function(e) {
                var t = this;
                s.updateReply({
                    productId: r.getProductId(),
                    msgType: t.type,
                    resType: e.resType,
                    resContent: e.resContent
                }, function() {
                    var e = a("#replyContent").find(".layout-sub-footer").find("a:eq(0)"),
                        i = "确认设置" == e.text() ? "已确认" : "更新成功";
                    o.success(i);
                    var n = 0 == t.type ? "auto_reply" : "greeting";
                    d.redirect("/manage/" + n), s.setPageFlag(n);
                    var r = 0 == t.type ? "zdhf" : "shoucigz",
                        c = "已确认" == i ? "querensz" : "gengxin";
                    l.click("glzx." + r + "." + c)
                })
            },
            del: function() {
                var e = this;
                o.confirm("确认删除设置?", function() {
                    s.delReply({
                        productId: r.getProductId(),
                        msgType: e.type
                    }, function() {
                        o.success("删除成功");
                        var t = 0 == e.type ? "auto_reply" : "greeting";
                        d.redirect("/manage/" + t)
                    })
                })
            }
        };
    i.exports = u
}), define("manage/widget/statushelper/StatusHelper", function(e, t, i) {
    var n = e("$"),
        a = e("lib/dates"),
        r = (e("lib/collections"), e("manage/config/manager")),
        s = 4,
        o = {
            UNKNOWN: {
                code: "UNKNOWN",
                cssClass: "warning",
                text: '未发货，<a data-event="nav" href="/personal/order/list">点击查看</a>'
            },
            NORMAL: {
                code: "NORMAL",
                cssClass: "success",
                text: "使用中"
            },
            EXPIRED: {
                code: "EXPIRED",
                cssClass: "danger",
                text: "已过期"
            },
            WILL_EXPIRED: {
                code: "WILL_EXPIRED",
                cssClass: "warning",
                text: function(e) {
                    return e > 1 ? "即将过期（剩余" + e + "天）" : "今天过期"
                }
            }
        },
        d = {
            NEEDPAY: {
                code: "NEEDPAY",
                cssClass: "warning",
                text: '未支付，<a data-action="payorder" href="javascript:void(0);">点击支付</a>'
            },
            UNKNOWN: {
                code: "UNKNOWN",
                cssClass: "",
                text: "未知"
            },
            NOT_YET: {
                code: "NOT_YET",
                cssClass: "warning",
                text: '未发货，<a data-action="redelivery" href="javascript:void(0);">点击重试</a>'
            },
            DONE: {
                code: "DONE",
                cssClass: "success",
                text: function(e, t) {
                    var i = "支付成功，发货成功";
                    return 1 == e && (i = 0 == t ? "免费试用，发货成功" : "1分钱试用，发货成功"), i
                }
            },
            FAILED: {
                code: "FAILED",
                cssClass: "danger",
                text: '未发货，<a data-action="redelivery" href="javascript:void(0);">点击重试</a>'
            },
            LAPSED: {
                code: "LAPSED",
                cssClass: "",
                text: "已失效"
            }
        },
        c = {
            packageStatus: o,
            orderStatus: d,
            orderStatus: function(e) {
                var t, i = e.subOrders,
                    a = e.status,
                    r = e.payprice,
                    s = i.length,
                    o = {
                        not_yet: 0,
                        done: 0,
                        failed: 0
                    };
                if (void 0 != a) {
                    if (0 == a || 2 == a) return d.NEEDPAY;
                    if (3 == a) return d.LAPSED
                }
                return n.each(i, function(e, t) {
                    var i = t.status;
                    0 === i ? o.not_yet++ : 1 === i ? o.done++ : 2 === i && o.failed++
                }), o.failed ? t = d.FAILED : o.not_yet ? t = d.NOT_YET : o.done && o.done === s && (t = d.DONE), t = n.extend({}, t || d.UNKNOWN), n.isFunction(t.text) && (t.text = t.text(i[0] && i[0].ordertype, r)), t
            },
            packageStatus: function(e, t) {
                var i, r, c = t[0] && t[0].servicedate,
                    l = a.fromStr(c, !0);
                if (l && e) {
                    var u = a.diff(l, e);
                    u >= s ? i = o.NORMAL : 0 >= u ? i = o.EXPIRED : (u = Math.ceil(u), i = o.WILL_EXPIRED, r = n.isFunction(i.text) ? i.text(u) : i.text.replace(/\{0}/, u))
                } else i = o.UNKNOWN;
                return n.extend({}, i || d.UNKNOWN, {
                    text: r
                })
            },
            deliveryOrder: function(e) {
                var t = this,
                    i = n.Deferred();
                return r.deliveryOrder(e).done(function() {
                    r.getOrder(e).done(function(e) {
                        i.resolve(t.orderStatus(e))
                    })
                }).fail(function() {
                    i.reject()
                }), i
            }
        };
    i.exports = c
}), define("manage/widget/tenpay_recharge/TenpayRecharge", function(e, t, i) {
    var n = e("$"),
        a = e("lib/util"),
        r = e("module/personal/packages/config/manager"),
        s = e("wxManager"),
        o = 400,
        d = 3e3,
        c = function(e) {
            var t = this;
            t.amount = e.amount, t.win = e.win, t.callback = function() {
                t.destroy(), e.callback.apply(null, [].slice.call(arguments))
            }, t.queryBalanceTimer = null, t.start()
        };
    c.prototype = {
        start: function() {
            var e = this,
                t = e.amount,
                i = (e.callback, e.win);
            e.destroy();
            var n = e._queryBalanceHandle = [parseInt(a.getUin()).toString(36), (new Date).getTime().toString(36), Math.round(Math.random() * Math.pow(10, 10)).toString(36)].join("");
            r.getRechargeBalance({
                amount: t,
                queryRechargeFlagStr: n
            }).done(function(t) {
                i.location.href = t.payurl, e._delayCheckRecharge(o)
            }).fail(function(t) {
                e.errCallback(t), i.close()
            })
        },
        errCallback: function(e) {
            r.callbackInterceptor(e, n.noop, function() {
                callback(!1)
            }), me.destroy()
        },
        _delayCheckRecharge: function(e) {
            var t = this,
                i = t.callback;
            return 0 >= e ? void i(!1, !0) : (clearTimeout(t.queryBalanceTimer), void(t.queryBalanceTimer = setTimeout(function() {
                s.queryRechargeByHandle(t._queryBalanceHandle).done(function() {
                    i(!0)
                }).fail(function() {
                    t._delayCheckRecharge(--e)
                })
            }, d)))
        },
        destroy: function() {
            clearTimeout(this.queryBalanceTimer)
        }
    }, i.exports = c
});