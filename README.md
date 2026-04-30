# 🍔 Tenacious Burgers - Sistema de Gerenciamento de Lanchonetes

> **Software online de gerenciamento de lanchonetes com funcionalidades de produtos e pedidos**

## 📋 Visão Geral

O **Tenacious Burgers** é uma plataforma completa e escalável para gerenciamento de uma rede de lanchonetes (franquias). O sistema permite que franqueados gerenciem suas unidades, produtos e pedidos de forma centralizada, com controle de acesso por papéis de usuário (Admin, Franqueado, Cliente).

---

## 🏗️ Arquitetura da Aplicação

### Entidades Principais

#### 1. **Lanchonete**

- Representa cada unidade da franquia
- **Informações:**
  - Nome da lanchonete
  - Endereço (logradouro, número, bairro, cidade, estado)
  - CNPJ (registro único)
  - Status (ativa/inativa)
  - Data de criação e atualização

#### 2. **Produto**

- Itens vendidos pelas lanchonetes (hambúrguer, bebida, sobremesa, acompanhamento)
- **Informações:**
  - Nome do produto
  - Descrição detalhada
  - Preço
  - Categoria (Burgers, Bebidas, Acompanhamentos, Sobremesas)
  - Vínculo com lanchonete
  - Status (disponível/indisponível)

#### 3. **Pedido**

- Representa as compras realizadas pelos clientes
- **Informações:**
  - Número do pedido (único)
  - Data do pedido
  - Status (pendente, preparando, pronto, entregue, cancelado)
  - Cliente
  - Lanchonete
  - **Produtos incluídos** (múltiplos itens por pedido)
  - Valor total

### Relacionamentos

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────┐
│   Lanchonete    │◄───────►│   Produto    │         │  Pedido     │
│                 │ 1:N     │              │         │             │
│  - id           │         │  - id        │         │  - id       │
│  - nome         │         │  - nome      │────────►│  - data     │
│  - endereco     │         │  - preco     │ N:M     │  - status   │
│  - cnpj         │         │  - lanchonete_id      │  - total    │
│  - ativo        │         │  - ativo     │         │  - cliente  │
└─────────────────┘         └──────────────┘         └─────────────┘
       ▲                                                     │
       │                                                     │
       └─────────────────────────────────────────────────────┘
                  (um pedido pertence a uma lanchonete)
