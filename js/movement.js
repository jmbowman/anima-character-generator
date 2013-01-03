/*global define: false */
define(['character', 'classes', 'martial_knowledge'],
function (Character, classes) {
  
    Character.prototype.initiative = function () {
        var i,
            levels = this.levels,
            length = levels.length,
            qr = this.Advantages['Quick Reflexes'],
            size,
            sr = this.Disadvantages['Slow Reactions'],
            total = this.modifier('AGI') + this.modifier('DEX');
        if (this.Type === 'Human') {
            total += 20;
        }
        else {
            size = this.size();
            if (size < 4) {
                total += 40;
            }
            else if (size < 9) {
                total += 30;
            }
            else if (size < 23) {
                total += 20;
            }
            else if (size < 25) {
                total += 10;
            }
            else if (size > 33) {
                total -= 20;
            }
            else if (size > 28) {
                total -= 10;
            }
        }
        if (qr) {
            if (qr === 1) {
                total += 25;
            }
            else if (qr === 2) {
                total += 45;
            }
            else {
                total += 60;
            }
        }
        if (sr) {
            total -= sr * 30;
        }
        for (i = 0; i < length; i++) {
            total += classes[levels[i].Class].Initiative;
        }
        if (this.has_ki_ability('Increased Speed')) {
            total += 10;
        }
        return total;
    };
  
    Character.prototype.movement_value = function () {
        var result = this.characteristic('AGI'),
            size;
        if (this.has_ki_ability('Movement of Emptiness')) {
            result = Math.max(result, this.characteristic('POW'));
        }
        if (this.Type !== 'Human') {
            size = this.size();
            if (size < 4) {
                result -= 4;
            }
            else if (size < 9) {
                result -= 2;
            }
            else if (size > 33) {
                result += 3;
            }
            else if (size > 28) {
                result += 2;
            }
            else if (size > 24) {
                result += 1;
            }
        }
        if (this.levels[0].DP['Atrophied Members'] === 'Legs') {
            result -= 6;
        }
        if (result > 10) {
            result = 10;
        }
        return result;
    };

});
