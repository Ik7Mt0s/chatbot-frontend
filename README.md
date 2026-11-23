# 💬 RevGás Chatbot — Frontend

Interface web para simulação de conversas entre clientes e o assistente virtual da **RevGás**, desenvolvida com **React, TypeScript e Vite**.

O projeto permite interagir com um chatbot de inteligência artificial por meio de uma interface de mensagens, simulando a experiência de atendimento via WhatsApp.

A aplicação se comunica com uma API REST desenvolvida em **Python e FastAPI**, responsável pelo processamento das mensagens, gerenciamento das conversas e integração com o agente de inteligência artificial.

---

## 📌 Sobre o projeto

O **RevGás Chatbot** é um projeto voltado à automação do atendimento ao cliente de uma revenda de gás.

Seu objetivo é oferecer uma experiência de atendimento automatizado, permitindo que clientes conversem com um assistente virtual para esclarecer dúvidas, informar seus dados e solicitar produtos.

Este repositório contém exclusivamente o **frontend da aplicação**, responsável pela interface visual e pela comunicação com o backend.

O frontend foi desenvolvido para funcionar como um **simulador de conversas**, possibilitando testar o comportamento do chatbot antes de sua futura integração com o WhatsApp.

### 🎯 Objetivos

- Simular o atendimento de um cliente por meio de uma interface de chat.
- Permitir a comunicação em tempo real, por requisição e resposta, com o agente de IA.
- Identificar diferentes conversas por número de telefone.
- Recuperar históricos de mensagens armazenados no backend.
- Facilitar os testes e a demonstração das funcionalidades do chatbot.
- Manter uma arquitetura desacoplada entre frontend e backend.

---

## ✨ Funcionalidades

### 💬 Interface de chat

A aplicação disponibiliza uma interface de mensagens na qual o usuário pode:

- Enviar mensagens ao assistente virtual.
- Visualizar as respostas geradas pela IA.
- Acompanhar o indicador de processamento enquanto aguarda uma resposta.
- Consultar mensagens anteriores de uma conversa.
- Continuar digitando enquanto o chatbot processa a mensagem anterior.
- Enviar mensagens utilizando a tecla `Enter` ou o botão de envio.

### 📱 Identificação por telefone

Cada conversa é identificada por um número de telefone.

O frontend utiliza inicialmente o número:

```text
5586999999999
```

O usuário pode substituí-lo para simular o atendimento de outro cliente.

Ao selecionar um número, o frontend consulta o backend e recupera o histórico correspondente.

### 💾 Persistência local dos números

A aplicação utiliza a API `localStorage` do navegador para armazenar os números de telefone utilizados.

Isso permite:

- Salvar automaticamente novos números.
- Visualizar os números anteriormente utilizados.
- Alternar rapidamente entre conversas.
- Restaurar o último número selecionado ao atualizar a página.
- Remover números da lista local.

**Importante:** o `localStorage` armazena apenas os números e a seleção atual. O histórico das mensagens permanece sob responsabilidade do backend.

Remover um número da lista não exclui suas mensagens do banco de dados.

### 🔄 Histórico de conversas

Sempre que um telefone é selecionado, a aplicação solicita ao backend o histórico de mensagens daquele número.

As mensagens são exibidas conforme seus respectivos papéis:

- `user`: mensagens enviadas pelo cliente.
- `assistant`: respostas produzidas pelo chatbot.

### 📐 Interface responsiva

O frontend possui uma interface adaptável para diferentes tamanhos de tela, com:

- Barra lateral para identificação e seleção de conversas.
- Área principal de mensagens.
- Cabeçalho com identificação do assistente.
- Campo de envio de mensagens.
- Indicadores visuais de carregamento e erro.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Responsabilidade |
|---|---|
| React | Construção da interface |
| TypeScript | Tipagem estática e organização do código |
| Vite | Ambiente de desenvolvimento e build |
| CSS3 | Estilização e responsividade |
| Fetch API | Comunicação HTTP com o backend |
| LocalStorage API | Persistência local dos números |
| npm | Gerenciamento de dependências |

O frontend utiliza recursos nativos do navegador para realizar requisições HTTP e armazenar preferências locais.

---

## 🏗️ Arquitetura

O sistema utiliza uma arquitetura cliente-servidor, com frontend e backend mantidos em repositórios independentes.

