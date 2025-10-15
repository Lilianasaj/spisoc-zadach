// presenter/tasks-board-presenter.js
import TaskListComponent from "../view/task-list-component.js";
import TaskComponent from "../view/task-component.js";
import TaskBoardComponent from "../view/task-board-component.js";
import ClearBasketButtonComponent from "../view/clear-basket-button-component.js";
import EmptyTaskListComponent from "../view/empty-task-list-component.js";
import { render } from "../framework/render.js";
import { Status, StatusLabel } from "../const.js";

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #taskListComponents = new Map();
  #clearButtonComponent = null;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;

    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }

  get tasks() {
    return this.#tasksModel.tasks;
  }

  init() {
    this.#renderBoard();
  }

  createTask() {
    const taskTitle = document.querySelector('#add-task').value.trim();
    if (!taskTitle) {
      return;
    }

    this.#tasksModel.addTask(taskTitle);
    document.querySelector('#add-task').value = "";
  }

  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach((status) => {
      this.#renderTasksList(status);
    });
  }

  #renderTasksList(status) {
    const tasksListComponent = new TaskListComponent(StatusLabel[status]);
    render(tasksListComponent, this.#tasksBoardComponent.element);
    this.#taskListComponents.set(status, tasksListComponent);

    const tasksForStatus = this.#getTasksByStatus(this.tasks, status);
    
    if (tasksForStatus.length === 0) {
      this.#renderEmptyList(tasksListComponent.element);
    } else {
      tasksForStatus.forEach((task) => {
        this.#renderTask(task, tasksListComponent.element);
      });
    }

    if (status === Status.TRASH) {
      this.#renderClearButton(tasksListComponent.element);
    }
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent(task);
    render(taskComponent, container);
  }

  #renderEmptyList(container) {
    const emptyListComponent = new EmptyTaskListComponent();
    render(emptyListComponent, container);
  }

  #renderClearButton(container) {
    const hasTrashTasks = this.#getTasksByStatus(this.tasks, Status.TRASH).length > 0;
    
    this.#clearButtonComponent = new ClearBasketButtonComponent({
      onClick: this.#handleClearBasket.bind(this),
      isDisabled: !hasTrashTasks
    });
    
    render(this.#clearButtonComponent, container);
  }

  #getTasksByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
  }

  #handleClearBasket() {
    // Очищаем корзину в модели
    this.#tasksModel.clearTrash();
    
    // Блокируем кнопку после очистки
    if (this.#clearButtonComponent) {
      this.#clearButtonComponent.disable();
    }
  }

  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = "";
    this.#clearButtonComponent = null;
  }

  #handleModelChange() {
    this.#clearBoard();
    this.#renderBoard();
  }
}