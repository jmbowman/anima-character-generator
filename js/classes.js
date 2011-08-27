// Note: archetypes must be listed in alphabetical order for intersection() to work

character_class = function() {
  this.lp_multiple = 20;
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
  this.Supernatural = 50;
  this.Zeon = 3;
  this['MA Multiple'] = 70;
  this['Magic Projection'] = 3;
  this.Summon = 3;
  this.Control = 3;
  this.Bind = 3;
  this.Banish = 3;
  this.Psychic = 50;
  this['Psychic Point'] = 20;
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

$classes = {
  'Acrobatic Warrior': new character_class(),
  Assassin: new character_class(),
  'Dark Paladin': new character_class(),
  Freelancer: new character_class(),
  Illusionist: new character_class(),
  Mentalist: new character_class(),
  Paladin: new character_class(),
  Ranger: new character_class(),
  Shadow: new character_class(),
  Summoner: new character_class(),
  Tao: new character_class(),
  Technician: new character_class(),
  Thief: new character_class(),
  Warlock: new character_class(),
  Warrior: new character_class(),
  'Warrior Summoner': new character_class(),
  Weaponsmaster: new character_class(),
  Wizard: new character_class(),
  'Wizard Mentalist': new character_class()
};

// Acrobatic Warrior
(function() {
  this.Archetypes = ['Fighter'],
  this.LP = 10;
  this.MK = 25;
  this.Combat = 60;
  this.Block = 3;
  this.Intellectual = 3;
  this.bonuses = {Attack: 5, Dodge: 5, Acrobatics: 10, Jump: 10, Athleticism: 10, 'Sleight of Hand': 10, Style: 10};
}).call($classes['Acrobatic Warrior']);

// Dark Paladin
(function() {
  this.Archetypes = ['Fighter'];
  this.LP = 15;
  this.lp_multiple = 15;
  this.Combat = 60;
  this.Zeon = 2;
  this['MA Multiple'] = 60;
  this.Control = 1;
  this.Social = 1;
  this.reduced.Composure = 1;
  this.bonuses = {Attack: 5, 'Wear Armor': 5, Control: 10, Zeon: 20, Intimidate: 10, Composure: 10, Style: 5, Persuasion: 5};
  this.supernatural = function(y) {
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
}).call($classes['Dark Paladin']);

// Freelancer
(function() {
  this['Innate Psychic Points'] = 2;
  this.Combat = 60;
  this.Supernatural = 60;
  this.Zeon = 2;
  this['MA Multiple'] = 60;
  this.Summon = 2;
  this.Control = 2;
  this.Bind = 2;
  this.Banish = 2;
  this.Psychic = 60;
  this['Psychic Projection'] = 2;
  this.bonuses['Zeon'] = 10;
}).call($classes.Freelancer);

// Illusionist
(function() {
  this.Archetypes = ['Mystic', 'Prowler'],
  this.Attack = 3;
  this.Block = 3;
  this['Wear Armor'] = 3;
  this.Ki = 2;
  this['Accumulation Multiple'] = 25;
  this.Supernatural = 60;
  this.Zeon = 1;
  this['MA Multiple'] = 60;
  this['Magic Projection'] = 2;
  this.Vigor = 3;
  this.reduced['Sleight of Hand'] = 1;
  this.reduced['Persuasion'] = 1;
  this.bonuses = {Zeon: 75,  'Magic Appraisal': 5, Stealth: 10, Hide: 10, 'Sleight of Hand': 10, Disguise: 5, Theft: 5, Persuasion: 5};
}).call($classes.Illusionist);

// Mentalist
(function() {
  this.Archetypes = ['Psychic'],
  this.MK = 10;
  this['Innate Psychic Points'] = 1;
  this.Attack = 3;
  this.Block = 3;
  this['Wear Armor'] = 3;
  this.Ki = 3;
  this['Accumulation Multiple'] = 30;
  this.Psychic = 60;
  this['Psychic Point'] = 10;
  this['Psychic Projection'] = 2;
  this.Vigor = 3;
}).call($classes.Mentalist);

//Paladin
(function() {
  this.Archetypes = ['Fighter'],
  this.LP = 15;
  this.lp_multiple = 15;
  this.Combat = 60;
  this.Zeon = 2;
  this['MA Multiple'] = 60;
  this.Banish = 1;
  this.Social = 1;
  this.Subterfuge = 3;
  this.reduced['Withstand Pain'] = 1;
  this.bonuses = {Block: 5, 'Wear Armor': 10, Banish: 10, Zeon: 20, Leadership: 10, 'Withstand Pain': 10, Style: 5};
  this.supernatural = function(y) {
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
}).call($classes.Paladin);

// Ranger
(function() {
  this.Archetypes = ['Fighter', 'Prowler'],
  this.LP = 10;
  this.Combat = 60;
  this['Accumulation Multiple'] = 25;
  this.Perceptive = 1;
  this.Intellectual = 3;
  this.Vigor = 3;
  this.reduced['Trap Lore'] = 1;
  this.reduced['Herbal Lore'] = 2;
  this.reduced['Animals'] = 1;
  this.reduced['Medicine'] = 2;
  this.bonuses = {Attack: 5, Notice: 10, Search: 10, Track: 10, 'Trap Lore': 5, Animals: 5, 'Herbal Lore': 5};
  this.detect_ki = function(y) {
    if (y) {
      this.bonuses = {'Detect Ki': 10};
    }
   };
}).call($classes.Ranger);

// Shadow
(function() {
  this.Archetypes = ['Fighter', 'Prowler'],
  this.Initiative = 10;
  this.MK = 25;
  this.Combat = 60;
  this.Block = 3;
  this.Intellectual = 3;
  this.bonuses = {Attack: 5, Dodge: 5, Notice: 10, Search: 10, Hide: 10, Stealth: 5};
  this.ki_concealment = function(y) {
    if (y) {
      this.bonuses = {'Ki Concealment': 5};
    }
   };
}).call($classes.Shadow);

// Summoner
(function() {
  this.Archetypes = ['Mystic'],
  this.MK = 10;
  this.Attack = 3;
  this.Block = 3;
  this['Wear Armor'] = 3;
  this.Ki = 3;
  this['Accumulation Multiple'] = 30;
  this.Supernatural = 60;
  this.Zeon = 1;
  this['MA Multiple'] = 60;
  this.Summon = 2;
  this.Control = 2;
  this.Bind = 2;
  this.Banish = 2;
  this.Vigor = 3;
  this.reduced['Occult'] = 1;
  this.bonuses = {Zeon: 50,  Summon: 10, Control: 10, Bind: 10, Banish: 10, 'Magic Appraisal': 5, Occult: 5};
}).call($classes.Summoner);

// Tao
// TODO: need to capture martial art cost of only 20dp, 10dp for first one learned but not here.
(function() {
  this.Archetypes = ['Domine', 'Fighter'],
  this.lp_multiple = 20;
  this.LP = 10;
  this.MK = 30;
  this.Combat = 60;
  this['Accumulation Multiple'] = 15;
  this.Intellectual = 3;
  this.bonuses['Style'] = 5;
}).call($classes.Tao);

// Technician
(function() {
  this.Archetypes = ['Domine'],
  this.MK = 50;
  this.Combat = 60;
  this.Ki = 1;
  this['Accumulation Multiple'] = 10;
  this.Intellectual = 3;
  this.bonuses['Attack'] = 5;
}).call($classes.Technician);

// Thief
(function() {
  this.Archetypes = ['Prowler'],
  this.Initiative = 10;
  this.Block = 3;
  this['Wear Armor'] = 3;
  this['Accumulation Multiple'] = 25;
  this.Athletics = 1;
  this.Intellectual = 3;
  this.Vigor = 3;
  this.Subterfuge = 1;
  this.reduced['Appraisal'] = 1;
  this.bonuses = {Dodge: 5, Notice: 5, Search: 5, Hide: 5, Stealth: 5, 'Trap Lore': 5, 'Sleight of Hand': 5, Theft: 10};
  this.ki_concealment = function(y) {
    if (y) {
      this.bonuses = {'Ki Concealment': 5};
    }
   };
}).call($classes.Thief);

// Warlock
(function() {
  this.Archetypes = ['Fighter', 'Mystic'],
  this.LP = 10;
  this['Accumulation Multiple'] = 25;
  this.Zeon = 1;
  this['MA Multiple'] = 50;
  this['Magic Projection'] = 2;
  this.Summon = 2;
  this.Control = 2;
  this.Bind = 2;
  this.Banish = 2;
  this.bonuses = {Attack: 5, Block: 5, Dodge: 5, Zeon: 20, 'Magic Appraisal': 5};
}).call($classes.Warlock);

// Warrior
(function() {
  this.Archetypes = ['Fighter'],
  this.lp_multiple = 15;
  this.LP = 15;
  this.MK = 25;
  this.Combat = 60;
  this.Intellectual = 3;
  this.reduced['Feats of Strength'] = 1;
  this.bonuses = {Attack: 5, Block: 5, 'Wear Armor': 5, 'Feats of Strength': 5};
}).call($classes.Warrior);

// Warrior Summoner
(function() {
  this.Archetypes = ['Fighter', 'Mystic'],
  this.LP = 10;
  this.Zeon = 1;
  this['MA Multiple'] = 60;
  this.Summon = 1;
  this.Control = 1;
  this.Bind = 1;
  this.Banish = 1;
  this.Vigor = 3;
  this.bonuses = {Zeon: 20,  Attack: 5, Block: 5, Dodge: 5, Summon: 5, Control: 5, Bind: 5, Banish: 5, Occult: 5};
}).call($classes['Warrior Summoner']);

// Wizard
(function() {
  this.Archetypes = ['Mystic'],
  this.MK = 10;
  this.Attack = 3;
  this.Block = 3;
  this['Wear Armor'] = 3;
  this.Ki = 3;
  this['Accumulation Multiple'] = 30;
  this.Supernatural = 60;
  this.Zeon = 1;
  this['MA Multiple'] = 50;
  this['Magic Projection'] = 2;
  this.Summon = 2;
  this.Control = 2;
  this.Bind = 2;
  this.Banish = 2;
  this.Vigor = 3;
  this.reduced['Magic Appraisal'] = 1;
  this.bonuses = {Zeon: 100,  'Magic Appraisal': 10, Occult: 5};
}).call($classes.Wizard);

// Wizard Mentalist
(function() {
  this.Archetypes = ['Mystic' , 'Psychic'],
  this.MK = 10;
  this['Innate Psychic Points'] = 1;
  this.Attack = 3;
  this.Block = 3;
  this['Wear Armor'] = 3;
  this.Ki = 3;
  this['Accumulation Multiple'] = 30;
  this.Supernatural = 50;
  this.Zeon = 1;
  this['MA Multiple'] = 50;
  this['Magic Projection'] = 2;
  this.Summon = 2;
  this.Control = 2;
  this.Bind = 2;
  this.Banish = 2;
  this['Psychic Point'] = 10;
  this['Psychic Projection'] = 2;
  this.Vigor = 3;
  this.reduced['Magic Appraisal'] = 1;
  this.bonuses = {Zeon: 100,  'Magic Appraisal': 10, Occult: 5};
}).call($classes['Wizard Mentalist']);

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
