var Objects = new function() {
	var self = this;

	self.map = Arrays.remap;

	self.extend = Arrays.extend;

	self.filter = Arrays.filter;

	self.select = self.filter;

	self.values = function(aObject /*, ..values */) {
		var values = Arrays.args(arguments, 1);

		return Arrays.map(values, function(aValue) {
			return aObject[aValue];
		});
	};

	self.create = Object.create || function(aProto, aProperties) {
		Asserts.assert(
			typeof(aProto) === 'object' || typeof(aProto) === 'function',
			TypeError, 'Object prototype may only be an Object or null: {}', aProto
		);
		Asserts.assert(!aProperties, 'error: properties not supported');

		var t = function() {
		};
		t.prototype = aProto;

		return new t();
	};

	self.defineProperty = Object.defineProperty;

	self.defineGetter = function(aObject, aKey, aFunction) {
		return self.defineProperty(aObject, aKey, {
			get: aFunction
		});
	};

	self.defineValue = function(aObject, aKey, aValue) {
		return self.defineProperty(aObject, aKey, {
			value: aValue
		});
	};
};
