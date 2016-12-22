"use strict";

import Request from "../../libs/request";
import REQUEST, { HEADERS } from "../../libs/constants";
import sinon from "sinon";

describe("Request", function () {

    describe("Initialization", function () {

        it("should have properties url, data, and method set to a value with a default namespace set to the default value", function () {
            let url = "http://test.com";
            let method = REQUEST.GET;
            let data = { name: "test" };
            let namespace = "data";

            let request = new Request(url, data, method);

            expect(request).to.have.property("url").and.equal(url);
            expect(request).to.have.property("method").and.equal(method);
            expect(request).to.have.property("data").and.equal(data);
            expect(request).to.have.property("namespace").and.equal(namespace);
        });

        it("should have properties url, data, and method set to a value with a default namespace set a value", function () {
            let url = "http://test.com";
            let method = REQUEST.POST;
            let data = { name: "test" };
            let namespace = "custom";

            let request = new Request(url, data, method, namespace);

            expect(request).to.have.property("url").and.equal(url);
            expect(request).to.have.property("method").and.equal(method);
            expect(request).to.have.property("data").and.equal(data);
            expect(request).to.have.property("namespace").and.equal(namespace);
        });
    });

    describe("Request handle", function () {

        let request;
        let http;
        let jsonp;
        let res = () => { return "resolve"; };
        let rej = () => { return "reject"; };
        let sandbox;

        before(function () {

            sandbox = sinon.sandbox.create();

            request = new Request("", {}, REQUEST.GET);
        });

        beforeEach(function () {
            http = sandbox.stub(request, "__http");
            jsonp = sandbox.stub(request, "__jsonp");
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("should call handle with two arguments which are of type Function", function () {
            request.method = REQUEST.GET;

            request.handle(res, rej);

            expect(request).to.have.property("method").and.equal(REQUEST.GET);
            expect(request.resolve).to.equal(res);
            expect(request.resolve).to.be.a("function");
            expect(request.reject).to.equal(rej);
            expect(request.reject).to.be.a("function");
        });

        it("should call handle and __http should be called once with method equal to GET", function () {
            request.handle(res, rej);

            expect(request).to.have.property("method").and.equal(REQUEST.GET);
            expect(http.calledOnce).to.be.true;
        });

        it("should call handle and __http should be called once with method equal to POST", function () {
            request.method = REQUEST.POST;

            request.handle(res, rej);

            expect(request).to.have.property("method").and.equal(REQUEST.POST);
            expect(http.calledOnce).to.be.true;
        });

        it("should call handle and __http should be called once with method equal to PUT", function () {
            request.method = REQUEST.PUT;

            request.handle(res, rej);

            expect(request).to.have.property("method").and.equal(REQUEST.PUT);
            expect(http.calledOnce).to.be.true;
        });

        it("should call handle and __http should be called once with method equal to PATCH", function () {
            request.method = REQUEST.PATCH;

            request.handle(res, rej);

            expect(request).to.have.property("method").and.equal(REQUEST.PATCH);
            expect(http.calledOnce).to.be.true;
        });

        it("should call handle and __http should be called once with method equal to DELETE", function () {
            request.method = REQUEST.DELETE;

            request.handle(res, rej);

            expect(request).to.have.property("method").and.equal(REQUEST.DELETE);
            expect(http.calledOnce).to.be.true;
        });

        it("should handle and __jsonp should be called once with method equal to JSONP", function () {
            request.method = REQUEST.JSONP;

            request.handle(res, rej);

            expect(request).to.have.property("method").and.equal(REQUEST.JSONP);
            expect(jsonp.calledOnce).to.be.true;
        });
    });

    describe("HTTP request", function () {
        let FakeXhr;
        let request;
        let url = "http://test.com";
        let data = { name: "test" };
        let method = REQUEST.GET;
        let xhr;
        let sandbox;
        let queryStringStub;
        let requestStub;
        let isValidRequestStub;
        let setupRequestStub;
        let sendStub;

        before(function () {

            sandbox = sinon.sandbox.create();

            FakeXhr = sinon.useFakeXMLHttpRequest();

            request = new Request(url, data, method);

            xhr = new FakeXhr();
        });

        beforeEach(function () {
            queryStringStub = sandbox.stub(request, "__getQueryString");
            requestStub = sandbox.stub(request, "__getRequest");
            isValidRequestStub = sandbox.stub(request, "__isValidRequestObject");
            setupRequestStub = sandbox.stub(request, "__setupRequest");
            sendStub = sandbox.stub(xhr, "send").returns(true);
        });

        afterEach(function () {
            sandbox.restore();
        });

        after(function () {
            sinon.FakeXMLHttpRequest.restore();
        });

        it("should call getQueryString once with an single argument of type Object", function () {
            request.__http();

            expect(queryStringStub.calledOnce).to.be.true;
            expect(queryStringStub.calledWith(data)).to.be.true;
            expect(queryStringStub.calledWith(sinon.match.object)).to.be.true;
        });

        it("should call getRequest once", function () {
            request.__http();

            expect(requestStub.calledOnce).to.be.true;
        });

        it("should call isValidRequestObject once with ActiveXObject or XMLHttpRequest as its argument", function () {
            requestStub.returns(xhr);

            request.__http();

            expect(isValidRequestStub.calledOnce).to.be.true;
            expect(isValidRequestStub.calledWith(xhr)).to.be.true;
            expect(isValidRequestStub.calledWith(sinon.match.instanceOf(xhr.constructor)));
        });

        it("should call setupRequest once with ActiveXObject or XMLHttpRequest as its argument", function () {
            requestStub.returns(xhr);
            isValidRequestStub.returns(true);

            request.__http();

            expect(setupRequestStub.calledOnce).to.be.true;
            expect(setupRequestStub.calledWith(xhr)).to.be.true;
            expect(setupRequestStub.calledWith(sinon.match.instanceOf(xhr.constructor)));
        });

        it("should call the ActiveXObject or XMLHttpRequest method send once with the string from getQueryString", function () {
            let queryString = "name=test&data=1";
            requestStub.returns(xhr);
            isValidRequestStub.returns(true);
            queryStringStub.returns(queryString);

            request.__http();

            expect(sendStub.calledOnce).to.be.true;
            expect(sendStub.calledWith(queryString)).to.be.true;
            expect(sendStub.calledWith(sinon.match.string));
        });

    });

    describe("Setup request", function () {
        let FakeXhr;
        let request;
        let url = "http://test.com";
        let data = { name: "test" };
        let method = REQUEST.GET;
        let xhr;
        let sandbox;
        let openSpy;
        let setRequestHeaderSpy;
        let stateChangeStub;

        before(function () {

            sandbox = sinon.sandbox.create();

            FakeXhr = sinon.useFakeXMLHttpRequest();

            request = new Request(url, data, method);

            xhr = new FakeXhr();
        });

        beforeEach(function () {
            let stateChange = () => { return "I am state change"; };
            stateChangeStub = sandbox.stub(request, "__stateChange").returns(stateChange);
            openSpy = sandbox.spy(xhr, "open");
            setRequestHeaderSpy = sandbox.spy(xhr, "setRequestHeader");
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("should have a request object with the property onreadystatechange set to __stateChange", function () {
            request.__setupRequest(xhr);

            expect(stateChangeStub.calledOnce).to.be.true;
            expect(stateChangeStub.calledWith(xhr));
            expect(xhr).to.have.property("onreadystatechange").and.instanceOf(stateChangeStub.constructor);
            expect(xhr).to.have.property("onreadystatechange").and.be.a("function");
        });

        it("should call open on a ActiveXObject or XMLHttpRequest object with arguments of url, method and true", function () {
            request.__setupRequest(xhr);

            expect(openSpy.calledOnce).to.be.true;
            expect(openSpy.calledWith(method, url, true)).to.be.true;
        });

        it("should call setRequestHeader with Content-type = HEADERS.CONTENT_TYPE.JSON for GET request", function () {
            request.method = REQUEST.GET;

            request.__setupRequest(xhr);

            expect(setRequestHeaderSpy.calledOnce).to.be.true;
            expect(setRequestHeaderSpy.calledWith("Content-type", HEADERS.CONTENT_TYPE.JSON)).to.be.true;
            expect(setRequestHeaderSpy.calledWith(sinon.match.string, sinon.match.string)).to.be.true;
        });

        it("should call setRequestHeader with Content-type = HEADERS.CONTENT_TYPE.JSON for PUT request", function() {

            request.method = REQUEST.PUT;

            request.__setupRequest(xhr);

            expect(setRequestHeaderSpy.calledOnce).to.be.true;
            expect(setRequestHeaderSpy.calledWith("Content-type", HEADERS.CONTENT_TYPE.JSON)).to.be.true;
            expect(setRequestHeaderSpy.calledWith(sinon.match.string, sinon.match.string)).to.be.true;
        });

        it("should call setRequestHeader with Content-type = HEADERS.CONTENT_TYPE.JSON for PATCH request", function() {

            request.method = REQUEST.PATCH;

            request.__setupRequest(xhr);

            expect(setRequestHeaderSpy.calledOnce).to.be.true;
            expect(setRequestHeaderSpy.calledWith("Content-type", HEADERS.CONTENT_TYPE.JSON)).to.be.true;
            expect(setRequestHeaderSpy.calledWith(sinon.match.string, sinon.match.string)).to.be.true;
        });

        it("should call setRequestHeader with Content-type = HEADERS.CONTENT_TYPE.JSON for DELETE request", function() {

            request.method = REQUEST.DELETE;

            request.__setupRequest(xhr);

            expect(setRequestHeaderSpy.calledOnce).to.be.true;
            expect(setRequestHeaderSpy.calledWith("Content-type", HEADERS.CONTENT_TYPE.JSON)).to.be.true;
            expect(setRequestHeaderSpy.calledWith(sinon.match.string, sinon.match.string)).to.be.true;
        });

        it("should call setRequestHeader with Content-type = HEADERS.CONTENT_TYPE.FORM_ENCODED and X-Requested-With = HEADERS.REQUESTED", function () {
            request.method = REQUEST.POST;

            request.__setupRequest(xhr);

            expect(setRequestHeaderSpy.calledTwice).to.be.true;
            expect(setRequestHeaderSpy.calledWith("Content-type", HEADERS.CONTENT_TYPE.FORM_ENCODED)).to.be.true;
            expect(setRequestHeaderSpy.calledWith("X-Requested-With", HEADERS.REQUESTED)).to.be.true;
            expect(setRequestHeaderSpy.calledWith(sinon.match.string, sinon.match.string)).to.be.true;
        });
    });

    describe("Get new request", function() {

        let request;
        let url = "http://test.com";
        let data = { name: "test" };
        let method = REQUEST.GET;
        let xhr;

        before(function() {

            request = new Request(url, data, method);

            let FakeXhr = sinon.useFakeXMLHttpRequest();

            xhr = new FakeXhr();
        });

        it("should return a new ActiveXObject or XMLHttpRequest object", function() {

            let result = request.__getRequest();
            
            expect(result).to.be.an.instanceOf(xhr.constructor);
        });
    });

    describe("State change", function() {

        let request;
        let url = "http://test.com";
        let data = { name: "test" };
        let method = REQUEST.GET;
        let xhr;
        let resolveSpy;
        let rejectSpy;

        before(function() {

            request = new Request(url, data, method);

            let FakeXhr = sinon.useFakeXMLHttpRequest();

            xhr = new FakeXhr();

            let resolve = (result) => { return 1; };
            let reject = (result) => { return 2; };
            
            resolveSpy = sinon.spy(resolve);
            rejectSpy = sinon.spy(reject);
            
            request.resolve = resolveSpy;
            request.reject = rejectSpy;
        });

        beforeEach(function() {

            xhr.open("", REQUEST.GET);
        });

        it("should call the resolver function when the requests ready state equals 4 and status code = 200", function() {

            let data = { name: "test" };
            
            xhr.respond(200, null, JSON.stringify(data));

            request.__stateChange(xhr);

            expect(resolveSpy.called).to.be.true;
            expect(resolveSpy.calledWith(data)).to.be.true;
        });

        it("should call the rejector function when the requests ready state equals 4 and status code != 200", function() {

            let data = { name: "test" };

            xhr.respond(404, null, JSON.stringify(data));

            request.__stateChange(xhr);

            expect(rejectSpy.called).to.be.true;
            expect(rejectSpy.calledWith(data)).to.be.true;
        });
    });

    describe("Is valid request ", function() {

        let FakeXhr;
        let request;
        let url = "http://test.com";
        let data = { name: "test" };
        let method = REQUEST.GET;
        let xhr;

        before(function () {
            FakeXhr = sinon.useFakeXMLHttpRequest();

            request = new Request(url, data, method);

            xhr = new FakeXhr();

            global.ActiveXObject = FakeXhr;
            global.XMLHttpRequest = FakeXhr;
        });

        it("should take an ActiveXObject or XMLHttpRequest as an argument and return true", function() {

            let isValid = request.__isValidRequestObject(xhr);

            expect(isValid).to.be.true;
        });

        it("should take an string as an argument and return false", function() {

            let isValid = request.__isValidRequestObject("Some string");
            
            expect(isValid).to.be.false;
        });
    });

    describe("Get query string", function() {

        let request;
        let url = "http://test.com";
        let data = { name: "Test", value: 30 };
        let method = REQUEST.GET;

        before(function() {

            request = new Request(url, data, method);
        });

        it("should take a flat object as its argument and return a query string", function() {

            let queryString = "name=Test&value=30";

            let queryStringResult = request.__getQueryString(data);

            expect(queryStringResult).to.equal(queryString);
        });

        it("should take a nested object as its argument and returns a query string with the namespace included in the nested values", function() {

            let queryString = "name=Test&value=30&data[person][name]=tester&data[person][age]=50";

            data = { name: "Test", value: 30, person: { name: "tester", age: 50 } };

            let queryStringResult = request.__getQueryString(data);

            expect(queryStringResult).to.equal(queryString);
        });
    });

    describe("Get random integer", function() {

        let request;
        let url = "http://test.com";
        let data = { name: "Test", value: 30 };
        let method = REQUEST.GET;

        before(function() {

            request = new Request(url, data, method);
        });

        it("should take a min and max of type integer and return a random integer between the min and max value", function() {
            let min = 100;
            let max = 500;

            let randomInt = request.__getRandomInt(min, max);

            expect(randomInt).to.be.a("number");
            expect(randomInt).to.be.above(min - 1);
            expect(randomInt).to.be.below(max + 1);
        });
    });

    describe("JSONP request", function() {

        let request;
        let url = "http://test.com";
        let data = { name: "Test", value: 30 };
        let method = REQUEST.GET;
        let sandbox;
        let queryStringStub;
        let randomIntStub;
        let resolveSpy;

        before(function() {

            sandbox = sinon.sandbox.create();

            request = new Request(url, data, method);

            let resolve = () => { return 1; };

            resolveSpy = sinon.spy(resolve);

            request.resolve = resolveSpy;
        });

        beforeEach(function() {

            queryStringStub = sandbox.stub(request, "__getQueryString").returns("name=test");

            randomIntStub = sandbox.stub(request, "__getRandomInt").returns(1);
        });

        afterEach(function() {

            sandbox.restore();
        });

        it("should call getQueryString once with an object as its argument", function() {

            request.__jsonp();

            expect(queryStringStub.calledOnce).to.be.true;
            expect(queryStringStub.calledWith(data)).to.be.true;
        });

        it("should call getRandomInt once with two arguements of type integer", function() {

            request.__jsonp();

            expect(randomIntStub.calledOnce).to.be.true;
            expect(randomIntStub.calledWith(sinon.match.number, sinon.match.number)).to.be.true;
        });

        it("should have a window function equal to a function, call the resolver function once, then set the window function to undefined", function() {

            request.__jsonp();

            expect(window["jsonp1"]).to.be.a("function");

            window["jsonp1"].call(request);

            expect(resolveSpy.calledOnce).to.be.true;
            expect(window["jsonp1"]).to.be.an("undefined");
        });

        it("should find the script tag in the head secton of the DOM", function() {

            let script = document.getElementById("yellow-lab-1");

            expect(script).to.not.be.null;
            expect(script.parentElement).to.equal(document.head);
        });
    });
});
