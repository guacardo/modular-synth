import { AudioGraphNode, AudioNodeType, AudioParamName, KeyboardAudioEvent, Position, updateAudioParamValue } from "../../../../app/util";

export class StereoPannerGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected: boolean;
    node: StereoPannerNode;
    keyboardEvents: Map<string, KeyboardAudioEvent>;
    type: AudioNodeType = "stereo-panner";

    getKeyboardEvents(updateNode: (node: AudioGraphNode) => void): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>([
            ["ArrowLeft", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: this.node.pan.value - 0.1 }) }) }],
            ["ArrowRight", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: this.node.pan.value + 0.1 }) }) }],
            ["l", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: -1 }) }) }],
            ["c", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: 0 }) }) }],
            ["r", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: 1 }) }) }],
        ]);
    }

    connectTo(target: AudioGraphNode | AudioParam): boolean {
        if ("node" in target && target.node instanceof AudioNode && target.node.numberOfInputs > 0) {
            this.node.connect(target.node);
            return true;
        } else if (target instanceof AudioParam) {
            this.node.connect(target);
        }
        return false;
    }

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createStereoPanner();
        this.position = position;
        this.id = id;
    }
}