```

---

## 🔧 Tecnologias

### Backend

- **Framework:** Laravel 11 (PHP)
- **Autenticação:** Laravel Sanctum (JWT Tokens)
- **Banco de Dados:** MySQL/PostgreSQL
- **ORM:** Eloquent
- **Validação:** Form Requests do Laravel
- **API:** REST API com respostas JSON estruturadas

### Frontend

- **Framework:** React 18 + Vite
- **Linguagem:** TypeScript
- **Gerenciamento de Estado:** Context API + Hooks
- **Estilização:** Tailwind CSS
- **HTTP Client:** Axios com interceptadores
- **Componentes UI:** Shadcn/ui

### DevOps

- **Servidor Web:** Apache/Nginx
- **Versão PHP:** 8.2+
- **Gerenciador de Dependências:** Composer (Backend), npm (Frontend)
- **Testing:** Pest (Backend), Vitest (Frontend)

---

## 📡 Funcionalidades por Entidade

### 🍟 **Lanchonete (Franchise)**

| Método     | Endpoint              | Funcionalidade     | Autenticação | Localização                                                |
| ---------- | --------------------- | ------------------ | ------------ | ---------------------------------------------------------- |
| **POST**   | `/api/franquias`      | Criar franquia     | ✅ Token     | `backend/app/Http/Controllers/Api/FranchiseController.php` |
| **GET**    | `/api/franquias`      | Listar franquias   | ✅ Token     | `backend/app/Http/Controllers/Api/FranchiseController.php` |
| **GET**    | `/api/franquias/{id}` | Detalhar franquia  | ✅ Token     | `backend/app/Http/Controllers/Api/FranchiseController.php` |
| **PUT**    | `/api/franquias/{id}` | Atualizar franquia | ✅ Token     | `backend/app/Http/Controllers/Api/FranchiseController.php` |
| **DELETE** | `/api/franquias/{id}` | Remover franquia   | ✅ Token     | `backend/app/Http/Controllers/Api/FranchiseController.php` |

**Routes:** `backend/routes/api.php`

**Modelo:** `backend/app/Models/Franchise.php`

**Migração:** `backend/database/migrations/2026_04_27_144659_create_franchises_table.php`

---

### 📦 **Produto**

| Método     | Endpoint                                | Funcionalidade           | Autenticação | Localização                                              |
| ---------- | --------------------------------------- | ------------------------ | ------------ | -------------------------------------------------------- |
| **POST**   | `/api/produtos`                         | Criar produto            | ✅ Token     | `backend/app/Http/Controllers/Api/ProductController.php` |
| **GET**    | `/api/produtos`                         | Listar todos os produtos | ✅ Token     | `backend/app/Http/Controllers/Api/ProductController.php` |
| **GET**    | `/api/produtos/{id}`                    | Detalhar produto         | ✅ Token     | `backend/app/Http/Controllers/Api/ProductController.php` |
| **PUT**    | `/api/produtos/{id}`                    | Atualizar produto        | ✅ Token     | `backend/app/Http/Controllers/Api/ProductController.php` |
| **DELETE** | `/api/produtos/{id}`                    | Remover produto          | ✅ Token     | `backend/app/Http/Controllers/Api/ProductController.php` |
| **GET**    | `/api/franquias/{franchiseId}/produtos` | Produtos de uma franquia | ✅ Token     | `backend/app/Http/Controllers/Api/ProductController.php` |

**Status:** ✅ **Implementado**

**Campos:** nome, descricao, preco, categoria (BURGER, BEBIDA, ACOMPANHAMENTO, SOBREMESA), ativo

**Model:** `backend/app/Models/Product.php`

**Controller:** `backend/app/Http/Controllers/Api/ProductController.php`

**Migração:** `backend/database/migrations/2026_04_29_100000_create_products_table.php`

**Routes:** `backend/routes/api.php`

---

### 🛒 **Pedido**

| Método     | Endpoint                               | Funcionalidade                     | Autenticação | Localização                                            |
| ---------- | -------------------------------------- | ---------------------------------- | ------------ | ------------------------------------------------------ |
| **POST**   | `/api/pedidos`                         | Criar pedido                       | ✅ Token     | `backend/app/Http/Controllers/Api/OrderController.php` |
| **GET**    | `/api/pedidos`                         | Listar todos os pedidos            | ✅ Token     | `backend/app/Http/Controllers/Api/OrderController.php` |
| **GET**    | `/api/pedidos/{id}`                    | Detalhar pedido                    | ✅ Token     | `backend/app/Http/Controllers/Api/OrderController.php` |
| **PUT**    | `/api/pedidos/{id}`                    | Atualizar status do pedido         | ✅ Token     | `backend/app/Http/Controllers/Api/OrderController.php` |
| **DELETE** | `/api/pedidos/{id}`                    | Cancelar pedido                    | ✅ Token     | `backend/app/Http/Controllers/Api/OrderController.php` |
| **GET**    | `/api/franquias/{franchiseId}/pedidos` | Pedidos de uma franquia            | ✅ Token     | `backend/app/Http/Controllers/Api/OrderController.php` |
| **GET**    | `/api/meus-pedidos`                    | Meus pedidos (usuário autenticado) | ✅ Token     | `backend/app/Http/Controllers/Api/OrderController.php` |

**Status:** ✅ **Implementado**

**Campos:** numero_pedido (único), status (PENDENTE, PREPARANDO, PRONTO, ENTREGUE, CANCELADO), total, franchise_id, user_id

**Model:** `backend/app/Models/Order.php`

**Controller:** `backend/app/Http/Controllers/Api/OrderController.php`

**Migração:** `backend/database/migrations/2026_04_29_100001_create_orders_table.php`

**Routes:** `backend/routes/api.php`

**Order Items (Relacionamento N:M):**

- **Migração:** `backend/database/migrations/2026_04_29_100002_create_order_items_table.php`
- **Campos:** quantity, preco_unitario, subtotal

---

### 👤 **Autenticação**

| Método   | Endpoint             | Funcionalidade          | Autenticação | Localização                                           |
| -------- | -------------------- | ----------------------- | ------------ | ----------------------------------------------------- |
| **POST** | `/api/auth/login`    | Fazer login             | ❌ Público   | `backend/app/Http/Controllers/Api/AuthController.php` |
| **POST** | `/api/auth/register` | Registrar usuário       | ❌ Público   | `backend/app/Http/Controllers/Api/AuthController.php` |
| **POST** | `/api/auth/logout`   | Fazer logout            | ✅ Token     | `backend/app/Http/Controllers/Api/AuthController.php` |
| **GET**  | `/api/auth/me`       | Dados do usuário logado | ✅ Token     | `backend/app/Http/Controllers/Api/AuthController.php` |

**Controller:** `backend/app/Http/Controllers/Api/AuthController.php`

**Routes:** `backend/routes/api.php`

---

## ✅ Requisitos Implementados

### Banco de Dados

- ✅ **Banco Relacional:** MySQL/PostgreSQL com Migrations do Laravel
- ✅ **Relacionamentos:** One-to-Many (Lanchonete ↔ Produto, Lanchonete ↔ Pedido)
- ✅ **Foreign Keys:** Relacionamentos com integridade referencial
- ✅ **Índices:** Otimizados para performance
- ✅ **Timestamps:** created_at, updated_at em todas as tabelas

### Validação

- ✅ **Validação no Backend:** Laravel Form Requests com regras customizadas
- ✅ **Campos Obrigatórios:** name, email, password, CNPJ, etc validados
- ✅ **Validação Unique:** Email e CNPJ únicos no banco
- ✅ **Mensagens Personalizadas:** Feedback claro para o usuário
- ✅ **Sanitização:** Limpeza de dados de entrada

### Código

- ✅ **Organização:** Pastas estruturadas (Controllers, Models, Requests, Services)
- ✅ **Legibilidade:** Código comentado e bem formatado
- ✅ **Padrões:** MVC no backend, Component-based no frontend
- ✅ **Type Safety:** TypeScript no frontend, Type hints no PHP
- ✅ **DRY:** Reutilização de código através de Services e Traits

### Segurança

- ✅ **Autenticação:** JWT via Laravel Sanctum
- ✅ **Autorização:** Middleware de permissões por role
- ✅ **CORS:** Configurado para frontend local
- ✅ **Hash de Senhas:** Bcrypt
- ✅ **CSRF:** Proteção do Laravel

---

## 🚀 Como Executar

### Pré-requisitos

- PHP 8.2+
- Node.js 18+
- MySQL 8.0+ ou PostgreSQL 14+
- Composer
- npm ou pnpm

### Backend (Laravel)

```bash
# Entrar na pasta
cd backend

