import { html, LitElement, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { DomSpace } from "../app/dom-mediator";

// TODO: move somewhere more general
export type Cartesian2D = {
    x: number;
    y: number;
};

export interface DomSpaceChangeDetail {
    id: string;
    space: DomSpace;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class DraggableInterface {
    protected renderDraggable(id: string, content: TemplateResult): TemplateResult;
}

export const Draggable = <T extends Constructor<LitElement>>(superClass: T) => {
    class DraggableElement extends superClass {
        private offset: Cartesian2D = {
            x: 0,
            y: 0,
        };

        @state()
        private styles = {
            top: "0px",
            left: "0px",
            position: "absolute",
        };

        private onDrag(e: DragEvent) {
            if (e.screenX !== 0) {
                const domSpaceChange: DomSpaceChangeDetail = {
                    id: (e.target as Element).id,
                    space: {
                        position: {
                            x: e.clientX - this.offset.x,
                            y: e.clientY - this.offset.y,
                        },
                        offset: {
                            x: (e.target as Element).scrollWidth,
                            y: (e.target as Element).scrollHeight,
                        },
                    },
                };
                this.styles = {
                    // TODO: remove magic numbers coming from offset of the graph-container
                    top: `${e.clientY - this.offset.y - 32}px`,
                    left: `${e.clientX - this.offset.x - 16}px`,
                    position: "absolute",
                };
                this.dispatchEvent(new CustomEvent("dom-space-change", { detail: { domSpaceChange }, composed: true }));
            }
        }

        private onDragStart(e: DragEvent) {
            this.offset = {
                x: e.layerX,
                y: e.layerY,
            };
        }

        protected renderDraggable(id: string, content: TemplateResult): TemplateResult {
            return html`
                <div
                    id=${id}
                    draggable="true"
                    @drag=${(e: DragEvent) => this.onDrag(e)}
                    @dragstart=${(e: DragEvent) => this.onDragStart(e)}
                    style=${styleMap(this.styles)}
                >
                    ${content}
                </div>
            `;
        }
    }
    return DraggableElement as unknown as Constructor<DraggableInterface> & T;
};
