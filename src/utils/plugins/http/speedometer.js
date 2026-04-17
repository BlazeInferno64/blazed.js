// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 13/07/2025

'use strict';

/**
 * Calculate data flow maximum rate
 * @param {Number} [samplesCount=10] - The number of samples to keep track of.
 * @param {Number} [min=1000] - The minimum time (in milliseconds) before calculating speed.
 * @returns {Function} - A function that takes the length of the data chunk and returns the speed.
 */

const speedoMeter = (samplesCount, min) => {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;

    min = min !== undefined ? min : 1000;

    return function push(chunkLength) {
        const now = Date.now();

        const startedAt = timestamps[tail];

        if (!firstSampleTS) {
            firstSampleTS = now;
        }

        bytes[head] = chunkLength;
        timestamps[head] = now;

        let i = tail;
        let bytesCount = 0;

        while (i !== head) {
            bytesCount += bytes[i++];
            i = i % samplesCount;
        }

        head = (head + 1) % samplesCount;

        if (head === tail) {
            tail = (tail + 1) % samplesCount;
        }

        if (now - firstSampleTS < min) {
            return;
        }

        const passed = startedAt && now - startedAt;

        return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
    };
}

module.exports = {
    speedoMeter
}