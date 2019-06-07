import { Logger } from './../utils/Logger'
import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios'

const userRouter = Router()
userRouter.post('/', async (req, res, next) => {
  try {
    const data = await axios.post('http://rest_server/users', req.body)
    res.status(data.status).send(data.statusText)
  } catch (err) {
    next(err)
  }
})

userRouter.post('/', async (req, res, next) => {
  try {
    const data = await axios.delete('http://rest_server/users', req.body)
    res.status(data.status).send(data.statusText)
  } catch (err) {
    next(err)
  }
})

userRouter.use((err: any, req: Request, res: Response, next: NextFunction) => {
  Logger.error('Error on user route', err)
  res.status(500).send('Something bad happened :(')
})

export { userRouter }
