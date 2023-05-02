#!/usr/bin/env bash

source $DOCKER_COMPOSE_ENV
cd $VM_TARGET_DIR
docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
docker-compose -p $CI_PROJECT_NAME down
docker-compose pull
docker-compose -p $CI_PROJECT_NAME up -d