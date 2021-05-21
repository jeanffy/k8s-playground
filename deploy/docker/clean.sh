echo "** Removing front container"
docker stop nodulfront
docker rm nodulfront
echo "** Removing API container"
docker stop nodulapi
docker rm nodulapi
#echo "** Removing Redis container"
#docker stop nodulredis
echo "** Removing MongoDB container"
docker stop nodulmongo

echo "** Removing network"
docker network rm nodulnet

echo "** Removing front image"
docker rmi nodulfront --force
docker images | grep dnrjpc\/nodulfront | tr -s ' ' | cut -d ' ' -f 2 | xargs -I {} docker rmi dnrjpc/nodulfront:{}

echo "** Removing API image"
docker rmi nodulapi --force
docker images | grep dnrjpc\/nodulapi | tr -s ' ' | cut -d ' ' -f 2 | xargs -I {} docker rmi dnrjpc/nodulapi:{}
