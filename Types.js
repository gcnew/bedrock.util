var Types = new function() {
	var self = this;

	var TYPE_MAP = (function() {
		var retval = {};
		var nativeTypes = 'Boolean Number String Function Array Date RegExp Object Error Arguments'.split(' ');

		var add = function(aType) {
			var tlc = aType.toLowerCase();

			// add a native mapping
			retval['[object ' + aType + ']'] = tlc;

			// and a testing function
			self['is' + aType] = function(aObject) {
				return self.type(aObject) === tlc;
			};
		};

		for (var i = 0; i < nativeTypes.length; ++i) {
			add(nativeTypes[i]);
		}

		return retval;
	})();

	self.type = function(aObject) {
		if (typeof(aObject) === 'undefined') {
			return 'undefined';
		}

		if (aObject === null) {
			return 'null';
		}

		return TYPE_MAP[Object.prototype.toString.call(aObject)];
	};

	self.typeOf = function(aObject) {
		if (aObject === null) {
			return 'null';
		}

		return typeof(aObject);
	};

	// use Array.isArray if available
	self.isArray = Array.isArray || self.isArray;

	self.isArrayLike = function(aObject) {
		if (self.isFunction(aObject)) {
			return false;
		}

		/*
		return self.isArray(aObject)
			|| self.isArguments(aObject)
			|| self.isString(aObject)
			|| (
				(self.type(aObject) === 'object')
				&& self.isNumber(aObject.length)
				&& (aObject.length >= 0)
			);
		*/

		return !!aObject && self.isNumber(aObject.length) && (aObject.length >= 0);
	};

	self.isNull = function(aObject) {
		return aObject === null;
	};

	self.isNotNull = function(aObject) {
		return aObject !== null;
	};

	self.isTrue = function(aObject) {
		return !!aObject;
	};

	self.isFalse = function(aObject) {
		return !aObject;
	};

	self.asBoolean = self.isTrue;

	self.isUndefined = function(aObject) {
		return typeof(aObject) === 'undefined';
	};
};
