import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraph } from "../app/audio-graph";
import { audioGraphStyles } from "../styles/audio-graph-styles";
import { FrequencyChangeDetail, OscillatorTypeChangeDetail } from "./oscillator-node-view";
import { GainChangeDetail } from "./gain-node-view";
import {
    BiquadFilterDetuneChangeDetail,
    BiquadFilterFrequencyChangeDetail,
    BiquadFilterGainChangeDetail,
    BiquadFilterQChangeDetail,
    BiquadFilterTypeChangeDetail,
} from "./biquad-filter-node-view";
import "./biquad-filter-node-view";
import "./gain-node-view";
import "./oscillator-node-view";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    static styles = [audioGraphStyles];

    @property({ type: Object })
    audioGraph?: AudioGraph;

    private handleFrequencyChange(e: CustomEvent) {
        const frequencyChange = e.detail.frequencyChange as FrequencyChangeDetail;
        this.audioGraph?.graphNodes?.map((node) => {
            if (node === frequencyChange.node) {
                (node.audioNode as OscillatorNode).frequency.setValueAtTime(
                    frequencyChange.frequency,
                    this.audioGraph!.context.currentTime
                );
            }
        });
    }

    private handleOscillatorTypeChange(e: CustomEvent) {
        const typeChange = e.detail.typeChange as OscillatorTypeChangeDetail;
        this.audioGraph?.graphNodes?.map((node) => {
            if (node === typeChange.node) {
                (node.audioNode as OscillatorNode).type = typeChange.type;
            }
        });
    }

    private handleBiquadFilterTypeChange(e: CustomEvent) {
        const typeChange = e.detail.typeChange as BiquadFilterTypeChangeDetail;
        this.audioGraph?.graphNodes?.map((node) => {
            if (node === typeChange.node) {
                (node.audioNode as BiquadFilterNode).type = typeChange.type;
            }
        });
    }

    private handleGainChange(e: CustomEvent) {
        const gainChange = e.detail.gainChange as GainChangeDetail;
        this.audioGraph?.graphNodes?.map((node) => {
            if (node === gainChange.node) {
                (node.audioNode as GainNode).gain.exponentialRampToValueAtTime(
                    gainChange.gain,
                    this.audioGraph?.context.currentTime! + 0.1
                );
            }
        });
    }

    private handleBiquadFrequencyChange(e: CustomEvent) {
        console.log(e.detail);
        const frequencyChange = e.detail.frequencyChange as BiquadFilterFrequencyChangeDetail;
        this.audioGraph?.graphNodes.map((node) => {
            if (node === frequencyChange.node) {
                (node.audioNode as BiquadFilterNode).frequency.setValueAtTime(
                    frequencyChange.frequency,
                    this.audioGraph!.context.currentTime
                );
            }
        });
    }

    private handleBiquadDetuneChange(e: CustomEvent) {
        const detuneChange = e.detail.detuneChange as BiquadFilterDetuneChangeDetail;
        this.audioGraph?.graphNodes.map((node) => {
            if (node === detuneChange.node) {
                (node.audioNode as BiquadFilterNode).detune.setValueAtTime(detuneChange.detune, this.audioGraph!.context.currentTime);
            }
        });
    }

    private handleBiquadQChange(e: CustomEvent) {
        const qChange = e.detail.qChange as BiquadFilterQChangeDetail;
        this.audioGraph?.graphNodes.map((node) => {
            if (node === qChange.node) {
                (node.audioNode as BiquadFilterNode).Q.setValueAtTime(qChange.q, this.audioGraph!.context.currentTime);
            }
        });
    }

    private handleBiquadGainChange(e: CustomEvent) {
        const gainChange = e.detail.gainChange as BiquadFilterGainChangeDetail;
        this.audioGraph?.graphNodes.map((node) => {
            if (node === gainChange.node) {
                (node.audioNode as BiquadFilterNode).gain.setValueAtTime(gainChange.gain, this.audioGraph!.context.currentTime);
            }
        });
    }

    render() {
        return html`<div>graph view</div>`;
    }
}
