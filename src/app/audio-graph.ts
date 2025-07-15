import { AudioDestinationGraphNode } from "../components/audio-nodes/destination/audio-destination-node/audio-destination-graph-node";
import { BiquadFilterGraphNode } from "../components/audio-nodes/processing/biquad-filter/biquad-filter-graph-node";
import { DelayGraphNode } from "../components/audio-nodes/processing/delay/delay-graph-node";
import { GainGraphNode } from "../components/audio-nodes/processing/gain-node/gain-graph-node";
import { StereoPannerGraphNode } from "../components/audio-nodes/processing/stereo-panner/stereo-panner-graph-node";
import { OscillatorGraphNode } from "../components/audio-nodes/source/oscillator-node/oscillator-graph-node";
import { DelayDenyComposeGraphNode } from "../components/audio-nodes/super/delay-deny-compose/delay-deny-compose-node";
import { getAudioContext } from "./audio-context";
import { AudioGraphNode, AudioNodeType, Position, ImmutableRepository } from "./util";

export class AudioGraphRepo implements ImmutableRepository<AudioGraphNode> {
    private nodes: AudioGraphNode[] = [];
    private created: number = 0;

    add(type: AudioNodeType, position: Position): AudioGraphNode[] {
        const audioContext = getAudioContext();
        let newNode: AudioGraphNode;

        switch (type) {
            case "biquad-filter":
                newNode = new BiquadFilterGraphNode(audioContext, position, `${(this.created++).toString()}-biquadFilter`);
                break;
            case "gain":
                newNode = new GainGraphNode(audioContext, position, `${(this.created++).toString()}-gain`);
                break;
            case "oscillator":
                newNode = new OscillatorGraphNode(audioContext, position, `${(this.created++).toString()}-oscillator`);
                break;
            case "audio-destination":
                newNode = new AudioDestinationGraphNode(audioContext, position, `${(this.created++).toString()}-audioDestination`);
                break;
            case "delay":
                newNode = new DelayGraphNode(audioContext, position, `${(this.created++).toString()}-delay`);
                break;
            case "stereo-panner":
                newNode = new StereoPannerGraphNode(audioContext, position, `${(this.created++).toString()}-stereoPanner`);
                break;
            case "delay-deny-compose":
                newNode = new DelayDenyComposeGraphNode(audioContext, position, `${(this.created++).toString()}-delayDenyCompose`);
                break;
        }

        this.nodes = [...this.nodes, newNode];
        return this.nodes;
    }

    remove(node: AudioGraphNode): AudioGraphNode[] {
        // disconnect from all connections, both as source and target
        this.disconnectFrom(node);
        node.node.disconnect();

        if (node.node instanceof OscillatorNode) {
            try {
                node.node.stop();
            } catch {}
        }

        this.nodes = this.nodes.filter((n) => n.id !== node.id);
        return this.nodes;
    }

    update(node: AudioGraphNode): AudioGraphNode[] {
        return this.nodes.map((n) => (n.id === node.id ? Object.assign(Object.create(Object.getPrototypeOf(n)), n, node) : n));
    }

    findById(id: string): AudioGraphNode | undefined {
        return this.nodes.find((n) => n.id === id);
    }

    getAll(): AudioGraphNode[] {
        return [...this.nodes];
    }

    clean(): void {
        this.nodes.forEach((node) => {
            node.node.disconnect();
            if (node.node instanceof OscillatorNode) {
                node.node.stop();
            }
        });
    }

    clear(): AudioGraphNode[] {
        this.clean();
        this.nodes = [];
        return this.nodes;
    }

    disconnectFrom(node: AudioGraphNode): void {
        this.nodes.forEach((n) => {
            if (n.id !== node.id) {
                try {
                    n.node.disconnect(node.node);
                } catch (e) {
                    console.warn("Tried to disconnect node that was not connected:", e);
                }
            }
        });
    }
}
