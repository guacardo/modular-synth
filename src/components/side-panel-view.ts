import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { sidePanelStyles } from "../styles/side-panel-styles";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
	static styles = [sidePanelStyles];

	render() {
		return html` <div class="side-panel-container">
			<h1>Hello world side panel view</h1>
		</div>`;
	}
}
