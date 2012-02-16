/*global define: false */
define(['jquery', 'abilities', 'libs/utils'], function ($, abilities) {

    var Primaries = function () {
        var ability_list,
            count,
            i,
            primary;
        if (!(this instanceof Primaries)) {
            return new Primaries();
        }
        this.Combat = [
            'Attack',
            'Block',
            'Dodge',
            'Wear Armor',
            'Ki',
            'Accumulation Multiple',
            'Martial Knowledge',
            'Save Combat DP for later'
        ];
        this.Supernatural = [
            'Zeon',
            'MA Multiple',
            'Magic Projection',
            'Summon',
            'Control',
            'Bind',
            'Banish',
            'Magic Level',
            'Save Supernatural DP for later'
        ];
        this.Psychic = [
            'Psychic Points',
            'Psychic Projection',
            'Save Psychic DP for later'
        ];
        this.Other = $.map(Object.keys(abilities), function (name, i) {
            if ('Field' in abilities[name]) {
                return name;
            }
            else {
                return null;
            }
        });
        this.Other.push('Life Point Multiple');
        this.Other.push('Save generic DP for later');
        for (primary in this) {
            if (this.hasOwnProperty(primary)) {
                ability_list = this[primary];
                count = ability_list.length;
                for (i = 0; i < count; i++) {
                    this.reverse_lookup_cache[ability_list[i]] = primary;
                }
            }
        }
    };
    
    Primaries.prototype.reverse_lookup_cache = {};

    Primaries.prototype.for_ability = function (name) {
        return this.reverse_lookup_cache[name];
    };

    return new Primaries();
});
