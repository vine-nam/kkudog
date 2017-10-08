var HomeView = function (page, isLoading) {
  var calendarView;
  var cal;
  var dbPage;
  var year;
  var month;
  var dbTodayPage;
  var characterView;
  var tdData;

  this.initialize = function () {
    calendarView = new CalendarView();
    characterView = new CharacterView();
    cal = new calendar();
    year = cal.getYear();
    month = cal.getMonth();
    dbPage = new DBPage();
    dbTodayPage = new DBTodayPage();
    tdData = new TdData();
    items = {};

    this.$el = $('<div/>');

    this.$el.on('click', '.prev', function (event) {
      event.preventDefault();
      items = cal.getCal(year, --month);
      dbPage.getData(items).then(function (results) {
        items.c_page = results;
        calendarView.setCal(items);
        calendarView.render(true);
      });
    });

    this.$el.on('click', '.next', function (event) {
      event.preventDefault();
      items = cal.getCal(year, ++month);
      dbPage.getData(items).then(function (results) {
        items.c_page = results;
        calendarView.setCal(items);
        calendarView.render(true);
      });
    });

    this.$el.on('load', function() {
      console.log("난 아직 여기 있는 걸...");
    })

    items = cal.getCal(year, month);
    dbPage.getData(items).then(function (results) {
      items.c_page = results;
      calendarView.setCal(items);
      calendarView.render(true);

      var gData = tdData.getData();
      characterView.setTdData(gData);
    });

    dbTodayPage.getData().then(function (results) {
      characterView.setData(results);
      characterView.render();
    });
    dbTodayPage.getAllData().then(function (results) {
      characterView.setAllData(results);
      characterView.render();
    });

    // 테스트 코드
    // items.c_page = [,,1,2,3,4];
    // calendarView.setCal(items);
    // calendarView.render(true);

    this.render();
  };
  
  this.render = function () {
    this.$el.html(this.template());
    $('.calendar', this.$el).html(calendarView.$el);
    $('.character', this.$el).html(characterView.$el);
    return this;
  };

  this.initialize();
};
