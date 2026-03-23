import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = { version: '0.1.0' };

const program = new Command();

program
  .name('domasm')
  .description('DOM ASM - Document Object Model Automaton State Machine CLI')
  .version(pkg.version);

program
  .command('parse <file>')
  .description('Parse an HTML file into an AST and output as JSON')
  .option('-o, --output <file>', 'Output file path')
  .option('--optimize', 'Optimize the AST after parsing')
  .action(async (file: string, options: { output?: string; optimize?: boolean }) => {
    try {
      const input = fs.readFileSync(path.resolve(file), 'utf-8');
      const { DomASM } = require('../DomASM');
      const domasm = new DomASM();

      let ast = domasm.parse(input);
      if (options.optimize) {
        ast = domasm.optimize(ast);
      }

      const output = JSON.stringify(ast, null, 2);

      if (options.output) {
        fs.writeFileSync(path.resolve(options.output), output, 'utf-8');
        console.log(`AST written to ${options.output}`);
      } else {
        console.log(output);
      }
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command('optimize <file>')
  .description('Parse and optimize an HTML file AST')
  .option('-o, --output <file>', 'Output file path')
  .action(async (file: string, options: { output?: string }) => {
    try {
      const input = fs.readFileSync(path.resolve(file), 'utf-8');
      const { DomASM } = require('../DomASM');
      const domasm = new DomASM();

      const ast = domasm.parse(input);
      const optimized = domasm.optimize(ast);

      const output = JSON.stringify(optimized, null, 2);

      if (options.output) {
        fs.writeFileSync(path.resolve(options.output), output, 'utf-8');
        console.log(`Optimized AST written to ${options.output}`);
      } else {
        console.log(output);
      }
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command('diff <file1> <file2>')
  .description('Compute differences between two HTML files')
  .option('-o, --output <file>', 'Output file path')
  .action(async (file1: string, file2: string, options: { output?: string }) => {
    try {
      const input1 = fs.readFileSync(path.resolve(file1), 'utf-8');
      const input2 = fs.readFileSync(path.resolve(file2), 'utf-8');
      const { DomASM } = require('../DomASM');
      const domasm = new DomASM();

      const ast1 = domasm.parse(input1);
      const ast2 = domasm.parse(input2);
      const diffs = domasm.diff(ast1, ast2);

      const output = JSON.stringify(diffs, null, 2);

      if (options.output) {
        fs.writeFileSync(path.resolve(options.output), output, 'utf-8');
        console.log(`Diff written to ${options.output}`);
      } else {
        console.log(output);
      }
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
