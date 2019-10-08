set -euo pipefail

docker build --target=production -t hermeshub/function-registry-api:latest .
docker push hermeshub/function-registry-api:latest

docker build --target=migrator -t hermeshub/db-migrator:latest .
docker push hermeshub/db-migrator:latest
