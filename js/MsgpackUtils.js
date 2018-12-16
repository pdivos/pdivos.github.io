const EXT_TYPE_CORE = 0x40; // msgpack ext type of 0x40 denotes a dagger4 core object
const EXT_TYPE_CORE_DSTATUS = 's'.charCodeAt();
const EXT_TYPE_CORE_DFUNTYPE = 'F'.charCodeAt();
const EXT_TYPE_CORE_SET = 'S'.charCodeAt();
const EXT_TYPE_CORE_TUPLE = 'T'.charCodeAt();
const EXT_TYPE_CORE_DREF = 'R'.charCodeAt();
const EXT_TYPE_CORE_DERROR = 'E'.charCodeAt();
const EXT_TYPE_CORE_DCALL = 'C'.charCodeAt();
const EXT_TYPE_CORE_FIDDLE = 'd'.charCodeAt();
const EXT_TYPE_CORE_FIDDLES = 'D'.charCodeAt();
const EXT_TYPE_USER = 0x41; // msgpack ext type of 0x41 denotes a dagger4 user object

function DStatusUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new DStatus(v);
}
function DFunTypeUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new DFunType(v);
}
function SetUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new Set(v);
}
function DRefUnpacker(buffer) {
    var v = buffer;
    return new DRef(v);
}
function DErrorUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new DError(v);
}
function FiddleUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new Fiddle(v[0],v[1],v[2],v[3]);
}
function FiddlesUnpacker(buffer) {
    var v = msgpack.decode(buffer, {codec:MsgpackUtils_codec});
    return new Fiddles(v);
}
function DCallUnpacker(buffer) {
    var v = msgpack.decode(buffer, {codec:MsgpackUtils_codec});
    return new DCall(v[0],v[1],v[2],v[3],v[4]);
}
function TupleUnpacker(buffer) {
    return msgpack.decode(buffer, {codec:MsgpackUtils_codec});
}
function coreUnpacker(buffer) {
    var t = buffer[0];
    var data = buffer.slice(1,buffer.length);
    if(t == EXT_TYPE_CORE_DSTATUS) {
        return DStatusUnpacker(data);
    } else if(t == EXT_TYPE_CORE_DFUNTYPE) {
        return DFunTypeUnpacker(data);
    } else if(t == EXT_TYPE_CORE_SET) {
        return SetUnpacker(data);
    } else if(t == EXT_TYPE_CORE_TUPLE) {
        return TupleUnpacker(data);
    } else if(t == EXT_TYPE_CORE_DREF) {
        return DRefUnpacker(data);
    } else if(t == EXT_TYPE_CORE_DERROR) {
        return DErrorUnpacker(data);
    } else if(t == EXT_TYPE_CORE_DCALL) {
        return DCallUnpacker(data);
    } else if(t == EXT_TYPE_CORE_FIDDLE) {
        return FiddleUnpacker(data);
    } else if(t == EXT_TYPE_CORE_FIDDLES) {
        return FiddlesUnpacker(data);
    } else {
        throw "Unknown type: " + t;
    }
}

function DStatusPacker(dstatus) {
    assert(dstatus instanceof DStatus);
    buffer = msgpack.encode(dstatus.v);
    return new Uint8Array([EXT_TYPE_CORE_DSTATUS].concat(Array.from(buffer)));
}
function DFunTypePacker(dfuntype) {
    assert(dfuntype instanceof DFunType);
    buffer = msgpack.encode(dfuntype.v);
    return new Uint8Array([EXT_TYPE_CORE_DFUNTYPE].concat(Array.from(buffer)));
}
function SetPacker(set) {
    assert(set instanceof Set);
    buffer = msgpack.encode(Array.from(set));
    return new Uint8Array([EXT_TYPE_CORE_SET].concat(Array.from(buffer)));
}
function DRefPacker(dref) {
    assert(dref instanceof DRef);
    buffer = dref.v;
    return new Uint8Array([EXT_TYPE_CORE_DREF].concat(Array.from(buffer)));
}
function DErrorPacker(v) {
    assert(v instanceof DError);
    buffer = msgpack.encode(v.message);
    return new Uint8Array([EXT_TYPE_CORE_DERROR].concat(Array.from(buffer)));
}
function FiddlePacker(v) {
    assert(v instanceof Fiddle);
    buffer = msgpack.encode(v.v);
    return new Uint8Array([EXT_TYPE_CORE_FIDDLE].concat(Array.from(buffer)));
}
function FiddlesPacker(v) {
    assert(v instanceof Fiddles);
    buffer = msgpack.encode(v.v, {codec:MsgpackUtils_codec});
    return new Uint8Array([EXT_TYPE_CORE_FIDDLES].concat(Array.from(buffer)));
}
function DCallPacker(v) {
    assert(v instanceof DCall);
    buffer = msgpack.encode(v.v, {codec:MsgpackUtils_codec});
    return new Uint8Array([EXT_TYPE_CORE_DCALL].concat(Array.from(buffer)));
}

var MsgpackUtils_codec = msgpack.createCodec();

MsgpackUtils_codec.addExtUnpacker(EXT_TYPE_CORE, coreUnpacker);

MsgpackUtils_codec.addExtPacker(EXT_TYPE_CORE, DStatus, DStatusPacker);
MsgpackUtils_codec.addExtPacker(EXT_TYPE_CORE, DFunType, DFunTypePacker);
MsgpackUtils_codec.addExtPacker(EXT_TYPE_CORE, Set, SetPacker);
MsgpackUtils_codec.addExtPacker(EXT_TYPE_CORE, DRef, DRefPacker);
MsgpackUtils_codec.addExtPacker(EXT_TYPE_CORE, DError, DErrorPacker);
MsgpackUtils_codec.addExtPacker(EXT_TYPE_CORE, Fiddle, FiddlePacker);
MsgpackUtils_codec.addExtPacker(EXT_TYPE_CORE, Fiddles, FiddlesPacker);
MsgpackUtils_codec.addExtPacker(EXT_TYPE_CORE, DCall, DCallPacker);

class MsgpackUtils {
    static pack(o) {
        return msgpack.encode(o, {codec: MsgpackUtils_codec});
    }
    static unpack(b) {
        return msgpack.decode(b, {codec: MsgpackUtils_codec});
    }
}

function testMsgpackUtils() {
    test_objs = [
        DStatus.READY,
        DFunType.LAMBDA,
        new DRef(new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])),
        new DError("Errormsg"),
        new Fiddle("func",["args"],0,"value"),
        new Fiddles([new Fiddle("func",["args"],0,"value")]),
        new Set([1,2,3]),
    ];
    for (i in test_objs) {
        x = test_objs[i];
        console.log(MsgpackUtils.unpack(MsgpackUtils.pack(x)), x, MsgpackUtils.pack(x));
    }
}