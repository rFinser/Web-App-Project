let isAdmin = false;
const tags = ['spicy','vegan', 'meat', 'dessert', 'salad']


$(document).ready(function () {
    $(document).on("click", ".addBtn", function () {
        const $li = $(this).closest('li')
        const productId = $li.attr("id")
        $.ajax({
            type: 'POST',
            url: `/cart/add`,
            data: { productId },
            success: handleProductAdded,
            error: function (e) {
                window.location.href = '/login'
            }
        });
    })
})

function handleProductAdded(){
    const popup = $('#addToCartPopup');
    popup.css('display', 'block');
    setTimeout(() => {
        popup.css('display', 'none');
    }, 2000);
}

$(function () {
    $.ajax({
        url: '/isAdmin',
        success: function(data){
            isAdmin = data.isAdmin
        }
    })
});

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
    const defaultRestIcon = "data:image/png;base64,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"

    const { restaurant, products } = restaurantJson;
    $("#title").html(`Restaurants | ${restaurant.r_name}`);
    $("#name").html(`${restaurant.r_name}`);
    $("#desc").html(`${restaurant.r_description}`);
    $("#address").html(`${restaurant.r_address}`);
    $("#icon").attr("src", `${restaurant.r_icon}`);
    $("#icon").attr('onerror', `this.src = '${defaultRestIcon}'`);
    for (tag of restaurant.r_tags) {
        $("#res-tags").append(`<li>${tag.name}</li>`)
    }

    for (product of products) {
        $("#products").append(makeProduct(product))
    }
    if(isAdmin){
        $("#products").append('<li class="newProduct"><button id="addProduct">+</button></li>')
    }
}

