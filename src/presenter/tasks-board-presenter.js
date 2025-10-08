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
  #boardTasks = [];

  constructor(boardContainer, tasksModel) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#renderBoard();
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

    const tasksForStatus = this.#getTasksByStatus(this.#boardTasks, status);
    
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
    const clearButton = new ClearBasketButtonComponent();
    render(clearButton, container);
  }

  #getTasksByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
  }
}