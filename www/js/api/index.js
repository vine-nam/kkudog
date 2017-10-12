var API = function () {

    this.requestBook = function(query, start) {
        var items = null;
        var deferred = $.Deferred();
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
            success: function(data) {  
                items = data.items;
                deferred.resolve(items);
            }, 
            error: function(error, status, a) {
                alert("I'M ERROR" + error);
            }
        });
        return deferred.promise();
    }

};