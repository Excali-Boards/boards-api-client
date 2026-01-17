# 🧰 boards-api-client

A TypeScript client library for interacting with the [Boards Room API](https://github.com/Excali-Boards), the backend behind the collaborative whiteboarding platform. This SDK simplifies API integration for developers building apps on top of Boards infrastructure.

---

## 🚀 Features

- Fully typed API wrapper for the Boards backend
- CRUD support for:
  - 🏢 Groups and 📂 Categories
  - 📝 Boards and 🖼️ Rooms
  - 👤 Users and 🔐 Permissions

- Real-time room metadata access and user management
- OAuth-based authentication support
- Utility endpoints for resolving board references and cleanup
- Built-in Axios request handler with date transformation

---

## 📦 Installation

```bash
npm install boards-api-client
# or
pnpm add boards-api-client
```

---

## ✨ Usage

### Initialize the client

```ts
import { BoardsManager } from "boards-api-client";

const client = new BoardsManager("https://your-api-url.com");
```

### Access a module

```ts
const groups = await client.groups.getGroups({ auth: "your-token-here" });
console.log(groups);
```

---

## 🧪 Examples

### Basic API call

```ts
const data = await client.boards.getBoard({
  auth: token,
  groupId: "grp123",
  categoryId: "cat456",
  boardId: "brd789",
});

console.log(data.board.name);
```

### Pagination with getAll

The `getAll` utility automatically fetches all pages for you:

```ts
import { getAll } from "boards-api-client";

const allUsers = await getAll(
  (page, limit) => client.admin.getUsers({ auth: token, page, limit }),
  { limit: 50, maxItems: 1000 }, // Optional: max total items to fetch (default: Infinity)
);

console.log(`Fetched ${allUsers.length} users total.`);
```

### Manual pagination

```ts
const response = await client.admin.getUsers({
  auth: token,
  page: 1,
  limit: 50,
});

if (response.status === 200) {
  console.log("Users:", response.data.data);
  console.log("Has more:", response.data.pagination.hasMore);
}
```

---

## 🛠️ Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/Excali-Boards/boards-api-client.git
cd boards-api-client
pnpm install
```

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**. See [LICENSE](./LICENSE) for details.
