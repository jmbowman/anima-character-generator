/*global define: false */
/**
 * A grouping of Anima: Beyond Fantasy characters.  This is the top-level data
 * object for the application.  Currently it's just initialized with a single
 * blank character, but the goal is to be able to rapidly choose between a
 * set of characters.
 * @module characters
 * @requires character
 */
define(['character'], function (Character) {
    return {
        /** The full list of characters */
        all: [new Character()],
        /**
         * Get the character which is currently selected for editing.
         * @returns {Object} A {@link module:character} instance
         */
        current: function () {
            return this.all[0];
        }
    };
});
