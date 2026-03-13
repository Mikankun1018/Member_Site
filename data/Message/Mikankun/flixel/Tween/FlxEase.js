export const FlxEase = {
  linear: t => t,

  quadIn: t => t * t,
  quadOut: t => t * (2 - t),
  quadInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  cubicIn: t => t * t * t,
  cubicOut: t => (--t) * t * t + 1,
  cubicInOut: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  quartIn: t => t * t * t * t,
  quartOut: t => 1 - (--t) * t * t * t,
  quartInOut: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

  quintIn: t => t * t * t * t * t,
  quintOut: t => 1 + (--t) * t * t * t * t,
  quintInOut: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,

  sineIn: t => 1 - Math.cos(t * Math.PI / 2),
  sineOut: t => Math.sin(t * Math.PI / 2),
  sineInOut: t => -(Math.cos(Math.PI * t) - 1) / 2,

  expoIn: t => Math.pow(2, 10 * (t - 1)),
  expoOut: t => 1 - Math.pow(2, -10 * t),
  expoInOut: t => t < 0.5 ? Math.pow(2, 10 * (2 * t - 1)) / 2 : (2 - Math.pow(2, -10 * (2 * t - 1))) / 2,

  circIn: t => 1 - Math.sqrt(1 - t * t),
  circOut: t => Math.sqrt(1 - (--t) * t),
  circInOut: t => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - (t * 2 - 2) * (t * 2 - 2)) + 1) / 2,

  elasticIn: t => t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * (2 * Math.PI) / 3),
  elasticOut: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
  elasticInOut: t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ?
	-(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * (2 * Math.PI) / 4.5)) / 2 :
	(Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * (2 * Math.PI) / 4.5)) / 2 + 1,

  backIn: t => t * t * ((1.70158 + 1) * t - 1.70158),
  backOut: t => (t = t - 1) * t * ((1.70158 + 1) * t + 1.70158) + 1,
  backInOut: t => t < 0.5 ?
	(Math.pow(2 * t, 2) * ((1.70158 * 1.525 + 1) * 2 * t - 1.70158 * 1.525)) / 2 :
	(Math.pow(2 * t - 2, 2) * ((1.70158 * 1.525 + 1) * (t * 2 - 2) + 1.70158 * 1.525) + 2) / 2,

  bounceIn: t => 1 - bounceOut(1 - t),
  bounceOut: t => {
	n1 = 7.5625;
	d1 = 2.75;

	if (t < 1 / d1) return n1 * t * t;
	else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
	else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
	else return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  bounceInOut: t => t < 0.5 ? (1 - bounceOut(1 - 2 * t)) / 2 : (1 + bounceOut(2 * t - 1)) / 2,
};