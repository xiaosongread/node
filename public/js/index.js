$(function(){
    $(".contentList li").on({
        "mouseover":function(){
            $(this).css({"transform": "scale(1.05, 1.05)","transition": "all 1s"});
        },
        "mouseout":function(){
            $(this).css({"transform": "scale(1, 1)","transition": "all 1s"});
        }
    })
})