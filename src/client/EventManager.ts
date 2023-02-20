declare const Map: any;

export class InputListener {
    public events: typeof Map = new Map();
    public input = Input.instance;
    constructor(){
    }
    subscribe(key: string){
        if(this.events.has(key)){
            return this.events.get(key);
        }else{
            this.events.set(key, {
                callback: () => {
                    this.input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, (e) => {
                        log("pointer Down", e)
                      })
                      
                }
            })
        }
    }
    
}