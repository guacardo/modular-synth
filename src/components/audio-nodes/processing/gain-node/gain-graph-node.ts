import { AudioGraphNode, AudioNodeType, Position } from "../../../../app/util";

export class GainGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected = false;
    node: GainNode;
    type: AudioNodeType = "gain";
    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createGain();
        this.position = position;
        this.id = id;
    }
}
