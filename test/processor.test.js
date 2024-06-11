
import {createLengthMapFromTemplate, generateHashFromMapValues} from "../src/processor.js";
import * as assert from "assert";



    describe('processor tests', function () {
        it('generate hashcode', function () {
            const input = new Map();
            input.set('name1', 'value2');
            input.set('name2', 'value2');
            assert.strictEqual(generateHashFromMapValues(input), "32c70b05");
        });

        it('create length map from template', function () {
            const map = createLengthMapFromTemplate("{branch:100}-{hash:4}-{other}")
            assert.strictEqual(map.get("branch"), 100);
            assert.strictEqual(map.get("hash"), 4);
            assert.strictEqual(map.get("other"), 250);
        });


    });




