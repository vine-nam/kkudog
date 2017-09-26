var api = function () {

    this.requestBook = function(query, start) {
        var items = null;
        // alert("ajax come here");
        $.ajax({
            type: "GET",
            url: "https://openapi.naver.com/v1/search/book",
            data: {
                query: query
            },
            headers: {
                'X-Naver-Client-Id': key.naver.id,
                'X-Naver-Client-Secret': key.naver.secret
            },
            async: false, //ajax 비동기
            success: function(data) {  
                // alert('Success!' + data.items[0].title); 
                // $('.content').html(new SearchListView(data.items).render().$el);
                items = data.items;
                return items; 
            }, 
            error: function(error, status, a) {
                alert("I'M ERROR" + error);
            }
        });
        return items; //값 반환은 밖에서
    }

};