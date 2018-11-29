function DStatusPacker(dstatus) {
    assert(dstatus instanceof DStatus);
    return msgpack.encode(dstatus.v);
}
function DStatusUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new DStatus(v);
}
function DFunTypePacker(dfuntype) {
    assert(dfuntype instanceof DFunType);
    return msgpack.encode(dfuntype.v);
}
function DFunTypeUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new DFunType(v);
}
function SetPacker(set) {
    assert(set instanceof Set);
    return msgpack.encode(Array.from(set));
}
function SetUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new Set(v);
}
function DRefPacker(dref) {
    assert(dref instanceof DRef);
    return dref.v;
}
function DRefUnpacker(buffer) {
    var v = buffer;
    return new DRef(v);
}
function DErrorPacker(v) {
    assert(v instanceof DError);
    return msgpack.encode(v.message);
}
function DErrorUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new DError(v);
}
function FiddlePacker(v) {
    assert(v instanceof Fiddle);
    return msgpack.encode(v.v);
}
function FiddleUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new Fiddle(v[0],v[1],v[2],v[3]);
}
function FiddlesPacker(v) {
    assert(v instanceof Fiddles);
    return msgpack.encode(v.v, {codec:MsgpackUtils_codec});
}
function FiddlesUnpacker(buffer) {
    var v = msgpack.decode(buffer, {codec:MsgpackUtils_codec});
    return new Fiddles(v);
}
function DCallPacker(v) {
    assert(v instanceof DCall);
    return msgpack.encode(v.v, {codec:MsgpackUtils_codec});
}
function DCallUnpacker(buffer) {
    var v = msgpack.decode(buffer, {codec:MsgpackUtils_codec});
    return new DCall(v[0],v[1],v[2],v[3],v[4]);
}
function TupleUnpacker(buffer) {
    return msgpack.decode(buffer, {codec:MsgpackUtils_codec});
}

var MsgpackUtils_codec = msgpack.createCodec();
MsgpackUtils_codec.addExtPacker(0x73, DStatus, DStatusPacker);
MsgpackUtils_codec.addExtUnpacker(0x73, DStatusUnpacker);
MsgpackUtils_codec.addExtPacker(0x46, DFunType, DFunTypePacker);
MsgpackUtils_codec.addExtUnpacker(0x46, DFunTypeUnpacker);
MsgpackUtils_codec.addExtPacker(0x53, Set, SetPacker);
MsgpackUtils_codec.addExtUnpacker(0x53, SetUnpacker);
MsgpackUtils_codec.addExtPacker(0x52, DRef, DRefPacker);
MsgpackUtils_codec.addExtUnpacker(0x52, DRefUnpacker);
MsgpackUtils_codec.addExtPacker(0x45, DError, DErrorPacker);
MsgpackUtils_codec.addExtUnpacker(0x45, DErrorUnpacker);
MsgpackUtils_codec.addExtPacker(0x64, Fiddle, FiddlePacker);
MsgpackUtils_codec.addExtUnpacker(0x64, FiddleUnpacker);
MsgpackUtils_codec.addExtPacker(0x44, Fiddles, FiddlesPacker);
MsgpackUtils_codec.addExtUnpacker(0x44, FiddlesUnpacker);
MsgpackUtils_codec.addExtPacker(0x43, DCall, DCallPacker);
MsgpackUtils_codec.addExtUnpacker(0x43, DCallUnpacker);
// no packer for tuple because no tuple in javascript
MsgpackUtils_codec.addExtUnpacker(0x54, TupleUnpacker);

class MsgpackUtils {
    static pack(o) {
        return msgpack.encode(o, {codec: MsgpackUtils_codec});
    }
    static unpack(b) {
        return msgpack.decode(b, {codec: MsgpackUtils_codec});
    }
}

// D   d   C   E   R   S   F   s
// 44  64  43  45  52  53  46  73

// 0x73 's' DStatus
// 0x46 'F' DFunType
// 0x53 'S' Set
// 0x52 'R' DRef
// 0x45 'E' DError
// 0x64 'd' Fiddle
// 0x44 'D' Fiddles
// 0x43 'C' DCall
// 0x54 'T' tuple