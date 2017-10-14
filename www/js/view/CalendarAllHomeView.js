var CalendarAllHomeView = function () {
  var calendarAllView;
  // var mybookcontentsView;
  var cal;
  var year;
  var month;
  var dbPageAll;
  var items = {};

  this.initialize = function () {
    calendarAllView = new CalendarAllView();
    // mybookcontentsView = new MybookContentsView();
    cal = new calendar();
    year = cal.getYear();
    dbPageAll = new DBPageAll();

    this.$el = $('<div/>');

    this.$el.on('mouseenter', 'table', function() {
        $(this).children("caption").css("background", "antiquewhite");
      })
      .on('mouseleave', 'table', function() {
        $(this).children("caption").css("background", "");
      });
      /*
      .on('click', 'table', function(event) {
        event.preventDefault();
        year = $(".year").html();
        var data = {};
        month = $(this).children().children(".month").text();
        data[0] = cal.getCal(year, month);
        console.log(month);
        console.log(data);
        calendarAllView.setCal(data);
        calendarAllView.render();
        mybookcontentsView.setMybook(data);
      });
      */

    this.$el.on('click', '.prev', function (event) {
      event.preventDefault();
      dbPageAll.getData(--year).then(function (results) {
        for (var i = 0; i < 12; i++) {
          items[i] = cal.getCal(year, i+1);
          items[i].c_page = results[i].c_page;
        }//됐다!!!!!!!!!!
        calendarAllView.setCal(items);
        calendarAllView.render();
        $(".year").html(year);
      });
    });

    this.$el.on('click', '.next', function (event) {
      event.preventDefault();
      dbPageAll.getData(++year).then(function (results) {
        for (var i = 0; i < 12; i++) {
          items[i] = cal.getCal(year, i+1);
          items[i].c_page = results[i].c_page;
        }//됐다!!!!!!!!!!
        calendarAllView.setCal(items);
        calendarAllView.render();
        $(".year").html(year);
      });
    });
    
    dbPageAll.getData(year).then(function (results) {
      for (var i = 0; i < 12; i++) {
        items[i] = cal.getCal(year, i+1);
        items[i].c_page = results[i].c_page;
      }//됐다!!!!!!!!!!
      calendarAllView.setCal(items);
      calendarAllView.render();
    });

    //테스트 코드
    // for (var i = 0; i < 12; i++) {
    //   items[i] = cal.getCal(year, i+1);
    //   items[i].c_page = [,,,1,2,3,4,5,,,,4,5,6];
    // }
    // calendarAllView.setCal(items);
    // calendarAllView.render();

    this.render();
  };
  
  this.render = function () {
    this.$el.html(this.template(year));
    $('.content', this.$el).html(calendarAllView.$el);
    return this;
  };

  this.initialize();
};
