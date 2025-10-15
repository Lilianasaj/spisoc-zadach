// view/task-board-component.js
import { AbstractComponent } from './abstract-component.js';

function createTaskBoardComponentTemplate() {
  return `
    <div class="desk"></div>
  `;
}

export default class TaskBoardComponent extends AbstractComponent {
  get template() {
    return createTaskBoardComponentTemplate();
  }
}