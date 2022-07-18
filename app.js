let a1 = document.getElementById("a1");
let item = document.getElementById("item");
let foods = document.getElementById("foods");

// console.log(a1);

a1.addEventListener(
  "click",
  function (e) {
    window.alert("<a>元素的事件監聽程式 1");
    console.log(e.bubbles);
  },
  false
);
// a1.addEventListener('click', function(){
//     window.alert('<a>元素的事件監聽程式 2');
// }, false);
item.addEventListener(
  "click",
  function () {
    window.alert("<li>元素的事件監聽程式");
  },
  true
);
// foods.addEventListener('click', function(){
//     window.alert('<ul>元素的事件監聽程式');
// }, true);

const product = {
  name: "iPhone",
  image: "https://i.imgur.com/b3qRKiI.jpg",
  description:
    "全面創新的三相機系統，身懷萬千本領，卻簡練易用。電池續航力突飛猛進，前所未見。令你大為驚豔的晶片更加碼機器學習技術，並突破智慧型手機所能成就的極限。第一部威力強大，Pro 如其名的 iPhone，全新登場。",
  brand: {
    name: "Apple",
  },
  aggregateRating: {
    ratingValue: "4.6",
    reviewCount: "120",
  },
  offers: {
    priceCurrency: "TWD",
    price: "26,900",
  },
};

const {
  offers, // 屬性名稱 => 變數名稱
  offers: { price },
} = product;

// console.log(offers); //{priceCurrency: 'TWD', price: '26,900'}
// console.log(price); //26,900
