var DBPageAll = function () {
  var database;
  var c_page;
  this.initialize = function () {
    database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  }
 this.getData = function (year) {
    var results;
    var items = {};
    var deferred = $.Deferred();
    var query = [
      '%' + year + '%'
    ];
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT s_page, e_page, date FROM WriteTable WHERE date LIKE ?", query, function (tx, results) {
        results = results.rows;
        var dt, month, day;
        var date;
        var len = results.length, i;
        var startDay;

        for (i = 0; i < 12; i++) {
          items[i] = {c_page: []};
        }

        for (i = 0; i < len; i++) {

          date = results.item(i).date;

          dt = new Date(date);
          month = dt.getMonth();
          startDay = new Date(year, month, 0).getDay();
          if(startDay===6) {
            startDay = -1;
          }
          day = dt.getDate() + startDay;
          
          items[month].c_page[day] = true;
        }
        deferred.resolve(items);
      }, null);
    });
    return deferred.promise();
  }
  this.initialize();
}

var CalendarAllView = function () {

  var items = {};
  var cal;
  var year;
  var month;

  this.initialize = function () {
    this.$el = $('<div/>');

    cal = new calendar();
    year = cal.getYear();
    for (var i = 0; i < 12; i++) {
      items[i] = cal.getCal(year, i+1);
    }

    this.render();
  };

  this.setCal = function (data) {
    items = data;
    // alert(Object.keys(items).length);
    // 객체 길이 구하는법!
  }

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };

  this.initialize();
}