
# React web worker for server rendering p.o.c

Proof of concept for offloading react server rendering to a thread.

There are two routes - each takes a `number` parameter for # of spans to render.

- `/server/:number` - this is the benchmark, uses the current process

- `/thread/:number` uses `webworker-threads` to create a thread to perform work on.

## To start off...

```sh
npm i
npm run build && npm start
```

## On my (crappy) laptop

```sh
curl http://localhost:3000/server/500
curl http://localhost:3000/thread/500
```

Results in:

```sh
listening on 3000
thread (500) f3470fe3-fd4b-49e5-bf74-890d3a9d44fc: 21.094ms
server (500) 0692a6ff-4966-48b3-8bca-0f899f593a08: 266.075ms
```

Really!


## If you wanna benchmark...

Mostly here so I can copy/paste:

```sh
ab -k -c 100 -n 100 http://127.0.0.1:3000/
ab -k -c 100 -n 100 "http://127.0.0.1:3000/server/100"
ab -k -c 200 -n 100 "http://127.0.0.1:3000/thread/100"
```
