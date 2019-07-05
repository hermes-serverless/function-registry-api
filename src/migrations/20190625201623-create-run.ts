import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('Runs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      functionId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Functions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      startTime: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      endTime: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      watcherId: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    })
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('Runs')
  },
}
