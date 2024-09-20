import { html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { DomSpace } from "../app/dom-mediator";
import { styleMap } from "lit/directives/style-map.js";

interface ConnectionStyles extends Record<string, number | string> {
    top: number | string;
    left: number | string;
    width: number | string;
    height: number | string;
}

const relationTypes = ["above", "below", "left", "right", "unknown"] as const;
type RelationType = (typeof relationTypes)[number];

const direction = ["horizontal", "vertical"] as const;
type DirectionType = (typeof direction)[number];

@customElement("connection-view")
export class ConnectionView extends LitElement {
    @property({ type: Object, attribute: false }) source?: DomSpace;
    @property({ type: Object, attribute: false }) dest?: DomSpace;
    @query("#canvas") canvas?: HTMLCanvasElement;

    private _styles: ConnectionStyles;
    constructor() {
        super();
        this._styles = {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            position: "absolute",
        };
    }

    private _getRelativePositioning(): Record<DirectionType, RelationType> {
        const relation: Record<DirectionType, RelationType> = {
            horizontal: "unknown",
            vertical: "unknown",
        };
        if (this.source !== undefined && this.dest !== undefined) {
            if (this.source.position.y <= this.dest.position.y) {
                relation["vertical"] = "above";
            }
            if (this.source.position.y > this.dest.position.y) {
                relation["vertical"] = "below";
            }
            if (this.source.position.x < this.dest.position.x) {
                relation["horizontal"] = "left";
            }
            if (this.source.position.x + this.source.offset.x > this.dest.position.x) {
                relation["horizontal"] = "right";
            }
        }
        return relation;
    }

    private _setStyles() {
        if (this.source !== undefined && this.dest !== undefined) {
            console.log(this._getRelativePositioning());
            if (this._getRelativePositioning().vertical === "above") {
                this._styles.top = this.source.position.y - 32;
                this._styles.height = this.dest.position.y - (this.source.position.y - this.source.offset.y);
            }

            if (this._getRelativePositioning().vertical === "below") {
                this._styles.top = this.dest.position.y - 32;
                this._styles.height = this.source.position.y + this.source.offset.y - this.dest.position.y;
            }

            if (this._getRelativePositioning().horizontal === "left") {
                this._styles.left = this.source.position.x + this.source.offset.x - 16;
                this._styles.width = this.dest.position.x - (this.source.position.x + this.source.offset.x);
            }

            if (this._getRelativePositioning().horizontal === "right") {
                this._styles.left = this.dest.position.x - 16;
                this._styles.width = this.source.position.x + this.source.offset.x - this.dest.position.x;
            }
        }
    }

    private _toStringMapCSS(): ConnectionStyles {
        return {
            top: `${this._styles.top}px`,
            left: `${this._styles.left}px`,
            width: `${this._styles.width}px`,
            height: `${this._styles.height}px`,
            position: `absolute`,
        };
    }

    private _renderCanvas() {
        if (this.canvas && this.source && this.dest) {
            this.canvas.width = Number(this._styles.width);
            this.canvas.height = Number(this._styles.height);
            const ctx = this.canvas?.getContext("2d");
            const width = Number(this._styles.width);
            const height = Number(this._styles.height);
            const relationship = this._getRelativePositioning();
            if (ctx !== null) {
                ctx.strokeStyle = "#CCC";
                ctx.beginPath();
                if (relationship.vertical === "above" && relationship.horizontal === "left") {
                    ctx.moveTo(0, this.source.offset.y / 2);
                    ctx.bezierCurveTo(
                        30,
                        this.source.offset.y / 2,
                        width - 30,
                        height - this.dest.offset.y / 2,
                        width,
                        height - this.dest.offset.y / 2
                    );
                }
                if (this._getRelativePositioning().vertical === "below" && relationship.horizontal === "left") {
                    ctx.moveTo(0, height - this.source.offset.y / 2);
                    ctx.bezierCurveTo(
                        30,
                        height - this.source.offset.y / 2,
                        width - 30,
                        this.dest.offset.y / 2,
                        width,
                        this.dest.offset.y / 2
                    );
                }
                ctx?.stroke();
            }
        }
    }

    render() {
        this._setStyles();
        this._renderCanvas();
        return html` <div style=${styleMap(this._toStringMapCSS())}>
            <canvas id="canvas"></canvas>
        </div>`;
    }
}
