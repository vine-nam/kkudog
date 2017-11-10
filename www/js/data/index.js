var sqlite_db = function () {

  var database = null;
  var deferred = $.Deferred();

  function initDatabase() {
    database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
    $.when(createMybookTable(), createWriteTable(), createUserTable())
      .done(function () {
        deferred.resolve();
      }
    )
  }

  function createMybookTable() {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      var executeQuery = 'CREATE TABLE IF NOT EXISTS MybookTable ('
        + 'isbn TEXT PRIMARY KEY NOT NULL, '
        + 'title TEXT NOT NULL, author TEXT, publisher TEXT, '
        + 'totalPages INTEGER NOT NULL, percent TEXT, image TEXT '
        + ');';
      transaction.executeSql(executeQuery, [],
        function (tx, result) {//Success
        },
        function (error) {// Error
          alert("Error occurred while creating the table.");
        });
        deferred.resolve();
    }, function (error) {
      navigator.notification.alert('CREATE error: ' + error.message);
    });
    return deferred.promise();
  }

  function createWriteTable() {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      var executeQuery = 'CREATE TABLE IF NOT EXISTS WriteTable ('
        + 'isbn TEXT NOT NULL, '//책 isbn
        + 's_page INTEGER NOT NULL, e_page INTEGER NOT NULL, page INTEGER NOT NULL, '
        + 'contents TEXT NOT NULL, photos TEXT NOT NULL, date TEXT NOT NULL'
        + ');';
      transaction.executeSql(executeQuery, [],
        function (tx, result) {//Success
        },
        function (error) {// Error
          alert("Error occurred while creating the table.");
        });
        deferred.resolve();
    }, function (error) {
      navigator.notification.alert('CREATE error: ' + error.message);
    });
    return deferred.promise();
  }

  function createUserTable() {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      var executeQuery = 'CREATE TABLE IF NOT EXISTS UserTable ('
        + 'character INTEGER NOT NULL, dayCount INTEGER NOT NULL, '//책 isbn
        + 'todayPage INTEGER NOT NULL, AllPage INTEGER NOT NULL, '
        + 'startDay TEXT NOT NULL);';
      transaction.executeSql(executeQuery, [],
        function (tx, result) {//Success
          inputUserData(deferred);
        },
        function (error) {// Error
          alert("Error occurred while creating the table.");
        });
    }, function (error) {
      navigator.notification.alert('CREATE error: ' + error.message);
    });
    return deferred.promise();
  }

  function inputUserData(deferred) {
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT * FROM UserTable", [], function (tx, results) {
        if (!results.rows.length) {
          var data = [0, 0, 0, 0, new Date()];
          var executeQuery = "INSERT INTO UserTable VALUES (?,?,?,?,?)";
          transaction.executeSql(executeQuery, data
            , function (tx, result) {
            },
            function (error) {
              alert('Error occurred');
            });
        }
        deferred.resolve();
      }, null);

    }, null);
  }

  initDatabase();
  return deferred.promise();

};
