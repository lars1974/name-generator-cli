import {describe, expect, test} from '@jest/globals';
import {generateHashFromMapValues, getTokenLengthMap, truncateLongestString} from '../src/generator';

describe('sum module', () => {
    test('tokenLengthMap', () => {
        let template = "test{key1:10}-{key2:20}test{key3}test";
        let map = getTokenLengthMap(template);
        expect(map.get('key1')).toBe(10);
        expect(map.get('key2')).toBe(20);
        expect(map.get('key3')).toBe(250);
    });

    test( 'truncateLongestString', () => {
        let map : Map<string, string> = new Map<string, string>();
        map.set('key1', 'longestString');
        map.set('key2', 'shortString');
        map.set('key3', 'shortS');

        let result = truncateLongestString(map, 5);
        expect(result.get('key1')).toBe('longestS');
        expect(result.get('key2')).toBe('shortString');
        expect(result.get('key3')).toBe('shortS');
    });

    test('generateHashFromMapValues', () => {
        let map : Map<string, string> = new Map<string, string>();
        map.set('key1', 'value1');
        expect(generateHashFromMapValues(map)).toBe("7598be3f");
    });
});