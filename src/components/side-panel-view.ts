import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
	render() {
		html`<h1>Hello world side panel view</h1>`;
	}
}
