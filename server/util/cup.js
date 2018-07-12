'use strict';

module.exports = {
	isValid: function(competition) {
		switch (competition) {
			// nations
			case 'World Cup':
			case 'Confederations Cup':
			case 'EURO':
			case 'Copa América':
			case 'Gold Cup':
			case 'Africa Cup':
			case 'Asian Cup':
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
			// AFC
			case 'AFC Champions League':
			case 'Emperor\'s Cup':
			case 'J League Cup':
			case 'CFA Cup':
				return true;
			default:
				return false;
		}
	},
	useH2H: function (competition) {
		switch (competition) {
			// nations
			case 'EURO':
			// clubs
			case 'Champions League':
			case 'Europa League':
				return true;
			default:
				return false;
		}
	},
	oldCups: [
		{ season: '2010', name:	'World Cup', url: '/all_matches/wm-2010-in-suedafrika/' },
		{ season: '2006', name:	'World Cup', url: '/all_matches/wm-2006-in-deutschland/' },
		{ season: '2002', name:	'World Cup', url: '/all_matches/wm-2002-in-japan-suedkorea/' },
		{ season: '2013', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2013-in-brasilien/' },
		{ season: '2009', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2009-in-suedafrika/' },
		{ season: '2005', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2005-in-deutschland/' },
		{ season: '2003', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2003-in-frankreich/' },
		{ season: '2001', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2001-in-japan-suedkorea/' },
		{ season: '2012', name:	'EURO', url: '/all_matches/em-2012-in-polen-ukraine/' },
		{ season: '2008', name:	'EURO', url: '/all_matches/em-2008-in-oesterreich-schweiz/' },
		{ season: '2004', name:	'EURO', url: '/all_matches/em-2004-in-portugal/' },
		{ season: '2000', name:	'EURO', url: '/all_matches/em-2000-in-holland-belgien/' },
		{ season: '2011', name:	'Copa América', url: '/all_matches/copa-america-2011-in-argentinien/' },
		{ season: '2007', name:	'Copa América', url: '/all_matches/copa-america-2007-in-venezuela/' },
		{ season: '2004', name:	'Copa América', url: '/all_matches/copa-america-2004-in-peru/' },
		{ season: '2001', name:	'Copa América', url: '/all_matches/copa-america-2001-in-kolumbien/' },
		{ season: '2013', name:	'Gold Cup', url: '/all_matches/gold-cup-2013-usa/' },
		{ season: '2011', name:	'Gold Cup', url: '/all_matches/gold-cup-2011-usa/' },
		{ season: '2009', name:	'Gold Cup', url: '/all_matches/gold-cup-2009-usa/' },
		{ season: '2007', name:	'Gold Cup', url: '/all_matches/gold-cup-2007-usa/' },
		{ season: '2005', name:	'Gold Cup', url: '/all_matches/gold-cup-2005-usa/' },
		{ season: '2003', name:	'Gold Cup', url: '/all_matches/gold-cup-2003-usa-mexiko/' },
		{ season: '2002', name:	'Gold Cup', url: '/all_matches/gold-cup-2002-usa/' },
		{ season: '2000', name:	'Gold Cup', url: '/all_matches/gold-cup-2000-usa/' },
		{ season: '2013', name:	'Africa Cup', url: '/all_matches/afrika-cup-2013-suedafrika/' },
		{ season: '2012', name:	'Africa Cup', url: '/all_matches/afrika-cup-2012-gabun-und-aequatorialg/' },
		{ season: '2010', name:	'Africa Cup', url: '/all_matches/afrika-cup-2010-angola/' },
		{ season: '2008', name:	'Africa Cup', url: '/all_matches/afrika-cup-2008-in-ghana/' },
		{ season: '2006', name:	'Africa Cup', url: '/all_matches/afrika-cup-2006-in-aegypten/' },
		{ season: '2004', name:	'Africa Cup', url: '/all_matches/afrika-cup-2004-in-tunesien/' },
		{ season: '2002', name:	'Africa Cup', url: '/all_matches/afrika-cup-2002-in-mali/' },
		{ season: '2000', name:	'Africa Cup', url: '/all_matches/afrika-cup-2000-in-ghana-nigeria/' },
		{ season: '2011', name:	'Asian Cup', url: '/all_matches/asian-cup-2011-katar/' },
		{ season: '2007', name:	'Asian Cup', url: '/all_matches/asian-cup-2007-idn-mas-tha-vie/' },
		{ season: '2004', name:	'Asian Cup', url: '/all_matches/asian-cup-2004-china/' },
		{ season: '2000', name:	'Asian Cup', url: '/all_matches/asian-cup-2000-libanon/' },
	]
};
