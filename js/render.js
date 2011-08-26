render = function(data, root) {
  $('.next_step', root).text(data.next_step());
  $('.summary', root).text(data.summary());
  $('.lp', root).text(data.lp());
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

update_int = function(name) {
  var input = $('#' + name);
  if (input.valid()) {
    $char[name] = parseInt(input.val());
  }
};

update_text = function(name) {
  var field = $('#' + name);
  if (field.valid()) {
    $char[name] = field.val();
  }
};

update_cp = function() {
  var total = $char.cp_total();
  var used = $char.cp_used();
  $('#cp_left').text(total - used);
  $('#cp_total').text(total);
  if (total - used > 0) {
    $('#add_advantage').show();
  }
  else {
    $('#add_advantage').hide();
  }
  var content = '';
  var i = 0;
  for (name in $char.Advantages) {
    if (i > 0) {
      content += ', ';
    }
    content += '<a href="#">' + name + '</a>';
    i++;
  }
  $('#Advantages').html(content);
};

update_display = function() {
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
  update_text('Name');
  render($char, $('.container'));
};

update_level = function() {
  update_int('XP');
  var current_level = $char.level();
  var level_count = $char.levels.length;
  // remove any extra levels if revising XP down
  while (level_count > current_level && level_count > 1) {
    $char.levels.pop();
    level_count--;
  }
  // add new levels, continuing last class
  while (level_count < current_level) {
    $char.levels.push({Class: $char.levels[level_count - 1].Class, DP: {}});
    level_count++;
  }
  $('.level').remove();
  $.each($char.levels, function(i, level) {
    if (i > 0) {
      var hr = $('<hr />').addClass('span-13 last level');
      $('.levels').append(hr);
    }
    var level_number = current_level == 0 ? 0 : i + 1;
    var content = 'Level ' + level_number + ' (';
    if ($char.class_change_possible(level_number)) {
      content += '<a href="#" onclick="return edit_class(' + i + ');">' + level.Class + '</a>):';
    }
    else {
      content += level.Class + '):';
    }
    if ((i + 1) % 2 == 0) {
      content += ' <a href="#" onclick="return edit_characteristic_bonus(' + i + ');">' + (('Characteristic' in level) ? '+1 ' + level.Characteristic : 'Select characteristic bonus') + '</a>';
    }
    else if ('Characteristic' in level) {
      // manual JSON editing error?
      delete level.Characteristic;
    }
    var line = $('<div>').addClass('span-13 last level').html(content);
    $('.levels').append(line);
  });
  update_display();
};
