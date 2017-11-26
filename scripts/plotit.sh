#!/bin/bash

echo "
set terminal png size 1024,768
set output '../images/benchmark_${1}_${2}.png'
set title 'Benchmark: ${1} ${2}'
set datafile separator '\t'
set size 0.9,1
set grid y
set key off
set xlabel 'request #'
set ylabel 'time (ms)'" > ./data/plotme

types=(server webworker)

min=0
max=1000
step=250
labelY=$1

for N in `seq $min $step $max`; do
  for type in ${types[@]}; do
    echo "Running $type bench for $N elements with $1 requested, $2 concurrency"
    ab -n $1 -c $2 -g "./data/gnuplot_${type}_$1_$2_${N}.tsv" http://localhost:3000/$type/$N > /dev/null
  done
done

for N in `seq $min $step $max`; do
  for type in ${types[@]}; do
    echo -e "set label '$type $N' at $labelY,$(tail -n 1 ./data/gnuplot_${type}_$1_$2_${N}.tsv | awk '{print $9}')" >> ./data/plotme
  done
done

for N in `seq $min $step $max`; do
  for type in ${types[@]}; do
    if [ $N -eq $min ] && [ "$type" == "${types[0]}" ]; then
      prefix="plot"
    else
      prefix=","
    fi
    echo -e "$prefix './data/gnuplot_${type}_$1_$2_${N}.tsv' using (column('ttime')) smooth sbezier with lines \\" >> ./data/plotme
  done
done

gnuplot ./data/plotme

