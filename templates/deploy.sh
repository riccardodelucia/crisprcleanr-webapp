#!/usr/bin/env bash

source $DOCKER_COMPOSE_ENV
cd $VM_TARGET_DIR
docker-compose -p $CI_PROJECT_NAME down
docker-compose pull
docker-compose -p $CI_PROJECT_NAME up -d