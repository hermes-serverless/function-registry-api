import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable(
      'Functions',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        ownerId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        functionName: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        language: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        gpuCapable: {
          allowNull: false,
          type: DataTypes.BOOLEAN,
        },
        scope: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        imageName: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        functionVersion: {
          allowNull: false,
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
      },
      {
        uniqueKeys: {
          uniqueFunctionNamePerUser: {
            fields: ['ownerId', 'functionName', 'functionVersion'],
          },
        },
      }
    )
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('Functions')
  },
}
