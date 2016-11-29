"use strict";

import YellowLab from "../../yellowlab";
import Promise from "promise";
import Request from "../../libs/request";
import REQUEST from "../../libs/constants";
import sinon from "sinon";

describe("YellowLab", function()
{
  describe("Initialization", function()
  {

    it("has a namespace of data", function()
    {
      let yl = new YellowLab();

      expect(yl).to.have.property('queryNamespace').and.equal("data");
    })

    it("has a namespace of foo", function()
    {
      let yl = new YellowLab("foo");

      expect(yl).to.have.property('queryNamespace').and.equal("foo");
    })

  });

  describe("Get new Request", function() {

    let yl;

    before(function() {
      yl = new YellowLab();
    })

    it("creates a new request", function() {

      let req = yl.getNewRequest("a","b", {});
      let req2 = yl.getNewRequest("c", "d", {});

      expect(req).to.be.an.instanceOf(Request);

      expect(req2).to.not.equal(req);
    });
  });

  describe("Get new Promise", function() {

    let yl;

    before(function() {
      yl = new YellowLab();
    })

    //After each test, we need to restore the original function.
    afterEach(function() {
      yl.getNewPromise.restore();
    })

    it("creates a new promise and the promise has the first argument set as 'handler'", function(done) {

      let pr = sinon.spy(yl, "getNewPromise")

      let arg = () => { done(); };

      let pro = yl.getNewPromise(arg);
      let pro2 = yl.getNewPromise(arg);

      let argument = yl.getNewPromise.getCall(0).args[0];

      expect(pro).to.be.an.instanceOf(Promise);

      expect(argument).to.equal(arg);

      expect(pro2).to.not.equal(pro);
    })
  })

  describe("Method GET and POST", function()
  {
    let yl;

    //Before everything we need to create a instance.
    before(function() {
      yl = new YellowLab();
    });

    //After each test, we need to restore the original function.
    afterEach(function() {
      yl.getNewPromise.restore();
    })

    it("should call getNewRequest with arguments one time", function() {

      let url = "test";
      let method = REQUEST.POST;
      let data = {name: "test"};

      //We need to spy on this method so that we know if this method was called with the proper values.
      let requestSpy = sinon.spy(yl, "getNewRequest").withArgs(url, method, data);

      //We need to stub this method so that a real request and promise are not executed.
      sinon.stub(yl, "getNewPromise").returns(null);

      yl.retreive(url, method, data);

      expect(requestSpy.calledOnce).to.be.true;

      yl.getNewRequest.restore();
    })

    it("should call getNewPromise with a handler function one time", function() {

      let handler = {
        handle: () => {}
      };
      let url = "test";
      let method = REQUEST.POST;
      let data = {name: "test"};

      //We need to spy on this method so that we know if this method was called with the proper values.
      sinon.stub(yl, "getNewRequest").returns(handler);

      let promiseSpy = sinon.spy(yl, "getNewPromise");

      yl.retreive(url, method, data);

      let argument = yl.getNewPromise.getCall(0).args[0];

      expect(promiseSpy.calledOnce).to.be.true;

      expect(argument).to.be.a("function");

      expect(argument).to.be.an.instanceOf(handler.constructor);

      yl.getNewRequest.restore();
    })

    it("should return a promise", function()
    {
      //We need to stub this method so that a real request and promise are not executed.
      sinon.stub(yl, "getNewPromise").returns(
        new Promise((res, req) => {
          return res(1);
        })
      );

      let promise = yl.retreive('');

      expect(promise).to.be.an.instanceOf(Promise);
    });

    it("should resolve with a value of 1", function(done)
    {
      //We need to stub this method so that a real request and promise are not executed.
      sinon.stub(yl, "getNewPromise").returns(
        new Promise((res, req) => {
          return res(1);
        })
      );

      yl.retreive("").then((data) => {
        expect(data).to.equal(1);
        done();
      });
    })

    it("should reject with a value of 2", function(done)
    {
      //We need to stub this method so that a real request and promise are not executed.
      sinon.stub(yl, "getNewPromise").returns(
        new Promise((res, req) => {
          return req(2);
        })
      )

      yl.retreive("").catch((data) => {
        expect(data).to.equal(2);
        done();
      })
    })

  });

  describe("Method JSONP", function()
  {
    let yl;

    //Before everything we need to create a instance.
    before(function() {
      yl = new YellowLab();
    });

    //After each test, we need to restore the original function.
    afterEach(function() {
      yl.getNewPromise.restore();
    })

    it("should call getNewRequest with arguments one time", function() {

      let url = "test";
      let method = REQUEST.JSONP;
      let data = {name: "test"};

      //We need to spy on this method so that we know if this method was called with the proper values.
      let requestSpy = sinon.spy(yl, "getNewRequest").withArgs(url, method, data);

      //We need to stub this method so that a real request and promise are not executed.
      sinon.stub(yl, "getNewPromise").returns(null);

      yl.retreiveJsonp(url, data);

      expect(requestSpy.calledOnce).to.be.true;

      yl.getNewRequest.restore();
    })

    it("should call getNewPromise with a handler function one time", function() {

      let handler = {
        handle: () => {}
      };
      let url = "test";
      let method = REQUEST.POST;
      let data = {name: "test"};

      //We need to spy on this method so that we know if this method was called with the proper values.
      sinon.stub(yl, "getNewRequest").returns(handler);

      let promiseSpy = sinon.spy(yl, "getNewPromise");

      yl.retreiveJsonp(url, method, data);

      let argument = yl.getNewPromise.getCall(0).args[0];

      expect(promiseSpy.calledOnce).to.be.true;

      expect(argument).to.be.a('function');

      expect(argument).to.be.an.instanceOf(handler.constructor);

      yl.getNewRequest.restore();
    })

    it("should return a promise", function()
    {
      //We need to stub this method so that a real request and promise are not executed.
      sinon.stub(yl, "getNewPromise").returns(
        new Promise((res, req) => {
          return res(1);
        })
      );

      let promise = yl.retreiveJsonp("");

      expect(promise).to.be.an.instanceOf(Promise);
    });

    it("should resolve with a value of 1", function(done)
    {
      //We need to stub this method so that a real request and promise are not executed.
      sinon.stub(yl, "getNewPromise").returns(
        new Promise((res, req) => {
          return res(1);
        })
      );

      yl.retreiveJsonp("").then((data) => {
        expect(data).to.equal(1);
        done();
      });
    })

    it("should reject with a value of 2", function(done)
    {
      //We need to stub this method so that a real request and promise are not executed.
      sinon.stub(yl, "getNewPromise").returns(
        new Promise((res, req) => {
          return req(2);
        })
      )

      yl.retreiveJsonp("").catch((data) => {
        expect(data).to.equal(2);
        done();
      })
    })
  });
});
