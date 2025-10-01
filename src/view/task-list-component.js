import { createElement } from "../framework/render.js";

function createTaskListComponentTemplate(label) {
  return `
    <div class="task-list">
      <h2>${label}</h2>
      <ul class="task-container"></ul>
    </div>
  `;
}

export default class TaskListComponent {
  constructor(label) {
    this.label = label;
  }

  getTemplate() {
    return createTaskListComponentTemplate(this.label);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  getTasksContainer() {
    return this.getElement().querySelector(".task-container");
  }

  removeElement() {
    this.element = null;
  }
}