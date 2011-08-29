var tables = {
  characteristics: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER'],
  primary_combat_abilities: ['Attack', 'Block', 'Dodge'],
  modifiers: [0, -30, -20, -10, -5, 0, 5, 5, 10, 10, 15, 20, 20, 25, 25, 30, 35, 35, 40, 40, 45],
  base_lp: [0, 5, 20, 40, 55, 70, 85, 95, 110, 120, 135, 150, 160, 175, 185, 200, 215, 225, 240, 250, 265],
  base_zeon: [0, 5, 20, 40, 55, 70, 85, 95, 110, 120, 135, 150, 160, 175, 185, 200, 215, 225, 240, 250, 265],
  base_ma: [0, 0, 0, 0, 0, 5, 5, 5, 10, 10, 10, 10, 15, 15, 15, 20, 25, 25, 30, 30, 35],
  regeneration: [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12],
  resistances: {DR: 'CON', MR: 'POW', PhR: 'CON', VR: 'CON', PsR: 'WP'},
  xp_chart: [0, 100, 225, 375, 550, 750, 975, 1225, 1500, 1800, 2125, 2475, 2850, 3250, 3675, 4125]
};

var char_funcs = {
  ability: function(name, specialty) {
    var ability = $abilities[name];
    var total = 0;
    var bonuses = 0;
    var level = this.level();
    var nl = 0;
    var nlf = 0;
    var params;
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
      var info = this.levels[i];
      var cls = $classes[info.Class];
      if (name in info.DP) {
        total += info.DP[name] / this.cost(name, cls);
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
  },
  
  add_advantage: function(name, cost, params) {
    if (name == 'Access to Natural Psychic Powers') {
      this.Advantages[name] = {Points: cost, Power: params};
    }
    else if (['Aptitude in a Subject', 'Natural Learner'].indexOf(name) != -1) {
      this.Advantages[name] = {Points: cost, Ability: params};
    }
    else if (name == 'Cultural Roots') {
      if (params.Choices.length === 0) {
        this.Advantages[name] = params.Background;
      }
      else {
        this.Advantages[name] = params;
      }
    }
    else if (name == 'Natural Learner, Field') {
      this.Advantages[name] = {Points: cost, Field: params};
    }
    else if (name == 'Repeat a Characteristics Roll') {
      if (!(name in this.Advantages)) {
        this.Advantages[name] = [];
      }
      this.Advantages[name].push(params);
    }
    else if (['Artifact', 'Contacts', 'Elan', 'Powerful Ally'].indexOf(name) != -1) {
      this.Advantages[name] = {Points: cost, Name: params};
    }
    else if (name == 'Uncommon Size') {
      this.Advantages[name] = parseInt(params, 10);
    }
    else {
      var advantage = $advantages[name];
      if ($.isArray(advantage.Cost)) {
        this.Advantages[name] = cost;
      }
      else if ('Options' in advantage) {
        if (advantage.Multiple) {
          if (name in this.Advantages) {
            this.Advantages[name].push(params);
          }
          else {
            this.Advantages[name] = [params];
          }
        }
        else {
          this.Advantages[name] = params;
        }
      }
      else {
        this.Advantages[name] = advantage.Cost;
      }
    }
  },
  
  add_disadvantage: function(name, benefit, param) {
    var disadvantage = $disadvantages[name];
    if (name == 'Damned') {
      this.Disadvantages[name] = {Points: benefit, Effect: param};
    }
    else if (name == 'Powerful Enemy') {
      this.Disadvantages[name] = {Points: benefit, Name: param};
    }
    else if ($.isArray(disadvantage.Benefit)) {
      this.Disadvantages[name] = benefit;
    }
    else if ('Options' in advantage) {
      this.Disadvantages[name] = param;
    }
    else {
      this.Disadvantages[name] = disadvantage.Benefit;
    }
    if (name == 'Without any Natural Bonus') {
      $.each(this.levels, function(i, level) {
        if ('Natural Bonus' in level) {
          delete level['Natural Bonus'];
        }
      });
    }
  },
  
  advantage_allowed: function(name, parameter) {
    var advantage = $advantages[name];
    var cp_remaining = this.cp_remaining('Common');
    if ('Category' in advantage) {
      cp_remaining += this.cp_remaining(advantage.Category);
    }
    if ($.isArray(advantage.Cost)) {
       if (advantage.Cost[0] > cp_remaining) {
         return false;
       }
    }
    else if (advantage.Cost > cp_remaining) {
      return false;
    }
    if (name == 'Access to One Psychic Discipline' && parameter) {
      if (this.Race == "Duk'zarist Nephilim" && parameter != 'Pyrokinesis') {
        return false;
      }
    }
    else if (name == 'Elemental Compatibility' && parameter) {
      if (this.Race == "Duk'zarist Nephilim" && parameter == 'Light') {
        return false;
      }
      else if (this.Race == 'Sylvain Nephilim' && parameter == 'Darkness') {
        return false;
      }
    }
    else if (name == 'Psychic Immunity') {
      if ('Addiction' in this.Disadvantages || 'Serious Vice' in this.Disadvantages ||
          'Cowardice' in this.Disadvantages || 'Severe Phobia' in this.Disadvantages) {
        return false;
      }
    }
    else if (name == 'Psychic Inclination' && parameter) {
      if (this.discipline_access().indexOf(parameter) == -1) {
        return false;
      }
    }
    else if (name == 'Supernatural Immunity') {
      if ('The Gift' in this.Advantages || 'See Supernatural' in this.Advantages) {
        return false;
      }
      var allowed = true;
      var character = this;
      $.each(['Sylvain', "Duk'zarist", 'Daimah'], function(i, race) {
        if (character.Race.indexOf(race) != -1) {
          allowed = false;
          return false;
        }
      });
      if (!allowed) {
        return false;
      }
    }
    else if (['The Gift', 'See Supernatural'].indexOf(name) != -1 && 'Supernatural Immunity' in this.Advantages) {
      return false;
    }
    else if (name == 'Uncommon Size' && this.Race == 'Jayan Nephilim') {
      if (parameter && parameter < 1) {
        return false;
      }
    }
    if ('Category' in advantage) {
      if (advantage.Category == 'Magic' && !('The Gift' in this.Advantages)) {
        return false;
      }
      if (advantage.Category == 'Psychic' &&
          !('Free Access to Any Psychic Discipline' in this.Advantages) &&
          !('Access to One Psychic Discipline' in this.Advantages)) {
        return false;   
      }
    }
    if (name == 'Add One Point to a Characteristic') {
      if (!parameter) {
        return true;
      }
      var value = this.characteristic(parameter);
      if (value > 13) {
        return false;
      }
      else if (value > 11 && ['STR', 'DEX', 'AGI', 'CON'].indexOf(parameter) != -1) {
        return false;
      }
      return true;
    }
    if (['Increase One Characteristic to Nine', 'Repeat a Characteristics Roll'].indexOf(name) != -1) {
      return true;
    }
    if (name in this.Advantages) {
      return false;
    }
    return true;
  },
  
  advantage_cost: function(name) {
    var params = this.Advantages[name];
    if ($.isPlainObject(params) && 'Points' in params) {
      return params.Points;
    }
    else if ($.isArray(params)) {
      return $advantages[name].Cost * params.length;
    }
    else if (!isNaN(parseInt(params, 10))) {
      return parseInt(params, 10);
    }
    else {
      return $advantages[name].Cost;
    }
  },
  
  advantage_summary: function(name) {
    var result = name;
    var advantage = $advantages[name];
    var params = this.Advantages[name];
    if (name == 'Repeat a Characteristics Roll') {
      result += ': ';
      $.each(params, function(i, reroll) {
        if (i > 0) {
          result += ', ';
        }
        result += reroll.Characteristic + ' (' + reroll.Roll + ')';
      });
      return result;
    }
    if ($.isArray(advantage.Cost)) {
      result += ' (' + this.advantage_cost(name) + ')';
    }
    if ('Options' in advantage) {
      result += ': ';
      if (name == 'Access to Natural Psychic Powers') {
        result += params.Power;
      }
      else if (name == 'Aptitude in a Subject') {
        result += params.Ability;
      }
      else if (['Artifact', 'Contacts', 'Elan', 'Powerful Ally'].indexOf(name) != -1) {
        result += params.Name;
      }
      else if (name == 'Cultural Roots') {
        if ($.isPlainObject(params)) {
          result += params.Background;
        }
        else {
          result += params;
        }
      }
      else if ($.isArray(params)) {
        $.each(params, function(i, param) {
          if (i > 0) {
            result += ', ';
          }
          result += param;
        });
      }
      else {
        result += params;
      }
    }
    return result;
  },
  
  appearance: function() {
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
  },
  
  armor_type: function(type) {
    var total = 0;
    if ('Natural Armor' in this.Advantages && type != 'Energy') {
      total += 2;
    }
    if ('Mystical Armor' in this.Advantages && type == 'Energy') {
      total += 2;
    }
    return total;
  },
  
  change_class: function(level, class_name) {
    var i = (level > 0) ? level - 1 : 0;
    $char.levels[i].Class = class_name;
    if ($char.levels.length > i + 1 && !('Versatile' in this.Advantages)) {
      $char.levels[i + 1].Class = class_name;
    }
  },

  characteristic: function(name, at_level) {
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
  },
  
  class_change_dp: function(level) {
    if (level < 2) {
      return 0;
    }
    var this_class = this.levels[level - 1].Class;
    var last_class = this.levels[level - 2].Class;
    if (this_class == last_class) {
      return 0;
    }
    var this_types = $classes[this_class].Archetypes;
    var last_types = $classes[last_class].Archetypes;
    var cost = 60;
    if ('Freelancer' in [this_class, last_class]) {
      cost = 20;
    }
    else if (this_types.length == 1 && last_types.length == 1 && this_types[0] == last_types[0]) {
      cost = 20;
    }
    else if (intersection(this_types, last_types).length > 0) {
      cost = 40;
    }
    if ('Versatile' in this.Advantages) {
      cost /= 2;
    }
    return cost;
  },
  
  class_change_possible: function(level) {
    if (level < 2 || 'Versatile' in this.Advantages) {
      return true;
    }
    if (level == 2) {
      return false;
    }
    var previous = this.levels[level - 2].Class;
    var before_that = this.levels[level - 3].Class;
    return previous == before_that;
  },
  
  cost: function(name, character_class) {
    var result;
    if (name in character_class.reduced) {
      result = character_class.reduced[name];
    }
    else if (name in $abilities && 'Field' in $abilities[name]) {
      result = character_class[$abilities[name].Field];
    }
    else {
      result = character_class[name];
    }
    if ('Aptitude in a Field' in this.Advantages && name in $abilities) {
      var field = this.Advantages['Aptitude in a Field'];
      if ('Field' in $abilities[name] && $abilities[name].Field == field) {
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
  },
  
  cp_remaining: function(category) {
    var total = (!category || category == 'Common') ? 3 : 0;
    var other_categories = {Background: 0, Magic: 0, Psychic: 0};
    var name;
    var amount;
    for (name in this.Disadvantages) {
      amount = this.disadvantage_benefit(name);
      if (!category) {
        total += amount;
      }
      else {
        var disadvantage = $disadvantages[name];
        if (!('Category' in disadvantage)) {
          if (category == 'Common') {
            total += amount;
          }
        }
        else if (disadvantage.Category == category) {
          total += amount;
        }
        else if (category == 'Common') {
          other_categories[disadvantage.Category] += amount;
        }
      }
    }
    for (name in this.Advantages) {
      amount = this.advantage_cost(name);
      if (!category) {
        total -= amount;
      }
      else {
        var advantage = $advantages[name];
        if (!('Category' in advantage)) {
          if (category == 'Common') {
            total -= amount;
          }
        }
        else if (advantage.Category == category) {
          total -= amount;
        }
        else if (category == 'Common') {
          while (amount > 0 && other_categories[advantage.Category] > 0) {
            amount--;
            other_categories[advantage.Category]--;
          }
          total -= amount;
        }
      }
    }
    if (total < 0) {
      total = 0;
    }
    return total;
  },
  
  cp_total: function() {
    var total = 3;
    for (var name in this.Disadvantages) {
      total += this.disadvantage_benefit(name);
    }
    return total;
  },
  
  disadvantage_allowed: function(name, parameter) {
    if (name in this.Disadvantages) {
      return false;
    }
    if (Object.keys(this.Disadvantages).length > 2) {
      return false;
    }
    if (name == 'Deduct Two Points from a Characteristic') {
      if (!parameter) {
        var allowed = false;
        var character = this;
        $.each(tables.characteristics, function(i, characteristic) {
          if (character.characteristic(characteristic) > 4) {
            allowed = true;
            return false;
          }
        });
        return allowed;
      }
      else if (this.characteristic(parameter) < 5) {
        return false;
      }
      else if (this.Race == 'Jayan Nephilim' && parameter == 'STR') {
        return false;
      }
    }
    else if (name == 'Exclusive Weapon') {
      var types = ['Domine', 'Fighter', 'Novel', 'Prowler'];
      if (intersection(types, $classes[this.levels[0].Class].Archetypes) < 1) {
        return false;
      }
    }
    else if (name == 'Slow Recovery of Magic' && 'Magic Blockage' in this.Disadvantages) {
      return false;
    }
    else if (name == 'Magic Blockage' && 'Slow Recovery of Magic' in this.Disadvantages) {
      return false;
    }
    else if (['Addiction', 'Serious Vice', 'Cowardice', 'Severe Phobia'].indexOf(name) != -1) {
      if ('Psychic Immunity' in this.Advantages) {
        return false;
      }
    }
    var disadvantage = $disadvantages[name];
    if ('Category' in disadvantage) {
      if (disadvantage.Category == 'Magic' && !('The Gift' in this.Advantages)) {
        return false;
      }
      if (disadvantage.Category == 'Psychic' &&
          !('Free Access to Any Psychic Discipline' in this.Advantages) &&
          !('Access to One Psychic Discipline' in this.Advantages)) {
        return false;   
      }
    }
    if (this.Race == "Duk'zarist Nephilim") {
      if (name in ['Atrophied Limb', 'Blind', 'Deafness', 'Mute', 'Nearsighted', 'Physical Weakness', 'Serious Illness', 'Sickly', 'Susceptible to Poisons']) {
        return false;
      }
    }
    else if (this.Race == 'Sylvan Nephilim') {
      if (name in ['Sickly', 'Serious Illness', 'Susceptible to Magic']) {
        return false;
      }
    }
    return true;
  },
  
  disadvantage_benefit: function(name) {
    var params = this.Disadvantages[name];
    if ($.isPlainObject(params) && 'Points' in params) {
      return params.Points;
    }
    else if (!isNaN(parseInt(params, 10))) {
      return parseInt(params, 10);
    }
    else {
      return $disadvantages[name].Benefit;
    }
  },
  
  disadvantage_summary: function(name) {
    var result = name;
    var disadvantage = $disadvantages[name];
    var params = this.Disadvantages[name];
    if ($.isArray(disadvantage.Benefit)) {
      result += ' (' + this.disadvantage_benefit(name) + ')';
    }
    if ('Options' in disadvantage) {
      result += ': ';
      if (name == 'Damned') {
        result += params.Effect;
      }
      else if (name == 'Powerful Enemy') {
        result += params.Name;
      }
      else {
        result += params;
      }
    }
    return result;
  },
  
  discipline_access: function() {
    if ('Access to One Psychic Discipline' in this.Advantages) {
      return [this.Advantages['Access to One Psychic Discipline']];
    }
    else if ('Free Access to Any Psychic Discipline' in this.Advantages) {
      return Object.keys($psychic_disciplines);
    }
    return [];
  },
  
  fatigue: function() {
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
  },
  
  gender: function() {
    return ('Gender' in this) ? this.Gender : 'Male';
  },
  
  gnosis: function() {
    return ('Gnosis' in this) ? this.Gnosis : 0;
  },
  
  initiative: function() {
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
      total += $classes[level.Class].Initiative;
    });
    return total;
  },
  
  ki_concealment: function() {
    var total = 0;
    if (this.Race == "D'Anjayni Nephilim") {
      total += 30;
    }
    return total;
  },
  
  level: function() {
    if (this.XP >= 4125) {
      return 16;
    }
    for (var i = 0; i < 16; i++) {
      if (this.XP < tables.xp_chart[i]) {
        return i;
      }
    }
  },

  lp: function() {
    var result = tables.base_lp[this.characteristic('CON')];
    var level = this.level();
    var con_mod = this.modifier('CON');
    var character = this;
    if ('levels' in this) {
      $.each(this.levels, function(i, info) {
        var cls = $classes[info.Class];
        if (level > 0) {
          result += cls.LP;
        }
        if ('LP Multiples' in info.DP) {
          result += info.DP['LP Multiples'] * con_mod / cls.lp_multiple;
        }
        if ('Hard to Kill' in character.Advantages) {
          result += character.Advantages['Hard to Kill'] * 10;
        }
      });
    }
    return result;
  },

  modifier: function(characteristic, at_level) {
    return tables.modifiers[this.characteristic(characteristic, at_level)];
  },
  
  movement_value: function() {
    var result = this.characteristic('AGI');
    if (result > 10) {
      result = 10;
    }
    return result;
  },
  
  next_step: function() {
    var data = this;
    var result = false;
    $.each(tables.characteristics, function(i, characteristic) {
      if (!(characteristic in data)) {
        result = 'Roll ' + characteristic;
        return false;
      }
    });
    if (result) {
      return result;
    }
    if (!('Appearance' in this)) {
      return 'Roll or select Appearance';
    }
    if (!('Gender' in this)) {
      return 'Select a gender';
    }
    if (!('Race' in this)) {
      return 'Select a race';
    }
    if (!('Name' in this)) {
      return 'Choose a name';
    }
    if (this.cp_remaining() > 0) {
      return 'Select advantages and disadvantages';
    }
    var level = this.level();
    if ((level === 0 && this.levels.length > 1) ||
        (level > 0 && level != this.levels.length)) {
      return 'Update levels list';
    }
    $.each(this.levels, function(i, level_data) {
      if ((i + 1) % 2 === 0 && !('Characteristic' in level_data)) {
        result = 'Select characteristic bonus for level ' + (i + 1);
        return false;
      }
      if (level > 0 && !('Natural Bonus' in level_data)) {
        result = 'Select natural bonus for level ' + (i + 1);
        return false;
      }
    });
    if (result) {
      return result;
    }
    return 'Done!';
  },
  
  presence: function() {
    return this.level() * 5 + 25;
  },
  
  psychic_powers: function() {
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
  },
  
  racial_abilities: function() {
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
  },
  
  regeneration: function() {
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
  },
  
  resistance: function(name) {
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
  },
  
  second_hand_penalty: function() {
    if ('Ambidextrous' in this.Advantages) {
      return 10;
    }
    else {
      return 40;
    }
  },
  
  set_natural_bonus: function(level, name) {
    if (level < 1 || level > this.levels.length) {
      return;
    }
    this.levels[level - 1]['Natural Bonus'] = name;
  },
  
  size: function() {
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
  },
  
  summary: function() {
    var result = '';
    if ('Name' in this) {
      result += this.Name + ' ';
    }
    if ('levels' in this) {
      var classes = [];
      var levels = {};
      $.each(this.levels, function(i, level) {
        var cls = level.Class;
        if (classes.indexOf(cls) == -1) {
          classes.push(cls);
          levels[cls] = 1;
        }
        else {
          levels[cls]++;
        }
      });
      result += '(';
      $.each(classes, function(i, cls) {
        if (i > 0) {
          result += ', ';
        }
        result += cls + ' ' + levels[cls];
      });
      result += ')';
    }
    return result;
  },

  total_dp: function() {
    var level = this.level();
    if (level === 0) {
      return 400;
    }
    return 500 + (level * 100);
  },
  
  total_mk: function() {
    var total = 0;
    $.each(this.levels, function(i, level) {
      total += $classes[level.Class].MK;
    });
    if ('Martial Mastery' in this.Advantages) {
      total += this.Advantages['Martial Mastery'] * 40;
    }
    return total;
  },
  
  used_dp: function(level, primary) {
    var used = 0;
    var dp = this.levels[level - 1].DP;
    for (var item in dp) {
      if (item in $primaries[primary]) {
        used += dp[item];
      }
    }
    return used;
  },
  
  used_mk: function() {
    var used = 0;
    $.each(this.levels, function(i, level) {
      if ('MK' in level) {
        for (var item in level.MK) {
          used += level.MK[item];
        }
      }
    });
    return used;
  },
  
  zeon: function() {
    var total = tables.base_zeon[this.characteristic('POW')];
    var data = this;
    $.each(this.levels, function(i, level) {
      var cls = $classes[level.Class];
      if ('Zeon' in level.DP) {
        total += level.DP.Zeon * 5 / data.cost('Zeon', cls);
      }
      if ('Zeon' in cls.bonuses) {
        total += cls.bonuses.Zeon;
      }
      if ('Magic Nature' in this.Advantages) {
        total += this.Advantages['Magic Nature'] * 50;
      }
    });
    return total;
  }
};

character = function() {
  this.Advantages = {};
  this.Disadvantages = {};
  this.Race = 'Human';
  this.XP = 0;
  this.levels = [{Class: 'Freelancer', DP: {}}];
  var func;
  for (func in char_funcs) {
    this[func] = char_funcs[func];
  }
};

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
