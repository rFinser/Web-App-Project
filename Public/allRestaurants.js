let isAdmin = false;

const tags = ["meat", "salad", "vegan", "seafood", "dessert", "sandwiches", "burgers", "bbq", "sushi", "pastries", "soups", "ice-cream", "smoothies", "fast-food", "gourmet-food", "asian", "italian", "mexican"]

$(function () {
    $.ajax({
        url: '/isAdmin',
        success: function (data) {
            isAdmin = data.isAdmin
            loadRestaurants();
        }
    })

});


function loadRestaurants() {
    const $list = $("#restaurantList");
    $.ajax({
        url: "/restaurants",
        success: function (restaurants) {
            if (isAdmin == true) {
                $list.append(`<li id="newRestaurant"><div id="newRes"><button id="addRes" class="adminBtn">+</button></div></li>`);
            }
            $.each(restaurants, async (i, rest) => {
                $list.append(await restaurantScheme(rest));
            })
        }
    })

}

$('#restaurantList').delegate('#addRes', 'click', function () {
    $('.adminBtn').hide();
    $(this).parent().parent().attr("id", "a");
    $('#newRes').append(createRestaurantScheme())
    $('.tooltip').hide()

})

$('#restaurantList').delegate('#cancelRes', 'click', function () {
    $(this).closest("li").attr("id", "newRestaurant");
    $('#addingData').remove();
    $('.adminBtn').show();
});

$('#restaurantList').delegate('#saveRes', 'click', async function () {
    const saveButton = $(this);
    $('.tooltip').hide()

    var selectedTags = [];
    $('#newRes').find('#tagsForm').find('input[type="checkbox"]:checked').each(function () {
        selectedTags.push($(this).attr('id').replace("tag-", ""));
    });

    var tags = []

    $.each(selectedTags, (i, tag) => {
        tags.push(tag)
    })

    const name = $('#resName').val();
    const desc = $('#desc').val();
    const icon = $('#icon').val();

    if (!validInputs(name, desc)) {
        $('#inputsTooltip').html('Please fill all the required fields correctly');;
        $('#inputsTooltip').show();
        return;
    }

    let addresses = [];
    $('#addressContainer').find('input').each(function () {
        addresses.push($(this).val())
    })

    const { allValid, validAddresses } = await checkAddresses(addresses);
    if (!allValid) {
        $("#addressTooltip").show();
        return;
    }


    const restaurant = { r_name: name, r_description: desc, r_icon: icon, r_tags: tags, r_geolocation: validAddresses };

    $.ajax({
        type: 'POST',
        url: '/addRestaurant',
        data: restaurant,
        success: async function (data) {
            if (data.status == 1) {
                saveButton.closest("li").attr("id", "newRestaurant");
                $('#addingData').remove();
                $('.adminBtn').show();
                $("#restaurantList").append(await restaurantScheme(restaurant));
                await postRestaurant(restaurant.r_name);
            }
        }
    })
});

async function checkAddresses(addresses) {
    let validAddresses = [];

    if(addresses.length === 1 && addresses[0] === "") { //if only have one address and it's empty
        return { allValid: false, validAddresses: [] };
    }

    for (const address of addresses) {
        if (address === "") {
            continue; //any empty address is not considered
        }

        try {
            const response = await $.ajax({
                type: "post",
                url: "/openCageLatLng",
                data: { address }
            });
            validAddresses.push(response);
        } catch (error) {
            console.error("Error validating address:", address, error);
            return { allValid: false, validAddresses: [] };
        }
    }

    return { allValid: true, validAddresses };
}

function postRestaurant(restaurantName) {
    fetch("/FBpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: `A New Restaurant Has Been Opened: "${restaurantName}"`,
        }),
    })
}

function validInputs(name, desc) {
    if (name.length < 4 || desc.length < 8 || desc.length > 70 || name.length > 20) {
        return false;
    }
    return true;
}

$('#restaurantList').delegate('.delRes', 'click', function () {
    let $li = $(this).closest('li');
    $.ajax({
        type: 'DELETE',
        url: '/delRestaurant' + $li.attr('id'),
        success: function () {
            $li.remove();
        }
    })
});

$('#restaurantList').delegate('.updateRes', 'click', function () {
    let $li = $(this).closest('li');
    $li.addClass("updating");
    $li.find('.restaurant').hide();
    $('.adminBtn').hide()
    $.ajax({
        type: 'post',
        url: '/restaurantName/' + $li.attr('id'),
        success: function (rest) {
            $li.append(updateRestaurantScheme())
            $li.attr('id', rest.r_name);
            $('#u_resName').val(rest.r_name);
            $('#u_desc').val(rest.r_description);
            $('#u_icon').val(rest.r_icon);

            $.each(rest.r_geolocation, (i, location) => {
                $('#u_addressContainer').append(`<input id="u_address" value="${location.address}" placeholder="Format: Address, City(optional), Country(optional)" style="width: 300px;"/>`);
            })
            $.each(rest.r_tags, (i, tag) => {
                $('#tagsForm').find(`#tag-${tag}`).prop('checked', true);
            })
        }
    })
});

