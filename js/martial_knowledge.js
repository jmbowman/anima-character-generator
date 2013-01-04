/*global define: false */
define(['jquery', 'character', 'classes', 'ki_abilities'],
       function ($, Character, classes, ki_abilities) {

    Character.prototype.add_ki_ability = function (name, level, option) {
        // summary:
        //         Give the character a Ki Ability at the specified level.
        // name: String
        //         The name of the Ki Ability obtained
        // level: Integer
        //         The level at which the Ki Ability was purchased
        // option: String?
        //         Any relevant parameter, such as an element type
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

    Character.prototype.has_ki_ability = function (name, option, level) {
        // summary:
        //         Does the character already have a certain Ki Ability?
        // name: String
        //         The name of the Ki Ability
        // option: String?
        //         The name of the option, in the case of Ki Abilities that can
        //         be taken for multiple elements, etc.
        // level: Integer?
        //         If specified, the level by which the character must have the
        //         Ki Ability for the return value to be true.
        // returns:
        //         True if the character already has it, false otherwise
        var mk,
            i,
            levels = this.levels,
            count = levels.length;
        if (typeof level !== 'undefined') {
            count = level === 0 ? 1 : level;
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

    Character.prototype.ki_concealment = function () {
        // summary:
        //         Calculates the character's Ki Concealment score.  Doesn't
        //         verify that he actually has the Ki Concealment ability.
        // returns:
        //         The character's Ki Concealment score (or what it would be,
        //         if the character doesn't yet have the ability).
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

    Character.prototype.ki_detection = function () {
        // summary:
        //         Calculates the character's Ki Detection score.  Doesn't
        //         verify that he actually has the Ki Detection ability.
        // returns:
        //         The character's Ki Detection score (or what it would be,
        //         if the character doesn't yet have the ability).
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

    Character.prototype.mk_remaining = function () {
        // summary:
        //         Calculates the character's total remaining MK at each level.
        // returns:
        //         An array of the character's remaining MK at each level.
        //         Note that these are cumulative totals, not just the amounts
        //         remaining from the MK gained at each level.
        var i,
            result = [],
            totals = this.mk_totals(),
            used = this.mk_used(),
            count = totals.length;
        for (i = count - 1; i >= 0; i--) {
            result[i] = Math.max(totals[i] - used, 0);
        }
        return result;
    };

    Character.prototype.mk_totals = function (level) {
        // summary:
        //         Calculates the character's total MK (from levels,
        //         advantages, martial arts, etc.) at each level.
        // level?:
        //         The level at which to stop calculating the character's total
        //         MK.  If not specified, the totals for all levels are
        //         returned.
        // returns:
        //         An array of the character's total MK at each level up to and
        //         including the one specified.
        var i,
            level_info,
            levels = this.levels,
            count = levels.length,
            martial_mastery = this.Advantages['Martial Mastery'],
            result = [],
            total = 0;
        if (typeof level !== 'undefined') {
            count = level === 0 ? 1 : level;
        }
        if (martial_mastery) {
            total += martial_mastery * 40;
        }
        for (i = 0; i < count; i++) {
            level_info = levels[i];
            total += classes[level_info.Class].MK;
            if ('Martial Knowledge' in level_info.DP) {
                total += level_info.DP['Martial Knowledge'] * 5;
            }
            result.push(total);
        }
        return result;
    };

    Character.prototype.mk_used = function (level) {
        // summary:
        //         Calculates how much MK the character has allocated so far.
        // level?:
        //         The level at which to stop calculating the character's spent
        //         MK.  If not specified, all levels are calculated.
        // returns:
        //         The total amount of MK allocated by the specified level.
        var i,
            item,
            levels = this.levels,
            count = levels.length,
            mk,
            used = 0,
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
                        else {
                            // has Element or Dominion Technique data also
                            used += value.MK;
                        }
                    }
                }
            }
        }
        return used;
    };

    Character.prototype.remove_ki_ability = function (name, level, options) {
        var array,
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
        if ('Insufficient Martial Knowledge' in this) {
            this.update_level();
        }
    };

    Character.prototype.update_level = function () {
        // summary:
        //         Update the character data (especially the levels array and
        //         any pre-purchased Ki Ability or Dominion Technique) to be
        //         appropriate for the character's current XP total.
        var ability,
            current_level = this.level(),
            levels = this.levels,
            level_count = levels.length,
            mk_remaining;
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
        mk_remaining = this.mk_remaining()[level_count - 1];
        if (mk_remaining >= 0 && 'Insufficient Martial Knowledge' in this) {
            delete this['Insufficient Martial Knowledge'];
        }
        else if (mk_remaining < 0) {
            if ('Insufficient Martial Knowledge' in this) {
                ability = this['Insufficient Martial Knowledge'];
                if (this.has_ki_ability(ability.Name, ability.Option)) {
                    ability.Penalty = Math.floor(mk_remaining / 10);
                }
                // TODO: select another ability or technique otherwise
            }
        }
    };
    
});
