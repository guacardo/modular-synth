/**
 * Interface for objects that can render to a canvas
 */
export interface CanvasRenderer {
    /**
     * Render content to the canvas context
     * @param ctx - The 2D rendering context
     * @param width - Canvas width in pixels
     * @param height - Canvas height in pixels
     * @param deltaTime - Time since last frame in milliseconds
     */
    render(ctx: CanvasRenderingContext2D, width: number, height: number, deltaTime: number): void;

    /**
     * Optional method called when the canvas is resized
     * @param width - New canvas width
     * @param height - New canvas height
     */
    onResize?(width: number, height: number): void;
}

/**
 * Configuration options for the canvas manager
 */
export interface CanvasManagerOptions {
    /**
     * Canvas element to manage (if not provided, one will be created)
     */
    canvas?: HTMLCanvasElement;

    /**
     * Initial width of the canvas
     */
    width: number;

    /**
     * Initial height of the canvas
     */
    height: number;

    /**
     * Whether to automatically handle device pixel ratio for crisp rendering
     * @default true
     */
    handleDevicePixelRatio?: boolean;

    /**
     * Whether to automatically resize canvas when container resizes
     * @default false
     */
    autoResize?: boolean;

    /**
     * Container element to observe for resize (required if autoResize is true)
     */
    container?: HTMLElement;

    /**
     * Background color to clear canvas with each frame
     * @default 'transparent'
     */
    backgroundColor?: string;

    /**
     * Whether to clear the canvas before each render
     * @default true
     */
    clearBeforeRender?: boolean;
}

/**
 * Generic canvas manager that handles rendering lifecycle and manages multiple renderers
 */
export class CanvasManager {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private renderers: Set<CanvasRenderer> = new Set();
    private animationId?: number;
    private isRunning = false;
    private lastFrameTime = 0;
    private resizeObserver?: ResizeObserver;
    private options: Required<Omit<CanvasManagerOptions, "canvas" | "container">> & Pick<CanvasManagerOptions, "container">;

    constructor(options: CanvasManagerOptions) {
        // Set default options
        this.options = {
            width: options.width,
            height: options.height,
            handleDevicePixelRatio: options.handleDevicePixelRatio ?? true,
            autoResize: options.autoResize ?? false,
            container: options.container,
            backgroundColor: options.backgroundColor ?? "transparent",
            clearBeforeRender: options.clearBeforeRender ?? true,
        };

        // Create or use provided canvas
        this.canvas = options.canvas ?? document.createElement("canvas");

        // Get 2D context
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Failed to get 2D rendering context");
        }
        this.ctx = ctx;

        // Set initial size
        this.resize(this.options.width, this.options.height);

        // Setup auto-resize if requested
        if (this.options.autoResize && this.options.container) {
            this.setupAutoResize();
        }
    }

    /**
     * Get the canvas element
     */
    get canvasElement(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Get the rendering context
     */
    get context(): CanvasRenderingContext2D {
        return this.ctx;
    }

    /**
     * Get current canvas dimensions
     */
    get dimensions(): { width: number; height: number } {
        return {
            width: this.canvas.width / (this.options.handleDevicePixelRatio ? window.devicePixelRatio : 1),
            height: this.canvas.height / (this.options.handleDevicePixelRatio ? window.devicePixelRatio : 1),
        };
    }

    /**
     * Add a renderer to the render loop
     */
    addRenderer(renderer: CanvasRenderer): void {
        this.renderers.add(renderer);

        // If we have a renderer and we're not running, auto-start
        if (this.renderers.size === 1 && !this.isRunning) {
            this.start();
        }
    }

    /**
     * Remove a renderer from the render loop
     */
    removeRenderer(renderer: CanvasRenderer): void {
        this.renderers.delete(renderer);

        // If we have no more renderers, auto-stop
        if (this.renderers.size === 0 && this.isRunning) {
            this.stop();
        }
    }

    /**
     * Clear all renderers
     */
    clearRenderers(): void {
        this.renderers.clear();
        if (this.isRunning) {
            this.stop();
        }
    }

    /**
     * Start the render loop
     */
    start(): void {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.requestFrame();
    }

    /**
     * Stop the render loop
     */
    stop(): void {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = undefined;
        }
    }

    /**
     * Resize the canvas
     */
    resize(width: number, height: number): void {
        const pixelRatio = this.options.handleDevicePixelRatio ? window.devicePixelRatio : 1;

        // Set display size
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        // Set actual canvas size accounting for device pixel ratio
        this.canvas.width = width * pixelRatio;
        this.canvas.height = height * pixelRatio;

        // Scale context to match device pixel ratio
        if (this.options.handleDevicePixelRatio && pixelRatio !== 1) {
            this.ctx.scale(pixelRatio, pixelRatio);
        }

        // Notify renderers of resize
        this.renderers.forEach((renderer) => {
            renderer.onResize?.(width, height);
        });
    }

    /**
     * Destroy the canvas manager and clean up resources
     */
    destroy(): void {
        this.stop();
        this.clearRenderers();

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = undefined;
        }
    }

    /**
     * Force a single render frame (useful for static rendering)
     */
    renderFrame(): void {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.render(deltaTime);
        this.lastFrameTime = currentTime;
    }

    private setupAutoResize(): void {
        if (!this.options.container) {
            return;
        }

        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                this.resize(width, height);
            }
        });

        this.resizeObserver.observe(this.options.container);
    }

    private requestFrame(): void {
        if (!this.isRunning) {
            return;
        }

        this.animationId = requestAnimationFrame((currentTime) => {
            const deltaTime = currentTime - this.lastFrameTime;
            this.render(deltaTime);
            this.lastFrameTime = currentTime;
            this.requestFrame();
        });
    }

    private render(deltaTime: number): void {
        const { width, height } = this.dimensions;

        // Clear canvas if requested
        if (this.options.clearBeforeRender) {
            if (this.options.backgroundColor === "transparent") {
                this.ctx.clearRect(0, 0, width, height);
            } else {
                this.ctx.fillStyle = this.options.backgroundColor;
                this.ctx.fillRect(0, 0, width, height);
            }
        }

        // Render all renderers
        this.renderers.forEach((renderer) => {
            this.ctx.save();
            try {
                renderer.render(this.ctx, width, height, deltaTime);
            } catch (error) {
                console.error("Error in canvas renderer:", error);
            }
            this.ctx.restore();
        });
    }
}
