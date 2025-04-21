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

export const parseYaml = (input: string): ConfigRoot => {
    console.dir(yaml.load(input) as ConfigRoot);
    return yaml.load(input) as ConfigRoot;
}

export class ConfigOutput {
    name: string;
    template: string;
    postProcessors: string[];
    maxLength: number;
    conditionalTemplates: ConfigConditionalTemplate[]

    constructor(name: string, template: string, postProcessors: string[], maxLength: number, conditionalTemplates: ConfigConditionalTemplate[]) {
        this.name = name;
        this.template = template;
        this.postProcessors = postProcessors;
        this.maxLength = maxLength;
        this.conditionalTemplates = conditionalTemplates;
    }
}

export class ConfigConditionalTemplate {
    condition: string;
    template: string;

    constructor(condition: string, template: string) {
        this.condition = condition;
        this.template = template;
    }
}

export class ConfigRoot {
    inputs: string[];
    outputs: ConfigOutput[];

    constructor(inputs: string[],  outputs: ConfigOutput[]) {
        this.inputs = inputs;
        this.outputs = outputs;
    }
}