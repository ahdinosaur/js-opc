function encodeControl(channel, command, length) {
  var CONTROL_LENGTH = 4;
  var buffer = Buffer.alloc(CONTROL_LENGTH);
  buffer.writeUInt8(channel, 0); // Channel
  buffer.writeUInt8(command, 1); // Command
  buffer.writeUInt16BE(length, 2); // Data length
  return buffer;
}

function encodeMessage(channel, command, data) {
  var control = encodeControl(channel, command, data.length);
  return Buffer.concat([control, data]);
}

function encodePixelsMessage(channel, pixels) {
  return encodeMessage(channel, 0, pixels);
}

function encodeSetGlobalColorCorrectionMessage(config) {
  var json = JSON.stringify(config);
  var data = Buffer.alloc(Buffer.byteLength(json) + 4);
  data.writeUInt16BE(0x0001, 0); // System ID ("Fadecandy")
  data.writeUInt16BE(0x0001, 2); // SysEx ID ("Set Global Color Correction")
  data.write(json, 4); // data
  return encodeMessage(0, 0xff, data);
}

function decodeMessage (read, callback) {
  var message = {};
  // read channel
  read(1, function(data) {
    message.channel = data.readUInt8(0);
    // read command
    read(1, function(data) {
      message.command = data.readUInt8(0);
      // read data length
      read(2, function(data) {
        var length = data.readUInt16BE(0);
        // read data
        read(length, function(data) {
          message.data = data;
          // done!
          callback(message);
        });
      });
    });
  });
}

function decodeAllMessages(read, callback) {
  (function next() {
    decodeMessage(read, function(message) {
      callback(message);
      next();
    });
  })();
}

module.exports = {
  encodeControl: encodeControl,
  encodeMessage: encodeMessage,
  encodePixelsMessage: encodePixelsMessage,
  encodeSetGlobalColorCorrectionMessage: encodeSetGlobalColorCorrectionMessage,
  decodeMessage: decodeMessage,
  decodeAllMessages: decodeAllMessages
};
