import { clubs } from '.';

const competitions = {
	'World Cup': {order: 1, name: 'World Cup', sh: 'WC', type: 'H', group: 0, times: [2014, 2018]},
	'Confederations Cup': {order: 3, name: 'Confed Cup', sh: 'CC', type: 'H', group: 1},
	'CONCACAF Confed Cup Playoff': {order: 5, name: 'Confed Cup Qualifiers', sh: 'CCQ', type: 'H', group: 1},
	'Asian Cup': {order: 2, name: 'Asian Cup', sh: 'AS', type: 'H', group: 1},
	'EURO': {order: 2, name: 'EURO', sh: 'EU', type: 'H', group: 1},
	'Copa América': {order: 2, name: 'Copa América', sh: 'SA', type: 'H', group: 1},
	'Gold Cup': {order: 2, name: 'Gold Cup', sh: 'NA', type: 'H', group: 1},
	'Africa Cup': {order: 2, name: 'Africa Nations Cup', sh: 'AF', type: 'H', group: 1},
	'WC Qualifiers Play-offs': {order: 4, name: 'World Cup Qualifiers PO', sh: 'WCQ', type: '2', group: 0},
	'WC Qualifiers Asia': {order: 4, name: 'World Cup Qualifiers', sh: 'WCQ', type: '2', group: 0},
	'WC Qualifiers Europe': {order: 4, name: 'World Cup Qualifiers', sh: 'WCQ', type: '2', group: 0},
	'WC Qualifiers South America': {order: 4, name: 'World Cup Qualifiers', sh: 'WCQ', type: '2', group: 0},
	'WC Qualifiers CONCACAF': {order: 4, name: 'World Cup Qualifiers', sh: 'WCQ', type: '2', group: 0},
	'WC Qualifiers Africa': {order: 4, name: 'World Cup Qualifiers', sh: 'WCQ', type: '2', group: 0},
	'EURO Qualifiers': {order: 5, name: 'EURO Qualifiers', sh: 'CCQ', type: '2', group: 1},
	'Gold Cup Quali.': {order: 5, name: 'Gold Cup Qualifiers', sh: 'CCQ', type: '2', group: 1},
	'Copa America Qualifiers': {order: 5, name: 'Copa América Qualifiers', sh: 'CCQ', type: '2', group: 1},
	'Africa Cup Qual.': {order: 2, name: 'Africa Cup Qualifiers', sh: 'CC', type: '2', group: 1},
	'Nations League A': {order: 6, name: 'Nations League A', sh: 'NL', type: '2', group: 1},
	'Nations League B': {order: 6, name: 'Nations League B', sh: 'NL', type: '2', group: 1},
	'Nations League C': {order: 6, name: 'Nations League C', sh: 'NL', type: '2', group: 1},
	'Friendlies': {order: 7, name: 'Friendlies', sh: 'Fr', type: '2', group: 2},

	'Champions League': {order: 2, name: 'Champions League', sh: 'UCL', type: '2', group: 0, years: clubs.years},
	'Champions League Qual.': {order: 2, name: 'Champions League Qualifiers', sh: 'UCL', type: '2', group: 0},
	'Europa League': {order: 3, name: 'Europa League', sh: 'UEL', type: '2', group: 0, years: clubs.years},
	'Europa League Qual.': {order: 3, name: 'Europa League Qualifiers', sh: 'UEL', type: '2', group: 0},
	'UI-Cup': {order: 3, name: 'Intertoto Cup', sh: 'UIC', type: '2', group: 0},
	'Club World Cup': {order: 5, name: 'Club World Cup', sh: 'CWC', type: 'H', group: 0},
	'UEFA-Supercup' : {order: 4, name: 'UEFA Supercup', sh: 'USC', type: 'H', group: 0},
	'Premier League': {order: 1, name: 'Premier League', sh: 'L', type: 'L', group: 1, years: clubs.years},
	'Primera División': {order: 1, name: 'Primera División', sh: 'L', type: 'L', group: 1, url: 'Primera-Division', years: clubs.years},
	'Bundesliga': {order: 1, name: 'Bundesliga', sh: 'L', type: 'L', group: 1, years: clubs.years},
	'Serie A': {order: 1, name: 'Serie A', sh: 'L', type: 'L', group: 1, years: clubs.years},
	'Ligue 1': {order: 1, name: 'Ligue 1', sh: 'L', type: 'L', group: 1, years: clubs.years},
	'FA Cup': {order: 6, name: 'FA Cup', sh: 'Cup', type: '2', group: 2, years: clubs.years},
	'Copa del Rey': {order: 6, name: 'Copa del Rey', sh: 'Cup', type: '2', group: 2, years: clubs.years},
	'DFB-Pokal': {order: 6, name: 'DFB-Pokal', sh: 'Cup', type: '2', group: 2, years: clubs.years},
	'Coppa Italia': {order: 6, name: 'Coppa Italia', sh: 'Cup', type: '2', group: 2, years: clubs.years},
	'Coupe de France': {order: 6, name: 'Coupe de France', sh: 'Cup', type: '2', group: 2, years: clubs.years},
	'League Cup': {order: 7, name: 'League Cup', sh: 'LC', type: '2', group: 2, years: clubs.years},
	'Coupe de la Ligue': {order: 7, name: 'Coupe de la Ligue', sh: 'LC', type: '2', group: 2, years: clubs.years},
	'FA Community Shield': {order: 8, name: 'Community Shield', sh: 'CS', type: 'H', group: 2},
	'Supercopa': {order: 8, name: 'Supercopa', sh: 'CS', type: '2', group: 2},
	'Supercup': {order: 8, name: 'Supercup', sh: 'CS', type: 'H', group: 2},
	'Supercoppa': {order: 8, name: 'Supercoppa', sh: 'CS', type: 'H', group: 2},
	'Trophée des Champions': {order: 8, name: 'Trophée des Champions', sh: 'CS', type: 'H', group: 2},
	'Relegation Bundesliga': {order: 9, name: 'Relegation', sh: 'R', type: '2', group: 1},

	domestic: {
		legend: ['League', 'Cup', 'League Cup'],
		clubs: {
			ENG: {
				'League': 'Premier League',
				'Cup': 'FA Cup',
				'League Cup': 'League Cup',
			},
			ESP: {
				'League': 'Primera División',
				'Cup': 'Copa del Rey',
			},
			GER: {
				'League': 'Bundesliga',
				'Cup': 'DFB-Pokal',
			},
			ITA: {
				'League': 'Serie A',
				'Cup': 'Coppa Italia',
			},
			FRA: {
				'League': 'Ligue 1',
				'Cup': 'Coupe de France',
				'League Cup': 'Coupe de la Ligue',
			},
		}
	},
	europe: ['Champions League', 'Europa League'],
};

export default competitions;
