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