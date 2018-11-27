class Client {
    constructor(host, onopen) {
        if (!"WebSocket" in window) {
            alert("WebSocket NOT supported by your Browser!");
            throw "WebSocket NOT supported by your Browser!";
        }

        var ws = new WebSocket("ws://"+host+":8000/dagger");
        ws.binaryType = "Uint8Array";
        var _this = this;
        ws.onopen = function() {
            onopen();
        };

        ws.onmessage = function (evt) { 
            var received_msg = evt.data;
            if(!evt.data instanceof Blob) {
                alert("Invalid response format received");
                throw "Invalid response format received";
            }
            var blob = evt.data;
            var myReader = new FileReader();
            myReader.readAsArrayBuffer(blob);
            myReader.addEventListener("loadend", function(e)
            {
                var buffer = e.srcElement.result;//arraybuffer object
                e = _this.callbacks.pop();
                e("Client", "onmessage", buffer);
                var msg = MsgpackUtils.unpack(new Uint8Array(buffer));
                e("Client", "onmessage", msg);
            });
        };

        ws.onclose = function() { 
            console.log("Connection closed");
        };

        this.ws = ws;
        this.callbacks = [];
    }

    _call(method, args, e) {
        e("Client", "call", method, args);
        this.callbacks.push(e);
        var msg = MsgpackUtils.pack({"method":method,"args":args});
        this.ws.send(msg);
    }

    ping(e) {
        this._call("ping",[],e);
    }
    test(e) {
        this._call("test",[[
            DStatus.SUCCEEDED,
            DFunType.LAMBDA,
            new Set([1,2,3]),
            new DRef(new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])),
            new DError("My Error message"),
            new Diddle("func",[19],0,1),
            new Diddles([new Diddle("func",[19],0,1)]),
            new DCall("dcommitset#1234567","func",[19],0,new Diddles([])),
        ]],e);
    }
}

