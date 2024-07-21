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

            $('#password').html(data.u_password)
            
        }
    });
})


$('#updateUser').on('click',function(){
    $('#user-data').find('#user-data-list').hide();
    $('.btn').hide();
    $('#user-data').append(updateUser());
    $.ajax({
        type: "post",
        url: "/userData",
        success: function (user){
            console.log(user);
            $('#u_username').val(user.u_username);
            $('#u_email').val(user.u_email);
            $('#u_day').val(user.u_birthdate.day);
            $('#u_month').val(user.u_birthdate.month);
            $('#u_year').val(user.u_birthdate.year);
            $('#u_password').val(user.u_password);
            $('#u_cnf-password').val(user.u_password);

        }
    });
})
$('#user-data').delegate('#showPassword', 'click', function(){
    if($('#showPassword').prop('checked')){
        $('#u_password').attr('type','text');
        $('#u_cnf-password').attr('type','text');
    }
    else{
        $('#u_password').attr('type','password');
        $('#u_cnf-password').attr('type','password');
    }
})

$('#user-data').delegate('#cancel', 'click', function(){
    $('#user-data').find('#user-data-list').show();
    $('.btn').show();
    $('#user-data').find('#updateUser').remove();
})
$('#user-data').delegate('#save', 'click', function(){

    $('.tooltip').empty();
    const username = $('#u_username').val();

    const  day = $('#day').val()
    const  month = $('#month').val()
    const  year = $('#day').val()
    const birthdate = {day,month,year}

    const email = $('#u_email').val();
    const password = $('#u_password').val();
    const cnfPassword = $('#u_cnf-password').val();

    let flag = true;

    if(!validUsername(username)){
        $('#usernameTooltip').html('invalid username, username can be 4 to 20 characters long and must contain at least one letter');
        flag = false;
    }

    if(!validEmail(email)){
        $('#emailTooltip').html('invalid email');
        flag = false;
    }

    if(!validDate(birthdate)){
        $('#birthdateTooltip').html('invalid date');
        flag = false;
    }

    if(!validPassword(password)){
        $('#passwordTooltip').html('invalid password, password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter and one number');
        flag = false;
    }
    else{
        if(!validCnfPassword(password, cnfPassword)){
            $('#passwordTooltip').html("passwords don't match");
            $('#cnfPasswordTooltip').html("passwords don't match");
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
    return `
    <div id="updateUser">
        <p id="statusTooltip"  class="tooltip"></p>
        <label for="u_username">Username:</label>
        <input id="u_username"/>
        <p id="usernameTooltip" class="tooltip"></p></br> 
        <label for="u_email">Eamil:</label>
        <input id="u_email"/>
        <p id="emailTooltip"></p></br>
        <label for="u_birthday">Birthday:</label>`
        +birthdateScheme()+`
        <p id="birthdateTooltip"  class="tooltip"></p></br>
        <label for="u_password">password:</label>
        <input type="password" id="u_password"/>
        <p id="passwordTooltip"  class="tooltip"></p></br>
        <label for="u_cnf-password">confirm password:</label>
        <input type="password" id="u_cnf-password"/>
        <p id="cnfPasswordTooltip"  class="tooltip" hidden></p></br>
        <input type="checkbox" id="showPassword"/><label for="showPassword">show password</label></br>
        <button id="save">save</button>
        <button id="cancel">cancel</button>
    </div>
    `
}

function birthdateScheme(){
    return `
    <ul id="date">
        <il>                        
            <select name="day" id="day">
                <option value="">Day</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
            </select>
        </il>
        <il>
            <select name="month" id="month">
                <option value="">Month</option>
                <option value="01">Jan</option>
                <option value="02">Feb</option>
                <option value="03">Mar</option>
                <option value="04">Apr</option>
                <option value="05">May</option>
                <option value="06">Jun</option>
                <option value="07">Jul</option>
                <option value="08">Aug</option>
                <option value="09">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
            </select>
        </il>
        <il>
            <select name="year" id="year">
                <option value="">Year</option>
                <option value="2012">2012</option>
                <option value="2011">2011</option>
                <option value="2010">2010</option>
                <option value="2009">2009</option>
                <option value="2008">2008</option>
                <option value="2007">2007</option>
                <option value="2006">2006</option>
                <option value="2005">2005</option>
                <option value="2004">2004</option>
                <option value="2003">2003</option>
                <option value="2002">2002</option>
                <option value="2001">2001</option>
                <option value="2000">2000</option>
                <option value="1999">1999</option>
                <option value="1998">1998</option>
                <option value="1997">1997</option>
                <option value="1996">1996</option>
                <option value="1995">1995</option>
                <option value="1994">1994</option>
                <option value="1993">1993</option>
                <option value="1992">1992</option>
                <option value="1991">1991</option>
                <option value="1990">1990</option>
                <option value="1989">1989</option>
                <option value="1988">1988</option>
                <option value="1987">1987</option>
                <option value="1986">1986</option>
                <option value="1985">1985</option>
                <option value="1984">1984</option>
                <option value="1983">1983</option>
                <option value="1982">1982</option>
                <option value="1981">1981</option>
                <option value="1980">1980</option>
                <option value="1979">1979</option>
                <option value="1978">1978</option>
                <option value="1977">1977</option>
                <option value="1976">1976</option>
                <option value="1975">1975</option>
                <option value="1974">1974</option>
                <option value="1973">1973</option>
                <option value="1972">1972</option>
                <option value="1971">1971</option>
                <option value="1970">1970</option>
                <option value="1969">1969</option>
                <option value="1968">1968</option>
                <option value="1967">1967</option>
                <option value="1966">1966</option>
                <option value="1965">1965</option>
                <option value="1964">1964</option>
                <option value="1963">1963</option>
                <option value="1962">1962</option>
                <option value="1961">1961</option>
                <option value="1960">1960</option>
                <option value="1959">1959</option>
                <option value="1958">1958</option>
                <option value="1957">1957</option>
                <option value="1956">1956</option>
                <option value="1955">1955</option>
                <option value="1954">1954</option>
                <option value="1953">1953</option>
                <option value="1952">1952</option>
                <option value="1951">1951</option>
                <option value="1950">1950</option>
                <option value="1949">1949</option>
                <option value="1948">1948</option>
                <option value="1947">1947</option>
                <option value="1946">1946</option>
                <option value="1945">1945</option>
                <option value="1944">1944</option>
                <option value="1943">1943</option>
                <option value="1942">1942</option>
                <option value="1941">1941</option>
                <option value="1940">1940</option>
                <option value="1939">1939</option>
                <option value="1938">1938</option>
                <option value="1937">1937</option>
                <option value="1936">1936</option>
                <option value="1935">1935</option>
                <option value="1934">1934</option>
                <option value="1933">1933</option>
                <option value="1932">1932</option>
                <option value="1931">1931</option>
                <option value="1930">1930</option>
            </select>
        </il>
    </ul> 
    `
}