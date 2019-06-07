import { Logger } from './../utils/Logger'
import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios'

const functionRouter = Router()

functionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await axios.post('http://rest_server/functions', req.body)
    res.status(data.status).send(data.statusText)
  } catch (err) {
    next(err)
  }
})

functionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await axios.delete('http://rest_server/users', req.body)
    res.status(data.status).send(data.statusText)
  } catch (err) {
    next(err)
  }
})

functionRouter.use((err: any, req: Request, res: Response, next: NextFunction) => {
  Logger.error('Error on functions route', err)
  res.status(500).send('Something bad happened :(')
})

export { functionRouter }
