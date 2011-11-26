/*global define: false */
define(['jquery', 'character', 'classes', 'primaries'],
       function ($, Character, classes, primaries) {
  
    Character.prototype.dp_remaining = function () {
        var categories = Object.keys(primaries),
            class_info,
            class_name,
            cost,
            i,
            index,
            item,
            j,
            level = this.level(),
            levels = this.levels,
            level_count = levels.length,
            level_dp,
            level_info,
            new_dp = 600,
            primary,
            remaining,
            result,
            results = [],
            surplus_used,
            withdrawn;
        categories.push('Total');
        for (i = 0; i < level_count; i++) {
            result = {};
            results.push(result);
            level_info = levels[i];
            class_name = level_info.Class;
            class_info = classes[class_name];
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
            level_dp = level_info.DP;
            for (item in level_dp) {
                if (level_dp.hasOwnProperty(item)) {
                    cost = this.cost(item, class_name);
                    result.Total -= cost;
                    if ($.inArray(item, primaries.Combat) !== -1) {
                        result.Combat -= level_dp[item] * cost;
                    }
                    else if ($.inArray(item, primaries.Psychic) !== -1) {
                        result.Psychic -= level_dp[item] * cost;
                    }
                    else if ($.inArray(item, primaries.Supernatural) !== -1) {
                        result.Supernatural -= level_dp[item] * cost;
                    }
                }
            }
            cost = this.class_change_dp((level === 0) ? 0 : (i + 1));
            if (cost > 0) {
                result.Total -= cost;
                result.Class_Change = cost;
            }
            for (index in categories) {
                if (categories.hasOwnProperty(index)) {
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
                                if (primary === 'Total') {
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
                            if (primary === 'Total') {
                                result.Withdrawn = withdrawn;
                            }
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

    Character.prototype.dp_total = function (level) {
        if (level === 0) {
            return 400;
        }
        return 500 + (level * 100);
    };
  
    return {};
});
