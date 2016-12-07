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
	 * @param {Object} data
     * @param {String} method
	 * @return {Promise}
	 */
    retreive(url, data = {}, method = REQUEST.GET) {
        let request = this.getNewRequest(url, data, method);

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
        let request = this.getNewRequest(url, data, REQUEST.JSONP);

        return this.getNewPromise(request.handle.bind(request));
    }

	/**
	 * Get a new Request instance.
	 *
	 * @param {String} url
	 * @param {Object} data
     * @param {String} method
	 * @return {Request}
	 */
    getNewRequest(url, data, method) {
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
