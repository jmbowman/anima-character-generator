/*global define: false */
/**
 * Adds methods to {@link module:character} related to the allocation of
 * Creation Points.
 * @module creation_points
 * @requires jquery
 * @requires advantages
 * @requires character
 * @requires classes
 * @requires disadvantages
 * @requires tables
 * @requires libs/utils
 * @see module:character#add_advantage
 * @see module:character#add_disadvantage
 * @see module:character#advantage_allowed
 * @see module:character#advantage_cost
 * @see module:character#advantage_summary
 * @see module:character#cp_remaining
 * @see module:character#cp_total
 * @see module:character#disadvantage_allowed
 * @see module:character#disadvantage_benefit
 * @see module:character#disadvantage_summary
 */
define(['jquery', 'advantages', 'character', 'classes', 'disadvantages',
'tables', 'libs/utils'], function ($, advantages, Character, classes,
disadvantages, tables, utils) {
  
    Character.prototype.add_advantage = function (name, cost, params) {
        var myAdvantages = this.Advantages,
            advantage;
        if (name === 'Access to Natural Psychic Powers') {
            myAdvantages[name] = {Points: cost, Power: params};
        }
        else if ($.inArray(name, ['Aptitude in a Subject', 'Natural Learner']) >= 0) {
            myAdvantages[name] = {Points: cost, Ability: params};
        }
        else if (name === 'Cultural Roots') {
            if (params.Choices.length === 0) {
                myAdvantages[name] = params.Background;
            }
            else {
                myAdvantages[name] = params;
            }
        }
        else if (name === 'Natural Learner, Field') {
            myAdvantages[name] = {Points: cost, Field: params};
        }
        else if ($.inArray(name, ['Add One Point to a Characteristic', 'Increase One Characteristic to Nine', 'Repeat a Characteristics Roll']) >= 0) {
            if (!(name in myAdvantages)) {
                myAdvantages[name] = [];
            }
            myAdvantages[name].push(params);
        }
        else if ($.inArray(name, ['Artifact', 'Contacts', 'Elan', 'Powerful Ally']) >= 0) {
            myAdvantages[name] = {Points: cost, Name: params};
        }
        else if (name === 'Uncommon Size') {
            myAdvantages[name] = parseInt(params, 10);
        }
        else {
            advantage = advantages[name];
            if ($.isArray(advantage.Cost)) {
                myAdvantages[name] = cost;
            }
            else if ('Options' in advantage) {
                if (advantage.Multiple) {
                    if (name in myAdvantages) {
                        myAdvantages[name].push(params);
                    }
                    else {
                        myAdvantages[name] = [params];
                    }
                }
                else {
                    myAdvantages[name] = params;
                }
            }
            else {
                myAdvantages[name] = advantage.Cost;
            }
        }
        if (name === 'Been Around') {
            this.XP = cost * 50;
        }
    };
  
    Character.prototype.add_disadvantage = function (name, benefit, param) {
        var disadvantage = disadvantages[name],
            myDisadvantages = this.Disadvantages;
        if (name === 'Damned') {
            myDisadvantages[name] = {Points: benefit, Effect: param};
        }
        else if (name === 'Powerful Enemy') {
            myDisadvantages[name] = {Points: benefit, Name: param};
        }
        else if ($.isArray(disadvantage.Benefit)) {
            myDisadvantages[name] = benefit;
        }
        else if ('Options' in disadvantage) {
            myDisadvantages[name] = param;
        }
        else {
            myDisadvantages[name] = disadvantage.Benefit;
        }
        if (name === 'Without any Natural Bonus') {
            $.each(this.levels, function (i, level) {
                if ('Natural Bonus' in level) {
                    delete level['Natural Bonus'];
                }
            });
        }
        else if (name === 'Rookie') {
            this.XP -= 100;
        }
    };
  
    Character.prototype.advantage_allowed = function (name, parameter) {
        var advantage = advantages[name],
            allowed = true,
            cp_remaining = this.cp_remaining('Common'),
            cost = advantage.Cost,
            myAdvantages = this.Advantages,
            myDisadvantages = this.Disadvantages,
            myRace = this.Race,
            value;
        if ('Category' in advantage) {
            cp_remaining += this.cp_remaining(advantage.Category);
        }
        if ($.isArray(cost)) {
            if (cost[0] > cp_remaining) {
                return false;
            }
        }
        else if (cost > cp_remaining) {
            return false;
        }
        if (name === 'Access to One Psychic Discipline' && parameter) {
            if (myRace === "Duk'zarist Nephilim" && parameter !== 'Pyrokinesis') {
                return false;
            }
        }
        else if (name === 'Elemental Compatibility' && parameter) {
            if (myRace === "Duk'zarist Nephilim" && parameter === 'Light') {
                return false;
            }
            else if (myRace === 'Sylvain Nephilim' && parameter === 'Darkness') {
                return false;
            }
        }
        else if (name === 'Psychic Immunity') {
            if ('Addiction' in myDisadvantages || 'Serious Vice' in myDisadvantages ||
                'Cowardice' in myDisadvantages || 'Severe Phobia' in myDisadvantages) {
                return false;
            }
        }
        else if (name === 'Psychic Inclination' && parameter) {
            if ($.inArray(parameter, this.discipline_access()) === -1) {
                return false;
            }
        }
        else if (name === 'Supernatural Immunity') {
            if (this.has_gift() || 'See Supernatural' in myAdvantages) {
                return false;
            }
            $.each(['Sylvain', "Duk'zarist", 'Daimah'], function (i, race) {
                if (myRace.indexOf(race) !== -1) {
                    allowed = false;
                    return false;
                }
            });
            if (!allowed) {
                return false;
            }
        }
        else if ($.inArray(name, ['The Gift', 'Incomplete Gift', 'See Supernatural']) !== -1 &&
                 'Supernatural Immunity' in myAdvantages) {
            return false;
        }
        else if (name === 'Uncommon Size' && myRace === 'Jayan Nephilim') {
            if (parameter && parameter < 1) {
                return false;
            }
        }
        if ('Category' in advantage) {
            if (advantage.Category === 'Magic' && !this.has_gift()) {
                return false;
            }
            if (advantage.Category === 'Psychic' &&
                !('Free Access to Any Psychic Discipline' in myAdvantages) &&
                !('Access to One Psychic Discipline' in myAdvantages)) {
                return false;
            }
        }
        if (name === 'Add One Point to a Characteristic') {
            if (!parameter) {
                return true;
            }
            value = this.characteristic(parameter);
            if (value > 13) {
                return false;
            }
            else if (value > 11 && $.inArray(parameter, ['STR', 'DEX', 'AGI', 'CON']) !== -1) {
                return false;
            }
            return true;
        }
        if ($.inArray(name, ['Increase One Characteristic to Nine', 'Repeat a Characteristics Roll']) !== -1) {
            return true;
        }
        if (name in myAdvantages) {
            return false;
        }
        return true;
    };

    Character.prototype.advantage_cost = function (name) {
        var params = this.Advantages[name];
        if ($.isPlainObject(params) && 'Points' in params) {
            return params.Points;
        }
        else if ($.isArray(params)) {
            return advantages[name].Cost * params.length;
        }
        else if (name === 'Uncommon Size') {
            // value is a number, but not the cost
            return 1;
        }
        else if (!isNaN(parseInt(params, 10))) {
            return parseInt(params, 10);
        }
        else {
            return advantages[name].Cost;
        }
    };
  
    Character.prototype.advantage_summary = function (name) {
        var advantage = advantages[name],
            params = this.Advantages[name],
            result = name;
        if (name === 'Repeat a Characteristics Roll') {
            result += ': ';
            $.each(params, function (i, reroll) {
                if (i > 0) {
                    result += ', ';
                }
                result += reroll.Characteristic + ' (' + reroll.Roll + ')';
            });
            return result;
        }
        if ($.isArray(advantage.Cost)) {
            result += ' (' + this.advantage_cost(name) + ')';
        }
        if ('Options' in advantage) {
            result += ': ';
            if (name === 'Access to Natural Psychic Powers') {
                result += params.Power;
            }
            else if (name === 'Aptitude in a Subject') {
                result += params.Ability;
            }
            else if ($.inArray(name, ['Artifact', 'Contacts', 'Elan', 'Powerful Ally']) !== -1) {
                result += params.Name;
            }
            else if (name === 'Cultural Roots') {
                if ($.isPlainObject(params)) {
                    result += params.Background;
                }
                else {
                    result += params;
                }
            }
            else if (name === 'Natural Learner') {
                result += params.Ability;
            }
            else if (name === 'Natural Learner, Field') {
                result += params.Field;
            }
            else if ($.isArray(params)) {
                $.each(params, function (i, param) {
                    if (i > 0) {
                        result += ', ';
                    }
                    result += param;
                });
            }
            else {
                result += params;
            }
        }
        return result;
    };
  
    Character.prototype.cp_remaining = function (category) {
        var advantage,
            amount,
            disadvantage,
            name,
            myAdvantages = this.Advantages,
            myDisadvantages = this.Disadvantages,
            other_categories = {Background: 0, Magic: 0, Psychic: 0},
            total = (!category || category === 'Common') ? 3 : 0;
        for (name in myDisadvantages) {
            if (myDisadvantages.hasOwnProperty(name)) {
                amount = this.disadvantage_benefit(name);
                if (!category) {
                    total += amount;
                }
                else {
                    disadvantage = disadvantages[name];
                    if (!('Category' in disadvantage)) {
                        if (category === 'Common') {
                            total += amount;
                        }
                    }
                    else if (disadvantage.Category === category) {
                        total += amount;
                    }
                    else if (category === 'Common') {
                        other_categories[disadvantage.Category] += amount;
                    }
                }
            }
        }
        for (name in myAdvantages) {
            if (myAdvantages.hasOwnProperty(name)) {
                amount = this.advantage_cost(name);
                if (!category) {
                    total -= amount;
                }
                else {
                    advantage = advantages[name];
                    if (!('Category' in advantage)) {
                        if (category === 'Common') {
                            total -= amount;
                        }
                    }
                    else if (advantage.Category === category) {
                        total -= amount;
                    }
                    else if (category === 'Common') {
                        while (amount > 0 && other_categories[advantage.Category] > 0) {
                            amount--;
                            other_categories[advantage.Category]--;
                        }
                        total -= amount;
                    }
                }
            }
        }
        if (total < 0) {
            total = 0;
        }
        return total;
    };

    Character.prototype.cp_total = function () {
        var myDisadvantages = this.Disadvantages,
            name,
            total = 3;
        for (name in myDisadvantages) {
            if (myDisadvantages.hasOwnProperty(name)) {
                total += this.disadvantage_benefit(name);
            }
        }
        return total;
    };
  
    Character.prototype.disadvantage_allowed = function (name, parameter) {
        var allowed = false,
            character = this,
            disadvantage,
            myAdvantages = this.Advantages,
            myDisadvantages = this.Disadvantages,
            myRace = this.Race,
            types;
        if (name in myDisadvantages) {
            return false;
        }
        if (Object.keys(myDisadvantages).length > 2) {
            return false;
        }
        if (name === 'Deduct Two Points from a Characteristic') {
            if (!parameter) {
                $.each(tables.characteristics, function (i, characteristic) {
                    if (character.characteristic(characteristic) > 4) {
                        allowed = true;
                        return false;
                    }
                });
                return allowed;
            }
            else if (this.characteristic(parameter) < 5) {
                return false;
            }
            else if (myRace === 'Jayan Nephilim' && parameter === 'STR') {
                return false;
            }
        }
        else if (name === 'Exclusive Weapon') {
            types = ['Domine', 'Fighter', 'Novel', 'Prowler'];
            if (utils.intersection(types, classes[this.levels[0].Class].Archetypes) < 1) {
                return false;
            }
        }
        else if (name === 'Slow Recovery of Magic' && 'Magic Blockage' in myDisadvantages) {
            return false;
        }
        else if (name === 'Magic Blockage' && 'Slow Recovery of Magic' in myDisadvantages) {
            return false;
        }
        else if (name === 'Unattractive' && this.characteristic('Appearance') < 7) {
            return false;
        }
        else if ($.inArray(name, ['Addiction', 'Serious Vice', 'Cowardice', 'Severe Phobia']) !== -1) {
            if ('Psychic Immunity' in myAdvantages) {
                return false;
            }
        }
        disadvantage = disadvantages[name];
        if ('Category' in disadvantage) {
            if (disadvantage.Category === 'Magic' && !this.has_gift()) {
                return false;
            }
            if (disadvantage.Category === 'Psychic' &&
                !('Free Access to Any Psychic Discipline' in myAdvantages) &&
                !('Access to One Psychic Discipline' in myAdvantages)) {
                return false;
            }
        }
        if (myRace === "Duk'zarist Nephilim") {
            if ($.inArray(name, ['Atrophied Limb', 'Blind', 'Deafness', 'Mute', 'Nearsighted', 'Physical Weakness', 'Serious Illness', 'Sickly', 'Susceptible to Poisons']) !== -1) {
                return false;
            }
        }
        else if (myRace === 'Sylvain Nephilim') {
            if ($.inArray(name, ['Sickly', 'Serious Illness', 'Susceptible to Magic']) !== -1) {
                return false;
            }
        }
        return true;
    };
  
    Character.prototype.disadvantage_benefit = function (name) {
        var params = this.Disadvantages[name];
        if ($.isPlainObject(params) && 'Points' in params) {
            return params.Points;
        }
        else if (!isNaN(parseInt(params, 10))) {
            return parseInt(params, 10);
        }
        else {
            return disadvantages[name].Benefit;
        }
    };
  
    Character.prototype.disadvantage_summary = function (name) {
        var disadvantage = disadvantages[name],
            params = this.Disadvantages[name],
            result = name;
        if ($.isArray(disadvantage.Benefit)) {
            result += ' (' + this.disadvantage_benefit(name) + ')';
        }
        if ('Options' in disadvantage) {
            result += ': ';
            if (name === 'Damned') {
                result += params.Effect;
            }
            else if (name === 'Powerful Enemy') {
                result += params.Name;
            }
            else {
                result += params;
            }
        }
        return result;
    };

    return {};
});
