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
  constructor({ task }) {
    super();
    this.task = task;
    this.#afterCreateElement();
  }

  get template() {
    return createTaskComponentTemplate(this.task);
  }

  #afterCreateElement() {
    this.#makeTaskDraggable();
  }

  #makeTaskDraggable() {
    this.element.setAttribute('draggable', true);

    this.element.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', this.task.id);
      this.element.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
    });

    this.element.addEventListener('dragend', () => {
      this.element.classList.remove('dragging');
    });
  }
}