let isAdmin = false;

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
            if(data.isAdmin){
                isAdmin = true;
            }
            makeRestaurant(data.restData)
            
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
        $("#products").append(makeProduct(product))
    }
    if(isAdmin){
        $("#products").append('<li class="newProduct"><button id="addProduct">add product</button></li>')
    }
}

function makeProduct(product) {
    return `
       <li>
        <section>
         <h5>${product.p_name}</h5>
         <p>${product.p_description}</p>
         <p>${product.p_price}</p>
         <input id="${product._id}" class="addBtn" type="button" value="Add To Cart">
        </section>
       </li> 
        `
}
function createProductData(){
    return `
    <div class="newProductForm">
        <label for="p-name">product name:</label>
        <input id="p-name" /></br>
        <label for="p-description">description:</label>
        <input id="p-description" /></br>
        <label for="p-price">price:</label>
        <input id="p-price" /></br>
        <label for="p-tags">tags:</label>
        <input id="p-tags" /></br>
        <button class="p-save">save</button>
        <button class="p-cancel">cancel</button>
    </div>`
}

$('#products').delegate('#addProduct', 'click', function(){
    const $li = $(this).closest('li')
    $('#addProduct').remove();
    $li.append(createProductData())
})

$('#products').delegate('.p-cancel', 'click', function(){
    const $li = $(this).closest('li')
    $('.newProductForm').remove();
    $li.append('<li class="newProduct"><button id="addProduct">add product</button></li>')
})

$('#products').delegate('.p-save', 'click', function(){
    
    const p_name = $('#p-name').val();
    const p_description = $('#p-description').val();
    const p_price = $('#p-price').val();
    const p_tags = $('#p-tags').val();

    $.ajax({
        type: 'post',
        url: '/addProduct/' + getRestaurantName(),
        data: {name: p_name, desc: p_description, price: p_price, tags: p_tags},
        success: function(){

            $("#products").append(makeProduct({p_name, p_description, p_price, p_tags}))
            $('.newProductForm').remove();
            $("#products").append('<li class="newProduct"><button id="addProduct">add product</button></li>')
        }
    })

})