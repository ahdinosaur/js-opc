"use strict";

var through = require("through2");
var parse = require("parse-binary-stream");
var duplexer = require("duplexer2");
var Codec = require("./codec");

module.exports = function() {
  var parser = parse(function(read) {
    Codec.decodeAllMessages(read, function(message) {
      output.push(message);
    });
  });
  var output = through.obj();
  parser.on("end", function() {
    output.push(null);
  });
  return duplexer(parser, output);
};
