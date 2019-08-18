import { QueryInterface } from 'sequelize'
import { db } from '../db'
import { hashPassword } from './../routes/auth/handlers'
import seedFunctions, { FunctionSeed } from './samples/functions'
import seedRuns, { RunSeed } from './samples/runs'
import seedUsers, { UserSeed } from './samples/users'

const registerUser = ({ username, password }: UserSeed, queryInterface: QueryInterface) => {
  return queryInterface.insert(new db.User(), 'Users', {
    username,
    password: hashPassword(password),
  })
}

const registerFunction = async ({ owner, data }: FunctionSeed, queryInterface: QueryInterface) => {
  const ownerUser = await db.User.findOne({
    where: {
      username: owner,
    },
  })

  await queryInterface.insert(new db.HermesFunction(), 'Functions', {
    ownerId: ownerUser.id,
    ...data,
  })
}

const registerRun = async ({ username, functionData, data }: RunSeed, queryInterface: QueryInterface) => {
  const { functionOwner, functionName, functionVersion } = functionData

  const user = await db.User.findOne({ where: { username } })
  const owner = await db.User.findOne({ where: { username: functionOwner } })
  const fn = await db.HermesFunction.findOne({
    where: {
      functionName,
      functionVersion,
      ownerId: owner.id,
    },
  })

  await queryInterface.insert(new db.Run(), 'Runs', {
    userId: user.id,
    functionId: fn.id,
    ...data,
  })
}

export default {
  up: async (queryInterface: QueryInterface) => {
    await Promise.all(seedUsers.map(user => registerUser(user, queryInterface)))
    await Promise.all(seedFunctions.map(fn => registerFunction(fn, queryInterface)))
    await Promise.all(seedRuns.map(run => registerRun(run, queryInterface)))
    const r = await db.User.findAll()
    r.forEach(res => {
      console.log(res.toJSON())
    })
    return
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
