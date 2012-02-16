/*global define: false */
define(['jquery', 'abilities', 'classes', 'cultural_roots', 'psychic_disciplines',
'tables', 'libs/utils'], function ($, abilities, classes, cultural_roots,
    disciplines, tables, utils) {

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
  
    Character.prototype.ability = function (name, specialty) {
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
            i,
            imperceptible_ki = 'Imperceptible Ki' in myAdvantages && name === 'Ki Concealment',
            info,
            ki_perception = 'Ki Perception' in myAdvantages && name === 'Ki Detection',
            length,
            level = this.level(),
            nb_multiplier = 1,
            option,
            params,
            spec,
            total = 0,
            use_of_armor = name === 'Wear Armor' && myAdvantages['Use of Armor'];
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
            amount = cls.bonuses[name];
            if (amount) {
                bonuses += (level === 0) ? Math.floor(amount / 2) : amount;
            }
            if (combat_senses === name) {
                bonuses += 5;
            }
            else if (imperceptible_ki) {
                bonuses += 10;
            }
            else if (ki_perception) {
                bonuses += 10;
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
        total += bonuses + this.modifier(characteristic);
        return total;
    };
  
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
  
    Character.prototype.armor_type = function (type) {
        var myAdvantages = this.Advantages,
            total = 0;
        if ('Natural Armor' in myAdvantages && type !== 'Energy') {
            total += 2;
        }
        if ('Mystical Armor' in myAdvantages && type === 'Energy') {
            total += 2;
        }
        return total;
    };
  
    Character.prototype.change_class = function (level, class_name) {
        var i = (level > 0) ? level - 1 : 0,
            levels = this.levels;
        levels[i].Class = class_name;
        if (levels.length > i + 1 && !('Versatile' in this.Advantages)) {
            levels[i + 1].Class = class_name;
        }
    };

    Character.prototype.characteristic = function (name, at_level) {
        var i,
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
  
    Character.prototype.class_change_possible = function (level) {
        var levels = this.levels;
        if (level < 2 || 'Versatile' in this.Advantages) {
            return true;
        }
        if (level === 2) {
            return false;
        }
        return levels[level - 2].Class === levels[level - 3].Class;
    };
  
    Character.prototype.cost = function (name, class_name) {
        var ability = abilities[name],
            character_class = classes[class_name],
            field,
            info,
            myAdvantages = this.Advantages,
            reduced,
            result;
        if (name.indexOf('Save ') === 0) {
            // Saving DP for later can be done in any quantity
            return 1;
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
    
    Character.prototype.creation_stage = function () {
        // summary:
        //         Returns the current stage in creating the character.
        // returns:
        //         1 for basic stats, 2 for (dis)advantages, 3 if beyond that
        var i,
            level,
            levels = this.levels,
            count = levels.length,
            first_class = levels[0].Class;
        for (i = 0; i < count; i++) {
            level = levels[i];
            if (level.Characteristic || level['Natural Bonus']) {
                return 3;
            }
            if (level.Class !== first_class) {
                return 3;
            }
            if (Object.keys(level.DP).length > 0) {
                return 3;
            }
        }
        if (this.Advantages || this.Disadvantages) {
            return 2;
        }
        return 1;
    };
  
    Character.prototype.discipline_access = function () {
        var myAdvantages = this.Advantages,
            one = myAdvantages['Access to One Psychic Discipline'];
        if (one) {
            return [one];
        }
        if ('Free Access to Any Psychic Discipline' in myAdvantages) {
            return Object.keys(disciplines.disciplines);
        }
        return [];
    };
  
    Character.prototype.fatigue = function () {
        var total = this.characteristic('CON'),
            untiring = this.Advantages.Untiring;
        if (this.Race === 'Jayan Nephilim') {
            total += 1;
        }
        if (untiring) {
            total += untiring * 3;
        }
        if ('Exhausted' in this.Disadvantages) {
            total--;
        }
        return total;
    };
  
    Character.prototype.gender = function () {
        var gender = this.Gender;
        return gender ? gender : 'Male';
    };
  
    Character.prototype.gnosis = function () {
        var gnosis = this.Gnosis;
        return gnosis ? gnosis : 0;
    };
  
    Character.prototype.initiative = function () {
        var i,
            levels = this.levels,
            length = levels.length,
            qr = this.Advantages['Quick Reflexes'],
            sr = this.Disadvantages['Slow Reactions'],
            total = 20 + this.modifier('AGI') + this.modifier('DEX');
        if (qr) {
            if (qr === 1) {
                total += 25;
            }
            else if (qr === 2) {
                total += 45;
            }
            else {
                total += 60;
            }
        }
        if (sr) {
            total -= sr * 30;
        }
        for (i = 0; i < length; i++) {
            total += classes[levels[i].Class].Initiative;
        }
        return total;
    };
  
    Character.prototype.ki_concealment = function () {
        var total = 0;
        if (this.Race === "D'Anjayni Nephilim") {
            total += 30;
        }
        return total;
    };
  
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
    
    Character.prototype.level_info = function (level) {
        return this.levels[level === 0 ? 0 : level - 1];
    };

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
            if (hard_to_kill) {
                result += hard_to_kill * 10;
            }
        }
        return result;
    };
  
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

    Character.prototype.modifier = function (characteristic, at_level) {
        return tables.modifiers[this.characteristic(characteristic, at_level)];
    };
  
    Character.prototype.movement_value = function () {
        var result = this.characteristic('AGI');
        if (result > 10) {
            result = 10;
        }
        return result;
    };
  
    Character.prototype.presence = function () {
        return this.level() * 5 + 25;
    };
  
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
  
    Character.prototype.racial_abilities = function () {
        switch (this.Race) {
        case "D'Anjayni Nephilim":
            return 'Pass Without Trace, Forgetfulness, +30 to Resistance vs. detection, Silent Whisper, -3 XP';
        case 'Daimah Nephilim':
            return 'See the Essence, Sense the Forest, +3 Regeneration in thick forest or jungle, Movement in the Forest, -2 XP';
        case "Duk'zarist Nephilim":
            return '+10 to Resistances vs. Dark, Automatically pass between life and death PhR checks, Limited Needs, Sense Light and Dark, Night Vision, Allergic to Metal, -5 XP';
        case 'Ebudan Nephilim':
            return '+30 to Resistance vs. Forgetfulness and Emotional Control OR (Immune to attacks that cannot damage Energy, Flight Value 12), -3 XP';
        case 'Jayan Nephilim':
            return 'Spiritual Vision, -3 XP';
        case 'Sylvain Nephilim':
            return '+10 to Resistances vs. Light, Sense Light and Dark, Limited Needs, -4 XP';
        default:
            return '';
        }
    };
  
    Character.prototype.regeneration = function () {
        var gnosis = this.gnosis(),
            advantage = this.Advantages.Regeneration,
            total = tables.regeneration[this.characteristic('CON')];
        if ($.inArray(this.Race, ["Duk'zarist Nephilim", 'Sylvain Nephilim']) !== -1) {
            total += 1;
        }
        if (advantage) {
            total += advantage * 2;
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
  
    Character.prototype.resistance = function (name) {
        var gender,
            myAdvantages = this.Advantages,
            myDisadvantages = this.Disadvantages,
            points,
            total = this.presence() + this.modifier(tables.resistances[name]);
        switch (this.Race) {
        case "Duk'zarist Nephilim":
            gender = this.gender();
            if (name === 'PhR' && gender === 'Male') {
                total += 20;
            }
            else if (name === 'MR' && gender === 'Female') {
                total += 20;
            }
            else {
                total += 15;
            }
            break;
        case 'Jayan Nephilim':
            if (name === 'PhR') {
                total += 15;
            }
            else if (name === 'MR') {
                total -= 10;
            }
            break;
        case 'Sylvain Nephilim':
            if (name === 'MR' || name === 'PsR') {
                total += 10;
            }
            else if (name === 'DR') {
                total += 20;
            }
            else {
                total += 5;
            }
        }
        if (name === 'MR') {
            points = myAdvantages['Exceptional Magic Resistance'];
            if (points) {
                total += points * 25;
            }
            if ('The Gift' in this.Advantages) {
                total += 10;
            }
        }
        else if (name === 'PsR' && (points = myAdvantages['Exceptional Psychic Resistance'])) {
            total += points * 25;
        }
        else if ($.inArray(name, ['DR', 'PhR', 'VR']) !== -1 &&
                 (points = myAdvantages['Exceptional Physical Resistance'])) {
            total += points * 25;
        }
        if ((name === 'DR' && 'Sickly' in myDisadvantages) ||
            (name === 'MR' && 'Susceptible to Magic' in myDisadvantages) ||
            (name === 'PhR' && 'Physical Weakness' in myDisadvantages) ||
            (name === 'VR' && 'Susceptible to Poisons' in myDisadvantages)) {
            total = Math.floor(total / 2);
        }
        return total;
    };
  
    Character.prototype.second_hand_penalty = function () {
        if ('Ambidextrous' in this.Advantages) {
            return 10;
        }
        else {
            return 40;
        }
    };
  
    Character.prototype.set_natural_bonus = function (level, name) {
        var levels = this.levels;
        if (level < 1 || level > levels.length) {
            return;
        }
        levels[level - 1]['Natural Bonus'] = name;
    };
  
    Character.prototype.size = function () {
        var total = this.modifier('STR') + this.modifier('CON'),
            uncommon_size = this.Advantages['Uncommon Size'];
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
        return total;
    };
  
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
  
    Character.prototype.mk_total = function () {
        var i,
            levels = this.levels,
            length = levels.length,
            martial_mastery = this.Advantages['Martial Mastery'],
            total = 0;
        for (i = 0; i < length; i++) {
            total += classes[levels[i].Class].MK;
        }
        if (martial_mastery) {
            total += martial_mastery * 40;
        }
        return total;
    };

    Character.prototype.mk_used = function () {
        var i,
            item,
            levels = this.levels,
            length = levels.length,
            mk,
            used = 0;
        for (i = 0; i < length; i++) {
            mk = levels[i].MK;
            if (mk) {
                for (item in mk) {
                    if (mk.hasOwnProperty(item)) {
                        used += mk[item];
                    }
                }
            }
        }
        return used;
    };
  
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
  
    return Character;
});

// Level object: Class, DP, Natural Bonus, MK, Characteristic
// Duk'zarist first psychic discipline must be Pyrokinesis

// Ki points, accumulations
// Attack + Block + Dodge cap (50% of total DP)
// Max 50 gap between Attack and Defense
// Magic, Psychic Projection caps (half of Supernatural, Psychic caps)
// Weapon modules
// Martial arts

// Psychic Points
// Psychic Projection
// Psychic Modules

// Zeon
// MA
// Magic Projection
// Summon, Control, Banish, Bind
// Mystical Modules

// Height, weight, age, eye and hair colors
// Secondary Abilities
