import { DataTypes, Model, ModelAttributes, Sequelize } from 'sequelize'
import { ModelInitializer } from './ModelInitizalizer'

export class Run extends Model {
  public id!: number
  public functionId!: number
  public userId!: number
  public startTime!: Date
  public status!: string
  public endTime: Date
  public outputPath: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export class Initializer implements ModelInitializer {
  initAttributes(sequelize: Sequelize) {
    const runAttributes: ModelAttributes = {
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
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      watcherId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }

    Run.init(runAttributes, {
      sequelize,
      tableName: 'Runs',
    })
  }

  initRelations = (models: any) => {
    Run.belongsTo(models.HermesFunction, {
      foreignKey: {
        name: 'functionId',
        allowNull: false,
      },
      targetKey: 'id',
      as: 'function',
    })

    Run.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      targetKey: 'id',
    })
  }
}
