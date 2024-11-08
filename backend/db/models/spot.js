const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'owner',
        onDelete: 'CASCADE',
      });
    }
  }

  Spot.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id', 
        },
        onDelete: 'CASCADE',
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      avgRating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      previewImage: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'Spot',
      tableName: 'Spots', 
      schema: 'public',
      timestamps: true, 
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

 Spot.associate = (models) => {
    Spot.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner',
      onDelete: 'CASCADE',
    });

    Spot.hasMany(models.Review, {
      foreignKey: 'spotId',
      as: 'reviews',
    });

    Spot.hasMany(models.SpotImage, {
      foreignKey: 'spotId',
      as: 'images',
    });
    
    Spot.hasMany(models.Booking, {
      foreignKey: 'spotId',
      as: 'bookings',
    });
  };

  return Spot;
};
 