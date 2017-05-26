/*
 *                后加的动态交互
 *
 *                2016年12月30日 星期五 10时49分24秒 CST
 *                             _ooOoo_
 *                            o8888888o
 *                            88" . "88
 *                            (| -_- |)
 *                            O\  =  /O
 *                         ____/`---'\____
 *                       .'  \\|     |//  `.
 *                      /  \\|||  :  |||//  \
 *                     /  _||||| -:- |||||-  \
 *                     |   | \\\  -  /// |   |
 *                     | \_|  ''\---/''  |   |
 *                     \  .-\__  `-`  ___/-. /
 *                   ___`. .'  /--.--\  `. . __
 *                ."" '<  `.___\_<|>_/___.'  >'"".
 *               | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *               \  \ `-.   \_ __\ /__ _/   .-` /  /
 *          ======`-.____`-.___\_____/___.-`____.-'======
 *                             `=---='
 *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                     佛祖保佑        永无BUG
 *            佛曰:
 *                   写字楼里写字间，写字间里程序员；
 *                   程序人员写程序，又拿程序换酒钱。
 *                   酒醒只在网上坐，酒醉还来网下眠；
 *                   酒醉酒醒日复日，网上网下年复年。
 *                   但愿老死电脑间，不愿鞠躬老板前；
 *                   奔驰宝马贵者趣，公交自行程序员。
 *                   别人笑我忒疯癫，我笑自己命太贱；
 *                   不见满街漂亮妹，哪个归得程序员？
 */

var syb = {
    design_width: 750,
    api:{
        // api:"http://localhost:8080/"
        api:"https://www.songyanbin.com/"
    },
    isIos:function(){
        var userInfo=navigator.userAgent;
        if(userInfo.indexOf("iPhone")!=-1){
            return 1;
        }else{
            return 0;
        }
    },
    isPC: function() {
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
        if (this.isPC()) {
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
    },
    pullDownMoreList:function(callback){
        //页面的可视区域的高度
        var viewingAreaHeight = document.documentElement.clientHeight;
        // console.log(viewingAreaHeight)
        window.onscroll = function(){
            //滚动条滚动的高度
            var scrollHeight = document.body.scrollTop;
            // console.log(scrollHeight)
            //当前页面总共的高度
            var nowTotalHeight =  document.body.clientHeight
            console.log(nowTotalHeight + '#' + (scrollHeight + viewingAreaHeight))
            if(viewingAreaHeight + scrollHeight == nowTotalHeight){
                callback()
            }
        }
    },
    getDate:function(milliseconds){
        var date = new Date(milliseconds);
        var year = date.getFullYear();
        var mouth = date.getMonth()+1;
        var day = date.getDate();
        var getDate = year+'-'+mouth+'-'+day;
        return getDate;
    },
    getArrayItems:function (arr, num) {//从一个给定的数组arr中,随机返回num个不重复项
        //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
        var temp_array = new Array();
        for (var index in arr) {
            temp_array.push(arr[index]);
        }
        //取出的数值项,保存在此数组
        var return_array = new Array();
        for (var i = 0; i<num; i++) {
            //判断如果数组还有可以取出的元素,以防下标越界
            if (temp_array.length>0) {
                //在数组中产生一个随机索引
                var arrIndex = Math.floor(Math.random()*temp_array.length);
                //将此随机索引的对应的数组元素值复制出来
                return_array[i] = temp_array[arrIndex];
                //然后删掉此索引的数组元素,这时候temp_array变为新的数组
                temp_array.splice(arrIndex, 1);
            } else {
                //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
                break;
            }
        }
        return return_array;
    },
    sliceName:function (name){//截取名字字符窜
        if(name.length>=15){
            var newName = name.substring(0,15);
            return newName + "...";
        }else if(name.length<15){
            return name;
        }
    }
}
syb.action();
window.addEventListener('resize', function() {
    syb.action();
})
/*
 *                后加的动态交互
 *
 *                2016年12月30日 星期五 10时49分24秒 CST
 *                             _ooOoo_
 *                            o8888888o
 *                            88" . "88
 *                            (| -_- |)
 *                            O\  =  /O
 *                         ____/`---'\____
 *                       .'  \\|     |//  `.
 *                      /  \\|||  :  |||//  \
 *                     /  _||||| -:- |||||-  \
 *                     |   | \\\  -  /// |   |
 *                     | \_|  ''\---/''  |   |
 *                     \  .-\__  `-`  ___/-. /
 *                   ___`. .'  /--.--\  `. . __
 *                ."" '<  `.___\_<|>_/___.'  >'"".
 *               | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *               \  \ `-.   \_ __\ /__ _/   .-` /  /
 *          ======`-.____`-.___\_____/___.-`____.-'======
 *                             `=---='
 *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                     佛祖保佑        永无BUG
 *            佛曰:
 *                   写字楼里写字间，写字间里程序员；
 *                   程序人员写程序，又拿程序换酒钱。
 *                   酒醒只在网上坐，酒醉还来网下眠；
 *                   酒醉酒醒日复日，网上网下年复年。
 *                   但愿老死电脑间，不愿鞠躬老板前；
 *                   奔驰宝马贵者趣，公交自行程序员。
 *                   别人笑我忒疯癫，我笑自己命太贱；
 *                   不见满街漂亮妹，哪个归得程序员？
 */