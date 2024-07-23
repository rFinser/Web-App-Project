$(async function(){
    $.post("/allOrders", renderOrders)
})


function renderOrders(data){
    //TODO
    console.log(data);
}