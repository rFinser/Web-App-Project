let map;
$(async function initMap(){
    const { Map } = await google.maps.importLibrary("maps");
    const restaurantData = await getRestaurantLocations();
    const restaurantLocations = restaurantData.restData.restaurant.r_geolocation;

    let mapOptions = {
        center: {lat: 31.7683, lng: 34.8},
        zoom:8.3,
    }

    map = new Map(document.getElementById("map"), mapOptions);
    
    for(const location of restaurantLocations){
        try{
            makeMarker(Number(location.lat), Number(location.lng), location.address);
        }
        catch(e){
            console.log(e);
        }
    }
})

function makeMarker(lat, lng, address){
    let marker = new google.maps.Marker({
        position: {lat, lng},
        map
    })

    let info = new google.maps.InfoWindow({
        content: `<p style="color: black;">${address}</p>`
    })

    marker.addListener('click', ()=>{
        info.open(map, marker);
    })
}

function getRestaurantName() {
    return window.location.href.split("/").slice(-1)[0];
}

async function getRestaurantLocations() {
    const restName = getRestaurantName();
    return $.ajax({
        type: 'POST',
        url: `/restaurant`,
        data: { restaurantName: restName },
        success: function (data) {
            return data;
        }
    })
}


