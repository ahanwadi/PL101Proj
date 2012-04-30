var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('mus.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
assert.deepEqual(parse("[100]", "duration"), 100);
assert.deepEqual(parse("[100]", "note"), { tag: "rest", duration: 100 });
assert.deepEqual(parse("a4[100]", "note"), { tag: "note", pitch: "a4", dur:100});

assert.deepEqual(parse("(a4[100], a3[200])"), { tag: "seq", left: { tag: "note", pitch: "a4", dur:100 }, right: { tag: "note", pitch: "a3", dur:200 } });

assert.deepEqual(parse("(a4[100], a3[200] | a4[40])"), { tag: "seq", left: {tag: "note", pitch: "a4", dur: 100 }, right: { tag: "par", left: { tag: "note", pitch: "a3", dur:200 }, right: { tag: "note", pitch: "a4", dur:40 } } });

assert.deepEqual(parse("(a4[100], a3[200] * 3)"), { tag: "seq", left: {tag: "note", pitch: "a4", dur: 100 }, right: { tag: "repeat", section: { tag: "note", pitch: "a3", dur:200 }, count: 3 } });

assert.deepEqual(parse("(a4[100] | a3[200] | a2[8])"), { tag: "par", left: {tag: "note", pitch: "a4", dur: 100 }, right: { tag: "par", left: { tag: "note", pitch: "a3", dur:200 }, right: {tag: "note", pitch: "a2", dur: 8} } });
