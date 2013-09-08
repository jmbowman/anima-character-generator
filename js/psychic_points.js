/*global define: false */
/**
 * Adds new methods to the {@link module:character} class in order to handle
 * the allocation of Psychic Points.  To use any of the added methods,
 * require this module first.
 * @module psychic_points
 * @requires jquery
 * @requires character
 * @requires psychic_disciplines
 * @see module:character#add_discipline
 * @see module:character#has_discipline
 * @see module:character#remove_discipline
 * @see module:character#add_psychic_power
 * @see module:character#has_psychic_power
 * @see module:character#remove_psychic_power
 * @see module:character#boost_psychic_power
 * @see module:character#psychic_power_boost_total
 * @see module:character#boost_global_potential
 * @see module:character#global_potential_boost_total
 */
define(['jquery', 'character', 'psychic_disciplines'],
       function ($, Character) {

    /**
     * Give the character a Psychic Discipline at the specified level.
     * @method module:character#add_discipline
     * @param {String} name The name of the Psychic Discipline obtained
     * @param {Number} level The level at which the Psychic Discipline was purchased
     */
    Character.prototype.add_discipline = function (name, level) {
        var index = (level === 0) ? 0 : level - 1,
            level_info = this.levels[index],
            pp = level_info.PP,
            remaining = this.pp_remaining()[index];
        if (this.has_discipline(name, level)) {
            // already have it, do nothing
            return;
        }
        if (remaining < 1) {
            // can't afford it, do nothing
            return;
        }
        if (!pp) {
            pp = {};
            level_info.PP = pp;
        }
        if (!pp.Disciplines) {
            pp.Disciplines = {};
        }
        pp.Disciplines[name] = {};
        pp.Disciplines[name].Affinity = true;
    };


    /**
     * Does the character already have a certain Psychic Discipline?
     * @method module:character#has_discipline
     * @param {String} name The name of the Psychic Discipline
     * @param {Number} [level] If specified, the level by which the character
     *     must have the Psychic Discipline for the return value to be true.
     * @returns {Boolean}
     */
    Character.prototype.has_discipline = function (name, level) {
        var pp,
            i,
            levels = this.levels,
            count = levels.length;
        if (typeof level !== 'undefined') {
            count = level === 0 ? 1 : level;
        }
        for (i = 0; i < count; i++) {
            pp = levels[i].PP;
            if (pp && (name in pp.Disciplines)) {
                return true;
            }
        }
        return false;
    };
	
	
     /**
     * Remove from the character a Psychic Discipline at the specified level.
     * @method module:character#remove_discipline
     * @param {String} name The name of the Psychic Discipline removed
     * @param {Number} level The level at which the Psychic Discipline was removed
     */
    Character.prototype.remove_discipline = function (name, level) {
        var i,
            levels = this.levels,
            count = levels.length,
            pp;
        if (this.has_discipline(name, level)) {
            for (i = 0; i < count; i++) {
                pp = levels[i].PP;
                if (pp && pp.Disciplines && pp.Disciplines[name]) {
                    delete pp.Disciplines[name];
                    if (!Object.keys(pp.Disciplines.length)) {
                        delete pp.Disciplines;
                        if (!Object.keys(pp.length)) {
                            delete levels[i].PP;
                        }
                    }
                }
            }
        } else {
            return;
        }
    };

	
     /**
     * Give the character a Psychic Power at the specified level.
     * @method module:character#add_psychic_power
     * @param {String} name The name of the Psychic Power obtained
     * @param {String} discipline The discipline of the Psychic Power obtained
     * @param {Number} level The level at which the Psychic Power was purchased
     */
    Character.prototype.add_psychic_power = function (name, discipline, level) {
        var index = (level === 0) ? 0 : level - 1,
            level_info = this.levels[index],
            pp = level_info.PP,
            remaining = this.pp_remaining()[index];
        if (this.has_psychic_power(name, discipline)) {
            // already have it, do nothing
            return;
        }
        if (remaining < 1) {
            // can't afford it, do nothing
            return;
        }
        if (!pp) {
            pp = {};
            level_info.PP = pp;
        }
        if (!pp.Disciplines) {
            pp.Disciplines = {};
        }
        if (!pp.Disciplines[discipline]) {
            pp.Disciplines[discipline] = {};
        }
        if (!pp.Disciplines[discipline].Mastered) {
            pp.Disciplines[discipline].Mastered = [];
        }
        pp.Disciplines[discipline].Mastered.push(name);
    };
	
	
     /**
     * Does the character already have a certain Psychic Power?
     * @method module:character#has_psychic_power
     * @param {String} name The name of the Psychic Power
     * @param {String} discipline The discipline of the Psychic Power
     * @param {Number} [level] If specified, the level by which the character
     *     must have the Psychic Power for the return value to be true.
     * @returns {Boolean}
     */
    Character.prototype.has_psychic_power = function (name, discipline, level) {
        var pp,
            i,
            levels = this.levels,
            count = levels.length;
        if (typeof level !== 'undefined') {
            count = level === 0 ? 1 : level;
        }
        for (i = 0; i < count; i++) {
            pp = levels[i].PP;
            if (pp && pp.Disciplines && pp.Disciplines[discipline] && pp.Disciplines[discipline].Mastered && (name in pp.Disciplines[discipline].Mastered)) {
                return true;
            }
        }
        return false;
    };
	
	
     /**
     * Remove from the character a Psychic Power at the specified level.
     * @method module:character#remove_psychic_power
     * @param {String} name The name of the Psychic Power removed
     * @param {String} discipline The discipline of the Psychic Power removed
     * @param {Number} level The level at which the Psychic Power was removed
     */
    Character.prototype.remove_psychic_power = function (name, discipline, level) {
        var i,
            index = (level === 0) ? 0 : level - 1,
            levels = this.levels,
            level_info = this.levels[index],
            list,
            pp,
            count = levels.length;
        if (this.has_psychic_power(name, discipline, level)) {
            list = level_info.PP.Disciplines[discipline].Mastered;
            list.splice(list.indexOf(name), 1);
            if (list.length > 0) {
                level_info.PP.Disciplines[discipline].Mastered = list;
            } else {
                delete level_info.PP.Disciplines[discipline].Mastered;
            }
            for (i = 0; i < count; i++) {
                pp = levels[i].PP;
                if (pp && pp.Disciplines && pp.Disciplines[discipline] && pp.Disciplines[discipline][name]) {
                    delete pp.Disciplines[discipline][name];
                    if (!Object.keys(pp.Disciplines[discipline].length)) {
                        delete pp.Disciplines[discipline];
                        if (!Object.keys(pp.Disciplines.length)) {
                            delete pp.Disciplines;
                            if (!Object.keys(pp.length)) {
                                delete levels[i].PP;
                            }
                        }
                    }
                }
            }
        } else {
            return;
        }
    };
	
	
     /**
     * Boosts the character's Psychic Power at the specified level.
     * @method module:character#boost_psychic_power
     * @param {String} name The name of the Psychic Power boosted
     * @param {String} discipline The discipline of the Psychic Power boosted
     * @param {Number} boost The amount the Psychic Power is boosted
     * @param {Number} level The level at which the Psychic Discipline was boosted
     */
    Character.prototype.boost_psychic_power = function (name, discipline, boost, level) {
        var index = (level === 0) ? 0 : level - 1,
            level_info = this.levels[index],
            pp = level_info.PP,
            remaining = this.pp_remaining()[index],
            current_boost = this.psychic_power_boost_total(name, discipline)[index];
        if (boost + current_boost > 10) {
            // exceeds boost cap of 10, do nothing
            return;
		}
        if (remaining < boost) {
            // can't afford it, do nothing
            return;
        }
        if (!pp) {
            pp = {};
            level_info.PP = pp;
        }
        if (!pp.Disciplines) {
            pp.Disciplines = {};
        }
        if (!pp.Disciplines[discipline]) {
            pp.Disciplines[discipline] = {};
        }
        pp.Disciplines[discipline][name] = boost;
        if (boost === 0) {
            delete pp.Disciplines[discipline][name];
            if (!Object.keys(pp.Disciplines[discipline].length)) {
                delete pp.Disciplines;
            }
            if (!Object.keys(pp.length)) {
                delete level_info.PP;
            }
        }
    };
	
	
    /**
     * Calculates the character's boost amount for a psychic power at each level.
     * @method module:character#psychic_power_boost_total
     * @param {String} name The name of the Psychic Power
     * @param {String} discipline The discipline of the Psychic Power
     * @returns {Object} An array of the character's psychic power boost total at each
     *     level.  Note that these are cumulative totals, not just the amounts
     *     gained at each level.
     */
    Character.prototype.psychic_power_boost_total = function (name, discipline) {
        var boost = 0,
            i,
            levels = this.levels,
            count = levels.length,
            pp,
            result = [];
        for (i = 0; i < count; i++) {
            pp = levels[i].PP;
            if (pp && pp.Disciplines && pp.Disciplines[discipline] && pp.Disciplines[discipline][name]) {
                boost += pp.Disciplines[discipline][name];
            }
            result[i] = boost;
        }
        return result;
    };
	
	
     /**
     * Boosts the character's Global Potential at the specified level.
     * @method module:character#boost_global_potential
     * @param {Number} boost The amount the Global Potential is boosted
     * @param {Number} level The level at which the Global Potential was boosted
     */
    Character.prototype.boost_global_potential = function (boost, level) {
        var index = (level === 0) ? 0 : level - 1,
            level_info = this.levels[index],
            pp = level_info.PP,
            remaining = this.pp_remaining()[index],
            current_boost = this.global_potential_boost_total()[index];
        if (boost + current_boost > 10) {
            // exceeds boost cap of 10, do nothing
            return;
        }
        if (remaining < (boost * (boost + 1) / 2) - ((current_boost) * (current_boost + 1) / 2)) {
            // can't afford it, do nothing
            return;
        }
        if (!pp) {
            pp = {};
            level_info.PP = pp;
        }
        pp.Potential = boost;
        if (boost === 0) {
            delete pp.Potential;
            if (!Object.keys(pp.length)) {
                delete level_info.PP;
            }
        }
    };
	
	
     /**
     * Calculates the character's Global Potential boost total at each level.
     * @method module:character#global_potential_boost_total
     * @returns {Object} An array of the character's Global Potential boost total at each
     *     level.  Note that these are cumulative totals, not just the amounts
     *     gained at each level.
     */
    Character.prototype.global_potential_boost_total = function () {
        var boost = 0,
            i,
            levels = this.levels,
            count = levels.length,
            pp,
            result = [];
        for (i = 0; i < count; i++) {
            pp = levels[i].PP;
            if (pp && pp.Potential) {
                boost += pp.Potential;
            }
            result[i] = boost;
        }
        return result;
    };
	

     /**
     * Give the character Innate Slots at the specified level.
     * @method module:character#add_innate_slots
     * @param {Number} slots The amount of Innate Slots purchased
     * @param {Number} level The level at which the Psychic Discipline was purchased
     */
    Character.prototype.add_innate_slots = function (slots, level) {
        var index = (level === 0) ? 0 : level - 1,
            level_info = this.levels[index],
            pp = level_info.PP,
            remaining = this.pp_remaining()[index];
        if (remaining < slots * 2) {
            // can't afford it, do nothing
            return;
        }
        if (!pp) {
            pp = {};
            level_info.PP = pp;
        }
        pp["Innate Slots"] = slots;
        if (slots === 0) {
            delete pp["Innate Slots"];
            if (!Object.keys(pp.length)) {
                delete level_info.PP;
            }
        }
    };
	
});
