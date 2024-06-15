import * as fs from 'fs';
import * as yaml from 'js-yaml';
import request from "sync-request";

const isUrl = (input: string): boolean => {
    try {
        new URL(input);
        return true;
    } catch (_) {
        return false;
    }
};

export const readYaml = (input: string): string => {
    if (isUrl(input)) {
        return request('GET', input).getBody('utf8');
    } else {
        return fs.readFileSync(input, 'utf8')
    }
};

export const parseYaml = (input: string): ModelRoot => {
    return yaml.load(input) as ModelRoot;
}

export class ModelOutput {
    name: string;
    pattern: string;
    postProcessors: string[];
    maxLength: number;

    constructor(name: string, pattern: string, postProcessors: string[], maxLength: number) {
        this.name = name;
        this.pattern = pattern;
        this.postProcessors = postProcessors;
        this.maxLength = maxLength;
    }
}

export class ModelRoot {
    inputs: string[];
    outputs: ModelOutput[];

    constructor(inputs: string[],  outputs: ModelOutput[]) {
        this.inputs = inputs;
        this.outputs = outputs;
    }
}