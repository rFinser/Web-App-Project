$(async function(){
    $.post("/allOrders", renderOrders)
})


function renderOrders(data){
    console.log(data.ordersData);
    for(const groupedOrder of data.ordersData){
        createOrderSchema(groupedOrder);
    }
}


function createOrderSchema(order) {
    const orders = order.orders
    const $groupedOrder = $(`
        <div class="groupedOrder-container">
            <h2 class="groupedOrder-user">${order._id}</h2>
            <button class="toggle-groupedOrder-details">▼</button>
        
            <div class="groupedOrder-details" style="display: none;">
                <h3 class="orders-container"><hr style="border: dashed 1px black;">`+
                    createOrders(orders)
                + `</h3>
            </div>

        </div>
        <hr>
    `);

    $groupedOrder.find('.toggle-groupedOrder-details').on('click', function() {
        $(this).text($(this).text() === '▼' ? '▲' : '▼');
        $groupedOrder.find('.groupedOrder-details').slideToggle();
    });

    $("#groupedOrders-container").append($groupedOrder);
}

function createOrders(orders){
    let ordersString = "";
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
            
            ordersString += orderString;
        }
        return ordersString;
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
    
$(document).on("click", ".toggle-order-details", function() {
    $(this).text($(this).text() === '▼' ? '▲' : '▼');
    $(this).parent().find('.order-details').slideToggle();
});

function  calculateTotal(order){
    let total = 0;
    for(const product of order.productsId){
        total += product.p_price;
    }
    return total;
}