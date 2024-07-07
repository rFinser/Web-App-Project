$(".addBtn").on('click', function() {
    const productId = $(this).attr("id");
    $.ajax({
        type: 'POST',
        url: `/cart/add`,
        data: {productId},
        success: function() {
            console.log("added product");
        }
    });
})