var MybookView = function () {
  var mybookListView;
  var items = [];
 
  this.initialize = function () {
    this.$el = $('<div/>');

    mybookListView = new MybookListView();
    var mybookTable = new MybookTable();
    $.when(mybookTable.select()).done(function(results) {
      items = results;
      mybookListView.setMybook(items);
    });

    this.render();
  };

  this.getItems = function () {
    return items;
  }

  this.render = function () {
    this.$el.html(this.template());
    $('.content', this.$el).html(mybookListView.$el);
    return this;
  };

  this.initialize();
}