import express from "express"
import { getPayloadClient } from "./get-payload"
import { nextApp, nextHandler } from "./next-utils"

const app = express()
const PORT = Number(process.env.PORT) || 3000

const start = async () => {
    try {
        const payload = await getPayloadClient({    
            initOptions: {
                express: app,
                onInit: async cms => cms.logger.info(`ADMIN URL ${cms.getAdminURL()}`)
            }
        })

        app.use((req, res) => nextHandler(req, res)) 

        nextApp.prepare().then(() => {
            payload.logger.info(`Next.js Started!`)
            app.listen(PORT, async () => {
                payload.logger.info(`Next.js App URL: ${process.env.NODE_PUBLIC_SERVER_URL}`)
            })
        }) 

    } catch (_) {
        console.error("[SERVER_start_function]", _)
    } 
}

start()