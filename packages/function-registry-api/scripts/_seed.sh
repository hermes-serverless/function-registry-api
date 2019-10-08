#! /bin/bash
set -euo pipefail

display_info() {
  printf "Usage ./_seed.sh [OPT]\nOptions are:\n"
  printf "  -e arg: Environment\n"
  printf "  -p arg: db port\n"
  printf "  -c arg: Sequelize command\n"
  printf "  -h: Show this message\n"
  exit 0
}

ENVIRONMENT='development'
PORT="5432"
COMMAND='db:seed:all'
while getopts "e:p:c:h" OPT; do
  case "$OPT" in
    "e") ENVIRONMENT=$OPTARG;;
    "p") PORT=$OPTARG;;
    "c") COMMAND=$OPTARG;;
    "h") display_info;;
    "?") display_info;;
  esac 
done

SCRIPT=$(python -c "import os; print(os.path.realpath('$0'))")
SCRIPTPATH=`dirname $SCRIPT`

start_text=(
  "Creating tsconfig for seeders compilation."
  "Compiling seeds scripts."
  "Copying config.js"
  "Doing $COMMAND"
  "Removing seed-tsconfig"
)

end_text=(
  "Created tsconfig file"
  "Compilation completed."
  "Copied config.js"
  "$COMMAND DONE"
  "Done"
)

json_config='{
  "compilerOptions": { 
    "outDir": "build-seeders"
   }, 
   "extends": "./base-tsconfig.json", 
   "include": ["src/seeders/*.ts"] 
}'

commands=(
  "echo '$json_config' > seed-tsconfig.json"
  "yarn tsc --project seed-tsconfig.json"
  "cp -r $SCRIPTPATH/../src/db/config $SCRIPTPATH/../build-seeders/db/config"
  "DB_PORT=$PORT NODE_ENV=$ENVIRONMENT yarn sequelize $COMMAND --env $ENVIRONMENT --config $SCRIPTPATH/../src/db/config/config.js"
  "rm seed-tsconfig.json"
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