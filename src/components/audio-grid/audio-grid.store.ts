export type AudioGridItem = {
    id: string;
    position: [number, number];
};

export class AudioGridStore {
    readonly gridItems: AudioGridItem[] = [];
}
