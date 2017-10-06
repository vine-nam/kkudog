$(document).on('deviceready', function () {
  sqlite_db();
  navigator.splashscreen.hide();

  HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
  CalendarView.prototype.template = Handlebars.compile($("#calendar-tpl").html());
  CalendarAllHomeView.prototype.template = Handlebars.compile($("#calendar-all-home-tpl").html());
  CalendarAllView.prototype.template = Handlebars.compile($("#calendar-all-tpl").html());
  CalendarMonthHomeView.prototype.template = Handlebars.compile($("#calendar-month-home-tpl").html());
  MybookView.prototype.template = Handlebars.compile($("#mybook-tpl").html());
  MybookListView.prototype.template = Handlebars.compile($("#mybook-list-tpl").html());
  MybookInfoView.prototype.template = Handlebars.compile($("#mybook-info-tpl").html());
  MybookContentsView.prototype.template = Handlebars.compile($("#mybook-contents-tpl").html());
  MybookMonthContentsView.prototype.template = Handlebars.compile($("#mybook-month-contents-tpl").html());
  SearchView.prototype.template = Handlebars.compile($("#search-tpl").html());
  SearchListView.prototype.template = Handlebars.compile($("#search-list-tpl").html());
  SearchBookInfoView.prototype.template = Handlebars.compile($("#search-book-info-tpl").html());
  WriteView.prototype.template = Handlebars.compile($("#write-tpl").html());
  FooterBarView.prototype.template = Handlebars.compile($("#footer-bar-tpl").html());

  // sqlite_db();

  var apiService = new api();
  var mybookView;
  var items = [];//search-page-item
  var items_mb = [];//mybook-page-item
  var index;
  var page = 1;
  var isLoading = false;
  var year, month;

  router.addRoute('', function () {
    items = [];
    page = 1;
    $('body').html(new HomeView(page, isLoading).render().$el);
    $('footer').html(new FooterBarView("home").render().$el);
    $(".button-collapse").sideNav();
  });

  router.addRoute('calendar', function () {
    $('body').html(new CalendarAllHomeView().render().$el);
    $('footer').html(new FooterBarView("calendar").render().$el);
  });

  router.addRoute('calendar/:index', function (i) {
    var temp = $('.year').html();
    temp===''||temp===undefined ? year : year = $('.year').html();
    month = parseInt(i);
    $('body').html(new CalendarMonthHomeView(year, ++month).render().$el);
  });

  //api옮기기...
  router.addRoute('search', function () {
    // alert(location.href);
    $('body').html(new SearchView().render().$el);
    if(items!==null){
      $('.content').html(new SearchListView(items).render().$el);
    }
    $("#target").submit(function (event) {
      event.preventDefault();
      var query = decodeURI($(this).serialize().split('=')[1]);
      // 띄어 쓰기 된 검색어 처리
      // api SearchListView에 넣은거
      // $('.content').html(new SearchListView(query).render().$el);

      // api 폴더 분리 한거
      // alert( "Handler for .submit() called." + query);
      // items = $.Deferred();

      items = apiService.requestBook(query);
      $('.content').html(new SearchListView(items).render().$el);
   
      $('.collapsible').collapsible();
    });
    $('footer').html(new FooterBarView("search").render().$el);
  });

  router.addRoute('search/:index', function (index) {
    index = parseInt(index);
    $('body').html(new SearchBookInfoView(items[index]).render().$el);
  });
  
  router.addRoute('mybook', function () {
    mybookView = new MybookView();
    $('body').html(mybookView.render().$el);
    $('footer').html(new FooterBarView("mybook").render().$el);
  });

  router.addRoute('mybook/:index', function (i) {
    index = parseInt(i);
    items_mb = mybookView.getItems();
    
    // test serve
    // items_mb = [{
    //   title: "aa",
    //   image: "../../img/image-not-found.png",
    //   publisher: "내가 지음",
    //   page: 200,
    //   isbn: "123"
    // },
    // {
    //   title: "aa",
    //   image: "../../img/book-img.png",
    //   publisher: "혜진 선생님(찡긋)",
    //   page: 300,
    //   isbn: "123"
    // }];
    $('body').html(new MybookInfoView(items_mb[index]).render().$el);
  });
  
  router.addRoute('write', function () {
    var data;
    if(items_mb[index]) {
      data = items_mb[index];
    }
    $('body').html(new WriteView(data).render().$el);
    //건들지 마세요....
    $(document).ready(function() {
      Materialize.updateTextFields();
      var hiddenDiv = $('.hiddendiv').first();
      if (!hiddenDiv.length) {
        hiddenDiv = $('<div class="hiddendiv common"></div>');
        $('body').append(hiddenDiv);
      }
      
      var text_area_selector = '.materialize-textarea';
  
      function textareaAutoResize($textarea) {
        // Set font properties of hiddenDiv
        var fontFamily = $textarea.css('font-family');
        var fontSize = $textarea.css('font-size');
        var lineHeight = $textarea.css('line-height');
        var padding = $textarea.css('padding');
  
        if (fontSize) {
          hiddenDiv.css('font-size', fontSize);
        }
        if (fontFamily) {
          hiddenDiv.css('font-family', fontFamily);
        }
        if (lineHeight) {
          hiddenDiv.css('line-height', lineHeight);
        }
        if (padding) {
          hiddenDiv.css('padding', padding);
        }
  
        // Set original-height, if none
        if (!$textarea.data('original-height')) {
          $textarea.data('original-height', $textarea.height());
        }
  
        if ($textarea.attr('wrap') === 'off') {
          hiddenDiv.css('overflow-wrap', 'normal').css('white-space', 'pre');
        }
  
        hiddenDiv.text($textarea.val() + '\n');
        var content = hiddenDiv.html().replace(/\n/g, '<br>');
        hiddenDiv.html(content);
  
        // When textarea is hidden, width goes crazy.
        // Approximate with half of window size
  
        if ($textarea.is(':visible')) {
          hiddenDiv.css('width', $textarea.width());
        } else {
          hiddenDiv.css('width', $(window).width() / 2);
        }
  
        /**
         * Resize if the new height is greater than the
         * original height of the textarea
         */
        if ($textarea.data('original-height') <= hiddenDiv.height()) {
          $textarea.css('height', hiddenDiv.height());
        } else if ($textarea.val().length < $textarea.data('previous-length')) {
          /**
           * In case the new height is less than original height, it
           * means the textarea has less text than before
           * So we set the height to the original one
           */
          $textarea.css('height', $textarea.data('original-height'));
        }
        $textarea.data('previous-length', $textarea.val().length);
      }
  
      $(text_area_selector).each(function () {
        var $textarea = $(this);
        /**
         * Instead of resizing textarea on document load,
         * store the original height and the original length
         */
        $textarea.data('original-height', $textarea.height());
        $textarea.data('previous-length', $textarea.val().length);
      });
  
      $('body').on('keyup keydown autoresize', text_area_selector, function () {
        textareaAutoResize($(this));
      });
    });
  });

  router.start();

// }());
});