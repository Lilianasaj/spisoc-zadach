// src/main.js
import HeaderComponent from "./view/header-component.js";
import FormAddTaskComponent from "./view/form-add-task-component.js";
import TasksBoardPresenter from "./presenter/tasks-board-presenter.js";
import { render, RenderPosition } from "./framework/render.js";
import TasksModel from "./model/tasks-model.js";

const bodyContainer = document.querySelector(".app");
const formContainer = document.querySelector(".add-task-form");
const taskBoardContainer = document.querySelector(".task-board");

const tasksModel = new TasksModel();

const tasksBoardPresenter = new TasksBoardPresenter({
  boardContainer: taskBoardContainer,
  tasksModel: tasksModel
});

function handleNewTaskButtonClick() {
  tasksBoardPresenter.createTask();
}

const formAddTaskComponent = new FormAddTaskComponent({
  onClick: handleNewTaskButtonClick
});

render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);
render(formAddTaskComponent, formContainer);

tasksBoardPresenter.init();