var ChangeTdItems = function() {
  var date;
  var md;
  var tditems = {};
  var bookitems = {};
  this.getItems = function(date, bookitems) {
    date = date;
    tditems = {};
    bookitems = bookitems;
    var j=0;
    for (var i=0; i<Object.keys(bookitems).length; i++) {
      if(date == bookitems[i].date.split("일")[0].split(" ")[1]) {
        tditems[j++] = bookitems[i];
      }
    }
    md = false;
    $(".change-md").text("월");
    $(".date").text(" / "+date);
    mybookMonthContentsView.setMybook(tditems);
    return md;
  }
  this.getTdItems = function() {
    return tditems;
  }
}


var CalendarMonthHomeView = function (year, month) {

  var calendarView;
  var mybookcontentsView;
  var cal;
  var date = {};
  var year;
  var month;
  var dbPage;
  var items = {};
  var bookitems = {};
  // var tditems = {};
  var md = true;//true: 월, false: 일
  
  this.initialize = function () {
    calendarView = new CalendarView();
    mybookMonthContentsView = new MybookMonthContentsView();
    changeTdItems = new ChangeTdItems();
    date = date;
    cal = new calendar();
    year = year;
    month = month;
    dbPage = new DBPage();

    this.$el = $('<div/>');
    this.$el.on('click', 'td', this.tdClick);
    this.$el.on('click', '.change-md', this.changeMD);
    this.$el.on('click', '.prev', this.prev);
    this.$el.on('click', '.next', this.next);
    this.$el.on('click', this.classShow);
    this.$el.on('click', '.more', this.more);
    this.$el.on('click', '.update', this.update);
    this.$el.on('click', '.delete', this.delete);
    
    items = cal.getCal(year, month);
    dbPage.getItems(items).then(function (results) {
      bookitems = results;
      mybookMonthContentsView.setMybook(bookitems);
    });

    dbPage.getData(items).then(function (results) {
      items.c_page = results;
      calendarView.setCal(items);
      calendarView.render(false);
    });

    this.render();
  };
  
  this.tdClick = function(event) {
    event.preventDefault();
    var target = $( event.target );
    var tmp = date;
    if (!target.is("div")) {
      if(target.is("td")) {
        date = target.children("div").text();
      } else {
        date = target.parent().children("div").text();
      } 
    } else {
      date = target.text();
    }
    if(date>0&&date<=items.date) {
      md = changeTdItems.getItems(date, bookitems);
    } else {
      date = tmp;
    }
  }

  this.changeMD =  function(event) {
    event.preventDefault();
    if($(".change-md").text() === "일") {
      date = 1;
      md = changeTdItems.getItems(date, bookitems);
    } else {
      md = true;
      $(".date").text("");
      $(".change-md").text("일");
      mybookMonthContentsView.setMybook(bookitems);
    }
  }

  this.prev = function (event) {
    event.preventDefault();
    if(md) {//월
      calMonth(year, --month);
    } else {
      date--;
      if(date<=0){
        calMonth(year, --month, items.date);
      } else {
        changeTdItems.getItems(date, bookitems);
      }
    }
  }

  this.next = function (event) {
    event.preventDefault();
    if(md) {
      calMonth(year, ++month);
    } else {
      date++;
      if(date>items.date){
        calMonth(year, ++month, 1);
      } else {
        changeTdItems.getItems(date, bookitems);
      }
    }
  }
  
  function calMonth(year, month, date1) {
    items = cal.getCal(year, month);
    dbPage.getData(items).then(function (results) {
      items.c_page = results;
      calendarView.setCal(items);
      calendarView.render(false);
    });
    $(".year").text(items.year);
    $(".month").text(items.month);
    if(md) {
      $(".date").text("");
    } else {
      date = date1;
      $(".date").text("/" + date);
    }
    dbPage.getItems(items).then(function (results) {
      bookitems = results;
      mybookMonthContentsView.setMybook(bookitems);
      if(!md) {
        changeTdItems.getItems(date, bookitems);
      }
    });
  }

  this.classShow = function (e) {
    if (!$(e.target).hasClass("more")) {
      if ($("ul").hasClass("show")) {
        $("ul").removeClass("show");
      }
    }
  }

  this.more = function () {
    rowid = $(this).siblings(".rowid").text();
    index = $(this).siblings(".index").text();
    if ($("ul").hasClass("show")) {
      $("ul").removeClass("show");
    } else {
      $(this).next().addClass("show");
    }
  }

  this.update = function () {
    var writeView;
    if(md) {
      writeView = new WriteView(bookitems[index]);
      writeView.setWrite(bookitems[index], true);
    } else {
      var tditems = {};
      tditems = changeTdItems.getTdItems();
      writeView = new WriteView(tditems[index]);
      writeView.setWrite(tditems[index], true);
    }
    $('body', this.$el).html(writeView.$el);
    $(document).ready(function() {
      Materialize.updateTextFields();
    });
  }
//뭐지?? 나 뭐한거지????
  this.delete = function () {
    navigator.notification.confirm(
      '삭제하기',
      deleteItem,
      '정말로 삭제하시겠습니까',
      ['확인', '취소']
    );
    function deleteItem(result) {
      if (result === 1) {
        $.when(new WriteTable().deleteOne(rowid)).done(function() {
          $.when(new MybookTable().selectPercent([bookitems[index].isbn])).done(function(results) {
            percent = results.percent;
            percentSql(bookitems[index].s_page, bookitems[index].e_page, 0, percent);
            window.plugins.toast.showShortBottom("삭제되었습니다.");
            
            dbPage.getData(items).then(function (results) {
              items.c_page = results;
              calendarView.setCal(items);
              calendarView.render(false);
            });
            bookitems.splice(index, 1); 
            mybookMonthContentsView.setMybook(bookitems);
          });
        });
      }
    }
    function percentSql(first, last, j, percent) {
      for (var i = first - 1; i < last; i++) {
        percent[i] = j;
      }
      var query = [
        JSON.stringify(percent),
        bookitems[index].isbn
      ];
      new MybookTable().updatePercent(query);
    }
  }

  this.render = function () {
    date = {
      year: year,
      month: month
    };
    this.$el.html(this.template(date));
    $('.calendar', this.$el).html(calendarView.$el);
    $('.contents', this.$el).html(mybookMonthContentsView.$el);
    return this;
  };

  this.initialize();
};
