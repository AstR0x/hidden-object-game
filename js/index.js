const cvs = document.getElementById('game-window');
const ctx = cvs.getContext('2d');
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

class Img {
  constructor(src, x, y, w, h) {
    this.img = new Image();
    this.img.src = src;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.globalA = 0;
  }

  slowDraw() {
    ctx.globalAlpha = this.globalA;
    if (this.globalA < 1) this.globalA += 0.05;
    if (this.w && this.h) {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    } else {
      ctx.drawImage(this.img, this.x, this.y);
    }
  }

  drawImg() {
    ctx.globalAlpha = 1;
    if (this.w && this.h) {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    } else {
      ctx.drawImage(this.img, this.x, this.y);
    }
  }
}

class ImgOfObject extends Img {
  constructor(src, x, y, w, h, text, textX, textY, angle = 0) {
    super(src, x, y, w, h, text);
    this.text = text;
    this.textX = textX;
    this.textY = textY;
    this.angle = angle;
    this.globalA = 1;
    this.backlight = false;
    this.animateState = false;
    this.count = 0;
  }

  drawImg() {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
  }

  drawAngleImg() {
    ctx.save();
    ctx.translate(this.x + this.h / 2, this.y + this.w / 2);
    ctx.rotate(inRad(this.angle));
    ctx.drawImage(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }

  drawText() {
    ctx.font = `${cvs.width / 55}px AlbertusMedium`;
    ctx.fillText(this.text, this.textX, this.textY);
  }

  checkCoord(event) {
    let rect = cvs.getBoundingClientRect();    // получение
    let x = event.clientX - rect.left;        // координат
    let y = event.clientY - rect.top;
    if (!this.angle) {
      return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
    }
    return this.x - this.angle / 3.8 <= x && x <= this.x + this.w + this.angle / 3.8 && this.y + this.angle / 5 <= y && y <= this.y + this.h - this.angle / 5;
  }

  animate() {
    if (this.count == 0 && this.animateState === false) {
      this.animateState = true;
    } else if (this.count == 30 && this.animateState === true) {
      this.animateState = false;
    }

    if (this.animateState) {
      this.w += 0.4;
      this.h += 0.4;
      this.count++
    } else {
      this.w -= 0.4;
      this.h -= 0.4;
      this.count--;
    }
  }
}

class AnimateImg extends ImgOfObject {
  constructor(src, x, y, w, h, text, textX, textY, angle = 0) {
    super(src, x, y, w, h, text, textX, textY, angle = 0);
    this.animateState = false;
    this.size = 0;
  }

  animate() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#460000';
    ctx.font = `bold ${cvs.width / 40 + this.size}px FrizQuadrataC`;
    if (this.size.toFixed(2) == 0 && this.animateState === false) {
      this.animateState = true;
    } else if (this.size.toFixed(2) == 5 && this.animateState === true) {
      this.animateState = false;
    }
    if (this.animateState === true) {
      this.drawText();
      this.size += 0.1;
      this.textX -= 0.3;
    } else {
      this.drawText();
      this.size -= 0.1;
      this.textX += 0.3;
    }
  }
}

let bg = new Img('img/bg_ho.png', 0, 0, cvs.width, cvs.height);
let bgCover = new Img('img/bg_cover.png', 0, 0, cvs.width, cvs.height);
let bgBlur = new Img('img/bg_blur.png', 0, 0, cvs.width, cvs.height);
let gui = new Img('img/ho_gui.png', cvs.width / 6, cvs.height / 1.2, cvs.width / 1.5, cvs.height / 5.5);
let logo = new Img('img/logo.png', cvs.width / 4, cvs.height / 10, cvs.width / 2, cvs.height / 2.2);

const tutorial = new AnimateImg('img/tutorial.png', cvs.width / 3, cvs.height / 25, cvs.width / 3, cvs.height / 4,
    'Find all the\nhidden objects', cvs.width / 2.35, cvs.height / 5.7);

tutorial.drawText = function () {
  ctx.fillText('Find all the'.toUpperCase(), this.textX - cvs.width / 350, this.textY - this.size / 2);
  ctx.fillText('hidden objects!'.toUpperCase(), this.textX - cvs.width / 35, this.textY + cvs.height / 20 + this.size / 2);
}

let button = new AnimateImg('img/button.png', cvs.width / 2.66, cvs.height / 1.8, cvs.width / 4, cvs.height / 10,
    'Play FREE', cvs.width / 2.15, cvs.height / 1.62);

//first set
let playingCard = new ImgOfObject('img/playing_card.png', cvs.width / 1.25, cvs.height / 1.8,
    cvs.width / 25, cvs.height / 10, 'Playing card', cvs.width / 4, cvs.height / 1.055, -45);
let purse = new ImgOfObject('img/purse.png', cvs.width / 3.8, cvs.height / 1.67,
    cvs.width / 15, cvs.height / 10, 'Purse', cvs.width / 2.4, cvs.height / 1.055, 10);
