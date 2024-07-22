$(async function(){
    //load navbar
    
    $.get('http://localhost/navbar.html', function(data){
        $("#navbarContainer").html(data);
        //! ADD NAVBAR FUNCTIONALLITY HERE

        //search bar
        searchBar();
        //filters
        filters();

        //login-signup buttons
        login();
    })
})

function searchBar(){
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
            success: function(restaurants) {
                $('#results').empty();
                if(restaurants.results.length == 0){
                    $('#results').append('<p>no results found</p>')
                }
                else{
                    restaurants.results.forEach(restaurant => {
                        $("#results").append(`<a href="/restaurants/${restaurant}" >${restaurant}</a></br>`);
                     });
                }
            }
        });
    });
}
function filters(){

    $('#filters').hide();
    $('#tags').append(SchemeTags());

    $('#filtersBtn').click(function () {
        $('#filters').toggle(200);
    });

    $('#cancel-filters').click(function(){
        $('#filters').toggle(200, function(){
            $('input[type="checkbox"]').prop('checked', false);
            $('#ratingFilter').val($('#defaultValue').val())
        });
    });
    $('#reset-filters').click(function(){
        $('input[type="checkbox"]').prop('checked', false);
        $('#ratingFilter').val($('#defaultValue').val());
    });
    $('#save-filters').click(function(){
        
        const {selectedTags, selectedLocation, selectedRating} = selectedFilters();

        $('#filters').toggle();
        
        $.ajax({
            type: 'post',
            url: '/saveFilters',
            data:{selectedTags, selectedLocation, selectedRating},
            success: function(){
                location.href = '/searchedRestaurants'
            }
       })
    })

}

function login(){
    $('#loginBtn').hide();
            $('#signupBtn').hide();
            $.ajax({
                type: 'GET',
                url: '/mainPage',
                success: function(data){
                    if(data.username == null){
                        $('#loginBtn').show();
                        $('#signupBtn').show();
                    }
                    else{
                        $('#loginBtn').hide();
                        $('#signupBtn').hide();
                        $('#username').html(`${data.username}`)
                    }
                }
            })
}

function selectedFilters(){
    var selectedTags = [];

    const checkedTags =$('#tagsForm').find('input[type="checkbox"]:checked')
    if (checkedTags.length==0){
        selectedTags = tags;
    }
    else{
        checkedTags.each(function() {
            selectedTags.push($(this).attr('id'));
        });
    }
    var selectedLocation = [];
    const checkedLocation =$('#locationForm').find('input[type="checkbox"]:checked')
    if (checkedLocation.length==0){
        $('#locationForm').find('input[type="checkbox"]').each(function() {
            selectedLocation.push($(this).attr('id'));
        });
    }
    else{
        checkedLocation.each(function() {
            selectedLocation.push($(this).attr('id'));
        });
    }
    var selectedRating = '0';
    if($('#ratingFilter').val()!=""){
        selectedRating = $('#ratingFilter').val();        
    }
    return {selectedTags, selectedLocation, selectedRating}
}

function firstLetterUppercase(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}
function SchemeTags(){

    var tagsHtml = "";
    for(tag of tags){
        tagsHtml+=`<input type="checkbox" id="${tag}"><label for="${tag}">`+firstLetterUppercase(tag)+`</label><br>`
    }
    return tagsHtml;
}