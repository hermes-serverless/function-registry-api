import { DataTypes, Model, ModelAttributes, Sequelize } from 'sequelize'
import {
  Association,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
} from '../../../../node_modules/sequelize/types/lib/associations'
import { HermesFunction } from './HermesFunction'
import { ModelInitializer } from './ModelInitizalizer'
import { Run } from './Run'

export class User extends Model {
  public id!: number
  public username!: string
  public password!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getFunctions!: HasManyGetAssociationsMixin<HermesFunction>
  public addFunctions!: HasManyAddAssociationMixin<HermesFunction, number>
  public hasFunction!: HasManyHasAssociationMixin<HermesFunction, number>
  public countFunctions!: HasManyCountAssociationsMixin
  public createFunction!: HasManyCreateAssociationMixin<HermesFunction>
  public readonly functions?: HermesFunction[]

  public getRuns!: HasManyGetAssociationsMixin<Run>
  public addRuns!: HasManyAddAssociationMixin<Run, number>
  public hasRun!: HasManyHasAssociationMixin<Run, number>
  public countRuns!: HasManyCountAssociationsMixin
  public createRun!: HasManyCreateAssociationMixin<Run>
  public readonly runs?: Run[]

  public static associations: {
    functions: Association<User, HermesFunction>
    runs: Association<User, Run>
  }
}

export class Initializer implements ModelInitializer {
  initAttributes(sequelize: Sequelize) {
    const userAttributes: ModelAttributes = {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: [/^[a-zA-Z0-9]*$/i],
            msg: 'Use only letters and numbers on username',
          },
          notEmpty: {
            msg: "Username can't be empty",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }

    User.init(userAttributes, {
      sequelize,
      tableName: 'Users',
    })
  }

  initRelations = (models: any) => {
    User.hasMany(models.HermesFunction, {
      as: {
        singular: 'function',
        plural: 'functions',
      },
      foreignKey: {
        name: 'ownerId',
        allowNull: false,
      },
    })

    User.hasMany(models.Run, {
      as: {
        singular: 'run',
        plural: 'runs',
      },
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
    })
  }
}
