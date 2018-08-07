var mgd = {
    scroll: function (){
        console.log(123123)
        var bodyHeight = document.body.clientHeight; // 网页的高度
        var screenHeight = document.documentElement.clientHeight; // 网页的可见高度
        var scrollHeight = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        var self = this;
        if (screenHeight + scrollHeight == bodyHeight) {
            this.n++;
            this.callFn()
        }
    },
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
}



// mgd.scroll()
