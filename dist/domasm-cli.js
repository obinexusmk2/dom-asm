#!/usr/bin/env node
/*!
 * @obinexusltd/dom-asm v0.1.0
 * (c) 2025 Nnamdi Michael Okpala
 * @license MIT
 */
'use strict';

var commander = require('commander');
var fs = require('fs');
var path = require('path');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = { version: '0.1.0' };
const program = new commander.Command();
program
    .name('domasm')
    .description('DOM ASM - Document Object Model Automaton State Machine CLI')
    .version(pkg.version);
program
    .command('parse <file>')
    .description('Parse an HTML file into an AST and output as JSON')
    .option('-o, --output <file>', 'Output file path')
    .option('--optimize', 'Optimize the AST after parsing')
    .action(async (file, options) => {
    try {
        const input = fs__namespace.readFileSync(path__namespace.resolve(file), 'utf-8');
        const { DomASM } = require('../DomASM');
        const domasm = new DomASM();
        let ast = domasm.parse(input);
        if (options.optimize) {
            ast = domasm.optimize(ast);
        }
        const output = JSON.stringify(ast, null, 2);
        if (options.output) {
            fs__namespace.writeFileSync(path__namespace.resolve(options.output), output, 'utf-8');
            console.log(`AST written to ${options.output}`);
        }
        else {
            console.log(output);
        }
    }
    catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('optimize <file>')
    .description('Parse and optimize an HTML file AST')
    .option('-o, --output <file>', 'Output file path')
    .action(async (file, options) => {
    try {
        const input = fs__namespace.readFileSync(path__namespace.resolve(file), 'utf-8');
        const { DomASM } = require('../DomASM');
        const domasm = new DomASM();
        const ast = domasm.parse(input);
        const optimized = domasm.optimize(ast);
        const output = JSON.stringify(optimized, null, 2);
        if (options.output) {
            fs__namespace.writeFileSync(path__namespace.resolve(options.output), output, 'utf-8');
            console.log(`Optimized AST written to ${options.output}`);
        }
        else {
            console.log(output);
        }
    }
    catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('diff <file1> <file2>')
    .description('Compute differences between two HTML files')
    .option('-o, --output <file>', 'Output file path')
    .action(async (file1, file2, options) => {
    try {
        const input1 = fs__namespace.readFileSync(path__namespace.resolve(file1), 'utf-8');
        const input2 = fs__namespace.readFileSync(path__namespace.resolve(file2), 'utf-8');
        const { DomASM } = require('../DomASM');
        const domasm = new DomASM();
        const ast1 = domasm.parse(input1);
        const ast2 = domasm.parse(input2);
        const diffs = domasm.diff(ast1, ast2);
        const output = JSON.stringify(diffs, null, 2);
        if (options.output) {
            fs__namespace.writeFileSync(path__namespace.resolve(options.output), output, 'utf-8');
            console.log(`Diff written to ${options.output}`);
        }
        else {
            console.log(output);
        }
    }
    catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
});
program.parse(process.argv);
//# sourceMappingURL=domasm-cli.js.map
