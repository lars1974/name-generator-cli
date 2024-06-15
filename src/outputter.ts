import * as fs from 'fs';

export function echoNames(outputMap: Map<string, string>, format = 'json', file = undefined, singleOutput = undefined) {
    if(singleOutput) {
        console.log(outputMap.get(singleOutput));
        return;
    }

    let output = "";
    switch (format.toLowerCase()) {
        case 'json':
            output = JSON.stringify(Object.fromEntries(outputMap), null, 2);
            break;
        case 'yaml':
            outputMap.forEach((value, key) => {
                output = output + `${key}: "${value}"\n`;
            });
            break;
        case 'properties':
            outputMap.forEach((value, key) => {
                output = output + `${key}=${value}\n`;
            });
            break;
    }

    if(file !== undefined) {
        fs.writeFileSync(file, output);
        console.log(`output written to ${file}`);
        return;
    }
    console.log(output);
}

