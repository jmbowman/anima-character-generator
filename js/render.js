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
    $char[name] = parseInt(input.val(), 10);
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
  var remaining = '';
  var categories_added = 0;
  $.each(['Common', 'Background', 'Magic', 'Psychic'], function(i, category) {
    var subtotal = $char.cp_remaining(category);
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
  for (name in $char.Advantages) {
    if (i > 0) {
      content += ', ';
    }
    content += '<a href="#" onclick="return delete_advantage(\'' + name + '\');">' + $char.advantage_summary(name) + '</a>';
    i++;
  }
  $('#Advantages').html(content);
  if (Object.keys($char.Disadvantages).length < 3) {
    $('#add_disadvantage').show();
  }
  else {
    $('#add_disadvantage').hide();
  }
  content = '';
  i = 0;
  for (name in $char.Disadvantages) {
    if (i > 0) {
      content += ', ';
    }
    content += '<a href="#" onclick="return delete_disadvantage(\'' + name + '\');">' + $char.disadvantage_summary(name) + '</a>';
    i++;
  }
  $('#Disadvantages').html(content);
  render($char, $('.container'));
};

add_cultural_roots_choice = function(i, choice) {
  parts = ['<select>'];
  for (var option in choice) {
    parts.push('<option value="');
    parts.push(option);
    parts.push('">');
    ability = option;
    parts.push(ability);
    amount = choice[option];
    if ($.isPlainObject(amount)) {
	  specialty = Object.keys(amount)[0];
	  parts.push(' (');
	  parts.push(specialty);
	  parts.push(')');
	  amount = amount[specialty];
    }
    parts.push(' +');
    parts.push(amount);
    parts.push('</option>');
  }
  parts.push('</select><br />');
  $('#cultural_roots').append(parts.join(''));
};

update_cultural_roots = function() {
  $('#cultural_roots').html('');
  var parts;
  var background = $('#cultural_roots_background').val();
  var bonuses = $cultural_roots[background];
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
  var first_class = $('#first_class').val();
  if (first_class) {
    $char.change_class($char.XP < 0 ? 0 : 1, first_class);
  }
  update_text('Name');
  render($char, $('.container'));
  var after_class = $('#after_class');
  if (after_class.filter(':visible').length === 0) {
    if ($('#Race').val() && $('#first_class').val()) {
      update_cp();
      $('#after_class').show();
    }
  }
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
  update_display();
  $('.level').remove();
  var level_number;
  var content;
  var nb;
  var line;
  var dp = $char.dp_remaining(level_number);
  $.each($char.levels, function(i, level) {
    if (i > 0) {
      var hr = $('<hr />').addClass('span-13 last level');
      $('.levels').append(hr);
    }
    level_number = current_level === 0 ? 0 : i + 1;
    content = 'Level ' + level_number + ' (';
    if ($char.class_change_possible(level_number) && i > 0) {
      content += '<a href="#" onclick="return edit_class(' + i + ');">' + level.Class + '</a>):';
    }
    else {
      content += level.Class + '):';
    }
    if ((i + 1) % 2 === 0) {
      content += ' <a href="#" onclick="return edit_characteristic_bonus(' + i + ');">' + (('Characteristic' in level) ? level.Characteristic + ' +1' : 'Select characteristic bonus') + '</a>';
    }
    else if ('Characteristic' in level) {
      // manual JSON editing error?
      delete level.Characteristic;
    }
    if (level_number > 0) {
      nb = ('Natural Bonus' in level) ? level['Natural Bonus'] : null;
      content += ' <a href="#" onclick="return edit_natural_bonus(' + (i + 1) + ');">' + (nb ? nb + ' +' + $char.modifier($abilities[nb].Characteristic, level_number) : 'Select natural bonus') + '</a>';
    }
    line = $('<div>').addClass('span-13 last level').html(content);
    $('.levels').append(line);
    if (dp[i].Total > 0) {
      content = dp[i].Total + ' DP remaining (Limits: ' + dp[i].Combat + ' Combat, ' + dp[i].Psychic + ' Psychic, ' + dp[i].Supernatural + ' Supernatural)';
      line = $('<div>').addClass('span-13 last level').html(content);
      $('.levels').append(line);
    }
  });
};
