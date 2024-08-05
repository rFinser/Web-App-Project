$(async function(){
    $.post("/allUsers", renderUsers)
})


function renderUsers(data){
    for(const user of data.users){
        createUserSchema(user);
    }
}


function createUserSchema(user) {
    const $user = $(`
    <div class="user-container" data-username="${user.u_username}">
        <div class="user-header">
            <h2>${user.u_username}</h2>
            <h3 class="user-role">${user.u_admin ? 'Admin' : 'User'}</h3>
            <button class="toggle-details">▼</button>
        </div>
        <div class="user-details" style="display: none;">
            <p> Email: ${user.u_email}</p>
            <p> Birthday: ${formatDate(user.u_birthdate)}</p>
            <p> Registered: ${formatDate(user.u_registrationDate)}</p>
            <p> Cart items: ${user.u_cart.length}</p>
            <div class="user-actions">
                ${user.u_admin ? '' : '<button class="delete-user">Delete</button>'}
            </div>
        </div>
    </div>
    `);

    $user.find('.toggle-details').on('click', function() {
        $(this).text($(this).text() === '▼' ? '▲' : '▼');
        $user.find('.user-details').slideToggle();
    });

    $user.find(".delete-user").on("click", async function(){
        await deleteUser(user.u_username);
    })

    $("#usersContainer").append($user);
}

function formatDate(date) {
    return `${date.day}/${date.month}/${date.year}`;
}

async function deleteUser(username) {
    $.ajax({
        type: "POST",
        url: `/deleteUser`,
        data: { username },
        success: function() {
            window.location.reload();
        }
    })
}