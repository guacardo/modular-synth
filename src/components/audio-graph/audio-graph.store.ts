import { AudioNodeProperties, GridAudioNode, Position } from "../../app/util";

export class AudioGraphStore {
    readonly gridAudioNodes: GridAudioNode[];
    readonly context: AudioContext;
    createIndex: number;

    constructor() {
        this.context = new AudioContext();
        this.gridAudioNodes = [];
        this.createIndex = 0;
    }

    addNode(nodeConstructor: new (context: AudioContext) => GridAudioNode, position: Position): GridAudioNode;
    addNode(node: GridAudioNode, position: Position): GridAudioNode;
    addNode(arg: any, position: Position): GridAudioNode {
        let node: GridAudioNode;
        if (typeof arg === "function") {
            node = new arg(this.context);
            node.id = (++this.createIndex).toString();
            node.position = position;
        } else {
            node = arg;
        }

        return node;
    }

    findOrAddNode(node?: GridAudioNode): AudioGraphStore {
        const index = this.gridAudioNodes.findIndex((n) => n === node);
        /* 
            todo: i do not like that there is no type safety to properties you can add
            when using Object.assign. Need to find alternative.
        */
        return Object.assign(Object.create(AudioGraphStore.prototype), {
            ...this,
            audioNodes: this.gridAudioNodes.map((n, i) => (i === index ? node : n)),
        });
    }

    updateAudioParamValue<T extends AudioNode>(node: T, properties: AudioNodeProperties): AudioNode | undefined {
        if (!node || typeof node !== "object" || !properties) {
            console.error("Invalid node or properties");
            return;
        }

        for (const [property, value] of Object.entries(properties)) {
            if (property in node) {
                const propKey = property as keyof T;
                if (node[propKey] instanceof AudioParam) {
                    if (Array.isArray(value)) {
                        const [targetValue, rampTime] = value;
                        node[propKey].linearRampToValueAtTime(targetValue, this.context.currentTime + rampTime);
                    } else if (typeof value === "number") {
                        node[propKey].setValueAtTime(value, this.context.currentTime);
                        node[propKey].value = value;
                    } else {
                        console.error(`Invalid value for AudioParam ${value}`);
                    }
                } else {
                    node[propKey] = value as any;
                }
            } else {
                console.warn(`Property ${property} not found on node`);
            }
        }

        return node;
    }
}
