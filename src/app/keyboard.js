import Constants from './constants';

const { keys } = Constants;

export default class Keyboard {
  constructor() {
    this.lang = null;
    this.register = null;
    this.input = null;
  }

  initDOM() {
    this.lang = window.localStorage.lang ? window.localStorage.lang : 'RU';
    this.register = 'lower';

    this.input = document.createElement('textarea');
    this.input.setAttribute('autofocus', '');
    document.body.append(this.input);

    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    document.body.append(keyboard);

    for (let i = 0; i < keys.length; i += 1) {
      const item = keys[i];
      const key = document.createElement('div');
      key.setAttribute('id', item.eventCode);
      if (item.className === 'ru_letter') {
        key.className = item.className;
        key.innerHTML = this.lang === 'RU'
          ? `<span>${item.ruKey.toLowerCase()}</span>`
          : `<span>${item.enKey}</span>`;
      } else if (item.className === 'digit') {
        key.className = item.className;
        key.innerHTML = this.lang === 'RU'
          ? `<span>${item.ruKey}</span>`
          : `<span>${item.enKey}</span>`;
      } else if (item.className === 'letter') {
        key.className = item.className;
        key.innerHTML = this.lang === 'RU'
          ? `<span>${item.ruKey.toLowerCase()}</span>`
          : `<span>${item.enKey.toLowerCase()}</span>`;
      } else {
        key.className = item.className;
        key.innerHTML = `<span>${item.Key}</span>`;
      }
      keyboard.append(key);
    }
  }

  attachEvents() {
    document.addEventListener('keydown', this.handlerDown.bind(this));
    document.addEventListener('keydown', this.changeLang.bind(this));
    document.addEventListener('keydown', this.handlerCapsLock.bind(this));
    document.addEventListener('keydown', this.handlerShift.bind(this));
    document.addEventListener('keyup', this.handlerShift.bind(this));
    document.addEventListener('keyup', this.handlerUp.bind(this));
    document.addEventListener('keydown', this.handlerTab.bind(this));
    document
      .querySelector('div.keyboard')
      .addEventListener('mousedown', this.handlerClickDown.bind(this));
  }

  handlerDown(event) {
    this.input.focus();
    for (let i = 0; i < Constants.keys.length; i += 1) {
      const item = Constants.keys[i];
      if (item.eventCode === event.code) {
        const elem = document.querySelector(`#${event.code}`);
        if (
          elem.className === 'letter'
                    || elem.className === 'ru_letter'
                    || elem.className === 'digit'
        ) {
          event.preventDefault();
          document.querySelector('textarea').value += elem.textContent;
        }
        elem.classList.add('press');
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handlerUp(event) {
    for (let i = 0; i < Constants.keys.length; i += 1) {
      const item = Constants.keys[i];
      if (item.eventCode === event.code) {
        document.querySelector(`#${event.code}`).classList.remove('press');
      }
    }
  }

  handlerCapsLock(event) {
    if (event.code !== 'CapsLock') {
      return;
    }
    if (this.register === 'lower') {
      this.register = 'upper';
    } else {
      this.register = 'lower';
    }
    this.changeRegister();
    document.querySelector('#CapsLock').classList.toggle('press_caps');
  }

  handlerShift(event) {
    if (event.code !== 'ShiftRight' && event.code !== 'ShiftLeft') {
      return;
    }
    if (this.register === 'lower') {
      this.register = 'upper';
    } else {
      this.register = 'lower';
    }
    this.changeRegister();
  }

  handlerClickDown(event) {
    this.input.focus();
    const elem = event.target;
    if (
      elem.classList.contains('ru_letter')
            || elem.classList.contains('letter')
            || elem.classList.contains('digit')
    ) {
      const text = event.target.textContent;
      document.querySelector('textarea').value += text;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handlerTab(event) {
    if (event.code !== 'Tab') {
      return;
    }
    event.preventDefault();
    document.querySelector('textarea').value += '\t';
  }

  changeRegister() {
    for (let i = 0; i < keys.length; i += 1) {
      const item = keys[i];
      const elem = document.querySelector(`#${item.eventCode}>span`);
      if (item.className === 'ru_letter') {
        if (this.register === 'lower') {
          elem.innerHTML = this.lang === 'RU'
            ? `${item.ruKey.toLowerCase()}`
            : `${item.enKey}`;
        } else {
          elem.innerHTML = this.lang === 'RU' ? `${item.ruKey}` : `${item.enSymbolKey}`;
        }
      } else if (item.className === 'digit') {
        if (this.register === 'lower') {
          elem.innerHTML = this.lang === 'RU' ? `${item.ruKey}` : `${item.enKey}`;
        } else {
          elem.innerHTML = this.lang === 'RU'
            ? `${item.ruSymbolKey}`
            : `${item.enSymbolKey}`;
        }
      } else if (item.className === 'letter') {
        if (this.register === 'lower') {
          elem.innerHTML = this.lang === 'RU'
            ? `${item.ruKey.toLowerCase()}`
            : `${item.enKey.toLowerCase()}`;
        } else {
          elem.innerHTML = this.lang === 'RU' ? `${item.ruKey}` : `${item.enKey}`;
        }
      }
    }
  }

  changeLang(event) {
    if (event.altKey && event.shiftKey) {
      if (this.lang === 'RU') {
        this.lang = 'EN';
        window.localStorage.setItem('lang', this.lang);
      } else {
        this.lang = 'RU';
        window.localStorage.setItem('lang', this.lang);
      }
      this.changeRegister();
    }
  }
}
