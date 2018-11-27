function main() {
    var c = new Client("127.0.0.1",function(){
        var test = [
            DStatus.SUCCEEDED,
            DFunType.LAMBDA,
            new Set([1,2,3]),
            new DRef(new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])),
            new DError("My Error message"),
            new Diddle("func",[19],0,1),
            new Diddles([new Diddle("func",[19],0,1)]),
            new DCall("dcommitset#1234567","func",[19],0,new Diddles([])),
        ];
        c.echo(test, console.log);
        c.err(console.log);
    });
}
  