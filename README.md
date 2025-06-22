# 🧰 boards-api-client

A TypeScript client library for interacting with the [Boards Room API](https://github.com/Excali-Boards), the backend behind the collaborative whiteboarding platform. This SDK simplifies API integration for developers building apps on top of Boards infrastructure.

---

## 🚀 Features

* Fully typed API wrapper for the Boards backend
* CRUD support for:

  * 🏢 Groups and 📂 Categories
  * 📝 Boards and 🖼️ Rooms
  * 👤 Users and 🔐 Permissions
* Real-time room metadata access and user management
* OAuth-based authentication support
* Utility endpoints for resolving board references and cleanup
* Built-in Axios request handler with date transformation

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
import { BoardsManager } from 'boards-api-client';

const client = new BoardsManager('https://your-api-url.com');
```

### Access a module

```ts
const authToken = 'Bearer YOUR_TOKEN_HERE';

const groups = await client.groups.getGroups({ auth: authToken });
console.log(groups);
```

### Common endpoints

* `client.auth.authenticate(...)` — Login a user
* `client.groups.getAllSorted(...)` — Fetch full hierarchy
* `client.boards.getBoard(...)` — Fetch single board info
* `client.admin.updateUserPermissions(...)` — Update admin permissions
* `client.stats.globalStats(...)` — Fetch global app statistics
* `client.utils.resolveBoard(...)` — Resolve board ID by name

---

## 🧪 Example

```ts
const data = await client.boards.getBoard({
  auth: token,
  groupId: 'grp123',
  categoryId: 'cat456',
  boardId: 'brd789'
});

console.log(data.board.name);
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
