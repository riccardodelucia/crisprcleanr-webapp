#!/usr/bin/env bash

source /home/riccardo.delucia/docker-compose/bin/activate
cd /home/riccardo.delucia/deploy/crisprcleanr_webapp
docker-compose pull
docker-compose down
docker-compose -p crisprcleanr_webapp up --no-build -d