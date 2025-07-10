import { AudioGraphNode, AudioNodeType, Position } from "../../../../app/util";

export class BiquadFilterGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected = false;
    node: BiquadFilterNode;
    type: AudioNodeType = "biquad-filter";

    connectTo(target: AudioGraphNode | AudioParam): boolean {
        if ("node" in target && target.node instanceof AudioNode && target.node.numberOfInputs > 0) {
            this.node.connect(target.node);
            return true;
        } else if (target instanceof AudioParam) {
            this.node.connect(target);
            return true;
        }
        return false;
    }

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createBiquadFilter();
        this.position = position;
        this.id = id;
    }
}
