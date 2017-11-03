var MybookListView = function () {

  var items;

  this.initialize = function () {
    this.$el = $('<div/>');

    this.render();

  };

  this.setMybook = function(data) {
    items = data;
    this.render();
  }

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };



  this.initialize();

}