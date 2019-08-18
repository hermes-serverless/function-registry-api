#! /bin/bash
set -euo pipefail

display_info() {
  printf "Usage ./start.sh [OPT]\nOptions are:\n"
  printf "  -m: migrate\n"
  printf "  -s: seed\n"
  printf "  -p arg: port to start container\n"
  printf "  -n arg: container name\n"
  printf "  -h: Show this message\n"
  exit 0
}

SEED=false
MIGRATE=false
PORT="5432"
NAME="db"
while getopts "mshp:n:" OPT; do
  case "$OPT" in
    "m") MIGRATE=true;;
    "s") SEED=true;;
    "p") PORT=$OPTARG;;
    "n") NAME=$OPTARG;;
    "h") display_info;;
    "?") display_info;;
  esac 
done

SCRIPT=$(python -c "import os; print(os.path.realpath('$0'))")
SCRIPTPATH=`dirname $SCRIPT`

docker container stop $NAME || true
docker container rm $NAME || true

docker container run -p $PORT:5432 --name $NAME -e POSTGRES_USER=hermes -e POSTGRES_PASSWORD=hermes -d postgres:9.4 
sleep 3

if [ "$MIGRATE" == "true" ] || [ "$SEED" == "true" ]; then
  if [ "$MIGRATE" == "true" ]; then
    ${SCRIPTPATH}/../../../scripts/migrate.sh -e test -p $PORT -u localhost
  fi

  if [ "$SEED" == "true" ]; then
    ${SCRIPTPATH}/../../../scripts/seed.sh -e test -p $PORT -u localhost
  fi
fi

printf "\n\n"
docker container ls
