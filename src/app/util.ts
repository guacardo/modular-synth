export type AudioNodeProperties = Partial<Record<keyof AudioNode, number | string | [number, number]>>;
export type AddNodeHandler = (
    nodeConstructor: new (context: AudioContext, id: string, position: Position) => GridAudioNode,
    position: [number, number]
) => void;
export type Position = [number, number];
export class GridAudioNode {
    id: string;
    position: Position;
    node: AudioNode;

    constructor(id: string, position: Position, node: AudioNode) {
        this.id = id;
        this.node = node;
        this.position = position;
    }
}

export class GridOscillatorNode extends GridAudioNode {
    node: OscillatorNode;

    constructor(context: AudioContext, id: string, position: Position) {
        const node = context.createOscillator();
        super(id, position, node);
        this.node = node;
    }
}

export class GridGainNode extends GridAudioNode {
    node: GainNode;

    constructor(context: AudioContext, id: string, position: Position) {
        const node = context.createGain();
        super(id, position, node);
        this.node = node;
    }
}

export class GridBiquadFilterNode extends GridAudioNode {
    node: BiquadFilterNode;

    constructor(context: AudioContext, id: string, position: Position) {
        const node = context.createBiquadFilter();
        super(id, position, node);
        this.node = node;
    }
}
