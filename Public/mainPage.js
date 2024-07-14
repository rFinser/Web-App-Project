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
    const defaultRestIcon = "data:image/png;base64,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"
    return `
    <li id=${restaurant.r_name}>
    <div class = "restaurant">
        <a href="restaurants/${restaurant.r_name}">
            <p class="restName">${restaurant.r_name} </p>
            <img class="restImg" src=${restaurant.r_icon} onerror="this.src = '${defaultRestIcon}'" alt="not Found">
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
