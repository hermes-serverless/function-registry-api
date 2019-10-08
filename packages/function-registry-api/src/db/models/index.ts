import { Sequelize } from 'sequelize'
import { Logger } from '../../utils/Logger'
import { HermesModels, modelInitializers, models } from './definitions'
import { ModelInitializer } from './definitions/ModelInitizalizer'

type NodeEnv = 'development' | 'test' | 'production'

const sequelizeConfig: any = require('../config/config.js')

interface Database extends HermesModels {
  sequelize: Sequelize
  Sequelize: any
}

const env = (process.env.NODE_ENV as NodeEnv) || 'development'
const config = sequelizeConfig[env]

Logger.info(`[Sequelize] Environment: ${env}`)

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  logging: () => {},
})

modelInitializers.forEach((initializer: ModelInitializer) => {
  initializer.initAttributes(sequelize)
})

modelInitializers.forEach((initializer: ModelInitializer) => {
  initializer.initRelations(models)
})

const db: Database = {
  sequelize,
  Sequelize,
  ...models,
}

export { HermesFunction, Run, User } from './definitions'
export { db }
