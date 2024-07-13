let isAdmin = false;

$(document).ready(function () {
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
            isAdmin = data.isAdmin;
        }
    })
});
//search bar
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
            $('#results').empty();
            products.results.forEach(product => {
               $("#results").append(`<p>${product}</p>`);
            });
        }
    });
});

//loading the main section of restaurants
$(function (){
  const $list = $("#restaurantList");
  
  $.ajax({
    url: "/restaurants",
    success: function (restaurants){
        $.each(restaurants, (i, rest) => {
            $list.append(restaurantScheme(rest));
        })
        if(isAdmin == true){
            $list.append(`<li id="newRes" class="adminBtn"><button id="addRes">add restaurant</button></li>`);
        }
    }
  })
})

$('#restaurantList').delegate('#addRes', 'click', function(){
    $('#addRes').hide();
    $('#newRes').append(createRestaurantScheme())

})

$('#restaurantList').delegate('#cancelRes', 'click', function(){
    $('#addingData').remove();
    $('#addRes').show();
});

$('#restaurantList').delegate('#saveRes', 'click', function(){
    var $name = $('#resName');
    var $desc = $('#desc');
    var $icon = $('#icon');
    var $tags = $('#tags');
    var $address = $('#address');

    var rest = {r_name : $name.val(), r_description : $desc.val(), 
            r_icon : $icon.val(), r_tags:$tags.val(), r_address : $address.val()}
    $.ajax({
        type: 'POST',
        url: '/addRestaurant',
        data: rest,
        success: function(){
            $('#newRes').remove();
            $('#restaurantList').append(restaurantScheme(rest));
            $('#restaurantList').append(`<li id="newRes"><button id="addRes">add restaurant</button></li>`);
        }
    })

});


$('#restaurantList').delegate('.delRes', 'click', function(){
    let $li = $(this).closest('li');
    $.ajax({
        type: 'DELETE',
        url: '/delRestaurant'+$li.attr('id'),
        success: function(){
            $li.remove();
        }
    })
});

$('#restaurantList').delegate('.updateRes', 'click', function(){
    let $li = $(this).closest('li');
    $li.find('.restaurant').hide();
    $('.adminBtn').hide()
    $.ajax({
        type: 'GET',
        url: '/restaurantName'+$li.attr('id'),
        success: function(rest){
            $li.append(updateRestaurantScheme())
            $('.u_save').attr('id',rest.r_name);
            $('#u_resName').val(rest.r_name);
            $('#u_desc').val(rest.r_description);
            $('#u_icon').val(rest.r_icon);
            $('#u_address').val(rest.r_address);
            $('#u_tags').val(rest.r_tags);
            $('#u_geolocation').val(rest.r_geolocation);
        }
    })
});

$('#restaurantList').delegate('#u_cancel','click', function(){
    let $li = $(this).closest('li');
    
    $('#updateData').remove();
    $li.find('.restaurant').show();
    $('.adminBtn').show()
});

$('#restaurantList').delegate('.u_save','click', function(){

    let $li = $(this).closest('li');

    const name = $('#u_resName').val();
    const desc = $('#u_desc').val();
    const icon = $('#u_icon').val();
    const address = $('#u_address').val()
    const tags = $('#u_tags').val()
    const geo = $('#u_geolocation').val()

    const id = $('.u_save').attr('id')
    
    $.ajax({
        type: 'PUT',
        url: 'updateRestaurant',
        data: {id, name, desc, icon, address, tags, geo},
        success: function(){
            $('#updateData').remove()
            $li.find('.restaurant').remove();
            $li.attr('id', name)
            $li.append(updatedRestaurantScheme({r_name:name, r_icon: icon, r_description:desc}))
            $('.adminBtn').show()
        }
    })
});

function restaurantScheme(restaurant){
    return `
    <li id=${restaurant.r_name}>
    <div class = "restaurant">
        <a href="restaurants/${restaurant.r_name}">
            <p class="restName">${restaurant.r_name} </p>
            <img class="restImg" src=${restaurant.r_icon} alt="not Found">
            <p class="restDesc">${restaurant.r_description}</p>
        </a>`+
        Admin()+
    `</div>
    </li>
    `
}
function updatedRestaurantScheme(restaurant){
    return `
    <div class = "restaurant">
        <a href="restaurants/${restaurant.r_name} >
            <p class="restName">${restaurant.r_name} </p>
            <img class="restImg" src=${restaurant.r_icon} alt="not Found">
            <p class="restDesc">${restaurant.r_description}</p>
        </a>`+
        Admin()+
    `</div>`
}
function Admin(){
    if(isAdmin == true){
        return '<div class="adminBtn"><button class="delRes">Delete</button><button class="updateRes">Update</button></div>'
    }
    else{
        return ''
    }
}
function createRestaurantScheme(){
    return `
    <div id="addingData">
        <label for="resName">Restaurant name:</label>
        <input id="resName"/></br>
        <label for="desc">Description:</label>
        <input id="desc"/></br>
        <label for="icon">Icon(url):</label>
        <input id="icon"/></br>
        <label for="tags">tags(optimal):</label>
        <input id="tags"/></br>
        <label for="address">Address:</label>
        <input id="address"/></br>
        <button id="saveRes">save</button>
        <button id="cancelRes">cancel</button>
    </div>
    `
}
function updateRestaurantScheme(){
    return `
    <div id="updateData">
        <label for="u_resName">Restaurant name:</label>
        <input id="u_resName"/></br>
        <label for="u_desc">Description:</label>
        <input id="u_desc"/></br>
        <label for="u_icon">Icon(url):</label>
        <input id="u_icon"/></br>
        <label for="u_tags">tags(optimal):</label>
        <input id="u_tags"/></br>
        <label for="u_address">Address:</label>
        <input id="u_address"/></br>
        <label for="u_geolocation">Geo location:</label>
        <input id="u_geolocation"/></br>
        <button id="" class="u_save">save</button>
        <button id="u_cancel">cancel</button>
    </div>
    `
}
