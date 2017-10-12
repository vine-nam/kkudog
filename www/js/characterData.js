var CharacterData = function () {
  var character = [
    {
      "name": "똘똘이",
      "state": false,
      "mission": "기본",
      "mstate": true
    },
    {
      "name": "cactus",
      "state": false,
      "mission": "총 50쪽 이상 읽으세요",
      "mamount": 50,
      "mstate": false,
      "mpercent": ""
    },
    {
      "name": "rabbit",
      "state": false,
      "mission": "총 100쪽 이상 읽으세요",
      "mamount": 100,
      "mstate": false,
      "mpercent": ""
    },
    {
      "name": "Blowfish",
      "state": false,
      "mission": "총 500쪽 이상 읽으세요",
      "mamount": 500,
      "mstate": false,
      "mpercent": ""
    }
  ];

  this.getCharacter = function () {
    return character;
  }
  this.setUseCharacter = function (index) {
    character[index].state = true;
  }

  this.mission = function (data1, userindex, i) {
    var data2 = character[i].mamount;

    if (data1 >= data2) {
      character[i].mstate = true;
    } else {
      character[i].mstate = false;
      if (userindex === i) {
        userindex = 0;
      }
      character[i].mpercent = data1 + "/" + character[i].mamount;
    }

    return userindex;
  }

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