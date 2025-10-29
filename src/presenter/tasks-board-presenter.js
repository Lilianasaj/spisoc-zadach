import TaskListComponent from "../view/task-list-component.js";
import TaskComponent from "../view/task-component.js";
import TaskBoardComponent from "../view/task-board-component.js";
import ClearBasketButtonComponent from "../view/clear-basket-button-component.js";
import EmptyTaskListComponent from "../view/empty-task-list-component.js";
import LoadingViewComponent from "../view/loading-view-component.js";
import { render, remove } from "../framework/render.js";
import { Status, StatusLabel, UserAction, UpdateType } from "../const.js";

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #loadingComponent = new LoadingViewComponent();
  #taskListComponents = new Map();
  #clearButtonComponent = null;
  #isLoading = true;
  #isRendering = false;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;

    this.#tasksModel.addObserver(this.#handleModelEvent.bind(this));
  }

  get tasks() {
    return this.#tasksModel.tasks;
  }

  async init() {
    console.log("Инициализация презентера...");
    this.#renderLoading();

    try {
      await this.#tasksModel.init();
      // Не вызываем #renderBoard() вручную — модель вызовет INIT сама
    } catch (err) {
      console.error("Ошибка инициализации модели:", err);
    }
  }

  async createTask() {
    const taskTitle = document.querySelector("#add-task").value.trim();
    if (!taskTitle) return;

    try {
      await this.#tasksModel.addTask(taskTitle);
      document.querySelector("#add-task").value = "";
    } catch (err) {
      console.error("Ошибка при создании задачи:", err);
    }
  }

  #renderLoading() {
    this.#clearBoard();
    render(this.#loadingComponent, this.#boardContainer);
  }


  #renderBoard() {
    // Если доска уже отрисована — просто обновляем её содержимое
    if (this.#boardContainer.contains(this.#tasksBoardComponent.element)) {
      console.log('Доска уже есть — обновляем содержимое');
      this.#tasksBoardComponent.element.innerHTML = '';
    } else {
      console.log('Рендерим доску впервые');
      render(this.#tasksBoardComponent, this.#boardContainer);
    }

    // Чистим карту и заново рендерим колонки
    this.#taskListComponents.clear();

    Object.values(Status).forEach((status) => this.#renderTasksList(status));
  }

  #renderTasksList(status) {
    const tasksListComponent = new TaskListComponent({
      status: status,
      label: StatusLabel[status],
      onTaskDrop: (taskId) => this.#handleTaskDrop(taskId, status),
    });

    render(tasksListComponent, this.#tasksBoardComponent.element);
    this.#taskListComponents.set(status, tasksListComponent);

    const tasksForStatus = this.#getTasksByStatus(this.tasks, status);

    if (tasksForStatus.length === 0) {
      this.#renderEmptyList(tasksListComponent.getTasksContainer());
    } else {
      tasksForStatus.forEach((task) => {
        this.#renderTask(task, tasksListComponent.getTasksContainer());
      });
    }

    if (status === Status.TRASH) {
      this.#renderClearButton(tasksListComponent.element);
    }
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderEmptyList(container) {
    const emptyListComponent = new EmptyTaskListComponent();
    render(emptyListComponent, container);
  }

  #renderClearButton(container) {
    const hasTrashTasks = this.#tasksModel.hasBasketTasks();

    this.#clearButtonComponent = new ClearBasketButtonComponent({
      onClick: () => this.#handleClearBasketClick(),
      isDisabled: !hasTrashTasks,
    });

    render(this.#clearButtonComponent, container);
  }

  #getTasksByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
  }

  async #handleTaskDrop(taskId, newStatus) {
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error("Ошибка при обновлении статуса задачи:", err);
    }
  }

  async #handleClearBasketClick() {
    console.log("Начало очистки корзины...");
    try {
      await this.#tasksModel.clearBasketTasks();
      console.log("Корзина очищена успешно");
    } catch (err) {
      console.error("Ошибка при очистке корзины:", err);
    }
  }

  #clearBoard() {
    // Если компонент уже добавлен в DOM — удалить
    if (this.#tasksBoardComponent.element?.parentElement) {
      this.#tasksBoardComponent.element.remove();
    }

    // Очищаем карту списков
    this.#taskListComponents.clear();

    // Полная очистка контейнера
    this.#boardContainer.innerHTML = '';
  }

  #handleModelEvent(event, payload) {
    console.log("Событие модели:", event, "payload:", payload);

    if (this.#isRendering) {
      console.log("Предотвращена двойная обработка события");
      return;
    }

    this.#isRendering = true;

    try {
      switch (event) {
        case UserAction.ADD_TASK:
        case UserAction.UPDATE_TASK:
        case UserAction.DELETE_TASK:
        case UpdateType.PATCH:
        case UpdateType.MINOR:
        case UpdateType.MAJOR:
          this.#renderBoard();
          break;

        case UpdateType.INIT:
          this.#isLoading = false;

          //  Удаляем компонент загрузки, если он есть
          if (this.#loadingComponent?.element?.parentElement) {
            this.#loadingComponent.element.remove();
          }

          // Теперь рендерим доску
          this.#renderBoard();
          break;
      }
    } finally {
      this.#isRendering = false;
    }
  }

}
