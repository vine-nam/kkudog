var DBPage = function () {
  var database;
  var c_page;
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
  this.getData = function (items) {
    var results;
    var deferred = $.Deferred();
    var query = [
      '%' + this.month(items.month) + '%' + items.year + '%'
    ];
    database.transaction(function (transaction) {
      transaction.executeSql("SELECT page, date FROM WriteTable WHERE date LIKE ?", query, function (tx, results) {
        results = results.rows;
        var data = [];
        var c_page = [];
        var dt;
        var page, date;
        var len = results.length, i;
        var startDay = new Date(items.year, items.month - 1, 0).getDay();
        if(startDay===6) {
          startDay = -1;
        }

        for (i = 0; i < len; i++) {

          page = Number(results.item(i).page);
          date = results.item(i).date;

          dt = new Date(date);
          day = dt.getDate() + startDay;
          //뭔가 복잡해졌어;;;;이름잘못지어서;;;;

          if (c_page[day] === undefined) {
            c_page[day] = page;
          } else {
            c_page[day] += page;
          }
        }

        deferred.resolve(c_page);
      }, null);
    });
    return deferred.promise();
  };
  this.getItems = function (items) {
    var results;
    var deferred = $.Deferred();
    var query = [
      '%' + this.month(items.month) + '%' + items.year + '%'
    ];
    var executeQuery = "SELECT w.rowid rowid, * FROM "
    + "WriteTable w INNER JOIN MybookTable m ON w.isbn=m.isbn "
    + "WHERE date LIKE ?";//왜 언디파인드야!1!!//컬럼 이름이 달라지는 건가???
    database.transaction(function (transaction) {
      transaction.executeSql(executeQuery, query, function (tx, results) {
        data = [];
        var month, day;
        var len = results.rows.length, i;
        var isbn, s_page, e_page, contents, date;
        for (i = 0; i < len; i++) {
          rowid = results.rows.item(i).rowid;
          isbn = results.rows.item(i).isbn;
          image = results.rows.item(i).image;
          title = results.rows.item(i).title;
          s_page = results.rows.item(i).s_page;
          e_page = results.rows.item(i).e_page;
          page = results.rows.item(i).page;
          contents = results.rows.item(i).contents;
          date = results.rows.item(i).date;

          var dt = new Date(date);
          month = dt.getMonth() + 1;
          day = dt.getDate();
          date = month + "월 " + day + "일";
          // alert(dt);
          data[i] = {
            rowid: rowid,
            isbn: isbn,
            image: image,
            title: title,
            s_page: s_page,
            e_page: e_page,
            page: page,
            contents: contents,
            date: date
          };
        }
        // // items.data = data;

        deferred.resolve(data);
      }, function(error) {
        navigator.notification.alert('error: ' + error.message);
      });
    });
    return deferred.promise();
  };

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

  this.render = function (cm) {
    items.cm = cm;
    this.$el.html(this.template(items));
    return this;
  };

  this.initialize();
} 