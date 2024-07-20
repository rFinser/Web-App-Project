$(document).ready(function () {
    const $orders = $("#orders");
    $.ajax({
        type: 'post',
        url: '/MyOrders',
        success: function(data){
            $('#name').html(`Hello ${data.username}`)
            data.orderProducts.forEach(order => {
                let orderHtml = '<ul>';
                order.forEach(product => {
                    orderHtml += `
                        <li>
                            product name: ${product.p_name}</br>
                            price: ${product.p_price}
                        </li>
                    `;
                });
                orderHtml += '</ul>';
                $orders.append(orderHtml);
            });
        }            
    });
});