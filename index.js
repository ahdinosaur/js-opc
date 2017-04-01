"use strict";

// # Stream
//
// A stream that emits Open Pixel Control protocol messages.
//

var util = require('util');
var PassThrough = require('stream').PassThrough;
var Codec = require('./codec');

function OPCStream() {
  PassThrough.call(this);
}

util.inherits(OPCStream, PassThrough);

OPCStream.prototype.writeMessage = function(channel, command, data) {
  return this.write(Codec.encodeMessage(channel, command, data));
};

OPCStream.prototype.writePixels = function(channel, pixels) {
  return this.write(Codec.encodePixelsMessage(channel, pixels));
};

OPCStream.prototype.writeColorCorrection = function(config) {
  return this.write(Codec.encodeSetGlobalColorCorrectionMessage(config));
};

// @TODO Set Firmware Configuration

// ## Exports
//
// Factory for OPCStream
//

module.exports = function(size) {
  return new OPCStream(size);
};
