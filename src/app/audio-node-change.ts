import { GraphNode } from "./audio-graph";

const numericChanges = ["frequency", "gain", "detune", "q"] as const;
export type NumericChange = (typeof numericChanges)[number];

export interface NumericChangeDetail {
	node: GraphNode;
	value: number;
	type: NumericChange;
}

export function dispatchNumericChange(detail: NumericChangeDetail) {
	console.log("hello dispatch");
}
