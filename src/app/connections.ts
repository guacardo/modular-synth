import { ImmutableRepository } from "./util";

export interface ConnectionEvent {
    type: "connection-ready" | "connection-cleared";
    connection: [string, string];
}

export class ConnectionRepo implements ImmutableRepository<[string, string]> {
    private connections: Array<[string, string]> = [];
    private pendingConnectionState: [string, string] = ["", ""];
    private created: number = 0;
    private eventListeners: ((event: ConnectionEvent) => void)[] = [];

    add(connection: [string, string]): Array<[string, string]> {
        this.connections = [...this.connections, connection];
        this.created++;
        return this.connections;
    }

    getAll(): Array<[string, string]> {
        return this.connections;
    }

    update(item: [string, string]): Array<[string, string]> {
        console.log(item);
        return this.connections;
    }

    findById(id: string): [string, string] | undefined {
        console.log(id);
        return undefined;
    }

    remove(connection: [string, string]): [string, string][] {
        this.connections = this.connections.filter((c) => c !== connection);
        return this.connections;
    }

    removeAllById(id: string): [string, string][] {
        this.connections = this.connections.filter((c) => c[0] !== id && c[1] !== id);
        return this.connections;
    }

    getPendingConnectionState(): [string, string] {
        return this.pendingConnectionState;
    }

    updatePendingConnectionState(id: string): [string, string] {
        // select source
        if (this.pendingConnectionState[0] === "") {
            this.pendingConnectionState = [id, ""];
            // deselect source
        } else if (this.pendingConnectionState[0] === id) {
            this.pendingConnectionState = ["", ""];
            // select target
        } else if (this.pendingConnectionState[0] !== "") {
            this.pendingConnectionState = [this.pendingConnectionState[0], id];
            this.emit({
                type: "connection-ready",
                connection: this.pendingConnectionState,
            });
        }
        return this.pendingConnectionState;
    }

    resetPendingConnectionState(): [string, string] {
        this.pendingConnectionState = ["", ""];
        return this.pendingConnectionState;
    }

    clear(): Array<[string, string]> {
        this.connections = [];
        return this.connections;
    }

    onConnectionEvent(listener: (event: ConnectionEvent) => void): () => void {
        this.eventListeners.push(listener);
        // Return unsubscribe function
        return () => {
            const index = this.eventListeners.indexOf(listener);
            if (index > -1) {
                this.eventListeners.splice(index, 1);
            }
        };
    }

    private emit(event: ConnectionEvent): void {
        this.eventListeners.forEach((listener) => listener(event));
    }
}
