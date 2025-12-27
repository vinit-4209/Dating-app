// import mongoose from 'mongoose';

// const ProfileSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
//     name: String,
//     age: Number,
//     city: String,
//     pronouns: String,
//     bio: String,
//     interests: [String],
//     photos: [String],
//     lookingFor: String,
//     height: String,
//     education: String,
//     occupation: String,
//     location: {
//       latitude: Number,
//       longitude: Number
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Profile', ProfileSchema);


import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  },
  { _id: false }
);

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    name: { type: String, default: '' },

    age: { type: Number, min: 18, max: 100 },

    city: { type: String, default: '' },

    pronouns: { type: String, default: '' },

    bio: { type: String, maxlength: 500, default: '' },

    interests: {
      type: [String],
      default: [],
      validate: [(v) => v.length <= 10, 'Max 10 interests']
    },

    photos: {
      type: [PhotoSchema],
      default: []
    },

    lookingFor: { type: String, default: '' },

    height: { type: String, default: '' },

    education: { type: String, default: '' },

    occupation: { type: String, default: '' },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    }
  },
  { timestamps: true }
);

// Enable geo queries later
ProfileSchema.index({ location: '2dsphere' });

export default mongoose.model('Profile', ProfileSchema);
