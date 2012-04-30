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
assert.deepEqual(parse("a4[100]", "note"), { tag: "note", pitch: "a4", dur:100});

assert.deepEqual(parse("(a4[100], a3[200])"), { tag: "seq", left: { tag: "note", pitch: "a4", dur:100 }, right: { tag: "note", pitch: "a3", dur:200 } });

assert.deepEqual(parse("(a4[100], a3[200] | a4[40])"), { tag: "seq", left: {tag: "note", pitch: "a4", dur: 100 }, right: { tag: "par", left: { tag: "note", pitch: "a3", dur:200 }, right: { tag: "note", pitch: "a4", dur:40 } } });
