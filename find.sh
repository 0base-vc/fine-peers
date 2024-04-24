#!/bin/bash

git clone https://github.com/0base-vc/fine-peers.git
apt install iputils-ping -y
cd fine-peers
npm i
npm run start $1
cd .. && rm -rf fine-peers