# Read arguments passed to the script.
if [ -z "$1" ]; then
 ENVIRONMENT='development'
else
 ENVIRONMENT="$1"
fi

if [ -z "$2" ]; then
 COMMAND='db:seed:all'
else
 COMMAND="$2"
fi

set -euo pipefail

start_text=(
  "Creating tsconfig for seeders compilation."
  "Compiling seeds scripts."
  "Doing $COMMAND"
  "Removing seed-tsconfig"
)

end_text=(
  "Created tsconfig file"
  "Compilation completed."
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
  "NODE_ENV=$ENVIRONMENT npx sequelize-cli $COMMAND --env $ENVIRONMENT"
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