$(function(){
	$(".selectedRegistered.selected").on("click",function(){
		$(".Login").show();
		$(".registered").hide();
	})
	$(".selectedLogin.selected").on("click",function(){
		$(".registered").show();
		$(".Login").hide();
	})
	//滚动页面导航定位变化
	$(window).on("scroll",function(){
		if(document.body.scrollTop >=80){
			$(".navbar").addClass("navbarPosition");
			$(".logoImg").attr("src","/public/images/logo.png");
		}else if(document.body.scrollTop <= 40){
			$(".navbar").removeClass("navbarPosition");
			$(".logoImg").attr("src","/public/images/logo-default-white.png")
		}
	})
	//点击搜索
	var $findInput = $(".find");
	$findInput.on("keydown",function(e){
		var keyWord = $(".find").val()
		if(e.which == 13 && keyWord){
			e.preventDefault();
			window.location.href="search?keyWord="+keyWord;
		}
	})

	// 二级导航显示
	$(".resource_tab li").on({
        mouseover:function(){
            $(".resource_tabConsBox").hide();
			$(this).find(".resource_tabConsBox").show();
		},
		mouseout:function(){
            $(".resource_tabConsBox").hide();
		}
	})
})
var _hmt = _hmt || [];
(function() {
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?c99f49869b064a7b101d850e21ab5f4b";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();