function makeProduct(product) {
    const defaultProductIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8AAABQUFAgICCMjIz7+/vd3d339/fU1NRubm60tLTh4eHHx8eZmZnu7u7MzMwMDAwlJSWmpqZ+fn6/v790dHTm5uagoKCwsLDw8PBcXFw1NTViYmIrKys6OjpBQUF9fX0YGBhGRkZlZWWRkZFLS0sCyyfqAAAFC0lEQVR4nO3c22KiMBAG4GLxfKoIVG2t2tb3f8U1CXgALYRMMsH9vyu7F+tMC8kkGXh5AQAAAAAAAAAAAAAAAAAAAAAAAAAAAICHut0udwg2jTrByTF61iQHiyA34o7Fiii4suSOxoI4uDHljodcPygYc0dELSxmuOGOiFoxwSDoc4dEa1zOcMIdE615OcN37phoxeUMn2w0HZQzjLhjolWaLIJgwB0TsY9ShtwRURsVE/zljojc7jbBN+546M2e+y4UZs+e4Mkyz+/nySq2i/Vqv9kMoxl3HNBAdz2IV9NwuUyGw+F+H/5G8Tx9kt2afm8VbrblikY4dJJovuaO0MQ6DsulTMkiWbVzvT8PF9XZnSVxu4bXbjzUyC7Tac8YO9hfwv5IpvF8PKmZ5Cbmjr2GfnTIwj0ko/P9dWd5+MAy5Yy+WpqXLcfodvSoneHpDzlnCr6G8aeKcRcVpoA00cjwdGl7erHm+YU311k6Wu7+zueerYc5ztSfabG6qlRmo5+DfnbKzrdr9Vfld/WrT6dfTbNTNj5NHpPipbV+f1CoafFmv3GtbsDV+R/mPwTpCQs/Fspqj2l5rrpWOtVaFQ/OGbsbEchXL//xnTA9qffn19s3fxNRnI8goqp4G+A935iKELb5BDh6s5Ag60mjukLD7Kee4ezw2BvXlTqTy9vsGLC7rIrTBE+JI9cL26wCndi5QM84pkZ5IjjMftCrrJvYO08wuvrNjilnwEdcjzdyEM06m1YO8jvpOE1QFtpZ9W//Cs0cXSeoasZ+g9VfU9/OEpT3oJqjUstj6C1X96IstdU2TM9lfic/ThKUi0F1id7pkrEsrAiOQiq+aMKU4PUq1BbZNjJiS9BBs9gxyNsoXN+DOcvbN6KJUpVqKVOCwdZqgqIY/ZKf7jQ5uTKsCNKEbKdQV0mNg0FrLPbBfwf5Us1ZqXaXtVtRlNtq88vGfoyGL0sJij7fhfzENYyeWdqdEvswqhp95c4wsHLKKHZCVdFkdUumHhuLxXWQNxTy1DIFFsZTcTihxlH+a1QgT1DsrKlLY8qdm0K+yhBLeTnMzCq/2xHiSVGUa5/yU4NOGTsS2gzFgadc1tfvG7GOtFdMbFyoHYQNd14Xn5QZii1fuXHBXs1cI7wTxV24k58+ubO6RriMEmsKOcV6M5AqZH9EObrIT6XnJHmRnUiJCUKNzdwpFRElKDcs5BbXnWfseBGdnMrlrmzmouqTIUN0WCOmCnliwLj79AjJWCMf4ZWPQ5aeP+NHstiX46csur0pSS9INk8P4n+SDQm8ydxH0Iii6jSxGvOo6L4gmBKzBW8nImmoJLczz9DhKXYjxqPpmjuDKsZbUt6VMUXGC4x99XcwM83wwJ1AJcPtbw8LtSLD6tuL/e2/GW6ckrdt0zOcET0sRUvMMnTRV2nKaKhpwUBj2GHD1lKiw+hVPnUfb2VldIDhqP3XjFFP5i939HUYdWbwts3UZPQyH49Omv5g8oKNI3fwtZi8jsHLjYsSk6NSp33qjZk8acodez0Gj313uWOvx6Bs+w8yDFuB+1FhAJvG4fdrO3yHjWZ9DxplNTR4+0KHO2ZN2svEFuwjFuieeHPH24Begi3Y7C7Rq09bsUNToPds4vNn+PxXaUuWFTc092s8eehAg3bjSdtm/AbvI2jDydpFo46FQXLstMMx8eO9ZwAAAAAAAAAAAAAAAAAAAAAAAAAAAABQwz+ZvFZIr5rQAAAAAABJRU5ErkJggg==";

    return `
       <li id="${product._id}">
        <section class="product">
         <h5>${product.p_name}</h5>
         <img src="${product.p_img}" onerror="this.src='${defaultProductIcon}'">
         <p>${product.p_description}</p>
         <p>${product.p_price}</p>
         <button class="addBtn">Add To Cart</button></br>`
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
        <p class="tooltip"></p>
        <label for="p-name">product name:</label>
        <input id="p-name" /></br>
        <label for="p-description">description:</label>
        <input id="p-description" /></br>
        <label for="p-price">price:</label>
        <input id="p-price" /></br>
        <label for="tagsForm">tags:</label>
        `+addProductTagsSchema()+`
        <label for="p-img">image:</label>
        <input id="p-img" /></br>
        <button class="p-save">save</button>
        <button class="p-cancel">cancel</button>
    </div>`
}
function updateProductData(){
    return `
    <div class="updateProductForm">
        <p class="tooltip"></p>
        <label for="p-name">product name:</label>
        <input id="p-name" /></br>
        <label for="p-description">description:</label>
        <input id="p-description" /></br>
        <label for="p-price">price:</label>
        <input id="p-price" /></br>
        <label for="tagsForm">tags:</label>
        `+addProductTagsSchema()+`
        <label for="p-img">image:</label>
        <input id="p-img"/></br>
        <button class="u-save">save</button>
        <button class="u-cancel">cancel</button>
    </div>`
}
function tagsScheme(){
    var tagsHtml = "";
    tagsHtml+=`<section id="tagsForm">`
    for(tag of tags){
        tagsHtml+=`<input type="checkbox" id="tag-${tag}"><label for="tag-${tag}">${tag}</label><br>`
    }
    tagsHtml += `</section>`;
    return tagsHtml;
}
function addProductTagsSchema(){
    var tagsHtml = "";
    tagsHtml+=`<section id="tagsForm">`
    for(tag of tags){
        tagsHtml+=`<input type="checkbox" id="product-tag-${tag}"><label for="product-tag-${tag}">${tag}</label><br>`
    }
    tagsHtml += `</section>`;
    return tagsHtml;
}
$('#products').delegate('#addProduct', 'click', function(){
    const $li = $(this).closest('li')
    $('#addProduct').remove();
    $li.append(createProductData())
})

$('#products').delegate('.p-cancel', 'click', function(){
    const $li = $(this).closest('li')
    $('.newProductForm').remove();
    $li.append('<button id="addProduct">+</button>')
})

$('#products').delegate('.p-save', 'click', function(){
    $('#tooltip').empty();
    const $li = $(this).closest('li')

    const p_name = $('#p-name').val();
    const p_description = $('#p-description').val();
    const p_price = $('#p-price').val();
    const p_img = $('#p-img').val();
    var p_tags = [];

    $li.find('#tagsForm').find('input[type="checkbox"]:checked').each(function() {
        p_tags.push($(this).attr('id').replace('product-tag-', ''));
    });
    if(!validProduct(p_name,p_description,p_price,p_tags))
    {
            $('.tooltip').html('please fill the fields correctly and choose at least one tag')
            return;
    }

    $.ajax({
        type: 'post',
        url: '/addProduct/' + getRestaurantName(),
        data: {name: p_name, desc: p_description, price: p_price, tags: p_tags, img: p_img},
        success: function(data){
            if(data.status == -1){
                $('.tooltip').html('product name already in use, try a diffrent name')
            }
            else{
              postProduct(getRestaurantName(), p_name)
              $("#products").append(makeProduct({p_name, p_description, p_price, p_tags, _id:data.id, p_img}))
              $li.remove();
              $("#products").append('<li class="newProduct"><button id="addProduct">+</button></li>')
            }
        }

    })

})

function postProduct(restaurantName, productName){
    fetch(`/FBpost`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `A New Product Has Been Added To The ${restaurantName} Restaurant: "${productName}" `,
        })
    })
}

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
        type: 'post',
        url: '/getProduct',
        data: {id:$li.attr('id')},
        success: function(product){
            $li.append(updateProductData());
            $('#p-name').val(product.p_name);
            $('#p-description').val(product.p_description);
            $('#p-price').val(product.p_price);
            $.each(product.p_tags, (i, tag) => {
                $li.find(`#product-tag-${tag}`).prop('checked', true);;
            })
            $("#p-img").val(product.p_img);
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

    $('.tooltip').empty();
    const $li = $(this).closest('li');

    const name = $('#p-name').val();
    const desc = $('#p-description').val();
    const price = $('#p-price').val();
    const img = $('#p-img').val();

    var tags = [];

    $li.find('#tagsForm').find('input[type="checkbox"]:checked').each(function() {
        tags.push($(this).attr('id').replace('product-tag-', ''));
    });
    if(!validProduct(name,desc,price,tags))
    {
        $('.tooltip').html('please fill the fields correctly and choose at least 1 tags')
        return;
    }

    const id = $li.attr('id')

    $.ajax({
        type: 'PUT',
        url: '/updateProduct/' + getRestaurantName(),
        data: {id,name,desc,price,tags,img},
        success: function(data){
            if(data.status == 1){
                $('.updateProductForm').remove();
                $li.find('.product').remove();
                $li.append(makeProduct({_id:id, p_name: name, p_description:desc,p_price: price, p_img: img}));
                $('.adminBtn').show();
            }
            else{
                $('.tooltip').html('product name already in use, try a diffrent name')
            }
        }
    })
})

