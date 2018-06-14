// 设置来源 1:PC,2:微信(android),3:微信(ios),4:android,5:ios,6:ios浏览器,7:android浏览器,8:其他
var os = function () {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian,
        isWechat = /(?:MicroMessenger)/.test(ua),
        isAndroidApp = /(?:wallet_android)/.test(ua),
        isiOSApp = /(?:wallet_iOS)/.test(ua);

    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
        isWechat: isWechat,
        isAndroidApp: isAndroidApp,
        isiOSApp: isiOSApp
    };
}();
var origin = function () {
    if (os.isPc) {
        origin = 1;
    } else if (os.isWechat) {
        if (os.isAndroid) {
            origin = 2;
        } else if (os.isPhone) {
            origin = 3;
        }
    } else {
        if (os.isAndroidApp) {
            origin = 4;
        } else if (os.isiOSApp) {
            origin = 5;
        } else if (os.isPhone) {
            origin = 6;
        } else if (os.isAndroid) {
            origin = 7;
        } else {
            origin = 8;
        }
    }
}();

/*
 * 功能：公共函数
 */
var publicClass = publicClass || {
    // 浏览器返回刷新
    backRefresh: function () {
        if (window.name != "fresh") {
            window.name = "fresh";
            location.reload();
        } else {
            window.name = "";
        }
    },
	/*  
	 *  tips('数据错误','tips_center',1500);  
	 *	tips('数据错误','tips_left',1500); 
	 */
    tips: function (msg, className, time) {
        var tipsDiv = $('<div class="tips ' + className + '"></div>');
        $('body').append(tipsDiv);
        tipsDiv.html(msg).addClass('tips_show');
        setTimeout(function () {
            tipsDiv.removeClass('tips_show').remove();
        }, time);
    },
    getQueryStying: function (strname) {
        var reg = new RegExp("(^|&)" + strname + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;
    },
    goTop: function () {
        $("body,html").animate({
            scrollTop: 0
        }, 600);
        return false;
    },
    // 获取验证码
    getCode: function (btn, time, fn) {
        var me = {};
        me.btn = btn;
        me.wait = time;
        me.callBack = fn;
        me.show = function (obj) {
            $(me.btn).attr("disabled", "disabled");
            me.wait--;
            $(me.btn).text(me.wait + "秒");
            if (me.wait == -1) {
                $(me.btn).removeAttr("disabled").text("获取验证码");
                return;
            } else if (me.wait == 0) {
                $(me.btn).removeAttr("disabled").text("重新获取");
                me.wait = time;
                return;
            } else if (me.wait > 0) {
                setTimeout(function () {
                    me.show(me.btn);
                }, 1000);
            }
        };
        me.init = function () {
            if ($(me.btn).attr("disabled") != "disabled") {
                me.show();
                me.callBack(me);
            }
        };
        me.reset = function () {
            me.wait = 0;
        };
        me.init();
        return me;
    },
    setCookie: function (c_name, value, expiredays) {
        expiredays = expiredays == undefined ? 30 : expiredays;
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/;domain=" + window.location.host;
    },
    getCookie: function (c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return null;
    },
    isWeiXin: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    isMobile: function () {
        var ua = window.navigator.userAgent;
        var ismobile = (/mobile/i).test(ua);
        if (ismobile) {
            return ismobile;
        }
    },
    isPc: function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    //===================== 微信jssdk 配置 ============================
    getJsApiconfig: function () {
        //加载中样式
        var data = {};
        data.url = window.location.href;
        $.ajax({
            type: "post",
            async: true,
            data: data,
            url: wxPath + "/wechatuser/getJsApiConfig.do",
            dataType: 'json',
            timeout: 30000,
            error: function () {
                console.log("页面加载错误，请刷新");
            },
            success: function (res) {
                if (res.status == "0") {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: "" + res.data.timestamp,
                        nonceStr: res.data.nonceStr,
                        signature: res.data.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem',
                            'translateVoice',
                            'startRecord',
                            'stopRecord',
                            'onRecordEnd',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getNetworkType',
                            'openLocation',
                            'getLocation',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'closeWindow',
                            'scanQRCode',
                            'chooseWXPay',
                            'openProductSpecificView',
                            'addCard',
                            'chooseCard',
                            'openCard'
                        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                } else {
                    console.log("页面加载失败，请刷新");
                }
            }
        });
    },
    //===================== 微信 jssdk end =========================
    setWxShare: function (option) {
        // 获取微信配置信息
        this.getJsApiconfig();
        var shareId = {
            pyq: 1,
            py: 2,
            qq: 3,
            txwb: 4,
            zone: 5
        };
        var share = function (option) {
            // 微信分享配置
            var title = option.title || '', // 分享标题
                desc = option.desc || '', // 分享描述
                link = option.link, // 分享链接
                imgUrl = option.imgUrl || '', // 图片URL
                success = option.success || function () { }, // 成功回调
                cancel = option.cancel || function () { }; // 取消回调
            var spm = option.spm ? option.spm : "";
            var createSpm = function (shareId) {
                var spmStart = '', spmEnd = '', linkUrl = '';
                if (spm != '' && spm != undefined) {
                    var index = option.shareIndex;
                    var strArr = option.spm.split(",");
                    for (var i = 0; i < strArr.length; i++) {
                        if (i < index - 1) {
                            spmStart += strArr[i] + ","
                        } else if (i >= index) {
                            if (i == 8) {
                                spmEnd += "1501,"
                            } else {
                                spmEnd += strArr[i] + ","
                            }
                        }
                    }
                }
                if (spmStart != '' && spmEnd != '') {
                    if (linkUrl.indexOf("?") != -1) {
                        linkUrl = link + "&spm=" + spmStart + shareId + "," + spmEnd
                    } else {
                        linkUrl = link + "?spm=" + spmStart + shareId + "," + spmEnd
                    }
                } else {
                    linkUrl = link;
                }
                return linkUrl;
            }
            // 分享到朋友圈
            wx.onMenuShareTimeline({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.pyq),
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })

            // 分享给朋友
            wx.onMenuShareAppMessage({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.py),
                'imgUrl': imgUrl,
                'type': '', // 分享类型,music、video或link，不填默认为link
                'dataUrl': '', // 如果type是music或video，则要提供数据链接，默认为空
                'success': success,
                'cancel': cancel
            })

            // 分享到QQ
            wx.onMenuShareQQ({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.qq),
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })

            // 分享到腾讯微博
            wx.onMenuShareWeibo({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.txwb),
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })

            // 分享到QQ空间
            wx.onMenuShareQZone({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.zone),
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            });
        }

        wx.ready(function () {
            share(option);
        });
    }
}