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
                //      Titles.map(function(elem){
                //      	$.ajax({
                //     method: "GET",
                //     url: "https://en.wikipedia.org/w/api.php?action=query&titles="+ elem +"&prop=pageimages&format=json&pithumbsize=100",
                //     data: {
                //         format: 'json'
                //     },
                //     dataType: 'jsonp',
                //     success: function(img){
                //     	console.log(Object.values(img.query.pages)[0])
                //     	//$('.card-img-top').html(Object.values(img.query.pages)[0].thumbnail.source);
                //     	if(Object.values(img.query.pages)[0].hasOwnProperty('thumbnail')){
                //     		Object.values(img.query.pages)[0].thumbnail.source !== "" ? Images.push(Object.values(img.query.pages)[0].thumbnail.source) : Images.push("");
                //     	}else{
                //     		Images.push("");
                //     	}
                //     },
                //     error: function(){
                //     	console.log(error);
                //     }
                // })
                //      })

                for (var i = 0; i < data[1].length; i++) {
                    $('#result-section').append('<div class="col-sm-4 card animate-flicker" style="display:inline-block">' +
                        '<div class="card-img-top"></div>' +
                        '<div class="card-block">' +
                        '<h4 class="card-title">' + Titles[i] + '</h4>' +
                        '<p class="card-text">' + Details[i] + '</p>' +
                        '<a href= ' + Links[i] + ' class="btn btn-primary link-btn text-center" target="_blank">Checkout the wikipedia page</a>' +
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