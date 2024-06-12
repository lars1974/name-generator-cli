#! /usr/bin/env node

import {program} from 'commander'
import {generateNames} from './src/processor.js';
import {echoNames} from "./src/outputter.js";
import {dirname} from "path";
import {fileURLToPath} from "url";
import fs from "fs";
import {readYaml, yamlToMap} from "./src/configreader.js";
import {validateInput} from "./src/validator.js";

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

function generate()  {
    if(program.opts().version) echoVersion();

    let inputs = createInputMapFromArgs(program.opts().inputs);
    let yamlString = readYaml(program.opts().configFile)
    let yamlMap = yamlToMap(yamlString);

    if(program.opts().echoYamlConfig) {
        console.log(yamlString);
        process.exit(0);
    }

    validateInput(yamlMap.get("inputs"), inputs.keys());

    let generatedNamesMap = generateNames(yamlMap.get("outputs"), inputs);

    echoNames(generatedNamesMap, program.opts().outputFormat, program.opts().outputFile, program.opts().singleOutput);
}

function createInputMapFromArgs(array)  {
    const map = new Map();

    array.forEach(item => {
        const [key, value] = item.split('=');
        map.set(key, value);
    });
    return map;
}

function echoVersion() {
    let data = fs.readFileSync(`${dirname(fileURLToPath(import.meta.url))}/package.json`, 'utf8');

    console.log('Version:', JSON.parse(data).version);
    process.exit(0);
}

program.parse()