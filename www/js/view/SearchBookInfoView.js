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
    //db부르기
    var itemsInfo = items.volumeInfo;
    // alert(itemsInfo.industryIdentifiers[0].identifier);
    var data = [
      itemsInfo.industryIdentifiers[0].identifier,
      itemsInfo.title,
      itemsInfo.authors,
      itemsInfo.imageLinks.smallThumbnail
    ];
    database.transaction(function (transaction) {
      var executeQuery = "INSERT INTO MybookTable VALUES (?,?,?,?)";
      transaction.executeSql(executeQuery, data
        , function (tx, result) {
          alert('Inserted');
        },
        function (error) {
          alert('Error occurred');
        });
    }, null);
  }

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };

  this.initialize();

}