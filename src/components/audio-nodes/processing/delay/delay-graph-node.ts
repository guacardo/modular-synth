import { AudioGraphNode, Position, KeyboardAudioEvent, updateAudioParamValue, AudioNodeType } from "../../../../app/util";

export class DelayGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected: boolean;
    node: DelayNode;
    type: AudioNodeType = "delay";
    getKeyboardEvents(updateNode: (node: AudioGraphNode) => void): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>([
            [
                "ArrowUp",
                {
                    keydown: () =>
                        updateNode({
                            ...this,
                            node: updateAudioParamValue(this.node, { delayTime: this.node.delayTime.value + 0.1 }),
                        }),
                },
            ],
            [
                "ArrowDown",
                {
                    keydown: () =>
                        updateNode({
                            ...this,
                            node: updateAudioParamValue(this.node, { delayTime: this.node.delayTime.value - 0.1 }),
                        }),
                },
            ],
            [
                "d",
                {
                    keydown: () =>
                        updateNode({
                            ...this,
                            node: updateAudioParamValue(this.node, { delayTime: 0.5 }),
                        }),
                },
            ],
        ]);
    }

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
        this.node = context.createDelay();
        this.node.delayTime.value = 0.5; // Default delay time
        this.position = position;
        this.id = id;
        this.isSelected = false;
    }
}
