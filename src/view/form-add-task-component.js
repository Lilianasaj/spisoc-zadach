// view/form-add-task-component.js
import { AbstractComponent } from './abstract-component.js';

function createFormAddTaskComponentTemplate() {
  return `
    <form class="new-task">
      <h2>Новая задача</h2>
      <input type="text" id="add-task" placeholder="Название задачи..." required>
      <button type="submit">+Добавить</button>
    </form>
  `;
}

export default class FormAddTaskComponent extends AbstractComponent {
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('submit', this.#clickHandler);
  }

  get template() {
    return createFormAddTaskComponentTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  // Метод для очистки поля ввода
  clearInput() {
    const input = this.element.querySelector('#add-task');
    if (input) {
      input.value = '';
    }
  }
}