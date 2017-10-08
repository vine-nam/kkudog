var API = function () {

    this.requestBook = function(query, page) {
        var items = null;
        var deferred = $.Deferred();
        $.ajax({
            type: "GET",
            url: "https://www.googleapis.com/books/v1/volumes",
            data: {
                q: query,
                startIndex : Number(page)
            },
            headers: {
                'key': key.google.key
            },
            // async: false, //ajax 비동기
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