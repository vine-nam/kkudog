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