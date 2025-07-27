import { AudioGraphId, AudioGraphNode, AudioGraphNodeState, AudioNodeType, IOLabel, Position } from "../../../../app/util";

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

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createGain();
        this.position = position;
        this.id = id;
    }
}
