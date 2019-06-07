import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import { authRouter } from './routes'
import { Logger } from './utils/Logger'

const server = express()

server.use(express.json())
server.use(morgan('dev'))

server.use('/auth', authRouter)

server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.getStatusCode) err.getStatusCode = () => 500
  if (!err.getMessage) err.getMessage = () => err.message
  Logger.error(`Error ${err.constructor.name} `, err)
  res.status(err.getStatusCode()).send(err.getMessage())
})

server.use('/', (_, res) => {
  res.status(404).send('Not found')
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
