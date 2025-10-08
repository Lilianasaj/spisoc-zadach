// view/task-component.js
import { AbstractComponent } from './abstract-component.js';

function createTaskComponentTemplate(task) {
  const { title, status } = task;
  return `
    <li class="task-item task--${status}">
      <div class="task-body">
        <p class="task-title">${title}</p>
      </div>
    </li>
  `;
}

export default class TaskComponent extends AbstractComponent {
  constructor(task) {
    super();
    this.task = task;
  }

  get template() {
    return createTaskComponentTemplate(this.task);
  }
}