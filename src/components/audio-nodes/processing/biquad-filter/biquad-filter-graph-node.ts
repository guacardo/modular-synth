import { AudioGraphNode, AudioNodeType, Position } from "../../../../app/util";

export class BiquadFilterGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected = false;
    node: BiquadFilterNode;
    type: AudioNodeType = "biquad-filter";

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createBiquadFilter();
        this.position = position;
        this.id = id;
    }
}
