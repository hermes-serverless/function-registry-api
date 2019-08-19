import { db } from '../db'
import { registerUser } from '../routes/auth/handlers'
import { AllFunctionsOps, getFunctions } from '../routes/user/functionHandlers'
import { getUser } from '../routes/user/utils'
import { clearDatabase } from './utils'

beforeEach(async () => {
  await clearDatabase()
})

afterEach(async () => {
  await clearDatabase()
})

test('Create works', async () => {
  await registerUser({ username: 'username', password: '123' })
  const ops = new AllFunctionsOps([], await getUser('username'))
  await expect(
    ops.create({
      functionName: 'fn',
      language: 'cpp',
      gpuCapable: false,
      scope: 'public',
      imageName: 'some-docker-image',
      functionVersion: '1.0.0',
    })
  ).resolves.toBeTruthy()
})

test('getFunctions', async () => {
  const user = await db.User.create({ username: 'function-username', password: '123' })
  await user.createFunction({
    functionName: 'fn',
    language: 'cpp',
    gpuCapable: false,
    scope: 'public',
    imageName: 'some-docker-image',
    functionVersion: '1.0.0',
  })

  const fn: any = await getFunctions(user, { functionName: 'fn' })
  expect(fn.length).toBe(1)
  expect(fn[0].owner).toBeDefined()
  expect(fn[0].owner.username).toBe('function-username')
  expect(fn[0].functionName).toBe('fn')
  expect(fn[0].language).toBe('cpp')
})
