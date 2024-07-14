$(document).ready(function(){
    $.ajax({
        type: "GET",
        url: "/userData",
        success: function (data) {
            
            $('#username').html(data.u_username)
            $('#email').html(data.u_email)
            const day = data.u_birthdate.day
            const month = data.u_birthdate.month
            const year = data.u_birthdate.year

            $('#birthday').html(day+'/'+month+'/'+year)

            $('#password').html(data.u_password)
            
        }
    });
})