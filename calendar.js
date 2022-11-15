let tbody = document.querySelector("tbody");  
    
let calendar = {  
  year: null,
  month: null,

  // 日的陣列
  dayTable: null,

  /* 3.生成日曆 */
  // from => table 表格，date => 要建立的日期
  createCalendar(form, date) {
    let self = this;

    // 獲取此時的年份
    year = self.year;
    year = date.getFullYear();

    // 獲取此時的月份
    month = self.month;
    month = date.getMonth();

    // 年份月份寫入日曆
    form.getElementsByTagName("th")[1].innerText = year + "年" + (month + 1) + "月";

    // 獲取本月的天數
    let MonthDayCount = self.getDateLen(year, month);            
    // console.log("============", MonthDayCount, "============"); // 31 
    let firstDay      = self.getFirstDay(year, month);
    // console.log("============", firstDay, "============"); // 5

    // 一個月的日期填滿格子最多會有 6 週
    for (let week = 1; week <= 6; week++){  

      let tr = document.createElement('tr');

      // 設置 class 屬性
      tr.classList.add('day');

      // 設置 data-* 屬性
      let dataset     = document.createAttribute("dataset");
      tr.dataset.week = `week-${[week]}`;

      // 一週 7 天，7 個 td
      for (let day = 1; day <= 7; day++) {

        let td     = document.createElement("td");
        let a      = document.createElement("a"); 

        // 設置 href 屬性
        let href   = document.createAttribute("href");     
        href.value = 'todolist.html';
        a.setAttributeNode(href); 

        // 父節點 加入 子節點
        td.appendChild(a); 
        tr.appendChild(td); 
      }

      tbody.appendChild(tr);
    }
    
    // date 表示日期，迴圈將每一天的天數寫入到日曆中
    for (let date = 1; date <= MonthDayCount; date++){  

      let aTags = document.getElementsByTagName("a");

      aTags[firstDay + date - 1].textContent = date;

      let nowDate = new Date();

      if (
        date  === nowDate.getDate() &&
        month === nowDate.getMonth() &&
        year  === nowDate.getFullYear()
      ){
        // 將 當天 元素的 id 設定為 today
        aTags[firstDay + date - 1].id = 'today';
      }
    }

    // 一個月只有 5 週時，刪除多餘的 最後1週(tr)
    let extraTr = tbody.lastChild;  
    let extraTd = extraTr.firstChild;
    let extraA  = extraTd.firstChild;
    
    // 取出最後1週第1天的文字
    let extraTrFirstA = extraA.textContent;    
    
    // 若最後1週第1天 無日期(空字串)，則刪除最後1週
    if(extraTrFirstA === ''){  
      extraTr.remove();
    }

    // 處理 無日期(空字串) 的格子，使其點擊無法連結(移除它的 a標籤)
    let aTags = document.querySelectorAll("a");
    for (let i = 0; i < aTags.length; i++){

      if(aTags[i].textContent === ''){  
        aTags[i].remove();
      }      
    } 
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
    
    let oldTrs = form.querySelectorAll(".day");

    for (let i = 0; i < oldTrs.length; i++) {

      oldTrs[i].remove();

      // console.log(oldTrs[i]);  // 印出7月份的日期資料  ===============[延伸]===============
    }
    // console.log(tbody);        // tr 印出8月份的日期資料
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
    // deleteExtraTr(form); 
  },
};

window.onload = function () {
  let form = document.getElementById("calendar");
  // 通過日曆物件去呼叫自身的 init 方法
  calendar.init(form);
};
// console.log(calendar);


