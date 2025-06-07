import { AudioGraphNode, Position, KeyboardAudioEvent, updateAudioParamValue } from "../../../../app/util";

export class OscillatorGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected = false;
    node: OscillatorNode;
    keyboardEvents: Map<string, KeyboardAudioEvent>;
    dutyCycle: number = 0.5;
    constructor(context: AudioContext, position: Position, id: string, updateNode: (node: AudioGraphNode) => void) {
        this.node = context.createOscillator();
        this.node.start();
        this.position = position;
        this.id = id;
        this.keyboardEvents = new Map<string, KeyboardAudioEvent>([
            ["a", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 200 }) }) }],
            ["s", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 400 }) }) }],
            ["d", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 800 }) }) }],
            ["f", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 1600 }) }) }],
            ["g", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "sine" }) }) }],
            ["h", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "square" }) }) }],
            ["j", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "sawtooth" }) }) }],
            ["k", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "triangle" }) }) }],
        ]);
    }
}
