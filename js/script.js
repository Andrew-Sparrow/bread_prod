"use strict";
//показывает бургер-меню
function openNav() {
  document.getElementById("header").style.width = "280px";
}

//скрывает бургер-меню
function closeNav() {
  document.getElementById("header").style.width = "0";
}

//переключает вкладки
function openStatus(evt, status) {
  var i, tabcontent, tablinks;

  // Get all elements with class="formalization__content" and hide them
  tabcontent = document.getElementsByClassName("formalization__content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tab__button" and remove the class "tab__active"
  tablinks = document.getElementsByClassName("tab__button");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" tab__active", "");
  }

  // Show the current tab, and add an "tab__active" class to the button that opened the tab
  document.getElementById(status).style.display = "block";
  evt.currentTarget.className += " tab__active";
}

//Press button by default
document.getElementById("defaultOpen").click();

//Show the map if appropriate radio checked
function show(){
  document.getElementById('pickup-block').style.display ='none';
}

//Hide the map if appropriate radio checked
function notShow(){
  document.getElementById('pickup-block').style.display = 'block';
}

//отображение места на карте в зависимости от выбранного способа доставки
//отображение текста с адресом на карте в зависимости от выбранного способа доставки
function showDiv(element) {
  let pointAddress = document.getElementsByClassName("point__address");
  switch (+element.value) {
    case 0:
      for (let i = 0; i < pointAddress.length; i++) {
        pointAddress[i].style.display = "none";
      }
      document.getElementById('hidden_div0').style.display = 'block';
      myMap.setCenter([55.761345, 37.621936], 16);
      break;
    case 1:
      for (let i = 0; i < pointAddress.length; i++) {
        pointAddress[i].style.display = "none";
      }
      document.getElementById('hidden_div1').style.display = 'block';
      myMap.setCenter([55.647252, 37.541977], 13);
      break;
  }
}

ymaps.ready(init);

var myMap = {};

// Создание карты.
function init(){
  myMap = new ymaps.Map('map', {
    center: [55.761345, 37.621936],
    zoom: 16,
    controls: []
  }, {
    searchControlProvider: 'yandex#search'
  });

  //координата на карте
  let myPlacemarkKuz = new ymaps.Placemark([55.762054, 37.620851], {
    hintContent: 'Хлебомолы'
  }, {
    // Опции.
    // Необходимо указать данный тип макета.
    iconLayout: 'default#image',
    // Своё изображение иконки метки.
    iconImageHref: 'img/mark.png',
    // Размеры метки.
    iconImageSize: [36, 45],
    // Смещение левого верхнего угла иконки относительно
    // её "ножки" (точки привязки).
    iconImageOffset: [-5, -38]
  });

//координата на карте
  let myPlacemarkBut = new ymaps.Placemark([55.648214, 37.540847], {
    hintContent: 'Хлебомолы'
  }, {
    // Опции.
    // Необходимо указать данный тип макета.
    iconLayout: 'default#image',
    // Своё изображение иконки метки.
    iconImageHref: 'img/mark.png',
    // Размеры метки.
    iconImageSize: [36, 45],
    // Смещение левого верхнего угла иконки относительно
    // её "ножки" (точки привязки).
    iconImageOffset: [-5, -38]
  });

  myMap.geoObjects
    .add(myPlacemarkKuz)
    .add(myPlacemarkBut);
}

//изменение способа доставки в карточке заказа, в соответствии с выбранным в блоке «Способ доставки» вариантом
function getDelivery(id) {
  var x = document.getElementById("order-name");

  switch (id) {
    case "delivery-courier":
      x.innerHTML = document.getElementById("delivery-courier").innerHTML;
      break;
    case "delivery-transport":
      x.innerHTML = document.getElementById("delivery-transport").innerHTML;
      break;
    case "delivery-pickup":
      x.innerHTML = document.getElementById("delivery-pickup").innerHTML;
      break;
  }
}

//изменение цены доставки в карточке заказа, в соответствии с выбранным в блоке «Способ доставки» вариантом
let getDeliveryPrice = function(id) {
  var deliveryPrice = document.getElementById("order-delivery-price");

  switch (id) {
    case "delivery-courier-price":
      deliveryPrice.innerHTML = document.getElementById("delivery-courier-price").innerHTML;
      break;
    case "delivery-transport-price":
      deliveryPrice.innerHTML = document.getElementById("delivery-transport-price").innerHTML;
      break;
    case "delivery-pickup-price":
      deliveryPrice.innerHTML = document.getElementById("delivery-pickup-price").innerHTML;
      break;
  }
  return Number(deliveryPrice.innerHTML);
};

