import { ImmutableRepository } from "./util";

export class ConnectionRepo implements ImmutableRepository<[string, string]> {
    private connections: Array<[string, string]> = [];
    private tempConnectionState: [string, string] = ["", ""];
    private created: number = 0;

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
        return this.tempConnectionState;
    }

    updatePendingConnectionState(id: string): [string, string] {
        console.log(id);

        // select source
        if (this.tempConnectionState[0] === "") {
            this.tempConnectionState = [id, ""];
            // deselect source
        } else if (this.tempConnectionState[0] === id) {
            this.tempConnectionState = ["", ""];
            // select target
        } else if (this.tempConnectionState[0] !== "") {
            this.tempConnectionState = [this.tempConnectionState[0], id];
        }
        return this.tempConnectionState;
    }

    clear(): Array<[string, string]> {
        this.connections = [];
        return this.connections;
    }
}
