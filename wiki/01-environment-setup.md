# 1. Environment Setup

This page explains how to clone the repository and run the **whole system** - the C++ recommendation server, MongoDB, the Node/Express + React web app, and the React Native (Expo) mobile app - on a clean machine.

---

## 1.1 Prerequisites

| Tool | Notes |
|---|---|
| **Docker Desktop** | Must be **installed and running** before you run any `docker-compose` command. |
| **Node.js** (v18+) | Needed only to run the mobile app with Expo (the web app and C++ server run entirely inside Docker). |
| **Expo Go** app on a physical phone, **or** an Android/iOS emulator | Used to run the mobile client. ⚠️ See the SDK version note below. |
| Phone and computer on the **same Wi-Fi network** | Required if you test on a physical phone - see §1.6. |

---

## 1.2 Clone the repository

```bash
git clone <repo-url>
cd Advanced-Systems-Programming-Ex5
```

---

## 1.3 Running the servers (Docker)

Everything except the mobile app is started with a single command, run from the **project root**:

```bash
docker-compose up --build
```

This builds and starts three containers, as defined in [docker-compose.yml](../docker-compose.yml):

- **`cpp-server`** - the C++ recommendation server (talks to the web server over TCP on port `5555`).
- **`mongodb`** - MongoDB 7, exposed on host port `27018` (container port `27017`), with a named volume so data survives restarts.
- **`web-server`** - the Node/Express + React app, exposed on **http://localhost:3000**. It connects to `mongodb` and `cpp-server` using the hostnames/env vars set in `docker-compose.yml` (`MONGO_URI`, `CPP_SERVER_HOST`, `CPP_SERVER_PORT`).

Here the three services build and start successfully:

<img width="1585" height="881" alt="docker-compose up --build finishing successfully" src="https://github.com/user-attachments/assets/7b0297a0-01a1-4f2f-b1a2-d8d3dc57ba9c" />

**Verify everything is up.** In a *second* terminal:

```bash
docker ps
```

You should see **3 containers** in the `Up` state, including `web-server` with a port mapping like `0.0.0.0:3000->3000/tcp`.

Here `docker ps` shows all 3 containers running:

<img width="1247" height="173" alt="docker ps showing 3 running containers" src="https://github.com/user-attachments/assets/6cf4cb2d-bdc1-4f3f-82c2-2f7199fc387c" />

**Verify MongoDB connected.** Check the `web-server` logs (in the same terminal running `docker-compose up`) for the line:

```
Connected to MongoDB!
```

If you don't see this line, the web server failed to reach MongoDB - make sure the `mongodb` container is healthy (`docker ps`) and restart with `docker-compose up --build`.

---

## 1.4 Running the web app

1. Open a browser at **http://localhost:3000**.
2. If you see a blank/white page, hard-refresh with **Ctrl+Shift+R** (clears a stale cached bundle).

Here is the web app's landing page, loaded successfully:

<img width="956" height="440" alt="Landing page with default restaurants" src="https://github.com/user-attachments/assets/267133c0-f072-436b-b760-2568c1404344" />

---

## 1.5 Running the mobile app

The mobile app (Expo / React Native) is **not** part of `docker-compose` - it runs on your machine and talks to the same `web-server` container over the network.

```bash
cd mobile-app
npm install        # first time only
npx expo start -c
```

The `-c` flag clears the Metro bundler cache - useful the first time, or after changing `.env.local`.

This opens the **Expo developer tools** in your terminal/browser and prints a QR code:

<img width="1402" height="647" alt="Expo dev tools with QR code" src="https://github.com/user-attachments/assets/22e38236-7a69-47ff-9cfc-1c927861a414" />

**On your phone:**

