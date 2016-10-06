import Promise from 'promise';

class YellowLab
{
	constructor(namespace = 'data')
	{
		this.promise = new Promise(this);
		this.url = '';
		this.parameters = {};
		this.queryNamespace = namespace;
		this.callbacks = {};
	}

	function retreive(url, data)
	{
		let queryString = this.__getQueryString(data);

		return this;
	}

	function jsonp(url, data)
	{
		let queryString = this.__getQueryString(data);

		if(this.callbacks['success'] == undefined)
		{
			throw new TypeError('Success function not defined');
		}

		this.__addJsonpWrapper(this.callbacks['success']);

		return this;
	}

	function on(name, callback)
	{
		this.callbacks[name] = callback;

		return this;
	}

	function __getQueryString(params, prevStack) {
		var stack = [];

		if (typeof params == "object") {

			for (var key in params) {

				if(typeof params[key] == "object" && params.hasOwnProperty(key)) {

					if(prevStack) {
						stack.push(getQueryString.call(this, params[key], prevStack + "[" + key + "]"));
					}
					else {
						stack.push(getQueryString.call(this, params[key], "[" + key + "]"));
					}
				}
				else {

					if(prevStack) {
						stack.push(getNamespace() + prevStack + "[" + key + "]" + '=' + params[key]);
					}
					else {
						stack.push(key + "=" + params[key]);
					}
				}
			}
		}
		else if(typeof params == "string") {
			return params;
		}
		else {
			return "";
		}

		return stack.join("&");
	};

	function __makeRequest(queryString) {

		request = getRequest();

		if (request) {
			req = request;
			var setRequestHeader = req.setRequestHeader.bind(req);
			req.onreadystatechange = stateChange.bind(this, req, resolve, reject);
			if (parameters !== '') {
				req.open('POST', url, true);
				setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				setRequestHeader('Connection', 'close');
			} else {
				req.open('GET', url, true);
				setRequestHeader('Content-type', 'application/json');
			}
			req.send(queryString);
		}
	};

	function __addJsonpWrapper(resolver, queryString) {

		var functionName = 'jsonp' + getRandomInt(1000000, 9999999);

		window[functionName] = function(data) {
			resolver(data);
			window[functionName] = undefined;
		};

		var script = document.createElement('script');
		var head = document.getElementsByTagName('head');
		script.src = url + "?callback=" + functionName + "&" + queryString;
		script.type = 'text/javascript';
		head[0].appendChild(script);
	};

	function __getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	function __getRequest() {
		if (window.ActiveXObject) {
			return new ActiveXObject('Microsoft.XMLHTTP');
		} else if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		}
		return false;
	};

	function __stateChange(req, res, rej) {

		if (req.readyState == 4) {
			try {
				res({success: true, message: JSON.parse(req.responseText)});
			} catch (e) {
				if(rej) {
					rej({success: false, message: req.responseText});
				}
				else {
					res({success: false, message: req.responseText});
				}
			}
		}
	};
}