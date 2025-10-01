import TaskListComponent from "../view/task-list-component.js";
import TaskComponent from "../view/task-component.js";
import TaskBoardComponent from "../view/task-board-component.js";
import ClearBasketButtonComponent from "../view/clear-basket-button-component.js";
import { render } from "../framework/render.js";
import { Status, StatusLabel } from "../const.js";

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #boardTasks = [];

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.getTasks()];
    render(this.#tasksBoardComponent, this.#boardContainer);

    const statuses = [
      Status.BACKLOG,
      Status.PROCESSING,
      Status.DONE,
      Status.TRASH,
    ];

    statuses.forEach((status) => {
      const tasksListComponent = new TaskListComponent(StatusLabel[status]);
      render(tasksListComponent, this.#tasksBoardComponent.getElement());

      const taskContainer = tasksListComponent.getTasksContainer();

      this.#boardTasks
        .filter((task) => task.status === status)
        .forEach((task) => {
          const taskComponent = new TaskComponent(task);
          render(taskComponent, taskContainer);
        });

      //Добавляем кнопку в корзину
      if (status === Status.TRASH) {
        const clearButton = new ClearBasketButtonComponent();
        render(clearButton, tasksListComponent.getElement());
      }
    });
  }
}