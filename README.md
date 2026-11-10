# Wolt-Style Food Delivery App

A full-stack Wolt-inspired food delivery system with **two clients** — a **React** web app and a **React Native (Expo Router)** mobile app — backed by a **Node.js/Express** server with **MongoDB (Mongoose)**, plus a **C++ recommendation server**. Both clients talk to the same server and share the same database.

## Team

- Guy Yaar-On
- Yehuda Yamin
- Omri Yanku

---

## How to Run

### Prerequisites

- **Docker Desktop** — installed and running before any `docker-compose` command.
- **Node.js (v18+)** — only needed to run the mobile app with Expo.
- **Expo Go** on a physical phone (or an Android/iOS emulator) for the mobile client.

### 1. Servers (Docker)

From the project root:

```bash
docker-compose up --build
```

This builds and starts three containers:

- **`web-server`** — Node/Express + React web app, on **http://localhost:3000**.
- **`mongodb`** — MongoDB 7 (data persists in a named volume).
- **`cpp-server`** — the C++ recommendation server (TCP).

### 2. Web app

Open **http://localhost:3000** in a browser. (If you see a blank page, hard-refresh with **Ctrl+Shift+R**.)

### 3. Mobile app

```bash
cd mobile-app
npm install        # first time only
npx expo start -c
```

Then scan the QR code with **Expo Go**.

### Important notes

- ⚠️ **Expo Go must match SDK 54** (the version this project is built on).
- ⚠️ **Phone and computer must be on the same Wi-Fi network**, otherwise the app can't reach the server.
- ⚠️ **Docker must stay running** — the mobile app talks to the same `web-server` container.
- The web and mobile clients share the **same database**, so a restaurant created on one appears on the other.

> Full step-by-step instructions, troubleshooting, and screenshots are in the **[wiki/](wiki/)** folder:
> [Environment setup](wiki/01-environment-setup.md) · [Auth flows](wiki/02-auth-flows.md) · [CRUD flows](wiki/03-crud-flows.md)

---

## Project Structure

| Folder | Description |
|---|---|
| `web-server/` | Node/Express + Mongoose API, and the React web client (served from `public/`). |
| `mobile-app/` | React Native (Expo Router) mobile client. |
| `src/` + `CMakeLists.txt` + `Dockerfile` | The C++ recommendation server. |
| `wiki/` | Documentation and screenshots for setup, auth, and CRUD flows. |

---

## Our Work Process

We managed the project in **JIRA** throughout: we split the work into **epics**, wrote **user stories and tasks**, set up a **sprint** with a **Scrum Master**, and held **status meetings** documented in real time. Every task was assigned to a team member before work began, and its status was kept up to date along the way (In Progress / Code Review / Done).

We worked exclusively with **feature branches** and merged into `main` only through **pull requests approved by the other team members** (whoever opened a PR did not approve it themselves). Work was divided by epics so we could progress in parallel.

In terms of development: we first **migrated the server from in-memory storage to MongoDB** (Mongoose); we then built a **React Native (Expo Router) app** that mirrors all of the web client's functionality against the same server; and finally we **polished the design** and wrote full **documentation in the wiki**.
