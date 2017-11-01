var SearchBookInfoView = function (items) {

  var items = [];
  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  
  this.initialize = function () {
    this.$el = $('<div/>');

    this.render();
  };

  this.close = function () {
    event.preventDefault();
    $('#overlay').css("display", "none");
  };

  this.setData = function (data) {
    items = data;
  }

  this.addBook = function (event) {
    var page = $('#a_page').val();
    if(!page) {
      window.plugins.toast.showShortCenter("페이지를 입력해 주세요");
      return;
    }
    var data = [
      items.isbn,
      items.title,
      items.author,
      page,
      items.image
    ];
    database.transaction(function (transaction) {
      var executeQuery = "INSERT INTO MybookTable VALUES (?,?,?,?,?)";
      transaction.executeSql(executeQuery, data
        , function (tx, result) {
          // alert('Inserted');
          navigator.notification.confirm(
            '책장으로 이동하기',
            loca,
            '책 추가가 완료되었습니다.',
            ['확인', '취소']
          );
        },
        function (error) {
          // alert('Error occurred');
          window.plugins.toast.showShortCenter("이미 추가된 책입니다.");
          console.log(JSON.stringify(error));
        });
    }, null);
    function loca(result) {if(result === 1) {location.href="#mybook";}}
  }

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };

  this.initialize();

}