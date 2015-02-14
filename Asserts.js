var Asserts = new function() {
	var self = this;

	self.AssertError = Error;

	/**
	overloads:
		assert(condition, [format, ..params])
		assert(condition, false, String)
		assert(condition, Type, [format, ..params])
		assert(condition, Type, false, [..params to type])
	*/
	self.assert = function(aCondition, aErrorConstructor, aMessage) {
		if (!aCondition) {
			var offset = 1;
			var ctor = self.AssertError;

			if (Types.isFunction(aErrorConstructor)) {
				offset = 2;
				ctor = aErrorConstructor;
			}

			var args = arguments[offset]
				? [ Strings.format.apply(null, Arrays.slice(arguments, offset)) ]
				: Arrays.slice(arguments, offset + 1);

			throw Functions.create.apply(null, [ ctor ].concat(args));
		}
	};

	/**
	overloads:
		fassert(aCondition, [String])
		fassert(aCondition, () -> String | ?.message)
	*/
	self.fassert = function(aCondition, aError) {
		if (!aCondition) {
			if (!Types.isFunction(aError)) {
				throw new AssertError(aError);
			}

			var err = aError();
			if (err && err.message) {
				throw err;
			}

			throw new AssertError(err);
		}
	};

	self.inRange = function(aX, aMin, aMax) {
		if ((aX < aMin) || (aX > aMax)) {
			throw new AssertError(Strings.format('Out of range: {} !E [{}:{}]', aX, aMin, aMax));
		}
	};

	self.nonNegative = function(aX) {
		if (aX < 0) {
			throw new AssertError(Strings.format('Negative: {}', aX));
		}
	};
};
