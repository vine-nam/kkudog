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
  });

  router.start();

// }());
});