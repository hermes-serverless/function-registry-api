import { Sequelize } from 'sequelize'

export interface ModelInitializerConstructor {
  new (): ModelInitializer
}

export abstract class ModelInitializer {
  abstract initAttributes(sequelize: Sequelize): void
  initRelations(models: any) {
    console.log('No relations to init')
  }
}
