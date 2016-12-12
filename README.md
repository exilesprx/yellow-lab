![Build status](http://travis-ci.org/exilesprx/yellow-lab.svg?branch=master)
# Yellow Lab

## Description

* A small and simple library for Ajax and JSONP requests.
 * Currently only supports GET and POST when using the built in retreive function.

### Notes

* This library is specifically designed to be consumed by browserify, webpack, or any other
bundler that supports "require". This library does not conform to UMD (Univeral Module Definition)
for simplicity reasons.

## Examples

```
#!javascript
'use strict';
import "babel-polyfill";
import YellowLab from './lib/yellowlab';

let lab = new YellowLab();

/**
 *  Making requests using the built in yellow lab functionality.
 */

//Using a generator
function* getResults() {
  yield lab.retreive('/echo/json/');
  yield lab.retreive('/echo/json/', "GET");
  yield lab.retreiveJsonp('//jsfiddle.net/echo/jsonp/');
}

let results = getResults()

let resultsOne = results.next().value;

resultsOne.then(function(data)
{
  console.log("Results One", data);
})

let resultsTwo = results.next().value;

resultsTwo.then(function(data)
{
  console.log("Results Two", data);
});

let resultsThree = results.next().value;

resultsThree.then(function(data)
{
  console.log("Results Three", data);
});

/**
 *  Making requests using the request object.
 */

//Passing a request to a service object for manipulation before making the request.
let service = function(request)
{
  if(request instanceof Request)
  {
    request.data = {
      'name': 'data munipulated by a service'
    }
  }
}

let req = lab.getNewRequest('/echo/json/', { name: "initial data" });

service(req);

//Async
let promise = lab.getNewPromise(req.handle.bind(req));

promise.then((data) => {
  console.log("Service request:", data);
});

//Sync
let res = req.handle((data) => {
  //Resolver
}, (data) => {
  //Rejector
});
```