export class AudioNodeWithId extends AudioNode {
    id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }
}
export class OscillatorNodeWithId extends OscillatorNode implements AudioNodeWithId {
    readonly id: string;
    constructor(context: AudioContext, id: string) {
        super(context);
        this.id = id;
    }
}

export class GainNodeWithId extends GainNode implements AudioNodeWithId {
    readonly id: string;
    constructor(context: AudioContext, id: string) {
        super(context);
        this.id = id;
    }
}

export class BiquadFilterNodeWithId extends BiquadFilterNode implements AudioNodeWithId {
    readonly id: string;
    constructor(context: AudioContext, id: string) {
        super(context);
        this.id = id;
    }
}
