BASEDIR=$(dirname "$0")

# create network
docker network create --driver bridge nodulnet

# run redis
(cd "$BASEDIR/../.." && \
  exec docker run \
    --name redis \
    --rm -d -p 6379:6379 \
    -v $PWD/data/redis:/data \
    --network nodulnet \
    redis:6-alpine)

# run api
(cd "$BASEDIR/../.." && \
  exec docker run \
    --name nodulapi \
    -d -p 8585:3000 \
    -e NODUL_USE_REDIS=1 \
    -e NODUL_FOO='This is a message from docker' \
    -e NODUL_REDIS_HOST=redis \
    -v $PWD/data/file:/tmp/nodulapp \
    --network nodulnet \
    nodulapi)

# run front
(cd "$BASEDIR/../.." && \
  exec docker run \
    --name nodulfront \
    -d -p 8090:4000 \
    -e NODUL_API_URL=http://localhost:8585 \
    --network nodulnet \
    nodulfront)
