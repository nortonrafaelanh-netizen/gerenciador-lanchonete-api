# Guia de Execução - Tenacious Burgers

## Pré-requisitos

- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL ou MySQL rodando localmente

---

## Backend (Laravel)

### 1. Instalar dependências

```bash
cd backend
composer install
```

### 2. Configurar ambiente

```bash
cp .env.example .env
php artisan key:generate
```

Edite o `.env` com as credenciais do banco:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tenacious_burgers
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

### 3. Executar migrações e seeders

```bash
php artisan migrate:fresh --seed
```

Isso irá:

- Resetar o banco de dados
- Criar todas as tabelas (users, franchises, products, orders, order_items)
- Popular usuários de teste, franquias e produtos de exemplo

### 4. Rodar o servidor

```bash
php artisan serve
```

API disponível em: `http://localhost:8000`

---

## Frontend (React + Vite)

### 1. Instalar dependências

```bash
cd frontend
npm install
```

### 2. Configurar ambiente

O arquivo `.env` já deve conter:

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

App disponível em: `http://localhost:5173`

---

## Credenciais de Teste

| Role       | Email                      | Senha    | Acesso                              |
| ---------- | -------------------------- | -------- | ----------------------------------- |
| Franqueado | `franqueado@tenacious.com` | `123456` | `/admin` — gerencia cardápio e home |
| Admin      | `admin@tenacious.com`      | `123456` | `/admin` — acesso total             |
| Cliente    | `cliente@tenacious.com`    | `123456` | Home, cardápio e pedidos            |

---

## Fluxo de Simulação

### Como franqueado

1. Acesse `/login` e entre com `franqueado@tenacious.com`
2. Vá para `/admin` → aba **Cardápio**
3. Crie, edite ou exclua produtos e combos
4. Vá para aba **Home**
   - Em **Ofertas do Dia**: adicione produtos com preço promocional e datas de validade
   - Em **Combos Legendários**: selecione até 2 combos para destaque
   - Em **Banner Hero**: cole a URL de uma imagem de fundo
5. Clique em **Publicar Alterações** — as mudanças aparecem na home imediatamente

### Como cliente

1. Acesse `/login` e entre com `cliente@tenacious.com`
2. Navegue pelo cardápio (Burgers, Hot Dogs, Acompanhamentos, Combos)
3. Adicione itens ao carrinho
4. Finalize o pedido
5. Acompanhe o status em **Meus Pedidos**

### Acompanhamento de pedido (franqueado)

1. No painel admin, veja os pedidos recebidos
2. Avance o status: `PENDENTE → PREPARANDO → PRONTO → ENTREGUE`

---

## Rotas da API

### Públicas (sem autenticação)

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/produtos
GET    /api/produtos/{id}
GET    /api/home-data
GET    /api/franchise/{franchise}/home-config
GET    /api/franquias/{id}/produtos
```

### Protegidas (requer token Bearer)

```
GET    /api/auth/me
POST   /api/auth/logout

POST   /api/produtos
PUT    /api/produtos/{id}
DELETE /api/produtos/{id}

POST   /api/pedidos
GET    /api/pedidos
GET    /api/pedidos/{id}
PUT    /api/pedidos/{id}
DELETE /api/pedidos/{id}
GET    /api/meus-pedidos
GET    /api/franquias/{id}/pedidos

POST   /api/franchise/{franchise}/home-config
```

---

## Proteção de Rotas no Frontend

| Rota            | Requisito                       |
| --------------- | ------------------------------- |
| `/admin`        | Autenticado + role `FRANQUEADO` |
| `/checkout`     | Autenticado                     |
| `/meus-pedidos` | Autenticado                     |
| Demais rotas    | Públicas                        |

Sem autenticação → redireciona para `/login`
Com role incorreto → exibe tela de acesso restrito

---

## Troubleshooting

### Erro de CORS

Verifique `backend/config/cors.php`:

```php
'allowed_origins' => ['http://localhost:5173'],
```

### "Token not found" ou 401

```bash
# No console do navegador:
localStorage.clear()
```

Depois faça login novamente.

### Banco de dados não existe

```bash
cd backend
php artisan migrate:fresh --seed
```

### Porta em uso

```bash
# Backend em outra porta:
php artisan serve --port=8001

# Frontend em outra porta:
npm run dev -- --port=5174
```

Lembre de atualizar `VITE_API_URL` no `.env` do frontend se mudar a porta do backend.

### Imagens não carregam

Os produtos usam URLs externas (Unsplash). Verifique sua conexão com a internet ou substitua por URLs acessíveis no seu ambiente.

### Home não reflete as alterações do admin

1. Certifique-se de clicar em **Publicar Alterações** no HomeManager
2. Verifique no Network tab se o `POST /api/franchise/1/home-config` retornou 200
3. Recarregue a página inicial

---

## Testes

### Backend (Pest)

```bash
cd backend
php artisan test
```

### Frontend (Vitest)

```bash
cd frontend
npm run test
```
