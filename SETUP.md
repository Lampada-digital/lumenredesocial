# 🚀 Guia Rápido de Configuração - Lumen

## ⚡ Configuração em 5 minutos

### 1️⃣ Criar projeto no Supabase (2 min)

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project" → "New Project"
3. Preencha:
   - **Name**: `lumen`
   - **Database Password**: (gere uma senha forte e guarde)
   - **Region**: escolha a mais próxima
   - **Pricing Plan**: Free (gratuito)
4. Clique em "Create new project"
5. Aguarde ~2 minutos até o projeto estar pronto

### 2️⃣ Executar o Schema SQL (1 min)

1. No dashboard do Supabase, clique em **SQL Editor** (ícone no menu lateral)
2. Clique em **New Query**
3. Abra o arquivo `supabase/schema.sql` deste projeto
4. Copie TODO o conteúdo
5. Cole no SQL Editor do Supabase
6. Clique em **Run** (botão verde no canto inferior direito)
7. Aguarde a execução (deve aparecer "Success. No rows returned")

### 3️⃣ Obter credenciais (30 seg)

1. No dashboard do Supabase, clique em **Settings** (engrenagem no menu lateral)
2. Clique em **API**
3. Copie:
   - **Project URL**: algo como `https://abcdefgh.supabase.co`
   - **anon public**: uma chave longa que começa com `eyJ...`

### 4️⃣ Configurar o projeto (30 seg)

1. Na raiz do projeto, crie um arquivo `.env`:
   ```bash
   touch .env
   ```

2. Edite o arquivo `.env` com:
   ```env
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   (use os valores que você copiou)

3. Salve o arquivo

### 5️⃣ Iniciar o servidor (30 seg)

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## ✅ Testando

1. Clique em "Cadastre-se"
2. Preencha:
   - Nome completo
   - Email
   - Username
   - Senha (mínimo 6 caracteres)
   - Cidade (opcional)
   - Paróquia (opcional)
3. Clique em "Criar conta"
4. Você será redirecionado para o Feed!

---

## 🎉 Pronto!

Agora você tem:
- ✅ Autenticação real com email/senha
- ✅ Banco de dados PostgreSQL
- ✅ Perfis de usuário
- ✅ Feed de publicações
- ✅ Comunidades
- ✅ Eventos
- ✅ Pedidos de oração
- ✅ Cursos de formação

---

## 🔧 Próximos Passos (Opcional)

### Habilitar Email de Confirmação

Por padrão, o Supabase exige confirmação de email. Para desabilitar (mais rápido para testes):

1. No Supabase, vá em **Authentication** → **Providers**
2. Clique em **Email**
3. Desative "Confirm email"
4. Clique em **Save**

### Upload de Imagens

Para permitir upload de avatares e capas:

1. No Supabase, vá em **Storage**
2. Os buckets já foram criados pelo schema SQL
3. Para fazer upload, use a função `uploadFile` do `src/lib/database.ts`

### Deploy na Vercel

1. Commit e push para o Git
2. Na Vercel, adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automático!

---

## 🐛 Problemas Comuns

### "Supabase não configurado"

- Verifique se o arquivo `.env` existe
- Verifique se as variáveis estão corretas
- Reinicie o servidor (`npm run dev`)

### Erro ao criar conta

- Verifique se o email já existe
- Senha deve ter mínimo 6 caracteres
- Username deve ser único

### Posts não aparecem

- Verifique se o schema SQL foi executado corretamente
- Abra o console do navegador (F12) para ver erros

---

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**Dúvidas?** Abra uma issue no GitHub ou entre em contato!
