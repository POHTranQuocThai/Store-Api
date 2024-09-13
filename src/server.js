import express from 'express'
import AsyncExitHook from 'async-exit-hook'
import bodyParser from 'body-parser'
import { ClOSE_DB, CONNECT_DB } from './config/mongodb.js'
import { APIs_V1 } from './routes/v1/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const START_SERVER = async () => {
    const app = express()
    const port = process.env.LOCAL_DEV_APP_PORT || 3001
    app.use(cors({
        origin: 'http://localhost:3000', // Địa chỉ frontend
        credentials: true, // Cho phép gửi cookie
    }));
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use('/v1', APIs_V1)

    app.listen(port, () => {
        console.log(`I am running at http://localhost:${port}`)
    })

    AsyncExitHook((signal) => {
        ClOSE_DB()
    })
}

// Đảm bảo CONNECT_DB đã được khai báo trước khi sử dụng
CONNECT_DB().then(() => console.log('Connected MongoDB')
)
    .then(() => START_SERVER())
    .catch(error => {
        console.error(error)
        process.exit(1) // Thoát với mã lỗi 1 nếu có lỗi
    })



