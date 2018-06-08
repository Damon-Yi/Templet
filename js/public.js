
/* 提示 弹窗 --------------------------------------------------------------------- */
/* tips('数据错误','tips_center',1500);  
tips('数据错误','tips_left',1500); */
function tips(msg, className, time) {
	var tipsDiv = $('<div class="tips ' + className + '"></div>');
	$('body').append(tipsDiv);
	tipsDiv.html(msg).addClass('tips_show');
	setTimeout(function() {
		tipsDiv.removeClass('tips_show').remove();
	}, time);
}

/* 获取验证码 --------------------------------------------------------------------- */
var getCode = function(btn,time,fn){
    var me = {};
    me.btn = btn;
    me.wait= time;
    me.callBack = fn;
    me.show = function(obj) {
        $(me.btn).attr("disabled","disabled");
        me.wait--;
        $(me.btn).text(me.wait+"秒");
        if(me.wait == -1){
            $(me.btn).removeAttr("disabled").text("获取验证码");
            return ;
        }else if(me.wait == 0){
            $(me.btn).removeAttr("disabled").text("重新获取");
            me.wait = time;
            return ;
        }else if(me.wait>0){
            setTimeout(function(){
                me.show(me.btn);
            }, 1000);
        }
    };
    me.init = function(){
        if($(me.btn).attr("disabled")!="disabled"){
            me.show();
        	me.callBack(me);
        }
    };
    me.reset = function(){
        me.wait = 0;
    };
    me.init();
    return me;
}

/* 操作Class ---------------------------------------------------------------------- */
function hasClass(obj, cls) {
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(obj, cls) {
	if (!this.hasClass(obj, cls))
		obj.className += " " + cls;
}
function removeClass(obj, cls) {
	if (hasClass(obj, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ');
	}
}
function toggleClass(obj, cls) {
	if (hasClass(obj, cls)) {
		removeClass(obj, cls);
	} else {
		addClass(obj, cls);
	}
}

/* Cookie 操作 -------------------------------------------------------------------- */
/* Cookie.set('kk','45'); 
Cookie.get(); */
var Cookie = {
	getExpiresDate : function(days, hours, minutes) {
		var ExpiresDate = new Date();
		if (typeof days == "number" && typeof hours == "number"
				&& typeof hours == "number") {
			ExpiresDate.setDate(ExpiresDate.getDate() + parseInt(days));
			ExpiresDate.setHours(ExpiresDate.getHours() + parseInt(hours));
			ExpiresDate
					.setMinutes(ExpiresDate.getMinutes() + parseInt(minutes));
			return ExpiresDate.toGMTString();
		}
	},
	_getValue : function(offset) {
		var endstr = document.cookie.indexOf(";", offset);
		if (endstr == -1) {
			endstr = document.cookie.length;
		}
		return unescape(document.cookie.substring(offset, endstr));
	},
	get : function(name) {
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while (i < clen) {
			var j = i + alen;
			if (document.cookie.substring(i, j) == arg) {
				return this._getValue(j);
			}
			i = document.cookie.indexOf(" ", i) + 1;
			if (i == 0)
				break;
		}
		return "";
	},
	set : function(name, value, expires, path, domain, secure) {
		document.cookie = name + "=" + escape(value)
				+ ((expires) ? ";expires=" + expires : "")
				+ ((path) ? ";path=" + path : "")
				+ ((domain) ? ";domain=" + domain : "")
				+ ((secure) ? ";secure" : "");
	},
	remove : function(name, path, domain) {
		if (this.get(name)) {
			document.cookie = name + "=" + ((path) ? ";path=" + path : "")
					+ ((domain) ? ";domain=" + domain : "")
					+ ";expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	},
	clear : function() {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookieName = cookies[i].split('=')[0];
			if (cookieName.trim()) {
				this.remove(cookieName.trim());
			}
		}
	}
}

/* 日期格式化 ---------------------------------------------------------------------- */
Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
} 