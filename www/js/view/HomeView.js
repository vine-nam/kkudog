var HomeView = function (page, isLoading) {
  var calendarView;
  var cal;
  var dbPage;
  var year;
  var month;
  var dbPage;

  var character = {
    0: "똘똘이.png",
    1: "똘똘이2.png",
    2: "똘똘이3.png",
    3: "똘똘이4.png"
  }

  this.initialize = function () {
    calendarView = new CalendarView();
    cal = new calendar();
    year = cal.getYear();
    month = cal.getMonth();
    dbPage = new DBPage();
    items = {};

    this.$el = $('<div/>');

    this.$el.on('click', '#prev', function (event) {
      event.preventDefault();
      items = cal.getCal(year, --month);
      dbPage.getData(items).then(function (results) {
        items.c_page = results;
        calendarView.setCal(items);
        calendarView.render();
      });
    });

    this.$el.on('click', '#next', function (event) {
      event.preventDefault();
      items = cal.getCal(year, ++month);
      dbPage.getData(items).then(function (results) {
        items.c_page = results;
        calendarView.setCal(items);
        calendarView.render();
      });
    });

    items = cal.getCal(year, month);
    dbPage.getData(items).then(function (results) {
      items.c_page = results;
      calendarView.setCal(items);
      calendarView.render();
    });

    // 테스트 코드
    // items.c_page = [,,,,,,1,2,3,4];
    // calendarView.setCal(items);
    // calendarView.render();

    this.render();
  };
  
  this.render = function () {
    this.$el.html(this.template(character));
    $('.calendar', this.$el).html(calendarView.$el);
    return this;
  };

  this.initialize();
};
