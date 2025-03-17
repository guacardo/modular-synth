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

    @state() private _grid: Map<number, LitElement[]>;

    constructor() {
        super();
        this._buildEmptyGrid();
    }

    private _buildEmptyGrid() {
        this._grid = new Map().set(0, [document.createElement("empty-node-view") as EmptyNodeView]);
        this.requestUpdate();
    }

    private _renderGrid(): Map<number, LitElement[]> {
        const renderGrid = new Map<number, LitElement[]>();
        if (this.audioGraph.gridAudioNodes.length === 0) {
            renderGrid.set(0, [document.createElement("empty-node-view") as EmptyNodeView]);
        } else {
            this.audioGraph.gridAudioNodes.map((node) => {
                console.log(node);
            });
        }
        return renderGrid;
    }

    private swapToNewNodeView(position: Position) {
        const [rowIndex, colIndex] = position;
        const row = this._grid.get(rowIndex);
        if (row) {
            const newNodeView = document.createElement("new-node-view") as NewNodeView;
            const newRow = [...row];
            newRow[colIndex] = newNodeView;
            const newGrid = new Map(this._grid);
            newGrid.set(rowIndex, newRow);
            this._grid = newGrid;
            this.requestUpdate();
        }
    }

    render() {
        console.log(this._renderGrid());
        return html`
            <div class="grid">
                ${Array.from(this._grid.values()).map(
                    (row, rowIndex) => html`
                        <div class="row" key=${rowIndex}>
                            ${row.map((node, colIndex) => {
                                const position: Position = [rowIndex, colIndex];
                                if (node instanceof EmptyNodeView) {
                                    return html`
                                        <empty-node-view
                                            key=${colIndex}
                                            .position=${position}
                                            .handleSwapToNewNodeView=${this.swapToNewNodeView.bind(this)}
                                        ></empty-node-view>
                                    `;
                                } else if (node instanceof NewNodeView) {
                                    return html`<new-node-view .handleAddNode=${this.handleAddNode} .position=${position}></new-node-view>`;
                                } else if (node instanceof GridGainNode) {
                                    return html`<gain-node-view
                                        .gainNode=${node as GridGainNode}
                                        .audioGraph=${this.audioGraph}
                                        .handleUpdateNode=${this.handleUpdateNode}
                                    ></gain-node-view>`;
                                } else if (node instanceof GridOscillatorNode) {
                                    return html`<oscillator-node-view
                                        .oscillatorNode=${node as GridOscillatorNode}
                                        .audioGraph=${this.audioGraph}
                                        .handleUpdateNode=${this.handleUpdateNode}
                                    ></oscillator-node-view>`;
                                } else if (node instanceof GridBiquadFilterNode) {
                                    return html`<biquad-filter-node-view
                                        .biquadFilterNode=${node}
                                        .destination=${this.audioGraph?.context.destination}
                                    ></biquad-filter-node-view>`;
                                } else {
                                    return html`<p>ERroR: nOT a n Audio Noooode</p>`;
                                }
                            })}
                        </div>
                    `
                )}
            </div>
        `;
    }
}
