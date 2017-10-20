var SettingView = function () {

  this.initialize = function () {
    this.$el = $('<div/>');
    this.$el.on('click', '.back', this.back);

    this.render();
  };

  this.back = function () {
    window.history.back();
  }

  this.render = function () {
    this.$el.html(this.template());
    return this;
  };

  this.initialize();

}