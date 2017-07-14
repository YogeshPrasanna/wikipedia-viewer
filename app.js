$(document).ready(function() {
    $('#search-submit').on('click', function() {
        var userSearchEntry = $('#search').val();

        //check if div has previously searched elements , then clear it
        if ($('#result-section').children().length > 1) {
            $('#result-section').html('');
        }

        $.ajax({
            method: "GET",
            url: "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + userSearchEntry + "",
            data: {
                format: 'json'
            },
            dataType: 'jsonp',
            success: function(data) {

                var Results = [];
                var Titles = data[1].map((elem) => elem);
                var Details = data[2].map((elem) => elem);
                var Links = data[3].map((elem) => elem);

                Titles.map(function(elem) {
                    return Results.push(elem)
                });

                for (var i = 0; i <= data[1].length; i++) {
                    $('#result-section').append('<div class="card" style="width: 50rem;display:inline-block">' +
                        '<div class="card-img-top"></div>' +
                        '<div class="card-block">' +
                        '<h4 class="card-title">' + Titles[i] + '</h4>' +
                        '<p class="card-text">' + Details[i] + '</p>' +
                        '<a href= ' + Links[i] + ' class="btn btn-primary">Go somewhere</a>' +
                        '</div>' +
                        '</div>');
                }

                console.log(data);
            },
            error: function() {
                alert("FAIL");
            }
        })

    })
})