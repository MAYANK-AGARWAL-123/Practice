import jwt from 'jsonwebtoken';
import { users } from '../users.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';

let refreshTokens = [];

export const login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
};

export const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ id: user.id, username: user.username });
    res.json({ accessToken });
  });
};

export const protectedRoute = (req, res) => {
  res.json({ message: 'Access to protected route granted', user: req.user });
};
