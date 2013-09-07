/*global define: false */
/**
 * Data for character classes.
 * @module classes
 */
define(function () {

    var Class, classes;
    Class = function () {
        if (!(this instanceof Class)) {
            return new Class();
        }
        this['Life Point Multiple'] = 20;
        this['Life Points'] = 1; // Damage Resistance DP cost for LP
        this.LP = 5;
        this.Initiative = 5;
        this.MK = 20;
        this['Innate Psychic Points'] = 3;
        this.Combat = 50;
        this.Attack = 2;
        this.Block = 2;
        this.Dodge = 2;
        this['Wear Armor'] = 2;
        this.Ki = 2;
        this['Accumulation Multiple'] = 20;
        this['Martial Knowledge'] = 5;
        this.Supernatural = 50;
        this.Zeon = 3;
        this['MA Multiple'] = 70;
        this['Zeon Regeneration Multiple'] = 35;
        this['Magic Projection'] = 3;
        this.Summon = 3;
        this.Control = 3;
        this.Bind = 3;
        this.Banish = 3;
        this['Magic Level'] = 5;
        this.Psychic = 50;
        this['Psychic Points'] = 20;
        this['Psychic Projection'] = 3;
        this.Athletics = 2;
        this.Social = 2;
        this.Perceptive = 2;
        this.Intellectual = 2;
        this.Vigor = 2;
        this.Subterfuge = 2;
        this.Creative = 2;
        this.reduced = {};
        this.bonuses = {};
    };

    classes = {
        'Acrobatic Warrior': new Class(),
        Assassin: new Class(),
        'Dark Paladin': new Class(),
        Freelancer: new Class(),
        Illusionist: new Class(),
        Mentalist: new Class(),
        Paladin: new Class(),
        Ranger: new Class(),
        Shadow: new Class(),
        Summoner: new Class(),
        Tao: new Class(),
        Technician: new Class(),
        Thief: new Class(),
        Warlock: new Class(),
        Warrior: new Class(),
        'Warrior Mentalist': new Class(),
        'Warrior Summoner': new Class(),
        Weaponsmaster: new Class(),
        Wizard: new Class(),
        'Wizard Mentalist': new Class()
    };

    // Acrobatic Warrior
    (function (c) {
        c.Archetypes = ['Fighter'];
        c.LP = 10;
        c.MK = 25;
        c.Combat = 60;
        c.Block = 3;
        c.Intellectual = 3;
        c.bonuses = {Attack: 5, Dodge: 5, Acrobatics: 10, Jump: 10, Athleticism: 10, 'Sleight of Hand': 10, Style: 10};
    }(classes['Acrobatic Warrior']));

    // Assassin
    (function (c) {
        c.Archetypes = ['Prowler'];
        c.Initiative = 10;
        c.Block = 3;
        c['Wear Armor'] = 3;
        c['Accumulation Multiple'] = 25;
        c.Perceptive = 1;
        c.Intellectual = 3;
        c.Vigor = 3;
        c.reduced.Stealth = 1;
        c.reduced.Composure = 2;
        c.reduced.Memorize = 2;
        c.bonuses = {Attack: 5, Notice: 10, Search: 10, Hide: 10, Stealth: 10, Poisons: 10, Composure: 10, 'Trap Lore': 10};
    }(classes.Assassin));

    // Dark Paladin
    (function (c) {
        c.Archetypes = ['Fighter'];
        c.LP = 15;
        c['Life Point Multiple'] = 15;
        c.Combat = 60;
        c.Zeon = 2;
        c['MA Multiple'] = 60;
        c['Zeon Regeneration Multiple'] = 30;
        c.Control = 1;
        c.Social = 1;
        c.reduced.Composure = 1;
        c.bonuses = {Attack: 5, 'Wear Armor': 5, Control: 10, Zeon: 20, Intimidate: 10, Composure: 10, Style: 5, Persuasion: 5};
        c.supernatural = function (y) {
            if (y) {
                this.bonuses.Control = 0;
                this.bonuses.Zeon = 0;
                this.bonuses['Withstand Pain'] = 10;
            }
            else {
                this.bonuses.Control = 10;
                this.bonuses.Zeon = 20;
                this.bonuses['Withstand Pain'] = 0;
            }
        };
    }(classes['Dark Paladin']));
  
    // Freelancer
    (function (c) {
        c.Archetypes = ['Novel'];
        c['Innate Psychic Points'] = 2;
        c.Combat = 60;
        c.Supernatural = 60;
        c.Zeon = 2;
        c['MA Multiple'] = 60;
        c['Zeon Regeneration Multiple'] = 30;
        c.Summon = 2;
        c.Control = 2;
        c.Bind = 2;
        c.Banish = 2;
        c.Psychic = 60;
        c['Psychic Projection'] = 2;
        c.bonuses.Zeon = 10;
    }(classes.Freelancer));

    // Illusionist
    (function (c) {
        c.Archetypes = ['Mystic', 'Prowler'];
        c.Attack = 3;
        c.Block = 3;
        c['Wear Armor'] = 3;
        c.Ki = 2;
        c['Accumulation Multiple'] = 25;
        c.Supernatural = 60;
        c.Zeon = 1;
        c['MA Multiple'] = 60;
        c['Zeon Regeneration Multiple'] = 30;
        c['Magic Projection'] = 2;
        c.Vigor = 3;
        c.reduced['Sleight of Hand'] = 1;
        c.reduced.Persuasion = 1;
        c.bonuses = {Zeon: 75,  'Magic Appraisal': 5, Stealth: 10, Hide: 10, 'Sleight of Hand': 10, Disguise: 5, Theft: 5, Persuasion: 5};
    }(classes.Illusionist));
  
    // Mentalist
    (function (c) {
        c.Archetypes = ['Psychic'];
        c.MK = 10;
        c['Innate Psychic Points'] = 1;
        c.Attack = 3;
        c.Block = 3;
        c['Wear Armor'] = 3;
        c.Ki = 3;
        c['Accumulation Multiple'] = 30;
        c.Psychic = 60;
        c['Psychic Points'] = 10;
        c['Psychic Projection'] = 2;
        c.Vigor = 3;
    }(classes.Mentalist));

    //Paladin
    (function (c) {
        c.Archetypes = ['Fighter'];
        c.LP = 15;
        c['Life Point Multiple'] = 15;
        c.Combat = 60;
        c.Zeon = 2;
        c['MA Multiple'] = 60;
        c['Zeon Regeneration Multiple'] = 30;
        c.Banish = 1;
        c.Social = 1;
        c.Subterfuge = 3;
        c.reduced['Withstand Pain'] = 1;
        c.bonuses = {Block: 5, 'Wear Armor': 10, Banish: 10, Zeon: 20, Leadership: 10, 'Withstand Pain': 10, Style: 5};
        c.supernatural = function (y) {
            if (y) {
                this.bonuses.Banish = 0;
                this.bonuses.Zeon = 0;
                this.bonuses.Composure = 10;
            }
            else {
                this.bonuses.Banish = 10;
                this.bonuses.Zeon = 20;
                this.bonuses.Composure = 0;
            }
        };
    }(classes.Paladin));
  
    // Ranger
    (function (c) {
        c.Archetypes = ['Fighter', 'Prowler'];
        c.LP = 10;
        c.Combat = 60;
        c['Accumulation Multiple'] = 25;
        c.Perceptive = 1;
        c.Intellectual = 3;
        c.Vigor = 3;
        c.reduced['Trap Lore'] = 1;
        c.reduced['Herbal Lore'] = 2;
        c.reduced.Animals = 1;
        c.reduced.Medicine = 2;
        c.bonuses = {Attack: 5, Notice: 10, Search: 10, Track: 10, 'Trap Lore': 5, Animals: 5, 'Herbal Lore': 5};
        c.detect_ki = function (y) {
            if (y) {
                this.bonuses = {'Detect Ki': 10};
            }
        };
    }(classes.Ranger));

    // Shadow
    (function (c) {
        c.Archetypes = ['Fighter', 'Prowler'];
        c.Initiative = 10;
        c.MK = 25;
        c.Combat = 60;
        c.Block = 3;
        c.Intellectual = 3;
        c.bonuses = {Attack: 5, Dodge: 5, 'Ki Concealment': 5, Notice: 10, Search: 10, Hide: 10, Stealth: 5};
    }(classes.Shadow));
  
    // Summoner
    (function (c) {
        c.Archetypes = ['Mystic'];
        c.MK = 10;
        c.Attack = 3;
        c.Block = 3;
        c['Wear Armor'] = 3;
        c.Ki = 3;
        c['Accumulation Multiple'] = 30;
        c.Supernatural = 60;
        c.Zeon = 1;
        c['MA Multiple'] = 60;
        c['Zeon Regeneration Multiple'] = 30;
        c.Summon = 1;
        c.Control = 1;
        c.Bind = 1;
        c.Banish = 1;
        c.Vigor = 3;
        c.reduced.Occult = 1;
        c.bonuses = {Zeon: 50,  Summon: 10, Control: 10, Bind: 10, Banish: 10, 'Magic Appraisal': 5, Occult: 10};
    }(classes.Summoner));

    // Tao
    // TODO: need to capture martial art cost of only 20dp, 10dp for first one learned but not here.
    (function (c) {
        c.Archetypes = ['Domine', 'Fighter'];
        c['Life Point Multiple'] = 20;
        c.LP = 10;
        c.MK = 30;
        c.Combat = 60;
        c['Accumulation Multiple'] = 15;
        c.Intellectual = 3;
        c.bonuses.Style = 5;
    }(classes.Tao));
  
    // Technician
    (function (c) {
        c.Archetypes = ['Domine'];
        c.MK = 50;
        c.Combat = 60;
        c.Ki = 1;
        c['Accumulation Multiple'] = 10;
        c.Intellectual = 3;
        c.bonuses.Attack = 5;
    }(classes.Technician));
  
    // Thief
    (function (c) {
        c.Archetypes = ['Prowler'];
        c.Initiative = 10;
        c.Block = 3;
        c['Wear Armor'] = 3;
        c['Accumulation Multiple'] = 25;
        c.Athletics = 1;
        c.Intellectual = 3;
        c.Vigor = 3;
        c.Subterfuge = 1;
        c.reduced.Appraisal = 1;
        c.bonuses = {Dodge: 5, 'Ki Concealment': 5, Notice: 5, Search: 5, Hide: 5, Stealth: 5, 'Trap Lore': 5, 'Sleight of Hand': 5, Theft: 10};
    }(classes.Thief));

    // Warlock
    (function (c) {
        c.Archetypes = ['Fighter', 'Mystic'];
        c.LP = 10;
        c['Accumulation Multiple'] = 25;
        c.Zeon = 1;
        c['MA Multiple'] = 50;
        c['Zeon Regeneration Multiple'] = 25;
        c['Magic Projection'] = 2;
        c.Summon = 2;
        c.Control = 2;
        c.Bind = 2;
        c.Banish = 2;
        c.bonuses = {Attack: 5, Block: 5, Dodge: 5, Zeon: 20, 'Magic Appraisal': 5};
    }(classes.Warlock));
  
    // Warrior
    (function (c) {
        c.Archetypes = ['Fighter'];
        c['Life Point Multiple'] = 15;
        c.LP = 15;
        c.MK = 25;
        c.Combat = 60;
        c.Intellectual = 3;
        c.reduced['Feats of Strength'] = 1;
        c.bonuses = {Attack: 5, Block: 5, 'Wear Armor': 5, 'Feats of Strength': 5};
    }(classes.Warrior));
  
    // Warrior Mentalist
    (function (c) {
        c.Archetypes = ['Fighter', 'Psychic'];
        c.LP = 10;
        c['Innate Psychic Points'] = 1;
        c['Accumulation Multiple'] = 25;
        c['Psychic Points'] = 15;
        c['Psychic Projection'] = 2;
        c.Intellectual = 3;
        c.bonuses = {Attack: 5, Block: 5, Dodge: 5};
    }(classes['Warrior Mentalist']));
  
    // Warrior Summoner
    (function (c) {
        c.Archetypes = ['Fighter', 'Mystic'];
        c.LP = 10;
        c.Zeon = 1;
        c['MA Multiple'] = 60;
        c['Zeon Regeneration Multiple'] = 30;
        c.Summon = 1;
        c.Control = 1;
        c.Bind = 1;
        c.Banish = 1;
        c.Vigor = 3;
        c.bonuses = {Zeon: 20,  Attack: 5, Block: 5, Dodge: 5, Summon: 5, Control: 5, Bind: 5, Banish: 5, Occult: 5};
    }(classes['Warrior Summoner']));
    
    // Weaponsmaster
    // TODO: need to capture general, archetypal, and style modules half normal DP
    (function (c) {
        c.Archetypes = ['Fighter'];
        c['Life Point Multiple'] = 10;
        c.LP = 20;
        c.Initiative = 5;
        c.MK = 10;
        c.Combat = 60;
        c['Wear Armor'] = 1;
        c.Ki = 3;
        c['Accumulation Multiple'] = 30;
        c.Intellectual = 3;
        c.Vigor = 1;
        c.Subterfuge = 3;
        c.reduced['Feats of Strength'] = 1;
        c.bonuses = {Attack: 5, Block: 5, 'Wear Armor': 10, 'Feats of Strength': 5};
    }(classes.Weaponsmaster));

    // Wizard
    (function (c) {
        c.Archetypes = ['Mystic'];
        c.MK = 10;
        c.Attack = 3;
        c.Block = 3;
        c['Wear Armor'] = 3;
        c.Ki = 3;
        c['Accumulation Multiple'] = 30;
        c.Supernatural = 60;
        c.Zeon = 1;
        c['MA Multiple'] = 50;
        c['Zeon Regeneration Multiple'] = 25;
        c['Magic Projection'] = 2;
        c.Summon = 2;
        c.Control = 2;
        c.Bind = 2;
        c.Banish = 2;
        c.Vigor = 3;
        c.reduced['Magic Appraisal'] = 1;
        c.bonuses = {Zeon: 100,  'Magic Appraisal': 10, Occult: 5};
    }(classes.Wizard));
  
    // Wizard Mentalist
    (function (c) {
        c.Archetypes = ['Mystic', 'Psychic'];
        c.MK = 10;
        c['Innate Psychic Points'] = 1;
        c.Attack = 3;
        c.Block = 3;
        c['Wear Armor'] = 3;
        c.Ki = 3;
        c['Accumulation Multiple'] = 30;
        c.Supernatural = 50;
        c.Zeon = 1;
        c['MA Multiple'] = 50;
        c['Zeon Regeneration Multiple'] = 25;
        c['Magic Projection'] = 2;
        c.Summon = 2;
        c.Control = 2;
        c.Bind = 2;
        c.Banish = 2;
        c['Psychic Points'] = 10;
        c['Psychic Projection'] = 2;
        c.Vigor = 3;
        c.reduced['Magic Appraisal'] = 1;
        c.bonuses = {Zeon: 100,  'Magic Appraisal': 10, Occult: 5};
    }(classes['Wizard Mentalist']));
  
    return classes;
});

/* Valid level properties (in DP spent unless stated otherwise)
Class (name of class leveled as)
Characteristic (abbreviation for boosted Characteristic at even levels)
LP Multiples
Attack
Block
Dodge
Wear Armor
Ki
Accumulation Multiples
Zeon
MA Multiples
Magic Projection
Summon
Control
Bind
Banish
Psychic Points
Psychic Projection
(all Secondary Ability names)
*/
