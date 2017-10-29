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
  var gcount;

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

    this.$el = $('<div/>');

    this.$el.on('click', '.character-list', function () {
      event.preventDefault();
      $('#overlay').css("display", "block");
      characterListUpdate();
    });
    this.$el.on('click', '.close', function () {
      event.preventDefault();
      $('#overlay').css("display", "none");
      characterView.setCharacterData(character[userindex].name);
      characterView.render();
      dbUserData.updateData("character", userindex);
    });
    this.$el.on('click', '.using', function () {
      event.preventDefault();
      var index = $(this).siblings('.index').text();
      characterState(index);
    });

    this.$el.on('click', '.prev', function (event) {
      event.preventDefault();
      calMonth(year, --month);
    });
    this.$el.on('click', '.next', function (event) {
      event.preventDefault();
      calMonth(year, ++month);
    });

    function calMonth(year, month) {
      items = cal.getCal(year, month);
      dbPage.getData(items).then(function (results) {
        items.c_page = results;
        calendarView.setCal(items);
        calendarView.render(true);

        if (year === tdData.getYear() && month === tdData.getMonth()) {
          tdData.setTodayTd();
        }
      });
    }

    function alarmSet(dcount) {
      //오늘 읽은 책이 없다면 3일 뒤에 알람을 설정해 놓기
      if (Number(localStorage.getItem('alarm')) === 1) {
        var now = new Date().getTime(),
          _3_day_from_now = new Date(now + 60*60*24*dcount*1000);

        cordova.plugins.notification.local.schedule({
          text: "3일 동안의 기록이 없습니다.",
          at: _3_day_from_now,
          led: "00FF00",
          sound: null,
          icon: "file://www/img/icon/andoird/32x32.png",
          smallIcon: "file://www/img/icon/andoird/128x128.png"
          //icon 어떻게 하는거야??????
        });
      }
    }

    function characterState(index) {
      userData.character = index;
      character[userindex].state = false;
      character[index].state = true;
      userindex = index;
      characterListView.setData(character);
    }

    function characterListUpdate() {
      var index;

      character[userindex].state = true;

      for(var i=3; i>0; i--) {
        index = characterData.mission(userData.AllPage, userindex, i);
        if (userindex !== index) {
          characterState(index);
          dbUserData.updateData("character", userindex);
          characterView.setCharacterData(character[userindex].name);
          characterView.render();
        }
      }

      characterListView.setData(character);
    }

    //달력
    items = cal.getCal(year, month);
    dbPage.getData(items).then(function (results) {
      items.c_page = results;
      calendarView.setCal(items);
      calendarView.render(true);

      tdData.getTodayTd();
      tdData.setTodayTd();
    });

    //캐릭터
    $.when(dbUserData.getData(), characterData.getCharacter(), dbTodayPage.getData(), dbTodayPage.getAllData())
      .done(function (userResults, characterResults, TResult, AResult) {
        userData = userResults;
        userindex = userData.character;
        character = characterResults;

        if (userData.todayPage !== TResult || userData.AllPage !== AResult) {
          userData.todayPage = TResult;
          userData.AllPage = AResult;
          dbUserData.updateData("todayPage", TResult);
          dbUserData.updateData("AllPage", AResult);
          characterView.setData(TResult);
          characterView.setAllData(AResult);
        }

        characterView.setUserData(userData, character[userindex].name);
        gcount = characterView.startDayData();
        if (userData.dayCount !== gcount) {
          userData.dayCount = gcount;
          characterView.setDayCount(gcount);
          dbUserData.updateData("dayCount", gcount);
        }
        gcount = gcount >= 3 ? 3 : gcount - 1;
        var gData = tdData.getData(gcount);

        var dcount=3;
        for (var i in gData) {
          if(gData[i] === 1) {
            dcount--;
          } else {
            alarmSet(dcount);
            break;
          }
        }

//???왜 characterView에서 sort한 gData가 이곳 gData에도 sort를 하는 거지???
        characterView.setTdData(gData);
        characterView.render();
        characterListUpdate();
        navigator.splashscreen.hide();
      })
      .fail(function () {
        console.log('character rejected');
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
