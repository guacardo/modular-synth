import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./gain-node-view";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    render() {
        return html`
            <div>
                <h1>Nodes</h1>
                <gain-node-view></gain-node-view>
            </div>
        `;
    }
}
