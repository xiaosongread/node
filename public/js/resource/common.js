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
	//二三级导航显示
    $.ajax({
        type:"post",
        url:"/api/resources",
        success:function(data){
            parentCategoryData = data.data;
            childCategoryData = data.jsonData;
            console.log(parentCategoryData,childCategoryData)
            var newBarData = [];
            parentCategoryData.forEach(function(val,index){
                newBarData.push(val)
            })
            newBarData.forEach(function(value,index){
                newBarData[index].childData = [];
                childCategoryData.forEach(function(val,i){
                    if(value.id == val.parentId){
                        newBarData[index].childData.push(val)
                    }
                })
            })
            console.log(newBarData)
            var htmls ='<li><a href="https://www.songyanbin.com">博客</a></li>|'
            for(var i=0;i<newBarData.length;i++){
                htmls += '<li><i class="fa '+newBarData[i].icon+'"></i><span>'+newBarData[i].sourceParentName+'</span><i class="fa fa-angle-down"></i><div class="resource_tabConsBox"><ul class="resource_tabCons">';
                for(var j=0;j<newBarData[i].childData.length;j++) {
                    htmls += '<a href="/resources/categoryList?id='+newBarData[i].childData[j]._id.toString()+'"><li><i class="fa '+newBarData[i].childData[j].icon+'"></i><span>'+newBarData[i].childData[j].sourceParentName+'</span></li></a>'
                }
                htmls += '</ul></div></li>';
                if(newBarData.length - 1 != i){
                    htmls += '|'
				}
                htmls += '</ul>';
            }
            $(".resource_tab").html(htmls);
            // 二级导航显示
            $(".resource_tab li").on({
                mouseover:function(){
                    $(".resource_tabConsBox").hide();
                    $(this).find(".resource_tabConsBox").show();
                    $(".mgd_cons").addClass("maoBg");
                },
                mouseout:function(){
                    $(".resource_tabConsBox").hide();
                    $(".mgd_cons").removeClass("maoBg");
                }
            })
        }
    })
    $(".resource_img").on({
        mouseover:function(){
            $(this).find("img").css({"transform": "scale(1.1, 1.1)","transition": "all 1s"});
        },
        mouseout:function(){
            $(this).find("img").css({"transform": "scale(1, 1)","transition": "all 1s"});
        }
    })

    var sTop = document.body.scrollTop;//滚动条的高度
    var wHeight = $(window).height();//浏览器的高度
    for(var i=0;i<$(".recourceImg").length;i++){
        if($(".recourceImg")[i].offsetTop <= sTop + wHeight){
            $(".recourceImg")[i].src = $(".recourceImg")[i].getAttribute("data-src")
            $(".recourceImg")[i].setAttribute("class","recourceImg del");
        }
    }
    $(window).scroll(function(){
        console.log("123")
        sTop = document.body.scrollTop;//滚动条的高度
        for(var j=0;j<$(".recourceImg.add").length;j++){
            if($(".recourceImg.add")[j].offsetTop <= sTop + wHeight){
                $(".recourceImg.add")[j].src = $(".recourceImg.add")[j].getAttribute("data-src")
            }
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
