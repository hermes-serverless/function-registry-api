import { QueryInterface, DataTypes } from 'sequelize'

export default {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('HermesRunResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      runId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'HermesRuns',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      outputPath: {
        type: DataTypes.STRING,
      },
      endTime: {
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    })
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('HermesRunResults')
  },
}
