console.clear();

console.log('== Start member.js  ==');

/* 隱藏或顯示 登入、註冊狀態、預訂日期區塊 */
function change(state){
    
    let shadow          = document.querySelector('section.shadow');
    let logInBox        = document.querySelector('section.login');
    let registerBox     = document.querySelector('section.register');
    let scheduleBox     = document.querySelector('section.schedule');
    
    if(state === "login"){
       
        shadow.style.display       = 'block';
        logInBox.style.display     = 'block';
        registerBox.style.display  = 'none';
    }
    else if(state === "register"){
        
        shadow.style.display       = 'block';
        registerBox.style.display  = 'block';
        logInBox.style.display     = 'none';        
    }
    else if(state === "close"){
        
        shadow.style.display       = 'none';
        logInBox.style.display     = 'none';
        registerBox.style.display  = 'none';
        scheduleBox.style.display  = 'none';              
    }
    else if(state === "schedule"){
        
        shadow.style.display       = 'block';
        scheduleBox.style.display  = 'block';             
    }
    else{
        console.log("error");
    }
}

/* [Onclick] 登入 */
function login(){

    let apiUrl = '/api/user';
    
    /* 正規表示法 - 驗證 Email 的 Pattern */
    let verifyEmailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;   

    let loginEmail    = document.getElementById('loginEmail').value;
    let loginPassword = document.getElementById('loginPwd').value;
    let loginError    = document.getElementById('loginError');
    
    console.log('[DBG] [login] loginEmail    = ', loginEmail);
    console.log('[DBG] [login] loginPassword = ', loginPassword);
    
    // 確認 Email 是否符合 規格
    if(verifyEmailPattern.test(loginEmail) === false || loginPassword === '' || loginPassword === ' '){

        loginError.textContent = 'Email/密碼 格式錯誤，請重新輸入';        
    }
    else{

        loginError.textContent = '登入中...'; 
  
        fetch(apiUrl,
            {
                method  : 'PATCH',
                body    :  JSON.stringify({

                    'email'    : loginEmail,
                    'password' : loginPassword,

                }),
                headers :{'Content-Type': 'application/json'}
            }
        )
        .then(res => 
            {
                return res.json();
            }
        )
        .then(result => 
            {
                console.log('[DBG] [login] Result = ', result);
                
                if (result.ok) 
                {
                    window.location.reload();                   
                    console.log(result.ok);
                } 
                else if (result.error) 
                {
                    loginError.textContent   = result.message;
                    loginError.style.display = 'block';
                    console.log('error');
                }
            }
        );
    }
}

/* [Onclick] 註冊 */
function register(){

    let apiUrl = '/api/user';
    
    /* 正規表示法 - 驗證 Email 的 Pattern */
    let verifyEmailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;    
    
    let registerName        = document.getElementById('registerName').value;
    let registerEmail       = document.getElementById('registerEmail').value;
    let registerPassword    = document.getElementById('registerPwd').value;
    let registerError       = document.getElementById('registerError');
    let registerSuccess     = document.getElementById('registerSuccess');

    console.log(registerName);
    console.log(registerEmail);
    console.log(registerPassword);
    
    // 確認 Email 是否符合 規格
    if(verifyEmailPattern.test(registerEmail) == false){

        registerError.textContent   = '請輸入正確的Email格式';   
        registerError.style.display = 'block';
    }
    else if(registerPassword === '' || registerPassword === ' ' || registerName === '' || registerName === ' '){

        registerError.textContent   = '請勿輸入空白符號';
        registerError.style.display = 'block';
    }
    else{

        registerError.textContent   = '註冊中... ';
  
        fetch(apiUrl,
            {
                method  : 'POST',
                body    : JSON.stringify({

                    'name'     : registerName,
                    'email'    : registerEmail,
                    'password' : registerPassword,  

                }),           
                headers : {'Content-Type': 'application/json'}
            }
        )
        .then(res => 
            {
                return res.json();
            }
        )
        .then(result => 
            {
                console.log('[DBG] [register] Result = ', result);
                
                if (result.ok) 
                {
                    registerError.style.display   = 'none';
                    registerSuccess.style.display = 'block';

                    // 清除 input 中已輸入的 值
                    registerName  = document.getElementById('registerName');
                    registerEmail = document.getElementById('registerEmail');
                    registerPwd   = document.getElementById('registerPwd');
                    registerName.value  = '';
                    registerEmail.value = '';  
                    registerPwd.value   = '';  
                } 
                else if (result.error) 
                {
                    registerError.textContent     = result.message;
                    registerError.style.display   = 'block';
                    registerSuccess.style.display = 'none';
                }               
            }
        );
    }
}

