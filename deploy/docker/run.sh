BASEDIR=$(dirname "$0")

echo "** Creating network"
docker network create --driver bridge nodulnet

# echo "** Running Redis container"
# (cd "$BASEDIR/../.." && \
#   exec docker run \
#     --name nodulredis \
#     --rm -d -p 6379:6379 \
#     -v $PWD/data/redis:/data \
#     --network nodulnet \
#     redis:6-alpine)

echo "** Running MongoDB container"
(cd "$BASEDIR/../.." && \
  exec docker run \
    --name nodulmongo \
    --rm -d -p 27017:27017 \
    -e MONGO_INITDB_DATABASE=nodulapp \
    -v $PWD/data/mongodb:/data/db \
    --network nodulnet \
    mongo:4.4.6)

echo "** Running API container"
(cd "$BASEDIR/../.." && \
  exec docker run \
    --name nodulapi \
    -d -p 8585:3000 \
    -e NODUL_USE_REDIS=1 \
    -e NODUL_USE_MONGO=1 \
    -e NODUL_FOO='This is a message from docker' \
    -e NODUL_REDIS_HOST=nodulredis \
    -e NODUL_MONGO_HOST=nodulmongo \
    -v $PWD/data/file:/tmp/nodulapp \
    --network nodulnet \
    nodulapi)

echo "** Running front container"
(cd "$BASEDIR/../.." && \
  exec docker run \
    --name nodulfront \
    -d -p 8090:4000 \
    -e NODUL_API_URL=http://localhost:8585 \
    --network nodulnet \
    nodulfront)
