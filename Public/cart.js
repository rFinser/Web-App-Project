$(function getProducts() {
    $.ajax({
        type: 'post',
        url: '/cart/products',
        success: function (data) {
            if(data.products.length == 0){
                handleEmptyCart();
                return;
            }
            $("#emptyCart").hide();
            renderProducts(data.products)
            $("#totalPrice").html(`Total: ₪${calculateTotal(data.products)}`);
            canvasScript()
        }
    })
});

function handleEmptyCart(){
    $("#emptyCart").html("Your Cart is Currently Empty")
    $("#emptyCart").show();
    $("#totalPrice").hide();
    $("#purchaseBtn").hide();
}

function renderProducts(products) {
    const defaultProductIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8AAABQUFAgICCMjIz7+/vd3d339/fU1NRubm60tLTh4eHHx8eZmZnu7u7MzMwMDAwlJSWmpqZ+fn6/v790dHTm5uagoKCwsLDw8PBcXFw1NTViYmIrKys6OjpBQUF9fX0YGBhGRkZlZWWRkZFLS0sCyyfqAAAFC0lEQVR4nO3c22KiMBAG4GLxfKoIVG2t2tb3f8U1CXgALYRMMsH9vyu7F+tMC8kkGXh5AQAAAAAAAAAAAAAAAAAAAAAAAAAAAICHut0udwg2jTrByTF61iQHiyA34o7Fiii4suSOxoI4uDHljodcPygYc0dELSxmuOGOiFoxwSDoc4dEa1zOcMIdE615OcN37phoxeUMn2w0HZQzjLhjolWaLIJgwB0TsY9ShtwRURsVE/zljojc7jbBN+546M2e+y4UZs+e4Mkyz+/nySq2i/Vqv9kMoxl3HNBAdz2IV9NwuUyGw+F+H/5G8Tx9kt2afm8VbrblikY4dJJovuaO0MQ6DsulTMkiWbVzvT8PF9XZnSVxu4bXbjzUyC7Tac8YO9hfwv5IpvF8PKmZ5Cbmjr2GfnTIwj0ko/P9dWd5+MAy5Yy+WpqXLcfodvSoneHpDzlnCr6G8aeKcRcVpoA00cjwdGl7erHm+YU311k6Wu7+zueerYc5ztSfabG6qlRmo5+DfnbKzrdr9Vfld/WrT6dfTbNTNj5NHpPipbV+f1CoafFmv3GtbsDV+R/mPwTpCQs/Fspqj2l5rrpWOtVaFQ/OGbsbEchXL//xnTA9qffn19s3fxNRnI8goqp4G+A935iKELb5BDh6s5Ag60mjukLD7Kee4ezw2BvXlTqTy9vsGLC7rIrTBE+JI9cL26wCndi5QM84pkZ5IjjMftCrrJvYO08wuvrNjilnwEdcjzdyEM06m1YO8jvpOE1QFtpZ9W//Cs0cXSeoasZ+g9VfU9/OEpT3oJqjUstj6C1X96IstdU2TM9lfic/ThKUi0F1id7pkrEsrAiOQiq+aMKU4PUq1BbZNjJiS9BBs9gxyNsoXN+DOcvbN6KJUpVqKVOCwdZqgqIY/ZKf7jQ5uTKsCNKEbKdQV0mNg0FrLPbBfwf5Us1ZqXaXtVtRlNtq88vGfoyGL0sJij7fhfzENYyeWdqdEvswqhp95c4wsHLKKHZCVdFkdUumHhuLxXWQNxTy1DIFFsZTcTihxlH+a1QgT1DsrKlLY8qdm0K+yhBLeTnMzCq/2xHiSVGUa5/yU4NOGTsS2gzFgadc1tfvG7GOtFdMbFyoHYQNd14Xn5QZii1fuXHBXs1cI7wTxV24k58+ubO6RriMEmsKOcV6M5AqZH9EObrIT6XnJHmRnUiJCUKNzdwpFRElKDcs5BbXnWfseBGdnMrlrmzmouqTIUN0WCOmCnliwLj79AjJWCMf4ZWPQ5aeP+NHstiX46csur0pSS9INk8P4n+SDQm8ydxH0Iii6jSxGvOo6L4gmBKzBW8nImmoJLczz9DhKXYjxqPpmjuDKsZbUt6VMUXGC4x99XcwM83wwJ1AJcPtbw8LtSLD6tuL/e2/GW6ckrdt0zOcET0sRUvMMnTRV2nKaKhpwUBj2GHD1lKiw+hVPnUfb2VldIDhqP3XjFFP5i939HUYdWbwts3UZPQyH49Omv5g8oKNI3fwtZi8jsHLjYsSk6NSp33qjZk8acodez0Gj313uWOvx6Bs+w8yDFuB+1FhAJvG4fdrO3yHjWZ9DxplNTR4+0KHO2ZN2svEFuwjFuieeHPH24Begi3Y7C7Rq09bsUNToPds4vNn+PxXaUuWFTc092s8eehAg3bjSdtm/AbvI2jDydpFo46FQXLstMMx8eO9ZwAAAAAAAAAAAAAAAAAAAAAAAAAAAABQwz+ZvFZIr5rQAAAAAABJRU5ErkJggg==";
    const formattedProducts = formatProducts(products);
    for(const productId in formattedProducts){
        const product = formattedProducts[productId];
        const productString = `
            <div class="product-container" data-productId="${productId}" data-name="${product.name}" data-quantity="${product.quantity}" data-price="${product.price}">
                
                <div class="product-info">
                    <button class="delete-product">X</button>
                    <img src="${product.img}"  onerror="this.src='${defaultProductIcon}'">
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
$(document).on("click", ".delete-product", function() {
    const productId = $(this).parent().parent().attr('data-productId');
    $.ajax({
        type: 'DELETE',
        url: '/cart/remove',
        data: {
            productId: productId
        },
        success: function (data) {
            $(`[data-productId="${productId}"]`).remove();
            updateTotal();
        }
    });
});

$(document).on("click", ".add-product", function() {
    const productContainer = $(this).closest(".product-container");
    const productId = $(this).parent().parent().attr('data-productId');
    let currentQuantity = parseInt($(this).parent().parent().attr("data-quantity"));
    const Quantity = $(this).parent().find(".product-quantity");
    $(this).parent().parent().attr("data-quantity", currentQuantity + 1);

    $.ajax({
        type: 'POST',
        url: '/cart/add',
        data: {
            productId: productId
        },
        success: function (data) {
            Quantity.html(currentQuantity + 1);
            updateTotal();

            productContainer.find(".product").html(`${productContainer.attr("data-name")} - ₪${productContainer.attr("data-price") * (currentQuantity + 1)}`);
        }
    });
});

$(document).on("click", ".remove-product", function() {
    const productContainer = $(this).closest(".product-container");
    const productId = $(this).parent().parent().attr('data-productId');
    let currentQuantity = parseInt($(this).parent().parent().attr("data-quantity"));
    const Quantity = $(this).parent().find(".product-quantity");
    $(this).parent().parent().attr("data-quantity", currentQuantity - 1);

    $.ajax({
        type: 'DELETE',
        url: `/cart${productId}`,
        success: function () {
            if(currentQuantity - 1 == 0){
                $('#productsList').find(`[data-productId="${productId}"]`).remove();
                if($('#productsList').children().length == 0){
                    handleEmptyCart();
                }
                return;
            }
            Quantity.html(currentQuantity - 1);
            updateTotal();

            productContainer.find(".product").html(`${productContainer.attr("data-name")} - ₪${productContainer.attr("data-price") * (currentQuantity - 1)}`);
        }
    });

})

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

function updateTotal() {
    $.ajax({
        type: 'post',
        url: '/cart/products',
        success: function (data) {
            $("#totalPrice").html(`Total: ₪${calculateTotal(data.products)}`);
        }
    });
}

$('#purchaseBtn').on('click', () => {

    document.getElementById("confirmModel").showModal()
});

$('#cancel-purchase').on('click', () => {
    document.getElementById("confirmModel").close();
    $('#confirm-purchase').prop('disabled', true)
    clearCanvas();
});
$('#clearCanvas').on('click', () => {
    $('#confirm-purchase').prop('disabled', true)
    clearCanvas();
});

$('#confirm-purchase').on('click', () => {
    if(hasDrawn()){
        $.ajax({
            type: 'POST',
            url: '/cart/purchase',
            success: function () {
                alert("Purchase Has Been Approved, You Can See it in The 'My Orders' Page")
                window.location.href = '/';
            }
        });
    }
});


function canvasScript(){
    const canvas = $('#signatureCanvas');
    const context = canvas[0].getContext('2d');
    let isDrawing = false;

    function startPosition(e) {
        isDrawing = true;
        draw(e);
    }

    function endPosition() {
        isDrawing = false;
        context.beginPath();
    }

    function draw(e) {
        if (!isDrawing) return;

        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = '#fff';

        const x = e.offsetX;
        const y = e.offsetY;

        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);

        if(hasDrawn()){
            $('#confirm-purchase').prop('disabled', false)
        }
        else{
            $('#confirm-purchase').prop('disabled', true)
        }
    }

    canvas.on('mousedown', startPosition);
    canvas.on('mouseup', endPosition);
    canvas.on('mousemove', draw);
    canvas.on('mouseleave', endPosition);

}

function clearCanvas(){
    const canvas = document.getElementById('signatureCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function hasDrawn() {
    const canvas = document.getElementById('signatureCanvas');
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let counter = 0;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i] == 255 || data[i + 1] == 255 || data[i + 2] == 255 || data[i + 3] == 255) {
            counter++;
        }
    }
    return counter > 400;
}
