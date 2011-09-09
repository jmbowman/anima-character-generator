define(['character', 'classes', 'primaries'],
function(character, classes, primaries) {
  
  character.prototype.dp_remaining = function() {
    var level = this.level();
    var results = [];
    var result;
    var level_info;
    var new_dp = 600;
    var class_info;
    var item;
    var cost;
    var j;
    var surplus_used;
    var withdrawn;
    var primary;
    var index;
    var remaining;
    for (var i = 0; i < this.levels.length; i++) {
      result = {};
      results.push(result);
      level_info = this.levels[i];
      class_info = classes[level_info.Class];
      if (i === 0 && this.level() === 0) {
        new_dp = 400;
      }
      else if (i > 0) {
        new_dp = 100;
      }
      result.Total = new_dp;
      result.Combat = class_info.Combat * new_dp / 100;
      result.Psychic = class_info.Psychic * new_dp / 100;
      result.Supernatural = class_info.Supernatural * new_dp / 100;
      for (item in level_info.DP) {
        cost = this.cost(item, level_info.Class);
        result.Total -= cost;
        if (primaries.Combat.indexOf(item) != -1) {
          result.Combat -= level_info.DP[item] * cost;
        }
        else if (primaries.Psychic.indexOf(item) != -1) {
          result.Psychic -= level_info.DP[item] * cost;
        }
        else if (primaries.Supernatural.indexOf(item) != -1) {
          result.Supernatural -= level_info.DP[item] * cost;
        }
      }
      cost = this.class_change_dp((level === 0) ? 0 : (i + 1));
      if (cost > 0) {
        result.Total -= cost;
        result.Class_Change = cost;
      }
      var categories = Object.keys(primaries);
      categories.push('Total');
      for (index in categories) {
        primary = categories[index];
        remaining = result[primary];
        if (remaining > result.Total) {
          remaining = result.Total;
          result[primary] = remaining;
        }
        else if (remaining < 0) {
          withdrawn = 0;
          for (j = 0; j < i; j++) {
            surplus_used = results[j][primary];
            if (surplus_used > -remaining) {
              surplus_used = -remaining;
            }
            if (surplus_used > withdrawn) {
              if (primary == 'Total') {
                if ('Saved' in results[j]) {
                  results[j].Saved += surplus_used - withdrawn;
                }
                else {
                  results[j].Saved = surplus_used - withdrawn;
                }
              }
              withdrawn = surplus_used;
            }
            results[j][primary] -= surplus_used;
          }
          if (withdrawn > 0) {
            result[primary] += withdrawn;
            if (primary == 'Total') {
              result.Withdrawn = withdrawn;
            }
          }
        }
      }
      if (i > 0) {
        result.Total += results[i - 1].Total;
        result.Combat += results[i - 1].Combat;
        result.Psychic += results[i - 1].Psychic;
        result.Supernatural += results[i - 1].Supernatural;
      }
    }
    return results;
  };

  character.prototype.dp_total = function(level) {
    if (level === 0) {
      return 400;
    }
    return 500 + (level * 100);
  };
  
  return {};
});
