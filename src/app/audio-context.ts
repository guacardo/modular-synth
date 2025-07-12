let audioContextInstance: AudioContext | null = null;
export function getAudioContext(): AudioContext {
    if (!audioContextInstance) {
        try {
            audioContextInstance = new AudioContext();
        } catch (error) {
            throw new Error("Failed to create AudioContext: " + error);
        }
    }
    return audioContextInstance;
}

export function closeAudioContext(): void {
    if (audioContextInstance && audioContextInstance.state !== "closed") {
        audioContextInstance.close();
        audioContextInstance = null;
    }
}
