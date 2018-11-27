function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

function hex(b) {
    if(b instanceof Uint8Array) {
        return b.reduce(function(memo, i) {
            return memo + ('0' + i.toString(16)).slice(-2); //padd with leading 0 if <16
        }, '');
    }
}