"use strict";

import REQUEST, { HEADERS, ACTIVEX } from "./constants";

class Request {
    /**
     * Create a new instance.
     * @param {String} url
     * @param {Object} data
     * @param {String} method
     * @param {String} namespace
     */
    constructor(url, data, method, namespace = "data") {
        this.url = url;
        this.data = data;
        this.method = method;
        this.namespace = namespace;
        this.resolve = null;
        this.reject = null;
    }

    /**
     * Handles the request and calls resolve or reject
     * based on the HTTP status code of the request.
     *
     * @param {Function} resolve
     * @param {Function} reject
     */
    handle(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;

        switch (this.method) {

            case REQUEST.GET:
            case REQUEST.POST:
                this.__http();
                break;

            case REQUEST.JSONP:
                this.__jsonp();
                break;

            default:
                this.__http();
                break;
        }
    }

    /**
     * Makes a HTTP request to the specified URL.
     */
    __http() {
        let queryString = this.__getQueryString(this.data);

        let request = this.__getRequest();

        if (this.__isValidRequestObject(request)) {

            this.__setupRequest(request);

            request.send(queryString);
        }
    }

    /**
     * Setup the request object for execution.
     *
     * @param {ActiveXObject|XMLHttpRequest} request
     */
    __setupRequest(request) {
        request.onreadystatechange = this.__stateChange.bind(this, request);
        request.open(this.method, this.url, true);

        switch (this.method) {

            case REQUEST.GET:
                request.setRequestHeader("Content-type", HEADERS.CONTENT_TYPE.JSON);
                break;

            case REQUEST.POST:
                request.setRequestHeader("X-Requested-With", HEADERS.REQUESTED);
                request.setRequestHeader("Content-type", HEADERS.CONTENT_TYPE.FORM_ENCODED);
                break;

            default:
                request.setRequestHeader("Content-type", HEADERS.CONTENT_TYPE.JSON);
                break;
        }
    }

    /**
     * Create a new browser request instance.
     *
     * @return {ActiveXObject|XMLHttpRequest|Exception}
     */
    __getRequest() {
        if (window.ActiveXObject) {
            return new ActiveXObject(ACTIVEX);
        } else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }

        throw TypeError("Browser doesn't have a request object available.");
    }

    /**
     * Determine is the request object is valid.
     *
     * @param {ActiveXObject|XMLHttpRequest} request
     * @return {Boolean}
     */
    __isValidRequestObject(request) {
        if (window.ActiveXObject != undefined && !(request instanceof ActiveXObject)) {
            return false;
        } else if (window.XMLHttpRequest != undefined && !(request instanceof XMLHttpRequest)) {
            return false;
        }

        return true;
    }

    /**
     * Listener of the state change of the browser request object.
     *
     * @param {ActiveXObject|XMLHttpRequest} request
     */
    __stateChange(request) {
        let response;

        if (request.readyState == 4) {

            try {
                response = JSON.parse(request.responseText);
            } catch (exception) {
                response = request.responseText;
            }

            switch (request.status) {

                case 200:
                case 202:
                    this.resolve(response);
                    break;

                default:
                    this.reject(response);
                    break;
            }
        }
    }

    /**
     * Turn an object into a query string.
     *
     * @param {Object} params
     * @param {String} prevStack
     * @return {String}
     */
    __getQueryString(params, prevStack) {
        let stack = [];

        if (typeof params == "object") {

            for (let key in params) {

                if (typeof params[key] == "object" && params.hasOwnProperty(key)) {

                    if (prevStack) {
                        stack.push(this.__getQueryString.call(this, params[key], `${prevStack}[${key}]`));
                    } else {
                        stack.push(this.__getQueryString.call(this, params[key], `[${key}]`));
                    }
                }
                else {

                    if (prevStack) {
                        stack.push(`${this.namespace}${prevStack}[${key}]=${params[key]}`);
                    } else {
                        stack.push(`${key}=${params[key]}`);
                    }
                }
            }
        } else if (typeof params == "string") {
            return params;
        } else {
            return "";
        }

        return stack.join("&");
    }

    /**
     * Make a JSONP request and the resolver function is called
     * once the request is complete.
     */
    __jsonp() {

        let queryString = this.__getQueryString(this.data);
        let randomInt = this.__getRandomInt(1000000, 9999999);
        let functionName = `jsonp${randomInt}`;

        window[functionName] = (data) => {
            this.resolve(data);
            window[functionName] = undefined;
        };

        let script = document.createElement("script");
        let head = document.getElementsByTagName("head");
        script.src = `${this.url}?callback=${functionName}&${queryString}`;
        script.type = "text/javascript";
        script.id = `yellow-lab-${randomInt}`;
        head[0].appendChild(script);
    }

    /**
     * Get a random integer.
     *
     * @param {Integer} min
     * @param {Integer} max
     * @return {Integer}
     */
    __getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

export default Request;
