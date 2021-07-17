const isDevMode = process.env.NODE_ENV !== "production";

module.exports = {
  type: "postgres",
  url: process.env.DB_URL,
  synchronize: isDevMode,
  logging: isDevMode,
  ssl: {
    require: true,
    rejectUnauthorized: false
  },
  entities: ["src/api/entities/**/*.ts"],
  migrations: ["src/api/migrations/**/*.ts"],
  subscribers: ["src/api/subscribers/**/*.ts"],
  cli: {
    entitiesDir: "src/api/entities",
    migrationsDir: "src/api/migrations",
    subscribersDir: "src/api/subscribers"
  }
};
