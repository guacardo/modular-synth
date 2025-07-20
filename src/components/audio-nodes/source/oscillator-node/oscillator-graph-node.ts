import { AudioGraphNode, Position, KeyboardAudioEvent, updateAudioParamValue, AudioNodeType, AudioGraphId, IOLabel } from "../../../../app/util";

export class OscillatorGraphNode implements AudioGraphNode {
    id: AudioGraphId;
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

    connectTo(target: AudioNode | AudioParam | undefined): boolean {
        console.log("OscillatorGraphNode connectTo", target);
        if (target instanceof AudioNode) {
            this.gainNode.connect(target);
        } else if (target instanceof AudioParam) {
            this.node.connect(target);
        } else {
            console.error("Failed to connect");
            return false;
        }
        return true;
    }

    requestConnect(target: IOLabel): AudioNode | AudioParam | undefined {
        console.warn("Oscillator nodes do not support input connections.", target);
        return undefined; // Oscillator nodes do not have input connections, so this is not applicable.
    }

    updateGain(value: number): void {
        this.gainNode.gain.setValueAtTime(value, this.gainNode.context.currentTime);
    }

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createOscillator();
        this.gainNode = context.createGain();
        this.gainNode.gain.setValueAtTime(1.0, context.currentTime);
        this.node.connect(this.gainNode);
        this.node.start();
        this.position = position;
        this.id = id;
    }
}
