var CharacterData = function () {
  var database;


  this.initialize = function () {
    database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  };

  this.getCharacter = function () {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT * FROM CharacterTable", [], function (tx, results) {
        var len = results.rows.length, i;
        for (i = 0; i < len; i++) {
          character[i] = {
            "name": results.rows.item(i).name,
            "state": results.rows.item(i).state,
            "mission": results.rows.item(i).mission,
            "mstate": results.rows.item(i).mstate,
            "mamount": results.rows.item(i).mamount,
            "mpercent": results.rows.item(i).mpercent,
            "mpercent2": results.rows.item(i).mpercent2,
          }
        }
        deferred.resolve(character);
      }, null);
    });
    return deferred.promise();
  }

  this.updateData = function (column, value, name) {
    var executeQuery = "UPDATE CharacterTable SET "+column+"=? WHERE name=?";
    database.transaction(function (transaction) {
      transaction.executeSql(executeQuery, [value, name], function (tx, results) {
      }, function (tx, result) {
        alert('Updated');
      },
        function (error) {
          alert('Error occurred');
        });
    }, function (error) {
      navigator.notification.alert('UPDATE error: ' + error.message);
    });
  }

  this.initialize();
}

var DBUserData = function () {
  var database;
  var userData = {};

  this.initialize = function () {
    database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  };

  this.getData = function () {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT * FROM UserTable", [], function (tx, results) {
        userData = results.rows.item(0);
        deferred.resolve(userData);
      }, null);
    });
    return deferred.promise();
  }

  this.updateData = function (column, value) {
    var executeQuery = "UPDATE UserTable SET "+column+"=?";
    database.transaction(function (transaction) {
      transaction.executeSql(executeQuery, [value], function (tx, results) {
      }, function (tx, result) {
        alert('Updated');
      },
        function (error) {
          alert('Error occurred');
        });
    }, function (error) {
      navigator.notification.alert('UPDATE error: ' + error.message);
    });
  }

  this.initialize();
}