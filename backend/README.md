# LoveConnect backend

## Setup
1. Copy `.env.example` to `.env` and fill in your MongoDB Atlas URI, JWT secret, client URL, and SMTP credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API overview
- `POST /api/auth/signup` – creates a user record and sends a verification email.
- `GET /api/auth/verify?token=...` – validates the email verification token.
- `POST /api/auth/login` – verifies credentials for confirmed users and returns a JWT.
- `POST /api/auth/logout` – lightweight logout acknowledgement.
