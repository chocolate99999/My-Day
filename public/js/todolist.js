console.clear();

console.log('== Start todolist.js  ==');

// 攝氏溫度資料變數
let tempC, tempMaxC, tempMinC, feelsLikeC;

let renderCity        = document.querySelector(".city");
let renderDescription = document.querySelector(".description");
let renderTemp        = document.querySelector(".temp");
let renderTempMax     = document.querySelector(".temp-max");
let renderTempMin     = document.querySelector(".temp-min");
let renderFeelsLike   = document.querySelector(".feels-like");
let renderIcon        = document.querySelector("img");
let signC             = document.getElementById("celsius");
let signF             = document.getElementById("fahrenheit");

// console.log(temp);

/* 將 API 轉換成 JSON 格式 */
async function getApiData(apiUrl){
    let response = await fetch(apiUrl);
    let result   = await response.json();
    return result;
}

/* 取得使用者當前位置 */
async function getLocation(position){
    let coordinate = {
        longitude: position.coords.longitude,
        latitude : position.coords.latitude
    }
    // console.log(coordinate);

    const myKey = '3db9224307a74d71d44bf8ff2539d163';    
    let lon     = coordinate.longitude;
    let lat     = coordinate.latitude;
    let units   = 'metric';  // 攝氏
    // let units = 'imperial'; // 華氏

    // lang 格式要符合 api 文件，例如: zh-TW => zh_tw
    let lang = navigator.language;
    lang     = lang.toLowerCase();
    lang     = lang.replace('-', '_');

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myKey}&units=${units}&lang=${lang}`;
    
    /* 取得目前的天氣資料 */
    const dataJson = await getApiData(url);
    const {sys, name, main, weather} = dataJson;
    let weatherData = {
        country    : sys.country,
        city       : name,
        temp       : main.temp,
        temp_max   : main.temp_max,
        temp_min   : main.temp_min,
        feels_like : main.feels_like,
        description: weather[0].description,
        icon       : weather[0].icon  
    }
    
    // [全域變數] 處理函數 convertToF(celsius) 的 對照組資料(攝氏溫度)
    tempC      = weatherData.temp;
    tempMaxC   = weatherData.temp_max;
    tempMinC   = weatherData.temp_min;
    feelsLikeC = weatherData.feels_like;
    
    // console.log(typeof(temp)); // number

    // 渲染天氣數據資料
    renderCity.textContent        = weatherData.city;
    renderDescription.textContent = weatherData.description;
    renderTemp.textContent        = parseInt(weatherData.temp); 
    renderTempMax.textContent     = parseInt(weatherData.temp_max);
    renderTempMin.textContent     = parseInt(weatherData.temp_min);
    renderFeelsLike.textContent   = parseInt(weatherData.feels_like);

    // 實際要渲染的天氣圖片
    let iconImg = [      
        {icon: "01d", description: "clear sky"       , iconUrl: "../img/icon/weather/day.svg"              },
        {icon: "01n", description: "clear sky"       , iconUrl: "../img/icon/weather/night.svg"            },
        {icon: "02d", description: "few clouds"      , iconUrl: "../img/icon/weather/cloudy-day-1.svg"     },
        {icon: "02n", description: "few clouds"      , iconUrl: "../img/icon/weather/cloudy-night-1.svg"   },
        {icon: "03d", description: "scattered clouds", iconUrl: "../img/icon/weather/cloudy.svg"           },
        {icon: "03n", description: "scattered clouds", iconUrl: "../img/icon/weather/cloudy.svg"           },
        {icon: "04d", description: "broken clouds"   , iconUrl: "../img/icon/weather/cloudy.svg"           },
        {icon: "04n", description: "broken clouds"   , iconUrl: "../img/icon/weather/cloudy.svg"           },
        {icon: "09d", description: "shower rain"     , iconUrl: "../img/icon/weather/rainy-1.svg"          },
        {icon: "09n", description: "shower rain"     , iconUrl: "../img/icon/weather/rainy-1.svg"          },
        {icon: "10d", description: "rain"            , iconUrl: "../img/icon/weather/rainy-6.svg"          },
        {icon: "10n", description: "rain"            , iconUrl: "../img/icon/weather/rainy-6.svg"          },
        {icon: "11d", description: "thunderstorm"    , iconUrl: "../img/icon/weather/thunder.svg"          },
        {icon: "11n", description: "thunderstorm"    , iconUrl: "../img/icon/weather/thunder.svg"          },
        {icon: "13d", description: "snow"            , iconUrl: "../img/icon/weather/icons8-light-snow.gif"},
        {icon: "13n", description: "snow"            , iconUrl: "../img/icon/weather/icons8-light-snow.gif"},
        {icon: "50d", description: "mist"         , iconUrl: "../img/icon/weather/icons8-haze.gif"},
        {icon: "50n", description: "mist"         , iconUrl: "../img/icon/weather/icons8-fog.gif"}
    ]

    // 找出跟 目前天氣 相對應的 天氣圖片，並且渲染
    for (let i = 0; i < iconImg.length; i++){
        
        if(weatherData.icon === iconImg[i].icon){

            let src   = document.createAttribute("src"); // img 設置 src 屬性
            src.value = iconImg[i].iconUrl;
            renderIcon.setAttributeNode(src);

            let alt   = document.createAttribute("alt"); // img 設置 alt 屬性
            alt.value = iconImg[i].description;
            renderIcon.setAttributeNode(alt);
            // console.log(renderIcon);
        }
    }   
}

navigator.geolocation.getCurrentPosition(getLocation);

// 溫度換算 : 攝氏 => 華氏 [實驗組]
function convertToF(celsius) {
    let fahrenheit = celsius * 9 / 5 + 32;
    return fahrenheit;
}

// 溫度換算 : 華氏 => 攝氏 [對照組]
function convertToC(fahrenheit) {
    let celsius = fahrenheit;
    return celsius;
}

// 點擊 ℉符號 換算後渲染
function switchToF() {

    // 重複點擊 ℉ 不作效果
    if(signF.classList.contains("active")){
        return;
    } 

    let tempF      = convertToF(tempC);
    let tempMaxF   = convertToF(tempMaxC);
    let tempMinF   = convertToF(tempMinC);
    let feelsLikeF = convertToF(feelsLikeC);

    renderTemp.textContent      = parseInt(tempF);
    renderTempMax.textContent   = parseInt(tempMaxF);
    renderTempMin.textContent   = parseInt(tempMinF);
    renderFeelsLike.textContent = parseInt(feelsLikeF);

    signF.classList.add("active");
    signC.classList.remove("active");         
}

// 點擊 ℃符號 換算後渲染
function switchToC() {

    // 重複點擊 ℃ 不作效果
    if(signC.classList.contains("active")){
        return;
    }

    renderTemp.textContent      = parseInt(tempC);
    renderTempMax.textContent   = parseInt(tempMaxC);
    renderTempMin.textContent   = parseInt(tempMinC);
    renderFeelsLike.textContent = parseInt(feelsLikeC);
    
    signC.classList.add("active");
    signF.classList.remove("active");   
}

// 產生 1 筆待辦事項
async function createTodoItemCallBack(){

    // 從 input 取值 
    let todayPlan = document.querySelector(".todayPlan"); 
    let form      = todayPlan.children[2];
    let todoTime  = form.children[0].value;
    let todoText  = form.children[1].value;

    // input 無輸入值 就 離開函式
    if(todoTime === "" || todoText === ""){
        // swal('請輸入時間及事項'); // https://sweetalert.js.org/guides/ [待處理]
        return;
    }

    // [DOM]新增待辦事項成功與否的訊息
    let warning = document.querySelector(".warning");

    // 如使用者未登入，就不給新增待辦事項
    let Result = await getApiData('/api/user');
    console.log('[DBG] /api/user', Result.data);
    if(Result.data == null){
        warning.textContent = '請先登入，才能新增待辦事項!';
        return; 
    }
        
    // 獲取新增事項的時間
    let dateStringArray = window.location.pathname.split('/');
        dateStringArray = dateStringArray[2].split('-');
    let year    = dateStringArray[0];
    let month   = dateStringArray[1];
    let day     = dateStringArray[2];

    let todoTimeArray = todoTime.split(':');
    let hours         = todoTimeArray[0];
    let minutes       = todoTimeArray[1];
    
    // 獲取待辦事項的數據資料
    let addResult = await AddOneTodoItem(year, month, day, hours, minutes, todoText);
    console.log('[DBG] AddOneTodoItem 結果', addResult);

    if(addResult.error){
        warning.textContent = addResult.message; 
        return;  
    }else{
        warning.textContent = addResult.message;  
    }
       
    // 建立 todo 事項
    createTodoItem(todoTime, todoText);

    // 清除 input 中已輸入的 值
    let inputTime = document.querySelector('[type="time"]');
    let inputText = document.querySelector('[type="text"]');
    inputTime.value = '';
    inputText.value = '';  
}

/* 在 待辦清單 中 新增 待辦事項 */
let addBtn = document.querySelector("form button");
addBtn.addEventListener('click', createTodoItemCallBack);

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

function createTodoItem(todoTime, todoText){

    // 建立 todo 事項
    let todoBox = document.querySelector(".todoBox");
    let todo    = document.createElement("div");
    let timeBox = document.createElement("h1");
    let textBox = document.createElement("h1");
    let time    = document.createTextNode(`${todoTime}`);
    let text    = document.createTextNode(`${todoText}`);

    todo.classList.add("todo");
    timeBox.classList.add("todo-time");
    textBox.classList.add("todo-text");

    timeBox.appendChild(time);
    textBox.appendChild(text);
    todo.appendChild(timeBox);
    todo.appendChild(textBox);
    todoBox.appendChild(todo);

    // todo 事項 功能圖片: 完成 & 刪除  
    let iconTodo = [
        {url: "../img/icon/todoList/check-solid.svg", description: "check"},
        {url: "../img/icon/todoList/trash-solid.svg", description: "trash"},
    ]

    for(let i = 0; i < iconTodo.length; i++){

        // 建立 圖片按鈕 : Check & Trash
        let button = document.createElement("button"); 
        let img    = document.createElement("img"); 
        let type   = document.createAttribute("type"); // button 設置 type 屬性
        let src    = document.createAttribute("src");  // img    設置 src  屬性
        let alt    = document.createAttribute("alt");  // img    設置 alt  屬性

        // 將 Check (button[0])、 Trash (button[1]) 按鈕，各自設置不同的 class 屬性值
        // 注意: 產生 勾勾、垃圾桶 按鈕的同時，須要綁監聽，才能作用到 `每一顆按鈕` !!!
        if(i === 0){  
            button.classList.add("complete"); 
            button.addEventListener('click', e => { // completeBtn
                let todoItem = e.target.parentElement;  
                todoItem.classList.toggle("done");   
            })
        }else{       
            button.classList.add("remove");   
            button.addEventListener('click', e => { // removeBtn
                let todoItem = e.target.parentElement; 

                // console.log('[BDG 306 e.target]: ', e.target);
                // console.log('[BDG 307 todoItem]: ', todoItem);

                let todoItemTime = todoItem.childNodes[0].textContent;
                    todoItemTime = todoItemTime.split(':');                
                let hours        = todoItemTime[0];
                let minutes      = todoItemTime[1];

                let dateStringArray = window.location.pathname.split('/');
                    dateStringArray = dateStringArray[2].split('-');
                let year            = dateStringArray[0];
                let month           = dateStringArray[1];
                let day             = dateStringArray[2];

                DeleteTodoItemCallBack(year, month, day, hours, minutes);

                // 刪除 todoItem 出現的動態效果
                todoItem.style.animation = 'scaleDown 0.3s forwards'; 

                // 動畫結束後，再移除該筆 todoItem
                todoItem.addEventListener('animationend', () => {
                    todoItem.remove();
                })   
            })
        }

        // 設定 圖片按鈕 屬性值(連結、文字敘述、按鈕類型)
        src.value  = iconTodo[i].url;
        alt.value  = iconTodo[i].description;
        type.value = 'button';
        img.setAttributeNode(src);
        img.setAttributeNode(alt);
        button.setAttributeNode(type);

        // 組合 圖片按鈕 : 將 圖片子節點 加入到 按鈕父節點 
        button.appendChild(img);
        todo.appendChild(button);
    }
}

// [API] 取得當天日期的待辦清單
async function GetDateTodoList(time){
    
    let apiUrl   = '/api/dayPlan/'+ time;
    
    let response = await fetch(apiUrl, 
        {
            method  : 'GET', 
            headers : {'Content-Type': 'application/json'}
        }
    ); 

    let result = await response.json();
    return result;      
}

// 取得當天日期的待辦清單
async function GetTimeTodoList(){

    let dateStringArray = window.location.pathname.split('/');
        dateStringArray = dateStringArray[2];
    console.log('[DBG] dateStringArray 結果', dateStringArray);
    
    let result = await GetDateTodoList(dateStringArray);
    console.log("GetTimeTodoList 結果: ", result);

    let warning = document.querySelector(".todoBox .warning");

    if(result.error){
        warning.textContent = result.message;
        return; 
    }

    if(result.data.length === 0)
        return; 
    else{
        let dateTodoList = result.data;
        for(let i = 0; i < dateTodoList.length; i++){
            let hours    = dateTodoList[i].todoList.hours;
            let minutes  = dateTodoList[i].todoList.minutes;
            let todoTime = hours + ':' + minutes;
            let todoItem = dateTodoList[i].todoList.todoItem;
            createTodoItem(todoTime, todoItem);
        }     
    }     
}
GetTimeTodoList();

// [API] 刪除 1 筆待辦事項
async function DeleteOneTodoItem(year, month, day, hours, minutes){
    let apiUrl   = '/api/dayPlan';     
    let response = await fetch(apiUrl, 
        {
            method  : 'DELETE',
            body    : JSON.stringify({               
                "year" : year,
                "month": month,
                "day"  : day,
                "todoList":  
                    {
                        "hours"   : hours,
                        "minutes" : minutes,
                    }
            }),           
            headers : {'Content-Type': 'application/json'}
        }
    ); 

    let result = await response.json();
    return result;      
}

// 刪除 1 筆待辦事項
async function DeleteTodoItemCallBack(year, month, day, hours, minutes){

    let deleteResult = await DeleteOneTodoItem(year, month, day, hours, minutes);

    let warning = document.querySelector(".todoBox .warning");

    if(deleteResult.ok){
        // console.log("[DBG 425] 已有登入，具有刪除功能! ", deleteResult);
        warning.textContent = deleteResult.message;
    }else{
        // 如使用者未登入，就不給刪除待辦事項
        // console.log("[DBG 429] 尚未登入，無法操作! ", deleteResult);
        warning.textContent = deleteResult.message;
        return; 
    }   
}