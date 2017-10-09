var CharacterListView = function () {

  var items;

  this.initialize = function () {
    this.$el = $('<div/>');
    this.render();
  };

  this.setData = function (data) {
    items = data;
    this.render();
  }

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };

  this.initialize();

}