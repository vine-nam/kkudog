var SearchBookInfoView = function (items) {

  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  
  this.initialize = function () {
    this.$el = $('<div/>');
    this.$el.on('click', '.back', this.back);
    this.$el.on('click', '.add-book', this.addBook);

    this.render();
  };

  this.back = function () {
    window.history.back();
  }

  this.addBook = function (event) {
    var data = [
      items.isbn,
      items.title,
      items.author,
      items.image
    ];
    database.transaction(function (transaction) {
      var executeQuery = "INSERT INTO MybookTable VALUES (?,?,?,?)";
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
          console.log(JSON.stringify(error));
        });
    }, null);
  }

  function loca(result) {if(result === 1) {location.href="#mybook";}}

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };

  this.initialize();

}