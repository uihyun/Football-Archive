'use strict';

module.exports = {
	getEmptyTeam: function(name) {
		return {
			name: name,
			games: {p: 0, w: 0, d: 0, l: 0},
			goals: {d: 0, f: 0, a: 0},
			h2h: {}
		};
	},
	getEmptyH2H: function() {
		return {
			games: {p: 0, w: 0, d: 0, l: 0},
			goals: {d: 0, f: 0, a: 0, away: 0},
			points: 0
		};
	},
	compareFn: function(a, b) {
		if (a.points !== b.points) {
			return b.points - a.points;
		} else if (a.goals.d !== b.goals.d) {
			return b.goals.d - a.goals.d;
		} else {
			return b.goals.f - a.goals.f;
		}
	},
	compareFnH2H: function(a, b) {
		if (a.points === b.points) {
			var h2h = this.compareFn(a.h2h[b.name], b.h2h[a.name]);

			if (h2h !== 0) {
				return h2h;
			} else if (a.h2h[b.name].goals.away !== b.h2h[a.name].goals.away) {
				return b.h2h[a.name].goals.away - a.h2h[b.name].goals.away;
			}
		}
			
		return this.compareFn(a, b);
	},
	compareFnWithName: function(a, b) {
		if (a.rank === b.rank) {
			return (a.name < b.name) ? -1 : 1;
		} else {
			return a.rank - b.rank;
		}
	}

};
