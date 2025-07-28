import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraphNode, ConnectionComponents } from "../../app/util";
import { OscillatorGraphNode } from "../audio-nodes/source/oscillator-node/oscillator-graph-node";
import { coachingTextStyles } from "./coaching-text.styles";
import { appStyles } from "../../styles/app-styles";
import { AudioDestinationGraphNode } from "../audio-nodes/destination/audio-destination-node/audio-destination-graph-node";
import { GainGraphNode } from "../audio-nodes/processing/gain-node/gain-graph-node";

@customElement("coaching-text-view")
export class CoachingTextView extends LitElement {
    static styles = [coachingTextStyles, appStyles];

    @property({ type: Array }) audioGraph: AudioGraphNode[];
    @property({ type: Array }) connections: Array<[ConnectionComponents, ConnectionComponents]>;

    headerText = () => {
        let text = "Welcome to Willy's Rack Shack";

        return text;
    };

    coachingText = () => {
        let text = "uhh...";

        if (
            this.audioGraph.some((node) => node.state.isSelected) &&
            this.audioGraph.some((node) => node instanceof OscillatorGraphNode) &&
            this.audioGraph.some((node) => node instanceof GainGraphNode) &&
            this.audioGraph.some((node) => node instanceof AudioDestinationGraphNode) &&
            this.audioGraph.length > 3
        ) {
            text = "sick.";
        } else if (
            this.audioGraph.some((node) => node instanceof OscillatorGraphNode) &&
            this.audioGraph.some((node) => node instanceof GainGraphNode) &&
            this.audioGraph.some((node) => node instanceof AudioDestinationGraphNode) &&
            this.audioGraph.length > 3
        ) {
            text = "You can 'select' oscillators for some keyboard controls";
        } else if (
            this.audioGraph.some((node) => node instanceof OscillatorGraphNode) &&
            this.audioGraph.some((node) => node instanceof GainGraphNode) &&
            this.audioGraph.some((node) => node instanceof AudioDestinationGraphNode) &&
            this.connections.length > 1
        ) {
            text = "BEEEEEP! Nice work. Now time to experiment. Add more nodes: Delay, Biquad Filter, more Oscillators as modulators. Slide the sliders.";
        } else if (
            this.audioGraph.some((node) => node instanceof OscillatorGraphNode) &&
            this.audioGraph.some((node) => node instanceof GainGraphNode) &&
            this.audioGraph.some((node) => node instanceof AudioDestinationGraphNode)
        ) {
            text = "Awesome, but still no sound. Let's connect everything. Oscillator:out to Gain:in, Gain:out to Audio Destination:in.";
        } else if (this.audioGraph.some((node) => node instanceof OscillatorGraphNode) && this.audioGraph.some((node) => node instanceof GainGraphNode)) {
            text = "Huge gains. Now let's get some speakers to send this to. Add an Audio Destination.";
        } else if (this.audioGraph.some((node) => node instanceof OscillatorGraphNode)) {
            text = "Ride the wave. add a gain node to control the volume.";
        } else if (this.audioGraph.length === 0) {
            text = "Add an audio node: try an Oscillator...";
        }

        return text;
    };

    render() {
        return html`<div class="coaching-text-container"
            ><h1 class="header-text">${this.headerText()}</h1><h2 class="instruction-text">${this.coachingText()}</h2></div
        >`;
    }
}
