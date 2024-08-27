import { Cartesian2D } from "../mixins/draggable";

export type DomSpace = {
    position: Cartesian2D;
    offset: Cartesian2D;
};

export type NodeDomMap = Map<string, DomSpace>;

// thoughts: more TS-style singleton pattern? https://medium.com/swlh/design-patterns-in-typescript-singleton-part-1-of-5-bd3742b46589
export class DomMediator {
    nodeDomElements: NodeDomMap;

    private static instance: DomMediator = new DomMediator();

    constructor() {
        this.nodeDomElements = new Map<string, DomSpace>();
    }

    static getInstance(): DomMediator {
        return this.instance;
    }

    getSpace(id: string) {
        return this.nodeDomElements.get(id);
    }

    setSpace(id: string, space: DomSpace) {
        this.nodeDomElements.set(id, space);
    }

    getSpaces(): DomSpace[] {
        return Array.from(this.nodeDomElements.values());
    }
}
