docker build -t benyoo5222jae/multi-client:latest -t benyoo5222jae/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t benyoo5222jae/multi-fib-server:latest -t benyoo5222jae/multi-fib-server:$SHA -f ./server/Dockerfile ./server
docker build -t benyoo5222jae/mutli-fib-worker:latest -t benyoo5222jae/mutli-fib-woker:$SHA -f ./worker/Dockerfile ./worker

docker push benyoo5222jae/multi-client:latest
docker push benyoo5222jae/multi-client:$SHA

docker push benyoo5222jae/multi-fib-server:latest
docker push benyoo5222jae/multi-fib-server:$SHA

docker push benyoo5222jae/mutli-fib-worker:latest
docker push benyoo5222jae/mutli-fib-woker:$SHA

kubectl apply -f ./k8s

kubectl set image deployments/client-deployment client=benyoo5222jae/multi-client:$SHA
kubectl set image deployments/server-deployment web-server=benyoo5222jae/multi-fib-server:$SHA
kubectl set image deployments/worker-deployment redis-fib-worker=benyoo5222jae/mutli-fib-woker:$SHA
