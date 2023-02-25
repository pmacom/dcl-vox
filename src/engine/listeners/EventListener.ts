import { GameControllerInstance } from "../GameController";

declare const Map: any;
declare const Set: any;

export interface IEventListener {
    name: string;
    callback: ((...args: any[]) => void)[];
}

export class EventListener {
    events = new EventManager();
    listeners: typeof Map = new Map();
    constructor(public gameController: GameControllerInstance) {

    }
    public addListener<T>(
        name: string,
        eventClass: IEventConstructor<T>, 
        callback: (...args: any[]) => void,
    ) {
        if(this.listeners.has(name)){
            const listeners = this.listeners.get(name);
            listeners.add(callback);
        }else{
            this.listeners.set(name, new Set([
                callback,
            ]));
            this.events.addListener(
                eventClass, 
                null, 
                (...event: any[]) => {
                    this.listeners.get(name)
                        .forEach(
                            (cb: (...args: any[]) => void) => cb(...event)
                        );
                }
            );
        }
    }
}