let glassBird = new ImgOfObject('img/glass_bird.png', cvs.width / 4, cvs.height / 4, cvs.width / 16, cvs.height / 12,
    'Glass Bird', cvs.width / 1.9, cvs.height / 1.055);
let apple = new ImgOfObject('img/apple.png', cvs.width / 1.68, cvs.height / 1.96, cvs.width / 30, cvs.height / 17,
    'Apple', cvs.width / 1.45, cvs.height / 1.055);

//second set
let mirror = new ImgOfObject('img/mirror.png', cvs.width / 5.5, cvs.height / 3, cvs.width / 16, cvs.height / 7,
    'Mirror', cvs.width / 4, cvs.height / 1.055);
let balerina = new ImgOfObject('img/balerina.png', cvs.width / 2, cvs.height / 2.65, cvs.width / 13, cvs.height / 5,
    'Ballet Dancer', cvs.width / 2.7, cvs.height / 1.055);
let parfume = new ImgOfObject('img/parfume.png', cvs.width / 3.7, cvs.height / 1.6, cvs.width / 20, cvs.height / 13,
    'Parfume', cvs.width / 1.8,
    cvs.height / 1.055, 25);
let comb = new ImgOfObject('img/comb.png', cvs.width / 1.15, cvs.height / 2.15, cvs.width / 30, cvs.height / 20,
    'Comb', cvs.width / 1.45, cvs.height / 1.055, 25);

//third set
let book = new ImgOfObject('img/book.png', cvs.width / 1.5, cvs.height / 1.78, cvs.width / 15, cvs.height / 15,
    'Book', cvs.width / 4, cvs.height / 1.055, -10);
let basket = new ImgOfObject('img/basket.png', cvs.width / 2.05, cvs.height / 2.15, cvs.width / 14, cvs.height / 9,
    'Basket', cvs.width / 2.45, cvs.height / 1.055);
let fan = new ImgOfObject('img/fan.png', cvs.width / 3.2, cvs.height / 2.2, cvs.width / 10, cvs.height / 8, 'Fan',
    cvs.width / 1.76, cvs.height / 1.055, -140);
let shoe = new ImgOfObject('img/shoe.png', cvs.width / 1.8, cvs.height / 1.28, cvs.width / 16, cvs.height / 12,
    'Shoe', cvs.width / 1.45, cvs.height / 1.055);

const randomNum = Math.round(Math.random() * 2);

let arrOfArrays = [[playingCard, purse, glassBird, apple], [book, basket, fan, shoe],
  [mirror, balerina, parfume, comb]];

let arrOfObjects = arrOfArrays[randomNum];

//Функция для перевода градусов в радианы
function inRad(num) {
  return num * Math.PI / 180;
}

//Начальное время
let time = performance.now();


shoe.img.onload = function () {
  document.getElementById('floatingCirclesG').style.display = 'none'; //Остановка анимации загрузки
  game();
}

function game() {
  render();
  requestAnimFrame(game);
}

//Обработка объектов
cvs.addEventListener('click', function (event) {
  arrOfObjects.forEach((elem, i) => {
    //Проверка области клика
    if (elem.checkCoord(event)) {
      time = performance.now();
      //Медлненное исчезновение объекта
      let int = setInterval(function () {
        if (elem.globalA > 0.1) {
          elem.w++;
          elem.h += 1 * elem.h / elem.h;
          elem.globalA -= 0.1;
        }
        //Удаление объекта из массива
        else {
          delete arrOfObjects[i];
          setTimeout(function () {
            arrOfObjects = arrOfObjects.filter((elem) => {
              return elem;
            });
          }, 50);

          clearInterval(int);
        }
      }, 50);
    }
  });
}, false);


//Главная функция отрисовки
function render() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  //Отрисовка заднего фона, gui и tutorial
  if (arrOfObjects.length !== 0) {
    bg.drawImg();
    gui.drawImg();
    tutorial.drawImg();
    tutorial.animate();
  } else {
    bg.drawImg();
    bgBlur.slowDraw();
    logo.slowDraw();
    button.slowDraw();
    button.animate();
  }

  //Отрисовка объектов
  arrOfObjects.forEach((elem) => {
    ctx.globalAlpha = elem.globalA;

    //Проверка на время
    if (performance.now() - time >= 5 * 1000 && arrOfObjects[0].backlight === false) {
      arrOfObjects[0].backlight = true;

      //Запуск анимации для первого объекта в списке
      let inter = setInterval(() => {
        arrOfObjects[0].animate();

        //Отключение анимации при клике на объект
        cvs.addEventListener('click', function (event) {
          arrOfObjects.forEach((elem) => {
            if (elem.checkCoord(event)) {
              clearInterval(inter);
            }
          });
        });
      }, 50);
    }
    if (elem.angle) {    //Если у объекта есть наклон, то отрисовываем с наклоном
      elem.drawAngleImg();
    } else {
      elem.drawImg();
    }
    elem.drawText();
    bgCover.drawImg();
  });
}

let requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 20);
      }
})();