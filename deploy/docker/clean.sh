docker stop nodulfront
docker rm nodulfront
docker stop nodulapi
docker rm nodulapi
docker stop redis

docker network rm nodulnet

docker rmi nodulfront --force
docker images | grep dnrjpc\/nodulfront | tr -s ' ' | cut -d ' ' -f 2 | xargs -I {} docker rmi dnrjpc/nodulfront:{}

docker rmi nodulapi --force
docker images | grep dnrjpc\/nodulapi | tr -s ' ' | cut -d ' ' -f 2 | xargs -I {} docker rmi dnrjpc/nodulapi:{}
