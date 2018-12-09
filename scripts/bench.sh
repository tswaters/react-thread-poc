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
  ab -v 4 -s 99999 -n $requests -c $concurrency -g "./data/2_${type}.tsv" http://localhost:3000/$type/$elements > out.log
done

gnuplot ./plotme.gpi
