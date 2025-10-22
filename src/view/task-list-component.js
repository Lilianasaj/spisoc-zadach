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
  constructor({ status, label, onTaskDrop }) {
    super();
    this.status = status;
    this.label = label;
    this.#setDropHandler(onTaskDrop);
  }

  get template() {
    return createTaskListComponentTemplate(this.label);
  }

  getTasksContainer() {
    return this.element.querySelector(".task-container");
  }

  #setDropHandler(onTaskDrop) {
    const container = this.element;
    const taskContainer = this.getTasksContainer();

    container.addEventListener('dragover', (event) => {
      event.preventDefault();
      container.classList.add('drag-over');
      
      // Определяем позицию для вставки
      const afterElement = this.#getDragAfterElement(taskContainer, event.clientY);
      const draggable = document.querySelector('.dragging');
      
      if (afterElement == null) {
        taskContainer.appendChild(draggable);
      } else {
        taskContainer.insertBefore(draggable, afterElement);
      }
    });

    container.addEventListener('dragleave', () => {
      container.classList.remove('drag-over');
    });

    container.addEventListener('drop', (event) => {
      event.preventDefault();
      container.classList.remove('drag-over');
      const taskId = event.dataTransfer.getData('text/plain');
      if (onTaskDrop) {
        onTaskDrop(taskId, this.status);
      }
    });
  }

  #getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
}