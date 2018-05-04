const rounds = {
	Common: {
		'Final': 'F',
		'Third place': '3rd',
		'Semi-finals': '4',
		'Quarter-finals': '8',
		'Round of 16': '16',
		'Round of 32': '32',
		'Play-offs': 'PO',
		'5 Round': '5R',
		'4 Round': '4R',
		'3 Round': '3R',
		'2 Round': '2R',
		'1 Round': '1R',
	},
	'FA Cup': {
		'4 Round': '32',
		'3 Round': '64'
	},
	'League Cup': {
		'3 Round': '32',
		'2 Round': '64'
	},
	'Copa del Rey': {
		'4 Round': '32',
	},
	'DFB-Pokal': {
		'2 Round': '32',
		'1 Round': '64',
	},
	'Coppa Italia': {
		'4 Round': '32',
		'3 Round': '64',
		'2 Round': '128',
		'1 Round': '256',
	},
	'Coupe de la Ligue': {
		'1 Round': '32',
		'3 Round': '32',
		'4 Round': '32',
	},
	'Coupe de France': {
		'10 Round': '32',
		'9 Round': '64',
	},
	'Europa League': {
		'3 Round': '32',
		'2 Round': '32',
	},
	'Supercopa': {
		'Final': '',
	},
	'Relegation Bundesliga': {
		'Matches': 'PO',
	},
	'WC Qualifiers Asia': {
		'Relegation': 'PO',
	},
	'WC Qualifiers Play-offs': {
		'Matches': 'PO',
	},
	getShortForm: function(comp, round) {
		if (this[comp] !== undefined) {
			if (this[comp][round] !== undefined) {
				return rounds[comp][round];
			}
		}

		if (this.Common[round] !== undefined) {
			return this.Common[round];
		}

		if (comp === 'WC Qualifiers Asia') {
			if (round.match(/3.*Round/)) {
				return '3R';
			} else if (round.match(/2.*Round/)) {
				return '2R';
			}
		}

		if (round.match(/^Group/)) {
			return 'G';
		}

		return round;
	},
	getRoundNumbers: function(comp) {
		if (this[comp] !== undefined) {
			return Object.assign(this.Common, this[comp]);
		}
			
		return this.Common;
	},
};

export default rounds;
