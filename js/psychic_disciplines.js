/*global define: false */
/**
 * Data on the Psychic Disciplines and Powers.
 * @module psychic_disciplines
 */
define({
    disciplines: {
        Cryokinesis: {
            'Create Chill': {Level: 1, Minimum: 'Easy', Maintenance: true},
            'Freeze': {Level: 1, Minimum: 'Difficult', Maintenance: true},
            'Sense Temperature': {Level: 1, Minimum: 'Difficult', Maintenance: true},
            'Eliminate Cold': {Level: 1, Minimum: 'Easy', Maintenance: false},
            'Cold Dominion': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Crystallize': {Level: 2, Minimum: 'Absurd', Maintenance: true},
            'Ice Splinters': {Level: 2, Minimum: 'Absurd', Maintenance: false},
            'Decrease Ambient Temperature': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Ice Shield': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Absolute Zero': {Level: 3, Minimum: 'Absurd', Maintenance: true},
            'Everlasting Moment': {Level: 3, Minimum: 'Absurd', Maintenance: true},
            'Major Cold': {Level: 3, Minimum: 'Almost Impossible', Maintenance: true}
        },
        Energy: {
            'Energy Object Creation': {Level: 1, Minimum: 'Difficult', Maintenance: true},
            'Energy Discharge': {Level: 1, Minimum: 'Difficult', Maintenance: false},
            'Create Energy': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Energy Shield': {Level: 1, Minimum: 'Difficult', Maintenance: true},
            'Sense Energy': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Modify Nature': {Level: 2, Minimum: 'Very Difficult', Maintenance: false},
            'Undo Energy': {Level: 2, Minimum: 'Difficult', Maintenance: false},
            'Immunity': {Level: 2, Minimum: 'Absurd', Maintenance: true},
            'Control Energy': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Energy Dome': {Level: 3, Minimum: 'Absurd', Maintenance: false},
            'Major Energy': {Level: 3, Minimum: 'Almost Impossible', Maintenance: true}
        },
        'Physical Increase': {
            'Increase Jump Ability': {Level: 1, Minimum: 'Easy', Maintenance: true},
            'Increase Ability': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Increase Acrobatics': {Level: 1, Minimum: 'Easy', Maintenance: true},
            'Increase Strength': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Inhumanity': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Increase Motion': {Level: 1, Minimum: 'Difficult', Maintenance: true},
            'Increase Reaction': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Perception Increase': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Increase Endurance': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Regeneration': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Fatigue Elimination': {Level: 3, Minimum: 'Absurd', Maintenance: false},
            'Total Increase': {Level: 3, Minimum: 'Absurd', Maintenance: true},
            'Imbue': {Level: 3, Minimum: 'Absurd', Maintenance: true}
        },
        Psychokinesis: {
            'Minor Psychokinesis': {Level: 1, Minimum: 'Easy', Maintenance: true},
            'Psychokinetic Impact': {Level: 1, Minimum: 'Medium', Maintenance: false},
            'Psychokinetic Trap': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Psychokinetic Shield': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Psychokinetic Armor': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Motion Detection': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Repulsion': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Ballistics': {Level: 2, Minimum: 'Difficult', Maintenance: false},
            'Shatter': {Level: 2, Minimum: 'Very Difficult', Maintenance: false},
            'Psychokinetic Flight': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Organic Psychokinesis': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Ground Control': {Level: 3, Minimum: 'Absurd', Maintenance: true},
            'Atomic Restructuring': {Level: 3, Minimum: 'Impossible', Maintenance: false},
            'Major Psychokinesis': {Level: 3, Minimum: 'Almost Impossible', Maintenance: true}
        },
        Pyrokinesis: {
            'Create Fire': {Level: 1, Minimum: 'Easy', Maintenance: true},
            'Extinguish Fire': {Level: 1, Minimum: 'Easy', Maintenance: false},
            'Control Fire': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Immolate': {Level: 1, Minimum: 'Difficult', Maintenance: false},
            'Igneous Maintenance': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Fire Immunity': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Igneous Barrier': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Raise Temperature': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Consume': {Level: 3, Minimum: 'Absurd', Maintenance: false},
            'Nova': {Level: 3, Minimum: 'Difficult', Maintenance: true},
            'Major Fire': {Level: 3, Minimum: 'Almost Impossible', Maintenance: false}
        },
        Sentience: {
            'Sense Feelings': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Intensify Feelings': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Detect Feelings': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Connect Senses': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Project Senses': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Eliminate Senses': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Create Feelings': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Infuse Feelings': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Destroy Feelings': {Level: 3, Minimum: 'Absurd', Maintenance: false},
            'Area': {Level: 3, Minimum: 'Very Difficult', Maintenance: true}
        },
        Telemetry: {
            'Sense Residues': {Level: 1, Minimum: 'Easy', Maintenance: true},
            'Read Past': {Level: 2, Minimum: 'Very Difficult', Maintenance: false},
            'Human Erudition': {Level: 3, Minimum: 'Difficult', Maintenance: false},
            'See In History': {Level: 3, Minimum: 'Absurd', Maintenance: true}
        },
        Telepathy: {
            'Area Scanning': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Mental Restraint': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Mind Reading': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Mental Communication': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Psychic Shield': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Psychic Illusion': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Mental Research': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Psychic Assault': {Level: 2, Minimum: 'Difficult', Maintenance: false},
            'Psychic Connection': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Alter Memory': {Level: 2, Minimum: 'Very Difficult', Maintenance: false},
            'Astral Shape': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Psychic Tracking': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Mind Control': {Level: 3, Minimum: 'Very Difficult', Maintenance: true},
            'Psychic Death': {Level: 3, Minimum: 'Absurd', Maintenance: false},
            'Area': {Level: 3, Minimum: 'Very Difficult', Maintenance: true}
        },
        Causality: {
            'Create Chaos': {Level: 1, Minimum: 'Absurd', Maintenance: true},
            'Delete Law of Causality': {Level: 2, Minimum: 'Absurd', Maintenance: true},
            'Alter Climate': {Level: 2, Minimum: 'Very Difficult', Maintenance: false},
            'Create Order': {Level: 3, Minimum: 'Impossible', Maintenance: true},
            'Control Causality': {Level: 3, Minimum: 'Almost Impossible', Maintenance: false}
        },
        Electromagnetism: {
            'Perceive Electricity': {Level: 1, Minimum: 'Difficult', Maintenance: false},
            'Create Electricity': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Electricity Control': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Magnetic Manipulation': {Level: 1, Minimum: 'Difficult', Maintenance: true},
            'Magnetic Shield': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Read Electrical Impulses': {Level: 2, Minimum: 'Difficult', Maintenance: true},
            'Electricity Arc': {Level: 2, Minimum: 'Difficult', Maintenance: false},
            'Magnetic Acceleration Attack': {Level: 3, Minimum: 'Almost Impossible', Maintenance: false},
            'Control Electrical Impulses': {Level: 3, Minimum: 'Almost Impossible', Maintenance: true}
        },
        Teleportation: {
            'Relocate Object': {Level: 1, Minimum: 'Medium', Maintenance: false},
            'Teleport Self': {Level: 1, Minimum: 'Difficult', Maintenance: false},
            'Defensive Transportation': {Level: 1, Minimum: 'Difficult', Maintenance: true},
            'Major Teleport Self': {Level: 2, Minimum: 'Absurd', Maintenance: false},
            'Aleph': {Level: 3, Minimum: 'Absurd', Maintenance: true},
            'Major Relocate Object': {Level: 3, Minimum: 'Almost Impossible', Maintenance: false},
            'Teleport': {Level: 3, Minimum: 'Absurd', Maintenance: false}
        },
        Light: {
            'Manipulate Light': {Level: 1, Minimum: 'Difficult', Maintenance: true},
            'Create Light': {Level: 1, Minimum: 'Medium', Maintenance: true},
            'Flash of Light': {Level: 1, Minimum: 'Medium', Maintenance: false},
            'Screen of Light': {Level: 2, Minimum: 'Very Difficult', Maintenance: true},
            'Hologram': {Level: 2, Minimum: 'Absurd', Maintenance: true},
            'Laser': {Level: 3, Minimum: 'Absurd', Maintenance: false}
        },
        Hypersensitivity: {
            'Filter Senses': {Level: 1, Minimum: 'Easy', Maintenance: true},
            'Move Sense': {Level: 2, Minimum: 'Medium', Maintenance: true},
            'Superior Sense': {Level: 3, Minimum: 'Absurd', Maintenance: true}
        }
    },
    
    matrix_powers: {
        'Sense Matrices': {Level: 1, Minimum: 'Easy', Maintenance: true},
        'Destroy Matrices': {Level: 1, Minimum: 'Difficult', Maintenance: true},
        'Hide Matrices': {Level: 1, Minimum: 'Medium', Maintenance: true},
        'Link Matrices': {Level: 1, Minimum: 'Difficult', Maintenance: true}
    }
});
