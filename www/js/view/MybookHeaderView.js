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

  this.setPercent = function (tdata, pdata) {
    var SumPercent = 0;
    var totalPages = tdata;
    var percent = JSON.parse(pdata);
    for (var j=0; j<totalPages; j++) {
      if (percent[j]!==0) {
        SumPercent += 1;
      }
    }
    SumPercent = Math.ceil(SumPercent/totalPages*100);
    items.SumPercent = SumPercent;
    this.render();
  }

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };


  this.initialize();

}