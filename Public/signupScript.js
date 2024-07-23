$(function () {
    $('#showPassword').on('click', function() {
        showPassword();
    });
    
    checkFormValidity();
    $('input, select').on('input change', checkFormValidity);
    $('#submitBtn').on('click', async function(){
        console.log(validCheck())
        if(await validCheck()){
            window.location.href = '/'
        }
    });
});


function checkFormValidity() {
    let isValid = true;
    $('input[required]').each(function() {
        if ($(this).val().trim() === '') {
            isValid = false;
        }
    });
    $('select[required]').each(function() {
        if ($(this).val() === '') {
            isValid = false;
        }
    });
    $('#submitBtn').prop('disabled', !isValid);
}

function validCheck(){
    clearErrors();
    const username = $('#username');
    const email = $('#email');
    const password = $('#password');

    const day = $('#day');
    const month = $('#month');
    const year = $('#year');

    if(!validDate(day.val(), month.val(), year.val())){

        showError('birthdate', 'invalid date');
        $('.BirthdateTitle').addClass('errorLabel');
        $('.dmy').addClass('errorInput');
        return false;;
    }
    if(!validUsername(username.val())){
        showError('username', 'invalid username, username can be 4 to 20 characters long and must contain at least one letter');
        return false;;
    }
    if(!validEmail(email.val())){
        showError('email', 'invalid email');
        return false;;
    }
    if(!validPassword(password.val())){
        showError('password', 'invalid password, password must be at least 8 characters and contain uppercase letter, lowercase letter and a number');
        return false;;
    }

    const birthdate= {day:day.val(),month:month.val(),year:year.val()};
    const user = {username:username.val(), birthdate, email:email.val(), password:password.val()};
    return new Promise(function(resolve){
        $.ajax({
            type: "post",
            url: "/signup",
            data: user,
            success: function(response){
                resolve(true);
            },
            error: function(response){
                showError('username', 'username already in use, please try a diffrent one');
                resolve(false);
            }
        });
    });
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

function validDate(day,month,year){
    if(month == 2 && day>28){
        return false;
    }
    else if(['04','06','09','11'].includes(month) && day>30){
        return false;
    }
    return true;
}

function showError(element, msg){
    console.log(element);
    $(`#${element}`).addClass('errorInput');
    $(`label[for="${element}"]`).addClass('errorLabel');
    $(`.${element}-error`).addClass('display-error');
    $(`.${element}-error`).text(msg);
}

function clearErrors(){
    $('.errorInput').removeClass('errorInput');
    $('.errorLabel').removeClass('errorLabel');
    $('.error').removeClass('display-error');
}


function showPassword(){
    const passwordInput = $('#password');
    const showPasswordCheckbox = $('#showPassword');
    if (showPasswordCheckbox.is(':checked')) {
        passwordInput.attr('type', 'text');
    } 
    else {
        passwordInput.attr('type', 'password');
    }
}