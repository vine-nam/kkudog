var MybookInfoView = function (items) {

  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });

  var data;
  var items = items;
  var mybookcontentsView;
  var rowid;
  var index;
  //test serve
  // data = [
  //   {
  //     rowid: 1,
  //     s_page: 1,
  //     e_page: 3,
  //     contents: "블라브라라ㅏㅏㄴㅇㅁ",
  //     date: "9월1일"
  //   },
  //   {
  //     rowid: 2,
  //     s_page: 4,
  //     e_page: 13,
  //     contents: "이제 나도 그 별에서 함께 살게 되겠지.",
  //     date: "7월 29일"
  //   }
  // ];

  this.initialize = function () {
    this.$el = $('<div/>');
    this.$el.on('click', '.back', this.back);
    this.$el.on('click', function(e) {
      if(!$(e.target).hasClass("more")) {
        if ($("ul").hasClass("show")) {
          $("ul").removeClass("show");
        }
      }
    });
    this.$el.on('click', '.more', this.more);
    this.$el.on('click', '.update', this.update);
    this.$el.on('click', '.delete', this.delete);

    mybookcontentsView = new MybookContentsView();

    //test serve
    // mybookcontentsView.setMybook(data);

    database.transaction(function (transaction) {
      transaction.executeSql('SELECT rowid, * FROM WriteTable WHERE isbn=? ORDER BY rowid DESC', [items.isbn], function (tx, results) {

        data = [];
        var month, day;
        var len = results.rows.length, i;
        var isbn, s_page, e_page, contents, date;
        for (i = 0; i < len; i++) {
          rowid = results.rows.item(i).rowid;
          // isbn = results.rows.item(i).isbn;
          s_page = results.rows.item(i).s_page;
          e_page = results.rows.item(i).e_page;
          // page = results.rows.item(i).page;
          contents = results.rows.item(i).contents;
          date = results.rows.item(i).date;

          var dt = new Date(date);
          month = dt.getMonth() + 1;
          day = dt.getDate();
          date = month + "월 " + day + "일";

          data[i] = {
            rowid: rowid,
            s_page: s_page,
            e_page: e_page,
            // page: page,
            contents: contents,
            date: date
          };
        }
        // items.data = data;
        mybookcontentsView.setMybook(data);

      }, function(error) {
        navigator.notification.alert('error: ' + error.message);
      });
    });

    this.render();
  };

  this.back = function () {
    window.history.back();
  }

  this.more = function () {
    rowid = $(this).siblings(".rowid").text();
    index = $(this).siblings(".index").text();
    if ($("ul").hasClass("show")) {
      $("ul").removeClass("show");
    } else {
      $(this).next().addClass("show");
    }
  }

  this.update = function () {
    var writeView = new WriteView(items);
    database.transaction(function (transaction) {
      transaction.executeSql('SELECT * FROM WriteTable WHERE rowid=?', [rowid], function (tx, results) {

        items = [];
        var isbn, s_page, e_page, contents;
        isbn = results.rows.item(0).isbn;
        s_page = results.rows.item(0).s_page;
        e_page = results.rows.item(0).e_page;
        page = results.rows.item(0).page;
        contents = results.rows.item(0).contents;
        date = results.rows.item(0).date;
        items = { //rowid 있음 주의 **
          rowid: rowid, 
          isbn: isbn, 
          s_page: s_page, 
          e_page: e_page, 
          page: page, 
          contents: contents
        };
       
        writeView.setWrite(items);

      }, function (error) {
        navigator.notification.alert('SELECT error: ' + error.message);
      });
    });
  }

  //writeTable 연결헤서 한 번에 지울 수 있게 하기~~??
  this.delete = function () {
    if (rowid === "") {
      var executeQuery = "DELETE FROM WriteTable WHERE isbn=?";
      query = [items.isbn];//다른곳은 data라 했지만 이미 data라는 변수를 쓰고 있으므로 query라 하겠다....
      
      database.transaction(function (transaction) {
        transaction.executeSql(executeQuery, query,
          function (tx, result) { 
            alert('WriteTable Delete successfully'); 
            
            executeQuery = "DELETE FROM MybookTable WHERE isbn=?";
            database.transaction(function (transaction) {
              transaction.executeSql(executeQuery, query,
                function (tx, result) { 
                  alert('MybookTable Delete successfully');
                  history.back(); 
                },
                function (error) { 
                  alert('MybookTable Something went Wrong'); 
                });
            });
            
          },
          function (error) { 
            alert('WriteTable Something went Wrong'); 
          });
      });
      
    } else {
      var executeQuery = "DELETE FROM WriteTable WHERE rowid=?";
      query = [rowid];

      database.transaction(function (transaction) {
        transaction.executeSql(executeQuery, query,
          function (tx, result) { 
            alert('Delete successfully'); 

            data.splice(index, 1); 
            mybookcontentsView.setMybook(data);
          },
          function (error) { 
            alert('Something went Wrong'); 
          });
      });
    }
  }

  this.render = function () {
    this.$el.html(this.template(items));
    $('.contents', this.$el).html(mybookcontentsView.$el);
    return this;
  };


  this.initialize();

}