define(['jquery', 'abilities', 'libs/utils'], function($, abilities) {

  primaries = {
	Combat: [
	  'Attack',
	  'Block',
	  'Dodge',
	  'Wear Armor',
	  'Ki',
	  'Accumulation Multiple'
	],
	Supernatural: [
	  'Zeon',
	  'MA Multiple',
	  'Magic Projection',
	  'Summon',
	  'Control',
	  'Bind',
	  'Banish'
	],
	Psychic: [
	  'Psychic Points',
	  'Psychic Projection'
	],
	Other: $.map(Object.keys(abilities), function(name, i) {
	  if ('Field' in abilities[name]) {
	    return name;
	  }
	  else {
	    return null;
	  }
	})
  };

  return primaries;
});
