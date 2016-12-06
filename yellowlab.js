"use strict";

import Promise from "promise";
import Request from "./libs/request";
import REQUEST from "./libs/constants";

class YellowLab {
	/**
	 * Create a new instance.
	 * @param {String} namespace
	 */
    constructor(namespace = "data") {
        this.queryNamespace = namespace;
    }

	/**
	 * Make a request.
	 *
	 * The request can be any of the standard
	 * HTTP request types. EX (GET, POST, DELETE, PATCH, PUT)
	 *
	 * @param {String} url
	 * @param {String} method
	 * @param {Object} data
	 * @return {Promise}
	 */
    retreive(url, method = REQUEST.POST, data = {}) {
        let request = this.getNewRequest(url, method, data);

        return this.getNewPromise(request.handle.bind(request));
    }

	/**
	 * Make a JSONP request.
	 *
	 * @param {String} url
	 * @param {Object} data
	 * @return {Promise}
	 */
    retreiveJsonp(url, data) {
        let request = this.getNewRequest(url, REQUEST.JSONP, data);

        return this.getNewPromise(request.handle.bind(request));
    }

	/**
	 * Get a new Request instance.
	 *
	 * @param {String} url
	 * @param {String} method
	 * @param {Object} data
	 * @return {Request}
	 */
    getNewRequest(url, method, data) {
        return new Request(url, data, method);
    }

	/**
	 * Get a new Promise instance.
	 *
	 * @param {Function} handler
	 * @return {Promise}
	 */
    getNewPromise(handler) {
        return new Promise(handler);
    }

	/**
	 * Get the query namespace.
	 *
	 * @return {String}
	 */
    getQueryNamespace() {
        return this.queryNamespace;
    }
}

export default YellowLab;
