const output = document.querySelector('.modal__value');
const rangeSLider = document.querySelector('.adjust-bar.adjust-bar_theme_temp');

rangeSLider.oninput = function() {
  output.innerHTML = this.value > 0 ? '+' + this.value : this.value;
};

const arrowLeftDevs = document.querySelector(
  '.devices__paginator .paginator__arrow_left');
const arrowRightDevs = document.querySelector(
  '.devices__paginator .paginator__arrow_right');
const devices = document.querySelector('.devices');
let currentPageDevs = 1;

arrowRightDevs.addEventListener('click', function() {
  currentPageDevs += 1;
  arrowLeftDevs.classList.toggle(
    'paginator__arrow_disabled',
    currentPageDevs === 1
  );
  devices.scroll({
    top: 0,
    left: 1366,
    behavior: 'smooth'
  });
});

arrowLeftDevs.addEventListener('click', function() {
  if (currentPageDevs > 1) {
    currentPageDevs -= 1;
    arrowLeftDevs.classList.toggle(
      'paginator__arrow_disabled',
      currentPageDevs === 1
    );
    devices.scroll({
      top: 0,
      left: -1366,
      behavior: 'smooth'
    });
  }
});

let curValue;
let curRotate;
const maxRotate = 0.42;
const minRotate = -0.42;

const MIN_VALUE = 26;
const INDICATOR_OFFSET = 265;

const rotateToValue = function(rotate) {
  return Math.floor(
    (Math.abs(rotate * 360 * 1.73 + INDICATOR_OFFSET) / 53) + MIN_VALUE);
};

/**
 * @param {Number} rotate Количество оборотов от нейтриального положения.
 */
function setRotate(rotate) {
  if (rotate > maxRotate) {
    rotate = maxRotate;
  } else if (rotate < minRotate) {
    rotate = minRotate;
  }

  curRotate = rotate;
  curValue = rotateToValue(rotate);

  document.querySelector('.modal_knob .modal__value').innerHTML = '+' +
      curValue;
  document.querySelector('.knob__value').innerHTML = '+' + curValue;
  document.querySelector('.knob__indicator').style.strokeDasharray = curRotate *
      360 * 1.73 + INDICATOR_OFFSET + ' 629';
  document.querySelector('.knob__arrow').style.transform = 'rotate(' +
      (curRotate * 360) + 'deg)';
}

function getPosition(elem) {
  const rect = elem.getBoundingClientRect();

  return [
    rect.left + (rect.right - rect.left) / 2,
    rect.top + (rect.bottom - rect.top) / 2
  ];
}

function getMouseAngle(event, centerElem) {
  const pos = getPosition(centerElem);
  let cursor = [event.clientX, event.clientY];
  let rad;

  if (event.targetTouches && event.targetTouches[0]) {
    cursor = [event.targetTouches[0].clientX, event.targetTouches[0].clientY];
  }

  rad = Math.atan2(cursor[1] - pos[1], cursor[0] - pos[0]);
  rad += Math.PI / 2;

  return rad;
}

let knobDragged;
let prevAngleRad = null;
let prevRotate = null;

function startDragging(e) {
  e.preventDefault();
  e.stopPropagation();
  const rad = getMouseAngle(e, document.querySelector('.knob_center'));

  knobDragged = true;
  prevAngleRad = rad;
  prevRotate = curRotate;
}

function stopDragging(e) {
  knobDragged = false;
}

function dragRotate(e) {
  if (!knobDragged) {
    return;
  }

  const old = prevAngleRad;
  const rad = getMouseAngle(e, document.querySelector('.knob_center'));
  let delta = rad - old;

  prevAngleRad = rad;

  if (delta < 0) {
    delta += Math.PI * 2;
  }
  if (delta > Math.PI) {
    delta -= Math.PI * 2;
  }

  const deltaRotate = delta / Math.PI / 2;
  const rotate = prevRotate + deltaRotate;

  prevRotate = rotate;
  setRotate(rotate);
}

