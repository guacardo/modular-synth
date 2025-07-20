import { AudioGraphId, AudioGraphNode, AudioNodeType, IOLabel, Position } from "../../../../app/util";

export class BiquadFilterGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    position: Position;
    isSelected = false;
    node: BiquadFilterNode;
    type: AudioNodeType = "biquadFilter";

    requestConnect(target: IOLabel): AudioNode | AudioParam | undefined {
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

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createBiquadFilter();
        this.position = position;
        this.id = id;
    }
}
