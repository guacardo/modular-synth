import { AudioGraphNode, AudioParamName } from "../app/util";

/**
 * Data attributes for canvas overlay integration
 */
export interface CanvasDataAttributes {
    "data-node-id": string;
    "data-node-type"?: string;
    "data-param"?: string;
    "data-io-type"?: "input" | "output" | "param";
}

/**
 * Helper to generate data attributes for audio nodes
 */
export function createNodeDataAttributes(nodeId: string, nodeType?: string): CanvasDataAttributes {
    const attributes: CanvasDataAttributes = {
        "data-node-id": nodeId,
    };

    if (nodeType) {
        attributes["data-node-type"] = nodeType;
    }

    return attributes;
}

/**
 * Helper to generate data attributes for IO buttons
 */
export function createIODataAttributes(nodeId: string, ioType: "input" | "output" | "param", paramName?: string): CanvasDataAttributes {
    const attributes: CanvasDataAttributes = {
        "data-node-id": nodeId,
        "data-io-type": ioType,
    };

    if (paramName) {
        attributes["data-param"] = paramName;
    }

    return attributes;
}

/**
 * Helper to create a CSS class map with data attributes
 */
export function createIOClassMap(
    nodeId: string,
    ioType: "input" | "output" | "param",
    paramName?: string,
    additionalClasses: Record<string, boolean> = {}
): Record<string, boolean | string> {
    const classMap = {
        "io-button": true,
        [`io-${ioType}`]: true,
        ...additionalClasses,
    };

    // Add data attributes as properties (Lit will handle them)
    return {
        ...classMap,
        "data-node-id": nodeId,
        "data-io-type": ioType,
        ...(paramName && { "data-param": paramName }),
    };
}

/**
 * Utility to convert your existing connections array to canvas-ready format
 */
export function convertConnectionsToCanvasFormat(connections: Array<[string, string]>): Array<{
    id: string;
    source: { nodeId: string; paramName?: string };
    target: { nodeId: string; paramName?: string };
}> {
    return connections.map(([sourceId, targetId]) => {
        // Handle parameter connections (e.g., "nodeId-paramName")
        const sourceMatch = sourceId.match(/^(.+)-(.+)$/);
        const targetMatch = targetId.match(/^(.+)-(.+)$/);

        const source = sourceMatch ? { nodeId: sourceMatch[1], paramName: sourceMatch[2] } : { nodeId: sourceId };

        const target = targetMatch ? { nodeId: targetMatch[1], paramName: targetMatch[2] } : { nodeId: targetId };

        return {
            id: `${sourceId}->${targetId}`,
            source,
            target,
        };
    });
}

/**
 * Helper to determine node type from AudioGraphNode
 */
export function getNodeType(node: AudioGraphNode): string {
    if (node.node instanceof OscillatorNode) return "oscillator";
    if (node.node instanceof DelayNode) return "delay";
    if (node.node instanceof GainNode) return "gain";
    if (node.node instanceof BiquadFilterNode) return "biquad-filter";
    if (node.node instanceof StereoPannerNode) return "stereo-panner";
    if (node.node instanceof AudioDestinationNode) return "destination";
    return "unknown";
}

/**
 * Helper to get parameter info for a node
 */
export function getNodeParameters(node: AudioGraphNode): Array<{
    name: AudioParamName;
    param: AudioParam;
    displayName: string;
}> {
    const parameters: Array<{ name: AudioParamName; param: AudioParam; displayName: string }> = [];

    if (node.node instanceof DelayNode) {
        parameters.push({
            name: "delayTime" as AudioParamName,
            param: node.node.delayTime,
            displayName: "delay mod",
        });
    }

    if (node.node instanceof GainNode) {
        parameters.push({
            name: "gain" as AudioParamName,
            param: node.node.gain,
            displayName: "gain mod",
        });
    }

    if (node.node instanceof BiquadFilterNode) {
        parameters.push(
            {
                name: "frequency" as AudioParamName,
                param: node.node.frequency,
                displayName: "freq mod",
            },
            {
                name: "Q" as AudioParamName,
                param: node.node.Q,
                displayName: "Q mod",
            },
            {
                name: "gain" as AudioParamName,
                param: node.node.gain,
                displayName: "gain mod",
            }
        );
    }

    if (node.node instanceof StereoPannerNode) {
        parameters.push({
            name: "pan" as AudioParamName,
            param: node.node.pan,
            displayName: "pan mod",
        });
    }

    if (node.node instanceof OscillatorNode) {
        parameters.push(
            {
                name: "frequency" as AudioParamName,
                param: node.node.frequency,
                displayName: "freq mod",
            },
            {
                name: "detune" as AudioParamName,
                param: node.node.detune,
                displayName: "detune mod",
            }
        );
    }

    return parameters;
}

