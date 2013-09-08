/*global define: false */
/**
 * Adds methods to {@link module:character} related to the use of psychic
 * abilities.
 * @module psychic
 * @requires jquery
 * @requires character
 * @requires classes
 * @requires development_points
 * @see module:character#psychic_points
 * @see module:character#psychic_powers
 * @see module:character#psychic_projection_defense
 * @see module:character#psychic_projection_offense
 */
define(['jquery', 'character', 'classes', 'development_points'],
function ($, Character, classes) {

    /**
     * Get the character's total number of psychic points at the specified
     * level.
     * @method module:character#psychic_points
     * @param {Number} [level] The level at which to get the total; if omitted,
     *     calculates for the character's current level
     * @returns {Number}
     */
    Character.prototype.psychic_points = function (level) {
        var class_levels = {},
            cls,
            dp,
            i,
            level_info,
            levels = this.levels,
            count = level ? level : levels.length,
            result = 1;
        for (i = 0; i < count; i++) {
            level_info = levels[i];
            cls = level_info.Class;
            dp = level_info.DP;
            if (cls in class_levels) {
                class_levels[cls] += 1;
            }
            else {
                class_levels[cls] = 1;
            }
            if (class_levels[cls] % classes[cls]['Innate Psychic Points'] === 0) {
                result += 1;
            }
            if ('Psychic Points' in dp) {
                result += dp['Psychic Points'];
            }
        }
        return result;
    };

    /**
     * Get a listing of the character's known psychic  powers.  Returns an
     * object whose attribute names are the Power names and values are the
     * character's Psychic Potential with those powers.
     * @method module:character#psychic_powers
     * @returns {Object}
     * @todo Finish implementing this
     */
    Character.prototype.psychic_powers = function () {
        var info = this.Advantages['Access to Natural Psychic Powers'],
            points,
            potential,
            powers = {};
        if (info) {
            potential = 120;
            points = info.Points;
            if (points === 2) {
                potential = 140;
            }
            else if (points === 3) {
                potential = 180;
            }
            powers[info.Power] = potential;
        }
        return powers;
    };

    /**
     * Get the character's Psychic Projection when used for defense, including
     * the effects of the Psychic Module.
     * @method module:character#psychic_projection_defense
     * @returns {Number}
     */
    Character.prototype.psychic_projection_defense = function () {
        var block,
            dodge,
            dp,
            i,
            levels = this.levels,
            count = levels.length,
            module = -50,
            normal = this.ability('Psychic Projection'),
            value;
        if (this.has_module('Psychic Projection Module')) {
            block = this.modifier('DEX');
            dodge = this.modifier('AGI');
            for (i = 0; i < count; i++) {
                dp = levels[i].DP;
                value = dp.Block;
                if (value) {
                    block += value;
                }
                value = dp.Dodge;
                if (value) {
                    dodge += value;
                }
            }
            module = Math.max(block, dodge);
        }
        return Math.max(module, normal);
    };

    /**
     * Get the character's Psychic Projection when used for offense, including
     * the effects of the Psychic Module.
     * @method module:character#psychic_projection_offense
     * @returns {Number}
     */
    Character.prototype.psychic_projection_offense = function () {
        var i,
            levels = this.levels,
            count = levels.length,
            module = -50,
            normal = this.ability('Psychic Projection'),
            value;
        if (this.has_module('Psychic Projection Module')) {
            module = this.modifier('DEX');
            for (i = 0; i < count; i++) {
                value = levels[i].DP.Attack;
                if (value) {
                    module += value;
                }
            }
        }
        return Math.max(module, normal);
    };

});
