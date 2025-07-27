import {
    assertNever,
    AudioGraphId,
    AudioGraphNode,
    AudioGraphNodeState,
    AudioNodeType,
    IOLabel,
    KeyboardAudioEvent,
    Position,
    updateAudioParamValue,
} from "../../../../app/util";

export interface StereoPannerState extends AudioGraphNodeState {
    pan: number;
}

export class StereoPannerGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    node: StereoPannerNode;
    keyboardEvents: Map<string, KeyboardAudioEvent>;
    type: AudioNodeType = "stereoPanner";
    state: StereoPannerState = {
        position: [0, 0],
        isSelected: false,
        pan: 0,
    };

    getKeyboardEvents(updateNode: (node: AudioGraphNode) => void): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>([
            ["ArrowLeft", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: this.node.pan.value - 0.1 }) }) }],
            ["ArrowRight", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: this.node.pan.value + 0.1 }) }) }],
            ["l", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: -1 }) }) }],
            ["c", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: 0 }) }) }],
            ["r", { keydown: () => updateNode({ ...this, node: updateAudioParamValue(this.node, { pan: 1 }) }) }],
        ]);
    }

    connectOut(target: AudioNode | AudioParam | undefined): boolean {
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

    connectIn(target: IOLabel): AudioNode | AudioParam | undefined {
        switch (target) {
            case "in":
                return this.node;
            case "out":
                console.warn("Can not connect to stereo panner node output");
                return undefined;
            default:
                console.warn(`Unknown target label: ${target}`);
                return undefined;
        }
    }

    updateState(key: keyof StereoPannerState, value: StereoPannerState[keyof StereoPannerState]): AudioGraphNode {
        switch (key) {
            case "pan":
                if (typeof value === "number") {
                    this.node = updateAudioParamValue(this.node, { pan: value });
                    this.state = { ...this.state, pan: value };
                }
                break;
            case "position":
                if (Array.isArray(value) && value.length === 2) {
                    this.state = { ...this.state, position: value as Position };
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
        this.node = context.createStereoPanner();
        this.state.position = position;
        this.id = id;
    }
}
