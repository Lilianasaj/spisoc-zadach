// view/clear-basket-button-component.js
import { AbstractComponent } from './abstract-component.js';

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
  constructor({ onClick = null, isDisabled = false } = {}) {
    super();
    this._onClick = onClick;
    this._isDisabled = isDisabled;
  }

  get template() {
    return createClearBasketButtonTemplate(this._isDisabled);
  }
}