export function generateNames(outputsConfigs, inputs){
    const outputMap = new Map();
    for (let outputsConfig of outputsConfigs) {
        outputMap.set(outputsConfig.name, generateName(outputsConfig, inputs));
    }
    return outputMap
}

export function generateName(outputConfig, inputs) {
    let lengthMap = createLengthMapFromTemplate(outputConfig.pattern)
    let template = removeNumbersInCurlyBraces(outputConfig.pattern)

    inputs.set("hash", generateHashFromMapValues(inputs))

    let shortenedMap = trimStringToMaxLength(lengthMap, inputs)

    let filledTemplate = fillValuesInTemplate(template, shortenedMap)

    if (filledTemplate.length > outputConfig.maxLength) {
        shortenedMap = truncateLongestString(shortenedMap, filledTemplate.length - outputConfig.maxLength)
        filledTemplate = fillValuesInTemplate(template, shortenedMap)
    }
    return postProcess(filledTemplate, outputConfig)
}

export function generateHashFromMapValues(input) {
    let str = "";
    for (let value of input.values()) {
        str += value;
    }

    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
}

export function createLengthMapFromTemplate(template) {
    const map = new Map();
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

function postProcess(value, outputConfig) {
    let result = value;
    outputConfig.postProcessors.forEach(postProcessor => {
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

export function removeNumbersInCurlyBraces(input) {
    return input.replace(/{([^:\d}]+):?\d*}/g, '{$1}');
}
function trimStringToMaxLength(lengthMap, valueMap) {
    let shortenedValueMap = new Map();

    for (let key of lengthMap.keys()) {
        if (lengthMap.has(key) && valueMap.has(key)) {
            shortenedValueMap.set(key, valueMap.get(key).substring(0, lengthMap.get(key)));
        }
    }
    return shortenedValueMap;
}

function truncateLongestString(map, reduce) {
    let longestKey = '';
    let longestValue = '';
    for (const [key, value] of map) {
        if (value.length > longestValue.length) {
            longestKey = key;
            longestValue = value;
        }
    }
    map.set(longestKey, longestValue.substring(0, longestValue.length - reduce));
    return map;
}

function fillValuesInTemplate(template, map) {
    return template.replace(/{(\w+)}/g, function (match, key) {
        return map.get(key) || match;
    });
}