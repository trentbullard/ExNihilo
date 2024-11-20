import Pool from "pg";

const pool = new Pool.Pool ({
  user: "exnihilo_user",
  host: "localhost",
  database: "exnihilo",
  password: "t4ngo lim4 br4vo",
  port: 5432,
});

export default {
  query: (text, params) => pool.query(text, params),
};
