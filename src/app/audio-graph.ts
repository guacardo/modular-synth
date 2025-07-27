import { AudioDestinationGraphNode } from "../components/audio-nodes/destination/audio-destination-node/audio-destination-graph-node";
import { BiquadFilterGraphNode } from "../components/audio-nodes/processing/biquad-filter/biquad-filter-graph-node";
import { DelayGraphNode } from "../components/audio-nodes/processing/delay/delay-graph-node";
import { GainGraphNode } from "../components/audio-nodes/processing/gain-node/gain-graph-node";
import { StereoPannerGraphNode } from "../components/audio-nodes/processing/stereo-panner/stereo-panner-graph-node";
import { OscillatorGraphNode } from "../components/audio-nodes/source/oscillator-node/oscillator-graph-node";
import { DelayDenyComposeGraphNode } from "../components/audio-nodes/super/delay-deny-compose/delay-deny-compose-node";
import { getAudioContext } from "./audio-context";
import { AudioGraphNode, AudioNodeType, Position, ImmutableRepository, ConnectionComponents, AudioGraphId } from "./util";

export class AudioGraphRepo implements ImmutableRepository<AudioGraphNode> {
    private nodes: AudioGraphNode[] = [];
    private created: number = 0;

    add(type: AudioNodeType, position: Position): AudioGraphNode[] {
        const audioContext = getAudioContext();
        let newNode: AudioGraphNode;

        switch (type) {
            case "biquadFilter":
                newNode = new BiquadFilterGraphNode(audioContext, position, [this.created++, type]);
                break;
            case "gain":
                newNode = new GainGraphNode(audioContext, position, [this.created++, type]);
                break;
            case "oscillator":
                newNode = new OscillatorGraphNode(audioContext, position, [this.created++, type]);
                break;
            case "audioDestination":
                newNode = new AudioDestinationGraphNode(audioContext, position, [this.created++, type]);
                break;
            case "delay":
                newNode = new DelayGraphNode(audioContext, position, [this.created++, type]);
                break;
            case "stereoPanner":
                newNode = new StereoPannerGraphNode(audioContext, position, [this.created++, type]);
                break;
            case "delayDenyCompose":
                newNode = new DelayDenyComposeGraphNode(audioContext, position, [this.created++, type]);
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
        const copy = this.nodes.map((n) => (n.id[0] === node.id[0] && n.id[1] === node.id[1] ? node : n));
        this.nodes = copy;

        return this.nodes;
    }

    findById(id: AudioGraphId): AudioGraphNode | undefined {
        return this.nodes.find((n) => n.id[0] === id[0] && n.id[1] === id[1]);
    }

    findParamInNode(node: AudioGraphNode, paramName: string): AudioParam | undefined {
        if (node.node instanceof AudioNode) {
            return (node.node as any)[paramName] as AudioParam | undefined;
        } else {
            return undefined;
        }
    }

    getAll(): AudioGraphNode[] {
        return [...this.nodes];
    }

    setAll(nodes: AudioGraphNode[]): AudioGraphNode[] {
        this.nodes = nodes;
        return this.nodes;
    }

    clean(): void {
        this.nodes.forEach((node) => {
            node.node.disconnect();
            // this should live in oscillator-graph-node, but for now we stop all oscillators
            // all graph nodes should implement a stop method
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

    connect(connection: [ConnectionComponents, ConnectionComponents]): void {
        const [sourceIndex, sourceType, sourceParam]: ConnectionComponents = connection[0];
        const [targetIndex, targetType, targetParam]: ConnectionComponents = connection[1];

        const source = this.findById([sourceIndex, sourceType]);
        const target = this.findById([targetIndex, targetType]);
        if (source && target) {
            source.connectTo?.(target.requestConnect?.(targetParam));
        } else {
            console.error("could not find connection", [sourceIndex, sourceType, sourceParam], [targetIndex, targetType, targetParam]);
        }
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
