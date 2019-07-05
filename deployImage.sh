set -euo pipefail

docker build --target=production -t hermeshub/db-manager:latest .
docker push hermeshub/db-manager:latest

docker build --target=migrator -t hermeshub/db-migrator:latest .
docker push hermeshub/db-migrator:latest
