# Canvas Integration Helpers

This module provides utilities to enhance your existing audio node views for seamless integration with the canvas overlay system.

## Quick Start

### 1. Using Lit Directives (Recommended)

The easiest way to enhance your existing audio node views is using the provided Lit directives:

```typescript
import { canvasNode, canvasIO } from '../../canvas';

// In your audio node view template:
render() {
    return html`
        <!-- Add canvas attributes to the node container -->
        <div class="node" ${canvasNode(this.graphNode.id, 'delay')}>

            <!-- Add canvas attributes to IO buttons -->
            <div class="io-container">
                <button
                    class="io-button"
                    ${canvasIO(this.graphNode.id, 'input')}
                    @click=${...}>
                </button>
                <label>in</label>
            </div>

            <!-- Parameter-specific buttons -->
            <div class="io-container">
                <button
                    class="io-button"
                    ${canvasIO(this.graphNode.id, 'param', 'delayTime')}
                    @click=${...}>
                </button>
                <label>delay mod</label>
            </div>

            <!-- Output button -->
            <div class="io-container">
                <button
                    class="io-button"
                    ${canvasIO(this.graphNode.id, 'output')}
                    @click=${...}>
                </button>
                <label>out</label>
            </div>
        </div>
    `;
}
```

### 2. Using Helper Functions

If you prefer manual attribute management:

```typescript
import { createNodeDataAttributes, createIODataAttributes } from "../../canvas";

// Get attributes for a node container
const nodeAttrs = createNodeDataAttributes(this.graphNode.id, "delay");
// Returns: { 'data-node-id': 'node-123', 'data-node-type': 'delay' }

// Get attributes for IO buttons
const inputAttrs = createIODataAttributes(this.graphNode.id, "input");
const outputAttrs = createIODataAttributes(this.graphNode.id, "output");
const paramAttrs = createIODataAttributes(this.graphNode.id, "param", "delayTime");
```

### 3. Automatic Enhancement

For existing components without template changes:

```typescript
import { enhanceAllAudioNodeViews } from '../../canvas';

// Call this after your audio nodes are rendered
connectedCallback() {
    super.connectedCallback();
    // Wait for render, then enhance
    setTimeout(() => {
        enhanceAllAudioNodeViews(this.audioNodes);
    }, 0);
}
```

## Canvas Overlay Integration

Add the canvas overlay to your main app:

```typescript
import { CanvasOverlay } from './components/canvas-overlay/canvas-overlay.view';

render() {
    return html`
        <!-- Your existing content -->
        <div class="app-content">
            <!-- Audio nodes -->
        </div>

        <!-- Canvas overlay for connections -->
        <canvas-overlay
            .connections=${this.connections}
            .audioNodes=${this.audioNodes}
            .nodeConnectState=${this.nodeConnectState}>
        </canvas-overlay>
    `;
}
```

## Data Attributes Reference

The canvas overlay system uses these data attributes to locate elements:

-   `data-node-id`: Unique identifier for the audio node
-   `data-node-type`: Type of audio node (oscillator, delay, etc.)
-   `data-io-type`: Type of IO button (input, output, param)
-   `data-param`: Parameter name for parameter-specific connections

## Connection Format

The system works with your existing connections array format:

```typescript
// Regular connections
connections = [
    ["oscillator-1", "delay-1"], // oscillator output -> delay input
    ["delay-1", "destination"], // delay output -> destination
];

// Parameter connections
connections = [
    ["oscillator-2", "delay-1-delayTime"], // oscillator -> delay time parameter
];
```

## Supported Node Types

The helpers automatically detect these node types:

-   `oscillator` - OscillatorNode
-   `delay` - DelayNode
-   `gain` - GainNode
-   `biquad-filter` - BiquadFilterNode
-   `stereo-panner` - StereoPannerNode
-   `destination` - AudioDestinationNode

## Parameter Detection

Common parameters are automatically detected:

-   **DelayNode**: `delayTime`
-   **GainNode**: `gain`
-   **BiquadFilterNode**: `frequency`, `Q`, `gain`
-   **StereoPannerNode**: `pan`
-   **OscillatorNode**: `frequency`, `detune`

## Styling

The canvas overlay uses these default styles but can be customized:

```typescript
const connectionRenderer = new ConnectionRenderer({
    defaultStyle: {
        color: "#00ccff", // Connection color
        width: 3, // Line width
        activeColor: "#00ff88", // Active connection color
        shadowBlur: 8, // Glow effect
        shadowColor: "rgba(0, 204, 255, 0.4)",
    },
    curveTension: 0.6, // Curve smoothness (0-1)
    animated: true, // Enable flow animation
    animationSpeed: 0.5, // Animation speed
});
```

## Troubleshooting

### Connections Not Appearing

1. Check that your IO buttons have the correct data attributes
2. Verify the canvas overlay is added to your main template
3. Ensure connections array is being passed to the overlay

### Element Detection Issues

1. Use browser dev tools to verify data attributes are present
2. Check that node IDs match between connections and attributes
3. Try the programmatic enhancement if directives aren't working

### Performance

The canvas overlay automatically starts/stops based on whether connections exist and only redraws when necessary. For best performance:

-   Keep connection arrays stable (don't recreate on every render)
-   Use the provided directives rather than manual DOM manipulation
-   Consider debouncing rapid connection changes
