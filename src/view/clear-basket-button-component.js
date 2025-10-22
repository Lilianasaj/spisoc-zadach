// view/clear-basket-button-component.js
import { AbstractComponent } from './abstract-component.js';
import { createElement } from "../framework/render.js";

function createClearBasketButtonTemplate(isDisabled = false) {
  return `
    <button 
      class="clear-basket-btn button" 
      type="button" 
      ${isDisabled ? 'disabled' : ''}
      aria-label="Очистить корзину"
    >
      Очистить корзину
    </button>
  `;
}

export default class ClearBasketButtonComponent extends AbstractComponent {
  #isDisabled = false;
  #handleClick = null;

  constructor({ onClick = null, isDisabled = false } = {}) {
    super();
    this.#handleClick = onClick;
    this.#isDisabled = isDisabled;
  }

  get template() {
    return createClearBasketButtonTemplate(this.#isDisabled);
  }

  // Метод для блокировки кнопки
  disable() {
    this.#isDisabled = true;
    if (this.element) {
      this.element.disabled = true;
    }
  }

  // Метод для разблокировки кнопки
  enable() {
    this.#isDisabled = false;
    if (this.element) {
      this.element.disabled = false;
    }
  }

  // Переопределяем element для добавления обработчиков
  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
      if (!this.#isDisabled && this.#handleClick) {
        this._element.addEventListener('click', this.#clickHandler);
      }
    }
    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element.removeEventListener('click', this.#clickHandler);
      this._element = null;
    }
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    if (this.#handleClick && !this.#isDisabled) {
      this.#handleClick();
    }
  };

  setClickHandler(callback) {
    this.#handleClick = callback;
       if (this._element && !this.#isDisabled) {
      this._element.removeEventListener('click', this.#clickHandler);
      this._element.addEventListener('click', this.#clickHandler);
    }
  }
}