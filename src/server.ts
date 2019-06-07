import { LoginData, registerUser } from './routes/auth'
import express from 'express'
import morgan from 'morgan'
import { authRouter } from './routes'

const server = express()

server.use(express.json())
server.use(morgan('dev'))

server.use('/auth', authRouter)

server.use('/', (_, res) => {
  res.status(404).send('Not found')
})

const PORT = process.env.PORT || 8080

const createUser = (username: string, password: string): LoginData => {
  return {
    username,
    password,
  }
}

const users = [createUser('tiago', '123'), createUser('nassau', '123')]

users.map(data => {
  registerUser(data)
})

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
