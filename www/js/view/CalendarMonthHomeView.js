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
  
  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });

  var calendarView;
  var mybookcontentsView;
  var cal;
  var date = {};
  var year;
  var month;
  var dbPage;
  var items = {};
  var bookitems = {};
  var date;
  // var tditems = {};
  var md = true;//true: 월, false: 일
  //C/:index 테스트 코드
  /*
  data = [
    {
      rowid: 1,
      s_page: 1,
      e_page: 3,
      title: "aaa",
      contents: "블라브라라ㅏㅏㄴㅇㅁ",
      date: "9월1일"
    },
    {
      rowid: 2,
      s_page: 4,
      e_page: 13,
      title: "aaa",
      contents: "이제 나도 그 별에서 함께 살게 되겠지.",
      date: "7월 29일"
    },
    {
      rowid: 2,
      s_page: 4,
      e_page: 13,
      title: "aaa",
      contents: "모든건 신의 뜻대로, \n흘러가는 그대로 \n라라라랄라라ㅏ라라랄라",
      date: "5월 14일"
    }
  ];
// */
  this.initialize = function () {
    calendarView = new CalendarView();
    mybookMonthContentsView = new MybookMonthContentsView();
    changeTdItems = new ChangeTdItems();
    date = date;
    cal = new calendar();
    year = year;
    month = month;
    dbPage = new DBPage();

    //C/:index 테스트 코드
    // mybookMonthContentsView.setMybook(data);

    this.$el = $('<div/>');

    this.$el.on('click', 'td', function(event) {
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
    });
    
    this.$el.on('click', '.change-md', function() {
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
    });

    this.$el.on('click', '.prev', function (event) {
      event.preventDefault();
      if(md) {//월
        items = cal.getCal(year, --month);
        dbPage.getData(items).then(function (results) {
          items.c_page = results;
          calendarView.setCal(items);
          calendarView.render(false);
        });
        $(".year").text(items.year);
        $(".month").text(items.month);
        $(".date").text("");
        dbPage.getItems(items).then(function (results) {
          bookitems = results;
          mybookMonthContentsView.setMybook(bookitems);
        });
      } else {
        date--;
        if(date<=0){
          items = cal.getCal(year, --month);
          dbPage.getData(items).then(function (results) {
            items.c_page = results;
            calendarView.setCal(items);
            calendarView.render(false);
          });
          $(".year").text(items.year);
          $(".month").text(items.month);
          $(".date").text(" / "+items.date);
          dbPage.getItems(items).then(function (results) {
            bookitems = results;
            mybookMonthContentsView.setMybook(bookitems);
            date = items.date;
            changeTdItems.getItems(date, bookitems);
          });
        } else {
          changeTdItems.getItems(date, bookitems);
        }
      }
    });
    this.$el.on('click', '.next', function (event) {
      if(md) {
        event.preventDefault();
        items = cal.getCal(year, ++month);
        dbPage.getData(items).then(function (results) {
          items.c_page = results;
          calendarView.setCal(items);
          calendarView.render(false);
        });
        $(".year").text(items.year);
        $(".month").text(items.month);
        $(".date").text("");
        dbPage.getItems(items).then(function (results) {
          bookitems = results;
          mybookMonthContentsView.setMybook(bookitems);
        });
      } else {
        date++;
        if(date>items.date){
          items = cal.getCal(year, ++month);
          dbPage.getData(items).then(function (results) {
            items.c_page = results;
            calendarView.setCal(items);
            calendarView.render(false);
          });
          $(".year").text(items.year);
          $(".month").text(items.month);
          $(".date").text(" / 1");
          dbPage.getItems(items).then(function (results) {
            bookitems = results;
            mybookMonthContentsView.setMybook(bookitems);
            date = 1;
            changeTdItems.getItems(date, bookitems);
          });
        } else {
          changeTdItems.getItems(date, bookitems);
        }
      }
    });
    this.$el.on('click', function(event) {
      if(!$(event.target).hasClass("more")) {
        if ($("ul").hasClass("show")) {
          $("ul").removeClass("show");
        }
      }
    });
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

  this.delete = function () {
    var executeQuery = "DELETE FROM WriteTable WHERE rowid=?";
    query = [rowid];

    database.transaction(function (transaction) {
      transaction.executeSql(executeQuery, query,
        function (tx, result) { 
          alert('Delete successfully'); 

          bookitems.splice(index, 1); 
          mybookMonthContentsView.setMybook(bookitems);
        },
        function (error) { 
          alert('Something went Wrong'); 
        });
    });
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
