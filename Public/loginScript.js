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

let flag1 = 0;
let flag2 = 0;

async function validCheck(){

    document.getElementById('statusTooltip').innerText = "";

    const username = document.getElementById('username');
    const password = document.getElementById('password');

    flag1=0;
    validUsername(username.value)

    if(flag1 != 0)
        return;

    body = {username: username.value, password: password.value};

    const res = await fetch('/login',{
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-type": "application/json" }
    });

    const data = await res.json()
    validStatus(data.status)
}

function validStatus(status){
    switch(status){
        case 1:
            flag2 = 1
            window.location.href="/";
            break;
        case -1:
            document.getElementById('statusTooltip').innerText = "This username doesn't have account";
            break;
        case -2:
            document.getElementById('statusTooltip').innerText = "The username and password don't match";
            break;
        default:
            document.getElementById('statusTooltip').innerText = "";
    }
}

function validUsername(username){
    const letter = /[a-z]/;

    if(username.length < 4 || username.length > 20 || !letter.test(username)){
        document.getElementById('usernameTooltip').innerText = "invalid username, username can be 4 to 20 characters long and must contain at least one letter";
        flag1--;
        return;
    }
    document.getElementById('usernameTooltip').innerText = "";
}