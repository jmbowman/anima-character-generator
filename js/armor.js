/*global define: false */
define(['character', 'martial_knowledge'], function (Character) {
  
    Character.prototype.armor_type = function (type) {
        var myAdvantages = this.Advantages,
            total = 0;
        if (this['Damage Resistance']) {
            total = this.damage_reduction_armor_type();
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

    Character.prototype.base_damage_reduction = function () {
        var total = 0;
        if (this.has_ki_ability('Noht')) {
            return -30;
        }
        else if (this.has_ki_ability('Armor of Emptiness')) {
            return -10;
        }
        return total;
    };

    Character.prototype.damage_barrier = function () {
        var total = 0;
        if (this.has_ki_ability('Physical Shield')) {
            total = this.presence();
        }
        return total;
    };

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
