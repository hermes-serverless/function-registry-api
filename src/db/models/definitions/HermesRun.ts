import { Sequelize, Model, DataTypes, ModelAttributes } from 'sequelize'
import { ModelInitializer } from './ModelInitizalizer'

export class HermesRun extends Model {
  public id!: number
  public functionId!: number
  public userId!: number
  public startTime!: Date
  public status!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export class Initializer implements ModelInitializer {
  initAttributes(sequelize: Sequelize) {
    const HermesRunAttributes: ModelAttributes = {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
      },
      functionId: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }

    HermesRun.init(HermesRunAttributes, {
      tableName: 'HermesRuns',
      sequelize,
    })
  }

  initRelations = (models: any) => {
    HermesRun.belongsTo(models.HermesFunction, { foreignKey: 'functionId', targetKey: 'id' })
    HermesRun.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' })
    HermesRun.hasOne(models.HermesRunResult)
  }
}
