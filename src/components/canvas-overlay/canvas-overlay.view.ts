import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./canvas-overlay.styles";
import { ConnectionComponents, findDOMCoordinates } from "../../app/util";

@customElement("canvas-overlay")
export class CanvasOverlay extends LitElement {
    static styles = [styles];

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;

    @property({ type: Array }) connections: Array<[ConnectionComponents, ConnectionComponents]>;

    resizeObserver?: ResizeObserver;

    firstUpdated() {
        this.canvas = this.renderRoot.querySelector("#canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();
        this.resizeObserver = new ResizeObserver(() => {
            this.resizeCanvas();
        });
        this.resizeObserver.observe(this.renderRoot.querySelector(".canvas-overlay")!);
        requestAnimationFrame(this.draw.bind(this));
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
        if (!this.canvas || !this.ctx) return;

        const time = performance.now() * 0.003; // Animation time base

        for (const [i, [sourceId, targetId]] of this.connections.entries()) {
            const [sourceX, sourceY] = findDOMCoordinates(sourceId.join("-"));
            const [targetX, targetY] = findDOMCoordinates(targetId.join("-"));

            // Calculate the control point for the bezier curve to simulate cable sag
            const midX = (sourceX + targetX) / 2;
            const distance = Math.abs(targetX - sourceX);
            const sag = Math.min(distance * 0.35, 100);

            // Jiggle effect: sine wave based on time and wire index
            const jiggleAmplitude = Math.max(16, Math.min(distance * 0.16, 48));
            const jiggle = Math.sin(time * 2 + i * 2.4) * jiggleAmplitude;

            // Apply jiggle to controlY
            const controlY = Math.max(sourceY, targetY) + sag + jiggle;

            this.ctx.beginPath();
            this.ctx.moveTo(sourceX, sourceY);
            this.ctx.quadraticCurveTo(midX, controlY, targetX, targetY);
            this.ctx.strokeStyle = "#ff9800";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    draw() {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        requestAnimationFrame(this.draw.bind(this));
    }

    render() {
        return html`
            <div class="canvas-overlay">
                <canvas id="canvas"></canvas>
            </div>
        `;
    }
}
