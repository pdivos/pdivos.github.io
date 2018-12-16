class Client {
    constructor(host, onopen, onresponse) {
        if (!"WebSocket" in window) {
            alert("WebSocket NOT supported by your Browser!");
            throw "WebSocket NOT supported by your Browser!";
        }

        this.msg_id_autoinc = 0;
        this.onresponse = onresponse;
        
        var ws= new WebSocket("ws://"+host+":8000/dagger");
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
                var msg = MsgpackUtils.unpack(new Uint8Array(buffer));
                var msg_id = msg['msg_id'];
                var response = msg['response'];
                var method = _this.methods[msg_id];
                var args = _this.argss[msg_id];
                delete _this.methods[msg_id];
                delete _this.argss[msg_id];
                if(response instanceof DError) {
                    throw response;
                } else {
                    _this.onresponse(msg_id, method, args, response);
                }
            });
        };

        ws.onclose = function() { 
            console.log("Connection closed");
        };

        this.ws = ws;
        this.methods = [];
        this.argss = [];
    }

    _call(method, args) {
        assert(typeof method === 'string', method);
        if(args == undefined) args = [];
        assert(typeof args === 'object', args);
        console.log("Request", method, args);
        this.methods[this.msg_id_autoinc] = method;
        this.argss[this.msg_id_autoinc] = args;
        var msg = MsgpackUtils.pack({"method":method,"args":args,"msg_id":this.msg_id_autoinc});
        this.msg_id_autoinc++;
        this.ws.send(msg);
        return this.msg_id_autoinc-1
    }

    shutdown() {
        return this._call("shutdown");
    }
    ping() {
        return this._call("ping");
    }
    echo(v) {
        return this._call("echo",[v]);
    }
    err() {
        return this._call("err");
    }
    echo(v) {
        return this._call("echo",[v]);
    }
    get_dcommitsets() {
        return this._call("get_dcommitsets")
    }
    get_dcommitset(dcommitset) {
        return this._call("get_dcommitset",[dcommitset])
    }
    get_dcommits() {
        return this._call("get_dcommits")
    }
    get_dcommit(dcommit) {
        return this._call("get_dcommit",[dcommit])
    }
    get_dcallable(dcallable_hash) {
        return this._call("get_dcallable",[dcallable_hash])
    }
    get_nodes() {
        return this._call("get_nodes");
    }
    get_nodes_raw() {
        return this._call("get_nodes_raw");
    }
    get_node(id) {
        assert(typeof(id) === 'number', id);
        return this._call("get_node",[id]);
    }
    build(dcommitset) {
        assert(typeof dcommitset === 'string', dcommitset);
        return this._call("build",[dcommitset]);
    }
    get_workers() {
        return this._call("get_workers");
    }
    get_worker(worker_id) {
        return this._call("get_worker",[worker_id])
    }
}

