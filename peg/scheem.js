var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;

assert.deepEqual(parse("(a b c)"), ["a", "b", "c"] );
assert.deepEqual(parse(" atom"), "atom");
assert.deepEqual(parse(" +"), "+");
assert.deepEqual(parse(" ( +  x  3 ) "), ["+", "x", "3"]);
assert.deepEqual(parse("(+ 1 (f x 3 y))"), 
    ["+", "1", ["f", "x", "3", "y"]]);
assert.deepEqual(parse("	abc"), "abc");
assert.deepEqual(parse("\r\n abc"), "abc");
assert.deepEqual(parse(";; testing comments\r\n atom"), "atom");
assert.deepEqual(parse("'atom"), ["quote", "atom"]);
