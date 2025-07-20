import { AudioGraphNode, Position, KeyboardAudioEvent, updateAudioParamValue, AudioNodeType, AudioGraphId } from "../../../../app/util";

export class DelayDenyComposeGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    position: Position;
    isSelected: boolean;
    node: DelayNode;
    keyboardEvents: Map<string, KeyboardAudioEvent>;
    dutyCycle: number = 0.5;
    type: AudioNodeType = "delayDenyCompose";
    oscillator: OscillatorNode;
    gainNode: GainNode;
    delayNode: DelayNode;
    feedbackGain: GainNode;

    getKeyboardEvents(updateNode: (node: AudioGraphNode) => void): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>([
            ["a", { keydown: () => updateNode({ ...this, oscillator: updateAudioParamValue(this.oscillator, { frequency: 200 }) }) }],
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

    constructor(context: AudioContext, position: Position, id: AudioGraphId) {
        this.node = context.createDelay();
        this.position = position;
        this.id = id;
        this.oscillator = context.createOscillator();
        this.gainNode = context.createGain();
        this.delayNode = context.createDelay();
        this.feedbackGain = context.createGain();
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.delayNode);
        this.delayNode.connect(this.feedbackGain);
        this.feedbackGain.connect(this.gainNode);
        this.oscillator.start();
    }
}
