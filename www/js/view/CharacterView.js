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
  var gauge = ["favorite", "favorite_border"];
  var character = "cactus";
  var c = 0;

  homeDate.character = "";
  homeDate.gauge = [];
  homeDate.todayPage = 0;
  homeDate.AllPage = 0;

  var gData = [1,1,1];

  this.initialize = function () {
    this.$el = $('<div/>');
    this.characterData();
    this.gaugeData();
    this.render();
  };

  this.gaugeData = function() {
    for (var i in gData) {
      homeDate.gauge[i] = gauge[gData[i]];
    }
  }
  this.characterData = function() {
    c = 0;
    for (var i in gData) {
      c = c + gData[i];
    }
    // homeDate.character = character[0]+c;
    homeDate.character = character+c;
  }

  this.setData = function (todayPage) {
    homeDate.todayPage = todayPage;
  }
  this.setAllData = function (AllPage) {
    homeDate.AllPage = AllPage;
  }

  this.setTdData = function(data) {
    gData = data;
    gData.sort();
    this.gaugeData();
    this.characterData();
    this.render();
  }
  this.setCharacterData = function(c_data) {
    character = c_data;
    homeDate.character = character+c;
    this.render();
  }

  this.render = function () {
    this.$el.html(this.template(homeDate));
    return this;
  };

  this.initialize();
} 

var TdData = function() {
  this.getData = function() {
    var date = new Date();
    var today = date.getDate();
    var startDay = new Date(date.getFullYear(), date.getMonth(), 0).getDay();
    if(startDay===6) {
      startDay = -1;
    }
    var day = today+startDay;
    var td = $('td');
    $(td[day]).addClass("today-td");
    var gData = [1,1,1];
    for(var i=0; i<3; i++) {
      if($(td[day-i]).children("p").text()) {
        gData[i] = 0;
      }
    }
    return gData;
  }
}