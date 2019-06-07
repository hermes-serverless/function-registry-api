import { Sequelize, Model, DataTypes, ModelAttributes } from 'sequelize'
import { ModelInitializer } from './ModelInitizalizer'

export class HermesRunResult extends Model {
  public id!: number
  public runId!: number
  public outputPath!: string
  public endTime!: Date

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export class Initializer implements ModelInitializer {
  initAttributes(sequelize: Sequelize) {
    const HermesRunResultAttributes: ModelAttributes = {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
      },
      runId: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      outputPath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }

    HermesRunResult.init(HermesRunResultAttributes, {
      tableName: 'HermesRunResults',
      sequelize,
    })
  }

  initRelations = (models: any) => {
    HermesRunResult.belongsTo(models.HermesRun, { foreignKey: 'runId', targetKey: 'id' })
  }
}
