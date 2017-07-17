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

                var Titles = data[1].map((elem) => elem);
                var Details = data[2].map((elem) => elem);
                var Links = data[3].map((elem) => elem);
                var Images = []

                //Fetch images of that wiki page - currently not working
                Titles.map(function(elem) {
                    $.ajax({
                        method: "GET",
                        url: "https://en.wikipedia.org/w/api.php?action=query&titles=" + elem + "&prop=pageimages&format=json&pithumbsize=100",
                        data: {
                            format: 'json'
                        },
                        dataType: 'jsonp'
                    }).done(function(img) {
                        //console.log(Object.values(img.query.pages)[0])
                        //$('.card-img-top').html(Object.values(img.query.pages)[0].thumbnail.source);
                        if (Object.values(img.query.pages)[0].hasOwnProperty('thumbnail')) {
                            Object.values(img.query.pages)[0].thumbnail.source !== "" ? Images.push(Object.values(img.query.pages)[0].thumbnail.source) : Images.push("");
                        } else {
                            Images.push("http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg");
                        }
                    }).fail(function() {
                        // handle request failures
                    });
                })

                //bad practice - need to find a better solution to display images
                //under slow networks it may fail
                setTimeout(function() {
                    for (var i = 0; i < data[1].length; i++) {
                        if (Images[i] !== undefined) {
                            $('#result-section').append('<div class="col-sm-4 card animate-flicker" style="display:inline-block">' +
                                '<img class="card-img-top" src="' + Images[i] + '" width="200" height="100"></img>' +
                                '<div class="card-block">' +
                                '<h4 class="card-title">' + Titles[i] + '</h4>' +
                                '<p class="card-text">' + Details[i] + '</p>' +
                                '<a href= ' + Links[i] + ' class="btn btn-primary link-btn text-center" target="_blank">Checkout the wikipedia page</a>' +
                                '</div>' +
                                '</div>');
                        }
                    }
                }, 1000);
                //console.log(data);
            },
            error: function() {
                alert("FAIL");
            }
        })

    })
})