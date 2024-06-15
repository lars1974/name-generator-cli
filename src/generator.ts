import {ModelOutput} from "./configuration";

export function generateHashFromMapValues(input: Map<string, string>) {
    let str = "";

    input.forEach((value) => {
        str += value;
    });

    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
}

export function generateNames(inputs: Map<string, string>, outputs: ModelOutput[]): Map<string, string> {
   let map = new Map<string, string>();
    outputs.forEach(outputConfig => {
        map.set(outputConfig.name, generateName(inputs, outputConfig));
    });
    return map;
}

export function generateName(inputs: Map<string, string>, output: ModelOutput): string {

    inputs.set("hash", generateHashFromMapValues(inputs))


    let filledTemplate = fillValuesInTemplate(inputs, output)

      return postProcess(filledTemplate, output.postProcessors)
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

export function fillValuesInTemplate(inputs: Map<string, string>, output: ModelOutput) : string {
    let trinMao = trimStringToMaxLength(getTokenLengthMap(output.pattern), inputs);
    let template = removeNumbersInCurlyBraces(output.pattern)

    let generatedName = template.replace(/{(\w+)}/g, function (match, key) {
        return trinMao.get(key) || match;
    });

    if (generatedName.length > output.maxLength) {
        trinMao = truncateLongestString(trinMao, generatedName.length - output.maxLength)
        generatedName = template.replace(/{(\w+)}/g, function (match, key) {
            return trinMao.get(key) || match;
        });
    }

    return postProcess(generatedName, ['uppercase', 'lowercase', 'universal']);
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