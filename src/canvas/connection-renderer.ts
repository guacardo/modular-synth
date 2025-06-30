import { CanvasRenderer } from "./canvas-manager";

/**
 * Represents a point in 2D space
 */
export interface Point {
    x: number;
    y: number;
}

/**
 * Represents a connection between two audio nodes
 */
export interface Connection {
    /**
     * Unique identifier for this connection
     */
    id: string;

    /**
     * Source node ID and optional parameter name (for parameter connections)
     */
    source: {
        nodeId: string;
        paramName?: string;
    };

    /**
     * Target node ID and optional parameter name (for parameter connections)
     */
    target: {
        nodeId: string;
        paramName?: string;
    };

    /**
     * Visual styling for this connection
     */
    style?: ConnectionStyle;
}

/**
 * Visual styling options for connections
 */
export interface ConnectionStyle {
    /**
     * Stroke color
     * @default '#ffffff'
     */
    color?: string;

    /**
     * Line width
     * @default 2
     */
    width?: number;

    /**
     * Whether the connection is active/selected
     * @default false
     */
    active?: boolean;

    /**
     * Active color (when connection is selected)
     * @default '#00ff00'
     */
    activeColor?: string;

    /**
     * Shadow blur for glow effect
     * @default 0
     */
    shadowBlur?: number;

    /**
     * Shadow color
     * @default 'rgba(255, 255, 255, 0.5)'
     */
    shadowColor?: string;
}

/**
 * Function type for getting DOM element positions
 */
export type ElementPositionProvider = (nodeId: string, paramName?: string) => DOMRect | null;

/**
 * Configuration for the connection renderer
 */
export interface ConnectionRendererOptions {
    /**
     * Function to get the position of IO elements in the DOM
     */
    getElementPosition: ElementPositionProvider;

    /**
     * Default connection style
     */
    defaultStyle?: Partial<ConnectionStyle>;

    /**
     * Curve tension for bezier connections (0 = straight, 1 = very curved)
     * @default 0.5
     */
    curveTension?: number;

    /**
     * Whether connections should animate
     * @default false
     */
    animated?: boolean;

    /**
     * Animation speed for flowing effect
     * @default 1
     */
    animationSpeed?: number;
}

/**
 * Renders audio node connections as bezier curves
 */
export class ConnectionRenderer implements CanvasRenderer {
    private connections: Connection[] = [];
    private options: Required<ConnectionRendererOptions>;
    private animationTime = 0;

    constructor(options: ConnectionRendererOptions) {
        this.options = {
            getElementPosition: options.getElementPosition,
            defaultStyle: {
                color: "#ffffff",
                width: 2,
                active: false,
                activeColor: "#00ff00",
                shadowBlur: 0,
                shadowColor: "rgba(255, 255, 255, 0.5)",
                ...options.defaultStyle,
            },
            curveTension: options.curveTension ?? 0.5,
            animated: options.animated ?? false,
            animationSpeed: options.animationSpeed ?? 1,
        };
    }

    /**
     * Update the connections to render
     */
    setConnections(connections: Connection[]): void {
        this.connections = connections;
    }

    /**
     * Add a single connection
     */
    addConnection(connection: Connection): void {
        const existingIndex = this.connections.findIndex((c) => c.id === connection.id);
        if (existingIndex >= 0) {
            this.connections[existingIndex] = connection;
        } else {
            this.connections.push(connection);
        }
    }

    /**
     * Remove a connection by ID
     */
    removeConnection(connectionId: string): void {
        this.connections = this.connections.filter((c) => c.id !== connectionId);
    }

    /**
     * Clear all connections
     */
    clearConnections(): void {
        this.connections = [];
    }

    render(ctx: CanvasRenderingContext2D, _width: number, _height: number, deltaTime: number): void {
        if (this.options.animated) {
            this.animationTime += deltaTime * this.options.animationSpeed;
        }

        for (const connection of this.connections) {
            this.renderConnection(ctx, connection);
        }
    }

    onResize?(_width: number, _height: number): void {
        // Connection positions are based on DOM elements, so no specific resize handling needed
    }

    private renderConnection(ctx: CanvasRenderingContext2D, connection: Connection): void {
        // Get source and target positions
        const sourceRect = this.options.getElementPosition(connection.source.nodeId, connection.source.paramName);
        const targetRect = this.options.getElementPosition(connection.target.nodeId, connection.target.paramName);

        if (!sourceRect || !targetRect) {
            return; // Skip if elements not found
        }

        // Calculate connection points (center of the IO buttons)
        const sourcePoint: Point = {
            x: sourceRect.left + sourceRect.width / 2,
            y: sourceRect.top + sourceRect.height / 2,
        };

        const targetPoint: Point = {
            x: targetRect.left + targetRect.width / 2,
            y: targetRect.top + targetRect.height / 2,
        };

        // Apply connection style
        const style = { ...this.options.defaultStyle, ...connection.style };
        const color = style.active ? style.activeColor : style.color;

        ctx.strokeStyle = color!;
        ctx.lineWidth = style.width!;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Apply shadow/glow effect
        if (style.shadowBlur! > 0) {
            ctx.shadowBlur = style.shadowBlur!;
            ctx.shadowColor = style.shadowColor!;
        }

        // Draw the bezier curve
        this.drawBezierConnection(ctx, sourcePoint, targetPoint);

        // Reset shadow
        ctx.shadowBlur = 0;

        // Draw animated flow effect if enabled
        if (this.options.animated) {
            const fullStyle = { ...this.options.defaultStyle, ...connection.style } as Required<ConnectionStyle>;
            this.drawFlowEffect(ctx, sourcePoint, targetPoint, fullStyle);
        }
    }

    private drawBezierConnection(ctx: CanvasRenderingContext2D, source: Point, target: Point): void {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate control points for a smooth curve
        const tension = this.options.curveTension;
        const controlOffset = Math.max(50, distance * tension);

        // Control points create a horizontal-ish curve
        const cp1: Point = {
            x: source.x + controlOffset,
            y: source.y,
        };

        const cp2: Point = {
            x: target.x - controlOffset,
            y: target.y,
        };

        // Draw the bezier curve
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, target.x, target.y);
        ctx.stroke();
    }

    private drawFlowEffect(ctx: CanvasRenderingContext2D, source: Point, target: Point, style: Required<ConnectionStyle>): void {
        // Create a flowing dot effect along the connection
        const flowSpeed = 0.001; // Adjust speed
        const flowPosition = (this.animationTime * flowSpeed) % 1;

        // Calculate position along the bezier curve
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const controlOffset = Math.max(50, distance * this.options.curveTension);

        const cp1: Point = {
            x: source.x + controlOffset,
            y: source.y,
        };

        const cp2: Point = {
            x: target.x - controlOffset,
            y: target.y,
        };

        // Calculate point on bezier curve
        const t = flowPosition;
        const mt = 1 - t;
        const mt2 = mt * mt;
        const t2 = t * t;

        const flowPoint: Point = {
            x: mt2 * mt * source.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t2 * t * target.x,
            y: mt2 * mt * source.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t2 * t * target.y,
        };

        // Draw flowing dot
        ctx.fillStyle = style.active ? style.activeColor! : style.color!;
        ctx.beginPath();
        ctx.arc(flowPoint.x, flowPoint.y, style.width! * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
