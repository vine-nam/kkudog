var SearchView = function() {

    this.initialize = function() {
        this.$el = $('<div/>');
        // this.$el.on('submit', '#target', this.findbook);
        this.$el.on('click', '.close', this.clear);
        // this.$el.on('click', '.icon-left-nav', this.back);
        this.render();
    };

    this.render = function() {
        this.$el.html(this.template());
        return this;
    };

    this.clear = function() {
        $('#search').val('');
    }

    this.back = function() {
        window.history.back();
    }


    this.initialize();

}