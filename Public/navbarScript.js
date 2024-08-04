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
    const defaultRestIcon = "data:image/png;base64,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"
    $("#searchBar").keyup(function() {
        if($("#searchBar").val() == ""){
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
                        $("#results").append(`<a href="/restaurants/${restaurant.r_name}"><div class="resultsItem"><img src="${restaurant.r_icon}" onerror="this.src = '${defaultRestIcon}'">${restaurant.r_name}</div></a>`);
                    });
                }
            }
        });
    });
}
function filters(){

    $('#filters').hide();
    $('#tags').append(SchemeTags());

    $('#filtersBtn').click(function (event) {
        $('#filters').slideToggle();
        event.stopPropagation();
    });
    $('#filters').click(function(event){
        event.stopPropagation();
    });
    $(document).click(function(event){
        $('#filters').slideUp();
    });

    $('#cancel-filters-nav').click(function(){
        $('#filters').slideToggle(function(){
            $('input[type="checkbox"]').prop('checked', false);
            $('#ratingFilter').val($('#defaultValue').val())
        });
    });
    $('#reset-filters-nav').click(function(){
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
