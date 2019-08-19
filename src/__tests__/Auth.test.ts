import { login, registerUser } from '../routes/auth/handlers'
import { NoSuchUser } from '../routes/errors/RouteError'
import { clearDatabase } from './utils'

beforeEach(async () => {
  await clearDatabase()
})

afterEach(async () => {
  await clearDatabase()
})

describe('registerUser', () => {
  test('Register works', async () => {
    const token = await registerUser({ username: 'username', password: '123' })
    expect(typeof token).toBe('string')
  })
})

describe('usernameExists', () => {})

describe('login', () => {
  test('Login works', async () => {
    await registerUser({ username: 'username', password: '123' })
    const token = await login({ username: 'username', password: '123' })
    expect(typeof token).toBe('string')
  })

  test(`Throws when user doesn't exist`, async () => {
    await expect(login({ username: 'username', password: '123' })).rejects.toThrow(NoSuchUser)
  })

  test(`Returns empty token if password is incorrect`, async () => {
    await registerUser({ username: 'username', password: '123' })
    const token = await login({ username: 'username', password: '12' })
    expect(token).toBe('')
  })
})
