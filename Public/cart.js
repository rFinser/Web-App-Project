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
        }
    });
});

$(document).on("click", ".remove-product", function() {
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
        }
    });

})

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
                window.location.reload();
            }
        });
    }
});

$('#confirm-purchase').on('click', hasDrawn)
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
