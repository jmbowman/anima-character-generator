/*global define: false */
define(['character'], function (Character) {
    return {
        all: [new Character()],
        current: function () {
            return this.all[0];
        }
    };
});
