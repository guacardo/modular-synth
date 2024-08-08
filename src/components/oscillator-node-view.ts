import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../styles/graph-node-styles";
import { GraphNode } from "../model/audio-graph";
import { classMap } from "lit/directives/class-map.js";

@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [graphNodeStyles];

    @property({ attribute: false })
    node?: GraphNode;

    @property({ type: Boolean })
    isSourceNode: boolean = false;

    private _dispatchClick() {
        const node = this.node;
        this.dispatchEvent(new CustomEvent("node-clicked", { detail: { node }, bubbles: true, composed: true }));
    }

    render() {
        return html`<div class="${classMap({ node: true, source: this.isSourceNode })}" @click=${this._dispatchClick}>
            <p>${this.node?.type} ${this.node?.id}</p>
            <p>${this.node?.connections}</p>
            <input type="range" />
        </div>`;
    }
}
