/*global define: false */
define(['jquery', 'abilities', 'characters', 'essential_abilities',
'ki_abilities', 'modules', 'primaries', 'tables', 'armor', 'creation_points',
'development_points', 'martial_knowledge', 'movement', 'resistances'],
function ($, abilities, characters, essential_abilities, ki_abilities,
          modules, primaries, tables) {
    
    var load_value,
        next_step,
        render = {},
        set_characteristics_limits,
        update_int,
        update_text;
    
    load_value = function (name) {
        // summary:
        //         Set the value of an input field to match the corresponding
        //         property of the current Character object. Used when loading
        //         or switching characters.
        // name: String
        //         The name of the property (which is also the ID of the
        //         corresponding input field)
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
            levels;
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
    
    set_characteristics_limits = function (data, type) {
        // summary:
        //         Set appropriate limits on physical or spiritual
        //         characteristics for creatures.
        // data: Character
        //         The character data object being edited
        // type: String
        //         'Physical' or 'Spiritual'
        var first_level_dp = data.levels[0].DP,
            limit = 10;
        if (('Superhuman ' + type + ' Characteristics') in first_level_dp) {
            limit = 13;
        }
        else if (('Supernatural ' + type + ' Characteristics') in first_level_dp) {
            limit = 15;
        }
        else if (('Divine ' + type + ' Characteristics') in first_level_dp) {
            limit = 20;
        }
        $('#characteristics .' + type.toLowerCase()).spinner('option', 'max', limit);
    };

    update_int = function (name) {
        // summary:
        //         Update an integer property of the current Character object
        //         using the current value of the corresponding input field.
        // name: String
        //         The name of the property (which is also the ID of the
        //         corresponding input field)
        var input = $('#' + name),
            value;
        if (input.valid()) {
            value = parseInt(input.val(), 10);
            characters.current()[name] = value;
            input.nextAll('span.display').text(value);
        }
    };

    update_text = function (name) {
        // summary:
        //         Update a text property of the current Character object
        //         using the current value of the corresponding input field.
        // name: String
        //         The name of the property (which is also the ID of the
        //         corresponding input field)
        var field = $('#' + name);
        if (field.valid()) {
            characters.current()[name] = field.val();
        }
    };

    render.render = function (root) {
        // summary:
        //         Refresh the character's statistics display block.
        // root: Node
        //         The root DOM node for the stat block
        var abilities_block,
            ability,
            ability_list,
            count,
            data = characters.current(),
            element = data.Element,
            first_level_dp = data.levels[0].DP,
            acute = first_level_dp['Acute Sense'],
            i,
            keys,
            modifiers = data.resistance_modifiers(),
            name,
            primary,
            score,
            text,
            total_mk = data.mk_totals(),
            remaining_mk = data.mk_remaining();
        $('.resistance_bonuses', root).hide();
        $('.summary', root).text(data.summary());
        $('.Gnosis', root).text(data.type_and_gnosis());
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
        $('.Size', root).text(data.size());
        $('.MV', root).text(data.movement_value());
        $('.Regeneration', root).text(data.regeneration());
        $('.PhR', root).text(data.resistance('PhR'));
        $('.MR', root).text(data.resistance('MR'));
        $('.PsR', root).text(data.resistance('PsR'));
        $('.VR', root).text(data.resistance('VR'));
        $('.DR', root).text(data.resistance('DR'));
        keys = Object.keys(modifiers);
        count = keys.length;
        if (count > 0) {
            text = '(';
            for (i = 0; i < count; i++) {
                if (i > 0) {
                    text += ', ';
                }
                name = keys[i];
                score = modifiers[name];
                if (score > 0) {
                    text += '+';
                }
                text += score + ' ' + name;
            }
            text += ')';
            $('.resistance_modifiers', root).show().text(text);
        }
        else {
            $('.resistance_modifiers', root).hide();
        }
        $('.Initiative', root).text(data.initiative());
        score = data.damage_barrier();
        if (score > 0) {
            $('.Damage_Barrier', root).text(score).parent().show();
        }
        else {
            $('.Damage_Barrier', root).parent().hide();
        }
        score = data.base_damage_reduction();
        if (score !== 0) {
            $('.Base_Damage_reduction', root).text(score).parent().show();
        }
        else {
            $('.Base_Damage_reduction', root).parent().hide();
        }
        i = total_mk.length - 1;
        $('.MK', root).text(total_mk[i]);
        $('.unallocated_mk').text(remaining_mk[i]);
        $('.magic', root).toggle(data.has_gift());
        score = data.ma();
        if (element) {
            $('.MA', root).text(score + ' (' + (score + 20) + ' ' + element + ', ' + (score - 20) + ' ' + tables.opposite_elements[element] + ')');
        }
        else {
            $('.MA', root).text(score);
        }
        $('.Zeon', root).text(data.zeon());
        $('.Magic_Level', root).text(data.magic_level());
        text = data.racial_abilities();
        if (text) {
            $('.Racial-Abilities').text(text);
            $('.racial-row').show();
        }
        else {
            $('.racial-row').hide();
        }
        abilities_block = $('.abilities-block', root);
        abilities_block.html('');
        for (primary in primaries) {
            if (primaries.hasOwnProperty(primary)) {
                ability_list = primaries[primary];
                count = ability_list.length;
                for (i = 0; i < count; i++) {
                    name = ability_list[i];
                    if (!(name in abilities)) {
                        continue;
                    }
                    ability = abilities[name];
                    score = data.ability(name);
                    if (score > data.modifier(ability.Characteristic)) {
                        abilities_block.append(name + ': ' + score);
                        if (acute && ability.Characteristic === 'PER') {
                            abilities_block.append(' (' + (score + 30) + ' ' + acute + ')');
                        }
                        abilities_block.append('<br />');
                    }
                }
            }
        }
        if (data.has_ki_ability('Ki Concealment')) {
            abilities_block.append('Ki Concealment: ' + data.ki_concealment() + '<br />');
        }
        if (data.has_ki_ability('Ki Detection')) {
            abilities_block.append('Ki Detection: ' + data.ki_detection() + '<br />');
        }
    };

    render.update_cp = function (read_only) {
        // summary:
        //         Update the section of the page where the character's
        //         advantages and disadvantages are chosen.
        // read_only: Boolean
        //         True if the display of advantages and disadvantages should
        //         be read-only (because we've moved on to choosing abilities)
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
            summary,
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
            if (!read_only) {
                $('#choose_abilities').removeAttr('disabled');
            }
        }
        $('#cp_remaining').text(remaining);
        $('#cp_total').text(total);
        if (remaining !== '0' && !read_only) {
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
                summary = data.advantage_summary(name);
                if (read_only) {
                    content += summary;
                }
                else {
                    content += '<a href="#" data-name="' + name + '">' + summary + '</a>';
                }
                i++;
            }
        }
        $('#Advantages').html(content);
        if (Object.keys(myDisadvantages).length < 3 && !read_only) {
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
                summary = data.disadvantage_summary(name);
                if (read_only) {
                    content += summary;
                }
                else {
                    content += '<a href="#" data-name="' + name + '">' + summary + '</a>';
                }
                i++;
            }
        }
        $('#Disadvantages').html(content);
        render.render($('.container'));
    };

    render.update_essential_abilities = function (read_only) {
        // summary:
        //         Update the section of the page where the creature's
        //         essential abilities are chosen.
        // read_only: Boolean
        //         True if the display of essential abilities should
        //         be read-only (because we've moved on to choosing powers)
        var advantages = essential_abilities.advantages,
            a_content = '',
            d_content = '',
            data = characters.current(),
            disadvantage,
            disadvantages = essential_abilities.disadvantages,
            first_level_dp = data.levels[0].DP,
            a = 0,
            d = 0,
            name,
            remaining = data.creature_dp_remaining(),
            summary,
            total = data.creature_dp_total();
        $('#dp_left_for_ea').text(remaining);
        $('#dp_total_for_ea').text(total);
        if (remaining > 0 && !read_only) {
            $('#add_ea_advantage').show();
        }
        else {
            $('#add_ea_advantage').hide();
        }
        for (name in first_level_dp) {
            if (first_level_dp.hasOwnProperty(name)) {
                if (name in advantages) {
                    if (a > 0) {
                        a_content += ', ';
                    }
                    summary = data.ea_advantage_summary(name);
                    if (read_only) {
                        a_content += summary;
                    }
                    else {
                        a_content += '<a href="#" data-name="' + name + '">' + summary + '</a>';
                    }
                    a++;
                }
                else if (name in disadvantages) {
                    if (d > 0) {
                        d_content += ', ';
                    }
                    summary = data.ea_disadvantage_summary(name);
                    disadvantage = disadvantages[name];
                    if (read_only || remaining < -disadvantage.DP) {
                        d_content += summary;
                    }
                    else {
                        d_content += '<a href="#" data-name="' + name + '">' + summary + '</a>';
                    }
                    d++;
                }
            }
        }
        $('#ea_advantages').html(a_content);
        $('#ea_disadvantages').html(d_content);
        $('#add_ea_disadvantage').toggle(!read_only);
        render.render($('.container'));
    };
    
    render.load_data = function () {
        // summary:
        //         Update the character data entry area based on the current
        //         character data.  Used when loading or switching characters.
        var data = characters.current(),
            first_class = data.levels[0].Class,
            stage = data.creation_stage();
        $('input.characteristic, #Appearance, #XP').show().next('span').show().nextAll('span.display').hide();
        $('#Physical, #Spiritual, #Gender, #Race, #first_class').show().nextAll('span.display').hide();
        $('#add_xp').hide();
        $('#proceed').show();
        $('#choose_essential_abilities').show();
        $('#choose_characteristics').show();
        $('#choose_advantages').show().attr('disabled', 'disabled');
        $('#choose_abilities').show().attr('disabled', 'disabled');
        $('#characteristics').hide();
        $('#advantages').hide();
        $('#levels').hide();
        $('.level').remove();
        load_value('Type');
        if (stage > 1) {
            if (data.Type !== 'Human') {
                render.start_attributes();
                $('#Created').val(data.Created ? 'Yes': 'No');
                load_value('Element');
                load_value('Gnosis');
                $('#creature_class').val(first_class);
                $('#creature_level').val(data['Racial Level']);
                if (stage > 2) {
                    render.start_essential_abilities();
                }
            }
            if (stage > 3) {
                render.start_characteristics();
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
                $('#first_class').val(first_class);
                render.update_basics();
                if (stage > 4) {
                    render.start_advantages();
                    if (stage > 5) {
                        render.start_abilities();
                    }
                }
            }
        }
    };

    render.update_basics = function () {
        // summary:
        //         Update the basic data for the current character using the
        //         values currently in the appropriate input fields and refresh
        //         the stat block.
        var data = characters.current(),
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
        if ($('#main_form').valid()) {
            $('#choose_advantages').removeAttr('disabled');
        }
    };
    
    render.update_name = function () {
        update_text('Name');
        $('.container .summary').text(characters.current().summary());
    };
    
    render.start_attributes = function () {
        // summary:
        //         Conclude specification of creature type and start entering
        //         Gnosis, optional elemental type, and creature origin.
        var data = characters.current(),
            select = $('#Type'),
            type = select.val();
        data.Type = type;
        data.Race = 'Other';
        select.hide().nextAll('span.display').text(type).show();
        $('#proceed').hide();
        if (type === 'Human') {
            select.nextAll('span.display').text('Human or Nephilim');
            return render.start_characteristics();
        }
        $('#attributes').show();
        $('#choose_essential_abilities').show();
        $('#Created, #creature_class').show().nextAll('span.display').hide();
        if (data.element_allowed()) {
            $('#Element_label').show();
            $('#Element').show().nextAll('span.display').hide();
        }
        else {
            $('#Element_label').hide();
            $('#Element').hide().nextAll('span.display').hide();
        }
        if (!$('#Gnosis').find('.ui-spinner').length) {
            $('#Gnosis').spinner({min: 0, max: 50, step: 5});
            $('#creature_level').spinner({min: 0, max: 16});
        }
        else {
            $('#Gnosis, #creature_level').show().next('span').show().nextAll('span.display').hide();
        }
        if (type !== 'Human' && type !== 'Natural') {
            $('#Gnosis').spinner('option', 'min', 10);
        }
        // Reset fields to default values
        $('#Created').val('No');
        $('#Element').val('None');
        $('#Gnosis').val(10);
        render.render($('.container'));
    };
    
    render.start_essential_abilities = function () {
        // summary:
        //         Conclude specification of creature attributes and start
        //         choosing essential abilites.
        var data = characters.current(),
            select = $('#Created'),
            value = select.val(),
            xp;
        data.Created = (value === 'Yes');
        select.hide().nextAll('span.display').text(value).show();
        select = $('#Damage_Resistance');
        value = select.val();
        if (value === 'Yes') {
            data['Damage Resistance'] = true;
        }
        select.hide().nextAll('span.display').text(value).show();
        if (data.element_allowed()) {
            update_text('Element');
            select = $('#Element');
            value = select.val();
            if (!value) {
                value = 'None';
            }
            select.hide().nextAll('span.display').text(value).show();
        }
        update_int('Gnosis');
        $('#Gnosis').hide().next('span').hide().nextAll('span.display').show();
        select = $('#creature_class');
        value = select.val();
        $('#first_class').val(value);
        select.hide().nextAll('span.display').text(value).show();
        select = $('#creature_level');
        value = parseInt(select.val(), 10);
        data['Racial Level'] = value;
        xp = value === 0 ? -100 : tables.xp_chart[value - 1];
        if (xp > data.XP) {
            data.XP = xp;
        }
        select.hide().next('span').hide().nextAll('span.display').text(value).show();
        $('#choose_essential_abilities').hide();
        render.update_essential_abilities();
        $('#essential_abilities, #ea_dp, #choose_characteristics').show();
        render.render($('.container'));
    };
    
    render.start_characteristics = function () {
        // summary:
        //         Conclude specification of limits on characteristics and
        //         start entering the actual values.
        var data = characters.current(),
            racial_level,
            xp;
        $('#characteristics').show();
        $('#ea_dp, #choose_characteristics').hide();
        $('#choose_advantages').text(data.Type === 'Human' ? 'Choose Advantages' : 'Choose Abilities').show();
        $('#add_xp').hide();
        if (!$('#characteristics').find('.ui-spinner').length) {
            $('#characteristics .characteristic').spinner({min: 1, max: 10});
            $('#Appearance').spinner({min: 1, max: 10});
            $('.characteristic, #Appearance, #XP').change(render.update_basics);
            $('#XP').spinner({min: -100, max: 9999});
            $('input.characteristic, #Appearance, #Gender, #Race, #first_class, #XP').nextAll('span.display').hide();
            $('#main_form').validate();
            $('#Gender, #Race, #first_class').change(function () { $(this).blur(); render.update_basics(); });
            $('#Name').change(render.update_name);
        }
        else {
            $('input.characteristic, #Appearance, #XP').show().next('span').show().nextAll('span.display').hide();
            $('#Gender, #Race, #first_class').show().nextAll('span.display').hide();
        }
        set_characteristics_limits(data, 'Physical');
        set_characteristics_limits(data, 'Spiritual');
        // Reset fields to default values
        $('.characteristic, #Appearance').val(5);
        $('#XP').val(0);
        $('#Gender, #Race, #Name').val('');
        if (data.Type !== 'Human') {
            $('#Race').val('Other');
            racial_level = data['Racial Level'];
            if (racial_level === 0) {
                xp = -100;
            }
            else {
                xp = tables.xp_chart[racial_level - 1];
            }
            $('#XP').spinner('option', 'min', xp).val(xp);
            render.update_essential_abilities(true);
        }
        $('#race_and_class').toggle(data.Type === 'Human');
    };
    
    render.start_advantages = function () {
        // summary:
        //         Conclude entry of basic statistics and start choosing
        //         advantages and disadvantages.
        render.update_basics();
        if ($('#main_form').valid()) {
            $('#Gender, #Race, #first_class').each(function () {
                var select = $(this),
                    value = select.val();
                select.hide().nextAll('span.display').text(value).show();
            });
            $('input.characteristic, #Appearance, #XP').hide().next('span').hide().nextAll('span.display').show();
            if (characters.current().Type !== 'Human') {
                return render.start_abilities();
            }
            render.update_cp();
            $('#advantages').show();
            $('#choose_advantages').hide();
        }
    };
    
    render.start_abilities = function () {
        // summary:
        //         Conclude selection of advantages and disadvantages, and start
        //         choosing abilities acquired at each level.
        render.update_cp(true);
        $('#choose_advantages, #choose_abilities').hide();
        $('#levels').show();
        render.update_level();
        $('#add_xp').show();
    };

    render.update_level = function () {
        // summary:
        //         Update the per-level character data entry area based on the
        //         current character data.
        var amount,
            available,
            content,
            data = characters.current(),
            current_level = data.level(),
            dp,
            ea_advantages = essential_abilities.advantages,
            ea_disadvantages = essential_abilities.disadvantages,
            hr,
            i,
            imk,
            level,
            levels,
            level_count,
            level_number,
            line,
            mk,
            name,
            nb,
            parts,
            primary,
            remaining_dp,
            remaining_dp_for_level,
            times_five = ['Magic Level', 'Martial Knowledge', 'Zeon'],
            remaining_mk;
        update_int('XP');
        data.update_level();
        remaining_mk = data.mk_remaining();
        if ('Insufficient Martial Knowledge' in data) {
            imk = data['Insufficient Martial Knowledge'].Name;
        }
        levels = data.levels;
        level_count = levels.length;
        $('.level').remove();
        remaining_dp = data.dp_remaining();
        for (i = 0; i < level_count; i++) {
            level = levels[i];
            remaining_dp_for_level = remaining_dp[i];
            if (i > 0) {
                hr = $('<hr />').addClass('span-13 last level');
                $('#levels').append(hr);
            }
            level_number = current_level === 0 ? 0 : i + 1;
            content = 'Level ' + level_number + ' (';
            if (data.class_change_possible(level_number)) {
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
            $('#levels').append(line);
            if (remaining_dp_for_level.Total > 0) {
                content = remaining_dp_for_level.Total + ' DP remaining (Limits: ' + remaining_dp_for_level.Combat + ' Combat, ' + remaining_dp_for_level.Psychic + ' Psychic, ' + remaining_dp_for_level.Supernatural + ' Supernatural';
                if (data.Type !== 'Human') {
                    content += ', ' + remaining_dp_for_level.Powers + ' Powers';
                }
                content += ')';
                line = $('<div>').addClass('span-13 last level').html(content);
                $('#levels').append(line);
            }
            $('#levels').append('<div class="span-1 level"><strong>DP</strong></div>');
            parts = [];
            dp = level.DP;
            for (name in dp) {
                if (dp.hasOwnProperty(name)) {
                    primary = primaries.for_ability(name);
                    if (name.indexOf('Save ') === 0) {
                        line = dp[name] + ' ' + primary + ' DP saved for later <span class="name" style="display: none;">' + name + '</span>';
                    }
                    else if (name in modules) {
                        line = '<span class="name">' + name + '</span>';
                        if (modules[name].Option_Title) {
                            line += ' (' + dp[name].join(', ') + ')';
                        }
                    }
                    else {
                        amount = dp[name];
                        if ($.inArray(name, times_five) >= 0) {
                            amount *= 5;
                        }
                        line = '<span class="name">' + name + '</span> (+' + amount + ')';
                    }
                    if (name in remaining_dp_for_level) {
                        available = remaining_dp_for_level[name];
                    }
                    else {
                        available = remaining_dp_for_level[primary];
                    }
                    if (name in ea_advantages || name in ea_disadvantages) {
                        continue;
                    }
                    else {
                        parts.push('<a href="#" class="ability" data-available="' + available + '" data-level="' + level_number + '">' + line + '</a>');
                    }
                }
            }
            if ('Class_Change' in remaining_dp_for_level) {
                parts.push('Class change (' + remaining_dp_for_level.Class_Change + ')');
            }
            content = parts.join(', ');
            if ('Withdrawn' in remaining_dp_for_level) {
                content += ' [used ' + remaining_dp_for_level.Withdrawn + ' DP saved earlier]';
            }
            if (remaining_dp_for_level.Total > 0) {
                content += ' <a href="#" class="spend_dp" data-level="' + level_number + '">+</a>';
            }
            line = '<div class="span-12 last level">' + content + '</div>';
            $('#levels').append(line);
            available = remaining_mk[i];
            if (available > 0) {
                content = available + ' MK spendable at this level';
                line = $('<div>').addClass('span-13 last level').html(content);
                $('#levels').append(line);
            }
            $('#levels').append('<div class="span-1 level"><strong>MK</strong></div>');
            parts = [];
            mk = level.MK;
            for (name in mk) {
                if (mk.hasOwnProperty(name)) {
                    if (name in ki_abilities) {
                        line = '<span class="name">' + name + '</span>';
                        if (ki_abilities[name].Option_Title) {
                            line += ' (<span class="options">' + mk[name].Options.join(', ') + '</span>)';
                        }
                        if (imk === name) {
                            line += '(POW';
                            amount = data['Insufficient Martial Knowledge'].Penalty;
                            if (amount < 0) {
                                line += ' ' + amount;
                            }
                            line += ' check to use)';
                        }
                        parts.push('<a href="#" class="delete_ki_ability" data-level="' + level_number + '">' + line + '</a>');
                    }
                    else {
                        // TODO: handle dominion techniques
                    }
                }
            }
            content = parts.join(', ');
            if (available >= 0) {
                content += ' <a href="#" class="spend_mk" data-level="' + level_number + '">+</a>';
            }
            line = '<div class="span-12 last level">' + content + '</div>';
            $('#levels').append(line);
        }
        render.render($('.container'));
    };
  
    return render;
});
