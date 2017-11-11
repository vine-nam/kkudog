var MybookHeaderView = function (items) {

  var items = items;

  this.initialize = function () {
    this.$el = $('<div/>');
    this.render();
  };

  this.setComplete = function (data) {
    items.complete = data;
    this.render();
  }

  this.setSumPercent = function (data) {
    items.SumPercent = data;
    this.render();
  }

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };


  this.initialize();

}