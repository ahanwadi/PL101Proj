var compile = function(musexpr) {
	var compileT = function(time, expr) {
		if (expr.tag === 'note')
			return [{ tag: 'note', dur: expr.dur, pitch: expr.pitch, start: time }];
		if (expr.tag === 'rest') {
			return [{tag: 'rest', dur: expr.duration, start: time}];
		}
		if (expr.tag === 'seq') {
			var l = compileT(time, expr.left);
			var et = endTime(time, expr.left);
			return l.concat(compileT(et, expr.right));
		}
		if (expr.tag === 'par') {
			return compileT(time, expr.left).concat(compileT(time, expr.right));
		}
	};
	return compileT(0, musexpr);
};

var endTime = function(time, expr) {
	if (expr.tag === 'note') return time + expr.dur;
	if (expr.tag === 'rest') return time + expr.duration;
	if (expr.tag === 'seq') return time + endTime(0, expr.left) + endTime(0, expr.right);
	if (expr.tag === 'par') {
		l = endTime(time, expr.left);
		r = endTime(time, expr.right);
		return l > r ? l : r;
	}
};

var musexpr = { tag: 'par',
	left: { tag: 'note', pitch: 'c4', dur: 250 },
	right: { tag: 'par',
		left: { tag: 'note', pitch: 'e4', dur: 250 },
		right: { tag: 'rest', duration: 250 } } };

console.log(musexpr);

console.log(endTime(0, musexpr));
console.log(compile(musexpr));
