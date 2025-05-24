/**
 * Represents the configuration for an API test.
 *
 * @remarks
 * This interface defines the structure for setting up an API test including the API's host, endpoint path,
 * and the necessary details for making the HTTP request.
 *
 * @property name - A descriptive name for the API test.
 * @property host - The host address of the API.
 * @property path - The specific path of the API endpoint.
 * @property request - An object describing the HTTP request.
 * @property request.method - The HTTP method to be used (e.g., GET, POST).
 * @property request.headers - Optional HTTP headers provided as key/value pairs.
 * @property request.body - Optional body payload for the request; its type is flexible.
 */
export interface ApiTest {
    name: string,
    host: string,
    path: string,
    request: {
        method: string,
        headers?: Record<string, string>,
        body?: any
    }
}