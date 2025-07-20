import { AudioGraphId, AudioGraphNode, AudioNodeType, IOLabel, Position } from "../../../../app/util";

export class GainGraphNode implements AudioGraphNode {
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

    connectTo(target: AudioNode | AudioParam | undefined): boolean {
        if (!target) return false;
        try {
            if (target instanceof AudioNode) {
                this.node.connect(target);
            } else if (target instanceof AudioParam) {
                this.node.connect(target);
            } else {
                return false;
            }
            return true;
        } catch (e) {
            console.error("Failed to connect:", e);
            return false;
        }
    }

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createGain();
        this.position = position;
        this.id = id;
    }
}
