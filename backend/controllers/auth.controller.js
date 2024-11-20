import authService from "../services/auth.service.js";

const getSession = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No session" });
  }

  try {
    const user = await authService.verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired session" });
  }
};

const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  try {
    const user = await authService.googleAuth(idToken);
    const token = authService.generateAccessToken(user.id);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Error authenticating with Google" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export default {
  getSession,
  googleAuth,
  logout,
};
