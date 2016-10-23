'use strict';

import Promise from 'promise';
import Request from './libs/request';
import REQUEST from './libs/constants';

class YellowLab
{
	/**
	 * Create a new instance.
	 * @param {String} namespace
	 */
	constructor(namespace = 'data')
	{
		this.queryNamespace = namespace;
	}

	/**
	 * Make a request.
	 *
	 * The request can be any of the standard
	 * HTTP request types. EX (GET, POST, DELETE, PATCH, PUT)
	 *
	 * @param {String} url
	 * @param {Object} data
	 * @param {String} method
	 * @return {Promise}
	 */
	retreive(url, data, method = REQUEST.POST)
	{
		let request = new Request(url, data, method);

		return new Promise(request.handle.bind(request));
	}

	/**
	 * Make a JSONP request.
	 *
	 * @param {String} url
	 * @param {Object} data
	 * @return {Promise}
	 */
	retreiveJsonp(url, data)
	{
		let request = new Request(url, data, REQUEST.JSONP)

		return new Promise(request.handle.bind(request));
	}
}

export default YellowLab;
