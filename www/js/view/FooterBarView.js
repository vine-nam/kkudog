var FooterBarView = function (tag) {

  var tags = {
    home: false,
    mybook: false,
    calendar: false,
    search: false,
    settings: false
  };

  this.initialize = function () {
    this.$el = $('<div/>');

    var keys = Object.keys(tags);    
    for ( var i in keys) {
      if(keys[i]===tag) {
        tags[keys[i]] = true;
        return;
      }
    }
    
    this.render();
  };

  this.render = function () {
    this.$el.html(this.template(tags));
    // this.$el.$('.books').addClass("active");
    return this;
  };

  this.initialize();

}