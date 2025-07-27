import { AudioGraphId, AudioGraphNode, AudioGraphNodeState, AudioNodeType, IOLabel, KeyboardAudioEvent, Position } from "../../../../app/util";

export interface AudioDestinationNodeState extends AudioGraphNodeState {}

export class AudioDestinationGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    node: AudioDestinationNode;
    type: AudioNodeType = "audioDestination";
    state: AudioDestinationNodeState = {
        position: [0, 0],
        isSelected: false,
    };
    getKeyboardEvents?: ((updateNode: (node: AudioGraphNode) => void) => Map<string, KeyboardAudioEvent>) | undefined;
    connectOut: (target: AudioNode | AudioParam | undefined) => boolean;
    connectIn(target: IOLabel): AudioNode | AudioParam | undefined {
        switch (target) {
            case "in":
                return this.node;
            default:
                console.error(`Unknown target label: ${target}`);
                return undefined;
        }
    }
    updateState(key: keyof AudioDestinationNodeState, value: Position | boolean): AudioDestinationGraphNode {
        switch (key) {
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
                console.warn(`Unknown AudioDestination parameter: ${key}`);
        }
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        copy.state = { ...this.state };
        return copy;
    }

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.destination;
        this.state.position = position;
        this.id = id;
    }
}
