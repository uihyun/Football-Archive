import playerNameException from '../data/players';

export default class PlayerName {
	static divide(name) {
		if (playerNameException[name]) {
			return playerNameException[name];
		}

		let index = name.indexOf(' ');

		if (index > 0) {
			return {first: name.substr(0, index).trim(), last: name.substr(index + 1).trim()};
		} else {
			return {first: '', last: name};
		}
	}

	static capitalize(name) {
		return name.charAt(0).toUpperCase() + name.slice(1);
	}

	static fullname(name) {
		if (name.first !== '') {
			return name.first + ' ' + name.last;
		} else {
			return name.last;
		}
	}

	static getDisplayName(name) {
		let divided = PlayerName.divide(name);
		return PlayerName.fullname(divided);
	}
}
