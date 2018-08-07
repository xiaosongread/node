// 获取文章的内容
axios.get('https://www.songyanbin.com/api/content/nowContentInfo',{
  params: {
    contentId: mgd.GetQueryString('id')
  }
})
  .then(function (res) {
    console.log('mm',res)
    var data = res.data.data[0];
    console.log("data", data)
    var html2 = template('conshtml', data); 
    document.getElementById('cons').innerHTML = html2; 
    // document.getElementsByClassName('conshtml')[0].innerHTML = data.content; 
  })
  .catch(function (error) {
    console.log(error);
  }); 