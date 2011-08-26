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
  Paladin: new character_class(),
  Warrior: new character_class(),
  Weaponsmaster: new character_class()
};

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

(function() {
  this.Archetypes = ['Fighter'],
  this.LP = 10;
  this.MK = 25;
  this.Combat = 60;
  this.Block = 3;
  this.Intellectual = 3;
  this.bonuses = {Attack: 5, Dodge: 5, Acrobatics: 10, Jump: 10, Athleticism: 10, 'Sleight of Hand': 10, Style: 10}
}).call($classes['Acrobatic Warrior']);

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
  this.bonuses = {Block: 5, 'Wear Armor': 10, Banish: 10, Zeon: 20, Leadership: 10, 'Withstand Pain': 10, Style: 5}
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
  this.bonuses = {Attack: 5, 'Wear Armor': 5, Control: 10, Zeon: 20, Intimidate: 10, Composure: 10, Style: 5, Persuasion: 5}
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
