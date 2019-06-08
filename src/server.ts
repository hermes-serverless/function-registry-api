import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import { authRouter, userRouter } from './routes'
import { Logger } from './utils/Logger'

const server = express()

server.use(express.json())
server.use(morgan('dev'))

server.use('/auth', authRouter)
server.use('/user', userRouter)

server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.getStatusCode) err.getStatusCode = () => 500
  if (!err.getMessage) err.getMessage = () => err.message
  if (!err.getErrorName) err.getErrorName = () => 'InternalServerError'
  Logger.error(`Error ${err.constructor.name}`, err)
  res.status(err.getStatusCode()).send({
    error: err.getErrorName(),
    msg: err.getMessage(),
  })
})

server.use('/', (_, res) => {
  res.status(404).send({
    error: 'PageNotFound',
    msg: 'Page not found',
  })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
