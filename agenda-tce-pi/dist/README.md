# Documentação do Sistema "Agenda da Presidência do TCE/PI"

## Visão Geral
O sistema "Agenda da Presidência do TCE/PI" é uma aplicação web desenvolvida em Node.js para gerenciamento de compromissos da presidência do Tribunal de Contas do Estado do Piauí. O sistema permite o cadastro de compromissos, visualização em formato de calendário, geração de relatórios e notificações por email.

## Requisitos do Sistema
- Node.js (versão 14.0.0 ou superior)
- MongoDB (local ou serviço em nuvem como MongoDB Atlas)
- Conexão com internet para envio de emails

## Estrutura do Projeto
```
agenda-tce-pi/
├── app.js                 # Arquivo principal da aplicação
├── config/                # Configurações do sistema
│   ├── db.js              # Configuração do banco de dados
│   ├── email.js           # Configuração do serviço de email
│   └── seed.js            # Script para criar usuário admin inicial
├── controllers/           # Controladores da aplicação
│   ├── appointmentController.js  # Controlador de compromissos
│   └── userController.js         # Controlador de usuários
├── middleware/            # Middlewares da aplicação
│   └── auth.js            # Middleware de autenticação
├── models/                # Modelos de dados
│   ├── Appointment.js     # Modelo de compromissos
│   └── User.js            # Modelo de usuários
├── public/                # Arquivos estáticos
│   ├── css/               # Folhas de estilo
│   ├── js/                # Scripts JavaScript
│   └── img/               # Imagens
├── routes/                # Rotas da aplicação
│   ├── appointmentRoutes.js  # Rotas de compromissos
│   └── userRoutes.js         # Rotas de usuários
├── views/                 # Templates EJS
│   ├── partials/          # Componentes reutilizáveis
│   ├── login.ejs          # Tela de login
│   ├── dashboard.ejs      # Tela principal com calendário
│   └── ...                # Outras telas
├── .env                   # Variáveis de ambiente
└── package.json           # Dependências e scripts
```

## Instalação e Configuração

### 1. Extrair o arquivo ZIP
Extraia o conteúdo do arquivo `agenda-tce-pi.zip` em um diretório de sua escolha.

### 2. Instalar Dependências
Navegue até o diretório do projeto e execute:
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Edite o arquivo `.env` com suas configurações:
```
PORT=3000
NODE_ENV=production
SESSION_SECRET=sua-chave-secreta-aqui
MONGODB_URI=sua-string-de-conexao-mongodb
```

### 4. Iniciar o Servidor
```bash
npm start
```

## Implantação em Serviços de Hospedagem

### Heroku
1. Crie uma conta no Heroku (https://heroku.com)
2. Instale o Heroku CLI
3. Execute os comandos:
```bash
heroku login
heroku create seu-app-nome
git init
git add .
git commit -m "Primeira versão"
git push heroku master
```

### Railway
1. Crie uma conta no Railway (https://railway.app)
2. Crie um novo projeto
3. Conecte ao seu repositório Git ou faça upload do código
4. Configure as variáveis de ambiente
5. Deploy automático será iniciado

### Vercel
1. Crie uma conta no Vercel (https://vercel.com)
2. Instale o Vercel CLI: `npm i -g vercel`
3. Execute: `vercel login`
4. No diretório do projeto, execute: `vercel`

## Funcionalidades

### Sistema de Login
- Usuário padrão: admin
- Senha padrão: admin
- Níveis de acesso: administrador e usuário comum

### Cadastro de Usuários
- Administradores podem criar, editar e excluir usuários
- Campos: nome, usuário, email, senha, nível de acesso

### Módulo de Agenda
- Cadastro de compromissos com os campos:
  - Nome do solicitante
  - Assunto
  - Data e hora
  - Cargo
  - E-mail
  - Órgão
- Notificações por email para confirmação de compromissos

### Visualização de Calendário
- Calendário mensal na tela principal
- Indicadores visuais de compromissos
- Visualização detalhada de compromissos por dia

### Módulo de Relatórios
- Impressão da agenda do dia selecionado em formato PDF
- Visualização otimizada para impressão

## Suporte e Manutenção
Para suporte técnico ou dúvidas sobre o sistema, entre em contato com o desenvolvedor.

## Segurança
- Todas as senhas são armazenadas com criptografia
- Sistema de sessões para controle de acesso
- Validação de dados em todos os formulários

## Responsividade
O sistema foi desenvolvido com design responsivo, funcionando adequadamente em dispositivos móveis e desktops.
