import {model,Schema} from "mongoose";
import { ROLE, TProfile } from "../utils/types";

const UserProfileSchema = new Schema({
    provider: { type: String, required: true },
    id: { type: String, required: true, unique: true }, 
    username: String, 
    fullname: String,
    email: String,
    role: {
        type: String,
        default: ROLE.USER,
      },
    avatar: { type: String, trim: true },
 
  }, { timestamps: true }); 
  
  const UserProfile = model<TProfile>('UserProfile', UserProfileSchema);
  export default UserProfile;