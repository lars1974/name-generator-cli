import request from "sync-request";
import fs from "fs";
import yaml from "js-yaml";


export function readYaml(input) {
    try {
        let content;

        if (isValidUrl(input)) {
            content = request('GET', input).getBody('utf8');
        } else {
            content = fs.readFileSync(input, 'utf8');
        }

        return content;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export function yamlToMap(yamlString) {
    return new Map(Object.entries(yaml.load(yamlString)));
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}