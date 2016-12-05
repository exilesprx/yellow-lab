"use strict";

import Request from "../../libs/request";
import REQUEST, { HEADERS } from "../../libs/constants";
import sinon from "sinon";

describe("Request", function () {

    describe("Initialization", function () {

        it("has properties url, data, and method set to a value with a default namespace set to the default value", function () {
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

        it("has properties url, data, and method set to a value with a default namespace set a value", function () {
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

        before(function () {
            request = new Request("", {}, REQUEST.GET);
        });

        beforeEach(function () {
            http = sinon.stub(request, "__http").returns(1);
            jsonp = sinon.stub(request, "__jsonp").returns(1);
        });

        afterEach(function () {
            request.__http.restore();
            request.__jsonp.restore();
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
            sinon.assert.calledOnce(http);
        });

        it("should call handle and __http should be called once with method equal to POST", function () {
            request.method = REQUEST.POST;

            request.handle(res, rej);

            expect(request).to.have.property("method").and.equal(REQUEST.POST);
            sinon.assert.calledOnce(http);
        });

        it("should handle and __jsonp should be called once with method equal to JSONP", function () {
            request.method = REQUEST.JSONP;

            request.handle(res, rej);

            expect(request).to.have.property("method").and.equal(REQUEST.JSONP);
            sinon.assert.calledOnce(jsonp);
        });
    });

    describe("HTTP request", function () {
        let FakeXhr;
        let request;
        let url = "http://test.com";
        let data = { name: "test" };
        let method = REQUEST.GET;
        let xhr;
        let queryStringStub;
        let requestStub;
        let isValidRequestStub;
        let setupRequestStub;
        let sendStub;

        before(function () {
            FakeXhr = sinon.useFakeXMLHttpRequest();

            request = new Request(url, data, method);

            xhr = new FakeXhr();
        });

        beforeEach(function () {
            queryStringStub = sinon.stub(request, "__getQueryString");
            requestStub = sinon.stub(request, "__getRequest");
            isValidRequestStub = sinon.stub(request, "__isValidRequestObject");
            setupRequestStub = sinon.stub(request, "__setupRequest");
            sendStub = sinon.stub(xhr, "send").returns(true);
        });

        afterEach(function () {
            request.__getQueryString.restore();
            request.__getRequest.restore();
            request.__isValidRequestObject.restore();
            request.__setupRequest.restore();
            xhr.send.restore();
        });

        after(function () {
            sinon.FakeXMLHttpRequest.restore();
        });

        it("calls getQueryString once with an single argument of type Object", function () {
            request.__http();

            expect(queryStringStub.calledOnce).to.be.true;
            expect(queryStringStub.calledWith(data)).to.be.true;
            expect(queryStringStub.calledWith(sinon.match.typeOf("object"))).to.be.true;
        });

        it("calls getRequest once", function () {
            request.__http();

            expect(requestStub.calledOnce).to.be.true;
        });

        it("calls isValidRequestObject once with ActiveXObject or XMLHttpRequest as its argument", function () {
            requestStub.returns(xhr);

            request.__http();

            expect(isValidRequestStub.calledOnce).to.be.true;
            expect(isValidRequestStub.calledWith(xhr)).to.be.true;
            expect(isValidRequestStub.calledWith(sinon.match.instanceOf(xhr.constructor)));
        });

        it("calls setupRequest once with ActiveXObject or XMLHttpRequest as its argument", function () {
            requestStub.returns(xhr);
            isValidRequestStub.returns(true);

            request.__http();

            expect(setupRequestStub.calledOnce).to.be.true;
            expect(setupRequestStub.calledWith(xhr)).to.be.true;
            expect(setupRequestStub.calledWith(sinon.match.instanceOf(xhr.constructor)));
        });

        it("calls the ActiveXObject or XMLHttpRequest method send once with the string from getQueryString", function () {
            let queryString = "name=test&data=1";
            requestStub.returns(xhr);
            isValidRequestStub.returns(true);
            queryStringStub.returns(queryString);

            request.__http();

            expect(sendStub.calledOnce).to.be.true;
            expect(sendStub.calledWith(queryString)).to.be.true;
            expect(sendStub.calledWith(sinon.match.typeOf("string")));
        });

    });

    describe("Setup request", function () {
        let FakeXhr;
        let request;
        let url = "http://test.com";
        let data = { name: "test" };
        let method = REQUEST.GET;
        let xhr;
        let openSpy;
        let setRequestHeaderSpy;
        let stateChangeStub;

        before(function () {
            FakeXhr = sinon.useFakeXMLHttpRequest();

            request = new Request(url, data, method);

            xhr = new FakeXhr();
        });

        beforeEach(function () {
            let stateChange = () => { return "I am state change"; };
            stateChangeStub = sinon.stub(request, "__stateChange").returns(stateChange);
            openSpy = sinon.spy(xhr, "open");
            setRequestHeaderSpy = sinon.spy(xhr, "setRequestHeader");
        });

        afterEach(function () {
            request.__stateChange.restore();
            xhr.open.restore();
            xhr.setRequestHeader.restore();
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

        it("should call setRequestHeader on ActiveXObject or XMLHttpRequest with arguements of Content-type = HEADERS.CONTENT_TYPE.JSON", function () {
            request.method = REQUEST.GET;

            request.__setupRequest(xhr);

            expect(setRequestHeaderSpy.calledOnce).to.be.true;
            expect(setRequestHeaderSpy.calledWith("Content-type", HEADERS.CONTENT_TYPE.JSON)).to.be.true;
            expect(setRequestHeaderSpy.calledWith(sinon.match.string, sinon.match.string)).to.be.true;
        });

        it("should call setRequestHeader on ActiveXObject or XMLHttpRequest with arguements of Content-type = HEADERS.CONTENT_TYPE.FORM_ENCODED and X-Requested-With = HEADERS.REQUESTED", function () {
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

        it("returns a new ActiveXObject or XMLHttpRequest object", function() {

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
});
