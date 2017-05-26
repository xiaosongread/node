var arrimg="";
var arrvedio="";
var head="";
//城市3级选择器

var tmpCountry=[1,2];
function creatNav(txt,href,type){
	var type=type || '';
	var body=document.body;
	var nodeWrap=document.createElement("div");
	var placeDiv=document.createElement("div");
	placeDiv.setAttribute("id","placeDiv")
	nodeWrap.setAttribute("id","navWrap");
	var newNode=document.createElement("div");
	newNode.setAttribute("id","commonTitle");
	var oA=document.createElement("a");
	oA.setAttribute("href","");
	oA.setAttribute("className","isLink");
	oA.setAttribute("id","isLink");
	oA.innerHTML="<i class='iconfont' >&#xe605;</i>";
	var oSpan=document.createElement("span");
	oSpan.setAttribute("id","isTxt")
	oSpan.innerHTML="红蜜"
	newNode.appendChild(oA);
	newNode.appendChild(oSpan);
	nodeWrap.appendChild(newNode);
	var firDom=body.childNodes[0];
	body.insertBefore(nodeWrap,firDom); 
	body.insertBefore(placeDiv,nodeWrap); 
	document.getElementById("isTxt").innerHTML=txt;
	document.title="红蜜-更专业的演艺服务平台";
	if(type){
		oA.setAttribute("id","isLink");
		document.getElementById("isLink").addEventListener('click',function(ev){
			ev.preventDefault();
			window.history.go(-1);
			//window.location.reload();
		},false)
		return false;
	}
	document.getElementById("isLink").setAttribute("href","http://hm.hotyq.com/html5/view"+href);	
}
var state;
var change = {
	design_width: 750,
	api: 'http://hm.hotyq.com',
	artist:'http://yr.hotyq.com',
	IsIos:function(){
		var userInfo=navigator.userAgent;
		if(userInfo.indexOf("iPhone")!=-1){
			return 1;
		}else{
			return 0;
		}
	},
	IsPC: function() {
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone",
			"SymbianOS", "Windows Phone",
			"iPad",
			"iPod"
		];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	},
	url_attr: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	url_attr_cn: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = decodeURI(window.location.href).substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	body: document.getElementsByTagName('html')[0],
	action: function() {
		if (this.IsPC()) {
			this.view_width = document.documentElement.clientWidth > this.design_width ? this.design_width : document.documentElement.clientWidth;
			this.body.className = 'pc';
		} else {
			this.view_width = document.documentElement.clientWidth < 320 ? 320 : document.documentElement.clientWidth;
		}
		this.body.style.opacity = 1;
		this.body.style.fontSize = this.view_width * 100 / this.design_width + 'px';
	},
	isWeiXin:function(){
		var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	        return true;
	    }else{
	        return false;
	    }
	}
}
change.action();
window.addEventListener('resize', function() {
	change.action();
})
var tost_tt;
var my = {
	system: 'ios',
	toast: function(obj) {
		document.getElementById("toast").innerHTML = obj;
		document.getElementById("toast").style.display = 'block';
		tost_tt = setTimeout(function() {
			document.getElementById("toast").style.display = 'none';
		}, 2000)
	},
	json_s: function(obj) {
		if (typeof obj != 'string') {
			return obj
		} else {
			return eval("(" + obj + ")")
		}
	},
	page: function(txt, ajax_fn) {
		var $win = $(window);
		var $txt = $(txt);
		$txt.html(my.load[0]);
		$win.scroll(function() {
			if ($win.scrollTop() + 100 > $txt.offset().top - $win.height()) {
				ajax_fn();
			}
		});
	},
	img: function() {
		template.helper('img', function(obj, num, type) {
			if (obj != '' && obj != null && obj.slice(-4, -3) != '!') {
				return obj + '!' + num;
			} else {
				if (type == 1 && (obj == '' || obj == null)) { //1为脑袋
					var img_Url = 'http://img.hotyq.com/icon/user/defaulthead.jpg' + '!' + num; //默认头像
				} else {
					var img_Url = obj;
				}
				return img_Url;
			}
		})
	},
	imgSize:function(){//没有绑定分页情况下的页数 下拉数据太多的时候会闪 比较蛋疼···
		$(".imgSet").each(function(index,element){
			var imgRealWidth = $(this).width();
			var imgRealHeight = $(this).height();
			console.log(index+'#'+imgRealWidth +'#'+imgRealHeight)
			if(imgRealWidth > imgRealHeight){
				$(this).css({"width":"100%"});
				$(this).parent().css({"display": "-webkit-box","-webkit-box-pack":"center","-webkit-box-align":"center"})
			}else{
				$(this).css({"height":"100%"});
				$(this).parent().css({"display": "-webkit-box","-webkit-box-pack":"center","-webkit-box-align":"center"})
			}
		})	
	},
	open:function(){
		//运营需求判断结束
		//if (typeof window.bridge != 'undefined') {
		var bd = window.bridge;
		$('#content').on('click', '.open', function(e) {
			e.preventDefault();
			var name = $(this).attr('data-json-name');
			var fn=$(this).attr('fnName');
			var type=$(this).attr("data-type")
			var tmpJson={
				"imageOrVideo": type //0是照片1是视频，2是头像
			}

			var tmpArr;
			if(type==0){
				tmpArr=arrimg;
			}else if(type==1){
				tmpArr=arrvedio;
			}else if(type==2){
				tmpArr=head;
			}else{
				
			}
			if (name) {
				if (my.system == 'ios') {
					var num = 1;
				} else {
					var num = 0;
				}
				var tmp=$(this).attr("dataArr");
				state=$(this).attr("state");
				//alert(state)
				var extra = {
					extra: tmpJson,
					fnName:fn,
					imgArr:tmpArr,//[{id,icon,url,state}]
					state:'',
				};
				//alert(JSON.stringify(extra))
				//bd.open_window(JSON.stringify(extra));
				bd.photo_upload(JSON.stringify(extra));
				return false;
			};
		});
		//}
	},
	load: ['正在加载中~', '加载已完成！'],
	openData:{
		information:['1223424324234324','HMImageAndVideoViewController']
	},
	verson: 0
	
}
if (!(navigator.userAgent).match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
	my.system = 'android';
}
window.addEventListener('load', function() {
	var toast = document.createElement("section");
	toast.id = 'toast';
	document.querySelector('body').appendChild(toast);
})

