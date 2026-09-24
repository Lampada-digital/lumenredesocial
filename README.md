# Lumen - Rede Social Católica

Plataforma de rede social completa para a comunidade católica, construída com React, TypeScript, Supabase e Tailwind CSS.

## 🚀 Funcionalidades

- ✅ **Autenticação Real** - Cadastro e login com Supabase Auth
- ✅ **Feed de Publicações** - Crie, curta e comente publicações
- ✅ **Perfis de Usuário** - Perfis completos com informações pessoais
- ✅ **Comunidades** - Grupos e comunidades temáticas
- ✅ **Eventos** - Missas, retiros, formações e mais
- ✅ **Mensagens** - Chat em tempo real
- ✅ **Pedidos de Oração** - Comunidade unida em oração
- ✅ **Formação** - Cursos e conteúdos educativos
- ✅ **Design Moderno** - Interface elegante e responsiva

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (gratuito)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd lumen
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (se não tiver)
3. Crie um novo projeto
4. Aguarde a inicialização (pode levar alguns minutos)

#### 3.2 Execute o schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo de `supabase/schema.sql`
4. Cole no editor e clique em **Run**

Isso criará todas as tabelas, índices, funções e políticas de segurança necessárias.

#### 3.3 Obtenha as credenciais

1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://seu-projeto.supabase.co`)
   - **anon public key** (chave longa que começa com `eyJ...`)

#### 3.4 Configure o arquivo .env

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
lumen/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   └── Layout.tsx    # Layout principal com sidebar
│   ├── contexts/         # Contextos React
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── lib/              # Bibliotecas e utilitários
│   │   ├── supabase.ts   # Cliente Supabase
│   │   └── database.ts   # Funções de acesso ao banco
│   ├── pages/            # Páginas da aplicação
│   │   ├── Auth.tsx      # Login/Cadastro
│   │   ├── Feed.tsx      # Feed principal
│   │   ├── Profile.tsx   # Perfil do usuário
│   │   ├── Communities.tsx
│   │   ├── Messages.tsx
│   │   ├── Events.tsx
│   │   ├── Prayer.tsx
│   │   ├── Formation.tsx
│   │   └── Explore.tsx
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx           # Componente raiz
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globais
├── supabase/
│   └── schema.sql        # Schema completo do banco
├── .env.example          # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
├── vite.config.js
└── vercel.json           # Configuração para deploy na Vercel
```

## 🗄️ Banco de Dados

O schema do Supabase inclui:

### Tabelas Principais

- **profiles** - Perfis de usuário
- **posts** - Publicações do feed
- **post_likes** - Curtidas
- **post_comments** - Comentários
- **communities** - Comunidades/grupos
- **community_members** - Membros de comunidades
- **conversations** - Conversas (DM e grupos)
- **messages** - Mensagens
- **events** - Eventos
- **event_participants** - Participantes de eventos
- **courses** - Cursos de formação
- **course_enrollments** - Inscrições em cursos
- **friendships** - Amizades
- **follows** - Seguidores
- **notifications** - Notificações
- **stories** - Stories (24h)

### Recursos

- ✅ Row Level Security (RLS) habilitado
- ✅ Triggers para contadores automáticos
- ✅ Criação automática de perfil ao registrar
- ✅ Índices para performance
- ✅ Storage buckets para arquivos

## 🔐 Segurança

- Autenticação via Supabase Auth
- Senhas hasheadas com bcrypt (Supabase)
- Row Level Security em todas as tabelas
- Tokens JWT em todas as requisições à API
- CORS configurado corretamente
- Variáveis de ambiente para secrets

## 🚀 Deploy na Vercel

### 1. Configure as variáveis de ambiente na Vercel

No dashboard da Vercel, adicione:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 2. Deploy

```bash
npm run build
vercel deploy
```

Ou conecte o repositório Git à Vercel para deploy automático.

O arquivo `vercel.json` já está configurado com rewrites para SPA.

## 📱 Rotas

- `/` - Feed principal (protegido)
- `/auth` - Login/Cadastro
- `/profile` - Perfil do usuário (protegido)
- `/communities` - Comunidades (protegido)
- `/messages` - Mensagens (protegido)
- `/events` - Eventos (protegido)
- `/prayer` - Pedidos de oração (protegido)
- `/formation` - Formação (protegido)
- `/explore` - Explorar (protegido)
- `/settings` - Configurações (protegido)

## 🎨 Design System

- **Fonte**: Inter (UI) + Playfair Display (títulos)
- **Cores**: 
  - Primary: Roxo (#8b5cf6)
  - Gold: Dourado (#fbbf24)
  - Surface: Tons de cinza
- **Estilo**: Minimalista, elegante, moderno
- **Responsivo**: Mobile-first

## 🧪 Testes

```bash
# Type checking
npm run typecheck

# Build de produção
npm run build

# Servidor de desenvolvimento
npm run dev
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run typecheck` - Verifica tipos TypeScript
- `npm run preview` - Preview do build de produção

## 🔧 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Estilização**: Tailwind CSS 4
- **Backend/Banco**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **Roteamento**: React Router v6
- **Ícones**: Lucide React
- **Animações**: Framer Motion

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- Comunidade católica por inspirar este projeto
- Supabase pela excelente plataforma
- React e Vite pelo framework incrível
- Todos os contribuidores

## 📞 Suporte

Para dúvidas e suporte:
- Abra uma issue no GitHub
- Entre em contato: [seu-email@exemplo.com]

---

**Lumen** - "Vós sois a luz do mundo" (Mateus 5,14)

Conectando a comunidade católica através da tecnologia.
