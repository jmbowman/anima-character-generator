/*global define: false */
/**
 * Assorted data lists and tables too short to merit their own files.
 * @module tables
 */
define({
    characteristics: ['STR', 'DEX', 'AGI', 'CON', 'INT', 'POW', 'WP', 'PER'],
    primary_combat_abilities: ['Attack', 'Block', 'Dodge'],
    elements: ['Air', 'Darkness', 'Earth', 'Fire', 'Light', 'Water'],
    fields: ['Athletics', 'Creative', 'Intellectual', 'Perceptive', 'Social', 'Subterfuge', 'Vigor'],
    modifiers: [0, -30, -20, -10, -5, 0, 5, 5, 10, 10, 15, 20, 20, 25, 25, 30, 35, 35, 40, 40, 45],
    base_lp: [0, 5, 20, 40, 55, 70, 85, 95, 110, 120, 135, 150, 160, 175, 185, 200, 215, 225, 240, 250, 265],
    base_zeon: [0, 5, 20, 40, 55, 70, 85, 95, 110, 120, 135, 150, 160, 175, 185, 200, 215, 225, 240, 250, 265],
    base_ma: [0, 0, 0, 0, 0, 5, 5, 5, 10, 10, 10, 10, 15, 15, 15, 20, 25, 25, 30, 30, 35],
    magic_level: [0, 0, 0, 0, 0, 0, 10, 20, 30, 40, 50, 75, 100, 150, 200, 300, 400, 500, 600, 700, 800],
    klutzy: ['Attack', 'Block', 'Disguise', 'Forging', 'Lock Picking', 'Sleight of Hand', 'Theft', 'Trap Lore'],
    opposite_elements: {
        'Air': 'Earth',
        'Darkness': 'Light',
        'Earth': 'Air',
        'Fire': 'Water',
        'Light': 'Darkness',
        'Water': 'Fire'
    },
    regeneration: [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12],
    resistances: {DR: 'CON', MR: 'POW', PhR: 'CON', VR: 'CON', PsR: 'WP'},
    theorems: ['Standard', 'Natural Magic', 'Onmyodo', 'Shamanism', 'Vodoun'],
    xp_chart: [0, 100, 225, 375, 550, 750, 975, 1225, 1500, 1800, 2125, 2475, 2850, 3250, 3675, 4125]
});
