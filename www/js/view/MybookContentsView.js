var MybookContentsView = function () {
  
    var items;
  
    this.initialize = function () {
      this.$el = $('<div/>');
      // this.$el.on('click', '.icon-more', function() {
      //   console.log($( this ));
      // });
      this.render();
    };
  
    this.setMybook = function(data) {
      items = data;
      this.render();
    }
  
    // this.popup = function () {
    //   $(this).toggleClass("show");
    // }

    this.render = function () {
      this.$el.html(this.template(items));
      return this;
    };
  
    this.initialize();
  
  }