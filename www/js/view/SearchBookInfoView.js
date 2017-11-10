var SearchBookInfoView = function () {

  var items = [];
  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  var isUpdate = 0;
  var percent = [];
  var totalPages = 0;
  var writeTable;
  
  this.initialize = function () {
    writeTable = new WriteTable();
    this.$el = $('<div/>');
    this.render();
  };

  this.close = function () {
    event.preventDefault();
    $('#overlay').css("display", "none");
  };

  this.setData = function (data, udata) {
    items = data;
    isUpdate = udata;
  }

  this.addBook = function (event) {
    totalPages = $('#totalPages').val();
    if(!totalPages) {
      window.plugins.toast.showShortCenter("페이지를 입력해 주세요");
      return;
    }
    for(var i=0; i<totalPages; i++) {
      percent[i] = 0;
    }
    
    if(isUpdate === 1) {
      updatePercent();
    } else {
      addBookFun();
    }

  }

  function addBookFun() {
    var query = [
      items.isbn,
      items.title,
      items.author,
      items.publisher,
      totalPages,
      JSON.stringify(percent),
      items.image
    ];
    $.when(new MybookTable().insert(query)).done(function() {
      navigator.notification.confirm(
        '책장으로 이동하기',
        loca,
        '책 추가가 완료되었습니다.',
        ['확인', '취소']
      );
    });
    function loca(result) {if(result === 1) {location.href="#mybook";}}
  }

  function updatePercent () {
    $.when(writeTable.selectPage(items.isbn)).done(function(results) {
      var page = results, len = results.length;
      console.log(JSON.stringify(page));
      console.log(len);
      for (i = 0; i < len; i++) {
        for (var j = page[i].s_page - 1; j < page[i].e_page; j++) {
          percent[j] = 1;
        }
      }
      updateBookFun();
    });
  }
  
  function updateBookFun() {
    var query = [
      totalPages,
      JSON.stringify(percent),
      items.isbn
    ]; 
    $.when(new MybookTable().updatePage(query)).done(function(results) {
      window.plugins.toast.showShortCenter("수정이 완료되었습니다.");
    });
  }

  this.getPercent = function (){
    return percent;
  }
  
  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };

  this.initialize();

}