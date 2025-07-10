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
        const rampGain = (value: number) => {
            const now = this.gainNode.context.currentTime;
            this.gainNode.gain.cancelScheduledValues(now);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(value, now + 0.05);
        };
        return new Map<string, KeyboardAudioEvent>([
            [
                "a",
                {
                    keydown: () => {
                        updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 20 }) });
                        rampGain(1);
                    },
                    keyup: () => rampGain(0),
                },
            ],
            [
                "s",
                {
                    keydown: () => {
                        updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 40 }) });
                        rampGain(1);
                    },
                    keyup: () => rampGain(0),
                },
            ],
            [
                "d",
                {
                    keydown: () => {
                        updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 800 }) });
                        rampGain(1);
                    },
                    keyup: () => rampGain(0),
                },
            ],
            [
                "f",
                {
                    keydown: () => {
                        updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: 1600 }) });
                        rampGain(1);
                    },
                    keyup: () => rampGain(0),
                },
            ],
            ["g", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "sine" }) }), keyup: () => {} }],
            ["h", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "square" }) }), keyup: () => {} }],
            ["j", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "sawtooth" }) }), keyup: () => {} }],
            ["k", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { type: "triangle" }) }), keyup: () => {} }],
            [
                "ArrowUp",
                {
                    keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: this.node.frequency.value + 10 }) }),
                    keyup: () => {},
                },
            ],
            [
                "ArrowDown",
                {
                    keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { frequency: this.node.frequency.value - 10 }) }),
                    keyup: () => {},
                },
            ],
        ]);
    }
    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createOscillator();
        this.gainNode = context.createGain();
        this.gainNode.gain.value = 0;
        this.node.connect(this.gainNode);
        this.gainNode.connect(context.destination);
        this.node.start();
        this.position = position;
        this.id = id;
    }
}
