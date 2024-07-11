let isAdmin = false;

$(document).ready(function () {
    $('#loginBtn').hide();
    $('#signupBtn').hide();
    $.ajax({
        type: 'GET',
        url: '/mainPage',
        success: function(data){
            if(data.username == null){
                $('#loginBtn').show();
                $('#signupBtn').show();
            }
            else{
                $('#loginBtn').hide();
                $('#signupBtn').hide();
                $('#username').html(`${data.username}`)
            }
            isAdmin = data.isAdmin;
        }
    })
});
//search bar
$("#searchBar").keyup(function() {
    if($("#searchBar").val() == "" || !$("#searchBar").is(":focus")){
        $('#results').hide();
        return;
    }

    $('#results').show();
    $.ajax({
        type: 'POST',
        url: '/search',
        data: {name: $("#searchBar").val()},
        success: function(products) {
            $('#results').empty();
            products.results.forEach(product => {
               $("#results").append(`<p>${product}</p>`);
            });
        }
    });
});

//loading the main section of restaurants
$(function (){
  const $list = $("#restaurantList");
  
  $.ajax({
    url: "/restaurants",
    success: function (restaurants){
        $.each(restaurants, (i, rest) => {
            $list.append(restaurantScheme(rest));
        })
        if(isAdmin == true){
            $list.append(`<li id="newRes"><button id="addRes">add restaurant</button></li>`);
        }
    }
  })
})

$('#restaurantList').delegate('#addRes', 'click', function(){
    $('#addRes').hide();
    $('#newRes').append(createRestaurantScheme())

})

$('#restaurantList').delegate('#cancelRes', 'click', function(){
    $('#addingData').remove();
    $('#addRes').show();
});

$('#restaurantList').delegate('#saveRes', 'click', function(){
    var $name = $('#resName');
    var $desc = $('#desc');
    var $icon = $('#icon');
    var $tags = $('#tags');
    var $adress = $('#adress');

    var rest = {r_name : $name.val(), r_description : $desc.val(), 
            r_icon : $icon.val(), r_tags:$tags.val(), r_adress : $adress.val()}
    $.ajax({
        type: 'POST',
        url: '/addRestaurant',
        data: rest,
        success: function(){
            $('#newRes').remove();
            $('#restaurantList').append(restaurantScheme(rest));
            $('#restaurantList').append(`<li id="newRes"><button id="addRes">add restaurant</button></li>`);
        }
    })

});


$('#restaurantList').delegate('.delRes', 'click', function(){
    let $li = $(this).closest('li');
    $.ajax({
        type: 'DELETE',
        url: '/delRestaurant'+$li.attr('id'),
        success: function(){
            $li.remove();
        }
    })
});

function restaurantScheme(restaurant){
    return `
    <li id=${restaurant.r_name}>
    <div class = "restaurant">
        <a href="restaurants/${restaurant.r_name}">
            <p>${restaurant.r_name}</p>
            <img src=${restaurant.r_icon} alt="not Found">
            <p>${restaurant.r_description}</p>
        </a>`+
        Admin()+
    `</div>
    </li>
    `
}
function Admin(){
    if(isAdmin == true){
        return '<button class="delRes">Delete</button><button class="updateRes">Update</button>'
    }
    else{
        return ''
    }
}
function createRestaurantScheme(){
    return `
    <div id="addingData">
        <label for="resName">Restaurant name:</label>
        <input id="resName"/></br>
        <label for="desc">Description:</label>
        <input id="desc"/></br>
        <label for="icon">Icon(url):</label>
        <input id="icon"/></br>
        <label for="tags">tags(optimal):</label>
        <input id="tags"/></br>
        <label for="adress">Address:</label>
        <input id="adress"/></br>
        <button id="saveRes">save</button>
        <button id="cancelRes">cancel</button>
    </div>
    `
}


//render graph of users registered on each month
$(async function (){
    const usersData = await getUsersData();
    
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleTime()
        .range([0, width])

    const y = d3.scaleLinear()
        .range([height, 0])

    const svg = d3.select("#graph")
        .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
    
    x.domain(d3.extent(usersData, e => e.month))
    y.domain([0, d3.max(usersData, e => e.users)])

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)
            .tickFormat((d, i) => getDate(i)));


    svg.append("g")
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x(e => x(e.month))
        .y(e => y(e.users));

    svg.append("path")
        .datum(usersData)
        .attr("fill", "none")
        .attr("stroke", "royalblue")
        .attr("stroke-width", 1)
        .attr("d", line);
})

function getDate(i){
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i];
}

async function getUsersData(){
    let usersData = [];
    for (let month=1; month <= 12; month++){
        const users = await getUsersRegisteredOnMonth(month);
        usersData.push({month, users: users.users.length})
    }

    return usersData;
}

async function getUsersRegisteredOnMonth(month){
    return $.ajax({
        url: `/users/${month}`,
        success: (data) => {return data}
    })
}