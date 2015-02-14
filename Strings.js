var Strings = new function() {
	'use strict';

	var self = this;

	self.format = function(aFormat /*, .. args */) {
		var index = 0;
		var args = Arrays.args(arguments, 1);

		return aFormat.replace(/\{(\d*)\}/g, function(_, aIndex) {
			return args[aIndex ? (aIndex | 0) : index++];
		});
	};

	self.trim = String.trim
		? function(aString) {
			return String.trim(aString || '');
		}
		: function(aString) {
			return (aString || '').replace(/^\s*|\s*$/g, '');
		};

	self.isBlank = function(aString) {
		return /^\s*$/.test(aString || '');
	};
};
