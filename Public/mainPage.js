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
            products.forEach(product => {
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
            $list.append(createRestaurantScheme(rest));
        })        
    }
  })
})

function createRestaurantScheme(restaurant){
    return `
    <li>
    <div id=${restaurant.r_name}>
        <a href="restaurants/${restaurant.r_name}">
            <p>${restaurant.r_name}</p>
            <img src=${restaurant.r_icon} alt="no image found">
            <p>${restaurant.r_description}</p>
        </a>
    </div>
    </li>
    `
}