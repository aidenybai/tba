const Request = require('./rest/Request.js');

module.exports = class Client extends Request {
	constructor(options = {}) {
		super(options);
	}

	getStatus() {
		return this._get('/status');
	}

	getTeam(teamKey) {
		return this._get(`/team/frc${teamKey}`);
	}

	getEvent(eventCode, year) {
		const eventKey = year + eventCode.toString().toLowerCase();
		return this._get(`/event/${eventKey}`);
	}

	getMatch(event, compLevel, matchNum, semiNum = '') {
		const matchKey = `${event.year + event.event_code}_${compLevel + semiNum}m${matchNum}`;
		return this._get(`/match/${matchKey}`);
	}

	getTeamAwards(team) {
		const { key } = team;
		return this._get(`/team/${key}/awards`);
	}

	getEventsForTeam(team) {
		const { key } = team;
		return this._get(`/team/${key}/events`);
	}

	getTeamsAtEvent(event) {
		const { key } = event;
		return this._get(`/event/${key}/teams`);
	}

	getMatchesAtEvent(event) {
		const { key } = event;
		return this._get(`/event/${key}/matches`);
	}

	getEventStreamLink(event) {
		if (event.webcasts.length) {
			const { type, channel } = event.webcasts[event.webcasts.length - 1];
			switch (type) {
				case 'ustream':
					return `https://www.ustream.tv/channel/${channel}`;
				case 'twitch':
					return `https://twitch.tv/${channel}`;
				default:
					return 'None';
			}
		} 
		else {
			return 'None';
		}
	}

	getTeamsInMatch(match) {
		const { red, blue } = match.alliances;
		const blueTeamLength = blue.team_keys.length;
		let teams = [];

		teams.push(blue.team_keys);
		teams.push.apply(blue.team_keys, red.team_keys);
		teams = teams[0];

		for (let i = 0; i < teams.length; i++) {
			this.getTeam(teams[i].substring(3)).then((teamInfo) => {
				teams[i] = JSON.stringify(teamInfo);
			});
		}

		const redTeam = teams.slice(blueTeamLength);
		const blueTeam = teams.slice(0, blueTeamLength);
		const data = {
			blue: [ blueTeam ],
			red: [ redTeam ]
		};
		return JSON.parse(data);
	}

	isMatchDone(match) {
		if (match.actual_time < new Date().getTime()) {
			return true;
		} else {
			return false;
		}
	}
};
