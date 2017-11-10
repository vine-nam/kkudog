var MybookTable = function () {
  
  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });  
  var items = [];

  this.select = function () {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql('SELECT * FROM MybookTable', [], function (tx, results) {
    
        var len = results.rows.length, i, item;
        for (i = 0; i < len; i++) {
          item = results.rows.item(i);
          items[i] = { 
            isbn: item.isbn, 
            title: item.title, 
            author: item.author,
            publisher: item.publisher, 
            totalPages: item.totalPages, 
            percent: JSON.parse(item.percent),
            SumPercent: sumPercent(item.totalPages, item.percent),
            image: item.image 
          };
        }
        deferred.resolve(items);
      }, null);
    });
    return deferred.promise();
  }

  this.selectPercent = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT percent, totalPages FROM MybookTable WHERE isbn=?", [query]
        , function (tx, result) {
          items = {
            totalPages: result.rows.item(0).totalPages,
            percent: JSON.parse(result.rows.item(0).percent)
          };
          deferred.resolve(items);
        },
        function (error) {
          alert('Error occurred');
        });
      }, function (error) {
        alert('CREATE error: ' + error.message);
    });
    return deferred.promise();
  }

  this.insert = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("INSERT INTO MybookTable VALUES (?,?,?,?,?,?,?)", query
        , function (tx, result) {
          deferred.resolve();
        },
        function (error) {
          window.plugins.toast.showShortCenter("이미 추가된 책입니다.");
          console.log(JSON.stringify(error));
        });
    }, null);
    return deferred.promise();
  }

  this.updatePercent = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("UPDATE MybookTable SET percent=? WHERE isbn=?", query
        , function (tx, result) {
          deferred.resolve();
        },
        function (error) {
          alert('Error occurred');
        });
    }, function (error) {
      alert('CREATE error: ' + error.message);
    });
    return deferred.promise();
  }

  this.updatePage = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("UPDATE MybookTable SET totalPages=?, percent=? WHERE isbn=?", query
        , function (tx, result) {
          deferred.resolve();
        },
        function (error) {
          window.plugins.toast.showShortCenter("오류가 발생했습니다...죄송합니다.ㅠㅠ");
        });
    }, null);
    return deferred.promise();
  }

  this.delete = function (query) {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("DELETE FROM MybookTable WHERE isbn=?", [query],
        function (tx, result) {
          deferred.resolve();
        },
        function (error) {
          alert('MybookTable Something went Wrong');
        });
    });
    return deferred.promise();
  }
}


function sumPercent(tdata, pdata) {
  var SumPercent = 0;
  var totalPages = tdata;
  var percent = JSON.parse(pdata);
  for (var j=0; j<totalPages; j++) {
    if (percent[j]===1) {
      SumPercent += percent[j];
    }
  }
  SumPercent = Math.ceil(SumPercent/totalPages*100);
  return SumPercent;
}