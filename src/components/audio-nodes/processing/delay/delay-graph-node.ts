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

    connectTo(target: AudioNode | AudioParam | undefined): boolean {
        if (!target) return false;
        try {
            if (target instanceof AudioNode) {
                this.node.connect(target);
            } else if (target instanceof AudioParam) {
                (this.node as any).connect(target);
            } else {
                return false;
            }
            return true;
        } catch (e) {
            console.error("Failed to connect:", e);
            return false;
        }
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
