import {
    assertNever,
    AudioGraphId,
    AudioGraphNode,
    AudioGraphNodeState,
    AudioNodeType,
    IOLabel,
    KeyboardAudioEvent,
    Position,
    updateAudioParamValue,
} from "../../../../app/util";

export interface OscillatorGraphNodeState extends AudioGraphNodeState {
    frequency: number;
    detune: number;
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
        detune: 0,
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
                        this.updateState("gain", Math.max(0, this.gainNode.gain.value - 0.05));
                    },
                },
            ],
            [
                "ArrowRight",
                {
                    keydown: () => {
                        this.updateState("gain", Math.min(1, this.gainNode.gain.value + 0.05));
                    },
                },
            ],
        ]);
    }

    connectTo(target: AudioNode | AudioParam | undefined): boolean {
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

    updateState(key: keyof OscillatorGraphNodeState, value: OscillatorGraphNodeState[keyof OscillatorGraphNodeState]): OscillatorGraphNode {
        switch (key) {
            case "frequency":
                if (typeof value === "number") {
                    this.node = updateAudioParamValue(this.node, { frequency: value });
                    this.state = { ...this.state, frequency: value };
                }
                break;
            case "type":
                if (typeof value === "string") {
                    this.node = updateAudioParamValue(this.node, { type: value as OscillatorType });
                    this.state = { ...this.state, type: value as OscillatorType };
                }
                break;
            case "gain":
                if (typeof value === "number") {
                    this.gainNode = updateAudioParamValue(this.gainNode, { gain: value });
                    this.state = { ...this.state, gain: value };
                }
                break;
            case "dutyCycle":
                if (typeof value === "number") {
                    this.setPulseWave(value);
                    this.state = { ...this.state, dutyCycle: value };
                }
                break;
            case "detune":
                if (typeof value === "number") {
                    this.node = updateAudioParamValue(this.node, { detune: value });
                    this.state = { ...this.state, detune: value };
                }
                break;
            case "position":
            case "isSelected":
                this.state = { ...this.state, [key]: value };
                break;
            default:
                console.warn(`Unknown or invalid state key/value: ${key} = ${value}`);
                assertNever(key);
        }
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        copy.state = { ...this.state };
        return copy;
    }

    private setPulseWave(dutyCycle: number): void {
        const audioCtx = this.node.context;
        const n = 4096; // Number of samples for the wave
        const real = new Float32Array(n);
        const imag = new Float32Array(n);

        for (let i = 1; i < n; i++) {
            // Fourier series for pulse wave
            real[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * dutyCycle);
            imag[i] = 0;
        }

        this.node.setPeriodicWave(audioCtx.createPeriodicWave(real, imag));
        this.state = { ...this.state, dutyCycle };
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
