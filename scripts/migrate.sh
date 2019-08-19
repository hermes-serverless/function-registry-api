#! /bin/bash
set -euo pipefail

display_info() {
  printf "Usage ./migrate.sh [OPT]\nOptions are:\n"
  printf "  -e arg: Environment\n"
  printf "  -p arg: DB url\n"
  printf "  -h: Show this message\n"
  exit 0
}

ENVIRONMENT='development'
HOST_PORT="db:5432"
while getopts "e:p:h" OPT; do
  case "$OPT" in
    "e") ENVIRONMENT=$OPTARG;;
    "p") HOST_PORT=$OPTARG;;
    "h") display_info;;
    "?") display_info;;
  esac 
done

SCRIPT=$(python -c "import os; print(os.path.realpath('$0'))")
SCRIPTPATH=`dirname $SCRIPT`
WAIT_FOR_IT_PATH="$SCRIPTPATH/wait_for_it.tmp"

if [ ! -f "$WAIT_FOR_IT_PATH" ]; then
  curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh --output $WAIT_FOR_IT_PATH
  chmod +x $WAIT_FOR_IT_PATH
fi

$WAIT_FOR_IT_PATH $HOST_PORT -s -- $SCRIPTPATH/_migrate.sh $ENVIRONMENT