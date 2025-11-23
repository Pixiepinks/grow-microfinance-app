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
1. Configure the API base URL (defaults to the production Railway deployment). For local or staging backends, pass `--dart-define=API_BASE_URL=https://your-host` when running or building the app.
2. Install Flutter 3.10+ and run `flutter pub get`.
3. Launch the app with `flutter run` on an emulator or device.

## Project Structure
- `lib/main.dart` – App entry point with role-based routing and session handling.
- `lib/services/` – API client and repositories for auth, admin, staff, and customer flows.
- `lib/screens/` – UI screens for login and dashboards.
- `lib/models/` – Data models for users, loans, and payments.
- `lib/widgets/` – Reusable UI components (e.g., dashboard cards).
