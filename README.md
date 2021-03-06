[![Build status](http://travis-ci.org/exilesprx/yellow-lab.svg?branch=master)](https://travis-ci.org/exilesprx/yellow-lab/branches)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)]()

# Yellow Lab

## Description

* A small and simple library for Ajax and JSONP requests.

### Notes

* This library is specifically designed to be consumed by browserify, webpack, or any other
bundler that supports "require". This library does not conform to UMD (Univeral Module Definition)
for simplicity reasons.

## Examples


### Making requests using the built in yellow lab functionality

```
#!javascript
'use strict';
import "babel-polyfill";
import YellowLab from './lib/yellowlab';

let lab = new YellowLab();

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
```

### Making async requests using the request object.

```
#!javascript
'use strict';
import "babel-polyfill";
import YellowLab from './lib/yellowlab';

let lab = new YellowLab();

let req = lab.getNewRequest('/echo/json/', { name: "initial data" });

let promise = lab.getNewPromise(req.handle.bind(req));

promise.then((data) => {
  console.log("Service request:", data);
});
```

### Making sync requests using the request object.

```
#!javascript
'use strict';
import "babel-polyfill";
import YellowLab from './lib/yellowlab';

let lab = new YellowLab();

let req = lab.getNewRequest('/echo/json/', { name: "initial data" });

let res = req.handle((data) => {
  //Resolver
}, (data) => {
  //Rejector
});
```