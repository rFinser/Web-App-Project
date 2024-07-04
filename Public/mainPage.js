$(document).ready(function(){
    $('#searchBar').keyup(function(){
        const inputTxt = $('#searchBar');
        console.log( $('#searchBar').is(":focus"))
        let results = $('#results');
        if(inputTxt.val() == "" || !inputTxt.is(":focus")){
            results.hide();
        }
        else{
            results.show();
        }
        $.ajax({
            type: 'POST',
            url: '/search',
            data: {name: inputTxt.val()},
            success: function(products){
                $('#results').empty();
                $(products).each(function(i, product){
                    results.append(`<p>${product}</p>`)
                });
            }
        });
    });
});