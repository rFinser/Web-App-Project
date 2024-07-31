$(document).ready(function(){
    $.ajax({
        type: "post",
        url: "/userData",
        success: function (data) {
            $('#username').html(data.u_username)
            $('#email').html(data.u_email)
            const day = data.u_birthdate.day
            const month = data.u_birthdate.month
            const year = data.u_birthdate.year

            $('#birthday').html(day+'/'+month+'/'+year)
            $('#password').html('•'.repeat(data.u_password.length))
            $('#title').html(`<strong>Hello ${data.u_username}<strong><br> Here is your profile`)
        }
    });
})
$('#deleteBtn').on('click',function(){
    document.getElementById('confirmDelete-dialog').showModal();
})

$('#confirm-delete').keyup(function() { 
    if($('#confirm-delete').val() != 'delete user'){
        $('#confirmDeleteBtn').prop('disabled', true);
    }
    else{
        $('#confirmDeleteBtn').prop('disabled', false);
    }
});

$('#confirmDeleteBtn').on('click',function(){
    $.ajax({
        type: "post",
        url: "/deleteUserFromSettings",
        success: function () {
            window.alert('user deleted');
            window.location.href = '/';
        }
    });
});

$('#cancelBtn').on('click',function(){
    $('#confirm-delete').val('');
    document.getElementById('confirmDelete-dialog').close();
})

$('#updateUserBtn').on('click',function(){
    $('#user-data').hide();
    $('.data-btns').hide();
    $('.data-container').append(updateUser());
    $.ajax({
        type: "post",
        url: "/userData",
        success: function (user){
            $('.tooltip').hide();
            $('#u_username').val(user.u_username);
            $('#u_email').val(user.u_email);
            $('#day').val(user.u_birthdate.day);
            $('#month').val(user.u_birthdate.month);
            $('#year').val(user.u_birthdate.year);
            $('#u_password').val(user.u_password);

        }
    });
})
$('.data-container').delegate('#showPassword', 'click', function(){
    if($('#showPassword').prop('checked')){
        $('#u_password').attr('type','text');
        $('#u_cnf-password').attr('type','text');
    }
    else{
        $('#u_password').attr('type','password');
        $('#u_cnf-password').attr('type','password');
    }
})

$('.data-container').delegate('#cancel', 'click', function(){
    $('#user-data').show();
    $('.data-btns').show();
    $('#updateUser').remove();
})
$('.data-container').delegate('#save', 'click', function(){

    $('.tooltip').hide();
    const username = $('#u_username').val();

    const day = $('#day').val()
    const month = $('#month').val()
    const year = $('#yaer').val()
    const birthdate = {day,month,year}

    const email = $('#u_email').val();
    const password = $('#u_password').val();
    const cnfPassword = $('#u_cnf-password').val();

    let flag = true;

    if(!validUsername(username)){
        $('#usernameTooltip').html('invalid username, username can be 4 to 20 characters long and must contain at least one letter');
        $('#usernameTooltip').show();
        flag = false;
    }

    if(!validEmail(email)){
        $('#emailTooltip').html('invalid email');
        $('#emailTooltip').show();
        flag = false;
    }

    if(!validDate(birthdate)){
        $('#birthdateTooltip').html('invalid date');
        $('#birthdateTooltip').show();
        flag = false;
    }

    if(!validPassword(password)){
        $('#passwordTooltip').html('invalid password, password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter and one number');
        $('#passwordTooltip').show();
        flag = false;
    }
    else{
        if(!validCnfPassword(password, cnfPassword)){
            $('#passwordTooltip').html("passwords don't match");
            $('#cnfPasswordTooltip').html("passwords don't match");
            $('#passwordTooltip').show();
            $('#cnfPasswordTooltip').show();
            flag = false;
        }
    }

    if(flag){
        $.ajax({
            type: 'PUT',
            url: '/updateUser',
            data: {username,email,birthdate,password},
            success: function(res){
                if(res.status == 1){
                    window.location.href = '/settings'
                }
                else{
                    $('#statusTooltip').html('usernmae already in use, try a diffrent one')
                    $('#statusTooltip').show();
                }
            }
        });
    }
})

function validStatus(status){
    if(status == 1){
        window.location.href = '/'
    }
    else if (status == -1){
        document.getElementById('statusTooltip').innerText = "username already in use, please try a diffrent username"
    }
    else{
        document.getElementById('statusTooltip').innerText = ""
    }
}
function validPassword(password){
    const lowercaseL = /[a-z]/;
    const uppercaseL = /[A-Z]/;
    const digit = /[0-9]/;

    if(password.length < 8 || !lowercaseL.test(password) || !uppercaseL.test(password) || !digit.test(password)){
        return false;
    }
    return true;
}
function validCnfPassword(password, cnfPassword){
    if(password!=cnfPassword){
        return false;
    }
    return true;
}
function validEmail(email){

    const emailV = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if(!emailV.test(email)){
        return false;
    }
    return true;
}

function validUsername(username){
    const letter = /[a-z]/;

    if(username.length < 4 || username.length > 20 || !letter.test(username)){
        return false;
    }
    return true;
}

function validDate(date){
    if(date.day == '' || date.month == '' || date.year == '')
    {
        return false
    }
    else if(date.month == 2 && date.day>28){
        return false;
    }
    else if(['04','06','09','11'].includes(date.month) && date.day>30){
        return false
    }
    return true
}


function updateUser(){
    const upsateScheme = $('#updateUser-template')
    return upsateScheme.html();
}