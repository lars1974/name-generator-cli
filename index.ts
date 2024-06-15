#!/usr/bin/env node
import {program} from "commander";
import {parseYaml, readYaml} from "./src/configuration";

import {generateNames} from "./src/generator";
import * as path from "path";
import * as fs from "fs";
import {validateInput} from "./src/validator";
import {echoNames} from "./src/outputter";


program
    .option('-i, --inputs <values...>', "add inputs on the form key1=value1 key2=value2")
    .option('-c, --configFile <configFile>', "add a config file", "https://raw.githubusercontent.com/lars1974/node-name-generator/main/test.yaml")
    .option('-o, --outputFormat <outputFormat>', "yaml, json or properties")
    .option('-v, --version', "output the version number")
    .option('-f, --outputFile <file>', "file")
    .option('-s, --singleOutput <singleOutput>', "output single value to console")
    .option('-y, --echoYamlConfig', "show yaml config file")
    .description('Name generator based on a yaml config file')
    .action(generate)

function generate() {
    if(program.opts().version) readAndPrintVersion();

    let inputs = createInputMapFromArgs(program.opts().inputs);
    let yamlString = readYaml(program.opts().configFile)
    let yamlMap = parseYaml(yamlString);

    if(program.opts().echoYamlConfig) {
        console.log(yamlString);
        process.exit(0);
    }

    validateInput(yamlMap.inputs, Array.from(inputs.keys()));

    let generatedNamesMap = generateNames(inputs, yamlMap.outputs);

    echoNames(generatedNamesMap, program.opts().outputFormat, program.opts().outputFile, program.opts().singleOutput);
}

function createInputMapFromArgs(array: string[]): Map<string, string> {
    const map = new Map();

    if(array === undefined) return map;

    array.forEach(item => {
        const [key, value] = item.split('=');
        map.set(key, value);
    });
    return map;
}


function readAndPrintVersion() {
    // Define the path to the package.json file
    const packageJsonPath = path.resolve(__dirname, '..', 'package.json');

    // Read the package.json file
    fs.readFile(packageJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading package.json:', err);
            return;
        }

        // Parse the JSON data
        try {
            const packageJson = JSON.parse(data);
            const version = packageJson.version;

            // Print the version to the console
            console.log('Version:', version);
        } catch (parseError) {
            console.error('Error parsing package.json:', parseError);
        }
    });
}


program.parse();