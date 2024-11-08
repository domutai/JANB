const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ReviewImage extends Model {}

  ReviewImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Reviews',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ReviewImage',
      tableName: 'ReviewImages',
      schema: 'public',
      timestamps: false,
    }
  );

  ReviewImage.associate = (models) => {
    ReviewImage.belongsTo(models.Review, {
      foreignKey: 'reviewId',
      as: 'review',
      onDelete: 'CASCADE',
    });
  };

  return ReviewImage;
};