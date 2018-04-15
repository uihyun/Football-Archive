'use strict';

module.exports = {
	isValid: function(competition) {
		switch (competition) {
			// nations
			case 'World Cup':
			case 'Asian Cup':
			case 'EURO':
			case 'Copa América':
			case 'Gold Cup':
			case 'Africa Cup':
			// clubs
			case 'Champions League':
			case 'Europa League':
			case 'FA Cup':
			case 'Copa del Rey':
			case 'Coppa Italia':
			case 'DFB-Pokal':
			case 'Coupe de France':
			case 'League Cup':
			case 'Coupe de la Ligue':
				return true;
			default:
				return false;
		}
	}
};
