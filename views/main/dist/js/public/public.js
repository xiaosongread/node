var n = 1;
// window.onload = function (){
    // 热门文章
    axios.post('https://www.songyanbin.com/api/content/hotContents')
      .then(function (res) {
        console.log(res);
        var data = res.data.data;
        var str = '';
        data.forEach(function(v,i){
            str += `<a href=""><li class="line30 f14 pd-l15 over1 hot_hover">${v.title}</li></a>`
        });
        document.querySelector('.hotArticle ul').innerHTML = str;
      })
      .catch(function (error) {
        console.log(error);
      }); 
      
    // 顶部菜单
    axios.post('https://www.songyanbin.com/api/categories')
      .then(function (res) {
        console.log(res);
        var data = res.data.data;
        var str = '';
        data.forEach(function(v,i){
            str += `<li class="flex1 t-align pd-l15 pd-r15 mr5">
                      <a href="/fl.html?id=${v._id}">${v.name}</a>
                    </li>`
        });
        str += `<li class="flex1 t-align pd-l15 pd-r15 mr5">
                  <a href="/resources">前端资料库</a>
                </li>`
        document.querySelector('.header ul').innerHTML = str;
      })
      .catch(function (error) {
        console.log(error);
      }); 
    
    
    
// }