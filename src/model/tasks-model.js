// model/tasks-model.js
import Observable from '../framework/observable.js';
import { generateID } from '../utils.js';
import { UserAction, UpdateType } from '../const.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardTasks = [];

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return this.#boardTasks;
  }

  getTasksByStatus(status) {
    return this.#boardTasks.filter(task => task.status === status);
  }

  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      console.log('Tasks loaded from server:', tasks);
      this.#boardTasks = tasks.map(task => this.#adaptToClient(task));
    } catch(err) {
      console.error('Error loading tasks from server, using fallback data:', err);
      this.#boardTasks = this.#getFallbackTasks();
    }
    this._notify(UpdateType.INIT);
  }

  async addTask(title) {
    const newTask = {
      title,
      status: 'backlog',
      id: generateID(),
    };

    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      const adaptedTask = this.#adaptToClient(createdTask);
      this.#boardTasks.push(adaptedTask);
      this._notify(UserAction.ADD_TASK, adaptedTask);
      return adaptedTask;
    } catch (err) {
      console.error('Error adding task to server, adding locally:', err);
      // Добавляем задачу локально при ошибке
      this.#boardTasks.push(newTask);
      this._notify(UserAction.ADD_TASK, newTask);
      return newTask;
    }
  }

  async updateTaskStatus(taskId, newStatus) {
    const task = this.#boardTasks.find(task => task.id === taskId);
    if (task) {
      const previousStatus = task.status;
      task.status = newStatus;

      try {
        const updatedTask = await this.#tasksApiService.updateTask(task);
        Object.assign(task, updatedTask);
        this._notify(UserAction.UPDATE_TASK, task);
      } catch (err) {
        console.error('Error updating task status on server, keeping local change:', err);
        // Сохраняем локальное изменение даже при ошибке сервера
        this._notify(UserAction.UPDATE_TASK, task);
      }
    }
  }

  async clearBasketTasks() {
    const trashTasks = this.#boardTasks.filter(task => task.status === 'trash');
    console.log(`Clearing ${trashTasks.length} tasks from trash`);

    if (trashTasks.length === 0) {
      console.log('No tasks to clear from trash');
      return;
    }

    try {
      // Пытаемся удалить с сервера
      const deletePromises = trashTasks.map(task => 
        this.#tasksApiService.deleteTask(task.id).catch(err => {
          console.warn(`Failed to delete task ${task.id} from server:`, err);
          // Продолжаем даже если некоторые удаления не удались
        })
      );
      
      await Promise.allSettled(deletePromises);
      
      // Всегда очищаем локально, даже если серверные удаления не удались
      this.#boardTasks = this.#boardTasks.filter(task => task.status !== 'trash');
      this._notify(UserAction.DELETE_TASK, { status: 'trash' });
      
      console.log('Trash cleared successfully');
      
    } catch (err) {
      console.error('Unexpected error during trash clearing:', err);
      // Все равно очищаем локально
      this.#boardTasks = this.#boardTasks.filter(task => task.status !== 'trash');
      this._notify(UserAction.DELETE_TASK, { status: 'trash' });
    }
  }

  hasBasketTasks() {
    return this.#boardTasks.some(task => task.status === 'trash');
  }

  #adaptToClient(task) {
    const adaptedTask = {
      id: task.id,
      title: task.title,
      status: task.status || 'backlog',
    };

    return adaptedTask;
  }

  #getFallbackTasks() {
    return [
      {
        "title": "Выучить JavaScript",
        "status": "backlog",
        "id": "1"
      },
      {
        "title": "Сделать лабораторную работу", 
        "status": "in-process",
        "id": "2"
      },
      {
        "title": "Протестировать приложение",
        "status": "done", 
        "id": "3"
      },
      {
        "title": "Удаленная задача",
        "status": "trash",
        "id": "4"
      }
    ];
  }
}