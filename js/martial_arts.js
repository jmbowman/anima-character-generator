/*global define: false */
/**
 * Data for Basic and Advanced Martial Arts.
 * @module martial_arts
 */
define({
    'Aikido': {
        Base: {
            Damage: 10,
            Requirements: {
                'Sleight of Hand': 20
            }
        },
        Advanced: {
            Advantages: ['No penalties to Trapping or Take Down during a counterattack'],
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            MK: 10,
            Requirements: {
                'Sleight of Hand': 40,
                Attack: 100,
                Defense: 120
            }
        },
        Supreme: {
            Advantages: [
                '+2 to opposed Characteristic checks for Trapping or Take Down during or after a counterattack',
                'Add 4 times opponent\'s STR to Base Damage on counterattack'
            ],
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            Damage: 10,
            MK: 10,
            Requirements: {
                'Sleight of Hand': 80,
                Defense: 200
            }
        }
    },
    'Asakusen': {
        Base: {
            // Grants +10 Attack, Block, Damage, Dodge, & Initiative (not subject to +50 cap)
            MK: 10,
            Requirements: {
                'Martial Art': {
                    'Kung Fu': 'Advanced'
                },
                Attack: 160,
                Defense: 160
            }
        },
        Arcane: {
            Advantages: ['Kung Fu (Supreme) +20 bonus is increased to +40',
                         '+20 to Criticals on Aimed Attacks on vital points'],
            'Master Bonus': {
                Attack: 10,
                Block: 10,
                Dodge: 10
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    'Kung Fu': 'Supreme'
                },
                'Ki Abilities': ['Inhumanity'],
                Attack: 280,
                Defense: 280
            }
        }
    },
    'Boxing': {
        Base: {
            Bonus: {
                Initiative: 5
            },
            Damage: {
                Base: 10,
                Multiplier: 2
            },
            Requirements: {
                'Feats of Strength': 30
            }
        },
        Advanced: {
            Advantages: ['+10 to Attack when making a counterattack'],
            Bonus: {
                Initiative: 5
            },
            Damage: {
                Base: 20,
                Multiplier: 2
            },
            MK: 10,
            Requirements: {
                'Feats of Strength': 60,
                Attack: 120,
                Defense: 120
            }
        },
        Supreme: {
            Bonus: {
                Attack: 10,
                Initiative: 10
            },
            Damage: {
                Base: 30,
                Multiplier: 2
            },
            MK: 10,
            Requirements: {
                'Feats of Strength': 120,
                Attack: 200,
                Defense: 200
            }
        }
    },
    'Capoeira': {
        Base: {
            Advantages: ['Can affect 3 opponents with Area Attack (as Medium weapon)'],
            Damage: 20,
            Requirements: {
                Dance: 20
            }
        },
        Advanced: {
            Advantages: ['Can affect 5 opponents with Area Attack (as Large weapon)'],
            Replace: true,
            Bonus: {
                Dodge: 10
            },
            MK: 10,
            Requirements: {
                Dance: 40,
                Dodge: 120
            }
        },
        Supreme: {
            Advantages: ['Can perform Area Attack with only -10 to Attack'],
            Bonus: {
                Dodge: 10
            },
            MK: 10,
            Requirements: {
                Dance: 120,
                Dodge: 200
            }
        }
    },
    'Dumah': {
        Base: {
            Advantages: ['Can attack as Cut or Thrust',
                         '-2 to opponent\'s AT',
                         '+10 to Breakage'],
            Bonus: {
                Attack: 20
            },
            Damage: 10, // bonus to base
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Kempo: 'Advanced',
                    Capoeira: 'Advanced'
                },
                'Ki Abilities': ['Presence Extrusion']
            }
        },
        Arcane: {
            Advantages: ['Can attack as Cut or Thrust',
                         '-6 to opponent\'s AT',
                         '+25 to Breakage',
                         'Attacks automatically cause bleeding'],
            Damage: 20, // bonus to base
            'Master Bonus': {
                Attack: 20
            },
            MK: 10,
            Replace: true,
            Requirements: {
                'Martial Art': {
                    Kempo: 'Supreme',
                    Capoeira: 'Supreme'
                },
                'Ki Abilities': ['Inhumanity'],
                Attack: 280
            }
        }
    },
    'Emp': {
        Base: {
            Advantages: ['Disarm with no penalty and +3 to Characteristic checks when performing it'],
            Bonus: {
                Atack: 20,
                Initiative: 10
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Kempo: 'Advanced',
                    Kuan: 'Advanced',
                    'Malla-Yuddha': 'Advanced'
                },
                Attack: 200
            }
        },
        Arcane: {
            Advantages: ['Free disarm attempt on any successful defense'],
            Bonus: {
                Initiative: 10
            },
            'Master Bonus': {
                Attack: 20
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Kempo: 'Supreme',
                    Kuan: 'Supreme',
                    'Malla-Yuddha': 'Supreme'
                },
                Attack: 280,
                Defense: 260
            }
        }
    },
    'Enuth': {
        Base: {
            Advantages: ['+20 to Criticals when trying to knock opponent unconscious',
                         'Can reduce damage to exact amount desired'],
            Bonus: {
                Block: 20,
                Dodge: 20
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Sambo: 'Advanced',
                    Shotokan: 'Advanced'
                },
                Attack: 160,
                Defense: 160
            }
        },
        Arcane: {
            Advantages: ['All hits have chance of knocking enemy unconscious with +50 to Critical level',
                         'Can reduce damage to exact amount desired',
                         'Can determine opponent\'s remaining LP after each hit'],
            'Master Bonus': {
                Attack: 15,
                Block: 15,
                Dodge: 15
            },
            MK: 10,
            Replace: true,
            Requirements: {
                'Martial Art': {
                    Sambo: 'Supreme',
                    Shotokan: 'Supreme'
                },
                'Ki Abilities': ['Inhumanity', 'Erudition'],
                Attack: 280,
                Defense: 280
            }
        }
    },
    'Exelion': {
        Base: {
            Damage: {
                Base: 'Presence x2', // other bonuses never apply
                Characteristic: 'POW'
            },
            Bonus: {
                Attack: 10
            },
            MK: 15,
            Requirements: {
                'Martial Art': {
                    Kardad: 'Advanced',
                    'Tai Chi': 'Advanced'
                },
                Attack: 200,
                'Ki Abilities': ['Aura Extension']
            }
        },
        Arcane: {
            'Master Bonus': {
                Attack: 25
            },
            MK: 20,
            Requirements: {
                'Martial Art': {
                    Kardad: 'Supreme',
                    'Tai Chi': 'Supreme'
                },
                'Ki Abilities': ['Inhumanity'],
                Attack: 300
            }
        }
    },
    'Godhand': {
        Base: {
            Advantages: ['Can sacrifice an attack to gain +30 Attack and +50 Damage to first attack next turn'],
            Bonus: {
                Attack: 10
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Boxing: 'Advanced',
                    Shotokan: 'Advanced'
                },
                Attack: 200
            }
        },
        Arcane: {
            Advantages: ['Can sacrifice an attack to gain +60 Attack and +100 Damage to first attack next turn'],
            'Master Bonus': {
                Attack: 15
            },
            MK: 10,
            Replace: true,
            Requirements: {
                'Martial Art': {
                    Boxing: 'Supreme',
                    Shotokan: 'Supreme'
                },
                'Ki Abilities': ['Inhumanity', 'Presence Extrusion'],
                Attack: 300
            }
        }
    },
    'Grappling': {
        Base: {
            Advantages: ['Penalties for Trapping and Take Down are halved'],
            Damage: 10,
            Requirements: {
                'Feats of Strength': 20
            }
        },
        Advanced: {
            Advantages: ['No penalties for Trapping and Take Down'],
            Replace: true,
            Damage: 20,
            MK: 10,
            Requirements: {
                'Feats of Strength': 40,
                Attack: 130
            }
        },
        Supreme: {
            Advantages: ['Full damage instead of half when executing Trapping or Take Down'],
            MK: 10,
            Requirements: {
                'Feats of Strength': 120,
                Attack: 200
            }
        }
    },
    'Hakyoukuken': {
        Base: {
            Advantages: ['-2 to AT of soft armors',
                         '+20 to Critical level rolls against organic beings'],
            Bonus: {
                Attack: 10,
                Initiative: 20
            },
            Damage: 20, // bonus to base
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Shotokan: 'Advanced',
                    'Muay Thai': 'Advanced'
                },
                'Ki Abilities': ['Use of Necessary Energy'],
                Attack: 200
            }
        },
        Arcane: {
            Advantages: ['Soft armors ignored except Quality bonus',
                         '+40 to Critical level rolls against organic beings'],
            Bonus: {
                Initiative: 20
            },
            Damage: 30, // bonus to base
            'Master Bonus': {
                Attack: 20
            },
            MK: 10,
            Replace: true,
            Requirements: {
                'Martial Art': {
                    Shotokan: 'Supreme',
                    'Muay Thai': 'Supreme'
                },
                'Ki Abilities': ['Inhumanity'],
                Attack: 300
            }
        }
    },
    'Hanja': {
        Base: {
            Advantages: ['No penalties to defend against attacks from back',
                         'No penalties to defense in confined spaces',
                         'Can attack enemies at any position without penalty'],
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    'Soo Bahk': 'Advanced'
                },
                'Ki Abilities': ['Ki Detection'],
                Notice: 200,
                Defense: 200
            }
        },
        Arcane: {
            Advantages: ['No penalties when Partially or Mostly Immobilized or Put at Weapon\'s Point'],
            'Master Bonus': {
                Attack: 20
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    'Soo Bahk': 'Supreme'
                },
                'Ki Abilities': ['Inhumanity', 'Erudition'],
                Notice: 240,
                Defense: 300
            }
        }
    },
    'Kardad': {
        Base: {
            Advantages: ['+1 to Characteristic checks vs. Trapping and Take Down or to escape a hold'],
            Damage: 10,
            Requirements: {
                Athleticism: 40,
                'Sleight of Hand': 20
            }
        },
        Advanced: {
            Advantages: ['+3 to Characteristic checks vs. Trapping and Take Down or to escape a hold'],
            Replace: true,
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            Damage: 20,
            MK: 10,
            Requirements: {
                Athleticism: 60,
                'Sleight of Hand': 40,
                Defense: 120
            }
        },
        Supreme: {
            Advantages: ['Can once per turn retry a failed Characteristic check vs. Trapping or Take Down or to escape a hold'],
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            Damage: 30,
            MK: 10,
            Requirements: {
                Athleticism: 120,
                'Sleight of Hand': 100
            }
        }
    },
    'Kempo': {
        Base: {
            Advantages: ['Additional attacks are at -15 instead of -25'],
            Damage: 10
        },
        Advanced: {
            Advantages: ['Additional attacks are at -10 instead of -25'],
            Replace: true,
            Damage: 20,
            MK: 10,
            Requirements: {
                Attack: 120
            }
        },
        Supreme: {
            Advantages: ['Additional attacks limit as if Attack was 100 higher'],
            Bonus: {
                Attack: 10
            },
            MK: 10,
            Requirements: {
                Attack: 200
            }
        }
    },
    'Kuan': {
        Base: {
            Advantages: ['Penalty to Block against thrown projectiles is halved'],
            Damage: 10,
            Requirements: {
                'Sleight of Hand': 40
            }
        },
        Advanced: {
            Advantages: ['Penalty to Block and Dodge against fired projectiles is halved'],
            Bonus: {
                Block: 10
            },
            Damage: 20,
            MK: 10,
            Requirements: {
                'Sleight of Hand': 60,
                Defense: 120
            }
        },
        Supreme: {
            Advantages: ['No penalty to Block or Dodge against projectiles'],
            Replace: true,
            Bonus: {
                Block: 10
            },
            MK: 10,
            Requirements: {
                'Sleight of Hand': 60,
                Defense: 120
            }
        }
    },
    'Kung Fu': {
        Base: {
            Damage: 20,
            Requirements: {
                Acrobatics: 20,
                'Sleight of Hand': 20,
                Style: 10
            }
        },
        Advanced: {
            Advantages: ['+10 to Attack, Block, Damage, Dodge, or Initiative each turn'],
            MK: 10,
            Requirements: {
                Acrobatics: 40,
                'Sleight of Hand': 40,
                Style: 20,
                Attack: 120,
                Defense: 120
            }
        },
        Supreme: {
            Advantages: ['+20 to Attack, Block, Damage, or Initiative each turn',
                         'Can strike as Thrust or Impact'],
            Replace: true,
            MK: 10,
            Requirements: {
                Acrobatics: 120,
                'Sleight of Hand': 120,
                Style: 100,
                Attack: 200,
                Defense: 200
            }
        }
    },
    'Lama': {
        Base: {
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            Damage: 10,
            Requirements: {
                Style: 20
            }
        },
        Advanced: {
            Advantages: ['Defense penalties don\'t start until third attack'],
            Damage: 20,
            MK: 10,
            Requirements: {
                Defense: 130,
                Style: 40
            }
        },
        Supreme: {
            Advantages: ['Defense penalties don\'t start until fourth attack'],
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            MK: 10,
            Requirements: {
                Defense: 200,
                Style: 80
            }
        }
    },
    'Lama Tsu': {
        Base: {
            Advantages: ['Two additional defenses with no penalty per turn'],
            Bonus: {
                Block: 20,
                Dodge: 20
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    'Lama': 'Advanced'
                },
                'Ki Abilities': ['Ki Detection'],
                Style: 120,
                Defense: 220
            }
        },
        Arcane: {
            Advantages: ['Never suffer penalties for additional defenses'],
            'Master Bonus': {
                Block: 20,
                Dodge: 20
            },
            MK: 10,
            Replace: true,
            Requirements: {
                'Martial Art': {
                    'Lama': 'Supreme'
                },
                'Ki Abilities': ['Erudition'],
                Style: 140,
                Defense: 300
            }
        }
    },
    'Malla-Yuddha': {
        Base: {
            Advantages: ['+10 to Fortitude when Blocking with bare hands'],
            Damage: 20,
            Requirements: {
                'Sleight of Hand': 20
            }
        },
        Advanced: {
            Advantages: ['Takes no damage when Blocking with bare hands'],
            Replace: true,
            Bonus: {
                Block: 10
            },
            Damage: 30,
            MK: 10,
            Requirements: {
                'Sleight of Hand': 40,
                Defense: 120
            }
        },
        Supreme: {
            Advantages: ['Can attempt Disarm with no penalty when counterattack succeeds'],
            Bonus: {
                Block: 20
            },
            Damage: 40,
            MK: 10,
            Requirements: {
                'Sleight of Hand': 100,
                Block: 200
            }
        }
    },
    'Melkaiah': {
        Base: {
            Advantages: ['+3 to Characteristic checks when performing Take Down or Trapping'],
            Bonus: {
                Attack: 10
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Grappling: 'Advanced',
                    Pankration: 'Advanced'
                },
                'Ki Abilities': ['Inhumanity'],
                Attack: 160,
                Defense: 160
            }
        },
        Arcane: {
            'Advantages': ['+50 to Attack when releasing opponent to use Complete Attack',
                           '+3 to Characteristic checks when performing Crush or Strangle'],
            'Master Bonus': {
                Attack: 10,
                Block: 10,
                Dodge: 10
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Grappling: 'Supreme',
                    Pankration: 'Supreme'
                },
                Attack: 260,
                Defense: 260
            }
        }
    },
    'Muay Thai': {
        Base: {
            Damage: {
                Base: 20,
                Multiplier: 2
            },
            Requirements: {
                'Feats of Strength': 30
            }
        },
        Advanced: {
            Damage: {
                Base: 20,
                Multiplier: 3
            },
            MK: 10,
            Requirements: {
                'Feats of Strength': 40,
                Attack: 130
            }
        },
        Supreme: {
            Advantages: '+10 to Critical level',
            Damage: {
                Base: 20,
                Multiplier: 4
            },
            MK: 10,
            Requirements: {
                'Feats of Strength': 160,
                Attack: 200
            }
        }
    },
    'Mushin': {
        Base: {
            Advantages: ['Can attack pressure points to require PhR instead of directly taking LP'],
            Bonus: {
                Attack: 10
            },
            MK: 15,
            Requirements: {
                'Martial Art': {
                    'Kung Fu': 'Advanced',
                    'Xing Quan': 'Advanced'
                },
                'Medicine (Anatomy)': 100,
                Attack: 200
            }
        },
        Arcane: {
            Advantages: ['Can inflict special effects via pressure point attacks'],
            'Master Bonus': {
                Attack: 20
            },
            MK: 15,
            Requirements: {
                'Martial Art': {
                    'Kung Fu': 'Supreme',
                    'Xing Quan': 'Supreme'
                },
                'Ki Abilities': ['Inhumanity'],
                'Medicine (Anatomy)': 120,
                Attack: 300
            }
        }
    },
    'Pankration': {
        Base: {
            Advantages: ['Penalty for Trapping is halved'],
            Damage: 20,
            Requirements: {
                Athleticism: 30,
                'Feats of Strength': 30
            }
        },
        Advanced: {
            MK: 10,
            Requirements: {
                Athleticism: 50,
                'Feats of Strength': 50,
                Attack: 110,
                Defense: 110
            }
        },
        Supreme: {
            Advantages: ['Trapped opponents suffer -5 instead of -3 to escape'],
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            MK: 10,
            Requirements: {
                'Feats of Strength': 120,
                Defense: 200
            }
        }
    },
    'Rex Frame': {
        Base: {
            Advantages: ['AT 3 against all attack types',
                         'Damage Barrier 60'],
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    'Malla-Yuddha': 'Advanced',
                    'Muay Thai': 'Advanced'
                },
                Defense: 200,
                'Ki Abilities': ['Inhumanity']
            }
        },
        Arcane: {
            Advantages: ['AT 6 against all attack types',
                         'Damage Barrier 200'],
            'Master Bonus': {
                Block: 20,
                Dodge: 20
            },
            MK: 20,
            Replace: true,
            Requirements: {
                'Martial Art': {
                    'Malla-Yuddha': 'Supreme',
                    'Muay Thai': 'Supreme'
                },
                Defense: 300,
                'Ki Abilities': ['Zen']
            }
        }
    },
    'Sambo': {
        Base: {
            Advantages: ['Penalties for Take Down and Disarm are halved'],
            Damage: 10
        },
        Advanced: {
            Advantages: ['Penalties for Trapping and Area Attack are halved'],
            Bonus: {
                Block: 10
            },
            Damage: 20,
            MK: 10,
            Requirements: {
                Attack: 130
            }
        },
        Supreme: {
            Advantages: ['Penalties for Aimed Attacks are halved'],
            Bonus: {
                Block: 10
            },
            Damage: 30,
            MK: 10,
            Requirements: {
                Attack: 200,
                Defense: 200
            }
        }
    },
    'Selene': {
        Base: {
            Advantages: ['Double counterattack bonus'],
            Bonus: {
                Block: 20,
                Dodge: 20
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Aikido: 'Advanced'
                },
                Defense: 200
            }
        },
        Arcane: {
            Advantages: ['Can counterattack even if no attacks left unless on defensive'],
            'Master Bonus': {
                Block: 20,
                Dodge: 20
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Aikido: 'Supreme'
                },
                'Ki Abilities': ['Inhumanity'],
                Defense: 300
            }
        }
    },
    'Seraphite': {
        Base: {
            Advantages: ['Can gain +20 to Attack in exchange for -30 to defense'],
            Bonus: {
                Attack: 20
            },
            Damage: 10, // bonus to base
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Shotokan: 'Advanced',
                    Kempo: 'Advanced'
                },
                'Ki Abilities': ['Presence Extrusion'],
                Attack: 180
            }
        },
        Arcane: {
            Advantages: ['Can gain +30 to Attack in exchange for -50 to defense',
                         'Can attack on turn even if put on Defensive unless a Critical was suffered'],
            'Master Bonus': {
                Attack: 20
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Shotokan: 'Supreme',
                    Kempo: 'Supreme'
                },
                Attack: 280
            }
        }
    },
    'Shephon': {
        Base: {
            Advantages: ['Pure Defense bonus increased to +60'],
            Bonus: {
                Block: 20,
                Dodge: 20
            },
            MK: 10,
            Requirements: {
                'Martial Art': {
                    Aikido: 'Advanced',
                    Kuan: 'Advanced'
                },
                'Ki Abilities': ['Use of Ki'],
                Defense: 200
            }
        },
        Arcane: {
            Advantages: ['Pure Defense bonus increased to +100'],
            'Master Bonus': {
                Block: 20,
                Dodge: 20
            },
            MK: 10,
            Replace: true,
            Requirements: {
                'Martial Art': {
                    Aikido: 'Supreme',
                    Kuan: 'Supreme'
                },
                Defense: 300
            }
        }
    },
    'Shotokan': {
        Base: {
            Bonus: {
                Attack: 5
            },
            Damage: 20
        },
        Advanced: {
            Bonus: {
                Attack: 5
            },
            Damage: 30,
            MK: 10,
            Requirements: {
                Attack: 120,
                Defense: 120
            }
        },
        Supreme: {
            Bonus: {
                Attack: 10
            },
            Damage: 50,
            MK: 10,
            Requirements: {
                Attack: 200
            }
        }
    },
    'Soo Bahk': {
        Base: {
            Advantages: ['Penalty to defending from flanks is halved'],
            Damage: 10,
            Requirements: {
                Notice: 50
            }
        },
        Advanced: {
            Advantages: ['No penalty when defending from flanks', 'Can attack enemies at flanks without facing them'],
            Replace: true,
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            Damage: 20,
            MK: 10,
            Requirements: {
                Notice: 90,
                Defense: 120
            }
        },
        Supreme: {
            Advantages: ['No penalty to Attack or Defense when knocked down'],
            Bonus: {
                Block: 10,
                Dodge: 10
            },
            Damage: 30,
            MK: 10,
            Requirements: {
                Notice: 120,
                Acrobatics: 60,
                Defense: 200
            }
        }
    },
    'Suyanta': {
        Base: {
            Advantages: ['Can inflict damage to Ki Points instead of LP'],
            Bonus: {
                Attack: 10
            },
            MK: 15,
            Requirements: {
                'Martial Art': {
                    'Tai Chi': 'Advanced'
                },
                'Ki Abilities': ['Presence Extrusion'],
                Attack: 200
            }
        },
        Arcane: {
            Advantages: ['Inflicts damage to both LP and Ki Points'],
            Damage: 'POW',
            'Master Bonus': {
                Attack: 15
            },
            MK: 20,
            Replace: true,
            Requirements: {
                'Martial Art': {
                    'Tai Chi': 'Supreme'
                },
                'Ki Abilities': ['Inhumanity'],
                Attack: 300
            }
        }
    },
    'Tae Kwon Do': {
        Base: {
            Advantages: ['Can make one additional attack with legs at -30'],
            Damage: 10
        },
        Advanced: {
            Advantages: ['Can make one additional attack with legs at -20'],
            Replace: true,
            Damage: 20,
            MK: 10,
            Requirements: {
                Attack: 130,
                Defense: 100
            }
        },
        Supreme: {
            Advantages: ['Can make one additional attack with legs at no penalty'],
            Replace: true,
            MK: 10,
            Requirements: {
                Attack: 200
            }
        }
    },
    'Tai Chi': {
        Base: {
            Damage: {
                Base: 20,
                Characteristic: 'POW'
            },
            MK: 10
        },
        Advanced: {
            Damage: {
                Base: 20,
                Characteristic: 'POW',
                Multiplier: 2
            },
            MK: 20,
            Requirements: {
                'Ki Abilities': ['Use of Ki']
            }
        },
        Supreme: {
            Damage: {
                Base: 20,
                Characteristic: 'POW',
                Multiplier: 3
            },
            MK: 30,
            Requirements: {
                'Ki Abilities': ['Use of Necessary Energy'],
                Attack: 180,
                Defense: 180
            }
        }
    },
    'Velez': {
        Base: {
            Advantages: ['Can strike as Energy'],
            Bonus: {
                Block: 20,
                Dodge: 20
            },
            MK: 20,
            Requirements: {
                'Martial Art': {
                    'Tai Chi': 'Advanced',
                    'Kung Fu': 'Advanced'
                },
                'Ki Abilities': ['Presence Extrusion']
            }
        },
        Arcane: {
            Advantages: ['Attacks are intangible and invisible',
                         'Can use Power for opposed Characteristic checks for maneuvers'],
            'Master Bonus': {
                Block: 15,
                Dodge: 15
            },
            MK: 20,
            Requirements: {
                'Martial Art': {
                    'Tai Chi': 'Supreme',
                    'Kung Fu': 'Supreme'
                },
                Attack: 280
            }
        }
    },
    'Xing Quan': {
        Base: {
            Advantages: ['+10 to Attack when focused on one enemy who lost initiative'],
            Damage: 10,
            Requirements: {
                'Sleight of Hand': 20
            }
        },
        Advanced: {
            Advantages: ['+20 to Attack when focused on one enemy who lost initiative'],
            Replace: true,
            Damage: 20,
            MK: 10,
            Requirements: {
                'Sleight of Hand': 50,
                Initiative: 100,
                Attack: 120
            }
        },
        Supreme: {
            Advantages: ['+30 to Attack when focused on one enemy who lost initiative'],
            Damage: 30,
            MK: 10,
            Replace: true,
            Requirements: {
                'Sleight of Hand': 100,
                Initiative: 120,
                Attack: 200
            }
        }
    }
});
