
# React web worker for server rendering p.o.c

Proof of concept for offloading react server rendering to a thread.

There are two routes - each takes a `number` parameter for # of spans to render.

- `/server/:number` - this is the baseline, uses the current process

- `/webworker/:number` uses `webworker-threads` to create a thread to perform work on.

- `/workerFarm/:number` uses `worker-farm` to create child processes that do work

- `/workerPool/:number` uses `worker-pool` to create child processes that do work

- `/napajs/:number` uses `napajs` to create threads to work on

- `/worker-thread/:number` uses `worker threads` to create threads to work on.

## To start off...

```sh
npm i
npm run build && npm start
```

## benchmarks

```sh
cd scripts
./bensh.sh # this can take a while
```

Note that I don't do benches on `server` because everything else blows it out of the water.

### At the time of this writing

napajs is the clear winner. `webworker-threads` in a close second - but it has problems with crashing under lots of volume.

The various modules that defer to a `child_process` work better than running the rendering on the server, certainly.  But when compared to modules that drop into C and create a proper thread, they just don't scale as well.

(napajs continually stays under 1s, while child_process modules start to take 2/3s under heavy load)

## Todo

* thread doesn't support `require` and react-dom/server pulls in `require('stream')` in r.16.  I fixed this in the dirtiest way possible, creating a dummy class and overwriting the export to point at that.  todo: figure a way to fix this properly (somehow) and add benches for streamed rendering.

* make graphs make more sense - right now it's neigh impossible to read. Maybe isolate per elements/concurrency.

* find more threading modules and see if they work any better.

### Pretty Graph

![benchmark results](https://raw.githubusercontent.com/tswaters/react-thread-poc/master/results.png)
