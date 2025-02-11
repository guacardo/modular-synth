export type AudioNodeProperties = Partial<Record<keyof AudioNode, number | string | [number, number]>>;
export type AddNodeHandler = (
    nodeConstructor: new (context: AudioContext, id: string) => AudioNodeWithId,
    position: [number, number]
) => void;
export class AudioNodeWithId {
    id: string;
    node: AudioNode;

    constructor(id: string, node: AudioNode) {
        this.id = id;
        this.node = node;
    }
}

export class OscillatorNodeWithId extends AudioNodeWithId {
    node: OscillatorNode;

    constructor(context: AudioContext, id: string) {
        const node = context.createOscillator();
        super(id, node);
        this.node = node;
    }
}

export class GainNodeWithId extends AudioNodeWithId {
    node: GainNode;

    constructor(context: AudioContext, id: string) {
        const node = context.createGain();
        super(id, node);
        this.node = node;
    }
}

export class BiquadFilterNodeWithId extends AudioNodeWithId {
    node: BiquadFilterNode;

    constructor(context: AudioContext, id: string) {
        const node = context.createBiquadFilter();
        super(id, node);
        this.node = node;
    }
}
