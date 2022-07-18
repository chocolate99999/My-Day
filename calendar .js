// let main    = document.createElement('main');      
// let section = document.createElement('section');      
// let table   = document.createElement('table');      
// let thead   = document.createElement('thead');      
let tbody   = document.getElementsByTagName('tbody');  
console.log(tbody);    
let tr      = document.createElement('tr');      
// let th      = document.createElement('th');      
let td      = document.createElement('td');      
let a       = document.createElement('a');
let href    = document.createAttribute('href');  



// 設置 class 屬性
tr.classList.add('day');
// console.log(tr);

// 設置 data-* 屬性
let dataset      = document.createAttribute('dataset');
tr.dataset.week  = 'week-1';
// console.log(tr);      

let calendar = {  
  year: null,
  month: null,

  // 日的陣列
  dayTable: null,

  /* 3.生成日曆 */
  // from => table 表格，date => 要建立的日期
  createCalendar(form, date) {
    let self = this;
    // console.log(self);

    // 獲取此時的年份
    year = self.year;
    year = date.getFullYear();

    // 獲取此時的月份
    month = self.month;
    month = date.getMonth();

    // 年份月份寫入日曆
    form.getElementsByTagName("th")[1].innerText =
      year + "年" + (month + 1) + "月";

    // 獲取本月的天數
    let dataNum  = self.getDateLen(year, month);             // 30  /7=4...2   //28 /7=0  //29/7=4...1
    // console.log("============", dataNum, "============"); // 31 /7=4...3  //若週五、六、日有1號，且當月有31天，則有6週
    let firstDay = self.getFirstDay(year, month);
    // console.log("============", firstDay, "============"); // 5

    // let weekNum;

    // if(dataNum % 7 === 3 && firstDay === 0){
    //   let weekNum = 5
    // }else if(dataNum % 7 === 2 && dataNum === 30)

    for (let week = 1; week <= 6; week++){         // 長度暫填 6
      
      let tr      = document.createElement('tr');

      // 設置 class 屬性
      tr.classList.add('day');

      // 設置 data-* 屬性
      let dataset      = document.createAttribute('dataset');
      tr.dataset.week  = `week-${[week]}`;

      for (let date = 1; date <= dataNum; date++) {
        // console.log("=========", dayTable, "========="); // a

        
        let td      = document.createElement('td');      
        let a       = document.createElement('a');

        // 設置 href 屬性
        let href    = document.createAttribute('href');     
        href.value  = 'todolist.html';
        a.setAttributeNode(href); 

        // 新增文字節點
        let dateText = document.createTextNode(`${date}`);     
        a.appendChild(dateText); 
        // console.log(a);
           
        dayTable[firstDay + date - 1] = dataNum[date];
        a.value     = dayTable[firstDay + date - 1]; 

        let nowDate = new Date();
  
        if (
          date === nowDate.getDate() &&
          month === nowDate.getMonth() &&
          year  === nowDate.getFullYear()
        ) {
          // 將當期元素的 id 設定為 today
          dayTable[firstDay + date - 1].id = "today";
        }    
        
        td.appendChild(a); 
        console.log(td);
      }
      tr.appendChild(td); 
      console.log(tr);

    }

    tbody.appendChild(tr);


    // 迴圈將每一天的天數寫入到日曆中
    // 讓 i 表示日期。
    // for (let i = 1; i <= dataNum; i++) {
    //   // console.log("=========", dayTable, "========="); // a

    //   dayTable[firstDay + i - 1].innerText = i;

    //   let nowDate = new Date();

    //   if (
    //     i === nowDate.getDate() &&
    //     month === nowDate.getMonth() &&
    //     year  === nowDate.getFullYear()
    //   ) {
    //     // 將當期元素的 id 設定為 today
    //     dayTable[firstDay + i - 1].id = "today";
    //   }
    // }
  },

  // 獲取本月份的天數
  getDateLen(year, month) {
    // 獲取下個月的第一天
    let nextMonth = new Date(year, month + 1, 1);

    // console.log(nextMonth.getHours()); // 0

    // 設定下月第一天的小時-1，也就是上個月最後一天的小時數，隨便減去一個值不要超過24小時
    nextMonth.setHours(nextMonth.getHours() - 1);

    // console.log(nextMonth.setHours(-1)); // 1659193200000

    // console.log(nextMonth.getDate()); // 30

    // 獲取此時下個月的日期，就是上個月最後一天
    return nextMonth.getDate();
  },

  // 獲取本月第一天為星期幾
  getFirstDay(year, month) {
    let firstDay = new Date(year, month, 1);
    return firstDay.getDay();
  },

  // 清除日曆資料
  clearCalendar(form) {
    let aTags = form.getElementsByTagName("a");

    for (let i = 0; i < aTags.length; i++) {
      aTags[i].innerHTML = "&nbsp";

      // 清除今天的樣式
      aTags[i].id = "";
    }
  },

  // 初始化函數
  init(form) {
    /* 1.獲取日陣列 */
    dayTable = form.getElementsByTagName("a");
    // console.log(dayTable);

    /* 2.建立日曆，傳入當前時間 */ 
    this.createCalendar(form, new Date());

    let nextMon = form.getElementsByTagName("th")[2];
    let preMon  = form.getElementsByTagName("th")[0];

    preMon.onclick = function () {
      calendar.clearCalendar(form);
      let preDate  = new Date(year, month - 1, 1);
      calendar.createCalendar(form, preDate);
    };

    nextMon.onclick = function () {
      calendar.clearCalendar(form);
      let nextDate  = new Date(year, month + 1, 1);
      calendar.createCalendar(form, nextDate);
    };
  },
};

window.onload = function () {
  let form = document.getElementById("calendar");
  // 通過日曆物件去呼叫自身的init方法
  calendar.init(form);
};
// console.log(calendar);


