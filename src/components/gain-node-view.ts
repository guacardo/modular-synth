import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../styles/graph-node-styles";
import { GraphNode } from "../model/audio-graph";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
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
        return html`<div class="node" @click=${this._dispatchClick}>
            <p>${this.node?.type} ${this.node?.id}</p>
            <input type="range" />
        </div>`;
    }
}
