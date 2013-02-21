/*global define: false */
/**
 * Adds new methods to the {@link module:character} class in order to handle
 * the allocation of Martial Knowledge.  To use any of the added methods,
 * require this module first.
 * @module martial_knowledge
 * @requires jquery
 * @requires character
 * @requires classes
 * @requires ki_abilities
 * @requires martial_arts
 * @see module:character#add_ki_ability
 * @see module:character#add_dominion_technique
 * @see module:character#has_ki_ability
 * @see module:character#ki_abilities
 * @see module:character#ki_accumulation
 * @see module:character#ki_concealment
 * @see module:character#ki_detection
 * @see module:character#ki_points
 * @see module:character#mk_remaining
 * @see module:character#mk_totals
 * @see module:character#mk_used
 * @see module:character#remove_dominion_technique
 * @see module:character#remove_ki_ability
 * @see module:character#update_level
 */
define(['jquery', 'character', 'classes', 'ki_abilities', 'martial_arts'],
       function ($, Character, classes, ki_abilities, martial_arts) {

    /**
     * Give the character a Dominion Technique at the specified level.
     * @method module:character#add_dominion_technique
     * @param {String} tree The name of the tree the Technique belongs to
     * @param {String} name The name of the Technique
     * @param {Number} level The level of the Technique
     * @param {Number} mk The MK cost of the Technique (to the character; may
     *     have been reduced from the normal amount via Technique Imitation)
     * @param {Number} at_level The character level at which the Technique was
     *     learned
     */
    Character.prototype.add_dominion_technique = function (tree, name, level,
                                                           mk, at_level) {
        var data = {Name: name, Level: level, MK: mk},
            index = (at_level === 0) ? 0 : at_level - 1,
            level_info = this.levels[index],
            level_mk = level_info.MK,
            remaining = this.mk_remaining()[index];
        if (mk > remaining + 50 || 'Insufficient Martial Knowledge' in this) {
            // can't afford it, do nothing
            return;
        }
        if (!level_mk) {
            level_mk = {};
            level_info.MK = level_mk;
        }
        if (!(tree in level_mk)) {
            level_mk[tree] = [];
        }
        level_mk[tree].push(data);
        if (mk > remaining) {
            this['Insufficient Martial Knowledge'] = {Tree: tree, Name: name, Penalty: -Math.floor((mk - remaining) / 10)};
        }
    };

    /**
     * Give the character a Ki Ability at the specified level.
     * @method module:character#add_ki_ability
     * @param {String} name The name of the Ki Ability obtained
     * @param {Number} level The level at which the Ki Ability was purchased
     * @param {String} [option] ny relevant parameter, such as an element type
     */
    Character.prototype.add_ki_ability = function (name, level, option) {
        var index = (level === 0) ? 0 : level - 1,
            ki_ability = ki_abilities[name],
            cost = ki_ability.MK,
            level_info = this.levels[index],
            mk = level_info.MK,
            remaining = this.mk_remaining()[index];
        if (this.has_ki_ability(name, option)) {
            // already have it, do nothing
            return;
        }
        if (cost > remaining + 50 || 'Insufficient Martial Knowledge' in this) {
            // can't afford it, do nothing
            return;
        }
        if (!mk) {
            mk = {};
            level_info.MK = mk;
        }
        if (name in mk) {
            mk[name].MK += ki_ability.MK;
            mk[name].Options.push(option);
            mk[name].Options.sort();
        }
        else {
            if (ki_ability.Option_Title) {
                mk[name] = {MK: ki_ability.MK, Options: [option]};
            }
            else {
                mk[name] = ki_ability.MK;
            }
        }
        if (cost > remaining) {
            this['Insufficient Martial Knowledge'] = {Name: name, Penalty: -Math.floor((cost - remaining) / 10)};
            if (ki_ability.Option_Title) {
                this['Insufficient Martial Knowledge'].Option = option;
            }
        }
    };

    /**
     * List the character's Dominion Techniques as text descriptions.  Used in
     * the stat block.
     * @method module:character#dominion_techniques
     * @returns {Object} A mapping of the character's Technique Tree names to
     *     alphabetically sorted Arrays of the names of the Techniques in them
     */
    Character.prototype.dominion_techniques = function () {
        var i,
            imk = this['Insufficient Martial Knowledge'],
            imk_technique,
            imk_tree,
            j,
            mk,
            levels = this.levels,
            count = levels.length,
            name,
            technique,
            techniques,
            technique_count,
            trees = {};
        if (imk && ('Tree' in imk)) {
            imk_technique = imk.Name;
            imk_tree = imk.Tree;
            name = imk_technique + ' (POW ' + imk.Penalty + ' check to use)';
            trees[imk_tree] = [name];
        }
        for (i = 0; i < count; i++) {
            mk = levels[i].MK;
            if (mk) {
                for (name in mk) {
                    if (mk.hasOwnProperty(name)) {
                        if (!(name in ki_abilities)) {
                            // Should be a Dominion Technique
                            if (!(name in trees)) {
                                trees[name] = [];
                            }
                            techniques = mk[name];
                            technique_count = techniques.length;
                            for (j = 0; j < technique_count; j++) {
                                technique = techniques[j];
                                if (name === imk_tree && technique === imk_technique) {
                                    // Already added it above
                                    continue;
                                }
                                trees[name].push(technique);
                            }
                        }
                    }
                }
            }
        }
        // Now sort the technique names in each tree
        for (name in trees) {
            if (trees.hasOwnProperty(name)) {
                trees[name].sort();
            }
        }
        return trees;
    };

    /**
     * Does the character already have a certain Ki Ability?
     * @method module:character#has_ki_ability
     * @param {String} name The name of the Ki Ability
     * @param {String} [option] The name of the option, in the case of Ki
     *     Abilities that can be taken for multiple elements, etc.
     * @param {Number} [level] If specified, the level by which the character
     *     must have the Ki Ability for the return value to be true.
     * @returns {Boolean}
     */
    Character.prototype.has_ki_ability = function (name, option, level) {
        var mk,
            i,
            levels = this.levels,
            count = levels.length;
        if (typeof level !== 'undefined') {
            count = level === 0 ? 1 : level;
        }
        if (name === 'Ki Concealment' && this.Race === "D'Anjayni Nephilim") {
            return true;
        }
        for (i = 0; i < count; i++) {
            mk = levels[i].MK;
            if (mk && (name in mk)) {
                if (!ki_abilities[name].Option_Title) {
                    return true;
                }
                if ($.inArray(option, mk[name].Options) >= 0) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * List the character's Ki and Nemesis abilities as text descriptions.
     * Used in the stat block.
     * @method module:character#ki_abilities
     * @returns {Array} The abilities listed in alphabetical order
     */
    Character.prototype.ki_abilities = function () {
        var description,
            have_options = {},
            i,
            imk = this['Insufficient Martial Knowledge'],
            imk_name,
            mk,
            levels = this.levels,
            count = levels.length,
            name,
            result = [];
        if (imk && !('Tree' in imk)) {
            imk_name = imk.Name;
            description = imk_name + ' (';
            if ('Option' in imk) {
                description += imk.Option + ', ';
            }
            description += 'POW ' + imk.Penalty + ' check to use)';
            result.push(description);
        }
        for (i = 0; i < count; i++) {
            mk = levels[i].MK;
            if (mk) {
                for (name in mk) {
                    if (mk.hasOwnProperty(name)) {
                        if (!(name in ki_abilities)) {
                            // Dominion Technique, Ars Magnus, Limit, etc.
                            continue;
                        }
                        if (!ki_abilities[name].Option_Title) {
                            if (name !== imk_name) {
                                result.push(name);
                            }
                        }
                        else if (name in have_options) {
                            have_options[name] = have_options[name].concat(mk[name].Options);
                        }
                        else {
                            have_options[name] = mk[name].Options;
                        }
                    }
                }
            }
        }
        for (name in have_options) {
            if (have_options.hasOwnProperty(name)) {
                result.push(name + '(' + have_options[name].join(', ') + ')');
            }
        }
        if (this.Race === "D'Anjayni Nephilim") {
            result.push('Ki Concealment');
        }
        result.sort();
        return result;
    };

    /**
     * Calculate the character's Ki Accumulation rate for the specified
     * characteristic.
     * @method module:character#ki_accumulation
     * @param {String} characteristic STR, DEX, AGI, CON, POW, or WP
     * @returns {Number}
     */
    Character.prototype.ki_accumulation = function (characteristic) {
        var dp,
            i,
            levels = this.levels,
            count = levels.length,
            multiples,
            score = this.characteristic(characteristic),
            total = 1;
        if (score >= 16) {
            total = 4;
        }
        else if (score >= 13) {
            total = 3;
        }
        else if (score >= 10) {
            total = 2;
        }
        for (i = 0; i < count; i++) {
            dp = levels[i].DP;
            multiples = dp['Accumulation Multiple'];
            if (multiples) {
                multiples = multiples[characteristic];
                if (multiples) {
                    total += multiples;
                }
            }
        }
        return total;
    };

    /**
     * Calculates the character's Ki Concealment score.  Doesn't  verify that
     * he actually has the Ki Concealment ability.
     * @method module:character#ki_concealment
     * @returns {Number}
     */
    Character.prototype.ki_concealment = function () {
        var bonus,
            cls,
            hide = this.ability('Hide'),
            i,
            imperceptible_ki = 'Imperceptible Ki' in this.Advantages,
            level = this.level(),
            levels = this.levels,
            level_count = levels.length,
            mk = this.mk_totals()[level_count - 1],
            total = Math.floor((mk + hide) / 2);
        for (i = 0; i < level_count; i++) {
            cls = classes[levels[i].Class];
            bonus = cls.bonuses['Ki Concealment'];
            if (bonus) {
                total += (level === 0) ? Math.floor(bonus / 2) : bonus;
            }
            if (imperceptible_ki) {
                total += 10;
            }
        }
        if (this.Race === "D'Anjayni Nephilim") {
            total += 30;
        }
        return total;
    };

    /**
     * Calculates the character's Ki Detection score.  Doesn't verify that he
     * actually has the Ki Detection ability.
     * @method module:character#ki_detection
     * @returns {Number}
     */
    Character.prototype.ki_detection = function () {
        var ki_perception = 'Ki Perception' in this.Advantages,
            level_count = this.levels.length,
            mk = this.mk_totals()[level_count - 1],
            notice = this.ability('Notice'),
            total = Math.floor((mk + notice) / 2);
        if (ki_perception) {
            total += 10 * level_count;
        }
        return total;
    };

    /**
     * Calculate the character's total Ki Points for the specified
     * characteristic.
     * @method module:character#ki_points
     * @param {String} characteristic STR, DEX, AGI, CON, POW, or WP
     * @returns {Number}
     */
    Character.prototype.ki_points = function (characteristic) {
        var dp,
            i,
            levels = this.levels,
            count = levels.length,
            points,
            total = this.characteristic(characteristic);
        if (total > 10) {
            // Each Characteristic point over 10 yields 2 Ki Points
            total += (total - 10);
        }
        for (i = 0; i < count; i++) {
            dp = levels[i].DP;
            points = dp.Ki;
            if (points) {
                points = points[characteristic];
                if (points) {
                    total += points;
                }
            }
        }
        return total;
    };

    /**
     * Calculates the character's total remaining MK at each level.
     * @method module:character#mk_remaining
     * @returns {Object} An array of the character's remaining MK at each
     *     level.  Note that these are cumulative totals, not just the amounts
     *     remaining from the MK gained at each level.
     */
    Character.prototype.mk_remaining = function () {
        var amount,
            i,
            is_level_zero = this.level() === 0,
            result = [],
            totals = this.mk_totals(),
            count = totals.length,
            limit = totals[count - 1];
        for (i = count - 1; i >= 0; i--) {
            amount = totals[i] - this.mk_used(is_level_zero ? 0 : i + 1);
            if (amount < limit) {
                limit = amount;
            }
            result[i] = Math.max(Math.min(amount, limit), 0);
        }
        return result;
    };

    /**
     * Calculates the character's total MK (from levels, advantages, martial
     * arts, etc.) at each level.
     * @method module:character#mk_totals
     * @param {Number} [level] The level at which to stop calculating the
     *     character's total MK.  If not specified, the totals for all levels
     *     are returned.
     * @returns {Array} An array of the character's total MK at each level up
     *     to and including the one specified.
     */
    Character.prototype.mk_totals = function (level) {
        var degree_count,
            degrees,
            dp,
            i,
            item,
            j,
            level_info,
            levels = this.levels,
            count = levels.length,
            martial_mastery = this.Advantages['Martial Mastery'],
            mk,
            result = [],
            total = 0;
        if (typeof level !== 'undefined') {
            count = level === 0 ? 1 : level;
        }
        else {
            level = this.level();
        }
        if (martial_mastery) {
            total += martial_mastery * 40;
        }
        for (i = 0; i < count; i++) {
            level_info = levels[i];
            mk = classes[level_info.Class].MK;
            total += (level === 0) ? (mk / 2) : mk;
            dp = level_info.DP;
            for (item in dp) {
                if (dp.hasOwnProperty(item)) {
                    if (item === 'Martial Knowledge') {
                        total += level_info.DP['Martial Knowledge'] * 5;
                    }
                    else if (item in martial_arts) {
                        degrees = dp[item];
                        degree_count = degrees.length;
                        for (j = 0; j < degree_count; j++) {
                            mk = martial_arts[item][degrees[j]].MK;
                            if (mk) {
                                total += mk;
                            }
                        }
                    }
                }
            }
            result.push(total);
        }
        return result;
    };

    /**
     * Calculate how much MK the character has allocated so far.
     * @method module:character#mk_used
     * @param {Number} [level] The level at which to stop calculating the
     *     character's spent MK.  If not specified, all levels are calculated.
     * @returns {Number} The amount of MK allocated by the specified level.
     */
    Character.prototype.mk_used = function (level) {
        var i,
            j,
            item,
            levels = this.levels,
            count = levels.length,
            mk,
            used = 0,
            technique_count,
            value;
        if (typeof level !== 'undefined') {
            count = (level === 0) ? 1 : level;
        }
        for (i = 0; i < count; i++) {
            mk = levels[i].MK;
            if (mk) {
                for (item in mk) {
                    if (mk.hasOwnProperty(item)) {
                        value = mk[item];
                        if (typeof value === 'number') {
                            // MK cost only
                            used += value;
                        }
                        else if (value.Options) {
                            // Ki Ability with parameters
                            used += value.MK * value.Options.length;
                        }
                        else {
                            // Tree of Dominion Techniques
                            technique_count = value.length;
                            for (j = 0; j < technique_count; j++) {
                                used += value[j].MK;
                            }
                        }
                    }
                }
            }
        }
        return used;
    };

    /**
     * Remove the Dominion Technique of the given tree and name from the
     * abilities chosen at the specified level.
     * @method module:character#remove_dominion_technique
     * @param {String} tree The tree of techniques that this one belongs to
     * @param {String} name The name of the Dominion Technique
     * @param {Number} level The level at which it had been taken
     */
    Character.prototype.remove_dominion_technique = function (tree, name, level) {
        var count,
            i,
            imk = this['Insufficient Martial Knowledge'],
            index = level === 0 ? 0 : level - 1,
            mk = this.levels[index].MK,
            techniques;
        if (mk[tree].length === 1) {
            delete mk[tree];
        }
        else {
            techniques = mk[tree];
            count = techniques.length;
            for (i = 0; i < count; i++) {
                if (techniques[i].Name === name) {
                    techniques.splice(i, 1);
                    break;
                }
            }
        }
        // If something was purchased past the MK limit, need to update
        if (imk) {
            if (imk.Tree === tree && imk.Name === name) {
                delete this['Insufficient Martial Knowledge'];
            }
            else {
                this.update_level();
            }
        }
    };

    /**
     * Remove the Ki Ability of the given name from the abilities chosen
     * at the specified level.
     * @method module:character#remove_ki_ability
     * @param {String} name
     * @param {Number} level
     * @param {String} [options] Any option needed to uniquely identify the
     *     ability to be removed (for example, an element name)
     */
    Character.prototype.remove_ki_ability = function (name, level, options) {
        var array,
            imk = this['Insufficient Martial Knowledge'],
            index = level === 0 ? 0 : level - 1,
            ki_ability = ki_abilities[name],
            mk = this.levels[index].MK;
        if (!ki_ability.Option_Title || mk[name].Options.length === 1) {
            delete mk[name];
        }
        else {
            array = mk[name].Options;
            array.splice($.inArray(options, array), 1);
        }
        // If something was purchased past the MK limit, need to update
        if (imk) {
            if (imk.Name === name && !imk.Tree) {
                delete this['Insufficient Martial Knowledge'];
            }
            else {
                this.update_level();
            }
        }
    };

    /**
     * Update the character data (especially the levels array and any
     * pre-purchased Ki Ability or Dominion Technique) to be appropriate for
     * the character's current XP total.
     * @method module:character#update_level
     */
    Character.prototype.update_level = function () {
        var count,
            current_level = this.level(),
            item,
            highest_cost = 0,
            i,
            j,
            imk = this['Insufficient Martial Knowledge'],
            levels = this.levels,
            level_count = levels.length,
            mk,
            mk_remaining,
            value;
        // remove any extra levels if revising XP down
        while (level_count > current_level && level_count > 1) {
            levels.pop();
            level_count--;
        }
        // add new levels, continuing last class
        while (level_count < current_level) {
            levels.push({Class: levels[level_count - 1].Class, DP: {}});
            level_count++;
        }
        // Can't use mk_remaining() because we need to know if it's negative
        mk_remaining = this.mk_totals()[level_count - 1] - this.mk_used();
        if (mk_remaining >= 0 && imk) {
            delete this['Insufficient Martial Knowledge'];
        }
        else if (mk_remaining < 0) {
            if (imk) {
                if (this.has_ki_ability(imk.Name, imk.Option)) {
                    // Still have the ability, recalculate the penalty
                    imk.Penalty = Math.floor(mk_remaining / 10);
                    return;
                }
                // Lost a level with that ability, pick a new one below
                delete this['Insufficient Martial Knowledge'];
                imk = undefined;
            }
            // Look through the levels, most recent first, for a new "imk"
            for (i = levels.length - 1; i >= 0; i--) {
                mk = levels[i].MK;
                for (item in mk) {
                    if (mk.hasOwnProperty(item)) {
                        value = mk[item];
                        if (typeof value === 'number') {
                            // Ki Ability with no parameters
                            if (value > highest_cost) {
                                imk = {Name: item};
                                highest_cost = value;
                            }
                        }
                        else if (value.MK) {
                            // Ki Ability with a parameter
                            if (value.MK > highest_cost) {
                                count = value.Options.length;
                                imk = {Name: item, Option: value.Options[count - 1]};
                                highest_cost = value.MK;
                            }
                        }
                        else {
                            // Technique tree, may have multiple techniques
                            count = value.length;
                            for (j = 0; j < count; j++) {
                                if (value[j].MK > highest_cost) {
                                    imk = {Tree: item, Name: value[j].Name};
                                    highest_cost = value[j].MK;
                                }
                            }
                        }
                    }
                }
                if (imk) {
                    // Found a suitable replacement
                    imk.Penalty = -Math.floor((highest_cost - mk_remaining) / 10);
                    this['Insufficient Martial Knowledge'] = imk;
                    break;
                }
            }
        }
    };
    
});
