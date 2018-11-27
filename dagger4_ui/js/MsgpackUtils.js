function DStatusPacker(dstatus) {
    return msgpack.encode(dstatus.v); // return Buffer serialized
}

function DStatusUnpacker(buffer) {
    var v = msgpack.decode(buffer);
    return new DStatus(v);
}

var MsgpackUtils_codec = msgpack.createCodec();
MsgpackUtils_codec.addExtPacker(0x73, DStatus, DStatusPacker);
MsgpackUtils_codec.addExtUnpacker(0x73, DStatusUnpacker);

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
// [212, 115, 3]
// [0xD4, 0x73, 0x03]