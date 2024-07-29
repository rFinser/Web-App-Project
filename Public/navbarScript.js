const filtersTags = ["meat","salad","vegan","seafood","dessert","sandwiches","burgers","bbq","sushi","pastries","soups","ice-cream","smoothies","fast-food","gourmet-food","asian","italian","mexican"]

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

        loadAdminBtns();

        sideBar();
    })
})

function searchBar(){
    $("#searchBar").keyup(function() {
        if($("#searchBar").val() == "" || !$("#searchBar").is(":focus")){
            $('#results').removeClass('active');
            return;
        }
    
        $('#results').addClass('active');
        $.ajax({
            type: 'POST',
            url: '/search',
            data: {name: $("#searchBar").val()},
            success: function(restaurants) {
                console.log(restaurants)
                $('#results').empty();
                if(restaurants.length == 0){
                    $('#results').append('<p>no results found</p>')
                }
                else{
                    restaurants.forEach(restaurant => {
                        $("#results").append(`<div class="resultsItem"><img src="${restaurant.r_icon}"><a href="/restaurants/${restaurant.r_name}">${restaurant.r_name}</a></div>`);
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
        $('#filters').slideToggle();
    });

    $('#cancel-filters').click(function(){
        $('#filters').slideToggle(function(){
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
        $('#filters').slideToggle();
        
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
    $('.login-signup-container').hide();
    $.ajax({
        type: 'GET',
        url: '/mainPage',
        success: function(data){
            if(data.username == null){
                $('#usernameForm').hide();
                $('.login-signup-container').show();
            }
            else{
                $('.login-signup-container').hide();
                $('#usernameForm').show();
                $('#username').html(`${data.username}`)
            }
        }
    })
}

function selectedFilters(){
    var selectedTags = [];

    const checkedTags =$('#tags').find('input[type="checkbox"]:checked')
    if (checkedTags.length==0){
        selectedTags = filtersTags;
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

    var tagsHtml = "<section class='tags-section1'>";
    const firstSection = filtersTags.slice(0, Math.ceil(filtersTags.length/2));
    const secondSection = filtersTags.slice(Math.ceil(filtersTags.length/2), filtersTags.length);
    for(tag of firstSection){
        tagsHtml+=`<div><input type="checkbox" id="${tag}"><label for="${tag}">`+firstLetterUppercase(tag)+`</label></div>`
    }
    tagsHtml+= "</section>";
    tagsHtml+= "<section class='tags-section2'>";
    for(tag of secondSection){
        tagsHtml+=`<div><input type="checkbox" id="${tag}"><label for="${tag}">`+firstLetterUppercase(tag)+`</label></div>`
    }
    tagsHtml+= "</section>";
    return tagsHtml;
}

function loadAdminBtns(){
    $.ajax({
        type: "get",
        url: "/isAdmin",
        success: function (response) {
            if (response.isAdmin){
                $(".adminModeBtns").show();
            }
            else {
                $(".adminModeBtns").hide();
            }
        }
    });
}

function sideBar(){
    $('#open-sidebar').click(function(){
        $('#sidebar').addClass('active');
    });
    $('#close-sidebar').click(function(){
        $('#sidebar').removeClass('active');
    });
}
