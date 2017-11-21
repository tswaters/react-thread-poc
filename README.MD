
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

## On my (crappy) laptop (node@8.8.1)

```sh
curl http://localhost:3000/server/500
curl http://localhost:3000/thread/500
```

Results in:

```sh
listening on 3000
thread (500) f3470fe3-fd4b-49e5-bf74-890d3a9d44fc: 21.094ms
server (500) 0692a6ff-4966-48b3-8bca-0f899f593a08: 266.075ms  # REALLY!
```

### I updated to React16 and:

*(react 16)* (less atrocious, but still...):
```sh
thread (500) b2f04135-5bb0-4250-998b-a69c007e9ca1: 0.948ms
server (500) d17dc3a8-7fca-4a65-b447-d419089fc0bf: 30.740ms
```

***note***: thread doesn't support `require` and react-dom/server pulls in `require('stream')` in r.16.  I fixed this in the dirtiest way possible, creating a dummy class and overwriting the export to point at that.  todo: figure a way to fix this properly (somehow) and add benches for streamed rendering.

## If you wanna benchmark...

```sh
./scripts/bench.sh
```

Then check out `./images`

I ran this myself (again on crappy laptop) and threads continually outperformed the server.

Thoughts:

* The only one that got close was 100 concurrent requests with 10 elements.  So, it would be best to check the number of elements you are rendering - if it is a small amount this may not help you.
* The largest discrepency by far was 1000 elements with 100 concurrent users.  server rendering took ~1.5s to come back after the first 200 requests (!!!) while the thread remained at < 200ms

