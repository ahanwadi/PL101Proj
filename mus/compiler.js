var c2i = {
	a: 9,
	b: 11,
	c: 0,
	d: 2,
	e: 4,
	f: 5,
	g: 7,
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8
};

var note2midi = function(notename) {
	note = c2i[notename[0]];
	octave = c2i[notename[1]];
	return 12 + octave * 12 + note;
};

var compile = function(musexpr) {
	var compileT = function(time, expr) {
		if (expr.tag === 'note')
			return [{ tag: 'note', dur: expr.dur, pitch: note2midi(expr.pitch), start: time }];
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
		if (expr.tag === 'repeat') {
			var et = time;
			var nl = [];
			for (i = 0; i < expr.count; ++i) {
				s = compileT(et, expr.section);
				nl = nl.concat(s);
				et = endTime(et, expr.section);
			}
			return nl;
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
	if (expr.tag === 'repeat') {
		var et = time;
		for (i = 0; i < expr.count; ++i) {
			et = endTime(et, expr.section);
		}
		return et;
	}
};

var musexpr = { tag: 'par',
	left: { tag: 'note', pitch: 'c4', dur: 250 },
	right: { tag: 'par',
		left: { tag: 'note', pitch: 'e4', dur: 250 },
		right: { tag: 'note', pitch: 'g4', dur: 250 } } };

var remusexpr = { tag: 'repeat', section: musexpr, count: 3 };

console.log(remusexpr);

console.log(endTime(0, remusexpr));
console.log(compile(remusexpr));
