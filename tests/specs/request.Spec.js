"use strict";

import Request from "../../libs/request";
import REQUEST from "../../libs/constants";
import sinon from "sinon";

describe("Request", function()
{
  describe("Initialization", function()
  {
    it("has properties url, data, and method set to a value with a default namespace set to the default value", function()
    {
      let url = "http://test.com";
      let method = REQUEST.GET;
      let data = { name: "test" };
      let namespace = "data";

      let request = new Request(url, data, method);

      expect(request).to.have.property('url').and.equal(url);
      expect(request).to.have.property('method').and.equal(method);
      expect(request).to.have.property('data').and.equal(data);
      expect(request).to.have.property('namespace').and.equal(namespace);
    });

    it("has properties url, data, and method set to a value with a default namespace set a value", function()
    {
      let url = "http://test.com";
      let method = REQUEST.POST;
      let data = { name: "test" };
      let namespace = "custom";

      let request = new Request(url, data, method, namespace);

      expect(request).to.have.property('url').and.equal(url);
      expect(request).to.have.property('method').and.equal(method);
      expect(request).to.have.property('data').and.equal(data);
      expect(request).to.have.property('namespace').and.equal(namespace);
    });
  });

  describe("Handling the request", function()
  {

    let request;

    before(function()
    {
      request = new Request('', {}, REQUEST.GET);
    });

    afterEach(function()
    {

    });

    it("should be called with two arguments which of type Function", function()
    {
      let res = () => { return "resolve"; };
      let rej = () => { return "reject"; };
      let get = sinon.stub(request, "__get").returns(1);

      request.method = REQUEST.GET;

      request.handle(res, rej);

      expect(request).to.have.property("method").and.equal(REQUEST.GET);
      expect(request.resolve).to.equal(res);
      expect(request.resolve).to.be.a("function");
      expect(request.reject).to.equal(rej);
      expect(request.reject).to.be.a("function");

      request.__get.restore();
    });

    it("should be called and __get should be called once", function()
    {
      let res = () => { return "resolve"; };
      let rej = () => { return "reject"; };
      let get = sinon.spy(request, "__get");

      request.handle(res, rej);

      expect(request).to.have.property("method").and.equal(REQUEST.GET);
      expect(get.calledOnce).to.be.true;

      request.__get.restore();
    });

    it("should be called and __post should be called once", function()
    {
      let res = () => { return "resolve"; };
      let rej = () => { return "reject"; };
      let post = sinon.spy(request, "__post");

      request.method = REQUEST.POST;

      request.handle(res, rej);

      expect(request).to.have.property("method").and.equal(REQUEST.POST);
      expect(post.calledOnce).to.be.true;

      request.__post.restore();
    });

    it("should be called and __jsonp should be called once", function()
    {
      let res = () => { return "resolve"; };
      let rej = () => { return "reject"; };
      let jsonp = sinon.spy(request, "__jsonp");

      request.method = REQUEST.JSONP;

      request.handle(res, rej);

      expect(request).to.have.property("method").and.equal(REQUEST.JSONP);
      expect(jsonp.calledOnce).to.be.true;

      request.__jsonp.restore();
    });
  });
});
