import { Document, Model, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";

interface IUser extends Document {
  username: string;
  email: string;
  refreshToken: string;
  avatar: string;
  password?: string;
  googleId?: string;
}

interface IUserMethods {
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  hashPassword: () => void;
  isPasswordCorrect: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser, Model<IUser>, IUserMethods>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  avatar: { type: String, required: false },
  googleId: { type: String, required: false },
  refreshToken: { type: String, required: false, unique: true },
});

userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      id: this._id,
      email: this.email,
      googleId: this.googleId || "",
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    } as unknown as jwt.SignOptions
  );

  return accessToken;
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      id: this._id,
      email: this.email,
      googleId: this.googleId || "",
    },
    config.REFRESH_TOKEN_SECRET,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRY,
    } as unknown as jwt.SignOptions
  );

  return refreshToken;
};

userSchema.methods.isPasswordCorrect = async function (password: string) {
  let isValid = false;
  if (this.password) {
    isValid = await bcrypt.compare(password, this.password);
  }
  return isValid;
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export const User = model("User", userSchema);
