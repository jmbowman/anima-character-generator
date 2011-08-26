$advantages = {
  'Access to Natural Psychic Powers': {Cost: [1,2,3], Options: []},
  'Access to One Psychic Discipline': {Options: Object.keys($psychic_disciplines)},
  'Acute Senses': {},
  'Add One Point to a Characteristic': {Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER']},
  Ambidextrous: {},
  'Animal Affinity': {},
  'Aptitude in a Field': {Cost: 2, Options: ['Athletics', 'Social', 'Perception', 'Intellectual', 'Vigor', 'Subterfuge', 'Creative']},
  'Aptitude in a Subject': {Cost: [1,2], Options: $.map(Object.keys($abilities), function(val, i) {
    return ('Field' in $abilities[val]) ? val : null;
  })},
  Artifact: {Cost: [1,2,3], Options: []},
  'Been Around': {Cost: [1,2,3]},
  Charm: {},
  'Danger Sense': {Cost: 2},
  Disquieting: {},
  'Good Luck': {},
  'Increase One Characteristic to Nine': {Cost: 2, Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER']},
  'Jack of All Trades': {Cost: 2},
  'Ki Recovery': {Cost: [1,2,3]},
  'Martial Mastery': {Cost: [1,2,3]},
  'Mystical Armor': {},
  'Natural Armor': {},
  'Repeat a Characteristics Roll': {Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER']},
  'Uncommon Size': {Options: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]},
  Untiring: {Cost: [1,2,3]},
  Versatile: {Cost: 1}
};

$disadvantages = {
  Sickly: {}
};
