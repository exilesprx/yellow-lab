# Yellow Lab

## Description

* A small compact library for Ajax (currently only supports GET and POST) and JSONP requests.
*
* This library is specifically designed to be consumed by browserify or any other dependency
* bundle that supports "require". This library does not conform to UMD (Univeral Module Definition)
* for simplicity reasons. The library has a very small footprint for that reason.

## Usage

```
#!javascript
'use strict';
import "babel-polyfill";
import YellowLab from './lib/yellowlab';

let lab = new YellowLab();

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
