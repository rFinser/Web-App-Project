$(function () {
    $.ajax({
        type: 'post',
        url: '/MyOrders',
        success: function(data){
            console.log(data);
            $("#name").html(data.orders._id);
            renderOrders(data.orders.orders);
        }            
    });
});


function renderOrders(orders) {
    for(const order of orders){
            const orderString = `
                <div class="order-container">
                    <p class="order-date">${new Date(order.date).toLocaleString()}</p>
                    <button class="toggle-order-details">▼</button>
                    <div class="order-details" style="display: none;">` +
                     createProducts(order.productsId)   
                    + `</div>
                    <p>Total: ₪${calculateTotal(order)}</p>
                </div>
                <hr style="border: 1px dashed black;">
            `;
            $("#orders").append(orderString);
    }
}

$(document).on("click", ".toggle-order-details", function() {
    $(this).text($(this).text() === '▼' ? '▲' : '▼');
    $(this).parent().find('.order-details').slideToggle();
});

function createProducts(products){
    const formattedProducts = formatProducts(products);
    let productsString = "";
    for(const productId in formattedProducts){
        const product = formattedProducts[productId];
        
        const productString = `
            <div class="product-container">
                <p class="product">${product.quantity} X ${product.name} - ₪${product.price}</p>
            </div>
        `;
        productsString += productString;
    }
    return productsString;
}

function calculateTotal(order){
    let total = 0;
    for(const product of order.productsId){
        total += product.p_price;
    }
    return total;
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
                quantity: 1,
            };
        }
    }
    return productDict;
}