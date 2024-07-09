$(document).ready(function () {
    $(document).on("click", ".addBtn", function () {
        const productId = $(this).attr("id")
        $.ajax({
            type: 'POST',
            url: `/cart/add`,
            data: { productId },
            success: function () {
                console.log("added product");
            },
            error: function (e) {
                window.location.href = '/login'
            }
        });
    })
})

//gets the restaurant name from the url of the current page
function getRestaurantName() {
    return window.location.href.split("/").slice(-1)[0];
}

$(async function () {
    const restName = getRestaurantName();
    $.ajax({
        type: 'POST',
        url: `/restaurant`,
        data: { restaurantName: restName },
        success: function (data) {
            makeRestaurant(data)
        }
    })
});

function makeRestaurant(restaurantJson) {
    const { restaurant, products } = restaurantJson;
    $("#name").html(`${restaurant.r_name}`);
    $("#desc").html(`${restaurant.r_description}`);
    $("#address").html(`${restaurant.r_address}`);
    $("#icon").attr("src", `${restaurant.r_icon}`);

    for (tag of restaurant.r_tags) {
        $("#tags").append(`<li>${tag}</li>`)
    }

    for (product of products) {
        makeProduct(product)
    }
}

function makeProduct(product) {
    $("#products").append(`
       <li>
        <section>
         <h5>${product.p_name}</h5>
         <p>${product.p_description}</p>
         <p>${product.p_price}</p>
         <input id="${product.p_id}" class="addBtn" type="button" value="Add To Cart">
        </section>
       </li> 
        `)
}