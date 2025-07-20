import { AudioGraphNode, Position, KeyboardAudioEvent, updateAudioParamValue, AudioNodeType, AudioGraphId, IOLabel } from "../../../../app/util";

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
        if (target instanceof AudioNode) {
            this.node.connect(target);
        } else if (target instanceof AudioParam) {
            this.node.connect(target);
        } else {
            return false;
        }
        return true;
    }

    requestConnect(target: IOLabel): AudioNode | AudioParam | undefined {
        switch (target) {
            case "in":
                return this.node;
            case "out":
                console.warn("Can not connect to delay node output");
                return undefined;
            case "mod":
                return this.gainNode.gain;
            default:
                console.warn(`Unknown target label: ${target}`);
                return undefined;
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
