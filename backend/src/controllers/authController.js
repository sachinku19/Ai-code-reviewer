import User from "../models/User.js";
import Setting from "../models/Setting.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarColor: user.avatarColor,
  plan: user.plan,
  bio: user.bio,
  createdAt: user.createdAt
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  await Setting.create({ user: user._id });
  res.status(201).json({ user: publicUser(user), token: generateToken(user._id) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  res.json({ user: publicUser(user), token: generateToken(user._id) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});
