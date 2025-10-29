// view/loading-view-component.js
import { AbstractComponent } from './abstract-component.js';

function createLoadingTemplate() {
  return `
    <div class="loading-container">
      <p class="loading-message">Loading...</p>
      <div class="loading-spinner"></div>
    </div>
  `;
}

export default class LoadingViewComponent extends AbstractComponent {
  get template() {
    return createLoadingTemplate();
  }
}