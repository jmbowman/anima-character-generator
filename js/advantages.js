/*global define: false */
/**
 * Data on Advantages that can be chosen with Creation Points.
 * @module advantages
 * @requires jquery
 * @requires abilities
 * @requires magic_paths
 * @requires psychic_disciplines
 * @requires tables
 */
define(['jquery', 'abilities', 'magic_paths',  'psychic_disciplines',
        'tables'], function ($, abilities, paths, disciplines, tables) {
    return {
        'Access to Natural Psychic Powers': {Cost: [1, 2, 3], Options: [], Option_Title: 'Select a Power'},
        'Access to One Psychic Discipline': {Cost: 1, Options: Object.keys(disciplines.disciplines), Option_Title: 'Select a discipline'},
        'Acute Senses': {Cost: 1},
        'Add One Point to a Characteristic': {Cost: 1, Options: tables.characteristics, Option_Title: 'Select the characteristic to increase'},
        Ambidextrous: {Cost: 1},
        'Amplify Sustained Power': {Category: 'Psychic', Cost: 2},  // one difficulty level higher
        'Animal Affinity': {Cost: 1},
        'Aptitude in a Field': {Cost: 2, Options: tables.fields, Option_Title: 'Select a field'},
        'Aptitude in a Subject': {Cost: [1, 2], Options: $.map(Object.keys(abilities), function (val) {
            return ('Field' in abilities[val]) ? val : null;
        }), Option_Title: 'Select a subject'},
        'Aptitude for Magic Development': {Category: 'Magic', Cost: 1}, // adds +3 to INT to determine max potential no other ability
        Artifact: {Category: 'Background', Cost: [1, 2, 3], Options: [], Option_Title: 'Enter the name of the artifact'},
        'Artifact Affinity': {Cost: 1},
        'Been Around': {Category: 'Background', Cost: [1, 2, 3]},
        'Born Wizard': {Category: 'Magic', Cost: 1},
        Charm: {Cost: 1},
        'Combat Senses': {Cost: 3, Options: tables.primary_combat_abilities, Option_Title: 'Select an ability'},
        Contacts: {Category: 'Background', Cost: [1, 2, 3], Options: [], Option_Title: 'Enter name of organization'},
        'Contested Spell Mastery': {Category: 'Magic', Cost: 1},
        'Cultural Roots': {Category: 'Background', Cost: 1, Options: [], Option_Title: 'Select a background'},
        'Danger Sense': {Cost: 2},
        Disquieting: {Cost: 1},
        'Dual Limit': {Cost: 1}, // choose up to 2 limits
        Elan: {Cost: [1, 2, 3], Options: [], Option_Title: 'Enter the name of the Beryl or Shajad'},
        'Elemental Compatibility': {Category: 'Magic', Cost: 1, Options: Object.keys(paths), Option_Title: 'Select a path'}, //+ 20 MA and +20 MR in one element -20 in opposing. if necro then all.
        'Exceptional Magic Resistance': {Cost: [1, 2]},  // +25 to MR , +50 to MR
        'Exceptional Physical Resistance': {Cost: [1, 2]},  // +25 to PhR/VR/DR , +50 to Phr/VR/DR
        'Exceptional Psychic Resistance': {Cost: [1, 2]},  // +25 to PsR , +50 to PsR
        'Extreme Concentration': {Category: 'Psychic', Cost: 2},  // doubles the bonus for concentrating
        Fame: {Category: 'Background', Cost: [1, 2]},
        Familiar: {Cost: [2, 3]},
        Focus: {Category: 'Psychic', Cost: 1}, // psychic points spent to boost projection are +20 instead of +10
        Fortunate: {Cost: 1},
        'Free Access to Any Psychic Discipline': {Cost: 2},
        'Free Will': {Cost: 1},  // +60 to resist domination or possession
        'Good Luck': {Cost: 1},
        'Gradual Magic Learning': {Category: 'Magic', Cost: 2},
        'Half-Attuned to the Tree': {Category: 'Magic', Cost: 2}, // necromany not allowed.  Like elemental compat, but allows you to choose 1/2 the tree. necro not allowed
        'Hard to Kill': {Cost: [1, 2, 3]}, // +10 per pt to LP per level
        'Immunity to Pain and Fatigue': {Cost: 1},
        'Imperceptible Ki': {Cost: 1}, // +10 to ki concealment per level.  does not grant any benefit without ability ki concealment
        'Improved Innate Spell': {Category: 'Magic', Cost: [1, 2, 3]},
        'Incomplete Gift': {Cost: 1, Options: tables.theorems, Option_Title: 'Select the Theorem used'},
        'Increased Ki Accumulation': {Cost: [1, 2]},
        'Increased Natural Bonus': {Cost: 2},  // twice the  usual bonus to a secondary when levelling
        'Increased Psychic Modifiers': {Category: 'Psychic', Cost: 1},
        'Increase One Characteristic to Nine': {Cost: 2, Options: tables.characteristics, Option_Title: 'Select the characteristic to increase'},
        'Jack of All Trades': {Cost: 2},
        'Ki Perception': {Cost: 1},  // +10 per level to Ki Detection
        'Ki Recovery': {Cost: [1, 2, 3]},
        'Light Sleeper': {Cost: 1},
        Learning: {Cost: [1, 2, 3]}, // Additional +3 xp, +6 xp, +9 xp per session
        'Magic Nature': {Category: 'Magic', Cost: [1, 2, 3]},  //+50 +100 +150 zeon per level
        'Magical Diction': {Category: 'Magic', Cost: 1},  // no zeon for casting from scroll or grimoire
        'Martial Learning': {Cost: 1},  // increases learning level by 2
        'Martial Mastery': {Cost: [1, 2, 3]},
        'Mass Summoner': {Cost: [1, 2, 3]},
        'Masterful Seals': {Cost: 1}, // +2 levels for difficulty of setting a seal
        'Mystical Armor': {Cost: 1},
        'Natural Armor': {Cost: 1},
        'Natural Knowledge of a Path': {Category: 'Magic', Cost: 1,  Options: Object.keys(paths), Option_Title: 'Select a path'},
        'Natural Learner': {Cost: [1, 2, 3], Options: $.map(Object.keys(abilities), function (val) {
            return ('Field' in abilities[val]) ? val : null;
        }), Option_Title: 'Select an ability'},   //+10, +20, +30 per level additional to specific secondary
        'Natural Learner, Field': {Cost: [2, 3], Options: tables.fields, Option_Title: 'Select a field'},   //+5 +10, per level additional to specific field
        'Natural Power': {Category: 'Magic', Cost: 1}, // maximum spell potential uses POW
        'Night Vision': {Cost: 1},
        'No Gestures': {Cost: 1},  // no reduction to ki accumulation
        'Opposite Magic': {Category: 'Magic', Cost: 1},
        'Passive Concentration': {Category: 'Psychic', Cost: 2},
        'Powerful Ally': {Category: 'Background', Cost: [1, 2, 3], Options: [], Option_Title: 'Enter powerful ally'},
        'Psychic Ambivalence': {Category: 'Psychic', Cost: 1},
        'Psychic Fatigue Resistance': {Category: 'Psychic', Cost: 2},  // no fatigue when a power fails.  Does not effect 3rd level powers
        'Psychic Immunity': {Cost: 1},
        'Psychic Inclination':  {Category: 'Psychic', Cost: 2, Options: Object.keys(disciplines.disciplines), Option_Title: 'Select a discipline'}, // +1 level of greater difficulty for one of his psychic disciplines.
        'Psychic Point Recovery': {Category: 'Psychic', Cost: [1, 2, 3]},  // recover 1pt/10m 1pt/5m  1pt/1minute
        'Quick Reflexes': {Cost: [1, 2, 3]},   // +25, +45, +60 to initiative
        'Regeneration': {Cost: [1, 2, 3]},
        'Repeat a Characteristics Roll': {Cost: 1, Options: tables.characteristics, Option_Title: 'Select the characteristic to reroll'},
        Saint: {Category: 'Background', Cost: 2},
        Seducer: {Cost: 1},  // +60 to persuasion
        'See Supernatural': {Cost: 1},
        'Sheele Essence': {Cost: 1},
        'Social Position': {Category: 'Background', Cost: [1, 2]},
        'Starting Wealth': {Category: 'Background', Cost: [1, 2, 3]},
        'Superior Magic Recovery': {Category: 'Magic', Cost: [1, 2, 3]},  //x2, x3, x4 magic recovery
        'Supernatural Immunity': {Cost: [1, 2, 3]},  // cannot access The Gift, See Supernatural with this. Not available to Duk/Dai, Sylvain
        'Survivor': {Cost: 1},
        Talented: {Cost: 1},  //+30 to sleight of hands +3 to opposed dex checks
        'To the Limit': {Cost: 1},  //+20 all action when below 20% of total LP
        'Touched by Destiny': {Cost: 1},
        'Total Accumulation': {Cost: 2},
        'The Gift': {Cost: 2, Options: tables.theorems, Option_Title: 'Select the Theorem used'},   // +10 to MR, can take magic advantages/disadvantages
        'Uncommon Size': {Cost: 1, Options: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], Option_Title: 'Select the size modifier to apply'},
        'Unconnected Techniques': {Cost: 1},
        'Unlimited Familiars': {Cost: 2},
        'Unspoken Casting': {Category: 'Magic', Cost: 1}, // no reduction to MA when casting unspoken
        Untiring: {Cost: [1, 2, 3]},
        'Usage Affinity': {Cost: 1},
        'Use of Armor': {Cost: [1, 2, 3]},  // +5/+10/+15 per level to wear armor
        Versatile: {Cost: 1},
        'Versatile Metamagic': {Category: 'Magic', Cost: 1}
    };
});
