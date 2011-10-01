/*global define: false */
define(['jquery', 'abilities', 'advantages', 'characters', 'cultural_roots',
'disadvantages', 'primaries', 'tables', 'creation_points', 'development_points',
'jqueryui/dialog', 'jqueryui/tabs', 'pubsub'], function ($, abilities,
advantages, characters, cultural_roots, disadvantages, primaries, tables) {

    var dialogs = {},
        add_cultural_roots_choice,
        advantages_init,
        advantage_cost_init;

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
                        cost = $('input:radio[name=advantage_cost]:checked').val(),
                        data,
                        name = $('#advantage_cost_name').val();
                    advantage = advantages[name];
                    if ('Options' in advantage) {
                        dialogs.Advantage_Cost.dialog('close');
                        dialogs.edit_advantage_options(name, cost);
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
  
  var advantage_options_init = function () {
    if ('Advantage_Options' in dialogs) {
      return;
    }
    dialogs.Advantage_Options = $('#advantage_options_dialog').dialog({
      autoOpen: false,
      modal: true,
      width: '400px',
      buttons: {
        OK: function () {
          var name = $('#advantage_options_name').val();
          var cost = $('#advantage_options_cost').val();
          cost = cost ? parseInt(cost, 10) : null;
          var params;
          if (name == 'Repeat a Characteristics Roll') {
            var characteristic = $('#advantage_options select').val();
            var roll = parseInt($('#repeat_roll').val(), 10);
            if (isNaN(roll)) {
              roll = 5;
            }
            params = {Characteristic: characteristic, Roll: roll};
          }
          else {
            var select = $('#advantage_options select');
            if (select.length > 0) {
              params = select.val();
            }
            else {
              params = $('#advantage_options input').val();
            }
          }
          var data = characters.current();
          data.add_advantage(name, cost, params);
          $.publish('cp_changed');
          dialogs.Advantage_Options.dialog('close');      
        },
        Cancel: function() {
          dialogs.Advantage_Options.dialog('close');
        }
      }
    });
  };
  
  var characteristic_bonus_init = function () {
    if ('Characteristic_Bonus' in dialogs) {
      return;
    }
    dialogs.Characteristic_Bonus = $('#characteristic_bonus_dialog').dialog({
      autoOpen: false,
      modal: true,
      title: 'Select the characteristic to increase',
      width: '350px',
      buttons: {
        OK: function() {
          var level = parseInt($('#dialog_level').val(), 10);
          var data = characters.current();
          data.levels[level - 1].Characteristic = $('#Characteristic').val();
          dialogs.Characteristic_Bonus.dialog('close');
          $.publish('level_data_changed');
        },
        Cancel: function() {
          dialogs.Characteristic_Bonus.dialog('close');
        }
      }
    });
  };
  
  var class_init = function () {
    if ('Class' in dialogs) {
      return;
    }
    dialogs.Class = $('#class_dialog').dialog({
      autoOpen: false,
      modal: true,
      title: 'Select class for level <span id="class_dialog_level"></span>',
      buttons: {
        OK: function() {
          var level = parseInt($('#class_dialog_level').text(), 10);
          var data = characters.current();
          data.change_class(level, $('#Class').val());
          dialogs.Class.dialog('close');
          $.publish('level_data_changed');
        },
        Cancel: function() {
          dialogs.Class.dialog('close');
        }
      }
    });
  };
  
  var cultural_roots_init = function () {
    if ('Cultural_Roots' in dialogs) {
      return;
    }
    var parts = [];
    for (var name in cultural_roots) {
      parts.push('<option value="');
      parts.push(name);
      parts.push('">');
      parts.push(name);
      parts.push('</option>\n');
    }
    $('#cultural_roots_background').html(parts.join(''));
    $('#cultural_roots_background').change(dialogs.update_cultural_roots);
    dialogs.update_cultural_roots();
    dialogs.Cultural_Roots = $('#cultural_roots_dialog').dialog({
      autoOpen: false,
      modal: true,
      width: '450px',
      buttons: {
        OK: function() {
          var background = $('#cultural_roots_background').val();
          var params = {Background: background, Choices: []};
          $('#cultural_roots select').each(function(i, select) {
            params.Choices.push($(select).val());
          });
          var data = characters.current();
          data.add_advantage('Cultural Roots', 1, params);
          $.publish('cp_changed');
          dialogs.Cultural_Roots.dialog('close');
        },
        Cancel: function() {
          dialogs.Cultural_Roots.dialog('close');
        }
      }
    });  
  };
  
  var delete_advantage_init = function () {
    if ('Delete_Advantage' in dialogs) {
      return;
    }
    dialogs.Delete_Advantage = $('#delete_advantage_dialog').dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Yes: function() {
          var name = $('#delete_advantage_name').val();
          var data = characters.current();
          delete data.Advantages[name];
          $.publish('cp_changed');
          dialogs.Delete_Advantage.dialog('close');
        },
        No: function() {
          dialogs.Delete_Advantage.dialog('close');
        }
      }
    });
  };
  
  var delete_disadvantage_init = function () {
    if ('Delete_Disadvantage' in dialogs) {
      return;
    }
    dialogs.Delete_Disadvantage = $('#delete_disadvantage_dialog').dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Yes: function() {
          var name = $('#delete_disadvantage_name').val();
          var data = characters.current();
          delete data.Disadvantages[name];
          $.publish('cp_changed');
          dialogs.Delete_Disadvantage.dialog('close');
        },
        No: function() {
          dialogs.Delete_Disadvantage.dialog('close');
        }
      }
    });
  };
  
  var disadvantages_init = function () {
    if ('Disadvantages' in dialogs) {
      return;
    }
    $('#disadvantages_tabs').tabs();
    var column = 1;
    var count = 1;
    var name;
    var disadvantage;
    var link;
    for (name in disadvantages) {
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
    dialogs.Disadvantages = $('#disadvantages_dialog').dialog({
      autoOpen: false,
      modal: true,
      title: 'Select a disadvantage',
      width: '1000px',
      position: 'top',
      buttons: {
        'Cancel': function() {
          dialogs.Disadvantages.dialog('close');
        }
      }
    });
  };
  
  var disadvantage_benefit_init = function () {
    if ('Disadvantage_Benefit' in dialogs) {
      return;
    }
    dialogs.Disadvantage_Benefit = $('#disadvantage_benefit_dialog').dialog({
      autoOpen: false,
      modal: true,
      width: '400px',
      buttons: {
        OK: function() {
          var name = $('#disadvantage_benefit_name').val();
          var disadvantage = disadvantages[name];
          var benefit = $('input:radio[name=disadvantage_benefit]:checked').val();
          if ('Options' in disadvantage) {
            dialogs.Disadvantage_Benefit.dialog('close');
            dialogs.edit_disadvantage_option(name, benefit);
          }
          else {
            var data = characters.current();
            data.Disadvantages[name] = benefit;
            $.publish('cp_changed');
            dialogs.Disadvantage_Benefit.dialog('close');
          }
        },
        Cancel: function() {
          dialogs.Disadvantage_Benefit.dialog('close');
        }
      }
    });
  };
  
  var disadvantage_option_init = function () {
    if ('Disadvantage_Option' in dialogs) {
      return;
    }
    dialogs.Disadvantage_Option = $('#disadvantage_option_dialog').dialog({
      autoOpen: false,
      modal: true,
      width: '400px',
      buttons: {
        OK: function() {
          var name = $('#disadvantage_option_name').val();
          var benefit = $('#disadvantage_option_benefit').val();
          benefit = benefit ? parseInt(benefit, 10) : null;
          var param;
          var select = $('#disadvantage_option select');
          if (select.length > 0) {
            param = select.val();
          }
          else {
            param = $('#disadvantage_option input').val();
          }
          var data = characters.current();
          data.add_disadvantage(name, benefit, param);
          $.publish('cp_changed');
          dialogs.Disadvantage_Option.dialog('close');      
        },
        Cancel: function() {
          dialogs.Disadvantage_Option.dialog('close');
        }
      }
    });
  };
  
  var dp_init = function () {
    if ('DP' in dialogs) {
      return;
    }
    $('#dp_tabs').tabs();
    var name, primary, i, parts, ability;
    for (name in primaries) {
      if (primaries.hasOwnProperty(name)) {
        primary = primaries[name];
        for (i = 0; i < primary.length; i++) {
          ability = primary[i];
          parts = ['<a href="#" class="ability">', ability,
                   '</a> (<span class="cost"></span>)<br />'];
          if (ability in abilities && 'Field' in abilities[ability]) {
            $('#DP_' + abilities[ability].Field).append(parts.join(''));
          }
          else {
            $('#' + name).append(parts.join(''));
          }
        }
      }
    }
    dialogs.DP = $('#dp_dialog').dialog({
      autoOpen: false,
      modal: true,
      width: '1010px',
      position: 'top',
      buttons: {
        'Cancel': function() {
          dialogs.DP.dialog('close');
        }
      }
    });
  };
  
  var natural_bonus_init = function () {
    if ('Natural_Bonus' in dialogs) {
      return;
    }
    dialogs.Natural_Bonus = $('#natural_bonus_dialog').dialog({
      autoOpen: false,
      modal: true,
      width: '1000px',
      buttons: {
        Cancel: function() {
          dialogs.Natural_Bonus.dialog('close');
        }
      }
    });
  };

  var set_natural_bonus = function () {
    var name = $(this).data('name');
    var level = parseInt($('#natural_bonus_level').val(), 10);
    var data = characters.current();
    data.set_natural_bonus(level, name);
    dialogs.Natural_Bonus.dialog('close');
    $.publish('level_data_changed');
    return false;
  };

  dialogs.update_cultural_roots = function () {
    $('#cultural_roots').html('');
    var parts;
    var background = $('#cultural_roots_background').val();
    var bonuses = cultural_roots[background];
    var ability;
    var amount;
    var specialty;
    for (var bonus in bonuses) {
      if (bonus == 'choices') {
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

  dialogs.add_advantage = function () {
    var data = characters.current();
    for (var name in advantages) {
      var link = $('#advantages_tabs a:contains("' + name + '")');
      if (data.advantage_allowed(name, null)) {
        link.removeClass('disabled');
      }
      else {
        link.addClass('disabled');
      }
    }
    dialogs.Advantages.dialog('open');
    return false;
  };

  dialogs.add_disadvantage = function () {
    var data = characters.current();
    for (var name in disadvantages) {
      var link = $('#disadvantages_tabs a:contains("' + name + '")');
      if (data.disadvantage_allowed(name, null)) {
        link.removeClass('disabled');
      }
      else {
        link.addClass('disabled');
      }
    }
    dialogs.Disadvantages.dialog('open');
    return false;
  };

  dialogs.configure_advantage = function () {
    var name = $.trim($(this).text());
    var data = characters.current();
    if (!data.advantage_allowed(name, null)) {
      return false;
    }
    dialogs.Advantages.dialog('close');
    var advantage = advantages[name];
    if (name == 'Cultural Roots') {
      dialogs.Cultural_Roots.dialog('open');
      return false;
    }
    if ($.isArray(advantage.Cost)) {
      return dialogs.edit_advantage_cost(name);
    }
    if ('Options' in advantage) {
      return dialogs.edit_advantage_options(name, null);
    }
    data.Advantages[name] = advantage.Cost;
    $.publish('cp_changed');
    return false;
  };

  dialogs.configure_disadvantage = function () {
    var name = $.trim($(this).text());
    var data = characters.current();
    if (!data.disadvantage_allowed(name, null)) {
      return false;
    }
    dialogs.Disadvantages.dialog('close');
    var disadvantage = disadvantages[name];
    if ($.isArray(disadvantage.Benefit)) {
      return dialogs.edit_disadvantage_benefit(name);
    }
    if ('Options' in disadvantage) {
      return dialogs.edit_disadvantage_option(name, null);
    }
    data.Disadvantages[name] = disadvantage.Benefit;
    $.publish('cp_changed');
    return false;
  };

  dialogs.delete_advantage = function () {
    var name = $(this).data('name');
    $('#delete_advantage_name').val(name);
    dialogs.Delete_Advantage.dialog('open');
    return false;
  };

  dialogs.delete_disadvantage = function () {
    var name = $(this).data('name');
    $('#delete_disadvantage_name').val(name);
    dialogs.Delete_Disadvantage.dialog('open');
    return false;
  };

  dialogs.edit_advantage_cost = function (name) {
    var data = characters.current();
    $('#advantage_cost_name').val(name);
    var advantage = advantages[name];
    var category = ('Category' in advantage) ? advantage.Category : 'Common';
    var remaining = data.cp_remaining(category);
    if (category != 'Common') {
      remaining += data.cp_remaining('Common');
    }
    var options = advantages[name].Cost;
    $.each([1, 2, 3], function(i, cost) {
      if (cost > remaining || options.indexOf(cost) == -1) {
        $('.advantage_cost_' + cost).hide();
      }
      else {
        $('.advantage_cost_' + cost).show();
      }
    });
    $('#advantage_cost_' + options[0]).click();
    this.Advantage_Cost.dialog('open');
  };

  dialogs.edit_advantage_options = function (name, cost) {
    var advantage = advantages[name];
    $('#advantage_options_name').val(name);
    $('#advantage_options_cost').val(cost ? cost : '');
    var panel = $('#advantage_options');
    panel.html('');
    options = advantage.Options;
    if (options.length === 0) {
      var input = $('<input>', {type: 'text', value: ''}).addClass('required');
      panel.append(input);
    }
    else {
      var select = $('<select>');
      var data = characters.current();
      $.each(options, function(i, option) {
        if (data.advantage_allowed(name, option)) {
          select.append($('<option>', {value: option}).text(option));
        }
      });
      panel.append(select);
      if (name == 'Repeat a Characteristics Roll') {
        panel.append($('<br />'));
        panel.append($('<label>', {'for': 'repeat_roll'}).text('New Roll '));
        panel.append($('<input>', {id: 'repeat_roll', type: 'text', value: ''}).addClass('required digits two-digit'));
      }
    }
    this.Advantage_Options.dialog('option', 'title', advantage.Option_Title);
    this.Advantage_Options.dialog('open');
    return false;
  };

  dialogs.edit_class = function () {
    var data = characters.current();
    var level = $(this).data('level');
    $('#class_dialog_level').text(level);
    $('#Class').val(data.levels[level === 0 ? 0 : level - 1].Class);
    dialogs.Class.dialog('open');
    return false;
  };

  dialogs.edit_characteristic_bonus = function () {
    var level = $(this).data('level');
    $('#dialog_level').val(level);
    var data = characters.current();
    var index = (level === 0) ? 0 : level - 1;
    if ('Characteristic' in data.levels[index]) {
      $('#Characteristic').val(data.levels[index].Characteristic);
    }
    else {
      $('#Characteristic').val('STR');
    }
    dialogs.Characteristic_Bonus.dialog('open');
    return false;
  };

  dialogs.edit_disadvantage_benefit = function (name) {
    $('#disadvantage_benefit_name').val(name);
    $('#disadvantage_benefit_1').click();
    this.Disadvantage_Benefit.dialog('open');
  };

  dialogs.edit_disadvantage_option = function (name, benefit) {
    var disadvantage = disadvantages[name];
    $('#disadvantage_option_name').val(name);
    $('#disadvantage_option_benefit').val(benefit ? benefit : '');
    var panel = $('#disadvantage_option');
    panel.html('');
    options = disadvantage.Options;
    if (options.length === 0) {
      var input = $('<input>', {type: 'text', value: ''}).addClass('required');
      panel.append(input);
    }
    else {
      var data = characters.current();
      var select = $('<select>');
      $.each(options, function(i, option) {
        if (data.disadvantage_allowed(name, option)) {
          select.append($('<option>', {value: option}).text(option));
        }
      });
      panel.append(select);
    }
    this.Disadvantage_Option.dialog('option', 'title', disadvantage.Option_Title);
    this.Disadvantage_Option.dialog('open');
    return false;
  };

  dialogs.edit_natural_bonus = function () {
    var level = $(this).data('level');
    $('#natural_bonus_level').val(level);
    $.each(tables.fields, function(i, field) {
      $('#NB_' + field).html('');
    });
    var modifier;
    var name;
    var ability;
    var parts;
    var data = characters.current();
    for (name in abilities) {
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
    dialogs.Natural_Bonus.dialog('open');
  };

  dialogs.spend_dp = function () {
    var level = $(this).data('level');
    var data = characters.current();
    var remaining = data.dp_remaining();
    var index = level === 0 ? 0 : level - 1;
    var limits = remaining[index];
    var cls = data.levels[index].Class;
    var primary, i, ability, available;
    for (primary in primaries) {
      if (primaries.hasOwnProperty(primary)) {
        available = limits[primary === 'Other' ? 'Total' : primary];
        for (i in primaries[primary]) {
          ability = primaries[primary][i];
          var link = $('#dp_tabs a:contains("' + ability + '")');
          link.next('.cost').text(data.cost(ability, cls));
          if (data.cost(ability, cls) > available) {
            link.addClass('disabled');
          }
          else {
            link.removeClass('disabled');
          }
        }
      }
    }
    dialogs.DP.dialog('open');
    return false;
  };

  $('a.set_natural_bonus').live('click', set_natural_bonus);
  
  $(document).ready(function () {
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
    natural_bonus_init();
    $('#add_advantage').click(dialogs.add_advantage);
    $('#add_disadvantage').click(dialogs.add_disadvantage);
    $('#advantages_tabs a.advantage').live('click', dialogs.configure_advantage);
    $('#disadvantages_tabs a.disadvantage').live('click', dialogs.configure_disadvantage);
  });

  return dialogs;
});
