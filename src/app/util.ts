import { GraphNode } from "./audio-graph";

export class Util {
    static graphNodeFromId(id: string, graphNodes: GraphNode[]): GraphNode | undefined {
        graphNodes.forEach((node) => {
            if ( node.id === id) {
                return node;
            }
        })

        return undefined;
    }
}
