'use strict';

module.exports = {
	isValid: function(competition) {
		switch (competition) {
			// nations
			case	'WC Qualifiers Play-offs':
			case	'WC Qualifiers Europe':
			case	'WC Qualifiers South America':
			case	'WC Qualifiers CONCACAF':
			case	'WC Qualifiers Africa':
			case	'WC Qualifiers Asia':
			case	'EURO Qualifiers':
			case	'Africa Cup Qual.':
			case	'Asian Cup Qual.':
				return true;
			default:
				return false;
		}
	},
};
