import { Sequelize } from 'sequelize'
import { Logger } from '../../utils/Logger'
import sequelizeConfig from '../config/config.json'
import { HermesModels, modelInitializers, models } from './definitions'
import { ModelInitializer } from './definitions/ModelInitizalizer'

type NodeEnv = 'development' | 'test' | 'production'

interface Database extends HermesModels {
  sequelize: Sequelize
  Sequelize: any
}

const env = (process.env.NODE_ENV as NodeEnv) || 'development'
const config = sequelizeConfig[env]

Logger.info(`[Sequelize] Environment: ${env}`)

// @ts-ignore
const sequelize = new Sequelize(config.database, config.username, config.password, config)

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
