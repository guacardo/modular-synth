import { Cartesian2D } from "../mixins/draggable";
import { Subject } from "./observer";

export type DomSpace = {
    position: Cartesian2D;
    offset: Cartesian2D;
};

export type NodeDomMap = Map<string, DomSpace>;

// https://medium.com/swlh/design-patterns-in-typescript-singleton-part-1-of-5-bd3742b46589
interface IDomMediator {
    getSpace(id: string): DomSpace | undefined;
    setSpace(id: string, space: DomSpace): void;
    getSpaces(): DomSpace[];
}

export class DomMediator extends Subject implements IDomMediator {
    private static instance: DomMediator = new DomMediator();

    protected nodeDomElements: NodeDomMap;

    private constructor() {
        super();
        this.nodeDomElements = new Map<string, DomSpace>();
    }

    static getInstance(): DomMediator {
        if (!this.instance) {
            this.instance = new DomMediator();
        }
        return this.instance;
    }

    getSpace(id: string): DomSpace | undefined {
        return this.nodeDomElements.get(id);
    }

    setSpace(id: string, space: DomSpace) {
        this.nodeDomElements.set(id, space);
    }

    getSpaces(): DomSpace[] {
        return Array.from(this.nodeDomElements.values());
    }
}
