import { AudioGraphNode, Position, KeyboardAudioEvent, updateAudioParamValue, AudioNodeType, AudioGraphId } from "../../../../app/util";

export class DelayGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    position: Position;
    isSelected: boolean;
    node: DelayNode;
    gainNode: GainNode;
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
            this.gainNode.connect(target.node);
            return true;
        } else if (target instanceof AudioParam) {
            this.gainNode.connect(target);
            return true;
        }
        return false;
    }

    updateGain(value: number): void {
        this.gainNode.gain.setValueAtTime(value, this.gainNode.context.currentTime);
    }

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createDelay();
        this.gainNode = context.createGain();
        this.gainNode.gain.setValueAtTime(0.5, context.currentTime);
        this.node.delayTime.value = 0.5;
        this.node.connect(this.gainNode);
        this.position = position;
        this.id = id;
        this.isSelected = false;
    }
}
