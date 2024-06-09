import fs from 'fs'
import yaml from 'js-yaml'
import request from 'sync-request';

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



export function removeNumbersInCurlyBraces(input) {
    const regex = /{([^:\d}]+):?\d*}/g;

    return input.replace(regex, '{$1}');
}

export function generateName(outputConfig, inputs) {
    let lengthMap = createLengthMapFromTemplate(outputConfig.pattern)
    let template = removeNumbersInCurlyBraces(outputConfig.pattern)

    inputs.set("hash", generateHashFromMapValues(inputs))

    let shortenedMap = trimStringToMaxLength(lengthMap, inputs)

    let filledTemplate = fillValuesInTemplate(template, shortenedMap)

    if (filledTemplate.length <= outputConfig.maxLength) {
        return filledTemplate
    } else {
        shortenedMap = truncateLongestString(shortenedMap, filledTemplate.length - outputConfig.maxLength)
        return fillValuesInTemplate(template, shortenedMap)
    }
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

export function readYamlFileToMap(input) {
    try {
        let content;

        if (isValidUrl(input)) {
            content = request('GET', input).getBody();
        } else {
            content = fs.readFileSync(input, 'utf8');
        }

        return new Map(Object.entries(yaml.load(content)));
    } catch (e) {
        console.log(e);
        return null;
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}