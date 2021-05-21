BASEDIR=$(dirname "$0")
(cd "$BASEDIR/../../app" && exec docker build -t nodulapi -f api.dockerfile .)
(cd "$BASEDIR/../../app" && exec docker build -t nodulfront -f front.dockerfile .)
