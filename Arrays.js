var Arrays = new function() {
	var self = this;

	self.map = function(aArray, aFunc) {
		var retval = [];

		self.each(aArray, function(aValue, aKey) {
			retval.push(aFunc.call(aArray, aValue, aKey));
		});

		return retval;
	};

	self.remapFilter = function(aObject, aFunc) {
		var retval = {};

		self.each(aObject, function(aValue, aKey) {
			aFunc.call(retval, aValue, aKey, retval);
		});

		return retval;
	};

	self.remap = function(aObject, aFunc) {
		return self.remapFilter(aObject, function(aValue, aKey) {
			var pair = aFunc.call(null, aValue, aKey);

			this[pair[0]] = pair[1];
		});
	};

	self.filter = function(aObject, aFunc) {
		var retval;

		if (Types.isArrayLike(aObject)) {
			retval = [];

			self.each(aObject, function(aValue, aKey) {
				if (aFunc.call(aObject, aValue, aKey)) {
					retval.push(aValue);
				}
			});
		} else {
			retval = {};

			self.each(aObject, function(aValue, aKey) {
				if (aFunc.call(aObject, aValue, aKey)) {
					retval[aKey] = aValue;
				}
			});
		}

		return retval;
	};

	self.select = self.filter;

	self.extend = function(aDeep, aTarget /*, ..args*/) {
		var deep = Types.isBoolean(aDeep) ? aDeep : false;
		var target = Types.isBoolean(aDeep) ? aTarget : aDeep;

		var merge = function(aValue, aKey) {
			if (deep && Types.isObject(aValue)) {
				target[aKey] = self.extend(Types.isObject(target[aKey]) ? target[aKey] : {}, aValue);
			} else {
				target[aKey] = aValue;
			}
		};

		var i = Types.isBoolean(aDeep) ? 2 : 1;
		for (; i < arguments.length; ++i) {
			self.each(arguments[i], merge);
		}

		return target;
	};

	self.reduce = function(aArray, aFunc, aInitial) {
		var retval, index;

		if (typeof(aInitial) === 'undefined') {
			index = 1;
			retval = aArray[0];
		} else {
			index = 0;
			retval = aInitial;
		}

		for (; index < aArray.length; ++index) {
			retval = aFunc(retval, aArray[index]);
		}

		return retval;
	};

	self.fold = self.reduce;

	self.foldl = self.reduce;

	self.foldr = function(aArray, aFunc, aInitial) {
		var retval, index;

		if (typeof(aInitial) === 'undefined') {
			index = aArray.length - 2;
			retval = aArray[index + 1];
		} else {
			index = aArray.length - 1;
			retval = aInitial;
		}

		for (; index > 0; --index) {
			retval = aFunc(retval, aArray[index]);
		}

		return retval;
	};

	self.apply = function(aArray, aFunction, aArgs) {
		self.each(aArray, function(aValue) {
			aFunction.apply(aValue, aArgs);
		});
	};

	self.applyMap = function(aArray, aFunction, aArgs) {
		var retval = [];

		self.each(aArray, function(aValue) {
			retval.push(aFunction.apply(aValue, aArgs));
		});

		return retval;
	};

	self.remove = function(aArray, aValue) {
		var index = aArray.indexOf(aValue);

		if (index !== -1) {
			return aArray.splice(index, 1)[0];
		}
	};

	self.removeSame = function(aArray, aValue) {
		var start = 0;
		var index = aArray.indexOf(aValue);
		var found = index !== -1;

		while (index !== -1) {
			aArray.splice(index, 1);
			index = aArray.indexOf(aValue, index);
		}

		if (found) {
			return aValue;
		}
	};

	self.removeAll = function(aArray, aValues) {
		var retval = [];

		self.each(aValues, function(aValue) {
			if (self.removeSame(aArray, aValue) === aValue) {
				retval.push(aValue);
			}
		});

		return retval;
	};

	self.push = Array.push || Functions.asStatic(Array.prototype.push);

	self.addAll = function(aArray) {
		self.push.apply(null, arguments);

		return aArray;
	};

	self.each = function(aObject, aFunc) {
		if (Types.isArrayLike(aObject)) {
			for (var i = 0; i < aObject.length; ++i) {
				if (aFunc.call(aObject, aObject[i], i) === false) {
					break;
				}
			}
		} else {
			for (var i in aObject) {
				if (aFunc.call(aObject, aObject[i], i) === false) {
					break;
				}
			}
		}

		return aObject;
	};

	self.slice = Array.slice || Functions.asStatic(Array.prototype.slice);

	self.args = self.slice;
};
