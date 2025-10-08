// model/tasks-model.js
import { tasks } from '../mock/task.js';

export default class TasksModel {
  #boardTasks = tasks;

  get tasks() {
    return this.#boardTasks;
  }
}