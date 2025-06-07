import { AudioGraphNode, Position, KeyboardAudioEvent } from "../../../../app/util";

export class OscillatorGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected = false;
    node: OscillatorNode;
    keyboardEvents: Map<string, KeyboardAudioEvent>;
    dutyCycle: number = 0.5;
    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createOscillator();
        this.node.start();
        this.position = position;
        this.id = id;
        this.keyboardEvents = new Map<string, KeyboardAudioEvent>([
            ["a", { keydown: () => this.node.frequency.setValueAtTime(20, context.currentTime) }],
            ["s", { keydown: () => this.node.frequency.setValueAtTime(440, context.currentTime) }],
            ["d", { keydown: () => this.node.frequency.setValueAtTime(660, context.currentTime) }],
            ["f", { keydown: () => this.node.frequency.setValueAtTime(880, context.currentTime) }],
            ["g", { keydown: () => (this.node.type = "sine") }],
            ["h", { keydown: () => (this.node.type = "square") }],
            ["j", { keydown: () => (this.node.type = "sawtooth") }],
            ["k", { keydown: () => (this.node.type = "triangle") }],
        ]);
    }
}
