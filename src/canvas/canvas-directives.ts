import { Directive, directive, PartInfo, PartType } from "lit/directive.js";
import { AttributePart } from "lit";
import { createIODataAttributes, CanvasDataAttributes } from "./integration-helpers";

/**
 * Lit directive for adding canvas overlay data attributes to IO buttons
 */
class CanvasIODirective extends Directive {
    constructor(partInfo: PartInfo) {
        super(partInfo);
        if (partInfo.type !== PartType.ELEMENT) {
            throw new Error("canvasIO directive can only be used on elements");
        }
    }

    render(nodeId: string, ioType: "input" | "output" | "param", paramName?: string) {
        return createIODataAttributes(nodeId, ioType, paramName);
    }

    update(part: AttributePart, [nodeId, ioType, paramName]: [string, "input" | "output" | "param", string?]) {
        const attributes = createIODataAttributes(nodeId, ioType, paramName);

        // Apply attributes to the element
        Object.entries(attributes).forEach(([key, value]) => {
            if (value) {
                part.element.setAttribute(key, value);
            }
        });

        return attributes;
    }
}

/**
 * Directive to add canvas overlay data attributes to IO buttons
 *
 * Usage in Lit templates:
 * ```html
 * <button
 *   class="io-button"
 *   ${canvasIO(this.graphNode.id, 'output')}
 *   @click=${...}>
 * </button>
 *
 * <button
 *   class="io-button"
 *   ${canvasIO(this.graphNode.id, 'param', 'delayTime')}
 *   @click=${...}>
 * </button>
 * ```
 */
export const canvasIO = directive(CanvasIODirective);

/**
 * Simple directive for adding node-level data attributes
 */
class CanvasNodeDirective extends Directive {
    constructor(partInfo: PartInfo) {
        super(partInfo);
        if (partInfo.type !== PartType.ELEMENT) {
            throw new Error("canvasNode directive can only be used on elements");
        }
    }

    render(nodeId: string, nodeType?: string) {
        const attributes: CanvasDataAttributes = {
            "data-node-id": nodeId,
        };

        if (nodeType) {
            attributes["data-node-type"] = nodeType;
        }

        return attributes;
    }

    update(part: AttributePart, [nodeId, nodeType]: [string, string?]) {
        const attributes: CanvasDataAttributes = {
            "data-node-id": nodeId,
        };

        if (nodeType) {
            attributes["data-node-type"] = nodeType;
        }

        // Apply attributes to the element
        Object.entries(attributes).forEach(([key, value]) => {
            if (value) {
                part.element.setAttribute(key, value);
            }
        });

        return attributes;
    }
}

/**
 * Directive to add canvas overlay data attributes to node containers
 *
 * Usage in Lit templates:
 * ```html
 * <div class="node" ${canvasNode(this.graphNode.id, 'delay')}>
 *   <!-- node content -->
 * </div>
 * ```
 */
export const canvasNode = directive(CanvasNodeDirective);
