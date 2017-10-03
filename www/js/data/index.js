var sqlite_db = function () {

  var database = null;

  function initDatabase() {
    database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
    createMybookTable();
    createWriteTable();
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

//디비 설계가 필요행~~~
//page도 넣기~~~~~~~~`
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

  function inputData(data) {
    alert("inputData");
    // alert(data);
    database.transaction(function (transaction) {
      var data = ["112", "11", "1", "1111"];
      var executeQuery = "INSERT INTO BookInfoTable VALUES (?,?,?,?)";
      transaction.executeSql(executeQuery, data
        , function (tx, result) {
          alert('Inserted');
        },
        function (error) {
          alert('Error occurred');
        });
    }, function (error) {
      navigator.notification.alert('SELECT count error: ' + error.message);
    });
  }

  function showData() {
    database.transaction(function (transaction) {
      transaction.executeSql('SELECT * FROM BookInfoTable', [], function (tx, results) {
        alert("축!하!");
        //   var len = results.rows.length, i;
        //   for (i = 0; i < len; i++) {
        //     alert(results.rows.item(i).isbn);
        //   }
        data = results;
      }, null);
    });
  }

  document.addEventListener('deviceready', function () {
    // $('.icon-gear').click(function() {
    //   // var a = showData();
    //   var a = showData();
    //   console.log(a);
    // });
    // $('.add-book').click(inputData);
  
    initDatabase();
  });

  return {
    database: database
  }
};
