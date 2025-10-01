import { tasks } from '../mock/task.js';
export default class TasksModel {
    #boardTasks = tasks;
    getTasks() {
        return this.#boardTasks;
    }
}