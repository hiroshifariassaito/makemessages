import * as cli from 'cli';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
// import { Gatherer } from './Gatherers/po/index';
import { PO2JSONCompiler } from './Compilers/json/index';

function absolutePath(file) { return path.resolve(process.cwd(), file); }

let args = cli.parse({
	config: [ 'c', 'A json file with your configurations', 'file', './compilemessages.json' ]
});

async function main() {

	const config = await import(absolutePath(args.config)).catch(console.error);
	if (!config)
		return;

	const c = new PO2JSONCompiler();
	let inputOutputDict = {};
	glob.sync(absolutePath(config.json.input) + '/**/*.po').forEach(file => {

		inputOutputDict[file] = file.replace(absolutePath(config.json.input), absolutePath(config.json.output)).replace(/\.po$/g, '.json');
	});
	Object.keys(inputOutputDict).forEach(input => {
	
		try {
			fs.statSync(path.dirname(inputOutputDict[input]));
		} catch(e) {
			fs.mkdirSync(path.dirname(inputOutputDict[input]));
		}
		c.po2json(input, inputOutputDict[input])
	});
}

main();