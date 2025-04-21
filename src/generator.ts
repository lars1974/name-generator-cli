import {ConfigOutput} from "./configuration";

export function generateHashFromMapValues(input: Map<string, string>) {
    let str = "";

    input.forEach((value) => { str += value; });

    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
}

export function generateNames(inputs: Map<string, string>, outputs: ConfigOutput[]): Map<string, string> {
    inputs.set("hash", generateHashFromMapValues(inputs))
    let map = new Map<string, string>();
    outputs.forEach(outputConfig => { map.set(outputConfig.name, generateName(inputs, outputConfig)); });
    return map;
}

export function generateName(inputs: Map<string, string>, output: ConfigOutput): string {
    let templateRaw = getTemplate(inputs, output);
    console.log("template FOUND "+templateRaw)
    let trimmedLengthMap = trimStringToMaxLength(getTokenLengthMap(templateRaw), inputs);
    let template = removeNumbersInCurlyBraces(templateRaw)


    let generatedName = fillValuesInTemplate(trimmedLengthMap, template);

    if (generatedName.length > output.maxLength) {
        trimmedLengthMap = truncateLongestString(trimmedLengthMap, generatedName.length - output.maxLength)
        fillValuesInTemplate(trimmedLengthMap, template);
    }

    return postProcess(generatedName, output.postProcessors);
}

export function getTemplate(inputMap: Map<string,string>, output: ConfigOutput): string {
    console.log(output.conditionalTemplates)
    if(output.conditionalTemplates != undefined && output.conditionalTemplates.length > 0) {
        for(const conditionalTemplate of output.conditionalTemplates) {
            console.log(conditionalTemplate);
            console.log(conditionalTemplate.template)
            const [inputField, condition, value] = conditionalTemplate.condition.split(' ');
            console.log(conditionalTemplate.template)
            if(checkCondition(inputMap.get(inputField)! , condition, value)) {
                console.log("BINGO"+conditionalTemplate.template)
                return conditionalTemplate.template;
            }
        }
        console.log("TEMPALRff "+output.template)
        return  output.template;
    }
    return "template"
}

export function checkCondition(input: string, condition: string, value: string): boolean {
    console.log("cond " + input + " "+  condition +" "+ value);
    switch (condition.toLowerCase()) {
        case 'equals':
            console.log("eq " + condition);
            return (input === value);
        case 'contains':
            return (input.includes(value));
        default:
            console.log("Invalid condition: " + condition);
            return false
    }
}

export function fillValuesInTemplate(trimmedMap: Map<string, string>, template: string) : string {
    return template.replace(/{(\w+)}/g, function (match, key) {
        return trimmedMap.get(key) || match;
    });
}

export function getTokenLengthMap(template: string): Map<string, number> {
    const map: Map<string, number> = new Map();
    const regex = /{(\w+)(?::(\d+))?}/g;
    const defaultValue = 250;
    let match;

    while ((match = regex.exec(template)) !== null) {
        const key = match[1];
        const value = match[2] ? parseInt(match[2], 10) : defaultValue;
        map.set(key, value);
    }
    return map;
}

export function trimStringToMaxLength(lengthMap: Map<string, number>, valueMap: Map<string, string>) {
    let shortenedValueMap = new Map();

    lengthMap.forEach((value, key) => {
        if (lengthMap.has(key) && valueMap.has(key)) {
            shortenedValueMap.set(key, valueMap.get(key)!!.substring(0, lengthMap.get(key)));
        }
    })
    return shortenedValueMap;
}

export function removeNumbersInCurlyBraces(template: string): string {
    return template.replace(/{([^:\d}]+):?\d*}/g, '{$1}');
}

export function postProcess(value: string, postProcessors: string[]): string {
    let result = value;
    postProcessors.forEach(postProcessor => {
        switch (postProcessor.toLowerCase()) {
            case 'uppercase':
                result = result.toUpperCase();
                break;
            case 'lowercase':
                result = result.toLowerCase();
                break;
            case 'universal':
                result = result.replace(/[^a-zA-Z0-9]/g, '-');
                break;
        }
    });
    return result;
}

export function truncateLongestString(map: Map<string, string>, reduce: number) {
    let longestKey = '';
    let longestValue = '';
    map.forEach((value, key) => {
        if (value.length > longestValue.length) {
            longestKey = key;
            longestValue = value;
        }
    });
    map.set(longestKey, longestValue.substring(0, longestValue.length - reduce));
    return map;
}