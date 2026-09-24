# ⚡ CONFIGURAÇÃO RÁPIDA - LUMEN (5 minutos)

## 🎯 PASSO 1: Criar conta no Supabase

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"**
3. Faça login com GitHub (mais rápido)

---

## 🎯 PASSO 2: Criar projeto

1. Clique em **"New Project"**
2. Preencha:
   - **Organization**: Selecione a sua
   - **Name**: `lumen`
   - **Database Password**: Crie uma senha forte (ex: `Lumen@2025!Xyz`)
   - **Region**: `South America (São Paulo)` ou a mais próxima
   - **Pricing Plan**: Free (gratuito)

3. Clique em **"Create new project"**
4. **Aguarde ~2 minutos** até o projeto estar pronto

---

## 🎯 PASSO 3: Executar o Schema SQL

1. No menu lateral do Supabase, clique em **"SQL Editor"** (ícone de código)
2. Clique em **"New Query"**
3. Abra o arquivo **`supabase/schema.sql`** deste projeto
4. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
5. **Cole no SQL Editor** do Supabase (Ctrl+V)
6. Clique no botão **"Run"** (botão verde no canto inferior direito)
7. Aguarde aparecer: **"Success. No rows returned"**

✅ Pronto! O banco de dados está criado.

---

## 🎯 PASSO 4: Copiar credenciais

1. No menu lateral, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Você verá duas informações importantes:

   **Project URL:**
   ```
   https://abcdefghijk.supabase.co
   ```
   
   **anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0...
   ```

4. **Copie ambos** (você vai precisar deles)

---

## 🎯 PASSO 5: Criar arquivo .env

1. Na raiz do projeto, crie um arquivo chamado **`.env`** (sem extensão)
2. Cole o seguinte conteúdo:

```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Substitua** os valores com os dados que você copiou no passo anterior
4. **Salve o arquivo**

---

## 🎯 PASSO 6: Desabilitar confirmação de email (opcional)

Para testes mais rápidos, desabilite a confirmação de email:

1. No Supabase, vá em **"Authentication"** (menu lateral)
2. Clique em **"Providers"**
3. Clique em **"Email"**
4. **Desative** a opção **"Confirm email"**
5. Clique em **"Save"**

✅ Agora você pode criar contas sem precisar confirmar email.

---

## 🎯 PASSO 7: Reiniciar o servidor

1. Pare o servidor (Ctrl+C no terminal)
2. Execute novamente:

```bash
npm run dev
```

3. Acesse: **http://localhost:3000**

---

## 🎉 PRONTO!

Agora você pode:
- ✅ Criar conta
- ✅ Fazer login
- ✅ Publicar no feed
- ✅ Entrar em comunidades
- ✅ Participar de eventos
- ✅ E muito mais!

---

## 🐛 Problemas?

### "Supabase não configurado" ainda aparece

- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se as variáveis estão corretas (sem espaços extras)
- Reinicie o servidor (`npm run dev`)

### Erro ao criar conta

- Verifique se o email já existe
- Senha deve ter mínimo 6 caracteres
- Username deve ser único

### Erro no SQL

- Verifique se copiou TODO o conteúdo do schema.sql
- Tente executar novamente
- Verifique se o projeto Supabase está ativo

---

## 📞 Precisa de ajuda?

- Documentação completa: **README.md**
- Guia detalhado: **SETUP.md**
- Schema do banco: **supabase/schema.sql**

---

**Dica:** Salve a senha do banco de dados em um local seguro! Você vai precisar dela para acessar o banco diretamente se necessário.
