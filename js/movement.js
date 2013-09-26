/*global define: false */
/**
 * Additional methods for {@link module:character} dealing with movement and
 * initiative.
 * @module movement
 * @requires character
 * @requires classes
 * @requires martial_knowledge
 * @see module:character#initiative
 * @see module:character#movement_value
 */
define(['character', 'classes', 'martial_knowledge'],
function (Character, classes) {

    /**
     * Get the character's base initiative.  This is further modified by the
     * character's choice of action, weapon, martial arts, and so forth.
     * @method module:character#initiative
     * @param {Number} [at_level] Get the score as of this level.  If omitted,
     *     get the character's current initiative.
     * @returns {Number}
     * @see module:character#unarmed_ability
     */
    Character.prototype.initiative = function (at_level) {
        var i,
            ir = 0,
            levels = this.levels,
            length = levels.length,
            qr = this.Advantages['Quick Reflexes'],
            size,
            sr = this.Disadvantages['Slow Reactions'],
            total = this.modifier('AGI') + this.modifier('DEX'),
            value;
        if (typeof at_level !== 'undefined') {
            length = at_level === 0 ? 1 : at_level;
        }
        if (this.Type === 'Human') {
            total += 20;
        }
        else {
            size = this.size();
            if (size < 4) {
                total += 40;
            }
            else if (size < 9) {
                total += 30;
            }
            else if (size < 23) {
                total += 20;
            }
            else if (size < 25) {
                total += 10;
            }
            else if (size > 33) {
                total -= 20;
            }
            else if (size > 28) {
                total -= 10;
            }
        }
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
            value = levels[i].DP['Increased Reaction'];
            if (value) {
                ir = value.slice(1, 3) * 1;
            }
        }
        total += ir;
        if (this.has_ki_ability('Increased Speed', at_level)) {
            total += 10;
        }
        return total;
    };

    /**
     * Get the character's normal MV (Movement Value).
     * @method module:character#movement_value
     * @return {Number}
     */
    Character.prototype.movement_value = function () {
        var dp,
            i,
            im = 0,
            levels = this.levels,
            length = levels.length,
            has_moe = this.has_ki_ability('Movement of Emptiness'),
            result = this.characteristic('AGI'),
            size,
            value;
        if (has_moe) {
            result = Math.max(result, this.characteristic('POW'));
        }
        if (this.Type !== 'Human') {
            size = this.size();
            if (size < 4) {
                result -= 4;
            }
            else if (size < 9) {
                result -= 2;
            }
            else if (size > 33) {
                result += 3;
            }
            else if (size > 28) {
                result += 2;
            }
            else if (size > 24) {
                result += 1;
            }
        }
        if (levels[0].DP['Atrophied Members'] === 'Legs') {
            result -= 6;
        }
        for (i = 0; i < length; i++) {
            value = levels[i].DP['Increased Movement'];
            if (value) {
                im = value.slice(-1) * 1;
            }
        }
        result += im;
        if (result > 10 && !has_moe && !this.has_ki_ability('Inhumanity')) {
            if (!this.has_ki_ability('Inhuman (Nemesis)')) {
                dp = this.levels[0].DP;
                if (!('Inhumanity' in dp) && !('Zen' in dp)) {
                    result = 10;
                }
            }
        }
        return result;
    };

});