```text
┌─────────────────────────────────────┐
│          CLIENTE / NAVEGADOR        │
│                                     │
│          React + TypeScript         │
│                                     │
│  - Interface de mensagens           │
│  - Seleção de telefone              │
│  - Histórico de conversas           │
│  - LocalStorage                     │
└─────────────────┬───────────────────┘
                  │
                  │ HTTP / JSON
                  ▼
┌─────────────────────────────────────┐
│             FASTAPI                 │
│                                     │
│  POST /api/chat/messages            │
│  GET  /api/chat/history/{phone}     │
│  GET  /health                       │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│          BACKEND REVGÁS             │
│                                     │
│  - Agente de IA (Agno)              │
│  - Gerenciamento de sessões         │
│  - Persistência de mensagens        │
│  - Cadastro de clientes             │
│  - Banco de dados SQLite            │
└─────────────────────────────────────┘
```

O frontend não executa diretamente o agente de inteligência artificial e não acessa o banco de dados.

Toda a lógica de conversação é processada pelo backend.

### Repositórios

**Frontend:**

https://github.com/Ik7Mt0s/chatbot-frontend

**Backend:**

Projeto independente responsável pela API REST, agente de IA e persistência das conversas.

---

## 📁 Estrutura do projeto

```text
chatbot-frontend/
├── public/
│   └── whatsapp.png
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   └── Chat.tsx
│   │
│   ├── services/
│   │   ├── chatService.ts
│   │   └── phoneStorage.ts
│   │
│   ├── types/
│   │   └── chat.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

### Principais arquivos

| Arquivo | Responsabilidade |
|---|---|
| `Chat.tsx` | Interface principal e gerenciamento das interações |
| `chatService.ts` | Requisições HTTP para a API FastAPI |
| `phoneStorage.ts` | Gerenciamento dos números no localStorage |
| `chat.ts` | Interfaces TypeScript dos contratos da API |
| `App.tsx` | Componente principal da aplicação |
| `App.css` | Estilização da interface |
| `index.css` | Estilos globais |
| `main.tsx` | Inicialização do React |
| `vite.config.ts` | Configuração do Vite |

---

## 🔌 Integração com o backend

A aplicação consome os endpoints disponibilizados pela API RevGás.

### Endpoints utilizados

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/health` | Verifica a disponibilidade da API |
| POST | `/api/chat/messages` | Envia uma mensagem ao chatbot |
| GET | `/api/chat/history/{phone}` | Recupera o histórico de um telefone |

### Envio de mensagem

**Endpoint:**

```http
POST /api/chat/messages
```

**Corpo da requisição:**

```json
{
  "phone": "5586999999999",
  "message": "Olá, gostaria de pedir um gás."
}
```

**Exemplo de resposta:**

```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Olá! Claro, posso ajudar com seu pedido."
}
```

O frontend utiliza o campo `message` da resposta para exibir o conteúdo enviado pelo assistente.

### Consulta do histórico

**Endpoint:**

```http
GET /api/chat/history/5586999999999
```

**Exemplo de resposta:**

```json
{
  "phone": "5586999999999",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "Olá!",
      "created_at": "2026-11-23T09:30:00"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "Olá! Como posso ajudar?",
      "created_at": "2026-11-23T09:30:02"
    }
  ]
}
```

O histórico é recuperado automaticamente quando uma conversa é selecionada.

---

## 🚀 Instalação e execução

### Pré-requisitos

Para executar o projeto localmente, é necessário possuir:

- Node.js compatível com a versão do Vite utilizada.
- npm.
- Git.
- Backend RevGás configurado e em execução.

### 1. Clonar o repositório

```bash
git clone https://github.com/Ik7Mt0s/chatbot-frontend.git
```

Entre no diretório:

```bash
cd chatbot-frontend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

Essa variável define a URL utilizada para acessar o backend.

Para ambientes diferentes, basta alterar o endereço da API.

### 4. Iniciar o backend

O backend deve estar em execução antes de iniciar os testes de integração.

No diretório do projeto backend:

```bash
uv run uvicorn revgas_chatbot.api.app:app --reload
```

Por padrão, a API ficará disponível em:

```text
http://localhost:8000
```

A documentação interativa poderá ser acessada em:

```text
http://localhost:8000/docs
```

### 5. Iniciar o frontend

Em outro terminal, dentro de `chatbot-frontend`, execute:

```bash
npm run dev
```

A aplicação ficará disponível normalmente em:

```text
http://localhost:5173
```

Abra esse endereço no navegador para acessar a interface.

---

## 🌐 Configuração de CORS

Como frontend e backend são executados em origens diferentes durante o desenvolvimento, o FastAPI utiliza o middleware `CORSMiddleware`.

As origens autorizadas incluem:

```text
http://localhost:5173
http://127.0.0.1:5173
```

Isso permite que o navegador realize requisições HTTP do frontend para a API.

Em produção, as origens devem ser configuradas conforme os endereços utilizados na implantação.

---

## 🔄 Fluxo de funcionamento

O processo de comunicação segue as seguintes etapas:

1. O usuário acessa o frontend.
2. A aplicação seleciona o último telefone utilizado ou o número padrão.
3. O frontend solicita o histórico da conversa ao backend.
4. O usuário digita e envia uma mensagem.
5. O frontend envia uma requisição HTTP com o telefone e o conteúdo.
6. O backend processa a mensagem utilizando o agente de IA.
7. A resposta é retornada em JSON.
8. O frontend apresenta a resposta na interface.

Ao selecionar outro número, a aplicação carrega o histórico correspondente.

### Exemplo de utilização

```text
Cliente: Olá, bom dia!

