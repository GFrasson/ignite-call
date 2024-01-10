### Setup & estrutura - Configuração do ESLint

 - npm run lint -- --fix

### Cadastro de usuário - Configurando Prisma no Next.js

Comando de instalação da interface de linha de comando do Prisma:
npm i prisma -D

Comando de instalação da dependência que iremos utilizar na nossa aplicação:
npm i @prisma/client

Comando para iniciar o Prisma:
npx prisma init --datasource-provider SQLite

Comando pra rodar a migration:
npx prisma migrate dev

Comando pra rodar o Prisma Studio:
npx prisma studio

### OAuth Google 

 - console.cloud.google.com
 - criar conta
 - criar projeto
 - tela de permissao oauth
  - preencher formulário com informações obrigatórias
  - publicar aplicativo
 - credenciais
  - criar credenciais
    - id do cliente oauth
  - aplicativo da web
  - Nome: Next js client
  - origens js autorizadas: http://localhost:3000
  - uri de redirecionamento autorizados: http://localhost:3000/api/auth/callback/google
  - copiar tokens

```.env
GOOGLE_CLIENT_ID=token_aqui
GOOGLE_CLIENT_SECRET=secret_aqui
```

 - apis e serviços ativados
  - apis e serviços
    - calendar
      - google calendar API
        - ativar

### Next OAuth

 - Criar secret: `openssl rand -base64 32`

```.env
NEXTAUTH_SECRET=secret_aqui
```

### Calendário e disponibilidade - Alterando banco para MySQL

Chegamos em um ponto em que não conseguimos mais continuar usando o sqlite e vamos alterar o banco para o MySQL.

Comando utilizado para rodar o Docker:
docker run --name mysql -e MYSQL_ROOT_PASSWORD=docker -p 3306:3306 mysql:latest

Comando utilizado para iniciar o container
docker start mysql

Comando utilizado para parar o container:
docker stop mysql

```.env
DATABASE_URL="mysql://root:docker@localhost:3306/ignitecall"
```

 - apagar banco sqlite
 - apagar pasta migrations
 - npx prisma migrate dev

### Otimizações SEO 

 - lib: satori
 - gerar opengraph images

### Deploy no Planetscale

Hospedagem do banco (modelo serverless)

 - criar uma conta e organização
 - criar banco
 - regiao: AWS us-east-1 (Northern Virginia)
 - branches > main > promote to production > promote branch
 - create new branch > nome: migrations
		       base branch: main
 - settings > automatically copy migrations data > migrations framework: prisma > save database settings
 - branch migrations > connect > copy DATABASE_URL > substituir DATABASE_URL no .env
 - modificar o arquivo schema.prisma
 - rodar o migration local (com database_url local)
 - atualiza de volta o database_url no .env
 - npx prisma db push
 - branch migrations > create deploy request > deploy changes

### Deploy na vercel

 - importa do github
 - configura variaveis ambiente
 - pegar a DATABASE_URL no planetscale da branch main para setar nas variáveis ambiente na vercel (colar sem aspas)
 - nova variável ambiente: NEXTAUTH_URL=https://ignite-call.vercel.app  (link site hospedado)
 - no console.cloud.google.com > credenciais > origens javascript autorizadas > adicionar uri (link do site hospedado)
 - no console.cloud.google.com > credenciais > uris de redirecionamentos autorizados > adicionar uri > ...uri/api/auth/callback/google
 - salvar
 - tela de permissao oauth > dominios autorizados > adicionar dominio autorizado (se nao for inserido automaticamente) > ex: ignite-call.vercel.app
 - redeploy depois de adicionar variaveris ambiente novas
 - criar nova credencial no google para funcionar no ambiente de producao
 - colocar o clientid e secretid do google nas variaveis ambiente na vercel (da nova credencial criada para producao)
