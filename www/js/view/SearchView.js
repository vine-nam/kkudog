var SearchView = function (data) {

  var searchListView;
  var api;
  var items = [];
  var query;
  var page;

  this.initialize = function () {
    searchListView = new SearchListView();
    api = new API();
    items = data;
    page = 1;
    this.$el = $('<div/>');
    this.$el.css("height", "100%");
    this.$el.on('submit', '#target', this.findbook);
    this.$el.on('click', '.close', this.clear);
    this.$el.on('click', '.barcode', this.barcode);
    this.$el.on('click', this.check);

    //스크롤 안 먹어.....
    this.$el.on('scroll', function () {
      alert("솜");
    });

    // $(window).scroll(function() {
    //   if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    //     console.log(page+=10);
    //     api.requestBook(query, page).then(function(results) {
    //       // for(var i=0; i<results.length; i++) {
    //       //   items.push(results[i]);
    //       // }
    // for (var i in results) {
    //   items[page+i] = results[i];
    // }
    //       console.log(results);
    //       searchListView.setData(items);
    //       // searchListView.render();
    //       $('.content', this.$el).append(searchListView.render().$el);
    //     });
    //     // $('.content', this.$el).html(searchListView.render().$el);
    //     // $('.content').append(searchListView.render());
    //     console.log(items);

    //   }
    // });

    this.render();
  };

  this.check = function () {
    if ($('label').hasClass('active')) {
      $('.barcode').css("display", "none");
      $('.close').css("display", "block");
    } else {
      $('.barcode').css("display", "block");
      $('.close').css("display", "none");
    }
  }

  this.barcode = function () {
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        api.requestBook(result.text).then(function (results) {
          items = results;
          searchListView.setData(items);
          searchListView.render();
        });
      },
      function (error) {
        alert("Scanning failed: " + error);
      },
      {
        preferFrontCamera: false, // iOS and Android
        showFlipCameraButton: true, // iOS and Android
        showTorchButton: true, // iOS and Android
        torchOn: true, // Android, launch with the torch switched on (if available)
        prompt: "Place a barcode inside the scan area", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
        orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations: true // iOS
      }
    );
  }

  this.clear = function () {
    $('#search').val('');
  }

  this.back = function () {
    window.history.back();
  }

  this.findbook = function (event) {
    event.preventDefault();
    page = 1;
    query = decodeURI($(this).serialize().split('=')[1]);
    api.requestBook(query, page).then(function (results) {
      items = results;
      searchListView.setData(items);
      searchListView.render();
    });
    $('.collapsible').collapsible();
  }

  this.getItems = function () {
    return items;
  }

  this.render = function () {
    this.$el.html(this.template());
    searchListView.setData(items);
    $('.content', this.$el).html(searchListView.render().$el);
    return this;
  };

  this.initialize();

}