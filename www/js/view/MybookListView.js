var MybookListView = function () {

  var items;

  //test serve
  // items = [
  //   {
  //     title: "aa",
  //     image: "../../img/image-not-found.png",
  //     isbn: "123"
  //   },
  //   {
  //     title: "aa",
  //     image: "../../img/book-img.png",
  //     isbn: "123"
  //   }
  // ];

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