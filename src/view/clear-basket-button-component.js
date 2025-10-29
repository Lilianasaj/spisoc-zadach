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
  #isDisabled = false;

  constructor({ onClick = null, isDisabled = false } = {}) {
    super();
    this.#isDisabled = isDisabled;
    
    if (onClick && !isDisabled) {
      this.element.addEventListener('click', (evt) => {
        evt.preventDefault();
        onClick();
      });
    }
  }

  get template() {
    return createClearBasketButtonTemplate(this.#isDisabled);
  }

  toggleDisabled(isDisabled) {
    this.#isDisabled = isDisabled;
    if (this.element) {
      this.element.disabled = isDisabled;
    }
  }
}