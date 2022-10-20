import { run, bench, group } from 'mitata/src/cli.mjs';
import {HashMap} from "./../../lib/core/util.js"


const benchmark = (n, cb) => {
  const native = new HashMap()
  const polyfill = new HashMap(undefined, true)

  for (let i = 0; i < n; i++) {
    native.set('key-' + i, i);
    polyfill.set('key-' + i, i);
  }

  group(`n=${n}`, () => {
    bench("Native", () => {
      cb(native);
    })

    bench(`Polyfill`, () => {
      cb(polyfill);
    })
  })
}

// 1_000_000 there to demonstrate that it will trigger a v8 deoptimization 
// where the underlying dict enters hashmap move and makes enumeration slow
const runs = [8, 32, 64, 128, 1024, 8192, 200_000];

for(const run of runs) {
    benchmark(run, (map) => {
      map.each((k, v) => {
        return undefined
      })
    })
}

(async () => {
    await run({
    avg: true, // enable/disable avg column (default: true)
    json: false, // enable/disable json output (default: false)
    colors: true, // enable/disable colors (default: true)
    min_max: true, // enable/disable min/max column (default: true)
    collect: false, // enable/disable collecting returned values into an array during the benchmark (default: false)
    percentiles: true // enable/disable percentiles column (default: true)
    });
})();