/**
 * Enhanced element position provider that uses the data attributes
 */
export function createEnhancedElementPositionProvider() {
    return (nodeId: string, paramName?: string): DOMRect | null => {
        let selector: string;

        if (paramName) {
            // Look for parameter-specific IO button
            selector = `[data-node-id="${nodeId}"][data-param="${paramName}"].io-button`;
        } else {
            // Look for output button first, then input as fallback
            selector = `[data-node-id="${nodeId}"][data-io-type="output"].io-button`;

            let element = document.querySelector(selector);
            if (!element) {
                // Fallback to input if no output found
                selector = `[data-node-id="${nodeId}"][data-io-type="input"].io-button`;
                element = document.querySelector(selector);
            }

            if (element) {
                return element.getBoundingClientRect();
            }
        }

        const element = document.querySelector(selector);
        return element?.getBoundingClientRect() || null;
    };
}

/**
 * Utility to enhance existing audio node views with canvas-ready attributes
 */
export function enhanceAudioNodeView(nodeElement: HTMLElement, graphNode: AudioGraphNode): void {
    const nodeType = getNodeType(graphNode);
    const nodeAttributes = createNodeDataAttributes(graphNode.id, nodeType);

    // Add node-level attributes
    Object.entries(nodeAttributes).forEach(([key, value]) => {
        if (value) {
            nodeElement.setAttribute(key, value);
        }
    });

    // Enhance IO buttons
    const ioContainers = nodeElement.querySelectorAll(".io-container");

    ioContainers.forEach((container) => {
        const button = container.querySelector(".io-button");
        const label = container.querySelector(".io-label");

        if (button && label) {
            const labelText = label.textContent?.toLowerCase() || "";

            // Determine IO type based on label
            let ioType: "input" | "output" | "param";
            let paramName: string | undefined;

            if (labelText.includes("in")) {
                ioType = "input";
            } else if (labelText.includes("out")) {
                ioType = "output";
            } else {
                ioType = "param";
                // Extract parameter name from label
                const parameters = getNodeParameters(graphNode);
                const matchingParam = parameters.find((p) => labelText.includes(p.displayName.toLowerCase()));
                paramName = matchingParam?.name;
            }

            const ioAttributes = createIODataAttributes(graphNode.id, ioType, paramName);
            Object.entries(ioAttributes).forEach(([key, value]) => {
                if (value) {
                    button.setAttribute(key, value);
                }
            });
        }
    });
}

/**
 * Utility to batch enhance multiple audio node views
 */
export function enhanceAllAudioNodeViews(audioNodes: AudioGraphNode[]): void {
    audioNodes.forEach((graphNode) => {
        // Find the corresponding DOM element
        const nodeElement = document.querySelector(`[data-node-id="${graphNode.id}"]`) as HTMLElement;

        if (!nodeElement) {
            // Try to find by component type
            const nodeType = getNodeType(graphNode);
            const componentSelectors = [`${nodeType}-node-view`, "audio-node-view", `[id*="${graphNode.id}"]`];

            for (const selector of componentSelectors) {
                const element = document.querySelector(selector) as HTMLElement;
                if (element) {
                    enhanceAudioNodeView(element, graphNode);
                    break;
                }
            }
        } else {
            enhanceAudioNodeView(nodeElement, graphNode);
        }
    });
}
