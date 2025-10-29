// src/main.js
import HeaderComponent from "./view/header-component.js";
import FormAddTaskComponent from "./view/form-add-task-component.js";
import TasksBoardPresenter from "./presenter/tasks-board-presenter.js";
import TasksModel from "./model/tasks-model.js";
import TasksApiService from "./tasks-api-service.js";
import { render, RenderPosition } from "./framework/render.js";

const END_POINT = 'https://690277c5b208b24affe63fdb.mockapi.io/';
const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const tasksBoardContainer = document.querySelector('.taskboard');

console.log('Запуск приложения...');

const tasksApiService = new TasksApiService(END_POINT);
const tasksModel = new TasksModel({
  tasksApiService: tasksApiService
});

const tasksBoardPresenter = new TasksBoardPresenter({
  boardContainer: tasksBoardContainer,
  tasksModel: tasksModel
});

function handleNewTaskButtonClick() {
  console.log('Клик по кнопке добавления задачи');
  tasksBoardPresenter.createTask();
}

const formAddTaskComponent = new FormAddTaskComponent({
  onClick: handleNewTaskButtonClick
});

render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);
render(formAddTaskComponent, formContainer);

// Запускаем инициализацию
tasksBoardPresenter.init().then(() => {
  console.log('Приложение полностью инициализировано');
});