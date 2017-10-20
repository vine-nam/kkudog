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
  var userindex2;

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

    this.$el = $('<div/>');

    this.$el.on('click', '.character-list', this.overlay);
    this.$el.on('click', '.close', this.overlayClose);
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

        characterView.setUserData(userData, character[userindex].name);
        characterListView.setData(character);
      })
      .fail(function() {
        console.log('character rejected');
      });
    
    $.when(dbTodayPage.getData(), dbTodayPage.getAllData())
      .done(function(todayResults, AllResults) {
        var results, index;

        if(userData.todayPage !== todayResults) {
          results = todayResults;
          userData.todayPage = results;
          dbUserData.updateData("todayPage", results);
          characterView.setData(results);
        }
        if(userData.AllPage !== AllResults) {
          results = AllResults;
          userData.AllPage = results;
          dbUserData.updateData("AllPage", results); 
          characterView.setAllData(results); 
        }

        results = AllResults;
        for(var i=0; i<3; i++) {
          var mamount = character[i].mamount;
          var mstate = character[i].mstate;
          if(!mstate) {
            if (mamount >= results) {
              mstate = 1;
            } else {
              mstate = 0;
              if (userindex === i) {
                userindex = 0;
              }
            }
            characterData.updateData("mstate", mstate, character[i].name);
            characterData.updateData("mamount2", results, character[userindex].name);
          }
        }

        if(userindex!==index) {
          characterData.updateData("state", 0, character[userindex].name);//false
          characterData.updateData("state", 1, character[index].name);//true
          userindex = index;
        }

        characterListView.setData(character);
        characterView.render();
      })
      .fail(function() {
        console.log('page rejected');
      });

    //달력
    items = cal.getCal(year, month);
    dbPage.getData(items).then(function (results) {
      items.c_page = results;
      calendarView.setCal(items);
      calendarView.render(true);

      //달력에 오늘이라고 표시
      tdData.getTodayTd();
      tdData.setTodayTd();
      
      //캐릭터 gague
      var gcount = characterView.startDayData();
      if(userData.dayCount !== gcount) {
        userData.dayCount = gcount;
        dbUserData.updateData("dayCount", gcount);
      }
      gcount = gcount>3 ? 3 : gcount-1;
      var gData = tdData.getData(gcount);
      characterView.setTdData(gData);
      characterView.render();
    });

    this.render();
  };
  
  this.overlay = function () {
    event.preventDefault();
    $('#overlay').css("display", "block");
    userindex2 = userindex;
  };

  this.overlayClose = function () {
    event.preventDefault();
    $('#overlay').css("display", "none");
    characterData.updateData("state", 0, character[userindex2].name);//false
    characterData.updateData("state", 1, character[userindex].name);//true
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
