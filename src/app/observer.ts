export interface Observer {
    update(subject: ISubject): void;
}

interface ISubject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(): void;
}

export class Subject implements ISubject {
    private observers: Observer[] = [];

    attach(observer: Observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    detach(observer: Observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notify() {
        this.observers.map((observer) => observer.update(this));
    }
}