RevGás: Bom dia! Como posso ajudar?

Cliente: Gostaria de pedir um gás.

RevGás: Claro! Vamos organizar seu pedido.
```

As respostas apresentadas são apenas exemplos. O conteúdo real depende do processamento realizado pelo agente de inteligência artificial.

---

## 💾 Gerenciamento dos números

Os números utilizados são armazenados no navegador por meio do `localStorage`.

O serviço responsável por essa funcionalidade é:

```text
src/services/phoneStorage.ts
```

### Principais funções

| Função | Descrição |
|---|---|
| `normalizePhone()` | Remove caracteres não numéricos |
| `getSavedPhones()` | Recupera os números armazenados |
| `getActivePhone()` | Recupera o telefone selecionado |
| `savePhone()` | Salva e seleciona um telefone |
| `removePhone()` | Remove um número da lista local |

Essa implementação permite alternar entre conversas sem precisar redigitar os números.

**O armazenamento local não substitui a persistência do backend.**

---

## 🧪 Testando a aplicação

Para verificar o funcionamento da integração:

1. Inicie o backend FastAPI.
2. Execute o frontend com `npm run dev`.
3. Acesse `http://localhost:5173`.
4. Utilize o número padrão `5586999999999`.
5. Envie uma mensagem ao chatbot.
6. Aguarde a resposta do agente.
7. Adicione outro número de telefone.
8. Envie uma mensagem utilizando o novo número.
9. Retorne ao primeiro número.
10. Verifique se o histórico anterior foi recuperado.

Também é possível atualizar a página para confirmar a persistência local dos números.

### Build de produção

Para gerar os arquivos otimizados:

```bash
npm run build
```

Para visualizar localmente o resultado do build:

```bash
npm run preview
```

---

## 🔐 Segurança e limitações

A aplicação foi desenvolvida inicialmente para **simulação e testes de atendimento**.

Nesse ambiente, o usuário pode informar diferentes números para representar clientes distintos.

Entretanto, informar um número de telefone não constitui autenticação.

Antes de disponibilizar a aplicação publicamente com dados reais, será necessário implementar mecanismos de autenticação e autorização que impeçam o acesso indevido a históricos de outros clientes.

Além disso:

- O frontend não deve armazenar chaves privadas da API.
- Credenciais de serviços externos devem permanecer no backend.
- A comunicação em produção deve utilizar HTTPS.
- A persistência local dos números deve ser considerada um recurso de conveniência, não de segurança.

---

## 📈 Melhorias futuras

Entre as possibilidades de evolução do frontend estão:

- Indicadores de conexão e disponibilidade da API.
- Melhorias na experiência de digitação e carregamento.
- Formatação visual dos números de telefone.
- Notificações de novas mensagens.
- Suporte a temas claro e escuro.
- Melhorias de acessibilidade.
- Testes automatizados de componentes e integração.
- Autenticação para acesso seguro às conversas.
- Implantação do frontend em ambiente de produção.

A integração efetiva com o WhatsApp é uma responsabilidade prevista para a evolução do sistema como um todo.

---

## 📄 Considerações finais

O **RevGás Chatbot — Frontend** fornece uma interface para demonstrar e testar a comunicação entre clientes e um assistente virtual de inteligência artificial.

A separação entre frontend e backend facilita a manutenção, permite a evolução independente dos componentes e favorece futuras integrações.

O projeto representa uma etapa importante na construção de uma solução de atendimento automatizado, combinando tecnologias web modernas com serviços de inteligência artificial.

---

**RevGás Chatbot — Interface de atendimento inteligente.** 🔥