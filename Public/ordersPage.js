$(async function(){
    $.get("/allOrders", renderOrders)
})


function renderOrders(data){
    //TODO
    console.log(data);
}