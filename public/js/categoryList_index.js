$(function(){
	$.ajax({
		type:"post",
		url:"/api/comments/commentList",
		data:{
			contentId:$(".content_cons").attr("id")
		},
		success:function(data){
			// console.log(data)
		}
	})
	$(".contentList li").on({
		"mouseover":function(){
			$(this).css({"transform": "scale(1.05, 1.05)","transition": "all 1s"});
		},
		"mouseout":function(){
			$(this).css({"transform": "scale(1, 1)","transition": "all 1s"});
		}
	})
	// //文章评论
	// $(".commentSubmit").on("click",function(e){
	// 	if(!$(this).hasClass("noClick")){
	// 		var contentId = $(".contentList").find("li").attr("id")//文章的ID
	// 		var userId = $(".yourUserName").attr("id")//用户的ID
	// 		var commentContents = $(".commentConsInput").val();//评论的内容
	// 		if(commentContents == ""){
	// 			alert("评论内容不能为空")
	// 			return;
	// 		}
	// 		$.ajax({
	// 			type:"post",
	// 			url:"/api/comment/commit",
	// 			data:{
	// 				contentId:contentId,// 评论的文章的ID
	// 				userId:userId,//评论的用户的用户名
	// 				commentContents:commentContents//评论的内容
	// 			},
	// 			success:function(data){
	// 				console.log(data)
	// 				if(data.code == 23){//评论保存成功
	// 					$(".commentConsInput").val("");
	// 				}
	// 			}
	// 		})
	// 	}
	// })
})