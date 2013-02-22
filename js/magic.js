/*global define: false */
/**
 * Adds methods to {@link module:character} related to the use of magical
 * abilities.
 * @module magic
 * @requires jquery
 * @requires character
 * @requires classes
 * @requires development_points
 * @requires tables
 * @see module:character#ma
 * @see module:character#magic_level
 * @see module:character#magic_projection_defense
 * @see module:character#magic_projection_imbalances
 * @see module:character#magic_projection_offense
 * @see module:character#uses_zeon
 * @see module:character#zeon
 * @see module:character#zeon_recovery
 */
define(['jquery', 'character', 'classes', 'tables', 'development_points'],
function ($, Character, classes, tables) {

    /**
     * Gets the character's current Magic Accumulation (regardless of whether
     * or not they have the ability to utilize it).
     * @method module:character#ma
     * @return {Number}
     */
    Character.prototype.ma = function () {
        var base = tables.base_ma[this.characteristic('POW')],
            i,
            level,
            levels = this.levels,
            length = levels.length,
            multiples,
            total = base;
        for (i = 0; i < length; i++) {
            level = levels[i];
            multiples = level.DP['MA Multiple'];
            if (multiples) {
                total += multiples * base;
            }
        }
        return total;
    };

    /**
     * Get the character's total Magic Level (some of which may not have been
     * allocated yet to learning spells and such).
     * @method module:character#magic_level
     * @returns {Number}
     */
    Character.prototype.magic_level = function () {
        var i,
            level,
            levels = this.levels,
            length = levels.length,
            gradual_magic_learning = this.Advantages['Gradual Magic Learning'],
            total = tables.magic_level[this.characteristic('INT')],
            ml;
        for (i = 0; i < length; i++) {
            level = levels[i];
            ml = level.DP['Magic Level'];
            if (ml) {
                total += ml * 5;
            }
            if (gradual_magic_learning) {
                total += 5;
            }
        }
        return total;
        
    };

    /**
     * Get the character's Magic Projection when used for defense, including
     * the effects of Magic Projection Imbalance and Mystic Modules.
     * @method module:character#magic_projection_defense
     * @returns {Number}
     */
    Character.prototype.magic_projection_defense = function () {
        var block,
            dodge,
            dp,
            i,
            levels = this.levels,
            count = levels.length,
            imbalance = this.magic_projection_imbalances()[count - 1],
            module = -50,
            normal = this.ability('Magic Projection'),
            value;
        if (imbalance) {
            normal -= imbalance;
        }
        if (this.has_module('Magic Projection as a Defense')) {
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
     * Get the character's Magic Projection Imbalance at each level.  In the
     * process, fix any inconsistencies resulting from changing when Magic
     * Projection was first purchased, etc.
     * @method module:character#magic_projection_imbalances
     * @return {Array} An array of integers between -30 and +30, except for
     *     levels before the character developed Magic Projection which contain
     *     undefined instead
     */
    Character.prototype.magic_projection_imbalances = function () {
        var developed = false,
            i,
            imbalance,
            value,
            last_value = 0,
            level_info,
            levels = this.levels,
            count = levels.length,
            mp,
            result = [];
        for (i = 0; i < count; i++) {
            level_info = levels[i];
            imbalance = level_info['Magic Projection Imbalance'];
            mp = levels[i].DP['Magic Projection'];
            if (!mp && !developed) {
                // No Magic Projection yet, so no imbalance is possible
                result.push(undefined);
                if (typeof imbalance === 'number') {
                    delete level_info['Magic Projection Imbalance'];
                }
            }
            else if (mp && !developed) {
                // Any imbalance from -15 to +15 is possible
                developed = true;
                value = (typeof imbalance === 'number') ? imbalance : 0;
                value = Math.max(Math.min(value, 30), -30);
                result.push(value);
                if (value !== 0) {
                    level_info['Magic Projection Imbalance'] = value;
                }
                else if (imbalance) {
                    delete level_info['Magic Projection Imbalance'];
                }
            }
            else {
                // Imbalance is limited by last level's value
                value = (typeof imbalance === 'number') ? imbalance : last_value;
                value = Math.max(value, last_value - 10);
                value = Math.min(value, last_value + 10);
                value = Math.max(Math.min(value, 30), -30);
                result.push(value);
                if (value !== 0 || last_value !== 0) {
                    level_info['Magic Projection Imbalance'] = value;
                }
                else if (last_value === 0 && (typeof imbalance === 'number')) {
                    // no need to record it past this point
                    delete level_info['Magic Projection Imbalance'];
                }
            }
            last_value = value;
        }
        return result;
    };

    /**
     * Get the character's Magic Projection when used for offense, including
     * the effects of Magic Projection Imbalance and Mystic Modules.
     * @method module:character#magic_projection_offense
     * @returns {Number}
     */
    Character.prototype.magic_projection_offense = function () {
        var i,
            levels = this.levels,
            count = levels.length,
            imbalance = this.magic_projection_imbalances()[count - 1],
            module = -50,
            normal = this.ability('Magic Projection'),
            value;
        if (imbalance) {
            normal += imbalance;
        }
        if (this.has_module('Magic Projection as an Attack')) {
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

    /**
     * Determine if the character has a convenient means of utilizing their
     * Zeon.  Used when deciding whether to show it in the stat block or not.
     * @method module:character#uses_zeon
     * @return {Boolean}
     */
    Character.prototype.uses_zeon = function () {
        var bonus;
        if (this.has_gift()) {
            // Can cast spells with it
            return true;
        }
        // Has the character invested in any summoning abilities?
        bonus = this.modifier('POW');
        if (this.ability('Summon') > bonus) {
            return true;
        }
        if (this.ability('Banish') > bonus) {
            return true;
        }
        if (this.ability('Bind') > bonus) {
            return true;
        }
        bonus = this.modifier('WP');
        if (this.ability('Control') > bonus) {
            return true;
        }
        // Don't support things like Sheele yet...
        return false;
    };

    /**
     * Get the character's total Zeon count (even if he can't normally utilize
     * it).
     * @method module:character#zeon
     * @returns {Number}
     */
    Character.prototype.zeon = function () {
        var i,
            level,
            levels = this.levels,
            length = levels.length,
            magic_nature = this.Advantages['Magic Nature'],
            total = tables.base_zeon[this.characteristic('POW')],
            zeon;
        for (i = 0; i < length; i++) {
            level = levels[i];
            zeon = level.DP.Zeon;
            if (zeon) {
                total += zeon * 5;
            }
            zeon = classes[level.Class].bonuses.Zeon;
            if (zeon) {
                total += zeon;
            }
            if (magic_nature) {
                total += magic_nature * 50;
            }
        }
        return total;
    };

    /**
     * Get the number of Zeon points the character recovers each day before
     * subtracting maintained spells, binds, etc.  May be different from MA
     * due to advantages, Zeon Regeneration Multiples, and so forth.
     * @method module:character#zeon_recovery
     * @return {Number}
     */
    Character.prototype.zeon_recovery = function () {
        var base = tables.base_ma[this.characteristic('POW')],
            blockage = this.Advantages['Magical Blockage'],
            blockage_ea = this.levels[0].DP['Magic Blockage'],
            i,
            level,
            levels = this.levels,
            length = levels.length,
            multiples,
            slow = this.Disadvantages['Slow Recovery of Magic'],
            slow_ea = this.levels[0].DP['Slow Recovery of Magic'],
            superior = this.Advantages['Superior Magic Recovery'],
            superior_ea = this.levels[0].DP['Superior Magic Recovery'],
            total = this.ma();
        if (blockage || blockage_ea) {
            return 0;
        }
        for (i = 0; i < length; i++) {
            level = levels[i];
            multiples = level.DP['Zeon Regeneration Multiple'];
            if (multiples) {
                total += multiples * base;
            }
        }
        if (superior) {
            total *= (superior + 1);
        }
        else if (superior_ea) {
            total *= 2;
        }
        if (slow) {
            total /= 2;
        }
        else if (slow_ea) {
            total /= 2;
        }
        return total;
    };

});
