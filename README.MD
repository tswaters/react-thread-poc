
# React web worker for server rendering p.o.c

Proof of concept for offloading react server rendering to a thread.

There are two routes - each takes a `number` parameter for # of spans to render.

- `/server/:number` - this is the baseline, uses the current process

- `/betterthread/:number` uses the `betterthread` to create a thread.

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

### At the time of this writing

using no threading is incredibly slow.

The various modules that defer to a `child_process` work better than running the rendering on the server, certainly.

c modules that dorp into proper threads (napajs, webworker-threads) outperforms the next fasted by a factor of 2 to 1

napajs wins because `webworker-threads` crashes under heavy load.

## Todo

* thread doesn't support `require` and react-dom/server pulls in `require('stream')` in r.16.  I fixed this in the dirtiest way possible, creating a dummy class and overwriting the export to point at that.  todo: figure a way to fix this properly (somehow) and add benches for streamed rendering.

* find more threading modules and see if they work any better.

### Pretty Graph

![benchmark results](https://raw.githubusercontent.com/tswaters/react-thread-poc/master/results.png)
