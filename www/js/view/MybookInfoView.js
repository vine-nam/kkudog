var MybookInfoView = function (items) {

  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });

  var data;
  var items = items;
  var mybookcontentsView;
  var rowid;
  var index;

  this.initialize = function () {
    this.$el = $('<div/>');
    this.$el.on('click', '.back', this.back);
    this.$el.on('click', function (e) {
      if (!$(e.target).hasClass("more")) {
        if ($("ul").hasClass("show")) {
          $("ul").removeClass("show");
        }
      }
    });
    this.$el.on('click', '.more', this.more);
    this.$el.on('click', '.update', this.update);
    this.$el.on('click', '.delete', this.delete);

    mybookcontentsView = new MybookContentsView();

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
          photos = results.rows.item(i).photos;

          var dt = new Date(date);
          month = dt.getMonth() + 1;
          day = dt.getDate();
          date = month + "월 " + day + "일";

          var pt = photos.split("//imagefile//");
          pt.shift();

          data[i] = {
            rowid: rowid,
            s_page: s_page,
            e_page: e_page,
            // page: page,
            contents: contents,
            date: date,
            photos: pt
          };
        }
        // items.data = data;
        mybookcontentsView.setMybook(data);

      }, function (error) {
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
        var isbn, s_page, e_page, contents, photos;
        isbn = results.rows.item(0).isbn;
        s_page = results.rows.item(0).s_page;
        e_page = results.rows.item(0).e_page;
        page = results.rows.item(0).page;
        contents = results.rows.item(0).contents;
        date = results.rows.item(0).date;
        photos = results.rows.item(0).photos;

        var pt = photos.split("//imagefile//");
        pt.shift();

        items = { //rowid 있음 주의 **
          rowid: rowid,
          isbn: isbn,
          s_page: s_page,
          e_page: e_page,
          page: page,
          contents: contents,
          photos: pt
        };

        writeView.setWrite(items);

      }, function (error) {
        navigator.notification.alert('SELECT error: ' + error.message);
      });
    });
  }

  this.delete = function () {
    navigator.notification.confirm(
      '삭제하기',
      deleteItem,
      '정말로 삭제하시겠습니까',
      ['확인', '취소']
    );

    function deleteItem(result) {
      if (result === 1) {
        if (rowid === "") {
          var executeQuery = "DELETE FROM WriteTable WHERE isbn=?";
          query = [items.isbn];//다른곳은 data라 했지만 이미 data라는 변수를 쓰고 있으므로 query라 하겠다....

          database.transaction(function (transaction) {
            transaction.executeSql(executeQuery, query,
              function (tx, result) {
                // alert('WriteTable Delete successfully');

                executeQuery = "DELETE FROM MybookTable WHERE isbn=?";
                database.transaction(function (transaction) {
                  transaction.executeSql(executeQuery, query,
                    function (tx, result) {
                      // alert('MybookTable Delete successfully');
                      window.plugins.toast.showShortBottom("삭제되었습니다.");
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
                // alert('Delete successfully');
                window.plugins.toast.showShortBottom("삭제되었습니다.");

                data.splice(index, 1);
                mybookcontentsView.setMybook(data);
              },
              function (error) {
                alert('Something went Wrong');
              });
          });
        }
      }
    }
  }

  this.render = function () {
    this.$el.html(this.template(items));
    $('.contents', this.$el).html(mybookcontentsView.$el);
    return this;
  };


  this.initialize();

}