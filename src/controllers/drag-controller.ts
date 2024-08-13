import { ReactiveController, ReactiveControllerHost } from "lit";

export type Cartesian2D = {
    x: number;
    y: number;
};

export class DragController implements ReactiveController {
    private host: ReactiveControllerHost;

    private offset: Cartesian2D = {
        x: 0,
        y: 0,
    };

    styles = {
        top: "0px",
        left: "0px",
    };

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this);
    }

    hostConnected() {}

    hostDisconnected() {}

    onDragStart(e: DragEvent) {
        this.offset = {
            x: e.layerX,
            y: e.layerY,
        };
    }

    onDrag(e: DragEvent) {
        if (e.screenX !== 0) {
            this.styles = {
                // TODO: remove magic numbers coming from offset of the graph-container
                top: `${e.clientY - this.offset.y - 32}px`,
                left: `${e.clientX - this.offset.x - 16}px`,
            };

            this.host.requestUpdate();
        }
    }
}
