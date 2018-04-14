'use strict';

module.exports = {
	isValid: function(competition) {
		switch (competition) {
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
