/**
 * Object for HTTP requests verbs.
 */
const REQUEST = {
  GET: "GET",
  POST: "POST",
  JSONP: "JSONP"
}

/**
 * Object for header values.
 */
export const HEADERS = {
  CONTENT_TYPE: {
    JSON: "application/json",
    FORM_ENCODED: "application/x-www-form-urlencoded"
  },
  CONNECTION: {
    CLOSE: "close"
  },
  REQUESTED: "XMLHttpRequest"
}

/**
 * Name of the Windows request object.
 */
export const ACTIVEX = "Microsoft.XMLHTTP";

exports default REQUEST;
