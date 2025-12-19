import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: String,
    age: Number,
    city: String,
    pronouns: String,
    bio: String,
    interests: [String],
    photos: [String],
    lookingFor: String,
    height: String,
    education: String,
    occupation: String
  },
  { timestamps: true }
);

export default mongoose.model('Profile', ProfileSchema);
