import {
    AudioGraphNode,
    Position,
    KeyboardAudioEvent,
    updateAudioParamValue,
    AudioNodeType,
    AudioGraphId,
    IOLabel,
    AudioGraphNodeState,
    assertNever,
} from "../../../../app/util";

export interface DelayNodeState extends AudioGraphNodeState {
    delayTime: number;
    gain: number;
}

export class DelayGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    node: DelayNode;
    gainNode: GainNode;
    type: AudioNodeType = "delay";
    state: DelayNodeState = {
        position: [0, 0],
        isSelected: false,
        delayTime: 0.5,
        gain: 0.99,
    };
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

    connectOut(target: AudioNode | AudioParam | undefined): boolean {
        if (target instanceof AudioNode) {
            this.gainNode.connect(target);
        } else if (target instanceof AudioParam) {
            this.gainNode.connect(target);
        } else {
            return false;
        }
        return true;
    }

    connectIn(target: IOLabel): AudioNode | AudioParam | undefined {
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

    updateState(key: keyof DelayNodeState, value: DelayNodeState[keyof DelayNodeState]): DelayGraphNode {
        switch (key) {
            case "delayTime":
                if (typeof value === "number") {
                    this.node = updateAudioParamValue(this.node, { delayTime: value });
                    this.state = { ...this.state, delayTime: value };
                }
                break;
            case "gain":
                if (typeof value === "number") {
                    this.gainNode = updateAudioParamValue(this.gainNode, { gain: value });
                    this.state = { ...this.state, gain: value };
                }
                break;
            case "position":
                if (Array.isArray(value) && value.length === 2) {
                    this.state = { ...this.state, position: value };
                }
                break;
            case "isSelected":
                if (typeof value === "boolean") {
                    this.state = { ...this.state, isSelected: value };
                }
                break;
            default:
                assertNever(key);
        }
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        copy.state = { ...this.state };
        return copy;
    }

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createDelay();
        this.gainNode = context.createGain();
        this.gainNode.gain.setValueAtTime(0.5, context.currentTime);
        this.node.delayTime.value = 0.5;
        this.node.connect(this.gainNode);
        this.state.position = position;
        this.id = id;
        this.state.isSelected = false;
    }
}
