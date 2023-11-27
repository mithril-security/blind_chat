---
description: "Instruction for developers on how to install and deploy Blindchat locally"
---

# 👋 Getting started for devs

---

## 🔧 Setup

---

Before going any further, please make sure you have [Node JS 18.0](https://nodejs.org/en) installed on your system.

To run the chat user interface in dev/debug mode for testing purposes, execute the following commands in the root folder of your BlindChat code repo.

```bash
npm install
npm run dev
```

This will install the dependencies of the project and launch the dev environment.

The chat can be deployed in production mode with the following commands:

```bash
npm run build
node build
```

The chat-ui uses server-side rendering, so building the pages before deploying them is mandatory.

> ⚠️ Note that the command `node build` will run the server in `HTTP mode`.
> If you wish to add TLS, please use a proxy server, such as NGINX.
