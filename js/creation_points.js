define(['jquery', 'advantages', 'character', 'classes', 'disadvantages', 'tables', 'libs/utils'], function($, advantages, character, classes, disadvantages, tables, utils) {
  
  character.prototype.add_advantage = function(name, cost, params) {
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
      var advantage = advantages[name];
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
  };
  
  character.prototype.add_disadvantage = function(name, benefit, param) {
    var disadvantage = disadvantages[name];
    if (name == 'Damned') {
      this.Disadvantages[name] = {Points: benefit, Effect: param};
    }
    else if (name == 'Powerful Enemy') {
      this.Disadvantages[name] = {Points: benefit, Name: param};
    }
    else if ($.isArray(disadvantage.Benefit)) {
      this.Disadvantages[name] = benefit;
    }
    else if ('Options' in disadvantage) {
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
  };
  
  character.prototype.advantage_allowed = function(name, parameter) {
    var advantage = advantages[name];
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
  };
  
  character.prototype.advantage_cost = function(name) {
    var params = this.Advantages[name];
    if ($.isPlainObject(params) && 'Points' in params) {
      return params.Points;
    }
    else if ($.isArray(params)) {
      return advantages[name].Cost * params.length;
    }
    else if (!isNaN(parseInt(params, 10))) {
      return parseInt(params, 10);
    }
    else {
      return advantages[name].Cost;
    }
  };
  
  character.prototype.advantage_summary = function(name) {
    var result = name;
    var advantage = advantages[name];
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
  };
  
  character.prototype.cp_remaining = function(category) {
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
        var disadvantage = disadvantages[name];
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
        var advantage = advantages[name];
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
  };
  
  character.prototype.cp_total = function() {
    var total = 3;
    for (var name in this.Disadvantages) {
      total += this.disadvantage_benefit(name);
    }
    return total;
  };
  
  character.prototype.disadvantage_allowed = function(name, parameter) {
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
      if (utils.intersection(types, classes[this.levels[0].Class].Archetypes) < 1) {
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
    var disadvantage = disadvantages[name];
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
      if (['Atrophied Limb', 'Blind', 'Deafness', 'Mute', 'Nearsighted', 'Physical Weakness', 'Serious Illness', 'Sickly', 'Susceptible to Poisons'].indexOf(name) != -1) {
        return false;
      }
    }
    else if (this.Race == 'Sylvain Nephilim') {
      if (['Sickly', 'Serious Illness', 'Susceptible to Magic'].indexOf(name) != -1) {
        return false;
      }
    }
    return true;
  };
  
  character.prototype.disadvantage_benefit = function(name) {
    var params = this.Disadvantages[name];
    if ($.isPlainObject(params) && 'Points' in params) {
      return params.Points;
    }
    else if (!isNaN(parseInt(params, 10))) {
      return parseInt(params, 10);
    }
    else {
      return disadvantages[name].Benefit;
    }
  };
  
  character.prototype.disadvantage_summary = function(name) {
    var result = name;
    var disadvantage = disadvantages[name];
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
  };
  
  return {};
});