function setEvtListeners() {
  const elem = document.querySelector('.knob-container');

  elem.addEventListener('mousedown', startDragging);
  document.addEventListener('mouseup', stopDragging);
  document.addEventListener('mousemove', dragRotate);
  elem.addEventListener('touchstart', startDragging);
  document.addEventListener('touchend', stopDragging);
  document.addEventListener('touchmove', dragRotate);
}

setEvtListeners();
setRotate(0);

document.querySelectorAll('.modal_close').forEach(b => {
  b.onclick = function() {
    document.querySelectorAll('.modal').forEach(m => {
      m.classList.toggle('modal_open', false);
      document.querySelector('body').style.overflow = 'auto';
    });
  };
});

const TEMPS = {
  manual: -10,
  cold: 0,
  warm: 23,
  hot: 30
};

document.querySelectorAll('.modal__filter .filter__item-label').forEach(l => {
  l.onclick = function() {
    document.querySelector('.adjust-bar_theme_temp').value = TEMPS[this.id];
    document.querySelector(
      '.modal_temp .modal__value').innerHTML = TEMPS[this.id] > 0 ?
      '+' + TEMPS[this.id] :
      TEMPS[this.id];
  };
});

const showModal = function(selector) {
  document.querySelector(selector).classList.toggle('modal_open', true);
  document.querySelector('body').style.overflow = 'hidden';
};

const arrowLeftScens = document.querySelector(
  '.scenarios__paginator .paginator__arrow_left');
const arrowRightScens = document.querySelector(
  '.scenarios__paginator .paginator__arrow_right');
const pageCountScens = document.querySelectorAll('.scenarios__page').length;
const scenarios = document.querySelector('.scenarios');
let currentPage = 1;


arrowRightScens.addEventListener('click', function() {
  if (currentPage < pageCountScens) {
    currentPage += 1;
    arrowRightScens.classList.toggle('paginator__arrow_disabled',
      currentPage === pageCountScens);
    arrowLeftScens.classList.toggle('paginator__arrow_disabled',
      currentPage === 1);
    scenarios.scroll({
      top: 0,
      left: 645,
      behavior: 'smooth'
    });
  }
});

arrowLeftScens.addEventListener('click', function() {
  if (currentPage > 1) {
    currentPage -= 1;
    arrowRightScens.classList.toggle('paginator__arrow_disabled',
      currentPage === pageCountScens);
    arrowLeftScens.classList.toggle('paginator__arrow_disabled',
      currentPage === 1);
    scenarios.scroll({
      top: 0,
      left: -645,
      behavior: 'smooth'
    });
  }
});

setTimeout(() => {
  document.querySelector('#banner').src = 'assets/banner-small.webp';
}, 99);

const infoBlockTemplateSelector = '#panel-template';
const infoBlockClassName = 'panel';
const infoBlockSelector = `.${infoBlockClassName}`;

function addInfoBlock(config, target) {
  const template = document.querySelector(infoBlockTemplateSelector);
  const recordClone = document.importNode(template.content, true);

  renderInfoBlock(recordClone, config);

  target.appendChild(recordClone);
}

function renderInfoBlock(docFragment, {title, iconClass, msg, types}) {
  const titleElem = docFragment.querySelector(`${infoBlockSelector}__title`);

  titleElem.textContent = title;

  const icon = docFragment.querySelector(`${infoBlockSelector}__icon`);

  icon.classList.add(`${infoBlockClassName}__icon_${iconClass}`);

  const msgNode = docFragment.querySelector(`${infoBlockSelector}__sub`);

  if (msg) {
    msgNode.textContent = msg;
  } else {
    msgNode.parentNode.removeChild(msgNode);
  }

  if (types) {
    const panelNode = docFragment.querySelector(infoBlockSelector);
    types.forEach(type =>
      panelNode.classList.add(`${infoBlockClassName}_${type}`)
    );
  }
}

/*
, {
    icon: '',
    title: '',
    msg: ''
  }
*/

