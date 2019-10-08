#! /bin/bash
set -euo pipefail

display_info() {
  printf "Usage ./migrate.sh [OPT]\nOptions are:\n"
  printf "  -e arg: Environment\n"
  printf "  -p arg: db port\n"
  printf "  -u arg: db host name\n"
  printf "  -c arg: Sequelize command\n"
  printf "  -h: Show this message\n"
  exit 0
}

ENVIRONMENT='development'
HOST="db"
PORT="5432"
COMMAND='db:seed:all'
while getopts "e:p:c:u:h" OPT; do
  case "$OPT" in
    "e") ENVIRONMENT=$OPTARG;;
    "p") PORT=$OPTARG;;
    "u") HOST=$OPTARG;;
    "c") COMMAND=$OPTARG;;
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

$WAIT_FOR_IT_PATH $HOST:$PORT -s -- $SCRIPTPATH/_seed.sh -e $ENVIRONMENT -c $COMMAND -p $PORT