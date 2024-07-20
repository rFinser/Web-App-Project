
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
        $('#tags').append(tagsScheme());

        $('#filtersBtn').click(function (event) {
            $('#filters').toggle();
            event.stopPropagation();
        });

        $(document).click(function () {
            $('#filters').hide();
        });
    
        $('#filters').click(function (event) {
            event.stopPropagation();
        });

        $('#cancel-filters').click(function(event){
            $('#filters').toggle();
            event.stopPropagation();
        });

        $('#reset-filters').click(function(){
            $('input[type="checkbox"]').prop('checked', false);
        });

        $('#save-filters').click(function(){
            var selectedTags = [];

            const checkedTags =$('#tagsForm').find('input[type="checkbox"]:checked')
            if (checkedTags.length==0){
                selectedTags = Object.keys(tags);
            }
            else{
                checkedTags.each(function() {
                    selectedTags.push($(this).attr('id'));
                });
            }            
            $('#filters').toggle();
            
            $.ajax({
                type: 'post',
                url: '/saveTags',
                data:{tags:selectedTags},
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

function firstLetterUppercase(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}
function tagsScheme(){

    var tagsHtml = "";
    tagsHtml+=`<section id="tagsForm"></section>`
    for(tag of tags){
        tagsHtml+=`<input type="checkbox" id="${tag}"><label for="${tag}">`+firstLetterUppercase(tag)+`</label><br>`
    }
    tagsHtml += `</section>`;
    return tagsHtml;
}