# HopeShare

<div align="center">
  <img src="src/assets/images/logo-marca.png" alt="HopeShare Logo" width="300">
  
  **Uma plataforma de campanhas solidárias para conectar pessoas e transformar vidas.**
</div>

## 📋 Sobre o Projeto

HopeShare é uma aplicação web desenvolvida em Angular que facilita a criação e gerenciamento de campanhas de arrecadação solidária. A plataforma conecta pessoas que precisam de ajuda com aquelas dispostas a contribuir, criando uma rede de apoio e solidariedade.

### 🎯 Principais Funcionalidades

- **🏠 Home**: Página inicial com listagem e pesquisa de campanhas ativas
- **📝 Gerenciamento de Campanhas**: Criação, edição e acompanhamento de campanhas
- **📊 Dashboard**: Painel administrativo para visualização de métricas e dados
- **📈 Relatórios**: Sistema completo de relatórios e análises
- **🔐 Sistema de Autenticação**: Login seguro com criptografia
- **👥 Perfis de Usuário**: Diferentes tipos de usuário (pessoa física, CNPJ, admin)
- **🚨 Sistema de Denúncias**: Moderação e segurança da plataforma
- **💬 Suporte**: Canal de comunicação integrado

## 🚀 Tecnologias Utilizadas

### Frontend

- **Angular 17** - Framework principal
- **TypeScript** - Linguagem de programação
- **Tailwind CSS** - Framework CSS para estilização
- **PrimeNG** - Biblioteca de componentes UI
- **Angular Material** - Componentes Material Design
- **RxJS** - Programação reativa

### Bibliotecas e Dependências

- **ngx-cookie-service** - Gerenciamento de cookies
- **ngx-infinite-scroll** - Scroll infinito
- **crypto-js** - Criptografia client-side
- **Material Design Icons** - Ícones

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Angular CLI

### Passo a passo

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd hopeshare-frontend
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure os ambientes**
   - Ajuste os arquivos em `src/environments/` conforme necessário

4. **Execute o projeto em desenvolvimento**

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4000`

## 🛠️ Scripts Disponíveis

```bash
# Executar em desenvolvimento (porta 4000)
npm start

# Build para produção
npm run build:prod

# Build para homologação
npm run build:homolog

# Executar linting
npm run lint

# Corrigir problemas de linting automaticamente
npm run lint:fix

# Build com watch mode
npm run watch
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── login/                    # Módulo de autenticação
│   ├── pages/                    # Páginas principais
│   │   ├── admin/               # Área administrativa
│   │   ├── campanha/            # Gerenciamento de campanhas
│   │   ├── configuracao/        # Configurações do usuário
│   │   ├── dashboard/           # Dashboard e métricas
│   │   ├── home/                # Página inicial
│   │   └── relatorio/           # Sistema de relatórios
│   ├── shared/                  # Componentes e serviços compartilhados
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── services/            # Serviços
│   │   ├── models/              # Modelos de dados
│   │   ├── guards/              # Guards de rota
│   │   ├── interceptors/        # HTTP Interceptors
│   │   └── utils/               # Utilitários
│   ├── app-routing.module.ts    # Configuração de rotas
│   └── app.module.ts            # Módulo principal
├── assets/                      # Assets estáticos
├── environments/                # Configurações de ambiente
└── styles.css                  # Estilos globais
```

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Cores principais**: Azul (#3b82f6) para elementos primários
- **Tipografia**: Work Sans como fonte principal
- **Componentes**: PrimeNG para interface consistente
- **Ícones**: Material Design Icons e PrimeIcons
- **Responsividade**: Mobile-first design com Tailwind CSS

## 🔒 Segurança

- Autenticação baseada em cookies criptografados
- Interceptors para gerenciamento automático de tokens
- Guards de rota para proteção de páginas
- Validação de formulários client-side
- Sistema de denúncias para moderação de conteúdo

## 🌐 Ambientes de Deploy

### Produção

```bash
npm run build:prod
```

### Homologação

```bash
npm run build:homolog
```

O projeto está configurado para deploy no Vercel com GitHub Pages como alternativa.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📋 Funcionalidades por Tipo de Usuário

### 👤 Usuário Comum

- Visualizar campanhas
- Fazer denúncias
- Pesquisar e filtrar campanhas

### 🏢 Usuário CNPJ

- Criar e gerenciar campanhas
- Acessar dashboard de métricas
- Gerar relatórios
- Todas as funcionalidades de usuário comum

### 👑 Administrador

- Gerenciar denúncias
- Acesso completo ao sistema
- Moderação de conteúdo
- Todas as funcionalidades anteriores

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do sistema de suporte integrado na plataforma ou envie um email para [email-de-suporte].

---

<div align="center">
  <p>Feito com ❤️ para conectar pessoas e transformar vidas</p>
  <p>© 2024 HopeShare. Todos os direitos reservados.</p>
</div>
