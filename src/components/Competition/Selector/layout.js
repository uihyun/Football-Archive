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
	}
};

export default layout;
