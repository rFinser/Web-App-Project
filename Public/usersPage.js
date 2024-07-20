$(async function(){
    $.get("/allUsers", renderUsers)
})


function renderUsers(data){
    //TODO
    console.log(data);
}