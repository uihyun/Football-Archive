const layout = {
	domestic: {
		legend: ['League', 'Cup', 'League Cup'],
		list: ['ENG', 'ESP', 'GER', 'ITA', 'FRA'],
		groups: {
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
	fifa: ['World Cup', 'Confederations Cup'],
	continental: {
		legend: ['Cup'],
		list: ['EU', 'SA', 'NA', 'AF', 'AS'],
		groups: {
			EU: {
				'Cup': 'EURO',
			},
			SA: {
				'Cup': 'Copa América',
			},
			NA: {
				'Cup': 'Gold Cup',
			},
			AF: {
				'Cup': 'Africa Cup',
			},
			AS: {
				'Cup': 'Asian Cup',
			},
		}
	},
	asia: ['AFC Champions League'],
	kleague: {
		legend: ['1', '2', 'Cup', 'League Cup'],
		list: ['K', 'J'],
		groups: {
			K: {
				'1': 'K League 1',
				'2': 'K League 2',
				'Cup': 'KFA Cup',
			},
			J: {
				'1': 'J1 League',
				'Cup': 'Emperor\'s Cup',
				'League Cup': 'J League Cup',
			}
		}
	}
};

export default layout;
