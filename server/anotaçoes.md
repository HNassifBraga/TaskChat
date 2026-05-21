<!-- instalações para o prisma -->


npm init -y
npm install typescript tsx @types/node --save-dev
<!-- instala o typescript, tsx que é um executor de typescript, @types/node fornece os tipode do node.js para o ts, --save-dev, instala como dependencia de desenvolvimento -->
npx tsc --init
<!-- cria o arquivo tsconfig.json -->

npm install prisma @types/node @types/pg --save-dev 
<!--instala prisma, os tipos do nodejs e os tipos do postgreesql e salva o prisma cli como ferramenta de desenvolvimento  -->

npm install @prisma/client @prisma/adapter-pg pg dotenv
<!-- instala o cliente do prisma, permite o prisma usar o driver do postgree, instala o drive do postgree, carrega variaveis do dotenv -->

prisma - The Prisma CLI for running commands like prisma init, prisma migrate, and prisma generate
@prisma/client - The Prisma Client library for querying your database
@prisma/adapter-pg - The node-postgres driver adapter that connects Prisma Client to your database
pg - The node-postgres database driver
@types/pg - TypeScript type definitions for node-postgres
dotenv - Loads environment variables from your .env file


npx prisma 

npx prisma init --datasource-provider postgresql --output ../generated/prisma --generator-provider prisma-client-js
<!-- npx prisma init, inicia o prisma no projeto criando prisma/schema.prisma e .env -->
<!--datasource-provider postgresql, coloca o provider de db o postgreesql e sua url -->
<!-- --output ../generated/prisma, define onde o prisma client sera gerado-->
<!-- --generator-provider prisma-client-js, define qual client sera gerado = prisma-client-js -->

npx create-db
<!-- criar um db na nuvem -->

apos configurar alguns modelos
npx prisma migrate dev --name init

npx prisma generate
<!-- generate prisma client -->

run script 
npx tsx script.ts

Prisma Studio is a visual editor for your database. Launch it with:
npx prisma studio --config ./prisma.config.ts



typed sql 

npx prisma generate --sql


<!-- instalação express -->
<!-- express usado para criar apis -->
npm install express
npm i --save-dev @types/express

<!-- instalaçoes http -->

npm install htpp

npm install nodemon

npm install bcrypt
npm install -D @types/bcrypt