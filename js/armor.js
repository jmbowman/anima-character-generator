/*global define: false */
/**
 * Additional methods for {@link module:character} dealing with armor and other
 * types of physical shielding.
 * @module armor
 * @requires character
 * @requires martial_knowledge
 * @see module:character#armor_type
 * @see module:character#damage_reduction
 * @see module:character#damage_barrier
 * @see module:character#damage_resistance_armor_type
 */
define(['character', 'martial_knowledge'], function (Character) {

    /**
     * Get the character's AT (Armor Type) against the given type of attack.
     * @method module:character#armor_type
     * @param {String} type One of the standard attack types (Cut, Impact,
     *     Thrust, Heat, Electricity, Energy)
     * @returns {Number}
     */
    Character.prototype.armor_type = function (type) {
        var myAdvantages = this.Advantages,
            total = 0;
        if (this['Damage Resistance']) {
            total = this.damage_resistance_armor_type();
        }
        if (type === 'Energy') {
            if ('Mystical Armor' in myAdvantages) {
                total += 2;
            }
            if (this.has_ki_ability('Armor of Arcane Energy')) {
                total += 6;
            }
            else if (this.has_ki_ability('Armor of Greater Energy')) {
                total += 4;
            }
            else if (this.has_ki_ability('Energy Armor')) {
                total += 2;
            }
        }
        else if ('Natural Armor' in myAdvantages) {
            total += 2;
        }
        return total;
    };

    /**
     * Get the amount by which attacks on the character have their Base Damage
     * reduced (provided by some Nemesis Abilities and creature Powers).
     * @method module:character#damage_reduction
     * @returns {Number}
     */
    Character.prototype.damage_reduction = function () {
        var total = 0;
        if (this.has_ki_ability('Noht')) {
            return -30;
        }
        else if (this.has_ki_ability('Armor of Emptiness')) {
            return -10;
        }
        return total;
    };

    /**
     * Get the character's Damage Barrier, if any.  This is the minimum amount
     * of Base Damage that an attack which isn't capable of damaging energy
     * must possess in order to be able to injure the character.
     * @method module:character#damage_barrier
     * @returns {Number} Default is 0
     */
    Character.prototype.damage_barrier = function () {
        var total = 0;
        if (this.has_ki_ability('Physical Shield')) {
            total = this.presence();
        }
        return total;
    };

    /**
     * Get the AT corresponding to this character's size if he/she uses the
     * Damage Resistance rules for defense (usually only for large creatures).
     * @method module:character#damage_resistance_armor_type
     * @returns {Number}
     */
    Character.prototype.damage_resistance_armor_type = function () {
        var size = this.size();
        if (size < 4) {
            return 1;
        }
        if (size < 9) {
            return 2;
        }
        if (size < 23) {
            return 3;
        }
        if (size < 25) {
            return 4;
        }
        if (size < 29) {
            return 6;
        }
        if (size < 34) {
            return 8;
        }
        return 10;
    };

});
