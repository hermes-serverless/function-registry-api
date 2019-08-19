import { db } from '../db'

export const clearDatabase = () => {
  return Promise.all([
    db.HermesFunction.destroy({ where: {} }),
    db.Run.destroy({ where: {} }),
    db.User.destroy({ where: {} }),
  ])
}
