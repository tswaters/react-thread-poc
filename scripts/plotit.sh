#!/bin/bash

set -x

rm -Rf data

mkdir -p data

echo "
set terminal png
set output '../images/benchmark_${1}_${2}_${3}.png'
set title 'Benchmark: ${1} ${2} elements: ${3}'
set size 1,1
set grid y
set xlabel 'request'
set ylabel 'response time (ms)'
" > ./data/plotme

ab $1 $2 -g "./data/gnuplot_server_${3}.out" http://localhost:3000/server/$3 > /dev/null
ab $1 $2 -g "./data/gnuplot_thread_${3}.out" http://localhost:3000/thread/$3 > /dev/null

echo -e "plot './data/gnuplot_server_${3}.out' using 9 smooth sbezier with lines title 'server' \\" >> ./data/plotme
echo -e ", './data/gnuplot_thread_${3}.out' using 9 smooth sbezier with lines title 'thread' \\" >> ./data/plotme

gnuplot ./data/plotme

