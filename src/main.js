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

const tasksBoardPresenter = new TasksBoardPresenter(
  taskBoardContainer,
  tasksModel
);

render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);
render(new FormAddTaskComponent(), formContainer);

tasksBoardPresenter.init();