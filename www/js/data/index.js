var sqlite_db = function () {

  var database = null;

  function initDatabase() {
    database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
    createMybookTable();
    createWriteTable();
    createUserTable();
  }

  function createMybookTable() {
    database.transaction(function (transaction) {
      var executeQuery = 'CREATE TABLE IF NOT EXISTS MybookTable ('
        + 'isbn TEXT PRIMARY KEY NOT NULL, '
        + 'title TEXT NOT NULL, author TEXT, image TEXT '
        // +'date, page1, page2, content'
        //글 저장소 분리 할 것!!
        + ');';
      // transaction.executeSql('DROP TABLE IF EXISTS MybookTable', [],
      //   function (tx, result) {//Success
      //     alert("Table DROP WriteTable successfully");
      //   },
      //   function (error) {// Error
      //     alert("Error occurred while DROP the table.");
      //   }
      // );
      transaction.executeSql(executeQuery, [],
        function (tx, result) {//Success
          // alert("Table created MybookTable successfully");
        },
        function (error) {// Error
          alert("Error occurred while creating the table.");
        });
    }, function (error) {
      navigator.notification.alert('CREATE error: ' + error.message);
    });
  }

  function createWriteTable() {
    database.transaction(function (transaction) {
      var executeQuery = 'CREATE TABLE IF NOT EXISTS WriteTable ('
        + 'isbn TEXT NOT NULL, '//책 isbn
        + 's_page INTEGER NOT NULL, e_page INTEGER NOT NULL, page INTEGER NOT NULL, '
        + 'contents TEXT NOT NULL, date TEXT NOT NULL'
        + ');';
      // transaction.executeSql('DROP TABLE IF EXISTS WriteTable', [],
      //   function (tx, result) {//Success
      //     alert("Table DROP WriteTable successfully");
      //   },
      //   function (error) {// Error
      //     alert("Error occurred while DROP the table.");
      //   }
      // );
      transaction.executeSql(executeQuery, [],
        function (tx, result) {//Success
          // alert("Table created WriteTable successfully");
        },
        function (error) {// Error
          alert("Error occurred while creating the table.");
        });
    }, function (error) {
      navigator.notification.alert('CREATE error: ' + error.message);
    });
  }

  function createUserTable() {
    database.transaction(function (transaction) {
      var executeQuery = 'CREATE TABLE IF NOT EXISTS UserTable ('
        + 'userIndex INTEGER NOT NULL, gaugeSum INTEGER NOT NULL, '//책 isbn
        + 'alldayRead INTEGER NOT NULL, todayRead INTEGER NOT NULL, '
        + 'startDay TEXT NOT NULL);';
      // transaction.executeSql('DROP TABLE IF EXISTS UserTable', [],
      //   function (tx, result) {//Success
      //     alert("Table DROP UserTable successfully");
      //   },
      //   function (error) {// Error
      //     alert("Error occurred while DROP the table.");
      //   }
      // );
      transaction.executeSql(executeQuery, [],
        function (tx, result) {//Success
          // alert("Table created UserTable successfully");
          inputUserData();
        },
        function (error) {// Error
          alert("Error occurred while creating the table.");
        });
    }, function (error) {
      navigator.notification.alert('CREATE error: ' + error.message);
    });
  }

  function inputUserData() {
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT * FROM UserTable", [], function (tx, results) {
        if (!results.rows.length) {
          var data = [0, 0, 0, 0, new Date()];
          var executeQuery = "INSERT INTO UserTable VALUES (?,?,?,?,?)";
          transaction.executeSql(executeQuery, data
            , function (tx, result) {
              // alert('Inserted');
            },
            function (error) {
              alert('Error occurred');
            });
        }
      }, null);

    }, null);
  }

  document.addEventListener('deviceready', function () {
    initDatabase();
  });

  return {
    database: database
  }
};
