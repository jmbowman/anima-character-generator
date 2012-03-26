/*global define: false */
define(['jquery', 'abilities', 'character', 'classes', 'essential_abilities',
'modules', 'primaries', 'tables'],
function ($, abilities, Character, classes, essential_abilities, modules,
          primaries, tables) {

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

    Character.prototype.add_module = function (name, level, option) {
        // summary:
        //         Give the character a combat module at the specified level.
        // name: String
        //         The name of the combat module obtained
        // level: Integer
        //         The level at which the module was purchased
        // option: String?
        //         Any relevant parameter, such as a weapon name or type
        var index = (level === 0) ? 0 : level - 1,
            dp = this.levels[index].DP,
            module = modules[name],
            options;
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

    Character.prototype.available_for_essential_abilities = function () {
        // summary:
        //         Get the number of unallocated DP still available for use in
        //         purchasing Essential Abilities for a creature.  It doesn't
        //         bother subtract DP already spent on powers or class
        //         abilities, because the Essential Abilities are finalized
        //         before those are chosen.
        // returns:
        //         The number of DP still available for this purpose.
        var ability,
            advantages = essential_abilities.advantages,
            first_level_dp = this.levels[0].DP,
            name,
            remaining = 300 + this.bonus_dp_from_gnosis();
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

    Character.prototype.bonus_dp_from_gnosis = function () {
        // summary:
        //         Get the number of bonus DP (if any) the creature receives
        //         to spend on essential abilities and powers as a result of a
        //         high Gnosis value.
        // returns:
        //         A number of DP >= 0.
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

    Character.prototype.dp_cost = function (name, class_name) {
        // summary:
        //         Get the cost in DP to the character of taking the specified
        //         ability while in a particular class.
        // name: String
        //         The name of the ability
        // class_name: String
        //         The name of the character's class when the ability is taken
        // returns:
        //         The appropriate DP cost
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
  
    Character.prototype.dp_remaining = function () {
        // sumary:
        //        Calculate the number of DP still available to be spent in
        //        each primary at each of the character's levels.
        // returns:
        //        An array (one entry per level) of objects whose property
        //        names are primaries or special case abilities and whose
        //        property values are the corresponding number of available DP
        var attack,
            categories = Object.keys(primaries),
            class_info,
            class_name,
            cost,
            costs = {Attack: 2, Block: 2, Dodge: 2},
            count,
            defense,
            i,
            item,
            j,
            level = this.level(),
            levels = this.levels,
            level_count = levels.length,
            level_dp,
            level_info,
            new_dp = 600,
            pinch_points,
            primary,
            quarter,
            remaining,
            result,
            results = [],
            saved = {Combat: 0, Psychic: 0, Supernatural: 0, Powers: 0, Other: 0},
            scores = {Attack: 0, Block: 0, Dodge: 0},
            spent,
            totals = {Attack: 0, Block: 0, Dodge: 0, DP: 0,
                      'Magic Projection': 0, Powers: 0, Psychic: 0,
                      'Psychic Projection': 0, Supernatural: 0,
                      'Martial Knowledge': 0, 'Magic Level': 0};
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
            totals.Powers += new_dp / 2;
            result.Total = new_dp + saved.Combat + saved.Psychic + saved.Supernatural + saved.Powers + saved.Other;
            result.Combat = class_info.Combat * new_dp / 100;
            result.Psychic = class_info.Psychic * new_dp / 100;
            result.Supernatural = class_info.Supernatural * new_dp / 100;
            result.Powers = new_dp / 2;
            if (i === 0) {
                j = this.bonus_dp_from_gnosis();
                result.Powers += j;
                result.Total += j;
                if (this.is_spirit()) {
                    result.Powers -= 100;
                    result.Total -= 100;
                }
            }
            result['Martial Knowledge'] = new_dp / 10;
            result['Magic Level'] = new_dp / 10;
            result.Other = new_dp + saved.Other;
            result['Magic Projection'] = (totals.Supernatural / 2) - totals['Magic Projection'];
            result['Psychic Projection'] = (totals.Psychic / 2) - totals['Psychic Projection'];
            level_dp = level_info.DP;
            for (item in level_dp) {
                if (level_dp.hasOwnProperty(item)) {
                    cost = this.dp_cost(item, class_name);
                    if (item in modules) {
                        if (modules[item].Option_Title) {
                            spent = level_dp[item].length * cost;
                        }
                        else {
                            spent = cost;
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
                    result.Total -= spent;
                    primary = primaries.for_ability(item);
                    result[primary] -= spent;
                    if (item.indexOf('Save ') === 0) {
                        saved[primary] += spent;
                    }
                    if (item in result) {
                        result[item] -= spent;
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
            result.Block = Math.min(count, Math.max((attack + 50 - scores.Block) * costs.Block, quarter - totals.Block));
            result.Dodge = Math.min(count, Math.max((attack + 50 - scores.Dodge) * costs.Dodge, quarter - totals.Dodge));
            cost = this.class_change_dp((level === 0) ? 0 : (i + 1));
            if (cost > 0) {
                result.Other -= cost;
                result.Total -= cost;
                result.Class_Change = cost;
            }
            count = categories.length;
            for (j = 0; j < count; j++) {
                primary = categories[j];
                remaining = result[primary];
                if (remaining < 0) {
                    // used some of the saved DP
                    if (!('Withdrawn' in result)) {
                        result.Withdrawn = 0;
                    }
                    result.Withdrawn -= remaining;
                    saved[primary] += remaining;
                    result[primary] = 0;
                }
                // now add in the remaining saved amount
                result[primary] += saved[primary];
                if (result[primary] > result.Total) {
                    // Ran out of total DP before exhausting this primary
                    result[primary] = result.Total;
                }
            }
        }
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
  
    Character.prototype.ea_disadvantage_summary = function (name) {
        var disadvantage = essential_abilities.disadvantages[name],
            param = this.levels[0].DP[name],
            result = name;
        if ('Options' in disadvantage) {
            result += ': ' + param;
        }
        return result;
    };
  
    Character.prototype.essential_ability_allowed = function (name, parameter) {
        var ability,
            advantages = essential_abilities.advantages,
            allowed = true,
            category,
            cost,
            count,
            disadvantages = essential_abilities.disadvantages,
            element = this.Element,
            dp_remaining = this.available_for_essential_abilities(),
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
        return true;
    };

    Character.prototype.has_module = function (name, option) {
        // summary:
        //         Does the character already have a certain combat module?
        // name: String
        //         The name of the module
        // option: String?
        //         The name of the option, in the case of modules that can be
        //         taken for multiple weapons or weapon types.
        // returns:
        //         True if the character already has it, false otherwise
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
  
    return {};
});
