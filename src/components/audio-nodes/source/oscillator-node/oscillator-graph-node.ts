import { AudioGraphNode, Position, KeyboardAudioEvent, updateAudioParamValue, AudioNodeType } from "../../../../app/util";

export class OscillatorGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected: boolean;
    node: OscillatorNode;
    keyboardEvents: Map<string, KeyboardAudioEvent>;
    dutyCycle: number = 0.5;
    type: AudioNodeType = "oscillator";
    getKeyboardEvents(updateNode: (node: AudioGraphNode) => void): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>([
            ["a", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 200 }) }) }],
            ["s", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 400 }) }) }],
            ["d", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 800 }) }) }],
            ["f", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 1600 }) }) }],
            ["g", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "sine" }) }) }],
            ["h", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "square" }) }) }],
            ["j", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "sawtooth" }) }) }],
            ["k", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "triangle" }) }) }],
            ["ArrowUp", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: this.node.frequency.value + 10 }) }) }],
            ["ArrowDown", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: this.node.frequency.value - 10 }) }) }],
        ]);
    }
    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createOscillator();
        this.node.start();
        this.position = position;
        this.id = id;
    }
}
