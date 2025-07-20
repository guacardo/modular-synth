import { AudioGraphId, AudioGraphNodeBase, AudioNodeType, IOLabel, Position } from "../../../../app/util";

export class GainGraphNode extends AudioGraphNodeBase {
    id: AudioGraphId;
    position: Position;
    isSelected = false;
    node: GainNode;
    type: AudioNodeType = "gain";

    requestConnect(target: IOLabel): AudioNode | AudioParam | undefined {
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
        super();
        this.node = context.createGain();
        this.position = position;
        this.id = id;
    }
}
