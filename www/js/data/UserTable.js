var UserTable = function () {
  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  var userData = {};
    
  this.select = function () {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT * FROM UserTable", [], function (tx, results) {
        userData = results.rows.item(0);
        deferred.resolve(userData);
      }, null);
    });
    return deferred.promise();
  }

  this.update = function (column, value) {
    var executeQuery = "UPDATE UserTable SET "+column+"=?";
    database.transaction(function (transaction) {
      transaction.executeSql(executeQuery, [value], function (tx, results) {
      }, function (tx, result) {
        window.plugins.toast.showShortBottom("수정되었습니다.");
      },
        function (error) {
          alert('Error occurred');
        });
    }, function (error) {
      navigator.notification.alert('UPDATE error: ' + error.message);
    });
  }
}