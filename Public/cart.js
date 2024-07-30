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
    const defaultProductIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8AAABQUFAgICCMjIz7+/vd3d339/fU1NRubm60tLTh4eHHx8eZmZnu7u7MzMwMDAwlJSWmpqZ+fn6/v790dHTm5uagoKCwsLDw8PBcXFw1NTViYmIrKys6OjpBQUF9fX0YGBhGRkZlZWWRkZFLS0sCyyfqAAAFC0lEQVR4nO3c22KiMBAG4GLxfKoIVG2t2tb3f8U1CXgALYRMMsH9vyu7F+tMC8kkGXh5AQAAAAAAAAAAAAAAAAAAAAAAAAAAAICHut0udwg2jTrByTF61iQHiyA34o7Fiii4suSOxoI4uDHljodcPygYc0dELSxmuOGOiFoxwSDoc4dEa1zOcMIdE615OcN37phoxeUMn2w0HZQzjLhjolWaLIJgwB0TsY9ShtwRURsVE/zljojc7jbBN+546M2e+y4UZs+e4Mkyz+/nySq2i/Vqv9kMoxl3HNBAdz2IV9NwuUyGw+F+H/5G8Tx9kt2afm8VbrblikY4dJJovuaO0MQ6DsulTMkiWbVzvT8PF9XZnSVxu4bXbjzUyC7Tac8YO9hfwv5IpvF8PKmZ5Cbmjr2GfnTIwj0ko/P9dWd5+MAy5Yy+WpqXLcfodvSoneHpDzlnCr6G8aeKcRcVpoA00cjwdGl7erHm+YU311k6Wu7+zueerYc5ztSfabG6qlRmo5+DfnbKzrdr9Vfld/WrT6dfTbNTNj5NHpPipbV+f1CoafFmv3GtbsDV+R/mPwTpCQs/Fspqj2l5rrpWOtVaFQ/OGbsbEchXL//xnTA9qffn19s3fxNRnI8goqp4G+A935iKELb5BDh6s5Ag60mjukLD7Kee4ezw2BvXlTqTy9vsGLC7rIrTBE+JI9cL26wCndi5QM84pkZ5IjjMftCrrJvYO08wuvrNjilnwEdcjzdyEM06m1YO8jvpOE1QFtpZ9W//Cs0cXSeoasZ+g9VfU9/OEpT3oJqjUstj6C1X96IstdU2TM9lfic/ThKUi0F1id7pkrEsrAiOQiq+aMKU4PUq1BbZNjJiS9BBs9gxyNsoXN+DOcvbN6KJUpVqKVOCwdZqgqIY/ZKf7jQ5uTKsCNKEbKdQV0mNg0FrLPbBfwf5Us1ZqXaXtVtRlNtq88vGfoyGL0sJij7fhfzENYyeWdqdEvswqhp95c4wsHLKKHZCVdFkdUumHhuLxXWQNxTy1DIFFsZTcTihxlH+a1QgT1DsrKlLY8qdm0K+yhBLeTnMzCq/2xHiSVGUa5/yU4NOGTsS2gzFgadc1tfvG7GOtFdMbFyoHYQNd14Xn5QZii1fuXHBXs1cI7wTxV24k58+ubO6RriMEmsKOcV6M5AqZH9EObrIT6XnJHmRnUiJCUKNzdwpFRElKDcs5BbXnWfseBGdnMrlrmzmouqTIUN0WCOmCnliwLj79AjJWCMf4ZWPQ5aeP+NHstiX46csur0pSS9INk8P4n+SDQm8ydxH0Iii6jSxGvOo6L4gmBKzBW8nImmoJLczz9DhKXYjxqPpmjuDKsZbUt6VMUXGC4x99XcwM83wwJ1AJcPtbw8LtSLD6tuL/e2/GW6ckrdt0zOcET0sRUvMMnTRV2nKaKhpwUBj2GHD1lKiw+hVPnUfb2VldIDhqP3XjFFP5i939HUYdWbwts3UZPQyH49Omv5g8oKNI3fwtZi8jsHLjYsSk6NSp33qjZk8acodez0Gj313uWOvx6Bs+w8yDFuB+1FhAJvG4fdrO3yHjWZ9DxplNTR4+0KHO2ZN2svEFuwjFuieeHPH24Begi3Y7C7Rq09bsUNToPds4vNn+PxXaUuWFTc092s8eehAg3bjSdtm/AbvI2jDydpFo46FQXLstMMx8eO9ZwAAAAAAAAAAAAAAAAAAAAAAAAAAAABQwz+ZvFZIr5rQAAAAAABJRU5ErkJggg==";

    let productDict = [];
    for(const product of products){
        if(productDict[product._id]){
            productDict[product._id].quantity += 1;
        }else{
            productDict[product._id] = {
                name: product.p_name,
                price: product.p_price,
                img: product.p_img || defaultProductIcon,
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