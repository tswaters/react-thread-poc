#!/bin/bash

rm -Rf ../images
rm -Rf ./data

mkdir -p ../images
mkdir -p ./data

./plotit.sh 1000 1
./plotit.sh 1000 500
./plotit.sh 1000 1000
