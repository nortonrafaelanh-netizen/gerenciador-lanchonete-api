# 🍔 Tenacious Burgers - Sistema de Gerenciamento de Lanchonetes

> Plataforma para gestão de produtos, pedidos e franquias com controle de acesso de franqueado, cliente e admin.

---

## 📋 Visão Geral

O **Tenacious Burgers** permite que franqueados gerenciem cardápios, promoções e pedidos, enquanto clientes fazem pedidos online e acompanham o status em tempo real.

---

## ✅ Integração entre Frontend e Backend

### Status atual

- O frontend consome a API via `axios` com base URL `http://localhost:8000/api`.
- O token do usuário é enviado automaticamente em todas as requisições autenticadas via interceptor.
- CRUD completo de produtos e pedidos funciona com o backend Laravel.
- `COMBO` aceito como categoria válida no backend e no frontend.
- O frontend usa o `id` numérico do pedido para atualizar status via `PUT /api/pedidos/{id}`.
- Home Config (ofertas, combos em destaque e banner) é salva e carregada do backend.

---

## 🏗️ Arquitetura

### Backend

- Laravel
- Sanctum para autenticação
- Eloquent ORM
- Migrations e seeders
- API REST JSON

### Frontend

- React 18 + Vite
- TypeScript
- Tailwind CSS
- Axios
- Context API

---

## 🧾 Endpoints Principais

### Autenticação

| Método | Rota                 | Auth | Descrição     |
| ------ | -------------------- | ---- | ------------- |
| POST   | `/api/auth/login`    | ❌   | Login         |
| POST   | `/api/auth/register` | ❌   | Registro      |
| POST   | `/api/auth/logout`   | ✅   | Logout        |
| GET    | `/api/auth/me`       | ✅   | Usuário atual |

### Produtos

| Método | Rota                           | Auth | Descrição            |
| ------ | ------------------------------ | ---- | -------------------- |
| GET    | `/api/produtos`                | ❌   | Listar todos         |
| POST   | `/api/produtos`                | ✅   | Criar produto        |
| GET    | `/api/produtos/{id}`           | ❌   | Detalhe              |
| PUT    | `/api/produtos/{id}`           | ✅   | Atualizar            |
| DELETE | `/api/produtos/{id}`           | ✅   | Excluir              |
| GET    | `/api/franquias/{id}/produtos` | ❌   | Produtos da franquia |

### Home Config

| Método | Rota                                     | Auth | Descrição           |
| ------ | ---------------------------------------- | ---- | ------------------- |
| GET    | `/api/franchise/{franchise}/home-config` | ❌   | Ler configuração    |
| POST   | `/api/franchise/{franchise}/home-config` | ✅   | Salvar configuração |

**Payload de atualização da home:**

```json
{
  "daily_offers_ids": ["1", "2", "3"],
  "featured_ids": ["5", "8"],
  "banner_url": "https://exemplo.com/banner.jpg",
  "offers_data": {
    "1": {
      "price": 19.9,
      "originalPrice": 24.9,
      "activeFrom": "2026-05-01",
      "activeTo": "2026-05-07"
    }
  }
}
```

> O backend também aceita as chaves em camelCase (`dailyOffersIds`, `offersData`).

### Pedidos

| Método | Rota                          | Auth | Descrição           |
| ------ | ----------------------------- | ---- | ------------------- |
| POST   | `/api/pedidos`                | ✅   | Criar pedido        |
| GET    | `/api/pedidos`                | ✅   | Listar pedidos      |
| GET    | `/api/pedidos/{id}`           | ✅   | Detalhe             |
| PUT    | `/api/pedidos/{id}`           | ✅   | Atualizar status    |
| DELETE | `/api/pedidos/{id}`           | ✅   | Cancelar            |
| GET    | `/api/franquias/{id}/pedidos` | ✅   | Pedidos da franquia |
| GET    | `/api/meus-pedidos`           | ✅   | Pedidos do cliente  |

---

## 🎯 Painel do Franqueado (`/admin`)

### Aba Cardápio

- Criar, editar e excluir produtos e combos
- Filtrar por categoria e cidade/franquia
- Suporte a categorias: Burger, Hot Dog, Acompanhamento, Combo