$('#restaurantList').delegate('.u_cancel', 'click', function () {
    let $li = $(this).closest('li');
    $li.removeClass("updating");
    $('#updateData').remove();
    $li.find('.restaurant').show();
    $('.adminBtn').show()
});

$('#restaurantList').delegate('.u_save', 'click', async function () {
    const updateButton = $(this);
    $('.tooltip').hide();
    let $li = $(this).closest('li');
    $li.removeClass("updating");

    var selectedTags = [];
    $('#tagsForm').find('input[type="checkbox"]:checked').each(function () {
        selectedTags.push($(this).attr('id').replace("tag-", ""));
    });

    var tags = []

    $.each(selectedTags, (i, tag) => {
        tags.push(tag);
    })

    const name = $('#u_resName').val();
    const desc = $('#u_desc').val();
    const icon = $('#u_icon').val();
    
    if (!validInputs(name, desc)) {
        $('#inputsTooltip').html('please fill all the required fields');
        $('#inputsTooltip').show();
        return;
    }

    let addresses = [];
    $('#u_addressContainer').find('input').each(function () {
        addresses.push($(this).val())
    })

    const { allValid, validAddresses } = await checkAddresses(addresses);
    if (!allValid) {
        $("#u_addressTooltip").show();
        return;
    }

    const restaurant = { name, desc, icon, tags, r_geolocation: validAddresses };

    const id = $li.attr('id')

    $.ajax({
        type: 'PUT',
        url: '/updateRestaurant',
        data: { id, name, desc, icon, tags, geo: validAddresses },
        success: async function (data) {
            if (data.status == 1) {
                $('#updateData').remove()
                $li.find('.restaurant').remove();
                $li.attr('id', name)
                $li.append(await restaurantScheme(restaurant))
                $('.adminBtn').show();
                window.location.reload(); //temporary!
            }
        }
    })
});

async function getRating(restaurantName) {
    let rating;
    await $.ajax({
        type: "POST",
        url: "/reviews/getAvgRating",
        data: { restaurantName: restaurantName },
        success: function (data) {
            rating = data.avgRating;
            if (rating == 0) {
                rating = "No Reviews Yet";
            }
            else {
                rating = `${rating} / 5`
            }

        }
    })
    return rating;
}

async function sendRating(restaurantName, rating) {
    await $.ajax({
        type: "POST",
        url: "/reviews/addReview",
        data: { restaurantName: restaurantName, rating: rating },
        success: function (data) {
            switch (data.status) {
                case -1:
                    location.href = "/login";
                    break;
                case 0:
                    break;
            }
        }
    })
}

async function removeRating(restaurantName) {
    await $.ajax({
        type: "POST",
        url: "/reviews/deleteReview",
        data: { restaurantName }
    })
}

async function hasReviewed(restaurantName) {
    let reviewed;
    await $.ajax({
        type: "POST",
        url: "/reviews/hasReviewed",
        data: { restaurantName: restaurantName },
        success: function (data) {
            reviewed = data.hasReviewed;
        },
    })
    return reviewed;
}

async function didReview(restaurantName) {
    let didReview = await hasReviewed(restaurantName);
    if (didReview) {
        return `
            <button class="addRatingBtn">Update Rating</button>
            <button class="removeRating">Delete Review</button>
        `
    }
    else {
        return `
            <button class="addRatingBtn">Add Rating</button>
        `
    }
}

$(document).on('click', '.addRatingBtn', async function () {
    const restaurantDiv = $(this).closest("div");
    const restaurantName = restaurantDiv.closest("li").attr("id");
    const isRatingOpen = restaurantDiv.attr('data-ratingOpen') === 'true';

    if (isRatingOpen) {

        // Submit the rating
        const rating = restaurantDiv.find('.ratingInput').val();
        await sendRating(restaurantName, rating);

        // Update the rating text
        const updatedRating = await getRating(restaurantName);
        restaurantDiv.find("#restRating").text(updatedRating);

        // Clean up the rating UI
        restaurantDiv.find('.ratingMenu').remove();
        $(this).text('Update Rating');
        restaurantDiv.attr('data-ratingOpen', 'false');
        $(this).parent().find(".removeRating").show();

    } else {
        // Create and show the rating menu
        $(this).parent().find(".removeRating").hide();
        const ratingMenu = $(`
              <div class="ratingMenu">
                  <select class="ratingInput">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                  </select>
                  <button class="cancelRating">Cancel</button>
              </div>
          `);
        $(this).after(ratingMenu);
        $(this).text('Submit Rating');
        restaurantDiv.attr('data-ratingOpen', 'true');
    }
});

