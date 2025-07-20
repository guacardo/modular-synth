import { AudioGraphId, AudioGraphNode, AudioNodeType, KeyboardAudioEvent, Position, updateAudioParamValue } from "../../../../app/util";

export class StereoPannerGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    position: Position;
    isSelected: boolean;
    node: StereoPannerNode;
    keyboardEvents: Map<string, KeyboardAudioEvent>;
    type: AudioNodeType = "stereoPanner";

    getKeyboardEvents(updateNode: (node: AudioGraphNode) => void): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>([
            ["ArrowLeft", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: this.node.pan.value - 0.1 }) }) }],
            ["ArrowRight", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: this.node.pan.value + 0.1 }) }) }],
            ["l", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: -1 }) }) }],
            ["c", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: 0 }) }) }],
            ["r", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: 1 }) }) }],
        ]);
    }

    connectTo(target: AudioNode | AudioParam | undefined): boolean {
        if (!target) return false;
        try {
            if (target instanceof AudioNode) {
                this.node.connect(target);
            } else if (target instanceof AudioParam) {
                (this.node as any).connect(target);
            } else {
                return false;
            }
            return true;
        } catch (e) {
            console.error("Failed to connect:", e);
            return false;
        }
    }

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createStereoPanner();
        this.position = position;
        this.id = id;
    }
}
