class DStatus {
    static get READY() { return new DStatus(0); }
    static get RUNNING() { return new DStatus(1); }
    static get WAITING() { return new DStatus(2); }
    static get SUCCEEDED() { return new DStatus(3); }
    static get FAILED() { return new DStatus(4); }
    constructor(v) {
        this.v = v;
        if(this.v==0) this.s = "READY";
        else if(this.v==1) this.s = "RUNNING";
        else if(this.v==2) this.s = "WAITING";
        else if(this.v==3) this.s = "SUCCEEDED";
        else if(this.v==4) this.s = "FAILED";
        else throw "Invalid value " + v;
    }
}
DStatus.prototype.toString = function() {
    return this.s;
}