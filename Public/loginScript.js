$(function () {
    $('#showPassword').on('click', function() {
        showPassword();
    });
    
    checkFormValidity();
    $('input').on('input', checkFormValidity);
    $('#submitBtn').on('click', async function(){
        if(await validCheck()){
            window.location.href = '/'
        }
    });
});


function checkFormValidity() {
    let isValid = true;
    $('input[required]').each(function() {
        if ($(this).val().trim() == '') {
            isValid = false;
        }
    });
    $('#submitBtn').prop('disabled', !isValid);
}

function validCheck(){
    clearErrors();
    const username = $('#username');
    const password = $('#password');

    if(!validUsername(username.val())){
        showError('username', 'invalid username');
        return false;;
    }

    const user = {username:username.val(), password:password.val()};
    return new Promise(function(resolve){
        $.ajax({
            type: "post",
            url: "/login",
            data: user,
            success: function(){
                resolve(true);
            },
            error: function(response){
                showError('status', response.responseJSON.msg);
                resolve(false);
            }
        });
    });
}

function validUsername(username){
    const letter = /[a-z]/;

    if(username.length < 4 || username.length > 20 || !letter.test(username)){
        return false;

    }
    return true;
}


function showError(element, msg){
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