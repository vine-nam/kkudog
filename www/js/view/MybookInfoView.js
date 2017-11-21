var MybookInfoView = function (items) {

  var data;
  var items = items;
  var mybookHeaderView;
  var mybookcontentsView;
  var searchBookInfoView;
  var writeTable;
  var writeView;
  var rowid;
  var index;

  this.initialize = function () {
    writeView = new WriteView(items);
    mybookcontentsView = new MybookContentsView();
    mybookHeaderView = new MybookHeaderView(items);
    searchBookInfoView = new SearchBookInfoView();
    writeTable = new WriteTable();

    this.$el = $('<div/>');
    this.$el.on('click', '.back', this.back);
    this.$el.on('click', this.classShow);
    this.$el.on('click', '.more', this.more);
    this.$el.on('click', '.complete', this.complete);
    this.$el.on('click', '.updateBook', this.updateBook);
    this.$el.on('click', '.update', this.update);
    this.$el.on('click', '.delete', this.delete);
    this.$el.on('click', '.overlayClose', this.headerRender);
    this.$el.on('click', '.add-book', searchBookInfoView.addBook);

    $.when(writeTable.select(items.isbn)).done(function(results) {
      data = results;
      mybookcontentsView.setMybook(data);
      items.percent = writeView.getPercent(); 
      mybookHeaderView.setPercent(items.totalPages, JSON.stringify(items.percent));
    });

    this.render();
  };

  this.back = function (event) {
    event.preventDefault();
    window.history.back();
  }
  
  this.classShow = function (event) {
    if (!$(event.target).hasClass("more")) {
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

  this.complete = function () {
    if(items.complete) {//취소하기
      completeUpdate(0);
      window.plugins.toast.showShortCenter("취소 되었습니다.");
    } else {//완독
      if(items.SumPercent < 90) {
        window.plugins.toast.showShortCenter("90%이상 읽어주세요.");
      } else {
        completeUpdate(1);
        window.plugins.toast.showShortCenter("완료 되었습니다.");
      }
    }
  }

  function completeUpdate(isComplete) {
    var query = [
      isComplete,
      items.isbn
    ];
    $.when(new MybookTable().updateComplete(query)).done(function() {
      mybookHeaderView.setComplete(isComplete);
    });
  }

  this.updateBook = function (event) {
    event.preventDefault();
    $('#overlay', this.$el).css("display", "block");
    searchBookInfoView.setData(items, 1);//1 = update
    searchBookInfoView.render();
  }

  this.headerRender = function (event) {
    event.preventDefault();
    items.SumPercent = searchBookInfoView.getSumPercent();
    mybookHeaderView.setSumPercent(items.SumPercent);
    $('#overlay').css("display", "none");
  }

  this.update = function () {
    $.when(writeTable.selectOne(rowid)).done(function(results) {
      writeView.setWrite(results);
    });
  }

  this.delete = function () {
    navigator.notification.confirm(
      '삭제하기',
      deleteItem,
      '정말로 삭제하시겠습니까',
      ['확인', '취소']
    );

    function deleteItem(result) {
      if (result === 1) {
        if (rowid === "") {//책 삭제
          $.when(writeTable.delete(items.isbn)).done(function() {
            $.when(new MybookTable().delete(items.isbn)).done(function() {
              window.plugins.toast.showShortBottom("삭제되었습니다.");
              history.back();
            });
          });
        } else {//기록 삭제
          $.when(writeTable.deleteOne(rowid)).done(function() {
            percentSql(data[index].s_page, data[index].e_page, 0);
            data.splice(index, 1);
            mybookcontentsView.setMybook(data);
            window.plugins.toast.showShortBottom("삭제되었습니다.");
          });
        }
      }
    }
    
    function percentSql(first, last, j) {
      for (var i = first - 1; i < last; i++) {
        items.percent[i] -= 1;
      }
      var query = [
        JSON.stringify(items.percent),
        items.isbn
      ];
      $.when(new MybookTable().updatePercent(query)).done(function() {
        mybookHeaderView.setPercent(items.totalPages, JSON.stringify(items.percent));
      });
    }
  }

  this.render = function () {
    this.$el.html(this.template(items.title));
    $('.mybook-header', this.$el).html(mybookHeaderView.$el);
    $('.contents', this.$el).html(mybookcontentsView.$el);
    $('.view-wrap', this.$el).html(searchBookInfoView.$el);    
    return this;
  };


  this.initialize();

}