# koa2-bunyan-server
This is a demo server based on [koa2](https://www.npmjs.com/package/koa) and [bunyan](https://www.npmjs.com/package/bunyan). It shows how we do structured logging at [Snyk](https://snyk.io).

## How
Structured logging on request handling applies the following properties:
- Logs are printed to stdout in single-line JSON form.
- Logs include standard fields imposed by bunyan (i.e. `level`).
- Requests are logged upon arrival and response.
- All logs for a specific request share an identical `requestId`.
- Errors on responses are logged with their stack trace.

## But why, really?
We use 90% identical code in our microservices at [Snyk](https://snyk.io). It is a result of many iterations by several authors, aimed at making our services easy to monitor, observe, and generally understand.

## Use it yourself
Clone and run `npm install`.

To run locally and get human-readable logs, run `node . | ./node_modules/.bin/bunyan`.

From a separate shell, run the following commands and observe the server logs:
```
curl localhost:8000/?duration=555
curl localhost:8000/?duration=123\&error=yesPlease
```

Your output will be similar to:
```
[2018-01-27T15:41:38.250Z]  INFO: demo-service/57906 on your-host: Server started (startupDurationMs=121, port=8000)
[2018-01-27T15:41:41.283Z]  INFO: demo-service/57906 on your-host: Handling request (requestId=828934e0-e092-40a9-8de3-c7a6e37be70a, originalUrl=/?duration=555, method=GET)
[2018-01-27T15:41:41.283Z]  INFO: demo-service/57906 on your-host: Going to sleep for a while (requestId=828934e0-e092-40a9-8de3-c7a6e37be70a, sleepDurationInMs=555)
[2018-01-27T15:41:41.846Z]  INFO: demo-service/57906 on your-host: Woke up! (requestId=828934e0-e092-40a9-8de3-c7a6e37be70a, sleepDurationInMs=555)
[2018-01-27T15:41:41.847Z]  INFO: demo-service/57906 on your-host: Reply sent (requestId=828934e0-e092-40a9-8de3-c7a6e37be70a, originalUrl=/?duration=555, method=GET, duration=566, status=200)
[2018-01-27T15:41:41.870Z]  INFO: demo-service/57906 on your-host: Handling request (requestId=59ac8cd1-6246-4a35-9ee6-4928fc97c457, originalUrl=/?duration=123&error=yesPlease, method=GET)
[2018-01-27T15:41:41.870Z]  INFO: demo-service/57906 on your-host: Going to sleep for a while (requestId=59ac8cd1-6246-4a35-9ee6-4928fc97c457, sleepDurationInMs=123)
[2018-01-27T15:41:41.998Z]  INFO: demo-service/57906 on your-host: Woke up! (requestId=59ac8cd1-6246-4a35-9ee6-4928fc97c457, sleepDurationInMs=123)
[2018-01-27T15:41:41.999Z] ERROR: demo-service/57906 on your-host: Reply sent (requestId=59ac8cd1-6246-4a35-9ee6-4928fc97c457, originalUrl=/?duration=123&error=yesPlease, method=GET, duration=130, status=501)
    --
    error: {
      "name": "NotImplementedError",
      "message": "BOOM!",
      "stack": "NotImplementedError: BOOM!\n    at module.exports (.../koa2-bunyan-server/src/controllers/sleep.js:15:17)\n    at <anonymous>",
      "sleptInMs": 123
    }
```

## License
See `LICENSE`

## Further reading
Push your k8s pods' JSON logs to a managed ELK stack with [fluentd-logzio-kubernetes](https://github.com/snyk/fluentd-logzio-kubernetes)
