var DBPage = function() {
  var database;
  var c_page;
  this.initialize = function() {
    database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  }
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
  }
  this.getData = function(items) {
    var results;
    var deferred = $.Deferred();
    var query = [
      '%'+this.month(items.month)+'%'+items.year+'%'
    ];
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT rowid, s_page, e_page, date FROM WriteTable WHERE date LIKE ?", query, function (tx, results) {
        results = results.rows;
        var data = [];
        var c_page = [];
        var dt;
        var s_page, e_page, page, date;
        var len = results.length, i;
        var startDay = new Date(items.year, items.month-1, 0).getDay();

        for (i = 0; i < len; i++) {
    
          s_page = results.item(i).s_page;
          e_page = results.item(i).e_page;
          page = e_page - s_page + 1;
          date = results.item(i).date;
    
          dt = new Date(date);
          day = dt.getDate() + startDay;
          //뭔가 복잡해졌어;;;;이름잘못지어서;;;;
          
          if(c_page[day]===undefined){
            c_page[day] = page;
          } else {
            c_page[day] += page;
          }
        }

        deferred.resolve(c_page);
      }, null);
    });
    return deferred.promise();
  }

  this.initialize();
}

var CalendarView = function () {

  var items = {}
  var cal;
  var year;
  var month;

  this.initialize = function () {
    this.$el = $('<div/>');

    cal = new calendar();
    year = cal.getYear();
    month = cal.getMonth();
    items = cal.getCal(year, month);

    this.render();
  };

  this.setCal = function (data) {
    items = data;
  }

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };

  this.initialize();
} 