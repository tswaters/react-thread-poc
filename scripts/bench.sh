#!/bin/bash

rm -Rf ../images

mkdir -p ../images

./plotit.sh -n1000 -c10 10
./plotit.sh -n1000 -c10 100
./plotit.sh -n1000 -c10 250
./plotit.sh -n1000 -c10 500
./plotit.sh -n1000 -c10 1000

./plotit.sh -n1000 -c50 10
./plotit.sh -n1000 -c50 100
./plotit.sh -n1000 -c50 250
./plotit.sh -n1000 -c50 500
./plotit.sh -n1000 -c50 1000

./plotit.sh -n1000 -c100 10
./plotit.sh -n1000 -c100 100
./plotit.sh -n1000 -c100 250
./plotit.sh -n1000 -c100 500
./plotit.sh -n1000 -c100 1000
