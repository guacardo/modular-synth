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
        console.log("heyyyyy");
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
