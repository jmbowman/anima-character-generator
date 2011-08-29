$advantages = {
  'Access to Natural Psychic Powers': {Cost: [1,2,3], Options: [], Option_Title: 'Select a Power'},
  'Access to One Psychic Discipline': {Cost: 1, Options: Object.keys($psychic_disciplines), Option_Title: 'Select a discipline'},
  'Acute Senses': {Cost: 1},
  'Add One Point to a Characteristic': {Cost: 1, Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER'], Option_Title: 'Select the characteristic to increase'},
  Ambidextrous: {Cost: 1},
  'Amplify Sustained Power': {Category: 'Psychic', Cost: 2},  // one difficulty level higher
  'Animal Affinity': {Cost: 1},
  'Aptitude in a Field': {Cost: 2, Options: $ability_fields, Option_Title: 'Select a field'},
  'Aptitude in a Subject': {Cost: [1,2], Options: $.map(Object.keys($abilities), function(val, i) {
    return ('Field' in $abilities[val]) ? val : null;
  }), Option_Title: 'Select a subject'},
  'Aptitude for Magic Development': {Category: 'Magic', Cost: 1}, // adds +3 to INT to determine max potential no other ability
  Artifact: {Category: 'Background', Cost: [1,2,3], Options: [], Option_Title: 'Enter the name of the artifact'},
  'Been Around': {Category: 'Background', Cost: [1,2,3]},
  Charm: {Cost: 1},
  'Combat Senses': {Cost: 3, Options: ['Attack', 'Block', 'Dodge'], Option_Title: 'Select an ability'},
  Contacts: {Category: 'Background', Cost: [1,2,3], Options: [], Option_Title: 'Enter name of organization'},
  'Contested Spell Mastery': {Category: 'Magic', Cost: 1},
  'Cultural Roots': {Category: 'Background', Cost: 1, Options: [], Option_Title: 'Select a background'}, 
  'Danger Sense': {Cost: 2},
  Disquieting: {Cost: 1},
  'Dual Limit': {Cost: 1}, // choose up to 2 limits 
  Elan: {Cost: [1,2,3], Options: [], Option_Title: 'Enter the name of the Beryl or Shajad'},
  'Elemental Compatibility': {Category: 'Magic', Cost: 1, Options: Object.keys($magic_paths), Option_Title: 'Select a path'}, //+ 20 MA and +20 MR in one element -20 in opposing. if necro then all.
  'Exceptional Magic Resistance': {Cost: [1,2]},  // +25 to MR , +50 to MR
  'Exceptional Physical Resistance': {Cost: [1,2]},  // +25 to PhR/VR/DR , +50 to Phr/VR/DR
  'Exceptional Psychic Resistance': {Cost: [1,2]},  // +25 to PsR , +50 to PsR
  'Extreme Concentration': {Cost: 2},  // doubles the bonus for concentrating
  Fame: {Category: 'Background', Cost: [1,2]}, 
  Focus: {Category: 'Psychic', Cost: 1}, // psychic points spent to boost projection are +20 instead of +10
  Fortunate: {Cost: 1},
  'Free Access to Any Psychic Discipline': {Cost: 2},
  'Free Will': {Cost: 1},  // +60 to resist domination or possession
  'Good Luck': {Cost: 1},
  'Half-Attuned to the Tree': {Category: 'Magic', Cost: 2}, // necromany not allowed.  Like elemental compat, but allows you to choose 1/2 the tree. necro not allowed
  'Hard to Kill': {Cost: [1,2,3]}, // +10 per pt to LP per level
  'Immunity to Pain and Fatigue': {Cost: 1},
  'Imperceptible Ki': {Cost: 1}, // +10 to ki concealment per level.  does not grant any benefit without ability ki concealment
  'Improved Innate Spell': {Category: 'Magic', Cost: [1,2,3]},
  'Increased Ki Accumulation': {Cost: [1,2]},
  'Increased Natural Bonus': {Cost: 2},  // twice the  usual bonus to a secondary when levelling
  'Increased Psychic Modifiers': {Category: 'Psychic', Cost: 1},  
  'Increase One Characteristic to Nine': {Cost: 2, Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER'], Option_Title: 'Select the characteristic to increase'},
  'Jack of All Trades': {Cost: 2},
  'Ki Perception': {Cost: 1},  // +10 per level to key detection
  'Ki Recovery': {Cost: [1,2,3]},
  'Light Sleeper': {Cost: 1},
  Learning: {Cost: [1,2,3]}, // Additional +3 xp, +6 xp, +9 xp per session
  'Magic Nature': {Category: 'Magic', Cost: [1,2,3]},  //+50 +100 +150 zeon per level
  'Magical Diction': {Category: 'Magic', Cost: 1},  // no zeon for casting from scroll or grimoire
  'Martial Learning': {Cost: 1},  // increases learning level by 2
  'Martial Mastery': {Cost: [1,2,3]},
  'Masterful Seals': {Cost: 1}, // +2 levels for difficulty of setting a seal
  'Mystical Armor': {Cost: 1},
  'Natural Armor': {Cost: 1},
  'Natural Knowledge of a Path': {Category: 'Magic', Cost: 1,  Options: Object.keys($magic_paths), Option_Title: 'Select a path'},
  'Natural Learner': {Cost: [1,2,3], Options: $.map(Object.keys($abilities), function(val, i) {
    return ('Field' in $abilities[val]) ? val : null;
  }), Option_Title: 'Select an ability'},   //+10, +20, +30 per level additional to specific secondary
  'Natural Learner, Field': {Cost: [2,3], Options: Object.keys($ability_fields), Option_Title: 'Select a field'},   //+5 +10, per level additional to specific field
  'Natural Power': {Category: 'Magic', Cost: 1}, // maximum spell potential uses POW 
  'Night Vision': {Cost: 1},
  'No Gestures': {Cost: 1},  // no reduction to ki accumulation
  'Opposite Magic': {Category: 'Magic', Cost: 1, Options: ['Light/Darkness', 'Creation/Destruction', 'Fire/Water', 'Earth/Air', 'Illusion/Essence'], Option_Title: 'Select Opposing Magic'},
  'Passive Concentration': {Category: 'Psychic', Cost: 2},
  'Powerful Ally': {Category: 'Background', Cost: [1,2,3], Options: [], Option_Title: 'Enter powerful ally'},
  'Psychic Ambivalence': {Category: 'Psychic', Cost: 1},
  'Psychic Fatigue Resistance': {Category: 'Psychic', Cost: 2},  // no fatigue when a power fails.  Does not effect 3rd level powers
  'Psychic Immunity': {Cost: 1},
  'Psychic Inclination':  {Category: 'Psychic', Cost: 2, Options: Object.keys($psychic_disciplines), Option_Title: 'Select a discipline'}, // +1 level of greater difficulty for one of his psychic disciplines.
  'Psychic Point Recovery': {Category: 'Psychic', Cost: [1,2,3]},  // recover 1pt/10m 1pt/5m  1pt/1minute
  'Quick Reflexes': {Cost: [1,2,3]},   // +25, +45, +60 to initiative
  'Regeneration': {Cost: [1,2,3]},
  'Repeat a Characteristics Roll': {Cost: 1, Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER'], Option_Title: 'Select the characteristic to reroll'},
  Saint: {Category: 'Background', Cost: 2},
  Seducer: {Cost: 1},  // +60 to persuasion
  'See Supernatural': {Cost: 1},
  'Social Position': {Category: 'Background', Cost: [1,2]},
  'Starting Wealth': {Category: 'Background', Cost: [1,2,3]},
  'Superior Magic Recovery': {Category: 'Magic', Cost: [1,2,3]},  //x2, x3, x4 magic recovery
  'Supernatural Immunity': {Cost: [1,2,3]},  // cannot access The Gift, See Supernatural with this. Not available to Duk/Dai, Sylvain
  'Survivor': {Cost: 1},
  Talented: {Cost: 1},  //+30 to sleight of hands +3 to opposed dex checks
  'To the Limit': {Cost: 1},  //+20 all action when below 20% of total LP
  'Touched by Destiny': {Cost: 1},
  'Total Accumulation': {Cost: 2},
  'The Gift': {Cost: 2},   // +10 to MR, can take magic advantages/disadvantages
  'Uncommon Size': {Cost: 1, Options: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], Option_Title: 'Select the size modifier to apply'},
  'Unconnected Techniques': {Cost: 1},
  'Unlimited Familiars': {Cost: 2},
  'Unspoken Casting': {Category: 'Magic', Cost: 1}, // no reduction to MA when casting unspoken
  Untiring: {Cost: [1,2,3]},
  'Use of Armor': {Cost: [1,2,3]},  // +5/+10/+15 per level to wear armor
  Versatile: {Cost: 1}
};

$disadvantages = {
  'Action Requirement':  {Category: 'Magic', Benefit: 1}, 
  'Addiction or Serious Vice': {Benefit: 1, Options: [], Option_Title: 'Enter an addiction or serious vice'},
  'Atrophied Limb': {Benefit: 1, Options: ['Left leg', 'Right leg', 'Left arm', 'Right arm'], Option_Title: 'Select a limb'},  // -80 to anything using that limb
  'Bad Luck': {Benefit: 1}, // fumble range increases by +2
  Blind: {Benefit: 2},  // always blinded penalty
  'Code of Conduct': {Category: 'Background', Benefit: 1},
  Cowardice: {Benefit: 1},
  Damned: {Benefit: [1,2], Options: [], Option_Title: 'Describe the effect'},
  Deafness: {Benefit: 1}, // cannot use any ability based on hearing
  Debts: {Category: 'Background', Benefit: 1},
  'Deduct Two Points from a Characteristic': {Benefit: 1, Options: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER'], Option_Title: 'Select the characteristic to deduct from'},
  'Deep Sleeper': {Benefit: 1}, // -200 to perception checks, -40 all actions ten turns on waking
  'Dirty Little Secret': {Category: 'Background', Benefit: 1},
  'Easily Possessed': {Benefit: 1}, // -50 to PhR/MR against domination/possession attempts
  'Exclusive Weapon': {Benefit: 1},
  Fatigue: {Benefit: 1},  // reduce base fatigue by 1
  Feeble: {Benefit: 1},  // -30 all action penalty when below 1/3 of total LP
  Insufferable: {Benefit: 1},
  Klutzy: {Benefit: 1},
  Nearsighted: {Benefit: 1},
  'Magical Blockage':  {Category: 'Magic', Benefit: 2},  // cannot be comined with Slow Recovery.  character cannot regen zeon at all.
  'Magical Exhaustion':  {Category: 'Magic', Benefit: 1},  // 1fatigue point lost per 100/200/300 potential of spell.
  'Magical Ties':  {Category: 'Magic', Benefit: 1}, 
  Mute: {Benefit: 1},
  'No Concentration':  {Category: 'Psychic', Benefit: 1},  // no bonus for concentrating
  'One Power at a Time':  {Category: 'Psychic', Benefit: 1},
  'Oral Requirement':  {Category: 'Magic', Benefit: 1}, 
  'Pariah':  {Category: 'Background', Benefit: 1}, 
  'Physical Weakness': {Benefit: 1}, // PhR reduced by half
  'Powerful Enemy': {Category: 'Background', Benefit: [1,2], Options: [], Option_Title: 'Enter powerful enemy'},
  'Psychic Consumption':  {Category: 'Psychic', Benefit: 2},  // lose LP equal to the fail amount
  'Psychic Exhaustion':  {Category: 'Psychic', Benefit: 1},  // doubles fatigue points indicated when using psychic
  'Require Gestures':  {Category: 'Magic', Benefit: 1}, 
  'Rookie': {Benefit: 1}, 
  'Serious Illness': {Benefit: 2,  Options: [], Option_Title: 'Describe the illness'}, // you will die. -10 all actions every month cumulative
  'Severe Allergy':  {Benefit: 1, Options: [], Option_Title: 'Describe the allergy'},
  'Severe Phobia':   {Benefit: 1, Options: [], Option_Title: 'Describe the phobia'},
  Shamanism: {Category: 'Magic', Benefit: 2}, 
  Sickly: {Benefit: 1},
  'Slow Healer': {Benefit: 1},  // heals received are 1/2 strength regardless of supernatural/natural
  'Slow Learner': {Benefit: [1,2]}, // -4 or -8 penalty to xp per session
  'Slow Reaction': {Benefit: [1,2]},  // -30/-60 to initiative
  'Slow Recovery of Magic':  {Category: 'Magic', Benefit: 1},   // zeon regen cut by 1/2
  'Susceptible to Magic': {Benefit: 1},  // MR reduced by 1/2
  'Susceptible to Poison': {Benefit: 1},  //VR reduced by 1/2
  Unattractive: {Benefit: 1}, // reduce appearance by 2. Minimum 7
  Unfortunate: {Benefit: 1},  // why does it all have to be me?
  'Unlucky Destiny': {Benefit: 2}, // no open rolls
  'Vulnerable to Heat/Cold': {Benefit: 1, Options: ['Heat', 'Cold'], Option_Title: 'Select a vulnerability'}, // -80 resistance against chosen element -30 all actions in extreme climates
  'Vulnerable to Pain': {Benefit: 1}, // doubles any pain penalty
  'Without any Natural Bonus': {Benefit: 1} // no natural bonuses apply when levelling
};
