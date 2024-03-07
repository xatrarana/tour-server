import type { Document, Model } from "mongoose";

export enum ROLE {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  refreshToken?: string;
  role: ROLE;
  resetPasswordToken: string | undefined
}

export interface IUserDocument extends IUser,Document {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
  generatePasswordResetToken(id: string): Promise<string>;
  updatePassword(password: string): Promise<void>;
}

export interface IUserResponse extends Omit<IUser, 'password' | 'resetPasswordToken'> , IUserDocument{
  _id: string;
}

export interface ISessionUser extends Omit<IUser, 'phone' | 'password' | 'avatar' | 'resetPasswordToken'> {
  _id: string;
}

export type TDecodedToken = {
  _id: string;
  email: string;
  username: string;
  fullname: string;
  iat: number;
  exp: number;
};

export type TUserModel = Model<IUser, NonNullable<unknown>, IUserDocument>;

export interface IPlace {
  title: string;
  slug_name: string;
  description: string;
  points: {
    type: string;
    coordinates: [number];
  };
  location: string;
  wardno: string;
  category: string;
  thumbnail: string;
  images: string[];
  rating: [
    {
      userId: string;
      userRating: number;
    },
  ];
  totalRating: number;
}

export type TVideoSchema = {
  title: string;
  link: string;
};

interface Profile {
  provider: string;
  id: string;
  displayName: string;
  username?: string | undefined;
  name?:
      | {
          familyName: string;
          givenName: string;
          middleName?: string | undefined;
      }
      | undefined;
  emails?:
      | Array<{
          value: string;
          type?: string | undefined;
      }>
      | undefined;
  photos?:
      | Array<{
          value: string;
      }>
      | undefined;
}