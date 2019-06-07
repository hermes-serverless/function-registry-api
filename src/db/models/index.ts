import { Sequelize } from 'sequelize'
import sequelizeConfig from '../config/config.json'
import { models, modelInitializers, HermesModels } from './definitions'
import { ModelInitializer } from './definitions/ModelInitizalizer'

type NodeEnv = 'development' | 'test' | 'production'

interface Database extends HermesModels {
  sequelize: Sequelize
  Sequelize: any
}

const env = (process.env.NODE_ENV as NodeEnv) || 'development'
const config = sequelizeConfig[env]

// @ts-ignore
const sequelize = new Sequelize(config.database, config.username, config.password, config)

modelInitializers.forEach((initializer: ModelInitializer) => {
  initializer.initAttributes(sequelize)
})

modelInitializers.forEach((initializer: ModelInitializer) => {
  initializer.initRelations(models)
})

const db: Database = {
  ...models,
  sequelize: sequelize,
  Sequelize: Sequelize,
}

export { db }
