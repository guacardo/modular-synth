import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { updateAudioParamValue } from "../../app/util";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    @property({ type: Object }) node: GainNode;

    static styles = [graphNodeStyles];

    private updateGain(value: number) {
        updateAudioParamValue(this.node, { gain: value }, this.node.context);
    }

    render() {
        return html`<div class="node">
            <p>Gain ${this.node.gain.value.toFixed(3)}</p>
            <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                .value="${this.node.gain.value.toString()}"
                @input="${(e: Event) => {
                    this.updateGain((e.target as HTMLInputElement).valueAsNumber);
                }}"
            />
        </div>`;
    }
}
