import { AudioGraphId, AudioGraphNodeBase, AudioNodeType, IOLabel, Position } from "../../../../app/util";

export class BiquadFilterGraphNode extends AudioGraphNodeBase {
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
        super();
        this.node = context.createBiquadFilter();
        this.position = position;
        this.id = id;
    }
}
