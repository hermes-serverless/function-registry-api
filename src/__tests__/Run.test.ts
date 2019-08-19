import { db, HermesFunction, User } from '../db'
import { getFunctions } from '../routes/user/functionHandlers'
import { RunCreatorHandler } from '../routes/user/runHandlers'
import { clearDatabase } from './utils'

let user: User
let fn: HermesFunction

beforeAll(async () => {
  user = await db.User.create({
    username: 'username-run',
    password: '123',
  })

  await user.createFunction({
    functionName: 'function-name',
    functionVersion: '1.0.0',
    language: 'cpp',
    gpuCapable: false,
    scope: 'public',
    imageName: 'some-docker-image',
  })

  fn = (await getFunctions(user, { functionName: 'function-name' }))[0]
})

beforeEach(async () => {
  await db.Run.destroy({ where: {} })
})

afterAll(async () => {
  await clearDatabase()
})

describe('RunCreatorHandler', () => {
  test('Created Run has all data expected on RunData type', async () => {
    const ops = new RunCreatorHandler([])
    const run = await ops.create(user, fn, { startTime: new Date(), status: 'running' })
    expect(run.id).toBeDefined()
    expect(run.function).toBeDefined()
    expect(run.function.functionName).toBe('function-name')
    expect(run.function.functionVersion).toBe('1.0.0')
    expect(run.function.language).toBe('cpp')
    expect(run.function.gpuCapable).toBe(false)
    expect(run.function.scope).toBe('public')
    expect(run.function.imageName).toBe('some-docker-image')
    expect(run.function.owner).toBeDefined()
    expect(run.function.owner.username).toBe('username-run')
  })
})
