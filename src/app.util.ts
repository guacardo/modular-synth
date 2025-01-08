export function updateAudioNode<T extends AudioNode>(
    node: T,
    properties: Partial<Record<keyof T, number | string | [number, number]>>,
    context: AudioContext
): void {
    if (!node || typeof node !== "object" || !properties) {
        console.error("Invalid node or properties");
        return;
    }

    const currentTime = context.currentTime;

    for (const [property, value] of Object.entries(properties)) {
        if (property in node) {
            const propKey = property as keyof T;

            if (node[propKey] instanceof AudioParam) {
                const audioParam = node[propKey] as unknown as AudioParam;

                if (Array.isArray(value)) {
                    const [targetValue, rampTime] = value;
                    audioParam.linearRampToValueAtTime(targetValue, currentTime + rampTime);
                } else if (typeof value === "number") {
                    audioParam.setValueAtTime(value, currentTime);
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
}
