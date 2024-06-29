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

document.getElementById('submitBtn').onclick = validCheck

let flag = 0;

async function validCheck(){
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    flag=0;
    validEmail(email.value)

    if(flag != 0)
        return;

    body = {email: email.value, password: password.value};
    const res = await fetch('/login',{
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-type": "application/json" }
    });

    console.log(await res.json());
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