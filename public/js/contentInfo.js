$(function(){
	$(".commentConsInput").on("input",function(){
		if($(this).val() !=""){
			$(".commentSubmit").removeClass("noClick");
		}else{
			$(".commentSubmit").addClass("noClick");
		}
	})
	// $.ajax({
	// 	type:"post",
	// 	url:"/api/comments/commentList",
	// 	data:{
	// 		contentId:$(".content_cons").attr("id")
	// 	},
	// 	success:function(data){
	// 		console.log(data)
	// 	}
	// })
	//文章评论
	$(".commentSubmit").on("click",function(e){
		if(!$(this).hasClass("noClick")){
			var contentId = $(".content_cons").attr("id")//文章的ID
			var userId = $(".yourUserName").attr("id")//用户的ID
			var commentContents = $(".commentConsInput").val();//评论的内容
			if(commentContents == ""){
				alert("评论内容不能为空")
				return;
			}
			$.ajax({
				type:"post",
				url:"/api/comment/commit",
				data:{
					contentId:contentId,// 评论的文章的ID
					userId:userId,//评论的用户的用户名
					commentContents:commentContents//评论的内容
				},
				success:function(data){
					if(data.code == 23){//评论保存成功
						$(".commentConsInput").val("");
						window.location.reload();
					}
				}
			})
		}
	})
	//获取当前文章的内容
	$.ajax({
		type:"post",
		url:"/api/content/nowContentInfo",
		data:{
            contentId:$(".content_cons").attr("id")//当前文章的ID
        },
		success:function(data){
			$(".content_content").html(data.data[0].content)
		}
	})
})