function validProduct(name, desc, price, tags){
    const isNumber = /^[0-9]+$/;
    if(name =='' || desc == ''|| !isNumber.test(price) || price.length>6 || tags.length < 1){
        return false;
    }
    return true;
}

//product filters
$(document).ready(function () {
    $('#filtersForm').hide();
    
    $('#filter-tags').append(tagsScheme());
    $('#get-filters').click(function() { 
        $('#filtersForm').slideDown();
    });
    $('#cancel-filters').click(function(){
        $('#rangeTooltip').empty();
        $('#filtersForm').slideUp();
        $('input[type="checkbox"]').prop('checked', false);
        $('.rangeBtn').prop("value", "");
    });
    $('#reset-filters').click(function(){
        $('#rangeTooltip').empty();
        $('input[type="checkbox"]').prop('checked', false);
        $('.rangeBtn').prop("value", "");
    });
    $('#search-filters').click(function(){
        $('#rangeTooltip').hide();

        var selectedTags = [];
        var countFilters = 0;

        const checkedTags =$('#filter-tags').find('input[type="checkbox"]:checked')
        if (checkedTags.length==0){
            selectedTags = tags;
        }
        else{
            checkedTags.each(function() {
                let tagName = $(this).attr("id").replace("tag-", "");
                selectedTags.push(tagName);
                countFilters++;
            });
        }
        
        var min = $('#minPrice').val();
        var max = $('#maxPrice').val();

        if(min == ''){
            min = '0';
        }
        else{
            countFilters++;
        }
        if(max == ''){
            max = '9999999';
        }
        else{
            countFilters++;
        }
        if(!validRange(min,max))
        {
            $('#rangeTooltip').html('invalid range, price should be a Natural number');
            $('#rangeTooltip').show();
            return;
        }

        if(countFilters > 0)
            $('#get-filters').html(`(${countFilters}) filters`)
        else{
            $('#get-filters').html(`filters`);
            return;
        }

        $('#filtersForm').toggle();
        $.ajax({
            type: "post",
            url: "/productsSearched/" + getRestaurantName(),
            data: {tags: selectedTags, minPrice: min, maxPrice: max},
            success: function (products) {
                $("#products").empty();
                if(products.length == 0){
                    $("#products").append('<p>no product found</p>')
                }
                for (product of products) {
                    $("#products").append(makeProduct(product))
                }
                if(isAdmin){
                    $("#products").append('<li class="newProduct"><button id="addProduct">+</button></li>')
                }
            }
        });
    })
});

function validRange(min,max){
    if(min>max || min < 0 || max < 1){
        return false;
    }
    return true;
}
