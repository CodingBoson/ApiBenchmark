import { ApiTest } from "./models";
import { runWithTimerAsync } from "./utils/watch";
import { sleep } from "./utils/tasks";
import * as fs from "fs";

/**
 * Main entry point.
 * Reads input arguments, loads the API test configuration, and then runs the API test repeatedly.
 */
(async () => {
    // Parse command-line arguments.
    const args = parseArgs();
    if (!args) {
        // Arguments were invalid or missing.
        return;
    }

    const { path, count } = args;
    // Load the API test configuration from the specified file.
    const test: ApiTest = parseTest(path);

    // Construct the full URL for the API request.
    const url = `${test.host}/${test.path}`;
    const request = test.request;

    const elapsedTimes: number[] = [];

    // Run the API test repeatedly based on the given count.
    for (let i = 0; i < count; i++) {
        const result = await runWithTimerAsync(async () => {
            const response = await fetch(url, {
                method: request.method,
                headers: request.headers,
                body: JSON.stringify(request.body),
            });

            // Read the entire response.
            const responseText = await response.text();

            if (args.verbose) {
                console.log("\x1b[32m[Response]\x1b[0m " + responseText);
            }

            return response.statusText;
        });

        elapsedTimes.push(result.elapsed);

        const color = result.value == "OK" ? "\x1b[32m" : "\x1b[31m";
        console.log(
            `[${color}Status: ${result.value}\x1b[0m] ${
                i + 1
            }/${count}: Elapsed time: ${result.elapsed}ms`
        );

        // Wait for 1 second before sending the next request.
        await sleep(1000);
    }

    const totalElapsed = elapsedTimes.reduce((sum, time) => sum + time, 0);
    const averageElapsed = totalElapsed / elapsedTimes.length;

    console.log(`Average elapsed time: ${averageElapsed.toFixed(2)}ms`);
})().catch(console.error);

/**
 * Reads a JSON test configuration file and parses it as an ApiTest.
 * @param path - File system path to the test JSON file.
 * @returns An ApiTest object.
 */
function parseTest(path: string): ApiTest {
    const rawTest = fs.readFileSync(path, "utf-8");
    return JSON.parse(rawTest);
}

/**
 * Parses and validates the command-line arguments.
 * Expects two arguments after the script name: a path to a JSON file and a request count.
 * @returns An object with the file path and count; or null if the arguments are invalid.
 */
function parseArgs(): { path: string; count: number; verbose: boolean } | null {
    const REQUIRED_ARGS = 2; // Expected arguments after the executable and script.
    // process.argv[0] = node executable, process.argv[1] = script file
    const userArgs = process.argv.slice(2);

    if (userArgs.length < REQUIRED_ARGS) {
        console.error(
            "ERROR: Missing arguments.\n\nUsage:\n  bun start <path/to/test.json> <count:Number>\n\nExample:\n  bun start ./examples/test.json 10"
        );
        return null;
    }

    const path = userArgs[0];
    const count = Number.parseInt(userArgs[1], 10);
    if (isNaN(count) || count <= 0) {
        console.error("ERROR: Count must be a positive number.");
        return null;
    }

    let verbose = false;
    if (userArgs.length > 2) {
        verbose = userArgs[2] == "true" ? true : false;
    }

    return { path, count, verbose };
}