### Aba Home

Gerencia a vitrine da página inicial em três seções:

| Seção              | O que faz                                              | Conectado à Home? |
| ------------------ | ------------------------------------------------------ | :---------------: |
| Ofertas do Dia     | Define até 6 produtos com preço promocional e validade |        ✅         |
| Combos Legendários | Seleciona até 2 combos para destaque                   |        ✅         |
| Banner Hero        | Define a URL da imagem de fundo do topo                |        ✅         |

---

## 🔄 Fluxo de Autenticação

1. Usuário envia credenciais para `/api/auth/login`
2. Backend valida e retorna **token Sanctum**
3. Frontend armazena token em `localStorage`
4. Cada requisição inclui `Authorization: Bearer <token>`
5. Backend valida o token via middleware `auth:sanctum`
6. Logout remove o token do backend e do `localStorage`

---

## 📊 Modelos de Dados

### Users

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

### Franchises

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

### Products

```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  franchise_id BIGINT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  categoria ENUM('BURGER','BEBIDA','ACOMPANHAMENTO','SOBREMESA','COMBO','DOG'),
  imagem VARCHAR(500),
  ativo BOOLEAN DEFAULT true,
  is_offer BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE
);
```

### Orders

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  franchise_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  numero_pedido VARCHAR(20) UNIQUE NOT NULL,
  status ENUM('PENDENTE','PREPARANDO','PRONTO','ENTREGUE','CANCELADO'),
  total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Order Items

```sql
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantidade INT DEFAULT 1,
  preco_unitario DECIMAL(10,2),
  subtotal DECIMAL(10,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY (order_id, product_id)
);
```

---

## 📂 Estrutura de Pastas

```
FRANQUIA_LANCHONETES_API/
│
├── backend/                              # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── FranchiseController.php
│   │   │   ├── ProductController.php
│   │   │   └── OrderController.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Franchise.php
│   │       ├── Product.php
│   │       └── Order.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
└── frontend/                             # React + TypeScript
    └── src/
        ├── app/
        │   ├── components/
        │   │   ├── ProductCard.tsx       # Card de produto (home/listas)
        │   │   ├── ProductModal.tsx      # Modal criar/editar produto
        │   │   └── HomeManager.tsx       # Painel de configuração da home
        │   ├── context/
        │   │   ├── AuthContext.tsx
        │   │   ├── CartContext.tsx
        │   │   └── ProductContext.tsx
        │   ├── data/
        │   │   └── products.ts           # Dados de fallback (offline)
        │   └── types/
        │       └── product.ts
        ├── pages/
        │   ├── Home.tsx                  # Página inicial
        │   ├── Admin.tsx                 # Painel do franqueado
        │   ├── ProductDetails.tsx
        │   ├── Burgers.tsx
        │   ├── Sides.tsx
        │   ├── Drinks.tsx
        │   └── Login.tsx
        └── services/
            └── api.ts                    # Axios centralizado
```

---

## 🧪 Contas de Teste

| Role       | Email                      | Senha    | Acesso            |
| ---------- | -------------------------- | -------- | ----------------- |
| Franqueado | `franqueado@tenacious.com` | `123456` | `/admin`          |
| Admin      | `admin@tenacious.com`      | `123456` | `/admin`          |
| Cliente    | `cliente@tenacious.com`    | `123456` | Home e e-commerce |

---

## 🎉 Status do Projeto

### ✅ Implementado

- Autenticação completa (login, register, logout, me)
- CRUD de produtos com categorias (Burger, Dog, Bebida, Acompanhamento, Combo)
- CRUD de pedidos com controle de status
- Painel do franqueado com gestão de cardápio
- Home Manager: ofertas do dia, combos em destaque e banner hero — todos conectados à Home
- Carrinho de compras
- Página de detalhes do produto
- Filtros por categoria e franquia
- Fallback para dados locais quando API está offline

### 🚧 Planejado

- Análises e relatórios de vendas
- Notificações em tempo real (WebSocket)
- Upload de imagens diretamente no painel
- Módulo de gestão de clientes

---

**Última atualização:** Maio de 2026

**Desenvolvido com amor para franquias de lanchonetes modernas**
