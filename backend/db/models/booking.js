//DEVELOPMENT

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Booking extends Model {}

  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'Bookings',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });

    Booking.belongsTo(models.Spot, {
      foreignKey: 'spotId',
      as: 'spot',
      onDelete: 'CASCADE',
    });
  };

  return Booking;
};