var MybookView = function () {
  var mybookListView;
  var items;
  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });  
  
  this.initialize = function () {
    this.$el = $('<div/>');

    mybookListView = new MybookListView();

    database.transaction(function (transaction) {
      transaction.executeSql('SELECT * FROM MybookTable', [], function (tx, results) {

        items = [];
        var len = results.rows.length, i;
        var isbn, title, author, image;
        for (i = 0; i < len; i++) {
          isbn = results.rows.item(i).isbn;
          title = results.rows.item(i).title;
          author = results.rows.item(i).author;
          image = results.rows.item(i).image;//왜 img로 만느건야 과거에 나ㅏㅏㅏ
          items[i] = { isbn: isbn, title: title, author: author, image: image };
        }

        mybookListView.setMybook(items);

      }, null);
    });

    this.render();
  };

  this.getItems = function () {
    return items;
  }

  this.render = function () {
    this.$el.html(this.template());
    $('.content', this.$el).html(mybookListView.$el);
    return this;
  };

  this.initialize();
}