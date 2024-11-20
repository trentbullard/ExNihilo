import db from "../db/db.js";
import logger from "../utils/logger.js";

const findOrCreateByEmail = async (userData, provider) => {
  try {
    const result = await db.query(
      `SELECT * FROM auth_providers WHERE provider_user_email = $1`,
      [userData.email]
    );

    if (result.rows.length > 0) {
      const user = await db.query(`SELECT * FROM users WHERE id = $1`, [
        result.rows[0].user_id,
      ]);
      return user.rows[0];
    }

    const insertQuery = `INSERT INTO users (email, first_name, last_name, picture) VALUES ($1, $2, $3, $4) RETURNING *`;
    const newUser = await db.query(insertQuery, [
      userData.email,
      userData.given_name,
      userData.family_name,
      userData.picture,
    ]);

    await db.query(
      `INSERT INTO auth_providers (user_id, provider, provider_user_id, provider_user_email) VALUES ($1, $2, $3, $4)`,
      [newUser.rows[0].id, provider, userData.sub, userData.email]
    );

    return newUser.rows[0];
  } catch (error) {
    logger.error("Database error:", error);
    throw new Error("Error creating user");
  }
};

export default {
  findOrCreateByEmail,
};
