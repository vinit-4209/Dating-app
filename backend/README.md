# LoveConnect backend

## Setup
1. Copy `.env.example` to `.env` and fill in your MongoDB Atlas URI, JWT secret, client URL, and SMTP credentials.
2. Configure Cloudinary credentials so profile photos can be uploaded and stored as URLs in MongoDB:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   The API will return an error if Cloudinary is not configured and a profile upload includes new images.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## Profile photo storage
- Profile creation accepts `photos` as data URLs or existing URLs.
- New data URL uploads are stored in Cloudinary and only the hosted URLs are persisted in MongoDB.

## API overview
- `POST /api/auth/signup` – creates a user record and sends a verification email.
- `GET /api/auth/verify?token=...` – validates the email verification token.
- `POST /api/auth/login` – verifies credentials for confirmed users and returns a JWT.
- `POST /api/auth/logout` – lightweight logout acknowledgement.
