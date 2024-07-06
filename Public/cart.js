
$('.deleteBtn').on('click',function(){
    let $li = $(this).closest('li');
    $.ajax({
        type: 'DELETE',
        url: '/cart' + $(this).attr('id'),
        success: function(){
            $li.remove();
        }
    });
})

