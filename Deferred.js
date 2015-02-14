var Promise = (function() {
	var MARK = {};

	function createCallback(self, deferred, aSuccess, aError) {
		var retval = function(aValue) {
			var callback;

			if (self.isResolved()) {
				if (aSuccess) {
					callback = aSuccess;
				} else {
					deferred.resolve(aValue);
					return;
				}
			}

			if (self.isRejected()) {
				if (aError) {
					callback = aError;
				} else {
					deferred.reject(aValue);
					return;
				}
			}

			Deferred.when(callback.call(self, aValue)).then(
				deferred.resolve,
				deferred.reject
			);
		};

		retval.dfdMark = MARK;
		return retval;
	}

	return function(aMaster) {
		var self = this;

		var mValue;
		var mStatus = 'pending';

		var mCallbacks = [];

		this.then = function(aSuccess, aError, aProgress) {
			if (this.isResolved()) {
				if (aSuccess) {
					return Deferred.when(aSuccess.call(this, mValue));
				}

				return this;
			}

			if (this.isRejected()) {
				if (aError) {
					return Deferred.when(aError.call(this, mValue));
				}

				return this;
			}

			if (aProgress) {
				mCallbacks.push(aProgress);
			}

			var deferred = new Deferred();
			mCallbacks.push(createCallback(self, deferred, aSuccess, aError));

			return deferred.promise();
		};

		this.status = function() {
			return mStatus;
		};

		aMaster(function(aStatus, aValue) {
			switch(aStatus) {
				case 'progress':
				case 'rejected':
				case 'resolved':
				break;
				default:
					throw new Error('Unsupported status: ' + aStatus);
			}

			if (self.isPending()) {
				var filter;

				if (aStatus !== 'progress') {
					mStatus = aStatus;
					mValue = aValue;
					filter = Functions.id;
				} else {
					filter = Functions.not;
				}

				for (var i = 0; i < mCallbacks.length; ++i) {
					if (filter(mCallbacks[i].dfdMark === MARK)) {
						mCallbacks[i].call(self, aValue);
					}
				}

				if (!self.isPending()) {
					// free up the callbacks memory
					mCallbacks = null;
				}
			}

			return self;
		});
	};
})();

Promise.prototype.done = function(aFunction) {
	this.then(aFunction);
	return this;
};

Promise.prototype.fail = function(aFunction) {
	this.then(null, aFunction);
	return this;
};

Promise.prototype.always = function(aFunction) {
	this.then(aFunction, aFunction);
	return this;
};

Promise.prototype.progress = function(aFunction) {
	this.then(null, null, aFunction);
	return this;
};

Promise.prototype.isResolved = function() {
	return this.status() === 'resolved';
};

Promise.prototype.isRejected = function() {
	return this.status() === 'rejected';
};

Promise.prototype.isPending = function() {
	return this.status() === 'pending';
};

function Deferred() {
	if (!(this instanceof Deferred)) {
		return new Deferred();
	}

	var self = this;
	var remoteControl;

	var promise = new Promise(function(aResolver) {
		remoteControl = aResolver;
	});

	this.promise = function() {
		return promise;
	};

	this.resolve = function(aValue) {
		remoteControl('resolved', aValue);
		return self;
	};

	this.reject = function(aValue) {
		remoteControl('rejected', aValue);
		return self;
	};

	this.notify = function(aValue) {
		remoteControl('progress', aValue);
		return self;
	};
}

(function() {
	// bridge all Promise helper methods
	for (var f in Promise.prototype) {
		(function(fn) {
			Deferred.prototype[fn] = function() {
				return Promise.prototype[fn].apply(this.promise(), arguments);
			};
		})(f);
	}
})();

Deferred.resolve = Promise.resolve = function(aValue) {
	return new Deferred().resolve(aValue).promise();
};

Deferred.reject = Promise.reject = function(aValue) {
	return new Deferred().reject(aValue).promise();
};

Deferred.when = Promise.when = function(aValue) {
	if (aValue && aValue.then) {
		return aValue;
	}

	return Deferred.resolve(aValue);
};

Deferred.resolved = Deferred.resolve(true);
Deferred.rejected = Deferred.reject(false);
