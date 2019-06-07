# Read arguments passed to the script.
if [ -z "$1" ]; then
 ENVIRONMENT='development'
else
 ENVIRONMENT="$1"
fi

set -euo pipefail

echo ""
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
  "npx sequelize-cli db:migrate --env $ENVIRONMENT"
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
