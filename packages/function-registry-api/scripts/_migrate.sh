#! /bin/bash
set -euo pipefail

display_info() {
  printf "Usage ./migrate.sh [OPT]\nOptions are:\n"
  printf "  -p arg: db port\n"
  printf "  -e arg: environment\n"
  printf "  -h: Show this message\n"
  exit 0
}

PORT="5432"
ENVIRONMENT='development'
while getopts "hp:e:" OPT; do
  case "$OPT" in
    "p") PORT=$OPTARG;;
    "e") ENVIRONMENT=$OPTARG;;
    "h") display_info;;
    "?") display_info;;
  esac 
done

SCRIPT=$(python -c "import os; print(os.path.realpath('$0'))")
SCRIPTPATH=`dirname $SCRIPT`

echo "Migrating for environment: $ENVIRONMENT"
echo ""

start_text=(
  "Creating tsconfig for migrations compilation."
  "Compiling migration scripts."
  "Migrating."
  "Removing migrate-tsconfig"
)

end_text=(
  "Created tsconfig file"
  "Compilation completed."
  "Migration completed."
  "Done"
)

json_config='{
  "compilerOptions": { 
    "outDir": "build-migrations"
  }, 
  "extends": "./base-tsconfig.json", 
  "include": ["src/migrations/*.ts"] 
}'

commands=(
  "echo '$json_config' > migrate-tsconfig.json"
  "yarn tsc --project migrate-tsconfig.json"
  "DB_PORT=$PORT yarn sequelize db:migrate --env $ENVIRONMENT --config $SCRIPTPATH/../src/db/config/config.js"
  "rm migrate-tsconfig.json"
)

i=0
function step {
  echo " -> Step $((i+1))/${#commands[@]}: ${start_text[i]}"
  eval ${commands[$i]}
  echo " -> ${end_text[i]}."
  echo ""  
  i=$((i+1))
  return
}

sz=${#commands[*]}
for (( j=0;j<$sz;j++ )); do
  step
done


