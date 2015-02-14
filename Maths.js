var Maths = new function() {
	var self = this;

	self.PI2 = Math.PI * 2;

	self.degToRad = function(aDegrees) {
		return aDegrees * Math.PI / 180;
	};

	self.normalizeAngle = function(aAngle) {
		if (aAngle < 0) {
			return aAngle + PI2;
		}

		return (aAngle > PI2) ? (aAngle - PI2) : aAngle;
	};

	self.normalizeAngle2 = function(aAngle) {
		while (aAngle < 0) {
			aAngle += PI2;
		}

		return aAngle % PI2;
	};

	self.clamp = function(aX, aMin, aMax) {
		return Math.min(aMax, Math.max(aMin, aX));
	};

	self.sign = function(aX) {
		return (0 < aX) - (aX < 0);
	};

	self.intensity = function(aColor255, aIntensity) {
		return Math.round(aColor255 + (255 - aColor255) * (1 - aIntensity));
	};
};
