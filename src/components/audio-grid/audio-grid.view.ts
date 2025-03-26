import { LitElement, TemplateResult, html } from "lit";
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

    @state() private _visualAudioGrid: TemplateResult[][];

    constructor() {
        super();
        this._fileNew();
    }

    private _fileNew() {
        const foo: TemplateResult[][] = [[]];
        foo[0][0] = html`<empty-node-view
            .position=${[0, 0]}
            .handleSwapToNewNodeView=${this.swapToNewNodeView.bind(this)}
        ></empty-node-view>`;
        this._visualAudioGrid = foo;
    }

    private swapToNewNodeView(position: Position) {
        const newGrid: TemplateResult[][] = this._visualAudioGrid.map((row) => [...row]);
        newGrid[position[0]][position[1]] = html`<new-node-view
            .handleAddNode=${this.handleAddNode}
            .position=${position}
        ></new-node-view>`;
        this._visualAudioGrid = newGrid;
    }

    private constructGridFromGraph() {
        const newGrid: TemplateResult[][] = this._visualAudioGrid.map((row) => [...row]);
        this.audioGraph.gridAudioNodes.map((node) => {
            if (node instanceof GridGainNode) {
                newGrid[node.position[0]][node.position[1]] = html`<gain-node-view
                    .gainNode=${node}
                    .audioGraph=${this.audioGraph}
                    .handleUpdateNode=${this.handleUpdateNode}
                ></gain-node-view>`;
            } else if (node instanceof GridOscillatorNode) {
                newGrid[node.position[0]][node.position[1]] = html`<oscillator-node-view
                    .oscillatorNode=${node}
                    .audioGraph=${this.audioGraph}
                    .handleUpdateNode=${this.handleUpdateNode}
                ></oscillator-node-view>`;
            } else if (node instanceof GridBiquadFilterNode) {
                newGrid[node.position[0]][node.position[1]] = html`<biquad-filter-node-view
                    .biquadFilterNode=${node}
                ></biquad-filter-node-view>`;
            } else {
                console.error("not a legal grid node to lit element");
            }
        });

        // Append an empty-node-view to the end of each row
        newGrid.forEach((row, rowIndex) => {
            console.log(row.length);
            if (row.length > 1) {
                row.push(
                    html`<empty-node-view
                        .position=${[rowIndex, row.length]}
                        .handleSwapToNewNodeView=${this.swapToNewNodeView.bind(this)}
                    ></empty-node-view>`
                );
            }
        });

        // Add a new row at the bottom with a single empty-node-view
        if (newGrid.length > 1) {
            console.log(newGrid.length);
            newGrid.push([
                html`<empty-node-view
                    .position=${[newGrid.length, 0]}
                    .handleSwapToNewNodeView=${this.swapToNewNodeView.bind(this)}
                ></empty-node-view>`,
            ]);
        }

        this._visualAudioGrid = newGrid;
    }

    render() {
        this.constructGridFromGraph();
        return html`<div class="grid">
            ${this._visualAudioGrid.map((row, rowIndex) => {
                return row.map((node, colIndex) => {
                    return html`<div class="${rowIndex} ${colIndex}">${node}</div>`;
                });
            })}</div
        >`;
    }
}
