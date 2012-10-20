var BufferHelper = function() {
  this.buffers = [];
  this.size = 0;
  this._status = 'changed';
};

BufferHelper.prototype.concat = function(buffer) {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    this._concat(arguments[i]);
  }
  return this;
};

BufferHelper.prototype._concat = function(buffer) {
  this.buffers.push(buffer);
  this.size += buffer.length;
  this._status = 'changed';
  return this;
};

BufferHelper.prototype._toBuffer = function() {
  var data = null;
  var buffers = this.buffers;
  switch (buffers.length) {
    case 0: {
      data = new Buffer(0);
      break;
    }
    case 1: {
      data = buffers[0];
      break;
    }
    default: {
      data = new Buffer(this.size);
      for (var i = 0, pos = 0, len = buffers.length; i < len; ++i) {
        var buffer = buffers[i];
        buffer.copy(data, pos);
        pos += buffer.length;
      }
    }
  }
  this._status = 'complete';
  this.buffer = data;
  return data;
};

BufferHelper.prototype.toBuffer = function() {
  return this._status === 'complete' ? this.buffer : this._toBuffer();
};

BufferHelper.prototype.toString = function() {
  return this.toBuffer().toString();
};

module.exports = BufferHelper;