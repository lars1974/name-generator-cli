#! /usr/bin/env node

import {program} from 'commander'
import chalk from "chalk";


import { readYamlFileToMap, generateName} from './processor.js';

program
    .option('-i, --inputs <values...>', "add inputs on the form key1=value1 key2=value2")
    .option('-f, --configFile <configFile>', "add a config file")
    .description('List all the TODO tasks')
    .action(generate)

function generate()  {
    let inputs = createInputMapFromArgs(program.opts().inputs);

    let yaml = readYamlFileToMap("./test.yaml")

    let outputsConfig = yaml.get("outputs");

    for (let output of outputsConfig) {
        console.log(output.name+"="+generateName(output, inputs));
    }
}

function createInputMapFromArgs(array)  {
    const map = new Map();

    array.forEach(item => {
        const [key, value] = item.split('=');
        map.set(key, value);
    });
    return map;
}

program.parse()