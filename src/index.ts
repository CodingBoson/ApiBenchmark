import { ApiTest } from "./models";
import { runWithTimerAsync } from "./utils/watch";
import { sleep } from "./utils/tasks";
import * as fs from "fs";

(async () => {
    const args = parseArgs();
    if (!args) return;

    const test: ApiTest = parseTest(args.path);
    const url = `${test.host}/${test.path}`;
    const { method, headers, body } = test.request;

    const elapsedTimes: number[] = [];

    for (let i = 0; i < args.count; i++) {
        const result = await runWithTimerAsync(async () => {
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(body),
            });
            const responseText = await response.text();
            if (args.verbose) {
                console.log("\x1b[32m[Response]\x1b[0m " + responseText);
            }
            return response.statusText;
        });

        elapsedTimes.push(result.elapsed);

        const color = result.value === "OK" ? "\x1b[32m" : "\x1b[31m";
        console.log(
            `[${color}Status: ${result.value}\x1b[0m] ${i + 1}/${
                args.count
            }: Elapsed time: ${result.elapsed}ms`
        );

        await sleep(1000);
    }

    const totalElapsed = elapsedTimes.reduce((sum, time) => sum + time, 0);
    const averageElapsed = totalElapsed / elapsedTimes.length;
    console.log(`\r\nAverage elapsed time: ${averageElapsed.toFixed(2)}ms`);
})().catch(console.error);

function parseTest(path: string): ApiTest {
    const rawTest = fs.readFileSync(path, "utf-8");
    return JSON.parse(rawTest);
}

function parseArgs(): { path: string; count: number; verbose: boolean } | null {
    const userArgs = process.argv.slice(2);
    if (userArgs.length < 2) {
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
    const verbose = userArgs.length > 2 ? parseBoolean(userArgs[2]) : false;

    return { path, count, verbose };
}

function parseBoolean(arg: string): boolean {
    const normalized = arg.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") {
        return true;
    }
    if (normalized === "false" || normalized === "0") {
        return false;
    }
    // Return false for any unrecognized value or alternatively throw an error.
    console.error(
        `WARNING: Unable to parse boolean value from "${arg}". Defaulting to false.`
    );
    return false;
}
