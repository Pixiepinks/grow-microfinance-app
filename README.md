# Grow Microfinance Mobile App

A Flutter mobile client for the Grow Microfinance platform. The backend API is already deployed; this app consumes the existing endpoints for admins, staff, and customers.

## Features
- Login screen that authenticates against `/auth/login`
- Role-based navigation for admin, staff, and customer accounts
- Admin dashboard pulling `/admin/dashboard`
- Staff dashboard pulling `/staff/today-collections` with the ability to post payments to `/staff/payments`
- Customer dashboard pulling `/customer/me` and `/customer/loans`
- Loan details screen with payment history from `/customer/loans/{id}/payments`
- API client with configurable base URL placeholder
- JWT token persistence using `shared_preferences`
- Material 3 styling with card-based layout

## Getting Started
1. Update the `baseUrl` in `lib/api_config.dart` to point to your deployed backend if it changes.
2. Install Flutter 3.10+ and run `flutter pub get`.
3. Launch the app with `flutter run` on an emulator or device.

## Project Structure
- `lib/main.dart` – App entry point with role-based routing and session handling.
- `lib/services/` – API client and repositories for auth, admin, staff, and customer flows.
- `lib/screens/` – UI screens for login and dashboards.
- `lib/models/` – Data models for users, loans, and payments.
- `lib/widgets/` – Reusable UI components (e.g., dashboard cards).

## Running and Deploying the Web App

> If the `web/` folder or `web/index.html` is missing or outdated, regenerate the default Flutter web scaffold with `flutter create .` (this does not overwrite `lib/` files).

### 1. Run locally in Chrome

```bash
flutter run -d chrome
```

### 2. Build Flutter web release

```bash
flutter build web --release
```

This generates the web build in `build/web`.

### 3. Start the local Node.js server (serves the Flutter web build)

```bash
cd web_server
npm install
npm start
```

Then open <http://localhost:3000> in the browser.

### 4. Deploy to Railway

Connect this GitHub repo to Railway as a new service.

Railway looks for a `start.sh` script by default. A helper script is included in the repo to install the Node server dependencies and launch the web build:

```bash
./start.sh
```

Make sure `build/web` is present and committed (run `flutter build web --release` before committing when you change the app). The `start.sh` script will exit with an error if the build output is missing so the deployment fails fast.

If you prefer to set a custom start command in Railway instead of using the script, use:

```bash
npm install --prefix web_server && npm start --prefix web_server
```

The Railway URL for this service will be the web app URL that staff/customers can open in Chrome.
