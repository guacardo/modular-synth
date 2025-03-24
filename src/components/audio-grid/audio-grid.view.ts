import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { audioGridStyles } from "./audio-grid.styles";
import { EmptyNodeView } from "../empty-node/empty-node.view";
import { NewNodeView } from "../new-node/new-node.view";
import {
    AddNodeHandler,
    AudioNodeProperties,
    GridAudioNode,
    GridBiquadFilterNode,
    GridGainNode,
    GridOscillatorNode,
    Position,
} from "../../app/util";
import { AudioGraphStore } from "../audio-graph/audio-graph.store";

@customElement("audio-grid-view")
export class AudioGridView extends LitElement {
    static styles = [audioGridStyles];

    @property({ type: Object }) private audioGraph: AudioGraphStore;
    @property() private handleAddNode: AddNodeHandler;
    @property() handleUpdateNode: (node: GridAudioNode, properties: AudioNodeProperties) => void;

    @state() private _audioGrid: LitElement[][];

    constructor() {
        super();
        this._fileNew();
    }

    private _fileNew() {
        const foo = new Array();
        foo[0][0] = document.createElement("empty-node-view") as EmptyNodeView;
    }

    render() {
        return html`<p>hello world</p>`;
    }
}
