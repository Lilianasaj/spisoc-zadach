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

export default class ClearBasketButtonComponent {
  constructor({ onClick = null, isDisabled = false } = {}) {
    this._handleClick = this._handleClick.bind(this);
    this._onClick = onClick;
    this._isDisabled = isDisabled;
  }

  getTemplate() {
    return createClearBasketButtonTemplate(this._isDisabled);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      if (!this._isDisabled) {
        this.element.addEventListener('click', this._handleClick);
      }
    }
    return this.element;
  }

  removeElement() {
    if (this.element) {
      this.element.removeEventListener('click', this._handleClick);
      this.element = null;
    }
  }

  _handleClick(evt) {
    evt.preventDefault();
    if (this._onClick) {
      this._onClick(evt);
    }
  }

  setOnClick(callback) {
    this._onClick = callback;
  }
}