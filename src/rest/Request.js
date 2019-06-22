const fetch = require('node-fetch');

module.exports = class Request {
	constructor(options) {
		this.options = options;
		this.baseURL = 'https://www.thebluealliance.com/api/v3';
		this.requestConfig = {
			method: 'GET',
			headers: { 'X-TBA-Auth-Key': this.options.token }
		};
	}

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