//форматирование числа с разделителем тысяч
let numberFormat = function(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

//форматирование числа, удаление разделителя тысяч
let numberFormatWithoutSpace = function(str) {
  return str.replace(/\s/g, '');
};

//список цен товаров
let listPrice = document.getElementsByClassName("order__cost");

// подсчет суммы товаров
let calculateGoods = function () {
  let sumGoodsPrice = 0;

  Array.prototype.forEach.call(listPrice, function (item) {
    sumGoodsPrice += Number(item.innerHTML)
  });

  return sumGoodsPrice;
};

//подсчет скидки
let getDiscount = function (sum = calculateGoods()) {
  return Math.floor(sum * 0.05);
};

document.getElementById("order-discount").innerHTML = getDiscount();

//подсчет суммы без учета доставки
let getSum = function() {
  let sum = calculateGoods() - getDiscount();
  return Math.ceil(sum);
};

document.getElementById("order-sum").innerHTML = numberFormat(getSum());
document.getElementById("order-sum").innerHTML = numberFormat(getSum());

//подсчет итоговой суммы с учетом доставки
let getTotal = function (id) {
  let total = document.getElementById("order-total");
  total.innerHTML = getSum() + getDeliveryPrice();
  let totalHeader = document.getElementById("sum-header");

  switch (id) {
    case "delivery-courier-price":
      total.innerHTML = getSum() + getDeliveryPrice();
      totalHeader.innerHTML = getSum() + getDeliveryPrice();

      //форматируем числа с разделителями тысяч
      total.innerHTML = numberFormat(total.innerHTML);
      totalHeader.innerHTML = numberFormat(totalHeader.innerHTML);
      break;
    case "delivery-transport-price":
      total.innerHTML = getSum() + getDeliveryPrice();
      totalHeader.innerHTML = getSum() + getDeliveryPrice();

      //форматируем числа с разделителями тысяч
      total.innerHTML = numberFormat(total.innerHTML);
      totalHeader.innerHTML = numberFormat(totalHeader.innerHTML);
      break;
    case "delivery-pickup-price":
      total.innerHTML = getSum() + getDeliveryPrice();
      totalHeader.innerHTML = getSum() + getDeliveryPrice();

      //форматируем числа с разделителями тысяч
      total.innerHTML = numberFormat(total.innerHTML);
      totalHeader.innerHTML = numberFormat(totalHeader.innerHTML);
      break;
  }
  return total.innerHTML;//Number(total.innerHTML);
};

//делаем клик, что бы произвести расчет в блоке заказа
document.getElementById("radio-pickup").click();

/*проверяем поле - с именем и фамилией, на валидность
* @param obj - DOM объект
*/
function validateName(obj) {
  let nameContact = obj.value;
  let objError = obj.nextElementSibling;  //блок с текстом ошибки
  let regex = RegExp('([ёа-я, -, ЁА-Я]{1,})');

//проверка, что поле не пустое
  if (nameContact == "") {
    objError.innerHTML = "Введите ваше имя(фамилию)";
    addClassName(obj.id, "contacts__name--error");
    objError.style.display = "block";
    obj.focus();
    return false;
  }

//проверка что вводятся буквы, а не цифры(добускаются латинские буквы)
  if(!isNaN(nameContact)) {
    objError.innerHTML = "поле должно содержать только буквы русского алфавита и символ «-» (дефис)";
    addClassName(obj.id, "contacts__name--error");
    objError.style.display = "block";
    obj.focus();
    return false;
  }

//проверка на кирилицу
  if(!regex.test(nameContact)){
    objError.innerHTML = "Поле должно содержать только буквы русского алфавита";
    addClassName(obj.id, "contacts__name--error");
    objError.style.display = "block";
    obj.focus();
    return false;
  }

  let arr, nameClassError;
  arr = obj.className.split(" ");
  nameClassError = 'contacts__name--error';

//если все проверки успешны, то удаляем класс сигнализирующей об ошибке в input'е
//подобный вид проверка сделан, что бы код работал в IE9
  if (arr.indexOf(nameClassError) != -1) {
    deleteClass(obj.id, 'contacts__name--error');
    objError.style.display = "none";
  }

  return true;
}

/*
* добавляет имя к классу, работает в IE9
* @param {string} id - id елемента к которому надо добавить класс
* @param {string} nameClass - название добавляемого класса
*/
function addClassName(id, nameClass) {
  var element, arr;
  element = document.getElementById(id);
  arr = element.className.split(" ");

  if (arr.indexOf(nameClass) == -1) {
    element.className += " " + nameClass;
  }
}

/*
* удаляет класс у элемента, работает в IE9
* @param {string} id - id елемента у которого надо удалить класс
* @param {string} classForDelete - название удаляемого класса
*/
function deleteClass(id, classForDelete) {
  var id = id;
  var classForDelete = classForDelete;
  var regex = new RegExp(classForDelete );

  var element = document.getElementById(id);

  element.className = element.className.replace(regex, "");
}

document.getElementById('phone').addEventListener('input', function (e) {
  var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
  e.target.value =!x[1] ? x[1] : ' ' + x[1] + ' ' + x[2] + ' ' + (x[3] ? ' ' + x[3] : '') + (x[4] ? '-' + x[4] : '');
});

//удаляет HTML теги из введенного в поле текста
function sanitizeHTML(obj) {
  obj.value = obj.value.replace(/(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/gim, "");
}
