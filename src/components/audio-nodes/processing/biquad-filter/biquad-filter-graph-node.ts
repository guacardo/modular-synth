import { assertNever, AudioGraphId, AudioGraphNode, AudioGraphNodeState, AudioNodeType, IOLabel, Position, updateAudioParamValue } from "../../../../app/util";

export const settableBiquadFilterTypes: readonly BiquadFilterType[] = [
    "allpass",
    "bandpass",
    "highpass",
    "highshelf",
    "lowpass",
    "lowshelf",
    "notch",
    "peaking",
] as const;

export interface BiquadFilterNodeState extends AudioGraphNodeState {
    type: BiquadFilterType;
    frequency: number;
    detune: number;
    Q: number;
    gain: number;
}

export class BiquadFilterGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    node: BiquadFilterNode;
    gainNode: GainNode;
    type: AudioNodeType = "biquadFilter";
    state: BiquadFilterNodeState = {
        position: [0, 0],
        isSelected: false,
        type: "lowpass",
        frequency: 350,
        detune: 0,
        Q: 1,
        gain: 0,
    };

    connectOut(target: AudioNode | AudioParam | undefined): boolean {
        if (target instanceof AudioNode) {
            this.gainNode.connect(target);
            return true;
        } else if (target instanceof AudioParam) {
            this.node.connect(target);
            return true;
        } else {
            console.error("Failed to connect", target);
            return false;
        }
    }

    connectIn(target: IOLabel): AudioNode | AudioParam | undefined {
        switch (target) {
            case "in":
                return this.node;
            case "out":
                console.warn("Can not connect to biquad filter node output");
                return undefined;
            default:
                console.warn(`Unknown target label: ${target}`);
                return undefined;
        }
    }

    updateState(key: keyof BiquadFilterNodeState, value: BiquadFilterNodeState[keyof BiquadFilterNodeState]): BiquadFilterGraphNode {
        switch (key) {
            case "type":
                if (settableBiquadFilterTypes.includes(value as BiquadFilterType)) {
                    this.node = updateAudioParamValue(this.node, { type: value as BiquadFilterType });
                    this.state = { ...this.state, type: value as BiquadFilterType };
                }
                break;
            case "frequency":
                if (typeof value === "number") {
                    this.node = updateAudioParamValue(this.node, { frequency: value });
                    this.state = { ...this.state, frequency: value };
                }
                break;
            case "detune":
                if (typeof value === "number") {
                    this.node = updateAudioParamValue(this.node, { detune: value });
                    this.state = { ...this.state, detune: value };
                }
                break;
            case "Q":
                if (typeof value === "number") {
                    this.node = updateAudioParamValue(this.node, { Q: value });
                    this.state = { ...this.state, Q: value };
                }
                break;
            case "gain":
                if (typeof value === "number") {
                    this.gainNode = updateAudioParamValue(this.gainNode, { gain: value });
                    this.state = { ...this.state, gain: value };
                }
                break;
            case "position":
                if (Array.isArray(value) && value.length === 2) {
                    this.state = { ...this.state, position: value as Position };
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

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createBiquadFilter();
        this.gainNode = context.createGain();
        this.gainNode.gain.setValueAtTime(1.0, context.currentTime);
        this.node.connect(this.gainNode);
        this.state.position = position;
        this.id = id;
    }
}
