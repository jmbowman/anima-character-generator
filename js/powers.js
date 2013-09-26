/*global define: false */
/**
 * Data on Powers for non-human creatures.  Used for the rules in Chapter 26:
 * "Creation of Beings" from the core rulebook.
 * @module powers
 */
define([], function () {
    return {
        'Natural Weapons': {
            Category: 'Offensive Abilities',
            Options: [
                {Description: 'Natural Weapons', DP: 20, Gnosis: 0}
            ]
        },
        'Additional Attacks': {
            Category: 'Offensive Abilities',
            Attack_Linked: true,
            Repeatable: true,
            Options: [
                {Description: 'Additional attack with -60 to its final Attack', DP: 20, Gnosis: 0},
                {Description: 'Additional attack with -50 to its final Attack', DP: 30, Gnosis: 0},
                {Description: 'Additional attack with -40 to its final Attack', DP: 40, Gnosis: 0},
                {Description: 'Additional attack with -30 to its final Attack', DP: 50, Gnosis: 5},
                {Description: 'Additional attack with -20 to its final Attack', DP: 60, Gnosis: 5},
                {Description: 'Additional attack with -10 to its final Attack', DP: 80, Gnosis: 10},
                {Description: 'Complete additional attack', DP: 100, Gnosis: 15}
            ]
        },
        'Increased Damage': {
            Category: 'Offensive Abilities',
            Attack_Linked: true,
            Options: [
                {Description: '+10 to damage', DP: 10, Gnosis: 0},
                {Description: '+20 to damage', DP: 20, Gnosis: 0},
                {Description: '+30 to damage', DP: 30, Gnosis: 0},
                {Description: '+40 to damage', DP: 40, Gnosis: 0},
                {Description: '+50 to damage', DP: 50, Gnosis: 5},
                {Description: '+60 to damage', DP: 60, Gnosis: 10},
                {Description: '+80 to damage', DP: 80, Gnosis: 20},
                {Description: '+100 to damage', DP: 100, Gnosis: 25},
                {Description: '+120 to damage', DP: 120, Gnosis: 30}
            ]
        },
        'Increased Reaction': {
            Category: 'Offensive Abilities',
            Options: [
                {Description: '+10 to the natural Initiative', DP: 10, Gnosis: 0},
                {Description: '+20 to the natural Initiative', DP: 20, Gnosis: 10},
                {Description: '+30 to the natural Initiative', DP: 30, Gnosis: 20}
            ]
        },
        'Damage Energy': {
            Category: 'Offensive Abilities',
            Options: [
                {Description: 'Damage energy', DP: 10, Gnosis: 10}
            ]
        },
        'Armor Modifier': {
            Category: 'Offensive Abilities',
            Attack_Linked: true,
            Options: [
                {Description: "-1 to the defender's AT", DP: 10, Gnosis: 0},
                {Description: "-2 to the defender's AT", DP: 15, Gnosis: 10},
                {Description: "-3 to the defender's AT", DP: 20, Gnosis: 15},
                {Description: "-4 to the defender's AT", DP: 25, Gnosis: 20},
                {Description: "-5 to the defender's AT", DP: 30, Gnosis: 25}
            ]
        },
        'Special Attack': {
            Category: 'Offensive Abilities',
            Repeatable: true,
            Options: {
                Distance: [
                    {Description: 'Up to a distance of 80 feet', DP: 10, Gnosis: 5},
                    {Description: 'Up to a distance of 150 feet', DP: 20, Gnosis: 10},
                    {Description: 'Up to a distance of 300 feet', DP: 30, Gnosis: 15},
                    {Description: 'Up to a distance of 800 feet', DP: 40, Gnosis: 20},
                    {Description: 'Up to a distance of 1,500 feet', DP: 50, Gnosis: 25},
                    {Description: 'Up to a distance of one mile', DP: 60, Gnosis: 30},
                    {Description: 'Up to a distance of five miles', DP: 70, Gnosis: 35},
                    {Description: 'Up to any visible distance', DP: 80, Gnosis: 40}
                ],
                Damage: [
                    {Description: 'Base damage 40', Cost: 10, Gnosis: 5},
                    {Description: 'Base damage 50', Cost: 15, Gnosis: 10},
                    {Description: 'Base damage 60', Cost: 20, Gnosis: 10},
                    {Description: 'Base damage 80', Cost: 25, Gnosis: 10},
                    {Description: 'Base damage 100', Cost: 30, Gnosis: 15},
                    {Description: 'Base damage 120', Cost: 50, Gnosis: 20},
                    {Description: 'Base damage 150', Cost: 60, Gnosis: 20},
                    {Description: 'Base damage 200', Cost: 80, Gnosis: 25},
                    {Description: 'Base damage 250', Cost: 100, Gnosis: 30}
                ],
                Area: [
                    {Description: 'None (target only)', Cost: 0, Gnosis: 0},
                    {Description: '5-foot radius', Cost: 10, Gnosis: 10},
                    {Description: '10-foot radius', Cost: 20, Gnosis: 10},
                    {Description: '15-foot radius', Cost: 30, Gnosis: 15},
                    {Description: '30-foot radius', Cost: 40, Gnosis: 20},
                    {Description: '80-foot radius', Cost: 50, Gnosis: 25},
                    {Description: '150-foot radius', Cost: 60, Gnosis: 30},
                    {Description: '300-foot radius', Cost: 80, Gnosis: 35}
                ],
                'An Additional Attack': {DP: 5, Gnosis: 10, Repeatable: true},
                'Without limits': {DP: 60, Gnosis: 20}
            },
            Penalties: [
                {Description: 'Requires one turn to prepare', DP: -10, Gnosis: 5},
                {Description: 'Requires 2 turns to prepare', DP: -20, Gnosis: 5},
                {Description: 'Requires 3 turns to prepare', DP: -30, Gnosis: 5},
                {Description: 'Requires 5 turns to prepare', DP: -40, Gnosis: 5},
                {Description: 'Requires 10 turns to prepare', DP: -50, Gnosis: 5}
            ]
        },
        'Poisoned Attack': {
            Category: 'Offensive Abilities',
            Attack_Linked: true,
            Options: [
                {Description: 'Poison level 10', DP: 10, Gnosis: 0},
                {Description: 'Poison level 20', DP: 20, Gnosis: 0},
                {Description: 'Poison level 30', DP: 30, Gnosis: 0},
                {Description: 'Poison level 40', DP: 40, Gnosis: 0},
                {Description: 'Poison level 50', DP: 50, Gnosis: 0},
                {Description: 'Poison level 60', DP: 60, Gnosis: 0},
                {Description: 'Poison level 70', DP: 80, Gnosis: 0},
                {Description: 'Poison level 80', DP: 100, Gnosis: 10},
                {Description: 'Poison level 90', DP: 140, Gnosis: 20},
                {Description: 'Poison level 100', DP: 180, Gnosis: 30}
            ]
        },
        'Added Mystical Effect': {
            Category: 'Offensive Abilities',
            Attack_Linked: true,
            Options: {
                Resistance: [
                    {Description: 'MR or PhR 40', DP: 20, Gnosis: 5},
                    {Description: 'MR or PhR 60', DP: 30, Gnosis: 10},
                    {Description: 'MR or PhR 80', DP: 40, Gnosis: 15},
                    {Description: 'MR or PhR 100', DP: 50, Gnosis: 15},
                    {Description: 'MR or PhR 120', DP: 60, Gnosis: 20},
                    {Description: 'MR or PhR 140', DP: 80, Gnosis: 25},
                    {Description: 'MR or PhR 160', DP: 100, Gnosis: 30},
                    {Description: 'MR or PhR 180', DP: 120, Gnosis: 35},
                    {Description: 'MR or PhR 200', DP: 140, Gnosis: 40}
                ],
                Effect: [
                    {Description: 'Fear', DP: 20, Gnosis: 10},
                    {Description: 'Terror', DP: 60, Gnosis: 20},
                    {Description: 'Pain', DP: 20, Gnosis: 10},
                    {Description: 'Extreme pain', DP: 40, Gnosis: 20},
                    {Description: 'Weakness', DP: 50, Gnosis: 10},
                    {Description: 'Partial paralysis', DP: 40, Gnosis: 20},
                    {Description: 'Total paralysis', DP: 80, Gnosis: 20},
                    {Description: 'Rage', DP: 20, Gnosis: 20},
                    {Description: 'Blindness', DP: 50, Gnosis: 10},
                    {Description: 'Deafness', DP: 10, Gnosis: 10},
                    {Description: 'Mute', DP: 10, Gnosis: 10},
                    {Description: 'Fascination', DP: 20, Gnosis: 20},
                    {Description: 'Simple damage', DP: 30, Gnosis: 10},
                    {Description: 'Double damage', DP: 60, Gnosis: 20},
                    {Description: 'Unconsciousness', DP: 100, Gnosis: 20},
                    {Description: 'Dominate', DP: 120, Gnosis: 25},
                    {Description: 'Death', DP: 140, Gnosis: 25},
                    {Description: 'Madness', DP: 20, Gnosis: 20},
                    {Description: 'Age', DP: 60, Gnosis: 20},
                    {Description: 'All Action Penalty', DP: 60, Gnosis: 20},
                    {Description: 'Destroy characteristics', DP: 120, Gnosis: 20},
                    {Description: 'Possession', DP: 120, Gnosis: 25},
                    {Description: 'Drain (Half)', DP: 20, Gnosis: 10},
                    {Description: 'Drain (Complete)', DP: 50, Gnosis: 15},
                    {Description: 'Drain (Double)', DP: 100, Gnosis: 20}
                ],
                'Additional effect': {DP: 10, Gnosis: 10, Repeatable: true}
            },
            Penalties: {Description: 'Conditional effect', DP: -20, Gnosis: 10, Repeatable: true}
        },
        'Increased Critical': {
            Category: 'Offensive Abilities',
            Attack_Linked: true,
            Options: [
                {Description: '+10 to critical', DP: 10, Gnosis: 0},
                {Description: '+20 to critical', DP: 20, Gnosis: 0},
                {Description: '+30 to critical', DP: 30, Gnosis: 0},
                {Description: '+40 to critical', DP: 40, Gnosis: 5},
                {Description: '+50 to critical', DP: 50, Gnosis: 5},
                {Description: '+60 to critical', DP: 60, Gnosis: 10},
                {Description: '+70 to critical', DP: 70, Gnosis: 20},
                {Description: '+80 to critical', DP: 80, Gnosis: 30},
                {Description: '+90 to critical', DP: 90, Gnosis: 30},
                {Description: '+100 to critical', DP: 100, Gnosis: 40}
            ]
        },
        'Special Trapping': {
            Category: 'Offensive Abilities',
            Options: [
                {Description: 'Trapping 6', DP: 10, Gnosis: 0},
                {Description: 'Trapping 8', DP: 20, Gnosis: 0},
                {Description: 'Trapping 10', DP: 30, Gnosis: 0},
                {Description: 'Trapping 12', DP: 40, Gnosis: 10},
                {Description: 'Trapping 14', DP: 60, Gnosis: 20},
                {Description: 'Trapping 16', DP: 80, Gnosis: 25}
            ]
        },
        'Supernatural Attack': {
            Category: 'Offensive Abilities',
            Options: [
                {Description: 'Supernatural Attack', DP: 60, Gnosis: 20}
            ]
        },
        'Elemental Attack': {
            Category: 'Offensive Abilities',
            Options: [
                {Description: 'Elemental Attack', DP: 10, Gnosis: 10}
            ]
        },
        'Special Movement': {
            Category: 'Movement & Transport',
            Repeatable: true,
            Options: [
                {Description: 'Aquatic movement', DP: 20, Gnosis: 0},
                {Description: 'Free movement', DP: 20, Gnosis: 5},
                {Description: 'Movement without weight', DP: 10, Gnosis: 15},
                {Description: 'Subterranean movement', DP: 10, Gnosis: 0},
                {Description: 'Superior Subterranean movement', DP: 30, Gnosis: 20},
                {Description: 'Free movement through nature', DP: 10, Gnosis: 10}
            ]
        },
        'Automatic Transport': {
            Category: 'Movement & Transport',
            Options: {
                Distance: [
                    {Description: '60 feet', DP: 10, Gnosis: 10},
                    {Description: '150 feet', DP: 20, Gnosis: 10},
                    {Description: '300 feet', DP: 40, Gnosis: 15},
                    {Description: '800 feet', DP: 60, Gnosis: 15},
                    {Description: '1,500 feet', DP: 80, Gnosis: 20},
                    {Description: '1 mile', DP: 100, Gnosis: 20},
                    {Description: '3 miles', DP: 120, Gnosis: 25},
                    {Description: '15 miles', DP: 140, Gnosis: 30},
                    {Description: '60 miles', DP: 160, Gnosis: 35}
                ],
                Door: {DP: 200, Gnosis: 35},
                'An additional time': {DP: 10, Gnosis: 10, Repeatable: true},
                'Unlimited amount of times': {DP: 100, Gnosis: 35}
            },
            Penalties: {
                Preparation: [
                    {Description: 'None needed', DP: 0, Gnosis: 0},
                    {Description: 'Requires a turn to prepare', DP: -10, Gnosis: 10},
                    {Description: 'Requires 5 turns to prepare', DP: -30, Gnosis: 10},
                    {Description: 'Requires 10 turns to prepare', DP: -50, Gnosis: 10}
                ],
                'Through a specific terrain or element': {DP: -30, Gnosis: 10}
            }
        },
        'Increased Movement': {
            Category: 'Movement & Transport',
            Options: [
                {Description: 'Movement Value +1', DP: 10, Gnosis: 0},
                {Description: 'Movement Value +2', DP: 20, Gnosis: 5},
                {Description: 'Movement Value +3', DP: 30, Gnosis: 10},
                {Description: 'Movement Value +4', DP: 40, Gnosis: 20}
            ]
        },
        'Natural Flight Value': {
            Category: 'Movement & Transport',
            Options: [
                {Description: 'Natural flight 6', DP: 40, Gnosis: 0},
                {Description: 'Natural flight 8', DP: 60, Gnosis: 0},
                {Description: 'Natural flight 10', DP: 80, Gnosis: 0},
                {Description: 'Natural flight 12', DP: 100, Gnosis: 0},
                {Description: 'Natural flight 14', DP: 120, Gnosis: 10}
            ]
        },
        'Mystical Flight Value': {
            Category: 'Movement & Transport',
            Options: [
                {Description: 'Mystical flight 4', DP: 20, Gnosis: 10},
                {Description: 'Mystical flight 6', DP: 40, Gnosis: 15},
                {Description: 'Mystical flight 8', DP: 60, Gnosis: 20},
                {Description: 'Mystical flight 10', DP: 80, Gnosis: 20},
                {Description: 'Mystical flight 12', DP: 100, Gnosis: 25},
                {Description: 'Mystical flight 14', DP: 120, Gnosis: 30},
                {Description: 'Mystical flight 16', DP: 140, Gnosis: 35}
            ],
            Penalties: [
                {Description: 'Conditional flight', DP: -20, Gnosis: 10}
            ]
        },
        'Increased Physical Resistance': {
            Category: 'Resistances & Regeneration',
            Options: [
                {Description: '+10 to Resistances', DP: 10, Gnosis: 0},
                {Description: '+20 to Resistances', DP: 20, Gnosis: 0},
                {Description: '+30 to Resistances', DP: 30, Gnosis: 10},
                {Description: '+40 to Resistances', DP: 40, Gnosis: 20},
                {Description: '+50 to Resistances', DP: 50, Gnosis: 30}
            ],
            Penalties: [
                {Description: 'Only to one', DP: -20, Gnosis: 10}
            ]
        },
        'Mystical & Psychic Resistance': {
            Category: 'Resistances & Regeneration',
            Repeatable: ['MR', 'PsR'],
            Options: [
                {Description: '+10 to Supernatural resistance', DP: 10, Gnosis: 10},
                {Description: '+20 to Supernatural resistance', DP: 20, Gnosis: 15},
                {Description: '+30 to Supernatural resistance', DP: 30, Gnosis: 20},
                {Description: '+40 to Supernatural resistance', DP: 40, Gnosis: 25},
                {Description: '+50 to Supernatural resistance', DP: 50, Gnosis: 35}
            ]
        },
        'Penalty to Mystic Resistance': {
            Category: 'Resistances & Regeneration',
            Repeatable: ['MR', 'PsR'],
            Options: [
                {Description: '-10 to Magic or psychic Resistance', DP: -10, Gnosis: 10},
                {Description: '-20 to Magic or psychic Resistance', DP: -15, Gnosis: 10},
                {Description: '-30 to Magic or psychic Resistance', DP: -20, Gnosis: 10},
                {Description: '-40 to Magic or psychic Resistance', DP: -25, Gnosis: 20},
                {Description: '-50 to Magic or psychic Resistance', DP: -30, Gnosis: 20}
            ]
        },
        Regeneration: {
            Category: 'Resistances & Regeneration',
            Options: [
                {Description: 'Regeneration 2', DP: 10, Gnosis: 0},
                {Description: 'Regeneration 4', DP: 20, Gnosis: 0},
                {Description: 'Regeneration 6', DP: 30, Gnosis: 0},
                {Description: 'Regeneration 8', DP: 40, Gnosis: 5},
                {Description: 'Regeneration 10', DP: 60, Gnosis: 10},
                {Description: 'Regeneration 12', DP: 100, Gnosis: 15},
                {Description: 'Regeneration 14', DP: 140, Gnosis: 20},
                {Description: 'Regeneration 16', DP: 160, Gnosis: 25},
                {Description: 'Regeneration 18', DP: 180, Gnosis: 35},
                {Description: 'Regeneration 19', DP: 200, Gnosis: 45},
                {Description: 'Regeneration 20', DP: 220, Gnosis: 50}
            ],
            Penalties: [
                {Description: 'It does not work against an attack or condition', DP: -10, Gnosis: 0},
                {Description: 'It only works under certain situations', DP: -40, Gnosis: 10}
            ]
        },
        Degeneration: {
            Category: 'Resistances & Regeneration',
            Options: [
                {Description: 'Regeneration Zero', DP: -30, Gnosis: 10},
                {Description: '-10 Life points a day', DP: -40, Gnosis: 10},
                {Description: '-25 Life points a day', DP: -45, Gnosis: 10},
                {Description: '-50 Life points a day', DP: -50, Gnosis: 10},
                {Description: '-100 Life points a day', DP: -60, Gnosis: 10}
            ]
        },
        'Physical Immunity': {
            Category: 'Special Immunities',
            Options: [
                {Description: 'With any presence', DP: 40, Gnosis: 15},
                {Description: 'Presence less than 80', DP: 60, Gnosis: 20},
                {Description: 'Presence less than 100', DP: 80, Gnosis: 20},
                {Description: 'Presence less than 120', DP: 100, Gnosis: 25},
                {Description: 'Presence less than 140', DP: 140, Gnosis: 30},
                {Description: 'Presence less than 160', DP: 180, Gnosis: 35}
            ],
            Penalties: [
                {Description: 'Conditions', DP: -30, Gnosis: 15}
            ]
        },
        'Magical Immunity': {
            Category: 'Special Immunities',
            Options: [
                {Description: 'Zeonic value less than 60', DP: 30, Gnosis: 15},
                {Description: 'Zeonic value less than 80', DP: 40, Gnosis: 15},
                {Description: 'Zeonic value less than 100', DP: 50, Gnosis: 20},
                {Description: 'Zeonic value less than 150', DP: 75, Gnosis: 20},
                {Description: 'Zeonic value less than 200', DP: 100, Gnosis: 25},
                {Description: 'Zeonic value less than 250', DP: 125, Gnosis: 30},
                {Description: 'Zeonic value less than 300', DP: 150, Gnosis: 35}
            ],
            Penalties: [
                {Description: 'Conditions', DP: -30, Gnosis: 15}
            ]
        },
        'Immunity to Matrices': {
            Category: 'Special Immunities',
            Options: [
                {Description: 'Very Difficult Potential', DP: 60, Gnosis: 15},
                {Description: 'Absurd Potential', DP: 80, Gnosis: 20},
                {Description: 'Almost Impossible Potential', DP: 120, Gnosis: 25},
                {Description: 'Impossible Potential', DP: 140, Gnosis: 30}
            ],
            Penalties: [
                {Description: 'Conditions', DP: -30, Gnosis: 15}
            ]
        },
        'Damage Barrier': {
            Category: 'Special Immunities',
            Options: [
                {Description: 'Damage barrier 40', DP: 5, Gnosis: 0},
                {Description: 'Damage barrier 60', DP: 10, Gnosis: 0},
                {Description: 'Damage barrier 80', DP: 15, Gnosis: 5},
                {Description: 'Damage barrier 100', DP: 20, Gnosis: 5},
                {Description: 'Damage barrier 120', DP: 25, Gnosis: 10},
                {Description: 'Damage barrier 140', DP: 30, Gnosis: 10},
                {Description: 'Damage barrier 160', DP: 40, Gnosis: 10}
            ]
        },
        'Extreme Vulnerability': {
            Category: 'Special Immunities',
            Repeatable: true,
            Options: {
                'Vulnerable to': [
                    {Description: 'A specific element', DP: -20, Gnosis: 15},
                    {Description: 'Against a specific object', DP: -10, Gnosis: 15},
                    {Description: 'A word or sound', DP: -10, Gnosis: 15},
                    {Description: 'A generic material', DP: -20, Gnosis: 15},
                    {Description: 'A rare material', DP: -10, Gnosis: 15},
                    {Description: 'A specific place', DP: -10, Gnosis: 20},
                    {Description: 'A personal determined condition', DP: -10, Gnosis: 25}
                ],
                Consequences: [
                    {Description: 'Damage equal to the level of failure', DP: -10, Gnosis: 20},
                    {Description: 'Penalty equal to the level of failure', DP: -10, Gnosis: 20},
                    {Description: 'Unconsciousness', DP: -20, Gnosis: 20},
                    {Description: 'Complete paralysis', DP: -15, Gnosis: 20},
                    {Description: 'Weakness', DP: -10, Gnosis: 20},
                    {Description: 'Death', DP: -30, Gnosis: 20}
                ],
                'Resistance to consequences': [
                    {Description: 'MR or PhR against 140', DP: -10, Gnosis: 20},
                    {Description: 'MR or PhR against 160', DP: -15, Gnosis: 20},
                    {Description: 'MR or PhR against 180', DP: -20, Gnosis: 20},
                    {Description: 'MR or PhR against 200', DP: -25, Gnosis: 20}
                ]
            }
        },
        'Physical Armor': {
            Category: 'Armor',
            Options: [
                {Description: 'AT 1', DP: 10, Gnosis: 0},
                {Description: 'AT 2', DP: 20, Gnosis: 0},
                {Description: 'AT 3', DP: 30, Gnosis: 0},
                {Description: 'AT 4', DP: 40, Gnosis: 5},
                {Description: 'AT 5', DP: 50, Gnosis: 10},
                {Description: 'AT 6', DP: 60, Gnosis: 15},
                {Description: 'AT 7', DP: 80, Gnosis: 20},
                {Description: 'AT 8', DP: 100, Gnosis: 25},
                {Description: 'AT 9', DP: 120, Gnosis: 30},
                {Description: 'AT 10', DP: 140, Gnosis: 35},
                {Description: 'AT 12', DP: 180, Gnosis: 40}
            ],
            Penalties: {
                Limited: {DP: -10, Gnosis: 0},
                Open: {DP: -10, Gnosis: 0}
            }
        },
        'Mystical Armor': {
            Category: 'Armor',
            Options: [
                {Description: 'AT 1', DP: 10, Gnosis: 5},
                {Description: 'AT 2', DP: 20, Gnosis: 10},
                {Description: 'AT 3', DP: 30, Gnosis: 15},
                {Description: 'AT 4', DP: 40, Gnosis: 20},
                {Description: 'AT 5', DP: 50, Gnosis: 25},
                {Description: 'AT 6', DP: 60, Gnosis: 30},
                {Description: 'AT 7', DP: 70, Gnosis: 35},
                {Description: 'AT 8', DP: 80, Gnosis: 40}
            ]
        },
        'Spiritual Abilities': {
            Category: 'Souls',
            Options: {
                'Interaction with the world': {DP: 30, Gnosis: 30},
                'Manifestation': {DP: 20, Gnosis: 20},
                'Incarnation': {DP: 60, Gnosis: 30}
            }
        },
        'Elemental or Immaterial Form': {
            Category: 'Innate Supernatural Abilities',
            Options: {
                Form: [
                    {Description: 'Immaterial Form', DP: 80, Gnosis: 20},
                    {Description: 'Elemental Form', DP: 100, Gnosis: 20},
                    {Description: 'Spectral Form', DP: 100, Gnosis: 20}
                ],
                'Physical form at will': {DP: 10, Gnosis: 20}
            },
            Penalties: [
                {Description: 'Conditioned', DP: -20, Gnosis: 20}
            ]
        },
        'Innate Magic': {
            Category: 'Innate Supernatural Abilities',
            Repeatable: true,
            Options: {
                'Innate spell': {DP: 20, Gnosis: 5},
                'An additional use': {DP: 5, Gnosis: 10},
                'Unlimited': {DP: 100, Gnosis: 30}
            },
            Penalties: {
                Conditioned: {DP: -30, Gnosis: 10},
                Preparation: [
                    {Description: 'None needed', DP: 0, Gnosis: 0},
                    {Description: 'Requires a full turn to prepare', DP: -10, Gnosis: 10},
                    {Description: 'Requires 2 full turns to prepare', DP: -20, Gnosis: 10},
                    {Description: 'Requires 3 full turns to prepare', DP: -30, Gnosis: 10},
                    {Description: 'Requires 5 full turns to prepare', DP: -40, Gnosis: 10},
                    {Description: 'Requires 10 full turns to prepare', DP: -50, Gnosis: 10}
                ]
            }
        },
        'Innate Psychic Abilities': {
            Category: 'Innate Supernatural Abilities',
            Repeatable: true,
            Options: {
                'Innate Power': {DP: 20, Gnosis: 5},
                'An additional use': {DP: 5, Gnosis: 10},
                'Unlimited': {DP: 80, Gnosis: 25}
            },
            Penalties: {
                Conditioned: {DP: -30, Gnosis: 10},
                Preparation: [
                    {Description: 'None needed', DP: 0, Gnosis: 0},
                    {Description: 'Requires a full turn to prepare', DP: -10, Gnosis: 10},
                    {Description: 'Requires 2 full turns to prepare', DP: -20, Gnosis: 10},
                    {Description: 'Requires 3 full turns to prepare', DP: -30, Gnosis: 10},
                    {Description: 'Requires 5 full turns to prepare', DP: -40, Gnosis: 10},
                    {Description: 'Requires 10 full turns to prepare', DP: -50, Gnosis: 10}
                ]
            }
        },
        'Metamorphosis': {
            Category: 'Innate Supernatural Powers',
            Options: [
                {Description: 'Basic metamorphosis', DP: 40, Gnosis: 15},
                {Description: 'Metamorphosis', DP: 60, Gnosis: 20},
                {Description: 'Advanced Metamorphosis', DP: 100, Gnosis: 25}
            ],
            Penalties: [
                {Description: 'Conditioned', DP: -20, Gnosis: 20}
            ]
        },
        'Invisibility and Undetectable': {
            Category: 'Innate Supernatural Abilities',
            Repeatable: true,
            Options: {
                'Mystically undetectable': [
                    {Description: 'No', DP: 0, Gnosis: 0},
                    {Description: '+50 to Resistances', DP: 10, Gnosis: 10},
                    {Description: '+100 to Resistances', DP: 20, Gnosis: 20},
                    {Description: '+150 to Resistances', DP: 40, Gnosis: 20},
                    {Description: '+200 to Resistances', DP: 80, Gnosis: 25}
                ],
                'Chameleonic camouflage': {DP: 50, Gnosis: 10},
                'Spiritual invisibility': {DP: 80, Gnosis: 20},
                'Invisibility': {DP: 100, Gnosis: 25},
                'Complete invisibility': {DP: 150, Gnosis: 30},
                'Undetectable to a sense': {DP: 50, Gnosis: 10}
            },
            Penalties: [
                {Description: 'Only works under a certain situation', DP: -30, Gnosis: 20}
            ]
        },
        Aura: {
            Category: 'Innate Supernatural Powers',
            Repeatable: true,
            Options: {
                Area: [
                    {Description: '5-foot radius', DP: 40, Gnosis: 20},
                    {Description: '15-foot radius', DP: 60, Gnosis: 20},
                    {Description: '30-foot radius', DP: 80, Gnosis: 25},
                    {Description: '80-foot radius', DP: 100, Gnosis: 25},
                    {Description: '150-foot radius', DP: 120, Gnosis: 30},
                    {Description: '300-foot radius', DP: 140, Gnosis: 35}
                ],
                Resistance: [
                    {Description: 'MR or PhR against 40', DP: 20, Gnosis: 20},
                    {Description: 'MR or PhR against 60', DP: 30, Gnosis: 20},
                    {Description: 'MR or PhR against 80', DP: 40, Gnosis: 25},
                    {Description: 'MR or PhR against 100', DP: 50, Gnosis: 25},
                    {Description: 'MR or PhR against 120', DP: 60, Gnosis: 30},
                    {Description: 'MR or PhR against 140', DP: 80, Gnosis: 35}
                ],
                Effect: [
                    {Description: 'Fear', DP: 60, Gnosis: 20},
                    {Description: 'Terror', DP: 60, Gnosis: 20},
                    {Description: 'Pain', DP: 20, Gnosis: 10},
                    {Description: 'Extreme pain', DP: 40, Gnosis: 20},
                    {Description: 'Weakness', DP: 50, Gnosis: 10},
                    {Description: 'Partial paralysis', DP: 40, Gnosis: 20},
                    {Description: 'Complete paralysis', DP: 80, Gnosis: 20},
                    {Description: 'Rage', DP: 20, Gnosis: 20},
                    {Description: 'Blindness', DP: 50, Gnosis: 10},
                    {Description: 'Deafness', DP: 10, Gnosis: 10},
                    {Description: 'Mute', DP: 10, Gnosis: 10},
                    {Description: 'Fascination', DP: 20, Gnosis: 20},
                    {Description: 'Simple damage', DP: 30, Gnosis: 10},
                    {Description: 'Double damage', DP: 60, Gnosis: 20},
                    {Description: 'Unconsciousness', DP: 100, Gnosis: 20},
                    {Description: 'Dominate', DP: 120, Gnosis: 25},
                    {Description: 'Death', DP: 140, Gnosis: 25},
                    {Description: 'Madness', DP: 20, Gnosis: 20},
                    {Description: 'Age', DP: 60, Gnosis: 20},
                    {Description: 'Petrification', DP: 140, Gnosis: 30},
                    {Description: 'All Action Penalty', DP: 60, Gnosis: 20}
                ],
                'Link an additional effect to the same Resistance': {DP: 10, Gnosis: 20}
            },
            Penalties: [
                {Description: 'Additional condition', DP: -30, Gnosis: 20, Repeatable: true}
            ]
        },
        'Special Means of Vision': {
            Category: 'Special Perceptions',
            Repeatable: true,
            Options: [
                {Description: 'Night vision', DP: 10, Gnosis: 0},
                {Description: 'Complete night vision', DP: 20, Gnosis: 10},
                {Description: 'Extrasensorial vision', DP: 30, Gnosis: 10},
                {Description: 'See magic', DP: 10, Gnosis: 10},
                {Description: 'See matrices', DP: 10, Gnosis: 10},
                {Description: 'See spirits', DP: 10, Gnosis: 10},
                {Description: 'See the supernatural', DP: 30, Gnosis: 20}
            ]
        },
        'Supernatural Detection': {
            Category: 'Special Perceptions',
            Repeatable: true,
            Options: {
                Area: [
                    {Description: '15 feet', DP: 10, Gnosis: 10},
                    {Description: '30 feet', DP: 20, Gnosis: 10},
                    {Description: '80 feet', DP: 30, Gnosis: 15},
                    {Description: '150 feet', DP: 40, Gnosis: 15},
                    {Description: '200 feet', DP: 50, Gnosis: 20},
                    {Description: '1,500 feet', DP: 60, Gnosis: 20},
                    {Description: 'One mile', DP: 80, Gnosis: 25}
                ],
                Resistance: [
                    {Description: 'MR against 100', DP: 10, Gnosis: 10},
                    {Description: 'MR against 140', DP: 20, Gnosis: 10},
                    {Description: 'MR against 180', DP: 40, Gnosis: 15},
                    {Description: 'MR against 220', DP: 80, Gnosis: 20},
                    {Description: 'MR against 260', DP: 120, Gnosis: 25}
                ],
                Detect: [
                    {Description: 'Detect life', DP: 20, Gnosis: 10},
                    {Description: 'Detect something specific', DP: 30, Gnosis: 20}
                ]
            }
        }
    };
});
