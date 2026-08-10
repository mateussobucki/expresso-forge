import { BaseGenerator } from "./baseGenerator.js";

export class PostgresGenerator extends BaseGenerator{
  getFiles(){
    return {
      "src/config/database.js": this.buildDatabaseConfig(),
      "src/db/migrations/001_create_users_table_sql": this.buildUsersMigration(),
      "src/repositories/userRepository.js": this.buildUserRepository(),
    };
  };

  getDependencies(){
    return {"pg": "^8.12.0"};
  };

  buildDatabaseConfig(){
    return `import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
`;
  };

  buildUsersMigration() {
    const { useJWT } = this.options;

    const passwordColumn = useJWT
      ? `,
  password VARCHAR(255) NOT NULL`
      : "";

    return `CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL${passwordColumn},
created_at TIMESTAMP DEFAULT NOW()
);
`;
  };

  buildUserRepository() {
    return `import pool from "../config/database.js";

export async function createUser({ name, email, password }) {
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, password]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}
`;
  };
}