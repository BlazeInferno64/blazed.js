// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 01/01/2025

// Note:- This is just a simple test file for 'blazed.js'
//        You can run this file by doing 'npm test' in your terminal

// Requiring the necessary libraries
const blazed = require("../index");
const { describe, test, expect } = require("@jest/globals");

/**
 * Benchmark test for blazed.fetch()
 * Measures performance and ensures requests succeed
 */
async function testFetch() {
    const url = "https://jsonplaceholder.typicode.com/posts/1";
    const iterations = 20;   // Total requests
    const concurrency = 5;   // Parallel requests
    const warmup = 5;        // Warm-up runs

    // Warm-up (ignored)
    for (let i = 0; i < warmup; i++) {
        await blazed.fetch(url);
    }

    const latencies = [];
    let success = 0;
    let failed = 0;

    const startTotal = process.hrtime.bigint();

    for (let i = 0; i < iterations; i += concurrency) {
        const batch = [];

        for (let j = 0; j < concurrency && i + j < iterations; j++) {
            batch.push((async () => {
                const start = process.hrtime.bigint();
                try {
                    const res = await blazed.fetch(url);
                    await res.text(); // consume body

                    const end = process.hrtime.bigint();
                    const durationMs = Number(end - start) / 1e6;
                    latencies.push(durationMs);
                    success++;
                } catch (err) {
                    failed++;
                }
            })());
        }

        await Promise.all(batch);
    }

    const endTotal = process.hrtime.bigint();
    const totalMs = Number(endTotal - startTotal) / 1e6;

    // Basic assertions for Jest
    expect(success).toBeGreaterThan(0);
    expect(failed).toBe(0);
    expect(latencies.length).toBe(success);

    // Optional: log benchmark results
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const min = Math.min(...latencies);
    const max = Math.max(...latencies);
    const rps = (iterations / (totalMs / 1000)).toFixed(2);

    console.log("\n--- blazed.fetch() Benchmark ---");
    console.log(`URL: ${url}`);
    console.log(`Total Requests: ${iterations}`);
    console.log(`Concurrency: ${concurrency}`);
    console.log(`Total Time: ${totalMs.toFixed(2)} ms`);
    console.log(`Requests/sec: ${rps}`);
    console.log(`Min Latency: ${min.toFixed(2)} ms`);
    console.log(`Avg Latency: ${avg.toFixed(2)} ms`);
    console.log(`Max Latency: ${max.toFixed(2)} ms`);
    console.log("--------------------------------\n");
}

describe('HTTP requests function', () => {
    test("Makes an HTTP GET request to Google's homepage", async () => {
        const response = await blazed.get("https://www.google.com");
        expect(response.status).toBe(200);
        return expect(response.data).toBeTruthy();
    });

    test("Makes an HTTP POST request to JSON placeholder", async () => {
        const postData = {
            title: 'foo',
            body: 'bar',
            userId: 1
        };
        const response = await blazed.post("https://jsonplaceholder.typicode.com/posts", postData);
        return expect(response.data).toBeTruthy();
    });

    test("Resolves Google's DNS", async () => {
        const result = await blazed.resolve_dns({
            url: "https://www.google.com"
        });
        return expect(result).toBeTruthy();
    });

    test("Parses an URL", async () => {
        const result = await blazed.parse_url("https://example.com/path?a=1&b=2");
        return expect(result).toBeTruthy();
    });

    /**
        * Benchmark Test
        * Note: This is a performance test, not a strict unit test.
        * Can be skipped in CI if needed.
    */
    test("Benchmark: blazed.fetch() performance", async () => {
        await testFetch();
    });

});