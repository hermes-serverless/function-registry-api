import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import { authRouter, userRouter } from './routes'
import { Logger } from './utils/Logger'

export const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.use('/auth', authRouter)
app.use('/user', userRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.getStatusCode) err.getStatusCode = () => 500
  if (!err.getResponseObject) {
    err.getResponseObject = () => {
      return { error: 'InternalServerError', message: 'Something broke in the server' }
    }
  }
  Logger.error(`Error ${err.constructor.name}`, err)
  res.status(err.getStatusCode()).send(err.getResponseObject())
})

app.use('/', (_, res) => {
  res.status(404).send({
    error: 'PageNotFound',
    message: 'Page not found',
  })
})

export const startServer = () => {
  const PORT = process.env.PORT || 8080

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
  })
}
