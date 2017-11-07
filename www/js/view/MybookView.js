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
        var isbn, title, author, totalPages, percent, SumPercent, image;
        for (i = 0; i < len; i++) {
          isbn = results.rows.item(i).isbn;
          title = results.rows.item(i).title;
          author = results.rows.item(i).author;
          totalPages = results.rows.item(i).totalPages;
          percent = JSON.parse(results.rows.item(i).percent);
          image = results.rows.item(i).image;//왜 img로 만느건야 과거에 나ㅏㅏㅏ

          SumPercent = 0;
          for (var j=0; j<totalPages; j++) {
            if (percent[j]===1) {
              SumPercent += percent[j];
            }
          }
          SumPercent = Math.ceil(SumPercent/totalPages*100);

          items[i] = { 
            isbn: isbn, 
            title: title, 
            author: author, 
            totalPages: totalPages, 
            percent: percent,
            SumPercent: SumPercent,
            image: image 
          };
        }
        console.log(JSON.stringify(items));

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