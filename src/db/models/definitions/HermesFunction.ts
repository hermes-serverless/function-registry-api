import { HermesRun } from './HermesRun'
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

export class HermesFunction extends Model {
  public id!: number
  public ownerUserId!: number
  public functionName!: string
  public language!: string
  public gpuCapable!: boolean
  public scope!: string
  public imageUrl!: string
  public functionVersion!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getRun!: HasManyGetAssociationsMixin<HermesRun>
  public addRun!: HasManyAddAssociationMixin<HermesRun, number>
  public hasRun!: HasManyHasAssociationMixin<HermesRun, number>
  public countRuns!: HasManyCountAssociationsMixin
  public createRun!: HasManyCreateAssociationMixin<HermesRun>
  public readonly runs?: HermesRun[]

  public static associations: {
    runs: Association<HermesFunction, HermesRun>
  }
}

export class Initializer implements ModelInitializer {
  initAttributes(sequelize: Sequelize) {
    const HermesFunctionAttributes: ModelAttributes = {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
      },
      functionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gpuCapable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      scope: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      functionVersion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }

    HermesFunction.init(HermesFunctionAttributes, {
      tableName: 'HermesFunctions',
      sequelize,
    })
  }

  initRelations = (models: any) => {
    HermesFunction.belongsTo(models.User, { foreignKey: 'ownerUserId', targetKey: 'id' })
    HermesFunction.hasMany(models.HermesRun)
  }
}