var needLoading = true;
var loading = function(){
	needLoading = true;
	setTimeout(function(){
		if(!needLoading){
			return;
		}
		var loadingElement = '<div id="m-load-container"><div class="loading"></div></div>';
		$("body").append(loadingElement);
		//$("body").css("position","fixed");
	},500);
}
var unloading = function(){
	$("#m-load-container").remove();
	needLoading = false;
	//$("body").css("position","static");
}
//取出a链接带过来的参数
    function getUrlParam(url,name){
        var pattern = new RegExp("[?&]" + name +"\=([^&]+)","g");
        var matcher = pattern.exec(url);
        var items = null;
        if(matcher != null){
            try{
                items = decodeURIComponent(decodeURIComponent(matcher[1]));   
            }catch(e){
                try{
                    items = decodeURIComponent(matcher[1]);
                }catch(e){
                    items = matcher[1];
                }
            }
        }
        return items;
}
//详细地址是直辖市的时候 不显示省的字段
function judgeMunicipality(data){//一个字段包括省市区
	    var data = arguments[0];
	    if(data.indexOf("北京市") != -1 || data.indexOf("天津市") != -1 || data.indexOf("重庆市") != -1 || data.indexOf("上海市") != -1){
	    	    data =  data.substring(3);
	    	    return data;
	    }else{
	    	    return data;
	    }
}
////百度统计
//var _hmt = _hmt || [];
//(function() {
//var hm = document.createElement("script");
//hm.src = "//hm.baidu.com/hm.js?f3c309c187927b03d38788b1f04232bc";
//var s = document.getElementsByTagName("script")[0]; 
//s.parentNode.insertBefore(hm, s);
//})();

