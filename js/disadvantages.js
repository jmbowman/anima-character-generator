/*global define: false */
/**
 * Data on Disadvantages that can be chosen to gain more Creation Points.
 * @module disadvantages
 * @requires tables
 */
define(['tables'], function (tables) {
    return {
        'Action Requirement':  {Category: 'Magic', Benefit: 1, Options: [], Option_Title: 'Enter the type of action required'},
        'Addiction or Serious Vice': {Benefit: 1, Options: [], Option_Title: 'Enter an addiction or serious vice'},
        'Atrophied Limb': {Benefit: 1, Options: ['Left leg', 'Right leg', 'Left arm', 'Right arm'], Option_Title: 'Select a limb'},  // -80 to anything using that limb
        'Bad Luck': {Benefit: 1}, // fumble range increases by +2
        Blind: {Benefit: 2},  // always blinded penalty
        'Code of Conduct': {Category: 'Background', Benefit: 1},
        Cowardice: {Benefit: 1},
        Damned: {Benefit: [1, 2], Options: [], Option_Title: 'Describe the effect'},
        Deafness: {Benefit: 1}, // cannot use any ability based on hearing
        Debts: {Category: 'Background', Benefit: 1},
        'Deduct Two Points from a Characteristic': {Benefit: 1, Options: tables.characteristics, Option_Title: 'Select the characteristic to deduct from'},
        'Deep Sleeper': {Benefit: 1}, // -200 to perception checks, -40 all actions ten turns on waking
        'Dirty Little Secret': {Category: 'Background', Benefit: 1},
        'Easily Possessed': {Benefit: 1}, // -50 to PhR/MR against domination/possession attempts
        'Exclusive Weapon': {Benefit: 1, Options: [], Option_Title: 'Which weapon?'},
        Exhausted: {Benefit: 1},  // reduce base fatigue by 1, double penalties
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
        'Powerful Enemy': {Category: 'Background', Benefit: [1, 2], Options: [], Option_Title: 'Enter powerful enemy'},
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
        'Slow Learner': {Benefit: [1, 2]}, // -4 or -8 penalty to xp per session
        'Slow Reactions': {Benefit: [1, 2]},  // -30/-60 to initiative
        'Slow Recovery of Magic':  {Category: 'Magic', Benefit: 1},   // zeon regen cut by 1/2
        'Susceptible to Magic': {Benefit: 1},  // MR reduced by 1/2
        'Susceptible to Poisons': {Benefit: 1},  //VR reduced by 1/2
        Unattractive: {Benefit: 1}, // reduce appearance by 2. Minimum 7
        Unfortunate: {Benefit: 1},  // why does it all have to be me?
        'Unlucky Destiny': {Benefit: 2}, // no open rolls
        'Vulnerable to Heat/Cold': {Benefit: 1, Options: ['Heat', 'Cold'], Option_Title: 'Select a vulnerability'}, // -80 resistance against chosen element -30 all actions in extreme climates
        'Vulnerable to Pain': {Benefit: 1}, // doubles any pain penalty
        'Without any Natural Bonus': {Benefit: 1} // no natural bonuses apply when levelling
    };
});
