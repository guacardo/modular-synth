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
    isRecording: boolean;
    hasPermission: boolean;
}
export class MicrophoneGraphNode implements AudioGraphNode {
    id: AudioGraphId;
    node: MediaStreamAudioSourceNode;
    gainNode: GainNode;
    type: AudioNodeType = "microphone";
    private mediaStream: MediaStream | null = null;
    private context: AudioContext;
    private placeholderNode: GainNode; // Used as placeholder until microphone is initialized
    state: MicrophoneGraphNodeState = {
        position: [0, 0],
        isSelected: false,
        gain: 0.5,
        isRecording: false,
        hasPermission: false,
    };

    getKeyboardEvents(): Map<string, KeyboardAudioEvent> {
        return new Map<string, KeyboardAudioEvent>([
            [
                "m",
                {
                    keydown: () => {
                        this.toggleRecording().catch(console.error);
                    },
                },
            ],
            ["ArrowLeft", { keydown: () => this.updateState("gain", Math.max(0, this.gainNode.gain.value - 0.05)) }],
            ["ArrowRight", { keydown: () => this.updateState("gain", Math.min(1, this.gainNode.gain.value + 0.05)) }],
        ]);
    }

    connectOut(target: AudioNode | AudioParam | undefined): boolean {
        if (target instanceof AudioNode) {
            this.gainNode.connect(target);
        } else if (target instanceof AudioParam) {
            this.gainNode.connect(target);
        } else {
            console.error("Failed to connect");
            return false;
        }
        return true;
    }

    connectIn(target: IOLabel): AudioNode | AudioParam | undefined {
        switch (target) {
            case "in":
                console.warn("Cannot connect to microphone input - it's a source node");
                return undefined;
            case "out":
                return this.gainNode;
            case "mod":
                return this.gainNode.gain;
            default:
                console.warn(`Unknown target label: ${target}`);
                return undefined;
        }
    }

    private async toggleRecording(): Promise<void> {
        if (this.state.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    private async startRecording(): Promise<void> {
        try {
            if (!this.state.hasPermission) {
                await this.requestMicrophonePermission();
            }

            if (this.mediaStream) {
                this.state = { ...this.state, isRecording: true };
                return;
            }

            console.error("Failed to start recording - no media stream available");
        } catch (error) {
            console.error("Failed to start microphone recording:", error);
        }
    }

    private stopRecording(): void {
        this.state = { ...this.state, isRecording: false };
    }

    private async requestMicrophonePermission(): Promise<void> {
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false,
                },
            });

            if (this.mediaStream) {
                // Disconnect the placeholder and create the real microphone node
                this.placeholderNode.disconnect();
                this.node = this.context.createMediaStreamSource(this.mediaStream);
                this.node.connect(this.gainNode);
                this.state = { ...this.state, hasPermission: true, isRecording: true };
            }
        } catch (error) {
            console.error("Failed to get microphone permission:", error);
            this.state = { ...this.state, hasPermission: false, isRecording: false };
            throw error;
        }
    }

    public async initializeMicrophone(): Promise<void> {
        await this.requestMicrophonePermission();
    }

    public cleanup(): void {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = null;
        }
        this.node.disconnect();
        this.state = {
            ...this.state,
            isRecording: false,
            hasPermission: false,
        };
    }

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
            case "isRecording":
                if (typeof value === "boolean") {
                    this.state = { ...this.state, isRecording: value };
                }
                break;
            case "hasPermission":
                if (typeof value === "boolean") {
                    this.state = { ...this.state, hasPermission: value };
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
        this.context = context;
        this.state.position = position;
        this.gainNode = context.createGain();
        this.gainNode.gain.setValueAtTime(0.5, context.currentTime);

        // Create a placeholder gain node that outputs silence until microphone is initialized
        this.placeholderNode = context.createGain();
        this.placeholderNode.gain.setValueAtTime(0, context.currentTime); // Silent
        this.placeholderNode.connect(this.gainNode);
        
        // Initialize node as placeholder - will be replaced when microphone permission is granted
        this.node = this.placeholderNode as any; // Type assertion to satisfy interface
    }
}
