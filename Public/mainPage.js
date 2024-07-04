$("#searchBar").keyup(function() {
    if($("#searchBar").val() == "" || !$("#searchBar").is(":focus")){
        $('#results').hide();
        return;
    }

    $('#results').show();
    $.ajax({
        type: 'POST',
        url: '/search',
        data: {name: $("#searchBar").val()},
        success: function(products) {
            $('#results').html('');
            products.forEach(product => {
               $("#results").append(`<p>${product}</p>`);
            });
        }
    });
});