$(function getProducts() {
    const $list = $("#productsList");
    $.ajax({
        url: '/cart/products',
        success: function (data) {
            for (product of data.products) {
                $list.append(`
                    <li>
                        ${product.p_name}
                        <button type="submit" class="deleteBtn" id="${product.p_id}">Delete</button>
                    </li>
                    `)
            }
        }
    })
});


//remove from cart
$(document).ready(function () {
    const $list = $("#productsList");
    $list.delegate(".deleteBtn", 'click', function () {
        let $li = $(this).closest('li');
        $.ajax({
            type: 'DELETE',
            url: '/cart' + $(this).attr('id'),
            success: function () {
                $li.remove();
            }
        });
    })
})

$("#purchseBtn").on('click', () => {
    $.ajax({
        type: 'POST',
        url: '/cart/purchase',
        success: () => {
            $("#productsList").empty();
        }
    });
});