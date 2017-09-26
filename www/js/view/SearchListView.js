var SearchListView = function (items) {

  // var search;
  // var items = null;

  this.initialize = function () {
    this.$el = $('<div/>');
    this.render();
  };

 

  this.render = function () {
    // items = this.findbook(query);
    this.$el.html(this.template(items));
    return this;
  };

  // this.findbook = function(query) {
  //   $.ajax({
  //       type: "GET",
  //       url: "https://openapi.naver.com/v1/search/book",
  //       data: {
  //           query: query
  //       },
  //       headers: {
  //           'X-Naver-Client-Id': 'bewT5V7Gr_udSx3mDCqj',
  //           'X-Naver-Client-Secret': 'AyA38iyb9C'
  //       },
  //       async: false, //ajax 비동기
  //       success: function(data) {  
  //           alert('Success!' + data.items[0].title); 
  //           // $('.content').html(new SearchListView(data.items).render().$el);
  //           items = data.items;
  //       }, 
  //       error: function(error, status, a) {
  //           alert("I'M ERROR" + error);
  //       }
  //   });
  //   return items; //값 반환은 밖에서
  // }

  this.initialize();

}