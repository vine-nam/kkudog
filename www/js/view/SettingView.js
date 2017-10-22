var SettingView = function () {

  var alarm = false;
  var items = 1;

  this.initialize = function () {
    this.$el = $('<div/>');
    this.$el.on('click', '.back', this.back);
    this.$el.on('click change', '.lever', this.ln);

    this.checkbox();
    this.render();
  };

  this.checkbox = function () {
    items = Number(localStorage.getItem('alarm')) === 1 ? 1 : 0;
  }

  this.ln = function () {
    items = items === 1 ? 0 : 1;
    localStorage.setItem('alarm', items);
    if(items === 0) {
      cordova.plugins.notification.local.cancelAll(function() {
        console.log("done");
      }, this);
    }
  }

  this.alarm = function () {

  }

  this.back = function () {
    window.history.back();
  }

  this.render = function () {
    this.$el.html(this.template(Boolean(items)));
    return this;
  };

  this.initialize();

}