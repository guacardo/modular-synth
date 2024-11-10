import { ReactiveController, ReactiveControllerHost } from "lit";

export class DraggableController implements ReactiveController {
    host: ReactiveControllerHost;

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this);
    }

    hostConnected(): void {
        console.log(this.host);
    }

    hostDisconnected(): void {
        console.log("disconnected host");
    }

    hostUpdate(): void {
        console.log("host update");
    }

    hostUpdated(): void {
        console.log("host updated");
    }
}
