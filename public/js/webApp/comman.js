/**
 * Created by songyanbin on 2017/5/14.
 */
$(function(){
    var flag = false;
    $(".fa-navicon").click(function(){
        if(flag){
            $(".bar").hide()
            $(".allArticle").css({"marginTop":"60px"});
            flag = false;
        }else{
            $(".bar").show();
            $(".allArticle").css({"marginTop":"0"});
            flag = true;
        }
    })
})
function getDate(date){
    console.log(date)
    var time = date.split("T")
    return time[0]
}