import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sidePanelStyles } from "../styles/side-panel-styles";
import { AudioGraph } from "../app/audio-graph";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
	static styles = [sidePanelStyles];

	@property({ type: Object })
	audioGraph?: AudioGraph;

	render() {
		return html` <div class="side-panel-container">
			<h1>Hello world side panel view</h1>
			<div class="audio-graph-node-container">${this.audioGraph?.graphNodes.map((node) => html`<div>${node.type}</div>`)}</div>
		</div>`;
	}
}
