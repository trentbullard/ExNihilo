export async function getUserProfile(req, res) {
  const userId = req.userId;
  res.json({ userId, username: 'trent', email: 'trent@exnihilo.com' });
};

export default {
  getUserProfile,
};
