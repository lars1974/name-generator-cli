import request from "sync-request";
import fs from "fs";
import yaml from "js-yaml";


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