# Instalar dependências
composer install

# Copiar arquivo de ambiente
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Executar migrações e seeders
php artisan migrate:fresh --seed

# Rodar servidor
php artisan serve
```

**Servidor disponível em:** `http://localhost:8000`

### Frontend (React)

```bash
# Entrar na pasta
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env (opcional)
cp .env.example .env

# Rodar servidor de desenvolvimento
npm run dev
```

**Servidor disponível em:** `http://localhost:5173`

---

## 🔐 Credenciais de Teste

| Tipo           | Email                    | Senha  | Acesso                        |
| -------------- | ------------------------ | ------ | ----------------------------- |
| **Cliente**    | cliente@tenacious.com    | 123456 | Home, Cardápio, Pedidos       |
| **Franqueado** | franqueado@tenacious.com | 123456 | `/admin` - Produtos, Pedidos  |
| **Admin**      | admin@tenacious.com      | 123456 | `/admin` - Dashboard Completo |

---

## 📂 Estrutura de Pastas

```
FRANQUIA_LANCHONETES_API/
│
├── backend/                          # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/
│   │   │   │   │   ├── AuthController.php
│   │   │   │   │   ├── FranchiseController.php
│   │   │   │   │   ├── ProductController.php
│   │   │   │   │   └── OrderController.php
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Franchise.php
│   │   │   ├── Product.php
│   │   │   └── Order.php
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   │   ├── api.php                  # Rotas da API
│   │   └── web.php
│   ├── config/
│   │   ├── app.php
│   │   ├── auth.php
│   │   └── cors.php
│   └── tests/
│
├── frontend/                         # React + TypeScript
│   ├── src/
│   │   ├── services/
│   │   │   ├── api.ts               # Axios centralizado
│   │   │   ├── authService.ts
│   │   │   └── franchiseService.ts
│   │   ├── types/
│   │   │   └── api.ts               # Tipos TypeScript
│   │   ├── hooks/
│   │   │   └── useApi.ts            # Hook customizado
│   │   ├── app/
│   │   │   ├── context/
│   │   │   │   └── AuthContext.tsx  # Gerenciamento de auth
│   │   │   └── components/          # Componentes React
│   │   └── pages/                   # Páginas da app
│   ├── index.html
│   ├── .env
│   └── vite.config.js
│
├── README.md                         # Este arquivo
└── GUIA_EXECUCAO.md                 # Guia de execução
```

