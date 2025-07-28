import {
    AudioGraphNode,
    AudioGraphId,
    AudioNodeType,
    AudioGraphNodeState,
    KeyboardAudioEvent,
    Position,
    assertNever,
    IOLabel,
    updateAudioParamValue,
} from "../../../../app/util";

export interface MicrophoneGraphNodeState extends AudioGraphNodeState {
    gain: number;
}
export class MicrophoneGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    node: MediaStreamAudioSourceNode;
    gainNode: GainNode;
    type: AudioNodeType = "microphone";
    state: MicrophoneGraphNodeState = {
        position: [0, 0],
        isSelected: false,
        gain: 0.5,
    };

    getKeyboardEvents(): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>();
    }

    connectOut(target: AudioNode | AudioParam | undefined): boolean {
        if (target instanceof AudioNode) {
            this.gainNode.connect(target);
        } else if (target instanceof AudioParam) {
            this.node.connect(target);
        } else {
            console.error("Failed to connect");
            return false;
        }
        return true;
    }

    connectIn: (target: IOLabel) => AudioNode | AudioParam | undefined;

    updateState(key: keyof MicrophoneGraphNodeState, value: MicrophoneGraphNodeState[keyof MicrophoneGraphNodeState]): MicrophoneGraphNode {
        switch (key) {
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
        this.id = id;
        this.state.position = position;
        this.gainNode = context.createGain();
        // this.node = context.createMediaStreamSource(new MediaStream());
    }
}
