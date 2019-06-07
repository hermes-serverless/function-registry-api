import { HermesRun } from './HermesRun'
import { HermesFunction } from './HermesFunction'
import { Sequelize, Model, DataTypes, ModelAttributes } from 'sequelize'
import {
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Association,
} from '../../../../node_modules/sequelize/types/lib/associations'
import { ModelInitializer } from './ModelInitizalizer'

export class User extends Model {
  public id!: number
  public username!: string
  public password!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getFunction!: HasManyGetAssociationsMixin<HermesFunction>
  public addFunction!: HasManyAddAssociationMixin<HermesFunction, number>
  public hasFunction!: HasManyHasAssociationMixin<HermesFunction, number>
  public countFunctions!: HasManyCountAssociationsMixin
  public createFunction!: HasManyCreateAssociationMixin<HermesFunction>
  public readonly functions?: HermesFunction[]

  public getRun!: HasManyGetAssociationsMixin<HermesRun>
  public addRun!: HasManyAddAssociationMixin<HermesRun, number>
  public hasRun!: HasManyHasAssociationMixin<HermesRun, number>
  public countRuns!: HasManyCountAssociationsMixin
  public createRun!: HasManyCreateAssociationMixin<HermesRun>
  public readonly runs?: HermesRun[]

  public static associations: {
    functions: Association<User, HermesFunction>
    runs: Association<User, HermesRun>
  }
}

export class Initializer implements ModelInitializer {
  initAttributes(sequelize: Sequelize) {
    const UserAttributes: ModelAttributes = {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }

    User.init(UserAttributes, {
      tableName: 'Users',
      sequelize,
    })
  }

  initRelations = (models: any) => {
    User.hasMany(models.HermesFunction)
    User.hasMany(models.HermesRun)
  }
}
