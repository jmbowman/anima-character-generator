$dialogs = {};

create_dialogs = function() {
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
