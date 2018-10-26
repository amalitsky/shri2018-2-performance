const qs = selector => document.querySelector(selector);
const qsAll = selector => document.querySelectorAll(selector);
const output = qs('.modal__value');

qs('.adjust-bar.adjust-bar_theme_temp').oninput = function() {
  output.innerHTML = this.value > 0 ? '+' + this.value : this.value;
};

const arrowLeftDevs = qs('.devices__paginator .paginator__arrow_left');
const arrowRightDevs = qs('.devices__paginator .paginator__arrow_right');
const devices = qs('.devices');
let currentPageDevs = 1;
const disabledPaginatorArrowClass = 'paginator__arrow_disabled';

arrowRightDevs.addEventListener('click', () => {
  currentPageDevs += 1;
  arrowLeftDevs.classList.toggle(
    disabledPaginatorArrowClass,
    currentPageDevs === 1
  );
  devices.scroll({
    top: 0,
    left: 1366,
    behavior: 'smooth'
  });
});

arrowLeftDevs.addEventListener('click', () => {
  if (currentPageDevs > 1) {
    currentPageDevs -= 1;
    arrowLeftDevs.classList.toggle(
      disabledPaginatorArrowClass,
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

function setRotate(rotate) {
  if (rotate > maxRotate) {
    rotate = maxRotate;
  } else if (rotate < minRotate) {
    rotate = minRotate;
  }

  curRotate = rotate;
  curValue = rotateToValue(rotate);

  qs('.modal_knob .modal__value').innerHTML = '+' + curValue;
  qs('.knob__value').innerHTML = '+' + curValue;
  qs('.knob__indicator').style.strokeDasharray = curRotate *
      360 * 1.73 + INDICATOR_OFFSET + ' 629';
  qs('.knob__arrow').style.transform = 'rotate(' + (curRotate * 360) + 'deg)';
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

  const {targetTouches} = event;
  if (targetTouches && targetTouches[0]) {
    cursor = [
      targetTouches[0].clientX,
      targetTouches[0].clientY
    ];
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
  const rad = getMouseAngle(e, qs('.knob_center'));
  knobDragged = true;
  prevAngleRad = rad;
  prevRotate = curRotate;
}

function stopDragging() {
  knobDragged = false;
}

function dragRotate(e) {
  if (!knobDragged) {
    return;
  }

  const old = prevAngleRad;
  const rad = getMouseAngle(e, qs('.knob_center'));
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
  const knob = qs('.knob-container');
  knob.addEventListener('mousedown', startDragging);
  document.addEventListener('mouseup', stopDragging);
  document.addEventListener('mousemove', dragRotate);
  knob.addEventListener('touchstart', startDragging);
  document.addEventListener('touchend', stopDragging);
  document.addEventListener('touchmove', dragRotate);
}

setEvtListeners();
setRotate(0);

qsAll('.modal_close')
  .forEach(btn =>
    btn.onclick = () => {
      qsAll('.modal').forEach(m => {
        m.classList.toggle('modal_open', false);
        qs('body').style.overflow = 'auto';
      });
    }
  );

const TEMPS = {
  manual: -10,
  cold: 0,
  warm: 23,
  hot: 30
};

qsAll('.modal__filter .filter__item-label')
  .forEach(label =>
    label.onclick = function() {
      qs('.adjust-bar_theme_temp').value = TEMPS[this.id];
      qs('.modal_temp .modal__value').innerHTML =
        TEMPS[this.id] > 0 ? '+' + TEMPS[this.id] : TEMPS[this.id];
    }
  );

const showModal = selector => {
  qs(selector).classList.toggle('modal_open', true);
  qs('body').style.overflow = 'hidden';
};

const arrowLeftScens = qs('.scenarios__paginator .paginator__arrow_left');
const arrowRightScens = qs('.scenarios__paginator .paginator__arrow_right');
const pageCountScens = qsAll('.scenarios__page').length;
const scenarios = qs('.scenarios');
let currentPage = 1;

arrowRightScens.addEventListener('click', () => {
  if (currentPage < pageCountScens) {
    currentPage += 1;
    arrowRightScens.classList.toggle(
      disabledPaginatorArrowClass,
      currentPage === pageCountScens
    );
    arrowLeftScens.classList.toggle(
      disabledPaginatorArrowClass,
      currentPage === 1
    );
    scenarios.scroll({
      top: 0,
      left: 645,
      behavior: 'smooth'
    });
  }
});

arrowLeftScens.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    arrowRightScens.classList.toggle(
      disabledPaginatorArrowClass,
      currentPage === pageCountScens
    );
    arrowLeftScens.classList.toggle(
      disabledPaginatorArrowClass,
      currentPage === 1
    );
    scenarios.scroll({
      top: 0,
      left: -645,
      behavior: 'smooth'
    });
  }
});

setTimeout(() => qs('#banner').src = 'assets/banner-small.webp', 99);

const infoBlockTemplateSelector = '#panel-template';
const infoBlockClassName = 'panel';
const infoBlockSelector = `.${infoBlockClassName}`;

function addInfoBlock(config, target) {
  const template = qs(infoBlockTemplateSelector);
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
  const target = qs(`.${selector}`);
  panels.forEach(panel => addInfoBlock(panel, target));
});

// need to have this weirdo as a last child
const bannerCard = qs('#extra-panel');
bannerCard.parentNode.appendChild(bannerCard);

const panelCountScens =
  qsAll('.scenarios__page .panel').length;
const pagiantorScens = qs('.scenarios__paginator');
pagiantorScens.classList.toggle('paginator_hide', panelCountScens <= 9);

const panelCountDevs = qsAll('.devices .panel').length;
const pagiantorDevs = qs('.devices__paginator');
pagiantorDevs.classList.toggle('paginator_hide', panelCountDevs < 7);

qsAll('.panel_temp').forEach(p => p.onclick = () => showModal('.modal_temp'));
qsAll('.panel_lamp').forEach(p => p.onclick = () => showModal('.modal_light'));
qsAll('.panel_floor').forEach(p => p.onclick = () => showModal('.modal_knob'));
