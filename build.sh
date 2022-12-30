docker build --platform linux/arm64 -t niradler/hosted-compose:arm --no-cache --progress=plain .
docker build -t niradler/hosted-compose:latest --no-cache --progress=plain .
docker push niradler/hosted-compose:arm
docker push niradler/hosted-compose:latest