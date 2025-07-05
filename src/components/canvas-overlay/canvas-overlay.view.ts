import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CanvasManager, ConnectionRenderer, Connection, ElementPositionProvider } from "../../canvas";
import { AudioGraphNode } from "../../app/util";
import { canvasOverlayStyles } from "./canvas-overlay.styles";

@customElement("canvas-overlay")
export class CanvasOverlay extends LitElement {
    static styles = [canvasOverlayStyles];

    @property({ type: Array }) connections: Array<[string, string]> = [];
    @property({ type: Array }) audioNodes: AudioGraphNode[] = [];
    @property({ type: Object, attribute: false }) nodeConnectState?: any;

    @state() private canvasManager?: CanvasManager;
    @state() private connectionRenderer?: ConnectionRenderer;

    private resizeObserver?: ResizeObserver;

    firstUpdated() {
        this.initializeCanvas();
        this.setupResizeObserver();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanup();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has("connections") || changedProperties.has("audioNodes")) {
            this.updateConnections();
        }
    }

    private initializeCanvas(): void {
        console.log("🎨 Initializing canvas overlay...");
        const canvas = this.shadowRoot?.querySelector("canvas") as HTMLCanvasElement;
        if (!canvas) {
            console.error("❌ Canvas element not found!");
            return;
        }

        console.log("✅ Canvas element found:", canvas);

        // Create canvas manager
        this.canvasManager = new CanvasManager({
            canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: "transparent",
            handleDevicePixelRatio: true,
        });

        // Create connection renderer
        this.connectionRenderer = new ConnectionRenderer({
            getElementPosition: this.createElementPositionProvider(),
            defaultStyle: {
                color: "#00ccff",
                width: 3,
                activeColor: "#00ff88",
                shadowBlur: 8,
                shadowColor: "rgba(0, 204, 255, 0.4)",
            },
            curveTension: 0.6,
            animated: true,
            animationSpeed: 0.5,
        });

        console.log("✅ Canvas manager created");
        console.log("✅ Connection renderer created");

        // Add renderer to canvas manager
        this.canvasManager.addRenderer(this.connectionRenderer);

        console.log("✅ Renderer added to canvas manager");

        // Initial connection update
        this.updateConnections();
    }

    private createElementPositionProvider(): ElementPositionProvider {
        return (nodeId: string, paramName?: string): DOMRect | null => {
            console.log(`🔍 Looking for element: nodeId=${nodeId}, paramName=${paramName}`);

            // Strategy: Find the audio node element, then find the specific IO button

            // First, find the node element by looking for elements that might contain the node ID
            const nodeSelectors = [
                `[data-node-id="${nodeId}"]`,
                `*[id*="${nodeId}"]`,
                // Fallback: search for any element containing the node ID in common attributes
                `*[class*="${nodeId}"]`,
            ];

            let nodeElement: Element | null = null;
            for (const selector of nodeSelectors) {
                nodeElement = document.querySelector(selector);
                if (nodeElement) {
                    console.log(`✅ Found node element with selector: ${selector}`);
                    break;
                }
            }

            // If we still don't have the node element, try a more general approach
            if (!nodeElement) {
                console.log("🔍 Trying fallback element detection...");
                // Look for any audio node component that might contain this ID
                const audioNodeElements = document.querySelectorAll(
                    "oscillator-node-view, delay-node-view, gain-node-view, biquad-filter-node-view, stereo-panner-view, audio-destination-node-view"
                );

                for (const element of audioNodeElements) {
                    // Check if this element's properties contain our node ID
                    const litElement = element as any;
                    if (litElement.graphNode?.id === nodeId) {
                        nodeElement = element;
                        console.log(`✅ Found node element via component property: ${element.tagName}`);
                        break;
                    }
                }
            }

            if (!nodeElement) {
                console.error(`❌ Could not find node element for: ${nodeId}`);
                return null;
            }

            // Now find the specific IO button within this node
            let ioButton: Element | null = null;

            if (paramName) {
                // For parameter connections (like delayTime modulation)
                // Look for buttons with data attributes or in containers with specific labels
                const paramSelectors = [`[data-param="${paramName}"] .io-button`, `[data-param-name="${paramName}"] .io-button`];

                for (const selector of paramSelectors) {
                    ioButton = nodeElement.querySelector(selector);
                    if (ioButton) break;
                }

                // Fallback: look for IO containers with labels that match the param name
                if (!ioButton) {
                    const ioContainers = nodeElement.querySelectorAll(".io-container");
                    for (const container of ioContainers) {
                        const label = container.querySelector(".io-label");
                        if (label && label.textContent?.includes(paramName)) {
                            ioButton = container.querySelector(".io-button");
                            if (ioButton) break;
                        }
                    }
                }
            } else {
                // For regular connections, determine if this is source or target
                const isSource = this.isSourceNode(nodeId);

                if (isSource) {
                    // Find the "out" button (usually the last io-container)
                    const ioContainers = nodeElement.querySelectorAll(".io-container");
                    for (let i = ioContainers.length - 1; i >= 0; i--) {
                        const container = ioContainers[i];
                        const label = container.querySelector(".io-label");
                        if (label && label.textContent?.toLowerCase().includes("out")) {
                            ioButton = container.querySelector(".io-button");
                            break;
                        }
                    }

                    // Fallback: use the last io-button
                    if (!ioButton) {
                        const buttons = nodeElement.querySelectorAll(".io-button");
                        ioButton = buttons[buttons.length - 1];
                    }
                } else {
                    // Find the "in" button (usually the first io-container)
                    const ioContainers = nodeElement.querySelectorAll(".io-container");
                    for (const container of ioContainers) {
                        const label = container.querySelector(".io-label");
                        if (label && label.textContent?.toLowerCase().includes("in")) {
                            ioButton = container.querySelector(".io-button");
                            break;
                        }
                    }

                    // Fallback: use the first io-button
                    if (!ioButton) {
                        ioButton = nodeElement.querySelector(".io-button");
                    }
                }
            }

            return ioButton?.getBoundingClientRect() || null;
        };
    }

    private isSourceNode(nodeId: string): boolean {
        // Check if this node is a source in any connection
        return this.connections.some(([sourceId]) => sourceId === nodeId || sourceId.startsWith(`${nodeId}-`));
    }

    private updateConnections(): void {
        console.log("🔗 Updating connections...", this.connections);

        if (!this.connectionRenderer) {
            console.error("❌ Connection renderer not found!");
            return;
        }

        // Convert the connections array to Connection objects
        const connectionObjects: Connection[] = this.connections.map(([sourceId, targetId]) => {
            console.log(`🔗 Processing connection: ${sourceId} -> ${targetId}`);

            // Handle parameter connections (e.g., "nodeId-paramName")
            const sourceMatch = sourceId.match(/^(.+)-(.+)$/);
            const targetMatch = targetId.match(/^(.+)-(.+)$/);

            const source = sourceMatch ? { nodeId: sourceMatch[1], paramName: sourceMatch[2] } : { nodeId: sourceId };

            const target = targetMatch ? { nodeId: targetMatch[1], paramName: targetMatch[2] } : { nodeId: targetId };

            // Determine if this connection is active/selected
            const isActive = this.nodeConnectState?.source?.id === source.nodeId || this.nodeConnectState?.target?.id === target.nodeId;

            return {
                id: `${sourceId}->${targetId}`,
                source,
                target,
                style: {
                    active: isActive,
                    // Different colors for parameter connections
                    color: sourceMatch || targetMatch ? "#ff6b6b" : "#00ccff",
                    activeColor: sourceMatch || targetMatch ? "#ff9999" : "#00ff88",
                },
            };
        });

        console.log("🔗 Connection objects created:", connectionObjects);
        this.connectionRenderer.setConnections(connectionObjects);
    }

    private setupResizeObserver(): void {
        this.resizeObserver = new ResizeObserver(() => {
            if (this.canvasManager) {
                this.canvasManager.resize(window.innerWidth, window.innerHeight);
            }
        });

        this.resizeObserver.observe(document.body);
    }

    private cleanup(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        if (this.canvasManager) {
            this.canvasManager.destroy();
        }
    }

    render() {
        return html`<canvas></canvas>`;
    }
}
