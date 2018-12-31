#!/bin/bash

set -e

rm -Rf ../images
rm -Rf ./data

mkdir -p ../images
mkdir -p ./data

requests=100000
concurrency=1000
elements=1000

types=()
types+=('betterthread')
types+=('napajs')
types+=('worker-farm')
types+=('workerpool')
types+=('worker_threads')
types+=('server')
# types+=('webworker-threads')  disqualified; crashes process

for type in ${types[@]}; do
  echo "Running $type bench for $elements elements with $requests requested, $concurrency concurrency"
  ab -s 99999 -n $requests -c $concurrency -g "./data/${requests}_${concurrency}_${elements}_${type}.tsv" http://localhost:3000/$type/$elements
done

gnuplot -c ./plotme.gpi $requests $concurrency $elements
