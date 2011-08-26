$dialogs = {};

create_dialogs = function() {
  var column = 1;
  var count = 1;
  for (name in $advantages) {
    var advantage = $advantages[name];
    var link = $('<a>', {href: '#', onclick: "return configure_advantage('" + name + "');"});
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
  $dialogs.Advantage_Cost = $('advantage_cost_dialog').dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      'OK': function() {
        var name = $('#advantage_cost_name').val();
        var advantage = $advantages[name];
        var cost = $('input:radio[name=advantage_cost]:checked').val();
        if ('Options' in advantage) {
          // TODO
        }
        else {
          $char.Advantages[name] = cost;
          $dialogs.Advantage_Cost.dialog('close');
        }
      },
      'Cancel': function() {
        $dialogs.Advantage_Cost.dialog('close');
      }
    }
  });
  $dialogs.Class = $('#class_dialog').dialog({
    autoOpen: false,
    modal: true,
    title: 'Select class for level <span id="class_dialog_level"></span>',
    buttons: {
      'OK': function() {
        var level = parseInt($('#class_dialog_level').text());
        $char.change_class(level, $('#Class').val());
        $dialogs.Class.dialog('close');
        update_level();
      },
      'Cancel': function() {
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
      'OK': function() {
        var level = parseInt($('#dialog_level').val());
        $char.levels[level - 1].Characteristic = $('#Characteristic').val();
        $dialogs.Characteristic_Bonus.dialog('close');
        update_level();
      },
      'Cancel': function() {
        $dialogs.Characteristic_Bonus.dialog('close');
      }
    }
  });
};

add_advantage = function() {
  for (name in $advantages) {
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

// Called from links in the add advantage dialog
configure_advantage = function(name) {
  $dialogs.Advantages.dialog('close');
  if (!$char.advantage_allowed(name, null)) {
    return false;
  }
  return edit_advantage(name);
};

// Called when adding a new advantage or editing an existing one
edit_advantage = function(name) {
  var advantage = $advantages[name];
  if ($.isArray(advantage.Cost)) {
    return edit_advantage_cost(name);
  }
  if (!('Options' in advantage)) {
    $char.Advantages[name] = advantage.Cost;
    update_cp();
  }
  return false;
};

edit_advantage_cost = function(name) {
  $('#advantage_cost_name').val(name);
  var remaining = $char.cp_total() - $char.cp_used();
  var options = $advantages[name].Cost;
  $.each([1, 2, 3], function(i, cost) {
    if (cost > remaining || !(cost in options)) {
      $('#advantage_cost_' + cost).hide();
    }
    else {
      $('#advantage_cost_' + cost).show();
    }
  });
  $('#advantage_cost_' + options[0]).click();
  $dialogs.Advantage_Cost.dialog('open');
};

edit_class = function(index) {
  var level = ($char.level() == 0) ? 0 : index + 1;
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
