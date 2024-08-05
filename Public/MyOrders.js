$(function () {
    $.ajax({
        type: 'post',
        url: '/MyOrders',
        success: function(data){
            $("#name").html(data.orders._id);
            renderOrders(data.orders.orders);
        }            
    });
});


function renderOrders(orders) {
    for(const order of orders){
            const orderString = `
                <div class="order-container">
                    <div class="order-header">
                        <p class="order-date">${new Date(order.date).toLocaleString()}</p>
                        <button class="toggle-order-details">▼</button>
                    </div>
                    <div class="order-details" style="display: none;">` +
                     createProducts(order.productsId)   
                    + `</div>
                    <p>Total: ${calculateTotal(order)}</p>
                </div>
            `;
            $("#myOrders").append(orderString);
    }
}

$(document).on("click", ".toggle-order-details", function() {
    $(this).text($(this).text() === '▼' ? '▲' : '▼');
    $(this).parent().parent().find('.order-details').slideToggle();
});

function createProducts(products){
    const formattedProducts = formatProducts(products);
    let productsString = "";
    for(const productId in formattedProducts){
        const product = formattedProducts[productId];
        
        const productString = `
            <div class="product-container">
                <p class="product">${product.quantity} X ${product.name}${productId !== 'removed' ? ` - ₪${product.price * product.quantity}` : ''}</p>
            </div>
        `;
        productsString += productString;
    }
    return productsString;
}

function calculateTotal(order) {
    let total = 0;
    let hasRemovedProduct = false;
    for (const product of order.productsId) {
        if (product) {
            total += product.p_price;
        } else {
            hasRemovedProduct = true;
        }
    }
    return hasRemovedProduct ? "Couldn't calculate total, order includes a removed product" : `₪${total}`;
}

function formatProducts(products){
    let productDict = [];
    for(const product of products){
        if(product){
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
        else{
            if(productDict["removed"]){
                productDict["removed"].quantity += 1;
            }
            else{
                productDict["removed"] = {
                    name: "Removed Product",
                    price: 0,
                    quantity: 1
                }
            }
        }
    }
    return productDict;
}