// Add a click event for the cancel button
$(document).on('click', '.cancelRating', async function () {
    const restaurantDiv = $(this).closest('.restaurant');
    const restaurantName = restaurantDiv.closest("li").attr("id");
    restaurantDiv.find('.ratingMenu').remove();
    restaurantDiv.attr('data-ratingOpen', 'false');
    restaurantDiv.find(".removeRating").show();

    if (await hasReviewed(restaurantName)) {
        restaurantDiv.find(".addRatingBtn").text("Update Rating");
    }
    else {
        restaurantDiv.find(".addRatingBtn").text("Add Rating");
    }
});
// Add a click event for the delete button
$(document).on('click', '.removeRating', async function () {
    const restaurantDiv = $(this).closest('.restaurant');
    const restaurantName = restaurantDiv.closest("li").attr("id");
    restaurantDiv.find('.ratingMenu').remove();
    restaurantDiv.find('#addRatingBtn').text('Add Rating');
    restaurantDiv.attr('data-ratingOpen', 'false');

    await removeRating(restaurantName);
    restaurantDiv.find(".removeRating").hide();
    restaurantDiv.find(".addRatingBtn").text("Add Rating");
    restaurantDiv.find("#restRating").text(await getRating(restaurantName));
});


async function restaurantScheme(restaurant) {
    const defaultRestIcon = "data:image/png;base64,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"

    const rating = await getRating(restaurant.r_name);

    return `
      <li id="${restaurant.r_name}">
      <div class = "restaurant" data-ratingOpen="false">
        ${Admin()}
      <p id="restRating">${rating}</p>
      <a href="restaurants/${restaurant.r_name}">
          <p class="restName">${restaurant.r_name} </p>
          <img class="restImg" src="${restaurant.r_icon}" onerror="this.src = '${defaultRestIcon}'" alt="not Found">
          <p class="restDesc">${restaurant.r_description}</p>
      </a>`
        +
        await didReview(restaurant.r_name)
        +
        `</div>
      </li>
      `
}
async function updatedRestaurantScheme(restaurant) {
    const defaultRestIcon = "data:image/png;base64,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"

    return `
      <div class = "restaurant">
         ${Admin()}
          <p id="rating"></p>
          <a href="restaurants/${restaurant.r_name}">
              <p class="restName">${restaurant.r_name} </p>
              <img class="restImg" src=${restaurant.r_icon}  onerror="this.src = '${defaultRestIcon}'" alt="not Found">
              <p class="restDesc">${restaurant.r_description}</p>
          </a>`
        +
        didReview(restaurant.r_name)
        +
        `</div>`
}
function Admin() {
    if (isAdmin == true) {
        return '<div class="adminBtn"><button class="delRes">Delete</button><button class="updateRes">Update</button></div>'
    }
    else {
        return ''
    }
}

$(document).on("click", "#addAddress", function () {
    $addressList = $(this).parent();
    $addressList.append(`<input id="address" placeholder="format: address, city(optional), country(optional)" style="width: 300px;"/><br>`)
})

function createRestaurantScheme() {
    return `
      <div id="addingData">
          <p id="inputsTooltip" class="tooltip"></p>
          <label for="resName">Restaurant name:</label>
          <input id="resName"/></br>
          <p id="nameTooltip" class="tooltip"></p>
          <label for="desc">Description:</label>
          <input id="desc"/></br>
          <label for="icon">Icon(url):</label>
          <input id="icon"/></br>
          `+ tagsScheme() + `
          <label for="address">Address(Hebrew):</label>
          <div id="addressContainer">
            <input id="address" placeholder="Format: Address, City(optional), Country(optional)" style="width: 300px;"/>
            <button id="addAddress">Add Address</button></br>
          </div>
          <p id="addressTooltip" class="tooltip">invalid address</p>
          <button id="saveRes">save</button>
          <button id="cancelRes">cancel</button>
      </div>
      `
}
function updateRestaurantScheme() {
    return `
      <div id="updateData">
          <p id="inputsTooltip" class="tooltip"></p>
          <label for="u_resName">Restaurant name:</label>
          <input id="u_resName"/></br>
          <p id="nameTooltip" class="tooltip"></p>
          <label for="u_desc">Description:</label>
          <input id="u_desc"/></br>
          <label for="u_icon">Icon(url):</label>
          <input id="u_icon"/></br>
          `+ tagsScheme() + `
          <label for="u_address">Address(Hebrew):</label>
          <div id="u_addressContainer">
            <button id="addAddress">Add Address</button></br>
          </div>
          <p id="u_addressTooltip" class="tooltip" style="display:none;">Invalid Address</p>
          <button class="u_save">save</button>
          <button class="u_cancel">cancel</button>
      </div>
      `
}
function firstLetterUppercase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
function tagsScheme() {

    var tagsHtml = "";
    tagsHtml += `<section id="tagsForm">`
    for (tag of tags) {
        tagsHtml += `<input type="checkbox" id="tag-${tag}"><label for="tag-${tag}">` + firstLetterUppercase(tag) + `</label><br>`
    }
    tagsHtml += `</section>`;
    return tagsHtml;
}