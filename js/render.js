/*global define: false */
/**
 * Code for manipulating the page DOM in order to display and edit character
 * data.
 * @module render
 * @requires jquery
 * @requires abilities
 * @requires characters
 * @requires essential_abilities
 * @requires ki_abilities
 * @requires magic
 * @requires modules
 * @requires primaries
 * @requires psychic
 * @requires tables
 * @requires armor
 * @requires creation_points
 * @requires development_points
 * @requires martial_knowledge
 * @requires movement
 * @requires resistances
 * @requires widgets
 */
define(['jquery', 'abilities', 'characters', 'essential_abilities',
'ki_abilities', 'martial_arts', 'modules', 'powers', 'primaries', 'tables',
'widgets', 'armor', 'creation_points', 'development_points', 'magic',
'martial_knowledge', 'movement', 'psychic', 'resistances'],
function ($, abilities, characters, essential_abilities, ki_abilities,
          martial_arts, modules, powers, primaries, tables, widgets) {
    
    var create_spinner = widgets.create_spinner,
        load_value,
        next_step,
        render = {},
        set_characteristics_limits,
        update_int,
        update_text;

    /**
     * Set the value of an input field to match the corresponding property of
     * the current Character object. Used when loading or switching characters.
     * @param {String} name The name of the property (which is also the ID of
     *     the corresponding input field)
     */
    load_value = function (name) {
        var element = $('#' + name),
            value = characters.current()[name];
        if (element.data('spinner')) {
            element.spinner('value', value);
        }
        else {
            element.val('' + value);
        }
    };

    /**
     * Get a one-line text description of the next action which needs to be
     * performed in the character creation process.  Displayed for the user's
     * reference.
     * @returns {String}
     */
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

    /**
     * Set appropriate limits on physical or spiritual characteristics for
     * creatures.
     * @param {Character} data The character data object being edited
     * @param {String} type 'Physical' or 'Spiritual'
     */
    set_characteristics_limits = function (data, type) {
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
        $('#characteristics .' + type.toLowerCase()).spinner('max', limit);
    };

    /**
     * Update an integer property of the current Character object using the
     * current value of the corresponding input field.
     * @param {String} name The name of the property (which is also the ID of
     *     the corresponding input field)
     */
    update_int = function (name) {
        var input = $('#' + name),
            value;
        if (input.data('spinner')) {
            value = input.spinner('value');
        }
        else if (input.valid()) {
            value = parseInt(input.val(), 10);
        }
        else {
            return;
        }
        characters.current()[name] = value;
        if (name === 'XP') {
            input.nextAll('.form-control-static').find('span').text(value);
        }
        else {
            input.nextAll('.display').text(value);
        }
    };

    /**
     * Update a text property of the current Character object using the current
     * value of the corresponding input field.
     * @param {String} name The name of the property (which is also the ID of
     *     the corresponding input field)
     */
    update_text = function (name) {
        var field = $('#' + name);
        if (field.valid()) {
            characters.current()[name] = field.val();
        }
    };

    /**
     * Refresh the character's statistics display block.
     * @method module:render#render
     * @param {Node} root The root DOM node for the stat block
     */
    render.render = function (root) {
        var ability,
            ability_list,
            block,
            count,
            data = characters.current(),
            arts = data.martial_arts(),
            dodge,
            element = data.Element,
            first_level_dp = data.levels[0].DP,
            acute = first_level_dp['Acute Sense'],
            i,
            j,
            keys,
            ma_modifiers = [],
            modifiers = data.resistance_modifiers(),
            name,
            primary,
            recovery,
            score,
            secondaries = [],
            specialization,
            specializations = data.Specializations,
            summoner = false,
            text,
            total_accumulation = 0,
            total_ki = 0,
            total_mk = data.mk_totals(),
            remaining_mk = data.mk_remaining(),
            technique_count,
            trees;
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
        $('.Size', root).text(data.size() + ' ' + data.size_category());
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
                text += score + ' vs ' + name;
            }
            text += ')';
            $('.resistance_modifiers', root).show().text(text);
        }
        else {
            $('.resistance_modifiers', root).hide();
        }
        $('.Initiative', root).text(data.initiative());
        $('.Attack', root).text(data.ability('Attack'));
        block = data.ability('Block');
        dodge = data.ability('Dodge');
        if (block > dodge) {
            $('.Defense', root).text(block + ' Block');
        }
        else {
            $('.Defense', root).text(dodge + ' Dodge');
        }
        score = data.damage_barrier();
        if (score > 0) {
            $('.Damage_Barrier', root).text(score).parent().show();
        }
        else {
            $('.Damage_Barrier', root).parent().hide();
        }
        score = data.damage_reduction();
        if (score !== 0) {
            $('.Base_Damage_reduction', root).text(score).parent().show();
        }
        else {
            $('.Base_Damage_reduction', root).parent().hide();
        }
        $('.Wear_Armor', root).text(data.ability('Wear Armor'));
        i = total_mk.length - 1;
        $('.MK', root).text(total_mk[i]);
        $('.unallocated_mk').text(remaining_mk[i]);
        $('.magic', root).toggle(data.has_gift());
        score = data.ma();
        text = score;
        if (element) {
            ma_modifiers.push((score + 20) + ' ' + element);
            ma_modifiers.push((score - 20) + ' ' + tables.opposite_elements[element]);
        }
        recovery = data.zeon_recovery();
        if (recovery !== score) {
            ma_modifiers.push(recovery + ' Recovery');
        }
        if (ma_modifiers.length > 0) {
            text += ' (' + ma_modifiers.join(', ') + ')';
        }
        $('.MA', root).text(text);
        $('.Zeon', root).text(data.zeon());
        $('.zeon-row', root).toggle(data.uses_zeon());
        i = data.magic_projection_offense();
        j = data.magic_projection_defense();
        if (i === j) {
            text = i + '';
        }
        else {
            text = i + ' Offensive, ' + j + ' Defensive';
        }
        $('.Magic_Projection', root).text(text);
        $('.Magic_Level', root).text(data.magic_level());
        i = data.psychic_projection_offense();
        j = data.psychic_projection_defense();
        if (i === j) {
            text = i + '';
        }
        else {
            text = i + ' Offensive, ' + j + ' Defensive';
        }
        $('.Psychic_Projection', root).text(text);
        $('.Psychic_Points', root).text(data.psychic_points());
        $('.psychic', root).toggle(data.discipline_access().length > 0);
        text = data.racial_abilities();
        if (text) {
            $('.Racial-Abilities').text(text);
            $('.racial-row').show();
        }
        else {
            $('.racial-row').hide();
        }
        ability_list = data.ki_abilities();
        i = $.inArray('Ki Concealment', ability_list);
        if (i > -1) {
            ability_list[i] += ' (' + data.ki_concealment() + ')';
        }
        i = $.inArray('Ki Detection', ability_list);
        if (i > -1) {
            ability_list[i] += ' (' + data.ki_detection() + ')';
        }
        $('.Ki-Abilities', root).text(ability_list.join(', '));
        $.each(['STR', 'DEX', 'AGI', 'CON', 'POW', 'WP'], function (index, characteristic) {
            i = data.ki_accumulation(characteristic);
            total_accumulation += i;
            j = data.ki_points(characteristic);
            total_ki += j;
            $('.Accumulation_' + characteristic, root).text(i);
            $('.Ki_' + characteristic, root).text(j);
        });
        $('.Accumulation_Total', root).text(total_accumulation);
        $('.Ki_Total', root).text(total_ki);
        $('.ki-abilities', root).toggle(ability_list.length > 0);
        $('.ki-table', root).toggle(ability_list.length > 0);
        trees = data.dominion_techniques();
        keys = Object.keys(trees);
        keys.sort();
        count = keys.length;
        text = '';
        for (i = 0; i < count; i++) {
            if (i > 0) {
                text += ', ';
            }
            name = keys[i];
            text += name + ' (';
            ability_list = trees[name];
            technique_count = ability_list.length;
            for (j = 0; j < technique_count; j++) {
                if (j > 0) {
                    text += '; ';
                }
                text += ability_list[j].Name;
            }
            text += ')';
        }
        $('.Dominion-Techniques', root).text(text);
        $('.dominion-techniques-row', root).toggle(text.length > 0);
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
                    if (ability.Summoning) {
                        $('.' + name, root).text(score);
                    }
                    if (score > data.modifier(ability.Characteristic)) {
                        if ('Field' in ability) {
                            if (specializations) {
                                specialization = specializations[name];
                                if (specialization) {
                                    score = '(' + specialization + ') ';
                                    score += data.ability(name, specialization);
                                }
                            }
                            if (acute && ability.Characteristic === 'PER') {
                                score += ' (' + (score + 30) + ' ' + acute + ')';
                            }
                            secondaries.push(name + ' ' + score);
                        }
                        else if (ability.Summoning) {
                            summoner = true;
                        }
                    }
                }
            }
        }
        $('.summoning', root).toggle(summoner);
        secondaries.sort();
        $('.secondary-abilities', root).text(secondaries.join(', '));
        $('.Unarmed_Initiative', root).text(data.unarmed_ability('Initiative', arts));
        $('.Unarmed_Attack', root).text(data.unarmed_ability('Attack', arts));
        block = data.unarmed_ability('Block', arts);
        dodge = data.unarmed_ability('Dodge', arts);
        if (block > dodge) {
            $('.Unarmed_Defense', root).text(block + ' Block');
        }
        else {
            $('.Unarmed_Defense', root).text(dodge + ' Dodge');
        }
        $('.Unarmed_Damage', root).text(data.unarmed_damage());
        $('.unarmed-advantages-block', root).text(data.martial_arts_advantages(arts).join(', '));
    };

    /**
     * Update the section of the page where the character's advantages and
     * disadvantages are chosen.
     * @method module:render#update_cp
     * @param {Boolean} read_only True if the display of advantages and
     *     disadvantages should be read-only (because we've moved on to
     *     choosing abilities)
     */
    render.update_cp = function (read_only) {
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

    /**
     * Update the section of the page where the creature's essential abilities
     * are chosen.
     * @method module:render#update_essential_abilities
     * @param {Boolean} read_only True if the display of essential abilities
     *     should be read-only (because we've moved on to choosing powers)
     */
    render.update_essential_abilities = function (read_only) {
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

    /**
     * Update the character data entry area based on the current character
     * data.  Used when loading or switching characters.
     * @method module:render#load_data
     */
    render.load_data = function () {
        var data = characters.current(),
            first_class = data.levels[0].Class,
            stage = data.creation_stage();
        $('input.characteristic, #Appearance, #XP').show().nextAll('.display').hide();
        $('#Physical, #Spiritual, #Gender, #Race, #first_class').show().nextAll('.display').hide();
        $('#add_xp').hide();
        $('#proceed').show();
        $('#choose_essential_abilities').show();
        $('#choose_characteristics').show();
        $('#choose_advantages').show().attr('disabled', 'disabled');
        $('#choose_abilities').show().attr('disabled', 'disabled');
        $('#attributes').hide();
        $('#essential_abilities').hide();
        $('#characteristics').hide();
        $('#advantages').hide();
        $('#levels').hide();
        $('.level').remove();
        load_value('Type');
        if (stage > 1) {
            render.start_attributes();
            if (data.Type !== 'Human') {
                $('#Created').val(data.Created ? 'Yes': 'No');
                load_value('Element');
                load_value('Gnosis');
                $('#creature_class').val(first_class);
                $('#creature_level').spinner('value', data['Racial Level']);
                if (stage > 2) {
                    render.start_essential_abilities();
                }
                if (stage > 3) {
                    render.start_characteristics();
                }
            }
            if (stage > 3) {
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

    /**
     * Update the basic data for the current character using the values
     * currently in the appropriate input fields and refresh the stat block.
     * @method module:render#update_basics
     */
    render.update_basics = function () {
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

    /**
     * Update the Name property of the current Character object using the
     * current value of the Name input field, and update the displayed summary
     * accordingly.
     * @method module:render#update_name
     */
    render.update_name = function () {
        update_text('Name');
        $('.container .summary').text(characters.current().summary());
    };

    /**
     * Conclude specification of creature type and start entering Gnosis,
     * optional elemental type, and creature origin.
     * @method module:render#start_attributes
     */
    render.start_attributes = function () {
        var data = characters.current(),
            select = $('#Type'),
            type = select.val();
        data.Type = type;
        if (!data.Race) {
            data.Race = 'Other';
        }
        select.hide().nextAll('.display').text(type).show();
        $('#proceed').hide();
        if (type === 'Human') {
            select.nextAll('.display').text('Human or Nephilim');
            return render.start_characteristics();
        }
        $('#attributes').show();
        $('#choose_essential_abilities').show();
        $('#Created, #creature_class').show().nextAll('.display').hide();
        if (data.element_allowed()) {
            $('#Element_label').show();
            $('#Element').show().nextAll('.display').hide();
        }
        else {
            $('#Element_label').hide();
            $('#Element').hide().nextAll('.display').hide();
        }
        if (!$('#Gnosis').find('.spinner-buttons').length) {
            create_spinner('#Gnosis', {min: 0, max: 50, step: 5, value: 10});
            create_spinner('#creature_level', {min: 0, max: 16, value: 0});
        }
        else {
            $('#Gnosis, #creature_level').show().nextAll('.display').hide();
        }
        if (type !== 'Human' && type !== 'Natural') {
            $('#Gnosis').spinner('min', 10);
        }
        // Reset fields to default values
        $('#Created').val('No');
        $('#Element').val('None');
        $('#Gnosis').spinner('value', 10);
        render.render($('.container'));
    };

    /**
     * Conclude specification of creature attributes and start choosing
     * essential abilites.
     * @method module:render#start_essential_abilities
     */
    render.start_essential_abilities = function () {
        var data = characters.current(),
            select = $('#Created'),
            value = select.val(),
            xp;
        data.Created = (value === 'Yes');
        select.hide().nextAll('.display').text(value).show();
        select = $('#Damage_Resistance');
        value = select.val();
        if (value === 'Yes') {
            data['Damage Resistance'] = true;
        }
        select.hide().nextAll('.display').text(value).show();
        if (data.element_allowed()) {
            update_text('Element');
            select = $('#Element');
            value = select.val();
            if (!value) {
                value = 'None';
            }
            select.hide().nextAll('.display').text(value).show();
        }
        update_int('Gnosis');
        $('#Gnosis').hide().nextAll('.display').show();
        select = $('#creature_class');
        value = select.val();
        $('#first_class').val(value);
        select.hide().nextAll('.display').text(value).show();
        select = $('#creature_level');
        value = select.spinner('value');
        data['Racial Level'] = value;
        xp = value === 0 ? -100 : tables.xp_chart[value - 1];
        if (xp > data.XP) {
            data.XP = xp;
        }
        select.hide().nextAll('.display').text(value).show();
        $('#choose_essential_abilities').hide();
        render.update_essential_abilities();
        $('#essential_abilities, #ea_dp, #choose_characteristics').show();
        render.render($('.container'));
    };

    /**
     * Conclude specification of limits on characteristics and start entering
     * the actual values.
     * @method module:render#start_characteristics
     */
    render.start_characteristics = function () {
        var data = characters.current(),
            racial_level,
            xp;
        $('#characteristics').show();
        $('#ea_dp, #choose_characteristics').hide();
        $('#choose_advantages').text(data.Type === 'Human' ? 'Choose Advantages' : 'Choose Abilities').show();
        $('#add_xp').hide();
        if (!$('#characteristics').find('.spinner-buttons').length) {
            create_spinner('#characteristics .characteristic', {min: 1, max: 10, value: 5});
            create_spinner('#Appearance', {min: 1, max: 10, value: 5});
            create_spinner('#XP', {min: -100, max: 9999, value: 0});
            $('div.characteristic, #Appearance, #XP').on('changed', render.update_basics);
            $('div.characteristic, #Appearance, #Gender, #Race, #first_class, #XP').nextAll('.display').hide();
            $('#main_form').validate({
                errorClass: 'has-error',
                highlight: function (element, errorClass) {
                    $(element).parents('.form-group').addClass(errorClass);
                },
                unhighlight: function (element, errorClass) {
                    $(element).parents('.form-group').removeClass(errorClass);
                }
            });
            $('#Gender, #Race, #first_class').change(function () { $(this).blur(); render.update_basics(); });
            $('#Name').change(render.update_name);
        }
        else {
            $('div.characteristic, #Appearance, #XP').show().nextAll('.display').hide();
            $('#Gender, #Race, #first_class').show().nextAll('.display').hide();
        }
        set_characteristics_limits(data, 'Physical');
        set_characteristics_limits(data, 'Spiritual');
        // Reset fields to default values
        $('.characteristic, #Appearance').spinner('value', 5);
        $('#XP').spinner('value', 0);
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
            $('#XP').spinner('min', xp);
            $('#XP').spinner('value', xp);
            render.update_essential_abilities(true);
        }
        $('#race_and_class').toggle(data.Type === 'Human');
    };

    /**
     * Conclude entry of basic statistics and start choosing advantages and
     * disadvantages.
     * @method module:render#start_advantages
     */
    render.start_advantages = function () {
        render.update_basics();
        if ($('#main_form').valid()) {
            $('#Gender, #Race, #first_class').each(function () {
                var select = $(this),
                    value = select.val();
                select.hide().nextAll('.display').text(value).show();
            });
            $('div.characteristic, #Appearance, #XP').hide().nextAll('.display').show();
            if (characters.current().Type !== 'Human') {
                return render.start_abilities();
            }
            render.update_cp();
            $('#advantages').show();
            $('#choose_advantages').hide();
        }
    };

    /**
     * Conclude selection of advantages and disadvantages, and start choosing
     * abilities acquired at each level.
     * @method module:render#start_abilities
     */
    render.start_abilities = function () {
        render.update_cp(true);
        $('#choose_advantages, #choose_abilities').hide();
        $('#levels').show();
        render.update_level();
        $('#add_xp').show();
    };

    /**
     * Update the per-level character data entry area based on the current
     * character data.
     * @method module:render#update_level
     */
    render.update_level = function () {
        var amount,
            available,
            characteristic,
            content,
            count,
            data = characters.current(),
            current_level = data.level(),
            dp,
            ea_advantages = essential_abilities.advantages,
            ea_disadvantages = essential_abilities.disadvantages,
            freelancer,
            i,
            j,
            imbalances,
            imk,
            imk_name,
            imk_tree,
            level,
            levels,
            level_count,
            level_number,
            line,
            mk,
            name,
            nb,
            panel,
            panel_body,
            parts,
            primary,
            remaining_dp,
            remaining_dp_for_level,
            remaining_mk,
            technique,
            times_five = ['Magic Level', 'Martial Knowledge', 'Zeon'],
            withdrawn;
        update_int('XP');
        data.update_level();
        remaining_mk = data.mk_remaining();
        imk = data['Insufficient Martial Knowledge'];
        if (imk) {
            imk_name = imk.Name;
            imk_tree = imk.Tree;
        }
        levels = data.levels;
        level_count = levels.length;
        $('.level').remove();
        imbalances = data.magic_projection_imbalances();
        remaining_dp = data.dp_remaining();
        for (i = 0; i < level_count; i++) {
            level = levels[i];
            remaining_dp_for_level = remaining_dp[i];
            //$('#levels').append($('<hr class="level" />'));
            panel = $('<div class="panel panel-default level"></div>');
            level_number = current_level === 0 ? 0 : i + 1;
            content = '<strong>Level ' + level_number + '</strong> (';
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
            amount = imbalances[i];
            if (typeof amount === 'number') {
                content += ' <a href="#" class="mp_imbalance" data-level="' + level_number + '">Magic Projection Imbalance: ' + amount + '</a>';
            }
            line = $('<div class="panel-heading"></div>').html(content);
            panel.append(line);
            panel_body = $('<div class="panel-body row"></div>');
            if (level.Class === 'Freelancer') {
                freelancer = level.Freelancer || [];
                content = 'Freelancer Bonuses:';
                count = freelancer.length;
                parts = [];
                for (j = 0; j < count; j++) {
                    parts.push(' <a href="#" class="freelancer_bonus" data-level="' + level_number + '">' + freelancer[j] + '</a>');
                }
                content += parts.join(',');
                if (count < 5) {
                    content += ' <a href="#" class="freelancer_bonus btn-xs" data-level="' + level_number + '"><i class="glyphicon glyphicon-plus"> </i></a>';
                }
                line = $('<div class="col-xs-12"></div>').html(content);
                panel_body.append(line);
            }
            if (remaining_dp_for_level.Total > 0) {
                content = remaining_dp_for_level.Total + ' DP remaining (Limits: ' + remaining_dp_for_level.Combat + ' Combat, ' + remaining_dp_for_level.Psychic + ' Psychic, ' + remaining_dp_for_level.Supernatural + ' Supernatural';
                if (data.Type !== 'Human') {
                    content += ', ' + remaining_dp_for_level.Powers + ' Powers';
                }
                content += ', ' + remaining_dp_for_level.Other + ' Other';
                content += ')';
                line = $('<div class="col-xs-12"></div>').html(content);
                panel_body.append(line);
            }
            panel_body.append('<div class="col-xs-1"><strong>DP</strong></div>');
            parts = [];
            dp = level.DP;
            for (name in dp) {
                if (dp.hasOwnProperty(name)) {
                    primary = primaries.for_ability(name);
                    if (name.indexOf('Save ') === 0) {
                        line = dp[name] + ' ' + primary + ' DP saved for later <span class="name" style="display: none;">' + name + '</span>';
                    }
                    else if (name in martial_arts) {
                        line = '<span class="name">' + name + '</span> (';
                        line += dp[name].join(', ') + ')';
                    }
                    else if (name in modules) {
                        line = '<span class="name">' + name + '</span>';
                        if (modules[name].Option_Title) {
                            line += ' (' + dp[name].join(', ') + ')';
                        }
                    }
                    else if (name === 'Accumulation Multiple' || name === 'Ki') {
                        available = remaining_dp_for_level.Combat;
                        for (characteristic in dp[name]) {
                            if (dp[name].hasOwnProperty(characteristic)) {
                                line = '<span class="name">' + name + '</span> (';
                                line += characteristic + '): ' + dp[name][characteristic];
                                parts.push('<a href="#" class="ability" data-available="' + available + '" data-level="' + level_number + '" data-characteristic="' + characteristic + '">' + line + '</a>');
                            }
                        }
                        continue;
                    }
                    else if (name in powers) {
                        available = remaining_dp_for_level.Powers;
                        line = '<span class="type">' + name + '</span>';
                        parts.push('<a href="#" class="power" data-available="' + available + '" data-level="' + level_number + '">' + line + '</a>');
                        continue;
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
            withdrawn = remaining_dp_for_level.Withdrawn;
            if (withdrawn) {
                content += ' [used ';
                j = 0;
                for (primary in withdrawn) {
                    if (withdrawn.hasOwnProperty(primary)) {
                        if (j > 0) {
                            content += ', ';
                        }
                        content += withdrawn[primary] + ' ' + primary;
                        j++;
                    }
                }
                content += ' DP saved earlier]';
            }
            if (remaining_dp_for_level.Total > 0) {
                content += ' <a href="#" class="spend_dp btn-xs" data-level="' + level_number + '"><i class="glyphicon glyphicon-plus"> </i></a>';
            }
            line = $('<div class="col-xs-11">' + content + '</div>');
            panel_body.append(line);
            available = remaining_mk[i];
            if (available > 0) {
                panel_body.append('<div class="clearfix"></div>');
                content = available + ' MK spendable at this level';
                line = $('<div class="col-xs-12">').html(content);
                panel_body.append(line);
            }
            panel_body.append('<div class="clearfix"></div>');
            panel_body.append('<div class="col-xs-1"><strong>MK</strong></div>');
            parts = [];
            mk = level.MK;
            for (name in mk) {
                if (mk.hasOwnProperty(name)) {
                    if (name in ki_abilities) {
                        line = '<span class="name">' + name + '</span>';
                        if (ki_abilities[name].Option_Title) {
                            line += ': <span class="options">' + mk[name].Options.join(', ') + '</span>';
                        }
                        if (imk_name === name && !imk_tree) {
                            line += ' (POW';
                            amount = imk.Penalty;
                            if (amount < 0) {
                                line += ' ' + amount;
                            }
                            line += ' check to use)';
                        }
                        parts.push('<a href="#" class="delete_ki_ability" data-level="' + level_number + '">' + line + '</a>');
                    }
                    else {
                        // Technique Tree
                        count = mk[name].length;
                        for (j = 0; j < count; j++) {
                            technique = mk[name][j];
                            line = '<span class="tree">' + name + '</span>: <span class="technique">' + technique.Name;
                            if (imk_tree === name && imk_name === technique.Name) {
                                line += ' (POW';
                                amount = imk.Penalty;
                                if (amount < 0) {
                                    line += ' ' + amount;
                                }
                                line += ' check to use)';
                            }
                            line += '</span>';
                            parts.push('<a href="#" class="delete_dominion_technique" data-level="' + level_number + '">' + line + '</a>');
                        }
                    }
                }
            }
            content = parts.join(', ');
            if (available >= 0 && !imk) {
                content += ' <a href="#" class="spend_mk btn-xs" data-level="' + level_number + '"><i class="glyphicon glyphicon-plus"> </i></a>';
            }
            line = $('<div class="col-xs-11">' + content + '</div>');
            panel_body.append(line);
            panel.append(panel_body);
            $('#levels').append(panel);
        }
        render.render($('.container'));
    };
  
    return render;
});
