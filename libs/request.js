'use strict';

import REQUEST, { HEADERS, ACTIVEX } from './constants';

class Request
{
  /**
   * Create a new instance.
   * @param {String} url
   * @param {Object} data
   * @param {String} method
   * @param {String} namespace
   */
  constructor(url, data, method, namespace = "data")
  {
    this.url = url;
    this.data = data;
    this.method = method;
    this.namespace = namespace;
  }

  /**
   * Handles the request and calls resolve or reject
   * based on the HTTP status code of the request.
   *
   * @param {Function} resolve
   * @param {Function} reject
   */
  handle(resolve, reject)
  {
    switch(this.method)
    {
      case REQUEST.GET:
        this.__get(resolve, reject);
        break;

      case REQUEST.POST:
        this.__post(resolve, reject);
        break;

      case REQUEST.JSONP:
        this.__jsonp(resolve, reject);
        break;

      default:
        this.__get(resolve, reject);
        break;
    }
  }

  /**
   * Makes a GET request to the specified URL.
   *
   * @param {Function} resolve
   * @param {Function} reject
   */
  __get(resolve, reject)
  {
    let queryString = this.__getQueryString(this.data);

    let request = getRequest();

    if (request) {

      //let setRequestHeader = request.setRequestHeader.bind(request);
      request.onreadystatechange = stateChange.bind(this, request, resolve, reject);
      request.open(REQUEST.GET, this.url, true);
      request.setRequestHeader('Content-type', HEADERS.CONTENT_TYPE.JSON);
      request.send(queryString);
    }
  }

  /**
   *  Makes a POST request to the specified URL.
   *
   * @param {Function} resolve
   * @param {Function} reject
   */
  __post(resolve, reject)
  {
    let queryString = this.__getQueryString(this.data);

    let request = getRequest();

    if (request) {

      //let setRequestHeader = request.setRequestHeader.bind(request);
      request.onreadystatechange = stateChange.bind(this, request, resolve, reject);
      request.open(REQUEST.POST, this.url, true);
      request.setRequestHeader('X-Requested-With', HEADERS.REQUESTED);
      request.setRequestHeader('Content-type', HEADERS.CONTENT_TYPE.FORM_ENCODED);
      request.setRequestHeader('Connection', HEADERS.CONNECTION.CLOSE);
      request.send(queryString);
    }
  }

  /**
   * Create a new browser request instance.
   *
   * @return {ActiveXObject|XMLHttpRequest|Exception}
   */
  __getRequest()
  {
    if (window.ActiveXObject) {
      return new ActiveXObject(ACTIVEX);
    } else if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }

    throw TypeError("Browser doesn't have a request object available.");
  };

  /**
   * Listener of the state change of the browser request object.
   *
   * @param {ActiveXObject|XMLHttpRequest} request
   * @param {Function} resolve
   * @param {Function} reject
   */
  __stateChange(request, resolve, reject)
  {

    if (request.readyState == 4) {
      //TODO: Get status code and call resolve or reject based on the status code.
      try {
        resolve(JSON.parse(request.responseText));
      } catch (exception) {
          resolve(request.responseText);
      }
    }
  };

  /**
   * Turn an object into a query string.
   *
   * @param {Object} params
   * @param {String} prevStack
   * @return {String}
   */
  __getQueryString(params, prevStack)
  {
    let stack = [];

    if (typeof params == "object") {

      for (let key in params) {

        if(typeof params[key] == "object" && params.hasOwnProperty(key)) {

          if(prevStack) {
            stack.push(getQueryString.call(this, params[key], prevStack + "[" + key + "]"));
          } else {
            stack.push(getQueryString.call(this, params[key], "[" + key + "]"));
          }
        }
        else {

          if(prevStack) {
            stack.push(this.namespace + prevStack + "[" + key + "]" + '=' + params[key]);
          } else {
            stack.push(key + "=" + params[key]);
          }
        }
      }
    } else if(typeof params == "string") {
      return params;
    } else {
      return "";
    }

    return stack.join("&");
  };

  /**
   * Make a JSONP request and the resolver function is called
   * once the request is complete.
   *
   * @param {Function} resolve
   * @param {Function} reject
   */
  __jsonp(resolve, reject) {

    let queryString = this.__getQueryString(this.data);
    let functionName = 'jsonp' + getRandomInt(1000000, 9999999);

    window[functionName] = function(data) {
      resolve(data);
      window[functionName] = undefined;
    };

    let script = document.createElement('script');
    let head = document.getElementsByTagName('head');
    script.src = this.url + "?callback=" + functionName + "&" + queryString;
    script.type = 'text/javascript';
    head[0].appendChild(script);
  };

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
