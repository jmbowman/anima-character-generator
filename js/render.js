/*global define: false */
define(['jquery', 'abilities', 'characters', 'dialogs', 'tables',
'creation_points', 'development_points'],
function ($, abilities, characters, dialogs, tables) {
  
  var next_step = function() {
    var data = characters.current();
    var result = false;
    $.each(tables.characteristics, function(i, characteristic) {
      if (!(characteristic in data)) {
        result = 'Roll ' + characteristic;
        return false;
      }
    });
    if (result) {
      return result;
    }
    if (!('Appearance' in data)) {
      return 'Roll or select Appearance';
    }
    if (!('Gender' in data)) {
      return 'Select a gender';
    }
    if (!('Race' in data)) {
      return 'Select a race';
    }
    if (data.cp_remaining() > 0) {
      return 'Select advantages and disadvantages';
    }
    var level = data.level();
    if ((level === 0 && data.levels.length > 1) ||
        (level > 0 && level != data.levels.length)) {
      return 'Update levels list';
    }
    $.each(data.levels, function(i, level_data) {
      if ((i + 1) % 2 === 0 && !('Characteristic' in level_data)) {
        result = 'Select characteristic bonus for level ' + (i + 1);
        return false;
      }
      if (level > 0 && !('Natural Bonus' in level_data)) {
        result = 'Select natural bonus for level ' + (i + 1);
        return false;
      }
    });
    if (result) {
      return result;
    }
    if (!('Name' in data)) {
      return 'Choose a name';
    }
    return 'Done!';
  };

  var update_int = function(name) {
    var input = $('#' + name);
    if (input.valid()) {
      var data = characters.current();
      data[name] = parseInt(input.val(), 10);
    }
  };

  var update_text = function(name) {
    var field = $('#' + name);
    if (field.valid()) {
      var data = characters.current();
      data[name] = field.val();
    }
  };

  render = {};
  
  render.render = function(root) {
    var data = characters.current();
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
    var abilities = data.racial_abilities();
    if (abilities) {
      $('.Racial-Abilities').text(abilities);
      $('.racial-row').show();
    }
    else {
      $('.racial-row').hide();
    }
  };

  render.update_cp = function() {
    var data = characters.current();
    var total = data.cp_total();
    var remaining = '';
    var categories_added = 0;
    $.each(['Common', 'Background', 'Magic', 'Psychic'], function(i, category) {
      var subtotal = data.cp_remaining(category);
      if (subtotal === 0) {
        return true;
      }
      if (categories_added > 0) {
        remaining += ', ';
      }
      remaining += subtotal + ' ' + category;
      categories_added++;
    });
    if (!remaining) {
      remaining = '0';
    }
    $('#cp_remaining').text(remaining);
    $('#cp_total').text(total);
    if (remaining != '0') {
      $('#add_advantage').show();
    }
    else {
      $('#add_advantage').hide();
    }
    var content = '';
    var i = 0;
    var name;
    for (name in data.Advantages) {
      if (i > 0) {
        content += ', ';
      }
      content += '<a href="#" data-name="' + name + '">' + data.advantage_summary(name) + '</a>';
      i++;
    }
    $('#Advantages').html(content);
    if (Object.keys(data.Disadvantages).length < 3) {
      $('#add_disadvantage').show();
    }
    else {
      $('#add_disadvantage').hide();
    }
    content = '';
    i = 0;
    for (name in data.Disadvantages) {
      if (i > 0) {
        content += ', ';
      }
      content += '<a href="#" data-name="' + name + '">' + data.disadvantage_summary(name) + '</a>';
      i++;
    }
    $('#Disadvantages').html(content);
    render.render($('.container'));
  };
  
  $('#Advantages a').live('click', dialogs.delete_advantage);
  $('#Disadvantages a').live('click', dialogs.delete_disadvantage);

  render.update_display = function() {
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
    var first_class = $('#first_class').val();
    var data = characters.current();
    if (first_class) {
      data.change_class(data.XP < 0 ? 0 : 1, first_class);
    }
    update_text('Name');
    render.render($('.container'));
    var after_class = $('#after_class');
    if (after_class.filter(':visible').length === 0) {
      if ($('#Race').val() && $('#first_class').val()) {
        render.update_cp();
        $('#after_class').show();
      }
    }
  };

  render.update_level = function() {
    update_int('XP');
    var data = characters.current();
    var current_level = data.level();
    var level_count = data.levels.length;
    // remove any extra levels if revising XP down
    while (level_count > current_level && level_count > 1) {
      data.levels.pop();
      level_count--;
    }
    // add new levels, continuing last class
    while (level_count < current_level) {
      data.levels.push({Class: data.levels[level_count - 1].Class, DP: {}});
      level_count++;
    }
    render.update_display();
    $('.level').remove();
    var level_number;
    var content;
    var nb;
    var line;
    var remaining = data.dp_remaining(level_number);
    var parts;
    $.each(data.levels, function(i, level) {
      if (i > 0) {
        var hr = $('<hr />').addClass('span-13 last level');
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
      if (level_number > 0) {
        nb = ('Natural Bonus' in level) ? level['Natural Bonus'] : null;
        content += ' <a href="#" class="natural_bonus" data-level="' + level_number + '">' + (nb ? nb + ' +' + data.modifier(abilities[nb].Characteristic, level_number) : 'Select natural bonus') + '</a>';
      }
      line = $('<div>').addClass('span-13 last level').html(content);
      $('.levels').append(line);
      if (remaining[i].Total > 0) {
        content = remaining[i].Total + ' DP remaining (Limits: ' + remaining[i].Combat + ' Combat, ' + remaining[i].Psychic + ' Psychic, ' + remaining[i].Supernatural + ' Supernatural)';
        line = $('<div>').addClass('span-13 last level').html(content);
        $('.levels').append(line);
      }
      $('.levels').append('<div class="span-1 level"><strong>DP</strong></div>');
      parts = [];
      if ('Class_Change' in remaining[i]) {
        parts.push('Class change (' + remaining[i].Class_Change + ')');
      }
      if ('Saved' in remaining[i]) {
        parts.push('Used later: ' + remaining[i].Saved);
      }
      content = parts.join(', ');
      if ('Withdrawn' in remaining[i]) {
        content += ' (used ' + remaining[i].Withdrawn + ' DP saved earlier)';
      }
      if (remaining[i].Total > 0) {
        content += ' <a href="#" class="spend_dp" data-level="' + level_number + '">+</a>';
      }
      line = '<div class="span-12 last level">' + content + '</div>';
      $('.levels').append(line);
    });
  };
  
  $('a.edit_class').live('click', dialogs.edit_class);
  $('a.characteristic_bonus').live('click', dialogs.edit_characteristic_bonus);
  $('a.natural_bonus').live('click', dialogs.edit_natural_bonus);
  $('a.spend_dp').live('click', dialogs.spend_dp);
  
  return render;
});
