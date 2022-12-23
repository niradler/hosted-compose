docker build --platform linux/arm64 -t niradler/app-compose:arm --no-cache --progress=plain .
docker build -t niradler/app-compose:latest --no-cache --progress=plain .
docker push niradler/app-compose:arm
docker push niradler/app-compose:latest