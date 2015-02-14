var Functions = new function() {
	var self = this;

	self.asStatic = function(aFunction) {
		return function() {
			return aFunction.call.apply(aFunction, arguments);
		};
	};

	self.once = function(aFunction, aReturn) {
		var called = false;

		return function() {
			if (!called) {
				called = true;
				return aFunction.apply(this, arguments);
			}

			return aReturn;
		};
	};

	self.locked = function(aFunction, aReturn) {
		var lock = false;
		var unlock = function() {
			lock = false;
		};

		return function() {
			if (lock) {
				return aReturn;
			}

			lock = true;
			return aFunction.apply(this, [ unlock ].concat(Arrays.args(arguments)));
		};
	};

	self.memoizing = function(aFunction, aPool) {
		var pool = aPool || {};

		return function(aFirst) {
			if (!(aFirst in pool)) {
				pool[aFirst] = aFunction.apply(this, arguments);
			}

			return pool[aFirst];
		};
	};

	self.inherit = function(aFunction, aBase) {
		aFunction.prototype = Object.create(aBase.prototype);

		Object.defineProperty(aFunction.prototype, 'constructor', {
			value: aFunction
		});

		return aFunction;
	};

	self.inherit2 = function(aBase, aFunction) {
		return self.inherit(aFunction, aBase);
	};

	function extend(aFunction, aExtensions) {
		Arrays.each(aExtensions, function(aExt) {
			Arrays.extend(aFunction.prototype, aExt);
		});

		return aFunction;
	}

	self.extend = function(aFunction /*, ..args */) {
		return extend(aFunction, Arrays.args(arguments, 1));
	};

	self.extend2 = function(/* ..args, f */) {
		var args = Arrays.args(arguments);
		var f = args.pop();

		return extend(f, args);
	};

	self.curry = function(aFunction /*, ..args */) {
		var args = Arrays.args(arguments, 1);

		return function() {
			return aFunction.apply(this, args.concat(Arrays.args(arguments)));
		};
	};

	self.rcurry = function(aFunction /*, ..args */) {
		var args = Arrays.args(arguments, 1);

		return function() {
			return aFunction.apply(this, Arrays.args(arguments).concat(args));
		};
	};

	self.partial = function(aFunction /*, ..parts */) {
		var parts = Arrays.args(arguments, 1);

		return function() {
			var args = parts.slice();

			for (var i = 0, j = 0; (i < args.length) && (j < arguments.length); ++i) {
				if (typeof(args[i]) === 'undefined') {
					args[i] = arguments[j++];
				}
			}

			while (j < arguments.length) {
				args.push(arguments[j++]);
			}

			return aFunction.apply(this, args);
		};
	};

	self.bind2 = function(aFunction /* aThis, ..parts */) {
		var args = Arrays.args(arguments, 1);

		var r = function() {
			// are we called with new?
			if (this instanceof r) {
				if (!aFunction.prototype) {
					// see https://gist.github.com/jacomyal/4b7ae101a1cf6b985c60
					throw new TypeError('function ' + aFunction + ' is not a constructor');
				}

				return aFunction.apply(this, args.slice(1).concat(Arrays.args(arguments)));
			}

			return aFunction.call.apply(aFunction, args.concat(Arrays.args(arguments)));
		};

		if (aFunction.prototype) {
			// more standard like behaviour (i.e. new f(1) is instanceof f.bind(null, 1))
			// r.prototype = aFunction.prototype;

			// more logical behaviour (i.e. new f(1) is not instanceof f.bind(null, 1))
			r.prototype = Objects.create(aFunction.prototype);
		}

		return r;
	};

	self.bind = (Function.prototype.bind && self.asStatic(Function.prototype.bind))
		|| self.bind2;

	self.noop = function() {
	};

	self.id = function(aX) {
		return aX;
	};

	self.not = function(aX) {
		return !aX;
	};

	self.constf = function(aX) {
		return function() {
			return aX;
		};
	};

	self.returnTrue = self.constf(true);

	self.returnFalse = self.constf(false);

	self.method = function(aName) {
		return function() {
			return this[aName].apply(this, arguments);
		};
	};

	self.property = function(aName) {
		return function() {
			return this[aName];
		};
	};

	self.source = function(aFunction) {
		return (aFunction || '') + '';
	};

	self.isNative = function(aFunction) {
		return /^[^{]+\{\s*\[native code/.test(self.source(aFunction));
	};

	self.argumentNames = function(aFunction) {
		var source = self.source(aFunction);

		// remove comments
		source = source
			.replace(/\/\/.*?\n/g, '')
			.replace(/\/\*.*?\*\//g, '');

		var match = source.match(/^[^(]+\(([^)]+)\)/);
		var args = match && Strings.trim(match[1]);

		return args ? args.split(/\s*,\s*/g) : [];
	};

	self.create = (function() {
		var constructorFactory = self.memoizing(function(aArgsCount) {
			var args = [];

			for (var i = 1; i < aArgsCount; ++i) {
				args.push('a' + i);
			}

			return Function(
				[ 'f' ].concat(args).join(','),
				'return new f(' + args.join(',') + ');'
			);
		});

		return function(/* constructor, ..arguments */) {
			return constructorFactory(arguments.length).apply(null, arguments);
		};
	})();
};
