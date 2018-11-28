function main() {
    var host = "35.176.145.209";
    // var host = "127.0.0.1";
    var c = new Client(host,function(){
        // var test = [
        //     DStatus.SUCCEEDED,
        //     DFunType.LAMBDA,
        //     new Set([1,2,3]),
        //     new DRef(new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])),
        //     new DError("My Error message"),
        //     new Diddle("func",[19],0,1),
        //     new Diddles([new Diddle("func",[19],0,1)]),
        //     new DCall("dcommitset#1234567","func",[19],0,new Diddles([])),
        // ];
        // c.echo(test);
        // c.err();
        c.ping();
        c.get_nodes_raw();
        c.get_nodes();
        c.build("https://pdivos@bitbucket.org/pdivos/dagger4_test1.git#aa27a1a");
        c.worker_logs();
        c.shutdown();
    }, function(msg_id, method, args, response) {
        console.log("Response", msg_id, method, args, response);
    });
}
  