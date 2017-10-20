var HomeView = function () {
  var items = {};
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
  var userData = {};
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
    dbUserData = new DBUserData()
    character = characterData.getCharacter();
    userindex = userData.character;

    this.$el = $('<div/>');

    this.$el.on('click', '.character-list', function() {
      event.preventDefault();
      $('#overlay').css("display", "block");
    });
    this.$el.on('click', '.close', function() {
      event.preventDefault();
      $('#overlay').css("display", "none");
      characterView.setCharacterData(character[userindex].name);
      dbUserData.updateData("character", userindex);
    });
    this.$el.on('click', '.using', function() {
      event.preventDefault();
      var index = $(this).siblings('.index').text();
      userData.character = index;
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
    //캐릭터
    $.when(dbUserData.getData(), characterData.getCharacter())
      .done(function( userResults, characterResults ) {
        userData = userResults;
        userindex = userData.character;
        character = characterResults;
 
        characterData.mission(userData.AllPage, userindex, 1);
        characterData.mission(userData.AllPage, userindex, 2);
        characterData.mission(userData.AllPage, userindex, 3);
        characterData.setUseCharacter(userindex);

        characterView.setUserData(userData, character[userindex].name);
        characterListView.setData(character);
      })
      .fail(function() {
        console.log('character rejected');
      });

    items = cal.getCal(year, month);
    dbPage.getData(items).then(function (results) {
      items.c_page = results;
      calendarView.setCal(items);
      calendarView.render(true);

      var gcount = characterView.startDayData();
      if(userData.dayCount !== gcount) {
        userData.dayCount = gcount;
        dbUserData.updateData("dayCount", gcount);
      }
      gcount = gcount>3 ? 3 : gcount-1;
      
      tdData.getTodayTd();
      tdData.setTodayTd();

      var gData = tdData.getData(gcount);
      characterView.setTdData(gData);
    });

    dbTodayPage.getData().then(function (results) {
      if(userData.todayPage !== results) {
        userData.todayPage = results;
        dbUserData.updateData("todayPage", results);
        characterView.setData(results);
      }
    });
    dbTodayPage.getAllData().then(function (results) {
      if(userData.AllPage !== results) {
        userData.AllPage = results;
        dbUserData.updateData("AllPage", results); 
        characterView.setAllData(results);

        var index;
        if(!character[1].mstate) {
          index = characterData.mission(userData.AllPage, userindex, 1);
        } else if(!character[2].mstate) {
          index = characterData.mission(userData.AllPage, userindex, 2);
        } else if(!character[3].mstate) {
          index = characterData.mission(userData.AllPage, userindex, 3);
        }
        if(userindex!==index) {
          userindex = index;
          dbUserData.updateData("character", userindex);
          characterView.setCharacterData(character[userindex].name);
        }

        characterListView.setData(character);
      }
    });

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
