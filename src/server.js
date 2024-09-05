import express from 'express'
import AsyncExitHook from 'async-exit-hook'
//import { APIs_V1 } from './routes/v1/index.js'
import bodyParser from 'body-parser'
import { ClOSE_DB, CONNECT_DB } from './config/mongodb.js'
import { APIs_V1 } from './routes/v1/index.js'


const START_SERVER = async () => {
    const app = express()
    const port = process.env.PORT || 5000
    app.use(bodyParser.json())
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



