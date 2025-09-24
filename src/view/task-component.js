import { createElement } from "../framework/render.js";

function createTaskComponentTemplate(task) {
  return `<li class="task-item">${task}</li>`;
}

export default class TaskComponent {
  constructor(task) {
    this.task = task;
  }

  getTemplate() {
    return createTaskComponentTemplate(this.task);
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