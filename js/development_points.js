/*global define: false */
define(['jquery', 'character', 'classes', 'primaries'],
       function ($, Character, classes, primaries) {
  
    Character.prototype.dp_remaining = function () {
        var attack,
            categories = Object.keys(primaries),
            class_info,
            class_name,
            cost,
            costs = {Attack: 2, Block: 2, Dodge: 2},
            count,
            defense,
            i,
            item,
            j,
            level = this.level(),
            levels = this.levels,
            level_count = levels.length,
            level_dp,
            level_info,
            new_dp = 600,
            pinch_points,
            primary,
            quarter,
            remaining,
            result,
            results = [],
            saved = {Combat: 0, Psychic: 0, Supernatural: 0, Other: 0},
            scores = {Attack: 0, Block: 0, Dodge: 0},
            spent,
            totals = {Attack: 0, Block: 0, Dodge: 0, DP: 0,
                      'Magic Projection': 0, Psychic: 0,
                      'Psychic Projection': 0, Supernatural: 0};
        for (i = 0; i < level_count; i++) {
            results.push({});
            result = results[i];
            level_info = levels[i];
            class_name = level_info.Class;
            class_info = classes[class_name];
            if (i === 0 && level === 0) {
                new_dp = 400;
            }
            else if (i > 0) {
                new_dp = 100;
            }
            totals.DP += new_dp;
            totals.Psychic += class_info.Psychic * new_dp / 100;
            totals.Supernatural += class_info.Supernatural * new_dp / 100;
            result.Total = new_dp + saved.Combat + saved.Psychic + saved.Supernatural + saved.Other;
            result.Combat = class_info.Combat * new_dp / 100;
            result.Psychic = class_info.Psychic * new_dp / 100;
            result.Supernatural = class_info.Supernatural * new_dp / 100;
            result.Other = new_dp + saved.Other;
            result['Magic Projection'] = (totals.Supernatural / 2) - totals['Magic Projection'];
            result['Psychic Projection'] = (totals.Psychic / 2) - totals['Psychic Projection'];
            level_dp = level_info.DP;
            for (item in level_dp) {
                if (level_dp.hasOwnProperty(item)) {
                    cost = this.cost(item, class_name);
                    spent = level_dp[item] * cost;
                    result.Total -= spent;
                    primary = primaries.for_ability(item);
                    result[primary] -= spent;
                    if (item.indexOf('Save ') === 0) {
                        saved[primary] += spent;
                    }
                    if (item in result) {
                        result[item] -= spent;
                    }
                    if (item in scores) {
                        costs[item] = cost;
                        scores[item] += level_dp[item];
                    }
                    if (item in totals) {
                        totals[item] += spent;
                    }
                }
            }
            // Figure out theoretical attack and defense caps, Combat cap imposed later
            attack = scores.Attack;
            j = totals.Attack + totals.Block + totals.Dodge;
            defense = Math.max(scores.Block, scores.Dodge);
            count = totals.DP / 2 - j;
            quarter = totals.DP / 4;
            result.Attack = Math.min(count, Math.max((defense + 50 - attack) * costs.Attack, quarter - totals.Attack));
            result.Block = Math.min(count, Math.max((attack + 50 - scores.Block) * costs.Block, quarter - totals.Block));
            result.Dodge = Math.min(count, Math.max((attack + 50 - scores.Dodge) * costs.Dodge, quarter - totals.Dodge));
            cost = this.class_change_dp((level === 0) ? 0 : (i + 1));
            if (cost > 0) {
                result.Other -= cost;
                result.Total -= cost;
                result.Class_Change = cost;
            }
            count = categories.length;
            for (j = 0; j < count; j++) {
                primary = categories[j];
                remaining = result[primary];
                if (remaining < 0) {
                    // used some of the saved DP
                    if (!('Withdrawn' in result)) {
                        result.Withdrawn = 0;
                    }
                    result.Withdrawn -= remaining;
                    saved[primary] += remaining;
                    result[primary] = 0;
                }
                // now add in the remaining saved amount
                result[primary] += saved[primary];
                if (result[primary] > result.Total) {
                    // Ran out of total DP before exhausting this primary
                    result[primary] = result.Total;
                }
            }
        }
        pinch_points = {Attack: result.Attack, Block: result.Block,
                        Dodge: result.Dodge,
                        'Magic Projection': result['Magic Projection'],
                        'Psychic Projection': result['Psychic Projection']};
        for (i = level_count - 1; i >= 0; i--) {
            result = results[i];
            for (item in pinch_points) {
                if (pinch_points.hasOwnProperty(item)) {
                    // may be limited by amounts spent later
                    j = Math.min(result[item], pinch_points[item]);
                    pinch_points[item] = j;
                    primary = primaries.for_ability(item);
                    // after determining pinch amount, limit by current cap
                    result[item] = Math.min(j, result[primary]);
                }
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
