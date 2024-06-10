
import {generateHashFromMapValues} from "../src/processor.js";
import * as assert from "assert";



    describe('processor tests', function () {
        it('generate hashcode', function () {
            const input = new Map();
            input.set('name1', 'value2');
            input.set('name2', 'value2');
            assert.strictEqual(generateHashFromMapValues(input), "32c70b05");
        });
    });




