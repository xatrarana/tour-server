import mongoose from "mongoose";
import { TVideoSchema } from "../utils/types";

const videoSchema = new mongoose.Schema<TVideoSchema>({
  title: {
    type: String,
    required: true,
    trim: true,
    toLowerCase: true,
  },
  link: {
    type: String,
    required: true,
  },
});

export const Video = mongoose.model<TVideoSchema>("Video", videoSchema);
