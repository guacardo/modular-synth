import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./canvas-overlay.styles";
import { findDOMCoordinates } from "../../app/util";

@customElement("canvas-overlay")
export class CanvasOverlay extends LitElement {
    static styles = [styles];

    @property({ type: Array }) connections: Array<[string, string]>;

    resizeObserver?: ResizeObserver;

    firstUpdated() {
        this.resizeCanvas();
        this.drawConnections();
        this.resizeObserver = new ResizeObserver(() => {
            this.resizeCanvas();
            this.drawConnections();
        });
        this.resizeObserver.observe(this.renderRoot.querySelector(".canvas-overlay")!);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver?.disconnect();
    }

    updated(changedProps: Map<string, any>) {
        if (changedProps.has("connections")) {
            this.drawConnections();
        }
    }

    resizeCanvas() {
        const container = this.renderRoot.querySelector(".canvas-overlay") as HTMLElement;
        const canvas = this.renderRoot.querySelector("#canvas") as HTMLCanvasElement;
        if (container && canvas) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
    }

    drawConnections() {
        const canvas = this.renderRoot.querySelector("#canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(100, 100);
        ctx.strokeStyle = "#ff9800";
        ctx.lineWidth = 2;
        ctx.stroke();

        for (const [sourceId, targetId] of this.connections) {
            const [sourceX, sourceY] = findDOMCoordinates(sourceId);
            const [targetX, targetY] = findDOMCoordinates(targetId);
            ctx.beginPath();
            ctx.moveTo(sourceX, sourceY);
            ctx.lineTo(targetX, targetY);
            ctx.strokeStyle = "#ff9800";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    render() {
        return html`
            <div class="canvas-overlay">
                <canvas id="canvas"></canvas>
            </div>
        `;
    }
}
