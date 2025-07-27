import { AudioGraphId, ConnectionComponents, ImmutableRepository } from "./util";

export interface ConnectionEvent {
    type: "connection-ready" | "connection-cleared";
    connection: [ConnectionComponents, ConnectionComponents];
}

export class ConnectionRepo implements ImmutableRepository<[ConnectionComponents, ConnectionComponents]> {
    private connections: Array<[ConnectionComponents, ConnectionComponents]> = [];
    private pendingConnectionState: [ConnectionComponents?, ConnectionComponents?] = [undefined, undefined];
    private created: number = 0;
    private eventListeners: ((event: ConnectionEvent) => void)[] = [];

    add(connection: [ConnectionComponents, ConnectionComponents]): Array<[ConnectionComponents, ConnectionComponents]> {
        this.connections = [...this.connections, connection];
        this.created++;
        return this.connections;
    }

    getAll(): Array<[ConnectionComponents, ConnectionComponents]> {
        return this.connections;
    }

    update(item: [ConnectionComponents, ConnectionComponents]): Array<[ConnectionComponents, ConnectionComponents]> {
        return this.connections;
    }

    findById(id: string): [ConnectionComponents, ConnectionComponents] | undefined {
        return undefined;
    }

    remove(connection: [ConnectionComponents, ConnectionComponents]): [ConnectionComponents, ConnectionComponents][] {
        this.connections = this.connections.filter((c) => c !== connection);
        return this.connections;
    }

    removeAllById(id: AudioGraphId): [ConnectionComponents, ConnectionComponents][] {
        this.connections = this.connections.filter((c) => !(c[0][0] === id[0] && c[0][1] === id[1]) && !(c[1][0] === id[0] && c[1][1] === id[1]));
        return this.connections;
    }

    getPendingConnectionState(): [ConnectionComponents?, ConnectionComponents?] {
        return this.pendingConnectionState;
    }

    updatePendingConnectionState(components: ConnectionComponents): [ConnectionComponents?, ConnectionComponents?] {
        // select source
        if (this.pendingConnectionState[0] === undefined) {
            this.pendingConnectionState = [components, undefined];
            // deselect source
        } else if (this.connectionComponentsEqual(this.pendingConnectionState[0], components)) {
            this.pendingConnectionState = [undefined, undefined];
            // select target
        } else if (this.pendingConnectionState[0] !== undefined) {
            this.emit({
                type: "connection-ready",
                connection: [this.pendingConnectionState[0], components],
            });
            this.pendingConnectionState = [undefined, undefined];
        }
        return this.pendingConnectionState;
    }

    clear(): Array<[ConnectionComponents, ConnectionComponents]> {
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

    private connectionComponentsEqual(a?: ConnectionComponents, b?: ConnectionComponents): boolean {
        if (!a || !b) return false;
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
    }
}
