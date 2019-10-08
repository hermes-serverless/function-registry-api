#! /bin/bash
set -euo pipefail

display_info() {
  printf "Usage ./stop.sh [OPT]\nOptions are:\n"
  printf "  -h: Show this message\n"
  printf "  -n arg: container name\n"
  exit 0
}

NAME="db"
while getopts "hn:" OPT; do
  case "$OPT" in
    "h") display_info;;
    "n") NAME=$OPTARG;;
    "?") display_info;;
  esac 
done

SCRIPT=$(python -c "import os; print(os.path.realpath('$0'))")
SCRIPTPATH=`dirname $SCRIPT`

docker container stop $NAME || true
docker wait $NAME || true
docker container rm $NAME || true

printf "\n\n"
docker container ls
