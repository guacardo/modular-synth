import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { GraphNode } from "../../app/audio-graph";
import { ifDefined } from "lit/directives/if-defined.js";

// export higher up? types file?
const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [graphNodeStyles];

    @property({ attribute: false })
    node?: GraphNode;

    private _dispatchClick() {
        const node = this.node;
        // todo, strongly type the custom event https://github.com/lit/lit-element/issues/808
        this.dispatchEvent(new CustomEvent("node-clicked", { detail: { node }, composed: true }));
    }

    render() {
        return html`<div id=${ifDefined(this.node?.id)} class="node" @click=${this._dispatchClick}>
            <p>${this.node?.id}</p>
            <input
                type="range"
                min="0"
                max="2000"
                @input=${(e: Event) => {
                    console.log(e);
                }}
                @click=${(e: Event) => e.stopPropagation()}
                draggable="true"
                @dragstart=${(e: DragEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            />
            <select
                @change=${(e: Event) => {
                    console.log(e);
                }}
                @click=${(e: Event) => e.stopPropagation()}
            >
                ${settableOscillatorTypes.map((type) => {
                    return html`<option
                        value=${type}
                        ?selected=${type === ((this.node?.audioNode as OscillatorNode).type as OscillatorType)}
                    >
                        ${type}
                    </option>`;
                })}
            </select>
        </div>`;
    }
}
