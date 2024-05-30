export NAME=my-test-nginx
envsubst < deployment.yaml | kubectl apply -f -
