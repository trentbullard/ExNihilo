import logger from "../utils/logger.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import authRepository from "../repositories/auth.repository.js";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "wrongsecret";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
};

const verifyToken = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await userRepository.getUserById(payload.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    logger.error("Token verification error:", error);
    throw new Error("Invalid or expired token");
  }
};

const googleAuth = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      throw new Error("Email not verified by Google");
    }

    const user = await authRepository.findOrCreateByEmail(payload, "google");
    return user;
  } catch (error) {
    logger.error("Google auth error:", error);
    throw new Error("Error authenticating with Google");
  }
};

export default {
  generateAccessToken,
  verifyToken,
  googleAuth,
};
