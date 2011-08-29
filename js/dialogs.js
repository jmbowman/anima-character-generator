$dialogs = {};

create_dialogs = function() {
  var column = 1;
  var count = 1;
  var name;
  var link;
  var advantage;
  for (name in $advantages) {
    advantage = $advantages[name];
    link = $('<a>', {href: '#', onclick: "return configure_advantage('" + name + "');"});
    link.text(name);
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
  var parts = [];
  for (name in $cultural_roots) {
    parts.push('<option value="');
    parts.push(name);
    parts.push('">');
    parts.push(name);
    parts.push('</option>\n');
  }
  $('#cultural_roots_background').html(parts.join(''));
  $('#cultural_roots_background').change(update_cultural_roots);
  update_cultural_roots();
  column = 1;
  count = 1;
  var disadvantage;
  for (name in $disadvantages) {
    disadvantage = $disadvantages[name];
    link = $('<a>', {href: '#', onclick: "return configure_disadvantage('" + name + "');"});
    link.text(name);
    link.append('<br />');
    if (!('Category' in disadvantage)) {
      $('#Common_Disadvantages_' + column).append(link);
      count++;
      if (count > 17) {
        column += 1;
        count = 1;
      }
    }
    else {
      $('#' + disadvantage.Category + '_Disadvantages').append(link);
    }
  }
  $dialogs.Advantages = $('#advantages_dialog').dialog({
    autoOpen: false,
    modal: true,
    title: 'Select an advantage',
    width: '1000px',
    position: 'top',
    buttons: {
      'Cancel': function() {
        $dialogs.Advantages.dialog('close');
      }
    }
  });
  $dialogs.Advantage_Cost = $('#advantage_cost_dialog').dialog({
    autoOpen: false,
    modal: true,
    width: '400px',
    buttons: {
      'OK': function() {
        var name = $('#advantage_cost_name').val();
        var advantage = $advantages[name];
        var cost = $('input:radio[name=advantage_cost]:checked').val();
        if ('Options' in advantage) {
          $dialogs.Advantage_Cost.dialog('close');
          edit_advantage_options(name, cost);
        }
        else {
          $char.Advantages[name] = cost;
          update_cp();
          $dialogs.Advantage_Cost.dialog('close');
        }
      },
      'Cancel': function() {
        $dialogs.Advantage_Cost.dialog('close');
      }
    }
  });
  $dialogs.Advantage_Options = $('#advantage_options_dialog').dialog({
    autoOpen: false,
    modal: true,
    width: '400px',
    buttons: {
      OK: function() {
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
        $char.add_advantage(name, cost, params);
        update_cp();
        $dialogs.Advantage_Options.dialog('close');      
      },
      Cancel: function() {
        $dialogs.Advantage_Options.dialog('close');
      }
    }
  });
  $dialogs.Class = $('#class_dialog').dialog({
    autoOpen: false,
    modal: true,
    title: 'Select class for level <span id="class_dialog_level"></span>',
    buttons: {
      OK: function() {
        var level = parseInt($('#class_dialog_level').text(), 10);
        $char.change_class(level, $('#Class').val());
        $dialogs.Class.dialog('close');
        update_level();
      },
      Cancel: function() {
        $dialogs.Class.dialog('close');
      }
    }
  });
  $dialogs.Characteristic_Bonus = $('#characteristic_bonus_dialog').dialog({
    autoOpen: false,
    modal: true,
    title: 'Select the characteristic to increase',
    width: '350px',
    buttons: {
      OK: function() {
        var level = parseInt($('#dialog_level').val(), 10);
        $char.levels[level - 1].Characteristic = $('#Characteristic').val();
        $dialogs.Characteristic_Bonus.dialog('close');
        update_level();
      },
      Cancel: function() {
        $dialogs.Characteristic_Bonus.dialog('close');
      }
    }
  });
  $dialogs.Cultural_Roots = $('#cultural_roots_dialog').dialog({
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
        $char.add_advantage('Cultural Roots', 1, params);
        update_cp();
        $dialogs.Cultural_Roots.dialog('close');
      },
      Cancel: function() {
        $dialogs.Cultural_Roots.dialog('close');
      }
    }
  });
  $dialogs.Delete_Advantage = $('#delete_advantage_dialog').dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      Yes: function() {
        var name = $('#delete_advantage_name').val();
        delete $char.Advantages[name];
        update_cp();
        $dialogs.Delete_Advantage.dialog('close');
      },
      No: function() {
        $dialogs.Delete_Advantage.dialog('close');
      }
    }
  });
  $dialogs.Delete_Disadvantage = $('#delete_disadvantage_dialog').dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      Yes: function() {
        var name = $('#delete_disadvantage_name').val();
        delete $char.Disadvantages[name];
        update_cp();
        $dialogs.Delete_Disadvantage.dialog('close');
      },
      No: function() {
        $dialogs.Delete_Disadvantage.dialog('close');
      }
    }
  });
  $dialogs.Disadvantages = $('#disadvantages_dialog').dialog({
    autoOpen: false,
    modal: true,
    title: 'Select a disadvantage',
    width: '1000px',
    position: 'top',
    buttons: {
      'Cancel': function() {
        $dialogs.Disadvantages.dialog('close');
      }
    }
  });
  $dialogs.Disadvantage_Benefit = $('#disadvantage_benefit_dialog').dialog({
    autoOpen: false,
    modal: true,
    width: '400px',
    buttons: {
      OK: function() {
        var name = $('#disadvantage_benefit_name').val();
        var disadvantage = $disadvantages[name];
        var benefit = $('input:radio[name=disadvantage_benefit]:checked').val();
        if ('Options' in disadvantage) {
          $dialogs.Disadvantage_Benefit.dialog('close');
          edit_disadvantage_option(name, benefit);
        }
        else {
          $char.Disadvantages[name] = benefit;
          update_cp();
          $dialogs.Disadvantage_Benefit.dialog('close');
        }
      },
      Cancel: function() {
        $dialogs.Disadvantage_Benefit.dialog('close');
      }
    }
  });
  $dialogs.Disadvantage_Option = $('#disadvantage_option_dialog').dialog({
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
        $char.add_disadvantage(name, benefit, param);
        update_cp();
        $dialogs.Disadvantage_Option.dialog('close');      
      },
      Cancel: function() {
        $dialogs.Disadvantage_Option.dialog('close');
      }
    }
  });
  $dialogs.Natural_Bonus = $('#natural_bonus_dialog').dialog({
    autoOpen: false,
    modal: true,
    width: '1000px',
    buttons: {
      Cancel: function() {
        $dialogs.Natural_Bonus.dialog('close');
      }
    }
  });
};