/* [Onclick] 登出 */
function logout(){ 

    console.log("[DBG] logout Callback Function");
    userLogout();
    window.location.reload();
}

/* 呼叫 api 登出會員 */
function userLogout(){

    let apiUrl = '/api/user';

    console.log("[DBG] userLogout logout api");
    
    fetch(apiUrl,
        {
            method  : 'DELETE',            
            headers : {'Content-Type': 'application/json'}
        }
    )
    .then(res => 
        {
            return res.json();
        }
    )
    .then(result => 
        {
            console.log('[DBG] [LogoutUser] Result = ', result);
        }
    );
}

/* 呼叫 api 取得目前登入狀態，並隱藏顯示 登入/註冊 或 登出系統 */
function getLoginStatus(){

    let apiUrl = '/api/user';
    
    let waitingState = document.querySelector('a.stateSwitch');
    
    fetch(apiUrl,
        {
            method  : 'GET',            
            headers : {'Content-Type': 'application/json'}
        }
    )
    .then(res => 
        {
            return res.json();
        }
    )
    .then(result => 
    {
        console.log("查詢登入狀態:", result);
        if (result.data != null) 
        {
            waitingState.textContent  = '登出系統';
            let onClickName  = `logout()`;
            waitingState.setAttribute('onclick', onClickName);
            console.log('[DBG]', waitingState);
        } 
        else if (result.data == null)
        {
            waitingState.textContent  = '登入/註冊';
            let onClickName  = `change('login')`;
            waitingState.setAttribute('onclick', onClickName);
            console.log('[DBG]', waitingState);
        }
        
        console.log('[DBG] [GetLoginStatus] Result = ', result);
    }); 
}

// [API] 建立新的待辦事項
async function AddOneTodoItem(year, month, day, hours, minutes, todoItem){
    let apiUrl   = '/api/dayPlan';     
    let response = await fetch(apiUrl, 
        {
            method  : 'POST',
            body    : JSON.stringify({               
                "year" : year,
                "month": month,
                "day"  : day,
                "todoList":  
                    {
                        "hours"   : hours,
                        "minutes" : minutes,
                        "todoItem": todoItem
                    }
            }),           
            headers : {'Content-Type': 'application/json'}
        }
    ); 

    let result = await response.json();
    return result;      
}

// 預訂某天某時段 且 建立待辦事項
async function schedule(){

    // 從 input 取值 
    let scheduleDetailData = document.querySelector(".scheduleDetailData"); 
    let scheduleDate       = scheduleDetailData.children[0].value;
    let scheduleTime       = scheduleDetailData.children[1].value;
    todoItem               = scheduleDetailData.children[2].value;

    // input 無輸入值 就 離開函式
    if(scheduleDate === "" || scheduleTime === "" || todoItem === ""){
        // swal('請輸入時間及事項'); // https://sweetalert.js.org/guides/ [待處理]
        return;
    }

    // 獲取新增事項的時間
    let dateStringArray = scheduleDate.split('-'); 
    console.log(dateStringArray);   
    year  = dateStringArray[0];
    month = dateStringArray[1];
    day   = dateStringArray[2];
    
    let timeStringArray = scheduleTime.split(':');
    hours   = timeStringArray[0];
    minutes = timeStringArray[1];
   
    let result = await AddOneTodoItem(year, month, day, hours, minutes, todoItem);
    console.log("[DBG] schedule result):", result);

    if (result.ok){

        // 新增成功就關閉 schedule 對話方塊
        change('close');

        // 清除 input 中已輸入的 值
        let inputData     = document.querySelector(".schedule-date"); 
        let inputTime     = document.querySelector(".schedule-time"); 
        let inputTodoItem = document.querySelector(".schedule-todoItem"); 
        inputData.value     = '';
        inputTime.value     = '';  
        inputTodoItem.value = '';                          
    } 

    return result;    
} 

/* 檢查會員登入狀態 */
function loadDoneCallback(){     
    
    getLoginStatus();
}

// 等待網頁完全讀取完畢 
window.addEventListener('DOMContentLoaded', loadDoneCallback);