$(function(){
    function registeredFn(){
        var username = $(".registereds").find("input[name='username']").val();
        var password = $(".registereds").find("input[name='password']").val();
        var repassword = $(".registereds").find("input[name='repassword']").val();
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
                        $.ajax({
                            type:"post",
                            url:"/api/user/login",
                            data:{
                                username:username,
                                password:password
                            },
                            success:function(data){
                                console.log(data)
                                if(data.code == 9){
                                    setTimeout(function(){
                                        window.location.href = '/'
                                    },300)
                                }else{
                                    $(".totast").html(data.message)
                                }
                            }
                        });

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
    var $registeredInput = $(".loginBox_left input");
    $registeredInput.on("keydown",function(e){
        if(e.which == 13){
            e.preventDefault();
            registeredFn();
        }
    })
})