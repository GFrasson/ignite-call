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