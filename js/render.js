/*global define: false */
define(['jquery', 'abilities', 'characters', 'dialogs', 'tables',
'creation_points', 'development_points'],
function ($, abilities, characters, dialogs, tables) {
    
    var load_value,
        next_step,
        render = {},
        update_int,
        update_text;
    
    load_value = function (name) {
        $('#' + name).val('' + characters.current()[name]);
    };
  
    next_step = function () {
        var characteristic,
            characteristics = tables.characteristics,
            count = characteristics.length,
            data = characters.current(),
            i,
            level,
            level_data,
            levels,
            result = false;
        for (i = 0; i < count; i++) {
            characteristic = characteristics[i];
            if (!(characteristic in data)) {
                return 'Roll ' + characteristic;
            }
        }
        if (!('Appearance' in data)) {
            return 'Roll or select Appearance';
        }
        if (!data.Gender) {
            return 'Select a gender';
        }
        if (!data.Race) {
            return 'Select a race';
        }
        if (data.cp_remaining() > 0) {
            return 'Select advantages and disadvantages';
        }
        level = data.level();
        levels = data.levels;
        count = levels.length;
        if ((level === 0 && count > 1) || (level > 0 && level !== count)) {
            return 'Update levels list';
        }
        for (i = 0; i < count; i++) {
            level_data = levels[i];
            if ((i + 1) % 2 === 0 && !('Characteristic' in level_data)) {
                return 'Select characteristic bonus for level ' + (i + 1);
            }
            if (level > 0 && !('Natural Bonus' in level_data)) {
                return 'Select natural bonus for level ' + (i + 1);
            }
        }
        if (!('Name' in data)) {
            return 'Choose a name';
        }
        return 'Done!';
    };

    update_int = function (name) {
        var input = $('#' + name);
        if (input.valid()) {
            characters.current()[name] = parseInt(input.val(), 10);
        }
    };

    update_text = function (name) {
        var field = $('#' + name);
        if (field.valid()) {
            characters.current()[name] = field.val();
        }
    };

    render.render = function (root) {
        var data = characters.current(),
            abilities = data.racial_abilities();
        $('.next_step', root).text(next_step());
        $('.summary', root).text(data.summary());
        $('.lp', root).text(data.life_points());
        $('.fatigue', root).text(data.fatigue());
        $('.STR', root).text(data.characteristic('STR'));
        $('.DEX', root).text(data.characteristic('DEX'));
        $('.AGI', root).text(data.characteristic('AGI'));
        $('.CON', root).text(data.characteristic('CON'));
        $('.INT', root).text(data.characteristic('INT'));
        $('.POW', root).text(data.characteristic('POW'));
        $('.WP', root).text(data.characteristic('WP'));
        $('.PER', root).text(data.characteristic('PER'));
        $('.Appearance', root).text(data.appearance());
        $('.MV', root).text(data.movement_value());
        $('.Regeneration', root).text(data.regeneration());
        $('.PhR', root).text(data.resistance('PhR'));
        $('.MR', root).text(data.resistance('MR'));
        $('.PsR', root).text(data.resistance('PsR'));
        $('.VR', root).text(data.resistance('VR'));
        $('.DR', root).text(data.resistance('DR'));
        $('.Initiative', root).text(data.initiative());
        if (abilities) {
            $('.Racial-Abilities').text(abilities);
            $('.racial-row').show();
        }
        else {
            $('.racial-row').hide();
        }
    };

    render.update_cp = function () {
        var categories = ['Common', 'Background', 'Magic', 'Psychic'],
            categories_added = 0,
            category,
            content = '',
            count = categories.length,
            data = characters.current(),
            i,
            myAdvantages = data.Advantages,
            myDisadvantages = data.Disadvantages,
            name,
            remaining = '',
            subtotal,
            total = data.cp_total();
        for (i = 0; i < count; i++) {
            category = categories[i];
            subtotal = data.cp_remaining(category);
            if (subtotal === 0) {
                continue;
            }
            if (categories_added > 0) {
                remaining += ', ';
            }
            remaining += subtotal + ' ' + category;
            categories_added++;
        }
        if (!remaining) {
            remaining = '0';
        }
        $('#cp_remaining').text(remaining);
        $('#cp_total').text(total);
        if (remaining !== '0') {
            $('#add_advantage').show();
        }
        else {
            $('#add_advantage').hide();
        }
        i = 0;
        for (name in myAdvantages) {
            if (myAdvantages.hasOwnProperty(name)) {
                if (i > 0) {
                    content += ', ';
                }
                content += '<a href="#" data-name="' + name + '">' + data.advantage_summary(name) + '</a>';
                i++;
            }
        }
        $('#Advantages').html(content);
        if (Object.keys(myDisadvantages).length < 3) {
            $('#add_disadvantage').show();
        }
        else {
            $('#add_disadvantage').hide();
        }
        content = '';
        i = 0;
        for (name in myDisadvantages) {
            if (myDisadvantages.hasOwnProperty(name)) {
                if (i > 0) {
                    content += ', ';
                }
                content += '<a href="#" data-name="' + name + '">' + data.disadvantage_summary(name) + '</a>';
                i++;
            }
        }
        $('#Disadvantages').html(content);
        render.render($('.container'));
    };
  
    $('#Advantages a').live('click', dialogs.delete_advantage);
    $('#Disadvantages a').live('click', dialogs.delete_disadvantage);
    
    render.load_data = function () {
        load_value('STR');
        load_value('DEX');
        load_value('AGI');
        load_value('CON');
        load_value('INT');
        load_value('POW');
        load_value('WP');
        load_value('PER');
        load_value('Appearance');
        load_value('Gender');
        load_value('Race');
        load_value('XP');
        load_value('Name');
        $('#first_class').val(characters.current().levels[0].Class);
        render.update_cp();
        render.update_level();
    };

    render.update_display = function () {
        var after_class,
            data = characters.current(),
            first_class = $('#first_class').val();
        update_int('STR');
        update_int('DEX');
        update_int('AGI');
        update_int('CON');
        update_int('INT');
        update_int('POW');
        update_int('WP');
        update_int('PER');
        update_int('Appearance');
        update_text('Gender');
        update_text('Race');
        update_int('XP');
        if (first_class) {
            data.change_class(data.XP < 0 ? 0 : 1, first_class);
        }
        update_text('Name');
        render.render($('.container'));
        after_class = $('#after_class');
        if (after_class.filter(':visible').length === 0) {
            if ($('#Race').val() && $('#first_class').val()) {
                render.update_cp();
                $('#after_class').show();
            }
        }
    };

    render.update_level = function () {
        var content,
            data = characters.current(),
            current_level = data.level(),
            dp,
            hr,
            i,
            level,
            levels = data.levels,
            level_count = levels.length,
            level_number,
            line,
            name,
            nb,
            parts,
            remaining,
            remaining_for_level;
        update_int('XP');
        // remove any extra levels if revising XP down
        while (level_count > current_level && level_count > 1) {
            levels.pop();
            level_count--;
        }
        // add new levels, continuing last class
        while (level_count < current_level) {
            levels.push({Class: levels[level_count - 1].Class, DP: {}});
            level_count++;
        }
        render.update_display();
        $('.level').remove();
        remaining = data.dp_remaining();
        for (i = 0; i < level_count; i++) {
            level = levels[i];
            remaining_for_level = remaining[i];
            if (i > 0) {
                hr = $('<hr />').addClass('span-13 last level');
                $('.levels').append(hr);
            }
            level_number = current_level === 0 ? 0 : i + 1;
            content = 'Level ' + level_number + ' (';
            if (data.class_change_possible(level_number) && i > 0) {
                content += '<a href="#" class="edit_class" data-level="' + level_number + '">' + level.Class + '</a>):';
            }
            else {
                content += level.Class + '):';
            }
            if ((i + 1) % 2 === 0) {
                content += ' <a href="#" class="characteristic_bonus" data-level="' + level_number + '">' + (('Characteristic' in level) ? level.Characteristic + ' +1' : 'Select characteristic bonus') + '</a>';
            }
            else if ('Characteristic' in level) {
                // manual JSON editing error?
                delete level.Characteristic;
            }
            if (level_number > 0 && !('Without any Natural Bonus' in data.Disadvantages)) {
                nb = ('Natural Bonus' in level) ? level['Natural Bonus'] : null;
                content += ' <a href="#" class="natural_bonus" data-level="' + level_number + '">' + (nb ? nb + ' +' + data.modifier(abilities[nb].Characteristic, level_number) : 'Select natural bonus') + '</a>';
            }
            line = $('<div>').addClass('span-13 last level').html(content);
            $('.levels').append(line);
            if (remaining_for_level.Total > 0) {
                content = remaining_for_level.Total + ' DP remaining (Limits: ' + remaining_for_level.Combat + ' Combat, ' + remaining_for_level.Psychic + ' Psychic, ' + remaining_for_level.Supernatural + ' Supernatural)';
                line = $('<div>').addClass('span-13 last level').html(content);
                $('.levels').append(line);
            }
            $('.levels').append('<div class="span-1 level"><strong>DP</strong></div>');
            parts = [];
            dp = level.DP;
            for (name in dp) {
                if (dp.hasOwnProperty(name)) {
                    parts.push(name + ' (' + dp[name] + ')');
                }
            }
            if ('Class_Change' in remaining_for_level) {
                parts.push('Class change (' + remaining_for_level.Class_Change + ')');
            }
            content = parts.join(', ');
            if ('Withdrawn' in remaining_for_level) {
                content += ' (used ' + remaining_for_level.Withdrawn + ' DP saved earlier)';
            }
            if (remaining_for_level.Total > 0) {
                content += ' <a href="#" class="spend_dp" data-level="' + level_number + '">+</a>';
            }
            line = '<div class="span-12 last level">' + content + '</div>';
            $('.levels').append(line);
        }
    };
  
    $('a.edit_class').live('click', dialogs.edit_class);
    $('a.characteristic_bonus').live('click', dialogs.edit_characteristic_bonus);
    $('a.natural_bonus').live('click', dialogs.edit_natural_bonus);
    $('a.spend_dp').live('click', dialogs.spend_dp);
  
    return render;
});
