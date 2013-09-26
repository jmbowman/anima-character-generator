/*global define: false */
/**
 * Adds methods to {@link module:character} related to the allocation of
 * Development Points.
 * @module development_points
 * @requires jquery
 * @requires abilities
 * @requires character
 * @requires classes
 * @requires essential_abilities
 * @requires martial_arts
 * @requires modules
 * @requires powers
 * @requires primaries
 * @requires tables
 * @requires combat
 * @requires libs/utils
 * @see module:character#add_essential_ability
 * @see module:character#add_martial_art
 * @see module:character#add_module
 * @see module:character#add_power
 * @see module:character#bonus_dp_from_gnosis
 * @see module:character#creature_dp_remaining
 * @see module:character#creature_dp_total
 * @see module:character#dp_cost
 * @see module:character#dp_remaining
 * @see module:character#ea_advantage_summary
 * @see module:character#ea_disadvantage_summary
 * @see module:character#essential_ability_allowed
 * @see module:character#has_martial_art
 * @see module:character#has_module
 * @see module:character#martial_art_allowed
 * @see module:character#power_allowed
 * @see module:character#power_parameters
 * @see module:character#power_upgrade_cost
 * @see module:character#remove_martial_art
 */
define(['jquery', 'abilities', 'character', 'classes', 'essential_abilities',
'martial_arts', 'modules', 'powers', 'primaries', 'tables', 'combat',
'libs/utils'],
function ($, abilities, Character, classes, essential_abilities, martial_arts,
          modules, powers, primaries, tables) {

    /**
     * Give the character a creature Essential Ability.
     * @method module:character#add_essential_ability
     * @param {String} name The name of the Essential Ability
     * @param {String} [option] Any parameter required for the Essential Ability
     */
    Character.prototype.add_essential_ability = function (name, option) {
        var ability,
            first_level_dp = this.levels[0].DP;
        if (name.indexOf('Attribute Increased') > -1) {
            if (name in first_level_dp) {
                first_level_dp[name].push(option);
            }
            else {
                first_level_dp[name] = [option];
            }
        }
        else if (name === 'Fatigue Resistance') {
            if (name in first_level_dp) {
                first_level_dp[name] += 1;
            }
            else {
                first_level_dp[name] = 1;
            }
        }
        else if (option) {
            first_level_dp[name] = option;
        }
        else {
            if (name in essential_abilities.advantages) {
                ability = essential_abilities.advantages[name];
            }
            else {
                ability = essential_abilities.disadvantages[name];
            }
            first_level_dp[name] = ability.DP;
        }
    };

    /**
     * Give the character a degree of skill with a martial art.  Needs to be
     * called for each degree mastered, not just for the highest one.
     * @method module:character#add_martial_art
     * @param {String} name The name of the martial art
     * @param {String} degree The degree of skill attained
     * @param {Number} level The level at which it was mastered
     */
    Character.prototype.add_martial_art = function (name, degree, level) {
        var dp = this.level_info(level).DP;
        if (name in dp) {
            dp[name].push(degree);
        }
        else {
            dp[name] = [degree];
        }
        if (!('First Martial Art' in this)) {
            this['First Martial Art'] = name;
        }
    };

    /**
     * Give the character a combat module at the specified level.
     * @method module:character#add_module
     * @param {String} name The name of the combat module obtained
     * @param {Number} level The level at which the module was purchased
     * @param {String} [option] Any relevant parameter, such as a weapon name
     *     or type
     */
    Character.prototype.add_module = function (name, level, option) {
        var index = (level === 0) ? 0 : level - 1,
            dp = this.levels[index].DP,
            module = modules[name];
        if (this.has_module(name, option)) {
            // already have it, do nothing
            return;
        }
        if (name in dp) {
            dp[name].push(option);
            dp[name].sort();
        }
        else {
            if (module.Option_Title) {
                dp[name] = [option];
            }
            else {
                dp[name] = module.DP;
            }
        }
    };

    /**
     * Add a new or updgraded creature power to the character.
     * @method module:character#add_power
     * @param {String} type The type of power being added or upgraded.
     * @param {Number} level The level at which the creature added/upgraded
     *     this power.
     * @param {Object} params Additional parameters for the power (options,
     *     disadvantages, etc.)
     */
    Character.prototype.add_power = function (type, level, params) {
        var dp = this.level_info(level).DP,
            power;
        if (type in dp) {
            dp[type].push(params);
        }
        else {
            power = powers[type];
            if (power.Repeatable || power.Attack_Linked) {
                dp[type] = [params];
            }
            else {
                dp[type] = params;
            }
        }
    };

    /**
     * Get the number of unallocated DP still available for use in purchasing
     * Essential Abilities and Characteristics for a creature.  It doesn't
     * bother subtract DP already spent on powers or class abilities, because
     * the Essential Abilities and Characteristics are finalized before those
     * are chosen.
     * @method module:character#creature_dp_remaining
     * @returns {Number} The number of DP still available for these purposes.
     */
    Character.prototype.creature_dp_remaining = function () {
        var advantages = essential_abilities.advantages,
            first_level_dp = this.levels[0].DP,
            name,
            remaining = this.creature_dp_total();
        if (this.is_spirit()) {
            remaining -= 100;
        }
        for (name in first_level_dp) {
            if (first_level_dp.hasOwnProperty(name)) {
                if (name === 'Fatigue Resistance') {
                    remaining -= first_level_dp[name] * advantages[name].DP;
                }
                else if (name.indexOf('Attribute Increased ') > -1) {
                    remaining -= first_level_dp[name].length * advantages[name].DP;
                }
                else if (name in advantages) {
                    remaining -= advantages[name].DP;
                }
                else if (name in essential_abilities.disadvantages) {
                    remaining -= essential_abilities.disadvantages[name].DP;
                }
            }
        }
        return remaining;
    };

    /**
     * Get the total number of DP that can be spent on Essential Abilities and
     * Characteristics based on level and Gnosis.
     * @method module:character#creature_dp_total
     * @returns {Number} The calculated DP number.
     */
    Character.prototype.creature_dp_total = function () {
        var bonus = this.bonus_dp_from_gnosis(),
            level = this.level();
        if (level === 0) {
            return 400 + bonus;
        }
        return 500 + (level * 100) + bonus;
    };

    /**
     * Get the number of bonus DP (if any) the creature receives to spend on
     * essential abilities and powers as a result of a high Gnosis value.
     * @method module:character#bonus_dp_from_gnosis
     * @returns {Number} A number of DP >= 0.
     */
    Character.prototype.bonus_dp_from_gnosis = function () {
        var gnosis = this.Gnosis;
        if (typeof gnosis !== 'number') {
            return 0;
        }
        if (gnosis >= 50) {
            return 750;
        }
        if (gnosis >= 45) {
            return 500;
        }
        if (gnosis >= 40) {
            return 300;
        }
        if (gnosis >= 35) {
            return 150;
        }
        if (gnosis >= 30) {
            return 50;
        }
        return 0;
    };

    /**
     * Get the cost in DP to the character of taking the specified ability
     * while in a particular class.
     * @method module:character#dp_cost
     * @param {String} name The name of the ability
     * @param {String} class_name The name of the character's class when the
     *     ability is taken
     * @param {String} [degree] The degree of a martial art being taken
     * @returns {Number} The appropriate DP cost
     */
    Character.prototype.dp_cost = function (name, class_name, degree) {
        var ability = abilities[name],
            character_class = classes[class_name],
            field,
            info,
            essentialAdvantages = essential_abilities.advantages,
            essentialDisadvantages = essential_abilities.disadvantages,
            myAdvantages = this.Advantages,
            reduced,
            result;
        if (name.indexOf('Save ') === 0) {
            // Saving DP for later can be done in any quantity
            return 1;
        }
        if (name in essentialAdvantages) {
            return essentialAdvantages[name].DP;
        }
        if (name in essentialDisadvantages) {
            return essentialDisadvantages[name].DP;
        }
        if (name in modules) {
            return modules[name].DP;
        }
        if (name in martial_arts) {
            info = martial_arts[name];
            if ('Arcane' in info) {
                return (class_name === 'Tao' ? 20 : 50);
            }
            reduced = (name === this['First Martial Art']);
            if (class_name === 'Tao') {
                if (degree === 'Supreme') {
                    return (reduced ? 10 : 20);
                }
                return (reduced ? 5 : 10);
            }
            else {
                if (degree === 'Base') {
                    return (reduced ? 10 : 20);
                }
                if (degree === 'Advanced') {
                    return (reduced ? 15 : 30);
                }
                return (reduced ? 25 : 50);
            }
        }
        if (ability) {
            field = ability.Field;
        }
        reduced = character_class.reduced[name];
        if (reduced) {
            result = reduced;
        }
        else if (field) {
            result = character_class[field];
        }
        else {
            result = character_class[name];
        }
        if (field) {
            if (myAdvantages['Aptitude in a Field'] === field) {
                result--;
            }
            info = myAdvantages['Aptitude in a Subject'];
            if (info && info.Ability === name) {
                result -= info.Points;
            }
        }
        if (result < 1) {
            result = 1;
        }
        return result;
    };

    /**
     * Calculate the number of DP still available to be spent in each primary
     * at each of the character's levels.
     * @method module:character#dp_remaining
     * @returns {Array} An array (one entry per level) of objects whose
     *     property names are primaries or special case abilities and whose
     *     property values are the corresponding number of available DP
     */
    Character.prototype.dp_remaining = function () {
        var attack,
            categories = Object.keys(primaries),
            characteristic,
            class_info,
            class_name,
            cost,
            costs = {Attack: 2, Block: 2, Dodge: 2},
            count,
            defense,
            degrees,
            entry,
            gnosis = this.Gnosis || 0,
            i,
            item,
            j,
            k,
            level = this.level(),
            levels = this.levels,
            level_count = levels.length,
            level_dp,
            level_info,
            mk = 0,
            ml = 0,
            new_dp = 600,
            pinch_points,
            previous_saved,
            primary,
            quarter,
            racial_level = this['Racial Level'] || 0,
            remaining,
            result,
            results = [],
            saved,
            scores = {Attack: 0, Block: 0, Dodge: 0},
            spent,
            totals = {Attack: 0, Block: 0, Dodge: 0, DP: 0,
                      'Magic Projection': 0, Powers: 0, Psychic: 0,
                      'Psychic Projection': 0, Supernatural: 0,
                      'Martial Knowledge': 0, 'Magic Level': 0};
        categories.push('Powers');
        for (i = 0; i < level_count; i++) {
            results.push({});
            result = results[i];
            level_info = levels[i];
            class_name = level_info.Class;
            class_info = classes[class_name];
            if (i === 0 && level === 0) {
                new_dp = 400;
            }
            else if (i > 0) {
                new_dp = 100;
            }
            totals.DP += new_dp;
            totals.Psychic += class_info.Psychic * new_dp / 100;
            totals.Supernatural += class_info.Supernatural * new_dp / 100;
            result.Total = new_dp;
            result.Combat = class_info.Combat * new_dp / 100;
            result.Psychic = class_info.Psychic * new_dp / 100;
            result.Supernatural = class_info.Supernatural * new_dp / 100;
            if (i === 0 || i < racial_level || gnosis >= 25) {
                totals.Powers += new_dp / 2;
                result.Powers = new_dp / 2;
            }
            else {
                result.Powers = 0;
            }
            if (i === 0) {
                j = this.bonus_dp_from_gnosis();
                result.Powers += j;
                result.Total += j;
                if (this.is_spirit()) {
                    result.Powers -= 100;
                    result.Total -= 100;
                }
                saved = {Combat: 0, Psychic: 0, Supernatural: 0, Powers: 0, Other: 0};
            }
            else {
                saved = {};
                previous_saved = results[i - 1].Saved;
                for (primary in previous_saved) {
                    if (previous_saved.hasOwnProperty(primary)) {
                        saved[primary] = previous_saved[primary];
                    }
                }
            }
            result.Saved = saved;
            mk += new_dp / 10;
            ml += new_dp / 10;
            result['Martial Knowledge'] = mk;
            result['Magic Level'] = ml;
            result.Other = new_dp;
            result['Magic Projection'] = (totals.Supernatural / 2) - totals['Magic Projection'];
            result['Psychic Projection'] = (totals.Psychic / 2) - totals['Psychic Projection'];
            level_dp = level_info.DP;
            for (item in level_dp) {
                if (level_dp.hasOwnProperty(item)) {
                    if (item in martial_arts) {
                        degrees = level_dp[item];
                        count = degrees.length;
                        cost = 0;
                        for (j = 0; j < count; j++) {
                            cost += this.dp_cost(item, class_name, degrees[j]);
                        }
                        spent = cost;
                    }
                    else if (item in powers) {
                        spent = powers[item].Options[0].DP;
                    }
                    else {
                        cost = this.dp_cost(item, class_name);
                        if (item in modules) {
                            if (modules[item].Option_Title) {
                                spent = level_dp[item].length * cost;
                            }
                            else {
                                spent = cost;
                            }
                        }
                        else if (item === 'Accumulation Multiple' || item === 'Ki') {
                            spent = 0;
                            entry = level_dp[item];
                            for (characteristic in entry) {
                                if (entry.hasOwnProperty(characteristic)) {
                                    spent += entry[characteristic] * cost;
                                }
                            }
                        }
                        else if (item.indexOf('Attribute Increased') > -1) {
                            spent = level_dp[item].length * cost;
                        }
                        else if (item === 'Fatigue Resistance') {
                            spent = level_dp[item] * cost;
                        }
                        else if (item in essential_abilities.advantages) {
                            spent = cost;
                        }
                        else if (item in essential_abilities.disadvantages) {
                            spent = cost;
                        }
                        else {
                            spent = level_dp[item] * cost;
                        }
                    }
                    result.Total -= spent;
                    primary = primaries.for_ability(item);
                    result[primary] -= spent;
                    if (item.indexOf('Save ') === 0) {
                        saved[primary] += spent;
                    }
                    if (item in result) {
                        result[item] -= spent;
                        if (item === 'Magic Level') {
                            ml -= spent;
                        }
                        else if (item === 'Martial Knowledge') {
                            mk -= spent;
                        }
                    }
                    if (item in scores) {
                        costs[item] = cost;
                        scores[item] += level_dp[item];
                    }
                    if (item in totals) {
                        totals[item] += spent;
                    }
                }
            }
            // Figure out theoretical attack and defense caps, Combat cap imposed later
            attack = scores.Attack;
            j = totals.Attack + totals.Block + totals.Dodge;
            defense = Math.max(scores.Block, scores.Dodge);
            count = totals.DP / 2 - j;
            quarter = totals.DP / 4;
            result.Attack = Math.min(count, Math.max((defense + 50 - attack) * costs.Attack, quarter - totals.Attack));
            if (this['Damage Resistance']) {
                result.Block = 0;
                result.Dodge = 0;
            }
            else {
                result.Block = Math.min(count, Math.max((attack + 50 - scores.Block) * costs.Block, quarter - totals.Block));
                result.Dodge = Math.min(count, Math.max((attack + 50 - scores.Dodge) * costs.Dodge, quarter - totals.Dodge));
            }
            cost = this.class_change_dp((level === 0) ? 0 : (i + 1));
            if (cost > 0) {
                result.Other -= cost;
                result.Total -= cost;
                result.Class_Change = cost;
            }
            count = categories.length;
            // Reconcile against total limit and previously saved DP
            for (j = 0; j < count; j++) {
                primary = categories[j];
                remaining = result[primary];
                if (remaining < 0) {
                    // used some of the DP saved at earlier levels
                    if (!('Withdrawn' in result)) {
                        result.Withdrawn = {};
                    }
                    result.Withdrawn[primary] = -remaining;
                    result[primary] = 0;
                    for (k = 0; k <= i; k++) {
                        saved = results[k].Saved;
                        saved[primary] = Math.max(saved[primary] + remaining, 0);
                    }
                }
                else {
                    result[primary] = Math.min(result[primary], result.Total);
                }
            }
        }
        // Now add the remaining DP saved from earlier levels
        count = categories.length;
        for (i = 0; i < level_count; i++) {
            level_dp = levels[i].DP;
            result = results[i];
            saved = result.Saved;
            for (j = 0; j < count; j++) {
                primary = categories[j];
                item = (primary === 'Other') ? 'generic' : primary;
                item = 'Save ' + item + ' DP for later';
                previous_saved = saved[primary];
                if (item in level_dp) {
                    previous_saved -= level_dp[item];
                }
                result[item] = result[primary];
                result[primary] += previous_saved;
                result.Total += previous_saved;
            }
        }
        // Now finish calculating the limits for abilities with special rules
        pinch_points = {Attack: result.Attack, Block: result.Block,
                        Dodge: result.Dodge,
                        'Magic Projection': result['Magic Projection'],
                        'Psychic Projection': result['Psychic Projection'],
                        'Martial Knowledge': result['Martial Knowledge'],
                        'Magic Level': result['Magic Level']};
        for (i = level_count - 1; i >= 0; i--) {
            result = results[i];
            for (item in pinch_points) {
                if (pinch_points.hasOwnProperty(item)) {
                    // may be limited by amounts spent later
                    j = Math.min(result[item], pinch_points[item]);
                    pinch_points[item] = j;
                    primary = primaries.for_ability(item);
                    // after determining pinch amount, limit by current cap
                    result[item] = Math.min(j, result[primary]);
                }
            }
        }
        return results;
    };

    /**
     * Get a text description of an Essential Ability Advantage that the
     * character has.  Basically tacks on any relevant options chosen for the
     * advantage after its name.
     * @method module:character#ea_advantage_summary
     * @param {String} name The name of the advantage
     * @returns {String}
     */
    Character.prototype.ea_advantage_summary = function (name) {
        var advantage = essential_abilities.advantages[name],
            param = this.levels[0].DP[name],
            result = name;
        if (name === 'Attribute Increased +3' || name === 'Fatigue Resistance') {
            result += ' (' + param + ')';
        }
        if ('Options' in advantage) {
            result += ': ' + param;
        }
        return result;
    };

    /**
     * Get a text description of an Essential Ability Disadvantage that the
     * character has.  Basically tacks on any relevant options chosen for the
     * disadvantage after its name.
     * @method module:character#ea_disadvantage_summary
     * @param {String} name The name of the disadvantage
     * @returns {String}
     */
    Character.prototype.ea_disadvantage_summary = function (name) {
        var disadvantage = essential_abilities.disadvantages[name],
            param = this.levels[0].DP[name],
            result = name;
        if ('Options' in disadvantage) {
            result += ': ' + param;
        }
        return result;
    };

    /**
     * Determine if the character is able to take the specified Essential
     * Ability.
     * @method module:character#essential_ability_allowed
     * @param {String} name The name of the Essential Ability
     * @param {String} [parameter] Any parameter needed to uniquely identify
     *     the Essential Ability
     * @returns {Boolean}
     */
    Character.prototype.essential_ability_allowed = function (name, parameter) {
        var ability,
            advantages = essential_abilities.advantages,
            allowed = true,
            category,
            cost,
            count,
            disadvantages = essential_abilities.disadvantages,
            element = this.Element,
            dp_remaining = this.creature_dp_remaining(),
            first_level_dp = this.levels[0].DP,
            i,
            myAdvantages = this.Advantages,
            params,
            required_gnosis = 15,
            type = this.Type;
        ability = (name in advantages) ? advantages[name] : disadvantages[name];
        cost = ability.DP;
        if (cost > dp_remaining) {
            return false;
        }
        category = ability.Category;
        if (category === 'Magic' && !this.has_gift()) {
            return false;
        }
        if (category === 'Psychic' &&
            !('Access to a Psychic Discipline' in first_level_dp) &&
            !('Access to Psychic Disciplines' in first_level_dp) &&
            !('Access to One Psychic Discipline' in myAdvantages) &&
            !('Free Access to Any Psychic Discipline' in myAdvantages)) {
            return false;
        }
        if (name === 'Psychic Inclination' && parameter) {
            if ($.inArray(parameter, this.discipline_access()) === -1) {
                return false;
            }
        }
        params = ability.Incompatible;
        if (params) {
            count = params.length;
            for (i = 0; i < count; i++) {
                if (params[i] in first_level_dp) {
                    return false;
                }
            }
        }
        if (name === 'Atrophied Members' && this.is_spirit()) {
            return false;
        }
        if (name === 'Physical Exemption') {
            if (this.is_spirit() || type.indexOf('Undead') > -1) {
                // they get it for free, so no need to pick it
                return false;
            }
        }
        if (element) {
            if (name === 'Access to a Psychic Discipline') {
                if (element === 'Fire' && parameter === 'Cryokinesis') {
                    return false;
                }
                if (element === 'Water' && parameter === 'Pyrokinesis') {
                    return false;
                }
            }
            if (name.indexOf('Natural Immunity to an Element') > -1) {
                if (parameter && parameter !== element) {
                    return false;
                }
                if (ability.Alternatives[0] in first_level_dp) {
                    return false;
                }
            }
            if (name.indexOf('Natural Vulnerability to an Element') > -1) {
                if (parameter && parameter !== tables.opposite_elements[element]) {
                    return false;
                }
                if (ability.Alternatives[0] in first_level_dp) {
                    return false;
                }
            }
        }
        if (name.indexOf('Natural Knowledge of a Path') > -1 && parameter) {
            params = ability.Alternatives;
            count = params.length;
            for (i = 0; i < count; i++) {
                if (params[i] in first_level_dp && first_level_dp[params[i]] === parameter) {
                    return false;
                }
            }
        }
        if (ability.Gnosis > this.Gnosis) {
            if (this.Created) {
                return false;
            }
            allowed = 'maybe';
        }
        if (name === 'Attribute Increased +1' || name === 'Attribute Increased +2') {
            if (!(name in first_level_dp)) {
                return allowed;
            }
            if (!parameter) {
                if (first_level_dp[name].length < 8) {
                    return allowed;
                }
                return false;
            }
            if ($.inArray(parameter, first_level_dp[name]) === -1) {
                return allowed;
            }
            return false;
        }
        else if (name === 'Attribute Increased +3') {
            if (!(name in first_level_dp)) {
                return allowed;
            }
            if (!parameter) {
                if (first_level_dp[name].length < 8) {
                    return allowed;
                }
                if (first_level_dp[name].length < 16) {
                    if (this.Gnosis >= 20) {
                        return true;
                    }
                    if (this.Created) {
                        return false;
                    }
                    return 'maybe';
                }
                if (this.Gnosis >= 25) {
                    return true;
                }
                if (this.Created) {
                    return false;
                }
                return 'maybe';
            }
            params = first_level_dp[name];
            count = params.length;
            for (i = 0; i < count; i++) {
                if (params[i] === parameter) {
                    required_gnosis += 5;
                }
            }
            if (this.Gnosis >= required_gnosis) {
                return true;
            }
            if (this.Created) {
                return false;
            }
            return 'maybe';
        }
        else if (name === 'Fatigue Resistance') {
            return true;
        }
        if (name in first_level_dp) {
            return false;
        }
        return allowed;
    };

    /**
     * Has the character already mastered a certain Martial Art to the
     * specified Degree?
     * @method module:character#has_martial_art
     * @param {String} name The name of the Martial Art in question
     * @param {String} degree The Degree of the Martial Art
     * @param {Number} [level] If specified, the level by which the character
     *     must have the Martial Art for the return value to be true.
     * @returns {Boolean}
     */
    Character.prototype.has_martial_art = function (name, degree, level) {
        var dp,
            i,
            levels = this.levels,
            count = levels.length;
        if (typeof level !== 'undefined') {
            count = level === 0 ? 1 : level;
        }
        for (i = 0; i < count; i++) {
            dp = levels[i].DP;
            if (name in dp && $.inArray(degree, dp[name]) >= 0) {
                return true;
            }
        }
        return false;
    };

    /**
     * Does the character already have a certain combat module?
     * @method module:character#has_module
     * @param {String} name The name of the module
     * @param {String} [option] The name of the option, in the case of modules
     *     that can be taken for multiple weapons or weapon types.
     * @returns {Boolean}
     */
    Character.prototype.has_module = function (name, option) {
        var dp,
            i,
            levels = this.levels,
            count = levels.length;
        for (i = 0; i < count; i++) {
            dp = levels[i].DP;
            if (name in dp) {
                if (!modules[name].Option_Title) {
                    return true;
                }
                if ($.inArray(option, dp[name]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Determine if the character has satisfied the requirements for taking
     * a particular Degree of a Martial Art.
     * @method module:character#martial_art_allowed
     * @param {String} name The name of the Martial Art in question
     * @param {String} degree The Degree of the Martial Art
     * @param {Number} [level] If specified, the level by which the character
     *     must meet the requirements for the return value to be true.
     * @returns {Boolean}
     */
    Character.prototype.martial_art_allowed = function (name, degree, level) {
        var art = martial_arts[name][degree],
            arts,
            count,
            data,
            i,
            item,
            req,
            requirements = art.Requirements,
            found,
            value;
        // First of all, Degrees must be taken in order
        if (degree === 'Supreme') {
            if (!this.has_martial_art(name, 'Advanced', level)) {
                return false;
            }
        }
        else if (degree !== 'Base') {
            if (!this.has_martial_art(name, 'Base', level)) {
                return false;
            }
        }
        // Can't take the same exact one twice
        if (this.has_martial_art(name, degree)) {
            return false;
        }
        // Does it actually have requirements?  Some don't
        if (!requirements) {
            return true;
        }
        // Now check the requirements
        arts = this.martial_arts(level);
        for (req in requirements) {
            if (requirements.hasOwnProperty(req)) {
                data = requirements[req];
                if (req === 'Attack' || req === 'Block' || req === 'Dodge' || req === 'Initiative') {
                    if (this.unarmed_ability(req, arts, level) < data) {
                        return false;
                    }
                }
                else if (req === 'Defense') {
                    if (this.unarmed_ability('Dodge', arts, level) < data) {
                        if (this.unarmed_ability('Block', arts, level) < data) {
                            return false;
                        }
                    }
                }
                else if (req === 'Ki Abilities') {
                    count = data.length;
                    for (i = 0; i < count; i++) {
                        if (!this.has_ki_ability(data[i], undefined, level)) {
                            return false;
                        }
                    }
                }
                else if (req === 'Martial Art') {
                    // Do we have any of the viable options?
                    found = false;
                    for (item in data) {
                        if (data.hasOwnProperty(item)) {
                            value = data[item];
                            if (this.has_martial_art(item, value, level)) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        return false;
                    }
                }
                else if (req.indexOf('(') > -1) {
                    // Secondary Ability specialization requirement
                    i = req.indexOf(' (');
                    item = req.slice(0, i);
                    value = req.slice(i + 2, -1);
                    if (this.ability(item, value, level) < data) {
                        return false;
                    }
                }
                else {
                    // Other Secondary Ability requirement
                    if (this.ability(req, undefined, level) < data) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    /**
     * Determine if the character is allowed to learn a new martial art at the
     * specified level based on the number he already knows and his total
     * attack and defense score.  Takes into account martial arts learned later
     * in his progression as well.
     * @method module:character#new_martial_art_allowed
     * @param {Number} level The character level in question
     * @returns {Boolean}
     */
    Character.prototype.new_martial_art_allowed = function (level) {
        var arts,
            ability,
            block,
            dodge,
            total_level = this.level();
        while (level <= total_level) {
            arts = this.martial_arts(level);
            block = this.ability('Block', undefined, level);
            dodge = this.ability('Dodge', undefined, level);
            ability = Math.max(block, dodge);
            ability += this.ability('Attack', undefined, level);
            if (ability - 40 * Object.keys(arts).length < 40) {
                return false;
            }
            level++;
        }
        return true;
    };

    /**
     * Find the index of the entry in the provided array of creature Power
     * options which has the specified description.
     * @method module:character#power_option_index
     * @param {Array} options An array of Creature power options
     * @param {String} description The description of one of the options
     * @returns {Number} The index of the desired option in the array, or -1 if
     *     not found
     */
    Character.prototype.power_option_index = function (options, description) {
        var count = options.length,
            i;
        for (i = 0; i < count; i++) {
            if (options[i].Description === description) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Determine if the character has a specific type of creature power, and if
     * so return its current parameters.
     * @method module:character#power_parameters
     * @param {String} type The type of power to look for (Natural Weapons,
     *     etc.)
     * @returns {Array} An array of power parameter objects (evaluates to
     *     false if the power has never been taken).  If a power has been
     *     upgraded over time, its current parameters are returned.
     */
    Character.prototype.power_parameters = function (type) {
        var dp,
            i,
            instance,
            levels = this.levels,
            count = levels.length,
            result = [];
        for (i = 0; i < count; i++) {
            dp = levels[i].DP;
            instance = dp[type];
            if (instance) {
                if ($.isArray(instance)) {
                    $.merge(result, instance);
                }
                else {
                    result.push(dp[type]);
                }
            }
        }
        return result;
    };

    /**
     * Determine the minimum DP cost to acquire or upgrade the specified power
     * at a given level.
     * @param {String} type The type of power to acquire or upgrade (Natural
     *     Weapons, etc.)
     * @param {Number} level The level at which the power is to be upgraded
     * @returns {Number} The DP cost to upgrade the power, or 0 if it is not
     *     possible at the specified level (note that some powers are
     *     disadvantages which yield DP)
     */
    Character.prototype.power_upgrade_cost = function (type, level) {
        var cost = 0,
            gnosis = this.Gnosis,
            index = 0,
            power = powers[type],
            options = power.Options,
            //penalties = power.Penalties,
            //penalty,
            //reduction = 0,
            taken,
            taken_options;
        if (this.Type === 'Human or Nephilim') {
            // Not a creature, so no creature Powers
            return 0;
        }
        if (level > this['Racial Level'] && gnosis < 25) {
            // Unable to choose powers beyond those standard for species
            return 0;
        }
        taken = this.power_parameters(type);
        if ($.isArray(options)) {
            if (taken.length) {
                taken_options = taken[taken.length - 1].Options;
                index = options.indexOf() + 1;
                if (index >= options.length) {
                    // already maxed it out
                    return 0;
                }
            }
            cost = options[index].DP;
        }
        return cost;
    };

    /**
     * Remove a degree of martial art mastery which had been gained at the
     * specified level.
     * @method module:character#remove_martial_art
     * @param {String} name The name of the martial art
     * @param {String} degree The degree of mastery being revoked
     * @param {Number} level The level at which the mastery had been gained
     */
    Character.prototype.remove_martial_art = function (name, degree, level) {
        var count,
            dp = this.level_info(level).DP,
            degrees = dp[name],
            i,
            item,
            levels;
        if (degrees.length === 1) {
            delete dp[name];
            if (name === this['First Martial Art']) {
                // Pick randomly from the first other ones learned, if any
                levels = this.levels;
                count = levels.length;
                for (i = 0; i < count; i++) {
                    dp = levels[i].DP;
                    for (item in dp) {
                        if (dp.hasOwnProperty(item)) {
                            if (item in martial_arts) {
                                this['First Martial Art'] = item;
                                return;
                            }
                        }
                    }
                }
                // Didn't know any other martial arts
                delete this['First Martial Art'];
            }
        }
        else {
            degrees.splice($.inArray(degree, degrees), 1);
        }
    };

    /**
     * Get the amount of DP spent on a particular type of creature Power
     * (optionally at a particular level).
     * @param {String} type The Power type
     * @param {Number} level The level for which to calculate the spent DP
     * @returns {Number} The number of DP spent
     */
    Character.prototype.spent_on_power = function (type, level) {
        var params = this.power_parameters(type),
            power = powers[type],
            option,
            options = power.Options;
        if (!params.length) {
            // Haven't spent anything on it...
            return 0;
        }
        if ($.isArray(options)) {
            if (options.length === 1) {
                if (!level || type in this.level_info(level).DP) {
                    return options[0].DP;
                }
                else {
                    return 0;
                }
            }
        }
    };

    return {};
});
