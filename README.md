# ApiBenchmark

Benchmark API performance by sending custom HTTP requests defined in a JSON configuration.

## Installation

Ensure Bun is installed. If it's not, install it with:
```bash
npm install -g bun
```

Clone the repository and install dependencies:
```bash
git clone https://github.com/CodingBoson/ApiBenchmark.git
cd ApiBenchmark
bun install
```

## Usage

Run the benchmark with:
```bash
bun start ./examples/test.json 10
```

## API Test Example

Below is an example configuration:
```json
{
    "name": "My Benchmark",
    "host": "https://myhost.com",
    "path": "api/example",
    "request": {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {
            "userId": 1
        }
    }
}
```
