var CalendarAllHomeView = function () {
  var calendarAllView;
  var cal;
  var year;
  var dbPageAll;
  var items = {};

  this.initialize = function () {
    calendarAllView = new CalendarAllView();
    cal = new calendar();
    year = cal.getYear();
    dbPageAll = new DBPageAll();

    this.$el = $('<div/>');
    this.$el.on('click', '.prev', this.prev);
    this.$el.on('click', '.next', this.next);

    allCal(year);
    this.render();
  };
  
  this.prev = function (event) {
    event.preventDefault();
    allCal(--year);
  }

  this.next = function (event) {
    event.preventDefault();
    allCal(++year);
  }

  function allCal(year) {
    dbPageAll.getData(year).then(function (results) {
      for (var i = 0; i < 12; i++) {
        items[i] = cal.getCal(year, i+1);
        items[i].c_page = results[i].c_page;
      }
      calendarAllView.setCal(items);
      calendarAllView.render();
      $(".year").html(year);
    });
  }

  this.render = function () {
    this.$el.html(this.template(year));
    $('.content', this.$el).html(calendarAllView.$el);
    return this;
  };

  this.initialize();
};
