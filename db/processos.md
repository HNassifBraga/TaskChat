1. criar um volume, para assim ter dados persistentes e nao perdelos quando o container for removido. Quando criado um volume, é armazenado dentro de um dirtório da maquina host. Quando o volume é montado no container, é o diretório que está sendo montado no container, mas esse diretório é isolado da maquina host

## para montar um volume por cli

docker run --mount type=volume,src=<volume-name>,dst=<mount-path>
docker run --volume <volume-name>:<mount-path>

## organizaçao das chaves do comando mount
docker run --mount type=volume[,src=<volume-name>],dst=<mount-path>[,<key>=<value>...]

source, src	The source of the mount. For named volumes, this is the name of the volume. For anonymous volumes, this field is omitted.
destination, dst, target	The path where the file or directory is mounted in the container.
volume-subpath	A path to a subdirectory within the volume to mount into the container. The subdirectory must exist in the volume before the volume is mounted to a container. See Mount a volume subdirectory.
readonly, ro	If present, causes the volume to be mounted into the container as read-only.
volume-nocopy	If present, data at the destination isn't copied into the volume if the volume is empty. By default, content at the target destination gets copied into a mounted volume if empty.
volume-opt	Can be specified more than once, takes a key-value pair consisting of the option name and its value.


## creating volumes
docker volume create my-vol
docker volume ls -> lists all the volumes 
docker volume inspect my-vol -> especiona o volume my-vol
rm para remover.


## criação do container
  db docker run -d \
  --name postgres-cont \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=12345678 \
  -e POSTGRES_DB=meubanco \
  -v db-volume:/var/lib/postgresql/data \
  -p 5433:5432 \
  postgres:16-alpine


<!-- curiosidade -->
<!-- sudo lsof -i :5432 -->
<!-- ver se a porta 5432 esta sendo utilizada -->
<!-- brew services stop postgresql@17 -->
<!-- se quiser iniciar -->
<!-- brew services start postgresql@17 -->
<!-- projetos npm -->
<!-- sistema brew -->


## conexao com o prisma.

Foi só mudar o database_url do .env

estava tendo problema porque já tinha um programa rodando na porta 5432, ai eu tive que mudar a porta do host para 5433 e receber na porta 5432 do container


## apos fazer novas alteraçoes nos models

npx prisma migrate dev --name <nome> -> cria um novo sql com base dessa migração
npx prisma generate para limpar a memória do esquema antigo
npx prisma migrate reset

## para rodar comandos sql no banco

docker exec -it postgres-cont psql -U admin -d meubanco 