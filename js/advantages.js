$advantages = {
  'Access to Natural Psychic Powers': {Cost: [1,2,3], Options: [], Option_Title: 'Select a Power'},
  'Access to One Psychic Discipline': {Cost: 1, Options: Object.keys($psychic_disciplines), Option_Title: 'Select a discipline'},
  'Acute Senses': {Cost: 1},
  'Add One Point to a Characteristic': {Cost: 1, Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER'], Option_Title: 'Select the characteristic to increase'},
  Ambidextrous: {Cost: 1},
  'Animal Affinity': {Cost: 1},
  'Aptitude in a Field': {Cost: 2, Options: ['Athletics', 'Social', 'Perception', 'Intellectual', 'Vigor', 'Subterfuge', 'Creative'], Option_Title: 'Select a field'},
  'Aptitude in a Subject': {Cost: [1,2], Options: $.map(Object.keys($abilities), function(val, i) {
    return ('Field' in $abilities[val]) ? val : null;
  }), Option_Title: 'Select a subject'},
  Artifact: {Cost: [1,2,3], Options: [], Option_Title: 'Enter the name of the artifact'},
  'Been Around': {Cost: [1,2,3]},
  Charm: {Cost: 1},
  'Contested Spell Mastery': {Category: 'Magic', Cost: 1},
  'Danger Sense': {Cost: 2},
  Disquieting: {Cost: 1},
  'Good Luck': {Cost: 1},
  'Increase One Characteristic to Nine': {Cost: 2, Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER'], Option_Title: 'Select the characteristic to increase'},
  'Jack of All Trades': {Cost: 2},
  'Ki Recovery': {Cost: [1,2,3]},
  'Martial Mastery': {Cost: [1,2,3]},
  'Mystical Armor': {Cost: 1},
  'Natural Armor': {Cost: 1},
  'Passive Concentration': {Category: 'Psychic', Cost: 2},
  'Repeat a Characteristics Roll': {Cost: 1, Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER'], Option_Title: 'Select the characteristic to reroll'},
  'Uncommon Size': {Cost: 1, Options: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], Option_Title: 'Select the size modifier to apply'},
  Untiring: {Cost: [1,2,3]},
  Versatile: {Cost: 1}
};

$disadvantages = {
  'Bad Luck': {Benefit: 1},
  Sickly: {Benefit: 1}
};
