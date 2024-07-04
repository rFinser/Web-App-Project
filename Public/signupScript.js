document.addEventListener('DOMContentLoaded', ()=>{
    const inputs = document.querySelectorAll('input[required]');
    const submitButton = document.getElementById('submitBtn');
  
    function checkInputs() {
      let allFilled = true;

      inputs.forEach(input => {
        if(input.value == '')
            allFilled = false;
      });
      submitButton.disabled = !allFilled;
    }
  
    inputs.forEach(input => {
      input.addEventListener('input', checkInputs);
    });

    checkInputs();
    
});

document.getElementById('submitBtn').onclick = validCheck;

let flag = 0;

async function validCheck(){
    document.getElementById('statusTooltip').innerText = ""

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const day = document.getElementById('day');
    const month = document.getElementById('month');
    const year = document.getElementById('year');

    const birthdate= {day:day.value,month:month.value,year:year.value};
    
    flag = 0;
    validUsername(username.value);
    validEmail(email.value);
    validPassword(password.value);

    if(flag!=0){
        return;
    }
    const body = {username:username.value, birthdate:birthdate, email:email.value, password:password.value};
    const res = await fetch('/signup', {
        method : "post",
        body: JSON.stringify(body),
        headers: { "Content-type": "application/json" }
    });
    
    const data = (await res.json())
    
    validStatus(data.status)
}
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
        document.getElementById('passwordTooltip').innerText = "invalid password, password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter and one number";
        flag--;
        return;
    }
    document.getElementById('passwordTooltip').innerText = "";
}

function validEmail(email){

    const emailV = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if(!emailV.test(email)){
        document.getElementById('emailTooltip').innerText = "invalid email";
        flag--;
        return; 
    }
    document.getElementById('emailTooltip').innerText = ""
}

function validUsername(username){
    const letter = /[a-z]/;

    if(username.length < 4 || username.length > 20 || !letter.test(username)){
        document.getElementById('usernameTooltip').innerText = "invalid username, username can be 4 to 20 characters long and must contain at least one letter";
        flag--;
        return;
    }
    document.getElementById('usernameTooltip').innerText = "";
}