# 🧰 boards-api-client

A comprehensive TypeScript client library for the [Boards Room API](https://github.com/Excali-Boards), featuring both REST API and WebSocket support. Build real-time collaborative applications with ease.

---

## Features

- Fully typed REST client (boards, users, permissions, files, sessions, categories, flashcards, metrics, invites)
- WebSocket client with auto-reconnect, heartbeat, and message queueing
- React hooks: generic `useWebSocket` and `useExecutor` for code execution streams
- Zero-config defaults; override `baseUrl` when needed

## Installation

```bash
pnpm add @excali-boards/boards-api-client
# or
npm install @excali-boards/boards-api-client
```

## Quick start

### REST

```ts
import { BoardsManager } from "@excali-boards/boards-api-client";

const api = new BoardsManager("https://api.example.com");
const boards = await api.boards.list();
```

### WebSocket (generic)

```ts
import { createConnection } from "@excali-boards/boards-api-client";

const ws = createConnection("/executor", { baseUrl: "localhost:3000" });
await ws.connect();
ws.send(1, { code: "print(42)", language: "python" });
ws.on(3, (data) => console.log("output:", data.output));
```

### React hook (executor)

```tsx
import { useExecutor } from "@excali-boards/boards-api-client";

const { isConnected, startSession, sendInput, outputs } = useExecutor();
```

## Integrations

- React/Next: `useWebSocket`, `useExecutor`
- Node/SSR: `createConnection` without React
- TypeScript-first: message payloads and REST responses are typed

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**. See [LICENSE](./LICENSE) for details.
