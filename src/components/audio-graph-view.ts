import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./gain-node-view";
import { GraphNode } from "../nodes";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    @property()
    graphNodes?: GraphNode[];

    render() {
        console.log(this.graphNodes);
        return html` <div> ${this.graphNodes?.map((node) => html`<span>${node.type}</span>`)} </div> `;
    }
}