---

## 🎯 Fluxo de Negócio

### 1. **Registro e Login**

```
Cliente → Página de Registro → Criar Conta → Login → Token JWT → Dashboard
```

### 2. **Compra de Produtos**

```
Cliente → Ver Cardápio → Adicionar ao Carrinho → Fazer Pedido → Sistema registra
```

### 3. **Gerenciamento de Franquia (Admin)**

```
Franqueado → /admin → Gerenciar Produtos → Gerenciar Pedidos → Análises
```

---

## 🔄 Fluxo de Autenticação

1. Usuário envia credenciais para `/api/auth/login`
2. Backend valida e retorna **JWT Token**
3. Frontend armazena token em `localStorage`
4. Cada requisição inclui o token no header: `Authorization: Bearer <token>`
5. Backend valida o token no middleware `auth:sanctum`
6. Logout remove o token do backend e frontend

---

## 🧪 Testes

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

---

## 📊 Modelos de Dados

### Users (Usuários)

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('ADMIN', 'FRANQUEADO', 'CLIENTE'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Franchises (Lanchonetes)

```sql
CREATE TABLE franchises (
  id BIGINT PRIMARY KEY,
  nome VARCHAR(255),
  endereco TEXT,
  cnpj VARCHAR(14) UNIQUE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Produtos (Implementado)

```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  franchise_id BIGINT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  categoria ENUM('BURGER', 'BEBIDA', 'ACOMPANHAMENTO', 'SOBREMESA'),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE
);
```

### Pedidos (Implementado)

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  franchise_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  numero_pedido VARCHAR(20) UNIQUE NOT NULL,
  status ENUM('PENDENTE', 'PREPARANDO', 'PRONTO', 'ENTREGUE', 'CANCELADO'),
  total DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Order Items (Implementado)

```sql
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantidade INT DEFAULT 1,
  preco_unitario DECIMAL(10, 2),
  subtotal DECIMAL(10, 2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY (order_id, product_id)
);
```

---

## 🤝 Contribuindo

Para adicionar novas funcionalidades:

1. Criar branch para feature: `git checkout -b feature/nova-funcionalidade`
2. Implementar a funcionalidade
3. Testar localmente
4. Fazer commit com mensagem clara
5. Criar Pull Request

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a documentação
2. Verifique os logs do backend: `storage/logs/laravel.log`
3. Verifique o console do navegador
4. Confira o Network tab do DevTools

---

## 📜 Licença

Este projeto é propriedade da Tenacious Burgers. Todos os direitos reservados.

---

## 🎉 Status do Projeto

### ✅ Implementado

- **Autenticação:** Login, Register, Logout, Get User
- **Lanchonetes:** CRUD completo (nome, endereco, cnpj único, ativo)
- **Users:** Com roles (ADMIN, FRANQUEADO, CLIENTE)

### 🚧 A Fazer

- **Produtos:** Model → Migration → Controller → Endpoints
- **Pedidos:** Model → Migration → Controller → Endpoints
- **Order Items:** Relacionamento N:M entre Pedidos e Produtos
- **Análises e Relatórios:** Planejado
- **Notificações em Tempo Real:** Planejado

---

**Última atualização:** 29 de Abril de 2026

**Desenvolvido com ❤️ para franquias de lanchonetes modernas**
