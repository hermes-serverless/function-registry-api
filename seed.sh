set -euo pipefail

start_text=(
  "Creating tsconfig for seeders compilation."
  "Compiling seeds scripts."
  "Seeding."
  "Removing seed-tsconfig"
)

end_text=(
  "Created tsconfig file"
  "Compilation completed."
  "Seeding completed."
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
  "npx sequelize-cli db:seed:all"
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