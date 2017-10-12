var WriteView = function (item) {
  
  var items = {};
  var s_val, e_val, result;
  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });

  this.initialize = function () {
    this.$el = $('<div/>');
    this.$el.on('click', '.back', this.back);
    this.$el.on('submit', '#target', this.submit);
    this.$el.on('keyup keydown autoresize', '#s_page', this.s_page);
    this.$el.on('keyup keydown autoresize', '#e_page', this.e_page);
    items = item;

    this.render();
  };

  this.back = function() {
    items.isUpdate = false;
    window.history.back();
  }

  this.submit = function(event) {
    event.preventDefault();
    
    var query = $(this).serialize().split("&");
    var data = [
      items.isbn,//db에 저장된걸 가져오는 거라서 그냥 isbn임★★
      query[0].split("=")[1],
      query[1].split("=")[1],
      query[2].split("=")[1],
      decodeURIComponent(query[3].split("=")[1]),
      new Date()
      // new Date(2017, (query[0].split("=")[1])/12, query[1].split("=")[1])
    ];

    var executeQuery;
    if(items.isUpdate) {
      executeQuery = "UPDATE WriteTable SET s_page=?, e_page=?, page=?, contents=? WHERE rowid=?";
      data.shift();
      data.pop();
      data.push(items.data.rowid);
      items.isUpdate = false;
    } else {
      executeQuery = "INSERT INTO WriteTable VALUES (?,?,?,?,?,?)";
    }

    database.transaction(function (transaction) {
      transaction.executeSql(executeQuery, data
        , function (tx, result) {
          alert('Inserted');
          history.back();
        },
        function (error) {
          alert('Error occurred');
        });
    }, function (error) {
      navigator.notification.alert('CREATE error: ' + error.message);
    });
  };

  this.s_page = function() {
    s_val = Number($("#s_page").val());
    e_val = Number($("#e_page").val());
    if(s_val>0 && e_val>0 && s_val<=e_val) {
      result = e_val - s_val + 1;
      $("#page").val(result);
    } else {
      $("#page").val("");
    }
  }

  this.e_page = function() {
    s_val = Number($("#s_page").val());
    e_val = Number($("#e_page").val());
    if(s_val>0 && e_val>0 && s_val<=e_val) {
      result = e_val - s_val + 1;
      $("#page").val(result);
    } else {
      $("#page").val("");
    }
  }

  this.setWrite = function(item, hash) {
    items.data = item;
    items.isUpdate = true;
    if(hash) {
      window.location.hash = "1";
      this.render();
    } else {
      location.href="#write";
    }
  }

  this.render = function () {
    if(!items.isUpdate) {
      items.data = "";
    }
    this.$el.html(this.template(items));

    return this;
  };

  this.initialize();

}