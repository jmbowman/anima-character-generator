/*global define: false */
/**
 * Adds methods to {@link module:character} related to Resistances.
 * @module resistances
 * @requires jquery
 * @requires character
 * @requires development_points
 * @requires tables
 * @requires martial_knowledge
 * @see module:character#resistance
 * @see module:character#resistance_modifiers
 */
define(['jquery', 'character', 'tables', 'development_points', 'martial_knowledge'],
function ($, Character, tables) {

    /**
     * Get one of the character's Resistance values.
     * @method module:character#resistance
     * @param {String} name PhR, MR, PsR, VR, or DR
     * @returns {Number}
     */
    Character.prototype.resistance = function (name) {
        var gender,
            myAdvantages = this.Advantages,
            myDisadvantages = this.Disadvantages,
            penalty,
            points,
            power,
            total = this.presence() + this.modifier(tables.resistances[name]);
        switch (this.Race) {
        case 'Devah Nephilim':
            if (name === 'PhR' || name === 'DR') {
                total -= 10;
            }
            break;
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
            break;
        case 'Vetala Nephilim':
            if (name === 'DR') {
                total -= 20;
            }
        }
        if (name === 'PhR' && this.has_ki_ability('Physical Dominion')) {
            total += 10;
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
        else if ($.inArray(name, ['DR', 'PhR', 'VR']) !== -1) {
            points = myAdvantages['Exceptional Physical Resistance'];
            if (points) {
                total += points * 25;
            }
            power = this.power_parameters('Increased Physical Resistance');
            if (power.length) {
                power = power[power.length - 1];
                penalty = power.Penalties;
                if (!penalty || penalty === name) {
                    total += power.Options.slice(1, 3) * 1;
                }
            }
        }
        if (name === 'MR' || name === 'PsR') {
            power = this.power_parameters('Mystical & Psychic Resistance');
            if (power) {
                power = power[power.length - 1];
            }
        }
        if (this.has_ki_ability('Body of Emptiness')) {
            total += 20;
        }
        if ((name === 'DR' && 'Sickly' in myDisadvantages) ||
            (name === 'MR' && 'Susceptible to Magic' in myDisadvantages) ||
            (name === 'PhR' && 'Physical Weakness' in myDisadvantages) ||
            (name === 'VR' && 'Susceptible to Poisons' in myDisadvantages)) {
            total = Math.floor(total / 2);
        }
        return total;
    };

    /**
     * Get the character's situation modifiers to his resistance checks
     * (elemental affinity, etc.)
     * @method module:character#resistance_modifiers
     * @returns {Object} An object whose keys are situation descriptions and
     *     values are bonus or penalty magnitudes.
     */
    Character.prototype.resistance_modifiers = function () {
        var element = this.Element,
            first_level_dp = this.levels[0].DP,
            attuned = first_level_dp.Attuned,
            race = this.Race,
            result = {};
        if (element) {
            result[element] = 20;
            result[tables.opposite_elements[element]] = -20;
        }
        if (attuned && $.inArray(attuned, tables.elements) > -1) {
            if (attuned in result) {
                result[attuned] += 20;
            }
            else {
                result[attuned] = 20;
            }
        }
        if (race === "D'Anjayni Nephilim") {
            result['supernatural detection'] = 30;
        }
        else if (race === 'Devah Nephilim') {
            result['mind reading and emotion alteration'] = 10;
        }
        else if (race === "Duk'zarist Nephilim") {
            element = 'Darkness';
            if (element in result) {
                result[element] += 10;
            }
            else {
                result[element] = 10;
            }
        }
        else if (race === "Sylvain Nephilim") {
            element = 'Light';
            if (element in result) {
                result[element] += 10;
            }
            else {
                result[element] = 10;
            }
        }
        else if (race === 'Vetala Nephilim') {
            result['Criticals to vulnerable points'] = 50;
        }
        if ('Easily Possessed' in this.Disadvantages) {
            result['possession or domination'] = -50;
        }
        else if ('Free Will' in this.Advantages) {
            result['possession or domination'] = 60;
        }
        if (this.has_ki_ability('Ki Concealment')) {
            if ('supernatural detection' in result) {
                result['supernatural detection'] += Math.floor(this.ki_concealment() / 2);
            }
            else {
                result['supernatural detection'] = Math.floor(this.ki_concealment() / 2);
            }
        }
        else if (this.has_ki_ability('Undetectable')) {
            if ('supernatural detection' in result) {
                result['supernatural detection'] += this.presence() * 2;
            }
            else {
                result['supernatural detection'] = this.presence() * 2;
            }
        }
        return result;
    };

});
