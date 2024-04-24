#!/bin/bash

git clone https://github.com/0base-vc/fine-peers.git >/dev/null 2>&1
apt install iputils-ping -y >/dev/null 2>&1
cd fine-peers
npm i >/dev/null 2>&1
node src/index.js $1
cd .. && rm -rf fine-peers