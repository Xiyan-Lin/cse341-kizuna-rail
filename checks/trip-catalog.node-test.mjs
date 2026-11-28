import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTrips, fetchTrips } from '../public/js/trips-catalog.js';
const sample = [
    { id: 'a', region: 'central', bestSeason: 'autumn' },
    { id: 'b', region: 'kansai', bestSeason: 'spring' },
    { id: 'c', region: 'central', bestSeason: 'spring' }
];
test('all trips remain visible without filters', () => assert.deepEqual(filterTrips(sample), sample));
test('region filter', () => assert.deepEqual(filterTrips(sample, 'central').map(x => x.id), ['a','c']));
test('season filter', () => assert.deepEqual(filterTrips(sample, 'all', 'spring').map(x => x.id), ['b','c']));
test('combined filters', () => assert.deepEqual(filterTrips(sample, 'central', 'spring').map(x => x.id), ['c']));
test('empty result', () => assert.deepEqual(filterTrips(sample, 'hokkaido'), []));
test('fetch uses JSON endpoint', async () => {
    const actual = await fetchTrips(async (url) => {
        assert.equal(url, '/api/trips');
        return { ok: true, json: async () => ({ trips: sample }) };
    });
    assert.deepEqual(actual, sample);
});
test('HTTP error is rejected', async () => {
    await assert.rejects(fetchTrips(async () => ({ ok: false, status: 500 })), /500/);
});
test('invalid payload is rejected', async () => {
    await assert.rejects(fetchTrips(async () => ({ ok: true, json: async () => ({}) })), /Invalid trips response/);
});
