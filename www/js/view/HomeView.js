var HomeView = function (page, isLoading) {
  var calendarView;
  var cal;
  var dbPage;
  var year;
  var month;
  var dbTodayPage;
  var characterView;
  var characterListView;
  var tdData;
  var character = [
    {
      "name": "cactus",
      "state" : false
    }, 
    {
      "name": "rabbit",
      "state" : false
    }, 
    {
      "name": "똘똘이",
      "state" : false
    }
  ];
  var myIndex;

  this.initialize = function () {
    calendarView = new CalendarView();
    characterView = new CharacterView();
    characterListView = new CharacterListView();
    cal = new calendar();
    year = cal.getYear();
    month = cal.getMonth();
    dbPage = new DBPage();
    dbTodayPage = new DBTodayPage();
    tdData = new TdData();
    items = {};

    this.$el = $('<div/>');

    this.$el.on('click', '.character-list', function() {
      event.preventDefault();
      $('#overlay').css("display", "block");
    });
    this.$el.on('click', '.close', function() {
      event.preventDefault();
      $('#overlay').css("display", "none");
      characterView.setCharacterData(character[myIndex].name);
    });
    this.$el.on('click', '.using', function() {
      event.preventDefault();
      var index = $(this).siblings('.index').text();
      localStorage.setItem("myCharacter", index);
      character[myIndex].state = false;
      character[index].state = true;
      myIndex = index;
      characterListView.setData(character);
    });
    
    this.$el.on('click', '.prev', function (event) {
      event.preventDefault();
      items = cal.getCal(year, --month);
      dbPage.getData(items).then(function (results) {
        items.c_page = results;
        calendarView.setCal(items);
        calendarView.render(true);
        
        if(year===tdData.getYear()&&month===tdData.getMonth()) {
          tdData.setTodayTd();
        }
      });
    });

    this.$el.on('click', '.next', function (event) {
      event.preventDefault();
      items = cal.getCal(year, ++month);
      dbPage.getData(items).then(function (results) {
        items.c_page = results;
        calendarView.setCal(items);
        calendarView.render(true);
        
        if(year===tdData.getYear()&&month===tdData.getMonth()) {
          tdData.setTodayTd();
        }
      });
    });


    myIndex = localStorage.getItem("myCharacter");
    if(!myIndex) {
      localStorage.setItem("myCharacter", 0);
      myIndex = 0;
    }
    character[myIndex].state=true;
    characterListView.setData(character);
    characterView.setCharacterData(character[myIndex].name);


    items = cal.getCal(year, month);
    dbPage.getData(items).then(function (results) {
      items.c_page = results;
      calendarView.setCal(items);
      calendarView.render(true);

      tdData.getTodayTd();
      tdData.setTodayTd();
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
    // items.c_page = [,,1,2,3,4,5,6];
    // calendarView.setCal(items);
    // calendarView.render(true);
    // var gData = tdData.getData();
    // characterView.setTdData(gData);

    this.render();
  };
  
  this.render = function () {
    this.$el.html(this.template());
    $('.calendar', this.$el).html(calendarView.$el);
    $('.character', this.$el).html(characterView.$el);
    $('.view-wrap', this.$el).html(characterListView.$el);
    return this;
  };

  this.initialize();
};
