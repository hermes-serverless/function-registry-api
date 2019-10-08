import R from 'ramda'
import request from 'supertest'
import { randomBytes } from 'crypto'
import { mockSequelizePort, startupPostgresContainer, stopPostgresContainer } from '../utils'
import {
  FunctionData,
  FunctionPostObj,
  FunctionGetObj,
  FunctionPutObj,
} from '@hermes-serverless/api-types-function-registry-api/function'
import { RunPostObj } from '@hermes-serverless/api-types-function-registry-api/run'

const PG_PORT = 23000
const PG_NAME = `api-run-test${randomBytes(8).toString('hex')}`
mockSequelizePort(PG_PORT)

import { app } from '../../app'
import { db } from '../../db'

beforeAll(async () => {
  await startupPostgresContainer(PG_NAME, PG_PORT)
}, 10000)

afterAll(async () => {
  await db.sequelize.close()
  await stopPostgresContainer(PG_NAME)
}, 10000)

const createUser = async () => {
  const data = { username: `username${randomBytes(8).toString('hex')}`, password: '123' }
  const res = await request(app)
    .post('/auth/register')
    .send(data)
  return { data, res }
}

const createFunction = async (username: string) => {
  const data = {
    functionName: `fn${randomBytes(8).toString('hex')}`,
    functionVersion: '1.0.0',
    imageName: 'some-docker-image',
    language: 'cpp',
    scope: 'public',
    gpuCapable: false,
  }
  const res = await request(app)
    .post(`/user/${username}/function`)
    .send(data)
  return { data, res }
}

const createRun = async (username: string, fnOwner: string, fnName: string, fnVersion: string) => {
  const data = { status: 'running' }
  const res = await request(app)
    .post(`/user/${username}/function-runs/${fnOwner}/${fnName}/${fnVersion}`)
    .send(data)
  return { res, data }
}

const checkUserFieldOnRes = (body: any) => {
  // @ts-ignore
  expect(R.keys(body.user).length).toBe(4)
  // @ts-ignore
  expect(R.keys(body.user)).toEqual(expect.arrayContaining(['id', 'username', 'createdAt', 'updatedAt']))
}

const checkFunctionData = (fn: FunctionData) => {
  expect(R.keys(fn).length).toBe(10)
  expect(R.keys(fn)).toEqual(
    expect.arrayContaining([
      'id',
      'ownerId',
      'functionName',
      'functionVersion',
      'gpuCapable',
      'scope',
      'imageName',
      'language',
      'createdAt',
      'updatedAt',
    ])
  )
}

const checkFunctionDataWithOwner = (fn: FunctionData, owner: string) => {
  expect(R.keys(fn).length).toBe(11)
  expect(R.keys(fn)).toEqual(
    expect.arrayContaining([
      'id',
      'ownerId',
      'functionName',
      'functionVersion',
      'gpuCapable',
      'scope',
      'imageName',
      'language',
      'createdAt',
      'updatedAt',
      'owner',
    ])
  )
  // @ts-ignore
  expect(R.keys(fn.owner).length).toBe(1)
  // @ts-ignore
  expect(R.keys(fn.owner)).toEqual(expect.arrayContaining(['username']))
  // @ts-ignore
  expect(fn.owner.username).toBe(owner)
}

describe('User', () => {
  test('Create user', async () => {
    const { res } = await createUser()
    expect(res.body.token.length).toBeGreaterThan(0)
    expect(res.body.auth).toBe(true)
  })

  test('Login', async () => {
    const { data } = await createUser()
    const res = await request(app)
      .post('/auth/login')
      .send(data)

    expect(res.body.token.length).toBeGreaterThan(0)
    expect(res.body.auth).toBe(true)
  })
})

describe('Function', () => {
  test('Create function', async () => {
    const { data: userData } = await createUser()
    const { data, res } = await createFunction(userData.username)
    const body = res.body as FunctionPostObj
    checkUserFieldOnRes(body)
    expect(body.newFunction.length).toBe(1)
    checkFunctionData(body.newFunction[0])
  })

  test('Get one function', async () => {
    const { data: userData } = await createUser()
    const { data: fnData } = await createFunction(userData.username)
    const res = await request(app).get(
      `/user/${userData.username}/function/${fnData.functionName}/${fnData.functionVersion}`
    )
    const body = res.body as FunctionGetObj
    checkUserFieldOnRes(body)
    expect(body.functions.length).toBe(1)
    checkFunctionDataWithOwner(body.functions[0], userData.username)
  })

  test('Get two functions', async () => {
    const { data: userData } = await createUser()
    const { data: fnData } = await createFunction(userData.username)
    await request(app)
      .post(`/user/${userData.username}/function`)
      .send({ ...fnData, functionVersion: '1.0.1' })
    const res = await request(app).get(`/user/${userData.username}/function/${fnData.functionName}`)
    const body = res.body as FunctionGetObj
    checkUserFieldOnRes(body)
    expect(body.functions.length).toBe(2)
    checkFunctionDataWithOwner(body.functions[0], userData.username)
    checkFunctionDataWithOwner(body.functions[1], userData.username)
  })

  test('Update one function', async () => {
    const { data: userData } = await createUser()
    const { data: fnData } = await createFunction(userData.username)
    const res = await request(app)
      .put(`/user/${userData.username}/function/${fnData.functionName}/${fnData.functionVersion}`)
      .send({ imageName: 'new-docker-image' })
    const body = res.body as FunctionPutObj
    checkUserFieldOnRes(body)
    expect(body.updatedFunctions.length).toBe(1)
    checkFunctionDataWithOwner(body.updatedFunctions[0], userData.username)
    expect(body.updatedFunctions[0].imageName).toBe('new-docker-image')
  })
})

describe('Run', () => {
  const checkRunFunctionData = (fn: any, owner: string) => {
    const keys = ['functionName', 'functionVersion', 'language', 'gpuCapable', 'scope', 'imageName', 'owner']
    expect(R.keys(fn).length).toBe(keys.length)
    expect(R.keys(fn)).toEqual(expect.arrayContaining(keys))
    expect(R.keys(fn.owner).length).toBe(1)
    expect(R.keys(fn.owner)).toEqual(expect.arrayContaining(['username']))
    expect(fn.owner.username).toBe(owner)
  }

  test('Create run', async () => {
    const { data: userData } = await createUser()
    const { data: fnData } = await createFunction(userData.username)
    const { res } = await createRun(userData.username, userData.username, fnData.functionName, fnData.functionVersion)
    const body = res.body as RunPostObj
    checkUserFieldOnRes(body)
    checkRunFunctionData(body.createdRun[0].function, userData.username)
  })
})
