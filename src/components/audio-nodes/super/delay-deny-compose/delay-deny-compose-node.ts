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

    connectTo(target: AudioGraphNode | AudioParam): boolean {
        if ("node" in target && target.node instanceof AudioNode && target.node.numberOfInputs > 0) {
            this.gainNode.connect(target.node);
            return true;
        }
        return false;
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
