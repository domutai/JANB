// models/Review.js
//DEVELOPMENT

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {}

  Review.init(
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
      review: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
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
      modelName: 'Review',
      tableName: 'Reviews',
      //schema: 'public',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });

    Review.belongsTo(models.Spot, {
      foreignKey: 'spotId',
      as: 'spot',
      onDelete: 'CASCADE',
    });

    Review.hasMany(models.ReviewImage, {
      foreignKey: 'reviewId',
      as: 'reviewImages',
      onDelete: 'CASCADE',
    });
  };

  return Review;
};