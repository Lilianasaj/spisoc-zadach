import { createElement } from "../framework/render.js";

function createFormAddTaskComponentTemplate() {
  return `<form class="new-task">
        <h2>Новая задача</h2>
        <input type="text" placeholder="Название задачи...">
        <button>+Добавить</button>
      </form>
        `;
}

export default class FormAddTaskComponent {
  getTemplate() {
    return createFormAddTaskComponentTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}