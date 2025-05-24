# Customer Service API

Este projeto implementa um serviço de cadastro, consulta, atualização e listagem de clientes, utilizando Clean Architecture, SOLID, Docker, Redis Cache e RabbitMQ para mensageria.

## 🛠️ Tecnologias

- **Node.js** v18+ (TypeScript + Express)
- **MongoDB** (Mongoose)
- **Redis** (ioredis)
- **RabbitMQ** (amqplib, callback API)
- **Jest** + ts-jest para testes unitários
- **Docker** e **Docker Compose** para containerização

## 🏗️ Arquitetura

```plaintext
src/
├── application/
│   ├── dtos/             # Data transfer objects
│   └── use-cases/        # Business logic (Use Cases)
├── domain/
│   ├── entities/         # Core domain models (e.g. Customer, BaseEntity)
│   ├── providers/        # Abstrações de serviços (cache, messaging)
│   └── repositories/     # Interfaces de repositório (ports)
├── infra/                # Implementações concretas (adapters)
│   ├── cache/            # RedisCacheProvider
│   ├── config/           # Configuração (.env, constantes)
│   ├── database/         # MongoClient, schemas/, repositories/
│   └── messaging/        # RabbitProducer, RabbitConsumer
└── main/                 # Composition root e adaptação
    ├── adapters/         # Express controllers, outros adapters de entrada
    ├── factories/        # Fabrics para os Use Cases
    ├── routes.ts         # Registro de rotas HTTP
    └── server.ts         # Bootstrap do servidor Express
```

### Principais camadas

- **Domain**: definições puras, sem dependências de frameworks.
- **Application**: regras de negócio (use cases) independentes de infra.
- **Infra**: implementações concretas de repos, cache e mensageria.
- **Main**: montagem (factories), bootstrap HTTP e worker de mensageria.

## 🚀 Como executar

### Pré-requisitos

- Docker & Docker Compose
- Node.js v18+ e Yarn

### Rodando via Docker Compose

1. Copie o `.env.example` para `.env` e ajuste variáveis, se necessário.
2. Suba containers:

   ```bash
   docker-compose up --build -d
   ```

3. A API HTTP ficará em `http://localhost:3000`.
4. RabbitMQ Management UI: `http://localhost:15672` (guest/guest).

### Rodando local sem Docker

1. Instale dependências:

   ```bash
   yarn install
   ```

2. Configure `.env` com:

   ```env
   MONGO_URI=mongodb://localhost:27017/customers
   REDIS_URL=redis://localhost:6379
   RABBIT_URL=amqp://localhost:5672
   RABBIT_EXCH=customer.exchange
   PORT=3000
   ```

3. Inicie MongoDB, Redis e RabbitMQ localmente.
4. Compile e rode:

   ```bash
   yarn build
   yarn start
   ```

## 📡 Endpoints

- **POST /customers**
  Cria um cliente.

  - Body: `{ name, email, phone }`
  - Resposta: `201 Created` com objeto `Customer`.

- **GET /customers**
  Retorna listagem (cacheada).

  - Resposta: `200 OK` com `Customer[]`.

- **GET /customers/\:id**
  Consulta por ID (cacheada).

  - Resposta: `200 OK` ou `404 Not Found`.

- **PUT /customers/\:id**
  Atualiza campos de cliente.

  - Body: `{ name?, email?, phone? }`
  - Resposta: `200 OK` ou `404 Not Found`.

## 🧪 Testes

- Unitários com Jest + ts-jest:

  ```bash
  yarn test
  ```

- Cobertura 100% na camada de Use Cases.

## 🔄 Mensageria

- No momento da criação, emite evento `customer.created` via RabbitMQ (exchange fanout).
- Worker consome da fila `customer_logs` e executa o Use Case de impressão de log.

## 💡 Contribuindo

1. Faça um fork deste repositório.
2. Crie uma branch com sua feature: `git checkout -b feature/meu-topico`
3. Commit suas mudanças: `git commit -m 'feat: descrição da feature'`
4. Envie para a branch: `git push origin feature/meu-topico`
5. Abra um Pull Request.

## 📄 Licença

MIT © Luan Prestes
