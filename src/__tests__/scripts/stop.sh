#! /bin/bash
set -euo pipefail

display_info() {
  printf "Usage ./stop.sh [OPT]\nOptions are:\n"
  printf "  -h: Show this message\n"
  exit 0
}

while getopts "h" OPT; do
  case "$OPT" in
    "h") display_info;;
    "?") display_info;;
  esac 
done

SCRIPT=$(python -c "import os; print(os.path.realpath('$0'))")
SCRIPTPATH=`dirname $SCRIPT`

DOCKER_COMPOSE_OPTS="-p db-test -f $SCRIPTPATH/db-test.yml"

docker-compose $DOCKER_COMPOSE_OPTS down -v

printf "\n\n"
docker container ls
