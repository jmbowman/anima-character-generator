define(['jquery', 'abilities', 'classes', 'psychic_disciplines', 'tables',
'libs/utils'], function($, abilities, classes, disciplines, tables, utils) {

  var character = function() {
    this.Advantages = {};
    this.Disadvantages = {};
    this.Race = 'Human';
    this.XP = 0;
    this.levels = [{Class: 'Freelancer', DP: {}}];
  };
  
  character.prototype.ability = function(name, specialty) {
    var ability = abilities[name];
    var total = 0;
    var bonuses = 0;
    var level = this.level();
    var nl = 0;
    var nlf = 0;
    var params, info, cls;
    if ('Natural Learner' in this.Advantages) {
      params = this.Advantages['Natural Learner'];
      if (params.Ability == name) {
        nl = params.Points * 10;
      }
    }
    if ('Field' in ability && 'Natural Learner, Field' in this.Advantages) {
      params = this.Advantages['Natural Learner, Field'];
      if (params.Field == ability.Field) {
        nlf = (params.Points - 1) * 5;
      }
    }
    if ('Cultural Roots' in this.Advantages) {
      params = this.Advantages['Cultural Roots'];
      var background = params;
      var choices = [];
      if ($.isPlainObject(params)) {
        background = params.Background;
        choices = params.Choices;
      }
      var cr = $cultural_roots[background];
      var amount;
      if (name in cr) {
        amount = cr[name];
      }
      else if (choices.indexOf(name) != -1) {
        $.each(cr.choices, function(i, choice) {
          for (var option in choice) {
            if (option == name) {
              amount = choice[option];
            }
          }
        });
      }
      if ($.isPlainObject(amount)) {
        var spec = Object.keys(amount)[0];
        if (spec == specialty) {
          bonuses += amount[spec];
        }
      }
      else {
        bonuses += amount;
      }
    }
    for (i = 0; i < level; i++) {
      info = this.levels[i];
      cls = $classes[info.Class];
      if (name in info.DP) {
        total += info.DP[name];
      }
      if (name in cls.bonuses) {
        if (level === 0) {
          bonuses += Math.floor(cls.bonuses[name] / 2);
        }
        else {
          bonuses += cls.bonuses[name];
        }
      }
      if ('Combat Senses' in this.Advantages && this.Advantages['Combat Senses'] == name) {
        bonuses += 5;
      }
      else if ('Imperceptible Ki' in this.Advantages && name == 'Ki Concealment') {
        bonuses += 10;
      }
      else if ('Ki Perception' in this.Advantages && name == 'Ki Detection') {
        bonuses += 10;
      }
      else if (name == 'Wear Armor' && 'Use of Armor' in this.Advantages) {
        bonuses += this.Advantages['Use of Armor'] * 5;
      }
      if ('Natural Bonus' in info && info['Natural Bonus'] == name) {
        var nb = this.modifier(ability.Characteristic, i + 1);
        if ('Increased Natural Bonus' in this.Advantages) {
          nb *= 2;
        }
        bonuses += nb;
      }
      bonuses += nl + nlf;
    }
    if ('Field' in ability) {
      if ('Jack of All Trades' in this.Advantages) {
        total += 10;
      }
      else if (total < 5) {
        total -= 30;
      }
    }
    if (bonuses > 50 && tables.primary_combat_abilities.indexOf(name) != -1) {
      bonuses = 50;
    }
    if ('Acute Senses' in this.Advantages && name in ['Notice', 'Search']) {
      bonuses += 30;
    }
    if ('Klutzy' in this.Disadvantages && ['Attack', 'Block', 'Disguise', 'Forging', 'Lock Picking', 'Sleight of Hand', 'Theft', 'Trap Lore'].indexOf(name) != -1) {
      total -= 30;
    }
    if ('Psychic Immunity' in this.Advantages && name == 'Composure') {
      bonuses += 60;
    }
    if ('Seducer' in this.Advantages && name == 'Persuasion' && specialty == 'seduction') {
      bonuses += 60;
    }
    if ('Talented' in this.Advantages && name == 'Sleight of Hand') {
      bonuses += 30;
    }
    total += bonuses + this.modifier(ability.Characteristic);
  };
  
  character.prototype.appearance = function() {
    var total = ('Appearance' in this) ? this.Appearance : 5;
    if (this.Race == "D'Anjayni Nephilim") {
      if (total < 3) {
        total = 3;
      }
      if (total > 7) {
        total = 7;
      }
    }
    if ('Unattractive' in this.Disadvantages) {
      total--;
    }
    return total;
  };
  
  character.prototype.armor_type = function(type) {
    var total = 0;
    if ('Natural Armor' in this.Advantages && type != 'Energy') {
      total += 2;
    }
    if ('Mystical Armor' in this.Advantages && type == 'Energy') {
      total += 2;
    }
    return total;
  };
  
  character.prototype.change_class = function(level, class_name) {
    var i = (level > 0) ? level - 1 : 0;
    this.levels[i].Class = class_name;
    if (this.levels.length > i + 1 && !('Versatile' in this.Advantages)) {
      this.levels[i + 1].Class = class_name;
    }
  };

  character.prototype.characteristic = function(name, at_level) {
    if (!at_level) {
      at_level = this.level();
    }
    var total = name in this ? this[name] : 5;
    if ('Increase One Characteristic to Nine' in this.Advantages) {
      $.each(this.Advantages['Increase One Characteristic to Nine'], function(i, item) {
        if (item == name) {
          total = 9;
        }
      });
    }
    if ('Repeat a Characteristics Roll' in this.Advantages) {
      $.each(this.Advantages['Repeat a Characteristics Roll'], function(i, item) {
        if (item.Characteristic == name) {
          total = item.Roll;
        }
      });
    }
    if ('Add One Point to a Characteristic' in this.Advantages) {
      $.each(this.Advantages['Add One Point to a Characteristic'], function(i, item) {
        if (item == name) {
          total += 1;
        }
      });
    }
    if ('Deduct Two Points from a Characteristic' in this.Disadvantages) {
      if (this.Disadvantages['Deduct Two Points from a Characteristic'] == name) {
        total -= 2;
      }
    }
    if (this.Race == 'Jayan Nephilim' && name =='STR') {
      total += 1;
    }
    for (i = 0; i < at_level && this.levels.length > i; i++) {
      var level = this.levels[i];
      if ('Characteristic' in level && level.Characteristic == name) {
        total += 1;
      }
    }
    if (total > 20) {
      total = 20;
    }
    return total;
  };
  
  character.prototype.class_change_dp = function(level) {
    if (level < 2) {
      return 0;
    }
    var this_class = this.levels[level - 1].Class;
    var last_class = this.levels[level - 2].Class;
    if (this_class == last_class) {
      return 0;
    }
    var this_types = classes[this_class].Archetypes;
    var last_types = classes[last_class].Archetypes;
    var cost = 60;
    if ([this_class, last_class].indexOf('Freelancer') != -1) {
      cost = 20;
    }
    else if (this_types.length == 1 && last_types.length == 1 && this_types[0] == last_types[0]) {
      cost = 20;
    }
    else if (utils.intersection(this_types, last_types).length > 0) {
      cost = 40;
    }
    if ('Versatile' in this.Advantages) {
      cost /= 2;
    }
    return cost;
  };
  
  character.prototype.class_change_possible = function(level) {
    if (level < 2 || 'Versatile' in this.Advantages) {
      return true;
    }
    if (level == 2) {
      return false;
    }
    var previous = this.levels[level - 2].Class;
    var before_that = this.levels[level - 3].Class;
    return previous == before_that;
  };
  
  character.prototype.cost = function(name, class_name) {
    var character_class = classes[class_name];
    var result;
    if (name in character_class.reduced) {
      result = character_class.reduced[name];
    }
    else if (name in abilities && 'Field' in abilities[name]) {
      result = character_class[abilities[name].Field];
    }
    else {
      result = character_class[name];
    }
    if ('Aptitude in a Field' in this.Advantages && name in $abilities) {
      var field = this.Advantages['Aptitude in a Field'];
      if ('Field' in abilities[name] && abilities[name].Field == field) {
        result--;
      }
    }
    if ('Aptitude in a Subject' in this.Advantages) {
      var info = this.Advantages['Aptitude in a Subject'];
      if (info.Ability == name) {
        result -= info.Points;
      }
    }
    if (result < 1) {
      result = 1;
    }
    return result;
  };
  
  character.prototype.discipline_access = function() {
    if ('Access to One Psychic Discipline' in this.Advantages) {
      return [this.Advantages['Access to One Psychic Discipline']];
    }
    else if ('Free Access to Any Psychic Discipline' in this.Advantages) {
      return Object.keys(disciplines.disciplines);
    }
    return [];
  };
  
  character.prototype.fatigue = function() {
    var total = this.characteristic('CON');
    if (this.Race == 'Jayan Nephilim') {
      total += 1;
    }
    if ('Untiring' in this.Advantages) {
      total += this.Advantages.Untiring * 3;
    }
    if ('Exhausted' in this.Disadvantages) {
      total--;
    }
    return total;
  };
  
  character.prototype.gender = function() {
    return ('Gender' in this) ? this.Gender : 'Male';
  };
  
  character.prototype.gnosis = function() {
    return ('Gnosis' in this) ? this.Gnosis : 0;
  };
  
  character.prototype.initiative = function() {
    var total = 20 + this.modifier('AGI') + this.modifier('DEX');
    if ('Quick Reflexes' in this.Advantages) {
      var points = this.Advantages['Quick Reflexes'];
      if (points === 1) {
        total += 25;
      }
      else if (points === 2) {
        total += 45;
      }
      else {
        total += 60;
      }
    }
    if ('Slow Reactions' in this.Disadvantages) {
      total -= this.Disadvantages['Slow Reactions'] * 30;
    }
    $.each(this.levels, function(i, level) {
      total += classes[level.Class].Initiative;
    });
    return total;
  };
  
  character.prototype.ki_concealment = function() {
    var total = 0;
    if (this.Race == "D'Anjayni Nephilim") {
      total += 30;
    }
    return total;
  };
  
  character.prototype.level = function() {
    if (this.XP >= 4125) {
      return 16;
    }
    for (var i = 0; i < 16; i++) {
      if (this.XP < tables.xp_chart[i]) {
        return i;
      }
    }
  };

  character.prototype.life_points = function() {
    var result = tables.base_lp[this.characteristic('CON')];
    var level = this.level();
    var con_mod = this.modifier('CON');
    var character = this;
    if ('levels' in this) {
      $.each(this.levels, function(i, info) {
        var cls = classes[info.Class];
        if (level > 0) {
          result += cls.LP;
        }
        if ('Life Point Multiple' in info.DP) {
          result += info.DP['Life Point Multiple'] * con_mod;
        }
        if ('Hard to Kill' in character.Advantages) {
          result += character.Advantages['Hard to Kill'] * 10;
        }
      });
    }
    return result;
  };

  character.prototype.modifier = function(characteristic, at_level) {
    return tables.modifiers[this.characteristic(characteristic, at_level)];
  };
  
  character.prototype.movement_value = function() {
    var result = this.characteristic('AGI');
    if (result > 10) {
      result = 10;
    }
    return result;
  };
  
  character.prototype.presence = function() {
    return this.level() * 5 + 25;
  };
  
  character.prototype.psychic_powers = function() {
    var powers = {};
    if ('Access to Natural Psychic Powers' in this.Advantages) {
      var info = this.Advantages['Access to Natural Psychic Powers'];
      var potential = 120;
      if (info.Points == 2) {
        potential = 140;
      }
      else if (info.Points == 3) {
        potential = 180;
      }
      powers[info.Power] = potential;
    }
    return powers;
  };
  
  character.prototype.racial_abilities = function() {
    if (this.Race == "D'Anjayni Nephilim") {
      return 'Pass Without Trace, Forgetfulness, +30 to Resistance vs. detection, Silent Whisper, -3 XP';
    }
    else if (this.Race == 'Daimah Nephilim') {
      return 'See the Essence, Sense the Forest, +3 Regeneration in thick forest or jungle, Movement in the Forest, -2 XP';
    }
    else if (this.Race == "Duk'zarist Nephilim") {
      return '+10 to Resistances vs. Dark, Automatically pass between life and death PhR checks, Limited Needs, Sense Light and Dark, Night Vision, Allergic to Metal, -5 XP';
    }
    else if (this.Race == 'Ebudan Nephilim') {
      return '+30 to Resistance vs. Forgetfulness and Emotional Control OR (Immune to attacks that cannot damage Energy, Flight Value 12), -3 XP';
    }
    else if (this.Race == 'Jayan Nephilim') {
      return 'Spiritual Vision, -3 XP';
    }
    else if (this.Race == 'Sylvain Nephilim') {
      return '+10 to Resistances vs. Light, Sense Light and Dark, Limited Needs, -4 XP';
    }
    return '';
  };
  
  character.prototype.regeneration = function() {
    var total = tables.regeneration[this.characteristic('CON')];
    if (this.Race in ["Duk'zarist Nephilim", 'Sylvain Nephilim']) {
      total += 1;
    }
    if ('Regeneration' in this.Advantages) {
      total += this.Advantages.Regeneration * 2;
    }
    if (total > 18 && this.gnosis() < 40) {
      total = 18;
    }
    else if (total > 19 && this.gnosis() < 45) {
      total = 19;
    }
    else if (total > 20) {
      total = 20;
    }
    return total;
  };
  
  character.prototype.resistance = function(name) {
    var total = this.presence() + this.modifier(tables.resistances[name]);
    if (this.Race == "Duk'zarist Nephilim") {
      if (name == 'PhR' && this.gender() == 'Male') {
        total += 20;
      }
      else if (name == 'MR' && this.gender() == 'Female') {
        total += 20;
      }
      else {
        total += 15;
      }
    }
    else if (this.Race == 'Jayan Nephilim') {
      if (name == 'PhR') {
        total += 15;
      }
      else if (name == 'MR') {
        total -= 10;
      }
    }
    else if (this.Race == 'Sylvain Nephilim') {
      if (name in ['MR', 'PsR']) {
        total += 10;
      }
      else if (name == 'DR') {
        total += 20;
      }
      else {
        total += 5;
      }
    }
    if (name == 'MR') {
      if ('Exceptional Magic Resistance' in this.Advantages) {
        total += this.Advantages['Exceptional Magic Resistance'] * 25;
      }
      if ('The Gift' in this.Advantages) {
        total += 10;
      }
    }
    else if (name == 'PsR' && 'Exceptional Psychic Resistance' in this.Advantages) {
      total += this.Advantages['Exceptional Psychic Resistance'] * 25;
    }
    else if (['DR', 'PhR', 'VR'].indexOf(name) != -1 &&
        'Exceptional Physical Resistance' in this.Advantages) {
      total += this.Advantages['Exceptional Physical Resistance'] * 25;
    }
    if ((name == 'DR' && 'Sickly' in this.Disadvantages) ||
        (name == 'MR' && 'Susceptible to Magic' in this.Disadvantages) ||
        (name == 'PhR' && 'Physical Weakness' in this.Disadvantages) ||
        (name == 'VR' && 'Susceptible to Poisons' in this.Disadvantages)) {
      total = Math.floor(total / 2);
    }
    return total;
  };
  
  character.prototype.second_hand_penalty = function() {
    if ('Ambidextrous' in this.Advantages) {
      return 10;
    }
    else {
      return 40;
    }
  };
  
  character.prototype.set_natural_bonus = function(level, name) {
    if (level < 1 || level > this.levels.length) {
      return;
    }
    this.levels[level - 1]['Natural Bonus'] = name;
  };
  
  character.prototype.size = function() {
    var total = this.modifier('STR') + this.modifier('CON');
    if (this.Race == 'Daimah Nephilim') {
      total -= 1;
    }
    else if (this.Race == 'Jayan Nephilim') {
      total += 2;
    }
    if ('Uncommon Size' in this.Advantages) {
      total += this.Advantages['Uncommon Size'];
    }
    return total;
  };
  
  character.prototype.summary = function() {
    var result = '';
    if ('Name' in this) {
      result += this.Name + ' ';
    }
    if ('levels' in this) {
      var my_classes = [];
      var levels = {};
      $.each(this.levels, function(i, level) {
        var cls = level.Class;
        if (my_classes.indexOf(cls) == -1) {
          my_classes.push(cls);
          levels[cls] = 1;
        }
        else {
          levels[cls]++;
        }
      });
      result += '(';
      $.each(my_classes, function(i, cls) {
        if (i > 0) {
          result += ', ';
        }
        result += cls + ' ' + levels[cls];
      });
      result += ')';
    }
    return result;
  };
  
  character.prototype.mk_total = function() {
    var total = 0;
    $.each(this.levels, function(i, level) {
      total += classes[level.Class].MK;
    });
    if ('Martial Mastery' in this.Advantages) {
      total += this.Advantages['Martial Mastery'] * 40;
    }
    return total;
  };
  
  character.prototype.mk_used = function() {
    var used = 0;
    $.each(this.levels, function(i, level) {
      if ('MK' in level) {
        for (var item in level.MK) {
          used += level.MK[item];
        }
      }
    });
    return used;
  };
  
  character.prototype.zeon = function() {
    var total = tables.base_zeon[this.characteristic('POW')];
    var data = this;
    $.each(this.levels, function(i, level) {
      var cls = classes[level.Class];
      if ('Zeon' in level.DP) {
        total += level.DP.Zeon * 5;
      }
      if ('Zeon' in cls.bonuses) {
        total += cls.bonuses.Zeon;
      }
      if ('Magic Nature' in this.Advantages) {
        total += this.Advantages['Magic Nature'] * 50;
      }
    });
    return total;
  };
  
  return character;
});

// Level object: Class, DP, Natural Bonus, MK, Characteristic
// Duk'zarist first psychic discipline must be Pyrokinesis

// Ki points, accumulations
// Attack + Block + Dodge cap (50% of total DP)
// Max 50 gap between Attack and Defense
// Magic, Psychic Projection caps (half of Supernatural, Psychic caps)
// Weapon modules
// Martial arts

// Psychic Points
// Psychic Projection
// Psychic Modules

// Zeon
// MA
// Magic Projection
// Summon, Control, Banish, Bind
// Mystical Modules

// Height, weight, age, eye and hair colors
// Secondary Abilities