1. Install **Expo Go** from the App Store / Play Store.
2. Open Expo Go and scan the QR code (or scan it with your phone's camera app, which will offer to open it in Expo Go).

Here is the mobile app's home screen running inside Expo Go on a physical phone:

<img width="260" height="563" alt="Mobile app home screen in Expo Go" src="https://github.com/user-attachments/assets/b2eba592-be4b-4d9d-9856-7af303ddb39f" />

### Running on an Android emulator (instead of a physical phone)

The app also runs on a local **Android emulator** with no extra configuration — the server address is detected automatically (see the note in §1.6). This is useful if you don't have a physical phone.

**1. Set up an emulator (one time).**
- Install **Android Studio** from <https://developer.android.com/studio> and complete its first-run setup wizard (it downloads the Android SDK and emulator components).
- Open the **Device Manager** (Android Studio welcome screen → **More Actions** → **Virtual Device Manager**, or **Tools → Device Manager**).
- Click **Create Device**, pick a phone (e.g. **Pixel 7**), choose a recent system image (e.g. **API 34 / 35**), download it, and click **Finish**.

**2. Launch the emulator.**
- In the Device Manager, click the **▶ (Play)** button next to your virtual device, and wait until it fully boots to the Android home screen (the first cold boot can take a few minutes).

**3. Run the app on the emulator.**
- Make sure `docker-compose up` is running (the servers), and the emulator is open.
- In the `mobile-app` folder, run `npx expo start`, then press the **`a`** key (= Android).
- Expo will automatically install **Expo Go** on the emulator (the first time) and open the app — **no QR scan needed**.

<img width="1448" height="343" alt="image" src="https://github.com/user-attachments/assets/02eabc81-2540-4f56-8d5d-2da56d2fb8dd" />

**4. The app loads on the emulator.** Wait for the JS bundle to download the first time, and the app appears:

<img width="542" height="939" alt="image" src="https://github.com/user-attachments/assets/e2481940-c9b7-4370-b7f4-73de430ad41e" />

<img width="541" height="950" alt="image" src="https://github.com/user-attachments/assets/2b3d40d1-56fd-4b7c-a510-8bfec5db5df0" />

<img width="545" height="951" alt="image" src="https://github.com/user-attachments/assets/42b2fdd9-87a4-4b3f-9c0b-943ec54764a5" />

<img width="535" height="929" alt="image" src="https://github.com/user-attachments/assets/0ce4024c-ac32-40c2-a9b3-6851e3739030" />

---

## 1.6 Critical notes (read before testing the mobile app)

> ⚠️ **Expo Go version must match SDK 54.** This project is built on **Expo SDK 54** (see [mobile-app/package.json](../mobile-app/package.json)). If the Expo Go app installed on your phone is a different SDK version, it will refuse to connect to this project. Install the Expo Go build that supports SDK 54 if needed.

> ⚠️ **Phone and computer must be on the same Wi-Fi network.** If they aren't, the phone can reach the Expo dev server (for the JS bundle) but **not** the API server, and every request from the app will time out / fail with a network error.

> ⚠️ **Docker must stay running.** `docker-compose up` must be running for the mobile app to work - the mobile app talks to the **same** `web-server` container the browser uses, not a separate backend.

> ⚠️ **Mobile API URL.** The app auto-detects the right server address: it reads the IP that Expo used to serve the JS bundle to your phone (see [mobile-app/services/api.js](../mobile-app/services/api.js)), so in most cases nothing needs to be configured manually. If auto-detection fails (e.g. on some emulator setups or restrictive networks), override it explicitly by creating `mobile-app/.env.local`:
> ```env
> EXPO_PUBLIC_API_URL=http://<your-computer-IP>:3000
> ```
> Find your computer's IP with `ipconfig` (look for the **IPv4 Address** under your Wi-Fi adapter). **Restart Expo** (`npx expo start -c`) after creating/changing this file.

> ⚠️ **Shared database.** The web app and the mobile app talk to the **same** MongoDB instance through the same `web-server`. A restaurant created on the web will immediately appear on mobile, and vice versa.

---


**Next:** [02-auth-flows.md](02-auth-flows.md) - registration and login, on both web and mobile.

