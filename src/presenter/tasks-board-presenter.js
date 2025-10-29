// presenter/tasks-board-presenter.js
import TaskListComponent from "../view/task-list-component.js";
import TaskComponent from "../view/task-component.js";
import TaskBoardComponent from "../view/task-board-component.js";
import ClearBasketButtonComponent from "../view/clear-basket-button-component.js";
import EmptyTaskListComponent from "../view/empty-task-list-component.js";
import LoadingViewComponent from "../view/loading-view-component.js";
import { render } from "../framework/render.js";
import { Status, StatusLabel, UserAction, UpdateType } from "../const.js";

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #loadingComponent = new LoadingViewComponent();
  #taskListComponents = new Map();
  #clearButtonComponent = null;
  #isLoading = true;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;

    // Исправляем: убираем # перед handleModelEvent
    this.#tasksModel.addObserver(this.#handleModelEvent.bind(this));
  }

  get tasks() {
    return this.#tasksModel.tasks;
  }

  async init() {
    console.log('🔄 Начало инициализации презентера...');
    
    // Показываем загрузку
    this.#renderLoading();
    
    try {
      await this.#tasksModel.init();
      console.log(' Модель инициализирована');
      
    } catch(err) {
      console.error(' Ошибка инициализации модели:', err);
    } finally {
      // Всегда снимаем состояние загрузки
      console.log('🏁 Завершение инициализации');
      this.#isLoading = false;
      this.#clearBoard();
      this.#renderBoard();
    }
  }

  async createTask() {
    const taskTitle = document.querySelector('#add-task').value.trim();
    if (!taskTitle) {
      return;
    }

    try {
      await this.#tasksModel.addTask(taskTitle);
      document.querySelector('#add-task').value = '';
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  }

  #renderLoading() {
    console.log(' Отрисовка компонента загрузки...');
    if (this.#boardContainer) {
      this.#boardContainer.innerHTML = '';
      render(this.#loadingComponent, this.#boardContainer);
    }
  }

  #renderBoard() {
    console.log(' Отрисовка доски, isLoading:', this.#isLoading);
    
    if (this.#isLoading) {
      console.log('  Пропускаем отрисовку - все еще загружается');
      return;
    }

    if (!this.#boardContainer) {
      console.error(' Контейнер доски не найден');
      return;
    }

    console.log(' Начинаем отрисовку доски задач');
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach((status) => {
      this.#renderTasksList(status);
    });
    
    console.log(' Доска задач полностью отрисована');
  }

  #renderTasksList(status) {
    const tasksListComponent = new TaskListComponent({
      status: status,
      label: StatusLabel[status],
      onTaskDrop: (taskId) => this.#handleTaskDrop(taskId, status)
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
      isDisabled: !hasTrashTasks
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
      console.error('Ошибка при обновлении статуса задачи:', err);
    }
  }

  async #handleClearBasketClick() {
    console.log('Clearing basket...');
    try {
      await this.#tasksModel.clearBasketTasks();
      console.log('Basket cleared successfully');
    } catch (err) {
      console.error('Error during basket clearing:', err);
    }
  }

  #clearBoard() {
    console.log(' Очистка доски...');
    if (this.#boardContainer) {
      this.#boardContainer.innerHTML = '';
    }
    this.#clearButtonComponent = null;
  }

  // ИСПРАВЛЕНО: правильное объявление приватного метода
  #handleModelEvent = (event, payload) => {
    console.log(' Событие модели:', event);
    
    switch (event) {
      case UserAction.ADD_TASK:
      case UserAction.UPDATE_TASK:
      case UserAction.DELETE_TASK:
        console.log(' Обновление из-за пользовательского действия');
        this.#clearBoard();
        this.#renderBoard();
        if (this.#clearButtonComponent) {
          this.#clearButtonComponent.toggleDisabled(!this.#tasksModel.hasBasketTasks());
        }
        break;
        
      case UpdateType.INIT:
        console.log('Событие INIT получено');
        this.#isLoading = false;
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };
}