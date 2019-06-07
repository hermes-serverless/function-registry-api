import { QueryInterface, DataTypes } from 'sequelize'

export default {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('HermesFunctions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      ownerUserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      functionName: {
        type: DataTypes.STRING,
        unique: true,
      },
      language: {
        type: DataTypes.STRING,
      },
      gpuCapable: {
        type: DataTypes.BOOLEAN,
      },
      scope: {
        type: DataTypes.STRING,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      functionVersion: {
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
    return queryInterface.dropTable('HermesFunctions')
  },
}
