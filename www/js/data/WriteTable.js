var WriteTable = function () {

  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  var items = [];

  this.select = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql('SELECT rowid, * FROM WriteTable WHERE isbn=? ORDER BY rowid DESC', [query], function (tx, results) {
        var len = results.rows.length, i, item;
        for (i = 0; i < len; i++) {
          item = results.rows.item(i);
          items[i] = {
            rowid: item.rowid,
            s_page: item.s_page,
            e_page: item.e_page,
            contents: item.contents,
            date: dateToString(item.date),
            photos: item.photos.split("//imagefile//").shift()
          };
        }
        deferred.resolve(items);
      }, function (error) {
        alert('error: ' + error.message);
      });
    });
    return deferred.promise();
  }

  this.selectPage = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql('SELECT s_page, e_page FROM WriteTable WHERE isbn=?', [query], function (tx, results) {
        var len = results.rows.length, i, item;
        for (i = 0; i < len; i++) {
          item = results.rows.item(i);
          items[i] = {
            s_page: item.s_page,
            e_page: item.e_page
          }
        }
        deferred.resolve(items);
      }, null);
    });
    return deferred.promise();
  }

  this.selectOne = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql('SELECT * FROM WriteTable WHERE rowid=?', [query], function (tx, results) {

        items = [];
        var item = results.rows.item(0);
        items = { //rowid 있음 주의 **
          rowid: query,
          isbn: item.isbn,
          s_page: item.s_page,
          e_page: item.e_page,
          page: item.page,
          contents: item.contents,
          photos: item.photos.split("//imagefile//").shift()
        };
        
        deferred.resolve(items);
      }, function (error) {
        navigator.notification.alert('SELECT error: ' + error.message);
      });
    });
    return deferred.promise();
  }

  this.insert = function (query) {
    database.transaction(function (transaction) {
      transaction.executeSql("INSERT INTO WriteTable VALUES (?,?,?,?,?,?,?)", query
        , function (tx, result) {
          window.plugins.toast.showShortBottom("저장되었습니다.");
          history.back();
        },
        function (error) {
          alert('Error occurred');
        });
    }, function (error) {
      alert('CREATE error: ' + error.message);
    });
  }

  this.update = function (query) {
    database.transaction(function (transaction) {
      transaction.executeSql("UPDATE WriteTable SET s_page=?, e_page=?, page=?, contents=?, photos=? WHERE rowid=?", query
        , function (tx, result) {
          window.plugins.toast.showShortBottom("저장되었습니다.");
          history.back();
        },
        function (error) {
          alert('Error occurred');
        });
    }, function (error) {
      alert('CREATE error: ' + error.message);
    });
  }

  this.delete = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("DELETE FROM WriteTable WHERE isbn=?", [query],
        function (tx, result) {
          deferred.resolve();
        },
        function (error) {
          alert('WriteTable Something went Wrong');
        });
    });
    return deferred.promise();
  }

  this.deleteOne = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("DELETE FROM WriteTable WHERE rowid=?", [query],
        function (tx, result) {
          deferred.resolve();
        },
        function (error) {
          alert('Something went Wrong');
        });
    });
    return deferred.promise();
  }

}

function dateToString (date) {
  var month, day;
  var dt = new Date(date);
  month = dt.getMonth() + 1;
  day = dt.getDate();
  return  (month + "월 " + day + "일");
}
