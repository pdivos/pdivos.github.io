class DStatus {
    static get READY() { return new DStatus(0); }
    static get RUNNING() { return new DStatus(1); }
    static get WAITING() { return new DStatus(2); }
    static get SUCCEEDED() { return new DStatus(3); }
    static get FAILED() { return new DStatus(4); }
    static get FIDDLE() { return new DStatus(5); }
    constructor(v) {
        this.v = v;
        if(this.v==0) this.s = "READY";
        else if(this.v==1) this.s = "RUNNING";
        else if(this.v==2) this.s = "WAITING";
        else if(this.v==3) this.s = "SUCCEEDED";
        else if(this.v==4) this.s = "FAILED";
        else if(this.v==5) this.s = "FIDDLE";
        else throw "Invalid value " + v;
    }
}
DStatus.prototype.toString = function() {
    return this.s;
}


class DFunType {
    static get LAMBDA() { return new DFunType(0); }
    static get FUNCTION() { return new DFunType(1); }
    constructor(v) {
        this.v = v;
        if(this.v==0) this.s = "LAMBDA";
        else if(this.v==1) this.s = "FUNCTION";
        else throw "Invalid value " + v;
    }
}
DFunType.prototype.toString = function() {
    return this.s;
}

class DRef {
    constructor(v) {
        assert(v instanceof Uint8Array, v);
        assert(v.length == 20);
        this.v = v;
    }
}
DRef.prototype.toString = function() {
    return hex(this.v);
}

class DError {
    constructor(message) {
        this.message = message
    }
}
DError.prototype.toString = function() {
    return "DError: " + this.message;
}

class Fiddle {
    constructor(func, args, ts, value) {
        this.v = [func, args, ts, value];
    }
}
class Fiddles {
    constructor(v) {
        this.v = v;
    }
}
class DCall {
    constructor(dcommitset, func, args, ts, fiddles) {
        assert(typeof dcommitset === 'string')
        assert(typeof func === 'string')
        assert(typeof ts === 'number')
        this.v = [dcommitset, func, args, ts, fiddles];
    }
}
