#! /bin/bash

if [ -z "$1" ]; then
 ENVIRONMENT='development'
else
 ENVIRONMENT="$1"
fi

set -euo pipefail

SCRIPT=$(readlink -f $0)
SCRIPTPATH=`dirname $SCRIPT`
WAIT_FOR_IT_PATH="$SCRIPTPATH/wait_for_it.tmp"
HOST_PORT="db:5432"

if [ ! -f "$WAIT_FOR_IT_PATH" ]; then
  curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh --output $WAIT_FOR_IT_PATH
  chmod +x $WAIT_FOR_IT_PATH
fi

$WAIT_FOR_IT_PATH $HOST_PORT -s -- $SCRIPTPATH/_migrate.sh $ENVIRONMENT