export const config = {
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    jwtSecret: process.env.JWT_SECRET,
    ssl: { rejectUnauthorized: true }, 
}