import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { AudioGraph, GraphNode } from "../../app/audio-graph";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    @property({ attribute: false }) node: GraphNode;
    @property({ type: Object }) destination?: AudioDestinationNode;
    @property({ type: Object }) audioGraph?: AudioGraph;

    static styles = [graphNodeStyles];

    private _dispatchClick() {
        const node = this.node;
        this.dispatchEvent(new CustomEvent("node-clicked", { detail: { node }, bubbles: true, composed: true }));
    }

    render() {
        return html`<div id=${ifDefined(this.node?.id)} class="node" @click=${this._dispatchClick}>
            <p>${this.node?.id}</p>
            <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                @input="${(e: Event) => {
                    this.audioGraph?.updateAudioNode(this.node.audioNode as GainNode, { gain: (e.target as HTMLInputElement).value });
                }}"
            />
        </div>`;
    }
}
