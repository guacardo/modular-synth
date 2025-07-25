import {
    AudioGraphId,
    AudioGraphNode,
    AudioGraphNodeState,
    AudioNodeType,
    IOLabel,
    KeyboardAudioEvent,
    Position,
    updateAudioParamValue,
} from "../../../../app/util";

interface OscillatorGraphNodeState extends AudioGraphNodeState {
    frequency: number;
    type: OscillatorType;
    gain: number;
    dutyCycle: number;
}

export class OscillatorGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    node: OscillatorNode;
    gainNode: GainNode;
    type: AudioNodeType = "oscillator";
    state: OscillatorGraphNodeState = {
        position: [0, 0],
        isSelected: false,
        frequency: 440,
        type: "sine",
        gain: 1,
        dutyCycle: 0.5,
    };
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
        updateAudioParamValue(this.gainNode, { gain: value });
        this.state = { ...this.state, gain: value };
    }

    setPulseWave(dutyCycle: number): void {
        const audioCtx = this.node.context;
        const n = 4096; // Number of samples for the wave
        const real = new Float32Array(n);
        const imag = new Float32Array(n);

        for (let i = 1; i < n; i++) {
            // Fourier series for pulse wave
            real[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * dutyCycle);
            imag[i] = 0;
        }

        this.graphNode.node.setPeriodicWave(audioCtx.createPeriodicWave(real, imag));
        this.graphNode.dutyCycle = dutyCycle;
        const newAudioGraphNode = { ...this.graphNode, node: this.graphNode.node, dutyCycle };
        this.updateNode(newAudioGraphNode);
    }

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createOscillator();
        this.gainNode = context.createGain();
        this.gainNode.gain.setValueAtTime(1.0, context.currentTime);
        this.node.connect(this.gainNode);
        this.node.start();
        this.state.position = position;
        this.id = id;
    }
}
