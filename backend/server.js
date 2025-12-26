import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import User from './models/User.js';
import Profile from './models/Profile.js';
import Match from './models/Match.js';
import Message from './models/Message.js';
import { sendVerificationEmail } from './utils/sendEmail.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const CLOUDINARY_CONFIGURED = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_CONFIGURED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing.' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

async function connectDB() {
  try {
    // await mongoose.connect(process.env.MONGODB_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // });
    mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

function generateVerificationToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashedToken };
}

async function resolveProfilePhotos(photos = []) {
  if (!Array.isArray(photos)) {
    return [];
  }

  const uploads = photos.map(async (photo) => {
    if (typeof photo !== 'string') {
      return null;
    }

    if (photo.startsWith('data:')) {
      if (!CLOUDINARY_CONFIGURED) {
        throw new Error('Cloudinary is not configured.');
      }

      const result = await cloudinary.uploader.upload(photo, {
        folder: 'loveconnect/profiles'
      });
      return result.secure_url;
    }

    return photo;
  });

  const resolved = await Promise.all(uploads);
  return resolved.filter(Boolean);
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.verified) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { token, hashedToken } = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 60 * 60 * 1000);

    const user = existingUser || new User({ name, email });
    user.password = hashedPassword;
    user.verified = false;
    user.verificationToken = hashedToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    const verifyUrl = `${CLIENT_URL}/verify?token=${token}`;

    await sendVerificationEmail({
      to: email,
      subject: 'Verify your LoveConnect account',
      html: `<p>Welcome to LoveConnect, ${name}!</p><p>Click the button below to verify your email address:</p><p><a href="${verifyUrl}" style="padding:10px 20px;background:#ec4899;color:white;border-radius:8px;text-decoration:none">Verify email</a></p><p>If you did not create this account, please ignore this email.</p>`
    });

    res.status(200).json({ message: 'Verification email sent. Please check your inbox.', email });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Unable to create account. Please try again later.' });
  }
});

app.get('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Verification token is missing.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Unable to verify email. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please sign up.' });
    }

    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login successful.', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Unable to log in. Please try again later.' });
  }
});

app.post('/api/auth/logout', async (_req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

app.get('/api/profile', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    res.json({ profile: profile || null });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ message: 'Unable to fetch profile.' });
  }
});

app.post('/api/profile', requireAuth, async (req, res) => {
  try {
    const { photos = [], ...payload } = req.body;
    const resolvedPhotos = await resolveProfilePhotos(photos);

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { ...payload, photos: resolvedPhotos, userId: req.user.id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ profile, message: 'Profile saved.' });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ message: 'Unable to save profile.' });
  }
});

app.get('/api/discover', requireAuth, async (req, res) => {
  try {
    const myId = req.user.id;
    const profiles = await Profile.find({ userId: { $ne: myId } }).limit(50);
    res.json({ profiles });
  } catch (error) {
    console.error('Discover fetch error:', error);
    res.status(500).json({ message: 'Unable to load matches.' });
  }
});

app.get('/api/match', requireAuth, async (req, res) => {
  try {
    const myId = req.user.id;
    const matches = await Match.find({ participants: myId }).lean();
    const partnerIds = matches.map((m) => m.participants.find((p) => String(p) !== String(myId)));
    const profiles = await Profile.find({ userId: { $in: partnerIds } }).lean();
    const profileMap = profiles.reduce((acc, p) => ({ ...acc, [String(p.userId)]: p }), {});

    const hydrated = matches.map((match) => {
      const partnerId = match.participants.find((p) => String(p) !== String(myId));
      const partnerProfile = profileMap[partnerId ? String(partnerId) : ''];

      return {
        ...match,
        with: partnerProfile ? { ...partnerProfile, id: partnerProfile.userId } : null
      };
    });

    res.json({ matches: hydrated });
  } catch (error) {
    console.error('Match fetch error:', error);
    res.status(500).json({ message: 'Unable to load matches.' });
  }
});

app.post('/api/match/request', requireAuth, async (req, res) => {
  try {
    const { targetId } = req.body;
    if (!targetId) {
      return res.status(400).json({ message: 'Target profile required.' });
    }

    const existing = await Match.findOne({ participants: { $all: [req.user.id, targetId] } });
    if (existing) {
      return res.json({ match: existing, message: 'Match already exists.' });
    }

    const match = await Match.create({
      participants: [req.user.id, targetId],
      status: 'pending',
      requestedBy: req.user.id
    });

    res.json({ match, message: 'Request sent.' });
  } catch (error) {
    console.error('Request match error:', error);
    res.status(500).json({ message: 'Unable to send request.' });
  }
});

app.post('/api/match/respond', requireAuth, async (req, res) => {
  try {
    const { matchId, action } = req.body;
    const match = await Match.findById(matchId);

    if (!match || !match.participants.includes(req.user.id)) {
      return res.status(404).json({ message: 'Match not found.' });
    }

    if (action === 'accept') {
      match.status = 'accepted';
    } else if (action === 'decline') {
      match.status = 'declined';
    }

    await match.save();
    res.json({ match, message: `Request ${action}ed.` });
  } catch (error) {
    console.error('Respond match error:', error);
    res.status(500).json({ message: 'Unable to update request.' });
  }
});

app.get('/api/messages/:matchId', requireAuth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match || !match.participants.includes(req.user.id)) {
      return res.status(404).json({ message: 'Match not found.' });
    }

    const messages = await Message.find({ matchId: match._id }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ message: 'Unable to load messages.' });
  }
});

app.post('/api/messages/:matchId', requireAuth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match || match.status !== 'accepted' || !match.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Chat is locked until both sides accept.' });
    }

    const message = await Message.create({
      matchId: match._id,
      senderId: req.user.id,
      text: req.body.text
    });

    res.json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Unable to send message.' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
  console.log('Health check OK');
  
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

  });
});
