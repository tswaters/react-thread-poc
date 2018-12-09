#!/bin/bash

set -e

rm -Rf ../images
rm -Rf ./data

mkdir -p ../images
mkdir -p ./data

requests=10000

types=()
types+=('napajs')
types+=('worker-farm')
types+=('workerpool')
types+=('worker_threads')
#types+=('webworker-threads')  disqualified; crashes process

function plotit () {

  concurrency=$1
  elements=$2
  labelY=$[$requests + 5]

  for type in ${types[@]}; do
    echo "Running $type bench for $elements elements with $requests requested, $concurrency concurrency"
    ab -s 99999 -n $requests -c $concurrency -g "./data/gnuplot_${type}_${requests}_${concurrency}_${elements}.tsv" http://localhost:3000/$type/$elements 2>&1 > /dev/null
  done

  echo "
  set terminal png size 2000,2000
  set output '../images/benchmark_${requests}_${concurrency}_${elements}.png'
  set title 'Requests: ${requests}; Concurrency: ${concurrency}; Elements: ${elements}'
  set datafile separator '\t'
  set size 0.9,1
  set grid y
  set xlabel 'request #'
  set ylabel 'time (ms)'" > ./data/plotme

  for type in ${types[@]}; do
    if [ "$type" == "${types[0]}" ]; then
      prefix="plot"
    else
      prefix=","
    fi
    echo -e $"$prefix \"< tail -n +2 ./data/gnuplot_${type}_${requests}_${concurrency}_${elements}.tsv | sort -t '	' -k 2\" using 5 smooth sbezier with lines title '$type' \\" >> ./data/plotme
  done

  gnuplot ./data/plotme

}

#for concurrency in `seq 250 250 1000`; do
#  for elements in `seq 250 250 1000`; do
    plotit 1000 1000
#  done
#done
