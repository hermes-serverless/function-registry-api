#! /bin/bash
set -euo pipefail

display_info() {
  printf "Usage ./start.sh [OPT]\nOptions are:\n"
  printf "  -b: build docker-compose\n"
  printf "  -h: Show this message\n"
  exit 0
}

BUILD=false
SEED=false
MIGRATE=false
while getopts "msbh" OPT; do
  case "$OPT" in
    "b") BUILD=true;;
    "m") MIGRATE=true;;
    "s") SEED=true;;
    "h") display_info;;
    "?") display_info;;
  esac 
done

SCRIPT=$(python -c "import os; print(os.path.realpath('$0'))")
SCRIPTPATH=`dirname $SCRIPT`

DOCKER_COMPOSE_OPTS="-p db-test -f $SCRIPTPATH/db-test.yml"

docker-compose $DOCKER_COMPOSE_OPTS down -v

if [ "$BUILD" == "true" ]; then
  docker-compose $DOCKER_COMPOSE_OPTS build
fi

docker-compose $DOCKER_COMPOSE_OPTS up -d

if [ "$MIGRATE" == "true" ] || [ "$SEED" == "true" ]; then
  if [ "$MIGRATE" == "true" ]; then
    ${SCRIPTPATH}/../../../scripts/migrate.sh -e "test" -p "localhost:5432"
  fi

  if [ "$SEED" == "true" ]; then
    ${SCRIPTPATH}/../../../scripts/seed.sh -e "test" -p "localhost:5432"
  fi
fi

printf "\n\n"
docker container ls
