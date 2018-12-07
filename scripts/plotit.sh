#!/bin/bash

set -e

types=(napajs workerFarm workerPool workerThread)

number=$1
concurrency=$2
N=$3

min=0
max=1000
step=250
labelY=$[$1 + 5]

for type in ${types[@]}; do
  echo "Running $type bench for $N elements with $1 requested, $2 concurrency"
  ab -s 99999 -n $1 -c $2 -g "./data/gnuplot_${type}_$1_$2_${N}.tsv" http://localhost:3000/$type/$N > /dev/null
done

echo "
set terminal png size 2000,2000
set output '../images/benchmark_${1}_${2}_${N}.png'
set title 'Requests: ${1}; Concurrency: ${2}; Elements: ${N}'
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
  echo -e $"$prefix \"< tail -n +2 ./data/gnuplot_${type}_$1_$2_${N}.tsv | sort -t '	' -k 2\" using 5 smooth sbezier with lines title '$type' \\" >> ./data/plotme
done

gnuplot ./data/plotme

