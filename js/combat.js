/*global define: false */
/**
 * Combat calculations which depend on the character's martial arts and/or
 * equipment.  Adds new methods to the {@link module:character} class; to use
 * any of them, require this module first.
 * @module combat
 * @requires character
 * @requires classes
 * @requires martial_arts
 * @requires martial_knowledge
 * @requires movement
 * @see module:character#martial_art_damage
 * @see module:character#martial_arts
 * @see module:character#martial_arts_advantages
 * @see module:character#unarmed_ability
 * @see module:character#unarmed_damage
 */
define(['character', 'classes', 'martial_arts', 'martial_knowledge', 'movement'],
function (Character, classes, martial_arts) {

    var degree_index;

    /**
     * Get the position index (0-2) of the named martial art degree when the
     * possible degrees of that martial art are ranked from simplest to most
     * advanced.
     * @param {String} degree
     * @returns {Number}
     */
    degree_index = function (degree) {
        if (degree === 'Base') {
            return 0;
        }
        if (degree === 'Supreme') {
            return 2;
        }
        return 1;
    };

    /**
     * Calculate this character's Base Damage when using the specified martial
     * art.
     * @method module:character#martial_art_damage
     * @param {String} martial_art The name of a martial art
     * @param {String} degree The degree of the martial art (Base, Arcane, etc.)
     * @param {Object} [arts] The cached result of calling this.martial_arts()
     * @returns {Number}
     */
    Character.prototype.martial_art_damage = function (martial_art, degree, arts) {
        var art,
            formula,
            has_tcs = false,
            style = martial_arts[martial_art],
            data = style[degree],
            multiplier = 1,
            name,
            result = 0,
            value;
        if (martial_art === 'Exelion') {
            // Special case
            return (this.presence() * 2) + this.modifier('POW');
        }
        while (!data.Damage) {
            if (degree === 'Supreme') {
                degree = 'Advanced';
            }
            else if (degree === 'Base') {
                break;
            }
            else {
                degree = 'Base';
            }
            data = style[degree];
        }
        if (!arts) {
            arts = this.martial_arts();
        }
        if ('Tai Chi' in arts && arts['Tai Chi'].Degree === 'Supreme') {
            has_tcs = true;
        }
        if ('Arcane' in style) {
            // Need to get the best base damage among the Basic martial arts
            for (name in arts) {
                if (arts.hasOwnProperty(name)) {
                    art = arts[name];
                    if (art.Type === 'Advanced') {
                        continue;
                    }
                    value = this.martial_art_damage(name, art.Degree, arts);
                    result = Math.max(result, value);
                }
            }
            if ('Damage' in data) {
                formula = data.Damage;
                if (typeof formula === 'number') {
                    result += formula;
                }
                else {
                    result += this.modifier(formula);
                }
            }
            return result;
        }
        // Past here it has to be a Basic Martial Art
        formula = data.Damage;
        if (typeof formula === 'number') {
            // Fixed amount plus STR modifier
            result = formula + this.modifier('STR');
        }
        else {
            if ('Characteristic' in formula) {
                value = this.modifier(formula.Characteristic);
            }
            else {
                value = this.modifier('STR');
            }
            if ('Multiplier' in formula) {
                multiplier = formula.Multiplier;
            }
            result = formula.Base + (value * multiplier);
        }
        if (has_tcs && martial_art !== 'Tai Chi') {
            result += this.modifier('POW');
        }
        return result;
    };

    /**
     * Collect information about which martial arts the character has mastered
     * to what degrees.  The result will have for each martial art he/she has
     * mastered a property whose name is that of the martial art and whose
     * value is an object with two String properties: Degree and Type (the
     * latter will always be either "Basic" or "Advanced").
     * @method module:character#martial_arts
     * @param {Number} [at_level] Get the character's martial arts as of this
     *     level.  If omitted, get the ones he/she currently has.
     * @returns {Object}
     */
    Character.prototype.martial_arts = function (at_level) {
        var art,
            data,
            degree,
            degrees,
            dp,
            i,
            levels = this.levels,
            name,
            count = levels.length,
            result = {},
            style;
        if (typeof at_level !== 'undefined') {
            count = at_level === 0 ? 1 : at_level;
        }
        for (i = 0; i < count; i++) {
            dp = levels[i].DP;
            for (name in dp) {
                if (dp.hasOwnProperty(name) && name in martial_arts) {
                    degrees = dp[name];
                    degree = degrees[degrees.length - 1];
                    if (name in result) {
                        art = result[name];
                        if (degree_index(degree) > degree_index(art.Degree)) {
                            art.Degree = degree;
                        }
                    }
                    else {
                        style = martial_arts[name];
                        data = style.Base;
                        art = {
                            Degree: degree,
                            Type: 'Basic'
                        };
                        if ('Arcane' in style) {
                            art.Type = 'Advanced';
                        }
                        result[name] = art;
                    }
                }
            }
        }
        return result;
    };

    /**
     * List all the advantages (beyond those to base statistics) gained from
     * the character's martial arts.
     * @method module:character#martial_arts_advantages
     * @param {Object} [arts] The cached result of calling this.martial_arts()
     * @returns {Array} An Array of advantage description Strings
     */
    Character.prototype.martial_arts_advantages = function (arts) {
        var advantages,
            art,
            art_advantages,
            data,
            degree,
            result = [];
        if (!arts) {
            arts = this.martial_arts();
        }
        for (art in arts) {
            if (arts.hasOwnProperty(art)) {
                art_advantages = [];
                degree = arts[art].Degree;
                if (degree !== 'Base') {
                    data = martial_arts[art].Base;
                    advantages = data.advantages;
                    if (advantages) {
                        art_advantages = art_advantages.concat(advantages);
                    }
                }
                if (degree === 'Supreme') {
                    data = martial_arts[art].Advanced;
                    advantages = data.Advantages;
                    if (advantages) {
                        if (data.Replace) {
                            art_advantages = advantages;
                        }
                        else {
                            art_advantages = art_advantages.concat(advantages);
                        }
                    }
                }
                data = martial_arts[art][degree];
                advantages = data.Advantages;
                if (advantages) {
                    if (data.Replace) {
                        art_advantages = advantages;
                    }
                    else {
                        art_advantages = art_advantages.concat(advantages);
                    }
                }
                result = result.concat(art_advantages);
            }
        }
        return result;
    };

    /**
     * Calculate the character's final score in a particular aspect of unarmed
     * combat, taking martial arts into account.
     * @method module:character#unarmed_ability
     * @param {Object} name The name of an unarmed combat ability: Attack,
     *     Block, Dodge, or Initiative
     * @param {Object} [arts] The cached result of calling this.martial_arts()
     * @param {Number} [at_level] Get the score as of this level.  If omitted,
     *     get the character's current score.
     * @returns {Number}
     */
    Character.prototype.unarmed_ability = function (name, arts, at_level) {
        var art,
            bonuses,
            count,
            class_bonus = 0,
            cls,
            combat_senses = this.Advantages['Combat Senses'],
            data,
            degree,
            i,
            level,
            levels = this.levels,
            limit = 50,
            master_bonus = 0,
            martial_art,
            result,
            style;
        if (!arts) {
            arts = this.martial_arts(at_level);
        }
        for (martial_art in arts) {
            if (arts.hasOwnProperty(martial_art)) {
                art = arts[martial_art];
                degree = art.Degree;
                style = martial_arts[martial_art];
                data = style[degree];
                if ('Master Bonus' in data) {
                    bonuses = data['Master Bonus'];
                    if (name in bonuses) {
                        master_bonus = Math.max(master_bonus, bonuses[name]);
                    }
                }
                if ('Bonus' in data) {
                    bonuses = data.Bonus;
                    if (name in bonuses) {
                        class_bonus += bonuses[name];
                    }
                }
                if (degree === 'Supreme') {
                    data = style.Advanced;
                    if ('Bonus' in data) {
                        bonuses = data.Bonus;
                        if (name in bonuses) {
                            class_bonus += bonuses[name];
                        }
                    }
                }
                if (degree !== 'Base') {
                    data = style.Base;
                    if ('Bonus' in data) {
                        bonuses = data.Bonus;
                        if (name in bonuses) {
                            class_bonus += bonuses[name];
                        }
                    }
                }
            }
        }
        if (name === 'Initiative') {
            result = this.initiative(at_level) + 20;
        }
        else {
            result = this.ability(name, at_level);
            // Account for any bonuses already received for class or advantages
            if (typeof at_level !== 'undefined') {
                count = at_level === 0 ? 1 : at_level;
            }
            else {
                count = levels.length;
            }
            level = this.level();
            for (i = 0; i < count; i++) {
                cls = classes[levels[i].Class];
                data = cls.bonuses[name];
                if (data) {
                    limit -= (level === 0) ? Math.floor(data / 2) : data;
                }
                if (combat_senses === name) {
                    limit -= 5;
                }
            }
            if (class_bonus > limit) {
                class_bonus = limit;
            }
        }
        if ('Asakusen' in arts) {
            result += 10;
        }
        return result + class_bonus + master_bonus;
    };

    /**
     * Calculate the character's Base Damage with unarmed attacks, assuming
     * he or she is using the most damaging martial art known (if any).
     * @method module:character#unarmed_damage
     * @param {Object} [arts] The cached result of calling this.martial_arts()
     * @returns {Number}
     */
    Character.prototype.unarmed_damage = function (arts) {
        var i,
            levels = this.levels,
            length = levels.length,
            name,
            nw = false,
            result = 0,
            size = this.size();
        if (!arts) {
            arts = this.martial_arts();
        }
        for (name in arts) {
            // Use martial art base damage if available
            if (arts.hasOwnProperty(name)) {
                result = Math.max(result, this.martial_art_damage(name, arts[name].Degree, arts));
            }
        }
        if (result === 0) {
            for (i = 0; i < length; i++) {
                if ('Natural Weapons' in levels[i].DP) {
                    nw = true;
                }
            }
            // Use appropriate value for size
            if (size < 4) {
                result = nw ? 20 : 5;
            }
            else if (size < 9) {
                result = nw ? 30 : 10;
            }
            else if (size < 23) {
                result = nw ? 40 : 10;
            }
            else if (size < 25) {
                result = nw ? 60 : 20;
            }
            else if (size < 29) {
                result = nw ? 100 : 30;
            }
            else if (size < 34) {
                result = nw ? 120 : 40;
            }
            else {
                result = nw ? 140 : 60;
            }
            result += this.modifier('STR');
        }
        if ('Asakusen' in arts) {
            result += 10;
        }
        if (this.has_ki_ability('Increased Damage') && !('Exelion' in arts)) {
            result += 10;
        }
        return result;
    };
});
