/*global define: false, document: false */
/**
 * Dialog widgets for choosing various aspects of a character: advantages,
 * DP expenditure, martial knowledge allocation, etc.
 * @module dialogs
 * @requires jquery
 * @requires abilities
 * @requires advantages
 * @requires characters
 * @requires combat
 * @requires creation_points
 * @requires cultural_roots
 * @requires development_points
 * @requires disadvantages
 * @requires essential_abilities
 * @requires ki_abilities
 * @requires libs/combobox
 * @requires libs/json2
 * @requires libs/utils
 * @requires martial_arts
 * @requires modules
 * @requires powers
 * @requires primaries
 * @requires pubsub
 * @requires tables
 * @requires widgets
 */
define(['jquery', 'abilities', 'advantages', 'characters', 'cultural_roots',
'disadvantages', 'essential_abilities', 'ki_abilities', 'martial_arts',
'modules', 'powers', 'primaries', 'tables', 'widgets', 'combat',
'creation_points', 'development_points', 'libs/combobox', 'libs/json2',
'libs/utils', 'pubsub'],
function ($, abilities, advantages, characters, cultural_roots, disadvantages,
          essential_abilities, ki_abilities, martial_arts, modules, powers,
          primaries, tables, widgets) {

    var ability_dp_init,
        add_advantage,
        add_cultural_roots_choice,
        add_disadvantage,
        add_dominion_technique,
        add_ea_advantage,
        add_ea_disadvantage,
        add_ki_ability,
        add_martial_art,
        add_module,
        add_xp,
        advantage_cost_init,
        advantage_options_init,
        advantages_init,
        characteristic_bonus_init,
        class_init,
        configure_ability,
        configure_advantage,
        configure_disadvantage,
        configure_essential_ability,
        configure_ki_ability,
        configure_power,
        create_dialog = widgets.create_dialog,
        create_spinner = widgets.create_spinner,
        cultural_roots_init,
        delete_advantage,
        delete_advantage_init,
        delete_disadvantage,
        delete_disadvantage_init,
        delete_dominion_technique,
        delete_dominion_technique_init,
        delete_ea_init,
        delete_essential_ability,
        delete_ki_ability,
        delete_ki_ability_init,
        delete_martial_art,
        delete_martial_art_init,
        delete_module,
        delete_module_init,
        delete_power,
        delete_power_init,
        dialogs = {},
        disadvantage_benefit_init,
        disadvantage_option_init,
        disadvantages_init,
        dominion_technique_init,
        dp_init,
        ea_advantages_init,
        ea_disadvantages_init,
        ea_option_init,
        edit_advantage_cost,
        edit_advantage_options,
        edit_characteristic_bonus,
        edit_class,
        edit_disadvantage_benefit,
        edit_disadvantage_option,
        edit_ea_option,
        edit_freelancer_bonus,
        edit_mp_imbalance,
        edit_natural_bonus,
        freelancer_init,
        ki_ability_options_init,
        ki_characteristic_init,
        load,
        load_character_init,
        mk_init,
        module_options_init,
        mp_imbalance_init,
        natural_bonus_init,
        power_options_init,
        save,
        save_character_init,
        set_ability_dp,
        set_freelancer_bonus,
        set_natural_bonus,
        spend_dp,
        spend_mk,
        update_cultural_roots,
        xp_dialog_init;

    /**
     * Initialize the dialog for setting the amount of DP to spend on an
     * ability at a particular level.
     */
    ability_dp_init = function () {
        $('#ability_specialization').combobox();
        create_dialog('ability_dp_dialog', 'Amount of DP to Spend',
                      'Cancel', 'OK', function () {
            var data = characters.current(),
                characteristic = $('#ability_characteristic').text(),
                cost = parseInt($('#ability_cost').val(), 10),
                dp = $('#ability_dp').spinner('value'),
                level = parseInt($('#ability_level').val(), 10),
                level_info = data.level_info(level),
                name = $('#ability_name').text(),
                specialization = $('#ability_specialization').combobox('selectedItem').text;
            if (dp) {
                if (characteristic) {
                    // Accumulation Multiple or Ki
                    if (!(name in level_info.DP)) {
                        level_info.DP[name] = {};
                    }
                    level_info.DP[name][characteristic] = dp / cost;
                }
                else {
                    level_info.DP[name] = dp / cost;
                    if (specialization) {
                        if (!('Specializations' in data)) {
                            data.Specializations = {};
                        }
                        data.Specializations[name] = specialization;
                    }
                    else if ('Specializations' in data && name in data.Specializations) {
                        delete data.Specializations[name];
                    }
                }
                $.publish('level_data_changed');
            }
            else if (name in level_info.DP) {
                if (characteristic) {
                    // Accumulation Multiple or Ki
                    delete level_info.DP[name][characteristic];
                    if (Object.keys(level_info.DP[name]).length === 0) {
                        delete level_info.DP[name];
                    }
                }
                else {
                    delete level_info.DP[name];
                }
                $.publish('level_data_changed');
            }
            $('#ability_dp_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Configure and launch the advantage selection dialog.
     */
    add_advantage = function () {
        var count,
            data = characters.current(),
            i,
            name,
            link,
            links;
        for (name in advantages) {
            if (advantages.hasOwnProperty(name)) {
                links = $('#advantages_tabs a:contains("' + name + '")');
                count = links.size();
                // Check for false matches like "Learning" & "Martial Learning"
                for (i = 0; i < count; i++) {
                    link = links.eq(i);
                    if (link.text() === name) {
                        if (data.advantage_allowed(name, null)) {
                            link.removeClass('disabled');
                        }
                        else {
                            link.addClass('disabled');
                        }
                    }
                }
            }
        }
        $('#advantages_dialog').modal('show');
        return false;
    };

    /**
     * Add a select widget to the cultural roots advantage configuration dialog
     * for backgrounds where a choice between different bonuses can be made.
     * @param {Number} i The index of this option (ignored)
     * @param {Object} choice Mapping of Secondary Ability names to bonuses
     */
    add_cultural_roots_choice = function (i, choice) {
        var ability,
            amount,
            option,
            parts = ['<select class="form-control">'],
            specialty;
        for (option in choice) {
            if (choice.hasOwnProperty(option)) {
                parts.push('<option value="', option, '">');
                ability = option;
                parts.push(ability);
                amount = choice[option];
                if ($.isPlainObject(amount)) {
                    specialty = Object.keys(amount)[0];
                    parts.push(' (', specialty, ')');
                    amount = amount[specialty];
                }
                parts.push(' +', amount, '</option>');
            }
        }
        parts.push('</select><br />');
        $('#cultural_roots').append(parts.join(''));
    };

    /**
     * Configure and launch the disadvantage selection dialog.
     */
    add_disadvantage = function () {
        var data = characters.current(),
            name,
            link;
        for (name in disadvantages) {
            if (disadvantages.hasOwnProperty(name)) {
                link = $('#disadvantages_tabs a:contains("' + name + '")');
                if (data.disadvantage_allowed(name, null)) {
                    link.removeClass('disabled');
                }
                else {
                    link.addClass('disabled');
                }
            }
        }
        $('#disadvantages_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the dialog for entering a new Dominion Technique.
     */
    add_dominion_technique = function () {
        var link = $(this),
            available = link.data('available'),
            level = link.data('level');
        $('#mk_dialog').modal('hide');
        $('#dominion_character_level').val(level);
        $('#dominion_tree').val('');
        $('#dominion_name').val('');
        $('#dominion_technique_dialog').modal('show');
        if ($('#dominion_technique_dialog .spinner-buttons').length) {
            $('#dominion_level').spinner('value', 1);
            $('#dominion_mk').spinner('value', 20);
            $('#dominion_mk').spinner('max', available);
        }
        else {
            create_spinner('#dominion_level', {min: 1, max: 3, value: 1});
            create_spinner('#dominion_mk', {min: 10, max: available, value: 20});
        }
        return false;
    };

    /**
     * Configure and launch the dialog for selecting an Essential Ability for
     * a creature.
     */
    add_ea_advantage = function () {
        var advantages = essential_abilities.advantages,
            allowed,
            count,
            data = characters.current(),
            i,
            name,
            link,
            links;
        for (name in advantages) {
            if (advantages.hasOwnProperty(name)) {
                links = $('#ea_advantages_tabs a:contains("' + name + '")');
                count = links.size();
                // Check for false matches
                for (i = 0; i < count; i++) {
                    link = links.eq(i);
                    if (link.text() === name) {
                        allowed = data.essential_ability_allowed(name, null);
                        if (allowed  === 'maybe') {
                            link.removeClass('disabled');
                            link.addClass('maybe');
                        }
                        else if (allowed) {
                            link.removeClass('disabled');
                            link.removeClass('maybe');
                        }
                        else {
                            link.addClass('disabled');
                            link.removeClass('maybe');
                        }
                    }
                }
            }
        }
        $('#ea_advantages_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the dialog for selecting an Essential Ability
     * disadvantage for a creature.
     */
    add_ea_disadvantage = function () {
        var allowed,
            data = characters.current(),
            disadvantages = essential_abilities.disadvantages,
            name,
            link;
        for (name in disadvantages) {
            if (disadvantages.hasOwnProperty(name)) {
                link = $('#ea_disadvantages_tabs a:contains("' + name + '")');
                allowed = data.essential_ability_allowed(name, null);
                if (allowed === 'maybe') {
                    link.removeClass('disabled');
                    link.addClass('maybe');
                }
                else if (allowed) {
                    link.removeClass('disabled');
                    link.removeClass('maybe');
                }
                else {
                    link.addClass('disabled');
                    link.removeClass('maybe');
                }
            }
        }
        $('#ea_disadvantages_dialog').modal('show');
        return false;
    };

    /**
     * Process a Ki or Nemesis Ability selection from the MK spending options
     * dialog.
     */
    add_ki_ability = function () {
        var data = characters.current(),
            level = $(this).data('level'),
            name = $.trim($(this).find('.name').text()),
            ability = ki_abilities[name];
        $('#mk_dialog').modal('hide');
        if ('Options' in ability) {
            return configure_ki_ability(name, level);
        }
        data.add_ki_ability(name, level);
        $.publish('level_data_changed');
        return false;
    };

    /**
     * Process the selection of a martial art from the DP spending dialog.
     */
    add_martial_art = function () {
        var data = characters.current(),
            link = $(this),
            degree = link.find('.degree').text(),
            level = parseInt(link.data('level'), 10),
            name = link.find('.name').text();
        $('#dp_dialog').modal('hide');
        data.add_martial_art(name, degree, level);
        $.publish('level_data_changed');
        return false;
    };

    /**
     * Process the selection of a Module from the DP spending dialog.
     */
    add_module = function () {
        var data = characters.current(),
            input,
            link = $(this),
            level = parseInt(link.data('level'), 10),
            name = link.find('.name').text(),
            module = modules[name],
            multiple = module.Option_Title,
            options,
            panel,
            select;
        $('#dp_dialog').modal('hide');
        if (!multiple && data.has_module(name)) {
            return false;
        }
        if (!multiple) {
            data.add_module(name, level);
            $.publish('level_data_changed');
            return false;
        }
        $('#module_options_name').val(name);
        $('#module_options_level').val(level);
        panel = $('#module_options');
        panel.html('');
        options = module.Options;
        if (options.length === 0) {
            input = $('<input>', {type: 'text', value: ''}).addClass('form-control required');
            panel.append(input);
        }
        else {
            select = $('<select>').addClass('form-control');
            $.each(options, function (i, option) {
                if (!data.has_module(name, option)) {
                    select.append($('<option>', {value: option}).text(option));
                }
            });
            panel.append(select);
        }
        $('#module_options_dialog h4').text(module.Option_Title);
        $('#module_options_dialog').modal('show');
        return false;
    };

    /**
     * Launch the dialog for specifying an amount of XP gained.
     */
    add_xp = function () {
        $('#xp_dialog').modal('show');
        if ($('#xp_dialog').find('.spinner-buttons').length) {
            $('#xp_added').spinner('value', 0);
        }
        else {
            create_spinner('#xp_added', {min: 0, max: 9999, value: 0});
        }
        return false;
    };

    /**
     * Initialize the dialog for selecting the number of creation points to
     * spend on an advantage.
     */
    advantage_cost_init = function () {
        create_dialog('advantage_cost_dialog',
                      'Spend how many creation points on it?', 'Cancel',
                      'OK', function () {
            var advantage,
                cost = parseInt($('input:radio[name=advantage_cost]:checked').val(), 10),
                data,
                name = $('#advantage_cost_name').val();
            advantage = advantages[name];
            if ('Options' in advantage) {
                $('#advantage_cost_dialog').modal('hide');
                edit_advantage_options(name, cost);
            }
            else {
                data = characters.current();
                data.Advantages[name] = cost;
                $.publish('cp_changed');
                $('#advantage_cost_dialog').modal('hide');
            }
            return false;
        });
    };

    /**
     * Initialize the dialog for configuring the parameters of an advantage.
     */
    advantage_options_init = function () {
        create_dialog('advantage_options_dialog', '', // title is set later
                      'Cancel', 'OK', function () {
            var characteristic,
                cost = $('#advantage_options_cost').val(),
                data,
                name = $('#advantage_options_name').val(),
                params,
                roll,
                select;
            cost = cost ? parseInt(cost, 10) : null;
            if (name === 'Repeat a Characteristics Roll') {
                characteristic = $('#advantage_options select').val();
                roll = $('#repeat_roll').spinner('value');
                if (isNaN(roll)) {
                    roll = 5;
                }
                params = {Characteristic: characteristic, Roll: roll};
            }
            else {
                select = $('#advantage_options select');
                if (select.length > 0) {
                    params = select.val();
                }
                else {
                    params = $('#advantage_options input').val();
                }
            }
            data = characters.current();
            data.add_advantage(name, cost, params);
            $.publish('cp_changed');
            $('#advantage_options_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Initialize the advantage selection dialog.
     */
    advantages_init = function () {
        var advantage,
            link,
            name;
        for (name in advantages) {
            if (advantages.hasOwnProperty(name)) {
                advantage = advantages[name];
                link = $('<a>', {href: '#'}).addClass('advantage').text(name);
                link.append('<br />');
                if (!('Category' in advantage)) {
                    $('#Common_Advantages').append(link);
                }
                else {
                    $('#' + advantage.Category + '_Advantages').append(link);
                }
            }
        }
        create_dialog('advantages_dialog', 'Select an advantage', 'Cancel');
    };

    /**
     * Initialize the Characteristic bonus selection dialog.
     */
    characteristic_bonus_init = function () {
        create_dialog('characteristic_bonus_dialog',
                      'Select the characteristic to increase', 'Cancel',
                      'OK', function () {
            var data = characters.current(),
                level = parseInt($('#dialog_level').val(), 10);
            data.levels[level - 1].Characteristic = $('#Characteristic').val();
            $('#characteristic_bonus_dialog').modal('hide');
            $.publish('level_data_changed');
            return false;
        });
    };

    /**
     * Initialize the class change dialog.
     */
    class_init = function () {
        create_dialog('class_dialog',
                      'Select class for level <span id="class_dialog_level"></span>',
                      'Cancel', 'OK', function () {
            var data = characters.current(),
                level = parseInt($('#class_dialog_level').text(), 10);
            data.change_class(level, $('#Class').val());
            $('#class_dialog').modal('hide');
            $.publish('level_data_changed');
            return false;
        });
    };

    /**
     * Process a click on a link representing an ability, from either the DP
     * spending options dialog or the list of abilities the character has
     * already chosen.
     * @method module:character#configure_ability
     * @returns {Boolean} Always false, to stop URL change from link click
     */
    configure_ability = function () {
        var link = $(this),
            available = parseInt(link.data('available'), 10),
            characteristic = link.data('characteristic'),
            level = parseInt(link.data('level'), 10),
            name = link.find('.name').text();
        $('#dp_dialog').modal('hide');
        if (name in martial_arts) {
            return delete_martial_art(name, level);
        }
        if (name in modules) {
            return delete_module(name, level);
        }
        if (!characteristic) {
            if (name === 'Accumulation Multiple' || name === 'Ki') {
                $('#ki_characteristic_available').val(available);
                $('#ki_characteristic_level').val(level);
                $('#ki_characteristic_name').val(name);
                $('#ki_characteristic_dialog').modal('show');
                return false;
            }
        }
        return set_ability_dp(name, level, available, characteristic);
    };

    /**
     * Add the just-selected advantage if it has no parameters, otherwise
     * launch the first dialog needed to configure it.
     */
    configure_advantage = function () {
        var name = $.trim($(this).text()),
            data = characters.current(),
            advantage = advantages[name];
        if (!data.advantage_allowed(name, null)) {
            return false;
        }
        $('#advantages_dialog').modal('hide');
        if (name === 'Cultural Roots') {
            $('#cultural_roots_dialog').modal('show');
            return false;
        }
        if ($.isArray(advantage.Cost)) {
            return edit_advantage_cost(name);
        }
        if ('Options' in advantage) {
            return edit_advantage_options(name, null);
        }
        data.Advantages[name] = advantage.Cost;
        $.publish('cp_changed');
        return false;
    };

    /**
     * Add the just-selected disadvantage if it has no parameters, otherwise
     * launch the first dialog needed to configure it.
     */
    configure_disadvantage = function () {
        var name = $.trim($(this).text()),
            data = characters.current(),
            disadvantage = disadvantages[name];
        
        if (!data.disadvantage_allowed(name, null)) {
            return false;
        }
        $('#disadvantages_dialog').modal('hide');
        if ($.isArray(disadvantage.Benefit)) {
            return edit_disadvantage_benefit(name);
        }
        if ('Options' in disadvantage) {
            return edit_disadvantage_option(name, null);
        }
        data.Disadvantages[name] = disadvantage.Benefit;
        $.publish('cp_changed');
        return false;
    };

    /**
     * Process the selection of an Essential Ability from the selection dialog.
     */
    configure_essential_ability = function () {
        var ability,
            data = characters.current(),
            name = $.trim($(this).text());
        if (!data.essential_ability_allowed(name, null)) {
            return false;
        }
        if (name in essential_abilities.advantages) {
            ability = essential_abilities.advantages[name];
            $('#ea_advantages_dialog').modal('hide');
        }
        else {
            ability = essential_abilities.disadvantages[name];
            $('#ea_disadvantages_dialog').modal('hide');
        }
        if ('Options' in ability) {
            return edit_ea_option(name);
        }
        data.add_essential_ability(name);
        $.publish('essential_abilities_changed');
        return false;
    };

    /**
     * Prompt for any option required by a ki ability being purchased, then
     * add it to the specified level.
     * @param {String} name The name of the ki ability
     * @param {Number} level The level at which the ki ability is being obtained
     */
    configure_ki_ability = function (name, level) {
        var data = characters.current(),
            ability = ki_abilities[name],
            title = ability.Option_Title,
            options = ability.Options,
            panel = $('#ki_ability_options'),
            select = $('<select>').addClass('form-control');
        $('#ki_ability_options_name').val(name);
        $('#ki_ability_options_level').val(level);
        panel.html('');
        $.each(options, function (i, option) {
            if (!data.has_ki_ability(name, option)) {
                select.append($('<option>', {value: option}).text(option));
            }
        });
        panel.append(select);
        $('#ki_ability_options_dialog h4').text(title);
        $('#ki_ability_options_dialog').modal('show');
        return false;
    };

    /**
     * Process a click on a link representing a creature power, from either the
     * DP spending options dialog or the list of powers the character has
     * already chosen.
     * @returns {Boolean} Always false, to stop URL change from link click
     */
    configure_power = function () {
        var data = characters.current(),
            link = $(this),
            //available = parseInt(link.data('available'), 10),
            level = parseInt(link.data('level'), 10),
            name = link.data('name') || '',
            type = link.find('.type').text(),
            power = powers[type],
            options = power.Options,
            penalties = power.Penalties,
            taken = data.power_parameters(type);
        $('#dp_dialog').modal('hide');
        // Are there even any choices to make?
        if ($.isArray(options) && options.length === 1 && !penalties) {
            if (taken.length) {
                // Clicked on a taken Power, ask if they want to delete it
                return delete_power(type, level);
            }
            else {
                // Just clicked on the power to take it
                data.add_power(type, level, {Options: options[0]});
            }
            $.publish('level_data_changed');
            return false;
        }
        $('#power_options_level').val(level);
        $('#power_options_name').val(name);
        $('#power_options_type').val(type);
        // configure option widgets
        $('#power_options_dialog').modal('show');
    };

    /**
     * Initialize the Cultural Roots advantage configuration dialog.
     */
    cultural_roots_init = function () {
        var name,
            parts = [];
        for (name in cultural_roots) {
            if (cultural_roots.hasOwnProperty(name)) {
                parts.push('<option value="');
                parts.push(name);
                parts.push('">');
                parts.push(name);
                parts.push('</option>\n');
            }
        }
        $('#cultural_roots_background').html(parts.join(''));
        $('#cultural_roots_background').change(update_cultural_roots);
        update_cultural_roots();
        create_dialog('cultural_roots_dialog', 'Select a background',
                      'Cancel', 'OK', function () {
            var background = $('#cultural_roots_background').val(),
                params = {Background: background, Choices: []},
                data = characters.current();
            $('#cultural_roots select').each(function (i, select) {
                params.Choices.push($(select).val());
            });
            data.add_advantage('Cultural Roots', 1, params);
            $.publish('cp_changed');
            $('#cultural_roots_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Confirm that the user intended to remove an advantage by clicking on it.
     */
    delete_advantage = function () {
        var name = $(this).data('name');
        $('#delete_advantage_name').val(name);
        $('#delete_advantage_dialog').modal('show');
        return false;
    };

    /**
     * Initialize the delete advantage confirmation dialog.
     */
    delete_advantage_init = function () {
        create_dialog('delete_advantage_dialog', 'Remove this advantage?',
                      'No', 'Yes', function () {
            var name = $('#delete_advantage_name').val(),
                data = characters.current();
            delete data.Advantages[name];
            $.publish('cp_changed');
            $('#delete_advantage_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Confirm that the user intended to remove a disadvantage by clicking on
     * it.
     */
    delete_disadvantage = function () {
        var name = $(this).data('name');
        $('#delete_disadvantage_name').val(name);
        $('#delete_disadvantage_dialog').modal('show');
        return false;
    };

    /**
     * Initialize the delete disadvantage confirmation dialog.
     */
    delete_disadvantage_init = function () {
        create_dialog('delete_disadvantage_dialog',
                      'Remove this disadvantage?', 'No', 'Yes',
                      function () {
            var name = $('#delete_disadvantage_name').val(),
                data = characters.current();
            delete data.Disadvantages[name];
            $.publish('cp_changed');
            $('#delete_disadvantage_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Confirm that the user intended to remove a Dominion Technique by
     * clicking on it.
     */
    delete_dominion_technique_init = function () {
        create_dialog('delete_dominion_technique_dialog',
                      'Remove this Dominion Technique?', 'No', 'Yes',
                      function () {
            var data = characters.current(),
                level = $('#delete_dominion_technique_level').val(),
                name = $('#delete_dominion_technique_name').val(),
                tree = $('#delete_dominion_technique_tree').val();
            data.remove_dominion_technique(tree, name, level);
            $.publish('level_data_changed');
            $('#delete_dominion_technique_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Configure and launch the Dominion Technique deletion confirmation
     * dialog.
     */
    delete_dominion_technique = function () {
        var self = $(this),
            level = self.data('level'),
            name = self.find('.name').text(),
            tree = self.find('.tree').text();
        $('#delete_dominion_technique_level').val(level);
        $('#delete_dominion_technique_name').val(name);
        $('#delete_dominion_technique_tree').val(tree);
        $('#delete_dominion_technique_dialog').modal('show');
        return false;
    };

    /**
     * Initialize the Essential Ability deletion confirmation dialog.
     */
    delete_ea_init = function () {
        create_dialog('delete_ea_dialog', 'Remove this essential ability?',
                      'No', 'Yes', function () {
            var name = $('#delete_ea_name').val(),
                data = characters.current();
            delete data.levels[0].DP[name];
            $.publish('essential_abilities_changed');
            $('#delete_ea_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Confirm that the user meant to remove an Essential Ability by clicking
     * on it.
     */
    delete_essential_ability = function () {
        var name = $(this).data('name');
        $('#delete_ea_name').val(name);
        $('#delete_ea_dialog').modal('show');
        return false;
    };

    /**
     * Confirm that the user intended to remove a Ki or Nemesis Ability by
     * clicking on it.
     */
    delete_ki_ability_init = function () {
        create_dialog('delete_ki_ability_dialog', 'Remove this ki ability?',
                      'No', 'Yes', function () {
            var data = characters.current(),
                level = $('#delete_ki_ability_level').val(),
                name = $('#delete_ki_ability_name').val(),
                options = $('#delete_ki_ability_options').val();
            if (options) {
                options = options.split(',');
                $.each(options, function (i, option) {
                    options[i] = $.trim(option);
                });
            }
            data.remove_ki_ability(name, level, options);
            $.publish('level_data_changed');
            $('#delete_ki_ability_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Configure and launch the Ki/Nemesis Ability deletion confirmation
     * dialog.
     */
    delete_ki_ability = function () {
        var self = $(this),
            level = self.data('level'),
            name = self.find('.name').text(),
            option = self.find('.options');
        $('#delete_ki_ability_level').val(level);
        $('#delete_ki_ability_name').val(name);
        if (option) {
            option = option.text();
        }
        $('#delete_ki_ability_options').val(option);
        $('#delete_ki_ability_dialog').modal('show');
        return false;
    };

    /**
     * Initialize the martial art deletion confirmation dialog.
     */
    delete_martial_art_init = function () {
        create_dialog('delete_martial_art_dialog',
                      'Remove this martial art degree?', 'No', 'Yes',
                      function () {
            var data = characters.current(),
                level = $('#delete_martial_art_level').val(),
                name = $('#delete_martial_art_name').val(),
                degree = $('#delete_martial_art_degree').val();
            data.remove_martial_art(name, degree, level);
            $.publish('level_data_changed');
            $('#delete_martial_art_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Confirm that the user meant to remove a martial art by clicking on it.
     */
    delete_martial_art = function (name, level) {
        var data = characters.current(),
            degrees = data.level_info(level).DP[name],
            degree = degrees[degrees.length - 1];
        $('#delete_martial_art_level').val(level);
        $('#delete_martial_art_name').val(name);
        $('#delete_martial_art_degree').val(degree);
        $('#delete_martial_art_dialog').modal('show');
        return false;
    };

    /**
     * Initialize the Module deletion confirmation dialog.
     */
    delete_module_init = function () {
        create_dialog('delete_module_dialog', 'Remove this module?', 'No',
                      'Yes', function () {
            var data = characters.current(),
                level = $('#delete_module_level').val(),
                name = $('#delete_module_name').val();
            delete data.level_info(level).DP[name];
            $.publish('level_data_changed');
            $('#delete_module_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Confirm that the user meant to remove a Module by clicking on it.
     */
    delete_power = function (name, level) {
        $('#delete_module_level').val(level);
        $('#delete_module_name').val(name);
        $('#delete_module_dialog').modal('show');
        return false;
    };

    /**
     * Initialize the Power deletion confirmation dialog.
     */
    delete_power_init = function () {
        create_dialog('delete_power_dialog', 'Remove this Power?', 'No',
                      'Yes', function () {
            var data = characters.current(),
                level = $('#delete_power_level').val(),
                name = $('#delete_power_name').val();
            delete data.level_info(level).DP[name];
            $.publish('level_data_changed');
            $('#delete_power_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Confirm that the user meant to remove a simple Power by clicking on it.
     */
    delete_power = function (name, level) {
        $('#delete_power_level').val(level);
        $('#delete_power_name').val(name);
        $('#delete_power_dialog').modal('show');
        return false;
    };

    /**
     * Initialize the dialog for creation points gained from a disadvantage.
     */
    disadvantage_benefit_init = function () {
        create_dialog('disadvantage_benefit_dialog',
                      'Gain how many creation points from it?', 'Cancel',
                      'OK', function () {
            var name = $('#disadvantage_benefit_name').val(),
                disadvantage = disadvantages[name],
                benefit = parseInt($('input:radio[name=disadvantage_benefit]:checked').val(), 10),
                data = characters.current();
            if ('Options' in disadvantage) {
                $('#disadvantage_benefit_dialog').modal('hide');
                edit_disadvantage_option(name, benefit);
            }
            else {
                data.Disadvantages[name] = benefit;
                $.publish('cp_changed');
                $('#disadvantage_benefit_dialog').modal('hide');
            }
            return false;
        });
    };

    /**
     * Initialize the dialog for configuring the parameters of a disadvantage.
     */
    disadvantage_option_init = function () {
        create_dialog('disadvantage_option_dialog', '', 'Cancel', 'OK',
                      function () {
            var name = $('#disadvantage_option_name').val(),
                benefit = $('#disadvantage_option_benefit').val(),
                param,
                select = $('#disadvantage_option select'),
                data = characters.current();
            benefit = benefit ? parseInt(benefit, 10) : null;
            if (select.length > 0) {
                param = select.val();
            }
            else {
                param = $('#disadvantage_option input').val();
            }
            data.add_disadvantage(name, benefit, param);
            $.publish('cp_changed');
            $('#disadvantage_option_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Initialize the disadvantage selection dialog.
     */
    disadvantages_init = function () {
        var disadvantage,
            link,
            name;
        for (name in disadvantages) {
            if (disadvantages.hasOwnProperty(name)) {
                disadvantage = disadvantages[name];
                link = $('<a>', {href: '#'}).addClass('disadvantage').text(name);
                link.append('<br />');
                if (!('Category' in disadvantage)) {
                    $('#Common_Disadvantages').append(link);
                }
                else {
                    $('#' + disadvantage.Category + '_Disadvantages').append(link);
                }
            }
        }
        create_dialog('disadvantages_dialog', 'Select a disadvantage',
                      'Cancel');
    };

    /**
     * Initialize the Dominion Technique entry dialog.
     */
    dominion_technique_init = function () {
        create_dialog('dominion_technique_dialog', 'Enter a Dominion Technique',
                      'Cancel', 'OK', function () {
            var at_level = $('#dominion_character_level').val(),
                data = characters.current(),
                errors = [],
                level = $('#dominion_level').spinner('value'),
                mk = $('#dominion_mk').spinner('value'),
                name = $('#dominion_name').val(),
                tree = $('#dominion_tree').val();
            if (tree.length < 1) {
                errors.push('Tree is required');
            }
            if (name.length < 1) {
                errors.push('Name is required');
            }
            if (level === 1 && mk > 50) {
                errors.push('MK too high for a level 1 technique');
            }
            else if (level === 2 && mk < 20) {
                errors.push('MK too low for a level 2 technique');
            }
            else if (level === 2 && mk > 100) {
                errors.push('MK too high for a level 2 technique');
            }
            else if (level === 3 && mk < 30) {
                errors.push('MK too low for a level 3 technique');
            }
            if (errors.length > 0) {
                $('#dominion_technique_dialog .text-error').html(errors.join('<br />'));
            }
            else {
                data.add_dominion_technique(tree, name, level, mk, at_level);
                $.publish('level_data_changed');
                $('#dominion_technique_dialog').modal('hide');
            }
            return false;
        });
    };

    /**
     * Initialize the DP spending options dialog.
     */
    dp_init = function () {
        var ability,
            count,
            i,
            module,
            name,
            names = Object.keys(powers).sort(),
            parts,
            power,
            primary;
        for (name in primaries) {
            if (primaries.hasOwnProperty(name)) {
                primary = primaries[name];
                count = primary.length;
                for (i = 0; i < count; i++) {
                    ability = primary[i];
                    if (ability === 'Life Points') {
                        // share one link between Life Points and Life Point Multiples
                        continue;
                    }
                    parts = ['<a href="#" class="ability"><span class="name">',
                             ability,
                             '</span></a> (<span class="cost"></span>)<br />'];
                    if (ability in abilities && 'Field' in abilities[ability]) {
                        $('#DP_' + abilities[ability].Field).append(parts.join(''));
                    }
                    else {
                        if (name === 'Combat') {
                            name = 'Combat_Abilities';
                        }
                        $('#' + name).append(parts.join(''));
                    }
                }
            }
        }
        i = 1;
        for (name in modules) {
            if (modules.hasOwnProperty(name)) {
                module = modules[name];
                parts = ['<a href="#" class="add_module"><span class="name">',
                         name, '</span></a> (<span class="cost">', module.DP,
                         '</span>)<br />'];
                primary = module.Primary;
                if (primary === 'Combat') {
                    primary = 'Combat_Modules_' + ((i < 24) ? 1 : 2);
                }
                $('#' + primary).append(parts.join(''));
                i++;
            }
        }
        count = names.length;
        for (i = 0; i < count; i++) {
            name = names[i];
            power = powers[name];
            parts = ['<a href="#" class="power"><span class="type">', name,
                     '</span></a> (<span class="cost"></span>)<br />'];
            $('#Powers').append(parts.join(''));
        }
        create_dialog('dp_dialog', 'Spend DP on...', 'Cancel');
    };

    /**
     * Initialize the dialog for selecting an Essential Ability for a creature.
     */
    ea_advantages_init = function () {
        var advantage,
            advantages = essential_abilities.advantages,
            link,
            name,
            text;
        for (name in advantages) {
            if (advantages.hasOwnProperty(name)) {
                advantage = advantages[name];
                link = $('<a>', {href: '#'}).addClass('essential_ability').text(name);
                text = ' (' + advantage.DP + ', Gnosis ' + advantage.Gnosis + '+)<br />';
                if (!('Category' in advantage)) {
                    $('#EA_Common_Advantages').append(link).append(text);
                }
                else {
                    $('#EA_' + advantage.Category + '_Advantages').append(link).append(text);
                }
            }
        }
        create_dialog('ea_advantages_dialog', 'Select an essential ability',
                      'Cancel');
    };

    /**
     * Initialize the dialog for selecting an Essential Ability disadvantage
     * for a creature.
     */
    ea_disadvantages_init = function () {
        var name,
            disadvantage,
            disadvantages = essential_abilities.disadvantages,
            link,
            text;
        for (name in disadvantages) {
            if (disadvantages.hasOwnProperty(name)) {
                disadvantage = disadvantages[name];
                link = $('<a>', {href: '#'}).addClass('essential_ability').text(name);
                text = ' (' + (-disadvantage.DP) + ', Gnosis ' + disadvantage.Gnosis + '+)<br />';
                if (!('Category' in disadvantage)) {
                    $('#EA_Common_Disadvantages').append(link).append(text);
                }
                else {
                    $('#EA_' + disadvantage.Category + '_Disadvantages').append(link).append(text);
                }
            }
        }
        create_dialog('ea_disadvantages_dialog', 'Select an essential ability disadvantage',
                      'Cancel');
    };

    /**
     * Initialize the dialog for setting the parameters for an Essential
     * Ability.
     */
    ea_option_init = function () {
        create_dialog('ea_option_dialog', '', 'Cancel', 'OK', function () {
            var data = characters.current(),
                name = $('#ea_option_name').val(),
                param,
                select = $('#ea_option select');
            if (select.length > 0) {
                param = select.val();
            }
            else {
                param = $('#ea_option input').val();
            }
            data.add_essential_ability(name, param);
            $.publish('essential_abilities_changed');
            $('#ea_option_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Configure and launch the dialog for selecting the number of Creation
     * Points to spend on an advantage.
     */
    edit_advantage_cost = function (name) {
        var data = characters.current(),
            advantage = advantages[name],
            category = ('Category' in advantage) ? advantage.Category : 'Common',
            remaining = data.cp_remaining(category),
            options = advantages[name].Cost;
        $('#advantage_cost_name').val(name);
        if (category !== 'Common') {
            remaining += data.cp_remaining('Common');
        }
        $.each([1, 2, 3], function (i, cost) {
            if (cost > remaining || $.inArray(cost, options) === -1) {
                $('.advantage_cost_' + cost).hide();
            }
            else {
                $('.advantage_cost_' + cost).show();
            }
        });
        $('#advantage_cost_' + options[0]).click();
        $('#advantage_cost_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the dialog for setting the parameters of an
     * advantage.
     */
    edit_advantage_options = function (name, cost) {
        var advantage = advantages[name],
            data,
            input,
            options,
            panel = $('#advantage_options'),
            select;
        $('#advantage_options_name').val(name);
        $('#advantage_options_cost').val(cost ? cost : '');

        panel.html('');
        options = advantage.Options;
        if (options.length === 0) {
            input = $('<input>', {type: 'text', value: ''}).addClass('form-control required');
            panel.append(input);
        }
        else {
            select = $('<select>').addClass('form-control');
            data = characters.current();
            $.each(options, function (i, option) {
                if (data.advantage_allowed(name, option)) {
                    select.append($('<option>', {value: option}).text(option));
                }
            });
            panel.append(select);
            if (name === 'Repeat a Characteristics Roll') {
                panel.append($('<br />'));
                panel.append($('<label>', {'for': 'repeat_roll'}).text('New Roll '));
                panel.append($('<div id="repeat_roll" class="spinner"></div>'));
            }
        }
        $('#advantage_options_dialog .modal-header h4').text(advantage.Option_Title);
        $('#advantage_options_dialog').modal('show');
        create_spinner('#repeat_roll', {min: 4, max: 10, value: 5});
        return false;
    };

    /**
     * Configure and launch the Characteristic bonus selection dialog.
     */
    edit_characteristic_bonus = function () {
        var level = $(this).data('level'),
            data = characters.current(),
            index = (level === 0) ? 0 : level - 1;
        $('#dialog_level').val(level);
        if ('Characteristic' in data.levels[index]) {
            $('#Characteristic').val(data.levels[index].Characteristic);
        }
        else {
            $('#Characteristic').val('STR');
        }
        $('#characteristic_bonus_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the class change dialog.
     */
    edit_class = function () {
        var data = characters.current(),
            level = $(this).data('level');
        $('#class_dialog_level').text(level);
        $('#Class').val(data.levels[level === 0 ? 0 : level - 1].Class);
        $('#class_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the dialog for selecting how many creation points
     * to gain from a disadvantage.
     */
    edit_disadvantage_benefit = function (name) {
        $('#disadvantage_benefit_name').val(name);
        $('#disadvantage_benefit_1').click();
        $('#disadvantage_benefit_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the dialog for setting the parameters of a
     * disadvantage.
     */
    edit_disadvantage_option = function (name, benefit) {
        var disadvantage = disadvantages[name],
            panel,
            options,
            input,
            data,
            select;
        $('#disadvantage_option_name').val(name);
        $('#disadvantage_option_benefit').val(benefit ? benefit : '');
        panel = $('#disadvantage_option');
        panel.html('');
        options = disadvantage.Options;
        if (options.length === 0) {
            input = $('<input>', {type: 'text', value: ''}).addClass('form-control required');
            panel.append(input);
        }
        else {
            data = characters.current();
            select = $('<select>').addClass('form-control');
            $.each(options, function (i, option) {
                if (data.disadvantage_allowed(name, option)) {
                    select.append($('<option>', {value: option}).text(option));
                }
            });
            panel.append(select);
        }
        $('#disadvantage_option_dialog h4').text(disadvantage.Option_Title);
        $('#disadvantage_option_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the dialog for setting the parameters of an
     * Essential Ability.
     */
    edit_ea_option = function (name) {
        var ability,
            advantages = essential_abilities.advantages,
            data,
            input,
            options,
            panel = $('#ea_option'),
            select;
        if (name in advantages) {
            ability = advantages[name];
        }
        else {
            ability = essential_abilities.disadvantages[name];
        }
        $('#ea_option_name').val(name);

        panel.html('');
        options = ability.Options;
        if (options.length === 0) {
            input = $('<input>', {type: 'text', value: ''}).addClass('form-control required');
            panel.append(input);
        }
        else {
            select = $('<select>').addClass('form-control');
            data = characters.current();
            $.each(options, function (i, option) {
                if (data.essential_ability_allowed(name, option)) {
                    select.append($('<option>', {value: option}).text(option));
                }
            });
            panel.append(select);
        }
        $('#ea_option_dialog h4').text(ability.Option_Title);
        $('#ea_option_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the dialog for selecting which Secondary Ability to
     * put a Freelancer bonus into.
     */
    edit_freelancer_bonus = function () {
        var data = characters.current(),
            link = $(this),
            level = parseInt(link.data('level'), 10),
            level_info = data.level_info(level),
            bonuses = level_info.Freelancer,
            name = link.text();
        if (name === '+') {
            name = '';
        }
        $('#freelancer_name').val(name);
        $('#freelancer_level').val(level);
        $('#Freelancer a').each(function () {
            name = $(this).text();
            if (bonuses && $.inArray(name, bonuses) >= 0) {
                link.addClass('disabled');
            }
            else {
                link.removeClass('disabled');
            }
        });
        $('#freelancer_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the dialog for setting or changing Magic Projection
     * Imbalance.
     */
    edit_mp_imbalance = function () {
        var adjacent_value,
            data = characters.current(),
            imbalances = data.magic_projection_imbalances(),
            count = imbalances.length,
            level = $(this).data('level'),
            index = (level === 0) ? 0 : level - 1,
            min = -30,
            max = 30,
            spinner,
            value = imbalances[index];
        $('#mp_imbalance_level').val(level);
        if (index > 0) {
            adjacent_value = imbalances[index - 1];
            if (typeof adjacent_value === 'number') {
                min = Math.max(min, adjacent_value - 10);
                max = Math.min(max, adjacent_value + 10);
            }
        }
        if (index < count - 1) {
            adjacent_value = imbalances[index + 1];
            min = Math.max(min, adjacent_value - 10);
            max = Math.min(max, adjacent_value + 10);
        }
        if ($('#mp_imbalance_dialog .spinner-buttons').length) {
            spinner = $('#mp_imbalance');
            spinner.spinner('min', min);
            spinner.spinner('max', max);
            spinner.spinner('value', value);
        }
        else {
            create_spinner('#mp_imbalance', {min: -30, max: 30, value: value});
        }
        $('#mp_imbalance_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the Natural Bonus selection dialog.
     */
    edit_natural_bonus = function () {
        var level = $(this).data('level'),
            modifier,
            name,
            ability,
            parts,
            data = characters.current();
        $('#natural_bonus_level').val(level);
        $.each(tables.fields, function (i, field) {
            $('#NB_' + field).html('');
        });
        for (name in abilities) {
            if (abilities.hasOwnProperty(name)) {
                ability = abilities[name];
                if (!('Field' in ability)) {
                    continue;
                }
                modifier = data.modifier(ability.Characteristic, level);
                if (modifier <= 0) {
                    $('#NB_' + ability.Field).append(name + '<br />');
                }
                else {
                    parts = ['<a href="#" class="set_natural_bonus" data-name="', name, '">', name, ' +', modifier, '</a><br />'];
                    $('#NB_' + ability.Field).append(parts.join(''));
                }
            }
        }
        $('#natural_bonus_dialog').modal('show');
        return false;
    };

    /**
     * Initialize the dialog for selecting a Secondary Ability to put a
     * Freelancer bonus into.
     */
    freelancer_init = function () {
        var ability,
            i,
            other = primaries.Other,
            count = other.length,
            parts;
        for (i = 0; i < count; i++) {
            ability = other[i];
            parts = ['<a href="#" class="freelancer">', ability, '</a><br />'];
            if (ability in abilities && 'Field' in abilities[ability]) {
                $('#Freelancer_' + abilities[ability].Field).append(parts.join(''));
            }
        }
        create_dialog('freelancer_dialog', 'Add Freelancer bonus to...',
                      'Cancel');
        
    };

    /**
     * Initialize the dialog for selecting Ki Ability parameters.
     */
    ki_ability_options_init = function () {
        create_dialog('ki_ability_options_dialog', '', 'Cancel', 'OK',
                      function () {
            var data = characters.current(),
                level = parseInt($('#ki_ability_options_level').val(), 10),
                name = $('#ki_ability_options_name').val(),
                option;
            option = $('#ki_ability_options select').val();
            data.add_ki_ability(name, level, option);
            $('#ki_ability_options_dialog').modal('hide');
            $.publish('level_data_changed');
            return false;
        });
    };

    /**
     * Initialize the dialog for selecting which Characteristic to attach a
     * purchased Accumulation Multiple or Ki Point to.
     */
    ki_characteristic_init = function () {
        create_dialog('ki_characteristic_dialog', 'For which characteristic?',
                      'Cancel', 'OK', function () {
            var available = parseInt($('#ki_characteristic_available').val(), 10),
                characteristic = $('#Ki_Characteristic').val(),
                level = parseInt($('#ki_characteristic_level').val(), 10),
                name = $('#ki_characteristic_name').val();
            $('#ki_characteristic_dialog').modal('hide');
            return set_ability_dp(name, level, available, characteristic);
        });
    };

    /**
     * Prepare and launch the dialog for loading character data.
     */
    load = function () {
        $('#load_text').val('');
        $('#load_dialog').modal('show');
        $('#load_text').focus();
        return false;
    };

    /**
     * Initialize the dialog for loading character data.
     */
    load_character_init = function () {
        create_dialog('load_dialog', 'Load Character', 'Cancel', 'OK',
                      function () {
            var attr,
                character = characters.current(),
                data = JSON.parse($('#load_text').val());
            if (data) {
                character.clear();
                for (attr in data) {
                    if (data.hasOwnProperty(attr)) {
                        character[attr] = data[attr];
                    }
                }
                $.publish('data_loaded');
            }
            $('#load_dialog').modal('hide');
            return false;
        });
        $('#load_dialog').on('shown.bs.modal', function () {
            $('#load_text').focus();
        });
    };

    /**
     * Initialize the MK spending options dialog.
     */
    mk_init = function () {
        var ability,
            link,
            name,
            uon = 'Use of Nemesis';
        for (name in ki_abilities) {
            if (ki_abilities.hasOwnProperty(name)) {
                ability = ki_abilities[name];
                link = ['<a href="#" class="add_ki_ability"><span class="name">',
                        name, '</span></a> (', ability.MK, ')<br />'].join('');
                if (name === uon || ('Requirements' in ability && $.inArray(uon, ability.Requirements) !== -1)) {
                    $('#Nemesis_Abilities').append(link);
                }
                else {
                    $('#Ki_Abilities').append(link);
                }
            }
        }
        create_dialog('mk_dialog', 'Select a Ki Ability or Dominion Technique',
                      'Cancel');
    };

    /**
     * Initialize the dialog for setting the parameters of a Combat Module.
     */
    module_options_init = function () {
        create_dialog('module_options_dialog', '', 'Cancel', 'OK',
                      function () {
            var data = characters.current(),
                level = parseInt($('#module_options_level').val(), 10),
                name = $('#module_options_name').val(),
                option,
                select;
            select = $('#module_options select');
            if (select.length > 0) {
                option = select.val();
            }
            else {
                option = $('#module_options input').val();
            }
            data.add_module(name, level, option);
            $('#module_options_dialog').modal('hide');
            $.publish('level_data_changed');
            return false;
        });
    };

    /**
     * Initialize the dialog for changing the Magic Projection Imbalance.
     */
    mp_imbalance_init = function () {
        create_dialog('mp_imbalance_dialog',
                      'Magic Projection Imbalance', 'Cancel',
                      'OK', function () {
            var data = characters.current(),
                imbalance = $('#mp_imbalance').spinner('value'),
                level = parseInt($('#mp_imbalance_level').val(), 10),
                level_info = data.level_info(level);
            level_info['Magic Projection Imbalance'] = imbalance;
            // later values will update on the following render when
            // magic_projection_imbalances() is called
            $('#mp_imbalance_dialog').modal('hide');
            $.publish('level_data_changed');
            return false;
        });
    };

    /**
     * Initialize the Natural Bonus selection dialog.
     */
    natural_bonus_init = function () {
        create_dialog('natural_bonus_dialog', 'Select an ability to improve',
                      'Cancel');
    };

    /**
     * Initialize the dialog for configuring the parameters of a creature power.
     */
    power_options_init = function () {
        create_dialog('power_options_dialog', '', 'Cancel', 'OK',
                      function () {
            var count,
                level = parseInt($('#power_options_level').val(), 10),
                data,
                i,
                option,
                options,
                params = {Name: $('#power_options_name').val()},
                type = $('#power_options_type').val();
            options = $('#power_options input[type="text"], #power_options select');
            count = options.length;
            for (i = 0; i < count; i++) {
                option = options.eq(i);
                params[option.attr('name')] = option.val();
            }
            options = $('#power_options input[type="checkbox"]:checked');
            count = options.length;
            for (i = 0; i < count; i++) {
                params[option.attr('name')] = true;
            }
            data = characters.current();
            data.add_power(type, level, params);
            $.publish('level_data_changed');
            $('#power_options_dialog').modal('hide');
            return false;
        });
    };

    /**
     * Prepare and launch the dialog for saving character data.
     */
    save = function () {
        var data = characters.current();
        $('#save_text').val(JSON.stringify(data, null, 2));
        $('#save_dialog').modal('show');
        return false;
    };

    /**
     * Initialize the dialog for displaying character data for saving.
     */
    save_character_init = function () {
        create_dialog('save_dialog', 'Save Character', 'OK');
        $('#save_dialog').on('shown.bs.modal', function () {
            $('#save_text').focus().select();
        });
    };

    /**
     * Prompt the user for the number of DP to spend on an ability.
     * @method module:character#set_ability_dp
     * @param {String} name The name of the ability
     * @param {Number} level The character level being edited
     * @param {Number} available The number of unallocated DP which could be
     *     spent on this ability
     * @param {String} [characteristic] The name of the characteristic for Ki
     *     Points and Accumulation Multiples
     */
    set_ability_dp = function (name, level, available, characteristic) {
        var ability = abilities[name],
            count,
            data = characters.current(),
            dropdown,
            i,
            level_info = data.level_info(level),
            cls = level_info.Class,
            cost = data.dp_cost(name, cls),
            max = Math.floor(available / cost) * cost,
            parent = $('#ability_dp_parent'),
            purchased = level_info.DP[name],
            specialization,
            specializations,
            start = max;
        if (characteristic && purchased) {
            // Accumulation Multiples and Ki Points are by characteristic
            purchased = purchased[characteristic];
        }
        if (purchased) {
            // Add in any amount already spent this level; show the total
            start = purchased * cost;
            max += start;
        }
        $('#ability_name').text(name);
        // Specifically convert to Boolean; toggle takes many types of args
        $('#ability_details').toggle(characteristic ? true : false);
        $('#ability_characteristic').text(characteristic ? characteristic : '');
        $('#ability_cost').val(cost);
        $('#ability_level').val(level);
        $('#ability_limit').text('' + max);
        if (name.indexOf('Save ') === 0) {
            $('#ability_primary').text(primaries.for_ability(name));
            $('#ability_spend').hide();
            $('#ability_save').show();
        }
        else {
            $('#ability_save').hide();
            $('#ability_spend').show();
        }
        // Configure the specialization selector
        if (ability) {
            specializations = ability.specializations;
        }
        if (specializations) {
            dropdown = $('#ability_specialization .dropdown-menu');
            dropdown.html('');
            count = specializations.length;
            for (i = 0; i < count; i++) {
                dropdown.append('<li><a href="#">' + specializations[i] + '</a></li>');
            }
            specializations = data.Specializations;
            if (specializations) {
                specialization = specializations[name];
                if (specialization) {
                    $('#ability_specialization input').val(specialization);
                }
                else {
                    $('#ability_specialization input').val('');
                }
            }
            $('#specialization_label, #ability_specialization').show();
        }
        else {
            $('#ability_specialization input').val('');
            $('#specialization_label, #ability_specialization').hide();
        }
        // Show the dialog and recreate the spinner
        parent.html('');
        parent.append($('<div id="ability_dp" class="spinner"></div><br /><br />'));
        $('#ability_dp_dialog').modal('show');
        create_spinner('#ability_dp',
                       {min: 0, max: max, step: cost, value: start});
        return false;
    };

    /**
     * Process the selection of a Secondary Ability to put a Freelancer bonus
     * into.
     */
    set_freelancer_bonus = function () {
        var data = characters.current(),
            level = parseInt($('#freelancer_level').val(), 10),
            name = $(this).text(),
            previous = $('#freelancer_name').val();
        data.set_freelancer_bonus(level, name, previous);
        $('#freelancer_dialog').modal('hide');
        $.publish('level_data_changed');
        return false;
    };

    /**
     * Process a selection from the Natural Bonus dialog.
     */
    set_natural_bonus = function () {
        var name = $(this).data('name'),
            level = parseInt($('#natural_bonus_level').val(), 10),
            data = characters.current();
        data.set_natural_bonus(level, name);
        $('#natural_bonus_dialog').modal('hide');
        $.publish('level_data_changed');
        return false;
    };

    /**
     * Configure and launch the DP spending options dialog.
     */
    spend_dp = function () {
        var ability,
            art,
            arts,
            available,
            cap,
            cost,
            count,
            data = characters.current(),
            degree,
            dr = data['Damage Resistance'],
            i,
            j,
            level = $(this).data('level'),
            index = level === 0 ? 0 : level - 1,
            cls = data.levels[index].Class,
            remaining = data.dp_remaining(),
            limits = remaining[index],
            links,
            link_count,
            link,
            name,
            names,
            new_ma_allowed = data.new_martial_art_allowed(level),
            parts,
            power,
            primary,
            type;
        $('#Other a:contains("Life Point") .name').text(dr ? 'Life Points' : 'Life Point Multiple');
        for (name in primaries) {
            if (primaries.hasOwnProperty(name)) {
                available = limits[name === 'Other' ? 'Total' : name];
                primary = primaries[name];
                count = primary.length;
                for (i = 0; i < count; i++) {
                    ability = primary[i];
                    links = $('#dp_tabs a:contains("' + ability + '")');
                    // Check for false matches like "Attack" & "Area Attack"
                    link_count = links.size();
                    for (j = 0; j < link_count; j++) {
                        link = links.eq(j);
                        if (link.text() === ability) {
                            cost = data.dp_cost(ability, cls);
                            link.next('.cost').text(cost);
                            cap = available;
                            if (ability in limits) {
                                cap = limits[ability];
                            }
                            link.data('available', cap);
                            link.data('level', level);
                            if (cost > cap) {
                                link.addClass('disabled');
                            }
                            else {
                                link.removeClass('disabled');
                            }
                        }
                    }
                }
            }
        }
        arts = data.martial_arts();
        names = Object.keys(martial_arts).sort();
        count = names.length;
        available = limits.Combat;
        $('#Basic_Martial_Arts').html('');
        $('#Advanced_Martial_Arts').html('');
        for (i = 0; i < count; i++) {
            name = names[i];
            art = martial_arts[name];
            type = ('Supreme' in art ? 'Basic' : 'Advanced');
            if (!(name in arts)) {
                // Haven't started it yet
                degree = 'Base';
            }
            else {
                degree = arts[name].Degree;
                if (degree === 'Supreme' || degree === 'Arcane') {
                    // Already done with it
                    $('#' + type + '_Martial_Arts').append(name + '<br />');
                    continue;
                }
                if (type === 'Advanced') {
                    // This is the only one left in this case
                    degree = 'Arcane';
                }
                else if (degree === 'Advanced') {
                    degree = 'Supreme';
                }
                else {
                    degree = 'Advanced';
                }
            }
            cost = data.dp_cost(name, cls, degree);
            if (cost <= available && data.martial_art_allowed(name, degree, level) && (new_ma_allowed || degree !== 'Base')) {
                parts = ['<a href="#" class="add_martial_art" data-level="',
                         level, '"><span class="name">', name,
                         '</span> [<span class="degree">', degree,
                         '</span>]</a> (', cost, ')<br />'];
            }
            else {
                parts = [name, ' [', degree, '] (', cost, ')<br />'];
            }
            $('#' + type + '_Martial_Arts').append(parts.join(''));
        }
        for (name in modules) {
            if (modules.hasOwnProperty(name)) {
                ability = modules[name];
                available = limits[ability.Primary];
                links = $('#dp_tabs a:contains("' + name + '")');
                // Check for false matches like "Attack" & "Area Attack"
                link_count = links.size();
                for (i = 0; i < link_count; i++) {
                    link = links.eq(i);
                    if (link.text() === name) {
                        cost = ability.DP;
                        link.next('.cost').text(cost);
                        link.data('available', available);
                        link.data('level', level);
                        if (cost > available) {
                            link.addClass('disabled');
                        }
                        else {
                            link.removeClass('disabled');
                        }
                    }
                }
            }
        }
        for (name in powers) {
            if (powers.hasOwnProperty(name)) {
                power = powers[name];
                available = limits.Powers;
                link = $('#dp_tabs a:contains("' + name + '")');
                cost = data.power_upgrade_cost(name, level);
                link.next('.cost').text(cost === 0 ? 'N/A' : cost);
                link.data('available', available);
                link.data('level', level);
                if (cost === 0 || cost > available) {
                    link.addClass('disabled');
                }
                else {
                    link.removeClass('disabled');
                }
            }
        }
        $('#dp_dialog').modal('show');
        return false;
    };

    /**
     * Configure and launch the MK spending options dialog.
     */
    spend_mk = function () {
        var ability,
            count,
            data = characters.current(),
            level = $(this).data('level'),
            i = level === 0 ? 0 : level - 1,
            j,
            links,
            link,
            name,
            options,
            option_count,
            remaining = data.mk_remaining()[i] + 50, // Insufficient Martial Knowledge rule
            requirements;
        for (name in ki_abilities) {
            if (ki_abilities.hasOwnProperty(name)) {
                ability = ki_abilities[name];
                links = $('#mk_tabs a:contains("' + name + '")');
                // Check for false matches like "Magnitude" & "Arcane Magnitude"
                count = links.size();
                for (i = 0; i < count; i++) {
                    link = links.eq(i);
                    if (link.text() === name) {
                        link.removeClass('disabled');
                        link.data('level', level);
                        if (ability.MK > remaining) {
                            link.addClass('disabled');
                        }
                        else if (data.has_ki_ability(name)) {
                            if ('Options' in ability) {
                                options = ability.Options;
                                option_count = options.length;
                                link.addClass('disabled');
                                for (j = 0; j < option_count; j++) {
                                    if (!data.has_ki_ability(name, options[j])) {
                                        link.removeClass('disabled');
                                    }
                                }
                            }
                            else {
                                link.addClass('disabled');
                            }
                        }
                        else if ('Requirements' in ability) {
                            requirements = ability.Requirements;
                            option_count = requirements.length;
                            for (j = 0; j < option_count; j++) {
                                if (!data.has_ki_ability(requirements[j], null, level)) {
                                    link.addClass('disabled');
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        $('#add_dominion_technique').data('available', remaining);
        $('#add_dominion_technique').data('level', level);
        $('#mk_dialog').modal('show');
        return false;
    };

    /**
     * Update the list of bonuses in the Cultural Roots configuration dialog
     * to match the current background selection.
     */
    update_cultural_roots = function () {
        $('#cultural_roots').html('');
        var parts,
            background = $('#cultural_roots_background').val(),
            bonuses = cultural_roots[background],
            ability,
            amount,
            specialty,
            bonus;
        for (bonus in bonuses) {
            if (bonus === 'choices') {
                $.each(bonuses[bonus], add_cultural_roots_choice);
            }
            else {
                ability = bonus;
                parts = [ability];
                amount = bonuses[bonus];
                if ($.isPlainObject(amount)) {
                    specialty = Object.keys(amount)[0];
                    parts.push(' (');
                    parts.push(specialty);
                    parts.push(')');
                    amount = amount[specialty];
                }
                parts.push(' +');
                parts.push(amount);
                parts.push('<br />');
                $('#cultural_roots').append(parts.join(''));
            }
        }
    };

    /**
     * Initialize the dialog for adding XP to a character.
     */
    xp_dialog_init = function () {
        create_dialog('xp_dialog', 'Add Experience Points', 'Cancel',
                      'OK', function () {
            var data = characters.current(),
                added = $('#xp_added').spinner('value');
            data.XP += added;
            $('#XP').spinner('value', data.XP);
            $.publish('level_data_changed');
            $('#xp_dialog').modal('hide');
            return false;
        });
    };
  
    $(document).ready(function () {
        ability_dp_init();
        advantage_cost_init();
        advantage_options_init();
        advantages_init();
        characteristic_bonus_init();
        class_init();
        cultural_roots_init();
        delete_advantage_init();
        delete_disadvantage_init();
        delete_dominion_technique_init();
        delete_ea_init();
        delete_ki_ability_init();
        delete_martial_art_init();
        delete_module_init();
        delete_power_init();
        disadvantage_benefit_init();
        disadvantage_option_init();
        disadvantages_init();
        dominion_technique_init();
        dp_init();
        ea_advantages_init();
        ea_disadvantages_init();
        ea_option_init();
        freelancer_init();
        ki_ability_options_init();
        ki_characteristic_init();
        load_character_init();
        mk_init();
        module_options_init();
        mp_imbalance_init();
        natural_bonus_init();
        power_options_init();
        save_character_init();
        xp_dialog_init();
        $('#add_advantage').click(add_advantage);
        $('#add_disadvantage').click(add_disadvantage);
        $('#add_dominion_technique').click(add_dominion_technique);
        $('#add_xp').click(add_xp);
        $(document).on('click', '#advantages_tabs a.advantage', configure_advantage);
        $(document).on('click', '#disadvantages_tabs a.disadvantage', configure_disadvantage);
        $('#add_ea_advantage').click(add_ea_advantage);
        $('#add_ea_disadvantage').click(add_ea_disadvantage);
        $(document).on('click', 'a.ability', configure_ability);
        $(document).on('click', 'a.add_martial_art', add_martial_art);
        $(document).on('click', 'a.add_module', add_module);
        $(document).on('click', 'a.edit_class', edit_class);
        $(document).on('click', 'a.freelancer_bonus', edit_freelancer_bonus);
        $(document).on('click', 'a.essential_ability', configure_essential_ability);
        $(document).on('click', 'a.characteristic_bonus', edit_characteristic_bonus);
        $(document).on('click', 'a.add_ki_ability', add_ki_ability);
        $(document).on('click', 'a.delete_dominion_technique', delete_dominion_technique);
        $(document).on('click', 'a.delete_ki_ability', delete_ki_ability);
        $(document).on('click', 'a.mp_imbalance', edit_mp_imbalance);
        $(document).on('click', 'a.natural_bonus', edit_natural_bonus);
        $(document).on('click', 'a.power', configure_power);
        $(document).on('click', 'a.set_natural_bonus', set_natural_bonus);
        $(document).on('click', 'a.spend_dp', spend_dp);
        $(document).on('click', 'a.spend_mk', spend_mk);
        $(document).on('click', '#Advantages a', delete_advantage);
        $(document).on('click', '#Disadvantages a', delete_disadvantage);
        $(document).on('click', '#ea_advantages a', delete_essential_ability);
        $(document).on('click', '#ea_disadvantages a', delete_essential_ability);
        $(document).on('click', '#Freelancer a', set_freelancer_bonus);
        $('#save_button').click(save);
        $('#load_button').click(load);
    });

    return dialogs;
});
