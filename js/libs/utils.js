/*global define: false */
define(function () {

    Object.keys = Object.keys || (function () {
        var hop = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{toString: null}.propertyIsEnumerable("toString"),
            DontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            DontEnumsLength = DontEnums.length;

        return function (o) {
            var i,
                name,
                result = [];
            if (typeof o !== "object" && typeof o !== "function" || o === null) {
                throw new TypeError("Object.keys called on a non-object");
            }
            for (name in o) {
                if (hop.call(o, name)) {
                    result.push(name);
                }
            }
            if (hasDontEnumBug) {
                for (i = 0; i < DontEnumsLength; i++) {
                    if (hop.call(o, DontEnums[i])) {
                        result.push(DontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
  
    return {
        // Finds the intersection of two already-sorted arrays in a simple fashion.
        intersection: function (a, b) {
            var ai = 0,
                bi = 0,
                result = [];
            while (ai < a.length && bi < b.length) {
                if (a[ai] < b[bi]) {
                    ai++;
                }
                else if (a[ai] > b[bi]) {
                    bi++;
                }
                else { /* they're equal */
                    result.push(a[ai]);
                    ai++;
                    bi++;
                }
            }
            return result;
        }
    };
});