add_advantage = function() {
  for (var name in $advantages) {
    var link = $('#advantages_tabs a:contains("' + name + '")');
    if ($char.advantage_allowed(name, null)) {
      link.removeClass('disabled');
    }
    else {
      link.addClass('disabled');
    }
  }
  $dialogs.Advantages.dialog('open');
  return false;
};

add_disadvantage = function() {
  for (var name in $disadvantages) {
    var link = $('#disadvantages_tabs a:contains("' + name + '")');
    if ($char.disadvantage_allowed(name, null)) {
      link.removeClass('disabled');
    }
    else {
      link.addClass('disabled');
    }
  }
  $dialogs.Disadvantages.dialog('open');
  return false;
};

configure_advantage = function(name) {
  if (!$char.advantage_allowed(name, null)) {
    return false;
  }
  $dialogs.Advantages.dialog('close');
  var advantage = $advantages[name];
  if (name == 'Cultural Roots') {
    $dialogs.Cultural_Roots.dialog('open');
    return false;
  }
  if ($.isArray(advantage.Cost)) {
    return edit_advantage_cost(name);
  }
  if ('Options' in advantage) {
    return edit_advantage_options(name, null);
  }
  $char.Advantages[name] = advantage.Cost;
  update_cp();
  return false;
};

configure_disadvantage = function(name) {
  if (!$char.disadvantage_allowed(name, null)) {
    return false;
  }
  $dialogs.Disadvantages.dialog('close');
  var disadvantage = $disadvantages[name];
  if ($.isArray(disadvantage.Benefit)) {
    return edit_disadvantage_benefit(name);
  }
  if ('Options' in disadvantage) {
    return edit_disadvantage_options(name, null);
  }
  $char.Disadvantages[name] = disadvantage.Benefit;
  update_cp();
  return false;
};

