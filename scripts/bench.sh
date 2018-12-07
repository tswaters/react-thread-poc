#!/bin/bash

rm -Rf ../images
rm -Rf ./data

mkdir -p ../images
mkdir -p ./data

min=0
max=1000
step=250

for N in `seq $min $step $max`; do
  ./plotit.sh 10000 1 $N
  ./plotit.sh 10000 500 $N
  ./plotit.sh 10000 1000 $N
done
