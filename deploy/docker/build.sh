BASEDIR=$(dirname "$0")
echo "** Building API image"
(cd "$BASEDIR/../../app" && exec docker build -t nodulapi -f api.dockerfile .)
echo "** Building front image"
(cd "$BASEDIR/../../app" && exec docker build -t nodulfront -f front.dockerfile .)
