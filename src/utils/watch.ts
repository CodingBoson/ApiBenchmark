/**
 * Represents the result of a function execution, including its value and the elapsed time.
 *
 * @template T - The type of the value produced by the function.
 */
export interface TimedFunctionResult<T> {
    elapsed: number;
    value: T;
}

/**
 * Executes the provided function and measures the time taken to execute it.
 *
 * @typeParam T - The return type of the provided function.
 * @param fn - The function to execute.
 * @returns An object containing the elapsed time (in milliseconds) and the value returned by the function.
 */
export function runWithTimer<T>(fn: () => T): TimedFunctionResult<T> {
    const startTime = Date.now();

    const value = fn();

    const elapsed = Date.now() - startTime;

    return { elapsed, value };
}

/**
 * Executes an asynchronous function and measures the elapsed time of its execution.
 *
 * @typeParam T - The type of the result returned by the asynchronous function.
 * @param fn - A function that returns a Promise. This function is executed to obtain a value while measuring the time it takes to complete.
 * @returns A Promise that resolves to an object containing:
 *  - elapsed: The time in milliseconds the function took to execute.
 *  - value: The value returned by the asynchronous function.
 *
 * @example
 * ```typescript
 * const result = await runWithTimerAsync(async () => {
 *   // Some asynchronous operation
 *   return "Hello, World!";
 * });
 *
 * console.log(`Elapsed time: ${result.elapsed} ms, Value: ${result.value}`);
 * ```
 */
export async function runWithTimerAsync<T>(
    fn: () => Promise<T>
): Promise<TimedFunctionResult<T>> {
    const startTime = Date.now();

    const value = await fn();

    const elapsed = Date.now() - startTime;

    return { elapsed, value };
}
