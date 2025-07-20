import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./canvas-overlay.styles";
import { ConnectionComponents, findDOMCoordinates } from "../../app/util";

@customElement("canvas-overlay")
export class CanvasOverlay extends LitElement {
    static styles = [styles];

    @property({ type: Array }) connections: Array<[ConnectionComponents, ConnectionComponents]>;

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
            const [sourceX, sourceY] = findDOMCoordinates(sourceId.join("-"));
            const [targetX, targetY] = findDOMCoordinates(targetId.join("-"));

            // Calculate the control point for the bezier curve to simulate cable sag
            const midX = (sourceX + targetX) / 2;
            const distance = Math.abs(targetX - sourceX);
            // Create a sag that's proportional to the horizontal distance
            // Quarter-inch cable sag - approximately 18 pixels for a 6-foot cable span
            const sag = Math.min(distance * 0.15, 50); // Max sag of 50px
            const controlY = Math.max(sourceY, targetY) + sag;

            ctx.beginPath();
            ctx.moveTo(sourceX, sourceY);
            ctx.quadraticCurveTo(midX, controlY, targetX, targetY);
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
