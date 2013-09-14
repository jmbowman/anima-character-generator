/*global define: false */
/**
 * Module which exports a class for an Anima: Beyond Fantasy character. May be
 * a PC, NPC, or even a creature with Essential Abilities and/or Powers.  Pass
 * an instance to JSON.stringify() to get a savable representation of the
 * character.  Some of this class's methods are defined in other modules; be
 * sure to require the appropriate module before attempting to use the methods
 * defined in it.
 * @module character
 * @requires jquery
 * @requires abilities
 * @requires classes
 * @requires cultural_roots
 * @requires psychic_disciplines
 * @requires essential_abilities
 * @requires tables
 * @requires lib/utils
 * @see module:combat
 */
define(['jquery', 'abilities', 'classes', 'cultural_roots', 'psychic_disciplines',
'essential_abilities', 'tables', 'libs/utils'], function ($, abilities, classes,
cultural_roots, disciplines, essential_abilities, tables, utils) {

    /**
     * @constructor
     * @alias module:character
     */
    var Character = function () {
        if (!(this instanceof Character)) {
            return new Character();
        }
        this.Advantages = {};
        this.Disadvantages = {};
        this.Race = '';
        this.XP = 0;
        this.levels = [{Class: 'Freelancer', DP: {}}];
    };

    /**
     * Calculate the character's score in a Primary or Secondary Ability.
     * This base amount can be further modified by martial arts, weapons,
     * armor, etc. (see {@link character.Character#unarmed_ability}).
     * @param {String} name The name of an ability
     * @param {String} [specialty] A specialty within a Secondary Ability
     * @param {Number} [level] Get the score as of this level.  If omitted,
     *     get the character's current score.
     * @returns {Number}
     */
    Character.prototype.ability = function (name, specialty, level) {
        var myAdvantages = this.Advantages,
            myDisadvantages = this.Disadvantages,
            ability = abilities[name],
            amount,
            background,
            bonuses = 0,
            characteristic = ability.Characteristic,
            choice,
            choices,
            cls,
            combat_senses = myAdvantages['Combat Senses'],
            count = this.levels.length,
            cr,
            each_level = 0,
            freelancer,
            i,
            info,
            length,
            nb_multiplier = 1,
            option,
            params,
            race = this.Race,
            spec,
            specializations,
            tot_level = this.level(),
            total = 0,
            use_of_armor = name === 'Wear Armor' && myAdvantages['Use of Armor'];
        if (typeof level !== 'undefined') {
            count = level === 0 ? 1 : level;
        }
        params = myAdvantages['Natural Learner'];
        if (params && params.Ability === name) {
            each_level += params.Points * 10;
        }
        params = myAdvantages['Natural Learner, Field'];
        if (params && params.Field === ability.Field) {
            each_level += (params.Points - 1) * 5;
        }
        params = myAdvantages['Cultural Roots'];
        if (params) {
            background = params;
            choices = [];
            if (typeof params !== 'string') {
                background = params.Background;
                choices = params.Choices;
            }
            cr = cultural_roots[background];
            if (name in cr) {
                amount = cr[name];
            }
            else if ($.inArray(name, choices) !== -1) {
                choices = cr.choices;
                length = choices.length;
                for (i = 0; i < length; i++) {
                    choice = choices[i];
                    for (option in choice) {
                        if (choice.hasOwnProperty(option) && option === name) {
                            amount = choice[option];
                        }
                    }
                }
            }
            else {
                amount = 0;
            }
            if (typeof amount !== 'number') {
                spec = Object.keys(amount)[0];
                if (spec === specialty) {
                    bonuses += amount[spec];
                }
            }
            else {
                bonuses += amount;
            }
        }
        if ('Increased Natural Bonus' in myAdvantages) {
            nb_multiplier = 2;
        }
        if ('Without any Natural Bonus' in myDisadvantages) {
            nb_multiplier = 0;
        }
        for (i = 0; i < count; i++) {
            info = this.levels[i];
            cls = classes[info.Class];
            amount = info.DP[name];
            if (amount) {
                total += amount;
            }
            freelancer = info.Freelancer;
            if (freelancer && $.inArray(name, freelancer) >= 0) {
                total += (tot_level === 0) ? 5 : 10;
            }
            amount = cls.bonuses[name];
            if (amount) {
                bonuses += (tot_level === 0) ? Math.floor(amount / 2) : amount;
            }
            if (combat_senses === name) {
                bonuses += 5;
            }
            else if (use_of_armor) {
                bonuses += use_of_armor * 5;
            }
            if (info['Natural Bonus'] === name) {
                bonuses += this.modifier(characteristic, i + 1) * nb_multiplier;
            }
            bonuses += each_level;
        }
        if ('Field' in ability) {
            if ('Jack of All Trades' in myAdvantages) {
                total += 10;
            }
            else if (total < 5) {
                total -= 30;
            }
        }
        if (bonuses > 50 && $.inArray(name, tables.primary_combat_abilities) !== -1) {
            bonuses = 50;
        }
        if ('Acute Senses' in myAdvantages && $.inArray(name, ['Notice', 'Search']) !== -1) {
            bonuses += 30;
        }
        if ('Klutzy' in this.Disadvantages && $.inArray(name, tables.klutzy) !== -1) {
            total -= 30;
        }
        if ('Psychic Immunity' in myAdvantages && name === 'Composure') {
            bonuses += 60;
        }
        if ('Seducer' in myAdvantages && name === 'Persuasion' && specialty === 'seduction') {
            bonuses += 60;
        }
        if ('Talented' in myAdvantages && name === 'Sleight of Hand') {
            bonuses += 30;
        }
        if (race === 'Devah Nephilim' && $.inArray(name, ['Banish', 'Bind'])) {
            bonuses += 10;
        }
        if (specialty) {
            specializations = this.Specializations;
            if (specializations) {
                spec = specializations[name];
                if (spec === specialty) {
                    bonuses += 40;
                }
            }
        }
        total += bonuses + this.modifier(characteristic, level);
        return total;
    };

    /**
     * Get the character's Appearance score.  Applies appropriate Nephilim and
     * disadvantage modifiers.  Returns 5 if an Appearance hasn't yet been set
     * for the character.
     * @returns {Number}
     */
    Character.prototype.appearance = function () {
        var total = ('Appearance' in this) ? this.Appearance : 5;
        if (this.Race === "D'Anjayni Nephilim") {
            if (total < 3) {
                total = 3;
            }
            if (total > 7) {
                total = 7;
            }
        }
        if ('Unattractive' in this.Disadvantages) {
            total = 2;
        }
        return total;
    };

    /**
     * Perform a class change for the character.  If this is being done for a
     * level other than the character's latest, also changes the minimum number
     * of levels afterwards that the character would had to have stayed in the
     * new class before changing back.
     * @param {Number} level The first character level at which the character
     *     will advance as the new class
     * @param {String} class_name The name of the new class
     */
    Character.prototype.change_class = function (level, class_name) {
        var i = (level > 0) ? level - 1 : 0,
            levels = this.levels;
        levels[i].Class = class_name;
        if (levels.length > i + 1 && !('Versatile' in this.Advantages)) {
            levels[i + 1].Class = class_name;
        }
    };

    /**
     * Reset the character data to the default values used when starting to
     * build a character.  Used when loading new character data.
     */
    Character.prototype.clear = function () {
        this.Advantages = {};
        this.Disadvantages = {};
        this.Race = '';
        this.XP = 0;
        this.levels = [{Class: 'Freelancer', DP: {}}];
        if ('Created' in this) {
            delete this.Created;
        }
        if ('Element' in this) {
            delete this.Element;
        }
        if ('First Martial Art' in this) {
            delete this['First Martial Art'];
        }
        if ('Gnosis' in this) {
            delete this.Gnosis;
        }
        if ('Insufficient Martial Knowledge' in this) {
            delete this['Insufficient Martial Knowledge'];
        }
        if ('Racial Level' in this) {
            delete this['Racial Level'];
        }
        if ('Specializations' in this) {
            delete this.Specializations;
        }
    };

    /**
     * Get one of the character's Characteristic values at the specified level.
     * @param {String} name The abbreviated name of a characteristic (STR, DEX,
     *     AGI, CON, INT, POW, WP, or PER)
     * @param {Number} [at_level] If omitted, gets the current value
     * @returns {Number}
     */
    Character.prototype.characteristic = function (name, at_level) {
        var count,
            first_level_dp = this.levels[0].DP,
            i,
            reroll,
            length,
            level,
            myAdvantages = this.Advantages,
            myDisadvantages = this.Disadvantages,
            params,
            total = name in this ? this[name] : 5;
        if (!at_level) {
            at_level = this.level();
        }
        params = myAdvantages['Increase One Characteristic to Nine'];
        if (params) {
            length = params.length;
            for (i = 0; i < length; i++) {
                if (params[i] === name) {
                    total = 9;
                }
            }
        }
        params = myAdvantages['Repeat a Characteristics Roll'];
        if (params) {
            length = params.length;
            for (i = 0; i < length; i++) {
                reroll = params[i];
                if (reroll.Characteristic === name) {
                    total = reroll.Roll;
                }
            }
        }
        params = myAdvantages['Add One Point to a Characteristic'];
        if (params) {
            length = params.length;
            for (i = 0; i < length; i++) {
                if (params[i] === name) {
                    total += 1;
                }
            }
        }
        params = first_level_dp['Attribute Increased +1'];
        if (params) {
            length = params.length;
            for (i = 0; i < length; i++) {
                if (params[i] === name) {
                    total += 1;
                }
            }
        }
        params = first_level_dp['Attribute Increased +2'];
        if (params) {
            length = params.length;
            for (i = 0; i < length; i++) {
                if (params[i] === name) {
                    total += 2;
                }
            }
        }
        params = first_level_dp['Attribute Increased +3'];
        if (params) {
            length = params.length;
            count = 0;
            for (i = 0; i < length; i++) {
                if (params[i] === name) {
                    count += 1;
                }
            }
            if (count) {
                total += count + 2;
            }
        }
        if (myDisadvantages['Deduct Two Points from a Characteristic'] === name) {
            total -= 2;
        }
        if (this.Race === 'Jayan Nephilim' && name === 'STR') {
            total += 1;
        }
        for (i = 0; i < at_level && this.levels.length > i; i++) {
            level = this.levels[i];
            if (level.Characteristic === name) {
                total += 1;
            }
        }
        if (total > 20) {
            total = 20;
        }
        return total;
    };

    /**
     * Get the number of DP spent at the specified level to change classes.  If
     * the character didn't perform a class change at that level, returns 0.
     * @param {Number} level
     * @returns {Number}
     */
    Character.prototype.class_change_dp = function (level) {
        var cost = 60,
            last_class,
            last_types,
            levels = this.levels,
            this_class,
            this_types;
        if (level < 2) {
            return 0;
        }
        this_class = levels[level - 1].Class;
        last_class = levels[level - 2].Class;
        if (this_class === last_class) {
            return 0;
        }
        this_types = classes[this_class].Archetypes;
        last_types = classes[last_class].Archetypes;
        if (this_class === 'Freelancer' || last_class === 'Freelancer') {
            cost = 20;
        }
        else if (this_types.length === 1 && last_types.length === 1 &&
                 this_types[0] === last_types[0]) {
            cost = 20;
        }
        else if (utils.intersection(this_types, last_types).length > 0) {
            cost = 40;
        }
        if ('Versatile' in this.Advantages) {
            cost /= 2;
        }
        return cost;
    };

    /**
     * Determine if it would be possible for the character to perform a class
     * change at the current level (without considering the DP cost).
     * @param {Number} level
     * @returns {Boolean}
     */
    Character.prototype.class_change_possible = function (level) {
        var levels = this.levels,
            racial_level = this['Racial Level'];
        if (racial_level && racial_level >= level) {
            return false;
        }
        if (level < 2) {
            // Initial class chosen with basic statistics, can't edit later
            return false;
        }
        if ('Versatile' in this.Advantages) {
            // Any level from 2 up
            return true;
        }
        if (level === 2) {
            // Not possible without Versatile advantage
            return false;
        }
        if (levels[level - 2].Class !== levels[level - 3].Class) {
            // Change must be declared 2 levels in advance
            return false;
        }
        if (this.level() > level && levels[level - 1].Class !== levels[level].Class) {
            // Can't change right before another change
            return false;
        }
        return true;
    };

    /**
     * Returns the current stage in creating the character.  Not every
     * character goes through all stages; humans and Nephilim can't choose
     * elemental affinity or essential abilities, other creatures don't choose
     * advantages or disadvantages.
     * @returns {Number} 1 for creature type, 2 for Gnosis and elemental tie,
     *     3 for essential abilities, 4 for basic stats, 5 for (dis)advantages,
     *     6 if beyond that
     */
    Character.prototype.creation_stage = function () {
        var dp,
            ea = 0,
            i,
            key,
            level,
            levels = this.levels,
            count = levels.length,
            first_class = levels[0].Class;
        for (i = 0; i < count; i++) {
            level = levels[i];
            if (level.Characteristic || level['Natural Bonus']) {
                return 6;
            }
            if (i > 0 && level.Class !== first_class) {
                return 6;
            }
            dp = level.DP;
            for (key in dp) {
                if (dp.hasOwnProperty(key)) {
                    if (key in essential_abilities.advantages) {
                        ea += 1;
                    }
                    else if (key in essential_abilities.disadvantages) {
                        ea += 1;
                    }
                    else {
                        return 6;
                    }
                }
            }
        }
        if (Object.keys(this.Advantages).length > 0 ||
            Object.keys(this.Disadvantages).length > 0) {
            return 5;
        }
        if (this.STR) {
            return 4;
        }
        if (ea > 0) {
            return 3;
        }
        if (this.Gnosis || this.Element) {
            return 2;
        }
        return 1;
    };

    /**
     * Get the Damage Resistance Multiple which corresponds to this character's
     * size.  Generally only relevant for non-human creatures which use the
     * Damage Resistance rule for defense and Life Points.
     * @returns {Number}
     */
    Character.prototype.damage_resistance_multiple = function () {
        var size = this.size();
        if (size < 4) {
            return 1;
        }
        if (size < 9) {
            return 2;
        }
        if (size < 25) {
            return 5;
        }
        if (size < 29) {
            return 10;
        }
        if (size < 34) {
            return 15;
        }
        return 20;
    };

    /**
     * Get an array of the names of the Psychic Disciplines which the character
     * has or can potentially gain access to.  This includes ones which the
     * character has not yet spent Psychic Points to gain affinity with.
     * @return {Array}
     */
    Character.prototype.discipline_access = function () {
        var first_level_dp = this.levels[0].DP,
            myAdvantages = this.Advantages,
            one = myAdvantages['Access to One Psychic Discipline'];
        if (one) {
            return [one];
        }
        if ('Free Access to Any Psychic Discipline' in myAdvantages) {
            return Object.keys(disciplines.disciplines);
        }
        if ('Access to a Psychic Discipline' in first_level_dp) {
            return [first_level_dp['Access to a Psychic Discipline']];
        }
        if ('Access to Psychic Disciplines' in first_level_dp) {
            return Object.keys(disciplines.disciplines);
        }
        return [];
    };

    /**
     * Determine if this character is allowed to have an elemental type.
     * Basically, yes iff it is a Being Between Worlds or a Spirit.
     * @returns {Boolean}
     */
    Character.prototype.element_allowed = function () {
        var type = this.Type;
        return (type === 'Between Worlds' || type === 'Spirit');
    };

    /**
     * Get the character's total number of Fatigue Points.
     * @returns {Number}
     */
    Character.prototype.fatigue = function () {
        var first_level_dp = this.levels[0].DP,
            fatigue_resistance = first_level_dp['Fatigue Resistance'],
            total = this.characteristic('CON'),
            untiring = this.Advantages.Untiring;
        if ('Tireless' in first_level_dp || 'Physical Exemption' in first_level_dp) {
            return 'N/A';
        }
        if (this.Race === 'Jayan Nephilim') {
            total += 1;
        }
        if (untiring) {
            total += untiring * 3;
        }
        if (fatigue_resistance) {
            total += 2 * fatigue_resistance;
        }
        if ('Exhausted' in this.Disadvantages) {
            total--;
        }
        return total;
    };

    /**
     * Get the character's gender.  Defaults to "Male" if not set yet.
     * @returns {String}
     */
    Character.prototype.gender = function () {
        var gender = this.Gender;
        return gender ? gender : 'Male';
    };

    /**
     * Get the character's Gnosis.  Defaults to 0 if not set yet.
     * @returns {Number}
     */
    Character.prototype.gnosis = function () {
        var gnosis = this.Gnosis;
        return gnosis ? gnosis : 0;
    };

    /**
     * Return true if the character is a corporeal undead creature,
     * false otherwise.
     * @returns {Boolean}
     */
    Character.prototype.is_corporeal_undead = function () {
        var type = this.Type;
        return type && type.indexOf('Between Worlds, Undead') > -1;
    };

    /**
     * Return true if the character is a Spirit, false otherwise.
     * @returns {Boolean}
     */
    Character.prototype.is_spirit = function () {
        var type = this.Type;
        return type && type.indexOf('Spirit') > -1;
    };

    /**
     * Get the character's current level.  Derived from his/her current XP.
     * @returns {Number}
     */
    Character.prototype.level = function () {
        var chart = tables.xp_chart,
            i,
            xp = this.XP;
        if (xp >= 4125) {
            return 16;
        }
        for (i = 0; i < 16; i++) {
            if (xp < chart[i]) {
                return i;
            }
        }
    };

    /**
     * Get the data on the choices the character made at the specified level.
     * The returned object always has Class and DP properties, and may also
     * have ones for Characteristic, MK, and Natural Bonus.
     * @param {Number} level
     * @returns {Object}
     */
    Character.prototype.level_info = function (level) {
        return this.levels[level === 0 ? 0 : level - 1];
    };

    /**
     * Get the character's current total Life Points.
     * @returns {Number}
     */
    Character.prototype.life_points = function () {
        var cls,
            con_mod = this.modifier('CON'),
            hard_to_kill = this.Advantages['Hard to Kill'],
            i,
            info,
            level = this.level(),
            levels = this.levels,
            length = levels.length,
            multiple,
            result = tables.base_lp[this.characteristic('CON')];
        if (this.is_spirit()) {
            result = tables.base_lp[this.characteristic('POW')];
        }
        for (i = 0; i < length; i++) {
            info = levels[i];
            cls = classes[info.Class];
            if (level > 0) {
                result += cls.LP;
            }
            multiple = info.DP['Life Point Multiple'];
            if (multiple) {
                result += multiple * con_mod;
            }
            // Damage Resistance
            multiple = info.DP['Life Points'];
            if (multiple) {
                result += multiple * this.damage_resistance_multiple();
            }
            if (hard_to_kill) {
                result += hard_to_kill * 10;
            }
        }
        return result;
    };

    /**
     * Get the character's modifier for the specified characteristic at the
     * specified level
     * @param {String} characteristic The abbreviated name of a characteristic
     *     (STR, DEX, AGI, CON, INT, POW, WP, or PER)
     * @param {Number} [at_level] If omitted, the current value is returned
     */
    Character.prototype.modifier = function (characteristic, at_level) {
        return tables.modifiers[this.characteristic(characteristic, at_level)];
    };

    /**
     * Get the character's current Presence (determined purely by level).
     * @returns {Number}
     */
    Character.prototype.presence = function () {
        return this.level() * 5 + 25;
    };

    /**
     * Get a text listing of the character's racial abilities.  Currently only
     * has information for the Nephilim races.
     * @returns {String}
     */
    Character.prototype.racial_abilities = function () {
        switch (this.Race) {
        case "D'Anjayni Nephilim":
            return 'Pass Without Trace, Forgetfulness, +30 to Resistance vs. detection, Silent Whisper, -3 XP';
        case 'Daimah Nephilim':
            return 'See the Essence, Sense the Forest, +3 Regeneration in thick forest or jungle, Movement in the Forest, -2 XP';
        case 'Devah Nephilim':
            return '+10 to Resistances vs. mind reading and emotion alteration, The Eye of the Soul, +10 Bind and Banish, -10 PhR and DR, -3 XP';
        case "Duk'zarist Nephilim":
            return '+10 to Resistances vs. Dark, Automatically pass between life and death PhR checks, Limited Needs, Sense Light and Dark, Night Vision, Allergic to Metal, -5 XP';
        case 'Ebudan Nephilim':
            return '+30 to Resistance vs. Forgetfulness and Emotional Control OR (Immune to attacks that cannot damage Energy, Flight Value 12), -3 XP';
        case 'Jayan Nephilim':
            return 'Spiritual Vision, -3 XP';
        case 'Sylvain Nephilim':
            return '+10 to Resistances vs. Light, Sense Light and Dark, Limited Needs, -4 XP';
        case 'Vetala Nephilim':
            return '+50 PhR vs. Criticals, Blood Ecstasy, +1 Regeneration, Photosensitive Skin, Blood Obsession, -20 DR, -3 XP';
        default:
            return '';
        }
    };

    /**
     * Get the character's Regeneration score.
     * @returns {Number}
     */
    Character.prototype.regeneration = function () {
        var gnosis = this.gnosis(),
            advantage = this.Advantages.Regeneration,
            total = tables.regeneration[this.characteristic('CON')];
        if ($.inArray(this.Race, ["Duk'zarist Nephilim", 'Sylvain Nephilim', 'Vetala Nephilim']) !== -1) {
            total += 1;
        }
        if (advantage) {
            total += advantage * 2;
        }
        if (this.is_corporeal_undead()) {
            total = 0;
        }
        if (total > 18 && gnosis < 40) {
            total = 18;
        }
        else if (total > 19 && gnosis < 45) {
            total = 19;
        }
        else if (total > 20) {
            total = 20;
        }
        return total;
    };

    /**
     * Get the magnitude of the character's penalty with their second weapon
     * when using one.  Usually 40, but reduced to 10 by Ambidextrous.
     * @returns {Number}
     */
    Character.prototype.second_hand_penalty = function () {
        if ('Ambidextrous' in this.Advantages) {
            return 10;
        }
        if ('Ambidextrous' in this.levels[0].DP) {
            return 10;
        }
        else {
            return 40;
        }
    };

    /**
     * Set the character's Natural Bonus at the specified level.
     * @param {Number} level
     * @param {String} name The name of the Secondary Ability to increase
     */
    Character.prototype.set_natural_bonus = function (level, name) {
        var levels = this.levels;
        if (level < 1 || level > levels.length) {
            return;
        }
        levels[level - 1]['Natural Bonus'] = name;
    };

    /**
     * Set one of the character's five bonuses to Secondary Abilities at the
     * specified level.
     * @param {Number} level
     * @param {String} name The name of the Secondary Ability to increase
     * @param {String} previous The previously selected bonus to replace, if any
     */
    Character.prototype.set_freelancer_bonus = function (level, name, previous) {
        var freelancer_bonuses,
            index = level === 0 ? 0 : level - 1,
            levels = this.levels;
        if (level < 0 || level > levels.length) {
            return;
        }
        freelancer_bonuses = levels[index].Freelancer;
        if (!freelancer_bonuses) {
            freelancer_bonuses = [];
            levels[index].Freelancer = freelancer_bonuses;
        }
        if ($.trim(previous)) {
            freelancer_bonuses[$.inArray(previous, freelancer_bonuses)] = name;
        }
        else {
            if (freelancer_bonuses.length >= 5) {
                return;
            }
            freelancer_bonuses.push(name);
        }
    };

    /**
     * Get the character's Size Characteristic.
     * @returns {Number}
     */
    Character.prototype.size = function () {
        var total = this.characteristic('STR') + this.characteristic('CON'),
            uncommon_size = this.Advantages['Uncommon Size'],
            unnatural_size = this.levels[0].DP['Unnatural Size'];
        switch (this.Race) {
        case 'Daimah Nephilim':
            total -= 1;
            break;
        case 'Jayan Nephilim':
            total += 2;
        }
        if (uncommon_size) {
            total += uncommon_size;
        }
        if (unnatural_size) {
            total += unnatural_size;
        }
        return total;
    };

    /**
     * Get the name of the character's Size category
     */
    Character.prototype.size_category = function () {
        var size = this.size();
        if (size <= 3) {
            return 'Miniscule';
        }
        if (size <= 8) {
            return 'Small';
        }
        if (size <= 22) {
            return 'Medium';
        }
        if (size <= 24) {
            return 'Big';
        }
        if (size <= 28) {
            return 'Enormous';
        }
        if (size <= 33) {
            return 'Giant';
        }
        return 'Colossal';
    };

    /**
     * Get a text summary of the character, something like
     * "Fred (Wizard 2, Mentalist 3)".
     * @returns {String}
     */
    Character.prototype.summary = function () {
        var my_classes = [],
            class_levels = {},
            cls,
            i,
            levels = this.levels,
            length = levels.length,
            name = this.Name,
            result = '';
        if (name) {
            result = name + ' ';
        }
        for (i = 0; i < length; i++) {
            cls = levels[i].Class;
            if ($.inArray(cls, my_classes) === -1) {
                my_classes.push(cls);
                class_levels[cls] = 1;
            }
            else {
                class_levels[cls]++;
            }
        }
        result += '(';
        length = my_classes.length;
        for (i = 0; i < length; i++) {
            cls = my_classes[i];
            if (i > 0) {
                result += ', ';
            }
            result += cls;
            result += ' ';
            result += class_levels[cls];
        }
        result += ')';
        return result;
    };

    /**
     * Get a text listing of the character's Gnosis, creature type, and
     * element (if any).  Empty for humans and Nephilim, this is intended for
     * creature stat blocks.
     * @returns {String}
     */
    Character.prototype.type_and_gnosis = function () {
        var element = this.Element,
            gnosis = this.Gnosis,
            result,
            type = this.Type;
        if (!type || type === 'Human') {
            return '';
        }
        result = type;
        if (element) {
            result += ', Elemental';
        }
        if (typeof gnosis === 'number') {
            result += ' ' + gnosis;
        }
        return result;
    };

    /**
     * Determine if the character is capable of developing the ability to cast
     * spells.
     * @returns {Boolean} True if the character has some form of The Gift,
     *     false otherwise
     */
    Character.prototype.has_gift = function () {
        var myAdvantages = this.Advantages;
        if ('The Gift' in myAdvantages) {
            return true;
        }
        if ('Incomplete Gift' in myAdvantages) {
            return true;
        }
        if ('Gift' in this.levels[0].DP) {
            return true;
        }
        return false;
    };
  
    return Character;
});

// Duk'zarist first psychic discipline must be Pyrokinesis

// Ki points, accumulations
// Weapon modules
// Martial arts

// Psychic Points
// Psychic Modules
// Magic Paths
// Mystical Modules

// Height, weight, age, eye and hair colors
