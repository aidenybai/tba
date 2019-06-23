const Request = require('./rest/Request.js');

/**
 * Main class
 *
 * @class Client
 * @extends {Request}
 */
module.exports = class Client extends Request {
	/**
	 * Creates an instance of Client.
	 * @param {*} [options={}]
	 */
	constructor(options = {}) {
		super(options);
	}

	/**
	 * Returns API status, and TBA status information.
	 *
	 * @returns {Promise}
	 */
	getStatus() {
		return this._get('/status');
	}

	/**
	 * Gets a Team object for the team referenced by the given key.
	 *
	 * @param {*} teamKey
	 * @returns {Promise}
	 */
	getTeam(teamKey) {
		return this._get(`/team/frc${teamKey}`);
	}

	/**
	 * Gets an Event.
	 *
	 * @param {*} eventCode
	 * @param {*} year
	 * @returns {Promise}
	 */
	getEvent(eventCode, year) {
		const eventKey = year + eventCode.toString().toLowerCase();
		return this._get(`/event/${eventKey}`);
	}

	/**
	 * Gets a Match object for the given match key.
	 *
	 * @param {*} event
	 * @param {*} compLevel
	 * @param {*} matchNum
	 * @param {string} [semiNum='']
	 * @returns {Promise}
	 */
	getMatch(event, compLevel, matchNum, semiNum = '') {
		const matchKey = `${event.year + event.event_code}_${compLevel + semiNum}m${matchNum}`;
		return this._get(`/match/${matchKey}`);
	}

	/**
	 * Gets a list of awards the given team has won.
	 *
	 * @param {*} team
	 * @returns {Promise}
	 */
	getTeamAwards(team) {
		const { key } = team;
		return this._get(`/team/${key}/awards`);
	}

	/**
	 * Gets a list of all events this team has competed at.
	 *
	 * @param {*} team
	 * @returns {Promise}
	 */
	getEventsForTeam(team) {
		const { key } = team;
		return this._get(`/team/${key}/events`);
	}

	/**
	 * Gets a list of Team objects that competed in the given event. 
	 *
	 * @param {*} event
	 * @returns {Promise}
	 */
	getTeamsAtEvent(event) {
		const { key } = event;
		return this._get(`/event/${key}/teams`);
	}

	/**
	 * Gets a list of matches for the given event.
	 *
	 * @param {*} event
	 * @returns {Promise}
	 */
	getMatchesAtEvent(event) {
		const { key } = event;
		return this._get(`/event/${key}/matches`);
	}

	/**
	 * Gets stream channel for the given team.
	 *
	 * @param {*} event
	 * @returns {String}
	 */
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

	/**
	 * Gets a list of team for the given match.
	 *
	 * @param {*} match
	 * @returns {Object}
	 */
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

	/**
	 * Determines if match is finished.
	 *
	 * @param {*} match
	 * @returns {Boolean}
	 */
	isMatchDone(match) {
		if (match.actual_time < new Date().getTime()) {
			return true;
		} else {
			return false;
		}
	}
};
