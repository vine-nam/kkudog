var sqlite_db = function () {

  var database = null;

  function initDatabase() {
    database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
    createMybookTable();
    createWriteTable();
    createUserTable();
    createCharacterTable();
  }

  function createMybookTable() {
    database.transaction(function (transaction) {
      var executeQuery = 'CREATE TABLE IF NOT EXISTS MybookTable ('
        + 'isbn TEXT PRIMARY KEY NOT NULL, '
        + 'title TEXT NOT NULL, author TEXT, image TEXT '
        + ');';
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
        + 'contents TEXT NOT NULL, photos TEXT NOT NULL, date TEXT NOT NULL'
        + ');';
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
        + 'character INTEGER NOT NULL, dayCount INTEGER NOT NULL, '//책 isbn
        + 'todayPage INTEGER NOT NULL, AllPage INTEGER NOT NULL, '
        + 'startDay TEXT NOT NULL);';
      transaction.executeSql(executeQuery, [],
        function (tx, result) {//Success
          inputUserData();
        },
        function (error) {// Error
          alert("Error occurred while creating the table.");
        });
    }, function (error) {
      navigator.notification.alert('CREATE error: ' + error.message);
    });
  }

  function createCharacterTable() {
    database.transaction(function (transaction) {
      var executeQuery = 'CREATE TABLE IF NOT EXISTS CharacterTable ('
        + 'name TEXT NOT NULL, state BOOLEAN NOT NULL, '
        + 'mission TEXT NOT NULL, mstate BOOLEAN NOT NULL, '
        + 'mamount INTEGER NOT NULL, mamount2 INTEGER NOT NULL);';
      transaction.executeSql(executeQuery, [],
        function (tx, result) {//Success
          // alert("Table created UserTable successfully");
          inputCharacterData();
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
  
  function inputCharacterData() {
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT * FROM CharacterTable", [], function (tx, results) {
        if (!results.rows.length) {
          var data, executeQuery;
          data = [//boolean 0: false 1: true
            ["똘똘이", 1, "기본", true, 1, 0],
            ["cactus", 0, "총 50쪽 이상 읽으세요", 0, 50, 0],
            ["rabbit", 0, "총 100쪽 이상 읽으세요", 0, 100, 0],
            ["Blowfish", 0, "총 500쪽 이상 읽으세요", 0, 500, 0],
          ];
          for (var i=0; i<data.length; i++) {
            executeQuery = "INSERT INTO CharacterTable VALUES (?,?,?,?,?,?)";
            transaction.executeSql(executeQuery, data[i]
              , function (tx, result) {
                // alert('Inserted');
              },
              function (error) {
                alert('Error occurred');
              });
          }
        }
      }, null);
    }, null);
  }

  function dropTable(table) {
    database.transaction(function (transaction) {
      var executeQuery = 'DROP TABLE IF EXISTS ' + table;
      transaction.executeSql(executeQuery, [],
        function (tx, result) {//Success
          alert("Table DROP UserTable successfully");
        },
        function (error) {// Error
          alert("Error occurred while DROP the table.");
        }
      );
    });
  }

  document.addEventListener('deviceready', function () {
    initDatabase();
  });

  return {
    database: database
  }
};
