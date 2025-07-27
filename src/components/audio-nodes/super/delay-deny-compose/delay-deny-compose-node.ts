import {
    AudioGraphNode,
    Position,
    KeyboardAudioEvent,
    updateAudioParamValue,
    AudioNodeType,
    AudioGraphId,
    AudioGraphNodeState,
    IOLabel,
    assertNever,
} from "../../../../app/util";
import { DelayNodeState } from "../../processing/delay/delay-graph-node";
import { GainNodeState } from "../../processing/gain-node/gain-graph-node";
import { OscillatorGraphNodeState } from "../../source/oscillator-node/oscillator-graph-node";

export interface DelayDenyComposeNodeState extends AudioGraphNodeState, OscillatorGraphNodeState, GainNodeState, DelayNodeState {
    feedbackGain: number;
}

export class DelayDenyComposeGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    position: Position;
    isSelected: boolean;
    node: DelayNode;
    keyboardEvents: Map<string, KeyboardAudioEvent>;
    type: AudioNodeType = "delayDenyCompose";
    oscillator: OscillatorNode;
    delayNode: DelayNode;
    feedbackGain: GainNode;
    gainNode: GainNode;
    state: DelayDenyComposeNodeState = {
        position: [0, 0],
        isSelected: false,
        frequency: 440,
        detune: 0,
        type: "sine",
        gain: 1,
        dutyCycle: 0.5,
        delayTime: 0.5,
        feedbackGain: 0,
    };

    getKeyboardEvents(updateNode: (node: AudioGraphNode) => void): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>([
            ["a", { keydown: () => updateNode({ ...this, oscillator: updateAudioParamValue(this.oscillator, { frequency: 200 }) }) }],
        ]);
    }

    connectOut(target: AudioNode | AudioParam | undefined): boolean {
        if (target instanceof AudioNode) {
            this.node.connect(target);
        } else if (target instanceof AudioParam) {
            this.node.connect(target);
        } else {
            return false;
        }
        return true;
    }

    connectIn: (target: IOLabel) => AudioNode | AudioParam | undefined;

    updateState(key: keyof DelayDenyComposeNodeState, value: DelayDenyComposeNodeState[keyof DelayDenyComposeNodeState]): DelayDenyComposeGraphNode {
        switch (key) {
            case "frequency":
                if (typeof value === "number") {
                    this.oscillator = updateAudioParamValue(this.oscillator, { frequency: value });
                    this.state = { ...this.state, frequency: value };
                }
                break;
            case "type":
                if (typeof value === "string") {
                    this.oscillator = updateAudioParamValue(this.oscillator, { type: value });
                    this.state = { ...this.state, type: value };
                }
                break;
            case "detune":
                if (typeof value === "number") {
                    this.oscillator = updateAudioParamValue(this.oscillator, { detune: value });
                    this.state = { ...this.state, detune: value };
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
            case "delayTime":
                if (typeof value === "number") {
                    this.node = updateAudioParamValue(this.node, { delayTime: value });
                    this.state = { ...this.state, delayTime: value };
                }
                break;
            case "feedbackGain":
                if (typeof value === "number") {
                    this.feedbackGain = updateAudioParamValue(this.feedbackGain, { gain: value });
                    this.state = { ...this.state, feedbackGain: value };
                }
                break;
            case "position":
                if (Array.isArray(value) && value.length === 2) {
                    this.state = { ...this.state, position: value };
                }
                break;
            case "isSelected":
                if (typeof value === "boolean") {
                    this.state = { ...this.state, isSelected: value };
                }
                break;
            default:
                assertNever(key);
        }
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        copy.state = { ...this.state };
        return copy;
    }

    // todo: DRY. this exists in OscillatorGraphNode as well.
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

        this.oscillator.setPeriodicWave(audioCtx.createPeriodicWave(real, imag));
        this.state = { ...this.state, dutyCycle };
    }

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createDelay();
        this.position = position;
        this.id = id;
        this.oscillator = context.createOscillator();
        this.gainNode = context.createGain();
        this.delayNode = context.createDelay();
        this.feedbackGain = context.createGain();
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.delayNode);
        this.delayNode.connect(this.feedbackGain);
        this.feedbackGain.connect(this.gainNode);
        this.oscillator.start();
    }
}
