var HomeView = function (page, isLoading) {
  var items;
  var calendarView;
  var cal;
  var year;
  var month;
  var dbPage;
  var dbTodayPage;
  var characterView;
  var characterListView;
  var tdData;
  var dbUserData;
  var userData;
  var characterData;
  var character;
  var userindex;

  this.initialize = function () {
    calendarView = new CalendarView();
    characterView = new CharacterView();
    characterListView = new CharacterListView();
    characterData = new CharacterData();
    cal = new calendar();
    year = cal.getYear();
    month = cal.getMonth();
    dbPage = new DBPage();
    dbTodayPage = new DBTodayPage();
    tdData = new TdData();
    dbUserData = new DBUserData();
    items = {};
    userData = {};
    character = characterData.getCharacter();

    this.$el = $('<div/>');

    this.$el.on('click', '.character-list', function() {
      event.preventDefault();
      $('#overlay').css("display", "block");
    });
    this.$el.on('click', '.close', function() {
      event.preventDefault();
      $('#overlay').css("display", "none");
      characterView.setCharacterData(character[userindex].name);
      dbUserData.updateData("userIndex", userindex);
    });
    this.$el.on('click', '.using', function() {
      event.preventDefault();
      var index = $(this).siblings('.index').text();
      userData.userIndex = index;
      character[userindex].state = false;
      character[index].state = true;
      userindex = index;
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

    dbUserData.getData().then(function (results) {
      userData = results;
      userindex = userData.userIndex;
      
      characterData.mission(userData.todayRead, userindex, 1);
      characterData.mission(userData.alldayRead, userindex, 2);
      characterData.mission(userData.alldayRead, userindex, 3);
      characterData.setUseCharacter(userindex);
      character = characterData.getCharacter();        
      characterView.setData(userData.todayRead);
      characterView.setAllData(userData.alldayRead);      
      characterView.setCharacterData(character[userindex].name);
      
      characterListView.setData(character);
    });

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
      if(userData.todayRead !== results) {
        userData.todayRead = results;
        dbUserData.updateData("todayRead", results);
        characterView.setData(results);

        var index1 = characterData.mission(userData.todayRead, userindex, 1);
        if( userindex !== index1 ) {
          userindex = index1;
          dbUserData.updateData("userIndex", userindex);
          characterView.setCharacterData(character[userindex].name);
        } else {
          characterView.render();
        }
                
        characterListView.setData(character);
      }
    });
    dbTodayPage.getAllData().then(function (results) {
      if(userData.alldayRead !== results) {
        userData.alldayRead = results;
        dbUserData.updateData("alldayRead", results); 
        characterView.setAllData(results);

        var index1 = characterData.mission(userData.alldayRead, userindex, 2);
        var index2 = characterData.mission(userData.alldayRead, userindex, 3);
        if( userindex !== index1 ) {
          userindex = index1;
          dbUserData.updateData("userIndex", userindex);
          characterView.setCharacterData(character[userindex].name);
        } else if( userindex !== index2 ) {
          userindex = index2;
          dbUserData.updateData("userIndex", userindex);
          characterView.setCharacterData(character[userindex].name);
        } else {
          characterView.render();
        }

        characterListView.setData(character);
      }
    });

    // 테스트 코드
    // items.c_page = [,,1,2,13,14,15,16];
    // calendarView.setCal(items);
    // calendarView.render(true);

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
