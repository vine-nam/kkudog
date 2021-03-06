var API = function () {

    this.requestBook = function (query, start) {
        var items = null;
        var deferred = $.Deferred();
        $.ajax({
            type: "GET",
            url: "https://openapi.naver.com/v1/search/book.json",
            data: {
                query: query,
                start: start
            },
            headers: {
                'X-Naver-Client-Id': key.naver.id,
                'X-Naver-Client-Secret': key.naver.secret
            },
            success: function (data) {
                items = data.items;
            },
            error: function (jqXHR, textStatus) {
                items = textStatus;
            }
        }).done(function() {
            deferred.resolve(items);
        });
        return deferred.promise();
    }

};