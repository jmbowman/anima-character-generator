/*global define: false */
/**
 * Data on the Primary Ability categories and which abilities belong to them.
 * @module primaries
 * @requires jquery
 * @requires abilities
 * @requires essential_abilities
 * @requires martial_arts
 * @requires modules
 * @requires libs/utils
 */
define(['jquery', 'abilities', 'essential_abilities', 'martial_arts',
    'modules', 'powers', 'libs/utils'],
    function ($, abilities, essential_abilities, martial_arts, modules, powers) {

    /**
     * Repository of information about Primary Abilties and their category
     * membership.
     * @lends module:primaries
     */
    var Primaries = function () {
        var ability_list,
            count,
            i,
            essentialAdvantages = essential_abilities.advantages,
            essentialDisadvantages = essential_abilities.disadvantages,
            name,
            primary;
        if (!(this instanceof Primaries)) {
            return new Primaries();
        }
        /**
         * The list of Combat Primary Abilities
         * @member module:primaries#Combat
         * @type {Array}
         */
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
        /**
         * The list of Supernatural Primary Abilities
         * @member module:primaries#Supernatural
         * @type {Array}
         */
        this.Supernatural = [
            'Zeon',
            'MA Multiple',
            'Zeon Regeneration Multiple',
            'Magic Projection',
            'Summon',
            'Control',
            'Bind',
            'Banish',
            'Magic Level',
            'Save Supernatural DP for later'
        ];
        /**
         * The list of Psychic Primary Abilities
         * @member module:primaries#Psychic
         * @type {Array}
         */
        this.Psychic = [
            'Psychic Points',
            'Psychic Projection',
            'Save Psychic DP for later'
        ];
        /**
         * The list of Secondary Abilities and miscellaneous other DP purchases
         * (Life Point Multiple, Life Points, and Save generic DP for later).
         * @member module:primaries#Other
         * @type {Array}
         */
        this.Other = $.map(Object.keys(abilities), function (name) {
            if ('Field' in abilities[name]) {
                return name;
            }
            else {
                return null;
            }
        });
        this.Other.push('Life Point Multiple');
        this.Other.push('Life Points'); // Damage Resistance creatures
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
        for (name in essentialAdvantages) {
            if (essentialAdvantages.hasOwnProperty(name)) {
                this.reverse_lookup_cache[name] = 'Other';
            }
        }
        for (name in essentialDisadvantages) {
            if (essentialDisadvantages.hasOwnProperty(name)) {
                this.reverse_lookup_cache[name] = 'Other';
            }
        }
        for (name in martial_arts) {
            if (martial_arts.hasOwnProperty(name)) {
                this.reverse_lookup_cache[name] = 'Combat';
            }
        }
        for (name in modules) {
            if (modules.hasOwnProperty(name)) {
                this.reverse_lookup_cache[name] = modules[name].Primary;
            }
        }
        for (name in powers) {
            if (powers.hasOwnProperty(name)) {
                this.reverse_lookup_cache[name] = 'Powers';
            }
        }
    };
    
    Primaries.prototype.reverse_lookup_cache = {};

    /**
     * Get the name of the Primary that the specified ability belongs to.
     * @param {String} name The name of the ability to look up
     * @returns {String} The name of a Primary (or "Other")
     */
    Primaries.prototype.for_ability = function (name) {
        return this.reverse_lookup_cache[name];
    };

    return new Primaries();
});
