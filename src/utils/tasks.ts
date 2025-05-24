/**
 * Retries the given asynchronous function until it succeeds or the maximum number of attempts is reached.
 *
 * @template T - The type of the value returned by the function.
 * @param fn - An asynchronous function that will be executed. If it throws an error, the retry logic will be triggered.
 * @param maxTries - The maximum number of attempts to run the function before failing.
 * @param retryDelay - Optional delay in milliseconds between retries.
 * @param onFailed - Optional asynchronous function that is called if all attempts fail.
 * @returns A promise that resolves with the value returned by the function if it eventually succeeds.
 * @throws Will throw an error if the function does not succeed within the maximum number of attempts and no onFailed callback is provided.
 */
export async function retry<T>({
    fn,
    maxTries,
    retryDelay,
    onFailed,
}: {
    fn: () => Promise<T>;
    maxTries: number;
    retryDelay?: number;
    onFailed?: () => Promise<T>;
}): Promise<T> {
    let tries = 0;

    while (tries < maxTries) {
        try {
            return await fn();
        } catch (e) {
            console.warn(`Retry ${tries + 1} failed 😬`);

            tries++;

            if (tries >= maxTries) {
                if (onFailed) {
                    return await onFailed();
                }

                throw e;
            }
        }

        if (retryDelay) {
            console.log(
                `😩⏳ Waiting for ${retryDelay / 1000}secs before retrying...`
            );

            await sleep(retryDelay);
        }
    }

    throw new Error("Unreachable code");
}

/**
 * Pauses the execution of an asynchronous function for a specified duration.
 *
 * @param ms - The number of milliseconds to sleep before resolving the promise.
 * @returns A promise that resolves after the specified duration.
 */
export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
