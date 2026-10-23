# Adyanta – Login, Signup & Dashboard App

## Project Overview

Adyanta is a mobile application demo featuring user registration, login, and a protected dashboard. It uses a React Native frontend built with Expo and a Python Flask backend with SQLite.

## Features

- Modern Login and Signup screens
- User registration with input validation
- Login authentication through backend API
- Password hashing on the backend
- Secure token storage using Expo SecureStore
- Protected dashboard displaying user profile details
- Logout functionality
- SQLite database for user records

## Tech Stack

**Frontend**
- React Native
- Expo
- TypeScript
- Expo Router
- Expo SecureStore

**Backend**
- Python
- Flask
- SQLite
- REST API

## Project Structure

```text
Adyanta project/
├── Adyanta/
│   └── adyanta-app/
│       ├── app/
│       │   ├── index.tsx
│       │   ├── signup.tsx
│       │   └── dashboard.tsx
│       ├── src/
│       │   └── api/
│       │       └── api.ts
│       └── README.md
└── Adyanta-backend/
    └── app.py
```

## Prerequisites

- Node.js and npm
- Python 3
- Expo Go on a compatible mobile device

## Run the Frontend

Open a terminal in the `adyanta-app` directory and run:

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go to open the app.

## Run the Backend

Open a separate terminal in the `Adyanta-backend` directory.

Activate the virtual environment on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies if needed:

```bash
pip install flask
```

Start the backend:

```bash
python app.py
```

Keep the backend terminal running while testing the app.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend status |
| POST | `/api/register` | Register a user |
| POST | `/api/login` | Authenticate a user |
| GET | `/api/profile` | Retrieve profile details |
| POST | `/api/logout` | Log out the user |

## Configuration

Update the API base URL in `src/api/api.ts` to use your computer's current local network IP address and backend port.

The mobile device and computer should be connected to the same Wi-Fi network for local testing.

## Notes

- This is a development demo; production deployment requires HTTPS and additional security measures.
- Do not commit passwords, secret keys, or other sensitive credentials.
- The frontend uses Expo/React Native, not native SwiftUI or UIKit.
