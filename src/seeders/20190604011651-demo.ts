import seedFunctions, { FunctionData, FunctionSeed } from './samples/hermesFunctions'
import seedUsers, { UserSeed } from './samples/users'
import { hashPassword } from './../routes/auth'
import { QueryInterface } from 'sequelize'
import { db } from '../db'

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
  return queryInterface.insert(new db.HermesFunction(), 'HermesFunctions', {
    ownerUserId: ownerUser.id,
    ...data,
  })
}

export default {
  up: async (queryInterface: QueryInterface) => {
    await Promise.all(seedUsers.map(user => registerUser(user, queryInterface)))
    await Promise.all(seedFunctions.map(f => registerFunction(f, queryInterface)))
    const r = await db.User.findAll()
    r.forEach(res => {
      console.log(res.toJSON())
    })
    return
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete('Users', null, {})
  },
}
