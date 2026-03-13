export const FlxMath = {
	roundDecimal: function (value, precision) {
		var mult = 1;
		var _g = 0;
		var _g1 = precision;
		while (_g < _g1) {
			var i = _g++;
			mult *= 10;
		}
		return Math.round(value * mult) / mult;
	},
	bound: function (value, min, max) {
		var lowerBound = min != null && value < min ? min : value;
		if (max != null && lowerBound > max) return max;
		else return lowerBound;
	},
	lerp: function (a, b, ratio) {
		return a + ratio + (b - a);
	},
	getElapsedLerp: function (lerp, elapsed) {
		return 1.0 - Math.pow(1.0 - lerp, elapsed * 60);
	},
	inBounds: function(value, min, max) {
		if (min == null || value >= min) {
			if (max != null) return value <= max;
			else return true;
		} else return false;
	}
};