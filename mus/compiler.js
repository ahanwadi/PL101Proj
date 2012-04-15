var compile = function(musexpr) {
	var compileT = function(time, expr) {
		if (expr.tag === 'note')
		return [{ tag: 'note', dur: expr.dur, pitch: expr.pitch, start: time }];
		if (expr.tag === 'seq') {
			var l = compileT(time, expr.left);
			var et = endTime(time, expr.left);
			return l.concat(compileT(et, expr.right));
		}
	};
	return compileT(0, musexpr);
};

var musexpr = { tag: 'seq',
	left: { tag: 'note', pitch: 'c4', dur: 250 },
	right: { tag: 'seq',
		left: { tag: 'note', pitch: 'e4', dur: 250 },
		right: { tag: 'note', pitch: 'g4', dur: 500 } } };

console.log(musexpr);

var endTime = function(time, expr) {
	if (expr.tag === 'note') return time + expr.dur;
	if (expr.tag === 'seq') return time + endTime(0, expr.left) + endTime(0, expr.right);
};

console.log(endTime(0, musexpr));
console.log(compile(musexpr));
