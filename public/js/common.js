$(function(){
	// 热门文章
	$.ajax({
		type:"post",
		url:"/api/content/hotContents",
		success:function(data){
			// console.log(data)
			if(data.code == 30){
				var htmls = ''
				// console.log(data.data)
				for(var i = 0;i < data.data.length;i++){
					htmls += '<li><a href="/contentInfo?id='+data.data[i]._id.toString()+'">'+data.data[i].title+'</a></li>'
				}
				// console.log(htmls)
				$(".hotArticle ul").html(htmls);
			}
		}
	})
	//banner
    function swiperFn(){
        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            autoplay: 4000,
            // 如果需要分页器
            pagination: '.swiper-pagination',
            // 如果需要前进后退按钮
            // nextButton: '.swiper-button-next',
            // prevButton: '.swiper-button-prev',
        })
    }
    $.ajax({
        type:"post",
        url:"/api/banner",
        success:function(data){
            // console.log(data)
            if(data.code == 43){
                var htmls = ''
                // console.log(data.data)
                for(var i = 0;i < data.data.length;i++){
                    htmls += '<div class="swiper-slide"><a href='+ data.data[i].bannerhref +'><img src='+ data.data[i].imagePath+' /></a></div>'
                }
                // console.log(htmls)
                $(".swiper-wrapper").html(htmls);
                swiperFn()
            }
        }
    })
	$(".selectedRegistered.selected").on("click",function(){
		$(".Login").show();
		$(".registered").hide();
	})
	$(".selectedLogin.selected").on("click",function(){
		$(".registered").show();
		$(".Login").hide();
	})
	//注册
	/*
	 *注册的事件函数
	 */
	function registeredFn(){
		var username = $(".registered").find("input[name='username']").val();
		var password = $(".registered").find("input[name='password']").val();
		var repassword = $(".registered").find("input[name='repassword']").val();
		$.ajax({
			type:"post",
			url:"/api/user/register",
			data:{
				username:username,
				password:password,
				repassword:repassword,
				time:Number(Date.parse(new Date()))
			},
			success:function(data){
				// console.log(data)
				if(data.code == 8){
					setTimeout(function(){
						$(".registered").hide();
						$(".Login").show();
					},300)
				}else{
					$(".totast").html(data.message)
				}
			}
		});
	}
	//点击注册按钮绑定函数
	$(".registeredBtn").on("click",registeredFn)
	//点击回车绑定注册函数
	var $registeredInput = $(".registered input");
	$registeredInput.on("keydown",function(e){
		if(e.which == 13){
			e.preventDefault();
			registeredFn();
		}
	})
	//登陆
	/*
	 *点击登陆按钮的绑定事件
	 */
	function loginFn(){
		// var username = $(".Login").find("input[name='username']").val();
		// var password = $(".Login").find("input[name='password']").val();
        var username = $(".username1").val();
        var password = $(".password1").val();
		// console.log(username + "$" + password)
		$.ajax({
			type:"post",
			url:"/api/user/login",
			data:{
				username:username,
				password:password
			},
			success:function(data){
				// console.log(data)
				if(data.code == 9){
					setTimeout(function(){
						window.location.reload();
					},300)
				}else{
					$(".totast").html(data.message)
				}
			}
		});
	}

	//绑定点击登陆按钮
	$(".loginBtn").on("click",loginFn)
	//点击回车执行登陆函数
	var $loginInput = $(".loginBtn");
	$loginInput.on("keydown",function(e){
		if(e.which == 13){
			e.preventDefault();
			loginFn();
		}
	})
	//用户登录退出
	$(".loginTop .exit").on("click",function(){
		//请求后端删除cookie的接口
		$.ajax({
			type:"post",
			url:"/api/user/exit",
			success:function(data){
				// console.log(data)
				window.location.reload();
			}
		})
	})
	//滚动页面导航定位变化
	$(window).on("scroll",function(){
        var scrollTopHeight = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		// console.log(scrollTopHeight)
		if(scrollTopHeight >=80){
			$(".navbar").addClass("navbarPosition");
			$(".logoImg").attr("src","/public/images/logo.png");
		}else if(scrollTopHeight <= 40){
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
	$(".wechatHover").on({
        mouseover:function(){
            $(".myWechat").show()
        },
        mouseout:function(){
            $(".myWechat").hide()
        }
	})
    $(".webchatPublic").on({
        mouseover:function(){
            $(".myWebchatPublic").show()
        },
        mouseout:function(){
            $(".myWebchatPublic").hide()
        }
    })
	$(".videoListBox li").on({
        mouseover:function(){
            $(this).find("img").css({"transform": "scale(1.1, 1.1)","transition": "all 1s"});
        },
        mouseout:function(){
            $(this).find("img").css({"transform": "scale(1, 1)","transition": "all 1s"});
        }
	})
	//点击顶部登陆按钮
	$(".loginTop .logins-btns").on("click",function(){
		$(".top-loginBox").show();
		$("body,html").addClass('fixed')
	})
	$(".top-loginBox-bg").on("click",function(){
        $(".top-loginBox").hide()
        $("body,html").removeClass('fixed')
	})
	//个人中心
    $(".loginTop .top-login-person").on("click",function(){
        window.open('/admin')
    })
})
var _hmt = _hmt || [];
(function() {
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?c99f49869b064a7b101d850e21ab5f4b";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();
