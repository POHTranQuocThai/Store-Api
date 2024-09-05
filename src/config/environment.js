import dotenv from 'dotenv'
dotenv.config()

export const env = {
    MONGODB_URL: process.env.MONGODB_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
    LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST,
    LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT,
    AUTHOR: process.env.AUTHOR
}