delete_advantage = function(name) {
  $('#delete_advantage_name').val(name);
  $dialogs.Delete_Advantage.dialog('open');
  return false;
};

delete_disadvantage = function(name) {
  $('#delete_disadvantage_name').val(name);
  $dialogs.Delete_Disadvantage.dialog('open');
  return false;
};

edit_advantage_cost = function(name) {
  $('#advantage_cost_name').val(name);
  var advantage = $advantages[name];
  var category = ('Category' in advantage) ? advantage.Category : 'Common';
  var remaining = $char.cp_remaining(category);
  if (category != 'Common') {
    remaining += $char.cp_remaining('Common');
  }
  var options = $advantages[name].Cost;
  $.each([1, 2, 3], function(i, cost) {
    if (cost > remaining || options.indexOf(cost) == -1) {
      $('.advantage_cost_' + cost).hide();
    }
    else {
      $('.advantage_cost_' + cost).show();
    }
  });
  $('#advantage_cost_' + options[0]).click();
  $dialogs.Advantage_Cost.dialog('open');
};

edit_advantage_options = function(name, cost) {
  var advantage = $advantages[name];
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
    $.each(options, function(i, option) {
      select.append($('<option>', {value: option}).text(option));
    });
    panel.append(select);
    if (name == 'Repeat a Characteristics Roll') {
      panel.append($('<br />'));
      panel.append($('<label>', {'for': 'repeat_roll'}).text('New Roll '));
      panel.append($('<input>', {id: 'repeat_roll', type: 'text', value: ''}).addClass('required digits two-digit'));
    }
  }
  $dialogs.Advantage_Options.dialog('option', 'title', advantage.Option_Title);
  $dialogs.Advantage_Options.dialog('open');
  return false;
};

edit_class = function(index) {
  var level = ($char.level() === 0) ? 0 : index + 1;
  $('#class_dialog_level').text(level);
  $('#Class').val($char.levels[index].Class);
  $dialogs.Class.dialog('open');
  return false;
};

edit_characteristic_bonus = function(index) {
  $('#dialog_level').val(index + 1);
  if ('Characteristic' in $char.levels[index]) {
    $('#Characteristic').val($char.levels[index].Characteristic);
  }
  else {
    $('#Characteristic').val('STR');
  }
  $dialogs.Characteristic_Bonus.dialog('open');
  return false;
};

edit_disadvantage_benefit = function(name) {
  $('#disadvantage_benefit_name').val(name);
  $('#disadvantage_benefit_1').click();
  $dialogs.Disadvantage_Benefit.dialog('open');
};

edit_disadvantage_option = function(name, benefit) {
  var disadvantage = $disadvantages[name];
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
    var select = $('<select>');
    $.each(options, function(i, option) {
      select.append($('<option>', {value: option}).text(option));
    });
    panel.append(select);
  }
  $dialogs.Disadvantage_Option.dialog('option', 'title', disadvantage.Option_Title);
  $dialogs.Disadvantage_Option.dialog('open');
  return false;
};

edit_natural_bonus = function(level) {
  $('#natural_bonus_level').val(level);
  $.each($ability_fields, function(i, field) {
    $('#NB_' + field).html('');
  });
  var modifier;
  var name;
  var ability;
  var parts;
  for (name in $abilities) {
    ability = $abilities[name];
    if (!('Field' in ability)) {
      continue;
    }
    modifier = $char.modifier(ability.Characteristic, level);
    if (modifier <= 0) {
      $('#NB_' + ability.Field).append(name + '<br />');
    }
    else {
      parts = ['<a href="#" onclick="return set_natural_bonus(\'', name, '\');">', name, ' +', modifier, '</a><br />'];
      $('#NB_' + ability.Field).append(parts.join(''));
    }
    
  }
  $dialogs.Natural_Bonus.dialog('open');
};

set_natural_bonus = function(name) {
  var level = parseInt($('#natural_bonus_level').val(), 10);
  $char.set_natural_bonus(level, name);
  $dialogs.Natural_Bonus.dialog('close');
  update_level();
  return false;
};

