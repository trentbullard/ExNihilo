import db from "../db/db.js";
import logger from "../utils/logger.js";

const getUsers = async () => {
  const queryString = "SELECT * FROM users";
  try {
    const result = await db.query(queryString);
    return result.rows;
  }
  catch (error) {
    logger.error('Database error:', error);
    throw new Error("Error retrieving users");
  }
};

const getUserById = async (id) => {
  const queryString = "SELECT * FROM users WHERE id = $1";
  try {
    const result = await db.query(queryString, [id]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Database error:', error);
    throw new Error("Error retrieving user");
  }
};

export default {
  getUsers,
  getUserById,
};
