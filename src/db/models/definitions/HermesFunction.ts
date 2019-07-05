import { DataTypes, Model, ModelAttributes, Sequelize } from 'sequelize'
import {
  Association,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
} from '../../../../node_modules/sequelize/types/lib/associations'
import { ModelInitializer } from './ModelInitizalizer'
import { Run } from './Run'

export class HermesFunction extends Model {
  public id!: number
  public ownerId!: number
  public functionName!: string
  public functionVersion!: string
  public language!: string
  public gpuCapable!: boolean
  public scope!: string
  public imageName!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getRuns!: HasManyGetAssociationsMixin<Run>
  public addRuns!: HasManyAddAssociationMixin<Run, number>
  public hasRun!: HasManyHasAssociationMixin<Run, number>
  public countRuns!: HasManyCountAssociationsMixin
  public createRun!: HasManyCreateAssociationMixin<Run>
  public readonly runs?: Run[]

  public static associations: {
    runs: Association<HermesFunction, Run>
  }
}

const supportedLangs = ['cpp', 'cuda']
const validScopes = ['public']

export class Initializer implements ModelInitializer {
  initAttributes(sequelize: Sequelize) {
    const hermesFunctionAttributes: ModelAttributes = {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
      },
      ownerId: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      functionName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: [/^[a-z0-9_-]*$/],
            msg: 'Use only lowercase letters, numbers, underlines and hyphens on function name',
          },
          notEmpty: {
            msg: "Function name can't be empty",
          },
        },
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [supportedLangs],
            msg: `Language can be: ${supportedLangs}`,
          },
        },
      },
      gpuCapable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      scope: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [validScopes],
            msg: `Scope can be: ${validScopes}`,
          },
        },
      },
      imageName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      functionVersion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: [/^[0-9]+\.[0-9]+\.[0-9]+$/i],
            msg: 'Use the format major.minor.patch for function version',
          },
        },
      },
    }

    HermesFunction.init(hermesFunctionAttributes, {
      sequelize,
      tableName: 'Functions',
    })
  }

  initRelations = (models: any) => {
    HermesFunction.belongsTo(models.User, {
      foreignKey: {
        name: 'ownerId',
        allowNull: false,
      },
      targetKey: 'id',
      as: 'owner',
    })

    HermesFunction.hasMany(models.Run, {
      as: {
        singular: 'run',
        plural: 'runs',
      },
      foreignKey: {
        name: 'functionId',
        allowNull: false,
      },
    })
  }
}
