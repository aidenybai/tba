const fetch = require('node-fetch');
/**
 * Request Class
 *
 * @class Request
 */
module.exports = class Request {
	/**
	 * Creates an instance of Request.
	 * @param {*} options
	 */
	constructor(options) {
		this.options = options;
		this.baseURL = 'https://www.thebluealliance.com/api/v3';
		this.requestConfig = {
			method: 'GET',
			headers: { 'X-TBA-Auth-Key': this.options.token }
		};
	}

	/**
	 * Promisified request method.
	 *
	 * @param {*} endpoint
	 * @returns {Promise}
	 */
	_get(endpoint) {
		return new Promise((resolve, reject) => {
			fetch(this.baseURL + endpoint, this.requestConfig)
				.then((body) => {
					if (body.ok) {
						resolve(body.json());
					} else {
						reject(`Error Code ${body.status}`);
					}
				})
				.catch((err) => {
          new Error(err)
        });
		});
	}
};
