import { AudioGraphNode, Position, KeyboardAudioEvent, updateAudioParamValue, AudioNodeType } from "../../../../app/util";

export class OscillatorGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected: boolean;
    node: OscillatorNode;
    gainNode: GainNode;
    keyboardEvents: Map<string, KeyboardAudioEvent>;
    dutyCycle: number = 0.5;
    type: AudioNodeType = "oscillator";
    getKeyboardEvents(updateNode: (node: AudioGraphNode) => void): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>([
            ["a", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 200 }) }) }],
            ["s", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 300 }) }) }],
            ["d", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 400 }) }) }],
            ["f", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 500 }) }) }],
            ["g", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "sine" }) }) }],
            ["h", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "square" }) }) }],
            ["j", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "sawtooth" }) }) }],
            ["k", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "triangle" }) }) }],
            ["ArrowUp", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: this.node.frequency.value + 10 }) }) }],
            ["ArrowDown", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: this.node.frequency.value - 10 }) }) }],
            [
                "ArrowLeft",
                {
                    keydown: () => {
                        this.updateGain(Math.max(0, this.gainNode.gain.value - 0.05));
                        updateNode({ ...this });
                    },
                },
            ],
            [
                "ArrowRight",
                {
                    keydown: () => {
                        this.updateGain(Math.min(1, this.gainNode.gain.value + 0.05));
                        updateNode({ ...this });
                    },
                },
            ],
        ]);
    }

    connectTo(target: AudioGraphNode | AudioParam): boolean {
        if ("node" in target && target.node instanceof AudioNode && target.node.numberOfInputs > 0) {
            // Connect the gain node (output) instead of the oscillator directly
            this.gainNode.connect(target.node);
            return true;
        } else if (target instanceof AudioParam) {
            // Connect the gain node to the AudioParam
            this.gainNode.connect(target);
            return true;
        }
        return false;
    }

    updateGain(value: number): void {
        this.gainNode.gain.setValueAtTime(value, this.gainNode.context.currentTime);
    }

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createOscillator();
        this.gainNode = context.createGain();
        this.gainNode.gain.setValueAtTime(1.0, context.currentTime);
        this.node.connect(this.gainNode);
        this.node.start();
        this.position = position;
        this.id = id;
    }
}
