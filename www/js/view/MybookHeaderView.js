var MybookHeaderView = function (items) {
  
    var items = items;
  
    this.initialize = function () {
      this.$el = $('<div/>');
  
      this.render();
    };

    this.setPercent = function (data) {
      items.percent = data;
      items.SumPercent = 0;
      for (var j=0; j<items.totalPages; j++) {
        if (items.percent[j]===1) {
          items.SumPercent += items.percent[j];
        }
      }
      items.SumPercent = Math.ceil(items.SumPercent/items.totalPages*100);
      this.render();
    }

    this.render = function () {
      this.$el.html(this.template(items));
      return this;
    };
  
  
    this.initialize();
  
  }