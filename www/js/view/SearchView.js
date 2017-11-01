var SearchView = function (bdata, qdata, pdata) {

  var searchListView;
  var searchBookInfoView;
  var api;
  var items = [];
  var data = [];
  var query;
  var page;

  this.initialize = function () {
    searchListView = new SearchListView();
    searchBookInfoView = new SearchBookInfoView();
    api = new API();
    items = bdata;
    query = qdata;
    page = pdata;
    this.$el = $('<div/>');
    this.$el.on('submit', '#target', this.findbook);
    this.$el.on('click', '.close', this.clear);
    this.$el.on('click', '.barcode', this.barcode);
    this.$el.on('click', this.check);
    this.$el.on('click', '.search-book-list li', this.searchInfo);
    this.$el.on('click', '.overlayClose', searchBookInfoView.close);
    this.$el.on('click', '.add-book', searchBookInfoView.addBook);
    
    $('.errorM').css('display', 'none');
    $('.spinner-wrapper', this.$el).css('display', 'none');

    var w = $(window, this.$el);
    var d = $(document, this.$el);

    w.scroll(function () {
      if (w.scrollTop() === d.height() - w.height()) {
        $('.spinner-wrapper').css('display', 'block');

        setTimeout(function () {
          page += 10;
          api.requestBook(query, page).then(function (results) {

            for (var i in results) {
              items[page + i] = results[i];
            }

            searchListView.setData(items);
            searchListView.render();

            $('.spinner-wrapper').css('display', 'none');
          })
        }, 1200);
      }
    });

    this.render();
  };

  this.searchInfo = function (event) {
    event.preventDefault();
    $('#overlay').css("display", "block");
    index = $(this).children(".index").text();
    data = items[index];
    searchBookInfoView.setData(data);
    searchBookInfoView.render();
  }

  this.check = function (event) {
    if ($('label.label-icon').hasClass('active')) {
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
        $('.errorM').css('display', 'none');
        $('.spinner-wrapper').css('display', 'block');
        api.requestBook(result.text).then(function (results) {
          if(typeof results === "object") {
            items = results;
            searchListView.setData(items);
            searchListView.render();
          } else {
            $('.errorM').css('display', 'block');
          }
          $('.spinner-wrapper').css('display', 'none');
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

  this.findbook = function (event) {
    event.preventDefault();

    items = [];
    page = 1;
    query = decodeURIComponent($(this).serialize().split('=')[1]);
    searchListView.setData(items);
    searchListView.render();
    $('.errorM').css('display', 'none');
    $('.spinner-wrapper').css('display', 'block');

    setTimeout(function () {
      api.requestBook(query, page).then(function (results) {
        if(typeof results === "object") {
          items = results;
          searchListView.setData(items);
          searchListView.render();
        } else {
          $('.errorM').css('display', 'block');
        }

        $('.spinner-wrapper').css('display', 'none');
      });
    }, 1200);
  }

  this.getItems = function () {
    return items;
  }

  this.getQuery = function () {
    return query;
  }
  this.getPage = function () {
    return page;
  }

  this.render = function () {
    this.$el.html(this.template());
    searchListView.setData(items);
    $('ul.search-book-list', this.$el).html(searchListView.render().$el);
    $('.view-wrap', this.$el).html(searchBookInfoView.$el);
    return this;
  };

  this.initialize();

}