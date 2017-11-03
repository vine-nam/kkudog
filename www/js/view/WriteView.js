var WriteView = function (item) {

  var items = {};
  var s_val, e_val, result;
  var database = window.sqlitePlugin.openDatabase({ name: 'book.db', location: 'default' });
  var percent, totalPages;

  this.initialize = function () {
    this.$el = $('<div/>');
    this.$el.on('click', '.back', this.back);
    this.$el.on('submit', '#target', this.submit);
    this.$el.on('keyup keydown autoresize', '#s_page', this.s_page);
    this.$el.on('keyup keydown autoresize', '#e_page', this.e_page);
    this.$el.on('click', '.photo_camera', [1] , this.photo_camera);
    this.$el.on('click', '.photo', [2] , this.photo_camera);
    this.$el.on('click', '.delete', this.delete);
    items = item;

    executeQuery = "SELECT percent, totalPages FROM MybookTable WHERE isbn=?";
    database.transaction(function (transaction) {
      transaction.executeSql(executeQuery, [items.isbn]
        , function (tx, result) {
          totalPages = result.rows.item(0).totalPages;
          percent = JSON.parse(result.rows.item(0).percent);
        },
        function (error) {
          alert('Error occurred');
        });
      }, function (error) {
        navigator.notification.alert('CREATE error: ' + error.message);
    });

    this.render();
  };

  this.delete = function(event) {
    event.preventDefault();

    var target = $( event.target );
    if(target.is('i')) {
      target.parent().remove();
    }
  }

  this.photo_camera = function (event) {
    event.preventDefault();

    var type = Number(event.data);

    if (!navigator.camera) {
      alert("Camera API not supported", "Error");
      return;
    }

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: type,// 0:Photo Library, 1=Camera, 2=Saved Album
      encodingType: 0,// 0=JPG 1=PNG
      // saveToPhotoAlbum: true,
      allowEdit: true
    };

    navigator.camera.getPicture(
      function (imgData) {
        var mediaObject = '<div class="photos">'
          + '<i class="material-icons delete">close</i>'
          + '<img class="imagefile" type="image" src="data:image/jpeg;base64,'
          + imgData
          + '"/>'
          + '</div>';
        $('.media-object', this.$el).append(mediaObject);
      },
      function () {
        // alert('Error taking picture', 'Error');
      },
      options);

    return false;
  };

  this.back = function () {
    items.isUpdate = false;
    window.history.back();
  }

  this.submit = function (event) {
    event.preventDefault();

    s_val = Number($("#s_page").val());
    e_val = Number($("#e_page").val());
    var contents =$("#textarea").val();
    if(s_val<=0 || e_val<=0 || contents==='' || page==='') {
      window.plugins.toast.showShortBottom("모두 입력해 주세요.");
      return;
    }
    if(s_val>totalPages || e_val>totalPages) {
      window.plugins.toast.showShortBottom("총 페이지는 "+totalPages+"쪽 입니다.");
      return;
    }

    var query = $(this).serialize().split("&");
    var file = [];
    var imagefile = $('.imagefile');
    for(var i=0; i<imagefile.length; i++) {
      file += "//imagefile//";
      file += imagefile[i].src;
    }
    var data = [
      items.isbn,//db에 저장된걸 가져오는 거라서 그냥 isbn임★★
      query[0].split("=")[1],
      query[1].split("=")[1],
      query[2].split("=")[1],
      decodeURIComponent(query[3].split("=")[1]),
      file,
      new Date()
      // new Date(2017, (query[0].split("=")[1])/12, query[1].split("=")[1])
    ];

    var executeQuery;
    if (items.isUpdate) {
      executeQuery = "UPDATE WriteTable SET s_page=?, e_page=?, page=?, contents=?, photos=? WHERE rowid=?";
      data.shift();
      data.pop();
      data.push(items.data.rowid);
      items.isUpdate = false;
      sql(executeQuery, data, 0);
      percentSql(items.data.s_page, items.data.e_page, 0);
      percentSql(data[0], data[1], 1);
    } else {
      executeQuery = "INSERT INTO WriteTable VALUES (?,?,?,?,?,?,?)";
      sql(executeQuery, data, 0);
      percentSql(data[1], data[2], 1);
    }

    function percentSql(first, last, j) {
      for(var i=first-1; i<last; i++) {
        percent[i] = j;
      }
      if(j===1) {
        query = [
          JSON.stringify(percent),
          items.isbn
        ];
        executeQuery = "UPDATE MybookTable SET percent=? WHERE isbn=?";
        sql(executeQuery, query, 1);
      }
    }

    function sql(executeQuery, data, j) {
      database.transaction(function (transaction) {
        transaction.executeSql(executeQuery, data
          , function (tx, result) {
            // alert('Inserted');
            if(j!==1) {
              window.plugins.toast.showShortBottom("저장되었습니다.");
              history.back();
            }
          },
          function (error) {
            alert('Error occurred');
          });
      }, function (error) {
        navigator.notification.alert('CREATE error: ' + error.message);
      });
    }
    
  };

  this.getPercent = function () {
    return percent;
  }

  this.s_page = function () {
    s_val = Number($("#s_page").val());
    e_val = Number($("#e_page").val());
    if (s_val > 0 && e_val > 0 && s_val <= e_val) {
      result = e_val - s_val + 1;
      $("#page").val(result);
    } else {
      $("#page").val("");
    }
  }

  this.e_page = function () {
    s_val = Number($("#s_page").val());
    e_val = Number($("#e_page").val());
    if (s_val > 0 && e_val > 0 && s_val <= e_val) {
      result = e_val - s_val + 1;
      $("#page").val(result);
    } else {
      $("#page").val("");
    }
  }

  this.setWrite = function (item, hash) {
    items.data = item;
    items.isUpdate = true;
    if (hash) {
      window.location.hash = "1";
      this.render();
    } else {
      location.href = "#write";
    }
  }

  this.render = function () {
    if (!items.isUpdate) {
      items.data = "";
    }
    this.$el.html(this.template(items));

    return this;
  };

  this.initialize();

}