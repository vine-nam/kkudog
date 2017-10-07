var DBTodayPage = function () {
  var database;
  this.initialize = function () {
    database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  };
  this.month = function (key) {
    switch (key) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        break;
    }
  };
  this.getData = function() {
    var deferred = $.Deferred();
    today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var date = today.getDate();
    var query = [
      '%' + this.month(month) + '%' + date + '%' + year + '%'
    ];
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT page FROM WriteTable WHERE date LIKE ?", query, function (tx, results) {
        var results = results.rows;
        var len = results.length, i;
        var todayPage = 0;

        for (i = 0; i < len; i++) {
          todayPage += results.item(i).page;
        }

        deferred.resolve(todayPage);
      }, null);
    });
    return deferred.promise();
  };
  this.getAllData = function() {
    var deferred = $.Deferred();
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT page FROM WriteTable", [], function (tx, results) {
        var results = results.rows;
        var len = results.length, i;
        var AllPage = 0;

        for (i = 0; i < len; i++) {
          AllPage += Number(results.item(i).page);
        }

        deferred.resolve(AllPage);
      }, null);
    });
    return deferred.promise();
  };

  this.initialize();
}

var CharacterView = function () {
  var homeDate = {};
  var gauge = {
    0: "favorite_border", 
    1: "favorite"
  }
  var character = {
    0: ["똘똘이.png", "똘똘이2.png", "똘똘이3.png", "똘똘이4.png"],
    1: ["cactus.jpg", "cactus2.jpg", "cactus3.jpg", "cactus4.jpg"],
    2: ["rabbit.jpg", "rabbit2.jpg", "rabbit3.jpg", "rabbit4.jpg"]
  }

  homeDate.character = "";
  homeDate.gauge = [];
  homeDate.todayPage = 0;
  homeDate.AllPage = 0;

  var gData = [1,1,0];

  this.initialize = function () {
    this.$el = $('<div/>');
    this.characterData();
    this.gaugeData();
    this.render();
  };

  this.gaugeData = function() {
    for (var i in gData) {
      homeDate.gauge[i] = gauge[i];
    }
  }
  this.characterData = function() {
    homeDate.character = character[1][0];
  }

  this.setData = function (todayPage) {
    homeDate.todayPage = todayPage;
  }
  this.setAllData = function (AllPage) {
    homeDate.AllPage = AllPage;
  }

  this.render = function () {
    this.$el.html(this.template(homeDate));
    return this;
  };

  this.initialize();
} 