const cvs = document.getElementById('game-window');
const loader = document.getElementById('loader');
const ctx = cvs.getContext('2d');


cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

class Picture {
  constructor(src, x, y, w, h) {
    this.picture = new Image();
    this.picture.src = src;
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
      ctx.drawImage(this.picture, this.x, this.y, this.w, this.h);
    } else {
      ctx.drawImage(this.picture, this.x, this.y);
    }
  }

  drawPicture() {
    ctx.globalAlpha = 1;
    if (this.w && this.h) {
      ctx.drawImage(this.picture, this.x, this.y, this.w, this.h);
    } else {
      ctx.drawImage(this.picture, this.x, this.y);
    }
  }
}

class ItemPicture extends Picture {
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

  drawPicture() {
    ctx.drawImage(this.picture, this.x, this.y, this.w, this.h);
  }

  drawAnglePicture() {
    ctx.save();
    ctx.translate(this.x + this.h / 2, this.y + this.w / 2);
    ctx.rotate(inRad(this.angle));
    ctx.drawImage(this.picture, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }

  drawText() {
    ctx.font = `${cvs.width / 55}px AlbertusMedium`;
    ctx.fillText(this.text, this.textX, this.textY);
  }

  checkCoords(event) {
    const rect = cvs.getBoundingClientRect();    // получение
    const x = event.clientX - rect.left;        // координат
    const y = event.clientY - rect.top;

    if (!this.angle) {
      return this.x <= x
        && x <= this.x + this.w
        && this.y <= y
        && y <= this.y + this.h;
    }
    return this.x - this.angle / 3.8 <= x
      && x <= this.x + this.w + this.angle / 3.8
      && this.y + this.angle / 5 <= y
      && y <= this.y + this.h - this.angle / 5;
  }

  animate() {
    if (this.count === 0 && !this.animateState) {
      this.animateState = true;
    } else if (this.count === 30 && this.animateState) {
      this.animateState = false;
    }

    if (this.animateState) {
      this.w += 0.4;
      this.h += 0.4;
      this.count++;
    } else {
      this.w -= 0.4;
      this.h -= 0.4;
      this.count--;
    }
  }
}

class AnimatePicture extends ItemPicture {
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

const bg = new Picture('./assets/images/bg_ho.png', 0, 0, cvs.width, cvs.height);
const bgCover = new Picture('./assets/images/bg_cover.png', 0, 0, cvs.width, cvs.height);
const bgBlur = new Picture('./assets/images/bg_blur.png', 0, 0, cvs.width, cvs.height);

const gui = new Picture(
  './assets/images/ho_gui.png',
  cvs.width / 6,
  cvs.height / 1.2,
  cvs.width / 1.5,
  cvs.height / 5.5,
);

const logo = new Picture(
  './assets/images/logo.png',
  cvs.width / 4,
  cvs.height / 10,
  cvs.width / 2,
  cvs.height / 2.2,
);

const tutorial = new AnimatePicture(
  './assets/images/tutorial.png',
  cvs.width / 3,
  cvs.height / 25,
  cvs.width / 3,
  cvs.height / 4,
  'Find all the\nhidden objects',
  cvs.width / 2.35,
  cvs.height / 5.7,
);

tutorial.drawText = function () {
  const { textX, textY, size } = this;

  ctx.fillText(
    'Find all the'.toUpperCase(),
    textX - cvs.width / 350,
    textY - size / 2
  );

  ctx.fillText(
    'Hidden objects!'.toUpperCase(),
    textX - cvs.width / 35,
    textY + cvs.height / 20 + size / 2,
  );
};

const button = new AnimatePicture(
  './assets/images/button.png',
  cvs.width / 2.66,
  cvs.height / 1.8,
  cvs.width / 4,
  cvs.height / 10,
  'Play FREE',
  cvs.width / 2.15,
  cvs.height / 1.62,
);

const randomNum = Math.round(Math.random() * 2);
let set = []; // Массив со спрятанными объектами

if (randomNum === 0) {
  // Первый сет
  const playingCard = new ItemPicture(
    './assets/images/playing_card.png',
    cvs.width / 1.25,
    cvs.height / 1.8,
    cvs.width / 25,
    cvs.height / 10,
    'Playing card',
    cvs.width / 4,
    cvs.height / 1.055,
    -45,
  );

  const purse = new ItemPicture(
    './assets/images/purse.png',
    cvs.width / 3.8,
    cvs.height / 1.67,
    cvs.width / 15,
    cvs.height / 10,
    'Purse',
    cvs.width / 2.4,
    cvs.height / 1.055,
    10,
  );

  const glassBird = new ItemPicture(
    './assets/images/glass_bird.png',
    cvs.width / 4,
    cvs.height / 4,
    cvs.width / 16,
    cvs.height / 12,
    'Glass Bird',
    cvs.width / 1.9,
    cvs.height / 1.055,
  );

  const apple = new ItemPicture(
    './assets/images/apple.png',
    cvs.width / 1.68,
    cvs.height / 1.96,
    cvs.width / 30,
    cvs.height / 17,
    'Apple',
    cvs.width / 1.45,
    cvs.height / 1.055,
  );

  set.push(playingCard, purse, glassBird, apple);

} else if (randomNum === 1) {
  // Второй сет
  const { width, height } = cvs;

  const mirror = new ItemPicture(
    './assets/images/mirror.png',
    width / 5.5,
    height / 3,
    width / 16,
    height / 7,
    'Mirror',
    width / 4,
    height / 1.055,
  );

  const balerina = new ItemPicture(
    './assets/images/balerina.png',
    width / 2,
    height / 2.65,
    width / 13,
    height / 5,
    'Ballet Dancer',
    width / 2.7,
    height / 1.055,
  );

  const parfume = new ItemPicture(
    './assets/images/parfume.png',
    width / 3.7,
    height / 1.6,
    width / 20,
    height / 13,
    'Parfume',
    width / 1.8,
    height / 1.055,
    25,
  );

  const comb = new ItemPicture(
    './assets/images/comb.png',
    width / 1.15,
    height / 2.15,
    width / 30,
    height / 20,
    'Comb',
    width / 1.45,
    height / 1.055,
    25
  );

  set.push(mirror, balerina, parfume, comb);
} else {
  // Третий сет
  const { width, height } = cvs;

  const book = new ItemPicture(
    './assets/images/book.png',
    width / 1.5,
    height / 1.78,
    width / 15,
    height / 15,
    'Book',
    width / 4,
    height / 1.055,
    -10,
  );

  const basket = new ItemPicture(
    './assets/images/basket.png',
    width / 2.05,
    height / 2.15,
    width / 14,
    height / 9,
    'Basket',
    width / 2.45,
    height / 1.055
  );

  const fan = new ItemPicture(
    './assets/images/fan.png',
    width / 3.2,
    height / 2.2,
    width / 10,
    height / 8,
    'Fan',
    width / 1.76,
    height / 1.055,
    -140
  );

  const shoe = new ItemPicture(
    './assets/images/shoe.png',
    width / 1.8,
    height / 1.28,
    width / 16,
    height / 12,
    'Shoe',
    width / 1.45,
    height / 1.055,
  );

  set.push(book, basket, fan, shoe);
}

// Запуск рендера, если изображения загружены
const int = setInterval(function () {
  if (logo.picture.complete && set.every(({ picture }) => picture.complete)) {
    loader.style.display = 'none'; // Остановка анимации загрузки
    game();
    clearInterval(int);
  }
}, 100);

// Функция для перевода градусов в радианы
function inRad(num) {
  return num * Math.PI / 180;
}

// Начальное время
let time = performance.now();

function game() {
  render();
  requestAnimFrame(game);
}

// Обработка объектов
cvs.addEventListener('click', function (event) {
  set.forEach((item, i) => {
    // Проверка области клика
    if (item.checkCoords(event)) {
      time = performance.now();
      // Медленное исчезновение объекта
      const int = setInterval(function () {
        if (item.globalA > 0.1) {
          item.w += 1;
          item.h += item.h / item.h;
          item.globalA -= 0.1;
        }
        // Удаление объекта из массива
        else {
          delete set[i];
          setTimeout(function () {
            set = set.filter(Boolean);
          }, 50);

          clearInterval(int);
        }
      }, 50);
    }
  });
}, false);


// Главная функция отрисовки
function render() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  // Отрисовка заднего фона, gui и tutorial
  if (set.length !== 0) {
    bg.drawPicture();
    gui.drawPicture();
    tutorial.drawPicture();
    tutorial.animate();
  } else {
    bg.drawPicture();
    bgBlur.slowDraw();
    logo.slowDraw();
    button.slowDraw();
    button.animate();
  }

  // Отрисовка объектов
  set.forEach(item => {
    ctx.globalAlpha = item.globalA;

    // Проверка на время
    if (performance.now() - time >= 5 * 1000 && set[0].backlight === false) {
      set[0].backlight = true;

      // Запуск анимации для первого объекта в списке
      const inter = setInterval(() => {
        set[0].animate();

        // Отключение анимации при клике на объект
        cvs.addEventListener('click', function (event) {
          set.forEach((elem) => {
            if (elem.checkCoords(event)) {
              clearInterval(inter);
            }
          });
        });
      }, 50);
    }
    if (item.angle) { //Если у объекта есть наклон, то отрисовываем с наклоном
      item.drawAnglePicture();
    } else {
      item.drawPicture();
    }
    item.drawText();
    bgCover.drawPicture();
  });
}

const requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 20);
    }
})();
