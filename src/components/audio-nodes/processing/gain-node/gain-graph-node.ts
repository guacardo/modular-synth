import { assertNever, AudioGraphId, AudioGraphNode, AudioGraphNodeState, AudioNodeType, IOLabel, Position, updateAudioParamValue } from "../../../../app/util";

export interface GainNodeState extends AudioGraphNodeState {
    gain: number;
}

export class GainGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    position: Position;
    isSelected = false;
    node: GainNode;
    type: AudioNodeType = "gain";
    state: GainNodeState = {
        position: [0, 0],
        isSelected: false,
        gain: 1,
    };

    connectOut(target: AudioNode | AudioParam | undefined): boolean {
        if (target instanceof AudioNode) {
            this.node.connect(target);
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
                console.warn("Can not connect to gain node output");
                return undefined;
            case "mod":
                return this.node.gain;
            default:
                console.warn(`Unknown target label: ${target}`);
                return undefined;
        }
    }

    updateState(key: keyof GainNodeState, value: GainNodeState[keyof GainNodeState]): GainGraphNode {
        switch (key) {
            case "gain":
                if (typeof value === "number") {
                    this.node = updateAudioParamValue(this.node, { gain: value });
                    this.state = { ...this.state, gain: value };
                }
                break;
            case "position":
                if (Array.isArray(value) && value.length === 2) {
                    this.state = { ...this.state, position: value };
                }
                break;
            case "isSelected":
                if (typeof value === "boolean") {
                    this.isSelected = value;
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
        this.node = context.createGain();
        this.position = position;
        this.id = id;
    }
}
