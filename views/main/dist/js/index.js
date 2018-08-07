// 获取列表的内容
var page;
function callFn(){
  if(page >= n || n==1) {
    axios.get('https://www.songyanbin.com/api/contentList',{
      params: {
        size: 10,
        page: n
      }
    })
      .then(function (res) {
        // contentListData = res.data.data;
        var data = res.data;
        page = Math.ceil(data.count / 10);
        console.log('文章列表',data)
        var html1 = template('test', data); 
        document.getElementById('content').innerHTML += html1; 
        if (page == n) {
          document.getElementsByClassName('graytext')[0].innerText = '客官，别刷了，没菜了...';
        }
      })
      .catch(function (error) {
        console.log(error);
      }); 
  }
  
}
console.log("index.js")
callFn(n)
$(window).on("scroll",mgd.scroll)