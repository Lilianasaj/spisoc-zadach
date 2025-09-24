import HeaderComponent from "./view/header-component.js";
import FormAddTaskComponent from "./view/form-add-task-component.js";
import TaskBoardComponent from "./view/task-board-component.js";
import TaskListComponent from "./view/task-list-component.js";
import TaskComponent from "./view/task-component.js";
import { render, RenderPosition } from "./framework/render.js";

const bodyContainer = document.querySelector(".app");
const formContainer = document.querySelector(".add-task-form");
const taskBoardContainer = document.querySelector(".task-board");

const taskBoardComponent = new TaskBoardComponent();
const taskListContainer = taskBoardComponent.getElement();

render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);
render(new FormAddTaskComponent(), formContainer, RenderPosition.AFTERBEGIN);
render(taskBoardComponent, taskBoardContainer, RenderPosition.AFTERBEGIN);

for (let i = 0; i < 4; i++) {
  const taskListComponent = new TaskListComponent();
  render(taskListComponent, taskListContainer);

  const taskContainer = taskListComponent.getElement();

  for (let j = 0; j < 4; j++) {
    const taskComponent = new TaskComponent(`Задача ${j + 1}`);
    render(taskComponent, taskContainer);
  }
}