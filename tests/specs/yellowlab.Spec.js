"use strict";

import YellowLab from "../../yellowlab";
import Promise from "promise";
import Request from "../../libs/request";
import REQUEST from "../../libs/constants";
import sinon from "sinon";

describe("YellowLab", function () {
    describe("Initialization", function () {

        it("should have a namespace of data", function () {
            let yl = new YellowLab();

            expect(yl).to.have.property("queryNamespace").and.equal("data");
        });

        it("should have a namespace of foo", function () {
            let yl = new YellowLab("foo");

            expect(yl).to.have.property("queryNamespace").and.equal("foo");
        });

    });

    describe("Get new Request", function () {

        let yl;

        before(function () {
            yl = new YellowLab();
        });

        it("should create a new request", function () {

            let req = yl.getNewRequest("a", "b", {});
            let req2 = yl.getNewRequest("c", "d", {});

            expect(req).to.be.an.instanceOf(Request);

            expect(req2).to.not.equal(req);
        });
    });

    describe("Get new Promise", function () {

        let yl;
        let sandbox;

        before(function () {

            sandbox = sinon.sandbox.create();

            yl = new YellowLab();
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("should create a new promise with one argument set as 'handler'", function (done) {

            let handler = () => { done(); };

            let promiseOne = yl.getNewPromise(handler);
            let promiseTwo = yl.getNewPromise(handler);

            expect(promiseOne).to.be.an.instanceOf(Promise);
            
            expect(promiseTwo).to.be.an.instanceOf(Promise);

            expect(promiseOne.calledWith(handler)).to.be.true;

            expect(promiseTwo.calledWith(handler)).to.be.true;

            expect(promiseOne).to.not.equal(promiseTwo);
        });

        it("should resolve with a value of 1", function (done) {
            
            let handler = (resolve, reject) => {
                return resolve(1);
            };

            yl.getNewPromise(handler).then((data) => {
                
                expect(data).to.equal(1);
                done();
            });
        });

        it("should reject with a value of 2", function (done) {
            
            let handler = (resolve, reject) => {
                return reject(2);
            };

            yl.getNewPromise(handler).catch((data) => {
                
                expect(data).to.equal(2);
                done();
            });
        });
    });

    describe("Method GET and POST", function () {

        let yl;
        let url = "test";
        let method = REQUEST.POST;
        let data = { name: "test" };
        let sandbox;
        let requestStub;
        let promiseStub;
        let handler;

        before(function () {

            sandbox = sinon.sandbox.create();

            yl = new YellowLab();
        });

        beforeEach(function() {

            handler = {
                handle: () => {}
            };

            requestStub = sandbox.stub(yl, "getNewRequest").returns(handler);

            promiseStub = sandbox.stub(yl, "getNewPromise");
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("should call getNewRequest with arguments one time", function () {

            promiseStub.returns(null);

            yl.retreive(url, data, method);

            expect(requestStub.calledOnce).to.be.true;

            expect(requestStub.calledWith(sinon.match.string, sinon.match.object, sinon.match.string)).to.be.true;

            expect(requestStub.calledWith(url, data, method)).to.be.true;
        });

        it("should call getNewPromise with a handler function one time", function () {

            promiseStub.returns(null);

            yl.retreive(url, data, method);

            expect(promiseStub.calledOnce).to.be.true;

            expect(promiseStub.calledWith(sinon.match.func)).to.be.true;

            expect(promiseStub.calledWith(sinon.match.instanceOf(handler.constructor))).to.be.true;
        });

        it("should return a promise", function (done) {

            promiseStub.returns(
                new Promise(() => { done(); })
            );

            let promise = yl.retreive("");

            expect(promise).to.be.an.instanceOf(Promise);
        });
    });

    describe("Method JSONP", function () {

        let yl;
        let url = "test";
        let method = REQUEST.POST;
        let data = { name: "test" };
        let sandbox;
        let requestStub;
        let promiseStub;
        let handler;

        before(function () {

            sandbox = sinon.sandbox.create();

            yl = new YellowLab();
        });

        beforeEach(function() {

            handler = {
                handle: () => {}
            };

            requestStub = sandbox.stub(yl, "getNewRequest").returns(handler);

            promiseStub = sandbox.stub(yl, "getNewPromise");
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("should call getNewRequest with arguments one time", function () {

            yl.retreiveJsonp(url, data);

            expect(requestStub.calledOnce).to.be.true;
            
            expect(requestStub.calledWith(sinon.match.string, sinon.match.object, sinon.match.string)).to.be.true;

            expect(requestStub.calledWith(url, data)).to.be.true;
        });

        it("should call getNewPromise with a handler function one time", function () {

            promiseStub.returns(null);

            yl.retreiveJsonp(url, data);

            expect(promiseStub.calledOnce).to.be.true;

            expect(promiseStub.calledWith(sinon.match.func)).to.be.true;

            expect(promiseStub.calledWith(sinon.match.instanceOf(handler.constructor))).to.be.true;
        });

        it("should return a promise", function (done) {

            promiseStub.returns(
                new Promise(() => { done(); })
            );

            let promise = yl.retreive("");

            expect(promise).to.be.an.instanceOf(Promise);
        });
    });
});
