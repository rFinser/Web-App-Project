$(document).ready(function () {
    $.ajax({
        type: 'post',
        url: '/restaurantsFilters',
        success: function(restaurants){
            restaurants.forEach(async restaurant => {
                $('#restaurantList').append(await restaurantScheme(restaurant))
            });
        }
    });
});

async function restaurantScheme(restaurant){
    const defaultRestIcon = "data:image/png;base64,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"
    return `
    <li id=${restaurant.r_name}>
    <div class = "restaurant">
        <p id="restRating">${await formatRating(await getRating(restaurant.r_name))}</p>
        <a href="restaurants/${restaurant.r_name}">
            <p class="restName">${restaurant.r_name} </p>
            <img class="restImg" src=${restaurant.r_icon} alt="not Found" onerror="this.src = '${defaultRestIcon}'">
            <p class="restDesc">${restaurant.r_description}</p>
        </a>
    </div>
    </li>
    `
}

async function getRating(restaurantName) {
    let rating;
    await $.ajax({
        type: "POST",
        url: "/reviews/getAvgRating",
        data: { restaurantName: restaurantName },
        success: function (data) {
            rating = data.avgRating;
        },
    })
    return rating;
}

async function formatRating(rating) {
    if (rating === 0) {
        return "No Reviews Yet";
    }
    return `${rating} / 5`;
}