const panelGroups = {
  main__upcoming: [{
    iconClass: 'temp_off',
    title: 'Philips Cooler',
    msg: 'Начнет охлаждать в 16:30'
  }, {
    iconClass: 'light_off',
    title: 'Xiaomi Yeelight LED Smart Bulb',
    msg: 'Включится в 17:00'
  }, {
    iconClass: 'light_off',
    title: 'Xiaomi Yeelight LED Smart Bulb',
    msg: 'Включится в 17:00'
  }],
  scenarios__page_1: [{
    iconClass: 'light_on',
    title: 'Выключить весь свет в доме и во дворе'
  }, {
    iconClass: 'clock',
    title: 'Я ухожу'
  }, {
    iconClass: 'light_on',
    title: 'Включить свет в корридоре'
  }, {
    iconClass: 'temp_on',
    title: 'Набрать горячую ванну',
    msg: 'Начнётся в 18:00'
  }, {
    iconClass: 'light_on',
    title: 'Выключить весь свет в доме и во дворе'
  }, {
    iconClass: 'clock',
    title: 'Я ухожу'
  }, {
    iconClass: 'light_on',
    title: 'Включить свет в корридоре'
  }, {
    iconClass: 'temp_on',
    title: 'Набрать горячую ванну',
    msg: 'Начнётся в 18:00'
  }, {
    iconClass: 'light_on',
    title: 'Выключить весь свет в доме и во дворе'
  }],
  scenarios__page_2: [{
    iconClass: 'light_on',
    title: 'Включить свет в корридоре'
  }],
  devices: [{
    types: ['room', 'floor'],
    iconClass: 'light_on',
    title: 'Xiaomi Warm Floor',
    msg: 'Включено'
  }, {
    types: ['lamp'],
    iconClass: 'light_on',
    title: 'Xiaomi Yeelight LED Smart Bulb',
    msg: 'Включено'
  }, {
    types: ['cam'],
    iconClass: 'light_off',
    title: 'D-Link Omna 180 Cam',
    msg: 'Включится в 17:00'
  }, {
    types: ['room', 'temp'],
    iconClass: 'temp_off',
    title: 'Elgato Eve Degree Connected',
    msg: 'Включится в 17:00'
  }, {
    types: ['lamp'],
    iconClass: 'light_off',
    title: 'LIFX Mini Day & Dusk A60 E27',
    msg: 'Включится в 17:00'
  }, {
    types: ['room'],
    iconClass: 'light_on',
    title: 'Xiaomi Mi Air Purifier 2S',
    msg: 'Включено'
  }, {
    types: ['lamp'],
    iconClass: 'light_off',
    title: 'Philips Zhirui',
    msg: 'Выключено'
  }, {
    types: ['kitchen'],
    iconClass: 'light_on',
    title: 'Philips Purifier',
    msg: 'Включено'
  }]
};

Object.keys(panelGroups).forEach(selector => {
  const panels = panelGroups[selector];
  const target = document.querySelector(`.${selector}`);

  panels.forEach(panel => addInfoBlock(panel, target));
});

// need to have this weirdo as a last child
const bannerCard = document.querySelector('#extra-panel');
bannerCard.parentNode.appendChild(bannerCard);

const panelCountScens =
  document.querySelectorAll('.scenarios__page .panel').length;
const pagiantorScens = document.querySelector('.scenarios__paginator');
pagiantorScens.classList.toggle('paginator_hide', panelCountScens <= 9);

const panelCountDevs = document.querySelectorAll('.devices .panel').length;
const pagiantorDevs = document.querySelector('.devices__paginator');
pagiantorDevs.classList.toggle('paginator_hide', panelCountDevs < 7);

document.querySelectorAll('.panel_temp')
  .forEach(p => p.onclick = () => showModal('.modal_temp'));

document.querySelectorAll('.panel_lamp')
  .forEach(p => p.onclick = () => showModal('.modal_light'));

document.querySelectorAll('.panel_floor')
  .forEach(p => p.onclick = () => showModal('.modal_knob'));
