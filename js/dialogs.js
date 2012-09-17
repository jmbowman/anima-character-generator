/*global define: false, document: false */
define(['jquery', 'abilities', 'advantages', 'characters', 'cultural_roots',
'disadvantages', 'essential_abilities', 'modules', 'powers', 'primaries',
'tables', 'creation_points', 'development_points', 'jqueryui/dialog',
'jqueryui/tabs', 'pubsub'],
function ($, abilities, advantages, characters, cultural_roots, disadvantages,
          essential_abilities, modules, powers, primaries, tables) {

    var ability_dp_init,
        add_advantage,
        add_cultural_roots_choice,
        add_disadvantage,
        add_ea_advantage,
        add_ea_disadvantage,
        add_xp,
        advantage_cost_init,
        advantage_options_init,
        advantages_init,
        characteristic_bonus_init,
        class_init,
        configure_advantage,
        configure_disadvantage,
        configure_essential_ability,
        configure_module,
        cultural_roots_init,
        delete_advantage,
        delete_advantage_init,
        delete_disadvantage,
        delete_disadvantage_init,
        delete_ea_init,
        delete_essential_ability,
        dialogs = {},
        disadvantage_benefit_init,
        disadvantage_option_init,
        disadvantages_init,
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
        edit_natural_bonus,
        load,
        load_character_init,
        module_options_init,
        natural_bonus_init,
        power_options_init,
        save,
        save_character_init,
        set_ability_dp,
        set_natural_bonus,
        spend_dp,
        update_cultural_roots,
        xp_dialog_init;
    
    ability_dp_init = function () {
        if ('Ability_DP' in dialogs) {
            return;
        }
        dialogs.Ability_DP = $('#ability_dp_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '400px',
            buttons: {
                OK: function () {
                    var data = characters.current(),
                        cost = parseInt($('#ability_cost').val(), 10),
                        dp = $('#ability_dp').spinner('value'),
                        level = parseInt($('#ability_level').val(), 10),
                        level_info = data.level_info(level),
                        name = $('#ability_name').text();
                    if (dp) {
                        level_info.DP[name] = dp / cost;
                        $.publish('level_data_changed');
                    }
                    else if (name in level_info.DP) {
                        delete level_info.DP[name];
                        $.publish('level_data_changed');
                    }
                    dialogs.Ability_DP.dialog('close');
                },
                Cancel: function () {
                    dialogs.Ability_DP.dialog('close');
                }
            }
        });
    };

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
        dialogs.Advantages.dialog('open');
        return false;
    };

    add_cultural_roots_choice = function (i, choice) {
        var ability,
            amount,
            option,
            parts = ['<select>'],
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
        dialogs.Disadvantages.dialog('open');
        return false;
    };

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
        dialogs.Essential_Advantages.dialog('open');
        return false;
    };

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
        dialogs.Essential_Disadvantages.dialog('open');
        return false;
    };

    add_xp = function () {
        dialogs.Add_XP.dialog('open');
        return false;
    };
  
    advantage_cost_init = function () {
        if ('Advantage_Cost' in dialogs) {
            return;
        }
        dialogs.Advantage_Cost = $('#advantage_cost_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '400px',
            buttons: {
                'OK': function () {
                    var advantage,
                        cost = parseInt($('input:radio[name=advantage_cost]:checked').val(), 10),
                        data,
                        name = $('#advantage_cost_name').val();
                    advantage = advantages[name];
                    if ('Options' in advantage) {
                        dialogs.Advantage_Cost.dialog('close');
                        edit_advantage_options(name, cost);
                    }
                    else {
                        data = characters.current();
                        data.Advantages[name] = cost;
                        $.publish('cp_changed');
                        dialogs.Advantage_Cost.dialog('close');
                    }
                },
                'Cancel': function () {
                    dialogs.Advantage_Cost.dialog('close');
                }
            }
        });
    };

    advantage_options_init = function () {
        if ('Advantage_Options' in dialogs) {
            return;
        }
        dialogs.Advantage_Options = $('#advantage_options_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '400px',
            buttons: {
                OK: function () {
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
                        roll = parseInt($('#repeat_roll').val(), 10);
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
                    dialogs.Advantage_Options.dialog('close');
                },
                Cancel: function () {
                    dialogs.Advantage_Options.dialog('close');
                }
            }
        });
    };
  
    advantages_init = function () {
        var advantage,
            column = 1,
            count = 1,
            link,
            name;
        if ('Advantages' in dialogs) {
            return;
        }
        $('#advantages_tabs').tabs();
        for (name in advantages) {
            if (advantages.hasOwnProperty(name)) {
                advantage = advantages[name];
                link = $('<a>', {href: '#'}).addClass('advantage').text(name);
                link.append('<br />');
                if (!('Category' in advantage)) {
                    $('#Common_Advantages_' + column).append(link);
                    count++;
                    if (count > 20) {
                        column += 1;
                        count = 1;
                    }
                }
                else {
                    $('#' + advantage.Category + '_Advantages').append(link);
                }
            }
        }
        dialogs.Advantages = $('#advantages_dialog').dialog({
            autoOpen: false,
            modal: true,
            title: 'Select an advantage',
            width: '1000px',
            position: 'top',
            buttons: {
                'Cancel': function () {
                    dialogs.Advantages.dialog('close');
                }
            }
        });
    };

    characteristic_bonus_init = function () {
        if ('Characteristic_Bonus' in dialogs) {
            return;
        }
        dialogs.Characteristic_Bonus = $('#characteristic_bonus_dialog').dialog({
            autoOpen: false,
            modal: true,
            title: 'Select the characteristic to increase',
            width: '350px',
            buttons: {
                OK: function () {
                    var data = characters.current(),
                        level = parseInt($('#dialog_level').val(), 10);
                    data.levels[level - 1].Characteristic = $('#Characteristic').val();
                    dialogs.Characteristic_Bonus.dialog('close');
                    $.publish('level_data_changed');
                },
                Cancel: function () {
                    dialogs.Characteristic_Bonus.dialog('close');
                }
            }
        });
    };
  
    class_init = function () {
        if ('Class' in dialogs) {
            return;
        }
        dialogs.Class = $('#class_dialog').dialog({
            autoOpen: false,
            modal: true,
            title: 'Select class for level <span id="class_dialog_level"></span>',
            buttons: {
                OK: function () {
                    var data = characters.current(),
                        level = parseInt($('#class_dialog_level').text(), 10);
                    data.change_class(level, $('#Class').val());
                    dialogs.Class.dialog('close');
                    $.publish('level_data_changed');
                },
                Cancel: function () {
                    dialogs.Class.dialog('close');
                }
            }
        });
    };

    configure_advantage = function () {
        var name = $.trim($(this).text()),
            data = characters.current(),
            advantage = advantages[name];
        if (!data.advantage_allowed(name, null)) {
            return false;
        }
        dialogs.Advantages.dialog('close');

        if (name === 'Cultural Roots') {
            dialogs.Cultural_Roots.dialog('open');
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

    configure_disadvantage = function () {
        var name = $.trim($(this).text()),
            data = characters.current(),
            disadvantage = disadvantages[name];
        
        if (!data.disadvantage_allowed(name, null)) {
            return false;
        }
        dialogs.Disadvantages.dialog('close');

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

    configure_essential_ability = function () {
        var ability,
            data = characters.current(),
            name = $.trim($(this).text());
        if (!data.essential_ability_allowed(name, null)) {
            return false;
        }
        if (name in essential_abilities.advantages) {
            ability = essential_abilities.advantages[name];
            dialogs.Essential_Advantages.dialog('close');
        }
        else {
            ability = essential_abilities.disadvantages[name];
            dialogs.Essential_Disadvantages.dialog('close');
        }
        if ('Options' in ability) {
            return edit_ea_option(name);
        }
        data.add_essential_ability(name);
        $.publish('essential_abilities_changed');
        return false;
    };

    configure_module = function (name, level) {
        // summary:
        //         Prompt for any option required by a module being purchased,
        //         otherwise just add it to the specified level.
        // name: String
        //         The name of the combat module
        // level: Integer
        //         The level at which the module is being obtained
        var data = characters.current(),
            input,
            module = modules[name],
            multiple = module.Option_Title,
            options,
            panel,
            select;
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
            input = $('<input>', {type: 'text', value: ''}).addClass('required');
            panel.append(input);
        }
        else {
            select = $('<select>');
            $.each(options, function (i, option) {
                if (!data.has_module(name, option)) {
                    select.append($('<option>', {value: option}).text(option));
                }
            });
            panel.append(select);
        }
        dialogs.Module_Options.dialog('option', 'title', module.Option_Title);
        dialogs.Module_Options.dialog('open');
        return false;
    };
  
    cultural_roots_init = function () {
        var name,
            parts = [];
        if ('Cultural_Roots' in dialogs) {
            return;
        }
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
        dialogs.Cultural_Roots = $('#cultural_roots_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '450px',
            buttons: {
                OK: function () {
                    var background = $('#cultural_roots_background').val(),
                        params = {Background: background, Choices: []},
                        data = characters.current();
                    $('#cultural_roots select').each(function (i, select) {
                        params.Choices.push($(select).val());
                    });

                    data.add_advantage('Cultural Roots', 1, params);
                    $.publish('cp_changed');
                    dialogs.Cultural_Roots.dialog('close');
                },
                Cancel: function () {
                    dialogs.Cultural_Roots.dialog('close');
                }
            }
        });
    };

    delete_advantage = function () {
        var name = $(this).data('name');
        $('#delete_advantage_name').val(name);
        dialogs.Delete_Advantage.dialog('open');
        return false;
    };
  
    delete_advantage_init = function () {
        if ('Delete_Advantage' in dialogs) {
            return;
        }
        dialogs.Delete_Advantage = $('#delete_advantage_dialog').dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                Yes: function () {
                    var name = $('#delete_advantage_name').val(),
                        data = characters.current();
                    delete data.Advantages[name];
                    $.publish('cp_changed');
                    dialogs.Delete_Advantage.dialog('close');
                },
                No: function () {
                    dialogs.Delete_Advantage.dialog('close');
                }
            }
        });
    };

    delete_disadvantage = function () {
        var name = $(this).data('name');
        $('#delete_disadvantage_name').val(name);
        dialogs.Delete_Disadvantage.dialog('open');
        return false;
    };
  
    delete_disadvantage_init = function () {
        if ('Delete_Disadvantage' in dialogs) {
            return;
        }
        dialogs.Delete_Disadvantage = $('#delete_disadvantage_dialog').dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                Yes: function () {
                    var name = $('#delete_disadvantage_name').val(),
                        data = characters.current();
                    delete data.Disadvantages[name];
                    $.publish('cp_changed');
                    dialogs.Delete_Disadvantage.dialog('close');
                },
                No: function () {
                    dialogs.Delete_Disadvantage.dialog('close');
                }
            }
        });
    };
  
    delete_ea_init = function () {
        if ('Delete_Essential_Ability' in dialogs) {
            return;
        }
        dialogs.Delete_Essential_Ability = $('#delete_ea_dialog').dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                Yes: function () {
                    var name = $('#delete_ea_name').val(),
                        data = characters.current();
                    delete data.levels[0].DP[name];
                    $.publish('essential_abilities_changed');
                    dialogs.Delete_Essential_Ability.dialog('close');
                },
                No: function () {
                    dialogs.Delete_Essential_Ability.dialog('close');
                }
            }
        });
    };

    delete_essential_ability = function () {
        var name = $(this).data('name');
        $('#delete_ea_name').val(name);
        dialogs.Delete_Essential_Ability.dialog('open');
        return false;
    };
  
    disadvantage_benefit_init = function () {
        if ('Disadvantage_Benefit' in dialogs) {
            return;
        }
        dialogs.Disadvantage_Benefit = $('#disadvantage_benefit_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '400px',
            buttons: {
                OK: function () {
                    var name = $('#disadvantage_benefit_name').val(),
                        disadvantage = disadvantages[name],
                        benefit = parseInt($('input:radio[name=disadvantage_benefit]:checked').val(), 10),
                        data = characters.current();
                    if ('Options' in disadvantage) {
                        dialogs.Disadvantage_Benefit.dialog('close');
                        edit_disadvantage_option(name, benefit);
                    }
                    else {
                        data.Disadvantages[name] = benefit;
                        $.publish('cp_changed');
                        dialogs.Disadvantage_Benefit.dialog('close');
                    }
                },
                Cancel: function () {
                    dialogs.Disadvantage_Benefit.dialog('close');
                }
            }
        });
    };
  
    disadvantage_option_init = function () {
        if ('Disadvantage_Option' in dialogs) {
            return;
        }
        dialogs.Disadvantage_Option = $('#disadvantage_option_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '400px',
            buttons: {
                OK: function () {
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
                    dialogs.Disadvantage_Option.dialog('close');
                },
                Cancel: function () {
                    dialogs.Disadvantage_Option.dialog('close');
                }
            }
        });
    };
  
    disadvantages_init = function () {
        if ('Disadvantages' in dialogs) {
            return;
        }
        $('#disadvantages_tabs').tabs();
        var column = 1,
            count = 1,
            name,
            disadvantage,
            link;
        for (name in disadvantages) {
            if (disadvantages.hasOwnProperty(name)) {
                disadvantage = disadvantages[name];
                link = $('<a>', {href: '#'}).addClass('disadvantage').text(name);
                link.append('<br />');
                if (!('Category' in disadvantage)) {
                    $('#Common_Disadvantages_' + column).append(link);
                    count++;
                    if (count > 12) {
                        column += 1;
                        count = 1;
                    }
                }
                else {
                    $('#' + disadvantage.Category + '_Disadvantages').append(link);
                }
            }
        }
        dialogs.Disadvantages = $('#disadvantages_dialog').dialog({
            autoOpen: false,
            modal: true,
            title: 'Select a disadvantage',
            width: '1000px',
            position: 'top',
            buttons: {
                'Cancel': function () {
                    dialogs.Disadvantages.dialog('close');
                }
            }
        });
    };
  
    dp_init = function () {
        var ability,
            count,
            i,
            module,
            name,
            parts,
            primary;
        if ('DP' in dialogs) {
            return;
        }
        $('#dp_tabs').tabs();
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
                parts = ['<a href="#" class="ability"><span class="name">',
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
        dialogs.DP = $('#dp_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '1010px',
            position: 'top',
            buttons: {
                Cancel: function () {
                    dialogs.DP.dialog('close');
                }
            }
        });
    };
  
    ea_advantages_init = function () {
        var advantage,
            advantages = essential_abilities.advantages,
            column = 1,
            count = 1,
            link,
            name,
            text;
        if ('Essential_Advantages' in dialogs) {
            return;
        }
        $('#ea_advantages_tabs').tabs();
        for (name in advantages) {
            if (advantages.hasOwnProperty(name)) {
                advantage = advantages[name];
                link = $('<a>', {href: '#'}).addClass('essential_ability').text(name);
                text = ' (' + advantage.DP + ', Gnosis ' + advantage.Gnosis + '+)<br />';
                if (!('Category' in advantage)) {
                    $('#EA_Common_Advantages_' + column).append(link).append(text);
                    count++;
                    if (count > 19) {
                        column += 1;
                        count = 1;
                    }
                }
                else {
                    $('#EA_' + advantage.Category + '_Advantages').append(link).append(text);
                }
            }
        }
        dialogs.Essential_Advantages = $('#ea_advantages_dialog').dialog({
            autoOpen: false,
            modal: true,
            title: 'Select an essential ability',
            width: '1000px',
            position: 'top',
            buttons: {
                'Cancel': function () {
                    dialogs.Essential_Advantages.dialog('close');
                }
            }
        });
    };
  
    ea_disadvantages_init = function () {
        if ('Essential_Disadvantages' in dialogs) {
            return;
        }
        $('#ea_disadvantages_tabs').tabs();
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
        dialogs.Essential_Disadvantages = $('#ea_disadvantages_dialog').dialog({
            autoOpen: false,
            modal: true,
            title: 'Select an essential ability',
            width: '1000px',
            position: 'top',
            buttons: {
                'Cancel': function () {
                    dialogs.Essential_Disadvantages.dialog('close');
                }
            }
        });
    };

    ea_option_init = function () {
        if ('Essential_Ability_Option' in dialogs) {
            return;
        }
        dialogs.Essential_Ability_Option = $('#ea_option_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '400px',
            buttons: {
                OK: function () {
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
                    dialogs.Essential_Ability_Option.dialog('close');
                },
                Cancel: function () {
                    dialogs.Essential_Ability_Option.dialog('close');
                }
            }
        });
    };

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
        dialogs.Advantage_Cost.dialog('open');
    };

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
            input = $('<input>', {type: 'text', value: ''}).addClass('required');
            panel.append(input);
        }
        else {
            select = $('<select>');
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
                panel.append($('<input>', {id: 'repeat_roll', type: 'text', value: ''}).addClass('required digits two-digit'));
            }
        }
        dialogs.Advantage_Options.dialog('option', 'title', advantage.Option_Title);
        dialogs.Advantage_Options.dialog('open');
        $('#repeat_roll').spinner({min: 4, max: 10});
        return false;
    };

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
        dialogs.Characteristic_Bonus.dialog('open');
        return false;
    };

    edit_class = function () {
        var data = characters.current(),
            level = $(this).data('level');
        $('#class_dialog_level').text(level);
        $('#Class').val(data.levels[level === 0 ? 0 : level - 1].Class);
        dialogs.Class.dialog('open');
        return false;
    };

    edit_disadvantage_benefit = function (name) {
        $('#disadvantage_benefit_name').val(name);
        $('#disadvantage_benefit_1').click();
        dialogs.Disadvantage_Benefit.dialog('open');
    };

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
            input = $('<input>', {type: 'text', value: ''}).addClass('required');
            panel.append(input);
        }
        else {
            data = characters.current();
            select = $('<select>');
            $.each(options, function (i, option) {
                if (data.disadvantage_allowed(name, option)) {
                    select.append($('<option>', {value: option}).text(option));
                }
            });
            panel.append(select);
        }
        dialogs.Disadvantage_Option.dialog('option', 'title', disadvantage.Option_Title);
        dialogs.Disadvantage_Option.dialog('open');
        return false;
    };

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
            input = $('<input>', {type: 'text', value: ''}).addClass('required');
            panel.append(input);
        }
        else {
            select = $('<select>');
            data = characters.current();
            $.each(options, function (i, option) {
                if (data.essential_ability_allowed(name, option)) {
                    select.append($('<option>', {value: option}).text(option));
                }
            });
            panel.append(select);
        }
        dialogs.Essential_Ability_Option.dialog('option', 'title', ability.Option_Title);
        dialogs.Essential_Ability_Option.dialog('open');
        return false;
    };

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
        dialogs.Natural_Bonus.dialog('open');
    };
    
    load = function () {
        $('#load_text').val('');
        dialogs.Load_Character.dialog('open');
        return false;
    };

    load_character_init = function () {
        if ('Load_Character' in dialogs) {
            return;
        }
        dialogs.Load_Character = $('#load_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '450px',
            buttons: {
                OK: function () {
                    var attr,
                        character = characters.current(),
                        data = JSON.parse($('#load_text').val());
                    if (data) {
                        for (attr in data) {
                            if (data.hasOwnProperty(attr)) {
                                character[attr] = data[attr];
                            }
                        }
                        $.publish('data_loaded');
                    }
                    dialogs.Load_Character.dialog('close');
                },
                Cancel: function () {
                    dialogs.Load_Character.dialog('close');
                }
            }
        });
    };

    module_options_init = function () {
        if ('Module_Options' in dialogs) {
            return;
        }
        dialogs.Module_Options = $('#module_options_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '400px',
            buttons: {
                OK: function () {
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
                    dialogs.Module_Options.dialog('close');
                    $.publish('level_data_changed');
                },
                Cancel: function () {
                    dialogs.Module_Options.dialog('close');
                }
            }
        });
    };
  
    natural_bonus_init = function () {
        if ('Natural_Bonus' in dialogs) {
            return;
        }
        dialogs.Natural_Bonus = $('#natural_bonus_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '1000px',
            buttons: {
                Cancel: function () {
                    dialogs.Natural_Bonus.dialog('close');
                }
            }
        });
    };

    power_options_init = function () {
        if ('Power_Options' in dialogs) {
            return;
        }
        dialogs.Power_Options = $('#power_options_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '400px',
            buttons: {
                OK: function () {
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
                    dialogs.Power_Options.dialog('close');
                },
                Cancel: function () {
                    dialogs.Power_Options.dialog('close');
                }
            }
        });
    };
    
    save = function () {
        var data = characters.current();
        $('#save_text').val(JSON.stringify(data, null, 2));
        dialogs.Save_Character.dialog('open');
        $('#save_text').select();
        return false;
    };

    save_character_init = function () {
        if ('Save_Character' in dialogs) {
            return;
        }
        dialogs.Save_Character = $('#save_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '450px',
            buttons: {
                OK: function () {
                    dialogs.Save_Character.dialog('close');
                }
            }
        });
    };
    
    set_ability_dp = function () {
        var link = $(this),
            available = parseInt(link.data('available'), 10),
            data = characters.current(),
            level = parseInt(link.data('level'), 10),
            level_info = data.level_info(level),
            cls = level_info.Class,
            name = link.find('.name').text(),
            cost = data.dp_cost(name, cls),
            max = Math.floor(available / cost) * cost,
            parent = $('#ability_dp_parent'),
            purchased = level_info.DP[name],
            start = max;
        dialogs.DP.dialog('close');
        if (name in modules) {
            return configure_module(name, level);
        }
        if (purchased) {
            // Add in any amount already spent this level; show the total
            start = purchased * cost;
            max += start;
        }
        $('#ability_name').text(name);
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
        parent.html('');
        parent.append($('<input>', {id: 'ability_dp', type: 'text', value: '' + start}));
        dialogs.Ability_DP.dialog('open');
        parent.find('input').spinner({min: 0, max: max, step: cost});
        return false;
    };

    set_natural_bonus = function () {
        var name = $(this).data('name'),
            level = parseInt($('#natural_bonus_level').val(), 10),
            data = characters.current();
        data.set_natural_bonus(level, name);
        dialogs.Natural_Bonus.dialog('close');
        $.publish('level_data_changed');
        return false;
    };

    spend_dp = function () {
        var ability,
            available,
            cap,
            cost,
            count,
            data = characters.current(),
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
            primary;
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
        dialogs.DP.dialog('open');
        return false;
    };
    
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
    
    xp_dialog_init = function () {
        if ('Add_XP' in dialogs) {
            return;
        }
        dialogs.Add_XP = $('#xp_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '400px',
            buttons: {
                OK: function () {
                    var data = characters.current(),
                        added = $('#xp_added').spinner('value');
                    data.XP += added;
                    $('#XP').spinner('value', data.XP);
                    $.publish('level_data_changed');
                    dialogs.Add_XP.dialog('close');
                },
                Cancel: function () {
                    dialogs.Add_XP.dialog('close');
                }
            },
            open: function () {
                if ($('#xp_dialog').find('.ui-spinner').length) {
                    $('#xp_added').spinner('value', 0);
                }
                else {
                    $('#xp_added').spinner({min: 0, max: 9999});
                }
            }
        });
    };
  
    $(document).ready(function () {
        ability_dp_init();
        advantages_init();
        advantage_cost_init();
        advantage_options_init();
        characteristic_bonus_init();
        class_init();
        cultural_roots_init();
        delete_advantage_init();
        delete_disadvantage_init();
        disadvantages_init();
        disadvantage_benefit_init();
        disadvantage_option_init();
        dp_init();
        ea_advantages_init();
        ea_disadvantages_init();
        ea_option_init();
        load_character_init();
        module_options_init();
        natural_bonus_init();
        save_character_init();
        xp_dialog_init();
        $('#add_advantage').click(add_advantage);
        $('#add_disadvantage').click(add_disadvantage);
        $('#add_xp').click(add_xp);
        $('#advantages_tabs a.advantage').live('click', configure_advantage);
        $('#disadvantages_tabs a.disadvantage').live('click', configure_disadvantage);
        $('#add_ea_advantage').click(add_ea_advantage);
        $('#add_ea_disadvantage').click(add_ea_disadvantage);
        $('a.ability').live('click', set_ability_dp);
        $('a.edit_class').live('click', edit_class);
        $('a.essential_ability').live('click', configure_essential_ability);
        $('a.characteristic_bonus').live('click', edit_characteristic_bonus);
        $('a.natural_bonus').live('click', edit_natural_bonus);
        $('a.set_natural_bonus').live('click', set_natural_bonus);
        $('a.spend_dp').live('click', spend_dp);
        $('#Advantages a').live('click', delete_advantage);
        $('#Disadvantages a').live('click', delete_disadvantage);
        $('#ea_advantages a').live('click', delete_essential_ability);
        $('#ea_disadvantages a').live('click', delete_essential_ability);
        $('#save_button').click(save);
        $('#load_button').click(load);
    });

    return dialogs;
});
