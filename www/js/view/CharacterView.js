var CharacterView = function () {
  var items = {};
  var gauge = ["favorite", "favorite_border"];
  var character = "default";
  var gData = [0,0,0];
  var c = 0;

  items.character = "";
  items.gauge = [];
  items.dayCount = 0;
  items.todayPage = 0;
  items.AllPage = 0;

  this.initialize = function () {
    this.$el = $('<div/>');
    this.characterData();
    this.gaugeData();
    this.render();
  };

  this.setUserData = function (data, c_data) {
    items.character = data.character;
    items.dayCount = data.dayCount;
    items.todayPage = data.todayPage;
    items.AllPage = data.AllPage;
    items.startDay = data.startDay;
    character = c_data;
    this.gaugeData();
    this.characterData();
  }

  this.gaugeData = function () {
    for (var i in gData) {
      items.gauge[i] = gauge[gData[i]];
    }
  }

  this.characterData = function () {
    if (character === "default") {
      items.character = character;
    } else {
      c = 0;
      for (var i in gData) {
        c = c + gData[i];
      }
      items.character = character + c;
    }
  }

  this.startDayData = function () {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(String(new Date()).substr(0, 15));
    var secondDate = new Date(items.startDay.substr(0, 15));
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    return diffDays+1;
  }

  this.setData = function (todayPage) {
    items.todayPage = todayPage;
  }
  
  this.setAllData = function (AllPage) {
    items.AllPage = AllPage;
  }

  this.setDayCount = function (dayCount) {
    items.dayCount = dayCount;
  }

  this.setTdData = function (data) {
    gData = data;
    gData.sort();
    this.gaugeData();
    this.characterData();
  }
  
  this.setCharacterData = function (c_data) {
    items.character = c_data + c;
  }

  this.render = function () {
    this.$el.html(this.template(items));
    return this;
  };

  this.initialize();
}

var TdData = function () {
  var td;
  var day;
  var date, today, year, month;

  this.getYear = function () {
    return year;
  }
  this.getMonth = function () {
    return month + 1;
  }
  this.getTodayTd = function () {
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth();
    today = date.getDate();
    var startDay = new Date(year, month, 0).getDay();
    if (startDay === 6) {
      startDay = -1;
    }
    day = today + startDay;
  }
  this.setTodayTd = function () {
    td = $('td');
    $(td[day]).addClass("today-td");
  }
  this.getData = function (len) {
    var gData = [0, 0, 0];
    for (var i = 0; i < len; i++) {
      if (!$(td[day - i]).children("p").text()) {
        gData[i] = 1;
      }
    }
    return gData;
  }
}