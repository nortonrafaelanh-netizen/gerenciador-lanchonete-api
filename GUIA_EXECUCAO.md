# Guia de Execução - Tenacious Burgers API

## Backend (Laravel)

### 1. Executar Migrações

```bash
cd backend
php artisan migrate:fresh --seed
```

Isso irá:

- Resetar o banco de dados
- Criar todas as tabelas
- Popular usuários de teste via seeder

### 2. Rodar Servidor Laravel

```bash
php artisan serve
```

Servidor estará disponível em: `http://localhost:8000`

## Frontend (React + Vite)

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

### 2. Rodar Servidor de Desenvolvimento

```bash
npm run dev
```

Servidor estará disponível em: `http://localhost:5173`

## Credenciais de Teste

### Franqueado (Acesso ao Admin)

- **Email**: franqueado@tenacious.com
- **Senha**: 123456
- **Acesso**: /admin

### Cliente (Acesso ao E-commerce)

- **Email**: cliente@tenacious.com
- **Senha**: 123456
- **Acesso**: Home, Burgers, Dogs, Acompanhamentos

### Admin (Super Franqueado)

- **Email**: admin@tenacious.com
- **Senha**: 123456
- **Acesso**: /admin

## Rotas Disponíveis

### Públicas

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário

### Protegidas (Requer Token)

- `GET /api/auth/me` - Dados do usuário autenticado
- `POST /api/auth/logout` - Logout
- `GET /api/franquias` - Listar franquias
- `POST /api/franquias` - Criar franquia
- `GET /api/franquias/{id}` - Obter franquia
- `PUT /api/franquias/{id}` - Atualizar franquia
- `DELETE /api/franquias/{id}` - Deletar franquia

## Fluxo de Autenticação

1. Usuário acessa `/login`
2. Envia credenciais para `/api/auth/login`
3. Backend retorna token JWT e dados do usuário
4. Frontend armazena token em localStorage
5. Cada request inclui o token no header `Authorization: Bearer <token>`
6. Ao fazer logout, token é deletado no backend e no localStorage

## Modal de Produtos (Admin)

O painel do franqueado permite:

- ✅ Criar novo produto
- ✅ Editar produto existente
- ✅ Deletar produto
- ✅ Visualizar cardápio completo
- ✅ Gerenciar categorias

## Proteção de Rotas

- `/admin` - Apenas usuários com role `FRANQUEADO`
- Sem autenticação: redireciona para `/login`
- Com role errado: mostra mensagem de acesso restrito

## Troubleshooting

### Erro de CORS

Verifique `backend/config/cors.php` - debe incluir `http://localhost:5173`

### Erro "Token not found"

- Faça login novamente
- Limpe o localStorage: `localStorage.clear()`
- Verifique se o token está sendo enviado no header

### Banco de dados não existe

Execute: `php artisan migrate:fresh --seed`

### Porta em uso

- Backend: mude em `php artisan serve --port=8001`
- Frontend: mude em `npm run dev -- --port=5174`
