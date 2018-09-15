'use strict';

const path = require('path');

const exec = require('../../util/exec');

const KLeagueUtil = require('../../util/kleague');

module.exports = function(url) {
		
	const teamNameMap = KLeagueUtil.teamNameMap;

	function getPlayers(array, side) {
		var result = [];

		array.forEach(player => {
			result.push({ number: player[side + '_Back_No'], name: player[side + '_Player_Name'] });
		});

		return result;
	}

	function getPlayerMap(players) {
		var map = {};

		players.start.forEach(player => { map[player.number] = player; });
		players.sub.forEach(player => { map[player.number] = player; });

		return map;
	}

	function getGoal(elem, time) {
		var side = elem.actionTeam === 'H' ? 'l' : 'r';
		var player = elem.Remark1.replace(/\d* /, '');

		var goal = { side: side, scorer: player, minute: time };

		var remark2 = elem.Remark2;

		if (remark2.match(/도/)) {
			goal.assist = remark2.replace(/[()도]/g, '');
		} else if (remark2 === '(PK)') {
			goal.style = 'penalty';
		} else if (remark2 === '(자책)') {
			goal.style = 'own goal';
		}

		return goal;
	}

	function getCard(elem, time, type) {
		var side = elem.actionTeam === 'H' ? 'l' : 'r';
		var player = elem.Remark1.replace(/ \D*/, '');
		var card = { side: side, type: type, minute: time, player: player };

		return card;
	}

	function getSub(elem, time) {
		var side = elem.actionTeam === 'H' ? 'l' : 'r';
		var playerIn = elem.Remark1.replace(/ \D*/, '');
		var playerOut = elem.Remark2.replace(/[()]/g, '');
		var sub = { side: side, minute: time, in: playerIn, out: playerOut };

		return sub;
	}

	function getActions(array) {
		var goals = [];
		var cards = [];
		var subs = [];

		array.forEach(minute => {
			var time = (minute.Half_Type - 1) * 45 + Math.min(minute.Min_Seq, 45);
			switch (minute.Action_Type) {
				case 'G': // goal
					goals.push(getGoal(minute, time))
					break;
				case 'Y': // yellow
					cards.push(getCard(minute, time, 'yellow'));
					break;
				case 'Z': // second-yellow
					cards.push(getCard(minute, time, 'Second yellow'));
					break;
				case 'R': // red
					cards.push(getCard(minute, time, 'red'));
					break;
				case 'C': // sub
					subs.push(getSub(minute, time));
					break;
				default:
					break;
			}
		});

		return { goals: goals, cards: cards, subs: subs };
	}

	function addSub(player, minute) {
		if (player === undefined)
			return;

		if (player.sub !== undefined)
			player.sub = [player.sub, minute];
		else
			player.sub = minute;
	}

	const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'kleague_match.pl') + ' \'' + url + '\'';

	return exec(execStr)
		.then(function (data) {
			if (data === '') {
				return null;
			}

			if (data[3][0].MATCH_TYPE_NAME === '' || data[2][0] === null) {
				res.sendStatus(200);
			}

			console.log(data[8]);

			var match = {};

			match.l = data[9][0].H_team_name;
			match.r = data[9][0].A_team_name;
		
			if (teamNameMap[match.l])
				match.l = teamNameMap[match.l];

			if (teamNameMap[match.r])
				match.r = teamNameMap[match.r];

			var players = { l: {}, r: {} };
			players.l.start = getPlayers(data[0], 'H');
			players.r.start = getPlayers(data[0], 'A');
			players.l.sub = getPlayers(data[1], 'H');
			players.r.sub = getPlayers(data[1], 'A');

			var map = {};
			map.l = getPlayerMap(players.l);
			map.r = getPlayerMap(players.r);

			match.players = players;

			var actions = getActions(data[8]);

			actions.goals.forEach(goal => {
				if (goal.assist) {
					goal.assist = map[goal.side][goal.assist].name;
				}
			});

			actions.cards.forEach(card => {
				var player = map[card.side][card.player];

				if (player !== undefined)
					player.card = { type: card.type, minute: card.minute };
			});

			actions.subs.forEach(sub => {
				addSub(map[sub.side][sub.in], sub.minute);
				addSub(map[sub.side][sub.out], sub.minute);
			});

			return match;
		});
}
