let isAdmin = false;

$(document).ready(function () {
    $(document).on("click", ".addBtn", function () {
        const $li = $(this).closest('li')
        const productId = $li.attr("id")
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

$(async function(){
    //load navbar
    $.get("http://localhost/navbar.html", function(data){
        $("#navbarContainer").html(data);
        //! ADD NAVBAR FUNCTIONALLITY HERE:
        
        //checking if the user is logged in
        $.get("/isLoggedIn", function(data){
            if (data.isLoggedIn){
                $("#loginBtn").hide();
                $("#signupBtn").hide();
                $("#username").html(`${data.username}`);
            }
        })
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
    $("#title").html(`Restaurants | ${restaurant.r_name}`);
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
        $("#products").append('<li class="newProduct adminBtn"><button id="addProduct">add product</button></li>')
    }
}

function makeProduct(product) {
    return `
       <li id="${product._id}">
        <section class="product">
         <h5>${product.p_name}</h5>
         <p>${product.p_description}</p>
         <p>${product.p_price}</p>
         <input class="addBtn" type="button" value="Add To Cart"></input></br>`
         +Admin()+`
        </section>
       </li> 
        `
}
function Admin(){
    if(isAdmin){
        return `<button class="delProduct adminBtn">Delete</button><button  class="adminBtn updateProduct" >Update</button>`
    }
    else{
        return ''
    }
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
function updateProductData(){
    return `
    <div class="updateProductForm">
        <label for="p-name">product name:</label>
        <input id="p-name" /></br>
        <label for="p-description">description:</label>
        <input id="p-description" /></br>
        <label for="p-price">price:</label>
        <input id="p-price" /></br>
        <label for="p-tags">tags:</label>
        <input id="p-tags" /></br>
        <button class="u-save">save</button>
        <button class="u-cancel">cancel</button>
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
        success: function(data){

            $("#products").append(makeProduct({p_name, p_description, p_price, p_tags, _id:data.id}))
            $('.newProductForm').remove();
            $("#products").append('<li class="newProduct"><button id="addProduct">add product</button></li>')
        }
    })

})

$('#products').delegate('.delProduct', 'click', function(){
    const $li = $(this).closest('li')
    
    $.ajax({
        type: 'DELETE',
        url: '/deleteProduct/' + getRestaurantName(),
        data: {id: $li.attr('id')},
        success: function(){
            $li.remove()
        }
    })
})

$('#products').delegate('.updateProduct', 'click', function(){
    const $li = $(this).closest('li')
    $li.find('.product').hide()
    $('.adminBtn').hide()

    $.ajax({
        type: 'GET',
        url: '/getProduct'+$li.attr('id'),
        success: function(data){
            $li.append(updateProductData());
            $('#p-name').val(data.p_name);
            $('#p-description').val(data.p_description);
            $('#p-price').val(data.p_price);
            $('#p-tags').val(data.p_tags);
        }
    })
})

$('#products').delegate('.u-cancel', 'click', function(){
    const $li = $(this).closest('li');
    $('.updateProductForm').remove();
    $li.find('.product').show();
    $('.adminBtn').show();
})

$('#products').delegate('.u-save', 'click', function(){
    const $li = $(this).closest('li');

    const name = $('#p-name').val();
    const desc = $('#p-description').val();
    const price = $('#p-price').val();
    const tags = $('#p-tags').val();

    const id = $li.attr('id')

    $.ajax({
        type: 'PUT',
        url: '/updateProduct',
        data: {id,name,desc,price,tags},
        success: function(){
            $('.updateProductForm').remove();
            $li.find('.product').remove();
            $li.append(makeProduct({_id:id, p_name: name, p_description:desc,p_price: price}));
            $('.adminBtn').show();
        }
    })
})