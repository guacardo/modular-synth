import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { audioGridStyles } from "./audio-grid.styles";
import { EmptyNodeView } from "../empty-node/empty-node.view";
import { NewNodeView } from "../new-node/new-node.view";
import { AddNodeHandler, GridAudioNode, Position } from "../../app/util";

@customElement("audio-grid-view")
export class AudioGridView extends LitElement {
    static styles = [audioGridStyles];

    @property({ type: Array }) private gridAudioNodes: GridAudioNode[];
    @property() private handleAddNode: AddNodeHandler;

    @state() private _grid: Map<number, LitElement[]>;

    constructor() {
        super();
        this._buildEmptyGrid();
    }

    private _buildEmptyGrid() {
        const newGrid = new Map<number, LitElement[]>();
        for (let i = 0; i < 10; i++) {
            const emptyNodeArray: LitElement[] = [];
            for (let j = 0; j < 10; j++) {
                emptyNodeArray.push(document.createElement("empty-node-view") as EmptyNodeView);
            }
            newGrid.set(i, emptyNodeArray);
        }
        this._grid = newGrid;
        this.requestUpdate();
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
        console.log(this.gridAudioNodes);
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
                                }
                            })}
                        </div>
                    `
                )}
            </div>
        `;
    }
}
