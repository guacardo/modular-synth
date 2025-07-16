import { AudioGraphNode, AudioNodeType, Position } from "../../../../app/util";

export class AudioDestinationGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected = false;
    node: AudioDestinationNode;
    type: AudioNodeType = "audioDestination";

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.destination;
        this.position = position;
        this.id = id;
    }
}
