import { AudioGraphId, AudioGraphNode, AudioNodeType, IOLabel, Position } from "../../../../app/util";

export class AudioDestinationGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    position: Position;
    isSelected = false;
    node: AudioDestinationNode;
    type: AudioNodeType = "audioDestination";

    requestConnect(target: IOLabel): AudioNode | AudioParam | undefined {
        switch (target) {
            case "in":
                return this.node;
            default:
                return undefined;
        }
    }

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.destination;
        this.position = position;
        this.id = id;
    }
}
