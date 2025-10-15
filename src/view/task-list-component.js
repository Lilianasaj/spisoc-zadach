// view/task-list-component.js
import { AbstractComponent } from './abstract-component.js';

function createTaskListComponentTemplate(label) {
  return `
    <div class="task-list">
      <h2>${label}</h2>
      <ul class="task-container"></ul>
    </div>
  `;
}

export default class TaskListComponent extends AbstractComponent {
  constructor(label) {
    super();
    this.label = label;
  }

  get template() {
    return createTaskListComponentTemplate(this.label);
  }

  getTasksContainer() {
    return this.element.querySelector(".task-container");
  }
}