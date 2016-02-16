var JSC3D = JSC3D || {};
/**
	@class BinaryStream
	The helper class to parse data from a binary stream.
 */
JSC3D.BinaryStream = function(data, isBigEndian) {
	if(isBigEndian)
		throw 'JSC3D.BinaryStream constructor failed: Big endian is not supported yet!';

	this.data = data;
	this.offset = 0;
};

/**
	Get the full length (in bytes) of the stream.
	@returns {Number} the length of the stream.
 */
JSC3D.BinaryStream.prototype.size = function() {
	return this.data.length;
};

/**
	Get current position of the indicator.
	@returns {Number} current position in stream.
 */
JSC3D.BinaryStream.prototype.tell = function() {
	return this.offset;
};

/**
	Set the position indicator of the stream to a new position.
	@param {Number} position the new position.
	@returns {Boolean} true if succeeded; false if the given position is out of range.
 */
JSC3D.BinaryStream.prototype.seek = function(position) {
	if(position < 0 || position >= this.data.length)
		return false;

	this.offset = position;

	return true;
};

/**
	Reset the position indicator to the beginning of the stream.
 */
JSC3D.BinaryStream.prototype.reset = function() {
	this.offset = 0;
};

/**
	Advance the position indicator to skip a given number of bytes.
	@param {Number} bytesToSkip the number of bytes to skip.
 */
JSC3D.BinaryStream.prototype.skip = function(bytesToSkip) {
	if(this.offset + bytesToSkip > this.data.length)
		this.offset = this.data.length;
	else
		this.offset += bytesToSkip;
};

/**
	Get count of the remaining bytes in the stream.
	@returns {Number} the number of bytes from current position to the end of the stream.
 */
JSC3D.BinaryStream.prototype.available = function() {
	return this.data.length - this.offset;
};

/**
	See if the position indicator is already at the end of the stream.
	@returns {Boolean} true if the position indicator is at the end of the stream; false if not.
 */
JSC3D.BinaryStream.prototype.eof = function() {
	return !(this.offset < this.data.length);
};

/**
	Read an 8-bits' unsigned int number.
	@returns {Number} an 8-bits' unsigned int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readUInt8 = function() {
	return this.decodeInt(1, false);
};

/**
	Read an 8-bits' signed int number.
	@returns {Number} an 8-bits' signed int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readInt8 = function() {
	return this.decodeInt(1, true);
};

/**
	Read a 16-bits' unsigned int number.
	@returns {Number} a 16-bits' unsigned int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readUInt16 = function() {
	return this.decodeInt(2, false);
};

/**
	Read a 16-bits' signed int number.
	@returns {Number} a 16-bits' signed int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readInt16 = function() {
	return this.decodeInt(2, true);
};

/**
	Read a 32-bits' unsigned int number.
	@returns {Number} a 32-bits' unsigned int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readUInt32 = function() {
	return this.decodeInt(4, false);
};

/**
	Read a 32-bits' signed int number.
	@returns {Number} a 32-bits' signed int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readInt32 = function() {
	return this.decodeInt(4, true);
};

/**
	Read a 32-bits' (IEEE 754) floating point number.
	@returns {Number} a 32-bits' floating point number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readFloat32 = function() {
	return this.decodeFloat(4, 23);
};

/**
	Read a 64-bits' (IEEE 754) floating point number.
	@returns {Number} a 64-bits' floating point number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readFloat64 = function() {
	return this.decodeFloat(8, 52);
};

/**
	Read a piece of the stream into a given buffer.
	@param {Array} buffer the buffer to receive the result.
	@param {Number} bytesToRead length of the piece to be read, in bytes.
	@returns {Number} the total number of bytes that are successfully read.
 */
JSC3D.BinaryStream.prototype.readBytes = function(buffer, bytesToRead) {
	var bytesRead = bytesToRead;
	if(this.offset + bytesToRead > this.data.length)
		bytesRead = this.data.length - this.offset;

	for(var i=0; i<bytesRead; i++) {
		buffer[i] = this.data[this.offset++].charCodeAt(0) & 0xff;
	}

	return bytesRead;
};

/**
	@private
 */
JSC3D.BinaryStream.prototype.decodeInt = function(bytes, isSigned) {
	// are there enough bytes for this integer?
	if(this.offset + bytes > this.data.length) {
		this.offset = this.data.length;
		return NaN;
	}

	var rv = 0, f = 1;
	for(var i=0; i<bytes; i++) {
		rv += ((this.data[this.offset++].charCodeAt(0) & 0xff) * f);
		f *= 256;
	}

	if( isSigned && (rv & Math.pow(2, bytes * 8 - 1)) )
		rv -= Math.pow(2, bytes * 8);

	return rv;
};

/**
	@private
 */
JSC3D.BinaryStream.prototype.decodeFloat = function(bytes, significandBits) {
	// are there enough bytes for the float?
	if(this.offset + bytes > this.data.length) {
		this.offset = this.data.length;
		return NaN;
	}

	var mLen = significandBits;
	var eLen = bytes * 8 - mLen - 1;
	var eMax = (1 << eLen) - 1;
	var eBias = eMax >> 1;

	var i = bytes - 1; 
	var d = -1; 
	var s = this.data[this.offset + i].charCodeAt(0) & 0xff; 
	i += d; 
	var bits = -7;
	var e = s & ((1 << (-bits)) - 1);
	s >>= -bits;
	bits += eLen
	while(bits > 0) {
		e = e * 256 + (this.data[this.offset + i].charCodeAt(0) & 0xff);
		i += d;
		bits -= 8;
	}

	var m = e & ((1 << (-bits)) - 1);
	e >>= -bits;
	bits += mLen;
	while(bits > 0) {
		m = m * 256 + (this.data[this.offset + i].charCodeAt(0) & 0xff);
		i += d;
		bits -= 8;
	}

	this.offset += bytes;

	switch(e) {
	case 0:		// 0 or denormalized number
		e = 1 - eBias;
		break;
	case eMax:	// NaN or +/-Infinity
		return m ? NaN : ((s ? -1 : 1) * Infinity);
	default:	// normalized number
		m += Math.pow(2, mLen);
		e -= eBias;
		break;
	}

	return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
