$(function getProducts() {
    $.ajax({
        type: 'post',
        url: '/cart/products',
        success: function (data) {
            console.log(data);

            if(data.products.length == 0){
                handleEmptyCart();
                return;
            }
            $("#emptyCart").hide();
            renderProducts(data.products)
            $("#totalPrice").html(`Total: ₪${calculateTotal(data.products)}`);
        }
    })
});

function handleEmptyCart(){
    $("#emptyCart").html("Your Cart is Currently Empty")
    $("#totalPrice").hide();
    $("#purchaseBtn").hide();
}

function renderProducts(products) {
    const formattedProducts = formatProducts(products);
    for(const productId in formattedProducts){
        const product = formattedProducts[productId];
        const productString = `
            <div class="product-container" data-productId="${productId}" data-quantity="${product.quantity}">
                <div class="product-info">
                    <img src="${product.img}">
                    <p class="product">${product.name} - ₪${product.price * product.quantity}</p>
                </div>
                <div class="product-actions">
                    <button class="add-product">+</button>
                    <p class="product-quantity">${product.quantity}</p>
                    <button class="remove-product">-</button>
                </div>
            </div>
        `;
        $("#productsList").append(productString);
    }
}

$(document).on("click", ".add-product", function() {
    const productId = $(this).parent().parent().attr('data-productId');
    let currentQuantity = parseInt($(this).parent().attr("data-quantity"));
    
    $(this).parent().attr("data-quantity", currentQuantity + 1);

    $.ajax({
        type: 'POST',
        url: '/cart/add',
        data: {
            productId: productId
        },
        success: function (data) {
            location.reload();
        }
    });
});

$(document).on("click", ".remove-product", function() {
    const productId = $(this).parent().parent().attr('data-productId');
    let currentQuantity = parseInt($(this).parent().attr("data-quantity"));

        $(this).parent().attr("data-quantity", currentQuantity - 1);
        $.ajax({
            type: 'DELETE',
            url: `/cart${productId}`,
            success: function () {
                location.reload();
            }
        });

})

function deleteProduct(productId){
    $.ajax({
        type: 'DELETE',
        url: `/cart${productId}`,
        success: function () {
            location.reload();
        }
    });
}

function formatProducts(products){
    let productDict = [];
    for(const product of products){
        if(productDict[product._id]){
            productDict[product._id].quantity += 1;
        }else{
            productDict[product._id] = {
                name: product.p_name,
                price: product.p_price,
                img: product.p_img,
                quantity: 1,
            };
        }
    }
    return productDict;
}

function calculateTotal(products){
    let total = 0;
    for(const product of products){
        total += product.p_price;
    }
    return total;
}



$("#purchaseBtn").on('click', () => {
    $.ajax({
        type: 'POST',
        url: '/cart/purchase',
        success: () => {
            location.reload();
        }
    });
});