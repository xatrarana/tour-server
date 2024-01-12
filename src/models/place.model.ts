import { type IPlace } from "../utils/types";
import mongoose from "mongoose";

const placeSchema = new mongoose.Schema<IPlace>({
  title: {
    type: String,
    required: true,
    trim: true,
    toLowerCase: true,
  },
  slug_name: {
    type: String,
    required: true,
    trim: true,
    toLowerCase: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  points: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  location: {
    type: String,
    required: true,
    trim: true,
  },
  wardno: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  rating: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      userRating: {
        type: Number,
        required: true,
      },
    },
  ],
  totalRating: {
    type: Number,
    default: 0,
  },
});

placeSchema.index({ coordinates: "2dsphere" });

export const Place = mongoose.model<IPlace>("Place", placeSchema);
